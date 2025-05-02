document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".epoque-container").forEach(container => {
    // Set HP bar
    const hpFill = container.querySelector(".epoque-hp-fill");
    const current = parseInt(container.dataset.epoqueHp, 10);
    const max = parseInt(container.dataset.epoqueMax, 10);
    if (hpFill && !isNaN(current) && !isNaN(max) && max > 0) {
      hpFill.style.width = `${Math.min(100, (current / max) * 100)}%`;
    }

    // Apply theme
    const themeVars = {
      "--epoque-bg": container.dataset.bg,
      "--epoque-accent": container.dataset.accent,
      "--epoque-border": container.dataset.border,
      "--epoque-text": container.dataset.text,
      "--epoque-hp-bg": container.dataset.hpBg,
      "--epoque-hp-start": container.dataset.hpStart,
      "--epoque-hp-end": container.dataset.hpEnd,
      "--epoque-field-bg": container.dataset.fieldBg,
      "--epoque-muted": container.dataset.muted,
      "--epoque-stat-bg": container.dataset.statBg,
    };
    for (const [key, value] of Object.entries(themeVars)) {
      if (value) container.style.setProperty(key, value);
    }

    // Handle commands overlay toggle and stat filtering
    const toggle = container.querySelector(".toggle-commands");
    const overlay = container.querySelector(".epoque-commands-overlay");
    const stats = container.querySelectorAll(".epoque-stat");

    if (!toggle || !overlay) return;

    let activeStat = null;

    toggle.addEventListener("click", () => {
      overlay.classList.toggle("hidden");
      overlay.querySelectorAll(".epoque-command").forEach(cmd => {
        cmd.classList.remove("highlighted", "dimmed");
      });
      activeStat = null;
    });

    stats.forEach(stat => {
      stat.addEventListener("click", () => {
        if (overlay.classList.contains("hidden")) return;

        const statLabel = stat.querySelector("label")?.innerText;
        const commands = overlay.querySelectorAll(".epoque-command");
        if (!statLabel) return;

        if (statLabel === activeStat) {
          commands.forEach(cmd => cmd.classList.remove("highlighted", "dimmed"));
          activeStat = null;
        } else {
          commands.forEach(cmd => {
            const match = cmd.dataset.stat === statLabel;
            cmd.classList.toggle("highlighted", match);
            cmd.classList.toggle("dimmed", !match);
          });
          activeStat = statLabel;
        }
      });
    });
  });
});
