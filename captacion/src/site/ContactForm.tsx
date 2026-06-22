import { useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase";
import { SECTORS } from "../data/constants";
import { Button, Field, Input, Select, Textarea, Spinner } from "../components/ui";

type State = "idle" | "sending" | "ok" | "error";

export default function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [form, setForm] = useState({
    name: "",
    business_name: "",
    email: "",
    phone: "",
    sector: "",
    message: "",
  });

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || (!form.email.trim() && !form.phone.trim())) return;
    setState("sending");

    if (!supabaseConfigured) {
      // Sin Supabase configurado, simulamos éxito para no bloquear la demo.
      setTimeout(() => setState("ok"), 600);
      return;
    }

    const { error } = await supabase.from("leads").insert({
      name: form.name.trim(),
      business_name: form.business_name.trim() || null,
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      sector: form.sector || null,
      message: form.message.trim() || null,
    });
    setState(error ? "error" : "ok");
  }

  if (state === "ok") {
    return (
      <div className="rounded-2xl border border-line bg-white p-8 text-center shadow-soft">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pine-500/10 text-2xl">
          ✅
        </div>
        <h3 className="font-display text-2xl font-semibold">¡Recibido!</h3>
        <p className="mt-2 text-ink-600">
          Gracias, {form.name.split(" ")[0]}. Te escribimos en menos de 24&nbsp;h con
          ideas concretas para tu negocio.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tu nombre *">
          <Input required value={form.name} onChange={set("name")} placeholder="María García" />
        </Field>
        <Field label="Nombre del negocio">
          <Input value={form.business_name} onChange={set("business_name")} placeholder="Bar La Plaza" />
        </Field>
        <Field label="Email">
          <Input type="email" value={form.email} onChange={set("email")} placeholder="maria@ejemplo.es" />
        </Field>
        <Field label="Teléfono">
          <Input value={form.phone} onChange={set("phone")} placeholder="600 00 00 00" />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Sector">
            <Select value={form.sector} onChange={set("sector")}>
              <option value="">Selecciona…</option>
              {SECTORS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="¿Qué necesitas?">
            <Textarea
              rows={3}
              value={form.message}
              onChange={set("message")}
              placeholder="Cuéntanos qué quieres conseguir con tu web…"
            />
          </Field>
        </div>
      </div>

      <p className="mt-2 text-xs text-ink-400">* Indica al menos un email o teléfono para poder responderte.</p>

      {state === "error" && (
        <p className="mt-3 text-sm text-red-600">
          Ups, algo ha fallado. Inténtalo de nuevo o escríbenos por email.
        </p>
      )}

      <Button type="submit" disabled={state === "sending"} className="mt-5 w-full sm:w-auto">
        {state === "sending" ? <Spinner /> : "Quiero mi web"}
      </Button>
    </form>
  );
}
