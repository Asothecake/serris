window.BookCount = window.BookCount >= 0 ? window.BookCount + 1 : 0;

if (typeof DossierController === "function") {
  console.log(window.BookCount);
  new DossierController(window.BookCount).initiate();
} else {
  class DossierController {
    constructor(bookCount) {
      this.bookCount = bookCount;
      this.TempButton = document.getElementsByClassName("temporary")[bookCount];
      this.Template = document.getElementsByClassName("dossier-template")[bookCount];
      this.DataContainer = document.getElementsByClassName("dossier-placeholder")[bookCount];

      this.config = this.getConfig(this.getFirst("config"));
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
      this.BookContainer = document.getElementsByClassName("dossier-container")[this.bookCount];
    }
    getBookTabs() {
      return this.BookContainer.getElementsByClassName("dossier-tab");
    }
    getBookContent() {
      return this.BookContainer.getElementsByClassName("dossier-content")[0];
    }

    getConfigProperty(element) {
      if (!element) return "";
      const fullString = element.innerHTML;
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
      const timelineConfig = children.find(child => this.hasBonusConfig(child, "Timeline"));
      return [
        this.getConfigProperty(children[0]),
        this.getConfigProperty(children[1]),
        this.getConfigProperty(children[2]),
        this.getConfigProperty(mirageConfig) || "no",
        this.getConfigProperty(linkConfig) || "no",
        this.getConfigProperty(timelineConfig) || "no",
        this.getConfigProperty(children[6]) || "Heartless", // Enemy Type
        this.getConfigProperty(children[7]) || "single" // Icon Variation
      ];
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
      if (tabs.length > 0 && content) {
        Array.from(tabs).forEach((tab, index) => {
          tab.classList.toggle("active", index === this.currentPanel);
          const section = content.children[index];
          if (section) section.style.display = index === this.currentPanel ? "block" : "none";
        });
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
      const [primaryColor, accentColor, textColor, useMirage, useLinks, useTimeline, enemyType, iconVariation] = this.config;
      const badgeUrl = this.badgeMap[enemyType] || this.badgeMap["Misc"];
      return `
        <div class="dossier-container" style="--primary-color: ${primaryColor}; --accent-color: ${accentColor}; --text-color: ${textColor};">
          <div class="dossier-tabs">
            <div class="dossier-tab active">Stats</div>
            <div class="dossier-tab">Reactions</div>
            <div class="dossier-tab">Lore</div>
            <div class="dossier-tab">Style</div>
            <div class="dossier-tab">Commands</div>
            <div class="dossier-tab">Provisions</div>
            ${useLinks === "yes" ? '<div class="dossier-tab">Links</div>' : ""}
            ${useTimeline === "yes" ? '<div class="dossier-tab">Timelines</div>' : ""}
            <div class="dossier-badge" style="background-image: url('${badgeUrl}');"></div>
          </div>
          <div class="dossier-content">
            ${this.htmlStatSection()}
            ${this.htmlReactionsSection()}
            ${this.htmlLoreSection()}
            ${this.htmlStyleSection()}
            ${this.htmlCommandSection()}
            ${this.htmlProvisionSection()}
            ${useLinks === "yes" ? this.htmlLinkSection() : ""}
            ${useTimeline === "yes" ? this.htmlTimelineSections() : ""}
          </div>
          <div class="dossier-name"><b>${this.bio[0]}</b></div>
        </div>
      `;
    }

    htmlStatSection() {
      const [hp, ip, cd, reactions, str, mag, def, agl, weak, res, , imm] = this.stats;
      const mirageContent = this.config[3] === "yes" ? `
        <div class="dossier-header">Mirage</div>
        <div class="dossier-row">
          <div class="dossier-stat"><b>${this.mirage[0] || 0}</b> Medals</div>
          <div class="dossier-stat"><b>${this.mirage[1] || 0}</b> Masteries</div>
          <div class="dossier-stat"><b>${this.mirage[2] || 0}</b> Provisions</div>
          <div class="dossier-stat"><b>${this.mirage[3] || 0}</b> Commands</div>
        </div>
      ` : "";
      return `
        <div class="dossier-section">
          <div class="dossier-icon">${this.getIconHtml(0, this.config[7])}</div>
          <div class="dossier-header">Stats</div>
          <div class="dossier-row">
            <div class="dossier-stat"><b>${str}</b> STR</div>
            <div class="dossier-stat"><b>${mag}</b> MAG</div>
            <div class="dossier-stat"><b>${def}</b> DEF</div>
            <div class="dossier-stat"><b>${agl}</b> AGL</div>
          </div>
          <div class="dossier-header">Resources</div>
          <div class="dossier-row">
            <div class="dossier-stat"><b>${hp}</b> HP</div>
            <div class="dossier-stat"><b>${ip}</b> IP</div>
            <div class="dossier-stat"><b>${cd}</b> Deck</div>
            <div class="dossier-stat"><b>${reactions}</b> Reactions</div>
          </div>
          ${mirageContent}
          <div class="dossier-header">Weaknesses</div><p>${weak}</p>
          <div class="dossier-header">Resistances</div><p>${res}</p>
          <div class="dossier-header">Immunities</div><p>${imm}</p>
        </div>
      `;
    }

    htmlReactionsSection() {
      return `
        <div class="dossier-section">
          <div class="dossier-icon">${this.getIconHtml(1, this.config[7])}</div>
          <div class="dossier-header">Reactions</div>
          ${this.reactions.map(r => `
            <div class="dossier-item"><b>${r.name}</b></div>
            <p>${r.details || "N/A"}</p>
            <div class="dossier-stat">${r.stats || "N/A"}</div>
          `).join("")}
        </div>
      `;
    }

    htmlLoreSection() {
      return `
        <div class="dossier-section">
          <div class="dossier-icon">${this.getIconHtml(2, this.config[7])}</div>
          <div class="dossier-header">Lore</div>
          ${this.lore.map(item => `
            <div class="dossier-item"><b>${item.name}</b></div>
            <p>${item.details || "N/A"}</p>
          `).join("")}
        </div>
      `;
    }

    htmlStyleSection() {
      const { name, details, stats } = this.style;
      return `
        <div class="dossier-section">
          <div class="dossier-icon">${this.getIconHtml(3, this.config[7])}</div>
          <div class="dossier-header">Style</div>
          <div class="dossier-item"><b>${name}</b></div>
          <p>${details || "N/A"}</p>
          <div class="dossier-stat">${stats || "0"} points</div>
        </div>
      `;
    }

    htmlCommandSection() {
      return `
        <div class="dossier-section">
          <div class="dossier-icon">${this.getIconHtml(4, this.config[7])}</div>
          <div class="dossier-header">Commands</div>
          ${this.commands.map(c => `
            <div class="dossier-item"><b>${c.name}</b></div>
            <p>${c.details || "N/A"}</p>
            <div class="dossier-stat">${c.stats || "N/A"}</div>
          `).join("")}
        </div>
      `;
    }

    htmlProvisionSection() {
      return `
        <div class="dossier-section">
          <div class="dossier-icon">${this.getIconHtml(5, this.config[7])}</div>
          <div class="dossier-header">Provisions</div>
          <div class="dossier-stat"><b>${this.stats[10] || "d6"}</b> Provision Die</div>
          ${this.provisions.map(p => `
            <div class="dossier-item"><b>${p.name}</b></div>
            <p>${p.details || "N/A"}</p>
            <div class="dossier-stat">${p.stats || "N/A"}</div>
          `).join("")}
        </div>
      `;
    }

    htmlLinkSection() {
      return `
        <div class="dossier-section">
          <div class="dossier-icon">${this.getIconHtml(6, this.config[7])}</div>
          <div class="dossier-header">Links</div>
          ${this.links.map(l => `
            <div class="dossier-item"><b>${l.name}</b></div>
            <p>${l["link-details"] || "N/A"}</p>
            <div class="dossier-stat">Rank: ${l["link-rank"] || 0}</div>
            ${l["link-command-name"] ? `
              <div class="dossier-item"><b>${l["link-command-name"]}</b> [${l["link-command-stat"] || "---"}/${l["link-command-cp"] || 0}cp]</div>
              <p>${l["link-command-details"] || "N/A"}</p>
            ` : ""}
            ${l["link-style"] ? `
              <div class="dossier-item"><b>Link Style</b></div>
              <p>${l["link-style"] || "N/A"}</p>
            ` : ""}
          `).join("")}
        </div>
      `;
    }

    htmlTimelineSections() {
      return this.timelines.map((t, index) => `
        <div class="dossier-section">
          <div class="dossier-icon">${this.getIconHtml(7 + index, this.config[7])}</div>
          <div class="dossier-header">${t.name}</div>
          ${t.events.map(e => `
            <div class="dossier-item"><b>${e.name}</b></div>
            <p>${e.details || "N/A"}</p>
            ${e.link ? `<div class="dossier-stat"><a href="${e.link}">Thread</a></div>` : ""}
          `).join("")}
        </div>
      `).join("");
    }

    getIconHtml(index, variation) {
      const icons = {
        0: '<div class="icon-shield"></div>', // Stats
        1: '<div class="icon-target"></div>', // Reactions
        2: '<div class="icon-quill"></div>', // Lore
        3: '<div class="icon-star"></div>', // Style
        4: '<div class="icon-sword"></div>', // Commands
        5: '<div class="icon-bag"></div>', // Provisions
        6: '<div class="icon-link"></div>', // Links
        7: '<div class="icon-timeline"></div>' // Timelines (default for extras)
      };
      return variation === "multi" && icons[index] ? icons[index] : '<div class="icon-dossier"></div>';
    }
  }

  new DossierController(window.BookCount).initiate();
}
