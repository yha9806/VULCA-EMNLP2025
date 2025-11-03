# Design: Remove RPAIT Visualization Section

**Change ID**: `remove-rpait-visualization-section`
**Created**: 2025-11-03

---

## Architecture Overview

This change involves removing a single isolated component from the gallery hero rendering pipeline without affecting other RPAIT-related features.

### Current Architecture

```
gallery-hero.js render() pipeline:
├─ renderArtworkHeader()
├─ renderArtworkImage()
├─ renderCritiques()
├─ renderRPAITVisualization()  ← TO BE REMOVED
├─ updateIndicator()
└─ renderDots()
```

### Proposed Architecture

```
gallery-hero.js render() pipeline:
├─ renderArtworkHeader()
├─ renderArtworkImage()
├─ renderCritiques()
├─ updateIndicator()
└─ renderDots()
```

---

## Design Decisions

### Decision 1: Complete Removal vs. Conditional Rendering

**Options Considered**:
- **A**: Complete removal of `renderRPAITVisualization()` function and styles
- **B**: Keep function but conditionally render based on config flag
- **C**: Hide with CSS display:none but keep DOM elements

**Choice**: **Option A** - Complete removal

**Rationale**:
- Simplest solution (YAGNI principle)
- No need for future toggle - user explicitly wants it removed
- Cleaner codebase with no unused code
- Better performance (no unnecessary DOM creation)
- Easy to restore from git history if needed

---

### Decision 2: CSS Cleanup Scope

**Options Considered**:
- **A**: Remove only `.artwork-rpait-visualization` and `.rpait-title` specific to this section
- **B**: Remove all `.rpait-*` styles from main.css
- **C**: Keep all styles but comment them out

**Choice**: **Option A** - Selective removal

**Rationale**:
- `.rpait-dimensions` is still used in `pages/critics.html` (lines 118-124)
- `.rpait-grid` and `.rpait-bar` might be used elsewhere
- Only remove styles that are exclusively for the removed section
- Prevents breaking other pages

**Investigation Required**:
```bash
# Check if .rpait-grid and .rpait-bar are used elsewhere
rg "rpait-grid|rpait-bar" --type html --type js
```

---

### Decision 3: Preserve RPAIT Data in Critique Panels

**Decision**: Keep RPAIT scores in critique panels unchanged

**Rationale**:
- Critique panels show per-persona, per-artwork RPAIT scores
- This provides more granular information than the removed aggregated view
- Maintains data transparency for users
- No user feedback requesting removal of critique panel RPAIT data

---

## Code Impact Analysis

### JavaScript Changes

**File**: `js/gallery-hero.js`

**Removal**:
- Lines 152-252: `renderRPAITVisualization()` function (101 lines)
- Line 48: Function call in `render()` pipeline

**Preserved**:
- RPAIT calculation logic in critique rendering (used by critique panels)
- Average RPAIT calculation in `js/data.js` (may be used by data viz section)

### CSS Changes

**File**: `styles/main.css`

**Removal (Confirmed)**:
- Lines 1433-1440: `.artwork-rpait-visualization` (frosted glass container)
- Lines 1442-1448: `.rpait-title` (section heading)
- Lines 1813-1815: `.artwork-rpait-visualization[data-reveal]` (scroll animation)

**To Investigate**:
- Lines 1081-1102: `.rpait-dimensions` styles → Used by `pages/critics.html`, **keep**
- Lines 1450-1470: `.rpait-grid`, `.rpait-bar`, `.rpait-label`, `.rpait-bar-bg`, `.rpait-bar-fill` → Need to verify usage

### HTML Changes

**File**: None (dynamically generated)

The `.artwork-rpait-visualization` container is created dynamically in JavaScript, so no static HTML changes needed.

---

## Verification Strategy

### Visual Regression Testing

**Test Cases**:
1. Load gallery hero on desktop (1920px) - Verify no RPAIT viz section appears
2. Load gallery hero on tablet (768px) - Verify layout still works
3. Load gallery hero on mobile (375px) - Verify no issues
4. Navigate between artworks - Verify render pipeline still works
5. Check critique panels - Verify RPAIT scores still visible

### Functional Testing

**Test Cases**:
```javascript
// 1. Verify function removed
assert(typeof renderRPAITVisualization === 'undefined');

// 2. Verify DOM element not created
const viz = document.querySelector('.artwork-rpait-visualization');
assert(viz === null);

// 3. Verify critique panels still render
const critiquePanels = document.querySelectorAll('.critique-panel');
assert(critiquePanels.length === 6);

// 4. Verify critique RPAIT still visible
const critiqueRpait = critiquePanels[0].querySelector('.critique-rpait');
assert(critiqueRpait !== null);
```

### Performance Testing

**Metrics to Track**:
- Page load time (should improve or stay the same)
- Time to interactive (should improve slightly)
- DOM node count (should decrease by ~15-20 nodes per artwork)
- JavaScript execution time (should improve by ~10-50ms per render)

---

## Rollback Plan

### If Rollback Needed

```bash
# Revert the commit
git revert <commit-sha>

# Or restore specific files
git checkout HEAD~1 -- js/gallery-hero.js styles/main.css
```

### Recovery Verification

- [ ] Gallery hero displays RPAIT visualization
- [ ] No JavaScript errors in console
- [ ] All CSS styles load correctly
- [ ] Scroll-reveal animation works

---

## Alternative Solutions Considered

### Alternative 1: Move RPAIT Viz to Data Section

**Description**: Instead of removing, move the visualization to the data insights section below

**Pros**:
- Preserves the code
- Groups all data visualizations together

**Cons**:
- Still redundant with existing charts
- More complex implementation (requires moving + refactoring)
- User explicitly requested removal, not relocation

**Rejected**: User wants removal, not relocation

---

### Alternative 2: Collapse/Expand Toggle

**Description**: Add a toggle button to show/hide the RPAIT visualization

**Pros**:
- Gives users choice
- Preserves feature for those who want it

**Cons**:
- Adds UI complexity
- Requires additional JavaScript for state management
- User feedback suggests complete removal preferred
- Over-engineering for a simple removal request

**Rejected**: Violates "favor straightforward, minimal implementations" principle

---

## Dependencies

**Upstream Dependencies**: None
- This change does not depend on any other in-progress changes

**Downstream Dependencies**: None
- No other code depends on `renderRPAITVisualization()`
- CSS classes being removed are not referenced elsewhere

**External Dependencies**: None
- No third-party libraries affected

---

## Timeline Estimate

**Total Estimated Time**: 30 minutes

| Phase | Task | Time |
|-------|------|------|
| 1 | Remove JavaScript function and call | 5 min |
| 2 | Remove CSS styles | 10 min |
| 3 | Test on multiple screen sizes | 10 min |
| 4 | Verify no regressions | 5 min |

**Complexity**: Low
**Risk Level**: Low
