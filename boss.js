(function () {
  if (window.bossInit) return;
  window.bossInit = true;

  function initBossTemplate(container) {
    if (container.dataset.bossInitialized === "true") return;
    container.dataset.bossInitialized = "true";

    // HP bar fill
    const hpFill = container.querySelector(".boss-hp-fill");
    const current = parseInt(container.getAttribute("data-boss-hp"), 10);
    const max = parseInt(container.getAttribute("data-boss-max"), 10);
    if (!isNaN(current) && !isNaN(max) && max > 0) {
      const percent = Math.max(0, Math.min((current / max) * 100, 100));
      hpFill.style.width = `${percent}%`;
    }

    // Theming
    const themeVars = {
      "--boss-bg": container.dataset.bg,
      "--boss-accent": container.dataset.accent,
      "--boss-border": container.dataset.border,
      "--boss-text": container.dataset.text,
      "--boss-hp-bg": container.dataset.hpBg,
      "--boss-hp-start": container.dataset.hpStart,
      "--boss-hp-end": container.dataset.hpEnd,
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
