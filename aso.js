// JavaScript for toggling visibility of sections (Stats, Commands, Style)
function toggleVisibility(element, className) {
    const container = element.closest('.aso-post-container');
    if (!container) return;

    const section = container.querySelector(`.${className}`);
    if (section) {
        section.classList.toggle('aso-content-hidden');
        section.classList.toggle('aso-content-visible');
    }
}

// Function to safely retrieve CSS variables with a fallback
function getCSSVariable(element, variable, fallback) {
    let value = getComputedStyle(element).getPropertyValue(variable).trim();
    return value.length > 0 ? value : fallback; 
}

// Ensure JavaScript executes after styles are fully applied
window.addEventListener("load", () => {
    document.querySelectorAll(".aso-post-container").forEach(container => {
        console.log("Loaded Container:", container);

        // Debug: Ensure variables exist
        console.log("HP Bar Color:", getCSSVariable(container, "--hp-bar-color", "#e74c3c"));
        console.log("IP Bar Color:", getCSSVariable(container, "--ip-bar-color", "#66bb6a"));
        console.log("Limit Bar Color:", getCSSVariable(container, "--limit-bar-color", "#42a5f5"));

        // Update HP bar
        container.querySelectorAll(".aso-hp-bar-container").forEach(bar => {
            let fill = bar.querySelector('.aso-hp-bar-fill');
            const current = parseInt(bar.getAttribute("data-current"), 10) || 0;
            const max = parseInt(bar.getAttribute("data-max"), 10) || 1;

            if (!fill) {
                fill = document.createElement('div');
                fill.classList.add('aso-hp-bar-fill');
                bar.appendChild(fill);
            }
            fill.style.width = `${(current / max) * 100}%`;
            fill.style.backgroundColor = getCSSVariable(bar, "--hp-bar-color", "#e74c3c");
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
