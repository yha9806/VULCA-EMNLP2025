# Redesign Heatmap Layout and Data Model - OpenSpec Proposal

**Change ID**: `redesign-heatmap-layout-and-data`
**Status**: ✅ Deployed
**Date**: 2025-11-03
**Deployed**: 2025-11-03
**Author**: Claude Code + User Feedback
**Target Audience**: Gallery visitors comparing persona similarities across dimensions

---

## Executive Summary

Redesign the similarity heatmap to fix critical layout issues and transform its data model from static global similarity to dynamic, dimension-specific similarity that integrates with the persona selector and dimension selector. Current implementation has four major problems:

1. **Layout Issues**: Axis labels overlap, heatmap too small, misaligned with radar/matrix visualizations
2. **Data Irrelevance**: Shows global persona similarity (averaged across all artworks) instead of dimension-specific or artwork-specific similarity
3. **No Integration**: Doesn't respond to persona selector or dimension selector changes
4. **Poor Information Density**: Only shows one similarity number without contextual breakdown

### Key Changes

| Aspect | Current | Redesigned |
|--------|---------|------------|
| **Layout** | 6×6 fixed grid, small cells | Dynamic N×N grid (2-6 personas), larger cells |
| **Data Source** | Global RPAIT average similarity | Dimension-specific similarity (current artwork) |
| **Integration** | Static, no linkage | Linked to persona selector + dimension selector |
| **Labels** | Long overlapping names | Compact labels, responsive truncation |
| **Panel Size** | Small, inconsistent with others | Large panel, matches radar/matrix |
| **Information** | Single similarity value | Similarity + dimension breakdown |

---

## Problem Statement

### Issue 1: Layout Problems

**Symptom**: User reports "排版还是有问题" (layout still has problems)

**Root causes**:
1. **Axis label overlap**: Y-axis shows full Chinese + English names like "苏轼 (Su Shi)", causing horizontal overflow when rotated 45°
2. **Heatmap too small**: Fixed 6×6 grid with small cells makes it hard to read values on mobile
3. **Inconsistent sizing**: Heatmap panel size doesn't match radar chart and persona matrix panels
4. **Grid layout conflict**: `.viz-grid` places heatmap in a small column, but it needs more space

**Evidence from code**:
```css
/* styles/main.css:2809 - Y-axis labels are too long */
.heatmap-label {
  font-size: 12px;
  /* Content: "苏轼 (Su Shi)" = 13 characters */
}

/* styles/main.css:2819 - X-axis labels rotated 45° cause overlap */
.heatmap-x-labels .heatmap-label {
  transform: rotate(-45deg);
  /* Long names collide when rotated */
}
```

### Issue 2: Data Lacks Representativeness

**Symptom**: User reports "数据没有任何代表性" (data has no representativeness)

**Root causes**:
1. **Global averaging loses context**: Current similarity is based on `getPersonaAverageRPAIT()` across all 4 artworks
   - Example: Su Shi's global RPAIT = average(artwork-1 R7, artwork-2 R8, artwork-3 R6, artwork-4 R7) = R7
   - This loses the artwork-specific nuances
2. **Single similarity metric**: Only shows cosine similarity of 5D RPAIT vectors, doesn't break down by dimension
3. **No artwork context**: User is viewing a specific artwork in the carousel, but heatmap shows global data
4. **No integration with controls**: Dimension selector exists for persona-matrix but heatmap ignores it

**Evidence from code**:
```javascript
// js/analysis.js:177-181 - Uses global average
const rpait1 = this.getPersonaAverageRPAIT(persona1.id);
const rpait2 = this.getPersonaAverageRPAIT(persona2.id);
matrix[persona1.id][persona2.id] = this.rpaitCosineSimilarity(rpait1, rpait2);
```

### Issue 3: No Integration with Other Visualizations

**Symptom**: Heatmap doesn't respond to user interactions with persona selector or dimension selector

**Root causes**:
1. **Ignores persona-selected events**: Radar and matrix respond to persona selection, heatmap doesn't
2. **Ignores dimension changes**: Matrix has dimension dropdown, heatmap could show dimension-specific similarity
3. **Ignores artwork changes**: Carousel navigation doesn't update heatmap (because it uses global data)

