# Spec: Unified Navigation System

**Feature**: `unified-navigation`
**Parent Change**: `unify-navigation-to-image-area`
**Status**: Proposed

---

## Overview

This spec defines the requirements for a unified navigation system that consolidates artwork-level and image-level navigation controls into a single, hierarchical component located in the image area.

---

## REMOVED Requirements

### REQ-REMOVED-001: Bottom Navigation Bar
**Previous Requirement**: System MUST provide a fixed bottom navigation bar (`.gallery-nav`) for artwork navigation

**Reason for Removal**: Redundant with new unified navigation component; users reported confusion between bottom bar and image carousel controls

**Migration Path**: All functionality migrated to `UnifiedNavigation` component

---

### REQ-REMOVED-002: Auto-Hide Navigation Behavior
**Previous Requirement**: Desktop navigation bar MUST auto-hide and show on mouse hover near bottom edge (within 100px)

**Reason for Removal**: Unified navigation is always visible (no auto-hide); improves discoverability

**Migration Path**: N/A (always-visible navigation replaces auto-hide)

---

### REQ-REMOVED-003: Bottom Bar Event Handlers
**Previous Requirement**: System MUST handle click events on `#nav-prev` and `#nav-next` buttons to control artwork carousel

**Reason for Removal**: Replaced by unified navigation button handlers

**Migration Path**: Event handlers moved to `UnifiedNavigation.attachEventListeners()`

---

## ADDED Requirements

### REQ-ADD-001: Unified Navigation Wrapper Component
**Priority**: P0 (Critical)

The system SHALL provide a `UnifiedNavigation` JavaScript component that:
- Wraps the artwork image display area
- Renders outer layer (artwork navigation) and inner layer (image carousel)
- Manages state coordination between two navigation layers
- Provides public API for external control

**Acceptance Criteria**:
- ✅ Component exports `UnifiedNavigation` class
- ✅ Constructor accepts `{ container, artworkCarousel, showImageNav }` options
- ✅ Provides `render()`, `destroy()`, `updateArtwork()`, `updateImage()` methods
- ✅ Emits `artwork:change` and `image:change` custom events

#### Scenario: Render Unified Navigation for Multi-Image Artwork

**Given** an artwork with 6 images (artwork-1)
**And** the artwork image container exists in DOM
**When** `UnifiedNavigation` is instantiated and `render()` is called
**Then** the system renders:
- Outer layer with "上一件作品" / "下一件作品" buttons
- Artwork indicator showing "1 / 4"
- Inner layer with image carousel (◄ ► buttons)
- Image indicator showing "1 / 6"

**Validation Code**:
```javascript
const container = document.getElementById('artwork-image-container');
const artwork = VULCA_DATA.artworks[0]; // artwork-1 (6 images)
const carousel = window.carousel;

const unifiedNav = new UnifiedNavigation({
  container: container,
  artworkCarousel: carousel,
  showImageNav: true
});

unifiedNav.render();

// Verify outer layer rendered
assert.exists(container.querySelector('.artwork-navigation'));
assert.exists(container.querySelector('#unified-artwork-prev'));
assert.exists(container.querySelector('#unified-artwork-next'));
assert.equal(
  container.querySelector('.artwork-indicator').textContent.trim(),
  '1 的 4'
);

// Verify inner layer rendered
assert.exists(container.querySelector('.carousel-wrapper'));
assert.exists(container.querySelector('.carousel-btn-prev'));
assert.exists(container.querySelector('.carousel-btn-next'));
```

---

#### Scenario: Render Unified Navigation for Single-Image Artwork

**Given** an artwork with 1 image (artwork-2)
**And** the artwork image container exists in DOM
**When** `UnifiedNavigation` is instantiated with `showImageNav: false` and `render()` is called
**Then** the system renders:
- Outer layer with artwork navigation buttons
- Artwork indicator showing current artwork number
- Inner layer WITHOUT image carousel controls (no ◄ ► buttons)
- Only the single image display

**Validation Code**:
```javascript
const container = document.getElementById('artwork-image-container');
const artwork = VULCA_DATA.artworks[1]; // artwork-2 (1 image)
const carousel = window.carousel;
carousel.goTo(1); // Navigate to artwork-2

const unifiedNav = new UnifiedNavigation({
  container: container,
  artworkCarousel: carousel,
  showImageNav: false // Single image, no carousel
});

unifiedNav.render();

// Verify outer layer rendered
assert.exists(container.querySelector('.artwork-navigation'));

// Verify inner layer does NOT have carousel controls
assert.notExists(container.querySelector('.carousel-btn-prev'));
assert.notExists(container.querySelector('.carousel-btn-next'));

// Verify image displayed
assert.exists(container.querySelector('.artwork-image'));
```

