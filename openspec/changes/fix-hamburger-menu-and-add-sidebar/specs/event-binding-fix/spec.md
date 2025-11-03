# Spec: Event Binding Fix

## Overview

Remove duplicate event bindings from subpage inline scripts to fix hamburger menu functionality in all pages.

---

## ADDED Requirements

### Requirement: Centralized Event Management

All navigation event handling SHALL be managed exclusively by the `NavigationHandler` class in `/js/navigation.js`.

**Rationale**: Duplicate event bindings in subpage inline scripts cause conflicts that prevent the hamburger menu from functioning correctly. Centralizing event management ensures consistent behavior and easier maintenance.

**Scenarios**:

#### Scenario 1.1: Menu toggle works on all pages
**Given** the user is on any page (index.html, critics.html, about.html, or process.html)
**When** the user clicks the hamburger menu button (#menu-toggle)
**Then** the floating menu SHALL toggle between open and closed states
**And** the `aria-expanded` attribute SHALL be updated correctly
**And** no JavaScript errors SHALL appear in the console

**Validation**:
```bash
# Verify no inline menu toggle scripts remain
rg "menuToggle\.addEventListener\('click'" pages/ --glob "*.html"
# Expected: 0 matches
```

---

#### Scenario 1.2: ARIA state management is consistent
**Given** the menu is in any state (open or closed)
**When** the user interacts with the menu
**Then** the `aria-expanded` attribute on #menu-toggle SHALL match the menu state
**And** screen readers SHALL announce the correct state

**Validation**:
```javascript
// Test in browser console
const toggle = document.getElementById('menu-toggle');
const menu = document.getElementById('floating-menu');

// Open menu
toggle.click();
console.assert(toggle.getAttribute('aria-expanded') === 'true');
console.assert(!menu.hasAttribute('hidden'));

// Close menu
toggle.click();
console.assert(toggle.getAttribute('aria-expanded') === 'false');
console.assert(menu.hasAttribute('hidden'));
```

---

#### Scenario 1.3: No duplicate event listeners
**Given** a page has loaded completely
**When** inspecting the event listeners on #menu-toggle
**Then** there SHALL be exactly one 'click' event listener
**And** no duplicate listeners SHALL exist

**Validation**:
```javascript
// Use Chrome DevTools
// Elements → #menu-toggle → Event Listeners → click
// Should show only 1 listener from navigation.js
```

---

### Requirement: Click Outside Functionality

Clicking outside the menu SHALL close the menu on all pages.

**Rationale**: This is a critical UX pattern that must work consistently across all pages. Duplicate event bindings can cause this functionality to fail.

**Scenarios**:

#### Scenario 2.1: Click outside closes menu
**Given** the floating menu is open
**When** the user clicks anywhere outside the menu and hamburger button
**Then** the menu SHALL close
**And** the `aria-expanded` attribute SHALL be set to 'false'

---

#### Scenario 2.2: Click inside menu does not close it
**Given** the floating menu is open
**When** the user clicks inside the menu area
**Then** the menu SHALL remain open

---

### Requirement: Escape Key Functionality

Pressing the Escape key SHALL close the menu on all pages.

**Scenarios**:

#### Scenario 3.1: Escape key closes menu
**Given** the floating menu is open
**When** the user presses the Escape key
**Then** the menu SHALL close
**And** focus SHALL return to the hamburger button

---

## REMOVED Requirements

### Removed Requirement: Inline Script Event Handling

**Previous Behavior**: Each subpage HTML file contained inline `<script>` tags that duplicated the menu toggle logic.

**Code Locations**:
- `pages/about.html` lines 148-175
- `pages/critics.html` lines 149-176
- `pages/process.html` lines 130-157

**Removed Code Example**:
```html
<!-- pages/about.html lines 148-162 (REMOVED) -->
<script>
  const menuToggle = document.getElementById('menu-toggle');
  const floatingMenu = document.getElementById('floating-menu');
  if (menuToggle && floatingMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = !floatingMenu.hasAttribute('hidden');
      floatingMenu[isOpen ? 'setAttribute' : 'removeAttribute']('hidden', '');
      menuToggle.setAttribute('aria-expanded', !isOpen);
    });
    document.addEventListener('click', (e) => {
      if (!floatingMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        floatingMenu.setAttribute('hidden', '');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
</script>
```

**Reason for Removal**:
- Causes duplicate event bindings
- Conflicts with `NavigationHandler` class
- Violates DRY principle
- Makes debugging difficult

---

## Test Coverage

### Manual Test Matrix

| Page | Click Toggle | Click Outside | Press Escape | ARIA Updates |
|------|-------------|---------------|--------------|--------------|
| index.html | ✅ | ✅ | ✅ | ✅ |
| pages/critics.html | ✅ | ✅ | ✅ | ✅ |
| pages/about.html | ✅ | ✅ | ✅ | ✅ |
| pages/process.html | ✅ | ✅ | ✅ | ✅ |

### Automated Validation Commands

```bash
# 1. Verify inline scripts are removed
rg "menuToggle\.addEventListener" pages/ --glob "*.html"
# Expected: 0 matches

# 2. Verify NavigationHandler is loaded
rg "class NavigationHandler" js/navigation.js
# Expected: 1 match

# 3. Verify all pages load navigation.js
rg '<script src="/js/navigation.js' index.html pages/*.html
# Expected: 4 matches (1 per page)

# 4. Check for console errors
# Open each page in browser, check console
# Expected: No errors related to navigation
```

---

## Dependencies

- Existing `NavigationHandler` class in `js/navigation.js`
- HTML structure with `#menu-toggle` and `#floating-menu` elements
- All pages must load `/js/navigation.js?v=1`

---

## Performance Requirements

- Event listener registration MUST complete within 50ms of DOM ready
- No memory leaks after repeated menu open/close cycles (test with 100 iterations)
- Click response time MUST be < 100ms

---

## Accessibility Requirements

- All keyboard interactions MUST work (Tab, Escape, Enter)
- ARIA attributes MUST be synchronized with visual state
- Screen readers MUST correctly announce menu state changes
- Focus management MUST follow WCAG 2.1 AA guidelines
