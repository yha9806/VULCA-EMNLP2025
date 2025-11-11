# Unified Navigation Specification

**Capability:** unified-navigation
**Owner:** UI/Navigation System
**Status:** Draft

---

## ADDED Requirements

### Requirement: Homepage MUST use hamburger menu navigation

**Rationale:** Consistent navigation pattern across all pages improves UX and reduces cognitive load. Users should not need to learn different navigation patterns when moving between homepage and exhibition pages.

**Priority:** P0 (Critical - User-Requested Feature)

#### Scenario: Homepage displays hamburger menu in top-left corner

**Given** the user visits the homepage (`/`)

**When** the page loads

**Then** a hamburger menu button (☰) SHALL be visible in the top-left corner
**And** the hamburger button SHALL have three horizontal lines (CSS bars)
**And** the hamburger button SHALL have `aria-label="打开菜单 Open menu"`
**And** the hamburger button SHALL have `id="menu-toggle"`
**And** NO horizontal navigation links SHALL be visible in the header
**And** the old `GlobalNavigation` component SHALL NOT be present

**Validation:**
```javascript
// Playwright test
const hamburger = page.locator('#menu-toggle');
await expect(hamburger).toBeVisible();
await expect(hamburger).toHaveAttribute('aria-label', expect.stringContaining('打开菜单'));

// No horizontal nav links visible
const navLinks = page.locator('.global-nav .nav-links');
await expect(navLinks).not.toBeVisible();
```

---

### Requirement: Hamburger menu MUST toggle floating menu overlay

**Rationale:** Users need to access navigation links by clicking the hamburger button. The floating menu provides a clear, focused navigation experience.

**Priority:** P0 (Critical)

#### Scenario: Clicking hamburger button opens floating menu

**Given** the user is on the homepage
**And** the floating menu is hidden (has `hidden` attribute)

**When** the user clicks the hamburger button

**Then** the floating menu SHALL become visible (remove `hidden` attribute)
**And** the hamburger button's `aria-expanded` attribute SHALL change to `"true"`
**And** the floating menu SHALL contain 5 navigation links:
  - 🏠 主页 (Home)
  - 📚 展览归档 (Archive)
  - 👥 评论家 (Critics)
  - ℹ️ 关于 (About)
  - 🎨 过程 (Process)
**And** each link SHALL have an emoji icon and label

**Validation:**
```javascript
const hamburger = page.locator('#menu-toggle');
const menu = page.locator('#floating-menu');

// Initially hidden
await expect(menu).toBeHidden();
await expect(hamburger).toHaveAttribute('aria-expanded', 'false');

// Click opens menu
await hamburger.click();
await expect(menu).toBeVisible();
await expect(hamburger).toHaveAttribute('aria-expanded', 'true');

// Contains 5 links
const links = menu.locator('.menu-item');
await expect(links).toHaveCount(5);
```

---

#### Scenario: Clicking hamburger button again closes floating menu

**Given** the floating menu is open (visible)

**When** the user clicks the hamburger button again

**Then** the floating menu SHALL become hidden (add `hidden` attribute)
**And** the hamburger button's `aria-expanded` attribute SHALL change to `"false"`

**Validation:**
```javascript
// Open menu first
await hamburger.click();
await expect(menu).toBeVisible();

// Click again closes
await hamburger.click();
await expect(menu).toBeHidden();
await expect(hamburger).toHaveAttribute('aria-expanded', 'false');
```

---

#### Scenario: Clicking outside floating menu closes it

**Given** the floating menu is open

**When** the user clicks anywhere outside the menu (e.g., on the hero section)

**Then** the floating menu SHALL become hidden
**And** the hamburger button's `aria-expanded` attribute SHALL change to `"false"`

**Validation:**
```javascript
// Open menu
await hamburger.click();
await expect(menu).toBeVisible();

// Click outside (e.g., hero section)
await page.locator('.hero').click();
await expect(menu).toBeHidden();
await expect(hamburger).toHaveAttribute('aria-expanded', 'false');
```

---

### Requirement: Language toggle MUST remain in top-right corner

**Rationale:** Language toggle is a global control that should be accessible from all pages. Keeping it in the top-right maintains consistency with exhibition pages.

**Priority:** P0 (Critical)

#### Scenario: Language toggle button is visible in top-right

**Given** the user is on the homepage

**When** the page loads

**Then** a language toggle button SHALL be visible in the top-right corner
**And** the button SHALL display text `"EN/中"` or current language
**And** the button SHALL have `id="lang-toggle"`
**And** the button SHALL have `aria-label` containing "切换语言" or "Toggle Language"

