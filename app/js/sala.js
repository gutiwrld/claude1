import { nombreAlergeno, iconoAlergeno, nombreGravedad } from './data.js';
import { getLocal, verificarPin, onAvisosLocal, confirmarAviso, getBadge } from './store.js';
import { insigniaHeroHTML, siguienteNivel } from './badge.js';
import { initPage } from './fx.js';

const $ = (id) => document.getElementById(id);
initPage();

const SESION_KEY = 'aliva_sala_sesion';
let stopWatch = null;

// Sesión recordada en el dispositivo del local.
const sesion = JSON.parse(sessionStorage.getItem(SESION_KEY) || 'null');
if (sesion) abrirPanel(sesion.slug);

$('entrar').onclick = async () => {
  const slug = $('sala-local').value.trim().toLowerCase();
  const pin = $('sala-pin').value.trim();
  $('acceso-error').textContent = '';
  if (!slug || !pin) return;
  $('entrar').disabled = true;
  const ok = await verificarPin(slug, pin).catch(() => false);
  $('entrar').disabled = false;
  if (!ok) {
    $('acceso-error').textContent = 'Código o PIN incorrectos.';
    return;
  }
  sessionStorage.setItem(SESION_KEY, JSON.stringify({ slug }));
  abrirPanel(slug);
};

async function abrirPanel(slug) {
  const local = await getLocal(slug);
  if (!local) return;
  $('acceso').classList.add('hidden');
  $('panel').classList.remove('hidden');
  $('panel-titulo').textContent = local.nombre;

  mostrarInsignia(slug);
  if (stopWatch) stopWatch();
  stopWatch = onAvisosLocal(slug, render);
}

// La insignia del propio local + cuánto falta para el siguiente nivel:
// convierte la reputación de comunidad en un objetivo tangible para el equipo.
async function mostrarInsignia(slug) {
  try {
    const badge = await getBadge(slug);
    $('insignia-sala').innerHTML = insigniaHeroHTML(badge);
    const sig = siguienteNivel(badge);
    $('progreso-sala').textContent = sig
      ? `Os faltan ${sig.faltan} ${sig.unidad} para "${sig.objetivo}". La ganan vuestros clientes cuando confirman que les cuidasteis bien.`
      : (badge.id === 'refugio'
          ? 'Nivel máximo. Mantenedlo: la insignia baja si llegan valoraciones negativas.'
          : 'La insignia refleja lo que valora la comunidad y puede bajar si hay incidencias.');
  } catch {}
}

function render(avisos) {
  const pendientes = avisos.filter((a) => a.estado === 'enviado');
  const confirmados = avisos.filter((a) => a.estado === 'confirmado');

  const pc = $('pendientes');
  pc.innerHTML = '';
  if (pendientes.length === 0) {
    pc.innerHTML = '<div class="item"><span class="meta">Sin avisos pendientes ahora mismo.</span></div>';
  }
  for (const a of pendientes) pc.appendChild(tarjeta(a, true));

  const cc = $('confirmados');
  cc.innerHTML = '';
  if (confirmados.length === 0) {
    cc.innerHTML = '<div class="item"><span class="meta">Todavía nada por aquí.</span></div>';
  }
  for (const a of confirmados.slice(0, 10)) cc.appendChild(tarjeta(a, false));
}

function tarjeta(a, pendiente) {
  const div = document.createElement('div');
  div.className = 'item';
  const hora = new Date(a.enviado_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  const detalles = [nombreGravedad(a.gravedad)];
  if (a.sin_trazas) detalles.push('no tolera trazas');
  if (a.elaboracion_separada) detalles.push('elaboración separada, solo para esta persona');

  const pedido = a.seleccion || [];
  const pedidoHTML = pedido.length
    ? `<div class="sala-pedido">
         <div class="sala-pedido-t">Pedido de la mesa</div>
         ${pedido.map((it) => `<div class="sala-plato"><span>${it.nombre}</span>${it.sin && it.sin.length ? `<span class="sin">sin ${it.sin.map(nombreAlergeno).join(', ')}</span>` : ''}</div>`).join('')}
       </div>`
    : '';

  div.innerHTML = `
    <div class="head">
      <span class="t">Mesa ${a.mesa}</span>
      <span class="badge ${a.estado}">${pendiente ? hora : 'Confirmado'}</span>
    </div>
    <div class="chips" style="margin:8px 0">
      ${a.alergenos.map((id) => `<span class="chip mini on"><span>${iconoAlergeno(id)}</span>${nombreAlergeno(id)}</span>`).join('')}
    </div>
    <div class="meta">${detalles.join(' · ')}</div>
    ${pedidoHTML}`;

  if (pendiente) {
    const btn = document.createElement('button');
    btn.className = 'btn small';
    btn.style.marginTop = '12px';
    btn.textContent = 'Confirmar: sala y cocina enterados';
    btn.onclick = async () => {
      btn.disabled = true;
      await confirmarAviso(a.id).catch(() => (btn.disabled = false));
    };
    div.appendChild(btn);
  }
  return div;
}
