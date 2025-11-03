# Implementation Tasks - Enhance Similarity Heatmap Visualization

**Change ID**: `enhance-similarity-heatmap-visualization`
**Total Estimated Time**: 140 minutes (~2.5 hours)
**Status**: 🔄 Proposed

---

## Phase 1: Axis Labels (15 minutes)

### Task 1.1: Update HTML Structure for Grid Layout
**Estimated Time**: 5 minutes
**Files**: `index.html`

- [ ] Locate the `#similarity-heatmap-panel` container
- [ ] Wrap the existing `#similarity-heatmap` div in a new `.heatmap-container` div
- [ ] Add 4 child elements:
  - `.heatmap-corner` (empty top-left corner)
  - `.heatmap-x-labels` (top axis)
  - `.heatmap-y-labels` (left axis)
  - `.heatmap-matrix` (rename from `#similarity-heatmap`)

**Expected Structure**:
```html
<div class="heatmap-container">
  <div class="heatmap-corner"></div>
  <div class="heatmap-x-labels"></div>
  <div class="heatmap-y-labels"></div>
  <div id="similarity-heatmap" class="heatmap-matrix"></div>
</div>
```

**Verification**:
- [ ] All 4 child elements exist in correct order
- [ ] Original heatmap div now has class `.heatmap-matrix`

---

### Task 1.2: Add CSS Grid Layout for Axes
**Estimated Time**: 5 minutes
**Files**: `styles/main.css`

- [ ] Add `.heatmap-container` styles:
  - `display: grid`
  - `grid-template-areas: "corner x-labels" "y-labels matrix"`
  - `grid-template-columns: auto 1fr`
  - `grid-template-rows: auto 1fr`
  - `gap: 8px`
- [ ] Assign grid areas to children:
  - `.heatmap-corner { grid-area: corner; }`
  - `.heatmap-x-labels { grid-area: x-labels; }`
  - `.heatmap-y-labels { grid-area: y-labels; }`
  - `.heatmap-matrix { grid-area: matrix; }`

**Verification**:
- [ ] Grid layout renders correctly
- [ ] 4 areas positioned as expected

---

### Task 1.3: Render Y-Axis Labels (Left Side)
**Estimated Time**: 3 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] Create `renderYAxisLabels()` function
- [ ] Get personas array from `window.VULCA_DATA.personas`
- [ ] For each persona:
  - Create `<div class="heatmap-label">`
  - Set `dataset.persona` to persona ID
  - Set `dataset.index` to array index
  - Set `textContent` to `${nameZh} (${nameEn})`
  - Set `role="rowheader"`
  - Append to `.heatmap-y-labels` container
- [ ] Call `renderYAxisLabels()` in main `renderSimilarityHeatmap()` function

**Verification**:
- [ ] 6 y-axis labels rendered
- [ ] Labels show Chinese + English names
- [ ] Labels have correct `data-persona` attributes

---

### Task 1.4: Render X-Axis Labels (Top Side)
**Estimated Time**: 2 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] Create `renderXAxisLabels()` function
- [ ] For each persona:
  - Create `<div class="heatmap-label">`
  - Set `dataset.persona` to persona ID
  - Set `dataset.index` to array index
  - Set `textContent` to `${nameZh}` (Chinese only)
  - Set `role="columnheader"`
  - Append to `.heatmap-x-labels` container
- [ ] Call `renderXAxisLabels()` in main `renderSimilarityHeatmap()` function

**Verification**:
- [ ] 6 x-axis labels rendered
- [ ] Labels show Chinese names only
- [ ] Labels have correct `data-persona` attributes

---

### Task 1.5: Style Axis Labels
**Estimated Time**: 5 minutes
**Files**: `styles/main.css`

- [ ] Style `.heatmap-y-labels`:
  - `display: flex; flex-direction: column; justify-content: space-evenly;`
  - `gap: 2px;`
- [ ] Style `.heatmap-x-labels`:
  - `display: flex; flex-direction: row; justify-content: space-evenly;`
  - `gap: 2px;`
- [ ] Style `.heatmap-label`:
  - `font-size: 12px; font-weight: 500; color: #666;`
  - `text-align: center; cursor: pointer;`
  - `transition: color 0.2s ease, font-weight 0.2s ease;`
