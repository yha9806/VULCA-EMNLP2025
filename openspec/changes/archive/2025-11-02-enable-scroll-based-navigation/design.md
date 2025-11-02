# Design: Enable Scroll-Based Navigation with Fade-In Animations

## Architecture Overview

### Current State
```
┌─────────────────────────────────────┐
│ index.html                          │
│ IMMERSIVE_MODE = true               │
│ ↓                                   │
│ scroll-prevention.js                │
│ - Disables wheel events             │
│ - Disables keyboard scroll          │
│ - Disables touch scroll             │
│ - Sets overflow: hidden             │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│ Result: Content overflow hidden     │
│ - Only first viewport visible       │
│ - 6 critique cards may be cut off   │
│ - RPAIT viz may not be visible      │
└─────────────────────────────────────┘
```

### Proposed State
```
┌─────────────────────────────────────┐
│ index.html                          │
│ IMMERSIVE_MODE = false              │
│ ↓                                   │
│ scroll-prevention.js (disabled)     │
│ + scroll-reveal.js (NEW)            │
│   - Intersection Observer           │
│   - Fade-in on scroll               │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│ Result: Full content accessible     │
│ + Smooth fade-in animations         │
│ + Progressive content reveal        │
│ + Better UX & accessibility         │
└─────────────────────────────────────┘
```

## Component Design

### 1. Scroll-Reveal Module (`js/scroll-reveal.js`)

**Purpose**: Detect when elements enter viewport and trigger fade-in animations

**API**:
```javascript
class ScrollReveal {
  constructor(options = {}) {
    this.threshold = options.threshold || 0.1;
    this.rootMargin = options.rootMargin || '0px 0px -10% 0px';
    this.observer = null;
  }

  init() {
    // Create Intersection Observer
    // Find all [data-reveal] elements
    // Start observing
  }

  observe(element) {
    // Add element to observer
  }

  unobserve(element) {
    // Remove element from observer after reveal
  }

  onIntersect(entries) {
    // Handle intersection callback
    // Add .revealed class
    // Remove .reveal-pending class
  }
}
```

**Lifecycle**:
1. Page loads
2. `ScrollReveal.init()` called on DOMContentLoaded
3. Finds all `[data-reveal]` elements
4. Adds `.reveal-pending` class
5. Creates Intersection Observer
6. When element enters viewport:
   - Adds `.revealed` class
   - Removes `.reveal-pending` class
   - CSS transition handles animation
   - Unobserves element (performance)

### 2. CSS Animation System

**Structure**:
```css
/* Base transition (applies to all reveal elements) */
[data-reveal] {
  transition:
    opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Initial state (before entering viewport) */
.reveal-pending {
  opacity: 0;
  transform: translateY(30px);
}

/* Revealed state (after entering viewport) */
.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger delays for multiple items */
[data-reveal]:nth-child(1) { transition-delay: 0s; }
[data-reveal]:nth-child(2) { transition-delay: 0.1s; }
[data-reveal]:nth-child(3) { transition-delay: 0.15s; }
[data-reveal]:nth-child(4) { transition-delay: 0.2s; }
[data-reveal]:nth-child(5) { transition-delay: 0.25s; }
[data-reveal]:nth-child(6) { transition-delay: 0.3s; }

/* Accessibility: Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  [data-reveal] {
    transition: none !important;
    transition-delay: 0s !important;
  }
  .reveal-pending {
    opacity: 1;
    transform: none;
  }
}
```

### 3. Integration Points

**gallery-hero.js modifications**:
```javascript
// When rendering critique cards
critiqueCard.setAttribute('data-reveal', '');
critiqueCard.classList.add('reveal-pending');

// When rendering RPAIT viz
rpaitContainer.setAttribute('data-reveal', '');
rpaitContainer.classList.add('reveal-pending');
```

**index.html script loading order**:
```html
<!-- Existing scripts -->
<script src="/js/data.js?v=3" charset="utf-8"></script>

<!-- NEW: Scroll reveal (before components that need it) -->
<script src="/js/scroll-reveal.js?v=1"></script>

<!-- Existing component scripts -->
<script src="/js/carousel.js?v=1"></script>
<script src="/js/gallery-hero.js?v=3"></script>
```

## Performance Considerations

### Intersection Observer Benefits
1. **Efficient**: Native browser API, highly optimized
2. **Passive**: Doesn't block main thread
3. **Lazy**: Only checks when scrolling stops
4. **Automatic**: Handles all edge cases (resize, orientation change)

### Optimization Strategies
1. **Unobserve after reveal**: Once element is revealed, stop observing it
2. **Single observer**: Use one observer for all elements (not one per element)
3. **GPU acceleration**: Use only `opacity` and `transform` (hardware accelerated)
4. **Avoid layout thrashing**: Don't read/write DOM in same frame
5. **Debounce**: Intersection Observer already handles this

### Performance Budget
- **Animation frame rate**: 60fps (16.67ms per frame)
- **CSS transition**: 600ms (smooth but not slow)
- **Observer threshold**: 0.1 (trigger when 10% visible)
- **Root margin**: -10% bottom (trigger slightly before fully visible)

