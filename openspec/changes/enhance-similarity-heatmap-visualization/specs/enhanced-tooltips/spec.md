# Enhanced Tooltips Specification

**Feature**: Rich Tooltips with RPAIT Dimension Details
**Component**: `js/visualizations/similarity-heatmap.js`, `styles/main.css`
**Status**: Proposed

---

## Overview

Enhance the basic hover tooltips to provide detailed RPAIT dimension comparisons, showing not just the overall similarity but also the specific differences in each dimension (R, P, A, I, T).

---

## MODIFIED Requirements

### Requirement: Tooltip Content SHALL Include RPAIT Dimension Differences

Tooltips MUST show detailed RPAIT dimension differences in addition to overall similarity.

**Previous**: Simple tooltip showing "Persona A ↔ Persona B: 0.92 (Very High similarity)"
**New**: Rich tooltip with similarity, label, and per-dimension differences

**Rationale**: Users want to understand WHY two personas are similar or different, not just the aggregate score.

#### Scenario: Tooltip displays persona names and similarity

**Given** the user hovers over a cell comparing Su Shi (RPAIT: R7, P9, A8, I8, T7) and Guo Xi (RPAIT: R8, P8, A9, I7, T6)
**When** the tooltip appears
**Then** it SHALL display:
  - Both persona names (Chinese and English)
  - Overall similarity score with 1 decimal place
  - Similarity label (e.g., "高相似度" / "High Similarity")

**Validation**:
```javascript
const cell = document.querySelector('.heatmap-cell[data-persona1="su-shi"][data-persona2="guo-xi"]');
const mouseEnter = new MouseEvent('mouseenter', { bubbles: true });
cell.dispatchEvent(mouseEnter);

const tooltip = document.querySelector('.heatmap-tooltip');
assert(tooltip !== null, 'Tooltip should exist');
assert(tooltip.textContent.includes('苏轼'), 'Should show Su Shi Chinese name');
assert(tooltip.textContent.includes('Su Shi'), 'Should show Su Shi English name');
assert(tooltip.textContent.includes('郭熙'), 'Should show Guo Xi Chinese name');
assert(tooltip.textContent.includes('Guo Xi'), 'Should show Guo Xi English name');
assert(tooltip.textContent.includes('相似度'), 'Should show similarity label');
```

#### Scenario: Tooltip displays RPAIT dimension differences

**Given** the user hovers over a cell comparing two personas
**When** the tooltip appears
**Then** it SHALL display differences for all 5 RPAIT dimensions:
  - R (写实性 / Realism)
  - P (诗意性 / Poetic)
  - A (抽象性 / Abstract)
  - I (创新性 / Innovation)
  - T (传统性 / Tradition)
**And** each difference SHALL be formatted as: "维度名称: ±差值"

**Validation**:
```javascript
// Su Shi: R7, P9, A8, I8, T7
// Guo Xi: R8, P8, A9, I7, T6
const cell = document.querySelector('.heatmap-cell[data-persona1="su-shi"][data-persona2="guo-xi"]');
const tooltip = generateTooltip(cell);

assert(tooltip.includes('写实性 (R): ±1'), 'Should show R difference');
assert(tooltip.includes('诗意性 (P): ±1'), 'Should show P difference');
assert(tooltip.includes('抽象性 (A): ±1'), 'Should show A difference');
assert(tooltip.includes('创新性 (I): ±1'), 'Should show I difference');
assert(tooltip.includes('传统性 (T): ±1'), 'Should show T difference');
```

---

### Requirement: Tooltip Positioning SHALL Be Dynamic

Tooltips MUST position themselves intelligently to avoid clipping at viewport edges.

**Rationale**: Tooltips on edge cells may extend beyond viewport if always positioned the same way.

#### Scenario: Tooltip positions above cell by default

**Given** a cell is in the middle of the heatmap
**When** the user hovers over the cell
**Then** the tooltip SHALL appear above the cell
**And** SHALL be horizontally centered on the cell

