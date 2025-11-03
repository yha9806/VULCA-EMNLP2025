# Spec: Navigation Menu Structure

## Overview

This spec defines the structure and behavior of the floating navigation menu that appears across all pages.

---

## REMOVED Requirements

### Requirement: Non-Functional Menu Buttons

**Identifier**: `navigation-menu-defunct-buttons`

The floating navigation menu SHALL NOT include non-functional buttons that create false affordances or provide redundant functionality.

**Rationale**:
- Non-functional UI elements confuse users and violate usability principles
- Redundant close mechanisms clutter the interface
- Every focusable element should have clear purpose and functionality

**Elements Being Removed**:

1. **Language switcher button** (`id="menu-lang"`)
   - Icon: 🔤
   - Label: "语言"
   - Issue: No event handler, clicking does nothing
   - No i18n system exists in codebase

2. **Close menu button** (`id="menu-close"`)
   - Icon: ✕
   - Label: "关闭"
   - Issue: Redundant - menu already closes via 4 other mechanisms
   - Not standard UX pattern for drawer menus

#### Scenario: Menu Contains Only Functional Navigation Links

**Given** the user is on any page (index.html, critics.html, about.html, or process.html)
**And** the floating menu HTML has been updated
**When** the user clicks the hamburger button to open the menu
**Then** the menu SHALL display exactly 4 navigation links:
  - 🏠 主画廊 (Main Gallery)
  - 👥 评论家 (Critics)
  - ℹ️ 关于 (About)
  - 🎨 过程 (Process)
**And** the menu SHALL NOT display a "语言" (Language) button
**And** the menu SHALL NOT display a "关闭" (Close) button

**Validation**:
```javascript
// Test in browser console
const menuItems = document.querySelectorAll('.floating-menu .menu-item');
assert(menuItems.length === 4, 'Menu should have exactly 4 items');

const menuLang = document.getElementById('menu-lang');
assert(menuLang === null, 'Language button should not exist');

const menuClose = document.getElementById('menu-close');
assert(menuClose === null, 'Close button should not exist');
```

---

#### Scenario: Menu Close Mechanisms Remain Functional

**Given** the user has opened the floating menu
**When** the user performs any of these actions:
  - Clicks the hamburger button again (toggle)
  - Clicks outside the menu area
  - Presses the Escape key
  - Clicks any of the 4 navigation links (on mobile)
**Then** the menu SHALL close (gain `hidden` attribute)
**And** the hamburger button SHALL update `aria-expanded` to "false"

**Validation**:
```javascript
// Test hamburger toggle
const menuToggle = document.getElementById('menu-toggle');
const floatingMenu = document.getElementById('floating-menu');

// Open menu
menuToggle.click();
assert(!floatingMenu.hasAttribute('hidden'), 'Menu should be open');

// Close via hamburger
menuToggle.click();
assert(floatingMenu.hasAttribute('hidden'), 'Menu should close');

// Test outside click
menuToggle.click(); // Open again
document.body.click(); // Click outside
assert(floatingMenu.hasAttribute('hidden'), 'Menu should close on outside click');

// Test Escape key
menuToggle.click(); // Open again
const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
document.dispatchEvent(escapeEvent);
assert(floatingMenu.hasAttribute('hidden'), 'Menu should close on Escape');
```

---

#### Scenario: HTML Structure is Consistent Across All Pages

**Given** the codebase contains 4 HTML pages with navigation menus
**When** examining the menu HTML in each file:
  - index.html
  - pages/critics.html
  - pages/about.html
  - pages/process.html
**Then** each menu SHALL have identical structure
**And** each menu SHALL contain exactly 4 `<a>` elements with class "menu-item"
**And** each menu SHALL NOT contain any `<button>` elements
**And** the 4 links SHALL appear in consistent order across all pages

**Validation**:
```bash
# Verify menu structure in all files
for file in index.html pages/critics.html pages/about.html pages/process.html; do
  echo "Checking $file..."

  # Count menu items
  count=$(grep -c 'class="menu-item"' "$file")
  if [ "$count" -ne 4 ]; then
    echo "❌ FAIL: $file has $count menu items, expected 4"
    exit 1
  fi

  # Check for removed buttons
  if grep -q 'menu-lang\|menu-close' "$file"; then
    echo "❌ FAIL: $file still contains removed buttons"
    exit 1
  fi

  echo "✅ PASS: $file has correct menu structure"
done
```

---

#### Scenario: No JavaScript References to Removed Elements

**Given** the language and close buttons have been removed from HTML
**When** searching the JavaScript codebase for references
**Then** there SHALL be zero references to `menu-lang` or `menu-close` IDs
**And** no event handlers attempt to attach to these elements
**And** no JavaScript errors occur due to missing elements

**Validation**:
```bash
# Search JavaScript files for references
rg "menu-lang|menu-close" js/

# Expected output: No matches found
# If matches found, this indicates orphaned code that should be cleaned up
```

---

#### Scenario: Accessibility is Maintained

**Given** the menu has been reduced to 4 navigation links
**When** a keyboard user navigates the menu with Tab key
**Then** they SHALL tab through exactly 4 focusable elements
**And** each element SHALL have descriptive `aria-label`
**And** the hamburger button SHALL have correct `aria-expanded` state
**And** the menu SHALL have `aria-label="Navigation menu"`

**When** a screen reader user opens the menu
**Then** the screen reader SHALL announce "Navigation menu"
**And** each link SHALL announce its label and destination

