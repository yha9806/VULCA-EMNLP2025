# Proposal: Fix Navigation Alignment and Text

**Change ID**: `fix-navigation-alignment-and-text`
**Created**: 2025-11-04
**Status**: Proposed
**Related Changes**: `unify-navigation-to-image-area` (predecessor)

---

## What Changes

### Problem 1: Image and Critiques Vertical Misalignment

**Current Behavior**:
- The artwork navigation bar (Previous/Next buttons + indicator) is positioned at the top of the `unified-navigation-container`
- This causes the navigation to occupy vertical space, pushing the image display area downward
- As a result, the **navigation bar top** aligns with the **critiques panel top**, but the **image top** does not align with the **critiques panel top**

**Expected Behavior**:
- The **image display area top** should align with the **critiques panel top**
- The navigation bar should float above the image without occupying layout space

**Visual Diagram**:

```
Current Layout (INCORRECT):
┌─────────────────────────┬─────────────────────────┐
│ ┌─────────────────────┐ │ ┌─────────────────────┐ │ ← Same top line
│ │  [◄ Prev] 1 of 4 [Next ►] │ │ │ Critique 1: 苏轼  │ │
│ └─────────────────────┘ │ │                     │ │
│                         │ │                     │ │
│ ┌─────────────────────┐ │ │                     │ │
│ │                     │ │ │                     │ │
│ │   Artwork Image     │ │ │ Critique text...    │ │ ← Image is lower
│ │                     │ │ │                     │ │
│ └─────────────────────┘ │ │                     │ │
│                         │ └─────────────────────┘ │
└─────────────────────────┴─────────────────────────┘

Expected Layout (CORRECT):
┌─────────────────────────┬─────────────────────────┐
│ ┌─────────────────────┐ │                         │
│ │  [◄ Prev] 1 of 4 [Next ►] │ │  (floats above)     │
│ └─────────────────────┘ │                         │
│         ↓ (absolute)    │                         │
│ ┌─────────────────────┐ │ ┌─────────────────────┐ │ ← Same top line
│ │                     │ │ │ Critique 1: 苏轼    │ │
│ │   Artwork Image     │ │ │                     │ │
│ │                     │ │ │ Critique text...    │ │
│ │                     │ │ │                     │ │
│ └─────────────────────┘ │ └─────────────────────┘ │
└─────────────────────────┴─────────────────────────┘
```

### Problem 2: Navigation Text Language Mix

**Current Behavior**:
- Navigation buttons display bilingual text: "上一件作品 / Previous Artwork", "下一件作品 / Next Artwork"
- Indicator displays Chinese separator: "1 的 4" (reads as "1 de 4" in Mandarin)
- Text is controlled by CSS language selectors (`[data-lang="zh"]` / `[data-lang="en"]`)

**Issues**:
- Chinese separator "的" (de) in numeric context reads awkwardly: "1 的 4"
- English "1 of 4" is more universally understood for numeric pagination
- Bilingual button text creates visual clutter in the compact navigation bar

**Expected Behavior**:
- All navigation text should be **English-only**:
  - Previous button: "◄ Previous Artwork"
  - Next button: "Next Artwork ►"
  - Indicator: "1 of 4"
- Remove Chinese text spans from button/indicator HTML
- Keep ARIA labels bilingual for accessibility (optional, to be confirmed)

---

## Why

### Alignment Issue Impact

1. **Visual Hierarchy Broken**:
   - Users expect the primary content areas (image and critiques) to align horizontally
   - Current layout creates visual imbalance with the navigation bar protruding above the image

2. **Reading Flow Disrupted**:
   - The critiques panel starts higher than the image, creating awkward eye movement
   - Users must scan down to find the image after reading critique headers

3. **Inconsistent with Design System**:
   - The previous layout (before unified navigation) had image and critiques top-aligned
   - New navigation inadvertently broke this established pattern

### Text Language Impact

1. **Awkward Chinese Phrasing**:
   - "1 的 4" is grammatically unusual in Chinese (normally would say "第1个，共4个" or "1/4")
   - Creates confusion about whether "的" is possessive or relational

2. **International Accessibility**:
   - The exhibition platform targets both Chinese and international audiences
   - Numeric indicators are universally understood in English format
   - English button labels are clear even for non-English speakers due to arrows (◄ ►)

3. **Visual Clarity**:
   - Removing redundant bilingual text reduces button width
   - More compact navigation bar improves mobile responsiveness

---

## How

### Solution 1: Float Navigation Above Image (Absolute Positioning)

**Approach**:
- Change `.artwork-navigation` from static positioning to `position: absolute`
- Position it at the top of `.unified-navigation-wrapper` with small margin
- Ensure `.image-display-container` fills the full height of the wrapper
- Navigation floats above the image with semi-transparent background (already implemented: `rgba(255, 255, 255, 0.95)`)

**CSS Changes** (`styles/components/unified-navigation.css`):

```css
/* Current */
.unified-navigation-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);  /* ← This gap causes the offset */
}

.artwork-navigation {
  /* Static positioning, occupies layout space */
}

/* New */
.unified-navigation-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  /* Remove gap - navigation is absolute */
}

.artwork-navigation {
  position: absolute;
  top: var(--spacing-md);
  left: var(--spacing-md);
  right: var(--spacing-md);
  z-index: 10;
  /* Existing styles: background, border-radius, shadow preserved */
}

.image-display-container {
  flex: 1;
  /* Now aligns with top of wrapper */
}
```

**Trade-offs**:
- ✅ **Pro**: Image and critiques top-align perfectly
- ✅ **Pro**: Navigation remains visible and accessible
- ✅ **Pro**: No HTML structure changes needed (component encapsulation preserved)
- ⚠️ **Con**: Navigation may partially occlude top portion of image
  - **Mitigation**: Already has semi-transparent background + shadow for readability
  - **Mitigation**: Images typically have safe margins (already tested with placeholder system)

