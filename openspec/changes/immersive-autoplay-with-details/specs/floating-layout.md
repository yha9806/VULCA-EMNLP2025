# Capability Spec: Floating Experimental Layout

**Change**: `immersive-autoplay-with-details`
**Capability**: Image-Dominant Floating Panel Layout
**Owner**: Implementation Phase 3
**Status**: Specification Ready

---

## Purpose

Create an experimental, conversational visual aesthetic where artwork images dominate the visual hierarchy (70% width on desktop) while critique panels and visualizations float absolutely positioned around them in a "random, experimental" arrangement that evokes a gallery conversation.

---

## Requirements

### Functional Requirements

#### FR1: Image-Dominant Layout
- **Desktop Behavior (1024px+)**: Image takes 70% of viewport width
- **Image Properties**:
  - `position: relative` (establishes context for floating elements)
  - `width: 70%` (fixed proportion)
  - `height: 100vh` (full viewport height)
  - `object-fit: cover` (fill space while maintaining aspect)
  - `object-position: center` (center artwork)
  - Left-aligned in viewport

#### FR2: Floating Critique Panels
- **Position Strategy**: Absolute positioning independent of content flow
- **Primary Panel Placement**:
  - `position: absolute`
  - `right: calc(30% + 2rem)` (float right of image, adjust for remaining space)
  - `top: 50%`
  - `transform: translateY(-50%)` (vertical center)
  - `width: 280px` (fixed width)
  - `max-height: 400px` (constraint, avoid overflow)

- **Multiple Panels**: For artworks with 6 reviews:
  - Panel 1: Top-right (y: 20%)
  - Panel 2: Mid-right (y: 50%)
  - Panel 3: Bottom-right (y: 80%)
  - Additional panels: Stack or overlap with transparency

#### FR3: Visualization Container (RPAIT Grid)
- **Position**: Bottom-left corner
  - `position: absolute`
  - `bottom: 2rem`
  - `left: 2rem`
  - `width: 280px`

- **Content**: RPAIT score grid (5 bars: R, P, A, I, T)
- **Layout**: `display: grid; grid-template-columns: repeat(5, 1fr)`
- **Styling**: Ghost UI (transparent, blurred background)

#### FR4: Ghost UI Aesthetic
- **Transparency**: `rgba(255, 255, 255, 0.3)` for panels
- **Blur Effect**: `backdrop-filter: blur(8px)`
- **Borders**:
  - Left border: `3px solid var(--color-persona)` (color-coded)
  - Minimal: `1px solid rgba(128, 128, 128, 0.1)`
- **Shadows**: `box-shadow: none` (no depth effect)
- **Border Radius**: `border-radius: 0` (sharp edges)
- **Overall**: Ethereal, ghost-like appearance

#### FR5: Responsive Transformation
- **Mobile (375px-767px)**:
  - Image: 100% width, 50vh height
  - Panels: `position: static`, stack vertically below image
  - Visualization: `position: static`, below panels
  - Behavior: Fully scrollable

- **Tablet (768px-1023px)**:
  - Image: 65% width, 90vh height
  - Panels: `position: absolute`, float right
  - Visualization: `position: absolute`, bottom-left
  - Behavior: Two-column feeling

- **Desktop (1024px+)**:
  - Image: 70% width, 100vh height
  - Panels: `position: absolute`, floating right
  - Visualization: `position: absolute`, bottom-left
  - Behavior: Full experimental floating layout

---

## Non-Functional Requirements

### NFR1: Visual Hierarchy
- **Primary**: Artwork image (70% of viewport)
- **Secondary**: Critique panels and text (floating accent)
- **Tertiary**: RPAIT visualization (data reference)
- **No Content Lost**: All critique text readable despite transparency

### NFR2: Responsive Flexibility
- **Smooth Transitions**: No jarring layout shifts between breakpoints
- **Touch-Friendly**: Panels don't overlay in ways that block touch targets
- **Mobile-Optimized**: Stack on mobile, float on desktop