**Validation**:
```javascript
const cell = document.querySelector('.heatmap-cell[data-row="2"][data-col="2"]'); // Middle cell
cell.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

const tooltip = document.querySelector('.heatmap-tooltip');
const cellRect = cell.getBoundingClientRect();
const tooltipRect = tooltip.getBoundingClientRect();

assert(tooltipRect.bottom <= cellRect.top, 'Tooltip should be above cell');

const cellCenterX = cellRect.left + cellRect.width / 2;
const tooltipCenterX = tooltipRect.left + tooltipRect.width / 2;
assert(Math.abs(cellCenterX - tooltipCenterX) < 10, 'Tooltip should be centered horizontally');
```

#### Scenario: Tooltip repositions when near top edge

**Given** a cell is in the top row of the heatmap
**When** the user hovers over the cell
**Then** the tooltip SHALL appear below the cell (not above)
**And** SHALL not extend beyond the viewport top

**Validation**:
```javascript
const cell = document.querySelector('.heatmap-cell[data-row="0"][data-col="2"]'); // Top row
cell.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

const tooltip = document.querySelector('.heatmap-tooltip');
const cellRect = cell.getBoundingClientRect();
const tooltipRect = tooltip.getBoundingClientRect();

assert(tooltipRect.top >= cellRect.bottom, 'Tooltip should be below cell when near top');
```

#### Scenario: Tooltip repositions when near left/right edge

**Given** a cell is in the leftmost or rightmost column
**When** the user hovers over the cell
**Then** the tooltip SHALL adjust horizontal position to stay within viewport
**And** SHALL not extend beyond viewport edges

**Validation**:
```javascript
const cell = document.querySelector('.heatmap-cell[data-row="2"][data-col="0"]'); // Leftmost
cell.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

const tooltip = document.querySelector('.heatmap-tooltip');
const tooltipRect = tooltip.getBoundingClientRect();

assert(tooltipRect.left >= 0, 'Tooltip should not extend beyond left edge');
assert(tooltipRect.right <= window.innerWidth, 'Tooltip should not extend beyond right edge');
```

---

## ADDED Requirements

### Requirement: Tooltip Shall Use HTML Structure for Rich Content

Tooltips SHALL use an HTML element (not native `title` attribute) to support rich formatting.

**Rationale**: Native `title` tooltips cannot support multi-line content, colors, or structured layout.

#### Scenario: Tooltip HTML structure

**Given** a tooltip is generated
**When** inspecting its structure
**Then** it SHALL be a `<div class="heatmap-tooltip">` element
**And** SHALL contain:
  - Header with persona names
  - Similarity score section
  - RPAIT differences list

**Validation**:
```javascript
const tooltip = document.querySelector('.heatmap-tooltip');
assert(tooltip.tagName === 'DIV', 'Should be a div element');
assert(tooltip.classList.contains('heatmap-tooltip'), 'Should have tooltip class');

const header = tooltip.querySelector('.tooltip-header');
assert(header !== null, 'Should have header section');

const similarity = tooltip.querySelector('.tooltip-similarity');
assert(similarity !== null, 'Should have similarity section');

const rpaitList = tooltip.querySelector('.tooltip-rpait-list');
assert(rpaitList !== null, 'Should have RPAIT list section');
```

---

### Requirement: Tooltip Generation Function SHALL Calculate RPAIT Differences

A `generateTooltipContent()` function MUST calculate per-dimension differences from RPAIT vectors.

#### Scenario: Calculating RPAIT differences

**Given** two personas with known RPAIT scores
**When** generating tooltip content
**Then** the function SHALL:
  1. Retrieve both personas' average RPAIT scores
  2. Calculate absolute difference for each dimension
  3. Format differences as "±N" where N is the absolute difference

