// Service Worker for Star Quest (Offline PWA)
const CACHE_NAME = 'lyras-star-quest-v7';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/styles.css',
  './js/audio.js',
  './js/math-engine.js',
  './js/easter-eggs.js',
  './js/badge.js',
  './js/app.js',
  './assets/icon.svg',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Fallback to cache index if network fails
        return caches.match('./index.html');
      });
    })
  );
});
