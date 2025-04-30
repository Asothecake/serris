document.addEventListener("DOMContentLoaded", () => {
  // Dynamic HP Bar Filler
  document.querySelectorAll(".epoque-container").forEach(container => {
    const hpFill = container.querySelector(".epoque-hp-fill");
    const current = parseInt(container.getAttribute("data-epoque-hp"), 10);
    const max = parseInt(container.getAttribute("data-epoque-max"), 10);

    if (!isNaN(current) && !isNaN(max) && max > 0) {
      const percent = Math.max(0, Math.min((current / max) * 100, 100));
      hpFill.style.width = `${percent}%`;
    }
  });

  // Theming via CSS variables
  document.querySelectorAll(".epoque-container").forEach(container => {
    const themeVars = {
      "--color-bg": container.dataset.bg,
      "--color-accent": container.dataset.accent,
      "--color-text": container.dataset.text,
      "--color-hp-bg": container.dataset.hpBg,
      "--color-hp-fill-start": container.dataset.hpStart,
      "--color-hp-fill-end": container.dataset.hpEnd,
      "--color-field-bg": container.dataset.fieldBg,
      "--color-muted": container.dataset.muted
    };

    for (const [key, val] of Object.entries(themeVars)) {
      if (val) container.style.setProperty(key, val);
    }
  });
});
