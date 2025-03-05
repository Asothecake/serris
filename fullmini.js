document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".circa-flexbox").forEach((post) => {
        const hpContainer = post.querySelector(".circa-hp-bar-container");
        const hpFill = hpContainer?.querySelector(".circa-hp-bar-fill");

        // Function to update HP bar
        if (hpContainer && hpFill) {
            let maxHp = parseInt(hpContainer.getAttribute("data-max-hp"), 10);

            const updateHPBar = () => {
                let currentHp = parseInt(hpContainer.getAttribute("data-current-hp"), 10);
                currentHp = isNaN(currentHp) || currentHp < 0 ? 0 : Math.min(currentHp, maxHp);
                let widthPercent = (currentHp / maxHp) * 100;
                hpFill.style.width = `${widthPercent}%`;
            };

            updateHPBar();
        }

        // Page switching functionality
        const scrollbox = post.querySelector(".circa-scrollbox");
        const scrollPages = scrollbox?.querySelectorAll(".circa-page");
        const pageButtons = post.querySelectorAll(".circa-page-btn");

        if (scrollbox && scrollPages.length && pageButtons.length) {
            pageButtons.forEach((btn, index) => {
                btn.addEventListener("click", () => {
                    changePage(index + 1, post);
                });
            });

            // Initialize first page as visible by default
            scrollPages.forEach(page => page.style.display = "none");
            scrollPages[0].style.display = "block";
            pageButtons[0].classList.add("active");
        }

        // Function to change pages
        function changePage(pageNumber, post) {
            const pages = post.querySelectorAll('.circa-page');
            const buttons = post.querySelectorAll('.circa-page-btn');

            pages.forEach(page => page.style.display = 'none');
            pages[pageNumber - 1].style.display = 'block';

            buttons.forEach(btn => btn.classList.remove('active'));
            buttons[pageNumber - 1].classList.add('active');
        }
    });
});
