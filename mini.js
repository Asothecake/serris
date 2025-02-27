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

        // Function to toggle content pages
        buttons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.stopPropagation();

                const pageName = button.getAttribute("data-page");
                const targetPage = post.querySelector(`.circa-content-page[data-page="${pageName}"]`);

                if (targetPage) {
                    const isActive = targetPage.classList.contains("active");

                    // Close all content pages inside this specific post
                    pages.forEach((page) => {
                        page.classList.remove("active");
                        page.style.display = "none";
                    });

                    // Remove "expanded" from this post before applying changes
                    post.classList.remove("expanded");

                    // If it wasn’t active before, open it and apply the "expanded" class
                    if (!isActive) {
                        targetPage.classList.add("active");
                        targetPage.style.display = "block";
                        post.classList.add("expanded");
                    }
                }
            });
        });
    });
});
