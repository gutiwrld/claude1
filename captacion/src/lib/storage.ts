// Identidad por dispositivo + estado de desbloqueo del panel.

const WHO_KEY = "captacion.who";
const UNLOCK_KEY = "captacion.unlocked";

/** Quién está usando el panel en este dispositivo (Guz / Luis). */
export function getWho(): string {
  return localStorage.getItem(WHO_KEY) ?? "";
}

export function setWho(name: string) {
  localStorage.setItem(WHO_KEY, name);
}

/** PIN del panel (configurable por env, con valor por defecto para desarrollo). */
export const PANEL_PIN =
  (import.meta.env.VITE_PANEL_PIN as string | undefined) ?? "1234";

export function isUnlocked(): boolean {
  return sessionStorage.getItem(UNLOCK_KEY) === "1";
}

export function unlock(pin: string): boolean {
  if (pin === PANEL_PIN) {
    sessionStorage.setItem(UNLOCK_KEY, "1");
    return true;
  }
  return false;
}

export function lock() {
  sessionStorage.removeItem(UNLOCK_KEY);
}
