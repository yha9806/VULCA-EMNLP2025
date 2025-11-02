# Spec: Responsive Homepage Layout

## Overview

Defines how the homepage layout adapts to different screen sizes and orientations while maintaining usability and keeping all content visible without scrolling.

---

## ADDED Requirements

### Requirement: Mobile Viewport Layout (375px - 599px)

**Definition:**
On mobile devices, the homepage uses a vertical stacked layout with optimized spacing.

#### Scenario: User views on iPhone (375px width)

Given a mobile device with viewport width 375px
When the page loads
Then:
- Artwork image is full width (100%)
- Artwork image height is approximately 40-50vh
- Critic reviews appear below image, stacked vertically
- Each critic panel occupies full width
- Navigation bar fixed at bottom
- All content fits within 100vh window height
- No horizontal scroll
- No vertical scroll (unless critic text extremely long)

**Acceptance Criteria:**
- Layout is single column
- Artwork image visible and proportional
- At least 2 critic reviews visible without scroll
- Touch targets (buttons) are ≥ 44px
- Font sizes readable (minimum 14px)
- Navigation bar doesn't obscure content

#### Scenario: Critical content visibility on small mobile

Given mobile device with limited viewport (375px × 600px)
When the page loads
Then:
- Hero image is visible (not below fold)
- First critic visible (partial text acceptable)
- Next button is touchable
- No "content cut off" feeling

**Acceptance Criteria:**
- Image height: 30-50% of viewport
- Critic panels: 40-50% of viewport
- Nav bar: 10% of viewport
- Total = ~100%

---

### Requirement: Tablet Viewport Layout (600px - 1023px)

**Definition:**
On tablet devices, the homepage uses a 2-column layout optimizing screen real estate.

#### Scenario: User views on iPad (768px width)

Given a tablet device with viewport width 600-1023px
When the page loads
Then:
- Artwork image occupies left side (40-45% width)
- Critic reviews occupy right side (55-60% width)
- Image height matches critic panel height
- Both sides aligned at top
- Navigation bar at bottom, full width
- No horizontal scroll
- Minimal vertical scroll (ideally none)

**Acceptance Criteria:**
- 2-column layout with flexbox
- Image and critics aligned vertically
- Both sides same height
- Navigation bar doesn't obscure content
- Responsive between 600-1023px

#### Scenario: Critic panels on tablet

Given tablet layout with limited critic visibility
When multiple critics are displayed
Then:
- Critic panels use 2-column grid on the right side
- Each critic occupies 50% of the right side width
- Stacking is 2-2 layout (2 per row, 2 rows visible)
- 3rd row may require internal scroll within panel

**Acceptance Criteria:**
- At least 4 critics visible without main scroll
- 6th critic visible partially or scrollable
- Text remains readable (≥ 12px)
- Panels are evenly sized

---

### Requirement: Desktop Viewport Layout (1024px+)

**Definition:**
On desktop, the layout maximizes screen usage with flexible positioning.

#### Scenario: User views on desktop (1440px width)

Given a desktop device with viewport width ≥ 1024px
When the page loads
Then:
- Artwork image occupies 45-55% width
- Critic reviews occupy 45-55% width
- Flexbox distribution for optimal spacing
- Navigation bar at bottom, centered controls
- All content visible without scroll
- Professional reading experience with generous padding

**Acceptance Criteria:**
- Layout is balanced (roughly equal image and critics width)
- Image aspect ratio preserved
- Critic text lines are comfortable length (40-80 chars)
- Good use of whitespace
- No content crowding

#### Scenario: Large desktop (1920px+ ultrawide)

Given an ultrawide desktop (1920px+)
When the page loads
Then:
- Content doesn't stretch excessively
- Max-width constraint prevents awkward layouts
- Spacing scales proportionally

**Acceptance Criteria:**
- Comfortable reading experience maintained
- Not too much whitespace
- Image quality not degraded

---

## MODIFIED Requirements

### Requirement: Header Layout (All Viewports)

**Definition:**
The header is compact, sticky, and responsive across all sizes.

#### Scenario: Header on mobile

Given mobile device (375px)
When the page loads
Then:
- Header height is 50-60px
- Hamburger menu visible
- Language toggle visible
- Logo/title may be hidden or very small
- No horizontal scroll

**Acceptance Criteria:**
- Header doesn't take > 10% of viewport height
- Icons clear and touchable (≥ 44px)

#### Scenario: Header on tablet/desktop

Given tablet or desktop device
When the page loads
Then:
- Header height is 60-70px
- All controls visible and properly spaced
- Logo/title visible if applicable
- Consistent with mobile header

**Acceptance Criteria:**
- Responsive scaling of header elements
- Maintains consistency across sizes

---

## MODIFIED Requirements

### Requirement: Navigation Bar Layout (All Viewports) SHALL Be Responsive

**Definition:**
The bottom navigation bar SHALL be fixed, responsive, and accessible across all sizes.

#### Scenario: Navigation bar on mobile

Given mobile device
When the page loads
Then:
- Navigation bar height: 70-80px
- Fixed position at bottom
- Previous/Next buttons stacked or horizontal
- Indicator text: "1 of 4" format
- Dots may be hidden on very small screens (< 500px)

**Acceptance Criteria:**
- Buttons are ≥ 44px touch target
- Text is readable (≥ 12px)
- Doesn't obscure main content
- Proper spacing between elements

#### Scenario: Navigation bar on tablet/desktop

Given tablet or desktop device
When the page loads
Then the navigation bar SHALL:
- Be 70-100px tall
- Be fixed at bottom
- Show Previous/Next buttons on sides or center
- Show indicator and dots all visible
- Be centered or spread layout

