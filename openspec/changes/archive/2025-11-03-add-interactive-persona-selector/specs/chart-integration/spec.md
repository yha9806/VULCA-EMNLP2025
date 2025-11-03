# Specification: Chart Integration with Persona Selection

**Capability**: `chart-integration`
**Feature**: Add Interactive Persona Selector
**Last Updated**: 2025-11-03

---

## Purpose

Integrate the global persona selection system with existing RPAIT radar chart and persona comparison matrix chart, enabling synchronized updates across visualizations.

## MODIFIED Requirements

### Requirement: RPAIT Radar Chart Selection Integration

The RPAIT radar chart SHALL listen to global persona selection changes and update its displayed datasets to match the selected personas.

**Rationale**: The radar chart currently only shows Su Shi by default with no way to change it. Users need to compare different personas interactively.

**Acceptance Criteria**:
- Chart listens to `persona:selectionChanged` event
- Updates `selectedPersonas` array when event fires
- Re-renders chart with new persona datasets (1-3)
- Displays each persona with color-coded radar overlay
- Smooth 200ms transition animation
- Default mode changes from 'single' to 'compare'
- Default selection changes from `['su-shi']` to `['su-shi', 'guo-xi', 'john-ruskin']`

#### Scenario: Radar chart updates when user selects 2 personas

**Given**: Radar chart is currently displaying 3 personas (Su Shi, Guo Xi, Ruskin)
**When**: User changes selection to only Su Shi and Mama Zola via dropdown
**Then**: The `persona:selectionChanged` event fires with `detail.personas = ['su-shi', 'mama-zola']`
**And**: The radar chart listener receives the event
**And**: The chart's `selectedPersonas` variable updates to `['su-shi', 'mama-zola']`
**And**: `updateRadarChart()` is called
**And**: Chart.js re-renders with 2 datasets (Su Shi red, Mama Zola green)
**And**: The transition takes 200ms
**And**: ARIA label updates: "RPAIT radar chart showing 2 personas: Su Shi and Mama Zola"

**Example Code**:
```javascript
// In rpait-radar.js (MODIFIED)

// CHANGED: Default from ['su-shi'] to ['su-shi', 'guo-xi', 'john-ruskin']
let selectedPersonas = ['su-shi', 'guo-xi', 'john-ruskin'];

// CHANGED: Default from 'single' to 'compare'
let currentMode = 'compare';

// ADDED: Event listener for global selection changes
function initEventListeners() {
  // Existing mode toggle buttons
  document.querySelectorAll('#rpait-radar-panel .viz-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      handleModeToggle(btn.dataset.mode);
    });
  });

  // NEW: Listen for global persona selection changes
  window.addEventListener('persona:selectionChanged', (event) => {
    const { personas } = event.detail;
    console.log(`[Radar Chart] Selection changed to ${personas.length} personas`, personas);

    selectedPersonas = personas;
    updateRadarChart();

    // Update ARIA label for accessibility
    updateARIALabel();
  });

  // Existing carousel listener
  window.addEventListener('visualization:update', handleVisualizationUpdate);

  console.log('✓ Radar chart event listeners initialized');
}

// MODIFIED: Update ARIA label to reflect current selection
function updateARIALabel() {
  const canvas = document.getElementById('rpait-radar-chart');
  if (!canvas) return;

  const personaNames = selectedPersonas.map(id => {
    const persona = window.VULCA_DATA.personas.find(p => p.id === id);
    return persona ? persona.nameEn : id;
  }).join(', ');

  canvas.setAttribute('aria-label',
    `RPAIT radar chart showing ${selectedPersonas.length} personas: ${personaNames}`
  );
}
```

---

#### Scenario: Radar chart displays 1 persona after selection