**Validation:**
```javascript
const langToggle = page.locator('#lang-toggle');
await expect(langToggle).toBeVisible();
await expect(langToggle).toHaveText(/EN|中/);
await expect(langToggle).toHaveAttribute('aria-label', expect.stringContaining('Toggle Language'));
```

---

#### Scenario: Clicking language toggle changes page language

**Given** the page is in Chinese (`lang="zh-CN"`)

**When** the user clicks the language toggle button

**Then** the page's `lang` attribute SHALL change to `"en"`
**And** the language toggle button text SHALL update to show the NEW current language
**And** a `langchange` event SHALL be dispatched on `window`
**And** the language preference SHALL be saved to `localStorage`

**Validation:**
```javascript
// Initial language: Chinese
await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');

// Click toggle
await langToggle.click();

// Language changed to English
await expect(page.locator('html')).toHaveAttribute('lang', 'en');

// Button text updated
await expect(langToggle).toHaveText(/中/); // Shows Chinese when in English mode

// localStorage saved
const savedLang = await page.evaluate(() => localStorage.getItem('preferredLang'));
expect(savedLang).toBe('en');
```

---

### Requirement: Navigation links MUST navigate to correct pages

**Rationale:** Navigation is useless if links don't work. All links must navigate to their intended destinations.

**Priority:** P0 (Critical)

#### Scenario: Each navigation link navigates to correct page

**Given** the user opens the floating menu

**When** the user clicks a navigation link

**Then** the browser SHALL navigate to the correct URL:
  | Link Label | Expected URL |
  |------------|--------------|
  | 🏠 主页 | `/` |
  | 📚 展览归档 | `/pages/exhibitions-archive.html` |
  | 👥 评论家 | `/pages/critics.html` |
  | ℹ️ 关于 | `/pages/about.html` |
  | 🎨 过程 | `/pages/process.html` |

**Validation:**
```javascript
await hamburger.click();

// Test each link
const homeLink = menu.locator('a[href="/"]');
await homeLink.click();
await expect(page).toHaveURL('/');

await page.goto('/'); // Reset
await hamburger.click();
const criticsLink = menu.locator('a[href="/pages/critics.html"]');
await criticsLink.click();
await expect(page).toHaveURL(/\/pages\/critics\.html/);

// ... test remaining links ...
```

---

### Requirement: Homepage MUST NOT load GlobalNavigation component

**Rationale:** Removing the old component ensures no conflicts, reduces bundle size, and prevents confusion about which navigation system is active.

**Priority:** P1 (High)

#### Scenario: GlobalNavigation scripts are not loaded

**Given** the user visits the homepage

**When** the page loads

**Then** the `GlobalNavigation` JavaScript module SHALL NOT be loaded
**And** the `shared/js/global-navigation.js` file SHALL NOT be requested
**And** the `shared/styles/global-navigation.css` file SHALL NOT be requested
**And** NO console log "[GlobalNavigation] Initialized" SHALL appear

**Validation:**
```javascript
// Check network requests
const jsRequest = await page.waitForRequest('**/global-navigation.js', { timeout: 1000 }).catch(() => null);
expect(jsRequest).toBeNull(); // File should not be requested

const cssRequest = await page.waitForRequest('**/global-navigation.css', { timeout: 1000 }).catch(() => null);
expect(cssRequest).toBeNull(); // File should not be requested

// Check console logs
const logs = [];
page.on('console', msg => logs.push(msg.text()));
await page.goto('/');
expect(logs).not.toContain('[GlobalNavigation] Initialized');
```

---

### Requirement: Navigation styles MUST match exhibition pages

**Rationale:** Visual consistency reinforces that the navigation is the same across all pages. Users should recognize the menu immediately.

**Priority:** P1 (High)

#### Scenario: Hamburger menu uses same CSS classes as exhibition pages

**Given** the user inspects the homepage header

**When** comparing CSS classes with exhibition pages

**Then** the homepage header SHALL use class `"header-minimal"`
**And** the hamburger button SHALL use class `"hamburger"`
**And** the language toggle SHALL use class `"lang-toggle"`
**And** the floating menu SHALL use class `"floating-menu"`
**And** navigation links SHALL use class `"menu-item"`
**And** all styles SHALL be loaded from `styles/main.css`

