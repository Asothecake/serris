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

        // Toggle function for main buttons
        buttons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.stopPropagation(); // Prevents unwanted bubbling

                const pageName = button.getAttribute("data-page");
                const targetPage = post.querySelector(`.circa-content-page[data-page="${pageName}"]`);

                if (targetPage) {
                    // Toggle visibility
                    targetPage.classList.toggle("active");
                    targetPage.style.display = targetPage.classList.contains("active") ? "block" : "none";

                    // Close all other pages in the same post
                    pages.forEach((page) => {
                        if (page !== targetPage) {
                            page.classList.remove("active");
                            page.style.display = "none";
                        }
                    });
                }
            });
        });
    });
});
