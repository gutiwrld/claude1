// Identidad ligera por dispositivo. Recordamos a quién corresponde cada pool.
const KEY = "porra2026:identity";

export interface Identity {
  poolId: string;
  playerId: string;
  playerName: string;
}

type Store = Record<string, { playerId: string; playerName: string }>;

function readStore(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    return {};
  }
}

function writeStore(store: Store): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* ignoramos cuotas/modo privado */
  }
}

export function getIdentity(poolId: string): Identity | null {
  const entry = readStore()[poolId];
  if (!entry) return null;
  return { poolId, playerId: entry.playerId, playerName: entry.playerName };
}

export function saveIdentity(id: Identity): void {
  const store = readStore();
  store[id.poolId] = { playerId: id.playerId, playerName: id.playerName };
  writeStore(store);
}

export function clearIdentity(poolId: string): void {
  const store = readStore();
  delete store[poolId];
  writeStore(store);
}
