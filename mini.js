document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".circa-button");
    const pages = document.querySelectorAll(".circa-content-page");
    const hpBar = document.getElementById("hpFill");
    const hpContainer = document.querySelector(".circa-hp-bar-container");

    if (hpContainer) {
        let maxHp = parseInt(hpContainer.getAttribute("data-max-hp"), 10);
        let currentHp = parseInt(hpContainer.getAttribute("data-current-hp"), 10);

        // Function to toggle between stat pages
        const togglePage = (pageName) => {
            pages.forEach((page) => {
                if (page.getAttribute("data-page") === pageName) {
                    page.classList.toggle("active");
                } else {
                    page.classList.remove("active");
                }
            });
        };

        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                const pageName = button.getAttribute("data-page");
                togglePage(pageName);
            });
        });

        // Function to update HP bar width dynamically
        const updateHPBar = () => {
            let newCurrentHp = parseInt(hpContainer.getAttribute("data-current-hp"), 10);

            if (isNaN(newCurrentHp) || newCurrentHp < 0) {
                newCurrentHp = 0;
            }
            if (newCurrentHp > maxHp) {
                newCurrentHp = maxHp;
            }

            let widthPercent = (newCurrentHp / maxHp) * 100;
            hpBar.style.width = `${widthPercent}%`;
        };

        // Initial update on page load
        updateHPBar();
    }
});
