# Specification: Auto-Hide Navigation Bar

**Capability**: `auto-hide-navigation`
**Feature**: Optimize Gallery Navigation Bar
**Last Updated**: 2025-11-03

---

## ADDED Requirements

### Requirement: Desktop Navigation Bar Auto-Hide

The gallery navigation bar SHALL be hidden by default on desktop devices (viewport width ≥600px) and SHALL slide into view when the user's mouse cursor approaches the bottom edge of the viewport.

**Rationale**: Maximize viewing area for artwork and data visualizations while maintaining easy access to navigation controls.

**Acceptance Criteria**:
- Navigation bar translated down by 100% of its height (off-screen) by default
- Smooth slide-in animation (300ms duration, ease-in-out timing)
- Activation zone extends 100px from bottom edge of viewport
- Navigation remains accessible via keyboard focus (`:focus-within` triggers visibility)

#### Scenario: User hovers near bottom edge on desktop

**Given**: User is viewing the gallery on a desktop browser (viewport width ≥1024px)
**When**: User moves mouse cursor to within 100 pixels of the bottom edge of the viewport
**Then**: The navigation bar slides up into view from the bottom
**And**: The transition completes within 300ms
**And**: The navigation bar displays previous/next buttons and page indicator ("1 of 4")

**Example Code**:
```javascript
// Test: Mouse position triggers navigation reveal
const mouseEvent = new MouseEvent('mousemove', {
  clientY: window.innerHeight - 50 // 50px from bottom
});
document.dispatchEvent(mouseEvent);

setTimeout(() => {
  const nav = document.querySelector('.gallery-nav');
  const transform = window.getComputedStyle(nav).transform;
  assert(transform === 'matrix(1, 0, 0, 1, 0, 0)'); // translateY(0)
}, 350); // After 300ms animation + buffer
```

---

#### Scenario: User keyboard-navigates to navigation controls

**Given**: User is viewing the gallery and navigation bar is hidden
**When**: User presses the Tab key repeatedly until focus reaches a navigation button
**Then**: The navigation bar slides into view
**And**: The focused button has a visible focus outline
**And**: Screen readers announce "Previous artwork, button" or "Next artwork, button"

**Example Code**:
```javascript
// Test: Keyboard focus reveals navigation
const prevButton = document.getElementById('nav-prev');
prevButton.focus();

const nav = document.querySelector('.gallery-nav');
const transform = window.getComputedStyle(nav).transform;
assert(transform === 'matrix(1, 0, 0, 1, 0, 0)'); // translateY(0)

// Verify focus styles
const outline = window.getComputedStyle(prevButton).outline;
assert(outline !== 'none');
```

---

#### Scenario: User moves mouse away from bottom edge

**Given**: Navigation bar is currently visible due to mouse proximity
**When**: User moves mouse cursor more than 100 pixels away from the bottom edge
**Then**: After a 500ms delay, the navigation bar slides down out of view
**And**: The transition completes within 300ms
**And**: The visual hint indicator (small bar) becomes visible again

**Example Code**:
```javascript
// Test: Navigation hides after delay
const nav = document.querySelector('.gallery-nav');
nav.classList.add('show'); // Simulate visible state

const mouseEvent = new MouseEvent('mousemove', {
  clientY: 200 // Far from bottom
});
document.dispatchEvent(mouseEvent);

setTimeout(() => {
  const transform = window.getComputedStyle(nav).transform;
  assert(transform.includes('translateY(100%)')); // Hidden
}, 850); // 500ms delay + 300ms animation + buffer
```

---

### Requirement: Mobile Navigation Bar Always Visible

The gallery navigation bar SHALL remain always visible on mobile devices (viewport width <600px) without auto-hide behavior.

**Rationale**: Touch devices lack hover capability; hiding navigation would reduce discoverability.

**Acceptance Criteria**:
- Navigation bar transform is always `translateY(0)` on mobile
- No CSS transitions applied to navigation bar on mobile
- Visual hint indicator is hidden on mobile (not needed)

