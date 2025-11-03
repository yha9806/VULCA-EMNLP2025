# Enhance Similarity Heatmap Visualization - OpenSpec Proposal

**Change ID**: `enhance-similarity-heatmap-visualization`
**Status**: 🔄 Proposed
**Date**: 2025-11-03
**Author**: Claude Code + User Feedback
**Target Audience**: Gallery visitors analyzing persona similarities

---

## Executive Summary

Enhance the semantic similarity heatmap to make it more readable and informative by adding axis labels, improving color contrast, optimizing value display, and adding interactive features. The current heatmap is difficult to interpret due to missing labels, subtle color differences, and lack of interactive guidance.

### Key Improvements

| Aspect | Current | Enhanced |
|--------|---------|----------|
| **Axis Labels** | None (6×6 anonymous grid) | Persona names on left + top axes |
| **Color Scheme** | Subtle HSL gradients | High-contrast viridis/plasma gradient |
| **Value Display** | Small text (0.92) | Larger font, 1 decimal place (0.9) |
| **Interactivity** | Hover tooltip only | Click to highlight, enhanced tooltips |
| **Legend** | Generic gradient bar | Specific range labels with colors |
| **Diagonal Highlighting** | None | Visual distinction for self-similarity |

---

## Problem Statement

### Current Issues

1. **Missing Context - Axis Labels**
   - Users cannot identify which row/column corresponds to which persona
   - No names displayed on the grid
   - Requires mental mapping from position to persona

2. **Poor Color Differentiation**
   - Current HSL colors too subtle: `hsl(120, 70%, 75%)` to `hsl(0, 70%, 75%)`
   - All values have 75% lightness - very similar appearance
   - Difficult to distinguish high similarity (0.9) from medium (0.7)
   - Color blind users cannot differentiate

3. **Suboptimal Value Display**
   - Font size 12px too small on mobile
   - Two decimal places (0.92) cluttered in small cells
   - Text color `rgba(0, 0, 0, 0.8)` may have poor contrast on light backgrounds

4. **Limited Interactivity**
   - Only basic tooltip on hover
   - No way to highlight related personas
   - No visual feedback for selected comparisons
   - Diagonal cells (self-similarity = 1.0) not distinguished

### User Impact

- **Comprehension**: Users struggle to understand which personas are being compared
- **Analysis**: Cannot quickly identify similarity patterns
- **Accessibility**: Color-blind users cannot differentiate values
- **Engagement**: Lack of interactive features reduces exploration

---

## Proposed Solution

### What Changes

#### 1. Add Axis Labels with Persona Names

**Left Y-Axis** (vertical):
```html
<div class="heatmap-y-labels">
  <div class="heatmap-label">苏轼 (Su Shi)</div>
  <div class="heatmap-label">郭熙 (Guo Xi)</div>
  <div class="heatmap-label">约翰·罗斯金 (John Ruskin)</div>
  <!-- ... 6 total -->
</div>
```

**Top X-Axis** (horizontal):
```html
<div class="heatmap-x-labels">
  <div class="heatmap-label">苏轼</div>
  <div class="heatmap-label">郭熙</div>
  <!-- ... rotated 45° for space efficiency -->
</div>
```

#### 2. Improve Color Scheme

**Replace current HSL with high-contrast gradient**:

**Option A: Viridis (Recommended)**
- Low similarity (0.0-0.3): `#440154` (deep purple)
- Medium-low (0.3-0.5): `#31688e` (blue)
- Medium (0.5-0.7): `#35b779` (green)
- High (0.7-0.9): `#fde724` (yellow)
- Very high (0.9-1.0): `#ffffff` (white)

**Option B: Plasma**
- Low: `#0d0887` (dark blue)
- High: `#f0f921` (bright yellow)

**Option C: Red-Yellow-Green Classic**
- Low: `#d73027` (red)
- Medium: `#fee08b` (yellow)
- High: `#1a9850` (green)

