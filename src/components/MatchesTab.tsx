import { useMemo } from "react";
import type { Match, Player, Prediction, ScoreRules } from "../lib/types";
import { dayKey, dayLabel } from "../lib/dates";
import { MatchCard } from "./MatchCard";
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
  // Agrupa por día de calendario respetando el orden (ya vienen ordenados por fecha).
  // Los partidos sin fecha van a un bloque final "Sin fecha".
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

  return (
    <div className="space-y-8 pb-8">
      {groups.map(([key, list]) => (
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
  );
}
