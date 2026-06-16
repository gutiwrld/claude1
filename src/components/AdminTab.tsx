import { useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { ALL_TEAMS } from "../data/teams";
import type { Match } from "../lib/types";
import { errMsg } from "../lib/errors";
import { Banner, Button, Pill } from "./ui";

function AdminMatchRow({ match }: { match: Match }) {
  const [home, setHome] = useState<string>(match.result_home?.toString() ?? "");
  const [away, setAway] = useState<string>(match.result_away?.toString() ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(patch: Partial<Match>) {
    setBusy(true);
    setError(null);
    try {
      const { error: err } = await supabase.from("matches").update(patch).eq("id", match.id);
      if (err) throw err;
    } catch (e) {
      console.error("[Porra] Error al actualizar el partido:", e);
      setError(errMsg(e));
    } finally {
      setBusy(false);
    }
  }

  function markFinal() {
    const h = parseInt(home, 10);
    const a = parseInt(away, 10);
    if (Number.isNaN(h) || Number.isNaN(a) || h < 0 || a < 0) {
      setError("Introduce un marcador válido.");
      return;
    }
    void run({ result_home: h, result_away: a, locked: true });
  }

  const hasResult = match.result_home !== null && match.result_away !== null;

  return (
    <article className="rounded-xl border border-pitch-700 bg-pitch-900/60 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="truncate text-sm font-semibold">
          {match.home_flag} {match.home_name} <span className="text-chalk/40">vs</span> {match.away_name} {match.away_flag}
        </span>
        {hasResult ? <Pill tone="final">Final</Pill> : match.locked ? <Pill tone="closed">Cerrado</Pill> : <Pill tone="open">Abierto</Pill>}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="number"
          min={0}
          max={20}
          value={home}
          onChange={(e) => setHome(e.target.value)}
          aria-label={`Goles ${match.home_name}`}
          className="w-16 rounded-lg border border-pitch-600 bg-pitch-800 px-2 py-1.5 text-center tabular-nums"
        />
        <span className="text-chalk/40">-</span>
        <input
          type="number"
          min={0}
          max={20}
          value={away}
          onChange={(e) => setAway(e.target.value)}
          aria-label={`Goles ${match.away_name}`}
          className="w-16 rounded-lg border border-pitch-600 bg-pitch-800 px-2 py-1.5 text-center tabular-nums"
        />

        <Button variant="primary" disabled={busy} onClick={markFinal} className="px-3 py-1.5 text-xs">
          Marcar final
        </Button>
        <Button
          variant="subtle"
          disabled={busy}
          onClick={() => run({ locked: !match.locked })}
          className="px-3 py-1.5 text-xs"
        >
          {match.locked ? "Reabrir" : "Cerrar"}
        </Button>
        {hasResult && (
          <Button
            variant="danger"
            disabled={busy}
            onClick={() => {
              setHome("");
              setAway("");
              void run({ result_home: null, result_away: null });
            }}
            className="px-3 py-1.5 text-xs"
          >
            Borrar resultado
          </Button>
        )}
      </div>
      {error && (
        <div className="mt-2">
          <Banner kind="error">{error}</Banner>
        </div>
      )}
    </article>
  );
}

const ROUND_OPTIONS = ["Dieciseisavos", "Octavos", "Cuartos", "Semifinal", "Tercer puesto", "Final"];

function AddKnockout({ poolId, nextSortOrder }: { poolId: string; nextSortOrder: number }) {
  const [round, setRound] = useState(ROUND_OPTIONS[1]);
  const [homeIdx, setHomeIdx] = useState(0);
  const [awayIdx, setAwayIdx] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(false);
    if (homeIdx === awayIdx) {
      setError("Elige dos equipos distintos.");
      return;
    }
    setBusy(true);
    try {
      const h = ALL_TEAMS[homeIdx];
      const a = ALL_TEAMS[awayIdx];
      const { error: err } = await supabase.from("matches").insert({
        pool_id: poolId,
        jornada: round,
        grp: null,
        knockout: true,
        home_name: h.name,
        home_flag: h.flag,
        away_name: a.name,
        away_flag: a.flag,
        locked: false,
        result_home: null,
        result_away: null,
        sort_order: nextSortOrder,
      });
      if (err) throw err;
      setOk(true);
    } catch (e) {
      console.error("[Porra] Error al añadir el partido:", e);
      setError(`No se pudo añadir el partido: ${errMsg(e)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={add} className="space-y-3 rounded-2xl border border-pitch-700 bg-pitch-900/60 p-4">
      <h3 className="text-sm font-bold uppercase tracking-wide text-chalk/60">Añadir eliminatoria</h3>

      <label className="block">
        <span className="mb-1 block text-xs text-chalk/60">Ronda</span>
        <select
          value={round}
          onChange={(e) => setRound(e.target.value)}
          className="w-full rounded-lg border border-pitch-600 bg-pitch-800 px-2 py-2 text-sm"
        >
          {ROUND_OPTIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className="mb-1 block text-xs text-chalk/60">Local</span>
          <select
            value={homeIdx}
            onChange={(e) => setHomeIdx(Number(e.target.value))}
            className="w-full rounded-lg border border-pitch-600 bg-pitch-800 px-2 py-2 text-sm"
          >
            {ALL_TEAMS.map((t, i) => (
              <option key={t.name} value={i}>{t.flag} {t.name}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-chalk/60">Visitante</span>
          <select
            value={awayIdx}
            onChange={(e) => setAwayIdx(Number(e.target.value))}
            className="w-full rounded-lg border border-pitch-600 bg-pitch-800 px-2 py-2 text-sm"
          >
            {ALL_TEAMS.map((t, i) => (
              <option key={t.name} value={i}>{t.flag} {t.name}</option>
            ))}
          </select>
        </label>
      </div>

      {error && <Banner kind="error">{error}</Banner>}
      {ok && <Banner kind="success">Partido añadido. Aparece en la pestaña Partidos.</Banner>}

      <Button type="submit" disabled={busy} className="w-full">
        {busy ? "Añadiendo…" : "Añadir partido"}
      </Button>
    </form>
  );
}

export function AdminTab({ matches, poolId }: { matches: Match[]; poolId: string }) {
  const nextSortOrder = useMemo(
    () => matches.reduce((max, m) => Math.max(max, m.sort_order), 0) + 1,
    [matches]
  );

  return (
    <div className="space-y-6 pb-8">
      <Banner kind="info">
        Modo administrador: carga marcadores, cierra/reabre partidos y añade eliminatorias. Los cambios se ven en tiempo real
        para todos.
      </Banner>

      <AddKnockout poolId={poolId} nextSortOrder={nextSortOrder} />

      <section className="space-y-2">
        <h3 className="text-sm font-bold uppercase tracking-wide text-chalk/60">Partidos</h3>
        <div className="grid grid-cols-1 gap-2">
          {matches.map((m) => (
            <AdminMatchRow key={m.id} match={m} />
          ))}
        </div>
      </section>
    </div>
  );
}
