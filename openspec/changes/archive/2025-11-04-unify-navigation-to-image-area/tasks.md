# Tasks: Unify Navigation to Image Area

**Change ID**: `unify-navigation-to-image-area`
**Total Estimated Time**: 8-12 hours
**Status**: Proposed

---

## Overview

This document breaks down the `unify-navigation-to-image-area` change into small, executable tasks. Each task should take 15-45 minutes and include clear success criteria.

---

## Phase 1: Foundation & Component Structure (2-3 hours)

### Task 1.1: Create UnifiedNavigation Component Skeleton
**Estimated Time**: 30 minutes
**Dependencies**: None
**Priority**: P0

**Steps**:
1. Create `js/components/unified-navigation.js`
2. Define `UnifiedNavigation` class with constructor
3. Add skeleton methods: `render()`, `destroy()`, `updateArtwork()`, `updateImage()`
4. Export class to `window.UnifiedNavigation`
5. Add JSDoc comments

**Success Criteria**:
- [ ] File created and loadable in browser
- [ ] Constructor accepts `{ container, artworkCarousel, showImageNav }` options
- [ ] All methods defined (empty implementations OK)
- [ ] No console errors when instantiated

**Validation Code**:
```javascript
const nav = new UnifiedNavigation({
  container: document.getElementById('test-container'),
  artworkCarousel: window.carousel,
  showImageNav: true
});
console.assert(nav !== null, 'UnifiedNavigation instantiated');
console.assert(typeof nav.render === 'function', 'render() method exists');
```

---

### Task 1.2: Create Unified Navigation CSS File
**Estimated Time**: 30 minutes
**Dependencies**: None
**Priority**: P0

**Steps**:
1. Create `styles/components/unified-navigation.css`
2. Add base styles for `.unified-navigation-wrapper`
3. Add base styles for `.artwork-navigation` (outer layer)
4. Add base styles for `.image-display-container` (inner layer)
5. Import in `styles/main.css`

**Success Criteria**:
- [ ] CSS file created and imported
- [ ] No syntax errors
- [ ] Styles don't conflict with existing CSS

**Validation Code**:
```bash
# Check CSS syntax
npx stylelint styles/components/unified-navigation.css

# Verify import
grep "unified-navigation.css" styles/main.css
```

---

### Task 1.3: Implement Outer Layer HTML Structure
**Estimated Time**: 45 minutes
**Dependencies**: Task 1.1
**Priority**: P0

**Steps**:
1. In `UnifiedNavigation.render()`, create outer navigation HTML
2. Render "上一件作品" / "下一件作品" buttons
3. Add bilingual `<span lang="zh">` / `<span lang="en">` structure
4. Render artwork indicator: "X 的 4"
5. Set ARIA attributes: `role="navigation"`, `aria-label`

**Success Criteria**:
- [ ] Outer navigation renders to DOM
- [ ] Buttons have correct bilingual text
- [ ] Indicator shows correct artwork number
- [ ] ARIA attributes present and valid

**Validation Code**:
```javascript
const nav = new UnifiedNavigation({ ... });
nav.render();

const outer = document.querySelector('.artwork-navigation');
assert.exists(outer);
assert.equal(outer.getAttribute('role'), 'navigation');

const prevBtn = document.querySelector('#unified-artwork-prev');
assert.exists(prevBtn.querySelector('[lang="zh"]'));
assert.exists(prevBtn.querySelector('[lang="en"]'));

const indicator = document.querySelector('.artwork-indicator');
assert.include(indicator.textContent, '1');
assert.include(indicator.textContent, '4');
```

---

### Task 1.4: Integrate Existing Image Carousel
**Estimated Time**: 30 minutes
**Dependencies**: Task 1.3
**Priority**: P0

**Steps**:
1. In `UnifiedNavigation.render()`, create inner container
2. Check if `options.showImageNav === true`
3. If true, instantiate `ArtworkImageCarousel` for current artwork
4. If false, render simple image display (no carousel controls)
5. Append to inner container

