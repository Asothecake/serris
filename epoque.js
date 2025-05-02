setTimeout(() => {
  document.querySelectorAll(".epoque-container").forEach(container => {
    // HP Bar Fill
    const hpFill = container.querySelector(".epoque-hp-fill");
    const current = parseInt(container.getAttribute("data-epoque-hp"), 10);
    const max = parseInt(container.getAttribute("data-epoque-max"), 10);

    if (!isNaN(current) && !isNaN(max) && max > 0) {
      const percent = Math.max(0, Math.min((current / max) * 100, 100));
      hpFill.style.width = `${percent}%`;
    }

    // Theming via CSS variables
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

    for (const [key, val] of Object.entries(themeVars)) {
      if (val) container.style.setProperty(key, val);
    }

    // Toggle command overlay and filter
    const toggleBtn = container.querySelector(".toggle-commands");
    const commandOverlay = container.querySelector(".epoque-commands-overlay");
    const statBlocks = container.querySelectorAll(".epoque-stat");

    let lastStat = null;

    toggleBtn?.addEventListener("click", () => {
      commandOverlay?.classList.toggle("hidden");
    });

    statBlocks.forEach(stat => {
      stat.addEventListener("click", () => {
        const label = stat.querySelector("label")?.innerText;
        if (!label || !commandOverlay || commandOverlay.classList.contains("hidden")) return;

        const commands = commandOverlay.querySelectorAll(".epoque-command");

        // Toggle off
        if (lastStat === label) {
          commands.forEach(cmd => {
            cmd.classList.remove("dimmed", "highlighted");
          });
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
}, 100);
