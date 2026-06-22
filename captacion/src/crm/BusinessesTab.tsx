import { useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Business, Status } from "../lib/types";
import { PIPELINE, STATUSES, statusMeta, TEAM } from "../data/constants";
import { Badge, Button, Input, Select } from "../components/ui";
import BusinessModal from "./BusinessModal";

const PRIORITY_DOT: Record<string, string> = {
  alta: "#df6b3c",
  media: "#d97706",
  baja: "#7a7589",
};

export default function BusinessesTab({
  businesses,
  who,
}: {
  businesses: Business[];
  who: string;
}) {
  const [query, setQuery] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [editing, setEditing] = useState<Business | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showDiscarded, setShowDiscarded] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return businesses.filter((b) => {
      if (ownerFilter && b.owner !== ownerFilter) return false;
      if (!q) return true;
      return [b.name, b.sector, b.city, b.province, b.contact_person]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q));
    });
  }, [businesses, query, ownerFilter]);

  function openNew() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(b: Business) {
    setEditing(b);
    setModalOpen(true);
  }

  async function quickStatus(b: Business, status: Status) {
    await supabase.from("businesses").update({ status }).eq("id", b.id);
  }

  const columns = showDiscarded ? [...PIPELINE, "descartado" as Status] : PIPELINE;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar negocio, ciudad…"
          className="max-w-xs"
        />
        <Select value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)} className="max-w-[10rem]">
          <option value="">Todos</option>
          {TEAM.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </Select>
        <label className="flex items-center gap-2 text-sm text-ink-600">
          <input
            type="checkbox"
            checked={showDiscarded}
            onChange={(e) => setShowDiscarded(e.target.checked)}
          />
          Ver descartados
        </label>
        <div className="ml-auto">
          <Button onClick={openNew}>+ Negocio</Button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {columns.map((status) => {
          const meta = statusMeta(status);
          const items = filtered.filter((b) => b.status === status);
          return (
            <div key={status} className="w-72 shrink-0">
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: meta.color }} />
                  {meta.label}
                </span>
                <span className="text-xs text-ink-400">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => openEdit(b)}
                    className="w-full rounded-xl border border-line bg-white p-3 text-left shadow-soft transition hover:shadow-lift"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium leading-tight">{b.name}</span>
                      <span
                        className="mt-1 h-2 w-2 shrink-0 rounded-full"
                        title={`Prioridad ${b.priority}`}
                        style={{ background: PRIORITY_DOT[b.priority] }}
                      />
                    </div>
                    <div className="mt-1 text-xs text-ink-400">
                      {[b.sector, b.city].filter(Boolean).join(" · ") || "—"}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {b.owner && <Badge>{b.owner}</Badge>}
                      {!b.has_website && <Badge color="#df6b3c">sin web</Badge>}
                    </div>
                    {/* Cambio rápido de estado sin abrir el modal */}
                    <select
                      value={b.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        e.stopPropagation();
                        void quickStatus(b, e.target.value as Status);
                      }}
                      className="mt-2 w-full rounded-md border border-line bg-paper px-2 py-1 text-xs text-ink-600"
                    >
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          → {s.label}
                        </option>
                      ))}
                    </select>
                  </button>
                ))}
                {items.length === 0 && (
                  <div className="rounded-xl border border-dashed border-line p-4 text-center text-xs text-ink-400">
                    Vacío
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <BusinessModal
        open={modalOpen}
        business={editing}
        who={who}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