**Success Criteria**:
- [ ] Image carousel renders for multi-image artworks
- [ ] Simple image renders for single-image artworks
- [ ] Existing carousel functionality preserved

**Validation Code**:
```javascript
// Multi-image artwork (artwork-1)
const nav1 = new UnifiedNavigation({
  container: document.getElementById('test-container'),
  artworkCarousel: carousel,
  showImageNav: true
});
nav1.render();
assert.exists(document.querySelector('.carousel-wrapper'));

// Single-image artwork (artwork-2)
carousel.goTo(1);
const nav2 = new UnifiedNavigation({
  container: document.getElementById('test-container'),
  artworkCarousel: carousel,
  showImageNav: false
});
nav2.render();
assert.notExists(document.querySelector('.carousel-wrapper'));
```

---

## Phase 2: Event Handling & Navigation Logic (2-3 hours)

### Task 2.1: Implement Outer Layer Button Click Handlers
**Estimated Time**: 45 minutes
**Dependencies**: Task 1.3
**Priority**: P0

**Steps**:
1. Add `attachEventListeners()` private method
2. Attach click handlers to `#unified-artwork-prev` and `#unified-artwork-next`
3. On click, call `this.artworkCarousel.prev()` or `next()`
4. Emit custom event: `artwork:change`
5. Update artwork indicator text

**Success Criteria**:
- [ ] Clicking "下一件作品" navigates to next artwork
- [ ] Clicking "上一件作品" navigates to previous artwork
- [ ] Artwork indicator updates correctly
- [ ] Custom event emitted with correct data

**Validation Code**:
```javascript
const nav = new UnifiedNavigation({ ... });
nav.render();

let eventData = null;
nav.on('artwork:change', (data) => {
  eventData = data;
});

const nextBtn = document.querySelector('#unified-artwork-next');
nextBtn.click();

await waitFor(() => eventData !== null);
assert.equal(eventData.previousIndex, 0);
assert.equal(eventData.currentIndex, 1);
assert.include(document.querySelector('.artwork-indicator').textContent, '2');
```

---

### Task 2.2: Implement Boundary Handling (First/Last Artwork)
**Estimated Time**: 30 minutes
**Dependencies**: Task 2.1
**Priority**: P1

**Steps**:
1. Check `this.artworkCarousel.currentIndex` in render
2. If at first artwork (index 0), disable "上一件作品" button
3. If at last artwork (index 3), disable "下一件作品" button
4. Add `disabled` attribute and update ARIA labels
5. Update CSS to gray out disabled buttons

**Success Criteria**:
- [ ] Prev button disabled at first artwork
- [ ] Next button disabled at last artwork
- [ ] ARIA labels updated: "No previous/next artwork available"
- [ ] Disabled buttons grayed out visually

**Validation Code**:
```javascript
const nav = new UnifiedNavigation({ ... });
carousel.goTo(0); // First artwork
nav.render();

const prevBtn = document.querySelector('#unified-artwork-prev');
assert.isTrue(prevBtn.disabled);
assert.include(prevBtn.getAttribute('aria-label'), 'No previous');

carousel.goTo(3); // Last artwork
nav.updateArtwork(3);

const nextBtn = document.querySelector('#unified-artwork-next');
assert.isTrue(nextBtn.disabled);
assert.include(nextBtn.getAttribute('aria-label'), 'No next');
```

---

### Task 2.3: Implement Keyboard Navigation (Shift + Arrow Keys)
**Estimated Time**: 45 minutes
**Dependencies**: Task 2.1
**Priority**: P1

**Steps**:
1. Add `attachKeyboardListeners()` private method
2. Listen for `keydown` event on `document`
3. Check for `event.shiftKey && event.key === 'ArrowLeft'` → prev artwork
4. Check for `event.shiftKey && event.key === 'ArrowRight'` → next artwork
5. Prevent default browser behavior
6. Call same navigation methods as button clicks

