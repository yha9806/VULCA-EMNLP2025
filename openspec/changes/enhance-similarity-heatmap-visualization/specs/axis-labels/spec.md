# Axis Labels Specification

**Feature**: Persona Name Axis Labels
**Component**: `js/visualizations/similarity-heatmap.js`, `styles/main.css`
**Status**: Proposed

---

## Overview

Add persona name labels to the left (y-axis) and top (x-axis) of the similarity heatmap to provide context for which personas are being compared in each cell.

---

## ADDED Requirements

### Requirement: Left Y-Axis SHALL Display All Persona Names

The heatmap SHALL render a vertical list of persona names on the left side, aligned with each row of the matrix.

**Rationale**: Users need to identify which persona each row represents without guessing from position.

#### Scenario: Rendering left axis labels on desktop

**Given** the similarity heatmap is initialized with 6 personas
**And** the viewport width is ≥768px
**When** the heatmap renders
**Then** a container with class `heatmap-y-labels` SHALL be created
**And** the container SHALL contain 6 label elements
**And** each label SHALL display the persona's Chinese name with English name in parentheses
**And** the labels SHALL be ordered to match the matrix rows (top to bottom)

**Validation**:
```javascript
const yLabels = document.querySelectorAll('.heatmap-y-labels .heatmap-label');
assert(yLabels.length === 6, 'Should have 6 y-axis labels');
assert(yLabels[0].textContent.includes('苏轼'), 'First label should be Su Shi');
assert(yLabels[0].textContent.includes('Su Shi'), 'Should include English name');
```

#### Scenario: Rendering left axis labels on mobile

**Given** the similarity heatmap is initialized with 6 personas
**And** the viewport width is <768px
**When** the heatmap renders
**Then** the left axis labels SHALL display only Chinese names (no English)
**Or** use abbreviated names to fit within mobile layout constraints

**Validation**:
```javascript
const yLabels = document.querySelectorAll('.heatmap-y-labels .heatmap-label');
const firstLabel = yLabels[0].textContent;
assert(firstLabel.length <= 10, 'Mobile labels should be abbreviated');
```

---

### Requirement: Top X-Axis SHALL Display All Persona Names

The heatmap SHALL render a horizontal list of persona names on the top, aligned with each column of the matrix.

**Rationale**: Users need to identify which persona each column represents.

#### Scenario: Rendering top axis labels with rotation

**Given** the similarity heatmap is initialized with 6 personas
**And** the viewport width is ≥768px
**When** the heatmap renders
**Then** a container with class `heatmap-x-labels` SHALL be created
**And** the container SHALL contain 6 label elements
**And** each label SHALL display the persona's Chinese name
**And** the labels SHALL be rotated 45 degrees clockwise for space efficiency
**And** the labels SHALL be ordered to match the matrix columns (left to right)

**Validation**:
```javascript
const xLabels = document.querySelectorAll('.heatmap-x-labels .heatmap-label');
assert(xLabels.length === 6, 'Should have 6 x-axis labels');

const firstLabelStyle = window.getComputedStyle(xLabels[0]);
const transform = firstLabelStyle.transform;
// Check rotation matrix values indicate 45deg rotation
assert(transform !== 'none', 'Labels should be rotated');
```

---

### Requirement: Axis Labels SHALL Align with Matrix Cells

The axis labels MUST be precisely aligned with their corresponding rows and columns.

**Rationale**: Misalignment would cause users to associate labels with wrong cells.

#### Scenario: Verifying label alignment on desktop

**Given** the heatmap is rendered with axis labels
**And** the viewport width is ≥768px
**When** the user views the heatmap
**Then** each y-axis label SHALL be vertically centered with its corresponding row
**And** each x-axis label SHALL be horizontally centered with its corresponding column
**And** the alignment SHALL remain correct when the browser is resized

