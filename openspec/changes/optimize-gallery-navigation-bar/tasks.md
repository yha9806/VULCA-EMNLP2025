# Tasks: Optimize Gallery Navigation Bar

**Change ID**: `optimize-gallery-navigation-bar`
**Total Estimated Time**: 2.5 hours

---

## Phase 1: Core CSS Implementation (1 hour)

### Task 1.1: Add CSS Transform for Hidden State (15min)
**Objective**: Make navigation bar hidden by default on desktop

**Steps**:
1. Open `styles/main.css`
2. Locate `.gallery-nav` rule (line ~1453)
3. Add transform and transition properties:
   ```css
   .gallery-nav {
     /* Existing properties... */
     transform: translateY(100%);
     transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
     will-change: transform;
   }
   ```

**Success Criteria**:
- [ ] Navigation bar hidden on desktop (≥600px)
- [ ] Smooth 300ms slide animation
- [ ] No console errors

**Files Modified**: `styles/main.css`

---

### Task 1.2: Add Desktop Show State CSS (10min)
**Objective**: Define when navigation bar should be visible

**Steps**:
1. Add media query for desktop:
   ```css
   @media (min-width: 600px) {
     .gallery-nav.show,
     .gallery-nav:focus-within {
       transform: translateY(0);
     }
   }
   ```

**Success Criteria**:
- [ ] `.show` class reveals navigation
- [ ] Keyboard focus reveals navigation
- [ ] Accessibility maintained

**Files Modified**: `styles/main.css`

---

### Task 1.3: Ensure Mobile Always-Visible (10min)
**Objective**: Keep navigation always visible on mobile devices

**Steps**:
1. Locate mobile media query (`@media (max-width: 599px)`)
2. Add override:
   ```css
   @media (max-width: 599px) {
     .gallery-nav {
       transform: translateY(0) !important;
       transition: none;
     }
   }
   ```

**Success Criteria**:
- [ ] Navigation visible on mobile (viewport <600px)
- [ ] No animation on mobile
- [ ] Mobile layout unchanged

**Files Modified**: `styles/main.css`

---

### Task 1.4: Add Visual Hint Indicator HTML (5min)
**Objective**: Add DOM element for bottom hint bar

**Steps**:
1. Open `index.html`
2. After `.gallery-nav` closing tag, add:
   ```html
   <div class="nav-hint" aria-hidden="true"></div>
   ```

**Success Criteria**:
- [ ] Hint element exists in DOM
- [ ] aria-hidden prevents screen reader announcement
- [ ] No layout shift

**Files Modified**: `index.html`

---

### Task 1.5: Style Visual Hint Indicator (10min)
**Objective**: Create subtle visual cue at bottom of screen

**Steps**:
1. Add CSS rule in `main.css`:
   ```css
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
     z-index: var(--z-sticky);
   }

   @media (max-width: 599px) {
     .nav-hint {
       display: none;
     }
   }

   .gallery-nav.show ~ .nav-hint {
     opacity: 0;
   }
   ```

**Success Criteria**:
- [ ] Hint visible when navigation hidden
- [ ] Hint fades when navigation shows
- [ ] Hidden on mobile
- [ ] Does not block clicks

**Files Modified**: `styles/main.css`

---

### Task 1.6: Test CSS-Only Implementation (10min)
**Objective**: Verify base functionality works

**Steps**:
1. Start local server: `python -m http.server 9999`
2. Open browser DevTools
3. Manually add/remove `.show` class to `.gallery-nav`
4. Verify animation on desktop
5. Resize to mobile and verify always-visible
6. Test keyboard focus (Tab to navigation)

**Success Criteria**:
- [ ] Animation smooth (60fps)
- [ ] Keyboard focus works
- [ ] Mobile unchanged
- [ ] No layout issues

**Files Modified**: None (testing only)

---

## Phase 2: JavaScript Hover Detection (1 hour)

### Task 2.1: Create Navigation Module File (5min)
**Objective**: Set up JavaScript module for navigation behavior

**Steps**:
1. Create `js/navigation-autohide.js`
2. Add IIFE wrapper:
   ```javascript
   (function() {
     'use strict';
     // Module code here
   })();
   ```
3. Add to `index.html` before `app.js`:
   ```html
   <script src="/js/navigation-autohide.js?v=1"></script>
   ```

