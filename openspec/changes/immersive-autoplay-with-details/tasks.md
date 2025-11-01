# Tasks: Immersive Auto-Play Gallery with Detailed Content Pages

## Overview

This document lists all work items required to implement the three integrated capabilities. Tasks are ordered by dependency and validation checkpoint.

**Total Estimated Effort**: 3 phases, ~15-20 work items

---

## Phase 1: Main Page Immersive Experience + Anti-Scroll (Foundation)

### Phase 1A: Anti-Scroll Implementation

#### T1.A.1: Implement Scroll Prevention Module
- **Status**: Pending
- **Description**: Create `js/scroll-prevention.js` with multi-vector scroll blocking
- **Acceptance Criteria**:
  - Prevents wheel scroll on main page
  - Prevents keyboard scroll (Space, Arrow keys, Page Down)
  - Prevents touch scroll on mobile
  - Does NOT prevent scroll on detail pages
  - Flag `window.IMMERSIVE_MODE` controls behavior
- **Dependencies**: None
- **Validation**: Test on Chrome, Firefox, Safari with trackpad + mouse + touch device

```javascript
// Pseudocode
function disableScroll() {
  document.addEventListener('wheel', preventScroll, { passive: false });
  document.addEventListener('keydown', preventKeyScroll);
  document.addEventListener('touchmove', preventScroll, { passive: false });
  document.body.style.overflow = 'hidden';
}

function preventScroll(e) {
  if (window.IMMERSIVE_MODE) e.preventDefault();
}
```

#### T1.A.2: Enable Scroll on Detail Pages
- **Status**: Pending
- **Description**: Ensure scroll prevention is disabled on `/pages/*.html` routes
- **Acceptance Criteria**:
  - Detail pages set `window.IMMERSIVE_MODE = false`
  - Scroll works smoothly with keyboard + mouse + touch
  - No console errors related to scroll events
  - Users can read long content pages
- **Dependencies**: T1.A.1
- **Validation**: Navigate to `/pages/critics.html`, scroll content fully

---

### Phase 1B: Auto-Play Controller Verification

#### T1.B.1: Verify Auto-Play Timing Configuration
- **Status**: Pending (autoplay.js exists, but verify timing)
- **Description**: Review `js/autoplay.js` timing configuration matches design spec
- **Acceptance Criteria**:
  - Artwork fade-in: 1200ms
  - Critique delay: 500ms
  - Critique fade-in: 1200ms
  - Critique display: 2000ms
  - Critique fade-out: 800ms
  - Visualization display: 3000ms
  - Section delay: 500ms
- **Dependencies**: None
- **Validation**: Console log each timing event, verify sequence matches spec

#### T1.B.2: Test Infinite Loop Playback
- **Status**: Pending
- **Description**: Verify auto-play cycles through all 4 artworks × 6 critiques and loops infinitely
- **Acceptance Criteria**:
  - Starts at artwork 1, cycles to artwork 4
  - Returns to artwork 1 after artwork 4 completes
  - No pause/jump between loops
  - All fade animations smooth
  - Console shows no errors for 2+ full cycles
- **Dependencies**: T1.B.1, T1.A.2 (scroll prevented)
- **Validation**: Watch browser for 5+ minutes, verify smooth looping

---

### Phase 1C: Gallery HTML & CSS Foundation

#### T1.C.1: Verify Main Gallery HTML Structure
- **Status**: Pending (index.html exists, verify structure)
- **Description**: Confirm `index.html` has correct container structure for floating layout
- **Acceptance Criteria**:
  - Gallery container with `position: relative`
  - Artwork image element (70% width on desktop)
  - Critique panel container (positioned absolutely)
  - Visualization container (positioned absolutely)
  - Menu button for navigation
  - No scrollable elements inside gallery container
- **Dependencies**: None
- **Validation**: CSS layout test on browser (1024px viewport)