### NFR3: Performance
- **Rendering**: Absolute positioning has minimal reflow impact
- **Animations**: Smooth fade-in/fade-out of floating panels (60 FPS)
- **No Layout Thrashing**: Batch DOM updates, avoid excessive reflows

### NFR4: Aesthetic Consistency
- **Design Cohesion**: Ghost UI style matches across all elements
- **Color Coordination**: Panels reflect persona color via left border
- **Typography**: Clear, sharp text despite transparent background
- **Spacing**: Consistent padding/margins across elements

---

## Architecture & CSS Structure

### HTML Structure

```html
<div class="gallery-container">
  <!-- Image: Primary focus -->
  <div class="artwork-section">
    <img class="artwork-image" src="/assets/artwork1.jpg" alt="Artwork title">
  </div>

  <!-- Floating Critique Panels -->
  <div class="critique-panels-container">
    <div class="critique-panel" data-critic="su-shi">
      <h3>苏轼</h3>
      <p>This work speaks to...</p>
    </div>
    <div class="critique-panel" data-critic="guo-xi">
      <h3>郭熙</h3>
      <p>The composition reveals...</p>
    </div>
    <!-- More panels -->
  </div>

  <!-- Floating Visualization -->
  <div class="visualization-container">
    <div class="rpait-grid">
      <!-- RPAIT bars -->
    </div>
  </div>
</div>
```

### CSS Architecture

#### Base Container

```css
.gallery-container {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
}
```

#### Image Section (Primary)

```css
.artwork-section {
  position: relative;
  width: 70%;
  height: 100vh;
  flex-shrink: 0;
  overflow: hidden;
}

.artwork-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

/* Fade-in animation */
@keyframes fadeInImage {
  from { opacity: 0; }
  to { opacity: 1; }
}

.artwork-image.fade-in {
  animation: fadeInImage 1.2s ease-out;
}
```

#### Floating Critique Panels

```css
.critique-panels-container {
  position: absolute;
  top: 0;
  right: 0;
  width: 30%;
  height: 100vh;
  pointer-events: none;  /* Don't interfere with click events */
}

.critique-panel {
  position: absolute;
  right: 2rem;
  width: 280px;
  max-height: 400px;
  padding: 1.5rem;
  pointer-events: auto;  /* Re-enable clicks on panel */

  /* Ghost UI */
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
  border-left: 3px solid var(--color-persona);
  border: 1px solid rgba(128, 128, 128, 0.1);
  border-radius: 0;
  box-shadow: none;

  /* Typography */
  font-size: 0.95rem;
  line-height: 1.5;
  color: #333;

  /* Animation */
  opacity: 0;
  transition: opacity 0.8s ease-in-out;
  z-index: 10;
}

.critique-panel.visible {
  opacity: 1;
}

.critique-panel h3 {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #222;
}

.critique-panel p {
  margin: 0;
  color: #444;
}

/* Dynamic positioning per panel index */
.critique-panel:nth-child(1) {
  top: 10%;
}

.critique-panel:nth-child(2) {
  top: 45%;
}

.critique-panel:nth-child(3) {
  top: 75%;
}

.critique-panel:nth-child(4) {
  top: 15%;
  left: 2rem;  /* Float left of image for variety */
}

.critique-panel:nth-child(5) {
  top: 50%;
  left: 2rem;
}

.critique-panel:nth-child(6) {
  top: 80%;
  left: 2rem;
}
```

#### Floating Visualization (RPAIT)

