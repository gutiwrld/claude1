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

// Fecha base de cada jornada de grupos (Mundial 2026, mes 5 = junio).
// Dos grupos comparten día; cada jornada ocupa 6 días.
const JORNADA_BASE: Record<string, [number, number, number]> = {
  J1: [2026, 5, 11],
  J2: [2026, 5, 18],
  J3: [2026, 5, 24],
};

/**
 * Fecha/hora por defecto de un partido de grupos, para no tener que editar a mano.
 * grpIndex 0..11 (dos grupos por día); slot 0 -> 18:00, slot 1 -> 21:00 (hora local).
 * Devuelve ISO, o null si la jornada no es de grupos.
 */
export function defaultKickoff(grpIndex: number, jornada: string, slot: number): string | null {
  const base = JORNADA_BASE[jornada];
  if (!base) return null;
  const [y, m, d] = base;
  const day = d + Math.floor(grpIndex / 2);
  const hour = slot === 0 ? 18 : 21;
  return new Date(y, m, day, hour, 0, 0).toISOString();
}

/**
 * Asigna fechas por defecto a los partidos de grupos que aún no tengan fecha.
 * Devuelve solo los cambios { id, kickoff } (no toca eliminatorias ni los ya datados).
 */
export function defaultScheduleUpdates(
  matches: { id: string; jornada: string; grp: string | null; knockout: boolean; kickoff: string | null; sort_order: number }[]
): { id: string; kickoff: string }[] {
  const groupKeys = Object.keys(GROUPS);
  const buckets = new Map<string, typeof matches>();
  for (const m of matches) {
    if (m.knockout || !m.grp || m.kickoff) continue;
    const key = `${m.jornada}:${m.grp}`;
    const arr = buckets.get(key);
    if (arr) arr.push(m);
    else buckets.set(key, [m]);
  }

  const out: { id: string; kickoff: string }[] = [];
  for (const [key, ms] of buckets) {
    const [jornada, grp] = key.split(":");
    const gi = groupKeys.indexOf(grp);
    ms.sort((a, b) => a.sort_order - b.sort_order);
    ms.forEach((m, slot) => {
      const k = defaultKickoff(gi, jornada, slot);
      if (k) out.push({ id: m.id, kickoff: k });
    });
  }
  return out;
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

  const groupKeys = Object.keys(GROUPS);
  for (const jornada of ["J1", "J2", "J3"] as const) {
    groupKeys.forEach((grp, grpIndex) => {
      const teams = GROUPS[grp];
      ROUNDS[jornada].forEach(([h, a], slot) => {
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
          kickoff: defaultKickoff(grpIndex, jornada, slot),
          sort_order: order++,
        });
      });
    });
  }

  return seeds;
}
