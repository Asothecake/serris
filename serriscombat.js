// JavaScript for toggling visibility of sections (Stats, Commands, Style)
function toggleVisibility(id) {
    const element = document.getElementById(id);
    element.classList.toggle('serris-content-hidden');
    element.classList.toggle('serris-content-visible');
}

// JavaScript for updating the resource bar fill percentage dynamically
document.addEventListener("DOMContentLoaded", () => {
    // Update HP bar
    document.querySelectorAll(".serris-hp-bar-container").forEach(container => {
        const current = parseInt(container.getAttribute("data-current"), 10);
        const max = parseInt(container.getAttribute("data-max"), 10);
        const fill = document.createElement('div');
        fill.classList.add('serris-hp-bar-fill');
        const widthPercent = (current / max) * 100;
        fill.style.width = widthPercent + "%";
        container.appendChild(fill);
    });

    // Update IP bar
    document.querySelectorAll(".serris-resource-bar-wrapper").forEach(wrapper => {
        const current = parseInt(wrapper.getAttribute("data-current"), 10);
        const max = parseInt(wrapper.getAttribute("data-max"), 10);
        wrapper.innerHTML = ""; // Clear existing units

        // Loop to create units for the resource bar
        for (let i = 0; i < max; i++) {
            const unit = document.createElement('div');
            unit.classList.add('serris-resource-unit');
            if (i >= current) {
                unit.classList.add('unfilled');
            }
            wrapper.appendChild(unit);
        }
    });

    // Update Limit bar
    document.querySelectorAll(".serris-limit-bar-wrapper").forEach(wrapper => {
        const current = parseInt(wrapper.getAttribute("data-current"), 10);
        const max = parseInt(wrapper.getAttribute("data-max"), 10);
        wrapper.innerHTML = ""; // Clear existing units

        // Loop to create units for the limit bar
        for (let i = 0; i < max; i++) {
            const unit = document.createElement('div');
            unit.classList.add('serris-resource-unit');
            if (i >= current) {
                unit.classList.add('unfilled');
            }
            wrapper.appendChild(unit);
        }
    });
});
