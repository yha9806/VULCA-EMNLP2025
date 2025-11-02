# Design: Fix Responsive Layout Issues

## Architecture Overview

### Current State (Problematic)
```
Mobile (375px):
┌────────────────────────────────┐
│ Gallery Hero (min-height:100vh)│ ← Forces viewport height
│ ┌────────────────────────────┐ │
│ │ Artwork (40vh)             │ │
│ └────────────────────────────┘ │
│ ┌────────────────────────────┐ │
│ │ Critiques (max-height:70vh)│ │ ← Content cutoff!
│ │ [1] [2] [3] [4] [5] [6]    │ │
│ │ ↓ HIDDEN BELOW ↓           │ │
│ └────────────────────────────┘ │
└────────────────────────────────┘

Desktop (1920px):
┌──────────────────────────────────────────────────────────┐
│  Gallery Hero                                            │
│  ┌────────────┐  ┌──────────────────────────────────┐  │
│  │  Artwork   │  │ Critiques (3-col)                 │  │
│  │  (45%)     │  │ [1]     [2]     [3]               │  │
│  │            │  │ [4]     [5]     [6]               │  │
│  │            │  │                                    │  │
│  │            │  │ ← Excessive whitespace on sides → │  │
│  └────────────┘  └──────────────────────────────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Proposed State (Fixed)
```
Mobile (375px):
┌────────────────────────────────┐
│ Gallery Hero (dynamic height) │
│ ┌────────────────────────────┐ │
│ │ Artwork (aspect-ratio:16/9)│ │ ← Proper scaling
│ └────────────────────────────┘ │
│ ┌────────────────────────────┐ │
│ │ Critiques (scrollable)     │ │ ← Full scrollability
│ │ [1]                        │ │
│ │ [2]                        │ │
│ │ [3]                        │ │
│ │ ... (scroll for more)      │ │
│ └────────────────────────────┘ │
└────────────────────────────────┘

Ultra-Wide (1920px+):
┌──────────────────────────────────────────────────────────┐
│          ┌──────────────────────────────┐                │
│          │  Gallery Hero (max:1600px)  │                │
│          │  ┌──────┐  ┌────────────┐  │                │
│          │  │Image │  │ Critiques   │  │                │
│          │  │ (35%)│  │ (4-col)     │  │                │
│          │  │      │  │ [1][2][3][4]│  │                │
│          │  │      │  │ [5][6]      │  │                │
│          │  └──────┘  └────────────┘  │                │
│          └──────────────────────────────┘                │
│  Balanced margins                                        │
└──────────────────────────────────────────────────────────┘
```

## Responsive Breakpoint Strategy

### Breakpoint Matrix

| Viewport Width | Grid Columns | Image:Critique | Max Width | Typical Devices |
|----------------|--------------|----------------|-----------|-----------------|
| 0-599px        | 1            | Stacked        | 100%      | Mobile phones   |
| 600-1023px     | 2            | 35:65          | 100%      | Tablets         |
| 1024-1365px    | 3            | 40:60          | 1400px    | Laptops         |
| 1366-1919px    | 4            | 35:65          | 1600px    | Large displays  |
| 1920px+        | 4            | 35:65          | 1600px    | Ultra-wide 4K   |

### Why These Breakpoints?

**600px** - Common tablet portrait width threshold
- iPad Mini: 744px
- Most phone landscape modes fall below this

**1024px** - Desktop/laptop threshold
- iPad landscape: 1024px
- Most laptops start at 1280px

**1366px** - Large laptop/desktop threshold
- Common resolution: 1366x768
- Allows for comfortable 4-column layout

**1920px** - Full HD and above
- Need to constrain line length for readability
- Center content with balanced margins

## Image Aspect Ratio System

### Problem
Current artwork images use height-based sizing (`min-height: 400px`, `flex: 0 0 40vh`) which:
- Distorts images when viewport changes
- Doesn't respect original artwork dimensions
- Causes unpredictable scaling

### Solution: Aspect Ratio Preservation

```css
.artwork-image-container {
  aspect-ratio: 16 / 9; /* Default for most artworks */
  overflow: hidden;
  background: var(--color-bg);
  position: relative;
}

