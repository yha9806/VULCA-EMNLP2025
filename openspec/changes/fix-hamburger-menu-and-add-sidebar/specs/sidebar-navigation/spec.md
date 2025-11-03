# Spec: Sidebar Navigation

## Overview

Transform the floating menu into a full-height sidebar that slides from the left side of the screen, providing a modern and intuitive navigation experience.

---

## MODIFIED Requirements

### Requirement: Sidebar Layout and Positioning

The navigation menu SHALL be displayed as a full-height sidebar positioned on the left side of the viewport.

**Rationale**: Sidebars provide a larger interaction area, better visual hierarchy, and are more familiar to users compared to floating card-style menus.

**Scenarios**:

#### Scenario 1.1: Sidebar dimensions and position
**Given** the navigation menu is rendered
**When** the page loads
**Then** the sidebar SHALL be 300px wide
**And** the sidebar SHALL be positioned at the left edge (left: 0)
**And** the sidebar SHALL span the full viewport height (height: 100vh)
**And** the sidebar SHALL be initially hidden off-screen (transform: translateX(-100%))

**Validation**:
```css
/* styles/main.css */
.floating-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 300px;
  height: 100vh;
  transform: translateX(-100%);
}
```

---

#### Scenario 1.2: Responsive width on mobile
**Given** the viewport width is less than 400px
**When** the sidebar opens
**Then** the sidebar width SHALL be `min(300px, 90vw)`
**And** the sidebar SHALL not exceed 90% of viewport width

**Validation**:
```css
.floating-menu {
  width: min(300px, 90vw);
}
```

---

### Requirement: Slide-Out Animation

The sidebar SHALL slide in from the left using GPU-accelerated transform animations.

**Rationale**: Transform-based animations provide 60fps performance on all devices, unlike position-based animations which trigger expensive layout recalculations.

**Scenarios**:

#### Scenario 2.1: Opening animation
**Given** the menu is closed (hidden attribute present)
**When** the user clicks the hamburger button
**Then** the `hidden` attribute SHALL be removed
**And** the sidebar SHALL animate from `translateX(-100%)` to `translateX(0)`
**And** the animation duration SHALL be 300ms
**And** the animation easing SHALL be `cubic-bezier(0.4, 0, 0.2, 1)`

**Validation**:
```css
.floating-menu {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.floating-menu:not([hidden]) {
  transform: translateX(0);
}
```

---

#### Scenario 2.2: Closing animation
**Given** the menu is open (no hidden attribute)
**When** the user closes the menu (via any close method)
**Then** the sidebar SHALL animate from `translateX(0)` to `translateX(-100%)`
**And** the `hidden` attribute SHALL be added after animation completes
**And** the animation SHALL maintain 60fps framerate

---

#### Scenario 2.3: Animation performance
**Given** the sidebar is animating
**When** measuring with Chrome DevTools Performance tab
**Then** the animation SHALL achieve 60fps
**And** no layout recalculations SHALL occur during animation
**And** only composite operations SHALL be triggered

---

### Requirement: Overlay Background

A semi-transparent overlay SHALL appear behind the sidebar when it opens, covering the entire viewport.

**Rationale**: The overlay provides visual context that the sidebar is a modal interaction and clicking outside will close it. This is a familiar pattern in modern web applications.

**Scenarios**:

#### Scenario 3.1: Overlay appearance
**Given** the menu is opening
**When** the sidebar slides in
**Then** a `.menu-overlay` element SHALL appear
**And** the overlay SHALL cover the entire viewport (position: fixed, inset: 0)
**And** the overlay background SHALL be `rgba(0, 0, 0, 0.5)`
**And** the overlay SHALL fade in over 300ms

**Validation**:
```html
<!-- HTML structure -->
<div class="menu-overlay" id="menu-overlay"></div>
```

```css
/* styles/main.css */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: calc(var(--z-menu) - 1);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.menu-overlay.active {
  opacity: 1;
  pointer-events: all;
}
```

---

#### Scenario 3.2: Overlay interaction
**Given** the menu is open and the overlay is visible
**When** the user clicks on the overlay
**Then** the menu SHALL close
**And** the overlay SHALL fade out

