# Enhance Similarity Heatmap Visualization - Design Document

**Change ID**: `enhance-similarity-heatmap-visualization`
**Date**: 2025-11-03
**Status**: 🔄 Design

---

## Design Decisions

### Decision 1: Axis Label Placement and Layout

**Context**: Need to add persona names to identify rows/columns.

**Options Considered**:

A) **Left + Top Axes with CSS Grid** ✅ SELECTED
   - Left axis: Vertical persona names aligned with rows
   - Top axis: Rotated (45°) persona names above columns
   - ✅ Standard heatmap convention
   - ✅ Works well with CSS Grid `grid-template-areas`
   - ✅ Scalable to different viewport sizes
   - ⚠️ Requires careful spacing calculations

B) **Tooltips Only** (No permanent labels)
   - Show names only on hover
   - ✅ Simplest implementation
   - ❌ Requires interaction to understand layout
   - ❌ Not discoverable
   - ❌ Poor UX for comparison tasks

C) **Four-Sided Labels** (Left + Right + Top + Bottom)
   - Persona names on all four sides
   - ✅ Highly redundant (good for large screens)
   - ❌ Cluttered on mobile
   - ❌ Wastes space

D) **Interactive Legend List**
   - Separate list mapping numbers to persona names
   - ✅ No layout complexity
   - ❌ Requires mental mapping (position → number → name)
   - ❌ Extra cognitive load

**Decision**: **Option A (Left + Top)** provides standard heatmap UX with optimal space usage.

**Implementation**:
```css
.heatmap-container {
  display: grid;
  grid-template-areas:
    ".        x-labels"
    "y-labels matrix  ";
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  gap: 8px;
}

.heatmap-x-labels {
  grid-area: x-labels;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
}

.heatmap-y-labels {
  grid-area: y-labels;
  display: grid;
  grid-template-rows: repeat(6, 1fr);
}

.similarity-heatmap {
  grid-area: matrix;
}
```

---

### Decision 2: Color Scheme Selection

**Context**: Current HSL colors have insufficient contrast. Need scientifically validated gradient.

**Options Considered**:

A) **Viridis (Perceptually Uniform)** ✅ SELECTED
   - Colors: Purple → Blue → Green → Yellow → White
   - ✅ Scientifically validated for perception
   - ✅ Color-blind friendly (deuteranopia, protanopia)
   - ✅ Monotonically increasing luminance
   - ✅ High contrast
   - ⚠️ Requires color interpolation function

B) **Plasma (Similar to Viridis)**
   - Colors: Dark blue → Purple → Orange → Yellow
   - ✅ Also perceptually uniform
   - ✅ Color-blind friendly
   - ❌ Less familiar to users than viridis

C) **Classic Diverging (Red-Yellow-Green)**
   - Red (low) → Yellow (mid) → Green (high)
   - ✅ Intuitive traffic light metaphor
   - ❌ NOT color-blind friendly (red-green deficiency)
   - ❌ Not perceptually uniform

D) **Grayscale (Black to White)**
   - ✅ Works for all color vision types
   - ✅ High contrast
   - ❌ Less engaging visually
   - ❌ Harder to distinguish subtle differences

E) **Custom HSL with Adjusted Lightness**
   - Keep HSL but vary lightness: 30% → 90%
   - ✅ Minimal code change
   - ❌ Still not scientifically validated
   - ❌ May not solve contrast issues

**Decision**: **Option A (Viridis)** - industry standard for scientific visualization, proven accessibility.

**Color Stops**:
```javascript
const VIRIDIS_STOPS = [
  { value: 0.0, color: '#440154' }, // Deep purple (low)
  { value: 0.3, color: '#31688e' }, // Blue
  { value: 0.5, color: '#35b779' }, // Green
  { value: 0.7, color: '#fde724' }, // Yellow
  { value: 1.0, color: '#ffffff' }  // White (high, self-similarity)
];
```

**Text Color Logic**:
```javascript
function getContrastTextColor(bgColor) {
  const luminance = calculateRelativeLuminance(bgColor);
  return luminance > 0.5 ? '#000000' : '#ffffff';
}
```

---

### Decision 3: Value Display Format

**Context**: Current display shows `0.92` in 12px font. Need better readability.

**Options Considered**:

