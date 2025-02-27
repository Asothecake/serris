document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".circa-flexbox").forEach((post) => {
        const buttons = post.querySelectorAll(".circa-button");
        const pages = post.querySelectorAll(".circa-content-page");
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

            // Update HP Bar on load
            updateHPBar();
        }

        // Toggle visibility for content pages per post
        buttons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.stopPropagation(); // Stop event bubbling

                const pageName = button.getAttribute("data-page");

                console.log("Button Clicked:", pageName); // Debugging log

                pages.forEach((page) => {
                    if (page.getAttribute("data-page") === pageName) {
                        // Toggle only this post's page visibility
                        if (page.classList.contains("active")) {
                            page.classList.remove("active");
                            console.log("Closed Page:", pageName); // Debugging log
                        } else {
                            pages.forEach(p => p.classList.remove("active")); // Close others
                            page.classList.add("active");
                            console.log("Opened Page:", pageName); // Debugging log
                        }
                    }
                });
            });
        });
    });
});
