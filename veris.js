document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".verisaso-flexbox").forEach((post, index) => {
        console.log(`Processing Post #${index}`); // 🛠 Debugging Log

        // 🩸 HP BAR FUNCTIONALITY
        const hpContainer = post.querySelector(".verisaso-hp-bar-container");
        const hpFill = hpContainer ? hpContainer.querySelector(".verisaso-hp-bar-fill") : null;

        if (hpContainer && hpFill) {
            let maxHp = parseInt(hpContainer.getAttribute("data-max-hp"), 10);
            const updateHPBar = () => {
                let currentHp = parseInt(hpContainer.getAttribute("data-current-hp"), 10);
                currentHp = isNaN(currentHp) || currentHp < 0 ? 0 : Math.min(currentHp, maxHp);
                hpFill.style.width = `${(currentHp / maxHp) * 100}%`;
            };
            updateHPBar();
        }

        // 📜 PAGE SWITCHING FUNCTION
        const scrollbox = post.querySelector(".verisaso-scrollbox");
        const pages = scrollbox ? scrollbox.querySelectorAll(".verisaso-page") : [];
        const pageButtons = post.querySelectorAll(".verisaso-page-btn");

        if (scrollbox && pages.length && pageButtons.length) {
            const changePage = (pageNumber) => {
                pages.forEach((page, index) => {
                    page.style.display = (index + 1 === pageNumber) ? "block" : "none";
                });
                pageButtons.forEach((btn, index) => {
                    btn.classList.toggle("active", index + 1 === pageNumber);
                });
            };
            changePage(1);
            pageButtons.forEach((btn, index) => {
                btn.addEventListener("click", () => changePage(index + 1));
            });
        }

        // 🛠 COMMAND PROCESSING
        const commandElements = post.querySelectorAll(".verisaso-page span");
        console.log(`Found ${commandElements.length} command elements in Post #${index}`);

        commandElements.forEach((element) => {
            let commandClass = element.classList[0]; // 🛠 Get class dynamically
            console.log(`Processing Command: ${commandClass} in Post #${index}`);

            if (commandMappings[commandClass] && !element.dataset.processed) {
                let values = element.textContent.split(",").map(v => v.trim()).filter(Boolean);
                let formattedOutput = commandMappings[commandClass](values);
                console.log(`Formatted Output: ${formattedOutput}`);

                if (formattedOutput) {
                    element.innerHTML = `<b class="command">${formatCommandName(commandClass)}</b>: ${formattedOutput}`;
                    element.dataset.processed = "true"; // Prevent reprocessing
                }
            } else {
                console.warn(`Command ${commandClass} not found in commandMappings.`);
            }
        });
    });
});

// 🔹 COMMAND MAPPINGS
const commandMappings = {
    "dark-calamity": (values) => {
        let dmg = formatDamage(values[0], 4);
        let heal = values[1] ? `<span class="healing">${values[1]} HP Healed</span>` : "";
        return `<span class="damage">${dmg} Damage</span>${heal ? `, ${heal}` : ""}`;
    },
    "resurgence": () => 
        "Veris Gains <span class='effect-status'>Chant and Resonance</span> for 3 Turns, and generates <span class='effect-status'>1 Abyss Charge</span>.",
    "strike": (values) => `<span class="stat-action">${values[0]} Damage</span>.`,
};

// 🔢 UTILITY FUNCTIONS
function formatDamage(value, modifier) {
    if (!value) return "";
    let numbers = value.split("+").map(v => parseInt(v.trim())).filter(n => !isNaN(n));
    if (numbers.length === 0) return "";
    let total = numbers.reduce((sum, num) => sum + num, modifier);
    return `<span class="damage">${total} (${numbers.join("+")}+${modifier})</span>`;
}

function formatCommandName(name) {
    return name.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