A) **One Decimal Place + Larger Font** ✅ SELECTED
   - Format: `0.9` instead of `0.92`
   - Font size: 14px (desktop), 12px (mobile)
   - ✅ Cleaner appearance
   - ✅ Easier to scan
   - ✅ Sufficient precision for visual comparison
   - ⚠️ Slight loss of precision (acceptable for UX)

B) **No Decimals (Percentage)**
   - Format: `92%` or `9` (out of 10)
   - ✅ Simpler numbers
   - ❌ Less precise
   - ❌ May confuse with RPAIT scores (also 0-10)

C) **Hide Values, Color Only**
   - No text in cells
   - ✅ Cleaner visual
   - ✅ Focuses attention on patterns
   - ❌ Users cannot get exact values
   - ❌ Requires strong color differentiation

D) **Two Decimals (Keep Current)**
   - ❌ Too cluttered in small cells
   - ❌ False precision (cosine similarity rarely needs 0.01 accuracy)

**Decision**: **Option A** - optimal balance of precision and readability.

**Special Cases**:
- **Diagonal cells** (self-similarity = 1.0): Display as `1.0` or hide (obvious)
- **Very low values** (< 0.1): Display as `0.0` instead of `0.05` (rare case)

---

### Decision 4: Highlight Interaction Pattern

**Context**: Need to help users explore persona relationships interactively.

**Options Considered**:

A) **Click to Highlight Row + Column** ✅ SELECTED
   - Click cell → highlight entire row and column
   - ✅ Shows all relationships for both personas
   - ✅ Standard spreadsheet/heatmap UX
   - ✅ Clear visual feedback
   - ⚠️ Requires state management for active cell

B) **Hover Only (No Click)**
   - Highlight on mouse hover
   - ✅ No state to manage
   - ❌ Not keyboard accessible
   - ❌ Can't maintain highlight while reading tooltip

C) **Toggle Selection (Multi-select)**
   - Click to add to selection set
   - Click again to deselect
   - ✅ Can compare multiple pairs
   - ❌ Complex interaction model
   - ❌ State management overhead

D) **Modal/Popup for Details**
   - Click opens modal with detailed comparison
   - ✅ Space for rich content
   - ❌ Disrupts flow
   - ❌ Heavy for quick scanning

**Decision**: **Option A** - familiar interaction pattern, keyboard accessible (Tab + Enter).

**Implementation**:
```javascript
let activeCell = null;

function highlightPersonaPair(row, col) {
  // Clear previous highlights
  document.querySelectorAll('.heatmap-cell-highlighted').forEach(el => {
    el.classList.remove('heatmap-cell-highlighted');
  });
  document.querySelectorAll('.heatmap-row-highlighted').forEach(el => {
    el.classList.remove('heatmap-row-highlighted');
  });

  // Highlight clicked cell
  activeCell?.classList.remove('active');
  activeCell = event.target;
  activeCell.classList.add('active');

  // Highlight row
  const rowCells = document.querySelectorAll(`[data-row="${row}"]`);
  rowCells.forEach(c => c.classList.add('heatmap-row-highlighted'));

  // Highlight column
  const colCells = document.querySelectorAll(`[data-col="${col}"]`);
  colCells.forEach(c => c.classList.add('heatmap-col-highlighted'));

  // Highlight axis labels
  document.querySelector(`.y-label[data-persona="${row}"]`)?.classList.add('highlighted');
  document.querySelector(`.x-label[data-persona="${col}"]`)?.classList.add('highlighted');
}
```

---

### Decision 5: Tooltip Enhancement Strategy

**Context**: Current tooltips are basic. Need more informative content.

**Options Considered**:

A) **Rich HTML Tooltip with RPAIT Diff** ✅ SELECTED
   - Show similarity score
   - Show similarity level (极低/低/中/高/极高)
   - Show RPAIT dimension differences
   - ✅ Comprehensive information
   - ✅ Helps understand why similarity is X
   - ⚠️ Requires RPAIT data access

B) **Simple Text (Keep Current)**
   - "Su Shi ↔ Guo Xi: 0.92 (Very High)"
   - ✅ Simple implementation
   - ❌ Doesn't explain source of similarity

C) **Custom Tooltip Component**
   - Use library like Tippy.js or Popper.js
   - ✅ Polished UI
   - ✅ Positioning control
   - ❌ External dependency
   - ❌ Overkill for this use case

D) **Side Panel for Details**
   - Tooltip triggers side panel update
   - ✅ More space for content
   - ❌ Disrupts layout
   - ❌ Too heavy for quick scanning

