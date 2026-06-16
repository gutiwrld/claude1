import type { ScoreRules } from "./types";

export interface ScoreInput {
  home: number;
  away: number;
}

const sign = (x: number): number => (x > 0 ? 1 : x < 0 ? -1 : 0);

/**
 * Puntos de un pronóstico frente a un resultado.
 * - exact   si el marcador es idéntico
 * - outcome si acierta el signo (ganador o empate) pero no el marcador
 * - 0       si falla
 * - null    si falta el pronóstico o el resultado (no suma ni resta)
 */
export function scoreFor(
  pred: ScoreInput | null | undefined,
  result: ScoreInput | null | undefined,
  rules: ScoreRules
): number | null {
  if (!pred || !result) return null;
  if (pred.home === result.home && pred.away === result.away) return rules.exact;
  if (sign(pred.home - pred.away) === sign(result.home - result.away)) return rules.outcome;
  return 0;
}

export const isExact = (
  pred: ScoreInput | null | undefined,
  result: ScoreInput | null | undefined
): boolean => !!pred && !!result && pred.home === result.home && pred.away === result.away;
