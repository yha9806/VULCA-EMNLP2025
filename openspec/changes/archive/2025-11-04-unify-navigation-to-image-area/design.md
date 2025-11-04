# Design Document: Unified Navigation System

**Change ID**: `unify-navigation-to-image-area`
**Last Updated**: 2025-11-04

---

## Architecture Overview

### Current Architecture (Before)

```
┌──────────────────────────────────────────┐
│  index.html                              │
│  ├─ .artwork-display                     │
│  │  ├─ #artwork-image-container          │
│  │  │  └─ ArtworkImageCarousel           │ ← Inner navigation (images)
│  │  │     └─ .carousel-btn-prev/next     │
│  │  └─ #critiques-panel                  │
│  └─ .gallery-nav (fixed bottom)          │ ← Outer navigation (artworks)
│     ├─ #nav-prev / #nav-next             │
│     ├─ .artwork-indicator (1 的 4)       │
│     └─ .artwork-dots (4 dots)            │
└──────────────────────────────────────────┘

State Management:
- window.carousel.currentIndex → Artwork state
- ArtworkImageCarousel.currentIndex → Image state (per-artwork)
```

### Proposed Architecture (After)

```
┌──────────────────────────────────────────┐
│  index.html                              │
│  └─ .artwork-display                     │
│     ├─ UnifiedNavigationWrapper          │ ← NEW: Unified component
│     │  ├─ ArtworkNavigation (Outer)      │    Controls artworks
│     │  │  ├─ #unified-artwork-prev       │
│     │  │  ├─ .artwork-title-display      │
│     │  │  ├─ #unified-artwork-next       │
│     │  │  └─ .artwork-indicator          │
│     │  └─ ImageDisplayContainer          │
│     │     ├─ ArtworkImageCarousel        │    Controls images
│     │     │  └─ .carousel-btn-prev/next  │
│     │     └─ .image-metadata             │
│     └─ #critiques-panel                  │
└──────────────────────────────────────────┘

State Management (unchanged):
- window.carousel → Artwork state
- ArtworkImageCarousel → Image state
```

---

## Design Decisions

### Decision 1: Single Component vs Two Separate Components

**Options Considered**:

**A. Single Unified Component** (Chosen)
```javascript
class UnifiedNavigation {
  constructor(artworkCarousel, imageCarousel) {
    this.artworkNav = new ArtworkNavigationLayer(artworkCarousel);
    this.imageNav = imageCarousel; // Reuse existing
  }
}
```

**B. Two Independent Components**
```javascript
// Separate outer and inner, coordinated via events
new ArtworkNavigation();
new ArtworkImageCarousel(); // Existing
```

**Decision**: Choose **Option A** (Single Unified Component)

**Reasoning**:
- ✅ Clearer ownership: One component manages entire navigation area
- ✅ Easier state coordination: Direct access to both layers
- ✅ Simpler event handling: Internal communication, no global events
- ✅ Better encapsulation: All navigation logic in one module
- ❌ Slightly larger component (but still < 500 lines)

---

### Decision 2: DOM Structure - Wrapper vs Sibling

**Options Considered**:

**A. Wrapper Structure** (Chosen)
```html
<div class="unified-navigation-wrapper">
  <!-- Outer layer -->
  <div class="artwork-navigation">...</div>
  <!-- Inner layer (existing carousel) -->
  <div id="artwork-image-container">
    <ArtworkImageCarousel />
  </div>
</div>
```

**B. Sibling Structure**
```html
<div class="artwork-navigation">...</div>
<div id="artwork-image-container">
  <ArtworkImageCarousel />
</div>
```

**Decision**: Choose **Option A** (Wrapper Structure)

**Reasoning**:
- ✅ Clear visual hierarchy: Outer layer visually wraps inner layer
- ✅ CSS layout easier: Flexbox/Grid on wrapper
- ✅ Future-proof: Easier to add more layers or features
- ✅ Semantic HTML: Container represents "navigation area"
- ❌ One extra DOM level (negligible performance impact)

---

### Decision 3: Reuse Existing Carousel vs Build from Scratch

