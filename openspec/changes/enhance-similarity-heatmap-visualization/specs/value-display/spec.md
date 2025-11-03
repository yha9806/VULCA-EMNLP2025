# Value Display Specification

**Feature**: Optimized Similarity Value Display
**Component**: `js/visualizations/similarity-heatmap.js`, `styles/main.css`
**Status**: Proposed

---

## Overview

Improve the readability of similarity values in heatmap cells by increasing font size, reducing decimal places, and ensuring proper contrast with background colors.

---

## MODIFIED Requirements

### Requirement: Font Size SHALL Be Increased for Better Readability

Cell text font size MUST be increased from 12px to 14px on desktop and 12px on mobile.

**Previous**: 12px (all devices)
**New**: 14px (≥768px), 12px (<768px)

**Rationale**: Current 12px text is too small for comfortable reading, especially on high-DPI displays.

#### Scenario: Desktop font size

**Given** the heatmap is rendered on a desktop viewport (≥768px)
**When** inspecting a heatmap cell
**Then** the font size SHALL be 14px
**And** the text SHALL be clearly readable from normal viewing distance

**Validation**:
```javascript
const cell = document.querySelector('.heatmap-cell');
const styles = window.getComputedStyle(cell);
const fontSize = parseFloat(styles.fontSize);

assert(fontSize === 14, 'Desktop font size should be 14px');
```

#### Scenario: Mobile font size

**Given** the heatmap is rendered on a mobile viewport (<768px)
**When** inspecting a heatmap cell
**Then** the font size SHALL be 12px
**And** the text SHALL remain legible on small screens

**Validation**:
```javascript
// Set viewport to mobile
window.resizeTo(375, 667);

const cell = document.querySelector('.heatmap-cell');
const styles = window.getComputedStyle(cell);
const fontSize = parseFloat(styles.fontSize);

assert(fontSize === 12, 'Mobile font size should be 12px');
```

---

### Requirement: Decimal Places SHALL Be Reduced to One

Similarity values MUST display with 1 decimal place instead of 2.

**Previous**: `similarity.toFixed(2)` → "0.92"
**New**: `similarity.toFixed(1)` → "0.9"

**Rationale**: Two decimal places clutter small cells; one decimal provides sufficient precision.

#### Scenario: Value formatting with one decimal

**Given** a similarity value of 0.923
**When** rendering the cell text
**Then** the displayed value SHALL be "0.9"
**And** NOT "0.92" or "0.923"

**Validation**:
```javascript
const similarity = 0.923;
const displayValue = similarity.toFixed(1);

assert(displayValue === '0.9', 'Should show 1 decimal place');
assert(displayValue.length <= 3, 'Should be at most 3 characters');
```

#### Scenario: Edge case values

**Given** similarity values at extremes
**When** formatting for display
**Then** the following transformations SHALL occur:
  - 1.0 → "1.0"
  - 0.0 → "0.0"
  - 0.95 → "1.0" (rounds up)
  - 0.94 → "0.9" (rounds down)

**Validation**:
```javascript
assert((1.0).toFixed(1) === '1.0');
assert((0.0).toFixed(1) === '0.0');
assert((0.95).toFixed(1) === '1.0');
assert((0.94).toFixed(1) === '0.9');
```

---

## ADDED Requirements

### Requirement: Diagonal Cells SHALL Have Distinct Styling

Cells where persona1 === persona2 (self-similarity = 1.0) MUST be visually distinguished.

**Rationale**: Self-similarity is always 1.0 and not meaningful for comparison; visual distinction helps users focus on inter-persona relationships.

#### Scenario: Diagonal cell identification

**Given** the heatmap is rendered
**When** a cell represents the same persona on both axes
**Then** the cell SHALL have class `heatmap-cell-diagonal`
**And** SHALL have a lighter background or distinct pattern
**And** MAY have smaller or hidden text value

**Validation**:
```javascript
const diagonalCells = document.querySelectorAll('.heatmap-cell-diagonal');
assert(diagonalCells.length === 6, 'Should have 6 diagonal cells (6 personas)');

const firstDiagonal = diagonalCells[0];
assert(firstDiagonal.dataset.row === firstDiagonal.dataset.col, 'Should be on diagonal');
assert(firstDiagonal.textContent.includes('1.0'), 'Should show 1.0 value');
```