```css
.visualization-container {
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  width: 280px;
  padding: 1rem;

  /* Ghost UI */
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(128, 128, 128, 0.1);
  border-radius: 0;
  box-shadow: none;

  /* Animation */
  opacity: 0;
  transition: opacity 0.8s ease-in-out;
  z-index: 10;
}

.visualization-container.visible {
  opacity: 1;
}

.rpait-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
}

.rpait-bar {
  font-size: 0.7rem;
  font-weight: 600;
  text-align: center;
}

.rpait-bar label {
  display: block;
  margin-bottom: 0.25rem;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rpait-bar .bar {
  height: 60px;
  background: #f0f0f0;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 0.25rem;
}

.rpait-bar .fill {
  height: 100%;
  background: linear-gradient(180deg, #B85C3C 0%, #D4795F 100%);
  width: 100%;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  color: white;
  font-size: 0.6rem;
  font-weight: 700;
}

.rpait-bar .fill::after {
  content: attr(data-score);
  padding-bottom: 2px;
}
```

### Responsive Breakpoints

#### Mobile (375px - 767px)

```css
@media (max-width: 767px) {
  .gallery-container {
    flex-direction: column;
    height: auto;
    overflow-y: auto;
  }

  .artwork-section {
    width: 100%;
    height: 50vh;
  }

  .artwork-image {
    height: 100%;
  }

  .critique-panels-container {
    position: static;
    width: 100%;
    height: auto;
    pointer-events: auto;
  }

  .critique-panel {
    position: static;
    width: 100%;
    max-height: none;
    margin: 1rem;
    opacity: 1;
    animation: none;
  }

  .visualization-container {
    position: static;
    width: 100%;
    max-width: 100%;
    margin: 1rem;
    opacity: 1;
  }
}
```

#### Tablet (768px - 1023px)

```css
@media (min-width: 768px) and (max-width: 1023px) {
  .gallery-container {
    height: 100vh;
  }

  .artwork-section {
    width: 65%;
    height: 100vh;
  }

  .critique-panels-container {
    width: 35%;
    pointer-events: none;
  }

  .critique-panel {
    position: absolute;
    right: 1rem;
    width: 240px;
    pointer-events: auto;
  }

  .visualization-container {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    width: 240px;
  }
}
```

#### Desktop (1024px+)

```css
@media (min-width: 1024px) {
  .gallery-container {
    height: 100vh;
  }

  .artwork-section {
    width: 70%;
    height: 100vh;
  }

  .critique-panels-container {
    width: 30%;
  }

  .critique-panel {
    position: absolute;
    right: 2rem;
    width: 280px;
    max-height: 400px;
  }

  .visualization-container {
    position: absolute;
    bottom: 2rem;
    left: 2rem;
    width: 280px;
  }
}
```

---

## Animation & Transitions

### Panel Fade-In/Out

```javascript
// Pseudocode (from autoplay.js)
function showPanel(panelIndex, duration = 1200) {
  const panel = document.querySelector(`.critique-panel:nth-child(${panelIndex})`);
  panel.classList.add('visible');
  // Fade in over 1.2s
}

function hidePanel(panelIndex, duration = 800) {
  const panel = document.querySelector(`.critique-panel:nth-child(${panelIndex})`);
  panel.classList.remove('visible');
  // Fade out over 0.8s
}
```

### CSS Animations

```css
/* Fade-in for panels */
@keyframes panelFadeIn {
  from {
    opacity: 0;
    transform: translateX(10px);  /* Subtle slide from right */
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.critique-panel.visible {
  animation: panelFadeIn 1.2s ease-out;
}

/* Fade-out for panels */
@keyframes panelFadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translateX(-10px);  /* Subtle slide to left */
  }
}

.critique-panel:not(.visible) {
  animation: panelFadeOut 0.8s ease-in;
}
```

---

## Color & Visual System

### Color Coordination

Each persona has a dedicated color used throughout:

```javascript
{
  id: "su-shi",
  nameZh: "苏轼",
  color: "#B85C3C",  // Warm terracotta
}

{
  id: "guo-xi",
  color: "#4A90A4",  // Cool teal
}

{
  id: "john-ruskin",
  color: "#8B6F47",  // Earthy brown
}

{
  id: "mama-zola",
  color: "#D4795F",  // Coral
}

{
  id: "professor-petrova",
  color: "#6B5B3A",  // Dark olive
}

{
  id: "ai-ethics",
  color: "#A0522D",  // Sienna
}
```