- [ ] Rotate x-axis labels 45 degrees:
  - `.heatmap-x-labels .heatmap-label { transform: rotate(-45deg); }`
  - Add `transform-origin` and padding adjustments

**Verification**:
- [ ] Y-axis labels aligned vertically
- [ ] X-axis labels rotated 45 degrees
- [ ] Labels readable and not overlapping

---

## Phase 2: Color Scheme (20 minutes)

### Task 2.1: Define Viridis Color Stops Constant
**Estimated Time**: 2 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] Add constant at top of module:
```javascript
const VIRIDIS_COLOR_STOPS = [
  { value: 0.0, color: '#440154' },
  { value: 0.3, color: '#31688e' },
  { value: 0.5, color: '#35b779' },
  { value: 0.7, color: '#fde724' },
  { value: 1.0, color: '#ffffff' }
];
```

**Verification**:
- [ ] Constant accessible throughout module
- [ ] 5 stops defined with correct values

---

### Task 2.2: Implement Color Utility Functions
**Estimated Time**: 5 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] Implement `hexToRgb(hex)` - converts "#RRGGBB" to `{r, g, b}`
- [ ] Implement `rgbToHex(r, g, b)` - converts RGB to "#RRGGBB"
- [ ] Implement `interpolateHex(hex1, hex2, t)` - linear interpolation between two hex colors
- [ ] Add unit tests (comments) for each function

**Verification**:
- [ ] `hexToRgb('#440154')` returns `{r: 68, g: 1, b: 84}`
- [ ] `rgbToHex(68, 1, 84)` returns `'#440154'`
- [ ] `interpolateHex('#440154', '#31688e', 0.5)` returns midpoint color

---

### Task 2.3: Implement Viridis Interpolation Function
**Estimated Time**: 5 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] Create `interpolateViridisColor(value, stops)` function
- [ ] Clamp value to [0, 1]
- [ ] Find surrounding color stops
- [ ] Calculate interpolation factor `t`
- [ ] Call `interpolateHex()` to get final color
- [ ] Handle edge cases (value < 0, value > 1)

**Verification**:
- [ ] `interpolateViridisColor(0.0)` returns `'#440154'`
- [ ] `interpolateViridisColor(1.0)` returns `'#ffffff'`
- [ ] `interpolateViridisColor(0.6)` returns greenish color
- [ ] Smooth gradient with no visible banding

---

### Task 2.4: Replace getHeatmapColor() Function
**Estimated Time**: 3 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] Locate existing `getHeatmapColor()` function (lines 72-82)
- [ ] Replace entire function body with:
```javascript
function getHeatmapColor(similarity) {
  return interpolateViridisColor(similarity, VIRIDIS_COLOR_STOPS);
}
```
- [ ] Remove old HSL color logic

**Verification**:
- [ ] No HSL color references remain
- [ ] All cells use viridis colors
- [ ] Low similarity cells are purple/blue
- [ ] High similarity cells are yellow/white

---

### Task 2.5: Implement Dynamic Text Color Calculation
**Estimated Time**: 5 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] Create `getRelativeLuminance(r, g, b)` function
  - Implement WCAG luminance formula
  - Linearize RGB channels
  - Return value in [0, 1]
- [ ] Create `getTextColorForBackground(bgHex)` function
  - Convert hex to RGB
  - Calculate luminance
  - Return `'#ffffff'` if luminance < 0.5, else `'#000000'`

**Verification**:
- [ ] Dark backgrounds (#440154) return white text
- [ ] Light backgrounds (#fde724) return black text
- [ ] All cells meet WCAG AA contrast ratio (≥4.5:1)

---

### Task 2.6: Apply Dynamic Text Color to Cells
**Estimated Time**: 2 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] In `createHeatmapCell()` function, after setting background color:
  - Get text color: `const textColor = getTextColorForBackground(bgColor);`
  - Set cell color: `cell.style.color = textColor;`
  - Set data attribute: `cell.dataset.textColor = textColor === '#ffffff' ? 'light' : 'dark';`

**Verification**:
- [ ] All cell text is readable
- [ ] Purple/blue cells have white text
- [ ] Yellow/white cells have black text

---

## Phase 3: Value Display (10 minutes)

### Task 3.1: Increase Font Size
**Estimated Time**: 2 minutes
**Files**: `styles/main.css`

- [ ] Update `.heatmap-cell` font size:
  - Desktop (default): `font-size: 14px;`
  - Mobile (<768px): `font-size: 12px;` in media query

**Verification**:
- [ ] Desktop cells show 14px text
- [ ] Mobile cells show 12px text
- [ ] Text remains centered in cells

---

### Task 3.2: Reduce Decimal Places to One
**Estimated Time**: 2 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] Locate all instances of `.toFixed(2)` for similarity values
- [ ] Replace with `.toFixed(1)`
- [ ] Update tooltip formatting as well

