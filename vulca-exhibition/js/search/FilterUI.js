/**
 * FilterUI - Interactive filter interface
 *
 * Phase 5 Task 5.2: Multi-Dimension Filtering System
 * Provides UI controls for applying filters
 */

class FilterUI {
  constructor(options = {}) {
    this.filterSystem = options.filterSystem || null;
    this.container = options.container || null;
    this.onFilterChange = options.onFilterChange || null;

    this.filterPanel = null;
    this.isOpen = false;

    this.init();
  }

  /**
   * Initialize filter UI
   */
  init() {
    if (!this.filterSystem) {
      console.warn('⚠️  FilterUI: No filterSystem provided');
      return;
    }

    this.createFilterPanel();
    this.attachEventListeners();

    console.log('✅ FilterUI initialized');
  }

  /**
   * Create filter panel HTML
   */
  createFilterPanel() {
    // Panel container
    this.filterPanel = document.createElement('div');
    this.filterPanel.className = 'filter-panel';
    this.filterPanel.style.cssText = `
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 999;
      display: none;
      flex-direction: column;
      align-items: flex-start;
      padding: 20px;
    `;

    // Filter content
    const filterContent = document.createElement('div');
    filterContent.className = 'filter-content';
    filterContent.style.cssText = `
      background: white;
      border-radius: 8px;
      padding: 20px;
      width: 90%;
      max-width: 400px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    `;

    // Title
    const title = document.createElement('h3');
    title.textContent = '高级筛选';
    title.style.cssText = 'margin: 0 0 20px 0; font-size: 18px;';
    filterContent.appendChild(title);

    // Persona filters
    filterContent.appendChild(this.createPersonaSection());

    // Artwork filters
    filterContent.appendChild(this.createArtworkSection());

    // RPAIT filters
    filterContent.appendChild(this.createRPAITSection());

    // Combination logic
    filterContent.appendChild(this.createCombinationLogicSection());

    // Reset and apply buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'margin-top: 20px; display: flex; gap: 10px;';

    const resetBtn = document.createElement('button');
    resetBtn.textContent = '重置';
    resetBtn.style.cssText = `
      flex: 1;
      padding: 10px;
      background: #f0f0f0;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    `;
    resetBtn.addEventListener('click', () => this.handleReset());

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '关闭';
    closeBtn.style.cssText = `
      flex: 1;
      padding: 10px;
      background: #0066cc;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    `;
    closeBtn.addEventListener('click', () => this.close());

    buttonContainer.appendChild(resetBtn);
    buttonContainer.appendChild(closeBtn);
    filterContent.appendChild(buttonContainer);

    this.filterPanel.appendChild(filterContent);
    document.body.appendChild(this.filterPanel);
  }

  /**
   * Create persona filter section
   */
  createPersonaSection() {
    const section = document.createElement('div');
    section.style.cssText = 'margin-bottom: 20px;';

    const label = document.createElement('h4');
    label.textContent = '评论家';
    label.style.cssText = 'margin: 0 0 10px 0; font-size: 14px;';
    section.appendChild(label);

    const personas = this.filterSystem.getAvailablePersonas();
    personas.forEach((persona) => {
      const checkboxDiv = document.createElement('div');
      checkboxDiv.style.cssText = 'margin-bottom: 8px;';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `persona-${persona}`;
      checkbox.value = persona;
      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.filterSystem.addPersonaFilter(persona);
        } else {
          this.filterSystem.removePersonaFilter(persona);
        }
        this.notifyFilterChange();
      });

      const checkboxLabel = document.createElement('label');
      checkboxLabel.htmlFor = `persona-${persona}`;
      checkboxLabel.textContent = persona;
      checkboxLabel.style.cssText = 'margin-left: 8px; cursor: pointer; font-size: 13px;';