#### T1.C.2: Verify Ghost UI Styling
- **Status**: Pending (styles exist, verify spec compliance)
- **Description**: Confirm `styles/main.css` implements Ghost UI spec
- **Acceptance Criteria**:
  - Critique panels: `rgba(255, 255, 255, 0.3)` background
  - Critique panels: `backdrop-filter: blur(8px)`
  - Critique panels: `border-left: 3px solid` (color-coded)
  - No box shadows on panels
  - No rounded corners (`border-radius: 0`)
  - Typography sharp and clear (contrast sufficient)
- **Dependencies**: None
- **Validation**: Visual inspection; accessibility audit (WCAG AA)

---

### Phase 1 Validation Checkpoint

**Before proceeding to Phase 2, verify**:
- ✅ Scroll is prevented on main page (cannot scroll up/down)
- ✅ Auto-play cycles infinitely and smoothly
- ✅ All 4 artworks display with 6 critiques each
- ✅ Animations are smooth with correct timing
- ✅ Ghost UI styling matches spec (transparency, blur, borders)
- ✅ Works on mobile (375px), tablet (768px), desktop (1024px+)
- ✅ No console errors

---

## Phase 2: Detail Pages + Data System (Content)

### Phase 2A: Data Structure Enhancement

#### T2.A.1: Verify RPAIT Scores in data.js
- **Status**: Completed (done in previous bug fix)
- **Description**: Confirm all 6 personas have `rpait` property with R/P/A/I/T scores
- **Acceptance Criteria**:
  - su-shi: R:7, P:8, A:8, I:8, T:6
  - guo-xi: R:8, P:7, A:9, I:8, T:7
  - john-ruskin: R:6, P:9, A:9, I:7, T:8
  - mama-zola: R:7, P:6, A:8, I:9, T:8
  - professor-petrova: R:8, P:8, A:7, I:8, T:9
  - ai-ethics: R:9, P:7, A:6, I:9, T:8
  - All scores between 1-10
- **Dependencies**: None
- **Validation**: `console.log(window.VULCA_DATA.personas[0].rpait)` returns object with all keys

#### T2.A.2: Enhance Artwork Descriptions
- **Status**: Pending
- **Description**: Add `details` object to each artwork with size/medium/context
- **Acceptance Criteria**:
  - Each artwork has: `size`, `medium`, `context` fields
  - Total length: 100-200 words per artwork
  - Descriptive and historically accurate
  - Prose quality matches rest of site
- **Dependencies**: T2.A.1
- **Validation**: Manual review by curator/author

---

### Phase 2B: Critics Detail Page

#### T2.B.1: Create Critics Page HTML
- **Status**: Pending
- **Description**: Create `/pages/critics.html` shell
- **Acceptance Criteria**:
  - HTML5 valid structure
  - Head section with meta tags (charset, viewport, title, og)
  - Navigation menu (hamburger, links to all pages)
  - Main content area with `#critics-grid` or `#critics-container`
  - Link to main gallery
  - Footer with site info
  - Styling linked to `/styles/main.css`
- **Dependencies**: None
- **Validation**: `npm run build` or similar; `tidy -quiet critics.html`

#### T2.B.2: Create Critics Page Generator Script
- **Status**: Pending
- **Description**: Create `js/critics-page.js` to dynamically generate persona cards
- **Acceptance Criteria**:
  - Generates card for each persona in `window.VULCA_DATA.personas`
  - Card includes: color bar, name (ZH + EN), period, bio, RPAIT grid
  - RPAIT grid displays 5 bars (R, P, A, I, T) with scores
  - Color bar matches `persona.color`
  - Bio text wraps correctly, readable at 375px-2560px
  - No console errors
- **Dependencies**: T2.A.1, T2.B.1
- **Validation**:
  - Page renders all 6 critics
  - RPAIT grid displays correctly
  - Visual design matches Ghost UI spec

