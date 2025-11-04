# Tasks: Fix Navigation Alignment and Text

**Change ID**: `fix-navigation-alignment-and-text`
**Created**: 2025-11-04
**Total Estimated Time**: 2 hours

---

## Task Phases

### Phase 1: CSS Layout Adjustment (30 minutes)

#### Task 1.1: Modify Navigation Positioning
**Estimate**: 15 minutes
**File**: `styles/components/unified-navigation.css`
**Dependencies**: None

**Objective**: Change `.artwork-navigation` from static to absolute positioning to float above image.

**Steps**:
1. Open `styles/components/unified-navigation.css`
2. Locate `.unified-navigation-wrapper` rule (currently line ~12-19)
3. Remove `gap: var(--spacing-md);` (this gap causes the offset)
4. Locate `.artwork-navigation` rule (currently line ~23-33)
5. Add positioning properties:
   ```css
   position: absolute;
   top: var(--spacing-md);
   left: var(--spacing-md);
   right: var(--spacing-md);
   ```
6. Verify `z-index: 10;` is present (should already exist)

**Success Criteria**:
- [ ] `.artwork-navigation` has `position: absolute`
- [ ] Navigation has `top`, `left`, `right` values
- [ ] `.unified-navigation-wrapper` has no `gap` property
- [ ] No syntax errors in CSS file

**Validation**:
```bash
# Open browser DevTools
# Inspect .artwork-navigation
# Verify computed style shows position: absolute
```

---

#### Task 1.2: Test Layout Alignment in Browser
**Estimate**: 15 minutes
**Dependencies**: Task 1.1
**Tools**: Playwright or manual browser testing

**Objective**: Verify image top aligns with critiques panel top.

**Steps**:
1. Run local server: `python -m http.server 9999`
2. Open `http://localhost:9999` in Chrome
3. Open DevTools → Elements
4. Inspect `.image-display-container` and `.critiques-panel`
5. Use "Select Element" tool to verify vertical alignment
6. Test on different viewports:
   - Mobile: 375px width
   - Tablet: 768px width
   - Desktop: 1440px width

**Success Criteria**:
- [ ] Image top edge aligns with critiques top edge (± 1px tolerance)
- [ ] Navigation floats above image (visible overlap)
- [ ] Navigation has semi-transparent background (readable over image)
- [ ] No layout shifts when switching artworks
- [ ] Alignment maintained on all 3 viewport sizes

**Validation**:
```javascript
// Run in browser console
const imageTop = document.querySelector('.image-display-container').getBoundingClientRect().top;
const critiqueTop = document.querySelector('.critiques-panel').getBoundingClientRect().top;
console.log(`Image top: ${imageTop}, Critique top: ${critiqueTop}, Diff: ${Math.abs(imageTop - critiqueTop)}px`);
// Diff should be <= 1px
```

---

### Phase 2: JavaScript Text Simplification (45 minutes)

#### Task 2.1: Remove Bilingual Button Text
**Estimate**: 15 minutes
**File**: `js/components/unified-navigation.js`
**Dependencies**: None

**Objective**: Simplify button HTML to English-only text (remove Chinese spans).

**Steps**:
1. Open `js/components/unified-navigation.js`
2. Locate **Previous Button HTML** (currently lines ~350-356)
   - **Current**:
     ```javascript
     prevButton.innerHTML = `
       <span class="button-icon" aria-hidden="true">◄</span>
       <span class="button-text">
         <span class="button-text-zh" lang="zh">上一件作品</span>
         <span class="button-text-en" lang="en">Previous Artwork</span>
       </span>
     `;
     ```
   - **Replace with**:
     ```javascript
     prevButton.innerHTML = `
       <span class="button-icon" aria-hidden="true">◄</span>
       <span class="button-text">Previous Artwork</span>
     `;
     ```