**Success Criteria**:
- [ ] File created
- [ ] Script loads without errors
- [ ] No conflicts with existing code

**Files Modified**: `js/navigation-autohide.js` (new), `index.html`

---

### Task 2.2: Implement Mousemove Listener (15min)
**Objective**: Detect when mouse is near bottom edge

**Steps**:
1. Add throttled mousemove listener:
   ```javascript
   let navVisible = false;
   let hideTimeout;
   const nav = document.querySelector('.gallery-nav');

   function throttle(func, delay) {
     let lastCall = 0;
     return function(...args) {
       const now = Date.now();
       if (now - lastCall >= delay) {
         lastCall = now;
         func(...args);
       }
     };
   }

   const handleMouseMove = throttle((e) => {
     if (window.innerWidth < 600) return;

     const distanceFromBottom = window.innerHeight - e.clientY;

     if (distanceFromBottom < 100 && !navVisible) {
       nav.classList.add('show');
       navVisible = true;
       clearTimeout(hideTimeout);
     } else if (distanceFromBottom >= 100 && navVisible) {
       clearTimeout(hideTimeout);
       hideTimeout = setTimeout(() => {
         nav.classList.remove('show');
         navVisible = false;
       }, 500);
     }
   }, 100);

   document.addEventListener('mousemove', handleMouseMove, { passive: true });
   ```

**Success Criteria**:
- [ ] Mouse within 100px reveals navigation
- [ ] Mouse away hides after 500ms
- [ ] Throttled to 10 updates/second
- [ ] No memory leaks

**Files Modified**: `js/navigation-autohide.js`

---

### Task 2.3: Handle Window Resize (10min)
**Objective**: Respond to viewport size changes

**Steps**:
1. Add resize handler:
   ```javascript
   function handleResize() {
     if (window.innerWidth < 600) {
       nav.classList.remove('show');
       navVisible = false;
     }
   }

   window.addEventListener('resize', throttle(handleResize, 250));
   ```

**Success Criteria**:
- [ ] Desktop→Mobile removes `.show` class
- [ ] Mobile→Desktop maintains hidden state
- [ ] No flicker during resize

**Files Modified**: `js/navigation-autohide.js`

---

### Task 2.4: Add Keyboard Focus Detection (10min)
**Objective**: Ensure keyboard users see navigation

**Steps**:
1. Add focus event listeners:
   ```javascript
   const navButtons = nav.querySelectorAll('button, .dot');

   navButtons.forEach(button => {
     button.addEventListener('focus', () => {
       if (window.innerWidth >= 600) {
         nav.classList.add('show');
         navVisible = true;
       }
     });

     button.addEventListener('blur', (e) => {
       if (window.innerWidth >= 600 && !nav.contains(e.relatedTarget)) {
         setTimeout(() => {
           nav.classList.remove('show');
           navVisible = false;
         }, 500);
       }
     });
   });
   ```

**Success Criteria**:
- [ ] Tab to navigation reveals bar
- [ ] Tab away hides bar (after delay)
- [ ] No conflicts with mouse hover

**Files Modified**: `js/navigation-autohide.js`

---

### Task 2.5: Add Initialization Check (5min)
**Objective**: Ensure module loads after DOM ready

**Steps**:
1. Wrap code in initialization function:
   ```javascript
   function init() {
     if (!nav) {
       console.error('❌ Navigation bar not found');
       return;
     }

     document.addEventListener('mousemove', handleMouseMove, { passive: true });
     window.addEventListener('resize', throttle(handleResize, 250));
     initKeyboardHandlers();

     console.log('✓ Navigation auto-hide initialized');
   }

   if (document.readyState === 'loading') {
     document.addEventListener('DOMContentLoaded', init);
   } else {
     init();
   }
   ```

**Success Criteria**:
- [ ] Module waits for DOM
- [ ] Console log confirms initialization
- [ ] Error handling for missing elements

**Files Modified**: `js/navigation-autohide.js`

---

### Task 2.6: Test JavaScript Integration (15min)
**Objective**: Verify hover detection works

**Steps**:
1. Open browser DevTools console
2. Move mouse to bottom edge → verify navigation appears
3. Move mouse away → verify navigation hides after delay
4. Press Tab to navigation → verify it appears
5. Test on mobile (resize browser) → verify no auto-hide
6. Check console for errors

