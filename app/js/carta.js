import { nombreAlergeno, iconoAlergeno } from './data.js';
import { getLocal, getMenu, getBadge } from './store.js';
import { clasificarPlato, ESTADO_META } from './menu.js';
import { insigniaChipHTML } from './badge.js';
import {
  getPerfil, contextoSeleccion, getSeleccion, setItemSeleccion, quitarItemSeleccion,
} from './profile.js';
import { initPage } from './fx.js';

const $ = (id) => document.getElementById(id);
initPage();

const params = new URLSearchParams(location.search);
const slug = (params.get('l') || '').toLowerCase();
const mesa = params.get('m') || '';

let perfil = getPerfil();
let menu = null;
let filtro = perfil ? 'para-ti' : 'todo';

init();

async function init() {
  const local = slug ? await getLocal(slug) : null;
  if (!local || local.activo === false) {
    $('no-local').classList.remove('hidden');
    return;
  }
  $('carta').classList.remove('hidden');
  $('titulo-local').textContent = local.nombre;
  $('sub-mesa').textContent = [mesa ? `Mesa ${mesa}` : '', local.barrio].filter(Boolean).join(' · ');

  contextoSeleccion(slug, mesa);

  getBadge(slug).then((b) => { $('insignia-local').innerHTML = insigniaChipHTML(b); }).catch(() => {});

  renderBanner();
  renderFiltros();

  menu = await getMenu(slug);
  renderMenu();
  actualizarBarra();

  $('sel-enviar').onclick = () => {
    location.href = `aviso.html?l=${encodeURIComponent(slug)}&m=${encodeURIComponent(mesa)}`;
  };
  $('sheet-backdrop').onclick = cerrarSheet;
}

function renderBanner() {
  const cont = $('perfil-banner');
  if (perfil) {
    const chips = perfil.alergenos
      .map((id) => `<span class="chip mini on"><span>${iconoAlergeno(id)}</span>${nombreAlergeno(id)}</span>`)
      .join('');
    cont.innerHTML = `
      <div style="font-weight:600;margin-bottom:8px">Carta filtrada para ti</div>
      <div class="chips" style="margin-bottom:6px">${chips}</div>
      <div style="color:var(--muted);font-size:0.82rem">Marcamos qué encaja contigo y qué se puede adaptar. Cambia tu perfil desde “Mi perfil”.</div>`;
  } else {
    cont.classList.remove('soft');
    cont.classList.add('live');
    cont.innerHTML = `
      <div style="font-weight:600;margin-bottom:6px">Crea tu perfil para ver qué puedes comer</div>
      <div style="color:var(--muted);font-size:0.85rem;margin-bottom:12px">Con tu perfil de alergias, la carta se ordena sola: qué encaja contigo y qué platos se pueden pedir “sin” tu alérgeno.</div>
      <a class="btn small" href="index.html">Crear mi perfil</a>`;
  }
}

function renderFiltros() {
  const cont = $('filtros');
  const opciones = perfil
    ? [['para-ti', 'Para ti'], ['adaptables', 'Se pueden adaptar'], ['todo', 'Toda la carta']]
    : [['todo', 'Toda la carta']];
  cont.innerHTML = '';
  for (const [id, txt] of opciones) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'menu-filter' + (filtro === id ? ' on' : '');
    b.textContent = txt;
    b.onclick = () => {
      filtro = id;
      cont.querySelectorAll('.menu-filter').forEach((x) => x.classList.remove('on'));
      b.classList.add('on');
      renderMenu();
    };
    cont.appendChild(b);
  }
}

function incluir(estado) {
  if (filtro === 'todo') return true;
  if (filtro === 'adaptables') return estado === 'adaptable';
  // 'para-ti'
  return estado === 'seguro' || estado === 'trazas' || estado === 'adaptable';
}

function renderMenu() {
  const cont = $('menu');
  cont.innerHTML = '';
  let visibles = 0;

  for (const cat of menu.categorias) {
    const platosVis = cat.platos.filter((p) => incluir(clasificarPlato(p, perfil).estado));
    if (!platosVis.length) continue;

    const h = document.createElement('h2');
    h.className = 'menu-cat';
    h.textContent = cat.nombre;
    cont.appendChild(h);

    for (const p of platosVis) {
      visibles++;
      cont.appendChild(tarjetaPlato(p));
    }
  }

  if (!visibles) {
    cont.innerHTML = `<div class="item"><span class="meta">No hay platos que encajen con este filtro. Prueba “Toda la carta” y habla con tu camarero.</span></div>`;
  }
}

function tarjetaPlato(p) {
  const cls = clasificarPlato(p, perfil);
  const meta = ESTADO_META[cls.estado];
  const precio = `${p.precio.toFixed(2).replace('.', ',')} ${menu.moneda}`;
  const enSeleccion = (getSeleccion()?.items || []).some((x) => x.dishId === p.id);

  const div = document.createElement('div');
  div.className = 'dish' + (cls.estado === 'contiene' ? ' atenuado' : '');

  let extra = '';
  if (perfil && cls.estado === 'adaptable') {
    extra = `<div class="dish-note">Se puede pedir sin ${cls.removiblesQueAyudan.map(nombreAlergeno).join(', ')}</div>`;
  } else if (perfil && cls.estado === 'contiene') {
    extra = `<div class="dish-note">Contiene ${cls.noRemovibles.map(nombreAlergeno).join(', ')} · no se puede quitar</div>`;
  } else if (perfil && cls.estado === 'trazas') {
    extra = `<div class="dish-note">Puede contener trazas de ${cls.trazasConflicto.map(nombreAlergeno).join(', ')}</div>`;
  }

  div.innerHTML = `
    <div class="dish-head">
      <span class="dish-name">${p.nombre}${enSeleccion ? ' <span class="dish-check">✓</span>' : ''}</span>
      <span class="dish-price">${precio}</span>
    </div>
    <div class="dish-desc">${p.desc}</div>
    ${perfil && meta.etiqueta ? `<span class="dish-status ${meta.clase}">${meta.etiqueta}</span>` : ''}
    ${extra}`;

  div.onclick = () => abrirSheet(p);
  return div;
}