3. Locate **Next Button HTML** (currently lines ~384-390)
   - **Current**:
     ```javascript
     nextButton.innerHTML = `
       <span class="button-text">
         <span class="button-text-zh" lang="zh">下一件作品</span>
         <span class="button-text-en" lang="en">Next Artwork</span>
       </span>
       <span class="button-icon" aria-hidden="true">►</span>
     `;
     ```
   - **Replace with**:
     ```javascript
     nextButton.innerHTML = `
       <span class="button-text">Next Artwork</span>
       <span class="button-icon" aria-hidden="true">►</span>
     `;
     ```

**Success Criteria**:
- [ ] No `<span lang="zh">` elements in button HTML
- [ ] No `<span lang="en">` elements in button HTML
- [ ] Only single `<span class="button-text">` with English text
- [ ] Arrow icons (`◄` and `►`) preserved
- [ ] No JavaScript syntax errors

**Validation**:
```bash
# Verify no language spans in button generation
grep -n "lang=\"zh\"" js/components/unified-navigation.js
# Should return 0 matches in button sections (lines 350-390)
```

---

#### Task 2.2: Simplify Indicator Text (Remove Chinese Separator)
**Estimate**: 10 minutes
**File**: `js/components/unified-navigation.js`
**Dependencies**: None

**Objective**: Change indicator separator from Chinese "的" to English "of".

**Steps**:
1. Locate **Indicator HTML** (currently lines ~364-368)
   - **Current**:
     ```javascript
     indicator.innerHTML = `
       <span class="current-index" aria-current="page">${currentIndex + 1}</span>
       <span class="separator" lang="zh"> 的 </span>
       <span class="total-count">${artworkCount}</span>
     `;
     ```
   - **Replace with**:
     ```javascript
     indicator.innerHTML = `
       <span class="current-index" aria-current="page">${currentIndex + 1}</span>
       <span class="separator"> of </span>
       <span class="total-count">${artworkCount}</span>
     `;
     ```

2. Remove `lang="zh"` attribute from separator span
3. Change text content from ` 的 ` to ` of `

**Success Criteria**:
- [ ] Separator span has no `lang` attribute
- [ ] Separator text is " of " (with spaces)
- [ ] Indicator structure unchanged (still 3 spans)

**Validation**:
```bash
# Verify "of" separator exists
grep -n "separator.*of" js/components/unified-navigation.js
# Should match line ~366
```

---

#### Task 2.3: Verify ARIA Labels Remain Bilingual
**Estimate**: 10 minutes
**File**: `js/components/unified-navigation.js`
**Dependencies**: None

**Objective**: Confirm ARIA labels still include bilingual artwork titles (no changes needed).

**Steps**:
1. Locate **Previous Button ARIA Label** (lines ~343-347)
   ```javascript
   if (prevArtwork) {
     prevButton.setAttribute('aria-label', `Previous artwork: ${prevArtwork.titleZh || prevArtwork.titleEn}`);
   } else {
     prevButton.setAttribute('aria-label', 'Previous artwork');
     prevButton.disabled = !this.config.loop;
   }
   ```
   - **Verify**: No changes needed, already includes `titleZh`

2. Locate **Next Button ARIA Label** (lines ~377-381)
   ```javascript
   if (nextArtwork) {
     nextButton.setAttribute('aria-label', `Next artwork: ${nextArtwork.titleZh || nextArtwork.titleEn}`);
   } else {
     nextButton.setAttribute('aria-label', 'Next artwork');
     nextButton.disabled = !this.config.loop;
   }
   ```
   - **Verify**: No changes needed, already includes `titleZh`

**Success Criteria**:
- [ ] ARIA labels unchanged (still use `titleZh || titleEn`)
- [ ] No modifications to ARIA label generation logic
- [ ] Bilingual support preserved for screen readers

**Validation**:
```javascript
// Run in browser console after implementation
const prevBtn = document.querySelector('#unified-artwork-prev');
const ariaLabel = prevBtn.getAttribute('aria-label');
console.log(ariaLabel);
// Should show: "Previous artwork: [Chinese title] [English title]"
```

---

