(function () {
  if (window.epoqueInit) return;
  window.epoqueInit = true;

  async function fetchProfileData(url) {
    try {
      const response = await fetch(url, { cache: "no-cache" });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (e) {
      console.error("Error fetching profile data from GitHub:", e);
      return null;
    }
  }

  async function initEpoqueTemplate(container) {
    if (container.dataset.epoqueInitialized === "true") return;
    container.dataset.epoqueInitialized = "true";

    // Retrieve profile data
    let profileData = {};
    const profileName = container.dataset.profile;
    if (profileName) {
      // Try fetching from external URL first
      const profileUrl = container.dataset.profileUrl;
      if (profileUrl) {
        const profiles = await fetchProfileData(profileUrl);
        if (profiles && profiles[profileName]) {
          profileData = profiles[profileName];
        }
      }
      // Fallback to local profiles if no URL or fetch fails
      if (!profileData.src) {
        const profilesElement = container.querySelector(".epoque-profiles");
        if (profilesElement) {
          try {
            const profiles = JSON.parse(profilesElement.textContent);
            profileData = profiles[profileName] || {};
          } catch (e) {
            console.error("Error parsing local epoque-profiles JSON:", e);
          }
        }
      }
    }

    // Apply profile image if specified
    if (profileData.src) {
      const image = container.querySelector(".epoque-image");
      if (image) {
        image.src = profileData.src;
      }
    }

    // HP bar fill
    const hpFill = container.querySelector(".epoque-hp-fill");
    const current = parseInt(container.getAttribute("data-epoque-hp"), 10);
    const max = parseInt(container.getAttribute("data-epoque-max"), 10);
    if (!isNaN(current) && !isNaN(max) && max > 0) {
      const percent = Math.max(0, Math.min((current / max) * 100, 100));
      hpFill.style.width = `${percent}%`;
    }

    // Theming (use profile data if available, fall back to dataset attributes)
    const themeVars = {
      "--epoque-bg": profileData.bg || container.dataset.bg,
      "--epoque-accent": profileData.accent || container.dataset.accent,
      "--epoque-border": profileData.border || container.dataset.border,
      "--epoque-text": profileData.text || container.dataset.text,
      "--epoque-hp-bg": profileData.hpBg || container.dataset.hpBg,
      "--epoque-hp-start": profileData.hpStart || container.dataset.hpStart,
      "--epoque-hp-end": profileData.hpEnd || container.dataset.hpEnd,
      "--epoque-field-bg": profileData.fieldBg || container.dataset.fieldBg,
      "--epoque-muted": profileData.muted || container.dataset.muted,
      "--epoque-stat-bg": profileData.statBg || container.dataset.statBg,
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
    document.querySelectorAll(".epoque-container").forEach(async (container) => {
      await initEpoqueTemplate(container);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runInit);
  } else {
    runInit();
  }
})();
