
const CACHE_NAME = 'hft-prep-v1';
const CORE_ASSETS = [
  './',
  'index.html',
  'assets/css/styles.css',
  'assets/css/print.css',
  'assets/js/app.js',
  'assets/js/search.js',
  'assets/js/progress.js',
  'assets/js/quiz.js',
  'data/questions.json',
  'data/content-index.json',
  'content/study-plans/overview.md',
  'content/behavioral/foundations.md',
  'content/cpp/foundations.md',
  'content/systems/foundations.md',
  'content/low-latency/foundations.md',
  'content/design/foundations.md',
  'content/trading/foundations.md',
  'content/coding/foundations.md',
  'content/mock-interviews/guide.md'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});