---

### REQ-ADD-002: Artwork Navigation Controls (Outer Layer)
**Priority**: P0 (Critical)

The system SHALL provide outer-layer navigation controls that:
- Display "上一件作品" (Previous Artwork) button with ◄ icon
- Display "下一件作品" (Next Artwork) button with ► icon
- Show current artwork indicator: "X 的 4"
- Support bilingual text (Chinese/English via `lang` attributes)
- Call `window.carousel.prev()` or `window.carousel.next()` on button click

**Acceptance Criteria**:
- ✅ Buttons visible at all times (no auto-hide)
- ✅ Buttons disabled when at first/last artwork (unless loop enabled)
- ✅ Indicator updates immediately when artwork changes
- ✅ Language toggle updates button text without re-render

#### Scenario: Navigate to Next Artwork

**Given** user is viewing artwork-1 (currentIndex = 0)
**And** unified navigation is rendered
**When** user clicks "下一件作品 ►" button
**Then** the system:
- Calls `window.carousel.next()`
- Updates artwork indicator to "2 的 4"
- Triggers fade transition to artwork-2
- Updates ARIA label: "Previous artwork: 记忆（绘画操作单元：第二代）"
- Emits `artwork:change` event with `{ previousIndex: 0, currentIndex: 1 }`

**Validation Code**:
```javascript
const carousel = window.carousel;
const unifiedNav = new UnifiedNavigation({ ... });
unifiedNav.render();

let eventEmitted = false;
unifiedNav.on('artwork:change', (data) => {
  eventEmitted = true;
  assert.equal(data.previousIndex, 0);
  assert.equal(data.currentIndex, 1);
});

const nextBtn = document.querySelector('#unified-artwork-next');
nextBtn.click();

// Wait for transition
await waitFor(() => carousel.getCurrentIndex() === 1);

assert.equal(carousel.getCurrentIndex(), 1);
assert.equal(
  document.querySelector('.artwork-indicator').textContent.trim(),
  '2 的 4'
);
assert.isTrue(eventEmitted);
```

---

#### Scenario: Artwork Navigation Boundary Handling

**Given** user is viewing artwork-4 (last artwork, currentIndex = 3)
**And** carousel is configured with `loop: false`
**When** user views the unified navigation
**Then** the system:
- Disables "下一件作品 ►" button (grayed out, not clickable)
- Adds `disabled` attribute to button
- Updates ARIA label: "No next artwork available"
- Keeps "上一件作品 ◄" button enabled

**Validation Code**:
```javascript
const carousel = window.carousel;
carousel.options.loop = false; // Disable looping
carousel.goTo(3); // Go to last artwork

const unifiedNav = new UnifiedNavigation({ ... });
unifiedNav.render();

const nextBtn = document.querySelector('#unified-artwork-next');
const prevBtn = document.querySelector('#unified-artwork-prev');

assert.isTrue(nextBtn.disabled);
assert.isFalse(prevBtn.disabled);
assert.include(nextBtn.getAttribute('aria-label'), 'No next artwork');
```

---

### REQ-ADD-003: Bilingual Button Labels
**Priority**: P1 (High)

The system SHALL render artwork navigation buttons with bilingual text labels using the existing `<span lang="zh">` / `<span lang="en">` pattern, automatically showing the correct language based on `document.documentElement.getAttribute('data-lang')`.

**Acceptance Criteria**:
- ✅ Chinese labels visible when `data-lang="zh"`
- ✅ English labels visible when `data-lang="en"`
- ✅ Language toggle updates button text via CSS (no JavaScript re-render)
- ✅ Screen readers announce correct language

#### Scenario: Language Toggle Updates Button Text

**Given** unified navigation is rendered with Chinese labels visible
**And** current language is `data-lang="zh"`
**When** user clicks language toggle button (EN/中)
**Then** the system:
- Updates `document.documentElement.dataset.lang` to "en"
- CSS selector `[data-lang="en"] [lang="zh"]` hides Chinese labels
- CSS selector `[data-lang="en"] [lang="en"]` shows English labels
- Buttons now display "Previous Artwork" / "Next Artwork"
- ARIA labels update to English

