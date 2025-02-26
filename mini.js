document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".circa-button");
    const pages = document.querySelectorAll(".circa-content-page");
    const hpBar = document.getElementById("hpFill");

    // Read HP values from HTML
    let hpContainer = document.querySelector(".circa-hp-bar-container");
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
        // Prevent out-of-range values
        if (isNaN(currentHp) || currentHp < 0) {
            currentHp = 0;
        }
        if (currentHp > maxHp) {
            currentHp = maxHp;
        }

        // Update HP bar width
        let widthPercent = (currentHp / maxHp) * 100;
        hpBar.style.width = `${widthPercent}%`;
    };

    // Set initial HP bar width on page load
    updateHPBar();
});
