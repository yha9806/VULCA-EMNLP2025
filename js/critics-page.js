/**
 * Critics Page Generator
 *
 * Dynamically generates critic profile cards from the VULCA_DATA structure.
 * Each card displays persona information, biography, and RPAIT dimension scores.
 *
 * @version 1.0.0
 */

(function() {
  'use strict';

  /**
   * Initialize critics page on DOM ready
   */
  function initCriticsPage() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        renderCritics();
        // Listen to language change events
        document.addEventListener('langchange', () => {
          console.log('[Critics Page] Language changed, re-rendering...');
          renderCritics();
        });
      });
    } else {
      renderCritics();
      // Listen to language change events
      document.addEventListener('langchange', () => {
        console.log('[Critics Page] Language changed, re-rendering...');
        renderCritics();
      });
    }
  }

  /**
   * Render all critic cards
   */
  function renderCritics() {
    try {
      // Check if VULCA_DATA exists
      if (typeof window.VULCA_DATA === 'undefined' || !window.VULCA_DATA.personas) {
        console.error('[Critics Page] VULCA_DATA.personas not found');
        showError('数据加载失败，请刷新页面。');
        return;
      }

      const container = document.getElementById('critics-grid');
      if (!container) {
        console.error('[Critics Page] #critics-grid container not found');
        return;
      }

      // Clear loading message
      container.innerHTML = '';

      // Generate cards for each persona
      const personas = window.VULCA_DATA.personas;
      if (!personas || personas.length === 0) {
        container.innerHTML = '<p class="no-critics">没有评论家数据</p>';
        return;
      }

      personas.forEach((persona, index) => {
        try {
          const card = createCriticCard(persona);
          if (card) {
            container.appendChild(card);
          }
        } catch (error) {
          console.error(`[Critics Page] Error rendering card for ${persona.nameZh}:`, error);
        }
      });

      console.log(`[Critics Page] Rendered ${personas.length} critic cards`);

    } catch (error) {
      console.error('[Critics Page] Fatal error rendering critics:', error);
      showError('页面加载出错，请刷新。');
    }
  }

  /**
   * Create a single critic card element
   * @param {Object} persona - Persona object from VULCA_DATA.personas
   * @returns {HTMLElement} Card element
   */
  function createCriticCard(persona) {
    // Validate persona object
    if (!persona || !persona.nameZh) {
      console.warn('[Critics Page] Invalid persona object:', persona);
      return null;
    }

    // Validate RPAIT data
    if (!persona.rpait || typeof persona.rpait !== 'object') {
      console.error(`[Critics Page] Missing or invalid rpait for ${persona.nameZh}`);
      return null;
    }

    const card = document.createElement('article');
    card.className = 'critic-card';
    card.setAttribute('data-critic-id', persona.id);

    // Color accent (use persona color if available, fallback to default)
    const personaColor = persona.color || '#999999';
    card.style.setProperty('--critic-color', personaColor);

    // Build card content
    const header = createCardHeader(persona, personaColor);
    const body = createCardBody(persona);

    card.appendChild(header);
    card.appendChild(body);

    return card;
  }

  /**
   * Create card header with name and period
   * @param {Object} persona
   * @param {string} color
   * @returns {HTMLElement}
   */
  function createCardHeader(persona, color) {
    const header = document.createElement('div');
    header.className = 'critic-card-header';
    header.style.borderLeftColor = color;

    // Name (bilingual)
    const name = document.createElement('h2');
    name.className = 'critic-name';

    const nameZh = document.createElement('span');
    nameZh.className = 'critic-name-zh';
    nameZh.lang = 'zh';
    nameZh.textContent = persona.nameZh;

    const nameEn = document.createElement('span');
    nameEn.className = 'critic-name-en';
    nameEn.lang = 'en';
    nameEn.textContent = persona.nameEn || '';

    name.appendChild(nameZh);
    name.appendChild(nameEn);

    // Period / description (bilingual)
    const period = document.createElement('p');
    period.className = 'critic-period';

    const periodZh = document.createElement('span');
    periodZh.lang = 'zh';
    periodZh.textContent = persona.period || persona.periodZh || persona.era || '';

    const periodEn = document.createElement('span');
    periodEn.lang = 'en';
    periodEn.textContent = persona.periodEn || persona.period || persona.era || '';

    period.appendChild(periodZh);
    period.appendChild(periodEn);

    header.appendChild(name);
    if (periodZh.textContent || periodEn.textContent) {
      header.appendChild(period);
    }

    return header;
  }

  /**
   * Create card body with biography and RPAIT grid
   * @param {Object} persona
   * @returns {HTMLElement}
   */
  function createCardBody(persona) {
    const body = document.createElement('div');
    body.className = 'critic-card-body';

    // Biography (bilingual)
    const bioZh = persona.bioZh || persona.bio;
    const bioEn = persona.bioEn || persona.bio;

    if (bioZh || bioEn) {
      const bio = document.createElement('p');
      bio.className = 'critic-bio';

      const bioSpanZh = document.createElement('span');
      bioSpanZh.lang = 'zh';
      bioSpanZh.textContent = bioZh || '';

      const bioSpanEn = document.createElement('span');
      bioSpanEn.lang = 'en';
      bioSpanEn.textContent = bioEn || '';

      bio.appendChild(bioSpanZh);
      bio.appendChild(bioSpanEn);

      body.appendChild(bio);
    }

    // RPAIT Grid
    const rpaitGrid = createRPAITGrid(persona.rpait, persona.color);
    body.appendChild(rpaitGrid);

    return body;
  }

  /**
   * Create RPAIT dimension grid
   * @param {Object} rpait - { R: number, P: number, A: number, I: number, T: number }
   * @param {string} personaColor - Color for bar fills
   * @returns {HTMLElement}
   */
  function createRPAITGrid(rpait, personaColor) {
    const grid = document.createElement('div');
    grid.className = 'rpait-grid';

    const dimensions = [
      { key: 'R', label: 'Representation', labelZh: '代表性' },
      { key: 'P', label: 'Philosophicality', labelZh: '哲学性' },
      { key: 'A', label: 'Aesthetics', labelZh: '美学性' },
      { key: 'I', label: 'Interpretability', labelZh: '诠释性' },
      { key: 'T', label: 'Technicality', labelZh: '技巧性' }
    ];

    dimensions.forEach(dim => {
      const score = rpait[dim.key] || 0;

      // Validate score is between 1-10
      const validScore = Math.max(1, Math.min(10, parseInt(score) || 0));

      const bar = document.createElement('div');
      bar.className = 'rpait-bar';
      bar.setAttribute('data-dimension', dim.key);

      // Label (bilingual tooltip)
      const label = document.createElement('div');
      label.className = 'rpait-label';

      const abbr = document.createElement('abbr');
      abbr.setAttribute('title', `${dim.labelZh} / ${dim.label}`);
      abbr.textContent = dim.key;

      const scoreSpan = document.createElement('span');
      scoreSpan.className = 'score';
      scoreSpan.textContent = `${validScore}/10`;

      label.appendChild(abbr);
      label.appendChild(scoreSpan);

      // Bar background
      const barBg = document.createElement('div');
      barBg.className = 'rpait-bar-bg';

      // Bar fill
      const fill = document.createElement('div');
      fill.className = 'rpait-bar-fill';
      fill.style.width = `${(validScore / 10) * 100}%`;
      fill.style.backgroundColor = personaColor || '#4a90a4';

      barBg.appendChild(fill);

      bar.appendChild(label);
      bar.appendChild(barBg);
      grid.appendChild(bar);
    });

    return grid;
  }

  /**
   * Show error message to user
   * @param {string} message
   */
  function showError(message) {
    const container = document.getElementById('critics-grid');
    if (container) {
      container.innerHTML = `<div class="error-message">${message}</div>`;
    }
  }

  // Initialize when script loads
  initCriticsPage();

  // Expose for testing
  window.CriticsPage = {
    renderCritics,
    createCriticCard
  };

})();