**Implementation**:
```javascript
function getViridisColor(value) {
  // Use D3.js color scale or custom interpolation
  const colorStops = [
    { val: 0.0, color: '#440154' },
    { val: 0.3, color: '#31688e' },
    { val: 0.5, color: '#35b779' },
    { val: 0.7, color: '#fde724' },
    { val: 1.0, color: '#ffffff' }
  ];
  return interpolateColor(value, colorStops);
}
```

#### 3. Optimize Value Display

**Changes**:
- Font size: 12px → **14px** (desktop), 10px → **12px** (mobile)
- Decimal places: 2 → **1** (`0.92` → `0.9`)
- Text color: Dynamic based on background luminance
  - Dark background → white text
  - Light background → black text

**Special case - Diagonal cells** (self-similarity = 1.0):
- Lighter background or pattern
- Smaller text or hide value (obvious it's 1.0)

#### 4. Enhanced Interactivity

**A) Click to Highlight**:
```javascript
cell.addEventListener('click', () => {
  highlightPersonaPair(persona1.id, persona2.id);
  // Highlights:
  // - Clicked cell (border)
  // - Corresponding row
  // - Corresponding column
  // - Axis labels
});
```

**B) Enhanced Tooltips**:
```javascript
// Before: "Su Shi ↔ Guo Xi: 0.92 (Very High similarity)"
// After:
const tooltip = `
  <strong>${persona1.nameZh} ↔ ${persona2.nameZh}</strong>
  <div>相似度: ${similarity.toFixed(1)} / 1.0</div>
  <div>等级: ${getSimilarityLabel(similarity)}</div>
  <div>RPAIT差异: R±${diff.R}, P±${diff.P}, A±${diff.A}</div>
`;
```

**C) Diagonal Highlighting**:
- Add class `heatmap-cell-diagonal` to cells where persona1 === persona2
- Visual: lighter background, dotted border, or pattern

**D) Hover Effects**:
- Highlight entire row and column on hover
- Show axis labels in bold

#### 5. Improved Legend

**Replace generic gradient bar with specific labels**:

```html
<div class="heatmap-legend">
  <div class="legend-item">
    <span class="legend-swatch" style="background: #440154"></span>
    <span>0.0-0.3 极低</span>
  </div>
  <div class="legend-item">
    <span class="legend-swatch" style="background: #31688e"></span>
    <span>0.3-0.5 低</span>
  </div>
  <div class="legend-item">
    <span class="legend-swatch" style="background: #35b779"></span>
    <span>0.5-0.7 中</span>
  </div>
  <div class="legend-item">
    <span class="legend-swatch" style="background: #fde724"></span>
    <span>0.7-0.9 高</span>
  </div>
  <div class="legend-item">
    <span class="legend-swatch" style="background: #ffffff; border: 1px solid #ccc"></span>
    <span>0.9-1.0 极高</span>
  </div>
</div>
```

### Why

**Axis Labels**: Essential for understanding - users need to know which personas are being compared without guessing positions.

**Color Contrast**: Scientific visualization best practice (viridis) provides perceptually uniform colors that work for color-blind users.

**Value Display**: Larger font and fewer decimals improve readability on all devices; dynamic text color ensures contrast.

**Interactivity**: Click-to-highlight helps users explore relationships; enhanced tooltips provide detailed comparison data.

**Legend**: Explicit range labels make the color scale immediately understandable.

### How

**Implementation Steps**:

1. **Phase 1: Axis Labels** (15 min)
   - Add `.heatmap-y-labels` container (left axis)
   - Add `.heatmap-x-labels` container (top axis)
   - Render persona names
   - CSS: rotate x-axis labels 45°

2. **Phase 2: Color Scheme** (20 min)
   - Implement viridis color interpolation function
   - Replace `getHeatmapColor()` logic
   - Add dynamic text color calculation (luminance-based)
   - Test color accessibility (WCAG AA contrast)

3. **Phase 3: Value Display** (10 min)
   - Increase font size (14px desktop, 12px mobile)
   - Change `.toFixed(2)` to `.toFixed(1)`
   - Implement dynamic text color

