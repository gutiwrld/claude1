// Service worker de Aliva (PWA).
//
// Estrategia:
//   - Navegaciones (HTML): red primero, con la caché como respaldo offline.
//     Así el usuario siempre ve la última versión si hay conexión, pero la app
//     abre aunque esté sin cobertura (típico en sótanos de restaurantes).
//   - Recursos estáticos propios (CSS/JS/iconos): caché primero (instantáneo).
//   - Nada cross-origin se cachea aquí (p. ej. supabase-js desde esm.sh): se
//     deja pasar a la red tal cual.
//
// Sube CACHE_VERSION al cambiar el armazón para invalidar la caché antigua.

const CACHE_VERSION = 'aliva-v3';
const SHELL = [
  './',
  './index.html',
  './carta.html',
  './aviso.html',
  './sala.html',
  './locales.html',
  './css/styles.css',
  './js/config.js',
  './js/data.js',
  './js/menu.js',
  './js/profile.js',
  './js/store.js',
  './js/badge.js',
  './js/fx.js',
  './js/index.js',
  './js/carta.js',
  './js/aviso.js',
  './js/sala.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Solo gestionamos peticiones de nuestro propio origen.
  if (url.origin !== self.location.origin) return;

  // Navegaciones: red primero, caché de respaldo.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((resp) => {
          const copy = resp.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(request, copy));
          return resp;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  // Estáticos: caché primero, y de paso se actualiza en segundo plano.
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetched = fetch(request)
        .then((resp) => {
          if (resp && resp.status === 200) {
            const copy = resp.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(request, copy));
          }
          return resp;
        })
        .catch(() => cached);
      return cached || fetched;
    })
  );
});
