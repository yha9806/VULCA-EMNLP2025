# Design Document - Remove Network Graph and Similarity Heatmap Panels

**Change ID**: `remove-network-graph-and-heatmap-panels`
**Date**: 2025-11-03

---

## Architecture Decisions

### Decision 1: Complete Removal vs. Conditional Hiding

**Options considered**:

A. **Complete deletion** (Selected)
   - Delete HTML, JavaScript, CSS entirely
   - Remove script references
   - Clean up orphaned code

B. Conditional hiding with feature flag
   - Add `data-feature-enabled="false"` attributes
   - Keep code but hide panels with CSS
   - JavaScript still loads but doesn't execute

C. Comment out code
   - Leave code in place but commented
   - Easy to uncomment if needed
   - Still loads and clutters codebase

**Decision**: **A - Complete deletion**

**Rationale**:
- **Clean codebase**: No dead code lingering
- **Performance**: Don't load unused JavaScript (saves ~800-1000 lines)
- **Maintainability**: Less code to maintain and update
- **User intent**: User explicitly said results are poor, wants removal
- **Reversibility**: Git history preserves deleted code if needed

**Trade-offs**:
- ✅ Pro: Cleaner, faster, more maintainable
- ⚠️ Neutral: Requires git revert if we want them back
- ❌ Con: More effort than just hiding (acceptable for long-term quality)

---

### Decision 2: Removal Order - Sequential vs. Parallel

**Options considered**:

A. **Remove heatmap first, then network graph** (Selected)
   - Phase 1: Remove heatmap + test
   - Phase 2: Remove network graph + test
   - Safer, can catch issues between removals

B. Remove both simultaneously
   - Delete all at once in single commit
   - Faster, but harder to debug if issues arise

C. Remove network graph first, then heatmap
   - Network graph is simpler (no analysis.js dependencies)
   - Heatmap has more complex dependencies

**Decision**: **A - Remove heatmap first, then network graph**

**Rationale**:
- **Risk management**: Heatmap has more dependencies (analysis.js functions)
- **Testing**: Easier to isolate issues if done sequentially
- **Rollback**: Can revert one without affecting the other
- **Logical order**: Remove more complex component first

---

### Decision 3: Analysis Function Removal Strategy

**Options considered**:

A. **Remove immediately** (Selected)
   - Delete `getPersonaRPAITForArtwork()`
   - Delete `calculateDimensionSimilarity()`
   - Delete `getArtworkDimensionSimilarityMatrix()`

B. Deprecate with warnings
   - Keep functions but add console warnings
   - Mark as deprecated in JSDoc
   - Remove in next major version

C. Keep functions for potential future use
   - Leave analysis functions in place
   - Comment them as "unused but available"
   - Might be useful later

**Decision**: **A - Remove immediately**

**Rationale**:
- **YAGNI principle**: You aren't gonna need it - don't keep unused code
- **Simplicity**: Functions are only used by heatmap
- **Clarity**: Clear signal that heatmap is gone
- **Performance**: No dead code in analysis module
- **Reversibility**: Git history preserves if needed

**Verification before removal**:
```bash
# Grep for function usage before deletion
rg "getPersonaRPAITForArtwork" --type js
rg "calculateDimensionSimilarity" --type js
rg "getArtworkDimensionSimilarityMatrix" --type js
```

---

### Decision 4: CSS Removal Strategy

**Options considered**:

A. **Remove all heatmap/network styles completely** (Selected)
   - Delete all `.heatmap-*` classes
   - Delete all `#network-graph*` IDs
   - Delete `.viz-panel-large` if unused
   - Delete empty state styles

B. Keep utility classes
   - Remove component-specific styles
   - Keep reusable utilities like `.viz-panel-large`
   - Might use them later

C. Archive styles in comments
   - Comment out instead of delete
   - Preserve for reference
   - Still clutters CSS file

**Decision**: **A - Remove completely**

**Rationale**:
- **File size**: Reduce main.css by ~500 lines
- **Clarity**: No confusion about which styles are active
- **Performance**: Smaller CSS parse/render time
- **Pattern**: `.viz-panel-large` was only used by heatmap and network graph
- **Recovery**: Git history available if needed

**Removal checklist**:
- [ ] `.heatmap-matrix`, `.heatmap-cell`, `.heatmap-label`
- [ ] `.heatmap-corner`, `.heatmap-x-labels`, `.heatmap-y-labels`
- [ ] `.heatmap-legend`, `.legend-title`, `.legend-items`
- [ ] `.heatmap-empty-state`, `.empty-state-message`, `.empty-state-actions`
- [ ] `#network-graph`, `.network-node`, `.network-link`
- [ ] `.viz-panel-large` (if no other usage)