#### T2.B.3: Style Critics Page
- **Status**: Pending
- **Description**: Add CSS rules to `styles/main.css` for critics cards
- **Acceptance Criteria**:
  - Card layout: Grid or Flexbox (responsive)
  - Card styling: Ghost UI (subtle transparency, blur, color accent)
  - RPAIT grid: Bar chart with persona color
  - Responsive: 1 column mobile, 2-3 columns tablet/desktop
  - Typography: Readable headings + body text
  - Spacing: Consistent with design system
- **Dependencies**: T2.B.2
- **Validation**: Visual inspection at 375px, 768px, 1024px viewports

---

### Phase 2C: About Project Page

#### T2.C.1: Create About Page HTML
- **Status**: Pending
- **Description**: Create `/pages/about.html` with project vision
- **Acceptance Criteria**:
  - Navigation menu linked
  - Content sections: Project Title, Vision/Mission, RPAIT Framework, Contact
  - Rich text content with headings, paragraphs, lists
  - Link back to main gallery
  - Valid HTML5 structure
- **Dependencies**: None
- **Validation**: `tidy -quiet about.html`

#### T2.C.2: Add About Page Content
- **Status**: Pending
- **Description**: Write project vision, mission, RPAIT framework explanation
- **Acceptance Criteria**:
  - Vision statement: 100-150 words describing VULCA mission
  - RPAIT framework explanation: 200+ words with examples
  - Contact information or "Get in Touch" section
  - Clear, engaging prose
  - Accurate representation of project goals
- **Dependencies**: T2.C.1
- **Validation**: Content review by curator/author

#### T2.C.3: Style About Page
- **Status**: Pending
- **Description**: Add CSS rules for about page typography and layout
- **Acceptance Criteria**:
  - Readable heading hierarchy (H1, H2, H3)
  - Body text: 16-18px line-height 1.6+
  - Max-width: 800px for readability
  - Responsive: Works at all breakpoints
  - Ghost UI accents for quotes or callouts (optional)
- **Dependencies**: T2.C.2
- **Validation**: Readability audit (WCAG AAA target)

---

### Phase 2D: Creation Process Page

#### T2.D.1: Create Process Page HTML
- **Status**: Pending
- **Description**: Create `/pages/process.html` with creation documentation
- **Acceptance Criteria**:
  - Navigation menu linked
  - Content sections: Concept Development, Artwork Creation, Review Process, Exhibition
  - Rich text with images (optional)
  - Timeline or step-by-step flow (optional)
  - Link back to main gallery
  - Valid HTML5 structure
- **Dependencies**: None
- **Validation**: `tidy -quiet process.html`

#### T2.D.2: Add Process Page Content
- **Status**: Pending
- **Description**: Document creation workflow and artistic process
- **Acceptance Criteria**:
  - 400+ words describing how artworks were created
  - How critic reviews were commissioned
  - How RPAIT framework was applied
  - Clear timeline or logical flow
  - Engaging narrative
  - Accurate process description
- **Dependencies**: T2.D.1
- **Validation**: Content review by artist/curator

#### T2.D.3: Style Process Page
- **Status**: Pending
- **Description**: Add CSS for process page layout and typography
- **Acceptance Criteria**:
  - Timeline styling (if used): Visual, clear progression
  - Typography: Readable headings and body text
  - Responsive across all breakpoints
  - Ghost UI accents for important sections (optional)
  - Images sized responsively (if included)
- **Dependencies**: T2.D.2
- **Validation**: Visual inspection; responsive design test

---

### Phase 2E: Navigation System

#### T2.E.1: Create Hamburger Menu Component
- **Status**: Pending
- **Description**: Build hamburger menu button + navigation drawer
- **Acceptance Criteria**:
  - Menu button: Visible on all pages at top (fixed or sticky)
  - Menu button: 48px min height/width (touch-friendly)
  - Menu drawer: Slides in from left or top
  - Menu links: Main Gallery, Critics, About, Process
  - Close button: X or auto-close on link click
  - Mobile-optimized: Works on 375px viewport
  - Desktop-optimized: Full menu or drawer depends on design
- **Dependencies**: None
- **Validation**: Tested on iPhone/Android + desktop browsers

