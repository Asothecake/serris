class RegalPost extends HTMLElement {
  connectedCallback() {
    // Jcink loads the script in the header of the doHTML block, meaning this fires
    // before the browser actually finishes reading the text inside the tag.
    // We defer execution by a few milliseconds so the browser can finish injecting the innerHTML!
    setTimeout(() => {
      this.render();
    }, 10);
  }

  render() {
    const name = this.getAttribute('name') || 'Unknown Character';
    const icon = this.getAttribute('icon') || 'https://placehold.co/100x100/2c2c2c/c5b077?text=Icon';
    const image = this.getAttribute('image') || 'https://placehold.co/300x500/2c2c2c/c5b077?text=Full';
    const color = this.getAttribute('color');
    const bg = this.getAttribute('bg');
    const bg2 = this.getAttribute('bg2'); 
    const textCol = this.getAttribute('text');
    const boxbg = this.getAttribute('boxbg');
    
    // Parse stats if the author included the <regal-stats> tag
    const statsEl = this.querySelector('regal-stats');
    let statsHTML = '';
    
    if (statsEl) {
      const body = parseInt(statsEl.getAttribute('body') || 0);
      const dex = parseInt(statsEl.getAttribute('dex') || 0);
      const prec = parseInt(statsEl.getAttribute('prec') || 0);
      const pot = parseInt(statsEl.getAttribute('pot') || 0);
      const spirit = parseInt(statsEl.getAttribute('spirit') || 0);

      const calculateGrade = (xp) => {
        if(xp < 10) return 'D-';
        if(xp < 20) return 'D';
        if(xp < 35) return 'D+';
        if(xp < 60) return 'C-';
        if(xp < 95) return 'C';
        if(xp < 150) return 'C+';
        if(xp < 225) return 'B-';
        if(xp < 340) return 'B';
        if(xp < 495) return 'B+';
        if(xp < 690) return 'A-';
        if(xp < 925) return 'A';
        if(xp < 1200) return 'A+';
        if(xp < 1515) return 'S-';
        if(xp < 1880) return 'S';
        return 'S+';
      };

      const calculateSP = (grade) => {
        const map = {
          'D-': 5, 'D': 10, 'D+': 15,
          'C-': 25, 'C': 30, 'C+': 35,
          'B-': 45, 'B': 50, 'B+': 55,
          'A-': 70, 'A': 85, 'A+': 100,
          'S-': 115, 'S': 130, 'S+': 150
        };
        return map[grade] || 5;
      };

      const getPercent = (xp) => Math.min(100, (xp / 1880) * 100);

      const spiritGrade = calculateGrade(spirit);
      const spTotal = calculateSP(spiritGrade);
      const spRegen = Math.ceil(spTotal * 0.20);

      const makeStatRow = (label, xp) => {
        const gradeStr = calculateGrade(xp);
        const letter = gradeStr.charAt(0);
        const mod = gradeStr.length > 1 ? gradeStr.substring(1) : '&nbsp;';
        
        const pct = getPercent(xp);
        return `
          <div class="regal-stat-row">
            <div class="regal-stat-label">
              <span>${label}: ${xp}</span> 
              <span class="regal-stat-grade">
                <span class="grade-letter">${letter}</span><span class="grade-mod">${mod}</span>
              </span>
            </div>
            <div class="regal-stat-bar-bg">
              <div class="regal-stat-bar-fill" style="width: 0%" data-width="${pct}%"></div>
            </div>
          </div>
        `;
      };

      statsHTML = `
        <div class="regal-stats-container">
          ${makeStatRow('Body', body)}
          ${makeStatRow('Dexterity', dex)}
          ${makeStatRow('Precision', prec)}
          ${makeStatRow('Potency', pot)}
          ${makeStatRow('Spirit', spirit)}
          <div class="regal-sp-info">
            <div><span class="regal-accent-text">SP Total:</span> ${spTotal}</div>
            <div><span class="regal-accent-text">SP Regen:</span> ${spRegen}</div>
          </div>
        </div>
      `;
    } else {
      statsHTML = `<div style="text-align: center; color: var(--regal-muted); font-style: italic; margin-top: 50%;">No stats registered for this post.</div>`;
    }

    if (statsEl) statsEl.remove();

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.innerHTML;
    
    const walk = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT, null, false);
    let n;
    const nodesToReplace = [];
    while(n = walk.nextNode()) {
      if (n.nodeValue.match(/["“].*?["”]/)) {
        nodesToReplace.push(n);
      }
    }

    nodesToReplace.forEach(textNode => {
      const regex = /(["“].*?["”])/g;
      const span = document.createElement('span');
      span.innerHTML = textNode.nodeValue.replace(regex, '<span class="regal-dialogue">$1</span>');
      textNode.parentNode.replaceChild(span, textNode);
    });

    const rpText = tempDiv.innerHTML;
    
    this.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'regal-rp-container';
    
    if (color) container.style.setProperty('--regal-accent', color);
    if (color) container.style.setProperty('--regal-border', color);
    if (bg) container.style.setProperty('--regal-bg', bg);
    if (bg2) container.style.setProperty('--regal-bg2', bg2);
    if (textCol) container.style.setProperty('--regal-text', textCol);
    if (boxbg) container.style.setProperty('--regal-boxbg', boxbg);

    container.innerHTML = `
      <div class="regal-overlay">
        <img src="${image}" class="regal-overlay-image" alt="Full Image">
        <div class="regal-overlay-content">
          ${statsHTML}
        </div>
        <button class="regal-close-btn" title="Close">✕</button>
      </div>

      <div class="regal-rp-content-wrap">
        <div class="regal-rp-header">
          <h1 class="regal-rp-name">${name}</h1>
          <img src="${icon}" class="regal-rp-icon" alt="${name}" title="View Stats & Image">
        </div>
        <div class="regal-rp-content">
          ${rpText}
        </div>
      </div>
      <button class="regal-copy-btn" title="Copy Template Code">📋</button>
    `;

    const iconEl = container.querySelector('.regal-rp-icon');
    iconEl.addEventListener('click', () => {
      container.classList.add('show-overlay');
      setTimeout(() => {
        const bars = container.querySelectorAll('.regal-stat-bar-fill');
        bars.forEach(bar => {
          bar.style.width = bar.getAttribute('data-width');
        });
      }, 100);
    });

    const closeBtn = container.querySelector('.regal-close-btn');
    closeBtn.addEventListener('click', () => {
      container.classList.remove('show-overlay');
      const bars = container.querySelectorAll('.regal-stat-bar-fill');
      bars.forEach(bar => {
        bar.style.width = '0%';
      });
    });

    const copyBtn = container.querySelector('.regal-copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const blankCode = `[dohtml]\n<regal-post \n  name="Character Name" \n  icon="ICON_URL" \n  image="FULL_IMAGE_URL" \n  color="#c5b077" \n  bg="#2c2c2c"\n  bg2="#1a1a1a"\n  text="#d9d1b0"\n  boxbg="#2c2c2c">\n  <regal-stats body="10" dex="10" prec="10" pot="10" spirit="10"></regal-stats>\n  Write your RP text here... "Dialogue is auto-colored!"\n</regal-post>\n[/dohtml]`;
        navigator.clipboard.writeText(blankCode).then(() => {
          const originalText = copyBtn.innerHTML;
          copyBtn.innerHTML = '✓';
          setTimeout(() => copyBtn.innerHTML = originalText, 1500);
        });
      });
    }

    this.appendChild(container);
  }
}

if (!customElements.get('regal-post')) {
  customElements.define('regal-post', RegalPost);
}