### Usage in Layout

```css
.critique-panel {
  border-left-color: var(--color-persona);  /* Themed per critic */
}

.rpait-grid .fill {
  background: linear-gradient(180deg, var(--color-persona) 0%, /* Darkened */ 100%);
}

.critic-card {
  background: color-mix(in srgb, var(--color-persona) 10%, white);  /* Subtle tint */
}
```

---

## Validation Criteria

### Layout Validation

- [ ] **VC1**: Image takes exactly 70% width on desktop (1024px+)
  - **Test**: Browser DevTools, measure image width
  - **Expected**: Image width = viewport width × 0.7

- [ ] **VC2**: Critique panels float right of image
  - **Test**: Visual inspection
  - **Expected**: Panels visible in right 30% space, overlaying white background

- [ ] **VC3**: Visualization floats bottom-left
  - **Test**: Visual inspection
  - **Expected**: RPAIT grid visible in bottom-left corner

- [ ] **VC4**: No horizontal scroll on main page
  - **Test**: Resize browser, check for horizontal scrollbar
  - **Expected**: No horizontal scroll at any viewport size

- [ ] **VC5**: Responsive breakpoints work correctly
  - **Test**: Resize to 375px, 768px, 1024px, 1440px
  - **Expected**: Layout transforms appropriately at each breakpoint

### Visual Validation

- [ ] **VC6**: Ghost UI transparency consistent
  - **Test**: Visual inspection
  - **Expected**: Panels show background image/color through them

- [ ] **VC7**: Blur effect visible
  - **Test**: Visual inspection of panels
  - **Expected**: Backdrop appears blurred, distinct from sharp background

- [ ] **VC8**: Color borders present and correct
  - **Test**: Inspect each panel's left border
  - **Expected**: 3px colored border matching persona color

- [ ] **VC9**: No box shadows (ghost aesthetic)
  - **Test**: DevTools inspect elements
  - **Expected**: `box-shadow: none` in computed styles

- [ ] **VC10**: Animations smooth (60 FPS)
  - **Test**: DevTools Performance tab, trigger panel animations
  - **Expected**: Consistent 60 FPS frame rate

### Mobile Responsive Validation

- [ ] **VC11**: Mobile layout single column
  - **Test**: View at 375px
  - **Expected**: Image above, panels below, stacked vertically

- [ ] **VC12**: Mobile all content readable
  - **Test**: Read all text without zooming
  - **Expected**: Font size ≥ 16px, line-height ≥ 1.5

- [ ] **VC13**: Mobile panels accessible (not floating off-screen)
  - **Test**: Scroll mobile viewport
  - **Expected**: All panels visible when scrolling, no cutoff

### Tablet Validation

- [ ] **VC14**: Tablet shows floating panels
  - **Test**: View at 768px
  - **Expected**: Image on left (65%), panels float right

- [ ] **VC15**: Tablet no overlap issues
  - **Test**: Check text readability
  - **Expected**: No text overlap, all content visible

### Desktop Validation

- [ ] **VC16**: Desktop shows full floating layout
  - **Test**: View at 1024px+
  - **Expected**: Image 70%, panels float right, viz bottom-left

- [ ] **VC17**: Panel positioning varied
  - **Test**: Visual inspection
  - **Expected**: Panels at different vertical positions (top, mid, bottom)

- [ ] **VC18**: Artwork fully visible
  - **Test**: Check image not hidden by panels
  - **Expected**: Image clearly visible, panels offset to right

### Accessibility Validation

- [ ] **VC19**: Text readable despite transparency
  - **Test**: Check color contrast
  - **Expected**: Text ≥ 4.5:1 ratio

