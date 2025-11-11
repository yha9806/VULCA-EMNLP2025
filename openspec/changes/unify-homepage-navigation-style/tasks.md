# Implementation Tasks: Unify Homepage Navigation Style

**Change ID:** unify-homepage-navigation-style
**Total Estimated Time:** 1.5 hours

---

## Phase 1: Preparation (15 minutes)

### Task 1.1: Read exhibition page HTML structure
**Estimate:** 5 minutes
**Owner:** Developer

Read `/exhibitions/negative-space-of-the-tide/index.html` lines 68-112 to understand:
- `header-minimal` structure
- `floating-menu` structure
- Inline JavaScript for hamburger toggle

**Success Criteria:**
- [x] Identified HTML structure for header
- [x] Identified HTML structure for floating menu
- [x] Understood inline JavaScript implementation

---

### Task 1.2: Verify CSS availability in styles/main.css
**Estimate:** 5 minutes
**Owner:** Developer

Search `styles/main.css` for:
- `.header-minimal` (should exist)
- `.floating-menu` (should exist)
- `.hamburger` (should exist)
- `.menu-item` (should exist)

**Success Criteria:**
- [x] All required CSS classes found in `styles/main.css`
- [x] No new CSS needs to be written

---

### Task 1.3: Backup current index.html
**Estimate:** 2 minutes
**Owner:** Developer

```bash
cp index.html index.html.backup
git add index.html.backup
git commit -m "backup: Save current homepage before navigation refactor"
```

**Success Criteria:**
- [x] Backup file created
- [x] Backup committed to git
- [x] Can rollback if needed

---

### Task 1.4: Test current homepage functionality
**Estimate:** 3 minutes
**Owner:** QA/Developer

Open `http://localhost:9999/` and verify:
- [x] Current horizontal navigation works
- [x] Language toggle works
- [x] All links navigate correctly
- [x] No console errors

Take screenshot for comparison after changes.

**Success Criteria:**
- [x] Baseline functionality documented
- [x] Screenshot saved

---

## Phase 2: Implementation (45 minutes)

### Task 2.1: Remove GlobalNavigation component references
**Estimate:** 5 minutes
**Owner:** Developer

Edit `index.html`:
1. Remove line: `<link rel="stylesheet" href="/shared/styles/global-navigation.css">`
2. Remove line: `<script type="module" src="/shared/js/global-navigation.js?v=2"></script>`
3. Save file

**Success Criteria:**
- [x] No references to `global-navigation.css`
- [x] No references to `global-navigation.js`
- [x] File saves without errors

---

### Task 2.2: Add styles/main.css to homepage
**Estimate:** 3 minutes
**Owner:** Developer

Edit `index.html` `<head>` section:
1. Find line with `<link rel="stylesheet" href="/styles/portfolio-homepage.css">`
2. Add BEFORE it:
   ```html
   <link rel="stylesheet" href="/styles/main.css">
   ```
3. Save file

**Success Criteria:**
- [x] `styles/main.css` loaded before `portfolio-homepage.css`
- [x] Both CSS files loaded in correct order

---

### Task 2.3: Replace header with header-minimal
**Estimate:** 10 minutes
**Owner:** Developer

