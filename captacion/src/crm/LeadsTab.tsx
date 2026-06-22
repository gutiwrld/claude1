import { supabase } from "../lib/supabase";
import type { Lead } from "../lib/types";
import { Badge, Button } from "../components/ui";
import { desde } from "../lib/format";

export default function LeadsTab({ leads, who }: { leads: Lead[]; who: string }) {
  const nuevos = leads.filter((l) => !l.processed);
  const procesados = leads.filter((l) => l.processed);

  async function convert(lead: Lead) {
    // Crea un negocio a partir del lead y lo marca como procesado.
    await supabase.from("businesses").insert({
      name: lead.business_name || lead.name,
      contact_person: lead.business_name ? lead.name : null,
      sector: lead.sector || null,
      email: lead.email || null,
      phone: lead.phone || null,
      status: "interesado",
      source: "web",
      owner: who || null,
      notes: lead.message || null,
    });
    await supabase.from("leads").update({ processed: true }).eq("id", lead.id);
  }

  async function discard(lead: Lead) {
    await supabase.from("leads").update({ processed: true }).eq("id", lead.id);
  }
  async function del(lead: Lead) {
    if (!confirm("¿Borrar este lead?")) return;
    await supabase.from("leads").delete().eq("id", lead.id);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h3 className="font-display text-lg font-semibold">
        {nuevos.length} lead{nuevos.length === 1 ? "" : "s"} sin procesar
      </h3>
      <p className="mt-1 text-sm text-ink-600">
        Entran automáticamente desde el formulario de la web. Conviértelos en negocio para
        meterlos en el pipeline.
      </p>

      <ul className="mt-4 space-y-2">
        {nuevos.map((l) => (
          <li key={l.id} className="rounded-xl border border-line bg-white p-4 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium">
                  {l.business_name || l.name}
                  {l.business_name && <span className="text-ink-400"> · {l.name}</span>}
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5 text-sm text-ink-600">
                  {l.sector && <Badge>{l.sector}</Badge>}
                  {l.email && <a href={`mailto:${l.email}`} className="text-pine-500 hover:underline">{l.email}</a>}
                  {l.phone && <a href={`tel:${l.phone}`} className="text-pine-500 hover:underline">{l.phone}</a>}
                </div>
                {l.message && <p className="mt-2 text-sm text-ink-600">“{l.message}”</p>}
              </div>
              <span className="shrink-0 text-xs text-ink-400">{desde(l.created_at)}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" onClick={() => convert(l)}>
                → Convertir en negocio
              </Button>
              <Button size="sm" variant="soft" onClick={() => discard(l)}>
                Descartar
              </Button>
              <button onClick={() => del(l)} className="ml-auto text-sm text-ink-400 hover:text-red-600">
                Borrar
              </button>
            </div>
          </li>
        ))}
        {nuevos.length === 0 && (
          <li className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-ink-400">
            No hay leads nuevos.
          </li>
        )}
      </ul>

      {procesados.length > 0 && (
        <>
          <h4 className="mt-6 text-sm font-medium text-ink-400">Procesados ({procesados.length})</h4>
          <ul className="mt-2 space-y-1 text-sm text-ink-400">
            {procesados.map((l) => (
              <li key={l.id} className="flex items-center justify-between rounded-lg px-2 py-1">
                <span>{l.business_name || l.name}</span>
                <span>{desde(l.created_at)}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
