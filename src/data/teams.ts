// 12 grupos oficiales del sorteo del Mundial 2026 (48 equipos).
export const GROUPS: Record<string, [string, string][]> = {
  A: [["México","🇲🇽"],["Corea del Sur","🇰🇷"],["Chequia","🇨🇿"],["Sudáfrica","🇿🇦"]],
  B: [["Suiza","🇨🇭"],["Canadá","🇨🇦"],["Catar","🇶🇦"],["Bosnia","🇧🇦"]],
  C: [["Escocia","🏴󠁧󠁢󠁳󠁣󠁴󠁿"],["Brasil","🇧🇷"],["Marruecos","🇲🇦"],["Haití","🇭🇹"]],
  D: [["EE. UU.","🇺🇸"],["Australia","🇦🇺"],["Turquía","🇹🇷"],["Paraguay","🇵🇾"]],
  E: [["Curazao","🇨🇼"],["Ecuador","🇪🇨"],["Alemania","🇩🇪"],["Costa de Marfil","🇨🇮"]],
  F: [["Japón","🇯🇵"],["Países Bajos","🇳🇱"],["Suecia","🇸🇪"],["Túnez","🇹🇳"]],
  G: [["Bélgica","🇧🇪"],["Egipto","🇪🇬"],["Irán","🇮🇷"],["Nueva Zelanda","🇳🇿"]],
  H: [["Cabo Verde","🇨🇻"],["Arabia Saudí","🇸🇦"],["España","🇪🇸"],["Uruguay","🇺🇾"]],
  I: [["Francia","🇫🇷"],["Irak","🇮🇶"],["Noruega","🇳🇴"],["Senegal","🇸🇳"]],
  J: [["Argelia","🇩🇿"],["Argentina","🇦🇷"],["Austria","🇦🇹"],["Jordania","🇯🇴"]],
  K: [["Colombia","🇨🇴"],["RD Congo","🇨🇩"],["Portugal","🇵🇹"],["Uzbekistán","🇺🇿"]],
  L: [["Croacia","🇭🇷"],["Inglaterra","🏴󠁧󠁢󠁥󠁮󠁧󠁿"],["Ghana","🇬🇭"],["Panamá","🇵🇦"]],
};

export interface Team {
  name: string;
  flag: string;
}

// Lista plana de los 48 equipos (para los selects de eliminatorias).
export const ALL_TEAMS: Team[] = Object.values(GROUPS)
  .flat()
  .map(([name, flag]) => ({ name, flag }))
  .sort((a, b) => a.name.localeCompare(b.name, "es"));

// Bandera por nombre de equipo (para construir partidos desde el calendario).
export const FLAG_BY_NAME: Record<string, string> = Object.fromEntries(
  Object.values(GROUPS).flat()
);
