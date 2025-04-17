window.BookCount = window.BookCount >= 0 ? window.BookCount + 1 : 0; 

if (typeof CommandBookController === "function") {
  console.log(window.BookCount);
  new CommandBookController(window.BookCount).initiate();
} else {
  class CommandBookController {
    constructor(bookCount) {
      this.bookCount = bookCount;
      this.TempButton = document.getElementsByClassName("temporary")[bookCount];
      this.Template =
        document.getElementsByClassName("cinema-template")[bookCount];

      // data vars
      this.DataContainer =
        document.getElementsByClassName("cinema-placeholder")[bookCount];

      this.config = this.getConfig(this.getFirst("config"));
      this.bio = this.arrayify(this.getFirst("bio"));
      this.stats = this.arrayify(this.getFirst("stats"));
      this.advance = this.arrayify(this.getFirst("advancements"));
      this.critAdv = this.arrayify(this.getFirst("critical-advancements"));

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

      this.masteries = this.objectify(["st-mastery", "st-mastery-details"]);
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

      this.links = this.objectify(["link", "link-details", "link-rank"]);

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
      this.BookContainer =
        document.getElementsByClassName("cinema-wrapper")[this.bookCount];
    }
    getBookSections() {
      return this.BookContainer.getElementsByClassName("cinema-section");
    }
    getBookButtons() {
      return this.BookContainer.getElementsByClassName("cinema-buttons")[0]
        .children;
    }
    getReel() {
      return this.BookContainer.getElementsByClassName("cinema-reel")[0];
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
      const reel = this.getReel();
      Array.from(sections)?.forEach((section, index) => {
        if (index === this.currentPanel) {
          section.style.display = "block";
        } else {
          section.style.display = "none";
        }
      });
      if (this.currentPanel === 0) {
        reel.classList.add("tall");
      } else {
        reel.classList.remove("tall");
      }
    }

    assignButtonHandlers() {
      const buttons = Array.from(this.getBookButtons()).filter(
        (button) => button.nodeName === "BUTTON"
      );
      buttons?.forEach((button, index) => {
        button.addEventListener("click", () => this.updatePage(index));
      });
    }

    initiate() {
      // setup initial html
      console.log(this);
      this.Template.innerHTML = this.htmlify();
      // setup handlers and pagecounter
      this.getBook();
      this.assignButtonHandlers();
      this.updatePage();
      this.TempButton.style.display = "none";
    }

    // The icky bit
    htmlify() {
      const primaryColor = this.config[0];
      const accentColor = this.config[1];
      const textColor = this.config[2];
      const usesLinks = this.config[4]?.toLowerCase() === "yes";
      const usesTimeline = this.config[5]?.toLowerCase() === "yes";

      return 
        <div class="cinema-wrapper" style="
            --primary-color: ${primaryColor};
            --accent-color: ${accentColor};
            --text-color: ${textColor};
          ">
          <div class="cinema-body">
            ${this.htmlBio()}
            <div class="cinema-interact">
              <div class="cinema-buttons">
                <button>Stats</button>
                <button>Advancements</button>
                <button>Masteries</button>
                <button>Style</button>
                <button>Commands</button>
                <button>Provisions</button>
                ${usesLinks ? <button>Links</button> : ""}
                ${
                  usesTimeline
                    ? <div class="cinema-header"><b>Timelines</b></div>
                    : ""
                }
                ${
                  usesTimeline && this.timelines[0]
                    ? this.htmlTimelineButtons()
                    : ""
                }
              </div>
              <div class="cinema-window">
                ${this.htmlStatSection()}
                ${this.htmlAdvancementSection()}
                ${this.htmlMasterySection()}
                ${this.htmlStyleSection()}
                ${this.htmlCommandSection()}
                ${this.htmlProvisionSection()}
                ${usesLinks ? this.htmlLinkSection() : ""}
                ${usesTimeline ? this.htmlTimelineSections() : ""}
              </div>
            </div>
          </div>
        </div>
      ;
    }

    htmlTimelineButtons() {
      return this.timelines
        .map((timeline) => {
          return <button>${timeline.name}</button>;
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
      console.log(timeline);
      return 
      <div class="cinema-section" key="${timeline.name}">
        ${timeline.events
          .map((event) => {
            const eventLink = <a href="${event.stats}">Thread Link</a>;
            return this.htmlWindowItem(event.name, event.details, eventLink);
          })
          .join("")}
      </div>
      ;
    }

    htmlWindowItem(name, details, stats) {
      return 
        <div class="cinema-header"><b>${name}</b></div>
        <p>${details}</p>
        ${stats ? <div class="cinema-footer"><b>${stats}</b></div> : ""}
      ;
    }

    htmlBio() {
      const name = this.bio[0];
      const title = this.bio[1];
      const jobClass = this.bio[2];
      const role = this.bio[3];
      const alignment = this.bio[4];
      const origin = this.bio[5];
      const img1 = this.bio[6];
      const img2 = this.bio[7];
      const img3 = this.bio[8];

      const isOnlyOnePic = !img2 && !img3;

      const toHtmlImage = (imageUrl, only = false) => {
        if (!imageUrl.includes("http")) return "";

        return 
        <div
          class="image ${only ? "image-only" : ""}"
          style="
            background-image: url('${imageUrl}');
          "
        /></div>
      ;
      };

      return 
        <div class="cinema-bio">
          <div class="cinema-name"><b>${name}</b></div>
          
          <div class="cinema-fluff">
            <p>${title}</p>
            <p>${jobClass}</p>
            <p>${role}</p>
            <p>${alignment}</p>
            <p>${origin}</p>
          </div>

          <div class="cinema-reel">
            <div class="box-reel">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div class="img-reel">
            ${
              isOnlyOnePic
                ? toHtmlImage(img1, true)
                : [img1, img2, img3].map((image) => toHtmlImage(image)).join("")
            }
            </div>
            <div class="box-reel">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      ;
    }

    htmlStatSection() {
      const hp = this.stats[0];
      const ip = this.stats[1];
      const cd = this.stats[2];
      const adv = this.stats[3];

      const str = this.stats[4];
      const mag = this.stats[5];
      const def = this.stats[6];
      const agl = this.stats[7];

      const weak = this.stats[8];
      const res = this.stats[9];

      const shouldUseMirage = this.config[3]?.toLowerCase() === "yes";
      const medals = this.mirage[0];
      const mMas = this.mirage[1];
      const mPro = this.mirage[2];
      const mCom = this.mirage[3];

      return 
        <div class="cinema-section">
          <div class="cinema-header"><b>Stats</b></div>
          <div class="cinema-stat-row">
            <div class="cinema-stat-box">
              <div class="cinema-stat"><b>${str}</b></div>
              <div class="cinema-stat-label">STRENGTH</div>
            </div>
            <div class="cinema-stat-box">
              <div class="cinema-stat"><b>${mag}</b></div>
              <div class="cinema-stat-label">MAGIC</div>
            </div>
            <div class="cinema-stat-box">
              <div class="cinema-stat"><b>${def}</b></div>
              <div class="cinema-stat-label">DEFENSE</div>
            </div>
            <div class="cinema-stat-box">
              <div class="cinema-stat"><b>${agl}</b></div>
              <div class="cinema-stat-label">AGILITY</div>
            </div>
          </div>

          <div class="cinema-header"><b>Resources</b></div>
          <div class="cinema-stat-row">
            <div class="cinema-stat-box">
              <div class="cinema-stat"><b>${hp}</b></div>
              <div class="cinema-stat-label">HP</div>
            </div>
            <div class="cinema-stat-box">
              <div class="cinema-stat"><b>${ip}</b></div>
              <div class="cinema-stat-label">IP</div>
            </div>
            <div class="cinema-stat-box">
              <div class="cinema-stat"><b>${cd}</b></div>
              <div class="cinema-stat-label">DECK</div>
            </div>
            <div class="cinema-stat-box">
              <div class="cinema-stat"><b>${adv}</b></div>
              <div class="cinema-stat-label">ADVANCE</div>
            </div>
          </div>

          ${
            shouldUseMirage
              ? 
            <div class="cinema-header"><b>Mirage</b></div>
          <div class="cinema-stat-row">
            <div class="cinema-stat-box">
              <div class="cinema-stat"><b>${medals}</b></div>
              <div class="cinema-stat-label">MEDAL</div>
            </div>
            <div class="cinema-stat-box">
              <div class="cinema-stat"><b>${mMas}</b></div>
              <div class="cinema-stat-label">MASTERY</div>
            </div>
            <div class="cinema-stat-box">
              <div class="cinema-stat"><b>${mPro}</b></div>
              <div class="cinema-stat-label">PROVISION</div>
            </div>
            <div class="cinema-stat-box">
              <div class="cinema-stat"><b>${mCom}</b></div>
              <div class="cinema-stat-label">COMMAND</div>
            </div>
          </div>
            
              : ""
          }

          <div class="cinema-header"><b>Weaknesses</b></div>
          <p>${weak}</p>
          <div class="cinema-header"><b>Resistances</b></div>
          <p>${res}</p>
        </div>
      ;
    }

    htmlAdvancementSection() {
      return 
        <div class="cinema-section">
          <div class="cinema-header"><b>Advancements</b></div>
          <p><b>HP+5 or IP+1,</b> ${this.advance[0]}</p>
          <p><b>Stat Increase,</b> ${this.advance[1]}</p>
          <p><b>+1 Command Deck,</b>  ${this.advance[2]}</p>
          <p><b>Create a Command,</b>  ${this.advance[3]}</p>
          <p><b>Create a Provision,</b> ${this.advance[4]}</p>
          <p><b>Create a Mastered Command,</b> ${this.advance[5]}</p>
          <p><b>Weakness & Resistance,</b> ${this.advance[6]}</p>

          <div class="cinema-header"><b>Critical Advancements</b></div>
          <p><b>HP + 10 or IP +2,</b> ${this.critAdv[0]}</p>
          <p><b>Stat Increase,</b> ${this.critAdv[1]}</p>
          <p><b>Mastered Command or Provision,</b> ${this.critAdv[2]}</p>
          <p><b>Refine Command Style,</b> ${this.critAdv[3]}</p>
          <p><b>Signature Command,</b> ${this.critAdv[4]}</p>
          <p><b>Key Item,</b> ${this.critAdv[5]}</p>
          <p><b>Resistance,</b> ${this.critAdv[6]}</p>
          <p><b>Create Provision,</b> ${this.critAdv[7]}</p>
        </div>
      ;
    }

    htmlMasterySection() {
      return 
        <div class="cinema-section">
          ${this.masteries
            .map((mastery) =>
              this.htmlWindowItem(mastery.name, mastery.details, mastery.stats)
            )
            .join("")}
        </div>
      ;
    }

    htmlStyleSection() {
      return 
        <div class="cinema-section">
          ${this.htmlWindowItem(
            this.style.name,
            this.style.details,
            this.style.stats + " points"
          )}
        </div>
      ;
    }

    htmlCommandSection() {
      return 
        <div class="cinema-section">
          ${this.commands
            .map((command) =>
              this.htmlWindowItem(command.name, command.details, command.stats)
            )
            .join("")}
        </div>
      ;
    }

    htmlProvisionSection() {
      return 
        <div class="cinema-section">
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
      ;
    }

    htmlLinkSection() {
      return 
        <div class="cinema-section">
          ${this.links
            .map((link) =>
              this.htmlWindowItem(link.name, link.details, link.stats)
            )
            .join("")}
        </div>
      ;
    }
  }

  new CommandBookController(window.BookCount).initiate();
}CommandBookController.prototype.initAliasDeck = function () {
  this.DataContainerAlias = document.getElementsByClassName("alias-placeholder")[this.bookCount];
  if (!this.DataContainerAlias) return "";

  const config = this.getConfig(this.DataContainerAlias.getElementsByClassName("config")[0]);
  const bio = this.arrayify(this.DataContainerAlias.getElementsByClassName("alias-bio")[0]);
  const style = this.objectify(["style", "style-details", "style-points"], this.DataContainerAlias.getElementsByClassName("alias-style")[0])[0];
  const commands = this.objectify([
    "command",
    "command-details",
    "command-stats",
  ], this.DataContainerAlias.getElementsByClassName("alias-commands")[0]);
  const provisions = this.objectify([
    "provision",
    "provision-details",
    "provision-stats",
  ], this.DataContainerAlias.getElementsByClassName("alias-provisions")[0]);

  const [name, title, job, role, align, origin, i1, i2, i3] = bio;
  const toHtmlImage = (url) => <div class="image" style="background-image: url('${url}');"></div>;

  return 
    <div class="cinema-wrapper alias-mode" style="
      --primary-color: ${config[0]};
      --accent-color: ${config[1]};
      --text-color: ${config[2]};
    ">
      <div class="cinema-body">
        <div class="cinema-bio">
          <div class="cinema-name"><b>${name}</b></div>
          <div class="cinema-fluff">
            <p>${title}</p><p>${job}</p><p>${role}</p><p>${align}</p><p>${origin}</p>
          </div>
          <div class="cinema-reel">
            <div class="box-reel"></div>
            <div class="img-reel">${[i1, i2, i3].map(toHtmlImage).join("")}</div>
            <div class="box-reel"></div>
          </div>
        </div>
        <div class="cinema-window">
          ${this.htmlWindowItem(style.name, style.details, style.stats + " points")}
          <hr />
          ${commands.map(c => this.htmlWindowItem(c.name, c.details, c.stats)).join("")}
          ${provisions.map(p => this.htmlWindowItem(p.name, p.details, p.stats)).join("")}
        </div>
      </div>
    </div>
  ;
};

// PATCH updatePage to support alias tab (index = 6 or last button)
const originalUpdatePage = CommandBookController.prototype.updatePage;
CommandBookController.prototype.updatePage = function (pageNumber = this.currentPanel) {
  this.currentPanel = pageNumber;
  const sections = this.getBookSections();
  const reel = this.getReel();
  const isAliasPage = pageNumber === sections.length;

  Array.from(sections)?.forEach((section, index) => {
    section.style.display = isAliasPage ? "none" : index === pageNumber ? "block" : "none";
  });

  if (isAliasPage) {
    const aliasContent = this.initAliasDeck();
    this.Template.innerHTML = aliasContent;
  } else {
    if (this.Template.innerHTML.includes("alias-mode")) {
      this.Template.innerHTML = this.htmlify();
      this.getBook();
      this.assignButtonHandlers();
    }
  }

  if (!isAliasPage && reel) {
    if (pageNumber === 0) {
      reel.classList.add("tall");
    } else {
      reel.classList.remove("tall");
    }
  }
};

// PATCH htmlify to add the Alias Deck button
const originalHtmlify = CommandBookController.prototype.htmlify;
CommandBookController.prototype.htmlify = function () {
  const baseHtml = originalHtmlify.call(this);
  return baseHtml.replace(
    /<\/div>\s*<div class="cinema-window">/, 
    '<button>Alias Deck</button></div><div class="cinema-window">'
  );
};