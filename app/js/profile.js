// Perfil de alergias del usuario.
//
// Decisión de diseño (RGPD): el perfil es dato de salud (art. 9 RGPD) y por
// eso vive SOLO en este dispositivo (localStorage). Nunca se sube a ningún
// servidor. Al enviar un aviso solo viaja el contenido mínimo del aviso
// (mesa + alérgenos + gravedad), sin nombre, y siempre con consentimiento
// explícito del usuario en ese momento.

const KEY_PERFIL = 'aliva_perfil';
const KEY_HISTORIAL = 'aliva_historial';

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

// Solo se puede valorar una visita (un aviso) una vez desde este dispositivo.
// Esto, sumado a que la valoración va ligada a un aviso real, es la barrera
// anti-trampa: no puedes valorar un sitio donde no has comido.
const KEY_VALORADOS = 'aliva_valorados';

export function yaValorado(avisoId) {
  try {
    return (JSON.parse(localStorage.getItem(KEY_VALORADOS)) || []).includes(avisoId);
  } catch {
    return false;
  }
}

export function marcarValorado(avisoId) {
  let lista = [];
  try {
    lista = JSON.parse(localStorage.getItem(KEY_VALORADOS)) || [];
  } catch {
    lista = [];
  }
  if (!lista.includes(avisoId)) lista.push(avisoId);
  localStorage.setItem(KEY_VALORADOS, JSON.stringify(lista));
  updateHistorial(avisoId, { valorado: true });
}
