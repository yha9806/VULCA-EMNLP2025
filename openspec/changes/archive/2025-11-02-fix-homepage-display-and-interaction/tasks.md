# Tasks: Fix Homepage Display and Click-based Navigation

## Phase 1: Core Display Fix (Critical - fixes homepage visibility)

### Task 1.1: Restructure hero section
- **Objective:** Remove misleading "scroll to explore" prompt, prepare hero for artwork display
- **Changes:**
  - Modify `index.html` hero-minimal section
  - Remove scroll prompt or repurpose it as intro modal
  - Add `.gallery-hero` section with artwork-display structure
- **Validation:** Visual inspection - no "scroll" message visible
- **Time:** ~30 minutes

### Task 1.2: Create carousel controller module
- **Objective:** Manage artwork navigation state and logic
- **File:** Create `js/carousel.js`
- **Requirements:**
  - Track current artwork index
  - Expose methods: `goTo(index)`, `next()`, `prev()`, `getCurrent()`
  - Handle data from `VULCA_DATA`
  - NO DOM mutations (separate concern)
- **Validation:** Unit tests pass for navigation logic
- **Time:** ~45 minutes

### Task 1.3: Create hero rendering module
- **Objective:** Dynamically render current artwork + critics
- **File:** Create `js/gallery-hero.js`
- **Requirements:**
  - Render artwork image to `.artwork-image-container`
  - Render 2-3 critic reviews to `.critiques-panel`
  - Update artwork indicator ("X of 4")
  - Update dot indicators
  - Handle carousel changes (listen to carousel events)
- **Dependencies:** carousel.js, data.js
- **Validation:** Correct artwork and critics display on load and navigation
- **Time:** ~60 minutes

### Task 1.4: Add navigation controls to HTML
- **Objective:** Add visible previous/next buttons and indicator
- **Changes:**
  - Add `.gallery-nav` section with buttons
  - Add `.artwork-indicator` with current/total count
  - Add `.artwork-dots` for visual feedback
- **Validation:** Buttons visible and clickable on all screen sizes
- **Time:** ~20 minutes

### Task 1.5: Wire up button click handlers
- **Objective:** Connect buttons to carousel navigation
- **Changes:**
  - Listen to #nav-prev, #nav-next clicks
  - Listen to .dot clicks
  - Call carousel.prev(), carousel.next(), carousel.goTo(index)
  - Trigger re-render via gallery-hero
- **Validation:** Clicking buttons changes artwork display
- **Time:** ~30 minutes

### Task 1.6: Disable auto-play
- **Objective:** Remove auto-play interference
- **Changes:**
  - Disable `autoplay.js` in index.html (comment out or delete)
  - Ensure gallery only progresses on user action
- **Validation:** Gallery stays on current artwork until user clicks
- **Time:** ~10 minutes

**Phase 1 Total Time:** ~3 hours
**Phase 1 Blocker:** None - can be done independently

---

## Phase 2: Mobile Interactions (Enhancement - swipe support)

### Task 2.1: Implement swipe gesture detection
- **Objective:** Detect left/right swipes on mobile
- **File:** Create `js/swipe-handler.js`
- **Requirements:**
  - Use pointer events (pointerdown, pointermove, pointerup)
  - Detect horizontal swipes > 50px
  - Swipe left = next, swipe right = prev
  - Ignore vertical scrolling (if any)
  - Work on touch and mouse
- **Validation:** Swipe left/right changes artwork on mobile browser
- **Time:** ~45 minutes

### Task 2.2: Wire swipe handler to carousel
- **Objective:** Connect swipe events to carousel navigation
- **Changes:**
  - Initialize swipe handler on `.gallery-hero` element
  - Call carousel.next()/prev() on swipe
  - Prevent menu swipe interference
- **Validation:** Swipe navigation works end-to-end
- **Time:** ~20 minutes

### Task 2.3: Add keyboard navigation (optional)
- **Objective:** Arrow key support for accessibility
- **Changes:**
  - Listen to keydown events (ArrowLeft, ArrowRight)
  - Call carousel.prev()/next()
- **Validation:** Arrow keys navigate artwork
- **Time:** ~15 minutes

**Phase 2 Total Time:** ~1.5 hours
**Phase 2 Dependency:** Phase 1 complete

---

## Phase 3: Styling & Responsiveness (Polish - layout optimization)

### Task 3.1: CSS layout for gallery hero
- **Objective:** Make artwork + critics fit in viewport responsively
- **File:** Modify `styles/main.css`
- **Requirements:**
  - Mobile (375px): stacked layout (image 40vh, critics below)
  - Tablet (768px): 2-column (image 40%, critics 60%)
  - Desktop (1024px+): flexible layout
  - Ensure content visible without scroll
- **Validation:** Content fits viewport on mobile, tablet, desktop (visual test)
- **Time:** ~60 minutes

### Task 3.2: CSS for navigation bar
- **Objective:** Style bottom navigation bar
- **Requirements:**
  - Fixed position at bottom
  - Responsive button sizing
  - Indicator text centered
  - Dots align properly
  - No interference with content
- **Validation:** Navigation bar styled and positioned correctly
- **Time:** ~30 minutes

### Task 3.3: Animation & transitions
- **Objective:** Smooth artwork transitions
- **Requirements:**
  - Fade out old artwork (200ms)
  - Fade in new artwork (300ms)
  - Smooth indicator update
  - No flickering
- **Validation:** Transitions smooth on all devices
- **Time:** ~30 minutes

