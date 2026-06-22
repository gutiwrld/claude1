import type { Business, Task, Lead } from "../lib/types";
import { PIPELINE, statusMeta } from "../data/constants";
import { esVencida, fechaCorta } from "../lib/format";
import { Badge } from "../components/ui";

export default function Dashboard({
  businesses,
  tasks,
  leads,
}: {
  businesses: Business[];
  tasks: Task[];
  leads: Lead[];
}) {
  const clientes = businesses.filter((b) => b.status === "cliente").length;
  const enPipeline = businesses.filter(
    (b) => b.status !== "cliente" && b.status !== "descartado"
  ).length;
  const leadsNuevos = leads.filter((l) => !l.processed).length;
  const pendientes = tasks.filter((t) => !t.done);
  const vencidas = pendientes.filter((t) => esVencida(t.due_date));

  const proximas = [...pendientes]
    .sort((a, b) => (a.due_date ?? "9999").localeCompare(b.due_date ?? "9999"))
    .slice(0, 6);

  const total = businesses.length || 1;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Negocios" value={businesses.length} hint="en la base de datos" />
        <Stat label="Clientes" value={clientes} hint="convertidos" accent="#1f6f5c" />
        <Stat label="En pipeline" value={enPipeline} hint="prospección activa" accent="#df6b3c" />
        <Stat
          label="Leads nuevos"
          value={leadsNuevos}
          hint="desde la web"
          accent={leadsNuevos > 0 ? "#2563eb" : undefined}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Embudo */}
        <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
          <h3 className="font-display text-lg font-semibold">Embudo de prospección</h3>
          <div className="mt-4 space-y-2.5">
            {PIPELINE.map((status) => {
              const meta = statusMeta(status);
              const n = businesses.filter((b) => b.status === status).length;
              const pct = Math.round((n / total) * 100);
              return (
                <div key={status}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{meta.label}</span>
                    <span className="text-ink-400">{n}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-sand">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: meta.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Próximas tareas */}
        <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Próximas tareas</h3>
            {vencidas.length > 0 && <Badge color="#b91c1c">{vencidas.length} vencidas</Badge>}
          </div>
          <ul className="mt-4 space-y-2">
            {proximas.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="truncate">{t.title}</span>
                <span className={`shrink-0 text-xs ${esVencida(t.due_date) ? "text-red-600" : "text-ink-400"}`}>
                  {t.due_date ? fechaCorta(t.due_date) : "sin fecha"}
                </span>
              </li>
            ))}
            {proximas.length === 0 && <li className="text-sm text-ink-400">No hay tareas pendientes.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: number;
  hint?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
      <p className="text-sm text-ink-600">{label}</p>
      <p className="mt-1 font-display text-4xl font-semibold" style={{ color: accent }}>
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}
