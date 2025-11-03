# Implementation Tasks - Redesign Heatmap Layout and Data

**Change ID**: `redesign-heatmap-layout-and-data`
**Total Estimated Time**: 230 minutes (~4 hours)
**Status**: 🔄 Proposed

---

## Phase 1: Layout Redesign (30 minutes)

### Task 1.1: Make Heatmap a Large Panel
**Estimated Time**: 5 minutes
**Files**: `index.html`, `styles/main.css`

- [ ] Add `.viz-panel-large` class to `#similarity-heatmap-panel` in index.html
- [ ] Update heatmap header to include dimension label:
  ```html
  <h3>评论家相似度矩阵 · 当前维度: <span id="heatmap-dimension-label">全部维度</span></h3>
  ```

**Verification**:
- [ ] Heatmap panel spans 2 columns on desktop (≥1024px)
- [ ] Heatmap panel spans 1 column on mobile (<1024px)

---

### Task 1.2: Implement Dynamic Grid Sizing CSS
**Estimated Time**: 10 minutes
**Files**: `styles/main.css`

- [ ] Update `.heatmap-matrix` to support variable column count:
  ```css
  .heatmap-matrix {
    display: grid;
    grid-template-columns: repeat(var(--persona-count, 6), 1fr);
    gap: 3px;
  }
  ```
- [ ] Increase minimum cell size:
  ```css
  .heatmap-cell {
    min-width: 60px;
    min-height: 60px;
    font-size: 16px;
  }

  @media (max-width: 767px) {
    .heatmap-cell {
      min-width: 50px;
      min-height: 50px;
      font-size: 14px;
    }
  }
  ```

**Verification**:
- [ ] Cells are at least 60×60px on desktop
- [ ] Grid adjusts to CSS variable `--persona-count`

---

### Task 1.3: Shorten Axis Labels
**Estimated Time**: 10 minutes
**Files**: `js/visualizations/similarity-heatmap.js`, `styles/main.css`

- [ ] Update `renderYAxisLabels()` to show Chinese name only:
  ```javascript
  yLabel.textContent = persona.nameZh;  // Remove "(English Name)"
  ```
- [ ] Update `renderXAxisLabels()` to show abbreviated name:
  ```javascript
  // For long names, show first 2 characters
  const displayName = persona.nameZh.length <= 3 ?
    persona.nameZh :
    persona.nameZh.slice(0, 2);
  xLabel.textContent = displayName;
  ```
- [ ] Add full name to label title attribute for tooltip:
  ```javascript
  xLabel.title = `${persona.nameZh} (${persona.nameEn})`;
  yLabel.title = `${persona.nameZh} (${persona.nameEn})`;
  ```
- [ ] Adjust x-axis label height in CSS:
  ```css
  .heatmap-x-labels .heatmap-label {
    height: 50px;  /* Increased from 40px */
  }
  ```

**Verification**:
- [ ] Y-axis shows Chinese names only (no overlap)
- [ ] X-axis shows 2-3 character names (no overlap)
- [ ] Hovering over labels shows full bilingual name

---

### Task 1.4: Add Empty State UI
**Estimated Time**: 5 minutes
**Files**: `js/visualizations/similarity-heatmap.js`, `styles/main.css`

- [ ] Create empty state HTML structure:
  ```javascript
  function renderEmptyState() {
    const container = document.querySelector('.heatmap-container');
    container.innerHTML = `
      <div class="heatmap-empty-state">
        <p class="empty-message">请选择至少2位评论家以查看相似度矩阵</p>
        <div class="empty-actions">
          <button class="quick-select-btn" data-count="all">选择全部 (6)</button>
          <button class="quick-select-btn" data-count="3">选择3位</button>
        </div>
      </div>
    `;
    attachQuickSelectHandlers();
  }
  ```
- [ ] Add CSS for empty state:
  ```css
  .heatmap-empty-state {
    text-align: center;
    padding: 60px 20px;
  }
  .empty-message {
    font-size: 16px;
    color: #666;
    margin-bottom: 20px;
  }
  .quick-select-btn {
    margin: 0 8px;
    padding: 10px 20px;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  ```

**Verification**:
- [ ] Empty state shown when <2 personas selected
- [ ] Quick-select buttons trigger persona selection
- [ ] Heatmap renders after quick-select

