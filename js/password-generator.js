const options = {
  numbers: true,
  uppercases: true,
  lowercases: true,
  symbols: true,
  similars: false,
};

const CHAR_SETS = {
  numbers: "1234567890",
  uppercases: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercases: "abcdefghijklmnopqrstuvwxyz",
  symbols: "!?@#$%&*+-=",
};

const CHAR_SETS_NO_SIMILAR = {
  numbers: "2345679",
  uppercases: "ACDEFGHJKLMNPRSTUVWXYZ",
  lowercases: "abcdefghijkmnopqrstuvwxyz",
  symbols: "?#$%&*+-=",
};

const PASSWORD_COUNT = 3;
let selectedLength = 16;
let charPool = buildCharPool();
let toastTimer = null;

// ---- Char pool ----

function buildCharPool() {
  const sets = options.similars ? CHAR_SETS_NO_SIMILAR : CHAR_SETS;
  return ["numbers", "uppercases", "lowercases", "symbols"]
    .filter((k) => options[k])
    .map((k) => sets[k])
    .join("");
}

function updateCharPool() {
  charPool = buildCharPool();
}

// ---- Event listeners ----

["numbers", "uppercases", "lowercases", "symbols", "similars"].forEach((id) => {
  document.getElementById(id).addEventListener("change", function () {
    options[id] = this.checked;
    updateCharPool();
    updateSubmitButton();
  });
});

document.querySelectorAll('input[name="length"]').forEach((input) => {
  input.addEventListener("change", function () {
    selectedLength = Number(this.value);
    document
      .querySelectorAll(".toggle-option")
      .forEach((opt) => opt.classList.remove("active"));
    this.closest(".toggle-option").classList.add("active");
  });
});

document
  .getElementById("submit-btn")
  .addEventListener("click", generatePasswords);
document
  .getElementById("strength-password")
  .addEventListener("input", testPasswordStrength);

// ---- Generator ----

function generatePasswords() {
  if (!charPool) return;
  const passwords = Array.from({ length: PASSWORD_COUNT }, () =>
    Array.from(
      { length: selectedLength },
      () => charPool[Math.floor(Math.random() * charPool.length)],
    ).join(""),
  );
  document.getElementById("password-1").value = passwords[0];
  document.getElementById("password-2").value = passwords[1];
  document.getElementById("password-3").value = passwords[2];
}

function updateSubmitButton() {
  const allOff =
    !options.numbers &&
    !options.uppercases &&
    !options.lowercases &&
    !options.symbols;
  document.getElementById("submit-btn").classList.toggle("inactive", allOff);
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

// ---- Toast ----

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1400);
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
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  const percent = Math.min(100, (score / 7) * 100);
  fill.style.width = percent + "%";

  let level;
  if (percent <= 28) level = ["weak", "Weak"];
  else if (percent <= 57) level = ["medium", "Medium"];
  else if (percent <= 85) level = ["strong", "Strong"];
  else level = ["very-strong", "Very Strong"];

  fill.className = `strength-fill ${level[0]}`;
  text.className = `strength-text ${level[0]}`;
  text.textContent = level[1];
}

// ---- Init ----

updateCharPool();
updateSubmitButton();