#### Task 2.4: Test Text Changes in Browser
**Estimate**: 10 minutes
**Dependencies**: Tasks 2.1, 2.2, 2.3
**Tools**: Local browser

**Objective**: Verify all navigation text displays in English only.

**Steps**:
1. Refresh `http://localhost:9999` in browser
2. Inspect navigation bar
3. Verify button text:
   - Previous: "◄ Previous Artwork"
   - Next: "Next Artwork ►"
4. Verify indicator text: "1 of 4"
5. Click "Next Artwork" → verify indicator updates to "2 of 4"
6. Continue to artwork-4 → verify "4 of 4"
7. Verify no Chinese characters visible in navigation

**Success Criteria**:
- [ ] Buttons display English text only
- [ ] Indicator displays "X of Y" format (not "X 的 Y")
- [ ] Indicator updates correctly on navigation
- [ ] No `[lang="zh"]` spans in DOM (inspect Elements panel)

**Validation**:
```javascript
// Run in browser console
const nav = document.querySelector('.artwork-navigation');
const zhSpans = nav.querySelectorAll('[lang="zh"]');
console.log(`Found ${zhSpans.length} Chinese spans (expected: 0)`);

const indicator = document.querySelector('.artwork-indicator');
console.log(`Indicator text: "${indicator.textContent.trim()}" (expected: "1 of 4")`);
```

---

### Phase 3: CSS Cleanup (15 minutes)

#### Task 3.1: Remove Unused Language Selector Styles
**Estimate**: 10 minutes
**File**: `styles/components/unified-navigation.css`
**Dependencies**: Tasks 2.1, 2.2

**Objective**: Delete CSS rules for `.button-text-zh` and `.button-text-en` (no longer used).

**Steps**:
1. Open `styles/components/unified-navigation.css`
2. Search for `.button-text-zh` and `.button-text-en` rules
3. Delete the following sections (if they exist):
   ```css
   .button-text-zh,
   .button-text-en {
     /* Language toggle styles */
   }

   [data-lang="zh"] .button-text-zh { display: inline; }
   [data-lang="zh"] .button-text-en { display: none; }
   [data-lang="en"] .button-text-zh { display: none; }
   [data-lang="en"] .button-text-en { display: inline; }
   ```
4. Save file

**Success Criteria**:
- [ ] No `.button-text-zh` or `.button-text-en` selectors in CSS
- [ ] No `[data-lang]` selectors targeting navigation buttons
- [ ] File has no syntax errors after cleanup

**Validation**:
```bash
# Verify no language-specific button styles remain
grep -n "button-text-zh\|button-text-en" styles/components/unified-navigation.css
# Should return 0 matches
```

---

#### Task 3.2: Verify No Broken Styles
**Estimate**: 5 minutes
**Dependencies**: Task 3.1
**Tools**: Browser DevTools

**Objective**: Ensure CSS cleanup didn't break button styling.

**Steps**:
1. Refresh browser (hard refresh: Ctrl+Shift+R)
2. Inspect navigation buttons
3. Verify styles applied correctly:
   - Font size, weight, color
   - Padding, border, border-radius
   - Hover/focus states
4. Click buttons to test interactions

**Success Criteria**:
- [ ] Buttons styled correctly (no missing styles)
- [ ] Hover effects work (background color change)
- [ ] Focus indicators visible (outline on Tab key)
- [ ] No console errors related to CSS

---

### Phase 4: Integration Testing (20 minutes)

#### Task 4.1: Comprehensive Alignment Test
**Estimate**: 10 minutes
**Dependencies**: All Phase 1-3 tasks
**Tools**: Playwright MCP or manual testing

**Objective**: Verify both alignment fix and text changes work together.

**Steps**:
1. Navigate to `http://localhost:9999`
2. Verify initial state (artwork-1):
   - Image aligns with critiques
   - Navigation shows "1 of 4"
   - Buttons show English text
3. Click "Next Artwork ►":
   - Verify alignment maintained
   - Indicator updates to "2 of 4"