**Options Considered**:

**A. Reuse `ArtworkImageCarousel`** (Chosen)
- Keep existing component for inner layer
- Build only the outer layer (artwork navigation)

**B. Build New Unified Component from Scratch**
- Rewrite both layers in single component
- More control, but more work

**Decision**: Choose **Option A** (Reuse Existing Carousel)

**Reasoning**:
- ✅ Minimize changes: `ArtworkImageCarousel` is battle-tested
- ✅ Faster development: Only build outer layer (~ 4-5 hours)
- ✅ Less risk: No need to re-implement image carousel logic
- ✅ Backward compatible: Existing carousel tests still pass
- ❌ Slightly less integrated (but acceptable)

---

### Decision 4: Artwork Navigation Button Style

**Options Considered**:

**A. Text Buttons with Icons** (Chosen)
```html
<button class="artwork-nav-prev">
  <svg>◄</svg>
  <span lang="zh">上一件作品</span>
  <span lang="en">Previous Artwork</span>
</button>
```

**B. Icon-Only Buttons with Tooltip**
```html
<button class="artwork-nav-prev" title="上一件作品">
  <svg>◄</svg>
</button>
```

**C. Large Text-Only Links**
```html
<a href="#artwork-0" class="artwork-nav-prev">
  上一件作品 / Previous Artwork
</a>
```

**Decision**: Choose **Option A** (Text Buttons with Icons)

**Reasoning**:
- ✅ Maximum clarity: Text label explicitly states function
- ✅ Bilingual support: Matches existing pattern in site
- ✅ Accessible: No reliance on tooltips for primary label
- ✅ Distinctive: Text differentiates from image carousel's icon-only buttons
- ❌ Takes more space (but we have room after removing bottom bar)

---

### Decision 5: Artwork Indicator Position

**Options Considered**:

**A. Inside Artwork Navigation Bar** (Chosen)
```
[◄ 上一件作品]  Artwork Title  1 / 4  [下一件作品 ►]
```

**B. Separate Row Above Image**
```
[◄ 上一件作品]  Artwork Title  [下一件作品 ►]
              1 / 4 artworks
┌────────────────────────────────────┐
│          Image Area                │
```

**C. Floating Badge**
```
        ┌─────┐
        │ 1/4 │  ← Floating badge
[◄ 上一件作品]  Artwork Title  [下一件作品 ►]
```

**Decision**: Choose **Option A** (Inside Navigation Bar)

**Reasoning**:
- ✅ Compact: Single row, less vertical space
- ✅ Grouped information: All artwork navigation in one place
- ✅ Consistent with removed bottom bar (which had indicator inline)
- ❌ Slightly more crowded (but still readable at 768px+)

---

### Decision 6: Keyboard Navigation Strategy

**Options Considered**:

**A. Context-Aware Arrow Keys** (Chosen)
- Plain `Arrow Left/Right`: Navigate images (if multi-image artwork)
- `Shift + Arrow Left/Right`: Navigate artworks
- `Tab`: Cycle through focusable elements

**B. Separate Keys**
- `Arrow Left/Right`: Artworks
- `Alt + Arrow Left/Right`: Images
- `Tab`: Cycle through focusable elements

**C. Tab-Only (No Arrow Keys)**
- `Tab`: Cycle to prev/next buttons
- `Enter/Space`: Activate button

**Decision**: Choose **Option A** (Context-Aware Arrow Keys)

**Reasoning**:
- ✅ Intuitive: Arrow keys work "within current context"
- ✅ Power users: Shift modifier for "outer" navigation is common pattern
- ✅ Fallback: Tab still works for users who don't know shortcuts
- ✅ Matches existing carousel behavior (arrow keys for images)
- ❌ Requires documentation (add help tooltip)

---

### Decision 7: Mobile Touch Gestures

**Options Considered**:

**A. No Gestures in v1, Add Later** (Chosen)
- Phase 1: Button-only navigation
- Phase 2 (future): Add swipe gestures

**B. Implement Gestures Immediately**
- Swipe left/right on image area → Next/prev artwork
- Swipe up/down → Next/prev image (if multi-image)

