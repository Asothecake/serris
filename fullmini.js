document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".circa-flexbox").forEach((post) => {
    document.querySelectorAll(".circa1-flexbox").forEach((post) => {
        // HP Bar Handling
        const hpContainer = post.querySelector(".circa-hp-bar-container");
        const hpFill = hpContainer?.querySelector(".circa-hp-bar-fill");
        const hpContainer = post.querySelector(".circa1-hp-bar-container");
        const hpFill = hpContainer?.querySelector(".circa1-hp-bar-fill");

        if (hpContainer && hpFill) {
            let maxHp = parseInt(hpContainer.getAttribute("data-max-hp"), 10);
@@ -18,30 +18,30 @@
        }

        // Page Switching Handling
        const scrollbox = post.querySelector(".circa-scrollbox");
        const pages = scrollbox?.querySelectorAll(".circa-page");
        const pageButtons = post.querySelectorAll(".circa-page-btn");
        const scrollbox = post.querySelector(".circa1-scrollbox");
        const pages = scrollbox?.querySelectorAll(".circa1-page");
        const pageButtons = post.querySelectorAll(".circa1-page-btn");

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
