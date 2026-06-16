// Netlify Function: sincroniza resultados reales del Mundial 2026 en Supabase.
//
// Proveedor por defecto: football-data.org (plan gratuito cubre el Mundial).
// Se ejecuta sola cada 15 min (ver `config.schedule`) y también se puede
// invocar a mano: GET /.netlify/functions/sync-results
//
// Variables de entorno necesarias (Netlify → Site configuration → Environment variables):
//   SUPABASE_URL            = misma URL del proyecto Supabase
//   SUPABASE_ANON_KEY       = anon key (las políticas RLS son abiertas, basta con la anon)
//   FOOTBALL_DATA_TOKEN     = token de football-data.org (gratis tras registro)
//   FOOTBALL_DATA_COMPETITION (opcional) = código de competición, por defecto "WC"
//
// Nota: el cruce se hace por PAREJA de equipos (sin importar orden). Si el
// nombre que devuelve la API no está en el mapa de abajo, ese partido sale en
// "unmatched" en la respuesta para que amplíes el mapa.

// Acceso a Supabase por su API REST (PostgREST) con fetch: así la función no
// depende de @supabase/supabase-js ni de WebSocket nativo en el runtime.

// Nombre canónico (español, como en la BD) -> posibles nombres de la API.
const ALIASES: Record<string, string[]> = {
  "México": ["Mexico"],
  "Corea del Sur": ["South Korea", "Korea Republic", "Korea, South"],
  "Chequia": ["Czechia", "Czech Republic"],
  "Sudáfrica": ["South Africa"],
  "Suiza": ["Switzerland"],
  "Canadá": ["Canada"],
  "Catar": ["Qatar"],
  "Bosnia": ["Bosnia and Herzegovina", "Bosnia-Herzegovina", "Bosnia & Herzegovina"],
  "Escocia": ["Scotland"],
  "Brasil": ["Brazil"],
  "Marruecos": ["Morocco"],
  "Haití": ["Haiti"],
  "EE. UU.": ["United States", "USA", "United States of America"],
  "Australia": ["Australia"],
  "Turquía": ["Turkey", "Türkiye", "Turkiye"],
  "Paraguay": ["Paraguay"],
  "Curazao": ["Curacao", "Curaçao"],
  "Ecuador": ["Ecuador"],
  "Alemania": ["Germany"],
  "Costa de Marfil": ["Ivory Coast", "Cote d'Ivoire", "Côte d'Ivoire"],
  "Japón": ["Japan"],
  "Países Bajos": ["Netherlands", "Holland"],
  "Suecia": ["Sweden"],
  "Túnez": ["Tunisia"],
  "Bélgica": ["Belgium"],
  "Egipto": ["Egypt"],
  "Irán": ["Iran", "IR Iran"],
  "Nueva Zelanda": ["New Zealand"],
  "Cabo Verde": ["Cape Verde", "Cabo Verde", "Cape Verde Islands"],
  "Arabia Saudí": ["Saudi Arabia"],
  "España": ["Spain"],
  "Uruguay": ["Uruguay"],
  "Francia": ["France"],
  "Irak": ["Iraq"],
  "Noruega": ["Norway"],
  "Senegal": ["Senegal"],
  "Argelia": ["Algeria"],
  "Argentina": ["Argentina"],
  "Austria": ["Austria"],
  "Jordania": ["Jordan"],
  "Colombia": ["Colombia"],
  "RD Congo": ["DR Congo", "Congo DR", "Democratic Republic of Congo"],
  "Portugal": ["Portugal"],
  "Uzbekistán": ["Uzbekistan"],
  "Croacia": ["Croatia"],
  "Inglaterra": ["England"],
  "Ghana": ["Ghana"],
  "Panamá": ["Panama"],
};

function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z ]/g, "")
    .trim();
}

// nombre API normalizado -> nombre canónico español.
const API_TO_ES = new Map<string, string>();
for (const [es, names] of Object.entries(ALIASES)) {
  API_TO_ES.set(normalize(es), es);
  for (const n of names) API_TO_ES.set(normalize(n), es);
}

function toEs(apiName: string): string | null {
  return API_TO_ES.get(normalize(apiName)) ?? null;
}

