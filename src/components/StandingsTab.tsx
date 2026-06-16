import { useMemo } from "react";
import { computeStandings } from "../lib/standings";
import type { Match, Player, Prediction, ScoreRules } from "../lib/types";
import { EmptyState } from "./ui";

export function StandingsTab({
  players,
  matches,
  predictions,
  rules,
  playerId,
}: {
  players: Player[];
  matches: Match[];
  predictions: Prediction[];
  rules: ScoreRules;
  playerId: string;
}) {
  const rows = useMemo(
    () => computeStandings(players, matches, predictions, rules),
    [players, matches, predictions, rules]
  );

  if (players.length === 0) {
    return <EmptyState title="Sin jugadores" hint="Comparte el enlace para que se unan." />;
  }

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="pb-8">
      <div className="overflow-hidden rounded-2xl border border-pitch-700">
        <table className="w-full text-sm">
          <thead className="bg-pitch-800 text-xs uppercase tracking-wide text-chalk/50">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">#</th>
              <th className="px-3 py-2 text-left font-semibold">Jugador</th>
              <th className="px-3 py-2 text-right font-semibold">Exactos</th>
              <th className="px-3 py-2 text-right font-semibold">Puntos</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const isMe = row.player.id === playerId;
              return (
                <tr
                  key={row.player.id}
                  className={`border-t border-pitch-700 ${isMe ? "bg-grass-600/15" : i % 2 ? "bg-pitch-900/40" : ""}`}
                >
                  <td className="px-3 py-2.5 text-chalk/60">{medals[i] ?? i + 1}</td>
                  <td className="px-3 py-2.5 font-medium">
                    {row.player.name}
                    {isMe && <span className="ml-2 rounded bg-grass-500/20 px-1.5 py-0.5 text-[10px] font-bold text-grass-300">TÚ</span>}
                  </td>
                  <td className="tnum px-3 py-2.5 text-right text-chalk/70">{row.exacts}</td>
                  <td className="tnum px-3 py-2.5 text-right text-lg font-black text-flare">{row.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 px-1 text-xs text-chalk/40">
        Orden: puntos, luego nº de marcadores exactos, luego nombre. {rules.exact} pts por marcador exacto · {rules.outcome} pt
        por acertar el resultado.
      </p>
    </div>
  );
}
