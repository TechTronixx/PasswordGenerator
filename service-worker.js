const STATIC_CACHE = "static-cache-v1"
const static_assets = [
    "/",
    "/index.html",
    "/script.js",
    "/image/icon-32.png",
    "/image/icon-48.png",
    "/image/icon-64.png",
    "/image/icon-72.png",
    // "/image/icon-96.png",
    "/image/icon-128.png",
    "/image/icon-256.png",
]

// storing static assets in cache on service worker install
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(STATIC_CACHE).then(cache => {
            cache.addAll(static_assets)
        })
    )
})

// returning static assets from cache
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    )
});