**Evidence from code**:
```javascript
// js/visualizations/similarity-heatmap.js:530-533
function handleVisualizationUpdate(e) {
  // Heatmap doesn't change with artwork (it's based on overall persona similarity)
  // But we could highlight certain cells if needed in the future
}
```

### User Impact

- **Confusion**: Users can't understand why heatmap values don't change when they select different artworks
- **Irrelevance**: Similarity based on global averages doesn't help analyze specific artworks
- **Frustration**: Layout issues make the visualization hard to read
- **Missed Insights**: Can't see dimension-specific similarities (e.g., "these personas are similar in Realism but different in Tradition")

---

## Proposed Solution

### What Changes

#### 1. Redesign Layout for Better Readability

**A) Make heatmap a large panel** (match network graph size)
```html
<!-- index.html -->
<div class="viz-panel viz-panel-large" id="similarity-heatmap-panel">
  <h3>评论家相似度矩阵 · 当前维度: <span id="heatmap-dimension-label">全部维度</span></h3>
  <!-- ... -->
</div>
```

**B) Shorten axis labels**
- Y-axis: Chinese name only (苏轼)
- X-axis: First 2 characters or initials (苏、郭、罗、克、格、惠)
- Add full name in tooltip

**C) Dynamic grid size**
- 2 personas selected → 2×2 grid
- 3 personas selected → 3×3 grid
- 4-6 personas selected → N×N grid
- Larger cells = better readability

**D) Responsive cell sizing**
```css
.heatmap-cell {
  min-width: 60px;   /* Up from ~40px */
  min-height: 60px;
  font-size: 16px;   /* Up from 14px */
}
```

#### 2. Transform Data Model to Dimension-Specific Similarity

**New calculation logic**:
```javascript
/**
 * Calculate dimension-specific similarity between two personas
 * for the current artwork
 *
 * @param {string} persona1Id
 * @param {string} persona2Id
 * @param {string} dimension - 'R', 'P', 'A', 'I', 'T', or 'all'
 * @param {string} artworkId - Current artwork context
 * @returns {number} Similarity in [0, 1]
 */
function calculateDimensionSimilarity(persona1Id, persona2Id, dimension, artworkId) {
  if (dimension === 'all') {
    // Use artwork-specific RPAIT vectors (not global average)
    const rpait1 = getPersonaRPAITForArtwork(persona1Id, artworkId);
    const rpait2 = getPersonaRPAITForArtwork(persona2Id, artworkId);
    return rpaitCosineSimilarity(rpait1, rpait2);
  } else {
    // Single dimension similarity
    const score1 = getPersonaRPAITForArtwork(persona1Id, artworkId)[dimension];
    const score2 = getPersonaRPAITForArtwork(persona2Id, artworkId)[dimension];

    // Normalize to [0, 1]: similarity = 1 - abs(score1 - score2) / 10
    return 1 - Math.abs(score1 - score2) / 10;
  }
}
```

**B) New data flow**:
```
Persona Selector (selected personas) ───┐
                                         ├──> Heatmap renders N×N matrix
Dimension Selector (current dimension) ──┤    with dimension-specific
                                         │    similarity values
Artwork Carousel (current artwork) ──────┘
```

#### 3. Integrate with Persona Selector

**A) Listen to persona-selected events**:
```javascript
window.addEventListener('persona-selected', (e) => {
  selectedPersonas = e.detail.selectedPersonas;
  renderHeatmap();  // Re-render with new subset
});
```

**B) Filter matrix to selected personas only**:
```javascript
function renderHeatmap() {
  const personas = selectedPersonas.map(id =>
    window.VULCA_DATA.personas.find(p => p.id === id)
  );

  // Render N×N matrix instead of always 6×6
  personas.forEach((persona1, rowIndex) => {
    personas.forEach((persona2, colIndex) => {
      const similarity = calculateDimensionSimilarity(
        persona1.id, persona2.id, currentDimension, currentArtworkId
      );
      // ...
    });
  });
}
```

