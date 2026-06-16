import { scoreFor, isExact } from "./score";
import type { Match, Player, Prediction, ScoreRules } from "./types";

export interface StandingRow {
  player: Player;
  points: number;
  exacts: number;
  played: number; // partidos con resultado en los que el jugador pronosticó
}

/**
 * Calcula la clasificación: puntos desc, desempate por nº de exactos, luego nombre.
 */
export function computeStandings(
  players: Player[],
  matches: Match[],
  predictions: Prediction[],
  rules: ScoreRules
): StandingRow[] {
  // Índice de pronósticos por (player, match).
  const predIndex = new Map<string, Prediction>();
  for (const p of predictions) predIndex.set(`${p.player_id}:${p.match_id}`, p);

  const finished = matches.filter(
    (m) => m.result_home !== null && m.result_away !== null
  );

  const rows: StandingRow[] = players.map((player) => {
    let points = 0;
    let exacts = 0;
    let played = 0;

    for (const m of finished) {
      const pred = predIndex.get(`${player.id}:${m.id}`);
      if (!pred) continue;
      const result = { home: m.result_home as number, away: m.result_away as number };
      const pts = scoreFor({ home: pred.home, away: pred.away }, result, rules);
      if (pts === null) continue;
      points += pts;
      played += 1;
      if (isExact({ home: pred.home, away: pred.away }, result)) exacts += 1;
    }

    return { player, points, exacts, played };
  });

  rows.sort(
    (a, b) =>
      b.points - a.points ||
      b.exacts - a.exacts ||
      a.player.name.localeCompare(b.player.name, "es")
  );

  return rows;
}