**Decision**: Choose **Option A** (No Gestures in v1)

**Reasoning**:
- ✅ Faster delivery: Focus on core functionality first
- ✅ Less risk: Avoid touch event conflicts with carousel
- ✅ Buttons work fine on mobile: Large touch targets
- ❌ Gestures would be nice (but not critical for v1)

**Future Enhancement**: Add in separate OpenSpec change after v1 stabilizes

---

### Decision 8: Animation Strategy

**Options Considered**:

**A. Fade Transition for Both Layers** (Chosen)
```css
.artwork-display {
  transition: opacity 300ms ease-in-out;
}
```

**B. Slide Transition for Artworks, Fade for Images**
```css
.artwork-display {
  transition: transform 400ms ease-out; /* Slide */
}
.carousel-image {
  transition: opacity 300ms ease-in-out; /* Fade */
}
```

**C. No Animations (Instant)**

**Decision**: Choose **Option A** (Fade Transition for Both)

**Reasoning**:
- ✅ Consistent: Same animation for both layers
- ✅ Lightweight: Opacity is GPU-accelerated
- ✅ Works well with stacked content: No layout shifts
- ✅ Existing carousel uses fade: Reuse same timing
- ❌ Less distinctive (but consistency is more important)

---

## Component API Design

### UnifiedNavigation Class

```typescript
class UnifiedNavigation {
  constructor(options: {
    container: HTMLElement;           // DOM element to render into
    artworkCarousel: ArtworkCarousel; // Existing carousel controller
    showImageNav: boolean;            // Show inner layer (default: true)
  })

  // Public Methods
  render(): void;
  destroy(): void;
  updateArtwork(index: number): void;
  updateImage(index: number): void;

  // Event Emitters
  on(event: 'artwork:change', callback: (index: number) => void): void;
  on(event: 'image:change', callback: (index: number) => void): void;
}
```

### Integration with Existing Code

```javascript
// In gallery-hero.js (modified)
function renderArtworkImage(carousel) {
  const container = document.getElementById('artwork-image-container');
  const artwork = carousel.getCurrentArtwork();

  // NEW: Wrap with unified navigation
  const unifiedNav = new UnifiedNavigation({
    container: container,
    artworkCarousel: carousel,
    showImageNav: artwork.images && artwork.images.length > 1
  });

  unifiedNav.render();

  // Listen to navigation events
  unifiedNav.on('artwork:change', (index) => {
    carousel.goTo(index);
  });
}
```

---

## Accessibility Requirements

### ARIA Attributes

```html
<!-- Outer layer (Artwork navigation) -->
<nav class="artwork-navigation"
     aria-label="Artwork navigation"
     role="navigation">

  <button id="unified-artwork-prev"
          aria-label="Previous artwork: 绘画操作单元（第一代）"
          aria-controls="artwork-image-container">
    ◄ <span>上一件作品</span>
  </button>

  <div class="artwork-indicator"
       role="status"
       aria-live="polite">
    <span aria-current="page">1</span>
    <span>的</span>
    <span>4</span>
  </div>

  <button id="unified-artwork-next"
          aria-label="Next artwork: 绘画操作单元（第一代）">
    <span>下一件作品</span> ►
  </button>
</nav>

<!-- Inner layer (Image carousel - existing) -->
<div class="carousel-wrapper"
     aria-roledescription="Artwork image carousel">
  <!-- ArtworkImageCarousel component (unchanged) -->
</div>
```

### Focus Management

**Tab Order**:
1. Artwork prev button (`#unified-artwork-prev`)
2. Artwork next button (`#unified-artwork-next`)
3. Image carousel prev button (`.carousel-btn-prev`)
4. Image carousel next button (`.carousel-btn-next`)
5. Image indicator dots (`.carousel-indicator button`)
6. Critique panels (existing)

**Focus Styles**:
```css
.unified-navigation button:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 4px;
}
```

---

## CSS Architecture

### File Organization