4. Navigate to artwork-4:
   - Verify alignment maintained
   - Indicator shows "4 of 4"
   - Next button disabled
5. Test keyboard shortcuts:
   - Press Shift+→ (should go to next artwork)
   - Press Shift+← (should go to previous artwork)

**Success Criteria**:
- [ ] Alignment perfect on all artworks (1-4)
- [ ] Indicator always shows "X of Y" format
- [ ] Buttons always show English text
- [ ] Keyboard shortcuts work
- [ ] No visual glitches or layout shifts

**Validation Script**:
```javascript
// Automated test (run in browser console)
async function testNavigation() {
  for (let i = 0; i < 3; i++) {
    // Click next button
    document.querySelector('#unified-artwork-next').click();
    await new Promise(r => setTimeout(r, 500)); // Wait for animation

    // Check alignment
    const imageTop = document.querySelector('.image-display-container').getBoundingClientRect().top;
    const critiqueTop = document.querySelector('.critiques-panel').getBoundingClientRect().top;
    console.assert(Math.abs(imageTop - critiqueTop) <= 1, `Misaligned at artwork ${i+2}`);

    // Check indicator
    const indicator = document.querySelector('.artwork-indicator').textContent.trim();
    console.assert(indicator.includes(' of '), `Indicator format wrong: ${indicator}`);
  }
  console.log('✓ All navigation tests passed');
}
testNavigation();
```

---

#### Task 4.2: Responsive Design Test
**Estimate**: 10 minutes
**Dependencies**: Task 4.1
**Tools**: Browser DevTools responsive mode

**Objective**: Verify alignment and text work on all breakpoints.

**Steps**:
1. Open DevTools → Responsive Design Mode
2. Test Mobile (375px × 667px):
   - Verify navigation floats above image
   - Verify text readable (not truncated)
   - Verify touch targets >= 44px
3. Test Tablet (768px × 1024px):
   - Verify image/critiques side-by-side
   - Verify alignment perfect
4. Test Desktop (1440px × 900px):
   - Verify alignment perfect
   - Verify navigation centered

**Success Criteria**:
- [ ] Mobile: Navigation visible, no overflow
- [ ] Tablet: Alignment maintained
- [ ] Desktop: Alignment maintained
- [ ] All viewports: Text displays correctly

**Validation**:
```javascript
// Test at each viewport
function checkResponsive(width) {
  window.resizeTo(width, 900);
  const imageTop = document.querySelector('.image-display-container').getBoundingClientRect().top;
  const critiqueTop = document.querySelector('.critiques-panel').getBoundingClientRect().top;
  console.log(`${width}px: Image=${imageTop}, Critique=${critiqueTop}, Diff=${Math.abs(imageTop - critiqueTop)}`);
}
[375, 768, 1024, 1440].forEach(checkResponsive);
```

---

### Phase 5: Accessibility & Deployment (10 minutes)

#### Task 5.1: Accessibility Validation
**Estimate**: 5 minutes
**Dependencies**: All previous tasks
**Tools**: Browser DevTools Accessibility Inspector

**Objective**: Verify ARIA attributes and keyboard navigation.

**Steps**:
1. Open DevTools → Accessibility panel
2. Inspect navigation buttons:
   - Verify `aria-label` includes artwork titles
   - Verify `role="navigation"` on container
   - Verify `aria-current="page"` on current index
3. Test keyboard navigation:
   - Tab to navigation buttons (verify focus visible)
   - Press Shift+Arrow (verify artworks switch)
4. Test screen reader (optional, if NVDA/JAWS available):
   - Verify ARIA labels announced correctly

**Success Criteria**:
- [ ] All ARIA attributes present and correct
- [ ] Focus indicators visible
- [ ] Keyboard navigation works
- [ ] No accessibility violations in DevTools