.artwork-image-container img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Preserve aspect, no cropping */
  object-position: center;
}

/* Fallback for browsers without aspect-ratio support */
@supports not (aspect-ratio: 16 / 9) {
  .artwork-image-container {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 = 56.25% */
  }

  .artwork-image-container img {
    position: absolute;
    top: 0;
    left: 0;
  }
}
```

## Layout Constraints

### Max-Width Strategy

**Problem**: On ultra-wide screens (>2560px), content becomes unreadable:
- Line lengths exceed 120 characters
- Excessive horizontal scrolling required to scan critique cards
- Artwork-to-critique distance too far (eye strain)

**Solution**: Progressive max-width constraints

```css
/* Desktop: comfortable reading width */
@media (min-width: 1024px) {
  .gallery-hero {
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
  }
}

/* Large Desktop: increased width but still constrained */
@media (min-width: 1366px) {
  .gallery-hero {
    max-width: 1600px;
  }
}

/* Ultra-Wide: maintain 1600px, add elegant margins */
@media (min-width: 1920px) {
  .gallery-hero {
    padding-left: max(60px, calc((100vw - 1600px) / 2));
    padding-right: max(60px, calc((100vw - 1600px) / 2));
  }
}
```

## Critique Grid Optimization

### Current Issues
- Fixed 3-column grid wastes space on large screens
- 2-column grid on tablets feels cramped
- Mobile single-column is correct but needs better scrolling

### Proposed Grid System

```css
/* Mobile: Single column, full scrollability */
@media (max-width: 599px) {
  .critiques-panel {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-height: none; /* Allow natural scrolling */
  }
}

/* Tablet: 2 columns with breathing room */
@media (min-width: 600px) and (max-width: 1023px) {
  .critiques-panel {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    max-height: calc(100vh - 180px);
    overflow-y: auto;
  }
}

