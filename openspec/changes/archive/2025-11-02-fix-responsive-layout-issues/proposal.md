# Fix Responsive Layout Issues Across Screen Sizes

## Meta
- **Status**: Proposed
- **Proposer**: User
- **Date**: 2025-11-02
- **Priority**: High

## Why

### Problem

Through Playwright MCP testing across multiple viewport sizes (375px mobile, 768px tablet, 1920px desktop), critical responsive design issues were identified:

1. **Content Truncation on Mobile** (375px):
   - Gallery hero section uses `min-height: 100vh` which can cut off content
   - Critiques panel restricted to `max-height: 70vh` hides scrollable content
   - Image container fixed at `40vh` may not accommodate all artwork aspect ratios

2. **Poor Space Utilization on Tablets** (768px):
   - Critiques grid switches to 2 columns but content often overflows
   - Image-to-critique ratio (40%/60%) doesn't optimize for tablet landscape
   - Navigation controls overlap with content at certain breakpoints

3. **Wasted Space on Large Desktops** (1920px+):
   - Content remains at 3-column critiques grid even on ultra-wide screens
   - Excessive horizontal whitespace around content
   - No max-width constraint causes line lengths that harm readability

4. **Image Aspect Ratio Issues**:
   - Artwork images don't maintain aspect ratio across viewports
   - No `object-fit` or aspect-ratio constraints
   - Images get stretched or compressed depending on container height

5. **Missing Breakpoints**:
   - No optimization for 1440px-1920px range (common modern displays)
   - No ultra-wide (2560px+) considerations
   - Tablet landscape (1024px-1366px) uses desktop styles prematurely

### Impact

- **Accessibility**: Users with smaller screens cannot see full critique content
- **UX**: Poor reading experience due to inappropriate line lengths and spacing
- **Visual Quality**: Artwork images display incorrectly, undermining exhibition quality
- **Professionalism**: Inconsistent layout quality across devices damages credibility

## What Changes

### Capabilities

This change introduces one capability with focused responsive improvements:

1. **responsive-layout-optimization**: Fix layout issues across all screen sizes with proper breakpoints and constraints

### Requirements Overview

**responsive-layout-optimization**:
- Remove `min-height: 100vh` constraint from gallery-hero on mobile
- Replace fixed `max-height` with dynamic constraints that adapt to viewport
- Add proper aspect-ratio preservation for artwork images
- Implement 4-5 column grid for ultra-wide screens (1920px+)
- Add intermediate breakpoint for large laptops (1366px-1919px)
- Constrain max content width to 1600px for readability
- Ensure all critique content is scrollable and accessible
- Optimize image-to-critique ratios per breakpoint

### Scope

- **In Scope**: CSS responsive layout fixes, viewport-specific styles, image aspect ratios
- **Out of Scope**: JavaScript behavior changes, new UI components, content modifications

## How

### Implementation Approach

**Phase 1: Mobile Fixes (≤599px)**
1. Remove `min-height: 100vh` from `.gallery-hero`
2. Change `.critiques-panel max-height` from `70vh` to `none`
3. Add `aspect-ratio: 16/9` to `.artwork-image-container`
4. Ensure single-column critique layout with full scrollability

**Phase 2: Tablet Optimization (600px-1023px)**
1. Adjust image-to-critique ratio to 35%/65% for better balance
2. Implement 2-column critique grid with proper gap spacing
3. Add `max-height: calc(100vh - 180px)` with scroll overflow

**Phase 3: Desktop Enhancement (1024px-1365px)**
1. Maintain 3-column critique grid
2. Set max-width: 1400px on content container
3. Center content with auto margins

**Phase 4: Large Desktop (1366px-1919px)**
1. Implement 4-column critique grid for better space usage
2. Increase max-width to 1600px
3. Adjust padding for wider screens

**Phase 5: Ultra-Wide (1920px+)**
1. Cap layout at 1600px max-width to prevent excessive line length
2. Optionally display 4 columns within constrained width
3. Add horizontal centering with elegant side margins

**Phase 6: Image Aspect Ratio**
1. Add `aspect-ratio` property to all artwork containers
2. Set `object-fit: contain` for artwork images
3. Ensure images scale proportionally without distortion

### Technical Details

**New Breakpoint Strategy**:
```css
/* Mobile: 0-599px */
@media (max-width: 599px) { ... }

/* Tablet: 600px-1023px */
@media (min-width: 600px) and (max-width: 1023px) { ... }

/* Desktop: 1024px-1365px */
@media (min-width: 1024px) and (max-width: 1365px) { ... }

/* Large Desktop: 1366px-1919px */
@media (min-width: 1366px) and (max-width: 1919px) { ... }

/* Ultra-Wide: 1920px+ */
@media (min-width: 1920px) { ... }
```

**Image Aspect Ratio**:
```css
.artwork-image-container {
  aspect-ratio: 16 / 9; /* or 4/3 depending on artwork */
  overflow: hidden;
}

.artwork-image-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}
```

**Max Width Constraint**:
```css
.gallery-hero {
  max-width: 1600px;
  margin-left: auto;
  margin-right: auto;
}
```

### Dependencies

- None (pure CSS changes)

### Risks & Mitigations

- **Risk**: Changing layout may break existing user expectations
  - **Mitigation**: Test thoroughly on real devices before deployment
- **Risk**: Browser compatibility for `aspect-ratio` property
  - **Mitigation**: Provide fallback using padding-bottom hack for older browsers
- **Risk**: Content overflow on very small screens (<320px)
  - **Mitigation**: Add absolute minimum width breakpoint

### Alternatives Considered

1. **JavaScript-based dynamic resizing**: Rejected - CSS-only solution is more performant and maintainable
2. **Complete redesign**: Rejected - focused fixes are less risky and faster to implement
3. **Fluid typography only**: Rejected - layout structure issues require grid/flexbox fixes

## Success Criteria

- ✅ All critique content visible and scrollable on mobile (375px)
- ✅ Artwork images maintain aspect ratio across all viewports
- ✅ No horizontal scrolling on any standard device size
- ✅ Optimal reading line length (<80ch) on all screens
- ✅ Content properly centered and spaced on ultra-wide displays
- ✅ Smooth transitions between breakpoints without jarring jumps
- ✅ All interactive elements (buttons, links) remain accessible

## References

- Playwright MCP test screenshots:
  - `homepage-mobile-375x667.png`
  - `homepage-tablet-768x1024.png`
  - `homepage-desktop-1920x1080.png`
- Current CSS: `styles/main.css` lines 1239-1628
- MDN: CSS `aspect-ratio` property
- MDN: Responsive Design best practices
