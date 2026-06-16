import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { scoreFor } from "../lib/score";
import { timeLabel } from "../lib/dates";
import type { Match, Player, Prediction, ScoreRules } from "../lib/types";
import { Pill } from "./ui";
import { ScoreStepper } from "./ScoreStepper";

function TeamRow({ flag, name, align }: { flag: string; name: string; align: "left" | "right" }) {
  return (
    <div className={`flex min-w-0 items-center gap-2 ${align === "right" ? "flex-row-reverse text-right" : ""}`}>
      <span className="text-2xl leading-none" aria-hidden>{flag}</span>
      <span className="truncate text-sm font-semibold">{name}</span>
    </div>
  );
}

function PointsBadge({ pts }: { pts: number }) {
  const tone = pts >= 3 ? "bg-grass-500 text-pitch-950" : pts >= 1 ? "bg-flare/80 text-pitch-950" : "bg-pitch-600 text-chalk/70";
  return <span className={`rounded-md px-1.5 py-0.5 text-xs font-bold ${tone}`}>{pts > 0 ? `+${pts}` : "0"}</span>;
}

export function MatchCard({
  match,
  myPrediction,
  matchPredictions,
  players,
  rules,
  playerId,
  poolId,
}: {
  match: Match;
  myPrediction: Prediction | undefined;
  matchPredictions: Prediction[];
  players: Player[];
  rules: ScoreRules;
  playerId: string;
  poolId: string;
}) {
  const hasResult = match.result_home !== null && match.result_away !== null;
  const editable = !match.locked && !hasResult;

  const [home, setHome] = useState(myPrediction?.home ?? 0);
  const [away, setAway] = useState(myPrediction?.away ?? 0);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sincroniza si el pronóstico cambia desde fuera (otra pestaña) y no estamos editando.
  useEffect(() => {
    setHome(myPrediction?.home ?? 0);
    setAway(myPrediction?.away ?? 0);
  }, [myPrediction?.home, myPrediction?.away]);

  useEffect(() => {
    return () => {
      if (savedTimer.current) clearTimeout(savedTimer.current);
    };
  }, []);

  async function save(nextHome: number, nextAway: number) {
    setHome(nextHome);
    setAway(nextAway);
    setSaveState("saving");
    try {
      const { error } = await supabase
        .from("predictions")
        .upsert(
          {
            pool_id: poolId,
            player_id: playerId,
            match_id: match.id,
            home: nextHome,
            away: nextAway,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "player_id,match_id" }
        );
      if (error) throw error;
      setSaveState("saved");
      if (savedTimer.current) clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => setSaveState("idle"), 1500);
    } catch {
      setSaveState("error");
    }
  }

  const result = hasResult ? { home: match.result_home as number, away: match.result_away as number } : null;
  const myPts = scoreFor(myPrediction ?? null, result, rules);

  const predByPlayer = new Map(matchPredictions.map((p) => [p.player_id, p]));

  return (
    <article className="rounded-2xl border border-pitch-700 bg-pitch-900/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-chalk/50">
          {match.grp ? `Grupo ${match.grp} · ${match.jornada}` : match.jornada}
          {match.kickoff && <span className="ml-2 text-flare">{timeLabel(match.kickoff)}</span>}
        </span>
        {hasResult ? <Pill tone="final">Final</Pill> : match.locked ? <Pill tone="closed">Cerrado</Pill> : <Pill tone="open">Abierto</Pill>}
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TeamRow flag={match.home_flag} name={match.home_name} align="left" />

        {hasResult ? (
          <div className="flex flex-col items-center">
            <div className="tnum font-score text-3xl font-black text-grass-400">
              {match.result_home}-{match.result_away}
            </div>
            <span className="text-[10px] uppercase tracking-wide text-chalk/40">resultado</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <ScoreStepper value={home} onChange={(v) => save(v, away)} disabled={!editable} ariaLabel={`goles ${match.home_name}`} />
            <span className="text-chalk/40">·</span>
            <ScoreStepper value={away} onChange={(v) => save(home, v)} disabled={!editable} ariaLabel={`goles ${match.away_name}`} />
          </div>
        )}

        <TeamRow flag={match.away_flag} name={match.away_name} align="right" />
      </div>

      {/* Pie: estado del guardado o resumen de tu pronóstico/puntos */}
      <div className="mt-3 flex min-h-[1.25rem] items-center justify-between text-xs">
        {hasResult ? (
          <span className="text-chalk/60">
            Tu pronóstico:{" "}
            {myPrediction ? (
              <span className="tnum font-semibold text-chalk">
                {myPrediction.home}-{myPrediction.away}
              </span>
            ) : (
              <span className="text-chalk/40">sin pronóstico</span>
            )}
          </span>
        ) : editable ? (
          <span className="text-chalk/50">
            {saveState === "saving" && "Guardando…"}
            {saveState === "saved" && <span className="text-grass-400">Guardado ✓</span>}
            {saveState === "error" && <span className="text-red-300">Error al guardar</span>}
            {saveState === "idle" && "Toca +/− para tu pronóstico"}
          </span>
        ) : (
          <span className="text-chalk/40">Pronóstico bloqueado</span>
        )}
        {hasResult && myPts !== null && <PointsBadge pts={myPts} />}
      </div>

      {/* Ver porras de todos: visible siempre para que todos vean los pronósticos */}
      <details className="mt-3 border-t border-pitch-700 pt-2">
        <summary className="cursor-pointer list-none text-xs font-semibold text-grass-400">Ver porras ▾</summary>
        <ul className="mt-2 space-y-1">
          {players.map((p) => {
            const pred = predByPlayer.get(p.id);
            const pts = scoreFor(pred ?? null, result, rules);
            return (
              <li key={p.id} className="flex items-center justify-between text-xs">
                <span className="text-chalk/80">{p.name}</span>
                <span className="flex items-center gap-2">
                  <span className="tnum text-chalk/60">{pred ? `${pred.home}-${pred.away}` : "—"}</span>
                  {pts !== null && <PointsBadge pts={pts} />}
                </span>
              </li>
            );
          })}
        </ul>
      </details>
    </article>
  );
}
