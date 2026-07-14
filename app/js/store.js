// Capa de datos: Supabase si está configurado, modo demo local si no.
//
// En modo demo los avisos se guardan en localStorage: el flujo completo
// (enviar aviso → confirmar desde sala.html en otra pestaña) funciona en
// un mismo dispositivo sin backend. En el piloto Wizard of Oz real, el
// aviso además se reenvía por WhatsApp al receptor de sala vía n8n
// (webhook sobre INSERT en la tabla avisos).

const cfg = window.APP_CONFIG;
export const DEMO_MODE = !(cfg.supabaseUrl && cfg.supabaseAnonKey);

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

const KEY_AVISOS = 'salvia_demo_avisos';

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

export async function crearAviso({ localSlug, mesa, alergenos, sinTrazas, gravedad, separada }) {
  const aviso = {
    id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
    local_slug: localSlug,
    mesa: String(mesa),
    alergenos,
    sin_trazas: !!sinTrazas,
    gravedad,
    elaboracion_separada: !!separada,
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
