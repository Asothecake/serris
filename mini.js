document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".circa-button");
    const pages = document.querySelectorAll(".circa-content-page");

    const hpInput = document.getElementById("hpInput");
    const hpBar = document.getElementById("hpFill");

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
        let maxHp = parseInt(hpInput.getAttribute("max"), 10);
        let currentHp = parseInt(hpInput.value, 10);

        // Prevent out-of-range values
        if (isNaN(currentHp) || currentHp < 0) {
            currentHp = 0;
            hpInput.value = 0;
        }
        if (currentHp > maxHp) {
            currentHp = maxHp;
            hpInput.value = maxHp;
        }

        // Update HP bar width
        let widthPercent = (currentHp / maxHp) * 100;
        hpBar.style.width = `${widthPercent}%`;
    };

    // Listen for changes in the input field
    hpInput.addEventListener("input", updateHPBar);

    // Set initial HP bar width on page load
    updateHPBar();
});
