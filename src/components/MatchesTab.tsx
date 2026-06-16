import { useMemo } from "react";
import type { Match, Player, Prediction, ScoreRules } from "../lib/types";
import { MatchCard } from "./MatchCard";
import { EmptyState } from "./ui";

const JORNADA_LABEL: Record<string, string> = {
  J1: "Jornada 1",
  J2: "Jornada 2",
  J3: "Jornada 3",
};

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
  // Agrupa por jornada respetando el orden de aparición (ya vienen por sort_order).
  const groups = useMemo(() => {
    const map = new Map<string, Match[]>();
    for (const m of matches) {
      const arr = map.get(m.jornada);
      if (arr) arr.push(m);
      else map.set(m.jornada, [m]);
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
      {groups.map(([jornada, list]) => (
        <section key={jornada}>
          <h2 className="sticky top-0 z-10 mb-3 bg-pitch-950/90 py-1 text-sm font-bold uppercase tracking-wide text-grass-400 backdrop-blur">
            {JORNADA_LABEL[jornada] ?? jornada}
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