#### Scenario: User views gallery on mobile device

**Given**: User accesses the gallery on a smartphone (viewport width 375px)
**When**: The page loads
**Then**: The navigation bar is immediately visible at the bottom of the screen
**And**: No slide animation occurs
**And**: Navigation bar remains visible regardless of scroll position or touch gestures

**Example Code**:
```javascript
// Test: Mobile navigation always visible
// Set viewport to mobile size
window.innerWidth = 375;
window.dispatchEvent(new Event('resize'));

const nav = document.querySelector('.gallery-nav');
const transform = window.getComputedStyle(nav).transform;
assert(transform === 'none' || transform === 'matrix(1, 0, 0, 1, 0, 0)');

// Verify no transition
const transition = window.getComputedStyle(nav).transition;
assert(transition === 'none' || !transition.includes('transform'));
```

---

### Requirement: Visual Hint Indicator

A visual hint indicator SHALL be displayed at the bottom center of the viewport when the navigation bar is hidden, providing a subtle cue that navigation is available.

**Rationale**: Improve discoverability of hidden navigation; prevent user confusion about how to navigate.

**Acceptance Criteria**:
- Indicator is a small horizontal bar (40px width × 4px height)
- Positioned 5px from bottom edge, horizontally centered
- Background opacity 20% (rgba(0, 0, 0, 0.2))
- Fades out (opacity: 0) when navigation bar is visible
- Hidden on mobile devices (<600px width)

#### Scenario: Desktop user sees visual hint

**Given**: User loads the gallery page on desktop (viewport width ≥1024px)
**When**: Navigation bar is in hidden state (default)
**Then**: A small gray bar appears at the bottom center of the screen
**And**: The bar has 4px height and 40px width
**And**: The bar has 20% opacity

**Example Code**:
```html
<!-- HTML Structure -->
<div class="nav-hint" aria-hidden="true"></div>

<style>
.nav-hint {
  position: fixed;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 4px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  transition: opacity 300ms;
  pointer-events: none;
}

@media (max-width: 599px) {
  .nav-hint {
    display: none;
  }
}

.gallery-nav.show ~ .nav-hint {
  opacity: 0;
}
</style>
```

---

#### Scenario: Hint disappears when navigation appears

**Given**: Visual hint is visible at bottom of screen
**When**: User hovers near bottom edge and navigation slides into view
**Then**: The visual hint fades out (opacity transitions to 0)
**And**: The fade-out completes within 300ms

**Example Code**:
```javascript
// Test: Hint fades when navigation shows
const nav = document.querySelector('.gallery-nav');
const hint = document.querySelector('.nav-hint');

// Show navigation
nav.classList.add('show');

setTimeout(() => {
  const opacity = window.getComputedStyle(hint).opacity;
  assert(opacity === '0');
}, 350); // After 300ms transition + buffer
```

---

### Requirement: Smooth Animation Performance

Navigation bar show/hide animations SHALL maintain 60fps performance on target devices (desktop browsers from 2020+, mobile devices from 2019+).

**Rationale**: Janky animations degrade user experience and feel unprofessional.

**Acceptance Criteria**:
- CSS transform used instead of position/top/bottom (GPU-accelerated)
- `will-change: transform` hint applied for optimization
- Transition timing function: `cubic-bezier(0.4, 0, 0.2, 1)` (Material Design standard)
- No layout thrashing during animation
- JavaScript mousemove handler throttled to maximum 10 updates/second

#### Scenario: Animation maintains 60fps on desktop

**Given**: User is on a desktop browser (Chrome 90+, Firefox 88+, Safari 14+)
**When**: Navigation bar slides in or out
**Then**: Animation completes within 300ms ±50ms
**And**: No frame drops below 60fps during transition
**And**: CPU usage remains below 20% during animation

