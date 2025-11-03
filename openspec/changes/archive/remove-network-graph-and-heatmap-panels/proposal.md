# Remove Network Graph and Similarity Heatmap Panels - OpenSpec Proposal

**Change ID**: `remove-network-graph-and-heatmap-panels`
**Status**: ✅ Deployed
**Date**: 2025-11-03
**Deployed**: 2025-11-03
**Author**: Claude Code + User Feedback
**Target Audience**: Gallery visitors viewing RPAIT visualizations

---

## Executive Summary

Remove two visualization panels from the homepage that are not meeting quality standards:
1. **Panel 3**: "评论家相似度矩阵 · 当前维度: 全部维度" (Persona Similarity Heatmap)
2. **Panel 4**: "作品-评论家关系网络" (Artwork-Persona Network Graph)

After recent implementation, these panels have proven to be ineffective or overly complex for the user experience. This proposal cleanly removes both panels along with all associated code, styles, and scripts.

### Key Changes

| Aspect | Current | After Removal |
|--------|---------|---------------|
| **Visualization Panels** | 4 panels (Radar, Matrix, Heatmap, Network) | 2 panels (Radar, Matrix) |
| **Panel Layout** | Complex grid with large panels | Simpler 2-panel layout |
| **JavaScript Files** | 4 visualization scripts | 2 visualization scripts |
| **CSS Complexity** | Heatmap + Network styles (~500 lines) | Cleaner, focused styles |
| **User Cognitive Load** | High (4 different visualizations) | Lower (2 core visualizations) |

---

## Problem Statement

### Issue 1: Poor Implementation Results

**Symptom**: User reports "这个修改结果过很差" (the modification result is very poor)

**Root causes**:
1. **Heatmap complexity**: The recently redesigned heatmap with dimension-specific similarity may be too complex or confusing
2. **Network graph utility**: The network graph may not provide actionable insights
3. **Visual clutter**: Too many visualization panels competing for attention
4. **Maintenance burden**: More code to maintain without clear user value

### Issue 2: Redundant Information

**Problem**: Both removed panels show relationship/similarity data that may already be conveyed by:
- **RPAIT Radar Chart**: Shows individual persona dimensions
- **Persona Comparison Matrix**: Shows dimensional comparisons between personas

**Evidence**:
- Heatmap shows similarity scores, but users may not understand the nuances between artwork-specific vs. global similarity
- Network graph shows connections, but static relationships don't change dynamically with artwork

### User Impact
- **Confusion**: Too many visualization types to understand
- **Distraction**: Important panels (Radar, Matrix) lost among complex visualizations
- **Slow performance**: Additional JavaScript processing and rendering
- **Maintenance risk**: Complex code prone to bugs

---

## Proposed Solution

### What Changes

#### 1. Remove Similarity Heatmap Panel

**A) Remove HTML structure** (index.html lines 182-197)
```html
<!-- DELETE THIS ENTIRE BLOCK -->
<div class="viz-panel viz-panel-large" id="similarity-heatmap-panel">
  <h3>评论家相似度矩阵 · 当前维度: <span id="heatmap-dimension-label">全部维度</span></h3>
  <div class="heatmap-container">...</div>
  <div class="heatmap-legend">...</div>
</div>
```

**B) Remove JavaScript** (index.html line 359)
```html
<!-- DELETE THIS LINE -->
<script src="/js/visualizations/similarity-heatmap.js?v=1"></script>
```

**C) Delete JavaScript file**
- Delete: `js/visualizations/similarity-heatmap.js` (648 lines)

**D) Remove CSS styles**
- Remove all `.heatmap-*` related styles from `styles/main.css`
- Estimated ~300-400 lines of CSS

**E) Remove analysis functions**
- Remove from `js/analysis.js`:
  - `getPersonaRPAITForArtwork()`
  - `calculateDimensionSimilarity()`
  - `getArtworkDimensionSimilarityMatrix()`
