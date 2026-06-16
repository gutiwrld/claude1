import { useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { ALL_TEAMS, FLAG_BY_NAME } from "../data/teams";
import { buildGroupMatches } from "../lib/matches";
import { computeGroupTables } from "../lib/groupTables";
import { buildBracketSeeds, resolveAdvancers } from "../lib/bracket";
import type { Match } from "../lib/types";
import { errMsg } from "../lib/errors";
import { toLocalInput, fromLocalInput } from "../lib/dates";
import { Banner, Button, Pill } from "./ui";

function AdminMatchRow({ match }: { match: Match }) {
  const [home, setHome] = useState<string>(match.result_home?.toString() ?? "");
  const [away, setAway] = useState<string>(match.result_away?.toString() ?? "");
  const [kickoff, setKickoff] = useState<string>(toLocalInput(match.kickoff));
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

      {match.knockout && (
        <div className="mb-2 grid grid-cols-2 gap-2">
          <select
            value={match.home_name}
            onChange={(e) => void run({ home_name: e.target.value, home_flag: FLAG_BY_NAME[e.target.value] ?? "🏳️" })}
            aria-label="Equipo local"
            className="rounded-lg border border-pitch-600 bg-pitch-800 px-2 py-1.5 text-xs"
          >
            {!FLAG_BY_NAME[match.home_name] && <option value={match.home_name}>{match.home_name}</option>}
            {ALL_TEAMS.map((t) => (
              <option key={t.name} value={t.name}>{t.flag} {t.name}</option>
            ))}
          </select>
          <select
            value={match.away_name}
            onChange={(e) => void run({ away_name: e.target.value, away_flag: FLAG_BY_NAME[e.target.value] ?? "🏳️" })}
            aria-label="Equipo visitante"
            className="rounded-lg border border-pitch-600 bg-pitch-800 px-2 py-1.5 text-xs"
          >
            {!FLAG_BY_NAME[match.away_name] && <option value={match.away_name}>{match.away_name}</option>}
            {ALL_TEAMS.map((t) => (
              <option key={t.name} value={t.name}>{t.flag} {t.name}</option>
            ))}
          </select>
        </div>
      )}

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
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <label className="text-xs text-chalk/60">Fecha y hora</label>
        <input
          type="datetime-local"
          value={kickoff}
          onChange={(e) => {
            setKickoff(e.target.value);
            void run({ kickoff: fromLocalInput(e.target.value) });
          }}
          aria-label={`Fecha y hora de ${match.home_name} contra ${match.away_name}`}
          className="rounded-lg border border-pitch-600 bg-pitch-800 px-2 py-1.5 text-xs text-chalk [color-scheme:dark]"
        />
        {kickoff && (
          <Button
            variant="ghost"
            disabled={busy}
            onClick={() => {
              setKickoff("");
              void run({ kickoff: null });
            }}
            className="px-2 py-1 text-xs"
          >
            Quitar fecha
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
  const [kickoff, setKickoff] = useState("");
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
        kickoff: fromLocalInput(kickoff),
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

      <label className="block">
        <span className="mb-1 block text-xs text-chalk/60">Fecha y hora (opcional)</span>
        <input
          type="datetime-local"
          value={kickoff}
          onChange={(e) => setKickoff(e.target.value)}
          className="w-full rounded-lg border border-pitch-600 bg-pitch-800 px-2 py-2 text-sm [color-scheme:dark]"
        />
      </label>

      {error && <Banner kind="error">{error}</Banner>}
      {ok && <Banner kind="success">Partido añadido. Aparece en la pestaña Partidos.</Banner>}

      <Button type="submit" disabled={busy} className="w-full">
        {busy ? "Añadiendo…" : "Añadir partido"}
      </Button>
    </form>
  );
}

function ReloadSchedule({ matches, poolId }: { matches: Match[]; poolId: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const groupCount = useMemo(() => matches.filter((m) => !m.knockout).length, [matches]);

  async function reload() {
    setBusy(true);
    setError(null);
    setDone(false);
    try {
      // Borra los partidos de grupos actuales (y, en cascada, sus pronósticos)
      // y los recrea desde el calendario oficial con emparejamientos y horas reales.
      const { error: delErr } = await supabase
        .from("matches")
        .delete()
        .eq("pool_id", poolId)
        .eq("knockout", false);
      if (delErr) throw delErr;

      const { error: insErr } = await supabase.from("matches").insert(buildGroupMatches(poolId));
      if (insErr) throw insErr;

      setDone(true);
      setConfirming(false);
    } catch (e) {
      console.error("[Porra] Error recargando el calendario:", e);
      setError(errMsg(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-3 rounded-2xl border border-pitch-700 bg-pitch-900/60 p-4">
      <h3 className="text-sm font-bold uppercase tracking-wide text-chalk/60">Calendario oficial</h3>
      <p className="text-xs text-chalk/60">
        Recrea los <span className="font-semibold text-chalk">{groupCount}</span> partidos de la fase de grupos con los
        emparejamientos, local/visitante y fechas/horas <span className="font-semibold text-chalk">oficiales</span> del
        Mundial 2026 (hora de España). No toca las eliminatorias que hayas añadido.
      </p>
      <Banner kind="error">
        ⚠️ Esto borra los partidos de grupos actuales y <strong>los pronósticos ya hechos sobre ellos</strong>. Úsalo para
        dejar el calendario correcto al principio.
      </Banner>
      {error && <Banner kind="error">{error}</Banner>}
      {done && <Banner kind="success">Calendario oficial cargado. Los partidos ya salen con sus fechas reales.</Banner>}

      {confirming ? (
        <div className="flex gap-2">
          <Button variant="danger" onClick={reload} disabled={busy} className="flex-1">
            {busy ? "Cargando…" : "Sí, recargar"}
          </Button>
          <Button variant="ghost" onClick={() => setConfirming(false)} disabled={busy} className="flex-1">
            Cancelar
          </Button>
        </div>
      ) : (
        <Button onClick={() => setConfirming(true)} className="w-full">
          Cargar calendario oficial
        </Button>
      )}
    </section>
  );
}

function BracketPanel({ matches, poolId }: { matches: Match[]; poolId: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const tables = useMemo(() => computeGroupTables(matches), [matches]);
  const hasKnockout = useMemo(() => matches.some((m) => m.knockout), [matches]);
  const pending = useMemo(() => resolveAdvancers(matches, tables), [matches, tables]);

  async function generate() {
    setBusy(true); setError(null); setMsg(null);
    try {
      const { error: err } = await supabase.from("matches").insert(buildBracketSeeds(poolId, tables));
      if (err) throw err;
      setMsg("Cuadro creado: 16 dieciseisavos + octavos, cuartos, semis, 3.º y final.");
    } catch (e) {
      console.error("[Porra] Error generando el cuadro:", e);
      setError(errMsg(e));
    } finally {
      setBusy(false);
    }
  }

  async function update() {
    setBusy(true); setError(null); setMsg(null);
    try {
      const results = await Promise.all(
        pending.map((u) =>
          supabase
            .from("matches")
            .update({ home_name: u.home_name, home_flag: u.home_flag, away_name: u.away_name, away_flag: u.away_flag })
            .eq("id", u.id)
        )
      );
      const firstErr = results.find((r) => r.error)?.error;
      if (firstErr) throw firstErr;
      setMsg(`Cruces actualizados: ${pending.length} partido(s).`);
    } catch (e) {
      console.error("[Porra] Error actualizando cruces:", e);
      setError(errMsg(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-3 rounded-2xl border border-pitch-700 bg-pitch-900/60 p-4">
      <h3 className="text-sm font-bold uppercase tracking-wide text-chalk/60">Cuadro final (eliminatorias)</h3>

      <details className="rounded-lg bg-pitch-800/60 p-2">
        <summary className="cursor-pointer text-xs font-semibold text-grass-400">Ver clasificación de grupos ▾</summary>
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Object.entries(tables).map(([g, rows]) => (
            <div key={g} className="text-[11px]">
              <div className="mb-1 font-bold text-chalk/70">Grupo {g}</div>
              <ol className="space-y-0.5">
                {rows.map((r, i) => (
                  <li key={r.team} className={`flex justify-between ${i < 2 ? "text-grass-300" : i === 2 ? "text-flare" : "text-chalk/50"}`}>
                    <span className="truncate">{i + 1}. {r.flag} {r.team}</span>
                    <span className="tnum ml-1">{r.pts}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[10px] text-chalk/40">Verde = clasificados (1.º y 2.º). Naranja = 3.º (8 mejores clasifican).</p>
      </details>

      {error && <Banner kind="error">{error}</Banner>}
      {msg && <Banner kind="success">{msg}</Banner>}

      {!hasKnockout ? (
        <>
          <p className="text-xs text-chalk/60">
            Crea el cuadro completo. Los dieciseisavos se rellenan con los equipos ya clasificados; el resto queda como “Por
            definir” y se completa solo al avanzar. Puedes ajustar cualquier equipo a mano abajo.
          </p>
          <Button onClick={generate} disabled={busy} className="w-full">
            {busy ? "Creando…" : "Generar cuadro final (32 partidos)"}
          </Button>
        </>
      ) : (
        <>
          <p className="text-xs text-chalk/60">
            Pulsa para rellenar los cruces que ya se conozcan: equipos clasificados en dieciseisavos y ganadores que avanzan de
            ronda. No toca partidos ya jugados.
          </p>
          <Button onClick={update} disabled={busy || pending.length === 0} className="w-full">
            {busy ? "Actualizando…" : pending.length === 0 ? "Cruces al día ✓" : `Actualizar cruces (${pending.length})`}
          </Button>
        </>
      )}
    </section>
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

      <ReloadSchedule matches={matches} poolId={poolId} />

      <BracketPanel matches={matches} poolId={poolId} />

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