**Success Criteria**:
- [ ] Shift + Arrow Left navigates to previous artwork
- [ ] Shift + Arrow Right navigates to next artwork
- [ ] Works when document has focus (not in input field)
- [ ] Doesn't conflict with image carousel arrow keys (plain arrows)

**Validation Code**:
```javascript
const nav = new UnifiedNavigation({ ... });
nav.render();
carousel.goTo(1); // Start at artwork-2

const event = new KeyboardEvent('keydown', {
  key: 'ArrowRight',
  shiftKey: true,
  bubbles: true
});
document.dispatchEvent(event);

await waitFor(() => carousel.getCurrentIndex() === 2);
assert.equal(carousel.getCurrentIndex(), 2);
```

---

### Task 2.4: Implement Event Cleanup (destroy method)
**Estimated Time**: 30 minutes
**Dependencies**: Task 2.1, 2.3
**Priority**: P1

**Steps**:
1. Implement `destroy()` method
2. Remove all event listeners (click, keyboard)
3. Destroy nested image carousel instance
4. Clear DOM: `this.container.innerHTML = ''`
5. Clear internal references: `this.artworkCarousel = null`

**Success Criteria**:
- [ ] All event listeners removed (no memory leaks)
- [ ] DOM cleared completely
- [ ] No console errors on destroy
- [ ] Component can be re-instantiated after destroy

**Validation Code**:
```javascript
const nav = new UnifiedNavigation({ ... });
nav.render();

const container = document.getElementById('test-container');
assert.exists(container.querySelector('.artwork-navigation'));

nav.destroy();
assert.equal(container.innerHTML, '');

// Test re-instantiation
const nav2 = new UnifiedNavigation({ ... });
nav2.render();
assert.exists(container.querySelector('.artwork-navigation'));
```

---

## Phase 3: Styling & Visual Design (2-3 hours)

### Task 3.1: Style Outer Navigation Buttons
**Estimated Time**: 45 minutes
**Dependencies**: Task 1.2, 1.3
**Priority**: P1

**Steps**:
1. Define button styles in `unified-navigation.css`:
   - Font size: `1rem`
   - Padding: `12px 24px`
   - Border: `2px solid var(--color-text)`
   - Background: `rgba(255, 255, 255, 0.9)`
2. Add hover state: darker background
3. Add active state: scale(0.95)
4. Add disabled state: grayed out, cursor not-allowed

**Success Criteria**:
- [ ] Buttons clearly visible against artwork images
- [ ] Hover state provides visual feedback
- [ ] Disabled buttons visually distinct
- [ ] Text readable (WCAG AA contrast ratio: 4.5:1)

**Validation**:
```bash
# Check contrast ratio
npx pa11y --runner axe http://localhost:9999

# Visual inspection
- Hover over buttons → background darkens
- Disabled buttons → grayed out
```

---

### Task 3.2: Style Artwork Indicator
**Estimated Time**: 30 minutes
**Dependencies**: Task 3.1
**Priority**: P1

**Steps**:
1. Style `.artwork-indicator` in `unified-navigation.css`:
   - Font size: `0.9rem`
   - Color: Semi-transparent white
   - Center alignment
2. Add `aria-live="polite"` attribute (if not already present)
3. Style current artwork number with bold font

**Success Criteria**:
- [ ] Indicator clearly readable
- [ ] Current number emphasized
- [ ] Doesn't overlap with buttons
- [ ] Screen readers announce updates

**Validation**:
```css
/* Expected styles */
.artwork-indicator {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
}

.artwork-indicator [aria-current="page"] {
  font-weight: bold;
}
```

---

### Task 3.3: Implement Responsive Layout (Desktop)
**Estimated Time**: 45 minutes
**Dependencies**: Task 3.1, 3.2
**Priority**: P1

