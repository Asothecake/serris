document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".verisaso-flexbox").forEach((post) => {
        // HP Bar Handling
        const hpContainer = post.querySelector(".verisaso-hp-bar-container");
        const hpFill = hpContainer ? hpContainer.querySelector(".verisaso-hp-bar-fill") : null;

        if (hpContainer && hpFill) {
            let maxHp = parseInt(hpContainer.getAttribute("data-max-hp"), 10);

            const updateHPBar = () => {
                let currentHp = parseInt(hpContainer.getAttribute("data-current-hp"), 10);
                currentHp = isNaN(currentHp) || currentHp < 0 ? 0 : Math.min(currentHp, maxHp);
                let widthPercent = `${(currentHp / maxHp) * 100}%`;
                hpFill.style.width = widthPercent;
            };

            updateHPBar();
        }

        // Page Switching Handling
        const scrollbox = post.querySelector(".verisaso-scrollbox");
        const pages = scrollbox.querySelectorAll(".verisaso-page");
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

        // 🌟 Effect and Buff Mappings
        const effectStatuses = ["Corruption", "Berserk", "Weaken", "Blind", "Poison", "Silence"];
        const buffStatuses = ["Dualcast", "Mine", "Regen", "Resonance", "Haste", "Combo+", "Shell", "Chant"];

        // 🔹 COMMAND & PROVISION PROCESSING
        const commandMappings = {
            "dark-calamity": (values) => {
                let dmg = formatDamage(values[0], 4);
                let heal = values[1] ? `<span class="healing">${values[1]} HP Healed</span>` : "";
                return `${dmg} Dark Damage${heal ? `, ${heal}` : ""}`;
            },
            "resurgence": () => `Veris Gains ${formatBuff("Chant and Resonance")} for 3 Turns, and generates <span class='effect-status'>1 Abyss Charge</span>.`,
            "howling-echo": (values) => {
                let corruption = values[0] ? `${formatEffect(values[0])} to inflict ${formatEffect("Corruption")} for 3 turns` : "";
                let berserk = values[1] ? `${formatEffect(values[1])} to inflict ${formatEffect("Berserk")} for 3 turns` : "";
                return [corruption, berserk].filter(Boolean).join(", ");
            },
            "shadow-veil": (values) => {
                let cleanse = values[0] ? `${formatBuff(values[0])} Cleanses` : "";
                let dmg = values[1] ? `<span class="damage">${values[1]} Dark Damage</span>` : "";
                return [cleanse, dmg].filter(Boolean).join(", ");
            },
            "sanguine-blade": (values) => {
                let weaken = values[0] ? `${formatEffect(values[0])} to inflict ${formatEffect("Weaken")} for 3 turns` : "";
                let dmg = values[1] ? `<span class="damage">${values[1]} Dark Damage</span>` : "";
                return `${weaken}, ${dmg}. Veris gains ${formatBuff("Dualcast")} for 3 turns.`;
            },
            "nightfall": (values) => {
                let buff = values[0] && parseInt(values[0]) > 0
                    ? `Veris gains ${formatBuff("Mine, Combo+, Dualcast, and Haste")} for 3 turns. Strikes and Raids gain Dark Element and +1 modifiers for 3 turns.`
                    : `Veris gains ${formatBuff("Shell, Regen, Dualcast, and Haste")} for 3 turns. Strikes and Raids gain Dark Element and +1 modifiers for 3 turns.`;
                return buff;
            },
            "howl-of-the-abyss": () => `Veris gains ${formatBuff("Quick")} and access to: <span class='command'>Tenebrous Fang, Umbral Claw, and Noctem Eclipse</span> for 3 turns.`,
            "tenebrous-fang": (values) => {
                let heal = values[0] ? `<span class="healing">${values[0]} HP Healed</span>` : "";
                let darkDmg = formatDamage(values[1], 2);
                let tenebrousDmg = values[2] ? `<span class="damage">${values[2]} Damage from Tenebrous</span>` : "";
                return [heal, darkDmg, tenebrousDmg].filter(Boolean).join(", ");
            },

            // 🏆 PROVISIONS PROCESSING 🏆
            "remembrance": () => `Gains ${formatBuff("Quick")} for 3 Turns.`,
            "potion": (values) => `<span class="healing">${values[0]} HP Restored</span>.`,
            "hi-potion": (values) => `<span class="healing">${parseInt(values[0]) + 2} HP Restored</span>.`,
            "esuna": (values) => `${formatBuff(values[0])} to Cleanse.`,
            "ether": (values) => `<span class="mana">${values[0]} Charge</span>.`,
            "mega-potion": (values) => `<span class="healing">${parseInt(values[0]) + 2} HP Restored to all Allies</span>.`,
            "mega-ether": (values) => `<span class="mana">${values[0]} Charge to all Allies</span>.`,
            "elixir": (values) => `<span class="mana">${values[0]} Charge</span>, <span class="healing">${parseInt(values[1]) + 2} HP Restored</span>.`,
            "megalixir": (values) => `<span class="mana">${values[0]} Charge</span>, <span class="healing">${parseInt(values[1]) + 2} HP Restored to All Allies</span>.`,
        };

        // Apply changes to each command span inside the scrollbox
        post.querySelectorAll(".verisaso-page span").forEach((element) => {
            let commandClass = Object.keys(commandMappings).find(cmd => element.classList.contains(cmd));
            if (commandClass) {
                let values = element.textContent.split(",").map(v => v.trim()).filter(Boolean);
                let formattedOutput = commandMappings[commandClass](values);
                if (formattedOutput) {
                    element.innerHTML = `<b class="command">${formatCommandName(commandClass)}</b>: ${formattedOutput}`;
                }
            }
        });

        // 🔢 Utility Function: Handles Number Formatting and Auto-Adds Modifier
        function formatDamage(value, modifier) {
            if (!value) return "";
            let numbers = value.split("+").map(v => parseInt(v.trim())).filter(n => !isNaN(n));
            if (numbers.length === 0) return "";
            let total = numbers.reduce((sum, num) => sum + num, modifier);
            return `<span class="damage">${total} (${numbers.join("+")}+${modifier})</span>`;
        }

        // 🎨 Utility Functions: Formatting
        function formatEffect(status) { return `<span class="effect-status">${status}</span>`; }
        function formatBuff(buff) { return `<span class="buff-status">${buff}</span>`; }
    });
});