**Verification**:
- [ ] All cells show "0.9" instead of "0.92"
- [ ] Edge case 1.0 displays as "1.0"
- [ ] Edge case 0.0 displays as "0.0"

---

### Task 3.3: Add Diagonal Cell Styling
**Estimated Time**: 3 minutes
**Files**: `js/visualizations/similarity-heatmap.js`, `styles/main.css`

- [ ] In `createHeatmapCell()`, check if `persona1.id === persona2.id`
- [ ] If true, add class `heatmap-cell-diagonal`
- [ ] In CSS, add `.heatmap-cell-diagonal` styles:
  - `opacity: 0.6;`
  - `background: rgba(255, 255, 255, 0.3) !important;`

**Verification**:
- [ ] Exactly 6 diagonal cells have `.heatmap-cell-diagonal` class
- [ ] Diagonal cells visually lighter than others
- [ ] Diagonal cells still show "1.0" value

---

### Task 3.4: Optimize Font Weight and Line Height
**Estimated Time**: 3 minutes
**Files**: `styles/main.css`

- [ ] Update `.heatmap-cell`:
  - `font-weight: 600;` (semi-bold)
  - Remove explicit `line-height` (use flexbox centering)
  - Ensure `display: flex; align-items: center; justify-content: center;`

**Verification**:
- [ ] Text appears bold but not too heavy
- [ ] Text perfectly centered vertically and horizontally

---

## Phase 4: Interactivity (25 minutes)

### Task 4.1: Add Data Attributes to Cells
**Estimated Time**: 3 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] In `createHeatmapCell()`, add:
  - `cell.dataset.row = rowIndex;`
  - `cell.dataset.col = colIndex;`
  - `cell.dataset.persona1 = persona1.id;`
  - `cell.dataset.persona2 = persona2.id;`
  - `cell.dataset.similarity = similarity.toFixed(1);`

**Verification**:
- [ ] All cells have `data-row`, `data-col`, `data-persona1`, `data-persona2`
- [ ] Values are correct for each cell

---

### Task 4.2: Implement clearHighlights() Function
**Estimated Time**: 3 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] Create `clearHighlights()` function:
```javascript
function clearHighlights() {
  document.querySelectorAll('.heatmap-cell-active').forEach(el =>
    el.classList.remove('heatmap-cell-active'));
  document.querySelectorAll('.heatmap-row-highlighted').forEach(el =>
    el.classList.remove('heatmap-row-highlighted'));
  document.querySelectorAll('.heatmap-col-highlighted').forEach(el =>
    el.classList.remove('heatmap-col-highlighted'));
  document.querySelectorAll('.heatmap-label.highlighted').forEach(el =>
    el.classList.remove('highlighted'));
}
```

**Verification**:
- [ ] Function removes all highlight classes
- [ ] No errors when called on empty selection

---

### Task 4.3: Implement highlightPersonaPair() Function
**Estimated Time**: 7 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] Create `highlightPersonaPair(persona1Id, persona2Id = null)` function
- [ ] Clear previous highlights
- [ ] Find row and column indices
- [ ] Highlight all cells in row (add `heatmap-row-highlighted`)
- [ ] If persona2Id provided:
  - Highlight all cells in column (add `heatmap-col-highlighted`)
  - Highlight specific cell (add `heatmap-cell-active`)
  - Highlight x-axis label
- [ ] Highlight y-axis label
- [ ] Store state in module variable

**Verification**:
- [ ] Clicking cell highlights row + column
- [ ] Row cells have `heatmap-row-highlighted` class
- [ ] Column cells have `heatmap-col-highlighted` class
- [ ] Active cell has `heatmap-cell-active` class
- [ ] Axis labels have `highlighted` class

---