---

## Phase 2: New Data Functions (40 minutes)

### Task 2.1: Add getPersonaRPAITForArtwork Function
**Estimated Time**: 10 minutes
**Files**: `js/analysis.js`

- [ ] Add new function to VULCAAnalysis class:
  ```javascript
  /**
   * Get persona's RPAIT scores for a specific artwork
   * @param {string} personaId
   * @param {string} artworkId
   * @returns {Object|null} RPAIT object with R, P, A, I, T properties
   */
  getPersonaRPAITForArtwork(personaId, artworkId) {
    const critique = window.VULCA_DATA.critiques.find(c =>
      c.personaId === personaId && c.artworkId === artworkId
    );

    return critique ? critique.rpait : null;
  }
  ```

**Verification**:
- [ ] Returns correct RPAIT for valid persona + artwork
- [ ] Returns null for invalid combinations
- [ ] Tested with all 6 personas × 4 artworks = 24 combinations

---

### Task 2.2: Add calculateDimensionSimilarity Function
**Estimated Time**: 15 minutes
**Files**: `js/analysis.js`

- [ ] Add new function to VULCAAnalysis class:
  ```javascript
  /**
   * Calculate dimension-specific similarity between two personas
   * for a given artwork
   *
   * @param {string} persona1Id
   * @param {string} persona2Id
   * @param {string} dimension - 'R', 'P', 'A', 'I', 'T', or 'all'
   * @param {string} artworkId
   * @returns {number} Similarity in [0, 1]
   */
  calculateDimensionSimilarity(persona1Id, persona2Id, dimension, artworkId) {
    const rpait1 = this.getPersonaRPAITForArtwork(persona1Id, artworkId);
    const rpait2 = this.getPersonaRPAITForArtwork(persona2Id, artworkId);

    if (!rpait1 || !rpait2) {
      console.warn(`Missing RPAIT data for ${persona1Id} or ${persona2Id} on ${artworkId}`);
      return 0;
    }

    if (dimension === 'all') {
      // Use 5D cosine similarity
      return this.rpaitCosineSimilarity(rpait1, rpait2);
    } else {
      // Single dimension: normalized score difference
      const score1 = rpait1[dimension];
      const score2 = rpait2[dimension];

      // Similarity = 1 - (difference / max_difference)
      // Max difference = 10 (scores range 0-10)
      return 1 - Math.abs(score1 - score2) / 10;
    }
  }
  ```

**Verification**:
- [ ] Returns 1.0 for identical personas (self-similarity)
- [ ] Returns 0.9 for 1-point difference in single dimension
- [ ] Returns correct cosine similarity for 'all' dimensions
- [ ] Handles missing data gracefully (returns 0)

---

### Task 2.3: Add getArtworkDimensionSimilarityMatrix Function
**Estimated Time**: 15 minutes
**Files**: `js/analysis.js`

- [ ] Add new function to VULCAAnalysis class:
  ```javascript
  /**
   * Build similarity matrix for specific artwork and dimension
   * with optional persona filtering
   *
   * @param {string} artworkId
   * @param {string} dimension - 'R', 'P', 'A', 'I', 'T', or 'all'
   * @param {Array<string>} personaIds - Optional persona ID filter
   * @returns {Object} Similarity matrix: { [id1]: { [id2]: similarity } }
   */
  getArtworkDimensionSimilarityMatrix(artworkId, dimension, personaIds = null) {
    const personas = personaIds ?
      personaIds.map(id => window.VULCA_DATA.personas.find(p => p.id === id)).filter(Boolean) :
      window.VULCA_DATA.personas;

    const matrix = {};

    personas.forEach(persona1 => {
      matrix[persona1.id] = {};
      personas.forEach(persona2 => {
        matrix[persona1.id][persona2.id] = this.calculateDimensionSimilarity(
          persona1.id,
          persona2.id,
          dimension,
          artworkId
        );
      });
    });

    return matrix;
  }
  ```

**Verification**:
- [ ] Returns N×N matrix for N personas
- [ ] Returns 6×6 matrix when personaIds = null
- [ ] Returns 3×3 matrix when personaIds = ['su-shi', 'guo-xi', 'john-ruskin']
- [ ] Matrix is symmetric (matrix[a][b] === matrix[b][a])
- [ ] Diagonal is all 1.0 (self-similarity)