### Task 3.4: Responsive image handling
- **Objective:** Optimize image display across devices
- **Requirements:**
  - Image aspect ratio preservation
  - Proper scaling on all screen sizes
  - Lazy loading if needed
  - Performance optimization
- **Validation:** Images look good on mobile, tablet, desktop
- **Time:** ~30 minutes

**Phase 3 Total Time:** ~2.5 hours
**Phase 3 Dependency:** Phase 1 complete, Phase 2 optional

---

## Phase 4: Accessibility & Testing (Polish - a11y)

### Task 4.1: Add ARIA labels and live regions
- **Objective:** Make navigation accessible to screen readers
- **Changes:**
  - Add `aria-label` to all buttons
  - Add `aria-live="polite"` to indicator for announcements
  - Add accessible names to dots
  - Keyboard focus indicators
- **Validation:** Screen reader announces navigation changes
- **Time:** ~30 minutes

### Task 4.2: Test keyboard navigation
- **Objective:** Ensure all navigation works via keyboard
- **Requirements:**
  - Tab to all buttons
  - Enter/Space activates buttons
  - Arrow keys navigate (if implemented)
  - No keyboard traps
- **Validation:** Full keyboard navigation works
- **Time:** ~20 minutes

### Task 4.3: Cross-browser testing
- **Objective:** Ensure functionality on all browsers
- **Browsers:** Chrome, Firefox, Safari, Edge
- **Devices:** iPhone, iPad, Android, Desktop
- **Validation:** No JS errors, all features work
- **Time:** ~45 minutes

**Phase 4 Total Time:** ~1.5 hours
**Phase 4 Dependency:** Phase 1-3 complete

---

## Phase 5: Integration & Cleanup (Optional - final polish)

### Task 5.1: Update CLAUDE.md documentation
- **Objective:** Document new homepage structure
- **Changes:**
  - Update architecture section
  - Document carousel system
  - Update interaction model
- **Time:** ~20 minutes

### Task 5.2: Remove old auto-play code
- **Objective:** Clean up unused modules
- **Changes:**
  - Delete or archive `js/autoplay.js` if no longer needed
  - Remove references in HTML
  - Clean up unused styles
- **Validation:** No broken references
- **Time:** ~15 minutes

### Task 5.3: Performance audit
- **Objective:** Optimize page load and runtime performance
- **Requirements:**
  - Measure Core Web Vitals
  - Optimize image loading
  - Check JS bundle size
  - Check render performance
- **Validation:** Lighthouse score > 90
- **Time:** ~45 minutes

**Phase 5 Total Time:** ~1.5 hours (optional)

---

## Summary

| Phase | Tasks | Time | Dependency |
|-------|-------|------|------------|
| 1. Core Display | 1.1-1.6 | 3h | None |
| 2. Mobile Interactions | 2.1-2.3 | 1.5h | Phase 1 |
| 3. Styling & Responsive | 3.1-3.4 | 2.5h | Phase 1 |
| 4. Accessibility | 4.1-4.3 | 1.5h | Phase 1-3 |
| 5. Integration | 5.1-5.3 | 1.5h | Phase 1-4 |

**Total Time (MVP):** Phase 1 + Phase 3 = 5.5 hours
**Total Time (Full):** All phases = 10 hours

---

## Testing Strategy

### Phase 1 Testing (Critical)
```bash
# 1. Open http://localhost:9999
# 2. Verify:
#    - No "scroll to explore" message
#    - Artwork 1 displays with image + 2-3 critics
#    - Previous/Next buttons are clickable
#    - Indicator shows "1 of 4"
#    - Clicking Next loads Artwork 2
#    - Clicking Previous loops back to Artwork 4
# 3. Check console for errors
```

### Phase 2 Testing (Mobile)
```bash
# 1. Open on mobile device or use browser devtools
# 2. Swipe left → should go to next artwork
# 3. Swipe right → should go to previous artwork
# 4. Verify no errors on any swipe
```

### Phase 3 Testing (Responsive)
```bash
# 1. Test at: 375px, 768px, 1024px, 1440px widths
# 2. Verify:
#    - All content visible without scroll
#    - Layout adapts correctly
#    - Navigation bar positioned properly
#    - Images scale correctly
```

### Phase 4 Testing (Accessibility)
```bash
# 1. Test with screen reader (NVDA, JAWS, VoiceOver)
# 2. Test with keyboard only
# 3. Check focus indicators visible
# 4. Verify all buttons labeled
```

---

## Risk Mitigation

**Risk:** Old autoplay.js still runs, interferes with carousel
**Mitigation:** Explicitly disable autoplay in task 1.6, verify in Phase 1 testing

**Risk:** Layout breaks on certain viewport sizes
**Mitigation:** Test at all breakpoints in Phase 3, use flexible CSS

**Risk:** Touch events don't work on some devices
**Mitigation:** Test on actual mobile devices in Phase 2, use pointer events (cross-platform)

**Risk:** Images don't load correctly
**Mitigation:** Verify image URLs in data.js, test with devtools network tab

---

## Validation Checklist

- [ ] Phase 1: Core display working (artwork visible on load)
- [ ] Phase 1: Navigation buttons working
- [ ] Phase 2: Swipe gestures working on mobile
- [ ] Phase 3: Layout responsive on all breakpoints
- [ ] Phase 4: Keyboard navigation fully accessible
- [ ] Phase 5 (optional): Performance optimization complete
- [ ] Code review: No console errors
- [ ] User testing: Intuitive interaction model

---

## Notes

- Keep scroll prevention active (do not relax)
- Maintain backwards compatibility with gallery-init for future detail pages
- Each phase can be deployed independently
- Focus on MVP first (Phase 1), enhance later
