import { ALERGENOS, GRAVEDADES, nombreAlergeno, iconoAlergeno, nombreGravedad } from './data.js';
import { getPerfil, setPerfil, getHistorial } from './profile.js';
import { DEMO_MODE } from './store.js';
import { initPage } from './fx.js';

const $ = (id) => document.getElementById(id);

initPage();
if (DEMO_MODE) $('demo-tag').classList.remove('hidden');

const perfil = getPerfil();
const editando = new URLSearchParams(location.search).has('editar');

if (perfil && !editando) {
  renderHome(perfil);
} else {
  renderOnboarding(perfil);
}

// ---------- Onboarding ----------

function renderOnboarding(previo) {
  $('onboarding').classList.remove('hidden');

  const sel = new Set(previo?.alergenos || []);
  let gravedad = previo?.gravedad || null;

  const cont = $('ob-alergenos');
  for (const a of ALERGENOS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip' + (sel.has(a.id) ? ' on' : '');
    b.innerHTML = `<span>${a.icono}</span>${a.nombre}`;
    b.onclick = () => {
      sel.has(a.id) ? sel.delete(a.id) : sel.add(a.id);
      b.classList.toggle('on');
      actualizar();
    };
    cont.appendChild(b);
  }

  const segCont = $('ob-gravedad');
  for (const g of GRAVEDADES) {
    const d = document.createElement('div');
    d.className = 'opt' + (gravedad === g.id ? ' on' : '');
    d.innerHTML = `<div class="t">${g.nombre}</div><div class="d">${g.detalle}</div>`;
    d.onclick = () => {
      gravedad = g.id;
      segCont.querySelectorAll('.opt').forEach((o) => o.classList.remove('on'));
      d.classList.add('on');
      actualizar();
    };
    segCont.appendChild(d);
  }

  if (previo) {
    $('ob-trazas').checked = !!previo.sinTrazas;
    $('ob-separada').checked = !!previo.separada;
  }

  function actualizar() {
    $('ob-guardar').disabled = !(sel.size > 0 && gravedad);
  }
  actualizar();

  $('ob-guardar').onclick = () => {
    setPerfil({
      alergenos: [...sel],
      gravedad,
      sinTrazas: $('ob-trazas').checked,
      separada: $('ob-separada').checked,
      creado: previo?.creado || new Date().toISOString(),
    });
    location.href = 'index.html';
  };
}

// ---------- Home ----------

function renderHome(p) {
  $('home').classList.remove('hidden');

  const chips = $('perfil-chips');
  for (const id of p.alergenos) {
    const s = document.createElement('span');
    s.className = 'chip mini on';
    s.innerHTML = `<span>${iconoAlergeno(id)}</span>${nombreAlergeno(id)}`;
    chips.appendChild(s);
  }

  const detalles = [nombreGravedad(p.gravedad)];
  if (p.sinTrazas) detalles.push('sin trazas');
  if (p.separada) detalles.push('elaboración separada');
  $('perfil-detalle').textContent = detalles.join(' · ');

  $('editar').onclick = () => (location.href = 'index.html?editar');

  $('ir-aviso').onclick = () => {
    const local = $('codigo-local').value.trim().toLowerCase();
    const mesa = $('num-mesa').value.trim();
    if (!local) return $('codigo-local').focus();
    if (!mesa) return $('num-mesa').focus();
    location.href = `aviso.html?l=${encodeURIComponent(local)}&m=${encodeURIComponent(mesa)}`;
  };

  renderHistorial();
}

function renderHistorial() {
  const h = getHistorial();
  const cont = $('historial');
  if (h.length === 0) {
    cont.innerHTML = '<div class="item"><span class="meta">Aún no has enviado ningún aviso. Tu historial aparecerá aquí.</span></div>';
    return;
  }
  for (const e of h.slice(0, 8)) {
    const d = new Date(e.fecha);
    const fecha = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) + ' · ' +
      d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <div class="head">
        <span class="t">${e.localNombre || e.localSlug}</span>
        <span class="badge ${e.estado}">${e.estado === 'confirmado' ? 'Confirmado' : 'Enviado'}</span>
      </div>
      <div class="meta">Mesa ${e.mesa} · ${fecha}</div>`;
    cont.appendChild(div);
  }
}
