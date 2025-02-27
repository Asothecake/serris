document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".circa-flexbox").forEach((post) => {
        const buttons = post.querySelectorAll(".circa-button");
        const pages = post.querySelectorAll(".circa-content-page");
        const hpContainer = post.querySelector(".circa-hp-bar-container");

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

        // Ensure correct positioning for each post
        pages.forEach((page) => {
            page.style.position = "absolute"; // Keeps content inside the template
            page.style.left = "50%"; // Centers relative to the post
            page.style.top = "90%"; // Positions below buttons
            page.style.transform = "translateX(-50%)"; // Keeps alignment centered
            page.style.zIndex = "10"; // Prevents overlap issues
            page.style.display = "none"; // Start hidden
        });

        // Toggle function for main buttons
        buttons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.stopPropagation(); // Prevents unwanted bubbling

                const pageName = button.getAttribute("data-page");
                const targetPage = post.querySelector(`.circa-content-page[data-page="${pageName}"]`);

                if (targetPage) {
                    // Toggle active state
                    if (targetPage.style.display === "block") {
                        targetPage.style.display = "none"; // Close it if open
                    } else {
                        pages.forEach((page) => (page.style.display = "none")); // Close others
                        targetPage.style.display = "block"; // Open selected
                    }
                }
            });
        });
    });
});
