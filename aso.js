// JavaScript for toggling visibility of sections (Stats, Commands, Style)
function toggleVisibility(id) {
    const element = document.getElementById(id);
    element.classList.toggle('aso-content-hidden');
    element.classList.toggle('aso-content-visible');
}

// JavaScript for updating the resource bar fill percentage dynamically
document.addEventListener("DOMContentLoaded", () => {
    // Update HP bar
    document.querySelectorAll(".aso-hp-bar-container").forEach(container => {
        const current = parseInt(container.getAttribute("data-current"), 10);
        const max = parseInt(container.getAttribute("data-max"), 10);
        const fill = document.createElement("div");
        fill.classList.add("aso-hp-bar-fill");
        container.appendChild(fill);
        const widthPercent = (current / max) * 100;
        fill.style.width = widthPercent + "%";
    });

    // Update IP bar
    document.querySelectorAll(".aso-resource-bar-wrapper").forEach(wrapper => {
        const current = parseInt(wrapper.getAttribute("data-current"), 10);
        const max = parseInt(wrapper.getAttribute("data-max"), 10);
        const units = wrapper.querySelectorAll(".aso-resource-unit");
        
        // If units are not present, create them based on the max value
        if (units.length === 0) {
            for (let i = 0; i < max; i++) {
                const unit = document.createElement("div");
                unit.classList.add("aso-resource-unit");
                if (i >= current) {
                    unit.classList.add("unfilled");
                }
                wrapper.appendChild(unit);
            }
        } else {
            // Update existing units
            units.forEach((unit, index) => {
                if (index < current) {
                    unit.classList.remove("unfilled");
                } else {
                    unit.classList.add("unfilled");
                }
            });
        }
    });

    // Update Limit bar
    document.querySelectorAll(".aso-limit-bar-wrapper").forEach(wrapper => {
        const current = parseInt(wrapper.getAttribute("data-current"), 10);
        const max = parseInt(wrapper.getAttribute("data-max"), 10);
        const units = wrapper.querySelectorAll(".aso-resource-unit");
        
        // If units are not present, create them based on the max value
        if (units.length === 0) {
            for (let i = 0; i < max; i++) {
                const unit = document.createElement("div");
                unit.classList.add("aso-resource-unit");
                if (i >= current) {
                    unit.classList.add("unfilled");
                }
                wrapper.appendChild(unit);
            }
        } else {
            // Update existing units
            units.forEach((unit, index) => {
                if (index < current) {
                    unit.classList.remove("unfilled");
                } else {
                    unit.classList.add("unfilled");
                }
            });
        }
    });
});