#### 4. Integrate with Dimension Selector

**A) Listen to dimension-change events**:
```javascript
const dimensionSelect = document.getElementById('dimension-selector');
dimensionSelect.addEventListener('change', (e) => {
  currentDimension = e.target.value;
  updateHeatmapTitle();
  renderHeatmap();
});
```

**B) Update heatmap title to show current dimension**:
```html
<h3>
  评论家相似度矩阵 · 当前维度:
  <span id="heatmap-dimension-label">写实性 (Representation)</span>
</h3>
```

#### 5. Enhance Information Density

**A) Show dimension breakdown in tooltip**:
```javascript
// Before: "Su Shi ↔ Guo Xi: 0.9 (极高相似度)"
// After:
const tooltip = `
  <strong>苏轼 ↔ 郭熙</strong>
  <div>当前作品: ${artwork.titleZh}</div>
  <div>维度: ${dimensionLabel}</div>
  <div>相似度: ${similarity.toFixed(2)}</div>
  ${currentDimension === 'all' ? `
    <div class="tooltip-breakdown">
      各维度差异:
      R: ${Math.abs(r1-r2)} | P: ${Math.abs(p1-p2)} |
      A: ${Math.abs(a1-a2)} | I: ${Math.abs(i1-i2)} | T: ${Math.abs(t1-t2)}
    </div>
  ` : ''}
`;
```

**B) Update legend to show dimension-specific ranges**:
```javascript
// When dimension is 'R', legend shows:
// 0.0-0.2: 极不相似 (相差 8-10 分)
// 0.2-0.4: 不相似 (相差 6-8 分)
// 0.4-0.6: 中等 (相差 4-6 分)
// 0.6-0.8: 相似 (相差 2-4 分)
// 0.8-1.0: 极相似 (相差 0-2 分)
```

### Why

**Layout improvements**: Larger panel + shorter labels + dynamic grid = better readability on all devices

**Dimension-specific data**: Shows meaningful similarity in context of current artwork and dimension, not meaningless global average

**Integration**: Makes heatmap a cohesive part of the visualization suite instead of an isolated element

**Information density**: Users can drill down from global similarity to dimension-specific insights

### How

**Implementation sequence**:

1. **Phase 1: Layout Redesign** (30 min)
   - Make panel `.viz-panel-large`
   - Shorten axis labels
   - Implement dynamic grid sizing
   - Adjust CSS for larger cells

2. **Phase 2: New Data Functions** (40 min)
   - Add `getPersonaRPAITForArtwork(personaId, artworkId)` to analysis.js
   - Add `calculateDimensionSimilarity()` function
   - Add `calculateArtworkSpecificSimilarityMatrix(artworkId, dimension, personas)` function

3. **Phase 3: Persona Selector Integration** (20 min)
   - Listen to `persona-selected` events
   - Filter matrix to selected personas
   - Handle edge cases (0-1 personas selected)

4. **Phase 4: Dimension Selector Integration** (20 min)
   - Listen to dimension-change events
   - Update heatmap title with current dimension
   - Re-render with dimension-specific similarity

5. **Phase 5: Artwork Carousel Integration** (15 min)
   - Listen to `visualization:update` events
   - Re-render when artwork changes
   - Show artwork title in header

6. **Phase 6: Enhanced Tooltips & Legend** (20 min)
   - Add artwork context to tooltips
   - Add dimension breakdown for 'all' mode
   - Update legend labels based on dimension

7. **Phase 7: Testing** (15 min)
   - Test with different persona selections (2-6)
   - Test with different dimensions
   - Test artwork navigation
   - Verify responsive layout

---

## Success Metrics

### Functional Requirements
- ✅ Heatmap size adjusts to selected persona count (2×2 to 6×6)
- ✅ Axis labels don't overlap at any viewport size
- ✅ Similarity values change when dimension selector changes
- ✅ Similarity values change when artwork changes
- ✅ Heatmap shows only selected personas
- ✅ Tooltips show artwork context and dimension breakdown
- ✅ Legend labels reflect current dimension

