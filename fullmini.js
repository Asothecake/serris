document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".circa-flexbox").forEach((post) => {
        const hpContainer = post.querySelector(".circa-hp-bar-container");
        const scrollbox = post.querySelector(".circa-scrollbox");
        const pages = post.querySelectorAll(".circa-scroll-page");
        const pageIndexButtons = post.querySelectorAll(".circa-scroll-index span");

        let currentPage = 0; // Start at Page 1 (index 0)

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

        // Ensure only one page is visible at a time
        function updatePage() {
            let offset = -currentPage * 100; // Moves page to correct position
            scrollbox.style.transform = `translateX(${offset}%)`;
            scrollbox.style.transition = "transform 0.4s ease-in-out"; // Smooth transition

            // Update active page index indicator
            pageIndexButtons.forEach((btn, index) => {
                btn.classList.toggle("active", index === currentPage);
            });
        }

        // Event listener for page index clicks
        pageIndexButtons.forEach((btn, index) => {
            btn.addEventListener("click", () => {
                currentPage = index;
                updatePage();
            });
        });

        // Initialize the first page
        updatePage();
    });
});
