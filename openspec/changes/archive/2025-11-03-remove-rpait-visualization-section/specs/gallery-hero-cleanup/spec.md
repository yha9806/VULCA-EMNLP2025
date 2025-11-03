# Specification: Gallery Hero Cleanup

**Capability**: `gallery-hero-cleanup`
**Feature**: Remove RPAIT Visualization Section
**Last Updated**: 2025-11-03

---

## Purpose

Remove the redundant RPAIT dimension analysis visualization from the gallery hero area to reduce visual clutter and eliminate duplicate information already present in critique panels and the data visualization section.

## REMOVED Requirements

### Requirement: RPAIT Visualization Section Removal

The `renderRPAITVisualization()` function and its associated DOM output SHALL be completely removed from the gallery hero rendering pipeline.

**Rationale**: The aggregated RPAIT scores displayed in the gallery hero are redundant with individual critique panel scores and comprehensive data visualizations displayed elsewhere.

**Acceptance Criteria**:
- `renderRPAITVisualization()` function removed from `js/gallery-hero.js`
- Function call removed from main `render()` pipeline
- No `.artwork-rpait-visualization` DOM element created
- No `.rpait-title` element with text "RPAIT 评论维度分析" appears
- No `.rpait-grid` container with 5 dimension bars appears in gallery hero

#### Scenario: User loads gallery on desktop

**Given**: User navigates to the main gallery page (index.html)
**When**: The gallery hero section renders for the first artwork
**Then**: No RPAIT visualization section appears between the critiques and navigation
**And**: The layout flows from critiques panel directly to page indicator
**And**: No frosted glass container with RPAIT bars is visible

**Example Code**:
```javascript
// Test: RPAIT visualization DOM not created
const viz = document.querySelector('.artwork-rpait-visualization');
assert(viz === null, 'RPAIT visualization should not exist in DOM');

// Test: Function does not exist
assert(typeof window.renderRPAITVisualization === 'undefined',
  'renderRPAITVisualization function should be removed');
```

---

#### Scenario: User navigates between artworks

**Given**: Gallery hero is displaying artwork 1
**When**: User clicks "Next" button to navigate to artwork 2
**Then**: The render pipeline executes without RPAIT visualization
**And**: No `.artwork-rpait-visualization` element is created during re-render
**And**: Critique panels update correctly with new artwork's critiques
**And**: No JavaScript errors appear in console

**Example Code**:
```javascript
// Test: Navigation does not trigger RPAIT rendering
const nextButton = document.querySelector('.nav-next');
nextButton.click();

// Wait for render
await new Promise(resolve => setTimeout(resolve, 100));

const viz = document.querySelector('.artwork-rpait-visualization');
assert(viz === null, 'RPAIT visualization should not be created on navigation');

// Verify critiques still render
const critiques = document.querySelectorAll('.critique-panel');
assert(critiques.length === 6, 'All 6 critique panels should render');
```

---

### Requirement: CSS Cleanup

All CSS styles exclusively used by the RPAIT visualization section SHALL be removed from `styles/main.css`.

**Rationale**: Remove unused CSS to reduce file size and maintain clean codebase.

**Acceptance Criteria**:
- `.artwork-rpait-visualization` styles removed
- `.rpait-title` styles removed
- `.artwork-rpait-visualization[data-reveal]` animation removed
- `.rpait-dimensions`, `.rpait-grid`, `.rpait-bar` styles preserved (used elsewhere)

#### Scenario: Developer inspects CSS file

**Given**: Developer opens `styles/main.css`
**When**: Searching for `.artwork-rpait-visualization` class
**Then**: No matches found for `.artwork-rpait-visualization {`
**And**: No matches found for `.rpait-title {`
**And**: `.rpait-dimensions` styles still exist (used by critics page)

**Example Code**:
```bash
# Test: CSS classes removed
grep -n "\.artwork-rpait-visualization" styles/main.css
# Expected: No matches (exit code 1)

grep -n "\.rpait-title" styles/main.css
# Expected: No matches (exit code 1)

# Test: Related CSS preserved
grep -n "\.rpait-dimensions" styles/main.css
# Expected: Match found (used by pages/critics.html)
```

---

### Requirement: Critique Panel RPAIT Preservation

RPAIT scores displayed in individual critique panels SHALL remain unchanged and continue to display correctly.

**Rationale**: Critique panel RPAIT scores provide granular per-persona, per-artwork information that is not redundant.

**Acceptance Criteria**:
- Each critique panel still displays "RPAIT:" section
- Each panel shows R, P, A, I, T scores (e.g., "R: 7", "P: 9")
- RPAIT scores are color-coded or styled consistently
- All 6 critique panels display their respective scores