**Validation**:
```javascript
// Check ARIA attributes
const nav = document.querySelector('.artwork-navigation');
console.log('Navigation role:', nav.getAttribute('role')); // Should be "navigation"

const prevBtn = document.querySelector('#unified-artwork-prev');
console.log('Prev ARIA:', prevBtn.getAttribute('aria-label')); // Should include Chinese + English title

const indicator = document.querySelector('.artwork-indicator .current-index');
console.log('Current indicator:', indicator.getAttribute('aria-current')); // Should be "page"
```

---

#### Task 5.2: Commit and Deploy
**Estimate**: 5 minutes
**Dependencies**: All validation tasks passed
**Tools**: Git

**Objective**: Commit changes and push to GitHub Pages.

**Steps**:
1. Stage modified files:
   ```bash
   git add styles/components/unified-navigation.css
   git add js/components/unified-navigation.js
   ```

2. Commit with descriptive message:
   ```bash
   git commit -m "fix: Align image with critiques and simplify navigation text

   - Float navigation above image using absolute positioning
   - Remove bilingual button text (English-only display)
   - Change indicator separator from '的' to 'of'
   - Preserve bilingual ARIA labels for accessibility

   OpenSpec: fix-navigation-alignment-and-text

   🤖 Generated with Claude Code
   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```

3. Push to GitHub:
   ```bash
   git push origin master
   ```

4. Wait 30 seconds for GitHub Pages deployment

5. Verify on production:
   ```bash
   # Open https://vulcaart.art
   # Verify alignment and text changes deployed
   ```

**Success Criteria**:
- [ ] Commit successful (no merge conflicts)
- [ ] Push successful
- [ ] Production site updated (https://vulcaart.art)
- [ ] All changes visible on live site

---

## Task Summary

| Phase | Tasks | Estimated Time | Dependencies |
|-------|-------|----------------|--------------|
| 1. CSS Layout | 2 tasks | 30 min | None |
| 2. JS Text | 4 tasks | 45 min | None |
| 3. CSS Cleanup | 2 tasks | 15 min | Phase 2 |
| 4. Integration | 2 tasks | 20 min | Phases 1-3 |
| 5. Deploy | 2 tasks | 10 min | Phase 4 |
| **Total** | **12 tasks** | **2 hours** | Sequential |

---

## Parallel Execution Opportunities

**Can Run in Parallel**:
- Phase 1 (CSS Layout) and Phase 2 (JS Text) are independent
  - Developer A: Tasks 1.1 - 1.2 (CSS alignment)
  - Developer B: Tasks 2.1 - 2.4 (JS text changes)
  - **Time Saved**: 15 minutes (45 min - 30 min)

**Must Run Sequentially**:
- Phase 3 (CSS Cleanup) depends on Phase 2 (needs to know which selectors are unused)
- Phase 4 (Integration Testing) depends on Phases 1-3 (needs all changes complete)
- Phase 5 (Deploy) depends on Phase 4 (needs validation passed)

**Optimized Timeline**: ~1.5 hours (if parallelized)

---

## Rollback Tasks (If Needed)

### Rollback Task R1: Revert CSS Changes
**Trigger**: Alignment causes issues or navigation occludes critical content
**Steps**:
```bash
git diff HEAD~1 styles/components/unified-navigation.css
git checkout HEAD~1 -- styles/components/unified-navigation.css
git commit -m "rollback: Revert navigation alignment changes"
git push
```

### Rollback Task R2: Revert JS Changes
**Trigger**: English-only text causes user confusion
**Steps**:
```bash
git checkout HEAD~1 -- js/components/unified-navigation.js
git commit -m "rollback: Restore bilingual navigation text"
git push
```

---

## Post-Deployment Monitoring

**Monitor for 24 hours**:
- [ ] User feedback on alignment (GitHub issues/email)
- [ ] Analytics: Bounce rate on gallery page (should not increase)
- [ ] Error logs: Check for JavaScript errors related to navigation
- [ ] Accessibility: Monitor any screen reader user reports

**Success Metrics**:
- Zero user complaints about alignment
- Zero JavaScript errors in production logs
- Navigation click-through rate maintained or improved