      checkboxDiv.appendChild(checkbox);
      checkboxDiv.appendChild(checkboxLabel);
      section.appendChild(checkboxDiv);
    });

    return section;
  }

  /**
   * Create artwork filter section
   */
  createArtworkSection() {
    const section = document.createElement('div');
    section.style.cssText = 'margin-bottom: 20px;';

    const label = document.createElement('h4');
    label.textContent = '作品';
    label.style.cssText = 'margin: 0 0 10px 0; font-size: 14px;';
    section.appendChild(label);

    const artworks = this.filterSystem.getAvailableArtworks();
    artworks.forEach((artwork) => {
      const checkboxDiv = document.createElement('div');
      checkboxDiv.style.cssText = 'margin-bottom: 8px;';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `artwork-${artwork}`;
      checkbox.value = artwork;
      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.filterSystem.addArtworkFilter(artwork);
        } else {
          this.filterSystem.removeArtworkFilter(artwork);
        }
        this.notifyFilterChange();
      });

      const checkboxLabel = document.createElement('label');
      checkboxLabel.htmlFor = `artwork-${artwork}`;
      checkboxLabel.textContent = artwork;
      checkboxLabel.style.cssText = 'margin-left: 8px; cursor: pointer; font-size: 13px;';

      checkboxDiv.appendChild(checkbox);
      checkboxDiv.appendChild(checkboxLabel);
      section.appendChild(checkboxDiv);
    });

    return section;
  }

  /**
   * Create RPAIT dimension filter section
   */
  createRPAITSection() {
    const section = document.createElement('div');
    section.style.cssText = 'margin-bottom: 20px;';

    const label = document.createElement('h4');
    label.textContent = 'RPAIT维度';
    label.style.cssText = 'margin: 0 0 10px 0; font-size: 14px;';
    section.appendChild(label);

    const dimensions = this.filterSystem.getRPAITDimensions();

    // No dimension selected option
    const noneDiv = document.createElement('div');
    noneDiv.style.cssText = 'margin-bottom: 8px;';
    const noneRadio = document.createElement('input');
    noneRadio.type = 'radio';
    noneRadio.name = 'rpait-dimension';
    noneRadio.id = 'dimension-none';
    noneRadio.value = '';
    noneRadio.checked = true;
    noneRadio.addEventListener('change', () => {
      this.filterSystem.setRPAITDimension(null);
      this.notifyFilterChange();
    });

    const noneLabel = document.createElement('label');
    noneLabel.htmlFor = 'dimension-none';
    noneLabel.textContent = '不筛选';
    noneLabel.style.cssText = 'margin-left: 8px; cursor: pointer; font-size: 13px;';

    noneDiv.appendChild(noneRadio);
    noneDiv.appendChild(noneLabel);
    section.appendChild(noneDiv);

    // Dimension options
    dimensions.forEach((dim) => {
      const radioDiv = document.createElement('div');
      radioDiv.style.cssText = 'margin-bottom: 8px;';

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'rpait-dimension';
      radio.id = `dimension-${dim.key}`;
      radio.value = dim.key;
      radio.addEventListener('change', (e) => {
        this.filterSystem.setRPAITDimension(e.target.value);
        this.notifyFilterChange();
      });

      const radioLabel = document.createElement('label');
      radioLabel.htmlFor = `dimension-${dim.key}`;
      radioLabel.textContent = `${dim.key} - ${dim.label}`;
      radioLabel.style.cssText = 'margin-left: 8px; cursor: pointer; font-size: 13px;';

      radioDiv.appendChild(radio);
      radioDiv.appendChild(radioLabel);
      section.appendChild(radioDiv);
    });

    // Score range
    const rangeDiv = document.createElement('div');
    rangeDiv.style.cssText = 'margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;';

    const rangeLabel = document.createElement('div');
    rangeLabel.textContent = '评分范围';
    rangeLabel.style.cssText = 'font-size: 13px; margin-bottom: 10px;';
    rangeDiv.appendChild(rangeLabel);

    // Min score
    const minContainer = document.createElement('div');
    minContainer.style.cssText = 'margin-bottom: 10px;';
    const minLabel = document.createElement('label');
    minLabel.textContent = '最小分数: ';
    minLabel.style.cssText = 'font-size: 12px; margin-right: 8px;';
    const minInput = document.createElement('input');
    minInput.type = 'number';
    minInput.min = 0;
    minInput.max = 10;
    minInput.value = 0;
    minInput.style.cssText = 'width: 60px; padding: 4px;';
    minInput.addEventListener('change', (e) => {
      this.filterSystem.setRPAITScoreRange(
        parseInt(e.target.value),
        parseInt(document.getElementById('rpait-max').value)
      );
      this.notifyFilterChange();
    });
    minContainer.appendChild(minLabel);
    minContainer.appendChild(minInput);
    rangeDiv.appendChild(minContainer);

    // Max score
    const maxContainer = document.createElement('div');
    const maxLabel = document.createElement('label');
    maxLabel.textContent = '最大分数: ';
    maxLabel.style.cssText = 'font-size: 12px; margin-right: 8px;';
    const maxInput = document.createElement('input');
    maxInput.type = 'number';
    maxInput.min = 0;
    maxInput.max = 10;
    maxInput.id = 'rpait-max';
    maxInput.value = 10;
    maxInput.style.cssText = 'width: 60px; padding: 4px;';
    maxInput.addEventListener('change', (e) => {
      this.filterSystem.setRPAITScoreRange(
        parseInt(document.querySelector('input[type="number"]:first-of-type').value),
        parseInt(e.target.value)
      );
      this.notifyFilterChange();
    });
    maxContainer.appendChild(maxLabel);
    maxContainer.appendChild(maxInput);
    rangeDiv.appendChild(maxContainer);

    section.appendChild(rangeDiv);
    return section;
  }

  /**
   * Create combination logic section
   */
  createCombinationLogicSection() {
    const section = document.createElement('div');
    section.style.cssText = 'margin-bottom: 20px; padding-top: 15px; border-top: 1px solid #eee;';

    const label = document.createElement('h4');
    label.textContent = '筛选逻辑';
    label.style.cssText = 'margin: 0 0 10px 0; font-size: 14px;';
    section.appendChild(label);

    // AND logic
    const andDiv = document.createElement('div');
    andDiv.style.cssText = 'margin-bottom: 8px;';
    const andRadio = document.createElement('input');
    andRadio.type = 'radio';
    andRadio.name = 'combination-logic';
    andRadio.id = 'logic-and';
    andRadio.value = 'AND';
    andRadio.checked = true;
    andRadio.addEventListener('change', () => {
      this.filterSystem.setCombinationLogic('AND');
      this.notifyFilterChange();
    });

    const andLabel = document.createElement('label');
    andLabel.htmlFor = 'logic-and';
    andLabel.textContent = '所有条件都满足 (AND)';
    andLabel.style.cssText = 'margin-left: 8px; cursor: pointer; font-size: 13px;';

    andDiv.appendChild(andRadio);
    andDiv.appendChild(andLabel);
    section.appendChild(andDiv);

    // OR logic
    const orDiv = document.createElement('div');
    const orRadio = document.createElement('input');
    orRadio.type = 'radio';
    orRadio.name = 'combination-logic';
    orRadio.id = 'logic-or';
    orRadio.value = 'OR';
    orRadio.addEventListener('change', () => {
      this.filterSystem.setCombinationLogic('OR');
      this.notifyFilterChange();
    });

    const orLabel = document.createElement('label');
    orLabel.htmlFor = 'logic-or';
    orLabel.textContent = '任一条件满足 (OR)';
    orLabel.style.cssText = 'margin-left: 8px; cursor: pointer; font-size: 13px;';

    orDiv.appendChild(orRadio);
    orDiv.appendChild(orLabel);
    section.appendChild(orDiv);

    return section;
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Global keyboard shortcut for filters (Ctrl/Cmd + Shift + F)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'f') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  /**
   * Handle reset
   */
  handleReset() {
    this.filterSystem.resetFilters();

    // Reset UI checkboxes and radios
    document.querySelectorAll('.filter-panel input').forEach((input) => {
      if (input.type === 'checkbox') {
        input.checked = false;
      } else if (input.type === 'radio' && input.value === '') {
        input.checked = true;
      }
    });

    document.getElementById('rpait-max').value = 10;
    document.querySelector('input[type="number"]:first-of-type').value = 0;

    this.notifyFilterChange();
  }

  /**
   * Notify filter change
   */
  notifyFilterChange() {
    if (this.onFilterChange) {
      const results = this.filterSystem.getFilteredResults();
      this.onFilterChange(results);
    }
  }

  /**
   * Open filter panel
   */
  open() {
    this.isOpen = true;
    this.filterPanel.style.display = 'flex';
    console.log('🔍 Filter panel opened');
  }

  /**
   * Close filter panel
   */
  close() {
    this.isOpen = false;
    this.filterPanel.style.display = 'none';
    console.log('🔍 Filter panel closed');
  }

  /**
   * Toggle filter panel
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
}

// Make globally accessible
window.FilterUI = FilterUI;