**Decision**: **Option A** - Use native `title` attribute with enhanced text, or custom HTML tooltip via CSS.

**Tooltip Content Format**:
```javascript
function generateTooltip(persona1, persona2, similarity) {
  const rpait1 = persona1.rpait;
  const rpait2 = persona2.rpait;

  const diff = {
    R: Math.abs(rpait1.R - rpait2.R),
    P: Math.abs(rpait1.P - rpait2.P),
    A: Math.abs(rpait1.A - rpait2.A),
    I: Math.abs(rpait1.I - rpait2.I),
    T: Math.abs(rpait1.T - rpait2.T)
  };

  return `
    ${persona1.nameZh} ↔ ${persona2.nameZh}
    相似度: ${(similarity * 100).toFixed(0)}% (${getSimilarityLabel(similarity)})

    RPAIT 维度差异:
    • 写实性 (R): ${diff.R}
    • 诗意性 (P): ${diff.P}
    • 抽象性 (A): ${diff.A}
    • 创新性 (I): ${diff.I}
    • 传统性 (T): ${diff.T}
  `.trim();
}
```

---

### Decision 6: Legend Design

**Context**: Current legend is generic gradient. Need explicit value ranges.

**Options Considered**:

A) **Discrete Swatches with Labels** ✅ SELECTED
   - 5 color blocks with range labels
   - ✅ Clear mapping of color → value
   - ✅ Easy to understand at a glance
   - ✅ Works well with discrete color stops
   - ⚠️ Slightly more space than gradient bar

B) **Continuous Gradient Bar with Tick Marks**
   - Gradient bar with 0.0, 0.3, 0.5, 0.7, 1.0 tick marks
   - ✅ Visually matches continuous data
   - ❌ Harder to map exact colors
   - ❌ More complex CSS

C) **Table-Based Legend**
   - Table rows: Color | Range | Label
   - ✅ Very explicit
   - ❌ Takes too much space
   - ❌ Overkill for 5 ranges

**Decision**: **Option A** - matches viridis discrete stops, optimal readability.

**Implementation**:
```html
<div class="heatmap-legend">
  <div class="legend-title">相似度等级</div>
  <div class="legend-items">
    <div class="legend-item">
      <span class="swatch" style="background: #440154"></span>
      <span class="range">0.0-0.3</span>
      <span class="label">极低</span>
    </div>
    <!-- 4 more items -->
  </div>
</div>
```

---

### Decision 7: Diagonal Cell Treatment

**Context**: Diagonal cells (persona compared to self) always = 1.0. Should they look different?

**Options Considered**:

A) **Lighter Background + Smaller Text** ✅ SELECTED
   - Slightly faded white background
   - Smaller font or hide "1.0" (obvious)
   - Dotted border for distinction
   - ✅ Visually indicates "not a real comparison"
   - ✅ Reduces visual clutter
   - ⚠️ Must ensure still accessible

B) **Same as Other Cells**
   - Treat as normal 1.0 similarity
   - ✅ No special code needed
   - ❌ Wastes attention on obvious data

C) **Hide Diagonal Cells**
   - Empty cells on diagonal
   - ✅ Reduces clutter
   - ❌ Breaks grid visual continuity
   - ❌ May confuse users

D) **Pattern Fill** (Stripes or Dots)
   - Patterned background instead of solid color
   - ✅ Clear distinction
   - ❌ Complex CSS
   - ❌ May look cluttered

**Decision**: **Option A** - subtle but clear distinction.

**Implementation**:
```css
.heatmap-cell.diagonal {
  background-color: rgba(255, 255, 255, 0.9) !important;
  border: 1px dotted #ccc;
  font-size: 11px;
  color: #999;
}
```

---

### Decision 8: Responsive Strategy

**Context**: Heatmap must work on mobile (375px) to desktop (1920px).

**Options Considered**:

A) **Adaptive Approach** ✅ SELECTED
   - Mobile: Smaller cells, abbreviate labels, remove x-axis labels
   - Tablet: Medium cells, rotated x-labels
   - Desktop: Full labels, larger cells
   - ✅ Optimized for each breakpoint
   - ✅ Maintains functionality
   - ⚠️ More CSS rules

B) **Scrollable Container**
   - Fixed cell size, scroll horizontally on mobile
   - ✅ Simple implementation
   - ❌ Poor mobile UX
   - ❌ Users may miss content

