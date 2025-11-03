# Interactive Highlighting Specification

**Feature**: Click-to-Highlight Row/Column Interactions
**Component**: `js/visualizations/similarity-heatmap.js`, `styles/main.css`
**Status**: Proposed

---

## Overview

Add interactive click-to-highlight functionality that allows users to explore persona relationships by highlighting entire rows, columns, and corresponding axis labels when clicking on cells or labels.

---

## ADDED Requirements

### Requirement: Clicking a Cell SHALL Highlight Row and Column

When a user clicks a heatmap cell, the entire row and column SHALL be highlighted, along with the corresponding axis labels.

**Rationale**: Helps users explore all relationships for the two personas being compared.

#### Scenario: Clicking a cell highlights row and column

**Given** the heatmap is rendered
**When** the user clicks a cell at row 0, column 1 (Su Shi vs Guo Xi)
**Then** the clicked cell SHALL have class `heatmap-cell-active`
**And** all 6 cells in row 0 SHALL have class `heatmap-row-highlighted`
**And** all 6 cells in column 1 SHALL have class `heatmap-col-highlighted`
**And** the y-axis label for "苏轼" SHALL have class `highlighted`
**And** the x-axis label for "郭熙" SHALL have class `highlighted`

**Validation**:
```javascript
const cell = document.querySelector('.heatmap-cell[data-row="0"][data-col="1"]');
cell.click();

// Check active cell
assert(cell.classList.contains('heatmap-cell-active'), 'Clicked cell should be active');

// Check row highlighting
const rowCells = document.querySelectorAll('.heatmap-cell[data-row="0"]');
rowCells.forEach(c => {
  assert(c.classList.contains('heatmap-row-highlighted'), 'Row cells should be highlighted');
});

// Check column highlighting
const colCells = document.querySelectorAll('.heatmap-cell[data-col="1"]');
colCells.forEach(c => {
  assert(c.classList.contains('heatmap-col-highlighted'), 'Column cells should be highlighted');
});

// Check axis labels
const yLabel = document.querySelector('.heatmap-y-labels .heatmap-label[data-persona="su-shi"]');
const xLabel = document.querySelector('.heatmap-x-labels .heatmap-label[data-persona="guo-xi"]');
assert(yLabel.classList.contains('highlighted'), 'Y-axis label should be highlighted');
assert(xLabel.classList.contains('highlighted'), 'X-axis label should be highlighted');
```

#### Scenario: Clicking same cell again removes highlight

**Given** a cell is currently highlighted
**When** the user clicks the same cell again
**Then** all highlights SHALL be removed
**And** the heatmap SHALL return to default state

**Validation**:
```javascript
const cell = document.querySelector('.heatmap-cell[data-row="0"][data-col="1"]');
cell.click(); // First click - highlight
cell.click(); // Second click - remove highlight

assert(!cell.classList.contains('heatmap-cell-active'), 'Active state should be removed');
assert(document.querySelectorAll('.heatmap-row-highlighted').length === 0, 'Row highlights removed');
assert(document.querySelectorAll('.heatmap-col-highlighted').length === 0, 'Col highlights removed');
assert(document.querySelectorAll('.heatmap-label.highlighted').length === 0, 'Label highlights removed');
```

#### Scenario: Clicking different cell switches highlight

**Given** cell A is currently highlighted
**When** the user clicks cell B
**Then** cell A's highlights SHALL be removed
**And** cell B's highlights SHALL be applied
**And** only one cell SHALL be active at a time

**Validation**:
```javascript
const cellA = document.querySelector('.heatmap-cell[data-row="0"][data-col="1"]');
const cellB = document.querySelector('.heatmap-cell[data-row="2"][data-col="3"]');

cellA.click(); // Highlight A
assert(cellA.classList.contains('heatmap-cell-active'));

cellB.click(); // Switch to B
assert(!cellA.classList.contains('heatmap-cell-active'), 'Cell A should no longer be active');
assert(cellB.classList.contains('heatmap-cell-active'), 'Cell B should be active');

const activeCells = document.querySelectorAll('.heatmap-cell-active');
assert(activeCells.length === 1, 'Only one cell should be active');
```

---

### Requirement: Clicking Axis Label SHALL Highlight Entire Row or Column

When a user clicks a y-axis label, the entire row SHALL be highlighted. When clicking an x-axis label, the entire column SHALL be highlighted.

**Rationale**: Provides alternative way to explore all relationships for a specific persona.

#### Scenario: Clicking y-axis label highlights row

