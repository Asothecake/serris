// JavaScript for toggling visibility of sections (Stats, Commands, Style)
function toggleVisibility(element, className) {
    const container = element.closest('.aso-post-container');
    if (!container) return;

    const section = container.querySelector(.${className});
    if (section) {
        section.classList.toggle('aso-content-hidden');
        section.classList.toggle('aso-content-visible');
    }
}

// JavaScript for updating the resource bar fill percentage dynamically
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".aso-post-container").forEach(container => {
        // Function to safely retrieve CSS variables
        function getCSSVariable(element, variable, fallback) {
            return getComputedStyle(element).getPropertyValue(variable).trim() || fallback;
        }

        // Update HP bar
        container.querySelectorAll(".aso-hp-bar-container").forEach(bar => {
            if (!bar.querySelector('.aso-hp-bar-fill')) { // Prevent duplicate fills
                const current = parseInt(bar.getAttribute("data-current"), 10) || 0;
                const max = parseInt(bar.getAttribute("data-max"), 10) || 1;
                const fill = document.createElement('div');
                fill.classList.add('aso-hp-bar-fill');
                fill.style.width = ${(current / max) * 100}%;
                fill.style.backgroundColor = getCSSVariable(bar, "--hp-bar-color", "#e74c3c");
                bar.appendChild(fill);
            }
        });

        // Function to update resource bars (IP and Limit)
        function updateResourceBar(wrapper, colorVariable, defaultColor) {
            const current = parseInt(wrapper.getAttribute("data-current"), 10) || 0;
            const max = parseInt(wrapper.getAttribute("data-max"), 10) || 1;
            wrapper.innerHTML = ""; // Clear existing units

            for (let i = 0; i < max; i++) {
                const unit = document.createElement('div');
                unit.classList.add('aso-resource-unit');
                unit.style.backgroundColor = i < current
                    ? getCSSVariable(wrapper, colorVariable, defaultColor)
                    : "rgba(105, 105, 105, 0.1)";
                wrapper.appendChild(unit);
            }
        }

        // Update IP bar
        container.querySelectorAll(".aso-resource-bar-wrapper").forEach(wrapper => {
            updateResourceBar(wrapper, "--ip-bar-color", "#66bb6a");
        });

        // Update Limit bar
        container.querySelectorAll(".aso-limit-bar-wrapper").forEach(wrapper => {
            updateResourceBar(wrapper, "--limit-bar-color", "#42a5f5");
        });
    });
});
