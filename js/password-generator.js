// ---- State ----

const options = {
  numbers: true,
  uppercases: true,
  lowercases: true,
  symbols: true,
  similars: false,
};

let currentMode = "random"; // "random" | "passphrase"
let selectedLength = 16;
let toastTimer = null;

// ---- Constants ----

// prettier-ignore
const WORDS = [
  "amber","arctic","arrow","atlas","azure","badge","bamboo","basin","beacon",
  "birch","blade","blaze","bloom","boulder","breeze","brick","bridge","bronze",
  "brook","cabin","cedar","chalk","charm","chrome","cipher","citrus","cliff",
  "cloud","cobalt","cobra","comet","coral","crane","creek","crest","crown",
  "crystal","dawn","delta","desert","dusk","eagle","echo","elder","ember",
  "falcon","fern","field","flame","flash","fleet","flint","flood","flora",
  "foam","forge","forest","frost","galaxy","garnet","ghost","glade","glass",
  "gleam","glide","glow","gold","grain","grand","grape","gravel","grove",
  "guard","gust","harbor","hawk","hazel","heron","hive","holly","honey",
  "hyper","indigo","inlet","ivory","jade","jaguar","jasper","kelp","knot",
  "latch","lava","leaf","ledge","lens","light","lime","linen","lotus",
  "lunar","maple","marsh","merit","mesa","mint","mist","mocha","moon",
  "mossy","mount","nebula","night","noble","north","nova","onyx","opal",
  "orbit","otter","palm","petal","pilot","pine","pixel","plain","plum",
  "polar","pond","prism","pulse","quartz","quest","radar","rapid","raven",
  "reef","ridge","rivet","robin","rocky","root","ruby","rust","sage","sand",
  "shard","shell","shift","shore","silver","slate","slope","snow","solar",
  "sonic","spark","spring","spruce","stack","stag","steam","steel","stone",
  "storm","stream","surge","swift","sword","talon","teal","terra","tide",
  "tiger","timber","token","torch","track","trail","tropic","trunk","trust",
  "tundra","ultra","vapor","vault","veil","velvet","visor","vista","vivid",
  "walnut","wave","wedge","wheat","willow","wind","wolf","zenith","zinc"
];

const CHAR_SETS = {
  numbers:    "1234567890",
  uppercases: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercases: "abcdefghijklmnopqrstuvwxyz",
  symbols:    "!?@#$%&*+-=",
};

const CHAR_SETS_NO_SIMILAR = {
  numbers:    "2345679",
  uppercases: "ACDEFGHJKLMNPRSTUVWXYZ",
  lowercases: "abcdefghijkmnopqrstuvwxyz",
  symbols:    "?#$%&*+-=",
};

const PASSWORD_COUNT = 3;

// ---- Generation helpers ----

function buildCharPool() {
  const sets = options.similars ? CHAR_SETS_NO_SIMILAR : CHAR_SETS;
  return ["numbers", "uppercases", "lowercases", "symbols"]
    .filter((k) => options[k])
    .map((k) => sets[k])
    .join("");
}

function generateRandom() {
  const pool = buildCharPool();
  if (!pool) return "";
  return Array.from(
    { length: selectedLength },
    () => pool[Math.floor(Math.random() * pool.length)],
  ).join("");
}

function generatePhrase() {
  const wordCount = selectedLength === 12 ? 3 : 4;
  return Array.from(
    { length: wordCount },
    () => WORDS[Math.floor(Math.random() * WORDS.length)],
  ).join("-");
}

// ---- Generate ----

function generatePasswords() {
  for (let i = 1; i <= PASSWORD_COUNT; i++) {
    const pw = currentMode === "passphrase" ? generatePhrase() : generateRandom();
    if (pw) document.getElementById(`password-${i}`).value = pw;
  }
}

function refreshSingle(id) {
  const pw = currentMode === "passphrase" ? generatePhrase() : generateRandom();
  if (pw) document.getElementById(id).value = pw;
  // Return focus to body so Space shortcut works immediately after
  document.activeElement.blur();
}

// ---- Copy ----