4. **Phase 4: Interactivity** (25 min)
   - Add click event listener to cells
   - Implement `highlightPersonaPair()` function
   - Add row/column hover highlighting
   - Enhance tooltip with RPAIT diff details

5. **Phase 5: Legend & Diagonal** (10 min)
   - Replace gradient bar with labeled swatches
   - Add `.heatmap-cell-diagonal` class and styling
   - Test visual hierarchy

6. **Phase 6: Testing** (10 min)
   - Visual regression testing
   - Color blind simulation
   - Interaction testing
   - Accessibility audit

---

## Success Metrics

### Functional Requirements
- ✅ Axis labels display all 6 persona names (Chinese + English)
- ✅ Color gradient uses viridis or equivalent high-contrast scheme
- ✅ Values display with 1 decimal place in 14px font
- ✅ Clicking a cell highlights row + column + axis labels
- ✅ Diagonal cells visually distinguished
- ✅ Legend shows 5 labeled color swatches

### Visual Quality
- ✅ Color contrast ratio ≥ 4.5:1 (WCAG AA)
- ✅ Text readable on all cell backgrounds
- ✅ Axis labels not overlapping
- ✅ Smooth hover transitions

### Accessibility
- ✅ Passes Color Blind Vision Simulator (deuteranopia, protanopia)
- ✅ Keyboard navigable (Tab + Enter to activate cells)
- ✅ ARIA labels updated with persona names
- ✅ Screen reader announces selections

### Performance
- ✅ Re-render time < 100ms for highlight operations
- ✅ No layout shift when toggling highlights
- ✅ Smooth on mobile (60fps)

---

## Dependencies

### Code Files
- `js/visualizations/similarity-heatmap.js` - Main visualization logic
- `styles/main.css` - Heatmap styles and layout
- `index.html` - May need container structure update

### External Libraries (Optional)
- D3.js color scales (if using D3-based interpolation) - NOT REQUIRED, can implement manually

### Data Files
- `js/analysis.js` - No changes (similarity matrix already computed)

---

## Risks and Mitigations

### Risk 1: Layout Complexity with Labels
**Risk**: Adding axis labels may break responsive layout
**Mitigation**: Use CSS Grid with explicit areas; test on all breakpoints (375px-1920px)

### Risk 2: Color Accessibility
**Risk**: New colors may still fail for some color vision deficiencies
**Mitigation**: Use scientifically validated viridis palette; test with simulation tools

### Risk 3: Performance with Highlights
**Risk**: Highlighting row/column may cause layout thrashing
**Mitigation**: Use CSS classes only (no inline styles); batch DOM updates

### Risk 4: Mobile Label Overlap
**Risk**: Rotated x-axis labels may overlap on small screens
**Mitigation**: Reduce font size, abbreviate names, or use initials on mobile

---

## Timeline Estimate

| Phase | Duration | Cumulative |
|-------|----------|------------|
| Proposal & Design | 20 min | 20 min |
| Specs Writing | 30 min | 50 min |
| Phase 1: Axis Labels | 15 min | 65 min |
| Phase 2: Color Scheme | 20 min | 85 min |
| Phase 3: Value Display | 10 min | 95 min |
| Phase 4: Interactivity | 25 min | 120 min |
| Phase 5: Legend & Diagonal | 10 min | 130 min |
| Phase 6: Testing | 10 min | 140 min |
| **Total** | **140 min** | **~2.5 hours** |

---

## Future Enhancements

- **Export to CSV**: Download similarity matrix as spreadsheet
- **Filter by threshold**: Show only cells above certain similarity
- **Sort by similarity**: Reorder rows/columns to cluster similar personas
- **Compare with specific artwork**: Highlight similarities within one artwork context
- **Animation**: Animate color changes when switching datasets

---

## Related Changes

- `2025-11-02-enrich-homepage-data-visualizations` - Original heatmap implementation
- `2025-11-03-add-interactive-persona-selector` - Persona selection integration

---

**Ready for validation**: Run `openspec validate enhance-similarity-heatmap-visualization --strict`