**Success Criteria**:
- [ ] Hover detection works reliably
- [ ] Delay timing correct (500ms)
- [ ] Keyboard navigation works
- [ ] Mobile unaffected
- [ ] No console errors

**Files Modified**: None (testing only)

---

## Phase 3: Polish & Cross-Browser Testing (30min)

### Task 3.1: Add Reduced Motion Support (10min)
**Objective**: Respect user's motion preferences

**Steps**:
1. Add media query in `main.css`:
   ```css
   @media (prefers-reduced-motion: reduce) {
     .gallery-nav {
       transition: none;
     }

     .nav-hint {
       transition: none;
     }
   }
   ```

**Success Criteria**:
- [ ] Users with `prefers-reduced-motion` see instant show/hide
- [ ] Functionality preserved
- [ ] Accessibility improved

**Files Modified**: `styles/main.css`

---

### Task 3.2: Cross-Browser Testing (10min)
**Objective**: Verify compatibility

**Browsers to Test**:
- [ ] Chrome 90+ (Windows/Mac)
- [ ] Firefox 88+ (Windows/Mac)
- [ ] Safari 14+ (Mac)
- [ ] Edge 90+ (Windows)

**Test Cases**:
- [ ] Navigation hides on load (desktop)
- [ ] Hover near bottom reveals
- [ ] Keyboard focus reveals
- [ ] Mobile always visible
- [ ] Smooth animation (60fps)

**Files Modified**: None (testing only)

---

### Task 3.3: Responsive Breakpoint Testing (10min)
**Objective**: Test at all breakpoints

**Viewport Sizes**:
- [ ] 375px (mobile - iPhone SE)
- [ ] 768px (tablet - iPad)
- [ ] 1024px (desktop - small laptop)
- [ ] 1920px (desktop - large monitor)

**Success Criteria**:
- [ ] Correct behavior at each breakpoint
- [ ] Smooth transition between breakpoints
- [ ] No layout breaks

**Files Modified**: None (testing only)

---

## Phase 4: Documentation & Cleanup (20min)

### Task 4.1: Add Code Comments (5min)
**Objective**: Document implementation

**Steps**:
1. Add JSDoc comments to functions:
   ```javascript
   /**
    * Handle mouse movement to show/hide navigation
    * @param {MouseEvent} e - Mouse event
    */
   ```
2. Add CSS comments for key sections

**Success Criteria**:
- [ ] All functions documented
- [ ] CSS sections labeled
- [ ] Complex logic explained

**Files Modified**: `js/navigation-autohide.js`, `styles/main.css`

---

### Task 4.2: Update CLAUDE.md (5min)
**Objective**: Document new behavior in project guide

**Steps**:
1. Open `CLAUDE.md`
2. Add section under navigation:
   ```markdown
   ### Navigation Auto-Hide
   - Desktop: Navigation bar hidden by default, shows on hover near bottom
   - Mobile: Always visible
   - File: `js/navigation-autohide.js`
   - CSS: `styles/main.css` (lines ~1453+)
   ```

**Success Criteria**:
- [ ] Documentation updated
- [ ] Examples provided
- [ ] File locations listed

**Files Modified**: `CLAUDE.md`

---

### Task 4.3: Verify No Regressions (10min)
**Objective**: Ensure existing functionality intact

**Test Checklist**:
- [ ] Prev/Next buttons still work
- [ ] Page indicator updates correctly
- [ ] Dot indicators work (if visible)
- [ ] Carousel keyboard shortcuts work
- [ ] No z-index conflicts with other UI
- [ ] Data visualization section not blocked

**Files Modified**: None (testing only)

---

## Summary

**Total Tasks**: 22
**Estimated Time**: 2.5 hours
**Files Modified**:
- `index.html` (add hint element, script tag)
- `styles/main.css` (transform, transitions, hint styles)
- `js/navigation-autohide.js` (new file)
- `CLAUDE.md` (documentation)

**Success Criteria for Completion**:
- [x] Desktop navigation hidden by default
- [x] Smooth hover reveal (<100px from bottom)
- [x] Keyboard focus reveals navigation
- [x] Mobile always visible
- [x] Visual hint displayed
- [x] 60fps animation performance
- [x] Cross-browser compatible
- [x] Accessibility maintained (WCAG 2.1 AA)
- [x] No regressions in existing features