### Task 4.4: Add Cell Click Event Handlers
**Estimated Time**: 5 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] Create `setupCellClickHandlers()` function
- [ ] Select all `.heatmap-cell` elements
- [ ] Add click event listener to each:
  - Get `persona1Id` and `persona2Id` from dataset
  - Check if already active (toggle behavior)
  - If active, call `clearHighlights()`
  - Else, call `highlightPersonaPair(persona1Id, persona2Id)`
- [ ] Call `setupCellClickHandlers()` after rendering cells

**Verification**:
- [ ] Clicking cell highlights it
- [ ] Clicking same cell again clears highlight
- [ ] Clicking different cell switches highlight

---

### Task 4.5: Add Label Click Event Handlers
**Estimated Time**: 4 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] Create `setupLabelClickHandlers()` function
- [ ] Add click handlers to y-axis labels:
  - Call `highlightPersonaPair(personaId, null)` (row-only highlight)
- [ ] Add click handlers to x-axis labels:
  - Call `highlightPersonaPair(null, personaId)` (column-only highlight)
- [ ] Call `setupLabelClickHandlers()` after rendering labels

**Verification**:
- [ ] Clicking y-axis label highlights entire row
- [ ] Clicking x-axis label highlights entire column

---

### Task 4.6: Add Hover CSS Styles
**Estimated Time**: 3 minutes
**Files**: `styles/main.css`

- [ ] Add `.heatmap-cell:hover` styles:
  - `transform: scale(1.05);`
  - `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);`
  - `z-index: 10;`
- [ ] Add `.heatmap-label:hover` styles:
  - `color: var(--color-primary, #007bff);`
- [ ] Ensure transitions are smooth (200ms)

**Verification**:
- [ ] Cells scale slightly on hover
- [ ] Hover transitions are smooth
- [ ] Labels change color on hover

---

### Task 4.7: Add Highlight State CSS Styles
**Estimated Time**: 3 minutes
**Files**: `styles/main.css`

- [ ] Add `.heatmap-row-highlighted, .heatmap-col-highlighted` styles:
  - `box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.4);`
  - `z-index: 5;`
- [ ] Add `.heatmap-cell-active` styles:
  - `box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.9);`
  - `transform: scale(1.08);`
  - `z-index: 20;`
- [ ] Add `.heatmap-label.highlighted` styles:
  - `font-weight: 700;`
  - `color: var(--color-primary, #007bff);`

**Verification**:
- [ ] Highlighted cells have visible inset border
- [ ] Active cell more prominent than row/column highlights
- [ ] Labels bold and colored when highlighted

---

## Phase 5: Enhanced Tooltips (20 minutes)

### Task 5.1: Create Tooltip HTML Structure
**Estimated Time**: 3 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] Add tooltip container to DOM:
```javascript
const tooltip = document.createElement('div');
tooltip.className = 'heatmap-tooltip';
tooltip.role = 'tooltip';
document.body.appendChild(tooltip);
```
- [ ] Store reference in module variable

**Verification**:
- [ ] Tooltip element exists in DOM
- [ ] Initially hidden (display: none or visibility: hidden)

---

### Task 5.2: Implement getSimilarityLabel() Function
**Estimated Time**: 2 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] Create `getSimilarityLabel(similarity)` function
- [ ] Return labels based on ranges:
  - 0.9-1.0: "极高相似度"
  - 0.7-0.89: "高相似度"
  - 0.5-0.69: "中等相似度"
  - 0.3-0.49: "低相似度"
  - 0.0-0.29: "极低相似度"

**Verification**:
- [ ] All ranges return correct labels
- [ ] Edge cases (0.9, 0.7, 0.5, 0.3) return correct labels

---

### Task 5.3: Implement generateTooltipContent() Function
**Estimated Time**: 7 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] Create `generateTooltipContent(persona1, persona2, similarity)` function
- [ ] Calculate RPAIT differences:
  - `diff.R = Math.abs(persona1.rpait.R - persona2.rpait.R)`
  - (same for P, A, I, T)
- [ ] Get similarity label
- [ ] Build HTML string with:
  - Header: persona names (Chinese + English)
  - Similarity: value + label
  - RPAIT list: 5 dimensions with differences

**Verification**:
- [ ] Tooltip HTML contains all sections
- [ ] RPAIT differences calculated correctly
- [ ] Bilingual labels displayed

---