**Validation**:
```javascript
const yLabels = document.querySelectorAll('.heatmap-y-labels .heatmap-label');
const firstRowCells = document.querySelectorAll('.heatmap-cell[data-row="0"]');

const labelRect = yLabels[0].getBoundingClientRect();
const cellRect = firstRowCells[0].getBoundingClientRect();

const labelCenter = labelRect.top + labelRect.height / 2;
const cellCenter = cellRect.top + cellRect.height / 2;

assert(Math.abs(labelCenter - cellCenter) < 2, 'Label should align with cell center');
```

---

### Requirement: Axis Labels SHALL Be Clickable

Clicking an axis label MUST highlight the entire corresponding row or column.

**Rationale**: Provides interactive way to explore all relationships for a specific persona.

#### Scenario: Clicking y-axis label highlights row

**Given** the heatmap is rendered with axis labels
**When** the user clicks a y-axis label for "苏轼"
**Then** all cells in the corresponding row SHALL be highlighted
**And** the clicked label SHALL be highlighted
**And** the corresponding x-axis label SHALL also be highlighted

**Validation**:
```javascript
const suShiLabel = document.querySelector('.heatmap-y-labels .heatmap-label[data-persona="su-shi"]');
suShiLabel.click();

const highlightedCells = document.querySelectorAll('.heatmap-cell.heatmap-row-highlighted[data-row="0"]');
assert(highlightedCells.length === 6, 'All 6 cells in row should be highlighted');

const highlightedLabel = document.querySelector('.heatmap-y-labels .heatmap-label.highlighted');
assert(highlightedLabel.textContent.includes('苏轼'), 'Y-axis label should be highlighted');
```

#### Scenario: Clicking x-axis label highlights column

**Given** the heatmap is rendered with axis labels
**When** the user clicks an x-axis label for "郭熙"
**Then** all cells in the corresponding column SHALL be highlighted
**And** the clicked label SHALL be highlighted
**And** the corresponding y-axis label SHALL also be highlighted

**Validation**:
```javascript
const guoXiLabel = document.querySelector('.heatmap-x-labels .heatmap-label[data-persona="guo-xi"]');
guoXiLabel.click();

const highlightedCells = document.querySelectorAll('.heatmap-cell.heatmap-col-highlighted[data-col="1"]');
assert(highlightedCells.length === 6, 'All 6 cells in column should be highlighted');
```

---

### Requirement: Layout SHALL Use CSS Grid with Template Areas

The heatmap container MUST use CSS Grid with explicit template areas for proper layout.

**Rationale**: CSS Grid provides precise control over axis label positioning and responsive behavior.

#### Scenario: Grid layout structure

**Given** the heatmap is rendered
**When** inspecting the container's CSS
**Then** the container SHALL use `display: grid`
**And** SHALL define `grid-template-areas` with:
  - Empty cell (top-left corner)
  - x-labels (top-right)
  - y-labels (bottom-left)
  - matrix (bottom-right)
**And** SHALL define appropriate `grid-template-columns` and `grid-template-rows`

**Validation**:
```javascript
const container = document.querySelector('.heatmap-container');
const styles = window.getComputedStyle(container);

assert(styles.display === 'grid', 'Container should use CSS Grid');

// Check that areas are assigned correctly
const yLabelsContainer = document.querySelector('.heatmap-y-labels');
const yLabelsStyle = window.getComputedStyle(yLabelsContainer);
assert(yLabelsStyle.gridArea === 'y-labels', 'Y-labels should be in correct grid area');
```

---

## MODIFIED Requirements

### Requirement: Heatmap Container Structure MUST Be Updated

The existing `#similarity-heatmap` container structure SHALL be modified to support axis labels.

**Previous**: Single container with 36 cells (6×6 grid)
**New**: Wrapper container with 4 child areas (corner, x-labels, y-labels, matrix)

#### Scenario: Updated HTML structure