const pairKey = (a: string, b: string) => [a, b].sort().join(" :: ");

interface DbMatch {
  id: string;
  home_name: string;
  away_name: string;
  result_home: number | null;
  result_away: number | null;
}

async function sync() {
  // Reutiliza las variables del frontend (VITE_*) si no se definen las propias.
  const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;
  const TOKEN = process.env.FOOTBALL_DATA_TOKEN;
  const COMP = process.env.FOOTBALL_DATA_COMPETITION ?? "WC";

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !TOKEN) {
    return { ok: false, reason: "Faltan variables de entorno. Necesitas al menos FOOTBALL_DATA_TOKEN (y SUPABASE_URL/ANON_KEY o sus equivalentes VITE_*)." };
  }

  // 1) Partidos terminados desde la API.
  const res = await fetch(`https://api.football-data.org/v4/competitions/${COMP}/matches?status=FINISHED`, {
    headers: { "X-Auth-Token": TOKEN },
  });
  if (!res.ok) {
    return { ok: false, reason: `football-data.org respondió ${res.status}`, body: await res.text() };
  }
  const data = (await res.json()) as {
    matches?: { homeTeam?: { name?: string }; awayTeam?: { name?: string }; score?: { fullTime?: { home?: number; away?: number } } }[];
  };
  const apiMatches = data.matches ?? [];

  const sbHeaders = { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` };

  // 2) Partidos de Supabase aún sin resultado, indexados por pareja de equipos.
  const selUrl = `${SUPABASE_URL}/rest/v1/matches?result_home=is.null&select=id,home_name,away_name,result_home,result_away`;
  const selRes = await fetch(selUrl, { headers: sbHeaders });
  if (!selRes.ok) {
    return { ok: false, reason: `Supabase respondió ${selRes.status}`, body: await selRes.text() };
  }
  const dbRows = (await selRes.json()) as DbMatch[];

  const byPair = new Map<string, DbMatch[]>();
  for (const m of dbRows) {
    const k = pairKey(m.home_name, m.away_name);
    (byPair.get(k) ?? byPair.set(k, []).get(k)!).push(m);
  }

  // 3) Para cada partido terminado, localiza la(s) fila(s) y actualiza el marcador.
  let updated = 0;
  const unmatched: string[] = [];
  const updates: Promise<unknown>[] = [];

  for (const am of apiMatches) {
    const apiHome = am.homeTeam?.name ?? "";
    const apiAway = am.awayTeam?.name ?? "";
    const ftH = am.score?.fullTime?.home;
    const ftA = am.score?.fullTime?.away;
    if (ftH == null || ftA == null) continue;

    const esHome = toEs(apiHome);
    const esAway = toEs(apiAway);
    if (!esHome || !esAway) {
      unmatched.push(`API sin mapear: ${apiHome} vs ${apiAway}`);
      continue;
    }

    const candidates = byPair.get(pairKey(esHome, esAway));
    if (!candidates || candidates.length === 0) {
      unmatched.push(`Sin fila en BD: ${esHome} vs ${esAway}`);
      continue;
    }

    for (const row of candidates) {
      // Ajusta el marcador a la orientación local/visitante de NUESTRA fila.
      const home = row.home_name === esHome ? ftH : ftA;
      const away = row.home_name === esHome ? ftA : ftH;
      updates.push(
        fetch(`${SUPABASE_URL}/rest/v1/matches?id=eq.${row.id}`, {
          method: "PATCH",
          headers: { ...sbHeaders, "Content-Type": "application/json", Prefer: "return=minimal" },
          body: JSON.stringify({ result_home: home, result_away: away, locked: true }),
        })
      );
      updated++;
    }
  }

  await Promise.all(updates);
  return { ok: true, apiFinished: apiMatches.length, updated, unmatched };
}

export default async (_req: Request): Promise<Response> => {
  try {
    const result = await sync();
    return new Response(JSON.stringify(result, null, 2), {
      status: result.ok ? 200 : 500,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
};

// Se ejecuta automáticamente cada 15 minutos.
export const config = { schedule: "*/15 * * * *" };