#### T2.E.2: Add Navigation Styles
- **Status**: Pending
- **Description**: Add CSS for hamburger menu and navigation drawer
- **Acceptance Criteria**:
  - Menu appears on all pages
  - Smooth animations (slide, fade, transform)
  - Responsive: Mobile drawer, desktop horizontal menu
  - Ghost UI styling consistent with rest of site
  - Clear link states (hover, active)
  - z-index hierarchy prevents overlap issues
- **Dependencies**: T2.E.1
- **Validation**: CSS animation performance test (60fps)

#### T2.E.3: Add Navigation JavaScript
- **Status**: Pending
- **Description**: Create `js/navigation.js` for menu toggle and link handling
- **Acceptance Criteria**:
  - Menu toggle works via button click
  - Links navigate to correct pages without full reload
  - Active page link is highlighted
  - Menu closes after link click (mobile)
  - Escape key closes menu
  - No console errors
- **Dependencies**: T2.E.1, T2.E.2
- **Validation**: Test all links navigate correctly

---

### Phase 2 Validation Checkpoint

**Before proceeding to Phase 3, verify**:
- ✅ All 3 detail pages created and styled
- ✅ Critics page renders all 6 personas with RPAIT scores
- ✅ About page displays vision + RPAIT framework clearly
- ✅ Process page describes creation workflow
- ✅ All pages scrollable with full content accessible
- ✅ Navigation menu works on all pages
- ✅ Responsive design tested at 375px, 768px, 1024px
- ✅ No console errors
- ✅ All links navigate correctly

---

## Phase 3: Floating Layout + Responsive Refinement + Integration (Polish)

### Phase 3A: Floating Layout Implementation

#### T3.A.1: Implement Absolute Positioning for Critique Panels
- **Status**: Pending
- **Description**: Convert critique panels from static to absolute positioning
- **Acceptance Criteria**:
  - Critique panels positioned absolutely on main gallery
  - Right side positioning: `right: calc(30% + 2rem)`
  - Vertical centering: `top: 50%; transform: translateY(-50%)`
  - Width: 280px (fixed, or responsive 240px-320px)
  - z-index above artwork image
  - Does not affect image layout
  - Works at 1024px+ viewports
- **Dependencies**: T1.C.1, T1.C.2
- **Validation**: Visual inspection; layout test with browser DevTools

#### T3.A.2: Implement Floating Visualization Container
- **Status**: Pending
- **Description**: Position RPAIT visualization at bottom-left corner
- **Acceptance Criteria**:
  - Position: `position: absolute; bottom: 2rem; left: 2rem;`
  - Size: 280px width, responsive height
  - Display: Grid layout (2 columns for RPAIT)
  - Ghost UI styling: `rgba(255, 255, 255, 0.2)`, blur
  - Visibility: Visible during visualization display time (3s)
  - Does not overlap readable text or images
- **Dependencies**: T1.B.1, T1.C.2
- **Validation**: Visual inspection; overlap detection

#### T3.A.3: Responsive Floating Layout (Mobile/Tablet)
- **Status**: Pending
- **Description**: Switch floating panels to static layout on mobile/tablet
- **Acceptance Criteria**:
  - Mobile (375px-767px): Panels stack below image, `position: static`
  - Tablet (768px-1023px): Panels float right, `position: absolute`
  - Desktop (1024px+): Full floating experimental layout
  - All breakpoint transitions smooth, no layout shift
  - Content readable at all sizes
- **Dependencies**: T3.A.1, T3.A.2
- **Validation**: Responsive design test via browser resize + DevTools emulation

---

### Phase 3B: Responsive Refinement

#### T3.B.1: Test Responsive Breakpoints
- **Status**: Pending
- **Description**: Verify layout works at all 5 breakpoints
- **Acceptance Criteria**:
  - 375px (iPhone): Single column, vertical flow
  - 768px (iPad): Dual-column with panels
  - 1024px (Desktop): Full floating layout
  - 1440px (Large): Optimized spacing/sizing
  - 2560px (Ultra-wide): Reasonable max-width constraining
  - No horizontal scroll at any size
  - Touch targets: 48px min on mobile