**Given** the heatmap initialization function is called
**When** the heatmap renders
**Then** the structure SHALL be:
```html
<div class="heatmap-container">
  <div class="heatmap-corner"></div>
  <div class="heatmap-x-labels">
    <div class="heatmap-label" data-persona="su-shi">苏轼</div>
    <!-- ... 5 more labels -->
  </div>
  <div class="heatmap-y-labels">
    <div class="heatmap-label" data-persona="su-shi">苏轼 (Su Shi)</div>
    <!-- ... 5 more labels -->
  </div>
  <div id="similarity-heatmap" class="heatmap-matrix">
    <!-- 36 cells -->
  </div>
</div>
```

**Validation**:
```javascript
const container = document.querySelector('.heatmap-container');
assert(container !== null, 'Container should exist');

const corner = container.querySelector('.heatmap-corner');
const xLabels = container.querySelector('.heatmap-x-labels');
const yLabels = container.querySelector('.heatmap-y-labels');
const matrix = container.querySelector('.heatmap-matrix');

assert(corner !== null, 'Corner area should exist');
assert(xLabels !== null, 'X-labels area should exist');
assert(yLabels !== null, 'Y-labels area should exist');
assert(matrix !== null, 'Matrix area should exist');
```

---

## Non-Functional Requirements

### Performance

- **Requirement**: Axis labels SHALL render in <50ms
- **Requirement**: Label highlighting SHALL respond to clicks in <100ms

### Accessibility

- **Requirement**: Axis labels SHALL have `role="rowheader"` (y-axis) and `role="columnheader"` (x-axis)
- **Requirement**: Labels SHALL be keyboard navigable (Tab key)
- **Requirement**: Screen readers SHALL announce label text when focused

### Responsive Design

- **Requirement**: Labels SHALL adjust font size and rotation based on viewport width
- **Requirement**: On mobile (<768px), labels MAY be abbreviated or rotated vertically
- **Requirement**: Layout SHALL NOT cause horizontal scrolling on any device

---

## Implementation Notes

### CSS Grid Template

```css
.heatmap-container {
  display: grid;
  grid-template-areas:
    "corner x-labels"
    "y-labels matrix";
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  gap: 8px;
}

.heatmap-corner { grid-area: corner; }
.heatmap-x-labels { grid-area: x-labels; }
.heatmap-y-labels { grid-area: y-labels; }
.heatmap-matrix { grid-area: matrix; }
```

### JavaScript Rendering

```javascript
function renderAxisLabels(personas) {
  // Y-axis labels
  const yLabelsContainer = document.querySelector('.heatmap-y-labels');
  personas.forEach((persona, index) => {
    const label = document.createElement('div');
    label.className = 'heatmap-label';
    label.dataset.persona = persona.id;
    label.dataset.index = index;
    label.textContent = `${persona.nameZh} (${persona.nameEn})`;
    label.setAttribute('role', 'rowheader');
    yLabelsContainer.appendChild(label);
  });

  // X-axis labels (similar)
  // ...
}
```

---

## Test Cases

| Test ID | Description | Expected Result |
|---------|-------------|-----------------|
| AL-01 | Render 6 y-axis labels | All 6 personas displayed vertically |
| AL-02 | Render 6 x-axis labels | All 6 personas displayed horizontally at 45° |
| AL-03 | Y-axis alignment | Labels vertically centered with rows |
| AL-04 | X-axis alignment | Labels horizontally centered with columns |
| AL-05 | Click y-axis label | Highlights entire row + label |
| AL-06 | Click x-axis label | Highlights entire column + label |
| AL-07 | Mobile layout | Labels abbreviated or adjusted for small screens |
| AL-08 | Resize browser | Labels remain aligned after resize |
| AL-09 | Accessibility | Labels have proper ARIA roles |
| AL-10 | Keyboard navigation | Can Tab through labels |

---

## Dependencies

- `window.VULCA_DATA.personas` - Array of 6 persona objects with `id`, `nameZh`, `nameEn`
- CSS Grid support (all modern browsers)

---

## Related Specs

- `color-scheme/spec.md` - Viridis colors for cells
- `interactive-highlighting/spec.md` - Click-to-highlight behavior for cells and labels
