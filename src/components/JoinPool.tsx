import { useState } from "react";
import { supabase } from "../lib/supabase";
import { saveIdentity } from "../lib/storage";
import type { Identity } from "../lib/storage";
import type { Player, Pool } from "../lib/types";
import { Banner, Button, EmptyState } from "./ui";

export function JoinPool({
  pool,
  players,
  onJoined,
}: {
  pool: Pool;
  players: Player[];
  onJoined: (id: Identity) => void;
}) {
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function enterAs(player: Player) {
    const identity: Identity = { poolId: pool.id, playerId: player.id, playerName: player.name };
    saveIdentity(identity);
    onJoined(identity);
  }

  async function createPlayer(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = newName.trim();
    if (!trimmed) {
      setError("Escribe un nombre.");
      return;
    }
    if (players.some((p) => p.name.toLowerCase() === trimmed.toLowerCase())) {
      setError("Ya hay un jugador con ese nombre. Entra como él o usa otro nombre.");
      return;
    }
    setBusy(true);
    try {
      const { data, error: err } = await supabase
        .from("players")
        .insert({ pool_id: pool.id, name: trimmed })
        .select()
        .single();
      if (err) throw err;
      enterAs(data as Player);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo crear el jugador.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-black tracking-tight">{pool.name}</h1>
        <p className="mt-2 text-sm text-chalk/60">Entra como un jugador existente o únete con tu nombre.</p>
      </header>

      <section className="mb-6 rounded-2xl border border-pitch-700 bg-pitch-900/60 p-5">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-chalk/60">Jugadores</h2>
        {players.length === 0 ? (
          <EmptyState title="Aún no hay jugadores" hint="Sé el primero en unirte abajo." />
        ) : (
          <ul className="grid grid-cols-1 gap-2">
            {players.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => enterAs(p)}
                  className="flex w-full items-center justify-between rounded-xl border border-pitch-600 bg-pitch-800 px-4 py-3 text-left font-medium hover:bg-pitch-700"
                >
                  <span>{p.name}</span>
                  <span className="text-xs text-grass-400">Entrar →</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <form onSubmit={createPlayer} className="space-y-3 rounded-2xl border border-pitch-700 bg-pitch-900/60 p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-chalk/60">Unirme como nuevo</h2>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Tu nombre"
          autoComplete="off"
          className="w-full rounded-xl border border-pitch-600 bg-pitch-800 px-3 py-2.5 text-chalk placeholder:text-chalk/40"
        />
        {error && <Banner kind="error">{error}</Banner>}
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? "Entrando…" : "Unirme a la porra"}
        </Button>
      </form>
    </div>
  );
}