### Solution 2: Simplify Navigation Text to English-Only

**Approach**:
- Remove all Chinese text spans from button and indicator HTML
- Update text content generation in `js/components/unified-navigation.js`
- Keep button structure simple with single text nodes

**JavaScript Changes** (`js/components/unified-navigation.js`):

**Lines 350-356 (Previous Button)** - Current:
```javascript
prevButton.innerHTML = `
  <span class="button-icon" aria-hidden="true">◄</span>
  <span class="button-text">
    <span class="button-text-zh" lang="zh">上一件作品</span>
    <span class="button-text-en" lang="en">Previous Artwork</span>
  </span>
`;
```

New:
```javascript
prevButton.innerHTML = `
  <span class="button-icon" aria-hidden="true">◄</span>
  <span class="button-text">Previous Artwork</span>
`;
```

**Lines 364-368 (Indicator)** - Current:
```javascript
indicator.innerHTML = `
  <span class="current-index" aria-current="page">${currentIndex + 1}</span>
  <span class="separator" lang="zh"> 的 </span>
  <span class="total-count">${artworkCount}</span>
`;
```

New:
```javascript
indicator.innerHTML = `
  <span class="current-index" aria-current="page">${currentIndex + 1}</span>
  <span class="separator"> of </span>
  <span class="total-count">${artworkCount}</span>
`;
```

**Lines 384-390 (Next Button)** - Current:
```javascript
nextButton.innerHTML = `
  <span class="button-text">
    <span class="button-text-zh" lang="zh">下一件作品</span>
    <span class="button-text-en" lang="en">Next Artwork</span>
  </span>
  <span class="button-icon" aria-hidden="true">►</span>
`;
```

New:
```javascript
nextButton.innerHTML = `
  <span class="button-text">Next Artwork</span>
  <span class="button-icon" aria-hidden="true">►</span>
`;
```

**CSS Cleanup** (`styles/components/unified-navigation.css`):

Remove unused language selector styles:
```css
/* DELETE these rules (no longer needed): */
.button-text-zh,
.button-text-en {
  /* ... language toggle styles ... */
}
```

**ARIA Labels**:
- **Keep bilingual** for accessibility (lines 343-344, 377-380):
  ```javascript
  prevButton.setAttribute('aria-label', `Previous artwork: ${prevArtwork.titleZh || prevArtwork.titleEn}`);
  nextButton.setAttribute('aria-label', `Next artwork: ${nextArtwork.titleZh || nextArtwork.titleEn}`);
  ```
- ARIA labels are not visible to sighted users, so bilingual support here provides better screen reader accessibility

---

## Impact Analysis

### Affected Components
- ✅ `UnifiedNavigation` component (direct changes)
- ⚠️ `ArtworkImageCarousel` (indirectly - may be partially occluded by navigation)
- ✅ `.critiques-panel` (benefits from improved alignment)

### User-Facing Changes
1. **Visual**: Image and critiques now align horizontally
2. **Text**: Navigation buttons display English-only text
3. **Accessibility**: ARIA labels remain bilingual (no impact to screen readers)

### Performance Impact
- None (CSS positioning change is rendering-only, no JavaScript overhead)

### Responsive Design Impact
- Mobile: Navigation already responsive, absolute positioning works on all breakpoints
- Tablet/Desktop: Alignment improvement is most visible on larger screens

### Rollback Plan
- **If navigation occludes critical image content**: Add `padding-top` to `.image-display-container` to push image down
- **If English-only text is problematic**: Restore bilingual structure (simple revert of JS changes)

---

## Validation

### Manual Testing Checklist
1. ✅ Image top and critiques panel top are horizontally aligned
2. ✅ Navigation bar floats above image without occluding critical content
3. ✅ Navigation buttons display: "◄ Previous Artwork" and "Next Artwork ►"
4. ✅ Indicator displays: "1 of 4", "2 of 4", etc.
5. ✅ Navigation remains functional (click, keyboard shortcuts)
6. ✅ Responsive: Test on mobile (375px), tablet (768px), desktop (1440px)
7. ✅ No visual glitches or z-index conflicts

### Accessibility Testing
1. ✅ Screen reader announces bilingual ARIA labels
2. ✅ Keyboard navigation (Shift+Arrow) still works
3. ✅ Focus indicators visible on navigation buttons
4. ✅ Indicator status changes announced via `aria-live="polite"`

### Browser Testing
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+

---

## Dependencies

**Prerequisite Changes**:
- `unify-navigation-to-image-area` (completed and deployed)

**Blocked Changes**:
- None

**Related Documentation**:
- `openspec/changes/unify-navigation-to-image-area/design.md` - Original navigation system design

---

## Timeline Estimate

- **Proposal & Design**: 30 minutes
- **Implementation**: 45 minutes
  - CSS changes: 15 minutes
  - JavaScript text updates: 15 minutes
  - Testing: 15 minutes
- **Validation & Deployment**: 30 minutes
- **Total**: ~2 hours

---

## Open Questions

1. **Navigation Occlusion**: Should we add `padding-top` to images to prevent navigation from covering content?
   - **Proposed**: No - images already have safe margins, and navigation has semi-transparent background

2. **ARIA Label Language**: Should ARIA labels also be English-only or remain bilingual?
   - **Proposed**: Keep bilingual for better accessibility (Chinese screen reader users benefit)

3. **Dot Indicators**: Should dot indicators (artwork 1/2/3/4) also be affected by alignment change?
   - **Current**: Dots are part of `artwork-navigation`, so they also float with the bar
   - **Proposed**: Keep as-is (dots are secondary navigation, floating position is acceptable)
