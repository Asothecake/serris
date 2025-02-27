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

        // Fix Positioning - Ensure pages stay inside the template
        pages.forEach((page) => {
            page.style.position = "absolute"; // Ensures content doesn't break layout
            page.style.left = "50%"; // Center alignment
            page.style.top = "100%"; // Appears just below the buttons
            page.style.transform = "translateX(-50%)"; // Aligns properly in the flexbox
            page.style.zIndex = "10"; // Ensures it appears over elements
            page.style.display = "none"; // Hidden by default
        });

        // Toggle visibility for content pages per post
        buttons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.stopPropagation(); // Prevent event bubbling

                const pageName = button.getAttribute("data-page");
                const targetPage = post.querySelector(`.circa-content-page[data-page="${pageName}"]`);

                if (targetPage) {
                    // Check if already open
                    const isOpen = targetPage.style.display === "block";

                    // Close all pages in this post first
                    pages.forEach((page) => (page.style.display = "none"));

                    // Toggle the clicked one
                    if (!isOpen) {
                        targetPage.style.display = "block";
                    }
                }
            });
        });
    });
});
