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

            // Function to toggle between stat pages
            const togglePage = (pageName) => {
                pages.forEach((page) => {
                    // If it's already active, remove it. Otherwise, open it.
                    if (page.getAttribute("data-page") === pageName) {
                        page.classList.toggle("active");
                    } else {
                        page.classList.remove("active"); // Ensure only one is open at a time
                    }
                });
            };

            // Attach button event listeners only for this post
            buttons.forEach((button) => {
                button.addEventListener("click", () => {
                    const pageName = button.getAttribute("data-page");
                    togglePage(pageName);
                });
            });

            // Function to update HP bar
            const updateHPBar = () => {
                let newCurrentHp = parseInt(hpContainer.getAttribute("data-current-hp"), 10);

                if (isNaN(newCurrentHp) || newCurrentHp < 0) newCurrentHp = 0;
                if (newCurrentHp > maxHp) newCurrentHp = maxHp;

                let widthPercent = (newCurrentHp / maxHp) * 100;
                hpFill.style.width = `${widthPercent}%`;
            };

            // Initial HP bar update
            updateHPBar();
        }
    });
});
