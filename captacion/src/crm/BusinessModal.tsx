import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Business, Interaction, InteractionKind } from "../lib/types";
import {
  STATUSES,
  PRIORITIES,
  SOURCES,
  SECTORS,
  PROVINCES,
  TEAM,
  INTERACTION_KINDS,
} from "../data/constants";
import { Button, Field, Input, Modal, Select, Textarea, Badge } from "../components/ui";
import { desde } from "../lib/format";

type Draft = Partial<Business>;

const EMPTY: Draft = {
  name: "",
  sector: "",
  province: "",
  city: "",
  phone: "",
  email: "",
  website: "",
  has_website: false,
  instagram: "",
  contact_person: "",
  status: "nuevo",
  priority: "media",
  source: "prospeccion",
  owner: "",
  notes: "",
};

export default function BusinessModal({
  open,
  business,
  who,
  onClose,
}: {
  open: boolean;
  business: Business | null; // null = crear nuevo
  who: string;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [newKind, setNewKind] = useState<InteractionKind>("llamada");
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    setDraft(business ? { ...business } : { ...EMPTY, owner: who });
    setInteractions([]);
    if (business) void loadInteractions(business.id);
  }, [business, who, open]);

  async function loadInteractions(id: string) {
    const { data } = await supabase
      .from("interactions")
      .select("*")
      .eq("business_id", id)
      .order("created_at", { ascending: false });
    setInteractions((data ?? []) as Interaction[]);
  }

  const set = (k: keyof Draft) => (e: { target: { value: string } }) =>
    setDraft((d) => ({ ...d, [k]: e.target.value }));

  async function save() {
    if (!draft.name?.trim()) return;
    setSaving(true);
    const payload = {
      name: draft.name.trim(),
      sector: draft.sector || null,
      province: draft.province || null,
      city: draft.city || null,
      phone: draft.phone || null,
      email: draft.email || null,
      website: draft.website || null,
      has_website: Boolean(draft.website?.trim()) || draft.has_website || false,
      instagram: draft.instagram || null,
      contact_person: draft.contact_person || null,
      status: draft.status || "nuevo",
      priority: draft.priority || "media",
      source: draft.source || "prospeccion",
      owner: draft.owner || null,
      notes: draft.notes || null,
    };
    if (business) {
      await supabase.from("businesses").update(payload).eq("id", business.id);
    } else {
      await supabase.from("businesses").insert(payload);
    }
    setSaving(false);
    onClose();
  }

  async function remove() {
    if (!business) return;
    if (!confirm(`¿Borrar "${business.name}"? Esta acción no se puede deshacer.`)) return;
    await supabase.from("businesses").delete().eq("id", business.id);
    onClose();
  }

  async function addInteraction() {
    if (!business || !newNote.trim()) return;
    await supabase.from("interactions").insert({
      business_id: business.id,
      kind: newKind,
      body: newNote.trim(),
      created_by: who || null,
    });
    setNewNote("");
    void loadInteractions(business.id);
    // Marca contactado si aún estaba en "nuevo".
    if (business.status === "nuevo") {
      await supabase.from("businesses").update({ status: "contactado" }).eq("id", business.id);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={business ? business.name : "Nuevo negocio"}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Nombre del negocio *">
            <Input value={draft.name ?? ""} onChange={set("name")} placeholder="Bar La Plaza" />
          </Field>
        </div>
        <Field label="Sector">
          <Select value={draft.sector ?? ""} onChange={set("sector")}>
            <option value="">—</option>
            {SECTORS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </Field>
        <Field label="Persona de contacto">
          <Input value={draft.contact_person ?? ""} onChange={set("contact_person")} />
        </Field>
        <Field label="Provincia">
          <Select value={draft.province ?? ""} onChange={set("province")}>
            <option value="">—</option>
            {PROVINCES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </Select>
        </Field>
        <Field label="Localidad">
          <Input value={draft.city ?? ""} onChange={set("city")} />
        </Field>
        <Field label="Teléfono">
          <Input value={draft.phone ?? ""} onChange={set("phone")} />
        </Field>
        <Field label="Email">
          <Input value={draft.email ?? ""} onChange={set("email")} />
        </Field>
        <Field label="Web actual">
          <Input value={draft.website ?? ""} onChange={set("website")} placeholder="https://…" />
        </Field>
        <Field label="Instagram">
          <Input value={draft.instagram ?? ""} onChange={set("instagram")} placeholder="@negocio" />
        </Field>
        <Field label="Estado">
          <Select value={draft.status ?? "nuevo"} onChange={set("status")}>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Prioridad">
          <Select value={draft.priority ?? "media"} onChange={set("priority")}>
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Origen">
          <Select value={draft.source ?? "prospeccion"} onChange={set("source")}>
            {SOURCES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Responsable">
          <Select value={draft.owner ?? ""} onChange={set("owner")}>
            <option value="">—</option>
            {TEAM.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Notas">
            <Textarea rows={2} value={draft.notes ?? ""} onChange={set("notes")} />
          </Field>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div>
          {business && (
            <Button variant="ghost" size="sm" onClick={remove} className="text-red-600">
              Borrar
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="soft" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={save} disabled={saving || !draft.name?.trim()}>
            {saving ? "Guardando…" : "Guardar"}
          </Button>
        </div>
      </div>

      {/* Historial de interacciones (solo al editar) */}
      {business && (
        <div className="mt-6 border-t border-line pt-5">
          <h4 className="mb-3 font-display text-lg font-semibold">Seguimiento</h4>
          <div className="flex gap-2">
            <Select value={newKind} onChange={(e) => setNewKind(e.target.value as InteractionKind)} className="max-w-[8rem]">
              {INTERACTION_KINDS.map((k) => (
                <option key={k.value} value={k.value}>
                  {k.icon} {k.label}
                </option>
              ))}
            </Select>
            <Input
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addInteraction()}
              placeholder="Anota qué ha pasado…"
            />
            <Button size="sm" onClick={addInteraction} disabled={!newNote.trim()}>
              Añadir
            </Button>
          </div>
          <ul className="mt-4 space-y-2">
            {interactions.length === 0 && (
              <li className="text-sm text-ink-400">Sin interacciones todavía.</li>
            )}
            {interactions.map((it) => {
              const meta = INTERACTION_KINDS.find((k) => k.value === it.kind);
              return (
                <li key={it.id} className="rounded-lg bg-sand/60 p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <Badge>{meta?.icon} {meta?.label}</Badge>
                    <span className="text-xs text-ink-400">
                      {it.created_by ? `${it.created_by} · ` : ""}
                      {desde(it.created_at)}
                    </span>
                  </div>
                  {it.body && <p className="mt-1.5 text-ink-600">{it.body}</p>}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Modal>
  );
}
