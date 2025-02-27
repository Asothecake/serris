document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".circa-flexbox").forEach((post) => {
        // HP Bar Setup
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

        // Page Switching Setup
        const scrollbox = post.querySelector(".circa-scrollbox");
        const scrollPages = scrollbox?.querySelector(".circa-scroll-pages");
        const pageButtons = post.querySelectorAll(".circa-page-btn");

        if (scrollbox && scrollPages && pageButtons.length) {
            pageButtons.forEach((btn, index) => {
                btn.addEventListener("click", () => {
                    // Move content by updating transform property
                    scrollPages.style.transform = `translateX(-${index * 25}%)`;

                    // Update active button state
                    pageButtons.forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");
                });
            });

            // Initialize first button as active
            pageButtons[0].classList.add("active");
        }
    });
});
