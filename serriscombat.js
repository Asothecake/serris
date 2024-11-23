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
        const fill = document.createElement('div');
        fill.classList.add('aso-hp-bar-fill');
        const widthPercent = (current / max) * 100;
        fill.style.width = widthPercent + "%";
        container.appendChild(fill);
    });

    // Update IP bar
    document.querySelectorAll(".aso-resource-bar-wrapper").forEach(wrapper => {
        const current = parseInt(wrapper.getAttribute("data-current"), 10);
        const max = parseInt(wrapper.getAttribute("data-max"), 10);
        wrapper.innerHTML = ""; // Clear existing units

        // Loop to create units for the resource bar
        for (let i = 0; i < max; i++) {
            const unit = document.createElement('div');
            unit.classList.add('aso-resource-unit');
            if (i >= current) {
                unit.classList.add('unfilled');
            }
            wrapper.appendChild(unit);
        }
    });

    // Update Limit bar
    document.querySelectorAll(".aso-limit-bar-wrapper").forEach(wrapper => {
        const current = parseInt(wrapper.getAttribute("data-current"), 10);
        const max = parseInt(wrapper.getAttribute("data-max"), 10);
        wrapper.innerHTML = ""; // Clear existing units

        // Loop to create units for the limit bar
        for (let i = 0; i < max; i++) {
            const unit = document.createElement('div');
            unit.classList.add('aso-resource-unit');
            if (i >= current) {
                unit.classList.add('unfilled');
            }
            wrapper.appendChild(unit);
        }
    });

    // Dynamic content injection for Stats, Commands, and Style sections
    const statsContent = [
        { name: "STRENGTH", die: "D", value: "12" },
        { name: "MAGIC", die: "D", value: "10" },
        { name: "AGILITY", die: "D", value: "04" },
        { name: "DEFENSE", die: "D", value: "12" }
    ];

    const commandsContent = [
        "Fortification", "Retaliate", "Battlecry", "Shieldmaiden", "Hypervelocity", "Gnashing Fang", "Savage Claw", "Wicked Talon", "Confetior", "Blade of Faith", "Blade of Truth", "Blade of Valor", "Songbird", "Dragons Dance", "Blizzara", "Dual Aero"
    ];

    const styleContent = `
        <p>Limit: When Serris uses a temporary command provided by the Commanding Property, her limit gauge increases by 1 (max 3). The Limit gauge resets to 0 when the current commanding command expires. Serris may use an action and deplete her gauge to use Limit Break. <b>Limit Break:</b> Serris rolls the current "weapon's" stat dice twice, dealing HR damage, and gains a scaling benefit based on her Limit Gauge.
        <br>Strength: +2/4/6 HR
        <br>Defense: LR Guard/+2 LR/+4 LR
        <br>Magic: +Overcharge/+2 HR/+4 HR
        <br>Agility: LR Dodge/+2 LR/+4 LR</p>
        <p>Oath: Whenever Serris uses a mastered command, she gains +2 to that Stat's LR while the Mastered Command is active</p>
        <p>Aegis: Whenever Serris applies Protect, she automatically applies Regen at the same duration.</p>
        <p>Weaponmaster: Serris uses a variety of weapons that are swapped during mastered commands. Whenever Serris uses a mastered command, she gains +2 to that Stat's HR's while the command is active.</p>
        <p>Unwavering (Condition): Strike gains targeted Heal (LR).</p>
    `;

    // Inject Stats content
    const statsContainer = document.getElementById("aso-statsContent");
    statsContainer.innerHTML = statsContent.map(stat => `
        <div class="aso-stat-entry aso-stat-${stat.name.toLowerCase()}">
            <div class="aso-stat-name">${stat.name}</div>
            <div class="aso-stat-die">${stat.die}</div>
            <div class="aso-stat-value-box">${stat.value}</div>
        </div>
    `).join("");

    // Inject Commands content
    const commandsContainer = document.getElementById("aso-commandsContent");
    commandsContainer.innerHTML = commandsContent.map(command => `
        <div class="aso-command-entry">${command}</div>
    `).join("");

    // Inject Style content
    const styleContainer = document.getElementById("aso-styleContent");
    styleContainer.innerHTML = styleContent;
});
