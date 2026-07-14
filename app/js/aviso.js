import { nombreAlergeno, iconoAlergeno, nombreGravedad } from './data.js';
import { getPerfil, addHistorial, updateHistorial } from './profile.js';
import { getLocal, crearAviso, onAviso } from './store.js';

const $ = (id) => document.getElementById(id);
document.querySelectorAll('[data-brand]').forEach((el) => (el.textContent = window.APP_CONFIG.appName));

const params = new URLSearchParams(location.search);
const slug = (params.get('l') || '').toLowerCase();
const mesa = params.get('m') || '';

init();

async function init() {
  const perfil = getPerfil();
  if (!perfil) {
    $('no-perfil').classList.remove('hidden');
    // Al terminar el perfil, volver aquí directamente.
    $('crear-perfil-link').href = 'index.html';
    return;
  }

  const local = slug ? await getLocal(slug) : null;
  if (!local || local.activo === false) {
    $('no-local').classList.remove('hidden');
    return;
  }

  $('envio').classList.remove('hidden');
  $('titulo-local').textContent = local.nombre;
  $('sub-mesa').textContent = mesa
    ? `Mesa ${mesa} · ${local.barrio || ''}`
    : (local.barrio || '');

  const chips = $('resumen-chips');
  for (const id of perfil.alergenos) {
    const s = document.createElement('span');
    s.className = 'chip mini on';
    s.innerHTML = `<span>${iconoAlergeno(id)}</span>${nombreAlergeno(id)}`;
    chips.appendChild(s);
  }
  const detalles = [`Mesa ${mesa || '—'}`, nombreGravedad(perfil.gravedad)];
  if (perfil.sinTrazas) detalles.push('no tolera trazas');
  if (perfil.separada) detalles.push('requiere elaboración separada');
  $('resumen-detalle').textContent = detalles.join(' · ');

  $('consentimiento').onchange = (e) => ($('enviar').disabled = !e.target.checked);

  $('enviar').onclick = async () => {
    $('enviar').disabled = true;
    $('enviar').textContent = 'Enviando…';
    try {
      const aviso = await crearAviso({
        localSlug: local.slug,
        mesa: mesa || '—',
        alergenos: perfil.alergenos,
        sinTrazas: perfil.sinTrazas,
        gravedad: perfil.gravedad,
        separada: perfil.separada,
      });
      addHistorial({
        avisoId: aviso.id,
        localSlug: local.slug,
        localNombre: local.nombre,
        mesa: aviso.mesa,
        estado: 'enviado',
        fecha: aviso.enviado_at,
      });
      mostrarEstado(aviso, local);
    } catch (err) {
      $('enviar').disabled = false;
      $('enviar').textContent = 'Avisar a cocina';
      alert('No se pudo enviar el aviso. Comprueba tu conexión y, mientras tanto, avisa en persona a tu camarero.');
    }
  };
}

function mostrarEstado(aviso, local) {
  $('envio').classList.add('hidden');
  $('estado').classList.remove('hidden');
  $('estado-sub').textContent = `${local.nombre} · Mesa ${aviso.mesa}`;

  const timeoutMs = (window.APP_CONFIG.confirmTimeoutMin || 5) * 60 * 1000;
  const timeoutId = setTimeout(() => {
    if (!$('confirmado').classList.contains('hidden')) return;
    $('timeout-card').classList.remove('hidden');
  }, timeoutMs);

  const stop = onAviso(aviso.id, (a) => {
    if (a.estado === 'confirmado') {
      clearTimeout(timeoutId);
      stop();
      $('esperando').classList.add('hidden');
      $('timeout-card').classList.add('hidden');
      $('confirmado').classList.remove('hidden');
      $('estado-titulo').textContent = 'Todo listo';
      const hora = new Date(a.confirmado_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      $('hora-confirmacion').textContent = `Confirmado a las ${hora} · queda registrado en tu historial`;
      updateHistorial(aviso.id, { estado: 'confirmado', confirmado: a.confirmado_at });
    }
  });
}
