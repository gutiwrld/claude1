import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** True si están configuradas las variables de entorno de Supabase. */
export const supabaseConfigured = Boolean(url && anonKey);

if (!supabaseConfigured) {
  console.warn(
    "[Captación] Falta VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. " +
      "Copia .env.example a .env y rellénalas (ver README)."
  );
}

// Creamos el cliente aunque falten claves para no romper los imports;
// las llamadas fallarían, pero la UI bloquea esas rutas con supabaseConfigured.
export const supabase = createClient(
  url ?? "http://localhost",
  anonKey ?? "public-anon-key",
  { realtime: { params: { eventsPerSecond: 5 } } }
);