---

### Decision 5: Grid Layout After Removal

**Options considered**:

A. **Keep existing `.viz-grid` with auto-flow** (Selected)
   - Grid naturally adapts to 2 panels
   - No layout changes needed
   - Responsive design still works

B. Simplify to flexbox 2-column
   - Replace grid with `display: flex`
   - Explicit 50/50 split
   - Less flexible for future additions

C. Make panels stack vertically
   - Single column layout
   - Better for mobile
   - Worse for desktop

**Decision**: **A - Keep existing grid**

**Rationale**:
- **Minimal changes**: Grid already handles variable panel counts
- **Future-proof**: Easy to add new panels if needed
- **Responsive**: Existing breakpoints still work
- **Consistency**: Matches current design patterns

**Current grid behavior**:
```css
.viz-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-lg);
}
```

After removal:
- Desktop (>1024px): 2 panels side-by-side
- Tablet (768-1024px): 2 panels side-by-side or stacked (depends on width)
- Mobile (<768px): Panels stacked vertically

---

### Decision 6: Dimension Selector Scope

**Options considered**:

A. **Keep dimension selector for persona matrix** (Selected)
   - Selector currently in persona matrix panel
   - Still useful for comparing dimensions
   - No changes needed

B. Remove dimension selector entirely
   - Was also used by heatmap
   - Simplify interface further
   - Lose dimensional comparison capability

C. Move dimension selector to global controls
   - Make it affect both remaining visualizations
   - More prominent placement
   - Requires refactoring

**Decision**: **A - Keep for persona matrix**

**Rationale**:
- **Functionality**: Dimension selector is valuable for matrix
- **Scope**: Already scoped to persona matrix panel
- **No conflicts**: Heatmap had its own dimension label
- **User value**: Dimensional filtering is core feature

**No changes needed**:
```html
<div class="viz-panel" id="persona-matrix-panel">
  <h3>评论家对比矩阵</h3>
  <canvas id="persona-matrix-chart"></canvas>
  <div class="viz-controls">
    <select id="dimension-selector">...</select>  <!-- KEEP THIS -->
  </div>
</div>
```

---

### Decision 7: Persona Selector Integration

**Options considered**:

A. **Keep persona selector unchanged** (Selected)
   - Still fires `persona-selected` events
   - Radar and matrix listen to events
   - No integration code to remove

B. Simplify event system
   - Remove event listeners for deleted panels
   - Audit all `persona-selected` handlers
   - Clean up unused event handling

C. Remove persona selector entirely
   - No longer needed without heatmap?
   - Radar and matrix still benefit from selection
   - Would remove valuable functionality

**Decision**: **A - Keep unchanged**

**Rationale**:
- **Still valuable**: Radar and matrix use persona selection
- **No cleanup needed**: Deleted files handled their own events
- **Event-driven architecture**: Decoupled design means no orphaned listeners
- **User experience**: Selection is core interaction

**Event flow after removal**:
```
Persona Selector
     │
     ├──► persona-selected event
     │
     ├──► RPAIT Radar (listens and updates)
     │
     └──► Persona Matrix (listens and updates)
```

---

## Removal Strategy

### Phase-by-Phase Breakdown

#### Phase 1: Remove Heatmap (30 minutes)

**1.1 Remove HTML** (5 min)
- Lines 182-197 in index.html
- Entire `<div class="viz-panel viz-panel-large" id="similarity-heatmap-panel">`

**1.2 Remove Script Tag** (2 min)
- Line 359: `<script src="/js/visualizations/similarity-heatmap.js?v=1"></script>`

**1.3 Test Page Loads** (3 min)
- Load index.html in browser
- Check console for errors
- Verify radar and matrix still render

**1.4 Delete JavaScript File** (5 min)
- Delete `js/visualizations/similarity-heatmap.js`
- Verify no imports/requires in other files

**1.5 Remove CSS Styles** (10 min)
- Search main.css for `.heatmap-*` and `#similarity-heatmap*`
- Remove all matching rules (~300 lines)
- Test layout after removal

**1.6 Remove Analysis Functions** (5 min)
- Remove 3 functions from analysis.js (~110 lines)
- Verify no other calls to these functions

#### Phase 2: Remove Network Graph (15 minutes)

**2.1 Remove HTML** (5 min)
- Lines 199-207 in index.html
- Entire `<div class="viz-panel viz-panel-large" id="network-graph-panel">`

**2.2 Remove Script Tag** (2 min)
- Line 360: `<script src="/js/visualizations/network-graph.js?v=1"></script>`

