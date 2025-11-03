# Tasks: Fix Hamburger Menu and Add Sidebar Navigation

**Total Estimated Time**: 160 minutes (2.7 hours)
**Status**: ✅ COMPLETED
**Actual Time**: ~120 minutes (2 hours)
**Completion Date**: 2025-11-03

---

## Phase 1: Fix Duplicate Event Binding (30 min)

### Task 1.1: Remove inline script from about.html
**Estimate**: 8 min
**File**: `pages/about.html`

**Steps**:
1. Open `pages/about.html`
2. Navigate to lines 148-175
3. Delete the entire `<script>...</script>` block containing:
   - `menuToggle.addEventListener` logic
   - `floatingMenu` toggle logic
   - `langToggle` handler (keep this part)
4. Keep only the language toggle and preference logic
5. Save file

**Success Criteria**:
- [ ] Lines 148-162 (menu toggle script) removed
- [ ] Lines 163-175 (language toggle) preserved
- [ ] File saved without syntax errors
- [ ] No `menuToggle.addEventListener('click'` in file

**Validation Command**:
```bash
rg "menuToggle\.addEventListener\('click'" pages/about.html
# Expected: 0 matches
```

---

### Task 1.2: Remove inline script from critics.html
**Estimate**: 8 min
**File**: `pages/critics.html`

**Steps**:
1. Open `pages/critics.html`
2. Navigate to lines 149-176
3. Delete the entire `<script>...</script>` block
4. Save file

**Success Criteria**:
- [ ] Lines 149-176 removed
- [ ] File saved without syntax errors
- [ ] No `menuToggle.addEventListener('click'` in file

**Validation Command**:
```bash
rg "menuToggle\.addEventListener\('click'" pages/critics.html
# Expected: 0 matches
```

---

### Task 1.3: Remove inline script from process.html
**Estimate**: 8 min
**File**: `pages/process.html`

**Steps**:
1. Open `pages/process.html`
2. Navigate to lines 130-157
3. Delete the entire `<script>...</script>` block
4. Save file

**Success Criteria**:
- [ ] Lines 130-157 removed
- [ ] File saved without syntax errors
- [ ] No `menuToggle.addEventListener('click'` in file

**Validation Command**:
```bash
rg "menuToggle\.addEventListener\('click'" pages/process.html
# Expected: 0 matches
```

---

### Task 1.4: Test menu functionality on all pages
**Estimate**: 6 min

**Steps**:
1. Start local server: `python -m http.server 8888`
2. Open each page in browser:
   - `http://localhost:8888/`
   - `http://localhost:8888/pages/critics.html`
   - `http://localhost:8888/pages/about.html`
   - `http://localhost:8888/pages/process.html`
3. On each page:
   - Click hamburger button → Menu should open
   - Click hamburger button again → Menu should close
   - Open menu → Click outside → Menu should close
   - Open menu → Press Escape → Menu should close
4. Check browser console for errors

**Success Criteria**:
- [ ] Menu opens/closes on index.html
- [ ] Menu opens/closes on critics.html
- [ ] Menu opens/closes on about.html
- [ ] Menu opens/closes on process.html
- [ ] Click outside works on all pages
- [ ] Escape key works on all pages
- [ ] No JavaScript errors in console
- [ ] `aria-expanded` attribute updates correctly

---

## Phase 2: Add Sidebar CSS Styles (45 min)

### Task 2.1: Update .floating-menu base styles
**Estimate**: 15 min
**File**: `styles/main.css`

**Steps**:
1. Open `styles/main.css`
2. Navigate to `.floating-menu` class (around line 266)
3. Replace current styles with sidebar layout:

```css
.floating-menu {
  /* Positioning - full height sidebar */
  position: fixed;
  top: 0;
  left: 0;
  width: min(300px, 90vw);
  height: 100vh;

  /* Layering */
  z-index: var(--z-menu);

  /* Appearance */
  background: white;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.15);

  /* Animation - slide from left */
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* Layout */
  overflow-y: auto;
  padding: var(--spacing-lg) 0;

  /* Hide initially */
  opacity: 0;
  pointer-events: none;
}
```

4. Save file

**Success Criteria**:
- [ ] Position changed from `top/left: var(--spacing-md)` to `top: 0; left: 0`
- [ ] Width set to `min(300px, 90vw)`
- [ ] Height set to `100vh`
- [ ] Transform added for slide animation
- [ ] Shadow updated to right edge (`2px 0` instead of all sides)

---

### Task 2.2: Update .floating-menu open state
**Estimate**: 5 min
**File**: `styles/main.css`

