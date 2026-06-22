import type { Status, Priority, Source, InteractionKind } from "../lib/types";

// Marca editable: cambia esto por el nombre real del estudio.
export const BRAND = "Estudio Local";
export const BRAND_TAGLINE = "Webs únicas para negocios locales";
export const CONTACT_EMAIL = "hola@estudiolocal.es";

// Equipo (para asignar negocios/tareas).
export const TEAM = ["Guz", "Luis"] as const;

export const STATUSES: { value: Status; label: string; color: string }[] = [
  { value: "nuevo", label: "Nuevo", color: "#7a7589" },
  { value: "contactado", label: "Contactado", color: "#2563eb" },
  { value: "interesado", label: "Interesado", color: "#d97706" },
  { value: "propuesta", label: "Propuesta", color: "#df6b3c" },
  { value: "cliente", label: "Cliente", color: "#1f6f5c" },
  { value: "descartado", label: "Descartado", color: "#b91c1c" },
];

// El pipeline visible en el tablero (sin "descartado", que se filtra aparte).
export const PIPELINE: Status[] = [
  "nuevo",
  "contactado",
  "interesado",
  "propuesta",
  "cliente",
];

export const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "alta", label: "Alta" },
  { value: "media", label: "Media" },
  { value: "baja", label: "Baja" },
];

export const SOURCES: { value: Source; label: string }[] = [
  { value: "prospeccion", label: "Prospección" },
  { value: "web", label: "Web" },
  { value: "referido", label: "Referido" },
];

export const INTERACTION_KINDS: { value: InteractionKind; label: string; icon: string }[] = [
  { value: "llamada", label: "Llamada", icon: "📞" },
  { value: "email", label: "Email", icon: "✉️" },
  { value: "whatsapp", label: "WhatsApp", icon: "💬" },
  { value: "reunion", label: "Reunión", icon: "🤝" },
  { value: "nota", label: "Nota", icon: "📝" },
];

// Sectores típicos de negocio local en España.
export const SECTORS = [
  "Restaurante / Bar",
  "Cafetería",
  "Peluquería / Estética",
  "Taller mecánico",
  "Tienda de ropa",
  "Inmobiliaria",
  "Clínica / Fisioterapia",
  "Gimnasio",
  "Abogados / Gestoría",
  "Hotel / Casa rural",
  "Reformas / Construcción",
  "Floristería",
  "Panadería / Pastelería",
  "Otro",
];

// Provincias de España.
export const PROVINCES = [
  "A Coruña", "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila",
  "Badajoz", "Barcelona", "Burgos", "Cáceres", "Cádiz", "Cantabria", "Castellón",
  "Ciudad Real", "Córdoba", "Cuenca", "Girona", "Granada", "Guadalajara",
  "Gipuzkoa", "Huelva", "Huesca", "Illes Balears", "Jaén", "León", "Lleida",
  "Lugo", "Madrid", "Málaga", "Murcia", "Navarra", "Ourense", "Palencia",
  "Las Palmas", "Pontevedra", "La Rioja", "Salamanca", "Santa Cruz de Tenerife",
  "Segovia", "Sevilla", "Soria", "Tarragona", "Teruel", "Toledo", "Valencia",
  "Valladolid", "Bizkaia", "Zamora", "Zaragoza", "Ceuta", "Melilla",
];

export function statusMeta(status: string) {
  return STATUSES.find((s) => s.value === status) ?? STATUSES[0];
}