**Given**: User selects only John Ruskin via dropdown
**When**: The `persona:selectionChanged` event fires with `detail.personas = ['john-ruskin']`
**Then**: The radar chart updates to show a single dataset for John Ruskin
**And**: The dataset uses his theme color (#E8C19A) for border and points
**And**: The background fill is semi-transparent (rgba(232, 193, 154, 0.2))
**And**: All 5 RPAIT dimensions (R, P, A, I, T) display his scores
**And**: Chart legend shows "约翰·罗斯金 (John Ruskin)"

---

#### Scenario: Radar chart handles mode toggle with global selection

**Given**: Global selection is `['su-shi', 'guo-xi', 'john-ruskin']` (3 personas)
**When**: User clicks the "单一模式" button
**Then**: The mode toggle handler keeps only the first selected persona
**And**: Calls `PersonaSelection.setSelection(['su-shi'])` to update global state
**And**: This triggers `persona:selectionChanged` event
**And**: The chart updates to show only Su Shi
**And**: The dropdown also updates to show only Su Shi selected

**Example Code**:
```javascript
// MODIFIED: handleModeToggle now updates global state
function handleModeToggle(mode) {
  currentMode = mode;

  // Update button active states
  document.querySelectorAll('#rpait-radar-panel .viz-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  // Adjust selection based on mode
  if (mode === 'single' && selectedPersonas.length > 1) {
    // Keep only first persona
    window.PersonaSelection.setSelection([selectedPersonas[0]]);
    // This will trigger persona:selectionChanged event and update chart
  } else if (mode === 'compare' && selectedPersonas.length === 1) {
    // Add Guo Xi for comparison
    window.PersonaSelection.setSelection([...selectedPersonas, 'guo-xi']);
  }
  // If already in correct state, no change needed
}
```

---

### Requirement: Persona Matrix Chart Filtering

The persona comparison matrix chart SHALL filter displayed personas to match the global selection, showing only selected personas in the horizontal bar chart.

**Rationale**: The matrix currently shows all 6 personas regardless of user interest. Filtering to selected personas improves focus and readability.

**Acceptance Criteria**:
- Chart listens to `persona:selectionChanged` event
- Filters persona list to only include selected IDs
- Re-renders chart with filtered personas (1-3 rows)
- Dimension filter dropdown still works (independent of persona filter)
- Chart legend and labels update to reflect filtered personas
- Smooth 200ms transition animation

#### Scenario: Matrix chart filters to 2 selected personas

**Given**: Matrix chart is displaying all 6 personas across 5 RPAIT dimensions
**When**: User selects only Su Shi and Professor Petrova via dropdown
**Then**: The `persona:selectionChanged` event fires
**And**: The matrix chart listener receives `detail.personas = ['su-shi', 'professor-petrova']`
**And**: `updateMatrixChart()` filters the data to these 2 personas
**And**: The chart re-renders showing only 2 horizontal bars
**And**: Y-axis labels show: "苏轼" and "埃琳娜·佩特洛娃教授"
**And**: All 5 dimensions (R, P, A, I, T) display for each persona
**And**: Chart height adjusts to fit 2 rows

**Example Code**:
```javascript
// In persona-matrix.js (MODIFIED)

let selectedPersonas = ['su-shi', 'guo-xi', 'john-ruskin']; // NEW: Track selected

// MODIFIED: Get chart data with persona filtering
function getChartData() {
  // CHANGED: Filter personas based on selection
  const allPersonas = window.VULCA_DATA.personas;
  const personas = allPersonas.filter(p => selectedPersonas.includes(p.id));

  const labels = personas.map(p => p.nameZh);

  if (currentDimension === 'all') {
    // Show all 5 dimensions for selected personas
    const datasets = [
      {
        label: 'Representation (R)',
        data: personas.map(p => getRPAITScore(p.id, 'R')),
        backgroundColor: getComputedStyle(document.documentElement)
          .getPropertyValue('--rpait-r').trim()
      },
      {
        label: 'Philosophy (P)',
        data: personas.map(p => getRPAITScore(p.id, 'P')),
        backgroundColor: getComputedStyle(document.documentElement)
          .getPropertyValue('--rpait-p').trim()
      },
      // ... A, I, T datasets
    ];
    return { labels, datasets };
  } else {
    // Show single dimension for selected personas
    const dataset = {
      label: getDimensionLabel(currentDimension),
      data: personas.map(p => getRPAITScore(p.id, currentDimension)),
      backgroundColor: personas.map(p => hexToRgba(p.color, 0.7))
    };
    return { labels, datasets: [dataset] };
  }
}

// ADDED: Event listener for global selection changes
function initEventListeners() {
  // Existing dimension filter dropdown
  const dimensionSelect = document.getElementById('rpait-dimension-select');
  if (dimensionSelect) {
    dimensionSelect.addEventListener('change', (e) => {
      currentDimension = e.target.value;
      updateMatrixChart();
    });
  }

  // NEW: Listen for global persona selection changes
  window.addEventListener('persona:selectionChanged', (event) => {
    const { personas } = event.detail;
    console.log(`[Matrix Chart] Selection changed to ${personas.length} personas`, personas);

    selectedPersonas = personas;
    updateMatrixChart();
  });

  // Existing carousel listener
  window.addEventListener('visualization:update', handleVisualizationUpdate);

  console.log('✓ Matrix chart event listeners initialized');
}
```

---

#### Scenario: Matrix chart updates dimension filter with filtered personas

**Given**: User has selected Su Shi and Guo Xi (2 personas)
**And**: Matrix chart is showing all 5 dimensions for these 2 personas
**When**: User changes dimension filter dropdown to "Representation" only
**Then**: The chart updates to show only the R dimension
**And**: Only 2 horizontal bars appear (Su Shi and Guo Xi)
**And**: Each bar shows their R score (e.g., Su Shi: 7, Guo Xi: 8)
**And**: Bar colors match persona theme colors (not dimension color)
**And**: The global persona selection remains unchanged

---

#### Scenario: Matrix chart handles single persona selection

**Given**: User selects only AI Ethics Reviewer via dropdown
**When**: The `persona:selectionChanged` event fires with `['ai-ethics']`
**Then**: The matrix chart filters to show only 1 horizontal bar
**And**: Y-axis label shows "AI伦理评审员"
**And**: All 5 RPAIT dimensions display for this persona
**And**: Chart height shrinks to fit 1 row
**And**: No visual clutter from empty rows

---

### Requirement: Chart Synchronization

Both charts SHALL update simultaneously within 300ms when the global persona selection changes.

**Rationale**: Users expect both charts to reflect the same selection instantly. Delayed or unsynchronized updates create confusion.

**Acceptance Criteria**:
- Both charts listen to the same `persona:selectionChanged` event
- Both charts update within 300ms of selection change
- Updates happen synchronously (no race conditions)
- Charts use the same `selectedPersonas` array data
- Visual feedback (loading state) if update takes > 100ms

#### Scenario: User changes selection and both charts update together

**Given**: Both radar and matrix charts are visible on screen
**And**: Current selection is `['su-shi', 'guo-xi', 'john-ruskin']`
**When**: User changes selection to `['mama-zola', 'ai-ethics']` via dropdown
**Then**: `PersonaSelection.setSelection()` emits one `persona:selectionChanged` event
**And**: The event is received by both chart listeners within 1ms
**And**: Radar chart starts updating (200ms animation)
**And**: Matrix chart starts updating (200ms animation) simultaneously
**And**: Both charts complete animation within 220ms total
**And**: Both charts display the same 2 personas (Mama Zola, AI Ethics)
**And**: No visual glitches or partial updates

**Example Timing**:
```
t=0ms:    User clicks dropdown, selection changes
t=1ms:    PersonaSelection.setSelection() called
t=2ms:    persona:selectionChanged event emitted
t=3ms:    Radar chart listener receives event
t=3ms:    Matrix chart listener receives event
t=4ms:    Radar chart calls updateRadarChart()
t=4ms:    Matrix chart calls updateMatrixChart()
t=5ms:    Chart.js starts 200ms animations for both
t=205ms:  Both charts finish updating
```

---

### Requirement: Default Comparison Mode

The RPAIT radar chart SHALL default to "comparison mode" showing 3 personas instead of "single mode" showing 1 persona.

**Rationale**: User explicitly requested multiple personas by default. Comparison mode better demonstrates the interactive capabilities and encourages exploration.

**Acceptance Criteria**:
- `currentMode` variable defaults to `'compare'` (not `'single'`)
- `selectedPersonas` defaults to `['su-shi', 'guo-xi', 'john-ruskin']` (not `['su-shi']`)
- "对比模式" button has `active` class by default in HTML
- On page load, radar chart displays 3 personas
- Mode toggle buttons still work to switch between modes

#### Scenario: User loads page and sees 3 personas in radar chart

**Given**: User navigates to the homepage
**When**: The Data Insights section loads
**Then**: The RPAIT radar chart displays 3 datasets:
   - Su Shi (red/brown)
   - Guo Xi (blue-green)
   - John Ruskin (beige)
**And**: The "对比模式" button has the `active` class
**And**: The "单一模式" button does NOT have the `active` class
**And**: The dropdown shows all 3 personas selected
**And**: Chart legend shows all 3 persona names

**Example HTML Change**:
```html
<!-- index.html (MODIFIED) -->
<div class="viz-controls">
  <!-- CHANGED: Remove 'active' from single mode -->
  <button class="viz-btn" data-mode="single" aria-label="Single persona mode">单一模式</button>

  <!-- CHANGED: Add 'active' to compare mode -->
  <button class="viz-btn active" data-mode="compare" aria-label="Compare multiple personas">对比模式</button>
</div>
```

---

## Non-Requirements

- **Out of Scope**: Modifying similarity heatmap (shows all personas by design)
- **Out of Scope**: Modifying network graph (shows all personas and artworks)
- **Out of Scope**: Adding persona selection to individual critique panels
- **Out of Scope**: Animated transitions between personas (just fade in/out)

---

## Dependencies

**Required**:
- `window.PersonaSelection` global state manager
- Existing `rpait-radar.js` and `persona-matrix.js`
- Chart.js library (already loaded)
- `persona:selectionChanged` CustomEvent

**Optional**: None

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

---

## Performance Impact

**Expected**:
- Chart.js update: ~50-100ms per chart
- Total update time: ~200ms (both charts in parallel)
- Memory: No increase (reusing existing Chart.js instances)
- CPU: Minimal (Chart.js handles optimization)

**Monitoring**:
```javascript
// Performance logging
window.addEventListener('persona:selectionChanged', (event) => {
  console.time('chart-update');
  selectedPersonas = event.detail.personas;
  updateRadarChart();
  console.timeEnd('chart-update'); // Should be < 300ms
});
```

---

## Validation

**Manual Testing**:
- [ ] Radar chart defaults to 3 personas in compare mode
- [ ] Matrix chart defaults to 3 personas
- [ ] Changing dropdown selection updates both charts
- [ ] Both charts update within 300ms
- [ ] Both charts display same personas
- [ ] Dimension filter still works in matrix chart
- [ ] Mode toggle buttons still work in radar chart
- [ ] ARIA labels update correctly
- [ ] Charts animate smoothly (200ms)

**Automated Testing**:
```javascript
describe('Chart Integration', () => {
  it('should update radar chart on persona:selectionChanged', (done) => {
    window.addEventListener('persona:selectionChanged', () => {
      const chart = document.getElementById('rpait-radar-chart');
      // Check chart updated
      setTimeout(() => {
        expect(radarChart.data.datasets.length).toBe(2);
        done();
      }, 250); // Wait for animation
    });

    window.PersonaSelection.setSelection(['su-shi', 'guo-xi']);
  });

  it('should synchronize both charts', (done) => {
    let radarUpdated = false;
    let matrixUpdated = false;

    // Monitor both charts
    const radarObserver = new MutationObserver(() => {
      radarUpdated = true;
      checkBothUpdated();
    });

    const matrixObserver = new MutationObserver(() => {
      matrixUpdated = true;
      checkBothUpdated();
    });

    function checkBothUpdated() {
      if (radarUpdated && matrixUpdated) {
        expect(true).toBe(true);
        done();
      }
    }

    window.PersonaSelection.setSelection(['mama-zola']);
  });
});
```