### Layout Quality
- ✅ Heatmap cells ≥60×60px on desktop
- ✅ Heatmap panel matches network graph size (`.viz-panel-large`)
- ✅ No label overlap at 375px, 768px, 1024px, 1440px
- ✅ Smooth transitions when switching dimensions/artworks

### Data Accuracy
- ✅ Single dimension similarity: `1 - |score1 - score2| / 10`
- ✅ All dimensions similarity: `cosineSimilarity(rpait1, rpait2)` using artwork-specific RPAIT
- ✅ Values update immediately when context changes

### Integration
- ✅ Responds to `persona-selected` events within 100ms
- ✅ Responds to dimension changes within 100ms
- ✅ Responds to artwork navigation within 100ms

---

## Dependencies

### Code Files
- `js/analysis.js` - Add artwork-specific RPAIT lookup and dimension similarity calculation
- `js/visualizations/similarity-heatmap.js` - Rewrite data flow and event listeners
- `styles/main.css` - Adjust panel size, grid, and cell sizing
- `index.html` - Add dimension label to heatmap header

### Data Requirements
- Existing: `window.VULCA_DATA.critiques` with per-artwork RPAIT scores
- Existing: `window.VULCA_DATA.personas` with persona metadata
- Existing: Persona selector state tracking
- Existing: Dimension selector dropdown

### Event System
- Listen: `persona-selected` (from persona-selector.js)
- Listen: `change` on `#dimension-selector`
- Listen: `visualization:update` (from carousel)
- Emit: None (heatmap is a leaf visualization)

---

## Risks and Mitigations

### Risk 1: Performance with Dynamic Resizing
**Risk**: Re-rendering N×N matrix on every selection change may be slow
**Mitigation**:
- Debounce persona-selected events by 100ms
- Cache artwork-specific RPAIT data
- Use CSS transitions for smooth resizing

### Risk 2: Dimension Similarity May Not Be Intuitive
**Risk**: Users may not understand single-dimension similarity formula
**Mitigation**:
- Add clear legend labels explaining score differences
- Show original scores in tooltip (e.g., "Su Shi R7 vs Guo Xi R8 = 0.9 similarity")
- Provide visual examples in tooltip

### Risk 3: Empty State When 0-1 Personas Selected
**Risk**: Can't show matrix with <2 personas
**Mitigation**:
- Show message: "请选择至少2位评论家以查看相似度矩阵"
- Provide quick-select buttons: "选择全部" / "选择3位"

### Risk 4: Label Truncation May Hide Information
**Risk**: Shortened labels make it unclear which persona is which
**Mitigation**:
- Add full name in tooltip on label hover
- Use persona colors consistently (match radar/matrix)
- Add small avatar/icon next to label

---

## Timeline Estimate

| Phase | Duration | Cumulative |
|-------|----------|------------|
| Proposal & Design | 30 min | 30 min |
| Specs Writing | 40 min | 70 min |
| Phase 1: Layout Redesign | 30 min | 100 min |
| Phase 2: New Data Functions | 40 min | 140 min |
| Phase 3: Persona Integration | 20 min | 160 min |
| Phase 4: Dimension Integration | 20 min | 180 min |
| Phase 5: Artwork Integration | 15 min | 195 min |
| Phase 6: Enhanced UI | 20 min | 215 min |
| Phase 7: Testing | 15 min | 230 min |
| **Total** | **230 min** | **~4 hours** |

---

## Future Enhancements

- **Clustering visualization**: Reorder rows/columns to group similar personas together
- **Heatmap animation**: Animate color changes when switching dimensions
- **Export**: Download matrix as CSV or image
- **Comparison mode**: Show two heatmaps side-by-side (e.g., artwork A vs artwork B)
- **Dimension weights**: Let users adjust importance of each RPAIT dimension

---

## Related Changes

- `enhance-similarity-heatmap-visualization` - Previous enhancement (axis labels, viridis colors, interactivity) - will be modified
- `add-interactive-persona-selector` - Provides persona selection events - dependency
- `enrich-homepage-data-visualizations` - Added persona matrix with dimension selector - provides integration point

---

**Ready for validation**: Run `openspec validate redesign-heatmap-layout-and-data --strict`
