# Proposal: Remove Unused Menu Items

## Why

### Problem Statement

The floating navigation menu contains two non-functional buttons that clutter the interface without providing any value:

1. **"语言" (Language) button** (`id="menu-lang"`)
   - Present in menu with 🔤 icon and "语言" label
   - **No event handlers attached** - clicking does nothing
   - No language switching functionality implemented
   - Creates false affordance for users

2. **"关闭" (Close) button** (`id="menu-close"`)
   - Present in menu with ✕ icon and "关闭" label
   - **Redundant functionality** - menu already closes via:
     - Clicking outside the menu
     - Pressing Escape key
     - Clicking any menu item (on mobile)
     - Clicking hamburger button again
   - Takes up valuable menu space

### Impact

**User Experience**:
- ⚠️ **Confusion**: Users click "语言" expecting to change language, nothing happens
- ⚠️ **Clutter**: 6 menu items when only 4 are functional navigation links
- ⚠️ **Inconsistency**: Some items navigate, some are supposed to do actions (but don't)

**Code Quality**:
- Dead HTML elements that serve no purpose
- Increases maintenance burden (HTML must be updated in 4 files)
- Violates principle of minimal viable interface

**Scope**:
- Affects: All 4 HTML pages (index.html, critics.html, about.html, process.html)
- Lines: 94-101 in each file (8 lines × 4 files = 32 lines to remove)

## What Changes

Remove the two non-functional menu buttons from all pages, leaving only the 4 functional navigation links.

### Before (6 items)
```html
<a href="/">主画廊</a>
<a href="/pages/critics.html">评论家</a>
<a href="/pages/about.html">关于</a>
<a href="/pages/process.html">过程</a>
<button id="menu-lang">语言</button>   <!-- ❌ Remove -->
<button id="menu-close">关闭</button>   <!-- ❌ Remove -->
```

### After (4 items)
```html
<a href="/">主画廊</a>
<a href="/pages/critics.html">评论家</a>
<a href="/pages/about.html">关于</a>
<a href="/pages/process.html">过程</a>
```

### Files to Modify

1. **index.html** (lines 94-101) - Remove language and close buttons
2. **pages/critics.html** (lines ~94-101) - Remove language and close buttons
3. **pages/about.html** (lines ~94-101) - Remove language and close buttons
4. **pages/process.html** (lines ~94-101) - Remove language and close buttons

### Success Criteria

**Must Have**:
- ✅ Language button removed from all pages
- ✅ Close button removed from all pages
- ✅ Menu only shows 4 navigation links
- ✅ No JavaScript errors (no code references these IDs)
- ✅ Menu still closes via hamburger button, outside click, Escape key

**Should Have**:
- ✅ Visual layout remains clean and centered
- ✅ No CSS orphan rules (verify styles don't target removed IDs)

## Dependencies & Sequencing

### Prerequisites

**None** - This is a pure HTML cleanup with no dependencies.

### Validation

**Check for references**:
```bash
# Already verified - no JS code references menu-lang or menu-close
rg "menu-lang|menu-close" js/
# Result: No matches found ✅
```

**No CSS dependencies**:
```bash
rg "#menu-lang|#menu-close|\.menu-lang|\.menu-close" styles/
# Expected: No specific styles (uses generic .menu-item class)
```

## How to Implement

### Step 1: Remove from index.html

**File**: `index.html`
**Lines**: 94-101

**Delete these lines**:
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

### Step 2: Remove from pages/critics.html

**File**: `pages/critics.html`

Locate the `<nav class="floating-menu">` section and remove the same 8 lines.

### Step 3: Remove from pages/about.html

**File**: `pages/about.html`

Locate the `<nav class="floating-menu">` section and remove the same 8 lines.

### Step 4: Remove from pages/process.html

**File**: `pages/process.html`

Locate the `<nav class="floating-menu">` section and remove the same 8 lines.

### Step 5: Test

**Manual Testing**:
1. Open each page in browser
2. Click hamburger menu (☰)
3. Verify only 4 items shown:
   - 🏠 主画廊
   - 👥 评论家
   - ℹ️ 关于
   - 🎨 过程
4. Verify no "语言" or "关闭" buttons
5. Verify menu closes via:
   - Clicking hamburger again ✅
   - Clicking outside menu ✅
   - Pressing Escape ✅
   - Clicking any navigation item ✅

## Risks & Mitigations

### Risk 1: Future language switching feature

**Probability**: Low
**Impact**: Low

**Analysis**:
- No current plan for multi-language support in code
- If needed in future, can add back as functional feature
- Better to remove now and add properly later than keep broken button

**Mitigation**:
- Document in CLAUDE.md that language switching was removed
- If re-added, implement with proper i18n library

### Risk 2: Users expect explicit close button

**Probability**: Very Low
**Impact**: Minimal

**Analysis**:
- Standard pattern: menus close on outside click or navigation
- Mobile users expect this behavior (drawer pattern)
- Hamburger button already acts as toggle

**Mitigation**:
- Test with users after deployment
- If needed, can add back (but unlikely)

## Validation & Testing

### Automated Checks

**Verify no JS dependencies**:
```bash
rg "menu-lang|menu-close" js/
# Expected: No matches ✅
```

**Verify no CSS dependencies**:
```bash
rg "#menu-lang|#menu-close" styles/
# Expected: No matches (or only generic .menu-item) ✅
```

**HTML validation**:
- Run HTML validator on all 4 pages
- Ensure no broken references

### Manual Testing Checklist

**Per Page (4 pages)**:
- [ ] Open page in browser
- [ ] Click hamburger menu
- [ ] Count menu items: expect 4 (not 6)
- [ ] Verify no "语言" button
- [ ] Verify no "关闭" button
- [ ] Test menu closes via hamburger click
- [ ] Test menu closes via outside click
- [ ] Test menu closes via Escape key
- [ ] Test navigation links work

**Cross-browser**:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile (Chrome Android)

## Timeline Estimate

**Total Time**: 30 minutes

| Task | Time | Notes |
|------|------|-------|
| Remove from index.html | 5 min | Simple deletion |
| Remove from critics.html | 5 min | Copy-paste location |
| Remove from about.html | 5 min | Copy-paste location |
| Remove from process.html | 5 min | Copy-paste location |
| Manual testing (4 pages) | 10 min | Quick verification |

## Alternatives Considered

### Alternative 1: Implement language switching

**Description**: Add functionality to "语言" button instead of removing

**Pros**:
- Enables multi-language support
- Useful for international visitors

**Cons**:
- Requires significant development (i18n library, translation files)
- Out of scope for current request
- No translations currently exist
- Adds complexity without immediate value

**Verdict**: ❌ Rejected - Remove now, implement properly if needed later

### Alternative 2: Keep close button

**Description**: Remove only "语言", keep "关闭"

**Pros**:
- Explicit close affordance for some users

**Cons**:
- Redundant with existing close mechanisms
- Takes up menu space
- Not standard UX pattern for side menus

**Verdict**: ❌ Rejected - Remove both for minimal clean interface

### Alternative 3: Hide with CSS instead of delete

**Description**: Use `display: none` to hide buttons

**Pros**:
- Easy to revert
- Keeps HTML structure

**Cons**:
- HTML still bloated
- Not a proper fix
- Still need to update 4 files

**Verdict**: ❌ Rejected - Proper deletion is cleaner

## Related Work

### OpenSpec Changes

**Related**:
- `auto-hide-navigation` (spec) - Navigation behavior (unaffected by this change)

**This change completes the navigation cleanup by removing dead UI elements.**

---

**Proposal Status**: Draft
**Created**: 2025-11-03
**Author**: Claude (via user request)
**Complexity**: Low (Simple HTML deletion)
**Priority**: Medium (P1 - UX cleanup)
