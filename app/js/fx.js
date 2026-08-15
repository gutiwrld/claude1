// Efectos visuales de Aliva: fondo aurora, reveals en cascada y
// partículas de confirmación. Todo respeta prefers-reduced-motion.

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Fondo aurora (canvas fijo detrás del contenido) ----------
// Manchas de luz radiales que derivan lentamente sobre negro profundo,
// el equivalente ligero de las ondas de seda de las apps de referencia.

const BLOBS = [
  { c: [111, 232, 185], r: 0.55, a: 0.10, sx: 0.00013, sy: 0.00009, px: 0.15, py: -0.1 },
  { c: [165, 180, 252], r: 0.48, a: 0.08, sx: 0.00009, sy: 0.00012, px: 0.9, py: 0.05 },
  { c: [244, 196, 143], r: 0.42, a: 0.05, sx: 0.00007, sy: 0.00008, px: 0.55, py: 0.4 },
  { c: [52, 201, 154], r: 0.5, a: 0.07, sx: 0.00011, sy: 0.00007, px: 0.3, py: 0.95 },
];

export function initAurora() {
  // El tema claro (BRAND.md) usa fondo paper por CSS; el lienzo oscuro ya no
  // se pinta. Se deja la función por compatibilidad.
  return;
  // eslint-disable-next-line no-unreachable
  const canvas = document.getElementById('bg-aurora');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;

  const resize = () => {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
  };
  resize();
  addEventListener('resize', resize);

  const draw = (t) => {
    ctx.fillStyle = '#07080a';
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    for (const b of BLOBS) {
      const x = (b.px + Math.sin(t * b.sx) * 0.28) * w;
      const y = (b.py + Math.cos(t * b.sy) * 0.3) * h;
      const r = b.r * Math.max(w, h);
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},${b.a})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  };

  if (reduceMotion) {
    draw(40000);
    return;
  }

  let raf;
  const loop = (t) => {
    draw(t);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(loop);
  });
}

// ---------- Reveals en cascada ----------
// Los elementos .reveal entran escalonados al aparecer en pantalla.

export function initReveals() {
  const els = [...document.querySelectorAll('.reveal')];
  els.forEach((el, i) => { if (!el.style.getPropertyValue('--i')) el.style.setProperty('--i', i % 6); });
  if (reduceMotion || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }
  }, { threshold: 0.08 });
  els.forEach((el) => io.observe(el));
}

// ---------- Partículas de confirmación ----------
// Ráfaga suave de luz menta/lavanda desde el centro del elemento dado.

export function celebrate(fromEl) {
  if (reduceMotion) return;
  const rect = fromEl ? fromEl.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 3, width: 0, height: 0 };
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:100';
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const COLORS = ['14,140,99', '87,199,154', '255,202,75', '10,42,34'];
  const parts = Array.from({ length: 70 }, () => {
    const ang = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 5.5;
    return {
      x: cx, y: cy,
      vx: Math.cos(ang) * speed,
      vy: Math.sin(ang) * speed - 1.5,
      r: 1.5 + Math.random() * 3,
      c: COLORS[(Math.random() * COLORS.length) | 0],
      life: 1,
      decay: 0.012 + Math.random() * 0.014,
    };
  });

  const tick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    for (const p of parts) {
      if (p.life <= 0) continue;
      alive = true;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06;
      p.vx *= 0.985;
      p.life -= p.decay;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${p.c},${Math.max(p.life, 0) * 0.9})`;
      ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
      ctx.fill();
    }
    if (alive) requestAnimationFrame(tick);
    else canvas.remove();
  };
  requestAnimationFrame(tick);
}

// ---------- Service worker (PWA) ----------
// Registra el service worker para que la app se instale y abra offline.
// Se salta en file:// (donde los SW no funcionan) para no ensuciar la consola.
function initPWA() {
  if (!('serviceWorker' in navigator)) return;
  if (location.protocol === 'file:') return;
  addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js', { scope: './' }).catch(() => {});
  });
}

// Botón flotante "Instalar" que aparece solo si el navegador permite instalar
// la PWA (Android/Chrome/Edge). En iOS no existe este evento: se instala con
// Compartir → "Añadir a pantalla de inicio" (explicado en el README).
function initInstallPrompt() {
  let deferred = null;
  addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e;
    if (document.querySelector('.install-fab')) return;
    const b = document.createElement('button');
    b.className = 'install-fab';
    b.innerHTML = '<span class="orb-dot" style="width:14px;height:14px"></span> Instalar Aliva';
    b.onclick = async () => {
      if (!deferred) return;
      deferred.prompt();
      await deferred.userChoice.catch(() => {});
      deferred = null;
      b.remove();
    };
    document.body.appendChild(b);
  });
  addEventListener('appinstalled', () => {
    const b = document.querySelector('.install-fab');
    if (b) b.remove();
  });
}

// ---------- Arranque común de página ----------
export function initPage() {
  document.querySelectorAll('[data-brand]').forEach((el) => (el.textContent = window.APP_CONFIG.appName));
  initAurora();
  initReveals();
  initPWA();
  initInstallPrompt();
}