// ---------- Hoja de detalle del plato ----------

let sheetTimer = null;

function abrirSheet(p) {
  if (sheetTimer) { clearTimeout(sheetTimer); sheetTimer = null; }
  const cls = clasificarPlato(p, perfil);
  const meta = ESTADO_META[cls.estado];
  const guardado = (getSeleccion()?.items || []).find((x) => x.dishId === p.id);

  // Alérgenos que se pueden quitar: los "removibles" del plato. Pre-marcamos
  // los que chocan con el perfil (para que salga seguro por defecto).
  const removibles = p.removibles || [];
  const preSel = new Set(guardado ? guardado.sin : (perfil ? cls.removiblesQueAyudan : []));

  const chipsAlergenos = (p.contiene || []).map((id) => {
    const conflicto = perfil && perfil.alergenos.includes(id);
    return `<span class="chip mini ${conflicto ? 'on' : ''}"><span>${iconoAlergeno(id)}</span>${nombreAlergeno(id)}</span>`;
  }).join('') || '<span style="color:var(--muted);font-size:0.85rem">Sin alérgenos declarados</span>';

  const togglesRemovibles = removibles.length
    ? `<div class="sheet-sec">
         <div class="sheet-sec-t">Pídelo sin…</div>
         ${removibles.map((id) => `
           <label class="row" style="padding:8px 0">
             <span class="lbl">Sin ${nombreAlergeno(id)}</span>
             <span class="switch"><input type="checkbox" data-alg="${id}" ${preSel.has(id) ? 'checked' : ''}/><span class="track"></span></span>
           </label>`).join('')}
       </div>`
    : '';

  const contieneNoRem = perfil && cls.estado === 'contiene';

  $('sheet').innerHTML = `
    <div class="sheet-handle"></div>
    <div class="sheet-head">
      <div class="sheet-name">${p.nombre}</div>
      <div class="sheet-price">${p.precio.toFixed(2).replace('.', ',')} ${menu.moneda}</div>
    </div>
    <div class="dish-desc" style="margin-bottom:14px">${p.desc}</div>
    ${perfil && meta.etiqueta ? `<span class="dish-status ${meta.clase}" style="margin-bottom:14px">${meta.etiqueta}</span>` : ''}
    <div class="sheet-sec">
      <div class="sheet-sec-t">Alérgenos${perfil ? ' (en verde, los tuyos)' : ''}</div>
      <div class="chips">${chipsAlergenos}</div>
      ${(p.trazas || []).length ? `<div class="dish-note" style="margin-top:8px">Puede contener trazas de ${p.trazas.map(nombreAlergeno).join(', ')}</div>` : ''}
    </div>
    ${togglesRemovibles}
    ${contieneNoRem ? `<div class="card amber" style="margin:4px 0 14px;padding:12px 14px;font-size:0.86rem">Este plato contiene <strong>${cls.noRemovibles.map(nombreAlergeno).join(', ')}</strong> y no se puede quitar. Aparece para tu información.</div>` : ''}
    <button class="btn" id="sheet-add">${guardado ? 'Actualizar en mi pedido' : 'Añadir a mi pedido'}</button>
    ${guardado ? '<button class="btn ghost" id="sheet-remove" style="margin-top:9px">Quitar del pedido</button>' : ''}
    <p class="always-note" style="padding-top:12px">Aunque lo pidas “sin”, <strong>dilo también a tu camarero</strong>. Es una petición, no una garantía.</p>`;

  $('sheet-add').onclick = () => {
    const sin = [...$('sheet').querySelectorAll('input[data-alg]:checked')].map((i) => i.dataset.alg);
    setItemSeleccion({ dishId: p.id, localSlug: slug, mesa, nombre: p.nombre, precio: p.precio, sin });
    cerrarSheet();
    renderMenu();
    actualizarBarra();
  };
  const rm = $('sheet-remove');
  if (rm) rm.onclick = () => {
    quitarItemSeleccion(p.id);
    cerrarSheet();
    renderMenu();
    actualizarBarra();
  };

  $('sheet-backdrop').classList.remove('hidden');
  $('sheet').classList.remove('hidden');
  requestAnimationFrame(() => $('sheet').classList.add('open'));
}

function cerrarSheet() {
  $('sheet').classList.remove('open');
  $('sheet-backdrop').classList.add('hidden');
  if (sheetTimer) clearTimeout(sheetTimer);
  sheetTimer = setTimeout(() => { $('sheet').classList.add('hidden'); sheetTimer = null; }, 220);
}

function actualizarBarra() {
  const n = getSeleccion()?.items?.length || 0;
  const bar = $('sel-bar');
  if (n > 0) {
    $('sel-count').textContent = n;
    bar.classList.remove('hidden');
  } else {
    bar.classList.add('hidden');
  }
}
