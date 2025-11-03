# Tasks: Remove Unused Menu Items

## Overview

Remove non-functional "语言" (Language) and "关闭" (Close) buttons from the floating navigation menu across all 4 HTML pages.

**Total Estimated Time**: 30 minutes

---

## Phase 1: Preparation (5 minutes)

### Task 1.1: Verify Current State
**Description**: Confirm the current menu structure before making changes.

**Steps**:
1. Open index.html in browser
2. Click hamburger menu (☰)
3. Count menu items (should see 6 items currently)
4. Note presence of "语言" and "关闭" buttons

**Validation**:
- [ ] Menu currently shows 6 items
- [ ] "语言" button visible but non-functional
- [ ] "关闭" button visible but redundant

**Time Estimate**: 2 minutes

---

### Task 1.2: Verify No Code Dependencies
**Description**: Confirm that removing these buttons won't break JavaScript.

**Steps**:
```bash
# Search for references to removed button IDs
rg "menu-lang|menu-close" js/

# Expected output: No matches
```

**Validation**:
- [ ] No JavaScript code references `menu-lang`
- [ ] No JavaScript code references `menu-close`
- [ ] Safe to remove HTML elements

**Time Estimate**: 1 minute

---

### Task 1.3: Locate Menu HTML in All Files
**Description**: Find exact line numbers for menu structure in all pages.

**Steps**:
```bash
# Find menu structure in each file
for file in index.html pages/critics.html pages/about.html pages/process.html; do
  echo "=== $file ==="
  grep -n "menu-lang\|menu-close" "$file"
done
```

**Expected Output**:
- index.html: lines 94-101
- pages/critics.html: ~lines 94-101
- pages/about.html: ~lines 94-101
- pages/process.html: ~lines 94-101

**Validation**:
- [ ] Located menu-lang button in all 4 files
- [ ] Located menu-close button in all 4 files
- [ ] Noted exact line numbers

**Time Estimate**: 2 minutes

---

## Phase 2: Implementation (15 minutes)

### Task 2.1: Remove Buttons from index.html
**Description**: Delete the language and close buttons from main page.

**File**: `index.html`
**Lines to Remove**: 94-101

**Delete this code**:
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

**Validation**:
- [ ] Lines 94-101 removed from index.html
- [ ] Menu now contains only 4 `<a>` elements
- [ ] No `<button>` elements remain in menu
- [ ] File saves without errors

**Time Estimate**: 3 minutes

---

### Task 2.2: Remove Buttons from pages/critics.html
**Description**: Delete the language and close buttons from critics page.

**File**: `pages/critics.html`
**Lines to Remove**: Locate and remove same 8-line block

**Steps**:
1. Open `pages/critics.html`
2. Find `<nav class="floating-menu">`
3. Locate and delete the two button elements
4. Save file

**Validation**:
- [ ] menu-lang button removed
- [ ] menu-close button removed
- [ ] Menu structure matches index.html
- [ ] File saves without errors

**Time Estimate**: 3 minutes

---

### Task 2.3: Remove Buttons from pages/about.html
**Description**: Delete the language and close buttons from about page.

**File**: `pages/about.html`
**Lines to Remove**: Locate and remove same 8-line block

**Steps**:
1. Open `pages/about.html`
2. Find `<nav class="floating-menu">`
3. Locate and delete the two button elements
4. Save file

**Validation**:
- [ ] menu-lang button removed
- [ ] menu-close button removed
- [ ] Menu structure matches index.html
- [ ] File saves without errors

**Time Estimate**: 3 minutes

---

### Task 2.4: Remove Buttons from pages/process.html
**Description**: Delete the language and close buttons from process page.

**File**: `pages/process.html`
**Lines to Remove**: Locate and remove same 8-line block

**Steps**:
1. Open `pages/process.html`
2. Find `<nav class="floating-menu">`
3. Locate and delete the two button elements
4. Save file

**Validation**:
- [ ] menu-lang button removed
- [ ] menu-close button removed
- [ ] Menu structure matches index.html
- [ ] File saves without errors

**Time Estimate**: 3 minutes

---

### Task 2.5: Verify Consistency Across All Files
**Description**: Ensure all 4 HTML files have identical menu structure.

**Steps**:
```bash
# Extract menu HTML from each file and compare
for file in index.html pages/critics.html pages/about.html pages/process.html; do
  echo "=== $file ==="
  sed -n '/<nav class="floating-menu"/,/<\/nav>/p' "$file"
  echo ""
done
```

**Validation**:
- [ ] All 4 files have identical menu structure
- [ ] Each menu has exactly 4 items
- [ ] All menus show: 主画廊, 评论家, 关于, 过程
- [ ] No buttons remain in any file

**Time Estimate**: 3 minutes

---

## Phase 3: Testing (10 minutes)

### Task 3.1: Manual Testing - Main Page
**Description**: Test menu on index.html.

**Test Steps**:
1. Open http://localhost:9999/index.html
2. Click hamburger button (☰)
3. Verify menu shows exactly 4 items
4. Verify no "语言" or "关闭" buttons
5. Test close mechanisms:
   - Click hamburger again → menu closes
   - Open again, click outside → menu closes
   - Open again, press Escape → menu closes
6. Click "评论家" → navigates to critics page