---

## Phase 3: Persona Selector Integration (20 minutes)

### Task 3.1: Track Selected Personas State
**Estimated Time**: 5 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] Add state variables at module level:
  ```javascript
  let selectedPersonas = ['su-shi', 'guo-xi', 'john-ruskin'];  // Default 3
  let currentArtworkId = 'artwork-1';
  let currentDimension = 'all';
  ```

**Verification**:
- [ ] Variables accessible throughout module
- [ ] Default state matches persona-selector initial state

---

### Task 3.2: Listen to persona-selected Events
**Estimated Time**: 10 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] Add event listener in `initEventListeners()`:
  ```javascript
  window.addEventListener('persona-selected', (e) => {
    const newSelection = e.detail.selectedPersonas;

    if (newSelection.length === selectedPersonas.length &&
        newSelection.every(id => selectedPersonas.includes(id))) {
      // No change, skip re-render
      return;
    }

    selectedPersonas = newSelection;
    console.log(`[Heatmap] Persona selection changed: ${selectedPersonas.length} selected`);
    renderHeatmap();
  });
  ```

**Verification**:
- [ ] Heatmap re-renders when personas are selected/deselected
- [ ] No unnecessary re-renders when selection doesn't change
- [ ] Console logs persona count on changes

---

### Task 3.3: Implement Quick-Select Handlers
**Estimated Time**: 5 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] Add quick-select button handlers:
  ```javascript
  function attachQuickSelectHandlers() {
    document.querySelectorAll('.quick-select-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const count = btn.dataset.count;

        if (count === 'all') {
          // Select all 6 personas
          const allIds = window.VULCA_DATA.personas.map(p => p.id);
          window.dispatchEvent(new CustomEvent('persona-quick-select', {
            detail: { personaIds: allIds }
          }));
        } else if (count === '3') {
          // Select first 3 personas
          const threeIds = window.VULCA_DATA.personas.slice(0, 3).map(p => p.id);
          window.dispatchEvent(new CustomEvent('persona-quick-select', {
            detail: { personaIds: threeIds }
          }));
        }
      });
    });
  }
  ```

**Verification**:
- [ ] "选择全部" button selects all 6 personas
- [ ] "选择3位" button selects first 3 personas
- [ ] Persona selector responds to `persona-quick-select` event

---

## Phase 4: Dimension Selector Integration (20 minutes)

### Task 4.1: Listen to Dimension Changes
**Estimated Time**: 10 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] Find dimension selector and add listener in `initEventListeners()`:
  ```javascript
  const dimensionSelect = document.getElementById('dimension-selector');
  if (dimensionSelect) {
    // Set initial dimension
    currentDimension = dimensionSelect.value;

    dimensionSelect.addEventListener('change', (e) => {
      currentDimension = e.target.value;
      console.log(`[Heatmap] Dimension changed to: ${currentDimension}`);
      updateDimensionLabel();
      updateLegend();
      renderHeatmap();
    });
  }
  ```

**Verification**:
- [ ] Heatmap re-renders when dimension changes
- [ ] Current dimension tracked correctly
- [ ] Initial dimension matches selector default value

---

### Task 4.2: Update Dimension Label in Header
**Estimated Time**: 10 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] Create label update function:
  ```javascript
  function updateDimensionLabel() {
    const labelEl = document.getElementById('heatmap-dimension-label');
    if (!labelEl) return;

    const dimensionLabels = {
      'all': '全部维度',
      'R': '写实性 (Representation)',
      'P': '哲学性 (Philosophy)',
      'A': '美学性 (Aesthetic)',
      'I': '身份性 (Identity)',
      'T': '传统性 (Tradition)'
    };

    labelEl.textContent = dimensionLabels[currentDimension] || currentDimension;
  }
  ```
- [ ] Call `updateDimensionLabel()` in:
  - Initial render
  - Dimension change handler

**Verification**:
- [ ] Label shows "全部维度" when dimension = 'all'
- [ ] Label shows "写实性 (Representation)" when dimension = 'R'
- [ ] Label updates immediately when dimension changes

