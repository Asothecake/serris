document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".circa-flexbox").forEach((post) => {
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

        // Scrollbox Pagination Logic
        const scrollbox = post.querySelector(".circa-scrollbox");
        const pagesContainer = scrollbox?.querySelector(".circa-scroll-pages");
        const pageButtons = scrollbox?.querySelectorAll(".circa-page-btn");

        if (scrollbox && pagesContainer && pageButtons) {
            pageButtons.forEach((button, index) => {
                button.addEventListener("click", () => {
                    // Move the content by adjusting transform property
                    pagesContainer.style.transform = `translateX(-${index * 100}%)`;

                    // Highlight active button
                    pageButtons.forEach((btn) => btn.classList.remove("active"));
                    button.classList.add("active");
                });
            });

            // Set default active page (Page 1)
            pageButtons[0].classList.add("active");
        }
    });
});
