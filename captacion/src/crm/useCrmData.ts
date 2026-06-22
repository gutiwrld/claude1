import { useCallback, useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase";
import type { Business, Task, Lead } from "../lib/types";

export interface CrmData {
  businesses: Business[];
  tasks: Task[];
  leads: Lead[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

/** Carga negocios, tareas y leads, y se suscribe a cambios en tiempo real. */
export function useCrmData(): CrmData {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!supabaseConfigured) {
      setLoading(false);
      return;
    }
    setError(null);
    const [b, t, l] = await Promise.all([
      supabase.from("businesses").select("*").order("updated_at", { ascending: false }),
      supabase.from("tasks").select("*").order("due_date", { ascending: true, nullsFirst: false }),
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
    ]);
    if (b.error || t.error || l.error) {
      setError(b.error?.message ?? t.error?.message ?? l.error?.message ?? "Error");
    } else {
      setBusinesses((b.data ?? []) as Business[]);
      setTasks((t.data ?? []) as Task[]);
      setLeads((l.data ?? []) as Lead[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void reload();
    if (!supabaseConfigured) return;

    const channel = supabase
      .channel("crm-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "businesses" }, () => void reload())
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, () => void reload())
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, () => void reload())
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [reload]);

  return { businesses, tasks, leads, loading, error, reload };
}
