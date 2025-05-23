document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".verisaso-flexbox").forEach((post) => {

        // 🌟 HP Bar Handling
        //  HP Bar Handling
        const hpContainer = post.querySelector(".verisaso-hp-bar-container");
        if (hpContainer) {
            const hpFill = hpContainer.querySelector(".verisaso-hp-bar-fill");
            let maxHp = parseInt(hpContainer.getAttribute("data-max-hp"), 10);

            const updateHPBar = () => {
                let currentHp = parseInt(hpContainer.getAttribute("data-current-hp"), 10);
                currentHp = isNaN(currentHp) || currentHp < 0 ? 0 : Math.min(currentHp, maxHp);
                hpFill.style.width = `${(currentHp / maxHp) * 100}%`;
            };

            updateHPBar();
        }

        // 🌟 Page Switching Handling
        //  Page Switching Handling
        const scrollbox = post.querySelector(".verisaso-scrollbox");
        if (scrollbox) {
            const pages = scrollbox.querySelectorAll(".verisaso-page");
            const pageButtons = post.querySelectorAll(".verisaso-page-btn");

            if (pages.length && pageButtons.length) {
                const changePage = (pageNumber) => {
                    pages.forEach((page, index) => {
                        page.style.display = index + 1 === pageNumber ? "block" : "none";
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
        }

        // 🌟 COMMAND, ITEM, AND STAT ACTION PROCESSING
        //  COMMAND, ITEM, AND STAT ACTION PROCESSING
        const commandMappings = {
            "dark-calamity": (values) => {
                let dmg = formatDamage(values[0], 4);
                let heal = values[1] ? `<span class="healing">${values[1]} HP Healed</span>` : "";
                return `<span class="damage">${dmg} Damage</span>${heal ? `, ${heal}` : ""}`;
            },
            "resurgence": () => `Veris Gains <span class='effect-status'>Chant and Resonance</span> for 3 Turns, and generates <span class='effect-status'>1 Abyss Charge</span>.`,
            "howling-echo": (values) => {
                let corruption = values[0] ? `<span class="effect-status">${values[0]} to inflict Corruption for 3 turns</span>` : "";
                let berserk = values[1] ? `<span class="effect-status">${values[1]} to inflict Berserk for 3 turns</span>` : "";
                return [corruption, berserk].filter(Boolean).join(", ");
            },
            "noctem-eclipse": (values) => {
    let darkDmg = formatDamage(values[0], 4);
    let tenebrousDmg = values[1] ? `<span class="damage">${values[1]} Damage from Tenebrous</span>` : "";
    return `<span class="damage">${darkDmg} Damage</span>${tenebrousDmg ? `, ${tenebrousDmg}` : ""}`;
},
"umbral-swiftfoot": (values) => {
    return values[0] ? `<span class="effect-status">${values[0]} Dodge Roll</span>` : "";
},
            "shadow-veil": (values) => {
                let cleanse = values[0] ? `<span class="effect-status">${values[0]} Cleanses</span>` : "";
                let dmg = values[1] ? `<span class="damage">${values[1]} Damage</span>` : "";
                return [cleanse, dmg].filter(Boolean).join(", ");
            },
            "sanguine-blade": (values) => {
                let weaken = values[0] ? `<span class="effect-status">${values[0]} to inflict Weaken for 3 turns</span>` : "";
                let dmg = values[1] ? `<span class="damage">${values[1]} Damage</span>` : "";
                return `${weaken}, ${dmg}. Veris gains <span class="effect-status">Dualcast</span> for 3 turns.`;
            },
            "nightfall": (values) => {
                return values[0] && parseInt(values[0]) > 0
                    ? "Veris gains <span class='effect-status'>Mine, Combo+, Dualcast, and Haste</span> for 3 turns. Strikes and Raids gain Dark Element and +1 modifiers for 3 turns."
                    : "Veris gains <span class='effect-status'>Shell, Regen, Dualcast, and Haste</span> for 3 turns. Strikes and Raids gain Dark Element and +1 modifiers for 3 turns.";
            },
            "howl-of-the-abyss": () => `Veris gains <span class='effect-status'>Quick</span> and access to: <span class='command'>Tenebrous Fang, Umbral Claw, and Noctem Eclipse</span> for 3 turns.`,
            "tenebrous-fang": (values) => {
                let heal = values[0] ? `<span class="healing">${values[0]} HP Healed</span>` : "";
                let darkDmg = formatDamage(values[1], 2);
                let tenebrousDmg = values[2] ? `<span class="damage">${values[2]} Damage from Tenebrous</span>` : "";
                return [heal, `<span class="damage">${darkDmg} Damage</span>`, tenebrousDmg].filter(Boolean).join(", ");
            },

            // 🏆 PROVISIONS (Added the missing ones)
            //  PROVISIONS (Added the missing ones)
            "potion": (values) => `<span class="healing">${values[0]} HP Restored</span>.`,
            "hi-potion": (values) => `<span class="healing">${parseInt(values[0]) + 2} HP Restored</span>.`,
            "ether": (values) => `<span class="mana">${values[0]} Charge</span>.`,
            "mega-potion": (values) => `<span class="healing">${parseInt(values[0]) + 2} HP Restored to all Allies</span>.`,
            "mega-ether": (values) => `<span class="mana">${values[0]} Charge to all Allies</span>.`,
            "elixir": (values) => `<span class="mana">${values[0]} Charge</span>, <span class="healing">${parseInt(values[1]) + 2} HP Restored</span>.`,
            "remembrance": () => `Gains <span class="effect-status">Quick, Haste, and Combo+</span> for 3 Turns.`,
            "megalixir": (values) => `<span class="mana">${values[0]} Charge</span>, <span class="healing">${parseInt(values[1]) + 2} HP Restored to All Allies</span>.`,

            // 🛡️ STAT ACTIONS (Added the missing ones)
            //  STAT ACTIONS 
            "strike": (values) => `<span class="stat-action">${values[0]} Damage</span>.`,
            "breach": (values) => `<span class="stat-action">${values[0]} Damage added to next Attack</span>.`,
            "dodge": (values) => `<span class="stat-action">${values[0]} Dodge</span>.`,
            "raid": (values) => `<span class="stat-action">${values[0]} Damage</span>.`,
            "charge": (values) => `<span class="stat-action">${values[0]} Charge</span>.`,
            "cleanse": (values) => `<span class="stat-action">${values[0]} Cleanse</span>.`,
        };

        // 🌟 Apply Formatting to Commands
        //  Apply Formatting to Commands
        post.querySelectorAll(".verisaso-page span").forEach((element) => {
            if (element.dataset.processed) return; // Prevent duplicate processing
            let commandClass = element.classList[0];
            if (commandMappings[commandClass]) {
                let values = element.textContent.split(",").map(v => v.trim()).filter(Boolean);
                let formattedOutput = commandMappings[commandClass](values);
                if (formattedOutput) {
                    element.innerHTML = `<b class="command">${formatCommandName(commandClass)}</b>: ${formattedOutput}`;
                    element.dataset.processed = "true"; // Mark as processed
                }
            }
        });

        // 🔢 Utility Functions
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
    });
});