## Accessibility

### prefers-reduced-motion
Users with vestibular disorders or motion sickness can enable `prefers-reduced-motion` in their OS:

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable all animations */
  * {
    animation: none !important;
    transition: none !important;
  }

  /* Show content immediately */
  .reveal-pending {
    opacity: 1;
    transform: none;
  }
}
```

### Keyboard Navigation
- Scrolling still works with keyboard (arrow keys, space, page down)
- Tab navigation not affected
- Screen readers can access all content

### Mobile Accessibility
- Touch scroll fully supported
- No JavaScript-based scroll hijacking
- Native scroll behavior preserved

## Browser Support

### Intersection Observer Support
- ✅ Chrome 51+ (2016)
- ✅ Firefox 55+ (2017)
- ✅ Safari 12.1+ (2019)
- ✅ Edge 15+ (2017)
- ✅ iOS Safari 12.2+ (2019)
- ✅ Android Chrome 51+ (2016)

**Decision**: No polyfill needed - all target browsers support it natively

### CSS Support
- ✅ `transform` and `opacity`: Supported everywhere
- ✅ `cubic-bezier()`: Supported everywhere
- ✅ `prefers-reduced-motion`: Supported in all modern browsers (2018+)
- ✅ `:nth-child()`: Supported everywhere

## Trade-offs

### Decision 1: Disable IMMERSIVE_MODE vs. Add Vertical Carousel
**Chosen**: Disable IMMERSIVE_MODE

**Rationale**:
- ✅ Simpler implementation (remove code vs add code)
- ✅ Better accessibility (native scroll behavior)
- ✅ Better mobile UX (users expect scrolling)
- ✅ Solves content overflow problem completely
- ❌ Loses "one artwork at a time" feeling (mitigated by fade-in animations)

**Alternative rejected**: Snap-scroll carousel
- Would be more complex
- Less flexible (can't see partial content)
- Harder to navigate to specific critiques

### Decision 2: Intersection Observer vs. Scroll Event Listener
**Chosen**: Intersection Observer

**Rationale**:
- ✅ Better performance (native browser optimization)
- ✅ Automatically handles edge cases
- ✅ Declarative API (easier to reason about)
- ✅ No need for throttle/debounce
- ❌ Slightly less control over timing (acceptable trade-off)

**Alternative rejected**: `window.addEventListener('scroll')`
- Worse performance (runs on every scroll frame)
- Requires manual throttling
- More prone to bugs (edge cases)

### Decision 3: CSS Transitions vs. Web Animations API
**Chosen**: CSS Transitions

**Rationale**:
- ✅ Simpler (declarative CSS)
- ✅ Better performance (GPU accelerated)
- ✅ Easier to maintain
- ✅ Better accessibility (respects prefers-reduced-motion)
- ❌ Less dynamic control (not needed for this use case)

**Alternative rejected**: `element.animate()`
- More code
- Requires JavaScript for every animation
- Harder to respect user preferences

## Testing Strategy

### Manual Testing
1. **Scroll behavior**: Wheel, touch, keyboard all work
2. **Animation smoothness**: Check Chrome DevTools FPS meter
3. **Content visibility**: All 6 critiques + RPAIT visible
4. **Reduced motion**: Enable in OS, verify no animations

### Automated Testing (Future)
- Playwright test: Scroll to bottom, verify all content visible
- Visual regression: Screenshot before/after scroll
- Performance test: Lighthouse score should remain high

### Browser Testing Matrix
```
Desktop:
  ✓ Chrome 90+ (Windows, Mac)
  ✓ Firefox 88+ (Windows, Mac)
  ✓ Safari 14+ (Mac)
  ✓ Edge 90+ (Windows)

Mobile:
  ✓ iOS Safari 14+ (iPhone, iPad)
  ✓ Android Chrome 90+ (Phone, Tablet)
```

## Migration Path

### Phase 1: Foundation (Low Risk)
1. Change `IMMERSIVE_MODE = false`
2. Test: Verify scrolling works
3. Deploy: If issues, revert to `true`

### Phase 2: Animations (Medium Risk)
1. Add scroll-reveal.js
2. Add CSS classes
3. Test: Verify fade-ins work
4. Deploy: If performance issues, disable animations

### Phase 3: Polish (Low Risk)
1. Add stagger delays
2. Tune timing curves
3. Test accessibility
4. Deploy: Incremental improvements

### Rollback Plan
If critical issues arise:
1. Set `IMMERSIVE_MODE = true` in index.html
2. Remove `scroll-reveal.js` script tag
3. Remove CSS animation classes
4. Redeploy

**Rollback time**: < 5 minutes

## Future Enhancements (Out of Scope)

1. **Parallax effects**: Background images move at different speeds
2. **Scroll progress indicator**: Show how far through artwork user has scrolled
3. **Sticky artwork title**: Keep title visible while scrolling through critiques
4. **Scroll-snap sections**: Snap to each artwork when scrolling
5. **Scroll-driven animations**: Text/images animate based on scroll position

These can be added later without affecting core functionality.
