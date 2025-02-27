document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".circa-flexbox").forEach((post) => {
        const buttons = post.querySelectorAll(".circa-button");
        const expandableSections = post.querySelectorAll(".circa-expandable");
        const imageSection = post.querySelector(".circa-image-section");
        const scrollbox = post.querySelector(".circa-scrollbox");
        const hpContainer = post.querySelector(".circa-hp-bar-container");

        // Function to update HP bar
        if (hpContainer) {
            let maxHp = parseInt(hpContainer.getAttribute("data-max-hp"), 10);
            let hpFill = hpContainer.querySelector(".circa-hp-bar-fill");

            const updateHPBar = () => {
                let currentHp = parseInt(hpContainer.getAttribute("data-current-hp"), 10);
                if (isNaN(currentHp) || currentHp < 0) currentHp = 0;
                if (currentHp > maxHp) currentHp = maxHp;
                let widthPercent = (currentHp / maxHp) * 100;
                hpFill.style.width = `${widthPercent}%`;
            };

            updateHPBar(); // Initial update
        }

        // Ensure no expandable sections are open at start
        expandableSections.forEach((section) => {
            section.classList.remove("active");
            section.style.display = "none";
        });

        // Reset the template's default appearance
        post.classList.remove("expanded");

        // Toggle function for main buttons
        buttons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.stopPropagation(); // Prevents unwanted bubbling

                const targetName = button.getAttribute("data-target"); // Fixes incorrect attribute
                const targetSection = post.querySelector(`.circa-expandable[data-page="${targetName}"]`);

                if (targetSection) {
                    const isActive = targetSection.classList.contains("active");

                    // Close all sections first
                    expandableSections.forEach((section) => {
                        section.classList.remove("active");
                        section.style.display = "none";
                    });

                    // Reset flexbox state
                    post.classList.remove("expanded");

                    // If it wasn’t active before, open it
                    if (!isActive) {
                        targetSection.classList.add("active");
                        targetSection.style.display = "block";

                        // Hide the image section & scrollbox when expanding content
                        post.classList.add("expanded");
                    }
                }
            });
        });
    });
});
