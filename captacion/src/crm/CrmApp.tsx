import { useState } from "react";
import { isUnlocked, lock, getWho, setWho } from "../lib/storage";
import { supabaseConfigured } from "../lib/supabase";
import { BRAND, TEAM } from "../data/constants";
import { useCrmData } from "./useCrmData";
import PinGate from "./PinGate";
import ConfigMissing from "./ConfigMissing";
import Dashboard from "./Dashboard";
import BusinessesTab from "./BusinessesTab";
import TasksTab from "./TasksTab";
import LeadsTab from "./LeadsTab";
import { Spinner } from "../components/ui";

type Tab = "panel" | "negocios" | "tareas" | "leads";

export default function CrmApp() {
  const [unlocked, setUnlocked] = useState(isUnlocked());
  const [who, setWhoState] = useState(getWho());
  const [tab, setTab] = useState<Tab>("panel");
  const data = useCrmData();

  if (!unlocked) return <PinGate onUnlock={() => setUnlocked(true)} />;

  const pendientes = data.tasks.filter((t) => !t.done).length;
  const leadsNuevos = data.leads.filter((l) => !l.processed).length;

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: "panel", label: "Resumen" },
    { id: "negocios", label: "Negocios" },
    { id: "tareas", label: "Tareas", badge: pendientes },
    { id: "leads", label: "Leads", badge: leadsNuevos },
  ];

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-5 py-3">
          <span className="font-display text-lg font-semibold">
            {BRAND}
            <span className="text-terracotta-500">.</span>
            <span className="ml-2 text-xs font-normal text-ink-400">panel</span>
          </span>

          <nav className="order-3 flex w-full gap-1 overflow-x-auto no-scrollbar sm:order-2 sm:w-auto">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                  tab === t.id ? "bg-ink text-paper" : "text-ink-600 hover:bg-sand"
                }`}
              >
                {t.label}
                {t.badge ? (
                  <span className="ml-1.5 rounded-full bg-terracotta-500 px-1.5 text-xs text-white">
                    {t.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>

          <div className="order-2 ml-auto flex items-center gap-2 sm:order-3">
            <select
              value={who}
              onChange={(e) => {
                setWho(e.target.value);
                setWhoState(e.target.value);
              }}
              className="rounded-full border border-line bg-white px-3 py-1.5 text-sm"
            >
              <option value="">¿Quién eres?</option>
              {TEAM.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <button
              onClick={() => {
                lock();
                setUnlocked(false);
              }}
              className="rounded-full p-2 text-ink-400 hover:bg-sand"
              title="Bloquear"
              aria-label="Bloquear panel"
            >
              🔒
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-6">
        {!supabaseConfigured ? (
          <ConfigMissing />
        ) : data.loading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : data.error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Error al cargar datos: {data.error}
          </div>
        ) : (
          <>
            {tab === "panel" && (
              <Dashboard businesses={data.businesses} tasks={data.tasks} leads={data.leads} />
            )}
            {tab === "negocios" && <BusinessesTab businesses={data.businesses} who={who} />}
            {tab === "tareas" && (
              <TasksTab tasks={data.tasks} businesses={data.businesses} who={who} />
            )}
            {tab === "leads" && <LeadsTab leads={data.leads} who={who} />}
          </>
        )}
      </main>
    </div>
  );
}