**Steps**:
1. Define desktop styles (`@media (min-width: 768px)`):
   - Outer navigation: flexbox horizontal layout
   - Buttons full width with text labels visible
   - Indicator centered between buttons
2. Add spacing between elements (`gap: 20px`)
3. Ensure no horizontal scrolling

**Success Criteria**:
- [ ] Layout looks good on 1920px, 1440px, 1024px, 768px
- [ ] All elements visible without scrolling
- [ ] Text labels readable without zoom

**Validation**:
```bash
# Test at different viewport sizes
# In browser DevTools:
- Resize to 1920px → Check layout
- Resize to 1440px → Check layout
- Resize to 1024px → Check layout
- Resize to 768px → Check layout
```

---

### Task 3.4: Implement Responsive Layout (Mobile)
**Estimated Time**: 45 minutes
**Dependencies**: Task 3.3
**Priority**: P1

**Steps**:
1. Define mobile styles (`@media (max-width: 599px)`):
   - Reduce button padding: `8px 16px`
   - Reduce font size: `0.875rem`
   - Ensure touch targets ≥ 44×44px (WCAG AA)
2. Consider icon-only buttons (hide text labels) OR
3. Use stacked vertical layout if horizontal too cramped
4. Test on iPhone SE (375px), iPhone 12 (390px), Pixel 5 (393px)

**Success Criteria**:
- [ ] Touch targets minimum 44×44px
- [ ] No horizontal scrolling at 375px
- [ ] Text readable without zoom (font-size ≥ 16px)
- [ ] Layout doesn't break on narrow screens

**Validation**:
```bash
# Test on mobile devices or DevTools
- iPhone SE (375px) → All interactive elements tappable
- iPhone 12 (390px) → Layout looks good
- Pixel 5 (393px) → No issues
```

---

### Task 3.5: Add Fade Transition Animation
**Estimated Time**: 30 minutes
**Dependencies**: Task 2.1
**Priority**: P2

**Steps**:
1. Add CSS transition to `.artwork-display`:
   ```css
   .artwork-display {
     transition: opacity 300ms ease-in-out;
   }
   ```
2. On artwork change, add `.fading-out` class
3. Wait 300ms, update content, remove class
4. Ensure no layout shift (CLS)

**Success Criteria**:
- [ ] Smooth fade transition between artworks
- [ ] No flicker or jump
- [ ] Performance: 60 FPS (check DevTools Performance tab)
- [ ] Respects `prefers-reduced-motion`

**Validation**:
```javascript
// Trigger navigation
document.querySelector('#unified-artwork-next').click();

// Verify transition applied
const display = document.querySelector('.artwork-display');
assert.include(window.getComputedStyle(display).transition, 'opacity');

// Check for reduced motion support
const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
if (mediaQuery.matches) {
  assert.equal(window.getComputedStyle(display).transition, 'none');
}
```

---

## Phase 4: Integration & Cleanup (2-3 hours)

### Task 4.1: Integrate UnifiedNavigation into gallery-hero.js
**Estimated Time**: 45 minutes
**Dependencies**: Phase 1-3 completed
**Priority**: P0

**Steps**:
1. Open `js/gallery-hero.js`
2. Modify `renderArtworkImage()` function:
   - Check if artwork has multiple images
   - Instantiate `UnifiedNavigation` instead of directly rendering image
   - Pass `window.carousel` and `showImageNav` option
3. Listen to `artwork:change` event to re-render critiques
4. Update `render()` function to use new unified navigation

**Success Criteria**:
- [ ] Gallery hero uses UnifiedNavigation component
- [ ] Artwork navigation works end-to-end
- [ ] Critiques panel updates when artwork changes
- [ ] No console errors

**Validation Code**:
```javascript
// Load page
await page.goto('http://localhost:9999');

// Verify unified navigation rendered
await page.waitForSelector('.artwork-navigation');
await page.waitForSelector('#unified-artwork-next');

// Click next artwork
await page.click('#unified-artwork-next');

// Verify artwork changed
await page.waitForSelector('.artwork-indicator', { hasText: '2 的 4' });

// Verify critiques updated
const critiqueCount = await page.$$eval('.critique-panel', panels => panels.length);
assert.equal(critiqueCount, 6);
```

