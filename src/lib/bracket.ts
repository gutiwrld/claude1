import type { Match } from "./types";
import type { TeamStanding } from "./groupTables";
import { rankedThirds } from "./groupTables";

export const TBD = { name: "Por definir", flag: "❓" } as const;

interface TeamRef {
  name: string;
  flag: string;
}

// Convención de sort_order para situar cada ronda y poder enlazar el árbol.
export const BASE = {
  R32: 1000,
  R16: 2000,
  QF: 3000,
  SF: 4000,
  TP: 4500, // tercer puesto
  F: 5000,
} as const;

export const ROUND_LABEL = {
  R32: "Dieciseisavos",
  R16: "Octavos",
  QF: "Cuartos",
  SF: "Semifinales",
  TP: "Tercer puesto",
  F: "Final",
} as const;

// Emparejamientos por defecto de dieciseisavos (16 partidos). Cada hueco apunta a
// 1º (W) / 2º (R) de un grupo, o a uno de los 8 mejores terceros (T, índice 0..7).
// Es un cuadro por defecto equilibrado; el admin puede ajustar equipos a mano.
type Slot = { k: "W" | "R"; g: string } | { k: "T"; i: number };

const R32_PAIRS: [Slot, Slot][] = [
  [{ k: "W", g: "A" }, { k: "R", g: "B" }],
  [{ k: "W", g: "C" }, { k: "R", g: "D" }],
  [{ k: "W", g: "E" }, { k: "R", g: "F" }],
  [{ k: "W", g: "G" }, { k: "R", g: "H" }],
  [{ k: "W", g: "I" }, { k: "R", g: "J" }],
  [{ k: "W", g: "K" }, { k: "R", g: "L" }],
  [{ k: "W", g: "B" }, { k: "T", i: 0 }],
  [{ k: "W", g: "D" }, { k: "T", i: 1 }],
  [{ k: "W", g: "F" }, { k: "T", i: 2 }],
  [{ k: "W", g: "H" }, { k: "T", i: 3 }],
  [{ k: "W", g: "J" }, { k: "T", i: 4 }],
  [{ k: "W", g: "L" }, { k: "T", i: 5 }],
  [{ k: "R", g: "A" }, { k: "T", i: 6 }],
  [{ k: "R", g: "C" }, { k: "T", i: 7 }],
  [{ k: "R", g: "E" }, { k: "R", g: "G" }],
  [{ k: "R", g: "I" }, { k: "R", g: "K" }],
];

export interface BracketSeed {
  pool_id: string;
  jornada: string;
  grp: null;
  knockout: true;
  home_name: string;
  home_flag: string;
  away_name: string;
  away_flag: string;
  locked: false;
  result_home: null;
  result_away: null;
  kickoff: null;
  sort_order: number;
}

function resolveSlot(slot: Slot, tables: Record<string, TeamStanding[]>, thirds: TeamStanding[]): TeamRef {
  if (slot.k === "T") {
    const t = thirds[slot.i];
    return t ? { name: t.team, flag: t.flag } : { ...TBD };
  }
  const rows = tables[slot.g];
  const row = rows?.[slot.k === "W" ? 0 : 1];
  // Solo damos el equipo por bueno si el grupo está jugado del todo.
  if (!row || row.played < 3) return { ...TBD };
  return { name: row.team, flag: row.flag };
}

function seed(poolId: string, round: keyof typeof BASE, idx: number, home: TeamRef, away: TeamRef): BracketSeed {
  return {
    pool_id: poolId,
    jornada: ROUND_LABEL[round],
    grp: null,
    knockout: true,
    home_name: home.name,
    home_flag: home.flag,
    away_name: away.name,
    away_flag: away.flag,
    locked: false,
    result_home: null,
    result_away: null,
    kickoff: null,
    sort_order: BASE[round] + idx,
  };
}

/**
 * Genera los 32 partidos del cuadro final: 16 dieciseisavos (con los equipos que
 * ya se conozcan según la clasificación) + rondas posteriores con "Por definir".
 */
