// Tipos de dominio. Reflejan las tablas de supabase/schema.sql.

export type Status =
  | "nuevo"
  | "contactado"
  | "interesado"
  | "propuesta"
  | "cliente"
  | "descartado";

export type Priority = "alta" | "media" | "baja";

export type Source = "prospeccion" | "web" | "referido";

export type InteractionKind =
  | "llamada"
  | "email"
  | "whatsapp"
  | "reunion"
  | "nota";

export interface Business {
  id: string;
  name: string;
  sector: string | null;
  province: string | null;
  city: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  has_website: boolean;
  instagram: string | null;
  contact_person: string | null;
  status: Status;
  priority: Priority;
  source: Source;
  owner: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Interaction {
  id: string;
  business_id: string;
  kind: InteractionKind;
  body: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  business_id: string | null;
  due_date: string | null;
  done: boolean;
  priority: Priority;
  assigned_to: string | null;
  created_at: string;
}

export interface Lead {
  id: string;
  name: string;
  business_name: string | null;
  email: string | null;
  phone: string | null;
  sector: string | null;
  message: string | null;
  processed: boolean;
  created_at: string;
}