**Steps**:
1. Navigate to `.floating-menu:not([hidden])` (around line 288)
2. Replace with:

```css
.floating-menu:not([hidden]) {
  opacity: 1;
  transform: translateX(0);
  pointer-events: all;
}
```

3. Save file

**Success Criteria**:
- [ ] `transform: translateX(0)` added (moves sidebar into view)
- [ ] `scale(1)` removed (no longer needed)
- [ ] `translateY(0)` removed (no vertical movement)

---

### Task 2.3: Add dark mode support for sidebar
**Estimate**: 5 min
**File**: `styles/main.css`

**Steps**:
1. Navigate to dark mode media query section (around line 283)
2. Update `.floating-menu` dark mode styles:

```css
@media (prefers-color-scheme: dark) {
  .floating-menu {
    background: #2a2a2a;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.3);
  }
}
```

3. Save file

**Success Criteria**:
- [ ] Dark background color set to `#2a2a2a`
- [ ] Shadow opacity increased to 0.3 for dark mode

---

### Task 2.4: Add overlay styles
**Estimate**: 10 min
**File**: `styles/main.css`

**Steps**:
1. Navigate to navigation section in main.css (after `.floating-menu` styles)
2. Add new `.menu-overlay` class:

```css
/* Menu Overlay */
.menu-overlay {
  /* Positioning - full viewport coverage */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  /* Layering - below sidebar */
  z-index: calc(var(--z-menu) - 1);

  /* Appearance */
  background: rgba(0, 0, 0, 0.5);

  /* Animation */
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

/* Active state (when menu is open) */
.menu-overlay.active {
  opacity: 1;
  pointer-events: all;
}
```

3. Save file

**Success Criteria**:
- [ ] Overlay positioned to cover full viewport
- [ ] Z-index set to `var(--z-menu) - 1`
- [ ] Background is semi-transparent black (rgba(0, 0, 0, 0.5))
- [ ] Fade transition set to 300ms
- [ ] Active state toggles opacity and pointer-events

---

### Task 2.5: Responsive adjustments for mobile
**Estimate**: 10 min
**File**: `styles/main.css`

**Steps**:
1. Navigate to responsive media queries section
2. Verify `.floating-menu` uses `min(300px, 90vw)` for all screen sizes
3. Add additional mobile-specific adjustments if needed:

```css
/* Mobile (< 768px) */
@media (max-width: 767px) {
  .floating-menu {
    /* Ensure sidebar doesn't exceed 90% on small screens */
    width: min(300px, 90vw);
  }
}

/* Tablet & Desktop (>= 768px) */
@media (min-width: 768px) {
  .floating-menu {
    /* Fixed width on larger screens */
    width: 300px;
  }
}
```

4. Save file

**Success Criteria**:
- [ ] Mobile width uses `min()` function
- [ ] Desktop width fixed at 300px
- [ ] No horizontal scrollbars on any screen size

---

## Phase 3: Update HTML Structure (30 min)

### Task 3.1: Add overlay to index.html
**Estimate**: 5 min
**File**: `index.html`

**Steps**:
1. Open `index.html`
2. Navigate to line 76 (before `<nav class="floating-menu">`)
3. Add overlay element:

```html
<!-- Menu Overlay -->
<div class="menu-overlay" id="menu-overlay"></div>

<!-- Sidebar Navigation -->
<nav class="floating-menu" id="floating-menu" aria-label="Navigation menu" hidden>
```

4. Save file

**Success Criteria**:
- [ ] Overlay element added with correct ID and class
- [ ] Overlay placed before `.floating-menu`
- [ ] HTML validates without errors

---

### Task 3.2: Add overlay to critics.html
**Estimate**: 5 min
**File**: `pages/critics.html`

**Steps**:
1. Open `pages/critics.html`
2. Navigate to line 69 (before `<nav class="floating-menu">`)
3. Add overlay element (same as Task 3.1)
4. Save file

**Success Criteria**:
- [ ] Overlay element added
- [ ] HTML validates

---

### Task 3.3: Add overlay to about.html
**Estimate**: 5 min
**File**: `pages/about.html`

**Steps**:
1. Open `pages/about.html`
2. Navigate to line 29 (before `<nav class="floating-menu">`)
3. Add overlay element
4. Save file

**Success Criteria**:
- [ ] Overlay element added
- [ ] HTML validates

---

### Task 3.4: Add overlay to process.html
**Estimate**: 5 min
**File**: `pages/process.html`

**Steps**:
1. Open `pages/process.html`
2. Navigate to line 29 (before `<nav class="floating-menu">`)
3. Add overlay element
4. Save file