**Acceptance Criteria:**
- Professional appearance
- Clear visual hierarchy
- All controls accessible

---

## ADDED Requirements

### Requirement: Image Responsive Behavior

**Definition:**
Images scale appropriately across viewports without distortion.

#### Scenario: Image on mobile

Given mobile device (375px width)
When the image loads
Then:
- Image width is 100% of container
- Image height maintains aspect ratio
- Image fits within allocated 40-50vh
- No horizontal scroll
- Image is centered and properly aligned

**Acceptance Criteria:**
- No distortion or stretching
- Aspect ratio preserved
- Proper object-fit (contain or cover)
- Alt text available

#### Scenario: Image on tablet

Given tablet device (768px width)
When the image loads
Then:
- Image width is approximately 40% of viewport
- Image height matches critic panel height or constrained
- Aspect ratio maintained
- High visual quality

**Acceptance Criteria:**
- Natural look, no distortion
- Clear and detailed

#### Scenario: Image on desktop

Given desktop device (1440px width)
When the image loads
Then:
- Image width is approximately 50% of viewport
- Image occupies meaningful space
- High resolution quality displayed
- Professional appearance

**Acceptance Criteria:**
- Full quality image visible
- Detail preserved
- Comfortable viewing distance

---

## ADDED Requirements

### Requirement: Text Reflow and Readability

**Definition:**
Text content reflows appropriately on all screen sizes while maintaining readability.

#### Scenario: Critic review text on mobile

Given mobile device
When viewing critic review text
Then:
- Font size minimum 14px (body text)
- Font size minimum 12px (small text, if any)
- Line length < 60 characters (optimal reading)
- Line height ≥ 1.5em (spacing)
- Sufficient contrast (WCAG AA)

**Acceptance Criteria:**
- Text is readable without zoom
- No horizontal scroll required
- Comfortable reading experience

#### Scenario: Critic review text on desktop

Given desktop device
When viewing critic review text
Then:
- Font size 14-16px (body text)
- Line length 50-80 characters (optimal)
- Line height ≥ 1.6em
- Proper margins/padding

**Acceptance Criteria:**
- Professional typography
- No eye strain
- Easy comprehension

---

## ADDED Requirements

### Requirement: Overflow and Scrolling Behavior

**Definition:**
Scrolling behavior is controlled and predictable across viewports.

#### Scenario: Critic panel overflow on small viewport

Given mobile device with limited height
When there are more than 3 critics visible
Then:
- Critic panel may have internal scroll (not page scroll)
- Main page scroll remains disabled
- Critic panel scroll is smooth and visible
- Scrollbar is accessible

**Acceptance Criteria:**
- Internal scrolling works
- Main page scroll disabled
- Logical overflow behavior

#### Scenario: No overflow on desktop

Given desktop device with ample viewport
When the page loads
Then:
- All content fits without any scroll
- No internal critic panel scroll
- Full immersive experience

**Acceptance Criteria:**
- All 6 critics visible (or at least 5)
- No unexpected scrolling

---

## ADDED Requirements

### Requirement: Orientation Handling SHALL Support Rotation

**Definition:**
Layout SHALL adapt to device orientation changes (portrait/landscape).

#### Scenario: User rotates mobile from portrait to landscape

Given user has mobile in portrait (375px × 812px)
When the device is rotated to landscape (812px × 375px)
Then it SHALL:
- Switch layout to horizontal orientation
- Use image and critics width efficiently
- Keep navigation bar accessible
- Not lose or hide any content

**Acceptance Criteria:**
- Immediate responsive adjustment
- Smooth transition (no flashing)
- All content still visible and usable

#### Scenario: Tablet landscape viewing

Given tablet in landscape (1024px × 680px)
When the page displays
Then:
- Layout utilizes landscape width effectively
- Image larger and more prominent
- Critic panels well-positioned
- Natural use of wider viewport

**Acceptance Criteria:**
- Professional appearance
- Optimal use of space

---

## Implementation Notes

### Breakpoints

```css
/* Mobile First Approach */
/* Base: 0px - 374px (minimum mobile) */
.layout { display: flex; flex-direction: column; }

/* Mobile: 375px - 599px */
@media (min-width: 375px) { /* ... */ }

/* Tablet: 600px - 1023px */
@media (min-width: 600px) {
  .layout { display: grid; grid-template-columns: 40% 60%; }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) { /* ... */ }

/* Large Desktop: 1440px+ */
@media (min-width: 1440px) { /* ... */ }

/* Ultrawide: 1920px+ */
@media (min-width: 1920px) { /* ... */ }
```

### Sizing Strategy

- **Heights:** Use vh (viewport height) for flexible layouts
- **Widths:** Use % for responsive grid, px for fixed minimum
- **Fonts:** Use clamp() for fluid typography
  - `clamp(12px, 2vw, 16px)` scales between min-max
- **Spacing:** Use var() CSS custom properties

### Testing Viewports

- 375px (iPhone SE)
- 414px (iPhone 12)
- 768px (iPad)
- 1024px (iPad Pro)
- 1440px (Laptop)
- 1920px (Desktop)
- 2560px (Large monitor)

### Accessibility Considerations

- Minimum touch target: 44px × 44px
- Minimum text size: 12px (small), 14px (body)
- Color contrast: WCAG AA (4.5:1 text)
- Readable line length: 45-75 characters
- Text reflow: must work without scrolling (WCAG 2.1 Level AA)

### Performance Notes

- Use CSS media queries (no JS for layout)
- Lazy load images if appropriate
- Consider performance at small viewport sizes
- Test Core Web Vitals on mobile