---

## Phase 5: Artwork Carousel Integration (15 minutes)

### Task 5.1: Listen to Artwork Changes
**Estimated Time**: 10 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] Update `handleVisualizationUpdate()` function:
  ```javascript
  function handleVisualizationUpdate(e) {
    if (!e.detail || !e.detail.artworkId) return;

    const newArtworkId = e.detail.artworkId;

    if (newArtworkId === currentArtworkId) {
      // No change, skip re-render
      return;
    }

    currentArtworkId = newArtworkId;
    console.log(`[Heatmap] Artwork changed to: ${currentArtworkId}`);
    renderHeatmap();
  }
  ```

**Verification**:
- [ ] Heatmap re-renders when artwork changes in carousel
- [ ] No unnecessary re-renders for same artwork
- [ ] Current artwork ID tracked correctly

---

### Task 5.2: Add Artwork Title to Tooltips
**Estimated Time**: 5 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] Update `generateTooltipContent()` to include artwork:
  ```javascript
  function generateTooltipContent(persona1, persona2, similarity) {
    const artwork = window.VULCA_DATA.artworks.find(a => a.id === currentArtworkId);
    const artworkTitle = artwork ? artwork.titleZh : '';

    // ... existing diff calculation ...

    return `
      <div class="tooltip-header">
        <strong>${persona1.nameZh} ↔ ${persona2.nameZh}</strong>
      </div>
      <div class="tooltip-artwork">
        作品: ${artworkTitle}
      </div>
      <div class="tooltip-dimension">
        维度: ${getDimensionLabel(currentDimension)}
      </div>
      <div class="tooltip-similarity">
        <span class="similarity-value">相似度: ${similarity.toFixed(2)}</span>
        <span class="similarity-label">${getSimilarityLabel(similarity)}</span>
      </div>
      ${currentDimension === 'all' ? `
        <div class="tooltip-rpait">
          <div class="rpait-label">RPAIT 维度差异:</div>
          <ul class="tooltip-rpait-list">
            <li>写实性 (R): ±${diff.R}</li>
            <li>哲学性 (P): ±${diff.P}</li>
            <li>美学性 (A): ±${diff.A}</li>
            <li>身份性 (I): ±${diff.I}</li>
            <li>传统性 (T): ±${diff.T}</li>
          </ul>
        </div>
      ` : ''}
    `;
  }
  ```

**Verification**:
- [ ] Tooltip shows current artwork title
- [ ] Tooltip shows current dimension
- [ ] Dimension breakdown only shown for 'all' mode

---

## Phase 6: Update Rendering Logic (30 minutes)

### Task 6.1: Rewrite renderHeatmap Function
**Estimated Time**: 20 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] Completely rewrite `renderHeatmap()`:
  ```javascript
  function renderHeatmap() {
    const container = document.getElementById('similarity-heatmap');
    if (!container) return;

    // Handle empty state
    if (selectedPersonas.length < 2) {
      renderEmptyState();
      return;
    }

    // Get filtered personas
    const personas = selectedPersonas
      .map(id => window.VULCA_DATA.personas.find(p => p.id === id))
      .filter(Boolean);

    // Set CSS variable for grid columns
    container.style.setProperty('--persona-count', personas.length);

    // Get similarity matrix
    const matrix = window.VULCA_ANALYSIS.getArtworkDimensionSimilarityMatrix(
      currentArtworkId,
      currentDimension,
      selectedPersonas
    );

    // Clear container
    container.innerHTML = '';

    // Render cells
    personas.forEach((persona1, rowIndex) => {
      personas.forEach((persona2, colIndex) => {
        const similarity = matrix[persona1.id][persona2.id];
        const cell = createHeatmapCell(persona1, persona2, similarity, rowIndex, colIndex);
        container.appendChild(cell);
      });
    });

    // Render axis labels
    renderYAxisLabels(personas);
    renderXAxisLabels(personas);

    console.log(`✓ Heatmap rendered: ${personas.length}×${personas.length} matrix`);
  }
  ```

**Verification**:
- [ ] Renders N×N grid for N selected personas
- [ ] Uses artwork-specific, dimension-specific similarity
- [ ] Sets --persona-count CSS variable correctly
- [ ] Calls renderYAxisLabels/renderXAxisLabels with filtered personas

