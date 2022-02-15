if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("ServiceWorker.js")
        .then(console.log(`Service Worker Registered Successfully! `))
        .catch((err) => {
          console.log(`Error registring ${err}`);
        });
    });
  } else {
    console.log(`Service Worker is not supported in this browser.`);
  }
  
  const buttonHolder = document.querySelector(".pwaButtonHolder");
  //BeforeInstallPromptEvent
  let deferredPrompt;
  self.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    buttonHolder.style.display = "flex";
  });
  
  //On Install Button Click
  const installButton = document.querySelector(".pwaButtonHolder .pwaButton");
  installButton.addEventListener("click", async () => {
    if (deferredPrompt) {
      buttonHolder.style.display = "none";
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPrompt = null;
    } else {
      alert("Prompt Failed");
    }
  });
  
  //Check App Installed
  self.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    console.log("PWA was installed");
  });
  
  //Hide PWA Button if already installed
  if (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  ) {
    buttonHolder.style.display = "none";
  }
  
  //Close Button PWA
  function closePWA() {
    buttonHolder.style.display = "none";
  }
  