**Validation**:
```javascript
function generateTooltipContent(persona1, persona2, similarity) {
  const rpait1 = persona1.rpait;
  const rpait2 = persona2.rpait;

  const diff = {
    R: Math.abs(rpait1.R - rpait2.R),
    P: Math.abs(rpait1.P - rpait2.P),
    A: Math.abs(rpait1.A - rpait2.A),
    I: Math.abs(rpait1.I - rpait2.I),
    T: Math.abs(rpait1.T - rpait2.T)
  };

  return { diff, similarity };
}

// Test with known values
const suShi = { rpait: { R: 7, P: 9, A: 8, I: 8, T: 7 } };
const guoXi = { rpait: { R: 8, P: 8, A: 9, I: 7, T: 6 } };
const result = generateTooltipContent(suShi, guoXi, 0.92);

assert(result.diff.R === 1, 'R difference should be 1');
assert(result.diff.P === 1, 'P difference should be 1');
assert(result.diff.A === 1, 'A difference should be 1');
assert(result.diff.I === 1, 'I difference should be 1');
assert(result.diff.T === 1, 'T difference should be 1');
```

---

### Requirement: Tooltip SHALL Display Bilingual Labels

Dimension labels SHALL be displayed in both Chinese and English.

#### Scenario: Bilingual dimension labels

**Given** a tooltip is displayed
**When** viewing the RPAIT differences section
**Then** each dimension SHALL show:
  - Chinese label (e.g., "写实性")
  - English abbreviation in parentheses (e.g., "(R)")

**Validation**:
```javascript
const tooltip = document.querySelector('.heatmap-tooltip');
assert(tooltip.textContent.includes('写实性 (R)'), 'Should show Realism in both languages');
assert(tooltip.textContent.includes('诗意性 (P)'), 'Should show Poetic in both languages');
assert(tooltip.textContent.includes('抽象性 (A)'), 'Should show Abstract in both languages');
assert(tooltip.textContent.includes('创新性 (I)'), 'Should show Innovation in both languages');
assert(tooltip.textContent.includes('传统性 (T)'), 'Should show Tradition in both languages');
```

---

### Requirement: Tooltip SHALL Show Similarity Label

The tooltip MUST display a qualitative similarity label corresponding to the numeric value.

**Rationale**: Labels like "Very High" or "Medium" help users quickly understand significance.

#### Scenario: Similarity label mapping

**Given** various similarity values
**When** generating tooltip content
**Then** the following labels SHALL be used:
  - 0.9-1.0: "极高相似度" / "Very High Similarity"
  - 0.7-0.89: "高相似度" / "High Similarity"
  - 0.5-0.69: "中等相似度" / "Medium Similarity"
  - 0.3-0.49: "低相似度" / "Low Similarity"
  - 0.0-0.29: "极低相似度" / "Very Low Similarity"

**Validation**:
```javascript
function getSimilarityLabel(similarity) {
  if (similarity >= 0.9) return '极高相似度';
  if (similarity >= 0.7) return '高相似度';
  if (similarity >= 0.5) return '中等相似度';
  if (similarity >= 0.3) return '低相似度';
  return '极低相似度';
}

assert(getSimilarityLabel(0.95) === '极高相似度');
assert(getSimilarityLabel(0.75) === '高相似度');
assert(getSimilarityLabel(0.60) === '中等相似度');
assert(getSimilarityLabel(0.40) === '低相似度');
assert(getSimilarityLabel(0.20) === '极低相似度');
```

---

### Requirement: Tooltip SHALL Hide on Mouse Leave

The tooltip MUST disappear when the user moves the cursor away from the cell.

#### Scenario: Tooltip hides on mouse leave

**Given** a tooltip is currently displayed
**When** the user moves the cursor away from the cell
**Then** the tooltip SHALL be hidden within 100ms
**And** SHALL not interfere with other elements