**Given** the heatmap is rendered with axis labels
**When** the user clicks the y-axis label for "苏轼"
**Then** all 6 cells in the corresponding row SHALL be highlighted
**And** the clicked label SHALL be highlighted
**And** no x-axis labels SHALL be highlighted (since no specific column selected)

**Validation**:
```javascript
const yLabel = document.querySelector('.heatmap-y-labels .heatmap-label[data-persona="su-shi"]');
yLabel.click();

const rowIndex = parseInt(yLabel.dataset.index);
const rowCells = document.querySelectorAll(`.heatmap-cell[data-row="${rowIndex}"]`);
assert(rowCells.length === 6, 'Should find all 6 cells in row');

rowCells.forEach(cell => {
  assert(cell.classList.contains('heatmap-row-highlighted'), 'All row cells should be highlighted');
});

assert(yLabel.classList.contains('highlighted'), 'Y-label should be highlighted');

const xLabels = document.querySelectorAll('.heatmap-x-labels .heatmap-label.highlighted');
assert(xLabels.length === 0, 'No x-axis labels should be highlighted');
```

#### Scenario: Clicking x-axis label highlights column

**Given** the heatmap is rendered with axis labels
**When** the user clicks the x-axis label for "郭熙"
**Then** all 6 cells in the corresponding column SHALL be highlighted
**And** the clicked label SHALL be highlighted

**Validation**:
```javascript
const xLabel = document.querySelector('.heatmap-x-labels .heatmap-label[data-persona="guo-xi"]');
xLabel.click();

const colIndex = parseInt(xLabel.dataset.index);
const colCells = document.querySelectorAll(`.heatmap-cell[data-col="${colIndex}"]`);
assert(colCells.length === 6, 'Should find all 6 cells in column');

colCells.forEach(cell => {
  assert(cell.classList.contains('heatmap-col-highlighted'), 'All column cells should be highlighted');
});

assert(xLabel.classList.contains('highlighted'), 'X-label should be highlighted');
```

---

### Requirement: Hover SHALL Provide Temporary Visual Feedback

Hovering over cells or labels SHALL provide immediate visual feedback without triggering full highlighting.

**Rationale**: Users need visual feedback to know elements are interactive before committing to a click.

#### Scenario: Hovering over cell shows feedback

**Given** the heatmap is rendered
**When** the user hovers over a cell
**Then** the cell SHALL show hover state (e.g., slight scale, shadow, border)
**And** the hover state SHALL be removed when cursor leaves

**Validation**:
```javascript
const cell = document.querySelector('.heatmap-cell');
const mouseEnter = new MouseEvent('mouseenter', { bubbles: true });
cell.dispatchEvent(mouseEnter);

// Allow for transition
await new Promise(resolve => setTimeout(resolve, 50));

const styles = window.getComputedStyle(cell);
// Should have transform or box-shadow
assert(styles.transform !== 'none' || styles.boxShadow !== 'none', 'Should have hover effect');

const mouseLeave = new MouseEvent('mouseleave', { bubbles: true });
cell.dispatchEvent(mouseLeave);

await new Promise(resolve => setTimeout(resolve, 300)); // Wait for transition
const stylesAfter = window.getComputedStyle(cell);
assert(stylesAfter.transform === 'none', 'Hover effect should be removed');
```

---

### Requirement: Highlighting Function SHALL Be Reusable

A `highlightPersonaPair()` function MUST be implemented that can be called from multiple contexts (cell click, label click, external trigger).

#### Scenario: Function highlights by persona IDs

**Given** the highlighting function exists
**When** calling `highlightPersonaPair('su-shi', 'guo-xi')`
**Then** the cell at (Su Shi, Guo Xi) SHALL be highlighted
**And** the entire row and column SHALL be highlighted
**And** the corresponding axis labels SHALL be highlighted

**Validation**:
```javascript
highlightPersonaPair('su-shi', 'guo-xi');

const cell = document.querySelector('.heatmap-cell[data-persona1="su-shi"][data-persona2="guo-xi"]');
assert(cell.classList.contains('heatmap-cell-active'), 'Cell should be active');

const rowCells = document.querySelectorAll('.heatmap-row-highlighted');
assert(rowCells.length === 6, 'Row should be highlighted');

const colCells = document.querySelectorAll('.heatmap-col-highlighted');
assert(colCells.length === 6, 'Column should be highlighted');
```

#### Scenario: Function handles row-only highlighting

**Given** the highlighting function exists
**When** calling `highlightPersonaPair('su-shi', null)`
**Then** only the row for Su Shi SHALL be highlighted
**And** no specific column SHALL be highlighted
**And** only the y-axis label SHALL be highlighted

