   <script>
        document.addEventListener("DOMContentLoaded", () => {
            const buttons = document.querySelectorAll(".circa-button");
            const pages = document.querySelectorAll(".circa-content-page");

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
        });
    </script>