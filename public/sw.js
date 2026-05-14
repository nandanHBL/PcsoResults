// PWA Service Worker for Lotto Results PH
const CACHE_NAME = 'lotto-results-ph-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (e) => {
  // Network first fallback to cache for highly dynamic lotto results
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request).then((res) => {
        if (res) return res;
        // Standard blank SVG response for broken imagery in offline mode
        if (e.request.url.includes('.svg') || e.request.url.includes('.png')) {
          return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect width="20" height="20" x="2" y="2" rx="2" ry="2"/></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
        }
        return new Response('Internet Connection Lost. Please try again.', { status: 503 });
      });
    })
  );
});