**Validation:**
```javascript
// Check CSS classes
await expect(page.locator('header')).toHaveClass(/header-minimal/);
await expect(hamburger).toHaveClass(/hamburger/);
await expect(langToggle).toHaveClass(/lang-toggle/);
await expect(menu).toHaveClass(/floating-menu/);

const menuItems = menu.locator('.menu-item');
await expect(menuItems.first()).toHaveClass(/menu-item/);

// Check CSS file loaded
const cssLinks = page.locator('link[rel="stylesheet"]');
const mainCss = cssLinks.filter({ hasText: /main\.css/ });
await expect(mainCss).toHaveCount(1);
```

---

## MODIFIED Requirements

None - This is a new implementation replacing an existing component.

---

## REMOVED Requirements

### Removed: Desktop horizontal navigation bar

**Previous Requirement**: "Homepage SHALL display horizontal navigation links on desktop screens (>768px)"

**Reason for Removal**: User requested hamburger menu on all screen sizes for consistency with exhibition pages.

---

### Removed: GlobalNavigation component initialization

**Previous Requirement**: "GlobalNavigation component SHALL initialize on page load and render navigation bar"

**Reason for Removal**: GlobalNavigation component is replaced by inline hamburger menu implementation.

---

## Cross-References

- **Depends on**: None (uses existing `styles/main.css`)
- **Enables**: Consistent navigation UX across all pages
- **Related to**: Exhibition page navigation (same implementation pattern)

---

## Acceptance Criteria

✅ Homepage displays hamburger menu in top-left corner
✅ Clicking hamburger opens/closes floating menu
✅ Floating menu contains 5 navigation links with emoji icons
✅ Language toggle button in top-right corner
✅ Language toggle changes page language and updates display
✅ All navigation links navigate to correct pages
✅ Clicking outside menu closes it
✅ GlobalNavigation component is NOT loaded
✅ CSS classes match exhibition pages
✅ No console errors or broken functionality
✅ Responsive design works on mobile/tablet/desktop (375px/768px/1920px)

---

## Implementation Notes

### HTML Structure (Copy from Exhibition Pages)

```html
<header class="header-minimal">
  <div class="header-controls">
    <button class="hamburger" id="menu-toggle" aria-label="打开菜单 Open menu" aria-expanded="false">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <button class="lang-toggle" id="lang-toggle" aria-label="切换语言 Toggle Language">
      <span class="lang-text">EN/中</span>
    </button>
  </div>
</header>

<nav class="floating-menu" id="floating-menu" aria-label="导航菜单 Navigation menu" hidden>
  <div class="menu-content">
    <a href="/" class="menu-item menu-home">
      <span>🏠</span>
      <span class="menu-label">主页</span>
    </a>
    <a href="/pages/exhibitions-archive.html" class="menu-item menu-archive">
      <span>📚</span>
      <span class="menu-label">展览归档</span>
    </a>
    <a href="/pages/critics.html" class="menu-item menu-critics">
      <span>👥</span>
      <span class="menu-label">评论家</span>
    </a>
    <a href="/pages/about.html" class="menu-item menu-about">
      <span>ℹ️</span>
      <span class="menu-label">关于</span>
    </a>
    <a href="/pages/process.html" class="menu-item menu-process">
      <span>🎨</span>
      <span class="menu-label">过程</span>
    </a>
  </div>
</nav>
```

### JavaScript (Inline, Copy from Exhibition Pages)

```javascript
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const floatingMenu = document.getElementById('floating-menu');

    if (menuToggle && floatingMenu) {
      menuToggle.addEventListener('click', () => {
        const isOpen = !floatingMenu.hasAttribute('hidden');
        if (isOpen) {
          floatingMenu.setAttribute('hidden', '');
          menuToggle.setAttribute('aria-expanded', 'false');
        } else {
          floatingMenu.removeAttribute('hidden');
          menuToggle.setAttribute('aria-expanded', 'true');
        }
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!floatingMenu.contains(e.target) && !menuToggle.contains(e.target)) {
          floatingMenu.setAttribute('hidden', '');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Language toggle
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
      langToggle.addEventListener('click', () => {
        const currentLang = document.documentElement.getAttribute('lang') || 'zh-CN';
        const newLang = currentLang === 'zh-CN' ? 'en' : 'zh-CN';

        document.documentElement.setAttribute('lang', newLang);

        const event = new CustomEvent('langchange', { detail: { lang: newLang } });
        window.dispatchEvent(event);

        localStorage.setItem('preferredLang', newLang);

        console.log('[Navigation] Language changed to:', newLang);
      });
    }
  });
</script>
```