---

### Task 4.2: Remove Bottom Navigation Bar HTML
**Estimated Time**: 15 minutes
**Dependencies**: Task 4.1
**Priority**: P0

**Steps**:
1. Open `index.html`
2. Delete lines 123-140 (`.gallery-nav` section)
3. Delete lines 142-143 (`.nav-hint` div)
4. Save and test page loads without errors

**Success Criteria**:
- [ ] `.gallery-nav` element removed from DOM
- [ ] `.nav-hint` element removed from DOM
- [ ] Page loads without errors
- [ ] No 404s in console

**Validation**:
```bash
# Verify elements removed
grep -n "gallery-nav" index.html
# Should return no results (or only CSS references)

# Test page loads
python -m http.server 9999
# Visit http://localhost:9999 → No errors
```

---

### Task 4.3: Remove Bottom Bar Event Handlers
**Estimated Time**: 15 minutes
**Dependencies**: Task 4.2
**Priority**: P0

**Steps**:
1. Open `index.html`
2. Delete lines 401-419 (navigation button click handlers)
3. Remove references to `#nav-prev` and `#nav-next`
4. Verify no orphaned event listeners

**Success Criteria**:
- [ ] Old event handlers removed
- [ ] No console errors about missing elements
- [ ] No memory leaks (check DevTools Memory tab)

**Validation Code**:
```javascript
// Check for orphaned listeners
const navPrev = document.getElementById('nav-prev');
assert.isNull(navPrev, 'Old nav-prev element should not exist');
```

---

### Task 4.4: Remove navigation-autohide.js Module
**Estimated Time**: 15 minutes
**Dependencies**: Task 4.2
**Priority**: P0

**Steps**:
1. Delete file: `js/navigation-autohide.js`
2. Open `index.html`
3. Remove `<script src="/js/navigation-autohide.js?v=1"></script>` (line ~393)
4. Verify no references to auto-hide module in other files

**Success Criteria**:
- [ ] File deleted from filesystem
- [ ] Script tag removed from index.html
- [ ] No 404 errors in console
- [ ] No references in other JS files

**Validation**:
```bash
# Check for references
grep -r "navigation-autohide" .
# Should return no results (or only this tasks.md)

# Test page loads
python -m http.server 9999
# Visit http://localhost:9999 → No 404 for navigation-autohide.js
```

---

### Task 4.5: Remove Bottom Bar CSS Styles
**Estimated Time**: 30 minutes
**Dependencies**: Task 4.2
**Priority**: P0

**Steps**:
1. Open `styles/main.css`
2. Delete lines 1498-1562 (`.gallery-nav` styles)
3. Delete lines 1527-1562 (`.nav-hint` styles)
4. Remove all references to `.nav-button`, `.artwork-indicator` (old)
5. Run CSS linter to check for orphaned selectors

**Success Criteria**:
- [ ] All bottom bar CSS removed
- [ ] No orphaned selectors referencing deleted elements
- [ ] Linting passes (0 errors)
- [ ] Page still renders correctly

**Validation**:
```bash
# Check for orphaned selectors
grep -n "\.gallery-nav" styles/main.css
# Should return no results

# Run linter
npx stylelint styles/main.css
```

---

## Phase 5: Accessibility & Testing (2-3 hours)

### Task 5.1: Add Comprehensive ARIA Attributes
**Estimated Time**: 45 minutes
**Dependencies**: Task 4.1
**Priority**: P0

**Steps**:
1. Review all navigation buttons for ARIA labels
2. Add `aria-controls` linking buttons to controlled elements
3. Add `aria-live="polite"` to artwork indicator
4. Add `aria-current="page"` to current artwork number
5. Verify `role` attributes on all interactive elements

