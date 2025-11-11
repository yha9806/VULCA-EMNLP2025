# Design Document: Unify Homepage Navigation Style

**Change ID:** unify-homepage-navigation-style
**Status:** Draft

---

## Architectural Overview

This change replaces the homepage's horizontal navigation bar with a hamburger menu to match exhibition pages.

### Current Architecture

```
Homepage (/index.html)
├── GlobalNavigation component (shared/js/global-navigation.js)
│   ├── Renders horizontal nav bar with links
│   ├── Hamburger menu only on mobile (<768px)
│   └── Language toggle integrated
└── Styles: shared/styles/global-navigation.css

Exhibition Pages (/exhibitions/*/index.html)
├── Minimal header (header-minimal class)
│   ├── Hamburger button (top-left)
│   ├── Language toggle (top-right)
│   └── Scroll progress indicator
├── Floating menu (floating-menu class)
│   └── Navigation links with emoji icons
├── Inline JavaScript for hamburger toggle
└── Styles: styles/main.css (lines 800-1200)
```

### Proposed Architecture

```
All Pages (Homepage + Exhibition Pages)
├── Minimal header (header-minimal class)
│   ├── Hamburger button (top-left)
│   ├── Language toggle (top-right)
│   └── Scroll progress indicator (optional)
├── Floating menu (floating-menu class)
│   └── Navigation links with emoji icons
├── Inline JavaScript for hamburger toggle
└── Styles: styles/main.css
```

**Key Decision**: Eliminate the GlobalNavigation component entirely. Use the simpler inline approach from exhibition pages.

---

## Design Decisions

### Decision 1: Inline JavaScript vs. Shared Component

**Options Considered:**
1. **Inline JavaScript** (15 lines in `<script>` tag)
   - ✅ Simple, no dependency management
   - ✅ Already working in exhibition pages
   - ✅ Easy to customize per-page if needed
   - ❌ Slight code duplication (2 pages)

2. **Shared Component** (create new module)
   - ✅ DRY principle (no duplication)
   - ❌ Adds complexity (module loading, exports)
   - ❌ Overkill for 15 lines of code
   - ❌ Makes simple code harder to understand