**Success Criteria**:
- [ ] Overlay element added
- [ ] HTML validates

---

### Task 3.5: Verify overlay elements on all pages
**Estimate**: 5 min

**Steps**:
1. Run validation command:
   ```bash
   rg '<div class="menu-overlay"' index.html pages/*.html
   ```
2. Should see 4 matches (one per page)
3. Open each page in browser
4. Inspect DOM to verify overlay is present

**Success Criteria**:
- [ ] Overlay exists in index.html
- [ ] Overlay exists in critics.html
- [ ] Overlay exists in about.html
- [ ] Overlay exists in process.html
- [ ] All overlays have ID `menu-overlay`

---

### Task 3.6: Optional - Update ARIA attributes
**Estimate**: 5 min
**Files**: All HTML files

**Steps**:
1. Verify hamburger button has `aria-controls="floating-menu"`
2. Verify sidebar has `aria-label="主导航菜单"`
3. Add if missing

**Success Criteria**:
- [ ] All buttons have correct ARIA attributes
- [ ] All sidebars have navigation labels

---

## Phase 4: JavaScript Overlay Management (30 min)

### Task 4.1: Update NavigationHandler constructor
**Estimate**: 5 min
**File**: `js/navigation.js`

**Steps**:
1. Open `js/navigation.js`
2. Navigate to `constructor()` (line 16)
3. Add overlay reference:

```javascript
constructor() {
  this.menuToggle = document.getElementById('menu-toggle');
  this.menuDrawer = document.getElementById('floating-menu');
  this.menuOverlay = document.getElementById('menu-overlay'); // NEW
  this.menuItems = document.querySelectorAll('.menu-item');
}
```

4. Save file

**Success Criteria**:
- [ ] `this.menuOverlay` added to constructor
- [ ] No syntax errors

---

### Task 4.2: Update init() validation
**Estimate**: 3 min
**File**: `js/navigation.js`

**Steps**:
1. Navigate to `init()` method (line 22)
2. Update validation to check for overlay:

```javascript
init() {
  if (!this.menuToggle || !this.menuDrawer || !this.menuOverlay) {
    console.warn('[Navigation] Required elements not found');
    return;
  }
  // ...
}
```

3. Save file

**Success Criteria**:
- [ ] Overlay validation added
- [ ] Warning message updated

---

### Task 4.3: Add overlay event listener
**Estimate**: 5 min
**File**: `js/navigation.js`

**Steps**:
1. Navigate to event binding section (around line 29)
2. After hamburger button listener, add overlay listener:

```javascript
// Menu toggle button
this.menuToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  this.toggleMenu();
});

// Overlay click - NEW
this.menuOverlay.addEventListener('click', () => {
  this.closeMenu();
});
```

3. Save file

**Success Criteria**:
- [ ] Overlay listener added
- [ ] Calls `closeMenu()` on click
- [ ] No syntax errors

---

### Task 4.4: Update openMenu() to show overlay
**Estimate**: 5 min
**File**: `js/navigation.js`

**Steps**:
1. Navigate to `openMenu()` method (line 73)
2. Add overlay activation:

```javascript
openMenu() {
  this.menuDrawer.removeAttribute('hidden');
  this.menuOverlay.classList.add('active'); // NEW
  this.menuToggle.setAttribute('aria-expanded', 'true');
}
```

3. Save file

**Success Criteria**:
- [ ] Overlay gets `.active` class when menu opens
- [ ] Order of operations correct (menu then overlay)

---

### Task 4.5: Update closeMenu() to hide overlay
**Estimate**: 5 min
**File**: `js/navigation.js`

**Steps**:
1. Navigate to `closeMenu()` method (line 78)
2. Add overlay deactivation:

```javascript
closeMenu() {
  this.menuDrawer.setAttribute('hidden', '');
  this.menuOverlay.classList.remove('active'); // NEW
  this.menuToggle.setAttribute('aria-expanded', 'false');
}
```

3. Save file

**Success Criteria**:
- [ ] Overlay loses `.active` class when menu closes
- [ ] Order of operations correct

---

### Task 4.6: Test JavaScript changes
**Estimate**: 7 min

**Steps**:
1. Refresh browser page
2. Open browser console
3. Test overlay functionality:
   - Click hamburger → overlay should appear
   - Click overlay → menu should close
   - Open menu → verify `menuOverlay.classList` contains 'active'
   - Close menu → verify 'active' class removed
4. Test on all 4 pages

**Success Criteria**:
- [ ] Overlay appears when menu opens
- [ ] Overlay disappears when menu closes
- [ ] Clicking overlay closes menu
- [ ] No console errors
- [ ] Works on all pages