**Success Criteria**:
- [ ] All buttons have descriptive `aria-label`
- [ ] Indicator has `aria-live` and announces changes
- [ ] axe-core reports 0 violations
- [ ] HTML validator passes

**Validation Code**:
```javascript
// Run axe-core
const results = await axe.run();
assert.equal(results.violations.length, 0, 'No accessibility violations');

// Verify ARIA attributes
const prevBtn = document.querySelector('#unified-artwork-prev');
assert.exists(prevBtn.getAttribute('aria-label'));
assert.exists(prevBtn.getAttribute('aria-controls'));
```

---

### Task 5.2: Implement Focus Management
**Estimated Time**: 30 minutes
**Dependencies**: Task 5.1
**Priority**: P1

**Steps**:
1. Define focus styles: `outline: 3px solid var(--color-primary); outline-offset: 4px`
2. Test Tab order: Artwork prev → Artwork next → Image prev → Image next
3. Test Shift+Tab (reverse order)
4. Ensure focus visible on all interactive elements
5. Test focus trap (no unexpected focus jumps)

**Success Criteria**:
- [ ] Focus indicators clearly visible (3:1 contrast ratio)
- [ ] Tab order logical and intuitive
- [ ] Shift+Tab reverses tab order correctly
- [ ] No focus trapped in component

**Validation**:
```bash
# Manual testing
1. Load page in browser
2. Press Tab repeatedly
3. Verify focus order: Artwork nav → Image carousel → Critiques
4. Press Shift+Tab → Verify reverse order
5. Check focus visibility on each element
```

---

### Task 5.3: Test Screen Reader Compatibility
**Estimated Time**: 60 minutes
**Dependencies**: Task 5.1, 5.2
**Priority**: P1

**Steps**:
1. Test with NVDA on Windows:
   - Launch NVDA
   - Navigate with Tab key
   - Verify button labels announced correctly
   - Verify artwork changes announced
2. Test with JAWS on Windows (if available)
3. Test with VoiceOver on macOS (if available)
4. Document any issues and fix

**Success Criteria**:
- [ ] NVDA announces all navigation elements correctly
- [ ] Artwork changes announced via `aria-live`
- [ ] No missing or incorrect labels
- [ ] Navigation structure clear to screen reader users

**Validation**:
```bash
# NVDA Testing Checklist
- [ ] Tab to "Previous Artwork" button → Announces: "Previous artwork: [title], button"
- [ ] Tab to "Next Artwork" button → Announces: "Next artwork: [title], button"
- [ ] Click Next button → Announces: "Artwork 2 of 4"
- [ ] Navigation region announced: "Navigation, Artwork navigation"
```

---

### Task 5.4: Cross-Browser Testing
**Estimated Time**: 45 minutes
**Dependencies**: All previous phases
**Priority**: P1

**Steps**:
1. Test on Chrome 90+ (Windows/Mac)
2. Test on Firefox 88+ (Windows/Mac)
3. Test on Safari 14+ (Mac)
4. Test on Mobile Safari (iOS 13+)
5. Test on Chrome Android (90+)
6. Document any browser-specific issues

**Success Criteria**:
- [ ] All navigation features work in all target browsers
- [ ] Layout renders correctly in all browsers
- [ ] No console errors in any browser
- [ ] Performance acceptable on all browsers

**Validation**:
```bash
# Browser Testing Checklist
Chrome:
- [ ] Artwork navigation works
- [ ] Image carousel works
- [ ] Keyboard shortcuts work
- [ ] Layout correct at all breakpoints

Firefox:
- [ ] Artwork navigation works
- [ ] Image carousel works
- [ ] Keyboard shortcuts work
- [ ] Layout correct at all breakpoints

Safari:
- [ ] Artwork navigation works
- [ ] Image carousel works
- [ ] Keyboard shortcuts work
- [ ] Layout correct at all breakpoints
```