export function buildBracketSeeds(poolId: string, tables: Record<string, TeamStanding[]>): BracketSeed[] {
  const thirds = rankedThirds(tables).slice(0, 8);
  const seeds: BracketSeed[] = [];

  R32_PAIRS.forEach(([h, a], i) => {
    seeds.push(seed(poolId, "R32", i, resolveSlot(h, tables, thirds), resolveSlot(a, tables, thirds)));
  });
  for (let i = 0; i < 8; i++) seeds.push(seed(poolId, "R16", i, { ...TBD }, { ...TBD }));
  for (let i = 0; i < 4; i++) seeds.push(seed(poolId, "QF", i, { ...TBD }, { ...TBD }));
  for (let i = 0; i < 2; i++) seeds.push(seed(poolId, "SF", i, { ...TBD }, { ...TBD }));
  seeds.push(seed(poolId, "TP", 0, { ...TBD }, { ...TBD }));
  seeds.push(seed(poolId, "F", 0, { ...TBD }, { ...TBD }));
  return seeds;
}

function winner(m: Match | undefined): TeamRef | null {
  if (!m || m.result_home === null || m.result_away === null) return null;
  if (m.result_home === m.result_away) return null; // sin desempate registrado
  return m.result_home > m.result_away
    ? { name: m.home_name, flag: m.home_flag }
    : { name: m.away_name, flag: m.away_flag };
}

function loser(m: Match | undefined): TeamRef | null {
  if (!m || m.result_home === null || m.result_away === null) return null;
  if (m.result_home === m.result_away) return null;
  return m.result_home > m.result_away
    ? { name: m.away_name, flag: m.away_flag }
    : { name: m.home_name, flag: m.home_flag };
}

export interface AdvanceUpdate {
  id: string;
  home_name: string;
  home_flag: string;
  away_name: string;
  away_flag: string;
}

/**
 * Recalcula los equipos de cada ronda a partir de ganadores/perdedores de la
 * ronda anterior. Devuelve solo los partidos cuyos equipos hay que actualizar.
 */
export function resolveAdvancers(
  matches: Match[],
  tables?: Record<string, TeamStanding[]>
): AdvanceUpdate[] {
  const byOrder = new Map<number, Match>();
  for (const m of matches) if (m.knockout) byOrder.set(m.sort_order, m);

  const updates: AdvanceUpdate[] = [];

  const consider = (target: Match | undefined, home: TeamRef | null, away: TeamRef | null) => {
    if (!target) return;
    // Nunca tocamos un partido que ya tiene resultado.
    if (target.result_home !== null && target.result_away !== null) return;
    const nextHome = home ?? { ...TBD };
    const nextAway = away ?? { ...TBD };
    if (
      target.home_name !== nextHome.name ||
      target.away_name !== nextAway.name ||
      target.home_flag !== nextHome.flag ||
      target.away_flag !== nextAway.flag
    ) {
      updates.push({
        id: target.id,
        home_name: nextHome.name,
        home_flag: nextHome.flag,
        away_name: nextAway.name,
        away_flag: nextAway.flag,
      });
    }
  };

  // Dieciseisavos: rellena los equipos desde la clasificación de grupos (si se aporta).
  if (tables) {
    const thirds = rankedThirds(tables).slice(0, 8);
    R32_PAIRS.forEach(([h, a], i) => {
      consider(byOrder.get(BASE.R32 + i), resolveSlot(h, tables, thirds), resolveSlot(a, tables, thirds));
    });
  }

  // R16 <- R32, QF <- R16, SF <- QF
  const chain: [keyof typeof BASE, keyof typeof BASE, number][] = [
    ["R16", "R32", 8],
    ["QF", "R16", 4],
    ["SF", "QF", 2],
  ];
  for (const [round, prev, count] of chain) {
    for (let i = 0; i < count; i++) {
      const target = byOrder.get(BASE[round] + i);
      const h = winner(byOrder.get(BASE[prev] + 2 * i));
      const a = winner(byOrder.get(BASE[prev] + 2 * i + 1));
      consider(target, h, a);
    }
  }

  // Final: ganadores de semis; Tercer puesto: perdedores de semis.
  const sf0 = byOrder.get(BASE.SF + 0);
  const sf1 = byOrder.get(BASE.SF + 1);
  consider(byOrder.get(BASE.F), winner(sf0), winner(sf1));
  consider(byOrder.get(BASE.TP), loser(sf0), loser(sf1));

  return updates;
}
