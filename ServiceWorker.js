const STATIC_CACHE = "static-cache-v1";
const static_assets = [
  "/",
  "index.html",
  "/css/style.css",
  "/PWA/script.js",
  "/js/icon.js",
  "/js/password-generator.js",
  "manifest.json",
  "/assets/favicon.ico",
  "/assets/PWA/32.png",
  "/assets/PWA/48.png",
  "/assets/PWA/64.png",
  "/assets/PWA/72.png",
  "assets/PWA/128.png",
  "assets/PWA/256.png",
];

//Installing Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(static_assets);
    })
  );
});

//Fetching Service Worker
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

//Activating Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((STATIC_CACHEs) => {
      return Promise.all(
        STATIC_CACHEs.map((STATIC_CACHE) => {
          if (STATIC_CACHE !== STATIC_CACHE) {
            return caches.delete(STATIC_CACHE);
          }
        })
      );
    })
  );
});

