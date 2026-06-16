// Extrae un mensaje legible de cualquier error, incluidos los de Supabase
// (PostgrestError es un objeto plano con message/details/hint/code, NO un Error).
export function errMsg(e: unknown): string {
  if (e == null) return "Error desconocido";
  if (typeof e === "string") return e;
  if (typeof e === "object") {
    const o = e as Record<string, unknown>;
    const parts = [o.message, o.details, o.hint, o.code ? `(${String(o.code)})` : null]
      .filter((p): p is string => typeof p === "string" && p.length > 0);
    if (parts.length) return parts.join(" · ");
  }
  if (e instanceof Error) return e.message;
  return "Error desconocido";
}
