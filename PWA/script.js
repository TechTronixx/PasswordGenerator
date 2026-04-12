// ---- Service Worker registration ----
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("ServiceWorker.js")
      .then(() => console.log("Service Worker registered."))
      .catch((err) => console.warn("Service Worker registration failed:", err));
  });
}

// ---- PWA install prompt ----
const buttonHolder = document.querySelector(".pwaButtonHolder");
let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  buttonHolder.style.display = "flex";
});

document.querySelector(".pwaButton").addEventListener("click", async () => {
  if (!deferredPrompt) return;
  buttonHolder.style.display = "none";
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
});

window.addEventListener("appinstalled", () => {
  deferredPrompt = null;
  buttonHolder.style.display = "none";
});

// ---- Hide banner if already running as PWA ----
if (
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true
) {
  buttonHolder.style.display = "none";
}

// ---- Close button ----
function closePWA() {
  buttonHolder.style.display = "none";
}