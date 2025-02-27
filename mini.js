document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".circa-flexbox").forEach((post) => {
        const buttons = post.querySelectorAll(".circa-button");
        const pages = post.querySelectorAll(".circa-expandable");
        const hpContainer = post.querySelector(".circa-hp-bar-container");

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

            updateHPBar(); // Initial update
        }

        // Toggle function for expandable sections
        buttons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.stopPropagation(); // Prevents unwanted bubbling

                const targetId = button.getAttribute("data-target");
                const targetPage = post.querySelector(`#${targetId}`);

                if (targetPage) {
                    const isActive = targetPage.classList.contains("active");

                    // Close all expandable sections first
                    pages.forEach((page) => {
                        page.classList.remove("active");
                        page.style.display = "none";
                    });

                    // If it wasn’t active before, open it
                    if (!isActive) {
                        targetPage.classList.add("active");
                        targetPage.style.display = "block";
                    }
                }
            });
        });
    });
});
