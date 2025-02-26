document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".circa-button");
    const pages = document.querySelectorAll(".circa-content-page");
    const hpBars = document.querySelectorAll(".circa-hp-bar-container");

    // Function to toggle between stat pages
    const togglePage = (pageName) => {
        pages.forEach((page) => {
            page.classList.toggle("active", page.getAttribute("data-page") === pageName);
        });
    };

    // Button event listeners for stat pages
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const pageName = button.getAttribute("data-page");
            togglePage(pageName);
        });
    });

    // Function to update all HP bars dynamically
    const updateHPBars = () => {
        hpBars.forEach((hpContainer) => {
            let maxHp = parseInt(hpContainer.getAttribute("data-max-hp"), 10);
            let currentHp = parseInt(hpContainer.getAttribute("data-current-hp"), 10);
            let hpFill = hpContainer.querySelector(".circa-hp-bar-fill");

            if (isNaN(currentHp) || currentHp < 0) currentHp = 0;
            if (currentHp > maxHp) currentHp = maxHp;

            let widthPercent = (currentHp / maxHp) * 100;
            hpFill.style.width = `${widthPercent}%`;
        });
    };

    // Initial update on page load
    updateHPBars();
});
