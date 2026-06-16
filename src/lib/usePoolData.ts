import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "./supabase";
import type { Match, Player, Pool, Prediction } from "./types";

export interface PoolData {
  pool: Pool | null;
  players: Player[];
  matches: Match[];
  predictions: Prediction[];
  loading: boolean;
  error: string | null;
  notFound: boolean;
  reload: () => Promise<void>;
}

export function usePoolData(poolId: string | null): PoolData {
  const [pool, setPool] = useState<Pool | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState<boolean>(!!poolId);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Evita setState tras desmontar.
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const reload = useCallback(async () => {
    if (!poolId) return;
    setLoading(true);
    setError(null);
    try {
      const [poolRes, playersRes, matchesRes, predsRes] = await Promise.all([
        supabase.from("pools").select("*").eq("id", poolId).maybeSingle(),
        supabase.from("players").select("*").eq("pool_id", poolId),
        supabase.from("matches").select("*").eq("pool_id", poolId).order("sort_order", { ascending: true }),
        supabase.from("predictions").select("*").eq("pool_id", poolId),
      ]);

      if (poolRes.error) throw poolRes.error;
      if (playersRes.error) throw playersRes.error;
      if (matchesRes.error) throw matchesRes.error;
      if (predsRes.error) throw predsRes.error;

      if (!alive.current) return;

      if (!poolRes.data) {
        setNotFound(true);
        setPool(null);
        return;
      }

      setNotFound(false);
      setPool(poolRes.data as Pool);
      setPlayers((playersRes.data ?? []) as Player[]);
      setMatches((matchesRes.data ?? []) as Match[]);
      setPredictions((predsRes.data ?? []) as Prediction[]);
    } catch (e) {
      if (alive.current) setError(e instanceof Error ? e.message : "Error cargando los datos");
    } finally {
      if (alive.current) setLoading(false);
    }
  }, [poolId]);

  // Carga inicial.
  useEffect(() => {
    if (!poolId) {
      setLoading(false);
      return;
    }
    void reload();
  }, [poolId, reload]);

  // Realtime: matches y predictions filtrados por pool_id. Players cambia poco,
  // pero lo refrescamos cuando llegan nuevos jugadores vía recarga puntual.
  useEffect(() => {
    if (!poolId) return;

    const applyMatch = (row: Match) =>
      setMatches((prev) => {
        const idx = prev.findIndex((m) => m.id === row.id);
        if (idx === -1) return [...prev, row].sort((a, b) => a.sort_order - b.sort_order);
        const next = prev.slice();
        next[idx] = row;
        return next;
      });

    const applyPred = (row: Prediction) =>
      setPredictions((prev) => {
        const idx = prev.findIndex((p) => p.id === row.id);
        if (idx === -1) return [...prev, row];
        const next = prev.slice();
        next[idx] = row;
        return next;
      });

    const channel = supabase
      .channel(`pool:${poolId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "matches", filter: `pool_id=eq.${poolId}` },
        (payload) => {
          if (payload.eventType === "DELETE") {
            const old = payload.old as { id: string };
            setMatches((prev) => prev.filter((m) => m.id !== old.id));
          } else {
            applyMatch(payload.new as Match);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "predictions", filter: `pool_id=eq.${poolId}` },
        (payload) => {
          if (payload.eventType === "DELETE") {
            const old = payload.old as { id: string };
            setPredictions((prev) => prev.filter((p) => p.id !== old.id));
          } else {
            applyPred(payload.new as Prediction);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players", filter: `pool_id=eq.${poolId}` },
        (payload) => {
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            const row = payload.new as Player;
            setPlayers((prev) => (prev.some((p) => p.id === row.id) ? prev : [...prev, row]));
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [poolId]);

  return { pool, players, matches, predictions, loading, error, notFound, reload };
}
