document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".epoque-container").forEach(container => {
    // === HP Bar Calculation ===
    const hpFill = container.querySelector(".epoque-hp-fill");
    const current = parseInt(container.dataset.epoqueHp, 10);
    const max = parseInt(container.dataset.epoqueMax, 10);

    if (!isNaN(current) && !isNaN(max) && max > 0 && hpFill) {
      const percent = Math.max(0, Math.min((current / max) * 100, 100));
      hpFill.style.width = `${percent}%`;
    }

    // === Theming ===
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

    Object.entries(themeVars).forEach(([key, val]) => {
      if (val) container.style.setProperty(key, val);
    });

    // === Toggle Commands Overlay ===
    const toggleBtn = container.querySelector(".toggle-commands");
    const commandOverlay = container.querySelector(".epoque-commands-overlay");
    const statBlocks = container.querySelectorAll(".epoque-stat");

    if (!toggleBtn || !commandOverlay) return;

    let lastStat = null;

    toggleBtn.addEventListener("click", () => {
      commandOverlay.classList.toggle("hidden");
    });

    statBlocks.forEach(stat => {
      stat.addEventListener("click", () => {
        if (commandOverlay.classList.contains("hidden")) return;

        const label = stat.querySelector("label")?.innerText;
        const commands = commandOverlay.querySelectorAll(".epoque-command");

        if (lastStat === label) {
          commands.forEach(c => c.classList.remove("highlighted", "dimmed"));
          lastStat = null;
        } else {
          lastStat = label;
          commands.forEach(cmd => {
            const match = cmd.dataset.stat === label;
            cmd.classList.toggle("highlighted", match);
            cmd.classList.toggle("dimmed", !match);
          });
        }
      });
    });
  });
});