#### Scenario: Diagonal cell visual distinction

**Given** a diagonal cell is rendered
**When** comparing its appearance to non-diagonal cells
**Then** it SHALL have a visually distinct background
**And** the background SHALL be lighter or have reduced opacity
**Or** the background SHALL have a pattern (e.g., diagonal stripes)

**Validation**:
```javascript
const diagonalCell = document.querySelector('.heatmap-cell-diagonal');
const normalCell = document.querySelector('.heatmap-cell:not(.heatmap-cell-diagonal)');

const diagonalBg = window.getComputedStyle(diagonalCell).backgroundColor;
const normalBg = window.getComputedStyle(normalCell).backgroundColor;

assert(diagonalBg !== normalBg, 'Diagonal cell should have different background');

// Check if diagonal is lighter
const diagonalRgb = parseRgb(diagonalBg);
const normalRgb = parseRgb(normalBg);
const diagonalBrightness = (diagonalRgb.r + diagonalRgb.g + diagonalRgb.b) / 3;
const normalBrightness = (normalRgb.r + normalRgb.g + normalRgb.b) / 3;

assert(diagonalBrightness >= normalBrightness, 'Diagonal should be lighter or equal');
```

---

### Requirement: Font Weight SHALL Be Optimized for Viridis Colors

Cell text MUST use an appropriate font weight that ensures readability across all background colors.

**Rationale**: Different color backgrounds require different font weights for optimal legibility.

#### Scenario: Font weight on dark backgrounds

**Given** a cell with dark viridis background (purple/blue, similarity <0.5)
**When** rendering the text
**Then** the font weight SHALL be 600 (semi-bold) or higher
**And** the text color SHALL be white

**Validation**:
```javascript
const darkCell = document.querySelector('.heatmap-cell[data-similarity="0.3"]');
const styles = window.getComputedStyle(darkCell);

assert(parseInt(styles.fontWeight) >= 600, 'Dark backgrounds need bold text');
assert(styles.color === 'rgb(255, 255, 255)', 'Should use white text');
```

#### Scenario: Font weight on light backgrounds

**Given** a cell with light viridis background (yellow/white, similarity >0.8)
**When** rendering the text
**Then** the font weight SHALL be 600 (semi-bold)
**And** the text color SHALL be black or dark gray

**Validation**:
```javascript
const lightCell = document.querySelector('.heatmap-cell[data-similarity="0.9"]');
const styles = window.getComputedStyle(lightCell);

assert(parseInt(styles.fontWeight) >= 600, 'Light backgrounds need bold text');
const textRgb = parseRgb(styles.color);
const brightness = (textRgb.r + textRgb.g + textRgb.b) / 3;
assert(brightness < 100, 'Should use dark text');
```

---

### Requirement: Line Height SHALL Be Optimized for Vertical Centering

Cell line height MUST ensure text is perfectly vertically centered within square cells.

#### Scenario: Text vertical alignment

**Given** a heatmap cell with aspect-ratio 1:1
**When** the cell is rendered
**Then** the text SHALL be vertically centered
**And** the line height SHALL equal the cell height
**Or** use flexbox centering

**Validation**:
```javascript
const cell = document.querySelector('.heatmap-cell');
const styles = window.getComputedStyle(cell);

// Check flexbox centering
assert(styles.display === 'flex', 'Should use flexbox');
assert(styles.alignItems === 'center', 'Should center vertically');
assert(styles.justifyContent === 'center', 'Should center horizontally');
```

---

## REMOVED Requirements

### Requirement: Two Decimal Places SHALL Be Removed

All instances of `.toFixed(2)` for similarity values SHALL be changed to `.toFixed(1)`.

#### Scenario: Old formatting no longer exists

**Given** the updated similarity heatmap module is loaded
**When** searching for decimal formatting
**Then** no code SHALL use `.toFixed(2)` for similarity display
**And** all similarity values SHALL use `.toFixed(1)`

**Validation**:
```javascript
const cells = document.querySelectorAll('.heatmap-cell');
cells.forEach(cell => {
  const text = cell.textContent.trim();
  if (text.includes('.')) {
    const decimalPart = text.split('.')[1];
    assert(decimalPart.length === 1, 'Should have only 1 decimal place');
  }
});
```

---

## Non-Functional Requirements

### Readability