- Estimated ~110 lines

#### 2. Remove Network Graph Panel

**A) Remove HTML structure** (index.html lines 199-207)
```html
<!-- DELETE THIS ENTIRE BLOCK -->
<div class="viz-panel viz-panel-large" id="network-graph-panel">
  <h3>作品-评论家关系网络</h3>
  <svg id="network-graph">...</svg>
  <div class="viz-controls">...</div>
</div>
```

**B) Remove JavaScript** (index.html line 360)
```html
<!-- DELETE THIS LINE -->
<script src="/js/visualizations/network-graph.js?v=1"></script>
```

**C) Delete JavaScript file**
- Delete: `js/visualizations/network-graph.js` (entire file)

**D) Remove CSS styles**
- Remove all `#network-graph*` related styles from `styles/main.css`
- Estimated ~100-200 lines of CSS

#### 3. Clean Up Layout

**A) Simplify viz-grid**
- After removal, only 2 panels remain: RPAIT Radar and Persona Matrix
- Grid layout will automatically adapt to 2-panel layout

**B) Remove `.viz-panel-large` usage**
- No longer need large panel class if only 2 panels remain
- Could make both panels equal width or keep one larger

### Why

**Simplicity**: Focus on the two most valuable visualizations (Radar and Matrix)

**Clarity**: Reduce cognitive load by removing complex similarity calculations and network relationships

**Performance**: Faster page load and rendering without heavy visualization scripts

**Maintainability**: Less code to maintain, debug, and update

**User feedback**: Direct request to remove these panels due to poor results

### How

**Implementation sequence**:

1. **Phase 1: Remove HTML and Scripts** (10 min)
   - Delete heatmap panel HTML from index.html
   - Delete network graph panel HTML from index.html
   - Remove script tags for both visualizations
   - Test page loads without errors

2. **Phase 2: Delete JavaScript Files** (5 min)
   - Delete `js/visualizations/similarity-heatmap.js`
   - Delete `js/visualizations/network-graph.js`
   - Verify no other files reference these

3. **Phase 3: Remove CSS Styles** (15 min)
   - Identify and remove all `.heatmap-*` styles
   - Identify and remove all `#network-graph*` styles
   - Remove `.viz-panel-large` if no longer needed
   - Test responsive layout

4. **Phase 4: Remove Analysis Functions** (10 min)
   - Remove heatmap-specific functions from analysis.js
   - Verify no other code calls these functions
   - Test remaining visualizations still work

5. **Phase 5: Clean Up Grid Layout** (5 min)
   - Adjust `.viz-grid` if needed for 2-panel layout
   - Ensure responsive design still works
   - Verify radar and matrix panels display correctly

6. **Phase 6: Testing** (10 min)
   - Test homepage loads correctly
   - Test radar chart works
   - Test persona matrix works
   - Test responsive design at 375px, 768px, 1024px
   - Verify no console errors

---

## Success Metrics

### Functional Requirements
- ✅ Homepage loads without errors
- ✅ RPAIT Radar chart displays and functions correctly
- ✅ Persona Matrix chart displays and functions correctly
- ✅ Persona selector still works
- ✅ Dimension selector still works (for matrix)
- ✅ No console errors related to missing files

### Code Quality
- ✅ All heatmap-related code removed
- ✅ All network graph code removed
- ✅ No orphaned CSS styles
- ✅ No broken references to deleted files
- ✅ Clean git diff showing deletions

### Performance
- ✅ Faster page load (2 fewer scripts)
- ✅ Reduced JavaScript execution time
- ✅ Smaller CSS file size

---

## Dependencies

### Code Files to Modify
- `index.html` - Remove 2 panel sections + 2 script tags
- `styles/main.css` - Remove ~500 lines of CSS
- `js/analysis.js` - Remove 3 functions (~110 lines)

