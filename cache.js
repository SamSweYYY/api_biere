const ressourcestoCache = [

    'index.html',
    'ajouter.html',
    'styles.css',
    'index.js',
    'ajouter.js',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('beer-cache-v1')
        .then(cache => {
            return cache.addAll(ressourcestoCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