### Task 5.4: Add Tooltip Show/Hide Event Listeners
**Estimated Time**: 5 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] Add `mouseenter` listener to all cells:
  - Get persona1, persona2, similarity from cell data
  - Generate tooltip content
  - Set tooltip innerHTML
  - Position tooltip near cell
  - Show tooltip (visibility: visible)
- [ ] Add `mouseleave` listener to all cells:
  - Hide tooltip (visibility: hidden)

**Verification**:
- [ ] Hovering cell shows tooltip
- [ ] Leaving cell hides tooltip
- [ ] Tooltip updates when moving between cells

---

### Task 5.5: Implement Tooltip Positioning Function
**Estimated Time**: 5 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] Create `positionTooltip(cell, tooltip)` function
- [ ] Get cell bounding rect
- [ ] Calculate default position (above cell, centered)
- [ ] Check viewport boundaries:
  - If too close to top, position below cell
  - If too close to left, shift right
  - If too close to right, shift left
- [ ] Set tooltip `style.top` and `style.left`

**Verification**:
- [ ] Tooltip positioned above cell by default
- [ ] Tooltip repositions when near edges
- [ ] Tooltip never extends beyond viewport

---

### Task 5.6: Style Tooltip
**Estimated Time**: 3 minutes
**Files**: `styles/main.css`

- [ ] Add `.heatmap-tooltip` styles:
  - `position: fixed; z-index: 1000;`
  - `background: rgba(0, 0, 0, 0.9); color: #fff;`
  - `padding: 12px 16px; border-radius: 6px;`
  - `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);`
  - `font-size: 13px; line-height: 1.5;`
  - `max-width: 300px;`
- [ ] Style tooltip sections (header, similarity, rpait-list)

**Verification**:
- [ ] Tooltip has dark semi-transparent background
- [ ] Text is white and readable
- [ ] Tooltip has subtle shadow
- [ ] Layout is well-structured

---

## Phase 6: Legend Improvement (10 minutes)

### Task 6.1: Update Legend HTML Structure
**Estimated Time**: 3 minutes
**Files**: `index.html`

- [ ] Locate `.viz-legend` element in `#similarity-heatmap-panel`
- [ ] Replace with new structure:
```html
<div class="heatmap-legend" role="legend">
  <div class="legend-title">相似度范围</div>
  <div class="legend-items">
    <!-- Will be populated by JavaScript -->
  </div>
</div>
```

**Verification**:
- [ ] Old `.legend-gradient` element removed
- [ ] New structure in place

---

### Task 6.2: Implement renderHeatmapLegend() Function
**Estimated Time**: 5 minutes
**Files**: `js/visualizations/similarity-heatmap.js`

- [ ] Create `renderHeatmapLegend()` function
- [ ] Define legend data array:
```javascript
const legendData = [
  { color: '#440154', range: '0.0-0.3', label: '极低', ariaLabel: '极低相似度，0.0到0.3' },
  { color: '#31688e', range: '0.3-0.5', label: '低', ariaLabel: '低相似度，0.3到0.5' },
  { color: '#35b779', range: '0.5-0.7', label: '中', ariaLabel: '中等相似度，0.5到0.7' },
  { color: '#fde724', range: '0.7-0.9', label: '高', ariaLabel: '高相似度，0.7到0.9' },
  { color: '#ffffff', range: '0.9-1.0', label: '极高', ariaLabel: '极高相似度，0.9到1.0', border: true }
];
```
- [ ] For each item:
  - Create `.legend-item` div
  - Add `.legend-swatch` span with background color
  - Add `.legend-label` span with range + label text
  - Set `aria-label` attribute
- [ ] Append to `.legend-items` container
- [ ] Call in main `renderSimilarityHeatmap()` function

**Verification**:
- [ ] Exactly 5 legend items rendered
- [ ] Each has color swatch + text label
- [ ] Colors match viridis stops
- [ ] White swatch has border

---

### Task 6.3: Style Legend
**Estimated Time**: 5 minutes
**Files**: `styles/main.css`

- [ ] Add `.heatmap-legend` styles:
  - `margin-top: 16px; padding: 12px;`
  - `background: rgba(0, 0, 0, 0.02); border-radius: 4px;`
- [ ] Add `.legend-title` styles:
  - `font-size: 13px; font-weight: 600; margin-bottom: 8px;`
- [ ] Add `.legend-items` styles:
  - `display: flex; flex-direction: row; gap: 12px;`
  - `flex-wrap: wrap; justify-content: flex-start;`
