(function () {
if (window.bossInit) return;
window.bossInit = true;

function initBossTemplate(container) {
if (container.dataset.bossInitialized === "true") return;
container.dataset.bossInitialized = "true";

// Theming
const themeVars = {
"--boss-bg": container.dataset.bg,
"--boss-accent": container.dataset.accent,
"--boss-border": container.dataset.border,
"--boss-text": container.dataset.text,
"--boss-field-bg": container.dataset.fieldBg,
"--boss-muted": container.dataset.muted,
"--boss-stat-bg": container.dataset.statBg,
};

for (const [key, val] of Object.entries(themeVars)) {
if (val) container.style.setProperty(key, val);
}
}

// Run for all
function runInit() {
document.querySelectorAll(".boss-container").forEach(initBossTemplate);
}

if (document.readyState === "loading") {
document.addEventListener("DOMContentLoaded", runInit);
} else {
runInit();
}
})();