---

### Task 6.2: Update Axis Label Rendering
**Estimated Time**: 10 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] Update `renderYAxisLabels()` to accept personas parameter:
  ```javascript
  function renderYAxisLabels(personas) {
    const container = document.querySelector('.heatmap-y-labels');
    if (!container) return;

    container.innerHTML = '';

    personas.forEach((persona, index) => {
      const label = document.createElement('div');
      label.className = 'heatmap-label';
      label.dataset.persona = persona.id;
      label.dataset.index = index;
      label.textContent = persona.nameZh;  // Chinese name only
      label.title = `${persona.nameZh} (${persona.nameEn})`;  // Full name in tooltip
      label.setAttribute('role', 'rowheader');
      label.setAttribute('tabindex', '0');

      // ... event listeners ...

      container.appendChild(label);
    });
  }
  ```
- [ ] Update `renderXAxisLabels()` similarly:
  ```javascript
  function renderXAxisLabels(personas) {
    const container = document.querySelector('.heatmap-x-labels');
    if (!container) return;

    container.innerHTML = '';

    personas.forEach((persona, index) => {
      const label = document.createElement('div');
      label.className = 'heatmap-label';
      label.dataset.persona = persona.id;
      label.dataset.index = index;

      // Shorten label for x-axis
      const displayName = persona.nameZh.length <= 3 ?
        persona.nameZh :
        persona.nameZh.slice(0, 2);
      label.textContent = displayName;
      label.title = `${persona.nameZh} (${persona.nameEn})`;

      label.setAttribute('role', 'columnheader');
      label.setAttribute('tabindex', '0');

      // ... event listeners ...

      container.appendChild(label);
    });
  }
  ```

**Verification**:
- [ ] Y-axis labels show full Chinese names
- [ ] X-axis labels show abbreviated names (2-3 chars)
- [ ] Hover shows full bilingual name in both axes
- [ ] Labels filtered to selected personas

---

## Phase 7: Update Legend (20 minutes)

### Task 7.1: Implement Dynamic Legend
**Estimated Time**: 15 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] Create `updateLegend()` function:
  ```javascript
  function updateLegend() {
    const legendData = currentDimension === 'all' ? [
      { color: '#440154', range: '0.0-0.2', label: '极低相似度', ariaLabel: '极低相似度，0.0到0.2' },
      { color: '#31688e', range: '0.2-0.4', label: '低相似度', ariaLabel: '低相似度，0.2到0.4' },
      { color: '#35b779', range: '0.4-0.6', label: '中等相似度', ariaLabel: '中等相似度，0.4到0.6' },
      { color: '#fde724', range: '0.6-0.8', label: '高相似度', ariaLabel: '高相似度，0.6到0.8' },
      { color: '#ffffff', range: '0.8-1.0', label: '极高相似度', ariaLabel: '极高相似度，0.8到1.0', border: true }
    ] : [
      { color: '#440154', range: '0.0-0.2', label: '相差8-10分', ariaLabel: '分数差异8到10分' },
      { color: '#31688e', range: '0.2-0.4', label: '相差6-8分', ariaLabel: '分数差异6到8分' },
      { color: '#35b779', range: '0.4-0.6', label: '相差4-6分', ariaLabel: '分数差异4到6分' },
      { color: '#fde724', range: '0.6-0.8', label: '相差2-4分', ariaLabel: '分数差异2到4分' },
      { color: '#ffffff', range: '0.8-1.0', label: '相差0-2分', ariaLabel: '分数差异0到2分', border: true }
    ];

    renderHeatmapLegend(legendData);
  }
  ```
- [ ] Update `renderHeatmapLegend()` to accept data parameter:
  ```javascript
  function renderHeatmapLegend(legendData) {
    const legendContainer = document.querySelector('.legend-items');
    if (!legendContainer) return;

    legendContainer.innerHTML = '';

    legendData.forEach(data => {
      const item = document.createElement('div');
      item.className = 'legend-item';
      item.setAttribute('aria-label', data.ariaLabel);

      const swatch = document.createElement('span');
      swatch.className = 'legend-swatch';
      swatch.style.backgroundColor = data.color;
      if (data.border) {
        swatch.style.border = '1px solid #ccc';
      }

      const label = document.createElement('span');
      label.className = 'legend-label';
      label.textContent = `${data.range} ${data.label}`;

      item.appendChild(swatch);
      item.appendChild(label);
      legendContainer.appendChild(item);
    });
  }
  ```

