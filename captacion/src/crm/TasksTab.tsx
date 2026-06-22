import { useState } from "react";
import { supabase } from "../lib/supabase";
import type { Business, Task } from "../lib/types";
import { PRIORITIES, TEAM } from "../data/constants";
import { Badge, Button, Input, Select } from "../components/ui";
import { fechaCorta, esVencida } from "../lib/format";

export default function TasksTab({
  tasks,
  businesses,
  who,
}: {
  tasks: Task[];
  businesses: Business[];
  who: string;
}) {
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [businessId, setBusinessId] = useState("");
  const [assigned, setAssigned] = useState(who || "");
  const [priority, setPriority] = useState("media");
  const [showDone, setShowDone] = useState(false);

  const businessName = (id: string | null) =>
    id ? businesses.find((b) => b.id === id)?.name ?? null : null;

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await supabase.from("tasks").insert({
      title: title.trim(),
      due_date: due || null,
      business_id: businessId || null,
      assigned_to: assigned || null,
      priority,
    });
    setTitle("");
    setDue("");
    setBusinessId("");
  }

  async function toggle(t: Task) {
    await supabase.from("tasks").update({ done: !t.done }).eq("id", t.id);
  }
  async function del(t: Task) {
    await supabase.from("tasks").delete().eq("id", t.id);
  }

  const visible = tasks.filter((t) => (showDone ? true : !t.done));
  const pending = visible.filter((t) => !t.done);
  const done = visible.filter((t) => t.done);

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={add} className="rounded-2xl border border-line bg-white p-4 shadow-soft">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nueva tarea… (p. ej. Llamar a Bar La Plaza)"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            className="rounded-lg border border-line bg-white px-3 py-2 text-sm"
          />
          <Select value={businessId} onChange={(e) => setBusinessId(e.target.value)} className="max-w-[12rem]">
            <option value="">Sin negocio</option>
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </Select>
          <Select value={assigned} onChange={(e) => setAssigned(e.target.value)} className="max-w-[9rem]">
            <option value="">Sin asignar</option>
            {TEAM.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
          <Select value={priority} onChange={(e) => setPriority(e.target.value)} className="max-w-[8rem]">
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </Select>
          <Button type="submit" disabled={!title.trim()} className="ml-auto">
            Añadir
          </Button>
        </div>
      </form>

      <div className="mt-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">
          {pending.length} pendiente{pending.length === 1 ? "" : "s"}
        </h3>
        <label className="flex items-center gap-2 text-sm text-ink-600">
          <input type="checkbox" checked={showDone} onChange={(e) => setShowDone(e.target.checked)} />
          Ver completadas
        </label>
      </div>

      <ul className="mt-3 space-y-2">
        {pending.map((t) => (
          <TaskRow key={t.id} task={t} businessName={businessName(t.business_id)} onToggle={toggle} onDelete={del} />
        ))}
        {pending.length === 0 && (
          <li className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-ink-400">
            🎉 Nada pendiente. ¡A prospectar!
          </li>
        )}
      </ul>

      {showDone && done.length > 0 && (
        <>
          <h4 className="mt-6 text-sm font-medium text-ink-400">Completadas</h4>
          <ul className="mt-2 space-y-2 opacity-60">
            {done.map((t) => (
              <TaskRow key={t.id} task={t} businessName={businessName(t.business_id)} onToggle={toggle} onDelete={del} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function TaskRow({
  task,
  businessName,
  onToggle,
  onDelete,
}: {
  task: Task;
  businessName: string | null;
  onToggle: (t: Task) => void;
  onDelete: (t: Task) => void;
}) {
  const vencida = !task.done && esVencida(task.due_date);
  return (
    <li className="flex items-center gap-3 rounded-xl border border-line bg-white p-3 shadow-soft">
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task)}
        className="h-5 w-5 shrink-0 accent-pine-500"
      />
      <div className="min-w-0 flex-1">
        <p className={`truncate ${task.done ? "line-through text-ink-400" : ""}`}>{task.title}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-ink-400">
          {task.due_date && (
            <span className={vencida ? "font-medium text-red-600" : ""}>
              📅 {fechaCorta(task.due_date)}
            </span>
          )}
          {businessName && <Badge>{businessName}</Badge>}
          {task.assigned_to && <Badge>{task.assigned_to}</Badge>}
          {task.priority === "alta" && <Badge color="#df6b3c">alta</Badge>}
        </div>
      </div>
      <button
        onClick={() => onDelete(task)}
        className="shrink-0 rounded-full p-1 text-ink-400 hover:bg-sand hover:text-red-600"
        aria-label="Borrar tarea"
      >
        ✕
      </button>
    </li>
  );
}
