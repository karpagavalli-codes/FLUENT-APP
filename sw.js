/**
 * FLUENT - Service Worker for PWA Offline Caching & Desktop App Speed
 */
const CACHE_NAME = 'fluent-v1';
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
  // Network first for dynamic search/scholar calls, cache first for static app shell
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('./index.html');
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
});