**Validation**:
```javascript
const cell = document.querySelector('.heatmap-cell');
cell.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

let tooltip = document.querySelector('.heatmap-tooltip');
assert(tooltip !== null, 'Tooltip should be visible');

cell.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));

await new Promise(resolve => setTimeout(resolve, 150));
tooltip = document.querySelector('.heatmap-tooltip');
assert(tooltip === null || tooltip.style.display === 'none', 'Tooltip should be hidden');
```

---

## REMOVED Requirements

### Requirement: Native `title` Attribute Tooltips Shall Be Removed

Cells SHALL NOT use native `title` attributes for tooltips.

#### Scenario: No title attributes on cells

**Given** the heatmap is rendered
**When** inspecting cell elements
**Then** no cell SHALL have a `title` attribute
**And** all tooltips SHALL use the custom HTML tooltip system

**Validation**:
```javascript
const cells = document.querySelectorAll('.heatmap-cell');
cells.forEach(cell => {
  assert(!cell.hasAttribute('title'), 'Cells should not use native title tooltips');
});
```

---

## Non-Functional Requirements

### Performance

- **Requirement**: Tooltip generation SHALL complete in <10ms
- **Requirement**: Tooltip positioning SHALL complete in <20ms
- **Requirement**: Tooltip appearance SHALL not cause layout reflow

### Visual Design

- **Requirement**: Tooltip SHALL have semi-transparent dark background for contrast
- **Requirement**: Tooltip SHALL have white or light text for readability
- **Requirement**: Tooltip SHALL have subtle shadow for depth
- **Requirement**: Tooltip SHALL have rounded corners (4-8px border-radius)

### Accessibility

- **Requirement**: Tooltip content SHALL be available to screen readers via ARIA
- **Requirement**: Tooltip SHALL have `role="tooltip"`
- **Requirement**: Cell SHALL have `aria-describedby` pointing to tooltip

### Responsiveness

- **Requirement**: Tooltip font size SHALL be readable on all devices (≥12px)
- **Requirement**: Tooltip SHALL not overflow viewport on mobile devices
- **Requirement**: Tooltip SHALL reposition intelligently on mobile

---

## Implementation Notes

### Tooltip HTML Structure

```html
<div class="heatmap-tooltip" role="tooltip" id="tooltip-su-shi-guo-xi">
  <div class="tooltip-header">
    <strong>苏轼 (Su Shi) ↔ 郭熙 (Guo Xi)</strong>
  </div>
  <div class="tooltip-similarity">
    <span class="similarity-value">相似度: 0.9 / 1.0</span>
    <span class="similarity-label">极高相似度</span>
  </div>
  <div class="tooltip-rpait">
    <div class="rpait-label">RPAIT 维度差异:</div>
    <ul class="tooltip-rpait-list">
      <li>写实性 (R): ±1</li>
      <li>诗意性 (P): ±1</li>
      <li>抽象性 (A): ±1</li>
      <li>创新性 (I): ±1</li>
      <li>传统性 (T): ±1</li>
    </ul>
  </div>
</div>
```

### Tooltip Generation Function

```javascript
function generateTooltipContent(persona1, persona2, similarity) {
  // Calculate RPAIT differences
  const rpait1 = persona1.rpait;
  const rpait2 = persona2.rpait;

  const diff = {
    R: Math.abs(rpait1.R - rpait2.R),
    P: Math.abs(rpait1.P - rpait2.P),
    A: Math.abs(rpait1.A - rpait2.A),
    I: Math.abs(rpait1.I - rpait2.I),
    T: Math.abs(rpait1.T - rpait2.T)
  };

  // Get similarity label
  const label = getSimilarityLabel(similarity);

  // Build HTML
  return `
    <div class="tooltip-header">
      <strong>${persona1.nameZh} (${persona1.nameEn}) ↔ ${persona2.nameZh} (${persona2.nameEn})</strong>
    </div>
    <div class="tooltip-similarity">
      <span class="similarity-value">相似度: ${similarity.toFixed(1)} / 1.0</span>
      <span class="similarity-label">${label}</span>
    </div>
    <div class="tooltip-rpait">
      <div class="rpait-label">RPAIT 维度差异:</div>
      <ul class="tooltip-rpait-list">
        <li>写实性 (R): ±${diff.R}</li>
        <li>诗意性 (P): ±${diff.P}</li>
        <li>抽象性 (A): ±${diff.A}</li>
        <li>创新性 (I): ±${diff.I}</li>
        <li>传统性 (T): ±${diff.T}</li>
      </ul>
    </div>
  `;
}

function getSimilarityLabel(similarity) {
  if (similarity >= 0.9) return '极高相似度';
  if (similarity >= 0.7) return '高相似度';
  if (similarity >= 0.5) return '中等相似度';
  if (similarity >= 0.3) return '低相似度';
  return '极低相似度';
}
```