Edit `index.html`:
1. Remove comment: `<!-- Global Navigation (injected by JS) -->`
2. Add BEFORE `<header class="hero">`:
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
   ```
3. Save file

**Success Criteria:**
- [x] `header-minimal` added before hero section
- [x] Hamburger button has 3 `<span>` elements
- [x] Language toggle has correct structure
- [x] ARIA labels present

---

### Task 2.4: Add floating menu navigation
**Estimate:** 12 minutes
**Owner:** Developer

Edit `index.html`:
1. Add AFTER `</header>` (header-minimal):
   ```html
   <nav class="floating-menu" id="floating-menu" aria-label="导航菜单 Navigation menu" hidden>
     <div class="menu-content">
       <a href="/" class="menu-item menu-home" aria-label="返回主画廊 Return to main gallery">
         <span>🏠</span>
         <span class="menu-label">主页</span>
       </a>
       <a href="/pages/exhibitions-archive.html" class="menu-item menu-archive" aria-label="查看展览归档 View exhibitions archive">
         <span>📚</span>
         <span class="menu-label">展览归档</span>
       </a>
       <a href="/pages/critics.html" class="menu-item menu-critics" aria-label="查看评论家 View critics">
         <span>👥</span>
         <span class="menu-label">评论家</span>
       </a>
       <a href="/pages/about.html" class="menu-item menu-about" aria-label="了解VULCA Learn about VULCA">
         <span>ℹ️</span>
         <span class="menu-label">关于</span>
       </a>
       <a href="/pages/process.html" class="menu-item menu-process" aria-label="查看创作过程 See creation process">
         <span>🎨</span>
         <span class="menu-label">过程</span>
       </a>
     </div>
   </nav>
   ```
2. Save file

**Success Criteria:**
- [x] Floating menu added with `hidden` attribute
- [x] 5 navigation links present
- [x] Each link has emoji + label
- [x] ARIA labels present on each link

---

### Task 2.5: Add inline JavaScript for menu toggle
**Estimate:** 15 minutes
**Owner:** Developer

Edit `index.html`:
1. Find the `<script type="module">` section near end of file (before `</body>`)
2. Add BEFORE the existing script:
   ```html
   <script>
     document.addEventListener('DOMContentLoaded', () => {
       const menuToggle = document.getElementById('menu-toggle');
       const floatingMenu = document.getElementById('floating-menu');

       if (menuToggle && floatingMenu) {
         // Toggle menu on button click
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

           // Trigger language change event
           const event = new CustomEvent('langchange', { detail: { lang: newLang } });
           window.dispatchEvent(event);

           // Store preference
           localStorage.setItem('preferredLang', newLang);

           console.log('[Navigation] Language changed to:', newLang);
         });
       }
     });
   </script>
   ```
3. Save file

**Success Criteria:**
- [x] Inline script added before existing module script
- [x] Menu toggle logic present
- [x] Click-outside-to-close logic present
- [x] Language toggle logic present
- [x] Console log confirms language changes

---

## Phase 3: Testing (20 minutes)

### Task 3.1: Test hamburger menu functionality
**Estimate:** 5 minutes
**Owner:** QA

Open `http://localhost:9999/` and test:
- [x] Hamburger button visible in top-left corner
- [x] Click hamburger opens menu
- [x] Menu displays 5 links with emojis
- [x] Click hamburger again closes menu
- [x] Click outside menu closes menu

**Success Criteria:**
- [x] All hamburger interactions work correctly
- [x] No console errors

---

### Task 3.2: Test navigation links
**Estimate:** 5 minutes
**Owner:** QA

For each navigation link:
- [x] Click "🏠 主页" → navigates to `/`
- [x] Click "📚 展览归档" → navigates to `/pages/exhibitions-archive.html`
- [x] Click "👥 评论家" → navigates to `/pages/critics.html`
- [x] Click "ℹ️ 关于" → navigates to `/pages/about.html`
- [x] Click "🎨 过程" → navigates to `/pages/process.html`

**Success Criteria:**
- [x] All links navigate to correct pages
- [x] No 404 errors

---

### Task 3.3: Test language toggle
**Estimate:** 3 minutes
**Owner:** QA

On homepage:
- [x] Language toggle visible in top-right corner
- [x] Initial language is Chinese (`lang="zh-CN"`)
- [x] Click toggle changes to English (`lang="en"`)
- [x] Console shows: `[Navigation] Language changed to: en`
- [x] Click toggle again changes back to Chinese
- [x] Language preference saved in localStorage

**Success Criteria:**
- [x] Language toggle works correctly
- [x] DOM `lang` attribute updates
- [x] localStorage saves preference

---

### Task 3.4: Test responsive design
**Estimate:** 5 minutes
**Owner:** QA

Test at different viewport sizes:

**Desktop (1920px):**
- [x] Hamburger menu visible
- [x] Language toggle visible
- [x] Menu opens/closes smoothly

**Tablet (768px):**
- [x] Hamburger menu still visible
- [x] Language toggle still visible
- [x] Menu fits screen properly

**Mobile (375px):**
- [x] Hamburger menu usable
- [x] Language toggle usable
- [x] Menu overlay covers full screen
- [x] No horizontal scrolling

**Success Criteria:**
- [x] Navigation works on all screen sizes
- [x] No layout issues

---

### Task 3.5: Verify GlobalNavigation not loaded
**Estimate:** 2 minutes
**Owner:** QA

Open browser DevTools:
1. Check Network tab:
   - [x] No request for `/shared/js/global-navigation.js`
   - [x] No request for `/shared/styles/global-navigation.css`
2. Check Console tab:
   - [x] No log: `[GlobalNavigation] Initialized`

**Success Criteria:**
- [x] Old component files not loaded
- [x] No console errors related to GlobalNavigation

---

## Phase 4: Comparison and Validation (10 minutes)

### Task 4.1: Compare with exhibition page navigation
**Estimate:** 5 minutes
**Owner:** QA

Open two tabs:
- Tab 1: `http://localhost:9999/` (homepage)
- Tab 2: `http://localhost:9999/exhibitions/negative-space-of-the-tide/` (exhibition page)

