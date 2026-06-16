import { GROUPS } from "../data/teams";

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
  kickoff: null;
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

// Round-robin estándar para 4 equipos [0,1,2,3].
const ROUNDS: Record<string, [number, number][]> = {
  J1: [
    [0, 1],
    [2, 3],
  ],
  J2: [
    [0, 2],
    [3, 1],
  ],
  J3: [
    [3, 0],
    [1, 2],
  ],
};

/**
 * Genera los 72 partidos de fase de grupos (12 grupos × 6).
 * sort_order respeta primero J1 de todos los grupos, luego J2, luego J3.
 */
export function buildGroupMatches(poolId: string): MatchSeed[] {
  const seeds: MatchSeed[] = [];
  let order = 0;

  for (const jornada of ["J1", "J2", "J3"] as const) {
    for (const grp of Object.keys(GROUPS)) {
      const teams = GROUPS[grp];
      for (const [h, a] of ROUNDS[jornada]) {
        const [homeName, homeFlag] = teams[h];
        const [awayName, awayFlag] = teams[a];
        seeds.push({
          pool_id: poolId,
          jornada,
          grp,
          knockout: false,
          home_name: homeName,
          home_flag: homeFlag,
          away_name: awayName,
          away_flag: awayFlag,
          locked: false,
          result_home: null,
          result_away: null,
          kickoff: null,
          sort_order: order++,
        });
      }
    }
  }

  return seeds;
}
