// Capa de datos: Supabase si está configurado, modo demo local si no.
//
// En modo demo los avisos se guardan en localStorage: el flujo completo
// (enviar aviso → confirmar desde sala.html en otra pestaña) funciona en
// un mismo dispositivo sin backend. En el piloto Wizard of Oz real, el
// aviso además se reenvía por WhatsApp al receptor de sala vía n8n
// (webhook sobre INSERT en la tabla avisos).

import { calcularBadge } from './badge.js';
import { getMenuLocal } from './menu.js';

const cfg = window.APP_CONFIG;
export const DEMO_MODE = !(cfg.supabaseUrl && cfg.supabaseAnonKey);

// La carta es contenido de prototipo (js/menu.js), igual en demo y en real.
// En producción viviría en Supabase (tabla `platos`).
export async function getMenu(localSlug) {
  return getMenuLocal(localSlug);
}

let _sb = null;
async function sb() {
  if (!_sb) {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    _sb = createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
  }
  return _sb;
}

// ---------- Modo demo (localStorage) ----------

const DEMO_LOCALES = [
  { slug: 'la-nonna', nombre: 'Trattoria La Nonna', barrio: 'Chamberí', direccion: 'C/ Trafalgar 12', pin_sala: '1234', activo: true },
  { slug: 'casa-vera', nombre: 'Casa Vera', barrio: 'Retiro', direccion: 'C/ Ibiza 40', pin_sala: '1234', activo: true },
  { slug: 'alba-brunch', nombre: 'Alba Brunch', barrio: 'Malasaña', direccion: 'C/ del Pez 21', pin_sala: '1234', activo: true },
];

const KEY_AVISOS = 'aliva_demo_avisos';
const KEY_VALORACIONES = 'aliva_demo_valoraciones';

function demoAvisos() {
  try {
    return JSON.parse(localStorage.getItem(KEY_AVISOS)) || [];
  } catch {
    return [];
  }
}

function demoSaveAvisos(avisos) {
  localStorage.setItem(KEY_AVISOS, JSON.stringify(avisos));
}

// Valoraciones de ejemplo para que el demo muestre distintos niveles de
// insignia desde el primer momento. Se siembran una sola vez; las que cree
// el usuario al valorar sus visitas se añaden a la misma lista.
function seedValoraciones() {
  const dias = (n) => new Date(Date.now() - n * 24 * 3600 * 1000).toISOString();
  const gen = (slug, pos, neg, spread) => {
    const out = [];
    for (let i = 0; i < pos; i++) out.push({ id: `seed-${slug}-p${i}`, local_slug: slug, aviso_id: null, cumplio: true, comentario: '', created_at: dias((i * spread) % 120) });
    for (let i = 0; i < neg; i++) out.push({ id: `seed-${slug}-n${i}`, local_slug: slug, aviso_id: null, cumplio: false, comentario: '', created_at: dias(((i + 1) * spread) % 90) });
    return out;
  };
  return [
    ...gen('la-nonna', 22, 1, 4),   // Refugio de la comunidad
    ...gen('casa-vera', 9, 1, 8),   // De confianza
    ...gen('alba-brunch', 4, 1, 14), // Valorado por la comunidad
  ];
}

