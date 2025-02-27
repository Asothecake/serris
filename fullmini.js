document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".circa-flexbox").forEach((post) => {
        const hpContainer = post.querySelector(".circa-hp-bar-container");
        const scrollbox = post.querySelector(".circa-scrollbox");
        const pages = scrollbox.querySelectorAll(".circa-scroll-page");
        const pageButtons = post.querySelectorAll(".circa-page-btn");

        // Function to update HP bar
        if (hpContainer) {
            let maxHp = parseInt(hpContainer.getAttribute("data-max-hp"), 10);
            let hpFill = hpContainer.querySelector(".circa-hp-bar-fill");

            const updateHPBar = () => {
                let currentHp = parseInt(hpContainer.getAttribute("data-current-hp"), 10);
                currentHp = Math.max(0, Math.min(currentHp, maxHp));
                hpFill.style.width = `${(currentHp / maxHp) * 100}%`;
            };

            updateHPBar(); // Run on load
        }

        // Function to handle page switching
        const showPage = (pageIndex) => {
            pages.forEach((page, index) => {
                if (index === pageIndex) {
                    page.style.opacity = "1";
                    page.style.pointerEvents = "auto";
                    page.style.display = "block"; // Ensure it's visible
                } else {
                    page.style.opacity = "0";
                    page.style.pointerEvents = "none";
                    page.style.display = "none"; // Hide other pages
                }
            });

            // Update button styling to reflect active page
            pageButtons.forEach((btn, index) => {
                if (index === pageIndex) {
                    btn.classList.add("active");
                } else {
                    btn.classList.remove("active");
                }
            });
        };

        // Set default page (Page 1)
        showPage(0);

        // Event listeners for page buttons
        pageButtons.forEach((button, index) => {
            button.addEventListener("click", () => {
                showPage(index);
            });
        });
    });
});
