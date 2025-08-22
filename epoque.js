(function () {
  if (window.epoqueInit) return;
  window.epoqueInit = true;

  // 🎨 Predefined theme profiles
  const epoqueProfiles = {
    1: {
      "--epoque-bg": "#2c2c2c",
      "--epoque-accent": "#c5b077",
      "--epoque-border": "#c5b077",
      "--epoque-text": "#d9d1b0",
      "--epoque-hp-bg": "#2a2a2a",
      "--epoque-hp-start": "#04d9d9",
      "--epoque-hp-end": "#0070dd",
      "--epoque-field-bg": "rgba(44, 44, 44, 0.8)",
      "--epoque-muted": "#888",
      "--epoque-stat-bg": "#3b3b3b",
    },
    2: {
      "--epoque-bg": "#1d1b2f",
      "--epoque-accent": "#e63973",
      "--epoque-border": "#e63973",
      "--epoque-text": "#f5e9ff",
      "--epoque-hp-bg": "#292342",
      "--epoque-hp-start": "#ff7f50",
      "--epoque-hp-end": "#ff1493",
      "--epoque-field-bg": "rgba(29, 27, 47, 0.85)",
      "--epoque-muted": "#aaa",
      "--epoque-stat-bg": "#352f57",
    },
    3: {
      "--epoque-bg": "#182c25",
      "--epoque-accent": "#4caf50",
      "--epoque-border": "#4caf50",
      "--epoque-text": "#e0f2e9",
      "--epoque-hp-bg": "#0d1f18",
      "--epoque-hp-start": "#66ff99",
      "--epoque-hp-end": "#33cc66",
      "--epoque-field-bg": "rgba(24, 44, 37, 0.85)",
      "--epoque-muted": "#8fa396",
      "--epoque-stat-bg": "#234235",
    }
  };

  function initEpoqueTemplate(container) {
    if (container.dataset.epoqueInitialized === "true") return;
    container.dataset.epoqueInitialized = "true";

    // HP bar fill
    const hpFill = container.querySelector(".epoque-hp-fill");
    const current = parseInt(container.getAttribute("data-epoque-hp"), 10);
    const max = parseInt(container.getAttribute("data-epoque-max"), 10);
    if (!isNaN(current) && !isNaN(max) && max > 0) {
      const percent = Math.max(0, Math.min((current / max) * 100, 100));
      hpFill.style.width = `${percent}%`;
    }

    // 🎨 Profile theming first
    const profileNum = parseInt(container.dataset.profile, 10);
    if (!isNaN(profileNum) && epoqueProfiles[profileNum]) {
      for (const [key, val] of Object.entries(epoqueProfiles[profileNum])) {
        container.style.setProperty(key, val);
      }
    }

    // 🎨 Inline overrides (always win if present)
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

    // Command overlay toggle
    const toggleBtn = container.querySelector(".toggle-commands");
    const commandOverlay = container.querySelector(".epoque-commands-overlay");
    const statBlocks = container.querySelectorAll(".epoque-stat");
    const commands = commandOverlay?.querySelectorAll(".epoque-command") || [];
    let lastStat = null;

    // Cooldown parsing
    const cooldownField = container.querySelector(".epoque-field[data-label^='Cooldowns']");
    const cooldownList = [];
    if (cooldownField) {
      const cdText = cooldownField.textContent;
      if (cdText) {
        cooldownList.push(...cdText.split(",").map(cd => cd.trim().toLowerCase()));
      }
    }

    // Initial cooldown dimming
    commands.forEach(cmd => {
      const name = cmd.textContent.trim().toLowerCase();
      if (cooldownList.includes(name)) {
        cmd.classList.add("dimmed");
      }
    });

    // Toggle button
    toggleBtn?.addEventListener("click", () => {
      commandOverlay?.classList.toggle("hidden");
    });

    // Stat filters
    statBlocks.forEach(stat => {
      stat.addEventListener("click", () => {
        const label = stat.querySelector("label")?.innerText;
        if (!label || !commandOverlay || commandOverlay.classList.contains("hidden")) return;

        // Remove highlight
        if (lastStat === label) {
          commands.forEach(cmd => cmd.classList.remove("dimmed", "highlighted"));
          lastStat = null;

          // Reapply cooldowns
          commands.forEach(cmd => {
            const name = cmd.textContent.trim().toLowerCase();
            if (cooldownList.includes(name)) {
              cmd.classList.add("dimmed");
            }
          });

          return;
        }

        // Apply stat filter
        lastStat = label;
        commands.forEach(cmd => {
          const match = cmd.dataset.stat === label;
          cmd.classList.toggle("highlighted", match);
          cmd.classList.toggle("dimmed", !match);
        });
      });
    });
  }

  // Run for all
  function runInit() {
    document.querySelectorAll(".epoque-container").forEach(initEpoqueTemplate);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runInit);
  } else {
    runInit();
  }
})();
