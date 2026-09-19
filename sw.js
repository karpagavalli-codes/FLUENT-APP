/**
 * FLUENT - Service Worker for PWA Offline Caching & Desktop App Speed
 */
const CACHE_NAME = 'fluent-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/main.css',
  './css/components.css',
  './css/views.css',
  './js/logo.js',
  './js/storage.js',
  './js/topics.js',
  './js/frameworks.js',
  './js/vocabulary.js',
  './js/recording.js',
  './js/analyzer.js',
  './js/views/homeView.js',
  './js/views/practiceView.js',
  './js/views/frameworksView.js',
  './js/views/vocabularyView.js',
  './js/views/progressView.js',
  './js/views/historyView.js',
  './js/views/profileView.js',
  './js/app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
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
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Navigation request fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('./index.html');
      })
    );
  } else {
    // Network-first strategy: fetch latest from network, update cache, fallback to cache when offline
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
});
