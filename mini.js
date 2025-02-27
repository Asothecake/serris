document.addEventListener("DOMContentLoaded", () => {
    const postContainers = document.querySelectorAll(".circa-flexbox");

    postContainers.forEach((post) => {
        const buttons = post.querySelectorAll(".circa-button");
        const pages = post.querySelectorAll(".circa-content-page");
        const hpContainer = post.querySelector(".circa-hp-bar-container");

        if (hpContainer) {
            let maxHp = parseInt(hpContainer.getAttribute("data-max-hp"), 10);
            let currentHp = parseInt(hpContainer.getAttribute("data-current-hp"), 10);
            let hpFill = hpContainer.querySelector(".circa-hp-bar-fill");

            // Function to toggle pages only for the current post
            const togglePage = (pageName) => {
                pages.forEach((page) => {
                    if (page.getAttribute("data-page") === pageName) {
                        page.classList.toggle("active"); // Toggle only the clicked page
                    } else {
                        page.classList.remove("active"); // Close others in this post
                    }
                });
            };

            // Attach event listeners to buttons **only for this post**
            buttons.forEach((button) => {
                button.addEventListener("click", (event) => {
                    event.stopPropagation(); // Prevent interference with other posts
                    const pageName = button.getAttribute("data-page");
                    togglePage(pageName);
                });
            });

            // Function to update the HP bar only for this post
            const updateHPBar = () => {
                let newCurrentHp = parseInt(hpContainer.getAttribute("data-current-hp"), 10);
                if (isNaN(newCurrentHp) || newCurrentHp < 0) newCurrentHp = 0;
                if (newCurrentHp > maxHp) newCurrentHp = maxHp;
                let widthPercent = (newCurrentHp / maxHp) * 100;
                hpFill.style.width = `${widthPercent}%`;
            };

            // Update HP bar when the page loads
            updateHPBar();
        }
    });
});