**Decision**: Use inline JavaScript
**Rationale**: The hamburger menu logic is trivial (toggle `hidden` attribute). Creating a shared module adds unnecessary abstraction for minimal code reuse. YAGNI (You Aren't Gonna Need It) principle applies.

---

### Decision 2: CSS Strategy

**Options Considered:**
1. **Reuse styles/main.css** (exhibition page styles)
   - ✅ Already contains all needed styles
   - ✅ Zero additional CSS needed
   - ✅ Ensures visual consistency
   - ❌ Homepage loads larger CSS file

2. **Extract shared styles to separate file**
   - ✅ Smaller per-page CSS
   - ❌ Requires build step or manual extraction
   - ❌ More files to maintain
   - ❌ Over-optimization (CSS gzip is efficient)

**Decision**: Reuse `styles/main.css`
**Rationale**: Modern browsers cache CSS efficiently. The file is already <100KB and contains well-structured styles. Extracting styles adds maintenance burden with no measurable performance benefit.

---

### Decision 3: Deprecation Strategy for GlobalNavigation

**Options Considered:**
1. **Delete immediately**
   - ✅ Clean codebase
   - ❌ Might break other pages we haven't checked
   - ❌ Risky if other projects reference it

2. **Keep but mark deprecated**
   - ✅ Safe (no breaking changes)
   - ✅ Allows gradual migration
   - ❌ Dead code in repository
   - ❌ Confusing for new developers

3. **Delete after audit**
   - ✅ Balance safety and cleanliness
   - ✅ Ensures no pages still use it
   - ❌ Requires additional task

**Decision**: Keep files but don't delete (Option 2)
**Rationale**: The homepage is the only page using GlobalNavigation (based on grep search), but we want to be conservative. Leaving the files in place doesn't hurt, and future cleanup can remove them when we're 100% certain.

---

### Decision 4: Language Toggle Behavior

**Options Considered:**
1. **Use exhibition page's simple toggle** (`EN/中`)
   - ✅ Consistent with exhibition pages
   - ✅ Simple display
   - ❌ Less clear which language is active

2. **Use GlobalNavigation's current display** (`中 🌐` or `EN 🌐`)
   - ✅ Shows current language explicitly
   - ✅ Icon makes it recognizable
   - ❌ Different from exhibition pages

3. **Hybrid: Show current lang + icon** (e.g., `中`)
   - ✅ Clear and consistent
   - ✅ Matches exhibition page style
   - ❌ Requires CSS update

**Decision**: Use exhibition page's `EN/中` toggle (Option 1)
**Rationale**: Consistency is more important than verbosity. Users understand language toggles from context. The toggle text updates on click, making current language clear.

---

### Decision 5: Scroll Progress Indicator

**Options Considered:**
1. **Add to homepage** (exhibition pages have it)
   - ✅ Full consistency
   - ❌ Homepage is mostly non-scrolling (hero section)
   - ❌ Not useful on short pages

2. **Omit from homepage**
   - ✅ Simpler implementation
   - ✅ Only show where useful (long exhibition pages)
   - ❌ Minor inconsistency

**Decision**: Omit from homepage (Option 2)
**Rationale**: Scroll indicator is a utility feature for long pages. Homepage hero section and exhibition cards don't need it. Consistency in structure (hamburger menu) is more important than matching every UI element.

---

## Implementation Notes

### HTML Structure (Homepage)

```html
<!-- Minimal Header -->
<header class="header-minimal">
  <div class="header-controls">
    <button class="hamburger" id="menu-toggle">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <button class="lang-toggle" id="lang-toggle">
      <span class="lang-text">EN/中</span>
    </button>
  </div>
</header>

<!-- Floating Menu -->
<nav class="floating-menu" id="floating-menu" hidden>
  <div class="menu-content">
    <a href="/" class="menu-item">
      <span>🏠</span>
      <span class="menu-label">主页</span>
    </a>
    <!-- ... more links ... -->
  </div>
</nav>

<!-- Menu Toggle Script -->
<script>
  // ... 15 lines of hamburger toggle logic ...
</script>
```

### CSS Classes (Already Defined in styles/main.css)

- `.header-minimal` - Minimal header with flex layout
- `.header-controls` - Container for hamburger + language toggle
- `.hamburger` - Hamburger icon (3 lines)
- `.lang-toggle` - Language toggle button
- `.floating-menu` - Floating menu overlay
- `.menu-item` - Navigation link with icon + label

---

## Testing Strategy

### Manual Testing

1. **Desktop (1920px)**:
   - [ ] Hamburger menu appears in top-left
   - [ ] Language toggle appears in top-right
   - [ ] Clicking hamburger opens floating menu
   - [ ] Clicking menu link navigates correctly
   - [ ] Clicking outside menu closes it

2. **Tablet (768px)**:
   - [ ] Layout remains consistent
   - [ ] Menu opens/closes smoothly
   - [ ] Touch interactions work

3. **Mobile (375px)**:
   - [ ] Hamburger menu usable on small screens
   - [ ] Menu overlay covers full screen
   - [ ] No layout overflow or clipping

### Automated Testing (Future)

If we add Playwright tests:
```javascript
test('homepage hamburger menu works', async ({ page }) => {
  await page.goto('/');

  // Hamburger button visible
  const hamburger = page.locator('#menu-toggle');
  await expect(hamburger).toBeVisible();

  // Menu hidden initially
  const menu = page.locator('#floating-menu');
  await expect(menu).toBeHidden();

  // Click opens menu
  await hamburger.click();
  await expect(menu).toBeVisible();

  // Click again closes menu
  await hamburger.click();
  await expect(menu).toBeHidden();
});
```

---

## Rollback Plan

If this change causes issues, rollback is straightforward:

1. **Revert `index.html`**:
   ```bash
   git checkout HEAD^ index.html
   ```

2. **Restore `GlobalNavigation` scripts**:
   - Uncomment `<script src="/shared/js/global-navigation.js">`
   - Uncomment `<link href="/shared/styles/global-navigation.css">`

3. **Deploy**:
   ```bash
   git push origin master
   ```

**Recovery Time**: < 5 minutes (single file revert + deploy)

---

## Performance Considerations

### Before (GlobalNavigation)

- **CSS**: `shared/styles/global-navigation.css` (~15KB)
- **JavaScript**: `shared/js/global-navigation.js` (~6KB, module loading overhead)
- **Total**: ~21KB + module overhead

### After (Inline Approach)

- **CSS**: `styles/main.css` (~95KB, but already loaded for other styles)
- **JavaScript**: Inline `<script>` (~0.5KB)
- **Total**: ~0.5KB additional (CSS already loaded)

**Result**: ~20KB reduction in network requests, faster page load

---

## Accessibility Considerations

### ARIA Attributes (Maintained)

```html
<button
  class="hamburger"
  id="menu-toggle"
  aria-label="打开菜单 Open menu"
  aria-expanded="false"  <!-- Updates on click -->
>
```

```html
<nav
  class="floating-menu"
  aria-label="导航菜单 Navigation menu"
  hidden  <!-- Hides from screen readers when closed -->
>
```

### Keyboard Navigation

- ✅ Hamburger button accessible via Tab
- ✅ Enter/Space toggles menu
- ✅ Menu links navigable via Tab
- ✅ Escape key can close menu (future enhancement)

---

## Future Enhancements (Out of Scope)

These improvements are NOT part of this change but could be added later:

1. **Escape Key Support**: Close menu with Escape key
2. **Focus Management**: Trap focus inside menu when open
3. **Animation Timing**: Add CSS transitions for smooth open/close
4. **Menu Close on Navigation**: Auto-close menu after clicking link (currently stays open)

---

## References

- Existing implementation: `/exhibitions/negative-space-of-the-tide/index.html` (lines 68-112)
- CSS styles: `/styles/main.css` (search for `.header-minimal`, `.floating-menu`)
- Similar pattern: `/pages/critics.html`, `/pages/about.html` (all use same hamburger menu)