**Create**: `styles/components/unified-navigation.css`
```css
/* Unified Navigation Component Styles */

/* Wrapper container */
.unified-navigation-wrapper { ... }

/* Outer layer: Artwork navigation */
.artwork-navigation { ... }
.artwork-nav-button { ... }
.artwork-indicator { ... }

/* Inner layer: Image container */
.image-display-container { ... }

/* Responsive breakpoints */
@media (max-width: 768px) { ... }
@media (max-width: 599px) { ... }
```

### Visual Hierarchy

**Size Scale**:
- Outer buttons: `font-size: 1rem; padding: 12px 24px`
- Inner buttons: `font-size: 0.875rem; padding: 8px 16px` (existing)

**Color Contrast**:
- Outer buttons: `border: 2px solid var(--color-text); background: rgba(255,255,255,0.9)`
- Inner buttons: `border: 1px solid rgba(255,255,255,0.5); background: rgba(0,0,0,0.3)` (existing)

---

## Testing Strategy

### Unit Tests

```javascript
describe('UnifiedNavigation', () => {
  it('should render outer navigation for all artworks');
  it('should render inner navigation only for multi-image artworks');
  it('should call carousel.goTo() when artwork button clicked');
  it('should update ARIA labels when artwork changes');
  it('should handle keyboard shortcuts (Shift + Arrow)');
  it('should emit artwork:change event');
  it('should clean up event listeners on destroy()');
});
```

### Integration Tests

- Verify artwork navigation works across all 4 artworks
- Verify image navigation works for artwork-1 (6 images)
- Verify image navigation hidden for artwork-2/3/4 (single image)
- Verify language toggle updates button labels
- Verify responsive layout at 375px, 768px, 1024px

### Accessibility Tests

- Run axe-core automated tests
- Manual keyboard navigation test (no mouse)
- Screen reader test (NVDA/JAWS on Windows, VoiceOver on Mac)
- Color contrast check (WCAG AA: 4.5:1 for text)

---

## Performance Considerations

### Bundle Size Impact

**Removed**:
- `navigation-autohide.js`: ~3.2 KB (minified)

**Added**:
- `unified-navigation.js`: ~4.5 KB (minified)
- `unified-navigation.css`: ~1.2 KB (minified)

**Net Impact**: +2.5 KB (~0.3% of total bundle)

### Runtime Performance

- **DOM Nodes**: -15 nodes (removed bottom bar) + 10 nodes (new outer layer) = **-5 nodes**
- **Event Listeners**: -8 listeners (bottom bar) + 6 listeners (outer layer) = **-2 listeners**
- **Paint Operations**: No change (same number of repaints on navigation)

---

## Rollback Plan

If critical issues are discovered after deployment:

1. **Quick Rollback** (< 5 minutes):
   ```bash
   git revert <commit-hash>
   git push origin master
   ```

2. **Manual Rollback** (if needed):
   - Restore `index.html` lines 123-140 (`.gallery-nav`)
   - Restore `js/navigation-autohide.js`
   - Restore CSS styles
   - Restore event handlers
   - Remove `unified-navigation.js`

3. **Feature Flag** (for gradual rollout):
   ```javascript
   if (window.USE_UNIFIED_NAV) {
     // New unified navigation
   } else {
     // Old bottom bar navigation (fallback)
   }
   ```

---

## Future Enhancements (Out of Scope for v1)

1. **Touch Gestures** (Phase 2):
   - Swipe left/right to navigate artworks
   - Swipe up/down to navigate images

2. **Keyboard Shortcuts Panel** (Phase 3):
   - Help button showing all keyboard shortcuts
   - Floating tooltip: "Press Shift + → for next artwork"

3. **Animation Variants** (Phase 4):
   - User preference: Fade vs Slide vs None
   - localStorage persistence

4. **URL Sync** (Phase 5):
   - Update URL hash on navigation: `#artwork-2`
   - Support deep linking: `/index.html#artwork-3`

---

## References

- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **ARIA Authoring Practices**: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
- **Existing Carousel Implementation**: `js/components/artwork-carousel.js`
- **Existing Carousel Controller**: `js/carousel.js`
