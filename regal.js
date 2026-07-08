document.addEventListener('DOMContentLoaded', () => {
  renderRegalPosts();
});

function renderRegalPosts() {
  // Find all elements that might contain post text on a Jcink forum. 
  // .postcolor is the universal standard for Jcink post content.
  const posts = document.querySelectorAll('.postcolor, .entry-content, .message, .post-content');
  
  if (posts.length === 0) return;

  posts.forEach(post => {
    // Quick check before running expensive regex
    if (!post.innerHTML.includes('[REGAL')) return;

    let newHTML = post.innerHTML;
    
    // Regex matches [REGAL attrs...] ... [/REGAL] across multiple lines
    const regalRegex = /\[REGAL([^\]]*)\]([\s\S]*?)\[\/REGAL\]/gi;
    
    newHTML = newHTML.replace(regalRegex, (match, attrString, innerContent) => {
      
      // 1. Parse attributes from the opening [REGAL] tag
      const getAttr = (name, def) => {
        const regex = new RegExp(`${name}=["'](.*?)["']`, 'i');
        const m = attrString.match(regex);
        return m ? m[1] : def;
      };
      
      const name = getAttr('name', 'Unknown Character');
      const icon = getAttr('icon', 'https://placehold.co/100x100/2c2c2c/c5b077?text=Icon');
      const image = getAttr('image', 'https://placehold.co/300x500/2c2c2c/c5b077?text=Full');
      const color = getAttr('color', '');
      const bg = getAttr('bg', '');
      const bg2 = getAttr('bg2', ''); 
      const textCol = getAttr('text', '');
      const boxbg = getAttr('boxbg', '');

      // 2. Parse stats from innerContent
      let statsHTML = `<div style="text-align: center; color: var(--regal-muted); font-style: italic; margin-top: 50%;">No stats registered for this post.</div>`;
      let cleanContent = innerContent;
      
      const statsRegex = /\[REGAL-STATS([^\]]*)\]/gi;
      let originalStatsAttr = null; // Save this to recreate the code later

      cleanContent = cleanContent.replace(statsRegex, (statMatch, statAttrStr) => {
        originalStatsAttr = statAttrStr;
        const getStat = (n) => parseInt(statAttrStr.match(new RegExp(`${n}=["'](\\d+)["']`, 'i'))?.[1] || 0);
        
        const body = getStat('body');
        const dex = getStat('dex');
        const prec = getStat('prec');
        const pot = getStat('pot');
        const spirit = getStat('spirit');

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
        return ''; // Remove the [REGAL-STATS] tag from text
      });

      // Strip potential closing [/REGAL-STATS] if they used one
      cleanContent = cleanContent.replace(/\[\/REGAL-STATS\]/gi, '');
      
      // Clean up stray Jcink <br> tags left behind from the stats block and edges
      cleanContent = cleanContent.replace(/^(<br\s*\/?>\s*)+/, '');
      cleanContent = cleanContent.replace(/(<br\s*\/?>\s*)+$/, '');

      // 3. Dialogue coloring
      // Create a temporary DOM node to parse text nodes and apply quotes,
      // avoiding HTML tag corruption.
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = cleanContent;
      
      const walk = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT, null, false);
      let n;
      const nodesToReplace = [];
      while(n = walk.nextNode()) {
        if (n.nodeValue.match(/["“].*?["”]/)) {
          nodesToReplace.push(n);
        }
      }

      nodesToReplace.forEach(textNode => {
        const span = document.createElement('span');
        span.innerHTML = textNode.nodeValue.replace(/(["“].*?["”])/g, '<span class="regal-dialogue">$1</span>');
        textNode.parentNode.replaceChild(span, textNode);
      });

      cleanContent = tempDiv.innerHTML;

      // 4. Construct inline styles for scoped CSS variables
      const inlineStyles = `
        ${color ? `--regal-accent: ${color}; --regal-border: ${color};` : ''}
        ${bg ? `--regal-bg: ${bg};` : ''}
        ${bg2 ? `--regal-bg2: ${bg2};` : ''}
        ${textCol ? `--regal-text: ${textCol};` : ''}
        ${boxbg ? `--regal-boxbg: ${boxbg};` : ''}
      `;

      // 5. Build the final HTML replacement
      // Generate a unique ID to attach events later without using Web Components
      const uniqueId = 'regal-' + Math.random().toString(36).substr(2, 9);
      
      // Encode the original raw attributes so we can reconstruct the exact BBCode block on copy
      const encodedAttrs = encodeURIComponent(attrString || '');
      const encodedStats = originalStatsAttr !== null ? encodeURIComponent(originalStatsAttr) : 'NONE';
      
      return `
        <div class="regal-rp-container" id="${uniqueId}" style="${inlineStyles}" data-attrs="${encodedAttrs}" data-stats="${encodedStats}">
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
              ${cleanContent}
            </div>
          </div>
          <button class="regal-copy-btn" title="Copy Template Code">📋</button>
        </div>
      `;
    });

    post.innerHTML = newHTML;
  });

  // Attach event listeners for all the newly generated containers
  document.querySelectorAll('.regal-rp-container').forEach(container => {
    // Only attach once
    if (container.dataset.initialized) return;
    container.dataset.initialized = 'true';

    const iconEl = container.querySelector('.regal-rp-icon');
    if (iconEl) {
      iconEl.addEventListener('click', () => {
        container.classList.add('show-overlay');
        setTimeout(() => {
          const bars = container.querySelectorAll('.regal-stat-bar-fill');
          bars.forEach(bar => {
            bar.style.width = bar.getAttribute('data-width');
          });
        }, 100);
      });
    }

    const closeBtn = container.querySelector('.regal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        container.classList.remove('show-overlay');
        const bars = container.querySelectorAll('.regal-stat-bar-fill');
        bars.forEach(bar => {
          bar.style.width = '0%';
        });
      });
    }

    const copyBtn = container.querySelector('.regal-copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        // Decode the saved attributes to reconstruct the BBCode exactly as typed
        const attrStr = decodeURIComponent(container.getAttribute('data-attrs') || '');
        const statsStrRaw = container.getAttribute('data-stats');
        
        let blankCode = `[REGAL${attrStr}]\n`;
        if (statsStrRaw !== 'NONE') {
          blankCode += `\n[REGAL-STATS${decodeURIComponent(statsStrRaw)}]\n`;
        }
        blankCode += `\nWrite your RP text here...\n[/REGAL]`;
        
        navigator.clipboard.writeText(blankCode).then(() => {
          const originalText = copyBtn.innerHTML;
          copyBtn.innerHTML = '✓';
          setTimeout(() => copyBtn.innerHTML = originalText, 1500);
        });
      });
    }
  });
}
