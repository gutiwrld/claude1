import { FLAG_BY_NAME } from "../data/teams";
import { SCHEDULE } from "../data/schedule";

// Fila de partido lista para insertar (Supabase rellena id/created_at).
export interface MatchSeed {
  pool_id: string;
  jornada: string;
  grp: string;
  knockout: boolean;
  home_name: string;
  home_flag: string;
  away_name: string;
  away_flag: string;
  locked: boolean;
  result_home: null;
  result_away: null;
  kickoff: string | null;
  sort_order: number;
}

/**
 * Orden de los partidos: primero por fecha de inicio (kickoff) ascendente;
 * los que aún no tienen fecha van al final; empate por sort_order.
 */
export function compareMatches(
  a: { kickoff: string | null; sort_order: number },
  b: { kickoff: string | null; sort_order: number }
): number {
  if (a.kickoff && b.kickoff) {
    const diff = new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime();
    if (diff !== 0) return diff;
  } else if (a.kickoff && !b.kickoff) {
    return -1;
  } else if (!a.kickoff && b.kickoff) {
    return 1;
  }
  return a.sort_order - b.sort_order;
}

/**
 * Genera los 72 partidos de la fase de grupos a partir del calendario OFICIAL
 * del Mundial 2026 (emparejamientos, local/visitante, fecha y hora reales).
 * El sort_order sigue el orden cronológico del calendario.
 */
export function buildGroupMatches(poolId: string): MatchSeed[] {
  return SCHEDULE.map((m, i) => ({
    pool_id: poolId,
    jornada: m.jornada,
    grp: m.group,
    knockout: false,
    home_name: m.home,
    home_flag: FLAG_BY_NAME[m.home] ?? "🏳️",
    away_name: m.away,
    away_flag: FLAG_BY_NAME[m.away] ?? "🏳️",
    locked: false,
    result_home: null,
    result_away: null,
    kickoff: m.kickoff,
    sort_order: i,
  }));
}
