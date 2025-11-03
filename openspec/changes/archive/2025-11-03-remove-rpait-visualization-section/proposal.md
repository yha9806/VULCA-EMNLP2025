# Proposal: Remove RPAIT Visualization Section

**Change ID**: `remove-rpait-visualization-section`
**Created**: 2025-11-03
**Status**: Proposed

---

## Why

The RPAIT dimension analysis visualization in the gallery hero (`artwork-rpait-visualization`) is redundant and unnecessary for the following reasons:

1. **Content Duplication**: Each individual critique panel already displays full RPAIT scores (R, P, A, I, T) with detailed breakdowns, making the aggregated view redundant
2. **Visual Clutter**: The section occupies significant vertical space (frosted glass container with padding and 5 dimension bars) that could be better used for artwork display and critiques
3. **Information Overload**: Users viewing the gallery already see RPAIT information in:
   - Individual critique panels (bottom of each critique)
   - Data visualization section further down the page (comprehensive charts and heatmaps)
4. **User Feedback**: The user explicitly reported "这个部分的内容冗余了，需要删掉" (This section is redundant and needs to be removed)

## What Changes

Remove the RPAIT dimension analysis visualization section from the gallery hero area.

### Scope

**Modified Components**:
- `js/gallery-hero.js` - Remove `renderRPAITVisualization()` function and its call
- `styles/main.css` - Remove CSS for `.artwork-rpait-visualization`, `.rpait-title`, `.rpait-grid`, and `.rpait-bar` elements specific to this section

**Impact Analysis**:
- **Visual**: Cleaner gallery hero layout, more focus on artwork and critiques
- **Performance**: Slightly improved rendering (one less DOM manipulation function)
- **User Experience**: Reduced information overload, streamlined content flow
- **Data Integrity**: No loss of information - RPAIT data still visible in critique panels and data visualization section

### Non-Goals

- Do NOT remove RPAIT information from individual critique panels
- Do NOT remove RPAIT data from the data visualization section below
- Do NOT remove RPAIT dimensions display from `pages/critics.html`
- Do NOT modify RPAIT calculation logic in `js/data.js`

---

## How

### Implementation Steps

1. **JavaScript Cleanup** (`js/gallery-hero.js`):
   - Remove `renderRPAITVisualization()` function (lines 152-252)
   - Remove call to `renderRPAITVisualization(carousel)` in main render function (line 48)
   - Update console logs if needed

2. **CSS Cleanup** (`styles/main.css`):
   - Remove `.artwork-rpait-visualization` styles (lines 1433-1440)
   - Remove `.rpait-title` styles (lines 1442-1448)
   - Remove `.rpait-grid` and `.rpait-bar` styles if they are only used by this section
   - Keep scroll-reveal animation for `.artwork-rpait-visualization` removal (lines 1813-1815) as cleanup

3. **Validation**:
   - Verify gallery hero still renders correctly without RPAIT visualization
   - Verify critique panels still show RPAIT information
   - Verify data visualization section still displays comprehensive charts
   - Test on multiple screen sizes (mobile, tablet, desktop)

### Risk Assessment

**Low Risk** ✅
- Simple removal of isolated feature
- No dependencies on removed code from other modules
- RPAIT data is preserved in multiple other locations
- Easy to rollback if needed (git revert)

---

## Success Criteria

- [ ] Gallery hero displays without RPAIT visualization section
- [ ] Critique panels continue to show RPAIT scores
- [ ] Data visualization section continues to work correctly
- [ ] No JavaScript console errors
- [ ] No broken CSS layout
- [ ] Responsive design still works on all breakpoints
- [ ] Page load performance improved or unchanged