**Validation**:
```javascript
// Test ARIA attributes
const menu = document.getElementById('floating-menu');
assert(menu.getAttribute('aria-label') === 'Navigation menu', 'Menu should have aria-label');

const menuToggle = document.getElementById('menu-toggle');
menuToggle.click(); // Open menu

const ariaExpanded = menuToggle.getAttribute('aria-expanded');
assert(ariaExpanded === 'true', 'Hamburger should have aria-expanded=true when open');

// Test focusable elements
const focusable = menu.querySelectorAll('a[href]');
assert(focusable.length === 4, 'Should have exactly 4 focusable links');

focusable.forEach(link => {
  const ariaLabel = link.getAttribute('aria-label');
  assert(ariaLabel !== null && ariaLabel !== '', 'Each link should have aria-label');
});
```

---

## MODIFIED Requirements

### Requirement: Menu Item Count

**Identifier**: `navigation-menu-item-count`

The floating navigation menu SHALL contain exactly 4 menu items, all of which are functional navigation links.

**Previous Behavior**: 6 items (4 links + 2 buttons)
**New Behavior**: 4 items (4 links only)

**Rationale**:
- Simplify UI to only functional elements
- Reduce visual clutter
- Improve usability by removing false affordances

#### Scenario: Menu Displays Correct Number of Items

**Given** any page with the floating menu
**When** the user opens the menu
**Then** the menu SHALL display exactly 4 items
**And** each item SHALL be a clickable navigation link (not a button)

**Validation**:
```javascript
const menuLinks = document.querySelectorAll('.floating-menu a.menu-item');
assert(menuLinks.length === 4, 'Should have exactly 4 navigation links');

const menuButtons = document.querySelectorAll('.floating-menu button.menu-item');
assert(menuButtons.length === 0, 'Should have zero buttons in menu');
```

---

## Dependencies

### Internal Dependencies

1. **NavigationHandler** (`js/navigation.js`)
   - MUST continue to function without references to removed buttons
   - Already handles menu via generic `.menu-item` selector
   - No code changes required ✅

2. **Menu CSS** (`styles/main.css`)
   - Uses generic `.menu-item` class
   - No ID-specific styles for `#menu-lang` or `#menu-close`
   - No CSS changes required ✅

### Data Dependencies

**None** - This is a pure HTML structural change.

---

## Testing Requirements

### Manual Testing (MUST Pass)

**Per Page Checklist**:
- [ ] Open page in browser
- [ ] Click hamburger button (☰)
- [ ] Verify menu displays exactly 4 items
- [ ] Verify items are: 主画廊, 评论家, 关于, 过程
- [ ] Verify no "语言" button visible
- [ ] Verify no "关闭" button visible
- [ ] Test hamburger closes menu (toggle)
- [ ] Test outside click closes menu
- [ ] Test Escape key closes menu
- [ ] Test clicking a menu item navigates and closes menu (mobile)

**Pages to Test**:
- [ ] index.html
- [ ] pages/critics.html
- [ ] pages/about.html
- [ ] pages/process.html

### Code Validation (MUST Pass)

**Verify no orphaned references**:
```bash
# Check JavaScript
rg "menu-lang|menu-close" js/
# Expected: No matches

# Check CSS
rg "#menu-lang|#menu-close" styles/
# Expected: No matches (or only generic .menu-item)

# Check HTML (should only be in git history)
rg "menu-lang|menu-close" *.html pages/*.html
# Expected: No matches
```

---

## Performance Requirements

**Impact**: Negligible

**Before**:
- 6 DOM elements per page × 4 pages = 24 elements

**After**:
- 4 DOM elements per page × 4 pages = 16 elements

**Reduction**: -8 DOM elements total (~2.5KB HTML reduction)

---

## Accessibility Compliance

### WCAG 2.1 Level AA

| Criteria | Status | Notes |
|----------|--------|-------|
| 2.4.4 Link Purpose | ✅ Improved | All menu items are now functional links with clear purpose |
| 4.1.2 Name, Role, Value | ✅ Improved | Removed false affordances (non-functional buttons) |
| 2.1.1 Keyboard | ✅ Maintained | All close mechanisms remain keyboard accessible |
| 2.4.3 Focus Order | ✅ Improved | Reduced tab stops from 6 to 4 |

---

## Rollback Strategy

**If removal causes issues** (very unlikely):

### Option 1: Git Revert
```bash
git revert <commit-hash>
```

### Option 2: Manual Re-add

Add these lines back to all 4 HTML files after line 93 (after the "过程" link):

```html
      <button class="menu-item" id="menu-lang" aria-label="Switch language">
        <span>🔤</span>
        <span class="menu-label">语言</span>
      </button>
      <button class="menu-item" id="menu-close" aria-label="Close menu">
        <span>✕</span>
        <span class="menu-label">关闭</span>
      </button>
```

---

## Future Enhancements

### If Language Switching is Needed

**Proper implementation would include**:
1. i18n library integration (e.g., i18next)
2. Translation files (zh.json, en.json)
3. Language state management (localStorage)
4. Event handler for language toggle
5. Dynamic text replacement for all UI strings

**Do NOT** simply re-add the button without functionality.

---

## References

**Related Specs**:
- `auto-hide-navigation` - Navigation behavior (unaffected by this change)

**Related Files**:
- `js/navigation.js` - Menu toggle logic (no changes needed)
- `styles/main.css` - Menu styles (no changes needed)
- `index.html` - Main page menu structure (modify)
- `pages/*.html` - Subpage menu structures (modify)

---

**Spec Status**: Draft
**Created**: 2025-11-03
**Complexity**: Low (HTML-only)
**Risk**: Minimal
