# Spec: Hero Section Display and First Artwork Rendering

## Overview

Defines how the hero section displays the first artwork with critic reviews on initial page load, replacing the "scroll to explore" messaging.

---

## MODIFIED Requirements

### Requirement: Hero Section Content Display

**Definition:**
The hero section shall display the first artwork image and associated critic reviews immediately on page load, without any scrolling requirement.

#### Scenario: User loads homepage

Given the user navigates to the main gallery page
When the page finishes loading
Then the user sees:
- The first artwork (id: "artwork-1") displayed prominently
- At least 2 critic reviews for that artwork
- An image occupying 40-70% of the viewport
- Navigation controls at the bottom (Previous/Next buttons)
- Current position indicator ("1 of 4")
- NO "scroll to explore" message
- NO full-page scroll bars

**Acceptance Criteria:**
- Artwork image is fully visible (not cut off)
- First 2-3 critic panels are fully readable without internal scrolling
- All content fits within viewport height
- No horizontal scrolling
- Page responds to user input (buttons clickable)

#### Scenario: Navigation to subsequent artwork

Given the user clicks "Next" button or swipes left
When the artwork changes
Then the user sees:
- Previous artwork fades out (200ms)
- New artwork fades in (300ms)
- New critic reviews load for the new artwork
- Indicator updates to show new position (e.g., "2 of 4")
- Dots highlight current artwork

**Acceptance Criteria:**
- Transition smooth and flicker-free
- New artwork fully visible after transition
- No data loss or inconsistency
- Works on all screen sizes

---

## ADDED Requirements

### Requirement: Artwork Carousel Navigation SHALL Enable Navigation

**Definition:**
Users SHALL be able to navigate between 4 artworks using explicit controls (buttons, dots, keyboard, swipe).

#### Scenario: User navigates with buttons

Given the user can see the gallery interface
When the user clicks "Next" button
Then the next artwork SHALL be displayed (looping from last to first)

When the user clicks "Previous" button
Then the previous artwork SHALL be displayed (looping from first to last)

**Acceptance Criteria:**
- Navigation wraps around (circular/infinite loop)
- No "disabled" states on buttons
- Buttons respond immediately to clicks
- Works on all input methods (mouse, touch, keyboard)

#### Scenario: User navigates with dot indicators

Given the user can see dot indicators at bottom
When the user clicks a specific dot
Then that artwork SHALL be displayed immediately
And all other dots are deselected

**Acceptance Criteria:**
- Dots update to show current artwork
- Clicking any dot navigates directly to that artwork
- Visual indicator clearly shows current selection

#### Scenario: User navigates with keyboard

Given the page has focus
When the user presses ArrowLeft key
Then the previous artwork SHALL be displayed

When the user presses ArrowRight key
Then the next artwork is displayed

**Acceptance Criteria:**
- Arrow key navigation works in all browsers
- Works whether input focus is on button or not
- No conflict with other keyboard shortcuts

#### Scenario: User navigates with touch swipe

Given the user is on a mobile/tablet device
When the user performs a horizontal swipe left
Then the next artwork is displayed

When the user performs a horizontal swipe right
Then the previous artwork SHALL be displayed

**Acceptance Criteria:**
- Swipe must be > 50px horizontal movement
- Vertical movement (50px+) does not trigger swipe
- Swipe works on both touchscreen and mousepad
- No false positives from accidental motion

---

## MODIFIED Requirements

### Requirement: Responsive Layout SHALL Adapt Display

**Definition:**
The artwork display SHALL adapt to different screen sizes while keeping all content visible without scroll.

#### Scenario: Mobile device (375px width)

Given a user views on mobile (375px, 667px height)
When the page loads
Then:
- Artwork image occupies full width, ~40% height
- Critic reviews stack vertically below image
- Navigation bar is fixed at bottom with vertical layout
- No horizontal scrolling
- All text is readable (font size ≥ 14px)

**Acceptance Criteria:**
- Layout is fully vertical (stacked)
- Content fits within device height
- Touch targets are ≥ 44px (accessibility standard)
- Images scale proportionally

#### Scenario: Tablet device (768px width)

Given a user views on tablet (768px width)
When the page loads
Then:
- Artwork image occupies 40% width, left side
- Critic reviews occupy 60% width, right side, in 2-column grid
- Navigation bar at bottom with horizontal layout
- No scrolling required

**Acceptance Criteria:**
- 2-column layout works correctly
- Images scale to fit without distortion
- Critic panels don't overlap

#### Scenario: Desktop (1024px+ width)

Given a user views on desktop (1024px, 768px height)
When the page loads
Then:
- Artwork image occupies 50% width
- Critic reviews occupy 50% width, flexible layout
- Navigation bar at bottom, centered
- All content visible without scroll

**Acceptance Criteria:**
- Content uses screen space efficiently
- Images display at high quality
- Comfortable reading experience

---

## REMOVED Requirements

### Requirement: Hero Section Scroll Prompt
**Removal Reason:** Confusing and invalid when scroll is disabled

The "向下滚动探索" (scroll to explore) message shall be removed from the hero section. Users will instead see actual content and explicit navigation controls.

---

## Implementation Notes

### Related Capabilities
- `artwork-carousel-controller` - Manages navigation state
- `touch-swipe-handler` - Handles mobile swipe input
- `gallery-hero-renderer` - Renders artwork and critics to DOM

### Dependencies
- `VULCA_DATA` must be loaded before hero rendering
- `gallery-init.js` may remain for detail page compatibility

### Data Requirements
- `artworks[0-3]` available in VULCA_DATA
- `critiques` array contains reviews for each artwork
- `personas` array available for critic metadata

### Browser Support
- Chrome 90+ ✓
- Firefox 88+ ✓
- Safari 14+ ✓
- Edge 90+ ✓
- Mobile browsers (iOS Safari, Chrome Mobile) ✓

### Accessibility Requirements
- All buttons have `aria-label` attributes
- Indicator has `aria-live="polite"` for screen reader announcements
- Keyboard navigation fully supported
- Focus indicators visible on all interactive elements
- Sufficient color contrast (WCAG AA)