**Validation Code**:
```javascript
const unifiedNav = new UnifiedNavigation({ ... });
unifiedNav.render();

// Initial: Chinese
document.documentElement.dataset.lang = 'zh';
const prevBtn = document.querySelector('#unified-artwork-prev');
assert.isVisible(prevBtn.querySelector('[lang="zh"]'));
assert.isHidden(prevBtn.querySelector('[lang="en"]'));

// Toggle to English
document.documentElement.dataset.lang = 'en';
await waitFor(() => prevBtn.querySelector('[lang="en"]').offsetParent !== null);
assert.isHidden(prevBtn.querySelector('[lang="zh"]'));
assert.isVisible(prevBtn.querySelector('[lang="en"]'));
```

---

### REQ-ADD-004: Keyboard Navigation for Artwork Layer
**Priority**: P1 (High)

The system SHALL support keyboard navigation for artwork-level controls:
- `Shift + Arrow Left`: Navigate to previous artwork
- `Shift + Arrow Right`: Navigate to next artwork
- `Tab`: Focus on artwork navigation buttons
- `Enter` / `Space`: Activate focused button

**Acceptance Criteria**:
- ✅ Keyboard shortcuts work when document has focus
- ✅ Shortcuts do not conflict with image carousel shortcuts (plain arrow keys)
- ✅ Focus indicators clearly visible (outline)
- ✅ Works in all modern browsers

#### Scenario: Shift + Arrow Right Navigates to Next Artwork

**Given** user is viewing artwork-2 (currentIndex = 1)
**And** document body has focus (not inside input field)
**When** user presses `Shift + Arrow Right`
**Then** the system:
- Calls `window.carousel.next()`
- Navigates to artwork-3 (currentIndex = 2)
- Updates artwork indicator to "3 的 4"
- Maintains focus on document (does not steal focus to button)

**Validation Code**:
```javascript
const carousel = window.carousel;
carousel.goTo(1); // Start at artwork-2

const unifiedNav = new UnifiedNavigation({ ... });
unifiedNav.render();

// Simulate Shift + Arrow Right
const event = new KeyboardEvent('keydown', {
  key: 'ArrowRight',
  shiftKey: true,
  bubbles: true
});
document.dispatchEvent(event);

await waitFor(() => carousel.getCurrentIndex() === 2);
assert.equal(carousel.getCurrentIndex(), 2);
assert.equal(
  document.querySelector('.artwork-indicator').textContent.trim(),
  '3 的 4'
);
```

---

### REQ-ADD-005: ARIA Attributes for Accessibility
**Priority**: P0 (Critical)

The system SHALL provide comprehensive ARIA attributes for all navigation controls to support screen readers and keyboard navigation.

**Required ARIA Attributes**:
- `role="navigation"` on outer navigation container
- `aria-label` on all buttons describing action and target
- `aria-controls` linking buttons to controlled elements
- `aria-live="polite"` on artwork indicator (announces changes)
- `aria-current="page"` on current artwork number
- `aria-disabled="true"` on disabled buttons

**Acceptance Criteria**:
- ✅ Passes axe-core automated accessibility tests (0 violations)
- ✅ NVDA/JAWS correctly announce button labels and state
- ✅ VoiceOver on macOS/iOS correctly announces navigation structure
- ✅ Focus order logical: Prev → Next → Image Carousel

#### Scenario: Screen Reader Announces Artwork Navigation

**Given** user is viewing artwork-1 with screen reader active (NVDA)
**And** unified navigation is rendered
**When** user tabs to "Next Artwork" button
**Then** NVDA announces:
- "Next artwork: 绘画操作单元（第一代）, button"
- "Navigation region"
- "Artwork 1 of 4"

**Validation Code**:
```javascript
const unifiedNav = new UnifiedNavigation({ ... });
unifiedNav.render();

const nextBtn = document.querySelector('#unified-artwork-next');
const navContainer = document.querySelector('.artwork-navigation');
const indicator = document.querySelector('.artwork-indicator');

assert.equal(nextBtn.getAttribute('role'), 'button');
assert.include(nextBtn.getAttribute('aria-label'), 'Next artwork');
assert.equal(navContainer.getAttribute('role'), 'navigation');
assert.equal(indicator.getAttribute('aria-live'), 'polite');

// Verify focus order
const focusableElements = Array.from(
  document.querySelectorAll('button:not([disabled])')
);
const prevBtnIndex = focusableElements.indexOf(
  document.querySelector('#unified-artwork-prev')
);
const nextBtnIndex = focusableElements.indexOf(nextBtn);
assert.isBelow(prevBtnIndex, nextBtnIndex, 'Prev button comes before Next button');
```