**Example Code**:
```javascript
// Test: Performance monitoring
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'measure' && entry.name === 'nav-animation') {
      assert(entry.duration < 350); // Within 300ms + buffer
    }
  }
});
observer.observe({ entryTypes: ['measure'] });

performance.mark('nav-start');
document.querySelector('.gallery-nav').classList.add('show');

setTimeout(() => {
  performance.mark('nav-end');
  performance.measure('nav-animation', 'nav-start', 'nav-end');
}, 400);
```

---

## MODIFIED Requirements

### Requirement: Navigation Bar Positioning (Modified)

The gallery navigation bar positioning SHALL support both visible and hidden states with smooth transitions.

**Changes from Current Implementation**:
- **Before**: `position: fixed; bottom: 0;` (always visible)
- **After**: `position: fixed; bottom: 0; transform: translateY(100%);` (hidden by default on desktop)

**Rationale**: Transform-based hiding maintains position in layout while moving element off-screen.

#### Scenario: Navigation bar maintains fixed positioning

**Given**: Navigation bar is in either visible or hidden state
**When**: User scrolls the page vertically
**Then**: Navigation bar remains anchored to the bottom of the viewport
**And**: Navigation bar does not scroll with page content
**And**: Z-index remains `var(--z-sticky)` (100) to appear above content

**Example Code**:
```css
/* Updated CSS */
.gallery-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: rgba(255, 255, 255, 0.95);
  z-index: var(--z-sticky);
  /* NEW: Transform for hiding */
  transform: translateY(100%);
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

@media (min-width: 600px) {
  .gallery-nav.show,
  .gallery-nav:focus-within {
    transform: translateY(0);
  }
}

@media (max-width: 599px) {
  .gallery-nav {
    transform: translateY(0);
    transition: none;
  }
}
```

---

## REMOVED Requirements

None. All existing navigation functionality is preserved.

---

## Dependencies

### Internal Dependencies
- Existing `.gallery-nav` DOM structure (`index.html:121-137`)
- Existing CSS variables (`--z-sticky`, `--transition-base`)
- Current navigation button event handlers (JavaScript)

### External Dependencies
None. No new libraries or frameworks required.

---

## Backward Compatibility

- ✅ **No breaking changes** to existing navigation API
- ✅ **Existing event handlers** (click, keyboard) continue to work
- ✅ **Mobile behavior unchanged** (always visible)
- ✅ **Screen reader compatibility maintained**

---

## Testing Requirements

### Unit Tests
1. CSS transform application on desktop vs mobile
2. JavaScript hover detection zone (100px threshold)
3. Keyboard focus visibility (`:focus-within`)
4. Visual hint display/hide logic

### Integration Tests
1. Navigation reveal on mouse hover (desktop)
2. Navigation hide after timeout (500ms)
3. Navigation reveal on keyboard focus
4. Mobile always-visible behavior

### Accessibility Tests
1. NVDA screen reader announcement
2. Keyboard-only navigation flow
3. Focus visible outline (WCAG 2.1 AA)
4. Reduced motion preference respected

### Performance Tests
1. Animation frame rate (60fps minimum)
2. Mousemove throttling effectiveness
3. Memory usage during hover (no leaks)
4. Layout stability (no content shift)

---

## Implementation Notes

### Browser Support
- **Chrome/Edge**: 90+ (modern transform, will-change support)
- **Firefox**: 88+ (modern transform support)
- **Safari**: 14+ (modern transform, focus-within support)
- **Mobile**: iOS Safari 13+, Chrome Android 90+

### Known Limitations
1. **Touch devices with mouse**: Will use desktop auto-hide (acceptable tradeoff)
2. **Older browsers**: May not animate smoothly (graceful degradation to always-visible)
3. **Reduced motion preference**: Animation disabled (`prefers-reduced-motion: reduce`)

### Future Enhancements
1. User preference toggle (always visible / auto-hide / compact)
2. Smart scroll-based hiding (hide on scroll down, show on scroll up)
3. Swipe-up gesture support on touch devices