function copyPassword(id) {
  const el = document.getElementById(id);
  if (!el.value) return;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(el.value).then(() => showToast("Copied!"));
  } else {
    el.select();
    document.execCommand("copy");
    showToast("Copied!");
  }
}

// ---- Strength test ----

function testPasswordStrength() {
  const password = document.getElementById("strength-password").value;
  const fill = document.getElementById("strength-fill");
  const text = document.getElementById("strength-text");

  if (!password) {
    fill.style.width = "0%";
    fill.className = "strength-fill";
    text.textContent = "";
    text.className = "strength-text";
    return;
  }

  let score = 0;
  if (password.length >= 8)  score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  const percent = Math.min(100, (score / 7) * 100);
  fill.style.width = `${percent}%`;

  const levels = [
    [28,  "weak",        "Weak"],
    [57,  "medium",      "Medium"],
    [85,  "strong",      "Strong"],
    [100, "very-strong", "Very Strong"],
  ];
  const [, cls, label] = levels.find(([max]) => percent <= max) ?? levels[3];
  fill.className = `strength-fill ${cls}`;
  text.className = `strength-text ${cls}`;
  text.textContent = label;
}

// ---- Toast ----

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1400);
}

// ---- UI state ----

function setSubmitState() {
  const allOff =
    !options.numbers && !options.uppercases && !options.lowercases && !options.symbols;
  document.getElementById("submit-btn").classList.toggle("inactive", allOff || currentMode === "passphrase" ? false : allOff);
  // In passphrase mode, generate is always enabled
  if (currentMode === "passphrase") {
    document.getElementById("submit-btn").classList.remove("inactive");
  }
}

// ---- Event listeners ----

// Checkbox options
["numbers", "uppercases", "lowercases", "symbols", "similars"].forEach((id) => {
  document.getElementById(id).addEventListener("change", function () {
    options[id] = this.checked;
    setSubmitState();
  });
});

// Length toggle — scope active reset to this group only
document.querySelectorAll('input[name="length"]').forEach((input) => {
  input.addEventListener("change", function () {
    selectedLength = Number(this.value);
    this.closest(".toggle-group")
      .querySelectorAll(".toggle-option")
      .forEach((opt) => opt.classList.remove("active"));
    this.closest(".toggle-option").classList.add("active");
  });
});

// Mode toggle — scope active reset to this group only
document.querySelectorAll('input[name="mode"]').forEach((input) => {
  input.addEventListener("change", function () {
    currentMode = this.value;
    document
      .querySelector(".options-list")
      .classList.toggle("disabled", currentMode === "passphrase");
    this.closest(".toggle-group")
      .querySelectorAll(".toggle-option")
      .forEach((opt) => opt.classList.remove("active"));
    this.closest(".toggle-option").classList.add("active");
    setSubmitState();
    generatePasswords();
  });
});

// Generate button — blur after so Space shortcut works immediately
document.getElementById("submit-btn").addEventListener("click", () => {
  generatePasswords();
  document.getElementById("submit-btn").blur();
});

// Strength tester — live as you type
document.getElementById("strength-password").addEventListener("input", testPasswordStrength);

// Space to regenerate — only fires when nothing is focused
document.addEventListener("keydown", (e) => {
  if (e.code !== "Space") return;
  if (document.activeElement && document.activeElement !== document.body) return;
  e.preventDefault();
  if (!document.getElementById("submit-btn").classList.contains("inactive")) {
    generatePasswords();
  }
});

// Theme toggle — respects system preference, persists to localStorage
(function initTheme() {
  const root   = document.documentElement;
  const btn    = document.getElementById("theme-toggle");
  const icon   = document.getElementById("theme-icon");
  const stored = localStorage.getItem("pg-theme");

  function applyTheme(dark) {
    root.setAttribute("data-theme", dark ? "dark" : "light");
    icon.setAttribute("icon", dark ? "lucide:sun" : "lucide:moon");
    btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  }

  const prefersDark =
    stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
  applyTheme(prefersDark);

  btn.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    applyTheme(!isDark);
    localStorage.setItem("pg-theme", !isDark ? "dark" : "light");
  });
})();

// ---- Init ----

document.getElementById("year").textContent = new Date().getFullYear();
setSubmitState();
