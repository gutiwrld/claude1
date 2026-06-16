import { useState } from "react";
import { supabase } from "../lib/supabase";
import { buildGroupMatches } from "../lib/matches";
import { saveIdentity } from "../lib/storage";
import type { Identity } from "../lib/storage";
import { errMsg } from "../lib/errors";
import { Banner, Button } from "./ui";

export function CreatePool({ onCreated }: { onCreated: (poolId: string, id: Identity) => void }) {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedPin = pin.trim();
    if (!trimmedName || !trimmedPin) {
      setError("Pon tu nombre y un PIN de administrador.");
      return;
    }

    setBusy(true);
    try {
      // 1) Crear la pool.
      const { data: pool, error: poolErr } = await supabase
        .from("pools")
        .insert({ name: trimmedName, admin_pin: trimmedPin })
        .select()
        .single();
      if (poolErr) throw poolErr;

      // 2) Sembrar los 72 partidos de grupos en una sola llamada.
      const { error: matchErr } = await supabase.from("matches").insert(buildGroupMatches(pool.id));
      if (matchErr) throw matchErr;

      // 3) El creador entra como primer jugador.
      const { data: player, error: playerErr } = await supabase
        .from("players")
        .insert({ pool_id: pool.id, name: trimmedName })
        .select()
        .single();
      if (playerErr) throw playerErr;

      const identity: Identity = { poolId: pool.id, playerId: player.id, playerName: player.name };
      saveIdentity(identity);
      onCreated(pool.id, identity);
    } catch (e) {
      console.error("[Porra] Error al crear la porra:", e);
      setError(`No se pudo crear la porra: ${errMsg(e)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-black tracking-tight">
          Porra <span className="text-grass-400">Mundial 2026</span>
        </h1>
        <p className="mt-2 text-sm text-chalk/60">Crea una porra y comparte el enlace con tus amigos.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-pitch-700 bg-pitch-900/60 p-6">
        <h2 className="text-lg font-bold">Nueva porra</h2>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-chalk/80">Tu nombre</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Guille"
            autoComplete="off"
            className="w-full rounded-xl border border-pitch-600 bg-pitch-800 px-3 py-2.5 text-chalk placeholder:text-chalk/40"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-chalk/80">PIN de administrador</span>
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Para meter resultados"
            inputMode="numeric"
            autoComplete="off"
            className="w-full rounded-xl border border-pitch-600 bg-pitch-800 px-3 py-2.5 text-chalk placeholder:text-chalk/40"
          />
          <span className="mt-1 block text-xs text-chalk/50">
            Solo tú lo conocerás: desbloquea el modo admin para cargar marcadores.
          </span>
        </label>

        {error && <Banner kind="error">{error}</Banner>}

        <Button type="submit" disabled={busy} className="w-full">
          {busy ? "Creando…" : "Crear porra"}
        </Button>
      </form>
    </div>
  );
}
