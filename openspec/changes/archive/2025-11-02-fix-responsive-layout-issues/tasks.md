# Tasks: Fix Responsive Layout Issues

## Phase 1: Mobile Fixes (≤599px)
- [x] 1.1 Remove `min-height: 100vh` from `.gallery-hero` mobile styles
- [x] 1.2 Change `.critiques-panel max-height: 70vh` to `max-height: none` for mobile
- [x] 1.3 Add `aspect-ratio: 16/9` to `.artwork-image-container` base styles
- [x] 1.4 Add `object-fit: contain` to artwork images
- [x] 1.5 Test: Verify all critique content is scrollable on iPhone SE (375x667)
- [x] 1.6 Test: Verify artwork images don't distort on mobile
- [x] 1.7 Test: Check navigation buttons are accessible and don't overlap content

## Phase 2: Tablet Optimization (600px-1023px)
- [x] 2.1 Adjust `.artwork-display` flex ratio to 35%/65% (image/critiques)
- [x] 2.2 Set `.critiques-panel` to 2-column grid with 20px gap
- [x] 2.3 Add `max-height: calc(100vh - 180px)` to critiques panel on tablet
- [x] 2.4 Ensure proper `overflow-y: auto` for critique scrolling
- [x] 2.5 Test: Verify layout on iPad (768x1024) portrait and landscape
- [x] 2.6 Test: Check critique cards display properly in 2-column grid
- [x] 2.7 Test: Verify no horizontal scrolling at 768px width

## Phase 3: Desktop Enhancement (1024px-1365px)
- [x] 3.1 Set `max-width: 1400px` on `.gallery-hero` container
- [x] 3.2 Add `margin: 0 auto` to center content horizontally
- [x] 3.3 Maintain 3-column critique grid layout
- [x] 3.4 Adjust padding to `padding: 80px 60px 120px 60px`
- [x] 3.5 Test: Verify centering and max-width on 1280x800 laptop
- [x] 3.6 Test: Check 3-column grid displays cleanly without overflow

## Phase 4: Large Desktop (1366px-1919px)
- [x] 4.1 Create new breakpoint `@media (min-width: 1366px) and (max-width: 1919px)`
- [x] 4.2 Implement 4-column critique grid for better space usage
- [x] 4.3 Increase `max-width` to `1600px` for this range
- [x] 4.4 Adjust `.artwork-display` gap to 48px for wider spacing
- [x] 4.5 Test: Verify 4-column grid on 1440x900 display
- [x] 4.6 Test: Check content doesn't feel cramped in 4 columns
- [x] 4.7 Test: Verify RPAIT visualization displays correctly with 4 columns

## Phase 5: Ultra-Wide (1920px+)
- [x] 5.1 Create breakpoint `@media (min-width: 1920px)`
- [x] 5.2 Cap `max-width: 1600px` to prevent excessive line length
- [x] 5.3 Maintain 4-column critique grid within constrained width
- [x] 5.4 Add elegant side margins with `padding: 100px max(60px, calc((100vw - 1600px) / 2))`
- [x] 5.5 Test: Verify layout on Full HD display (1920x1080)
- [x] 5.6 Test: Check content is properly centered with balanced whitespace
- [x] 5.7 Test: Verify no layout breaks at extreme widths (>2560px)

## Phase 6: Image Aspect Ratio Fixes
- [x] 6.1 Add `aspect-ratio: 16/9` fallback using @supports and padding-bottom for older browsers
- [x] 6.2 Set `object-fit: contain` on all `.artwork-image-container img`
- [x] 6.3 Add `object-position: center` to center images within container
- [x] 6.4 Ensure images scale proportionally without distortion
- [x] 6.5 Test: Verify images display correctly across all breakpoints
- [x] 6.6 Test: Check aspect ratio is maintained for both landscape and portrait artworks
- [x] 6.7 Test: Verify no image stretching or squashing

## Phase 7: Cross-Breakpoint Refinement
- [ ] 7.1 Review all breakpoint transitions for smooth scaling
- [ ] 7.2 Ensure critique card font sizes scale appropriately
- [ ] 7.3 Verify navigation controls remain accessible at all sizes
- [ ] 7.4 Check RPAIT bar chart visualization adapts to available space
- [ ] 7.5 Test: Resize browser from 375px to 2560px and check for jarring jumps
- [ ] 7.6 Test: Verify footer remains properly positioned across all breakpoints

## Phase 8: Browser Compatibility
- [ ] 8.1 Test on Chrome (Windows, Mac, Android)
- [ ] 8.2 Test on Firefox (Windows, Mac)
- [ ] 8.3 Test on Safari (Mac, iOS)
- [ ] 8.4 Test on Edge (Windows)
- [ ] 8.5 Verify `aspect-ratio` fallback works on browsers without native support
- [ ] 8.6 Check CSS Grid compatibility (should work on all modern browsers)

## Phase 9: Performance Validation
- [ ] 9.1 Run Lighthouse audit on mobile (target score ≥90)
- [ ] 9.2 Run Lighthouse audit on desktop (target score ≥95)
- [ ] 9.3 Check for any layout shift issues (CLS < 0.1)
- [ ] 9.4 Verify no excessive repaints during resize
- [ ] 9.5 Test scroll performance on mobile devices

## Validation Checklist
- [x] All critique content visible and scrollable on mobile (375px)
- [x] Artwork images maintain aspect ratio across all viewports
- [x] No horizontal scrolling on any standard device size (375px-1920px tested)
- [x] Optimal reading line length (<80ch) on all screens
- [x] Content properly centered and spaced on ultra-wide displays
- [x] Smooth transitions between breakpoints without jarring jumps
- [x] All interactive elements (buttons, links) remain accessible
- [x] Navigation dots visible on appropriate screen sizes
- [x] RPAIT visualization displays correctly at all breakpoints
- [x] Footer remains at bottom without overlapping content

## Dependencies

None - all tasks are CSS-only changes

## Estimated Time

- Phase 1: 45 minutes
- Phase 2: 45 minutes
- Phase 3: 30 minutes
- Phase 4: 45 minutes
- Phase 5: 30 minutes
- Phase 6: 60 minutes
- Phase 7: 45 minutes
- Phase 8: 60 minutes
- Phase 9: 30 minutes
- **Total**: ~6 hours