- [ ] Add `.legend-item` styles:
  - `display: flex; align-items: center; gap: 6px;`
- [ ] Add `.legend-swatch` styles:
  - `width: 24px; height: 24px; border-radius: 3px; flex-shrink: 0;`
- [ ] Add `.legend-label` styles:
  - `font-size: 12px; color: #666; white-space: nowrap;`
- [ ] Add mobile responsive styles (<768px):
  - Reduce swatch size to 20px
  - Reduce label font to 11px

**Verification**:
- [ ] Legend items arranged horizontally on desktop
- [ ] Items wrap on mobile if needed
- [ ] Spacing and alignment correct
- [ ] Legend visually subordinate to heatmap

---

## Phase 7: Testing & Validation (15 minutes)

### Task 7.1: Visual Regression Testing
**Estimated Time**: 5 minutes

- [ ] Test on desktop (1920px, 1440px, 1024px)
- [ ] Test on tablet (768px)
- [ ] Test on mobile (375px)
- [ ] Verify:
  - [ ] Axis labels aligned with cells
  - [ ] Colors clearly distinguishable
  - [ ] Text readable on all backgrounds
  - [ ] No layout shifts or overlapping elements

---

### Task 7.2: Color Blind Simulation Testing
**Estimated Time**: 3 minutes

- [ ] Use color blind simulator (Coblis or browser extension)
- [ ] Test deuteranopia (red-green color blindness)
- [ ] Test protanopia (red color blindness)
- [ ] Test tritanopia (blue-yellow color blindness)
- [ ] Verify viridis colors still distinguishable in all modes

---

### Task 7.3: Interaction Testing
**Estimated Time**: 4 minutes

- [ ] Click cells - verify highlighting
- [ ] Click same cell - verify toggle off
- [ ] Click different cell - verify switch
- [ ] Click y-axis label - verify row highlight
- [ ] Click x-axis label - verify column highlight
- [ ] Hover cells - verify tooltip appears
- [ ] Hover cells near edges - verify tooltip repositions
- [ ] Hover leave - verify tooltip disappears

---

### Task 7.4: Accessibility Audit
**Estimated Time**: 3 minutes

- [ ] Test keyboard navigation:
  - [ ] Tab through cells
  - [ ] Tab through labels
  - [ ] Enter/Space triggers highlight
  - [ ] Escape clears highlights
- [ ] Test screen reader:
  - [ ] Axis labels announced with role="rowheader"/"columnheader"
  - [ ] Tooltip content accessible
  - [ ] Legend items have descriptive aria-labels
- [ ] Verify WCAG AA contrast:
  - [ ] All cell text ≥4.5:1 contrast ratio
  - [ ] Label text readable

---

### Task 7.5: Performance Testing
**Estimated Time**: 2 minutes

- [ ] Open browser DevTools Performance tab
- [ ] Record interaction:
  - Click cell to highlight
  - Move between cells
  - Hover to show tooltips
- [ ] Verify:
  - [ ] Highlight operation completes in <100ms
  - [ ] Tooltip generation <10ms
  - [ ] No layout thrashing
  - [ ] 60fps maintained on mobile

---

## Post-Implementation

### Documentation Updates
- [ ] Update CLAUDE.md with new heatmap features
- [ ] Update SPEC.md if needed
- [ ] Add screenshots to proposal.md

### Code Review Checklist
- [ ] No console errors
- [ ] No console warnings
- [ ] Code follows project style
- [ ] All functions have comments
- [ ] No magic numbers (use constants)
- [ ] Responsive on all devices
- [ ] Accessible (WCAG AA)
- [ ] Performant (<100ms interactions)

---

## Success Criteria

All tasks complete when:
- ✅ All 6 persona names displayed on left and top axes
- ✅ All cells use viridis color gradient (purple → blue → green → yellow → white)
- ✅ All cell values display with 1 decimal place in 14px font
- ✅ Clicking cells/labels highlights rows and columns
- ✅ Diagonal cells (self-similarity) visually distinguished
- ✅ Tooltips show RPAIT dimension differences
- ✅ Legend displays 5 labeled color swatches
- ✅ All tests pass (visual, color blind, interaction, accessibility, performance)
- ✅ No regressions in existing functionality

---

**Ready to implement**: Proceed with Phase 1 tasks in order.
