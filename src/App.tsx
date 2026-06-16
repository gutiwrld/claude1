import { useEffect, useState } from "react";
import { supabaseConfigured } from "./lib/supabase";
import { usePoolData } from "./lib/usePoolData";
import { getIdentity, clearIdentity } from "./lib/storage";
import type { Identity } from "./lib/storage";
import type { ScoreRules } from "./lib/types";
import { ConfigMissing } from "./components/ConfigMissing";
import { CreatePool } from "./components/CreatePool";
import { JoinPool } from "./components/JoinPool";
import { MatchesTab } from "./components/MatchesTab";
import { StandingsTab } from "./components/StandingsTab";
import { AdminTab } from "./components/AdminTab";
import { AdminGate } from "./components/AdminGate";
import { Banner, Button, Spinner } from "./components/ui";

type Tab = "partidos" | "clasificacion" | "admin";

function getPoolIdFromUrl(): string | null {
  return new URLSearchParams(window.location.search).get("pool");
}

function setPoolIdInUrl(poolId: string) {
  const url = new URL(window.location.href);
  url.searchParams.set("pool", poolId);
  window.history.replaceState({}, "", url.toString());
}

export default function App() {
  const [poolId, setPoolId] = useState<string | null>(getPoolIdFromUrl());
  const [identity, setIdentity] = useState<Identity | null>(() => {
    const pid = getPoolIdFromUrl();
    return pid ? getIdentity(pid) : null;
  });
  const [tab, setTab] = useState<Tab>("partidos");
  const [isAdmin, setIsAdmin] = useState(false);
  const [copied, setCopied] = useState(false);

  const { pool, players, matches, predictions, loading, error, notFound, reload } = usePoolData(poolId);

  // Si la pool carga y aún no hay identidad guardada, intenta recuperarla.
  useEffect(() => {
    if (poolId && !identity) {
      const stored = getIdentity(poolId);
      if (stored) setIdentity(stored);
    }
  }, [poolId, identity]);

  if (!supabaseConfigured) return <ConfigMissing />;

  // Crear pool (no hay ?pool en la URL).
  if (!poolId) {
    return (
      <CreatePool
        onCreated={(id, ident) => {
          setPoolIdInUrl(id);
          setPoolId(id);
          setIdentity(ident);
        }}
      />
    );
  }

  if (loading) return <Spinner label="Cargando la porra…" />;

  if (error) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 space-y-4">
        <Banner kind="error">No se pudieron cargar los datos: {error}</Banner>
        <Button onClick={() => void reload()}>Reintentar</Button>
      </div>
    );
  }

  if (notFound || !pool) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 space-y-4">
        <Banner kind="error">No existe ninguna porra con ese enlace.</Banner>
        <Button
          onClick={() => {
            const url = new URL(window.location.href);
            url.searchParams.delete("pool");
            window.history.replaceState({}, "", url.toString());
            setPoolId(null);
            setIdentity(null);
          }}
        >
          Crear una porra nueva
        </Button>
      </div>
    );
  }

  // Hay pool pero no soy jugador: unirse.
  if (!identity) {
    return <JoinPool pool={pool} players={players} onJoined={setIdentity} />;
  }

  const rules: ScoreRules = { exact: pool.exact_pts, outcome: pool.outcome_pts };

  async function copyInvite() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "partidos", label: "Partidos" },
    { id: "clasificacion", label: "Clasificación" },
    { id: "admin", label: "Admin" },
  ];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col">
      <header className="sticky top-0 z-20 border-b border-pitch-700 bg-pitch-950/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-black">{pool.name}</h1>
            <p className="text-xs text-chalk/50">
              Hola, <span className="font-semibold text-chalk/80">{identity.playerName}</span> ·{" "}
              <button
                className="underline decoration-dotted hover:text-chalk/80"
                onClick={() => {
                  clearIdentity(pool.id);
                  setIdentity(null);
                }}
              >
                cambiar
              </button>
            </p>
          </div>
          <Button variant="ghost" onClick={() => void copyInvite()} className="shrink-0 px-3 py-2 text-xs">
            {copied ? "¡Copiado!" : "Invitar 🔗"}
          </Button>
        </div>

        <nav className="mt-3 flex gap-1 rounded-xl bg-pitch-800 p-1" aria-label="Secciones">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? "page" : undefined}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                tab === t.id ? "bg-grass-500 text-pitch-950" : "text-chalk/70 hover:text-chalk"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="flex-1 px-4 py-4">
        {tab === "partidos" && (
          <MatchesTab
            matches={matches}
            predictions={predictions}
            players={players}
            rules={rules}
            playerId={identity.playerId}
            poolId={pool.id}
          />
        )}

        {tab === "clasificacion" && (
          <StandingsTab
            players={players}
            matches={matches}
            predictions={predictions}
            rules={rules}
            playerId={identity.playerId}
          />
        )}

        {tab === "admin" &&
          (isAdmin ? (
            <AdminTab matches={matches} poolId={pool.id} />
          ) : (
            <AdminGate pin={pool.admin_pin} onUnlock={() => setIsAdmin(true)} />
          ))}
      </main>
    </div>
  );
}