### Tooltip Positioning Logic

```javascript
function positionTooltip(cell, tooltip) {
  const cellRect = cell.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();

  let top, left;

  // Default: position above cell
  top = cellRect.top - tooltipRect.height - 8;

  // If too close to top, position below
  if (top < 0) {
    top = cellRect.bottom + 8;
  }

  // Center horizontally on cell
  left = cellRect.left + (cellRect.width / 2) - (tooltipRect.width / 2);

  // Ensure within viewport horizontally
  if (left < 0) {
    left = 8;
  } else if (left + tooltipRect.width > window.innerWidth) {
    left = window.innerWidth - tooltipRect.width - 8;
  }

  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;
}
```

### CSS Styling

```css
.heatmap-tooltip {
  position: fixed;
  background: rgba(0, 0, 0, 0.9);
  color: #ffffff;
  padding: 12px 16px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  font-size: 13px;
  line-height: 1.5;
  z-index: 1000;
  pointer-events: none; /* Don't interfere with mouse events */
  max-width: 300px;
}

.tooltip-header {
  margin-bottom: 8px;
  font-size: 14px;
}

.tooltip-similarity {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.similarity-value {
  font-weight: 600;
}

.similarity-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.rpait-label {
  font-weight: 600;
  margin-bottom: 4px;
}

.tooltip-rpait-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tooltip-rpait-list li {
  padding: 2px 0;
  font-family: 'Courier New', monospace;
}
```

---

## Test Cases

| Test ID | Description | Expected Result |
|---------|-------------|-----------------|
| ET-01 | Tooltip shows persona names | Both Chinese and English names displayed |
| ET-02 | Tooltip shows similarity | Value with 1 decimal place + label |
| ET-03 | Tooltip shows RPAIT diffs | All 5 dimensions with ±differences |
| ET-04 | Tooltip positions above | Default position is above cell |
| ET-05 | Tooltip repositions near top | Positions below when near top edge |
| ET-06 | Tooltip repositions near left | Shifts right when near left edge |
| ET-07 | Tooltip repositions near right | Shifts left when near right edge |
| ET-08 | Tooltip hides on mouse leave | Disappears within 100ms |
| ET-09 | Tooltip HTML structure | Div element with correct classes |
| ET-10 | RPAIT difference calculation | Correctly calculates absolute differences |
| ET-11 | Bilingual dimension labels | Chinese + English for all dimensions |
| ET-12 | Similarity label mapping | Correct label for each range |
| ET-13 | No title attributes | Native tooltips removed |
| ET-14 | ARIA attributes | role="tooltip" and aria-describedby |
| ET-15 | Mobile responsive | Readable and within viewport on mobile |

---

## Dependencies

- `js/analysis.js` - Access to persona RPAIT scores via `getPersonaAverageRPAIT()`
- `axis-labels/spec.md` - Persona objects with `nameZh` and `nameEn`

---

## Related Specs

- `interactive-highlighting/spec.md` - Tooltips should work alongside highlighting
- `color-scheme/spec.md` - Tooltip background should contrast with viridis colors
- `value-display/spec.md` - Consistent decimal formatting (1 decimal place)
