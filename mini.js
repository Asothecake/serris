document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".circa-flexbox").forEach((post) => {
        const buttons = post.querySelectorAll(".circa-button");
        const expandableSections = post.querySelectorAll(".circa-expandable");
        const imageSection = post.querySelector(".circa-image-section");
        const scrollbox = post.querySelector(".circa-scrollbox");
        const hpContainer = post.querySelector(".circa-hp-bar-container");

        // ✅ Ensuring a clean reset on load
        post.classList.remove("expanded");
        expandableSections.forEach((section) => {
            section.classList.remove("active");
            section.style.display = "none"; // Ensure sections are hidden initially
        });

        // ✅ Function to update HP bar
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

        // ✅ Toggle function for buttons
        buttons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.stopPropagation();

                const targetID = button.getAttribute("data-target");
                const targetSection = post.querySelector(`.circa-expandable#${targetID}`);

                if (!targetSection) return;

                const isActive = targetSection.classList.contains("active");

                // ✅ Reset all sections before opening a new one
                expandableSections.forEach((section) => {
                    section.classList.remove("active");
                    section.style.display = "none";
                });

                post.classList.remove("expanded"); // Ensure reset before applying new state

                // ✅ If it wasn’t active before, open it
                if (!isActive) {
                    targetSection.classList.add("active");
                    targetSection.style.display = "block";
                    post.classList.add("expanded");
                }
            });
        });
    });
});