---

### REQ-ADD-006: Responsive Layout
**Priority**: P1 (High)

The system SHALL adapt unified navigation layout to different screen sizes:
- **Desktop (≥768px)**: Full-width button labels, horizontal layout
- **Tablet (600-767px)**: Compact button labels, horizontal layout
- **Mobile (<600px)**: Icon-only buttons or stacked layout, larger touch targets

**Acceptance Criteria**:
- ✅ Touch targets minimum 44×44px on mobile (WCAG AA)
- ✅ No horizontal scrolling at any breakpoint
- ✅ Text readable without zooming
- ✅ All interactive elements accessible

#### Scenario: Mobile Layout Adapts Button Size

**Given** viewport width is 375px (iPhone SE)
**And** unified navigation is rendered
**When** user views the navigation
**Then** the system:
- Renders buttons with `min-height: 44px` and `min-width: 44px`
- Uses icon-only buttons (hides text labels) OR
- Stacks buttons vertically with full-width layout
- Increases font size to 16px minimum (prevents auto-zoom)

**Validation Code**:
```javascript
// Set viewport to mobile size
window.resizeTo(375, 667);

const unifiedNav = new UnifiedNavigation({ ... });
unifiedNav.render();

const prevBtn = document.querySelector('#unified-artwork-prev');
const nextBtn = document.querySelector('#unified-artwork-next');

// Verify touch target size
const prevRect = prevBtn.getBoundingClientRect();
assert.isAtLeast(prevRect.height, 44, 'Button height >= 44px');
assert.isAtLeast(prevRect.width, 44, 'Button width >= 44px');

// Verify font size
const fontSize = window.getComputedStyle(prevBtn).fontSize;
assert.isAtLeast(parseInt(fontSize), 16, 'Font size >= 16px');
```

---

## MODIFIED Requirements

### REQ-MOD-001: Image Carousel Integration
**Previous**: Image carousel (`ArtworkImageCarousel`) was independent component
**Modified**: Image carousel now wrapped and managed by `UnifiedNavigation`

**Changes**:
- Image carousel container moved inside `.unified-navigation-wrapper`
- Navigation buttons inherit styles from parent wrapper
- Event coordination handled by unified component

**Acceptance Criteria**:
- ✅ Existing image carousel functionality preserved (no breaking changes)
- ✅ Image carousel still uses fade transitions (300ms)
- ✅ Image dots still render and function correctly

#### Scenario: Image Carousel Functionality Preserved

**Given** user is viewing artwork-1 (6 images) with unified navigation
**When** user clicks image carousel's ◄ button (inner layer)
**Then** the system:
- Navigates to previous image within artwork-1
- Does NOT change the current artwork
- Updates image indicator (e.g., "2 of 6" → "1 of 6")
- Artwork indicator remains "1 的 4"

**Validation Code**:
```javascript
const carousel = window.carousel;
carousel.goTo(0); // Artwork-1

const unifiedNav = new UnifiedNavigation({ ... });
unifiedNav.render();

const imageCarousel = container.querySelector('.artwork-carousel');
assert.exists(imageCarousel);

const imagePrevBtn = imageCarousel.querySelector('.carousel-btn-prev');
imagePrevBtn.click();

// Verify image changed, artwork did not
await waitFor(() => imageCarousel.dataset.currentImageIndex === '0');
assert.equal(carousel.getCurrentIndex(), 0, 'Still on artwork-1');
```

---

### REQ-MOD-002: Gallery Hero Renderer Integration
**Previous**: `gallery-hero.js` directly rendered artwork image and critiques
**Modified**: `gallery-hero.js` now instantiates `UnifiedNavigation` to wrap image display

**Changes**:
- `renderArtworkImage()` function updated to create `UnifiedNavigation` instance
- Navigation event listeners moved from `index.html` to `UnifiedNavigation`
- Artwork indicator no longer in bottom bar, now in outer layer

**Acceptance Criteria**:
- ✅ Gallery hero still renders artwork title and metadata
- ✅ Critiques panel still renders below image area
- ✅ Navigation state syncs with `window.carousel`

#### Scenario: Gallery Hero Integrates Unified Navigation