#### Scenario: User views critique panel RPAIT scores

**Given**: Gallery hero displays artwork with 6 critiques
**When**: User scrolls to view individual critique panels
**Then**: Each critique panel displays a "RPAIT:" section at the bottom
**And**: Each section shows 5 dimensions with scores (R, P, A, I, T)
**And**: Scores match the persona's perspective for that artwork

**Example Code**:
```javascript
// Test: Critique panels preserve RPAIT display
const critiquePanels = document.querySelectorAll('.critique-panel');
assert(critiquePanels.length === 6, '6 critique panels should exist');

critiquePanels.forEach(panel => {
  const rpaitSection = panel.querySelector('.critique-rpait');
  assert(rpaitSection !== null, 'Each panel should have RPAIT section');

  const dimensions = rpaitSection.querySelectorAll('.rpait-item');
  assert(dimensions.length === 5, 'Should display 5 RPAIT dimensions');
});
```

---

### Requirement: Data Visualization Section Preservation

The data visualization section (below gallery hero) SHALL continue to function correctly with all RPAIT-related charts and heatmaps.

**Rationale**: Data visualization section provides comprehensive analytical views of RPAIT data across all personas and artworks, which is distinct from the removed aggregated gallery hero view.

**Acceptance Criteria**:
- RPAIT radar chart renders correctly
- Persona comparison matrix displays RPAIT dimensions
- All data visualization functionality unchanged
- No JavaScript errors related to RPAIT data access

#### Scenario: User scrolls to data visualization section

**Given**: User has scrolled past the gallery hero
**When**: Data visualization section comes into view
**Then**: RPAIT radar chart displays with all personas plotted
**And**: Persona matrix shows RPAIT dimension comparisons
**And**: All interactive features (hover, click) work correctly
**And**: No console errors about missing RPAIT data

**Example Code**:
```javascript
// Test: Data visualization still accesses RPAIT data
const radarChart = document.querySelector('.rpait-radar-chart');
assert(radarChart !== null, 'Radar chart should exist');

const matrixChart = document.querySelector('.persona-matrix-chart');
assert(matrixChart !== null, 'Matrix chart should exist');

// Test: RPAIT data still available
const personas = window.VULCA_DATA.personas;
personas.forEach(persona => {
  assert(persona.rpait !== undefined, 'Each persona should have RPAIT data');
  assert(Object.keys(persona.rpait).length === 5, 'RPAIT should have 5 dimensions');
});
```

---

## Non-Requirements

- **Out of Scope**: Modifying RPAIT calculation logic in `js/data.js`
- **Out of Scope**: Removing RPAIT from `pages/critics.html`
- **Out of Scope**: Changing data visualization charts/heatmaps
- **Out of Scope**: Removing RPAIT from critique panel display

---

## Dependencies

**Required Data**: None (removal only)
**Required APIs**: None
**Required Modules**: None

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

---

## Performance Impact

**Expected Improvements**:
- DOM node count: -15 to -20 nodes per artwork render
- JavaScript execution: -10 to -50ms per render cycle
- CSS file size: -200 to -300 bytes
- Memory usage: Slight reduction (removed function closure)

**Metrics**:
```javascript
// Before removal
console.time('gallery-hero-render');
render(); // ~120ms
console.timeEnd('gallery-hero-render');

// After removal
console.time('gallery-hero-render');
render(); // ~110ms (estimated)
console.timeEnd('gallery-hero-render');
```

---

## Validation

**Manual Testing**:
- [ ] Load index.html - No RPAIT viz appears
- [ ] Navigate between artworks - No RPAIT viz on any artwork
- [ ] Check critique panels - RPAIT scores still visible
- [ ] Check data viz section - All charts work correctly
- [ ] Test mobile (375px) - Layout still responsive
- [ ] Test tablet (768px) - Layout still responsive
- [ ] Check console - No JavaScript errors

**Automated Testing**:
```javascript
// Test suite: RPAIT visualization removal
describe('RPAIT Visualization Removal', () => {
  it('should not create .artwork-rpait-visualization element', () => {
    const viz = document.querySelector('.artwork-rpait-visualization');
    expect(viz).toBeNull();
  });

  it('should preserve critique panel RPAIT', () => {
    const critiques = document.querySelectorAll('.critique-panel .critique-rpait');
    expect(critiques.length).toBe(6);
  });

  it('should preserve data visualization RPAIT', () => {
    const radarChart = document.querySelector('.rpait-radar-chart');
    expect(radarChart).not.toBeNull();
  });
});
```