**Validation**:
```javascript
highlightPersonaPair('su-shi', null);

const rowCells = document.querySelectorAll('.heatmap-row-highlighted[data-row="0"]');
assert(rowCells.length === 6, 'All row cells should be highlighted');

const colCells = document.querySelectorAll('.heatmap-col-highlighted');
assert(colCells.length === 0, 'No column cells should be highlighted');

const yLabel = document.querySelector('.heatmap-y-labels .heatmap-label[data-persona="su-shi"]');
assert(yLabel.classList.contains('highlighted'), 'Y-label should be highlighted');
```

---

### Requirement: Clear Highlighting Function SHALL Exist

A `clearHighlights()` function MUST remove all highlighting from the heatmap.

#### Scenario: Clearing all highlights

**Given** some cells and labels are highlighted
**When** calling `clearHighlights()`
**Then** all `.heatmap-cell-active` classes SHALL be removed
**And** all `.heatmap-row-highlighted` classes SHALL be removed
**And** all `.heatmap-col-highlighted` classes SHALL be removed
**And** all `.highlighted` classes SHALL be removed from labels

**Validation**:
```javascript
// Set up highlights
highlightPersonaPair('su-shi', 'guo-xi');
assert(document.querySelectorAll('.heatmap-cell-active').length > 0);

// Clear
clearHighlights();

assert(document.querySelectorAll('.heatmap-cell-active').length === 0);
assert(document.querySelectorAll('.heatmap-row-highlighted').length === 0);
assert(document.querySelectorAll('.heatmap-col-highlighted').length === 0);
assert(document.querySelectorAll('.heatmap-label.highlighted').length === 0);
```

---

## MODIFIED Requirements

### Requirement: Cell Creation SHALL Include Row/Column Data Attributes

Cells MUST have `data-row` and `data-col` attributes for highlighting logic.

**Previous**: Cells had no data attributes
**New**: Cells include `data-row`, `data-col`, `data-persona1`, `data-persona2`

#### Scenario: Cell data attributes

**Given** a heatmap cell is created for Su Shi (row 0) vs Guo Xi (col 1)
**When** inspecting the cell element
**Then** it SHALL have:
  - `data-row="0"`
  - `data-col="1"`
  - `data-persona1="su-shi"`
  - `data-persona2="guo-xi"`

**Validation**:
```javascript
const cell = document.querySelector('.heatmap-cell[data-row="0"][data-col="1"]');
assert(cell.dataset.row === '0');
assert(cell.dataset.col === '1');
assert(cell.dataset.persona1 === 'su-shi');
assert(cell.dataset.persona2 === 'guo-xi');
```

---

## Non-Functional Requirements

### Performance

- **Requirement**: Highlight operation SHALL complete in <100ms
- **Requirement**: No layout thrashing (use batch DOM updates)
- **Requirement**: Smooth transitions (CSS transitions ≤300ms)

### Visual Design

- **Requirement**: Highlighted cells SHALL have subtle visual distinction (not overwhelming)
- **Requirement**: Active cell SHALL be more prominent than row/column highlights
- **Requirement**: Highlight colors SHALL work with viridis background colors

### Accessibility

- **Requirement**: Keyboard users SHALL be able to trigger highlighting (Enter/Space on focused cell)
- **Requirement**: Screen readers SHALL announce highlighting state changes
- **Requirement**: Focus indicator SHALL be visible on all interactive elements

### User Experience

- **Requirement**: Highlighting SHALL provide clear visual feedback within 50ms
- **Requirement**: Only one cell/row/column SHALL be highlighted at a time (exclusive)
- **Requirement**: Clicking outside heatmap SHALL NOT clear highlights (intentional persistence)

---

## Implementation Notes

### JavaScript Highlighting Function

