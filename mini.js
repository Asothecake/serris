document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".circa-flexbox").forEach((post) => {
        const buttons = post.querySelectorAll(".circa-button");
        const expandableSections = post.querySelectorAll(".circa-expandable");
        const imageSection = post.querySelector(".circa-image-section");
        const scrollbox = post.querySelector(".circa-scrollbox");
        const hpContainer = post.querySelector(".circa-hp-bar-container");

        // Function to update HP bar for each post
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

            updateHPBar(); // Run on load
        }

        // Click event for buttons (ensuring independent post handling)
        buttons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.stopPropagation(); // Prevents unwanted bubbling

                const targetName = button.getAttribute("data-page");
                const targetSection = post.querySelector(`.circa-expandable[data-page="${targetName}"]`);

                if (targetSection) {
                    const isActive = targetSection.classList.contains("active");

                    // Close all sections inside this post only
                    expandableSections.forEach((section) => {
                        section.classList.remove("active");
                        section.style.display = "none";
                    });

                    // Reset state
                    post.classList.remove("expanded");

                    // Open the section if it wasn’t active before
                    if (!isActive) {
                        targetSection.classList.add("active");
                        targetSection.style.display = "block";
                        post.classList.add("expanded"); // Hide image & scrollbox when expanded
                    }
                }
            });
        });
    });
});
