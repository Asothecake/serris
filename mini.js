document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (event) => {
        let button = event.target.closest(".circa-button");
        if (!button) return;

        let post = button.closest(".circa-flexbox");
        if (!post) return;

        const expandableSections = post.querySelectorAll(".circa-expandable");
        const imageSection = post.querySelector(".circa-image-section");
        const scrollbox = post.querySelector(".circa-scrollbox");
        const targetName = button.getAttribute("data-target");
        const targetSection = post.querySelector(`.circa-expandable[data-page="${targetName}"]`);

        if (targetSection) {
            const isActive = targetSection.classList.contains("active");

            // Close all sections
            expandableSections.forEach((section) => {
                section.classList.remove("active");
                section.style.display = "none";
            });

            // Reset state
            post.classList.remove("expanded");

            // Open new section if it wasn't active
            if (!isActive) {
                targetSection.classList.add("active");
                targetSection.style.display = "block";
                post.classList.add("expanded"); // Hide image/scrollbox
            }
        }
    });

    // Ensure no expandable sections are open on first load
    document.querySelectorAll(".circa-expandable").forEach((section) => {
        section.classList.remove("active");
        section.style.display = "none";
    });

    // Ensure HP Bar initializes correctly
    document.querySelectorAll(".circa-hp-bar-container").forEach((hpContainer) => {
        let maxHp = parseInt(hpContainer.getAttribute("data-max-hp"), 10);
        let currentHp = parseInt(hpContainer.getAttribute("data-current-hp"), 10);
        let hpFill = hpContainer.querySelector(".circa-hp-bar-fill");

        if (isNaN(currentHp) || currentHp < 0) currentHp = 0;
        if (currentHp > maxHp) currentHp = maxHp;
        let widthPercent = (currentHp / maxHp) * 100;
        hpFill.style.width = `${widthPercent}%`;
    });
});
