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

// ---------- Selección (el pedido que el cliente monta desde la carta) ----------
// Vive en el dispositivo mientras el cliente navega la carta. Cada item guarda
// el plato y de qué alérgenos lo quiere "sin". Se limpia al enviar el aviso.
const KEY_SELECCION = 'aliva_seleccion';

export function getSeleccion() {
  try {
    return JSON.parse(localStorage.getItem(KEY_SELECCION));
  } catch {
    return null;
  }
}

// Asegura que la selección corresponde a este local y mesa; si cambia de
// local, empieza de cero (no mezclamos pedidos de restaurantes distintos).
export function contextoSeleccion(localSlug, mesa) {
  const s = getSeleccion();
  if (!s || s.localSlug !== localSlug) {
    const nueva = { localSlug, mesa, items: [] };
    localStorage.setItem(KEY_SELECCION, JSON.stringify(nueva));
    return nueva;
  }
  if (mesa && s.mesa !== mesa) {
    s.mesa = mesa;
    localStorage.setItem(KEY_SELECCION, JSON.stringify(s));
  }
  return s;
}

export function setItemSeleccion(item) {
  const s = getSeleccion() || { localSlug: item.localSlug, mesa: item.mesa, items: [] };
  const i = s.items.findIndex((x) => x.dishId === item.dishId);
  if (i >= 0) s.items[i] = item;
  else s.items.push(item);
  localStorage.setItem(KEY_SELECCION, JSON.stringify(s));
  return s;
}

export function quitarItemSeleccion(dishId) {
  const s = getSeleccion();
  if (!s) return null;
  s.items = s.items.filter((x) => x.dishId !== dishId);
  localStorage.setItem(KEY_SELECCION, JSON.stringify(s));
  return s;
}

export function limpiarSeleccion() {
  localStorage.removeItem(KEY_SELECCION);
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
