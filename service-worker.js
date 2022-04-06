var CACHE_NAME = 'my-web-app-version-v5';

self.addEventListener('install', event => {
    event.waitUntil(
         caches.open(CACHE_NAME)
         .then(cache => {
            return cache.addAll([
                './',
                './index.html',
                './ServiceWorkerUpdateListener.min.js'
            ]);
         })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) 
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            if (response) return response;

            return fetch(event.request)
            .then(response => {
                if (!response || response.status !== 200 || response.type !== 'basic') return response;

                var responseToCache = response.clone();

                caches.open(CACHE_NAME).then(cache => { 
                    cache.put(event.request, responseToCache) 
                });
            });
        })
    )
});

self.addEventListener('message', event => {
    if (event.data === 'skipWaiting') return skipWaiting();
});