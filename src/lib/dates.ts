// Utilidades de fecha para agrupar y mostrar partidos por calendario (es-ES).

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/** Clave de día en hora local: 'YYYY-MM-DD'. Sirve para agrupar. */
export function dayKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function todayKey(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const dateFmt = new Intl.DateTimeFormat("es-ES", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

const timeFmt = new Intl.DateTimeFormat("es-ES", {
  hour: "2-digit",
  minute: "2-digit",
});

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Etiqueta amigable del día: 'Hoy', 'Mañana', 'Ayer' o 'Viernes, 19 de junio'. */
export function dayLabel(iso: string): string {
  const key = dayKey(iso);
  if (key === todayKey(0)) return "Hoy";
  if (key === todayKey(1)) return "Mañana";
  if (key === todayKey(-1)) return "Ayer";
  return capitalize(dateFmt.format(new Date(iso)));
}

/** Hora local 'HH:MM'. */
export function timeLabel(iso: string): string {
  return timeFmt.format(new Date(iso));
}

/** ISO -> valor para <input type="datetime-local"> en hora local. */
export function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Valor de <input type="datetime-local"> -> ISO (o null si vacío). */
export function fromLocalInput(value: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}