- [ ] **VC20**: Floating panels don't block interactive elements
  - **Test**: Click on menu button, check hit area
  - **Expected**: Menu button clickable, no overlap from panels

---

## Performance Considerations

### Rendering Optimization

```css
/* Use transform for animations (GPU accelerated) */
.critique-panel {
  will-change: opacity;  /* Hint to browser */
  transform: translateZ(0);  /* Force GPU acceleration */
}

/* Avoid expensive properties */
.critique-panel {
  /* ❌ AVOID: box-shadow: 0 10px 30px rgba(0,0,0,0.3); */
  /* ✅ USE: box-shadow: none; */
}
```

### Layout Stability

```css
/* Absolute positioning avoids layout recalculation */
.critique-panel {
  position: absolute;
  /* Does not affect siblings' layout */
}

/* Container query for responsive without reflow */
@container (min-width: 1024px) {
  .critique-panel {
    width: 280px;
  }
}
```

---

## Browser Support

- **Chrome 90+**: Full support (backdrop-filter, CSS Grid, etc.)
- **Firefox 88+**: Full support
- **Safari 14+**: Full support (backdrop-filter partial, but acceptable)
- **Edge 90+**: Full support
- **Mobile Safari (iOS 14+)**: Full support
- **Chrome Android**: Full support

**Fallback for backdrop-filter**:
```css
.critique-panel {
  background: rgba(255, 255, 255, 0.3);
  /* backdrop-filter not supported in some browsers */
  @supports (backdrop-filter: blur(8px)) {
    backdrop-filter: blur(8px);
  }
}
```

---

## Testing Strategy

### Visual Regression Testing
1. Capture screenshots at 375px, 768px, 1024px, 1440px
2. Compare before/after layout changes
3. Use Percy.io or similar automated comparison

### Performance Testing
1. Run Lighthouse on main page (target: 85+ Performance)
2. Profile scroll performance (target: 60 FPS)
3. Measure time to interactive (target: < 3.5s)

### Responsive Testing
1. Manual browser resize (375px, 768px, 1024px, 1440px)
2. DevTools device emulation (iPhone 12, iPad, Galaxy S10)
3. Actual device testing (if available)

### Accessibility Testing
1. WAVE browser extension for contrast
2. NVDA/JAWS screen reader testing
3. Keyboard navigation (Tab through all elements)

---

## Dependencies

### Internal Dependencies
- `js/autoplay.js` - Controls panel visibility and timing
- `styles/main.css` - All layout and styling

### External Dependencies
- None (CSS and DOM only)

### Breaking Changes
- None (layout enhancement, no structural changes)

---

## Documentation & Examples

### Developer Guide: Adjust Panel Positions

```css
/* To change panel positions, modify these in styles/main.css: */

.critique-panel:nth-child(1) {
  top: 10%;  /* Change from 10% to custom value */
}

.critique-panel:nth-child(2) {
  top: 45%;  /* Change from 45% to custom value */
}
```

### Developer Guide: Change Visualization Position

```css
/* Move RPAIT grid to different corner: */

/* Bottom-left (default) */
.visualization-container {
  bottom: 2rem;
  left: 2rem;
}

/* Bottom-right */
.visualization-container {
  bottom: 2rem;
  right: 2rem;
}

/* Top-left */
.visualization-container {
  top: 2rem;
  left: 2rem;
}
```

---

## Success Metrics

| Metric | Target | Actual |
|--------|--------|--------|
| Image width (desktop) | 70% | TBD |
| Floating panels visible | 100% | TBD |
| Responsive at all breakpoints | 100% | TBD |
| Animation smoothness | 60 FPS | TBD |
| Performance score | 85+ | TBD |
| No layout shift (CLS) | < 0.1 | TBD |
| Text readability | WCAG AA | TBD |

---

## Version History

| Version | Date | Author | Change |
|---------|------|--------|--------|
| 1.0 | 2025-11-01 | Claude | Initial specification |
