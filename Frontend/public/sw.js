// Service Worker for propnews24 PWA
// Bump CACHE_VERSION on every deploy to wipe stale caches
const CACHE_VERSION = 'propnews24-v4';

// App shell — only small, stable files that rarely change
const SHELL_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg',
];

// ── Install ───────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(SHELL_URLS))
      .catch(() => {}) // don't block install if shell pre-cache fails
  );
  // Take over immediately — don't wait for old SW to die
  self.skipWaiting();
});

// ── Activate — wipe ALL old caches ───────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_VERSION)
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Never intercept non-GET requests
  if (request.method !== 'GET') return;

  // Never intercept API calls — always hit the network
  if (url.pathname.startsWith('/api/')) return;

  // Never intercept cross-origin requests (fonts, CDN, etc.)
  if (url.origin !== self.location.origin) return;

  // ── Hashed assets (/assets/*.js, /assets/*.css) ───────────────────────────
  // These have content hashes in their filenames so they're immutable.
  // Strategy: network-first so a new deploy always gets fresh files.
  // If network fails AND we have a cached copy, serve it.
  // If both fail, let the browser show its own error (don't serve stale JS).
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
        // If cache also misses, return a synthetic 503 so the browser
        // shows a proper error instead of a silent hang
        .then((r) => r || new Response('Asset not available offline', { status: 503 }))
    );
    return;
  }

  // ── Navigation requests (HTML pages) ─────────────────────────────────────
  // Network-first; fall back to cached /index.html for offline SPA routing
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // ── Other static files (images, svg, manifest, etc.) ─────────────────────
  // Cache-first; update cache in background
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request).then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, clone));
        }
        return response;
      }).catch(() => null);

      return cached || networkFetch;
    })
  );
});

// ── Push notifications ────────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/logo.svg',
    badge: '/logo.svg',
    vibrate: [100, 50, 100],
  };
  event.waitUntil(
    self.registration.showNotification('propnews24', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
