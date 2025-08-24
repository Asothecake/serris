window.BookCount = window.BookCount >= 0 ? window.BookCount + 1 : 0;

if (typeof CineplexController === "function") {
  console.log(window.BookCount);
  new CineplexController(window.BookCount).initiate();
} else {
  class CineplexController {
    constructor(bookCount) {
      this.bookCount = bookCount;
      this.TempButton = document.getElementsByClassName("temporary")[bookCount];
      this.Template = document.getElementsByClassName("cineplex-template")[bookCount];

      // data vars
      this.DataContainer = document.getElementsByClassName("cineplex-placeholder")[bookCount];

      this.config = this.getConfig(this.getFirst("config"));
      this.bio = this.arrayify(this.getFirst("bio"));
      this.stats = this.arrayify(this.getFirst("stats"));

      if (this.config[3]) {
        this.mirage = this.arrayify(this.getFirst("mirage"));
      } else {
        this.mirage = [];
      }

      this.style = this.objectify([
        "style",
        "style-details",
        "style-points",
      ])[0];

      this.lore = this.objectify(["lore-item", "lore-details"]);
      this.mirageMasteries = this.objectify([
        "mir-mastery",
        "mir-mastery-details",
      ]);

      this.commands = this.objectify([
        "command",
        "command-details",
        "command-stats",
      ]);

      this.provisions = this.objectify([
        "provision",
        "provision-details",
        "provision-stats",
      ]);

      this.reactions = this.objectify([
        "reaction",
        "reaction-details",
        "reaction-stats",
      ]);

      this.links = this.compoundObjectify([
        "link",
        "link-details",
        "link-rank",
        "link-command-name",
        "link-command-details",
        "link-command-stat",
        "link-command-cp",
        "link-style",
      ]);

      this.timelines = this.getTimelines();

      this.currentPanel = 0;
    }

    getFirst(id) {
      return this.DataContainer.getElementsByClassName(id)[0];
    }
    getAll(id) {
      return this.DataContainer.getElementsByClassName(id);
    }
    getBook() {
      this.BookContainer = document.getElementsByClassName("cineplex-wrapper")[this.bookCount];
      if (!this.BookContainer) {
        console.warn("cineplex-wrapper not found");
      }
    }
    getBookSections() {
      return this.BookContainer ? this.BookContainer.getElementsByClassName("cineplex-section") : [];
    }
    getBookButtons() {
      return this.BookContainer ? this.BookContainer.getElementsByClassName("cineplex-buttons")[0]?.children : [];
    }
    getCard() {
      return this.BookContainer ? this.BookContainer.getElementsByClassName("cineplex-banner")[0] : null;
    }

    getConfigProperty(element) {
      if (!element) return "";
      const fullString = element.innerHTML;
      const value = fullString.split("</b>")?.[1] || "";
      return value.trim();
    }

    hasBonusConfig(element, configName) {
      return element.innerHTML.includes(configName);
    }

    getConfig(element) {
      if (!element) return [];
      const children = Array.from(element?.children);
      const mirageConfig = children.find((child) => {
        return this.hasBonusConfig(child, "Mirage");
      });
      const linkConfig = children.find((child) => {
        return this.hasBonusConfig(child, "Link");
      });
      const timelineConfig = children.find((child) => {
        return this.hasBonusConfig(child, "Timeline");
      });

      return [
        this.getConfigProperty(children[0]),
        this.getConfigProperty(children[1]),
        this.getConfigProperty(children[2]),
        this.getConfigProperty(mirageConfig) || "no",
        this.getConfigProperty(linkConfig) || "no",
        this.getConfigProperty(timelineConfig) || "no",
      ];
    }

    arrayify(element) {
      if (!element) return [];
      const children = element?.children;
      return Array.from(children).map((element) => {
        return this.getConfigProperty(element);
      });
    }
    objectify(keyList = []) {
      const resourceList = keyList.map((key) => this.getAll(key));
      const names = Array.from(resourceList[0]);
      const details = Array.from(resourceList[1]);
      const stats = resourceList[2] ? Array.from(resourceList[2]) : [];

      return names.map((input, index) => {
        return {
          name: input.innerHTML,
          details: details[index]?.innerHTML,
          stats: stats[index]?.innerHTML,
        };
      });
    }
    compoundObjectify(keyList = []) {
      const resourceList = keyList.map((key) => this.getAll(key));
      const names = Array.from(resourceList[0]);

      return names.map((input, resIndex) => {
        const obj = { name: input.innerHTML };
        keyList.forEach(
          (key, keyIndex) =>
            (obj[key] = resourceList[keyIndex][resIndex]?.innerHTML || "")
        );
        return obj;
      });
    }

    getTimelines() {
      const timelines = this.getAll("timeline");
      return Array.from(timelines).map((timeline) => {
        const timelineName = timeline.getAttribute("name");
        const names = timeline.getElementsByClassName("event");
        const details = timeline.getElementsByClassName("event-details");
        const links = timeline.getElementsByClassName("event-link");
        const events = Array.from(names).map((name, index) => {
          return {
            name: name.innerHTML,
            details: details[index]?.innerHTML,
            stats: links[index]?.innerHTML,
          };
        });
        return {
          name: timelineName,
          events,
        };
      });
    }

    updatePage(pageNumber = this.currentPanel) {
      this.currentPanel = pageNumber;
      const sections = this.getBookSections();
      const banner = this.getCard();
      if (sections.length > 0) {
        Array.from(sections).forEach((section, index) => {
          section.style.display = index === this.currentPanel ? "block" : "none";
        });
      }
      if (banner) {
        if (this.currentPanel === 0) {
          banner.classList.remove("flipped");
        } else {
          banner.classList.add("flipped");
        }
      }
    }

    assignButtonHandlers() {
      const buttons = this.getBookButtons();
      if (buttons.length > 0) {
        Array.from(buttons).forEach((button, index) => {
          button.addEventListener("click", () => this.updatePage(index));
        });
      }
    }

    initiate() {
      try {
        // setup initial html
        this.Template.innerHTML = this.htmlify();
        // setup handlers and pagecounter
        this.getBook();
        this.assignButtonHandlers();
        this.updatePage();
        // Hide button only if template loads successfully
        if (this.Template.innerHTML) {
          this.TempButton.style.display = "none";
        }
      } catch (e) {
        console.error("Template load failed:", e);
        // Button remains visible if there's an error
      }
    }

    // The icky bit
    htmlify() {
      const primaryColor = this.config[0];
      const accentColor = this.config[1];
      const textColor = this.config[2];
      const usesLinks = this.config[4]?.toLowerCase() === "yes";
      const usesTimeline = this.config[5]?.toLowerCase() === "yes";

      return `
        <div class="cineplex-body">
          ${this.htmlBio()}
          <div class="cineplex-interact">
            <div class="cineplex-buttons">
              <button>Stats</button>
              <button>Reactions</button>
              <button>Lore</button>
              <button>Style</button>
              <button>Commands</button>
              <button>Provisions</button>
              ${usesLinks ? `<button>Links</button>` : ""}
              ${
                usesTimeline
                  ? `<div class="cineplex-header"><b>Timelines</b></div>`
                  : ""
              }
              ${
                usesTimeline && this.timelines[0]
                  ? this.htmlTimelineButtons()
                  : ""
              }
            </div>
            <div class="cineplex-window">
              ${this.htmlStatSection()}
              ${this.htmlReactionsSection()}
              ${this.htmlLoreSection()}
              ${this.htmlStyleSection()}
              ${this.htmlCommandSection()}
              ${this.htmlProvisionSection()}
              ${usesLinks ? this.htmlLinkSection() : ""}
              ${usesTimeline ? this.htmlTimelineSections() : ""}
            </div>
          </div>
        </div>
      `;
    }

    htmlTimelineButtons() {
      return this.timelines
        .map((timeline) => {
          return `<button>${timeline.name}</button>`;
        })
        .join("");
    }

    htmlTimelineSections() {
      return this.timelines
        .map((timeline) => {
          return this.htmlDynamicTimelineSection(timeline);
        })
        .join("");
    }

    htmlDynamicTimelineSection(timeline) {
      return `
      <div class="cineplex-section" key="${timeline.name}">
        ${timeline.events
          .map((event) => {
            const eventLink = `<a href="${event.stats}">Thread Link</a>`;
            return this.htmlWindowItem(event.name, event.details, eventLink);
          })
          .join("")}
      </div>
      `;
    }

    htmlWindowItem(name, details, stats) {
      return `
        <div class="cineplex-header"><b>${name}</b></div>
        <p>${details}</p>
        ${stats ? `<div class="cineplex-footer"><b>${stats}</b></div>` : ""}
      `;
    }

    htmlLinkItem(linkDetails) {
      const {
        name,
        "link-details": details,
        "link-rank": stats,
        "link-command-name": commandName,
        "link-command-details": commandDetails,
        "link-command-stat": commandStat,
        "link-command-cp": commandCP,
        "link-style": linkStyle,
      } = linkDetails;
      return `
        <div class="cineplex-header"><b>${name}</b></div>
        <p>${details}</p>
        ${
          commandName
            ? `<hr>
        <p><b>${commandName}</b> [${commandStat}/${commandCP}cp]
        <br>${commandDetails}</p>`
            : ""
        }
        ${
          linkStyle
            ? `<hr>
        <p><b>Link Style</b>
        <br>${linkStyle}</p>`
            : ""
        }
        ${stats ? `<div class="cineplex-footer"><b>Rank: ${stats}</b></div>` : ""}
      `;
    }

   htmlBio() {
  const name = this.bio[0];
  const title = this.bio[1];
  const jobClass = this.bio[2];
  const role = this.bio[3];
  const alignment = this.bio[4];
  const origin = this.bio[5];
  const frontImg = this.bio[6];
  const backImg = this.bio[7];

  const toHtmlImage = (imageUrl) => {
    if (!imageUrl.includes("http")) return "";
    return imageUrl;
  };

  return `
    <div class="cineplex-bio">
      <div class="cineplex-name"><b>${name}</b></div>
      
      <div class="cineplex-fluff">
        <p>${title}</p>
        <p>${jobClass}</p>
        <p>${role}</p>
        <p>${alignment}</p>
        <p>${origin}</p>
      </div>

      <div class="cineplex-banner">
        <div class="banner-inner">
          <div class="banner-front" style="background-image: url('${toHtmlImage(frontImg)}');"></div>
          <div class="banner-back" style="background-image: url('${toHtmlImage(backImg)}');"></div>
        </div>
      </div>
    </div>
  `;
}

    htmlStatSection() {
      const hp = this.stats[0];
      const ip = this.stats[1];
      const cd = this.stats[2];
      const rea = this.stats[3];

      const str = this.stats[4];
      const mag = this.stats[5];
      const def = this.stats[6];
      const agl = this.stats[7];

      const weak = this.stats[8];
      const res = this.stats[9];
      const imm = this.stats[11];

      const shouldUseMirage = this.config[3]?.toLowerCase() === "yes";
      const medals = this.mirage[0];
      const mMas = this.mirage[1];
      const mPro = this.mirage[2];
      const mCom = this.mirage[3];

      return `
        <div class="cineplex-section">
          <div class="cineplex-header"><b>Stats</b></div>
          <div class="cineplex-stat-row">
            <div class="cineplex-stat-box">
              <div class="cineplex-stat"><b>${str}</b></div>
              <div class="cineplex-stat-label">STRENGTH</div>
            </div>
            <div class="cineplex-stat-box">
              <div class="cineplex-stat"><b>${mag}</b></div>
              <div class="cineplex-stat-label">MAGIC</div>
            </div>
            <div class="cineplex-stat-box">
              <div class="cineplex-stat"><b>${def}</b></div>
              <div class="cineplex-stat-label">DEFENSE</div>
            </div>
            <div class="cineplex-stat-box">
              <div class="cineplex-stat"><b>${agl}</b></div>
              <div class="cineplex-stat-label">AGILITY</div>
            </div>
          </div>

          <div class="cineplex-header"><b>Resources</b></div>
          <div class="cineplex-stat-row">
            <div class="cineplex-stat-box">
              <div class="cineplex-stat"><b>${hp}</b></div>
              <div class="cineplex-stat-label">HP</div>
            </div>
            <div class="cineplex-stat-box">
              <div class="cineplex-stat"><b>${ip}</b></div>
              <div class="cineplex-stat-label">IP</div>
            </div>
            <div class="cineplex-stat-box">
              <div class="cineplex-stat"><b>${cd}</b></div>
              <div class="cineplex-stat-label">DECK</div>
            </div>
            <div class="cineplex-stat-box">
              <div class="cineplex-stat"><b>${rea}</b></div>
              <div class="cineplex-stat-label">REACTIONS</div>
            </div>
          </div>

          ${
            shouldUseMirage
              ? `
            <div class="cineplex-header"><b>Mirage</b></div>
          <div class="cineplex-stat-row">
            <div class="cineplex-stat-box">
              <div class="cineplex-stat"><b>${medals}</b></div>
              <div class="cineplex-stat-label">MEDAL</div>
            </div>
            <div class="cineplex-stat-box">
              <div class="cineplex-stat"><b>${mMas}</b></div>
              <div class="cineplex-stat-label">MASTERY</div>
            </div>
            <div class="cineplex-stat-box">
              <div class="cineplex-stat"><b>${mPro}</b></div>
              <div class="cineplex-stat-label">PROVISION</div>
            </div>
            <div class="cineplex-stat-box">
              <div class="cineplex-stat"><b>${mCom}</b></div>
              <div class="cineplex-stat-label">COMMAND</div>
            </div>
          </div>
            `
              : ""
          }

          <div class="cineplex-header"><b>Weaknesses</b></div>
          <p>${weak}</p>
          <div class="cineplex-header"><b>Resistances</b></div>
          <p>${res}</p>
          <div class="cineplex-header"><b>Immunities</b></div>
          <p>${imm}</p>
        </div>
      `;
    }

    htmlReactionsSection() {
      return `
        <div class="cineplex-section">
          ${this.reactions
            .map((reaction) =>
              this.htmlWindowItem(reaction.name, reaction.details, reaction.stats)
            )
            .join("")}
        </div>
      `;
    }

    htmlLoreSection() {
      return `
        <div class="cineplex-section">
          ${this.lore
            .map((item) =>
              this.htmlWindowItem(item.name, item.details)
            )
            .join("")}
        </div>
      `;
    }

    htmlStyleSection() {
      return `
        <div class="cineplex-section">
          ${this.htmlWindowItem(
            this.style.name,
            this.style.details,
            this.style.stats + " points"
          )}
        </div>
      `;
    }

    htmlCommandSection() {
      return `
        <div class="cineplex-section">
          ${this.commands
            .map((command) =>
              this.htmlWindowItem(command.name, command.details, command.stats)
            )
            .join("")}
        </div>
      `;
    }

    htmlProvisionSection() {
      return `
        <div class="cineplex-section">
          <div class="cineplex-stat-row cineplex-left">
            <div class="cineplex-stat-box">
              <div class="cineplex-stat"><b>${this.stats[10] || "d6"}</b></div>
              <div class="cineplex-stat-label">PROVISION</div>
            </div>
          </div>
          ${this.provisions
            .map((provision) =>
              this.htmlWindowItem(
                provision.name,
                provision.details,
                provision.stats
              )
            )
            .join("")}
        </div>
      `;
    }

    htmlLinkSection() {
      return `
        <div class="cineplex-section">
          ${this.links.map((link) => this.htmlLinkItem(link)).join("")}
        </div>
      `;
    }
  }

  new CineplexController(window.BookCount).initiate();
}
