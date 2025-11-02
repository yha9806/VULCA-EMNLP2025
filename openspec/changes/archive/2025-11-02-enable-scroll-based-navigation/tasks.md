# Tasks: Enable Scroll-Based Navigation with Fade-In Animations

## Phase 1: Disable Scroll Prevention (Foundation)
- [x] 1.1 Modify `index.html`: Change `window.IMMERSIVE_MODE = true` to `false`
- [x] 1.2 Test: Verify homepage is now scrollable with mouse wheel
- [x] 1.3 Test: Verify homepage is scrollable with keyboard (arrow keys, space, page down)
- [x] 1.4 Test: Verify homepage is scrollable on mobile (touch)
- [x] 1.5 Verify: Check console for any errors after disabling IMMERSIVE_MODE

## Phase 2: Create Scroll-Reveal Infrastructure
- [x] 2.1 Create `js/scroll-reveal.js` with Intersection Observer setup
- [x] 2.2 Add CSS animation classes in `styles/main.css`:
  - [x] `.reveal-pending` (opacity: 0, translateY: 30px)
  - [x] `.revealed` (opacity: 1, translateY: 0)
  - [x] `[data-reveal]` transition rules
- [x] 2.3 Add `prefers-reduced-motion` media query for accessibility
- [x] 2.4 Load `scroll-reveal.js` in `index.html` (after data.js, before gallery-hero.js)
- [x] 2.5 Test: Verify scroll-reveal.js loads without errors

## Phase 3: Apply Animations to Content
- [x] 3.1 Mark critique panels with `data-reveal` attribute in `gallery-hero.js`
- [x] 3.2 Mark RPAIT visualization with `data-reveal` attribute in `gallery-hero.js`
- [x] 3.3 Mark artwork header with `data-reveal` attribute (optional - skipped)
- [x] 3.4 Initialize Intersection Observer on page load
- [x] 3.5 Test: Verify fade-in animation triggers when scrolling down
- [x] 3.6 Test: Verify animation only plays once per element

## Phase 4: Performance & Polish
- [x] 4.1 Unobserve elements after they've been revealed (performance optimization)
- [x] 4.2 Add stagger delay for critique panels (0.1s intervals)
- [x] 4.3 Test on mobile devices (iOS Safari, Android Chrome)
- [x] 4.4 Test with `prefers-reduced-motion: reduce` enabled
- [x] 4.5 Verify no layout thrashing (use Chrome DevTools Performance tab)
- [x] 4.6 Test carousel navigation still works alongside scrolling

## Phase 5: Cross-Browser Testing
- [x] 5.1 Test on Chrome/Edge (Windows, Mac)
- [x] 5.2 Test on Firefox
- [x] 5.3 Test on Safari (Mac, iOS)
- [x] 5.4 Test on mobile browsers (iOS Safari, Android Chrome)
- [x] 5.5 Verify Intersection Observer polyfill not needed (modern browsers only)

## Phase 6: Documentation & Cleanup
- [ ] 6.1 Update CLAUDE.md with new scroll behavior notes
- [x] 6.2 Add comments to scroll-reveal.js explaining Observer setup
- [x] 6.3 Document animation timing/thresholds
- [ ] 6.4 Remove or update scroll-prevention.js documentation
- [ ] 6.5 Commit changes with descriptive message

## Validation Checklist
- [x] Homepage scrolls smoothly on all devices
- [x] All 6 critique panels are fully visible when scrolling
- [x] RPAIT visualization is fully visible
- [x] Fade-in animations play smoothly (60fps)
- [x] Animations respect `prefers-reduced-motion`
- [x] No console errors
- [x] Carousel prev/next buttons still work
- [x] Dot indicators still work
- [x] Language toggle still works
- [x] Page loads in under 2 seconds

## Dependencies
- None (all tasks can be done sequentially)

## Estimated Time
- Phase 1: 15 minutes
- Phase 2: 30 minutes
- Phase 3: 45 minutes
- Phase 4: 30 minutes
- Phase 5: 30 minutes
- Phase 6: 15 minutes
- **Total**: ~2.5 hours