function demoValoraciones() {
  try {
    const raw = localStorage.getItem(KEY_VALORACIONES);
    if (raw === null) {
      const seed = seedValoraciones();
      localStorage.setItem(KEY_VALORACIONES, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
}

function demoSaveValoraciones(vals) {
  localStorage.setItem(KEY_VALORACIONES, JSON.stringify(vals));
}

// ---------- API ----------

export async function getLocales() {
  if (DEMO_MODE) return DEMO_LOCALES;
  const s = await sb();
  const { data, error } = await s.from('locales').select('slug,nombre,barrio,direccion,activo').eq('activo', true).order('nombre');
  if (error) throw error;
  return data;
}

export async function getLocal(slug) {
  if (DEMO_MODE) return DEMO_LOCALES.find((l) => l.slug === slug) || null;
  const s = await sb();
  const { data } = await s.from('locales').select('slug,nombre,barrio,direccion,activo').eq('slug', slug).maybeSingle();
  return data;
}

export async function crearAviso({ localSlug, mesa, alergenos, sinTrazas, gravedad, separada, seleccion }) {
  const aviso = {
    id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
    local_slug: localSlug,
    mesa: String(mesa),
    alergenos,
    sin_trazas: !!sinTrazas,
    gravedad,
    elaboracion_separada: !!separada,
    seleccion: seleccion || [],
    estado: 'enviado',
    enviado_at: new Date().toISOString(),
    confirmado_at: null,
  };
  if (DEMO_MODE) {
    const avisos = demoAvisos();
    avisos.unshift(aviso);
    demoSaveAvisos(avisos);
    return aviso;
  }
  const s = await sb();
  const { data, error } = await s.from('avisos').insert({
    local_slug: aviso.local_slug,
    mesa: aviso.mesa,
    alergenos: aviso.alergenos,
    sin_trazas: aviso.sin_trazas,
    gravedad: aviso.gravedad,
    elaboracion_separada: aviso.elaboracion_separada,
    seleccion: aviso.seleccion,
  }).select().single();
  if (error) throw error;
  return data;
}

// Observa un aviso hasta que cambie de estado. Devuelve función de limpieza.
export function onAviso(avisoId, callback) {
  if (DEMO_MODE) {
    const check = () => {
      const a = demoAvisos().find((x) => x.id === avisoId);
      if (a) callback(a);
    };
    const interval = setInterval(check, 2000);
    const onStorage = (e) => { if (e.key === KEY_AVISOS) check(); };
    window.addEventListener('storage', onStorage);
    return () => { clearInterval(interval); window.removeEventListener('storage', onStorage); };
  }
  let channel = null;
  let interval = null;
  sb().then((s) => {
    channel = s
      .channel(`aviso-${avisoId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'avisos', filter: `id=eq.${avisoId}` }, (payload) => callback(payload.new))
      .subscribe();
    // Respaldo por si Realtime no está activado en el proyecto.
    interval = setInterval(async () => {
      const { data } = await s.from('avisos').select('*').eq('id', avisoId).maybeSingle();
      if (data) callback(data);
    }, 5000);
  });
  return () => {
    if (interval) clearInterval(interval);
    if (channel) sb().then((s) => s.removeChannel(channel));
  };
}

export async function verificarPin(localSlug, pin) {
  if (DEMO_MODE) {
    const l = DEMO_LOCALES.find((x) => x.slug === localSlug);
    return !!l && l.pin_sala === pin;
  }
  const s = await sb();
  const { data } = await s.from('locales').select('slug').eq('slug', localSlug).eq('pin_sala', pin).maybeSingle();
  return !!data;
}

export async function avisosDeLocal(localSlug) {
  if (DEMO_MODE) {
    return demoAvisos().filter((a) => a.local_slug === localSlug);
  }
  const s = await sb();
  const desde = new Date(Date.now() - 12 * 3600 * 1000).toISOString();
  const { data, error } = await s.from('avisos').select('*').eq('local_slug', localSlug).gte('enviado_at', desde).order('enviado_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function confirmarAviso(avisoId) {
  const confirmadoAt = new Date().toISOString();
  if (DEMO_MODE) {
    const avisos = demoAvisos();
    const a = avisos.find((x) => x.id === avisoId);
    if (a && a.estado === 'enviado') {
      a.estado = 'confirmado';
      a.confirmado_at = confirmadoAt;
      demoSaveAvisos(avisos);
    }
    return a;
  }
  const s = await sb();
  const { data, error } = await s.from('avisos').update({ estado: 'confirmado', confirmado_at: confirmadoAt }).eq('id', avisoId).eq('estado', 'enviado').select().maybeSingle();
  if (error) throw error;
  return data;
}

// Observa los avisos de un local (para el panel de sala).
export function onAvisosLocal(localSlug, callback) {
  const refresh = () => avisosDeLocal(localSlug).then(callback).catch(() => {});
  refresh();
  if (DEMO_MODE) {
    const interval = setInterval(refresh, 2000);
    const onStorage = (e) => { if (e.key === KEY_AVISOS) refresh(); };
    window.addEventListener('storage', onStorage);
    return () => { clearInterval(interval); window.removeEventListener('storage', onStorage); };
  }
  let channel = null;
  sb().then((s) => {
    channel = s
      .channel(`sala-${localSlug}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'avisos', filter: `local_slug=eq.${localSlug}` }, refresh)
      .subscribe();
  });
  const interval = setInterval(refresh, 8000);
  return () => {
    clearInterval(interval);
    if (channel) sb().then((s) => s.removeChannel(channel));
  };
}

// ---------- Valoraciones e insignias ----------

// Crea una valoración de una visita. `cumplio`: ¿prepararon el plato de forma
// segura (elaboración separada, respetando los alérgenos)? Una por aviso.
export async function crearValoracion({ localSlug, avisoId, cumplio, comentario }) {
  const val = {
    id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
    local_slug: localSlug,
    aviso_id: avisoId || null,
    cumplio: !!cumplio,
    comentario: (comentario || '').slice(0, 280),
    created_at: new Date().toISOString(),
  };
  if (DEMO_MODE) {
    const vals = demoValoraciones();
    vals.unshift(val);
    demoSaveValoraciones(vals);
    return val;
  }
  const s = await sb();
  const { data, error } = await s.from('valoraciones').insert({
    local_slug: val.local_slug,
    aviso_id: val.aviso_id,
    cumplio: val.cumplio,
    comentario: val.comentario,
  }).select().single();
  if (error) throw error;
  return data;
}

export async function getValoraciones(localSlug) {
  if (DEMO_MODE) return demoValoraciones().filter((v) => v.local_slug === localSlug);
  const s = await sb();
  const { data, error } = await s.from('valoraciones').select('cumplio,comentario,created_at').eq('local_slug', localSlug).order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

// Insignia de un local (nivel + estadísticas).
export async function getBadge(localSlug) {
  return calcularBadge(await getValoraciones(localSlug));
}

// Insignias de varios locales de una sola vez (para la lista de locales).
export async function getBadgesMap(slugs) {
  const map = {};
  if (DEMO_MODE) {
    const vals = demoValoraciones();
    for (const slug of slugs) map[slug] = calcularBadge(vals.filter((v) => v.local_slug === slug));
    return map;
  }
  const s = await sb();
  const { data, error } = await s.from('valoraciones').select('local_slug,cumplio,created_at').in('local_slug', slugs);
  if (error) throw error;
  for (const slug of slugs) map[slug] = calcularBadge((data || []).filter((v) => v.local_slug === slug));
  return map;
}
