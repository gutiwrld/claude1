import { useEffect, useMemo, useRef, useState } from "react";
import type { Match, Player, Prediction, ScoreRules } from "../lib/types";
import { dayKey, dayLabel, shortDayLabel, nowDayKey } from "../lib/dates";
import { MatchCard } from "./MatchCard";
import { CalendarStrip } from "./CalendarStrip";
import type { CalendarDay } from "./CalendarStrip";
import { EmptyState } from "./ui";

const UNDATED = "__sin_fecha__";

export function MatchesTab({
  matches,
  predictions,
  players,
  rules,
  playerId,
  poolId,
}: {
  matches: Match[];
  predictions: Prediction[];
  players: Player[];
  rules: ScoreRules;
  playerId: string;
  poolId: string;
}) {
  // Agrupa por día de calendario (ya vienen ordenados por fecha); sin fecha al final.
  const groups = useMemo(() => {
    const map = new Map<string, Match[]>();
    for (const m of matches) {
      const key = m.kickoff ? dayKey(m.kickoff) : UNDATED;
      const arr = map.get(key);
      if (arr) arr.push(m);
      else map.set(key, [m]);
    }
    return Array.from(map.entries());
  }, [matches]);

  const days: CalendarDay[] = useMemo(() => {
    const today = nowDayKey();
    return groups
      .filter(([key]) => key !== UNDATED)
      .map(([key, list]) => ({
        key,
        short: shortDayLabel(list[0].kickoff as string),
        count: list.length,
        isToday: key === today,
      }));
  }, [groups]);

  const hasUndated = groups.some(([key]) => key === UNDATED);

  const [selected, setSelected] = useState<string>("all");
  const defaultApplied = useRef(false);

  // Refresco periódico para que el cierre automático al empezar el partido
  // se refleje sin tener que recargar la página.
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  // Selección por defecto: hoy si hay partidos, si no el próximo día con partidos.
  useEffect(() => {
    if (defaultApplied.current || days.length === 0) return;
    defaultApplied.current = true;
    const today = nowDayKey();
    const todayDay = days.find((d) => d.key === today);
    const upcoming = days.find((d) => d.key >= today);
    setSelected(todayDay?.key ?? upcoming?.key ?? "all");
  }, [days]);

  const myPreds = useMemo(() => {
    const map = new Map<string, Prediction>();
    for (const p of predictions) if (p.player_id === playerId) map.set(p.match_id, p);
    return map;
  }, [predictions, playerId]);

  const predsByMatch = useMemo(() => {
    const map = new Map<string, Prediction[]>();
    for (const p of predictions) {
      const arr = map.get(p.match_id);
      if (arr) arr.push(p);
      else map.set(p.match_id, [p]);
    }
    return map;
  }, [predictions]);

  if (matches.length === 0) {
    return <EmptyState title="No hay partidos todavía" hint="Si acabas de crear la porra, recarga en unos segundos." />;
  }

  const visibleGroups =
    selected === "all" ? groups : groups.filter(([key]) => key === selected);

  return (
    <div className="pb-8">
      <CalendarStrip
        days={days}
        hasUndated={hasUndated}
        totalCount={matches.length}
        selected={selected}
        onSelect={setSelected}
      />

      {visibleGroups.length === 0 ? (
        <EmptyState title="No hay partidos ese día" hint="Prueba con otro día o pulsa “Todos”." />
      ) : (
        <div className="space-y-8">
          {visibleGroups.map(([key, list]) => (
            <section key={key}>
              <h2 className="sticky top-0 z-10 mb-3 bg-pitch-950/90 py-1 text-sm font-bold uppercase tracking-wide text-grass-400 backdrop-blur">
                {key === UNDATED ? "Sin fecha · por programar" : dayLabel(list[0].kickoff as string)}
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {list.map((m) => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    myPrediction={myPreds.get(m.id)}
                    matchPredictions={predsByMatch.get(m.id) ?? []}
                    players={players}
                    rules={rules}
                    playerId={playerId}
                    poolId={poolId}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
