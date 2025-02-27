document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".circa-flexbox").forEach((post) => {
        const hpContainer = post.querySelector(".circa-hp-bar-container");
        const hpFill = hpContainer?.querySelector(".circa-hp-bar-fill");

        // Function to update HP bar
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

        // Page switching functionality
        const scrollbox = post.querySelector(".circa-scrollbox");
        const scrollContent = scrollbox?.querySelector(".circa-scroll-content");
        const pageButtons = post.querySelectorAll(".circa-page-btn");

        if (scrollbox && scrollContent && pageButtons.length) {
            pageButtons.forEach((btn, index) => {
                btn.addEventListener("click", () => {
                    // Move the content by changing the transform property
                    scrollContent.style.transform = `translateX(-${index * 25}%)`;

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
