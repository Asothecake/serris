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

    // Update HP bar when input changes
    hpInput.addEventListener("input", () => {
        let maxHp = parseInt(hpInput.getAttribute("max"));
        let currentHp = parseInt(hpInput.value);
        
        if (currentHp > maxHp) {
            hpInput.value = maxHp;
            currentHp = maxHp;
        }
        
        if (currentHp < 0) {
            hpInput.value = 0;
            currentHp = 0;
        }

        let widthPercent = (currentHp / maxHp) * 100;
        hpBar.style.width = `${widthPercent}%`;
    });
});