```javascript
let activeHighlight = null; // Track current highlight state

function highlightPersonaPair(persona1Id, persona2Id = null) {
  // Clear previous highlights
  clearHighlights();

  // Find indices
  const personas = window.VULCA_DATA.personas;
  const rowIndex = personas.findIndex(p => p.id === persona1Id);
  const colIndex = persona2Id ? personas.findIndex(p => p.id === persona2Id) : null;

  // Highlight row
  const rowCells = document.querySelectorAll(`.heatmap-cell[data-row="${rowIndex}"]`);
  rowCells.forEach(cell => cell.classList.add('heatmap-row-highlighted'));

  // Highlight column (if specified)
  if (colIndex !== null) {
    const colCells = document.querySelectorAll(`.heatmap-cell[data-col="${colIndex}"]`);
    colCells.forEach(cell => cell.classList.add('heatmap-col-highlighted'));

    // Highlight specific cell
    const activeCell = document.querySelector(
      `.heatmap-cell[data-row="${rowIndex}"][data-col="${colIndex}"]`
    );
    if (activeCell) {
      activeCell.classList.add('heatmap-cell-active');
    }

    // Highlight x-axis label
    const xLabel = document.querySelector(
      `.heatmap-x-labels .heatmap-label[data-persona="${persona2Id}"]`
    );
    if (xLabel) xLabel.classList.add('highlighted');
  }

  // Highlight y-axis label
  const yLabel = document.querySelector(
    `.heatmap-y-labels .heatmap-label[data-persona="${persona1Id}"]`
  );
  if (yLabel) yLabel.classList.add('highlighted');

  // Store state
  activeHighlight = { persona1Id, persona2Id };
}

function clearHighlights() {
  document.querySelectorAll('.heatmap-cell-active').forEach(el => {
    el.classList.remove('heatmap-cell-active');
  });
  document.querySelectorAll('.heatmap-row-highlighted').forEach(el => {
    el.classList.remove('heatmap-row-highlighted');
  });
  document.querySelectorAll('.heatmap-col-highlighted').forEach(el => {
    el.classList.remove('heatmap-col-highlighted');
  });
  document.querySelectorAll('.heatmap-label.highlighted').forEach(el => {
    el.classList.remove('highlighted');
  });

  activeHighlight = null;
}

function setupCellClickHandlers() {
  document.querySelectorAll('.heatmap-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      const persona1Id = cell.dataset.persona1;
      const persona2Id = cell.dataset.persona2;

      // Toggle: if already active, clear; otherwise highlight
      if (activeHighlight &&
          activeHighlight.persona1Id === persona1Id &&
          activeHighlight.persona2Id === persona2Id) {
        clearHighlights();
      } else {
        highlightPersonaPair(persona1Id, persona2Id);
      }
    });
  });
}
```

### CSS Highlighting Styles

```css
/* Hover effect */
.heatmap-cell {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.heatmap-cell:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

/* Row/column highlighting */
.heatmap-cell.heatmap-row-highlighted,
.heatmap-cell.heatmap-col-highlighted {
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.4);
  z-index: 5;
}

/* Active cell (intersection of row and column) */
.heatmap-cell.heatmap-cell-active {
  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.9);
  transform: scale(1.08);
  z-index: 20;
}

/* Label highlighting */
.heatmap-label {
  transition: font-weight 0.2s ease, color 0.2s ease;
  cursor: pointer;
}

.heatmap-label.highlighted {
  font-weight: 700;
  color: var(--color-primary, #007bff);
}

.heatmap-label:hover {
  color: var(--color-primary, #007bff);
}
```

---

## Test Cases

| Test ID | Description | Expected Result |
|---------|-------------|-----------------|
| IH-01 | Click cell highlights row | All 6 row cells highlighted |
| IH-02 | Click cell highlights column | All 6 column cells highlighted |
| IH-03 | Click cell highlights labels | Both axis labels highlighted |
| IH-04 | Click same cell toggles off | All highlights cleared |
| IH-05 | Click different cell switches | Old highlights removed, new applied |
| IH-06 | Click y-label highlights row | All row cells highlighted |
| IH-07 | Click x-label highlights column | All column cells highlighted |
| IH-08 | Hover shows feedback | Transform/shadow applied |
| IH-09 | Hover leaves | Feedback removed |
| IH-10 | `highlightPersonaPair()` works | Cell + row + column highlighted |
| IH-11 | `clearHighlights()` works | All highlights removed |
| IH-12 | Data attributes present | All cells have row/col/persona data |
| IH-13 | Only one active cell | Only one `.heatmap-cell-active` exists |
| IH-14 | Performance <100ms | Highlighting completes quickly |
| IH-15 | Keyboard Enter triggers | Focused cell highlights on Enter |

---

## Keyboard Accessibility

**Tab navigation**:
1. Tab through cells in reading order (row by row)
2. Tab through y-axis labels
3. Tab through x-axis labels

**Activation**:
- `Enter` or `Space` on focused cell → highlight
- `Enter` or `Space` on focused label → highlight row/column
- `Escape` → clear all highlights

**Implementation**:
```javascript
cell.setAttribute('tabindex', '0');
cell.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    cell.click(); // Reuse click handler
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    clearHighlights();
  }
});
```

---

## Dependencies

- `axis-labels/spec.md` - Labels must exist to be highlighted
- `color-scheme/spec.md` - Highlight styles must work with viridis colors

---

## Related Specs

- `enhanced-tooltips/spec.md` - Tooltips should work alongside highlighting
- `value-display/spec.md` - Highlighted cells maintain readable text