---

### Task 5.5: Performance Testing & Optimization
**Estimated Time**: 45 minutes
**Dependencies**: All previous phases
**Priority**: P2

**Steps**:
1. Run Lighthouse audit (desktop & mobile)
2. Check Core Web Vitals:
   - LCP (Largest Contentful Paint) < 2.5s
   - FID (First Input Delay) < 100ms
   - CLS (Cumulative Layout Shift) < 0.1
3. Test navigation response time (< 50ms)
4. Check for memory leaks (create/destroy component 100 times)
5. Optimize if metrics fail

**Success Criteria**:
- [ ] Lighthouse Performance score ≥ 90 (desktop)
- [ ] Lighthouse Performance score ≥ 80 (mobile)
- [ ] Core Web Vitals pass
- [ ] No memory leaks detected

**Validation**:
```bash
# Run Lighthouse
npx lighthouse http://localhost:9999 --view

# Check metrics in report:
- Performance score
- LCP, FID, CLS values

# Memory leak test (DevTools)
1. Open DevTools → Memory tab
2. Take heap snapshot
3. Run create/destroy loop 100 times:
   for (let i = 0; i < 100; i++) {
     const nav = new UnifiedNavigation({ ... });
     nav.render();
     nav.destroy();
   }
4. Take another heap snapshot
5. Compare: Should not have 100 lingering UnifiedNavigation objects
```

---

## Phase 6: Documentation & Deployment (1-2 hours)

### Task 6.1: Update CLAUDE.md Documentation
**Estimated Time**: 30 minutes
**Dependencies**: All previous phases
**Priority**: P2

**Steps**:
1. Open `CLAUDE.md`
2. Add new section under "🎉 最新更新":
   - Describe unified navigation system
   - List removed components (bottom bar, auto-hide)
   - List new components (UnifiedNavigation)
3. Update "常见问题" (FAQ) section if needed
4. Update "编辑规则" if navigation patterns changed

**Success Criteria**:
- [ ] CLAUDE.md updated with accurate information
- [ ] New developers can understand navigation architecture
- [ ] FAQ covers common questions about navigation

**Validation**:
```bash
# Check for completeness
- [ ] Documented unified navigation component
- [ ] Listed all removed files
- [ ] Updated architecture diagram (if present)
```

---

### Task 6.2: Write Unit Tests
**Estimated Time**: 60 minutes
**Dependencies**: Phase 1-5 completed
**Priority**: P1

**Steps**:
1. Create test file: `tests/unified-navigation.test.js`
2. Write tests for:
   - Component instantiation
   - Render outer layer
   - Render inner layer (conditional)
   - Button click handlers
   - Keyboard shortcuts
   - Event emission
   - Cleanup on destroy
3. Aim for ≥ 80% code coverage

**Success Criteria**:
- [ ] Test file created
- [ ] All critical paths covered
- [ ] Tests pass (0 failures)
- [ ] Coverage ≥ 80%

**Validation**:
```bash
# Run tests
npm test -- unified-navigation.test.js

# Check coverage
npm run test:coverage
# Look for unified-navigation.js line coverage
```

---

### Task 6.3: Conduct User Acceptance Testing
**Estimated Time**: 30 minutes
**Dependencies**: All previous phases
**Priority**: P1

**Steps**:
1. Deploy to staging environment
2. Recruit 3-5 test users
3. Ask users to:
   - Navigate between all 4 artworks
   - Navigate images within artwork-1
   - Use keyboard shortcuts
   - Test on mobile device
4. Collect feedback via survey or interview
5. Document issues and fix critical ones

**Success Criteria**:
- [ ] ≥ 3 users complete testing
- [ ] Average satisfaction rating ≥ 4.0 / 5.0
- [ ] No critical bugs reported
- [ ] Users find navigation clearer than before