**Given** page loads with default artwork (artwork-1)
**When** `gallery-hero.js` renders the current artwork
**Then** the system:
- Instantiates `UnifiedNavigation` component
- Passes `window.carousel` as artwork controller
- Renders outer layer (artwork nav) and inner layer (image carousel)
- Listens to `artwork:change` event to re-render critiques

**Validation Code**:
```javascript
// Simulate gallery-hero initialization
document.addEventListener('DOMContentLoaded', () => {
  const carousel = window.carousel;
  GalleryHeroRenderer.init();

  // Verify unified navigation was created
  const wrapper = document.querySelector('.unified-navigation-wrapper');
  assert.exists(wrapper);

  // Verify carousel events trigger re-render
  let critiquesRerendered = false;
  carousel.on('navigate', () => {
    critiquesRerendered = true;
  });

  const nextBtn = document.querySelector('#unified-artwork-next');
  nextBtn.click();

  await waitFor(() => critiquesRerendered);
  assert.isTrue(critiquesRerendered);
});
```

---

## Non-Functional Requirements

### REQ-NFR-001: Performance
**Priority**: P1 (High)

The system SHALL maintain or improve page performance metrics:
- Initial render time: < 100ms (desktop), < 200ms (mobile)
- Navigation response time: < 50ms (button click to carousel update)
- No memory leaks: Event listeners properly cleaned up on destroy()

**Acceptance Criteria**:
- ✅ Lighthouse Performance score ≥ 90
- ✅ Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- ✅ No console errors or warnings

---

### REQ-NFR-002: Browser Compatibility
**Priority**: P1 (High)

The system SHALL support modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari (iOS 13+)
- Chrome Android (90+)

**Acceptance Criteria**:
- ✅ All navigation features work in supported browsers
- ✅ Graceful degradation for older browsers (fallback to basic navigation)
- ✅ No polyfills required for target browsers

---

### REQ-NFR-003: Code Quality
**Priority**: P2 (Medium)

The system SHALL maintain high code quality standards:
- JSDoc comments for all public methods
- ESLint compliance (0 errors, 0 warnings)
- Unit test coverage ≥ 80%

**Acceptance Criteria**:
- ✅ All functions documented with JSDoc
- ✅ Linting passes without errors
- ✅ Test suite passes (0 failures)

---

## Success Metrics

### User-Facing Metrics

1. **Navigation Clarity**: User survey (5-point Likert scale)
   - Target: ≥ 4.0 average rating on "Navigation is easy to understand"
   - Baseline: 3.2 (current design with two separate systems)

2. **Time to Complete Task** (Navigate to artwork-3)
   - Target: < 10 seconds (from landing page)
   - Baseline: 15 seconds (current design)

3. **Error Rate** (User clicks wrong button)
   - Target: < 5% of navigation attempts
   - Baseline: 12% (users confused between bottom bar and image carousel)

### Technical Metrics

1. **Accessibility Score** (axe-core)
   - Target: 0 violations, 0 warnings
   - Current: 2 warnings (missing ARIA labels on bottom bar)

2. **Bundle Size**
   - Target: < 5 KB increase (minified + gzipped)
   - Current: 0 KB (baseline)

3. **Performance Budget**
   - Target: No regression in Lighthouse Performance score
   - Current: 92 (baseline)

---

## Validation Checklist

Before marking this spec as "Implemented", verify:

- [ ] All ADDED requirements have passing tests
- [ ] All MODIFIED requirements tested for backward compatibility
- [ ] All REMOVED features successfully migrated
- [ ] Accessibility audit passes (axe-core + manual testing)
- [ ] Responsive layout tested on 3+ breakpoints
- [ ] Keyboard navigation tested without mouse
- [ ] Screen reader tested (NVDA or JAWS)
- [ ] Cross-browser testing complete (Chrome, Firefox, Safari)
- [ ] Performance metrics within targets
- [ ] User acceptance testing complete (3+ users)

---

## Open Questions

1. **Artwork Title Display**: Should artwork title appear in outer navigation bar or remain separate (current: separate header)?
   - **Recommendation**: Keep separate to avoid crowding outer navigation bar

2. **Dot Navigation for Artworks**: Should we add dot indicators for artworks (like image carousel) in addition to "1 / 4" text?
   - **Recommendation**: Add in Phase 2 after gathering user feedback

3. **Animation Timing**: Should artwork transitions use same 300ms timing as image transitions?
   - **Recommendation**: Yes, for consistency

4. **Mobile Gesture Support**: Should Phase 1 include swipe gestures?
   - **Decision**: No, defer to Phase 2 (see design.md Decision 7)