- **Dependencies**: T3.A.3
- **Validation**: DevTools Device Emulation; actual device testing (if available)

#### T3.B.2: Test Touch Interactions
- **Status**: Pending
- **Description**: Verify touch interactions work (menu, scroll on detail pages)
- **Acceptance Criteria**:
  - Hamburger menu tappable (48px target)
  - Menu drawer swipeable/closable
  - Scroll on detail pages smooth (not bouncy/laggy)
  - No unintended scrolling on main gallery
  - No accidental link triggers
- **Dependencies**: T3.B.1, T2.E.1
- **Validation**: Manual testing on iPhone + Android device

#### T3.B.3: Test Cross-Browser Compatibility
- **Status**: Pending
- **Description**: Verify layout works across browsers
- **Acceptance Criteria**:
  - Chrome: Full support
  - Firefox: Full support
  - Safari: Full support (including `backdrop-filter`)
  - Edge: Full support
  - Mobile Safari (iOS): Touch works, no scroll bugs
  - Android Chrome: Touch works, no scroll bugs
- **Dependencies**: T3.B.1
- **Validation**: Manual testing or automated via BrowserStack

---

### Phase 3C: Image Optimization

#### T3.C.1: Optimize Artwork Images
- **Status**: Pending
- **Description**: Ensure artwork images are optimized for responsive display
- **Acceptance Criteria**:
  - Image format: WebP (primary) + JPEG fallback
  - Desktop (1024px): Full-res image
  - Tablet (768px): Medium-res (compressed)
  - Mobile (375px): Low-res or medium-res (fast load)
  - File size: <500KB per image (total <2MB)
  - Aspect ratio: 4:3 or similar (consistent)
  - No CLS (Cumulative Layout Shift) from image loading
- **Dependencies**: T1.C.1
- **Validation**: Lighthouse audit (Performance > 85)

#### T3.C.2: Add Image Loading States
- **Status**: Pending
- **Description**: Implement placeholder or loading state for images
- **Acceptance Criteria**:
  - Placeholder or skeleton during image load
  - Fade-in animation on load complete
  - No jarring flash or layout shift
  - Graceful fallback if image fails to load
- **Dependencies**: T3.C.1
- **Validation**: Network throttling test (Slow 4G); visual inspection

---

### Phase 3D: Performance & Accessibility

#### T3.D.1: Accessibility Audit (WCAG 2.1 AA)
- **Status**: Pending
- **Description**: Ensure all pages meet WCAG 2.1 AA accessibility standards
- **Acceptance Criteria**:
  - Color contrast: All text ≥ 4.5:1 ratio
  - Focus indicators: Visible on all interactive elements
  - Keyboard navigation: All functionality accessible via keyboard
  - Semantic HTML: Proper heading hierarchy, alt text on images
  - ARIA labels: Menu, panels, interactive elements labeled
  - Screen reader: Page navigable and understandable with NVDA/JAWS
- **Dependencies**: T3.C.2
- **Validation**: `axe DevTools` extension; manual NVDA/JAWS testing

#### T3.D.2: Performance Optimization
- **Status**: Pending
- **Description**: Optimize page load and rendering performance
- **Acceptance Criteria**:
  - Lighthouse Performance score ≥ 85
  - First Contentful Paint (FCP): < 1.5s
  - Largest Contentful Paint (LCP): < 2.5s
  - Cumulative Layout Shift (CLS): < 0.1
  - Time to Interactive (TTI): < 3.5s
  - CSS file minified
  - JavaScript files minified
  - No unnecessary blocking resources
- **Dependencies**: T3.C.1
- **Validation**: Lighthouse audit; DevTools Performance tab

