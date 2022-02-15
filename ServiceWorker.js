const STATIC_CACHE = "static-cache-v1"
const static_assets = [
    "/",
    "/index.html",
    "/script.js",
    "/assets/PWA/32.png",
    "/assets/PWA/48.png",
    "/assets/PWA/64.png",
    "/assets/PWA/72.png",
    // "/image/icon-96.png",
    "assets/PWA/128.png",
    "assets/PWA/256.png",
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