### Code Files to Delete
- `js/visualizations/similarity-heatmap.js` - Delete entire file (648 lines)
- `js/visualizations/network-graph.js` - Delete entire file

### Remaining Files (Unchanged)
- `js/visualizations/rpait-radar.js` - Keep
- `js/visualizations/persona-matrix.js` - Keep
- `js/visualizations/persona-selector.js` - Keep

---

## Risks and Mitigations

### Risk 1: Breaking Persona Selector Integration

**Risk**: Removing heatmap might break persona selector if it listens to heatmap events

**Mitigation**:
- Review persona selector code before removal
- Ensure it only interacts with radar and matrix visualizations
- Test persona selector thoroughly after removal

### Risk 2: Orphaned CSS Causing Layout Issues

**Risk**: Incomplete CSS removal might cause styling conflicts

**Mitigation**:
- Use grep to find all heatmap and network-graph related styles
- Remove entire CSS blocks, not just parts
- Test layout on multiple screen sizes

### Risk 3: Analysis Functions Used Elsewhere

**Risk**: The functions we're removing from analysis.js might be called by other code

**Mitigation**:
- Grep entire codebase for function names before removal
- If found, keep functions but add deprecation warnings
- Only remove if truly unused

### Risk 4: User Expects Removed Features

**Risk**: Future users might notice missing visualizations

**Mitigation**:
- This is intentional removal based on user feedback
- Remaining visualizations (radar, matrix) provide core value
- Can always re-add if needed later

---

## Timeline Estimate

| Phase | Duration | Cumulative |
|-------|----------|------------|
| Phase 1: Remove HTML/Scripts | 10 min | 10 min |
| Phase 2: Delete JS Files | 5 min | 15 min |
| Phase 3: Remove CSS | 15 min | 30 min |
| Phase 4: Remove Analysis Functions | 10 min | 40 min |
| Phase 5: Clean Up Layout | 5 min | 45 min |
| Phase 6: Testing | 10 min | 55 min |
| **Total** | **55 min** | **~1 hour** |

---

## Alternative Approaches Considered

### Alternative 1: Hide Instead of Delete
**Approach**: Add `display: none` to panels instead of deleting code

**Pros**: Easy to revert
**Cons**: Code still loads, CSS still present, maintenance burden remains

**Decision**: ❌ Rejected - User wants clean removal

### Alternative 2: Keep Heatmap, Remove Network
**Approach**: Only remove network graph, keep heatmap

**Pros**: Heatmap shows similarity data
**Cons**: User specifically requested both removed

**Decision**: ❌ Rejected - Follow user's explicit request

### Alternative 3: Simplify Instead of Remove
**Approach**: Simplify heatmap/network to basic versions

**Pros**: Retain some functionality
**Cons**: Still requires maintenance, user already rejected current implementation

**Decision**: ❌ Rejected - Clean slate better than partial fixes

---

## Related Changes

- `redesign-heatmap-layout-and-data` - Just implemented, now being reverted
- `add-interactive-persona-selector` - Remains, but loses heatmap integration
- `enrich-homepage-data-visualizations` - Partially reverted (network graph removal)

---

## Post-Removal State

### Remaining Visualizations
1. **RPAIT Radar Chart** - Shows 5-dimensional persona profiles
2. **Persona Comparison Matrix** - Shows dimensional comparisons with dimension selector

### Removed Visualizations
1. ~~Similarity Heatmap~~ - Removed
2. ~~Network Graph~~ - Removed

### Expected Layout
```
┌─────────────────────────────────────┐
│     Persona Selector (badges)       │
├─────────────────┬───────────────────┤
│  RPAIT Radar    │  Persona Matrix   │
│  (5D profile)   │  (comparison)     │
│                 │  [Dimension: ▼]   │
└─────────────────┴───────────────────┘
```

---

**Ready for implementation**: User has explicitly requested this removal. No validation needed as this is a deletion-focused change.