**Verification**:
- [ ] Legend shows similarity ranges for 'all' dimensions
- [ ] Legend shows score difference ranges for single dimensions
- [ ] Legend updates when dimension changes

---

### Task 7.2: Add Helper Function for Dimension Label
**Estimated Time**: 5 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] Create `getDimensionLabel()` function:
  ```javascript
  function getDimensionLabel(dimension) {
    const labels = {
      'all': '全部维度',
      'R': '写实性',
      'P': '哲学性',
      'A': '美学性',
      'I': '身份性',
      'T': '传统性'
    };
    return labels[dimension] || dimension;
  }
  ```

**Verification**:
- [ ] Returns correct Chinese label for each dimension
- [ ] Used in tooltips and labels

---

## Phase 8: Testing & Validation (15 minutes)

### Task 8.1: Visual Regression Testing
**Estimated Time**: 5 minutes

- [ ] Test on desktop (1920px, 1440px, 1024px)
- [ ] Test on mobile (768px, 375px)
- [ ] Verify:
  - [ ] 2×2 grid displays correctly with 2 personas selected
  - [ ] 3×3 grid displays correctly with 3 personas selected
  - [ ] 6×6 grid displays correctly with 6 personas selected
  - [ ] Axis labels don't overlap at any size
  - [ ] Cells are readable (≥60×60px on desktop, ≥50×50px on mobile)

---

### Task 8.2: Integration Testing
**Estimated Time**: 5 minutes

- [ ] Test persona selector integration:
  - [ ] Select 2 personas → heatmap shows 2×2
  - [ ] Select 6 personas → heatmap shows 6×6
  - [ ] Deselect to 1 persona → empty state shown
  - [ ] Quick-select buttons work correctly

- [ ] Test dimension selector integration:
  - [ ] Change to 'R' → similarity values update, legend changes
  - [ ] Change to 'all' → similarity values update, legend changes
  - [ ] Dimension label in header updates

- [ ] Test artwork carousel integration:
  - [ ] Navigate to next artwork → similarity values update
  - [ ] Tooltip shows correct artwork title

---

### Task 8.3: Data Accuracy Verification
**Estimated Time**: 5 minutes

- [ ] Verify single dimension similarity calculation:
  - [ ] Su Shi R7 vs Guo Xi R8 on artwork-1 = 0.9 ✓
  - [ ] Identical scores (R7 vs R7) = 1.0 ✓
  - [ ] Maximum difference (R0 vs R10) = 0.0 ✓

- [ ] Verify 'all' dimensions similarity:
  - [ ] Uses artwork-specific RPAIT (not global average)
  - [ ] Self-similarity always 1.0
  - [ ] Symmetric matrix (matrix[a][b] === matrix[b][a])

---

## Post-Implementation

### Documentation Updates
- [ ] Update CLAUDE.md with new heatmap features
- [ ] Document dimension similarity formula
- [ ] Add screenshots showing different states (2×2, 3×3, 6×6 grids)

### Code Review Checklist
- [ ] No console errors
- [ ] All event listeners properly attached
- [ ] Functions have JSDoc comments
- [ ] No magic numbers (use constants)
- [ ] Responsive on all devices
- [ ] Accessible (WCAG AA)
- [ ] Performant (<100ms re-renders)

---

## Success Criteria

All tasks complete when:
- ✅ Heatmap dynamically sizes from 2×2 to 6×6 based on selected personas
- ✅ Axis labels are short and don't overlap
- ✅ Similarity values change when dimension changes
- ✅ Similarity values change when artwork changes
- ✅ Similarity values change when personas are selected/deselected
- ✅ Empty state shown when <2 personas selected
- ✅ Quick-select buttons work
- ✅ Legend adapts to current dimension mode
- ✅ Tooltips show artwork + dimension context
- ✅ All tests pass
- ✅ No regressions in existing functionality

---

**Ready to implement**: Proceed with Phase 1 tasks in order.