#### T3.D.3: SEO & Meta Tags
- **Status**: Pending
- **Description**: Ensure proper SEO metadata on all pages
- **Acceptance Criteria**:
  - Meta title: Descriptive (50-60 chars)
  - Meta description: Compelling (150-160 chars)
  - OG tags: Image, title, description (for social sharing)
  - Canonical URL (if needed)
  - Mobile-friendly viewport meta tag
  - Structured data (schema.org) for exhibitions (optional)
- **Dependencies**: T2.B.1, T2.C.1, T2.D.1
- **Validation**: SEO audit tools (SEMrush, Moz); manual verification

---

### Phase 3E: Documentation & Final Polish

#### T3.E.1: Update CLAUDE.md
- **Status**: Pending
- **Description**: Update developer guidance with finalized implementation details
- **Acceptance Criteria**:
  - Document all JavaScript modules (data, autoplay, navigation, etc.)
  - Document CSS architecture and Ghost UI pattern
  - Provide examples of adding new artworks/personas/critiques
  - Note responsive breakpoints and testing strategy
  - Include troubleshooting section
- **Dependencies**: T3.D.3
- **Validation**: Manual review by project team

#### T3.E.2: Create Deployment Checklist
- **Status**: Pending
- **Description**: Finalize checklist for production deployment
- **Acceptance Criteria**:
  - All tests passing
  - All responsive breakpoints verified
  - All pages accessible (WCAG AA)
  - Performance benchmark met
  - No console errors
  - Cache busting applied (if needed)
  - GitHub Pages configured
  - DNS/CNAME verified (if custom domain)
- **Dependencies**: T3.D.1, T3.D.2, T3.D.3
- **Validation**: Manual verification of checklist items

#### T3.E.3: Final Visual & Functional Testing
- **Status**: Pending
- **Description**: Comprehensive end-to-end testing before production
- **Acceptance Criteria**:
  - Auto-play works smoothly for 5+ full cycles
  - Scroll prevented on main page; works on detail pages
  - Navigation menu works on all pages
  - All 4 artworks × 6 critiques display correctly
  - Floating layout visually matches design spec
  - Responsive at all breakpoints
  - No broken links
  - No 404 errors
  - All animations smooth (60fps)
- **Dependencies**: T3.D.3
- **Validation**: 1-2 hour full walkthrough by QA/designer

---

### Phase 3 Validation Checkpoint

**Before production deployment, verify**:
- ✅ Floating layout implemented and responsive
- ✅ All pages styled consistently with Ghost UI spec
- ✅ Responsive design tested at all 5 breakpoints
- ✅ Touch interactions work on mobile/tablet
- ✅ Cross-browser compatibility verified (Chrome, Firefox, Safari, Edge)
- ✅ Images optimized; no layout shift
- ✅ Accessibility audit passed (WCAG 2.1 AA)
- ✅ Performance benchmarks met (Lighthouse 85+)
- ✅ SEO metadata on all pages
- ✅ CLAUDE.md updated
- ✅ All tests passing
- ✅ No console errors
- ✅ Deploy checklist completed

---

## Summary by Phase

| Phase | Focus | Tasks | Est. Time |
|-------|-------|-------|-----------|
| **Phase 1** | Main page immersive experience | T1.A.1-T1.C.2 (6 tasks) | 3-5 days |
| **Phase 2** | Detail pages + data system | T2.A.1-T2.E.3 (11 tasks) | 5-7 days |
| **Phase 3** | Floating layout + polish | T3.A.1-T3.E.3 (9 tasks) | 4-6 days |
| **Total** | Full implementation | 26 tasks | 12-18 days |

---

## Task Tracking Format

Use this format in git commits to track task completion:

```
feat: Implement auto-play scroll prevention [T1.A.1]

- Prevent wheel scroll via event listener
- Prevent keyboard scroll (Space, Arrow keys)
- Prevent touch scroll on mobile
- Set window.IMMERSIVE_MODE flag

Closes immersive-autoplay-with-details
```

This allows filtering commits by task ID and tracking which tasks are complete.
