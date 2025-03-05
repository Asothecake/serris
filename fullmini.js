document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".circa-flexbox").forEach((post) => {
        // HP Bar Handling
        const hpContainer = post.querySelector(".circa-hp-bar-container");
        const hpFill = hpContainer?.querySelector(".circa-hp-bar-fill");

        if (hpContainer && hpFill) {
            let maxHp = parseInt(hpContainer.getAttribute("data-max-hp"), 10);

            const updateHPBar = () => {
                let currentHp = parseInt(hpContainer.getAttribute("data-current-hp"), 10);
                currentHp = isNaN(currentHp) || currentHp < 0 ? 0 : Math.min(currentHp, maxHp);
                let widthPercent = (currentHp / maxHp) * 100;
                hpFill.style.width = `${widthPercent}%`;
            };

            updateHPBar();
        }

        // Page Switching Handling
        const scrollbox = post.querySelector(".circa-scrollbox");
        const pages = scrollbox?.querySelectorAll(".circa-page");
        const pageButtons = post.querySelectorAll(".circa-page-btn");

        if (scrollbox && pages.length && pageButtons.length) {
            const changePage = (pageNumber) => {
                // Hide all pages inside the same post
                pages.forEach((page, index) => {
                    page.style.display = (index + 1 === pageNumber) ? "block" : "none";
                });

                // Update active button state
                pageButtons.forEach((btn, index) => {
                    btn.classList.toggle("active", index + 1 === pageNumber);
                });
            };

            // Initialize: Show Page 1 on load
            changePage(1);

            // Assign button event listeners
            pageButtons.forEach((btn, index) => {
                btn.addEventListener("click", () => changePage(index + 1));
            });
        }
    });
});
