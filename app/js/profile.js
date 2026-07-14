// Perfil de alergias del usuario.
//
// Decisión de diseño (RGPD): el perfil es dato de salud (art. 9 RGPD) y por
// eso vive SOLO en este dispositivo (localStorage). Nunca se sube a ningún
// servidor. Al enviar un aviso solo viaja el contenido mínimo del aviso
// (mesa + alérgenos + gravedad), sin nombre, y siempre con consentimiento
// explícito del usuario en ese momento.

const KEY_PERFIL = 'salvia_perfil';
const KEY_HISTORIAL = 'salvia_historial';

export function getPerfil() {
  try {
    return JSON.parse(localStorage.getItem(KEY_PERFIL));
  } catch {
    return null;
  }
}

export function setPerfil(perfil) {
  localStorage.setItem(KEY_PERFIL, JSON.stringify(perfil));
}

export function getHistorial() {
  try {
    return JSON.parse(localStorage.getItem(KEY_HISTORIAL)) || [];
  } catch {
    return [];
  }
}

export function addHistorial(entrada) {
  const h = getHistorial();
  h.unshift(entrada);
  localStorage.setItem(KEY_HISTORIAL, JSON.stringify(h.slice(0, 50)));
}

export function updateHistorial(avisoId, cambios) {
  const h = getHistorial();
  const i = h.findIndex((e) => e.avisoId === avisoId);
  if (i >= 0) {
    h[i] = { ...h[i], ...cambios };
    localStorage.setItem(KEY_HISTORIAL, JSON.stringify(h));
  }
}
