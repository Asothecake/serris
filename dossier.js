window.DossierCount = window.DossierCount >= 0 ? window.DossierCount + 1 : 0;

if (typeof DossierController === "function") {
  console.log("Script loaded, DossierCount:", window.DossierCount);
  new DossierController(window.DossierCount).initiate();
} else {
  class DossierController {
    constructor(dossierCount) {
      this.dossierCount = dossierCount;
      this.TempButton = document.getElementsByClassName("ds-temporary")[dossierCount];
      this.Template = document.getElementsByClassName("ds-dossier-template")[dossierCount];
      this.DataContainer = document.getElementsByClassName("ds-dossier-placeholder")[dossierCount];
      console.log("DataContainer found:", !!this.DataContainer);
      this.config = this.getConfig(this.getFirst("config"));
      console.log("Initial Config:", this.config); // Debug config on init
      this.bio = this.arrayify(this.getFirst("bio"));
      this.stats = this.arrayify(this.getFirst("stats"));
      if (this.config[3] === "yes") this.mirage = this.arrayify(this.getFirst("mirage"));
      else this.mirage = [];
      this.style = this.objectify(["style", "style-details", "style-points"])[0];
      this.lore = this.objectify(["lore-item", "lore-details"]);
      this.commands = this.objectify(["command", "command-details", "command-stats"]);
      this.provisions = this.objectify(["provision", "provision-details", "provision-stats"]);
      this.reactions = this.objectify(["reaction", "reaction-details", "reaction-stats"]);
      this.links = this.compoundObjectify(["link", "link-details", "link-rank", "link-command-name", "link-command-details", "link-command-stat", "link-command-cp", "link-style"]);
      this.timelines = this.getTimelines();
      this.currentPanel = 0;
      this.badgeMap = {
        "Nobody": "https://i.imgur.com/1QNGfY5.png",
        "Heartless": "https://i.imgur.com/4CUgNR7.png",
        "Wielder": "https://i.imgur.com/nKDoVDC.png",
        "Legendary": "https://i.imgur.com/hLnG0K7.png",
        "Steelguard": "https://i.imgur.com/NsTbs8w.png",
        "Support": "https://i.imgur.com/HSoJfIL.png",
        "Beast": "https://i.imgur.com/Y94PMHD.png",
        "Fantasy": "https://i.imgur.com/HwOHDOM.png",
        "Nightmare": "https://i.imgur.com/62gXQfh.png",
        "Misc": "https://i.imgur.com/lNVK2mN.png"
      };
    }
    getFirst(id) {
      return this.DataContainer.getElementsByClassName(id)[0];
    }
    getAll(id) {
      return this.DataContainer.getElementsByClassName(id);
    }
    getBook() {
      this.BookContainer = document.getElementsByClassName("ds-dossier-container")[this.dossierCount];
    }
    getBookTabs() {
      return this.BookContainer.getElementsByClassName("ds-dossier-tab");
    }
    getBookContent() {
      return this.BookContainer.getElementsByClassName("ds-dossier-content")[0];
    }
    getPhoto() {
      return this.BookContainer.getElementsByClassName("ds-dossier-photo")[0];
    }
    getConfigProperty(element) {
      if (!element) return "";
      const fullString = element.innerHTML;
      if (fullString.includes("Enemy Type:") || fullString.includes("Icon Variation:") ||
          fullString.includes("Content BG Color:") || fullString.includes("Stat BG Color:")) {
        console.log("Config Property Raw:", fullString); // Debug specific lines
      }
      return fullString.split("</b>")[1]?.trim() || "";
    }
    hasBonusConfig(element, configName) {
      return element.innerHTML.includes(configName);
    }
    getConfig(element) {
      if (!element) return [];
      const children = Array.from(element.children);
      const mirageConfig = children.find(child => this.hasBonusConfig(child, "Mirage"));
      const linkConfig = children.find(child => this.hasBonusConfig(child, "Link"));
      const enemyTypeConfig = children.find(child => this.hasBonusConfig(child, "Enemy Type"));
      const iconVariationConfig = children.find(child => this.hasBonusConfig(child, "Icon Variation"));
      const contentBgConfig = children.find(child => this.hasBonusConfig(child, "Content BG Color"));
      const statBgConfig = children.find(child => this.hasBonusConfig(child, "Stat BG Color"));
      const configArray = [
        this.getConfigProperty(children[0]) || "#333333", // Primary Color (default to original)
        this.getConfigProperty(children[1]) || "#6ec7c2", // Accent Color (default to original)
        this.getConfigProperty(children[2]) || "#d5dfe3", // Text Color (default to original)
        this.getConfigProperty(mirageConfig) || "no", // Use Mirage
        this.getConfigProperty(linkConfig) || "no", // Use Links
        this.getConfigProperty(enemyTypeConfig) || "Heartless", // Enemy Type
        this.getConfigProperty(iconVariationConfig) || "single", // Icon Variation
        this.getConfigProperty(contentBgConfig) || "#1a1a1a", // Content BG Color
        this.getConfigProperty(statBgConfig) || "#2a2a2a" // Stat BG Color
      ];
      console.log("Parsed Config:", configArray); // Debug parsed config
      return configArray;
    }
    arrayify(element) {
      if (!element) return [];
      return Array.from(element.children).map(child => this.getConfigProperty(child));
    }
    objectify(keyList = []) {
      const resources = keyList.map(key => this.getAll(key));
      const names = Array.from(resources[0]);
      const details = Array.from(resources[1]);
      const stats = resources[2] ? Array.from(resources[2]) : [];
      return names.map((name, index) => ({
        name: name.innerHTML,
        details: details[index]?.innerHTML,
        stats: stats[index]?.innerHTML,
      }));
    }
    compoundObjectify(keyList = []) {
      const resources = keyList.map(key => this.getAll(key));
      const names = Array.from(resources[0]);
      return names.map((name, index) => {
        const obj = { name: name.innerHTML };
        keyList.forEach((key, i) => obj[key] = resources[i][index]?.innerHTML || "");
        return obj;
      });
    }
    getTimelines() {
      const timelines = this.getAll("timeline");
      return Array.from(timelines).map(timeline => {
        const name = timeline.getAttribute("name");
        const events = Array.from(timeline.getElementsByClassName("event")).map((event, i) => ({
          name: event.innerHTML,
          details: timeline.getElementsByClassName("event-details")[i]?.innerHTML,
          link: timeline.getElementsByClassName("event-link")[i]?.innerHTML,
        }));
        return { name, events };
      });
    }
    updatePage(pageNumber = this.currentPanel) {
      this.currentPanel = pageNumber;
      const tabs = this.getBookTabs();
      const content = this.getBookContent();
      const photo = this.getPhoto();
      if (tabs.length > 0 && content && photo) {
        Array.from(tabs).forEach((tab, index) => {
          tab.classList.toggle("active", index === this.currentPanel);
          const section = content.children[index];
          if (section) section.style.display = index === this.currentPanel ? "block" : "none";
        });
        if (photo && this.bio[6 + this.currentPanel]) {
          photo.style.backgroundImage = `url('${this.bio[6 + this.currentPanel] || this.bio[6]}')`;
        } else {
          console.error("Photo element not found or no URL for panel", this.currentPanel);
        }
      }
      const badge = this.BookContainer.getElementsByClassName("ds-dossier-badge")[0];
      if (badge) {
        const badgeUrl = this.badgeMap[this.config[5]] || this.badgeMap["Misc"];
        badge.style.backgroundImage = `url('${badgeUrl}')`; // Force update
        console.log("Updated Badge Style:", badge.style.backgroundImage, "for Enemy Type:", this.config[5]);
      } else {
        console.error("Badge element not found");
      }
    }
    assignButtonHandlers() {
      const tabs = this.getBookTabs();
      if (tabs.length > 0) {
        Array.from(tabs).forEach((tab, index) => {
          tab.addEventListener("click", () => this.updatePage(index));
        });
      }
    }
    initiate() {
      try {
        this.Template.innerHTML = this.htmlify();
        this.getBook();
        this.assignButtonHandlers();
        this.updatePage();
        if (this.Template.innerHTML) this.TempButton.style.display = "none";
      } catch (e) {
        console.error("Dossier load failed:", e);
      }
    }
    htmlify() {
      const [primaryColor, accentColor, textColor, useMirage, useLinks, enemyType, iconVariation, contentBgColor, statBgColor] = this.config;
      const badgeUrl = this.badgeMap[enemyType] || this.badgeMap["Misc"];
      console.log("Enemy Type:", enemyType, "Badge URL:", badgeUrl); // Debug badge update
      return `
        <div class="ds-dossier-container" style="--primary-color: ${primaryColor}; --accent-color: ${accentColor}; --text-color: ${textColor}; --content-bg-color: ${contentBgColor}; --stat-bg-color: ${statBgColor};">
          <div class="ds-dossier-tabs">
            <div class="ds-dossier-tab active">Stats</div>
            <div class="ds-dossier-tab">Reactions</div>
            <div class="ds-dossier-tab">Lore</div>
            <div class="ds-dossier-tab">Style</div>
            <div class="ds-dossier-tab">Commands</div>
            <div class="ds-dossier-tab">Provisions</div>
            ${useLinks === "yes" ? '<div class="ds-dossier-tab">Links</div>' : ""}
            ${this.timelines.length > 0 ? '<div class="ds-dossier-tab">Timelines</div>' : ""}
          </div>
          <div class="ds-dossier-content">
            ${this.htmlStatSection()}
            ${this.htmlReactionsSection()}
            ${this.htmlLoreSection()}
            ${this.htmlStyleSection()}
            ${this.htmlCommandSection()}
            ${this.htmlProvisionSection()}
            ${useLinks === "yes" ? this.htmlLinkSection() : ""}
            ${this.timelines.length > 0 ? this.htmlTimelineSections() : ""}
          </div>
          <div class="ds-dossier-name"><span class="ds-boss-name-text"><b>${this.bio[0]}</b></span><div class="ds-dossier-badge" style="background-image: url('${badgeUrl}');"></div></div>
          <div class="ds-dossier-photo"></div>
        </div>
      `;
    }
    htmlStatSection() {
      const [hp, ip, cd, reactions, str, mag, def, agl, weak, res, immunities, provDie] = this.stats; // Fixed destructuring
      const mirageContent = this.config[3] === "yes" ? `
        <div class="ds-dossier-header">Mirage</div>
        <div class="ds-dossier-row">
          <div class="ds-dossier-stat"><b>${this.mirage[0] || 0}</b> Medals</div>
          <div class="ds-dossier-stat"><b>${this.mirage[1] || 0}</b> Masteries</div>
          <div class="ds-dossier-stat"><b>${this.mirage[2] || 0}</b> Provisions</div>
          <div class="ds-dossier-stat"><b>${this.mirage[3] || 0}</b> Commands</div>
        </div>
      ` : "";
      return `
        <div class="ds-dossier-section">
          <div class="ds-dossier-header">Stats</div>
          <div class="ds-dossier-row">
            <div class="ds-dossier-stat"><b>${str}</b> STR</div>
            <div class="ds-dossier-stat"><b>${mag}</b> MAG</div>
            <div class="ds-dossier-stat"><b>${def}</b> DEF</div>
            <div class="ds-dossier-stat"><b>${agl}</b> AGL</div>
          </div>
          <div class="ds-dossier-header">Resources</div>
          <div class="ds-dossier-row">
            <div class="ds-dossier-stat"><b>${hp}</b> HP</div>
            <div class="ds-dossier-stat"><b>${ip}</b> IP</div>
            <div class="ds-dossier-stat"><b>${cd}</b> Deck</div>
            <div class="ds-dossier-stat"><b>${reactions}</b> Reactions</div>
          </div>
          ${mirageContent}
          <div class="ds-dossier-header">Weaknesses</div><p>${weak}</p>
          <div class="ds-dossier-header">Resistances</div><p>${res}</p>
          <div class="ds-dossier-header">Immunities</div><p>${immunities || "N/A"}</p> <!-- Use immunities variable -->
        </div>
      `;
    }
    htmlReactionsSection() {
      return `
        <div class="ds-dossier-section">
          <div class="ds-dossier-header">Reactions</div>
          ${this.reactions.map(r => `
            <div class="ds-dossier-item"><b>${r.name}</b></div>
            <p>${r.details || "N/A"}</p>
            <div class="ds-dossier-stat">${r.stats || "N/A"}</div>
          `).join("")}
        </div>
      `;
    }
    htmlLoreSection() {
      return `
        <div class="ds-dossier-section">
          <div class="ds-dossier-header">Lore</div>
          ${this.lore.map(item => `
            <div class="ds-dossier-item"><b>${item.name}</b></div>
            <p>${item.details || "N/A"}</p>
          `).join("")}
        </div>
      `;
    }
    htmlStyleSection() {
      const { name, details, stats } = this.style;
      return `
        <div class="ds-dossier-section">
          <div class="ds-dossier-header">Style</div>
          <div class="ds-dossier-item"><b>${name}</b></div>
          <p>${details || "N/A"}</p>
          ${stats ? stats.map(stat => `
            <div class="ds-dossier-style-point">
              <p>${stat}</p>
            </div>
          `).join("") : '<div class="ds-dossier-style-point"><p>0 points</p></div>'}
        </div>
      `;
    }
    htmlCommandSection() {
      return `
        <div class="ds-dossier-section">
          <div class="ds-dossier-header">Commands</div>
          ${this.commands.map(c => `
            <div class="ds-dossier-command">
              <div class="ds-dossier-item"><b>${c.name}</b></div>
              <p>${c.details || "N/A"}</p>
              <div class="ds-dossier-stat">${c.stats || "N/A"}</div>
            </div>
          `).join("")}
        </div>
      `;
    }
    htmlProvisionSection() {
      return `
        <div class="ds-dossier-section">
          <div class="ds-dossier-header">Provisions</div>
          <div class="ds-dossier-stat"><b>${this.stats[11] || "d6"}</b> Provision Die</div>
          ${this.provisions.map(p => `
            <div class="ds-dossier-provision">
              <div class="ds-dossier-item"><b>${p.name}</b></div>
              <p>${p.details || "N/A"}</p>
              <div class="ds-dossier-stat">${p.stats || "N/A"}</div>
            </div>
          `).join("")}
        </div>
      `;
    }
    htmlLinkSection() {
      return `
        <div class="ds-dossier-section">
          <div class="ds-dossier-header">Links</div>
          ${this.links.map(l => `
            <div class="ds-dossier-item"><b>${l.name}</b></div>
            <p>${l["link-details"] || "N/A"}</p>
            <div class="ds-dossier-stat">Rank: ${l["link-rank"] || 0}</div>
            ${l["link-command-name"] ? `
              <div class="ds-dossier-item"><b>${l["link-command-name"]}</b> [${l["link-command-stat"] || "---"}/${l["link-command-cp"] || 0}cp]</div>
              <p>${l["link-command-details"] || "N/A"}</p>
            ` : ""}
            ${l["link-style"] ? `
              <div class="ds-dossier-item"><b>Link Style</b></div>
              <p>${l["link-style"] || "N/A"}</p>
            ` : ""}
          `).join("")}
        </div>
      `;
    }
    htmlTimelineSections() {
      return this.timelines.map((t, index) => `
        <div class="ds-dossier-section">
          <div class="ds-dossier-header">${t.name}</div>
          ${t.events.map(e => `
            <div class="ds-dossier-item"><b>${e.name}</b></div>
            <p>${e.details || "N/A"}</p>
            ${e.link ? `<div class="ds-dossier-stat"><a href="${e.link}">Thread</a></div>` : ""}
          `).join("")}
        </div>
      `).join("");
    }
  }
  new DossierController(window.DossierCount).initiate();
}
