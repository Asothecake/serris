// JavaScript for toggling visibility of sections (Stats, Commands, Style)
function toggleVisibility(element, className) {
    // Find the closest container element that contains all relevant parts
    const container = element.closest('.aso-post-container');
    
    // Find the relevant section within the container and toggle its visibility
    const section = container.querySelector(`.${className}`);
    if (section) {
        section.classList.toggle('aso-content-hidden');
        section.classList.toggle('aso-content-visible');
    }
}

// JavaScript for updating the resource bar fill percentage dynamically
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".aso-post-container").forEach(container => {
        // Update HP bar
        container.querySelectorAll(".aso-hp-bar-container").forEach(bar => {
            if (!bar.querySelector('.aso-hp-bar-fill')) { // Prevent duplicate fills
                const current = parseInt(bar.getAttribute("data-current"), 10) || 0;
                const max = parseInt(bar.getAttribute("data-max"), 10) || 1;
                const fill = document.createElement('div');
                fill.classList.add('aso-hp-bar-fill');
                fill.style.width = `${(current / max) * 100}%`;
                fill.style.backgroundColor = getComputedStyle(bar).getPropertyValue("--hp-bar-color").trim() || "#e74c3c"; 
                bar.appendChild(fill);
            }
        });

        // Update IP bar
        container.querySelectorAll(".aso-resource-bar-wrapper").forEach(wrapper => {
            const current = parseInt(wrapper.getAttribute("data-current"), 10) || 0;
            const max = parseInt(wrapper.getAttribute("data-max"), 10) || 1;
            wrapper.innerHTML = ""; // Clear existing units

            for (let i = 0; i < max; i++) {
                const unit = document.createElement('div');
                unit.classList.add('aso-resource-unit');
                unit.style.backgroundColor = i < current 
                    ? getComputedStyle(wrapper).getPropertyValue("--ip-bar-color").trim() || "#66bb6a"
                    : "rgba(105, 105, 105, 0.1)";
                wrapper.appendChild(unit);
            }
        });

        // Update Limit bar
        container.querySelectorAll(".aso-limit-bar-wrapper").forEach(wrapper => {
            const current = parseInt(wrapper.getAttribute("data-current"), 10) || 0;
            const max = parseInt(wrapper.getAttribute("data-max"), 10) || 1;
            wrapper.innerHTML = ""; // Clear existing units

            for (let i = 0; i < max; i++) {
                const unit = document.createElement('div');
                unit.classList.add('aso-resource-unit');
                unit.style.backgroundColor = i < current 
                    ? getComputedStyle(wrapper).getPropertyValue("--limit-bar-color").trim() || "#42a5f5"
                    : "rgba(105, 105, 105, 0.1)";
                wrapper.appendChild(unit);
            }
        });
    });
});