**2.3 Delete JavaScript File** (3 min)
- Delete `js/visualizations/network-graph.js`

**2.4 Remove CSS Styles** (5 min)
- Search main.css for `#network-graph*` and `.network-*`
- Remove all matching rules (~100-200 lines)

#### Phase 3: Final Testing (10 minutes)

**3.1 Functional Testing**
- [ ] Homepage loads
- [ ] RPAIT radar displays
- [ ] Persona matrix displays
- [ ] Persona selector works
- [ ] Dimension selector works
- [ ] No console errors

**3.2 Responsive Testing**
- [ ] Mobile (375px): Panels stack vertically
- [ ] Tablet (768px): Appropriate layout
- [ ] Desktop (1024px+): Side-by-side or grid

**3.3 Regression Testing**
- [ ] Gallery navigation still works
- [ ] Critique sections still render
- [ ] All links and buttons functional

---

## File Impact Summary

### Files to Modify

| File | Current Size | Removed Lines | Final Size |
|------|-------------|---------------|------------|
| `index.html` | ~400 lines | ~30 lines | ~370 lines |
| `styles/main.css` | ~3200 lines | ~500 lines | ~2700 lines |
| `js/analysis.js` | ~300 lines | ~110 lines | ~190 lines |

### Files to Delete

| File | Size | Reason |
|------|------|--------|
| `js/visualizations/similarity-heatmap.js` | 648 lines | Entire heatmap implementation |
| `js/visualizations/network-graph.js` | ~300-500 lines | Entire network graph implementation |

### Files Unchanged

- `js/visualizations/rpait-radar.js` - ✅ Keep
- `js/visualizations/persona-matrix.js` - ✅ Keep
- `js/visualizations/persona-selector.js` - ✅ Keep
- `js/data.js` - ✅ Keep
- All other project files - ✅ Keep

---

## Testing Strategy

### Unit-Level Verification

```javascript
// After removal, verify these still work:

// 1. Persona selector emits events
window.addEventListener('persona-selected', (e) => {
  console.log('Selected:', e.detail.selectedPersonas);
});

// 2. RPAIT radar receives and handles events
// (Visual inspection)

// 3. Persona matrix receives and handles events
// (Visual inspection)
```

### Integration Testing Checklist

- [ ] Click persona badges → radar updates
- [ ] Click persona badges → matrix updates
- [ ] Change dimension dropdown → matrix updates
- [ ] Navigate carousel → artworks change
- [ ] Resize window → layout responds correctly
- [ ] Mobile menu → navigation works

### Browser Compatibility

Test in:
- [ ] Chrome/Edge 90+
- [ ] Firefox 88+
- [ ] Safari 14+

---

## Performance Impact

### Before Removal

**Page Load**:
- HTML: ~400 lines
- CSS: ~3200 lines
- JS: ~2000 lines (4 visualization files + supporting scripts)

**Execution Time**:
- Heatmap rendering: ~5-30ms (depending on persona count)
- Network graph rendering: ~50-100ms (D3.js force simulation)
- Total viz rendering: ~200-300ms

### After Removal

**Page Load**:
- HTML: ~370 lines (-30, -7.5%)
- CSS: ~2700 lines (-500, -15.6%)
- JS: ~1200 lines (-800, -40%)

**Execution Time**:
- Radar rendering: ~20ms
- Matrix rendering: ~15ms
- Total viz rendering: ~50-70ms (-70% reduction)

**Impact**:
- ✅ Faster initial page load
- ✅ Faster JavaScript execution
- ✅ Lower memory usage
- ✅ Simpler debugging

---

## Rollback Plan

If removal causes issues:

1. **Git revert**:
   ```bash
   git revert <commit-hash>
   ```

2. **Selective restoration**:
   ```bash
   git checkout <commit-hash>^ -- js/visualizations/similarity-heatmap.js
   git checkout <commit-hash>^ -- js/visualizations/network-graph.js
   ```

3. **Cherry-pick specific fixes**:
   - If only part of removal was problematic
   - Can restore individual components

---

## Future Considerations

### If We Need to Add Visualizations Later

**Pattern to follow**:
1. Create new file in `js/visualizations/`
2. Add panel HTML to index.html `.viz-grid`
3. Add script tag before closing `</body>`
4. Use existing event system (`persona-selected`, etc.)
5. Follow responsive design patterns

**Don't**:
- Don't create overly complex visualizations
- Don't duplicate information already shown
- Don't add without user value validation

---

**Decision record complete**: All major decisions documented with clear rationale for complete removal approach.
