// Pequeñas utilidades de formato.

export function fechaCorta(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function desde(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "ahora";
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `hace ${d} d`;
  return fechaCorta(iso);
}

/** ¿La fecha (YYYY-MM-DD) es hoy o anterior? */
export function esVencida(due: string | null): boolean {
  if (!due) return false;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return new Date(due + "T00:00:00") < hoy;
}
