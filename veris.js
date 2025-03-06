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

        // 🔹 COMMAND PROCESSING
        const commandMappings = {
            "dark-calamity": (values) => {
                let dmg = calculateWithModifier(values[0], 4);
                let heal = values[1] ? `${values[1]} HP Healed` : "";
                return `${dmg} Dark Damage${heal ? `, ${heal}` : ""}`;
            },
            "resurgence": () => "Veris Gains Chant and Resonance for 3 Turns, and generates 1 Abyss Charge.",
            "howling-echo": (values) => {
                let corruption = values[0] ? `${values[0]} to inflict Corruption for 3 turns` : "";
                let berserk = values[1] ? `${values[1]} to inflict Berserk for 3 turns` : "";
                return [corruption, berserk].filter(Boolean).join(", ");
            },
            "shadow-veil": (values) => {
                let cleanse = values[0] ? `${values[0]} Cleanses` : "";
                let dmg = values[1] ? `${values[1]} Dark Damage` : "";
                return [cleanse, dmg].filter(Boolean).join(", ");
            },
            "sanguine-blade": (values) => {
                let weaken = values[0] ? `${values[0]} to inflict Weaken for 3 turns` : "";
                let dmg = values[1] ? `${values[1]} Dark Damage` : "";
                return `${weaken}, ${dmg}. Veris gains Dualcast for 3 turns.`;
            },
            "nightfall": (values) => {
                let buff = values[0] && parseInt(values[0]) > 0
                    ? "Veris gains Mine, Combo+, Dualcast, and Haste for 3 turns. Strikes and Raids gain Dark Element and +1 modifiers for 3 turns."
                    : "Veris gains Shell, Regen, Dualcast, and Haste for 3 turns. Strikes and Raids gain Dark Element and +1 modifiers for 3 turns.";
                return buff;
            },
            "howl-of-the-abyss": () => "Veris gains Quick and access to: Tenebrous Fang, Umbral Claw, and Noctem Eclipse for 3 turns.",
            "tenebrous-fang": (values) => {
                let heal = values[0] ? `${values[0]} HP Healed` : "";
                let darkDmg = calculateWithModifier(values[1], 2);
                let tenebrousDmg = values[2] ? `${values[2]} Damage from Tenebrous` : "";
                return [heal, darkDmg, tenebrousDmg].filter(Boolean).join(", ");
            },
            "umbral-swiftfoot": (values) => {
                return values[0] ? `${values[0]} Dodge Roll` : "";
            },
            "noctem-eclipse": (values) => {
                let darkDmg = calculateWithModifier(values[0], 4);
                let tenebrousDmg = values[1] ? `${values[1]} Damage from Tenebrous` : "";
                return `${darkDmg} Dark Damage${tenebrousDmg ? `, ${tenebrousDmg}` : ""}`;
            },
        };

        post.querySelectorAll(".verisaso-page span").forEach((element) => {
            let commandClass = Object.keys(commandMappings).find(cmd => element.classList.contains(cmd));
            if (commandClass) {
                let values = element.textContent.split(",").map(v => v.trim()).filter(Boolean);
                let formattedOutput = commandMappings[commandClass](values);
                if (formattedOutput) {
                    element.innerHTML = `<b>${commandClass.replace(/-/g, " ")}</b>: ${formattedOutput}`;
                }
            }
        });

        function calculateWithModifier(value, modifier) {
            if (!value) return "";
            let numbers = value.split("+").map(v => parseInt(v.trim())).filter(n => !isNaN(n));
            if (numbers.length === 0) return "";
            let total = numbers.reduce((sum, num) => sum + num, modifier);
            return `${total} (${numbers.join("+")}+${modifier})`;
        }
    });
});