C) **Modal View on Mobile**
   - Thumbnail on mobile, full view in modal
   - ✅ Doesn't crowd homepage
   - ❌ Extra interaction required
   - ❌ Breaks flow

**Decision**: **Option A** - responsive design best practice.

**Breakpoints**:
```css
/* Mobile (<768px) */
- Cell size: 48px
- Font: 11px
- X-axis labels: Hidden or initials only
- Y-axis labels: Abbreviated Chinese names

/* Tablet (768-1023px) */
- Cell size: 60px
- Font: 12px
- X-axis labels: Rotated 45°, full names
- Y-axis labels: Full names

/* Desktop (1024px+) */
- Cell size: 72px
- Font: 14px
- X-axis labels: Rotated 45°, full bilingual
- Y-axis labels: Full bilingual
```

---

## Architecture Overview

### Component Structure

```
heatmap-container
├── heatmap-x-labels (grid: 6 columns)
│   ├── label × 6 (persona names, rotated 45°)
├── heatmap-y-labels (grid: 6 rows)
│   ├── label × 6 (persona names, vertical)
├── similarity-heatmap (6×6 grid)
│   ├── heatmap-cell × 36
│       ├── data-row (0-5)
│       ├── data-col (0-5)
│       ├── data-persona1 (id)
│       ├── data-persona2 (id)
│       ├── style.backgroundColor (viridis color)
│       ├── style.color (contrast text)
│       ├── textContent (similarity value)
│       ├── title (tooltip)
│       └── event listeners (click, hover)
└── heatmap-legend
    └── legend-item × 5
```

### Data Flow

```
User Action: Page load
    ↓
js/analysis.js: getSimilarityMatrix()
    ↓
similarity-heatmap.js: renderHeatmap()
    ↓
    ├─ renderXLabels() - Create top axis
    ├─ renderYLabels() - Create left axis
    ├─ renderMatrix() - Create 6×6 cells
    │   ├─ For each persona pair:
    │   │   ├─ Get similarity value
    │   │   ├─ Calculate viridis color
    │   │   ├─ Calculate contrast text color
    │   │   ├─ Format value (1 decimal)
    │   │   ├─ Generate tooltip
    │   │   └─ Attach event listeners
    └─ renderLegend() - Create color scale legend
    ↓
User Action: Click cell
    ↓
highlightPersonaPair(row, col)
    ↓
    ├─ Add .active class to cell
    ├─ Add .heatmap-row-highlighted to row cells
    ├─ Add .heatmap-col-highlighted to col cells
    └─ Add .highlighted to axis labels
```

---

## Testing Strategy

### Visual Regression Testing

**Viewports**:
- [ ] 375px (Mobile - iPhone SE)
- [ ] 768px (Tablet - iPad)
- [ ] 1024px (Desktop - MacBook)
- [ ] 1440px (Large Desktop)

**Scenarios**:
- [ ] Default state (no highlights)
- [ ] One cell highlighted (row + column)
- [ ] Diagonal cell appearance
- [ ] Hover state

### Color Accessibility Testing

**Tools**:
- Chrome DevTools: Vision deficiency emulator
- Coblis Color Blindness Simulator
- WebAIM Contrast Checker

**Tests**:
- [ ] Deuteranopia (red-green, most common)
- [ ] Protanopia (red-green)
- [ ] Tritanopia (blue-yellow, rare)
- [ ] Text contrast ratio ≥ 4.5:1 on all backgrounds

### Interaction Testing

**Test Cases**:
1. Click any cell → Row + column + labels highlight
2. Click different cell → Previous highlight clears, new appears
3. Hover cell → Tooltip displays with RPAIT diff
4. Keyboard Tab → Focus moves through cells
5. Keyboard Enter → Activates highlight
6. Mobile tap → Highlight works, no hover issues

### Performance Testing

**Metrics**:
- Initial render time: < 200ms
- Highlight toggle time: < 50ms
- Frame rate during interaction: ≥ 60fps
- Memory usage: < 5MB increase

---

## Rollback Plan

If issues arise after deployment:

1. **Layout Breaks**: Remove axis labels, revert to pure 6×6 grid
2. **Color Issues**: Revert to HSL scheme (adjust lightness range only)
3. **Performance Problems**: Disable highlight feature, keep basic hover tooltip
4. **Mobile Issues**: Hide heatmap on mobile (<768px), show "View on desktop" message

---

**Design Approved**: Ready for spec writing and implementation.