- **Requirement**: Text SHALL be readable at arm's length (60cm) on all device sizes
- **Requirement**: Font SHALL use a clear, legible typeface (sans-serif recommended)
- **Requirement**: Text SHALL have anti-aliasing enabled for smooth rendering

### Accessibility

- **Requirement**: Text SHALL meet WCAG AA contrast ratio (≥4.5:1) on all backgrounds
- **Requirement**: Font size SHALL be sufficient for users with mild vision impairment
- **Requirement**: Text SHALL be selectable for copy/paste

### Performance

- **Requirement**: Text rendering SHALL not cause layout shift
- **Requirement**: Font changes SHALL not trigger unnecessary reflows

### Responsiveness

- **Requirement**: Font size SHALL scale appropriately at all breakpoints:
  - <768px: 12px
  - ≥768px: 14px
- **Requirement**: Text SHALL not overflow cell boundaries at any viewport size

---

## Implementation Notes

### CSS Styling

```css
.heatmap-cell {
  display: flex;
  align-items: center;
  justify-content: center;

  /* Desktop font size */
  font-size: 14px;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* Ensure crisp text rendering */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Mobile font size */
@media (max-width: 767px) {
  .heatmap-cell {
    font-size: 12px;
  }
}

/* Diagonal cell styling */
.heatmap-cell-diagonal {
  background-color: rgba(255, 255, 255, 0.3) !important;
  opacity: 0.6;
}

/* Dynamic text color (set via JavaScript) */
.heatmap-cell[data-text-color="light"] {
  color: #ffffff;
}

.heatmap-cell[data-text-color="dark"] {
  color: #000000;
}
```

### JavaScript Rendering

```javascript
function createHeatmapCell(persona1, persona2, similarity) {
  const cell = document.createElement('div');
  cell.className = 'heatmap-cell';

  // Mark diagonal cells
  if (persona1.id === persona2.id) {
    cell.classList.add('heatmap-cell-diagonal');
  }

  // Format value with 1 decimal place
  cell.textContent = similarity.toFixed(1);

  // Set background color
  const bgColor = getViridisColor(similarity);
  cell.style.backgroundColor = bgColor;

  // Set text color based on background luminance
  const textColor = getTextColorForBackground(bgColor);
  cell.style.color = textColor;
  cell.dataset.textColor = textColor === '#ffffff' ? 'light' : 'dark';

  return cell;
}
```

---

## Test Cases

| Test ID | Description | Expected Result |
|---------|-------------|-----------------|
| VD-01 | Desktop font size | 14px on viewports ≥768px |
| VD-02 | Mobile font size | 12px on viewports <768px |
| VD-03 | One decimal place | Values show as "0.9" not "0.92" |
| VD-04 | Diagonal cell class | 6 cells have `.heatmap-cell-diagonal` |
| VD-05 | Diagonal cell styling | Lighter background than normal cells |
| VD-06 | Font weight | 600 (semi-bold) on all backgrounds |
| VD-07 | Text centering | Vertically and horizontally centered |
| VD-08 | Dark bg text | White text on purple/blue backgrounds |
| VD-09 | Light bg text | Black text on yellow/white backgrounds |
| VD-10 | WCAG AA contrast | All cells meet ≥4.5:1 ratio |
| VD-11 | Edge case 1.0 | Displays as "1.0" with 1 decimal |
| VD-12 | Edge case 0.0 | Displays as "0.0" with 1 decimal |
| VD-13 | Rounding 0.95 | Rounds to "1.0" |
| VD-14 | Rounding 0.94 | Rounds to "0.9" |
| VD-15 | No overflow | Text never overflows cell boundaries |

---

## Visual Comparison

### Before (Current)
```
Cell: 12px font, "0.92", rgba(0,0,0,0.8) text
Background: hsl(120, 70%, 75%) - subtle green
```

### After (Enhanced)
```
Cell: 14px font, "0.9", dynamic text color (white or black)
Background: #fde724 (viridis yellow) - high contrast
```

---

## Dependencies

- `color-scheme/spec.md` - Viridis colors determine text color selection
- `styles/main.css` - Responsive font size breakpoints

---

## Related Specs

- `color-scheme/spec.md` - Background colors that text must contrast with
- `interactive-highlighting/spec.md` - Highlighted cells maintain readable text
- `legend-improvement/spec.md` - Legend font size should match cell font size
