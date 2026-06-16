import { GROUPS } from "../data/teams";
import type { Match } from "./types";

export interface TeamStanding {
  team: string;
  flag: string;
  group: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
}

function blankStanding(team: string, flag: string, group: string): TeamStanding {
  return { team, flag, group, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
}

function sortStandings(a: TeamStanding, b: TeamStanding): number {
  return (
    b.pts - a.pts ||
    b.gd - a.gd ||
    b.gf - a.gf ||
    a.team.localeCompare(b.team, "es")
  );
}

/**
 * Clasificación de cada grupo a partir de los resultados de la fase de grupos.
 * Criterios: puntos, diferencia de goles, goles a favor, nombre (sin head-to-head).
 */
export function computeGroupTables(matches: Match[]): Record<string, TeamStanding[]> {
  const tables: Record<string, TeamStanding[]> = {};
  const byName: Record<string, Map<string, TeamStanding>> = {};

  for (const [grp, teams] of Object.entries(GROUPS)) {
    const map = new Map<string, TeamStanding>();
    for (const [name, flag] of teams) map.set(name, blankStanding(name, flag, grp));
    byName[grp] = map;
  }

  for (const m of matches) {
    if (m.knockout || !m.grp) continue;
    if (m.result_home === null || m.result_away === null) continue;
    const map = byName[m.grp];
    const home = map?.get(m.home_name);
    const away = map?.get(m.away_name);
    if (!home || !away) continue;

    home.played++; away.played++;
    home.gf += m.result_home; home.ga += m.result_away;
    away.gf += m.result_away; away.ga += m.result_home;
    if (m.result_home > m.result_away) {
      home.won++; home.pts += 3; away.lost++;
    } else if (m.result_home < m.result_away) {
      away.won++; away.pts += 3; home.lost++;
    } else {
      home.drawn++; away.drawn++; home.pts++; away.pts++;
    }
  }

  for (const grp of Object.keys(GROUPS)) {
    const rows = Array.from(byName[grp].values());
    for (const r of rows) r.gd = r.gf - r.ga;
    rows.sort(sortStandings);
    tables[grp] = rows;
  }
  return tables;
}

/** True si los 6 partidos del grupo ya tienen resultado (grupo decidido). */
export function isGroupComplete(matches: Match[], group: string): boolean {
  const groupMatches = matches.filter((m) => !m.knockout && m.grp === group);
  return groupMatches.length === 6 && groupMatches.every((m) => m.result_home !== null && m.result_away !== null);
}

/** Los 12 terceros ordenados; los 8 primeros son los "mejores terceros" que clasifican. */
export function rankedThirds(tables: Record<string, TeamStanding[]>): TeamStanding[] {
  return Object.values(tables)
    .map((rows) => rows[2])
    .filter(Boolean)
    .sort(sortStandings);
}
