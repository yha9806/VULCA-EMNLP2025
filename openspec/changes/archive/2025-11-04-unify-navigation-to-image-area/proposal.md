# Unify Navigation to Image Area

**Status**: Proposed
**Priority**: Medium
**Estimated Effort**: 8-12 hours
**Created**: 2025-11-04
**Author**: User Request (UX Optimization)

---

## Problem Statement

### Current Situation

The exhibition platform currently has **two separate navigation systems** that appear visually similar but control different content layers:

1. **Bottom Navigation Bar** (`.gallery-nav`)
   - Location: Fixed at bottom of viewport (auto-hide on desktop)
   - Controls: Switches between 4 artworks (artwork-1 → artwork-2 → ...)
   - Components: ◄ ► buttons, "1 的 4" indicator, dot navigation

2. **Image Carousel Controls** (`artwork-carousel`)
   - Location: Overlaid on artwork images
   - Controls: Switches between multiple images of a single artwork (img-1-1 → img-1-2 → ...)
   - Components: ◄ ► buttons (only visible for multi-image artworks)

### User Confusion

**Issue**: Users report that the two navigation systems look similar and create confusion:
- Both use `◄ ►` button icons
- Visual distinction is insufficient
- Users are unsure which buttons control which content layer
- The bottom bar appears redundant when viewing artwork-1 (which has 6 images)

**Root Cause**:
- Information architecture has 2 layers (Artwork → Images) but navigation design doesn't clearly communicate this hierarchy
- Only artwork-1 has multiple images, so image-level navigation only appears on first artwork
- Bottom bar is hidden by default on desktop, creating discovery issues

---

## Proposed Solution

### High-Level Approach

**Unify all navigation controls to the image area** by creating a **dual-layer navigation system** that clearly separates artwork-level and image-level controls.

### What Changes

#### 1. Remove Bottom Navigation Bar
- Delete `.gallery-nav` component from `index.html` (lines 123-140)
- Remove `js/navigation-autohide.js` module
- Remove related CSS styles from `main.css` (lines 1498-1562)
- Remove event handlers in `index.html` (lines 401-419)

#### 2. Add Unified Navigation Component
- Create new `js/components/unified-navigation.js` module
- Add to `artwork-image-container` area:
  - **Outer layer** (Artwork navigation): Always visible, switches between artworks
  - **Inner layer** (Image navigation): Conditionally visible, switches images within current artwork
- Include progress indicators for both layers
- Preserve all keyboard navigation and ARIA attributes

#### 3. Visual Design Hierarchy

```
┌─────────────────────────────────────────────────────┐
│ [◄ 上一件作品]  Artwork Title  [下一件作品 ►]       │ ← Outer layer (Artwork)
│                 1 / 4 artworks                      │
├─────────────────────────────────────────────────────┤
│        ┌───────────────────────────────┐            │
│   [◄]  │    Artwork Image Display     │  [►]       │ ← Inner layer (Images)
│        │   (Multi-Image Carousel)      │            │    (Only for multi-image artworks)
│        └───────────────────────────────┘            │
│               ● ● ○ ○ ○ ○                           │ ← Image dots
│          "Initial Concept Sketch"                   │
│             Image 1 of 6                            │
└─────────────────────────────────────────────────────┘
```

**Key Visual Distinctions**:
- Outer layer: Larger buttons with text labels ("上一件作品" / "Previous Artwork")
- Inner layer: Smaller icon-only buttons (reuse existing carousel buttons)
- Clear spatial separation: Outer layer wraps the entire image area

---

## Why This Solution

### Benefits

1. **Eliminates User Confusion**
   - Single unified navigation area
   - Clear visual hierarchy (outer vs inner)
   - Consistent location for all navigation controls

2. **Improves Discoverability**
   - Artwork navigation always visible (no auto-hide)
   - Progress indicators immediately visible
   - Users understand they can navigate both layers

3. **Maintains Immersive Experience**
   - Removes bottom bar (which breaks immersion)
   - All controls integrated with artwork display
   - More screen space for content

4. **Mobile-Friendly**
   - Single touch target area
   - No need for bottom bar on small screens
   - Natural swipe gestures can be added later

### Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Accessibility regression** | High | Implement full keyboard navigation (Tab, Arrow keys) and ARIA attributes in new component |
| **Increased visual complexity** | Medium | Use clear visual design (size, color, labels) to distinguish layers |
| **Development time** | Medium | Break into small incremental tasks, preserve existing carousel logic |
| **Testing on multiple devices** | Medium | Create comprehensive test plan for desktop, tablet, mobile |

---

## Impact Analysis

### Files to Modify

**To Remove**:
- `index.html` (lines 123-140): `.gallery-nav` section
- `index.html` (lines 401-419): Navigation event handlers
- `js/navigation-autohide.js`: Entire module (delete)
- `styles/main.css` (lines 1498-1562): `.gallery-nav` styles

**To Create**:
- `js/components/unified-navigation.js`: New unified navigation component
- `styles/components/unified-navigation.css`: Component styles

**To Modify**:
- `js/gallery-hero.js`: Update to use new navigation component
- `js/carousel.js`: Expose navigation methods for unified component
- `index.html`: Replace old navigation with new component placeholder

### Dependencies

- **Depends on**:
  - `window.carousel` (existing artwork carousel controller)
  - `window.ArtworkImageCarousel` (existing image carousel component)
  - `window.langManager` (for bilingual labels)

- **Breaking Changes**: None (internal refactor, no API changes)

### Backward Compatibility

- No changes to `VULCA_DATA` structure
- No changes to existing URL parameters or routing
- All existing event listeners preserved (just different DOM elements)

---

## Success Criteria

1. **Functional**:
   - Users can navigate between all 4 artworks using outer layer controls
   - Users can navigate between images (for multi-image artworks) using inner layer controls
   - Progress indicators accurately reflect current state
   - All navigation methods work: mouse click, keyboard (Tab, Enter, Arrow keys), touch

2. **Visual**:
   - Clear visual distinction between outer and inner navigation layers
   - Responsive design works on all breakpoints (375px, 768px, 1024px, 1440px)
   - Animations smooth (no jank, < 300ms transitions)

3. **Accessibility**:
   - WCAG 2.1 AA compliance maintained
   - Keyboard navigation fully functional
   - Screen readers correctly announce navigation state
   - Focus management clear and logical

4. **Performance**:
   - No impact on page load time
   - Navigation response time < 100ms
   - No memory leaks (proper event cleanup)

---

## Open Questions

1. **Keyboard Shortcuts**: Should we add keyboard shortcuts for artwork navigation? (e.g., `Shift + Arrow` for artworks, plain `Arrow` for images)

2. **Mobile Gestures**: Should we implement swipe gestures for navigation on mobile? (Separate from this change, but worth considering)

3. **Animation Direction**: Should artwork transitions use fade or slide? (Image carousel uses fade by default)

4. **Artwork Indicator Style**: Keep numeric "1 / 4" or switch to dot-based like images?

---

## Next Steps

1. Review and approve this proposal
2. Create detailed design document (architecture decisions)
3. Write comprehensive specs with BDD scenarios
4. Break down into small executable tasks
5. Implement in phases (Phase 1: Basic structure, Phase 2: Styling, Phase 3: Accessibility)
6. Test on multiple devices and browsers
7. Deploy and monitor user feedback