**Validation**:
```bash
# Survey Questions (5-point Likert scale)
1. "The navigation is easy to understand" (1=Strongly Disagree, 5=Strongly Agree)
2. "I could easily switch between artworks" (1-5)
3. "I could easily switch between images within an artwork" (1-5)
4. "The navigation feels more intuitive than the previous design" (1-5)

# Target: Average score ≥ 4.0 across all questions
```

---

### Task 6.4: Deploy to Production
**Estimated Time**: 30 minutes
**Dependencies**: Task 6.3 passes
**Priority**: P0

**Steps**:
1. Create pull request with all changes
2. Request code review from team
3. Address review feedback
4. Merge to `master` branch
5. Monitor for errors after deployment

**Success Criteria**:
- [ ] Pull request approved by ≥ 1 reviewer
- [ ] All CI/CD checks pass
- [ ] Deployed to production without errors
- [ ] No increase in error rate (check logs)

**Validation**:
```bash
# GitHub Actions (or your CI)
- [ ] Linting passes
- [ ] Tests pass
- [ ] Build succeeds

# Post-deployment monitoring
- Check error logs for 24 hours after deploy
- Monitor analytics for navigation usage
- Check for user bug reports
```

---

### Task 6.5: Create Archive Entry in OpenSpec
**Estimated Time**: 15 minutes
**Dependencies**: Task 6.4
**Priority**: P2

**Steps**:
1. Run `/openspec:archive unify-navigation-to-image-area`
2. Verify change marked as "Deployed"
3. Update `openspec/project.md` if needed
4. Commit archive metadata

**Success Criteria**:
- [ ] Change status: Deployed
- [ ] Deployment date recorded
- [ ] Archive metadata committed to repo

**Validation**:
```bash
# Check status
openspec show unify-navigation-to-image-area
# Should show: Status: Deployed

# Verify archive
ls openspec/archive/
# Should contain: unify-navigation-to-image-area/
```

---

## Summary

### Total Time Estimate
- **Phase 1**: 2-3 hours (Foundation)
- **Phase 2**: 2-3 hours (Event Handling)
- **Phase 3**: 2-3 hours (Styling)
- **Phase 4**: 2-3 hours (Integration)
- **Phase 5**: 2-3 hours (Testing)
- **Phase 6**: 1-2 hours (Documentation)

**Total**: 8-12 hours (depending on complexity and debugging)

### Critical Path
```
Task 1.1 → 1.3 → 1.4 → 2.1 → 4.1 → 4.2 → 5.1 → 6.4
(Must complete in sequence)
```

### Parallel Tasks
These tasks can be done in parallel:
- Task 1.2 (CSS file) parallel to Task 1.1 (JS skeleton)
- Task 3.1-3.5 (Styling) can overlap with Task 2.2-2.4 (Event handling)
- Task 5.1-5.5 (Testing) can partially overlap with Task 6.1-6.2 (Documentation)

---

## Risk Mitigation

### High-Risk Tasks
1. **Task 4.1** (Integration): May break existing functionality
   - Mitigation: Thorough manual testing, keep fallback code temporarily
2. **Task 5.3** (Screen reader testing): May uncover major accessibility issues
   - Mitigation: Start accessibility testing early (don't wait until Phase 5)

### Contingency Plan
If critical issues discovered during Phase 5-6:
- Pause deployment (Task 6.4)
- Roll back to previous version
- Fix issues in separate branch
- Re-run Phases 5-6 before redeploying

---

## Post-Deployment Monitoring

### Metrics to Track (First 7 Days)
1. **Error Rate**: Should not increase > 5% compared to baseline
2. **Navigation Usage**: Track click events on new buttons (via analytics)
3. **User Feedback**: Monitor support emails/issues for navigation confusion
4. **Performance**: Monitor Lighthouse scores and Core Web Vitals

### Success Criteria (After 7 Days)
- ✅ Error rate stable or decreased
- ✅ Navigation usage similar or increased
- ✅ ≤ 2 user complaints about navigation
- ✅ Performance metrics within targets