---

## Phase 5: Testing & Optimization (25 min)

### Task 5.1: Cross-browser testing
**Estimate**: 10 min

**Browsers to Test**:
- Chrome 90+ (primary)
- Firefox 88+
- Safari 14+ (if available)
- Edge 90+

**Test Matrix**:
| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Sidebar slides in | ✅ | ✅ | ✅ | ✅ |
| Overlay appears | ✅ | ✅ | ✅ | ✅ |
| Click outside closes | ✅ | ✅ | ✅ | ✅ |
| Escape closes | ✅ | ✅ | ✅ | ✅ |
| Animation smooth | ✅ | ✅ | ✅ | ✅ |

**Success Criteria**:
- [ ] All features work in all browsers
- [ ] No visual glitches
- [ ] Animations are smooth (60fps)

---

### Task 5.2: Responsive testing
**Estimate**: 8 min

**Viewports to Test**:
- 375px (Mobile - iPhone SE)
- 768px (Tablet - iPad)
- 1024px (Desktop - Small)
- 1440px (Desktop - Large)

**Test Checklist**:
- [ ] Sidebar width correct at each viewport
- [ ] Overlay covers entire viewport
- [ ] No horizontal scrollbars
- [ ] Menu items readable
- [ ] Touch interactions work on mobile (if available)

---

### Task 5.3: Accessibility testing
**Estimate**: 5 min

**Keyboard Navigation**:
1. Tab to hamburger button → Press Enter
2. Menu should open, focus should move to first menu item
3. Tab through all menu items
4. Press Escape → Menu should close, focus returns to button

**Screen Reader** (if available):
1. Use NVDA (Windows) or VoiceOver (Mac)
2. Navigate to hamburger button
3. Verify ARIA attributes are announced correctly
4. Open menu and verify state change is announced

**Success Criteria**:
- [ ] Keyboard navigation works
- [ ] Escape key closes menu
- [ ] Focus management correct
- [ ] ARIA attributes read correctly

---

### Task 5.4: Performance verification
**Estimate**: 2 min

**Steps**:
1. Open Chrome DevTools → Performance tab
2. Start recording
3. Click hamburger button to open menu
4. Stop recording
5. Analyze timeline:
   - Should see no layout recalculations
   - Only composite operations
   - Frame rate should be 60fps

**Success Criteria**:
- [ ] Animation runs at 60fps
- [ ] No layout thrashing
- [ ] transform and opacity used (not left or width)

---

## Phase 6: Documentation & Cleanup (5 min - optional)

### Task 6.1: Update code comments
**Estimate**: 3 min

**Files to Update**:
- `js/navigation.js` - Add comment explaining overlay management
- `styles/main.css` - Add comment for sidebar styles

**Success Criteria**:
- [ ] Comments accurate and helpful
- [ ] Complex logic explained

---

### Task 6.2: Final code review
**Estimate**: 2 min

**Checklist**:
- [ ] All files saved
- [ ] No syntax errors
- [ ] No console warnings
- [ ] Git status shows expected files modified

---

## Validation Commands

### Verify inline scripts removed
```bash
rg "menuToggle\.addEventListener\('click'" pages/ --glob "*.html"
# Expected: 0 matches
```

### Verify overlay elements added
```bash
rg '<div class="menu-overlay"' index.html pages/*.html
# Expected: 4 matches
```

### Verify CSS classes exist
```bash
rg "\.floating-menu|\.menu-overlay" styles/main.css
# Expected: Multiple matches
```

### Verify JavaScript changes
```bash
rg "menuOverlay" js/navigation.js
# Expected: Multiple matches (constructor, init, openMenu, closeMenu)
```

---

## Git Commit Strategy

### Commit 1: Fix duplicate event binding
```bash
git add pages/about.html pages/critics.html pages/process.html
git commit -m "fix: Remove duplicate menu event bindings from subpages

- Remove inline script from about.html
- Remove inline script from critics.html
- Remove inline script from process.html
- Event handling now centralized in navigation.js

Fixes hamburger menu not working on subpages."
```

### Commit 2: Add sidebar navigation
```bash
git add styles/main.css index.html pages/*.html js/navigation.js
git commit -m "feat: Transform floating menu into sidebar navigation

- Update CSS for full-height sidebar (300px width)
- Add slide-in animation from left using transform
- Add semi-transparent overlay background
- Update JavaScript to manage overlay state
- Responsive width on mobile (90vw max)

Improves navigation UX with modern sidebar pattern."
```

---

**All tasks estimated total**: 160 minutes ≈ 2.7 hours