**Validation**:
- [ ] Menu displays 4 items (🏠 👥 ℹ️ 🎨)
- [ ] No language button visible
- [ ] No close button visible
- [ ] Hamburger toggle works
- [ ] Outside click works
- [ ] Escape key works
- [ ] Navigation links work

**Time Estimate**: 3 minutes

---

### Task 3.2: Manual Testing - Critics Page
**Description**: Test menu on pages/critics.html.

**Test Steps**:
1. Navigate to http://localhost:9999/pages/critics.html
2. Click hamburger button
3. Verify menu structure (same as Task 3.1)
4. Test all close mechanisms
5. Test navigation to other pages

**Validation**:
- [ ] Menu displays 4 items
- [ ] No removed buttons visible
- [ ] All close mechanisms work
- [ ] Navigation works

**Time Estimate**: 2 minutes

---

### Task 3.3: Manual Testing - About Page
**Description**: Test menu on pages/about.html.

**Test Steps**:
1. Navigate to http://localhost:9999/pages/about.html
2. Repeat same testing as Task 3.2

**Validation**:
- [ ] Menu displays 4 items
- [ ] No removed buttons visible
- [ ] All close mechanisms work
- [ ] Navigation works

**Time Estimate**: 2 minutes

---

### Task 3.4: Manual Testing - Process Page
**Description**: Test menu on pages/process.html.

**Test Steps**:
1. Navigate to http://localhost:9999/pages/process.html
2. Repeat same testing as Task 3.2

**Validation**:
- [ ] Menu displays 4 items
- [ ] No removed buttons visible
- [ ] All close mechanisms work
- [ ] Navigation works

**Time Estimate**: 2 minutes

---

### Task 3.5: Cross-Browser Testing
**Description**: Verify menu works in different browsers.

**Browsers to Test**:
- [ ] Chrome/Edge (primary)
- [ ] Firefox (if available)
- [ ] Mobile Chrome (responsive mode)

**Per Browser**:
1. Open any page
2. Open menu
3. Verify 4 items, no removed buttons
4. Test one close mechanism (hamburger toggle)

**Validation**:
- [ ] Menu displays correctly in all tested browsers
- [ ] No console errors in any browser

**Time Estimate**: 1 minute (if only testing Chrome)

---

## Phase 4: Verification (Optional - 5 minutes)

### Task 4.1: Code Verification
**Description**: Use automated checks to verify cleanup.

**Steps**:
```bash
# Verify no HTML references remain
rg "menu-lang|menu-close" index.html pages/*.html
# Expected: No matches

# Count menu items in each file
for file in index.html pages/*.html; do
  count=$(grep -c 'class="menu-item"' "$file")
  echo "$file: $count menu items (expect 4)"
done

# Verify no JavaScript references
rg "menu-lang|menu-close" js/
# Expected: No matches
```

**Validation**:
- [ ] No HTML files contain removed button IDs
- [ ] Each file has exactly 4 menu items
- [ ] No JavaScript references found

**Time Estimate**: 2 minutes

---

### Task 4.2: Accessibility Check
**Description**: Verify accessibility is maintained.

**Steps**:
1. Open index.html
2. Open browser DevTools
3. Use keyboard to navigate menu:
   - Tab to hamburger button
   - Press Enter to open menu
   - Tab through menu items (should be 4 tabs)
   - Press Enter on a link (should navigate)
4. Check ARIA attributes:
   - Menu has `aria-label="Navigation menu"`
   - Hamburger has `aria-expanded` attribute
   - Each link has `aria-label`

**Validation**:
- [ ] Keyboard navigation works
- [ ] Tab stops reduced from 6 to 4
- [ ] All ARIA attributes present
- [ ] No accessibility errors in DevTools

**Time Estimate**: 3 minutes

---

## Summary

**Total Tasks**: 15 tasks
**Phases**: 4 phases (Preparation, Implementation, Testing, Verification)
**Total Time**: ~30 minutes

### Completion Checklist

**Implementation**:
- [ ] index.html updated
- [ ] pages/critics.html updated
- [ ] pages/about.html updated
- [ ] pages/process.html updated

**Testing**:
- [ ] All 4 pages tested manually
- [ ] Menu shows 4 items on each page
- [ ] No removed buttons visible
- [ ] All close mechanisms work

**Verification**:
- [ ] No HTML references to removed buttons
- [ ] No JavaScript references
- [ ] Accessibility maintained

---

## Dependencies

**No task dependencies** - All implementation tasks (2.1-2.4) can be done in parallel if desired.

**Sequential requirements**:
- Phase 2 must complete before Phase 3 (can't test before implementing)
- Phase 3 recommended before Phase 4 (manual testing before automated checks)

---

## Rollback Plan

If issues discovered after deployment:

### Immediate Rollback
```bash
git revert <commit-hash>
git push origin master
```

### Partial Rollback (per file)
```bash
git show <commit-hash>:index.html > index.html
# Repeat for other files if needed
```

**Rollback Time**: 5 minutes

---

## Notes

- **Low Risk**: Pure HTML change, no JavaScript or CSS dependencies
- **High Confidence**: Removed buttons have never been functional
- **User Impact**: Positive - removes confusing UI elements
- **Performance**: Negligible improvement (8 fewer DOM nodes)

---

**Tasks Status**: Draft
**Created**: 2025-11-03
**Ready for Implementation**: Yes ✅
