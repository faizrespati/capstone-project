const CACHE_NAME = 'cashflow-v1.0.0';
const urlsToCache = [
    '/capstone-project/cashflow.html',
    '/capstone-project/css/style.css',
    '/capstone-project/js/app.js',
    '/capstone-project/js/database.js',
    '/capstone-project/js/charts.js',
    '/capstone-project/js/pwa.js',
    '/capstone-project/manifest.json',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});