Compare:
- [x] Hamburger button looks identical
- [x] Menu opens/closes identically
- [x] Language toggle looks identical
- [x] Menu items have same styling

**Success Criteria:**
- [x] Navigation UX is consistent across pages
- [x] Visual appearance matches

---

### Task 4.2: Screenshot comparison
**Estimate:** 3 minutes
**Owner:** QA

Take screenshots:
- [x] Homepage hamburger menu (closed)
- [x] Homepage hamburger menu (open)
- [x] Exhibition page hamburger menu (open)

Compare side-by-side:
- [x] Menus look visually identical
- [x] Positioning matches
- [x] Colors and spacing match

**Success Criteria:**
- [x] Screenshots confirm visual consistency

---

### Task 4.3: Accessibility audit
**Estimate:** 2 minutes
**Owner:** QA

Check accessibility:
- [x] Tab key focuses hamburger button
- [x] Enter/Space key toggles menu
- [x] Tab key navigates through menu links
- [x] Screen reader announces `aria-label` correctly
- [x] `aria-expanded` updates on toggle

**Success Criteria:**
- [x] Keyboard navigation works
- [x] ARIA attributes correct

---

## Phase 5: Cleanup and Documentation (10 minutes)

### Task 5.1: Remove backup file
**Estimate:** 2 minutes
**Owner:** Developer

```bash
git rm index.html.backup
git commit -m "cleanup: Remove backup file after successful migration"
```

**Success Criteria:**
- [x] Backup file removed from repository

---

### Task 5.2: Update documentation
**Estimate:** 5 minutes
**Owner:** Developer

Update `CLAUDE.md` or relevant docs:
- [x] Document new navigation system (hamburger menu)
- [x] Remove references to GlobalNavigation component
- [x] Add note about consistent navigation across all pages

**Success Criteria:**
- [x] Documentation updated
- [x] Future developers know to use hamburger menu

---

### Task 5.3: Mark GlobalNavigation files as deprecated
**Estimate:** 3 minutes
**Owner:** Developer

Add comment to top of `shared/js/global-navigation.js`:
```javascript
/**
 * DEPRECATED: This component is no longer used as of 2025-11-11.
 * Homepage now uses the same hamburger menu pattern as exhibition pages.
 * See: /exhibitions/negative-space-of-the-tide/index.html for reference.
 *
 * This file can be safely deleted if no other pages reference it.
 */
```

Add similar comment to `shared/styles/global-navigation.css`.

**Success Criteria:**
- [x] Deprecation comments added to both files
- [x] Files remain in repository (safe to delete later)

---

## Phase 6: Commit and Deploy (5 minutes)

### Task 6.1: Commit changes
**Estimate:** 3 minutes
**Owner:** Developer

```bash
git add index.html styles/main.css shared/js/global-navigation.js shared/styles/global-navigation.css
git commit -m "feat: Unify homepage navigation with hamburger menu

Replace right-side horizontal navigation with left-side hamburger menu
to match exhibition pages. Provides consistent navigation UX across all pages.

- Remove GlobalNavigation component (deprecated)
- Add header-minimal and floating-menu to homepage
- Reuse styles from styles/main.css (no new CSS needed)
- Add inline JavaScript for menu toggle
- Maintain language toggle in top-right corner

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**Success Criteria:**
- [x] Changes committed with descriptive message
- [x] Commit includes all modified files

---

### Task 6.2: Push to remote repository
**Estimate:** 2 minutes
**Owner:** Developer

```bash
git push origin feature/multi-exhibition-platform
```

**Success Criteria:**
- [x] Changes pushed to remote
- [x] No merge conflicts

---

## Summary

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1: Preparation | 4 | 15 minutes |
| Phase 2: Implementation | 5 | 45 minutes |
| Phase 3: Testing | 5 | 20 minutes |
| Phase 4: Comparison and Validation | 3 | 10 minutes |
| Phase 5: Cleanup and Documentation | 3 | 10 minutes |
| Phase 6: Commit and Deploy | 2 | 5 minutes |
| **Total** | **22** | **1.5 hours** |

---

## Dependencies

- **Requires**: `styles/main.css` must contain hamburger menu styles (already exists)
- **Blocks**: None
- **Parallel Work**: Can implement while other features are in progress

---

## Rollback Instructions

If this change causes issues:

```bash
# Revert to previous version
git checkout HEAD^ index.html

# Or restore from backup
git checkout <commit-hash> index.html.backup
mv index.html.backup index.html

# Push rollback
git add index.html
git commit -m "rollback: Restore GlobalNavigation component"
git push origin feature/multi-exhibition-platform
```

**Recovery Time**: < 5 minutes