/* Desktop: 3 columns */
@media (min-width: 1024px) and (max-width: 1365px) {
  .critiques-panel {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
}

/* Large Desktop & Ultra-Wide: 4 columns */
@media (min-width: 1366px) {
  .critiques-panel {
    grid-template-columns: repeat(4, 1fr);
    gap: 28px;
  }
}
```

### Grid Performance Considerations

**CSS Grid vs Flexbox**:
- ✅ Grid chosen for predictable column behavior
- ✅ Better handling of uneven content heights
- ✅ Simpler gap management
- ❌ Slight overhead for very old browsers (acceptable trade-off)

**Auto-fit vs Fixed Columns**:
- ❌ `repeat(auto-fit, minmax(280px, 1fr))` causes unpredictable behavior
- ✅ Explicit column counts per breakpoint ensures consistency
- ✅ Easier to maintain and debug

## Scrolling Behavior

### Current Problem
```css
/* Current: Limits scroll to 70% of viewport */
.critiques-panel {
  max-height: 70vh;
  overflow-y: auto;
}
```
On mobile, 70vh may only show 2-3 critique cards, hiding the rest.

### Proposed Solution

```css
/* Mobile: No height restriction */
@media (max-width: 599px) {
  .critiques-panel {
    max-height: none; /* Full scrollability */
    overflow-y: visible; /* Natural document scroll */
  }
}

/* Tablet & Desktop: Constrain to viewport minus chrome */
@media (min-width: 600px) {
  .critiques-panel {
    max-height: calc(100vh - 180px); /* Account for header/footer */
    overflow-y: auto;
    scroll-behavior: smooth;
  }
}
```

**Rationale**:
- Mobile: Let users scroll the entire page naturally
- Desktop: Keep critiques in viewport with internal scrolling
- Prevents confusion about where scroll boundaries are

## Typography Scaling

### Responsive Font Sizes

Current typography uses `clamp()` which is good, but needs refinement:

```css
:root {
  /* Current */
  --size-body: clamp(12px, 1.6vw, 16px);

  /* Proposed: Tighter control */
  --size-body-mobile: clamp(14px, 4vw, 16px);
  --size-body-tablet: clamp(15px, 2vw, 17px);
  --size-body-desktop: 16px; /* Fixed at optimal reading size */
}

/* Apply per breakpoint */
@media (max-width: 599px) {
  body { font-size: var(--size-body-mobile); }
}

@media (min-width: 600px) and (max-width: 1023px) {
  body { font-size: var(--size-body-tablet); }
}

@media (min-width: 1024px) {
  body { font-size: var(--size-body-desktop); }
}
```

## Browser Compatibility

### Aspect-Ratio Support

**Native `aspect-ratio`**:
- ✅ Chrome 88+ (2021)
- ✅ Firefox 89+ (2021)
- ✅ Safari 15+ (2021)
- ✅ Edge 88+ (2021)

**Fallback for older browsers**:
```css
@supports not (aspect-ratio: 16 / 9) {
  /* Padding-bottom percentage hack */
  .artwork-image-container {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 */
    height: 0;
  }
}
```

### CSS Grid Support

**Native Grid**:
- ✅ All modern browsers (2017+)
- ❌ IE11 (partial support with `-ms-` prefix)

**Decision**: No IE11 support needed (project is modern web focused)

## Testing Strategy

### Device Matrix

| Device Category | Resolutions to Test |
|-----------------|---------------------|
| Mobile          | 375x667 (iPhone SE) |
|                 | 390x844 (iPhone 12) |
|                 | 360x800 (Android)   |
| Tablet          | 768x1024 (iPad)     |
|                 | 810x1080 (Android)  |
| Laptop          | 1280x800            |
|                 | 1366x768            |
|                 | 1440x900 (MacBook)  |
| Desktop         | 1920x1080 (Full HD) |
|                 | 2560x1440 (2K)      |
|                 | 3840x2160 (4K)      |

### Playwright Test Scenarios

```javascript
// Test mobile scrollability
await page.setViewportSize({ width: 375, height: 667 });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
// Verify: All 6 critique cards visible

// Test aspect ratio preservation
await page.setViewportSize({ width: 1920, height: 1080 });
const imageAspect = await page.evaluate(() => {
  const img = document.querySelector('.artwork-image-container img');
  return img.clientWidth / img.clientHeight;
});
// Verify: Aspect ratio ≈ 16/9 or 4/3

// Test grid columns
await page.setViewportSize({ width: 1366, height: 768 });
const columns = await page.evaluate(() => {
  const panel = document.querySelector('.critiques-panel');
  return getComputedStyle(panel).gridTemplateColumns.split(' ').length;
});
// Verify: 4 columns at 1366px
```

## Performance Impact

### Expected Improvements
- ✅ Reduced layout shift (CLS) with `aspect-ratio`
- ✅ Smoother scrolling with `scroll-behavior: smooth`
- ✅ No JS required - pure CSS performance

### Potential Concerns
- ⚠️ Additional media queries increase CSS size (~2-3KB)
- ✅ Gzip compression will minimize impact
- ✅ Modern browsers parse media queries very efficiently

## Migration Path

### Phase 1: Non-Breaking Changes (Safe)
1. Add `aspect-ratio` to images (with fallback)
2. Add max-width constraints
3. Test thoroughly

### Phase 2: Layout Adjustments (Medium Risk)
1. Modify mobile `min-height` and `max-height`
2. Add new breakpoints
3. Test across devices

### Phase 3: Grid Optimization (Low Risk)
1. Implement 4-column grid for large screens
2. Adjust gaps and spacing
3. Final polish

### Rollback Plan
- Keep original CSS in comment block
- Single commit for easy revert
- Fallback: Remove max-width constraints first, then revert grid changes
