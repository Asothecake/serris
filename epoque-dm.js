(function () {
  if (window.epoqueDmInit) return;
  window.epoqueDmInit = true;

  function initEpoqueDmTemplate(container) {
    if (container.dataset.epoqueDmInitialized === "true") return;
    container.dataset.epoqueDmInitialized = "true";

    // Get number of enemies (1-5)
    const numEnemies = parseInt(container.dataset.enemies, 10) || 1;
    const validNum = Math.max(1, Math.min(5, numEnemies));

    // Show and initialize enemy sections
    const enemies = container.querySelectorAll(".epoque-dm-enemy");
    enemies.forEach((enemy, index) => {
      if (index < validNum) {
        enemy.style.display = "block";

        // HP bar fill for each enemy
        const hpFill = enemy.querySelector(".epoque-dm-hp-fill");
        const current = parseInt(container.getAttribute(`data-epoque-hp${index + 1}`), 10);
        const max = parseInt(container.getAttribute(`data-epoque-max${index + 1}`), 10);
        if (!isNaN(current) && !isNaN(max) && max > 0) {
          const percent = Math.max(0, Math.min((current / max) * 100, 100));
          hpFill.style.width = `${percent}%`;
        }
      } else {
        enemy.style.display = "none";
      }
    });

    // Adjust flex basis based on number for auto-fitting
    if (validNum === 1) {
      enemies.forEach(enemy => { if (enemy.style.display === "block") enemy.style.flexBasis = "100%"; });
    } else if (validNum <= 3) {
      enemies.forEach(enemy => { if (enemy.style.display === "block") enemy.style.flexBasis = "45%"; });
    } else {
      enemies.forEach(enemy => { if (enemy.style.display === "block") enemy.style.flexBasis = "30%"; });
    }
  }

  // Run for all
  function runInit() {
    document.querySelectorAll(".epoque-dm-container").forEach(initEpoqueDmTemplate);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runInit);
  } else {
    runInit();
  }
})();