---

#### Scenario 3.3: Overlay z-index layering
**Given** the sidebar and overlay are both visible
**When** inspecting the z-index stack
**Then** the overlay SHALL have z-index of `var(--z-menu) - 1` (999)
**And** the sidebar SHALL have z-index of `var(--z-menu)` (1000)
**And** the sidebar SHALL appear above the overlay

---

### Requirement: Visual Styling

The sidebar SHALL have appropriate visual styling with shadows, spacing, and scrolling.

**Scenarios**:

#### Scenario 4.1: Shadow and depth
**Given** the sidebar is open
**When** viewing the sidebar
**Then** it SHALL have a shadow of `2px 0 12px rgba(0, 0, 0, 0.15)`
**And** the shadow SHALL appear on the right edge
**And** the background SHALL be solid white (or #2a2a2a in dark mode)

**Validation**:
```css
.floating-menu {
  background: white;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.15);
}

@media (prefers-color-scheme: dark) {
  .floating-menu {
    background: #2a2a2a;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.3);
  }
}
```

---

#### Scenario 4.2: Content scrolling
**Given** the sidebar contains more content than viewport height
**When** the user scrolls within the sidebar
**Then** the sidebar content SHALL scroll vertically
**And** the scrollbar SHALL be visible only when needed
**And** the scrollbar SHALL match the OS theme

**Validation**:
```css
.floating-menu {
  overflow-y: auto;
}
```

---

#### Scenario 4.3: Internal spacing
**Given** the sidebar is rendered
**When** viewing the menu items
**Then** the sidebar SHALL have vertical padding of `var(--spacing-lg)`
**And** menu items SHALL have horizontal padding of `var(--spacing-md)`
**And** menu items SHALL have gap of `var(--spacing-xs)` between them

---

### Requirement: Close Interactions

The sidebar SHALL support multiple methods of closing.

**Rationale**: Providing multiple close methods accommodates different user preferences and contexts (mouse users, keyboard users, mobile users).

**Scenarios**:

#### Scenario 5.1: Click overlay to close
**Given** the sidebar is open
**When** the user clicks the overlay background
**Then** the sidebar SHALL close
**And** the overlay SHALL fade out

---

#### Scenario 5.2: Click outside menu area to close
**Given** the sidebar is open
**When** the user clicks anywhere outside the sidebar and hamburger button
**Then** the sidebar SHALL close

---

#### Scenario 5.3: Press Escape key to close
**Given** the sidebar is open
**When** the user presses the Escape key
**Then** the sidebar SHALL close
**And** focus SHALL return to the hamburger button

---

#### Scenario 5.4: Click menu item to close (mobile only)
**Given** the sidebar is open on a mobile device (viewport < 768px)
**When** the user clicks a menu item
**Then** the sidebar SHALL close
**And** the page SHALL navigate to the selected page

**Validation**:
```javascript
// js/navigation.js
this.menuItems.forEach(item => {
  item.addEventListener('click', () => {
    if (window.innerWidth < 768) {
      this.closeMenu();
    }
  });
});
```

---

### Requirement: Accessibility Compliance

The sidebar SHALL meet WCAG 2.1 AA accessibility standards.

**Scenarios**:

#### Scenario 6.1: ARIA attributes
**Given** the sidebar is in any state
**When** inspecting the DOM
**Then** the hamburger button SHALL have `aria-expanded` matching the menu state
**And** the hamburger button SHALL have `aria-controls="floating-menu"`
**And** the sidebar SHALL have `role="navigation"`
**And** the sidebar SHALL have `aria-label="主导航菜单"`

**Validation**:
```html
<button
  id="menu-toggle"
  aria-label="打开菜单"
  aria-expanded="false"
  aria-controls="floating-menu">
</button>

<nav
  id="floating-menu"
  role="navigation"
  aria-label="主导航菜单">
</nav>
```

---

#### Scenario 6.2: Focus management
**Given** the sidebar opens
**When** the open animation completes
**Then** focus SHALL move to the first menu item
**And** users SHALL be able to Tab through all menu items

---

#### Scenario 6.3: Focus trap (optional, future enhancement)
**Given** the sidebar is open
**When** the user tabs through all menu items
**Then** focus SHALL cycle back to the first menu item
**And** focus SHALL not escape to the page content behind the overlay

---

## ADDED Requirements

### Requirement: HTML Structure Update

All pages SHALL include the overlay element for the sidebar interaction.

**Scenarios**:

#### Scenario 7.1: Overlay element presence
**Given** any page (index.html or pages/*.html)
**When** the DOM loads
**Then** a `<div class="menu-overlay" id="menu-overlay"></div>` element SHALL exist
**And** the element SHALL be placed before the `.floating-menu` element
**And** the element SHALL be a direct child of `<body>`

**Validation**:
```bash
# Verify all pages have overlay element
rg '<div class="menu-overlay"' index.html pages/*.html
# Expected: 4 matches
```

---

### Requirement: JavaScript Overlay Management

The `NavigationHandler` class SHALL manage the overlay's active state.

**Scenarios**:

#### Scenario 8.1: Overlay activation on menu open
**Given** the menu is closed
**When** `openMenu()` is called
**Then** the `.active` class SHALL be added to `.menu-overlay`
**And** the overlay SHALL become visible

**Validation**:
```javascript
// js/navigation.js
openMenu() {
  this.menuDrawer.removeAttribute('hidden');
  this.menuOverlay.classList.add('active');
  this.menuToggle.setAttribute('aria-expanded', 'true');
}
```

---

#### Scenario 8.2: Overlay deactivation on menu close
**Given** the menu is open
**When** `closeMenu()` is called
**Then** the `.active` class SHALL be removed from `.menu-overlay`
**And** the overlay SHALL become invisible

**Validation**:
```javascript
closeMenu() {
  this.menuDrawer.setAttribute('hidden', '');
  this.menuOverlay.classList.remove('active');
  this.menuToggle.setAttribute('aria-expanded', 'false');
}
```

---

#### Scenario 8.3: Overlay click event listener
**Given** the `NavigationHandler` is initialized
**When** binding events
**Then** a click listener SHALL be added to `.menu-overlay`
**And** clicking the overlay SHALL call `closeMenu()`

**Validation**:
```javascript
// js/navigation.js
this.menuOverlay.addEventListener('click', () => {
  this.closeMenu();
});
```

---

## Test Coverage

### Visual Regression Tests

Use browser screenshot comparison to verify:
1. Sidebar width at 300px
2. Overlay opacity at 50%
3. Shadow styling
4. Animation smoothness (60fps)

### Cross-Browser Tests

| Browser | Version | Sidebar Opens | Animation Smooth | Overlay Works | Close Functions |
|---------|---------|---------------|------------------|---------------|-----------------|
| Chrome | 90+ | ✅ | ✅ | ✅ | ✅ |
| Firefox | 88+ | ✅ | ✅ | ✅ | ✅ |
| Safari | 14+ | ✅ | ✅ | ✅ | ✅ |
| Edge | 90+ | ✅ | ✅ | ✅ | ✅ |

### Responsive Tests

| Viewport | Sidebar Width | Overlay Coverage | Animation |
|----------|---------------|------------------|-----------|
| 375px (Mobile) | 90vw (337px max) | 100% | ✅ |
| 768px (Tablet) | 300px | 100% | ✅ |
| 1024px (Desktop) | 300px | 100% | ✅ |
| 1440px (Large Desktop) | 300px | 100% | ✅ |

---

## Dependencies

- `NavigationHandler` class in `js/navigation.js`
- CSS custom properties (`--z-menu`, `--spacing-*`)
- HTML elements (`#menu-toggle`, `#floating-menu`, `#menu-overlay`)

---

## Performance Requirements

- Animation framerate MUST be ≥ 60fps
- No layout thrashing during animation
- Memory usage MUST remain stable after 100 open/close cycles
- Overlay fade-in/out MUST complete in 300ms

---

## Accessibility Requirements

- Keyboard navigation MUST work (Tab, Shift+Tab, Escape)
- Screen reader MUST announce state changes
- Focus MUST be managed correctly (first item on open, button on close)
- Color contrast MUST meet WCAG 2.1 AA (4.5:1 for text)
