# Proposal: Fix Hero Title Bilingual Support

**Change ID**: `fix-hero-title-bilingual-support`
**Created**: 2025-11-04
**Status**: Proposed
**Priority**: High
**Effort**: 30 minutes

---

## Problem Statement

### What's Wrong

The main homepage (`index.html`) displays a hero title section with **hard-coded Chinese text** that does not support language switching:

```javascript
// js/gallery-hero.js:269-274
title.textContent = '潮汐的负形';
subtitle.textContent = '一场关于艺术评论的视角之旅';
```

**Impact**:
- When users click the language toggle button to switch to English, the hero title and subtitle **remain in Chinese**
- This breaks the user's expectation of a fully bilingual site
- Inconsistent with other parts of the page that do support bilingual switching (e.g., critique text, critic names)

### Where It Happens

- **File**: `js/gallery-hero.js`
- **Function**: `renderHeroTitle()` (lines 252-280)
- **Affected Elements**:
  - `.hero-title` - "潮汐的负形"
  - `.hero-subtitle` - "一场关于艺术评论的视角之旅"

### User Report

User stated:
> "我能看到主页面上依旧有内容在切换英语模式的时候没有被翻译。"
> (I can see that some content on the main page is still not translated when switching to English mode.)

**Additional Discovery**:
User also identified that visualization chart labels remain in Chinese:
> "Critic Dimension Distribution, Critic Comparison Matrix 这个里面的标签也是中文"
> (The labels inside Critic Dimension Distribution and Critic Comparison Matrix are also in Chinese)

**Note**: Chart labels are a separate issue and will be addressed in a follow-up proposal (`fix-chart-labels-bilingual-support`).

---

## Solution Overview

### What Changes

Convert the hero title from **hard-coded Chinese text** to a **bilingual `<span lang="...">` structure** that:
1. Displays both Chinese and English text in the DOM
2. Uses CSS `[data-lang]` selectors to show/hide the appropriate language
3. Responds to `langchange` events to update in real-time

### How It Works

**Before** (Current):
```javascript
title.textContent = '潮汐的负形';
subtitle.textContent = '一场关于艺术评论的视角之旅';
```

**After** (Proposed):
```javascript
// Title
const titleZh = document.createElement('span');
titleZh.lang = 'zh';
titleZh.textContent = '潮汐的负形';

const titleEn = document.createElement('span');
titleEn.lang = 'en';
titleEn.textContent = 'Negative Space of the Tide';

title.appendChild(titleZh);
title.appendChild(titleEn);

// Subtitle
const subtitleZh = document.createElement('span');
subtitleZh.lang = 'zh';
subtitleZh.textContent = '一场关于艺术评论的视角之旅';

const subtitleEn = document.createElement('span');
subtitleEn.lang = 'en';
subtitleEn.textContent = 'A Perspective Journey Through Art Critiques';

subtitle.appendChild(subtitleZh);
subtitle.appendChild(subtitleEn);
```

### Why This Approach

1. **Consistent with existing patterns** - Uses the same `<span lang="...">` structure as:
   - Critique text (lines 314-318, 506-510, 519-525 in `gallery-hero.js`)
   - Critic names and periods
   - Navigation menu items

2. **Leverages existing CSS** - No new styles needed, uses existing `[data-lang]` selectors:
   ```css
   [data-lang="zh"] [lang="en"] { display: none; }
   [data-lang="en"] [lang="zh"] { display: none; }
   ```

3. **Event-driven updates** - Already listens to `langchange` events (line 229-232), so title will update when language switches

4. **Minimal code changes** - Only affects the `renderHeroTitle()` function (9 lines modified)

---

## Scope & Impact

### Files Modified

1. **js/gallery-hero.js** (1 file)
   - Function: `renderHeroTitle()` (lines 252-280)
   - Estimated changes: +15 lines, -2 lines

### Affected Features

- ✅ Homepage hero section
- ✅ Language toggle functionality
- ❌ No impact on critiques panel
- ❌ No impact on artwork metadata
- ❌ No impact on navigation menu

### Risks

- **Low Risk** - This is a localized change to a single function
- **No breaking changes** - Does not affect data structures or API
- **Tested pattern** - Uses the same bilingual structure proven to work elsewhere

---

## Translation Accuracy

### Proposed English Translations

| Chinese | English | Source |
|---------|---------|--------|
| 潮汐的负形 | Negative Space of the Tide | Official project documentation (README.md, SPEC.md) |
| 一场关于艺术评论的视角之旅 | A Perspective Journey Through Art Critiques | Consistent with project theme |

**Note**: These translations are already used in other parts of the site (e.g., `about.html`), so we're maintaining consistency rather than creating new translations.

---

## Verification Plan

### Test Cases

1. **Initial Load**
   - Open `http://localhost:9999`
   - Verify hero title displays in Chinese by default
   - Verify hero subtitle displays in Chinese by default

2. **Language Toggle**
   - Click language toggle button (EN)
   - Verify hero title switches to "Negative Space of the Tide"
   - Verify hero subtitle switches to "A Perspective Journey Through Art Critiques"

3. **Toggle Back**
   - Click language toggle button (中)
   - Verify hero title switches back to "潮汐的负形"
   - Verify hero subtitle switches back to "一场关于艺术评论的视角之旅"

4. **Persistence**
   - Refresh page after switching to English
   - Verify hero title remains in English

5. **URL Parameter**
   - Navigate to `http://localhost:9999?lang=en`
   - Verify hero title displays in English on initial load

### Success Criteria

- [ ] Hero title and subtitle display both languages in DOM
- [ ] Only the active language is visible (CSS controlled)
- [ ] Language switch updates hero title instantly
- [ ] No console errors
- [ ] No layout shifts or visual glitches

---

## Dependencies

### Related Changes

- **Parent**: `implement-full-site-bilingual-support` (OpenSpec change)
- **Related**: Previous fixes for critic names, critique text, toggle buttons (completed in `BUG_FIX_REPORT_DYNAMIC_CONTENT.md`)

### External Dependencies

- None - uses existing `lang-manager.js` and CSS styles
- No new libraries or assets required

---

## Timeline

| Phase | Task | Duration |
|-------|------|----------|
| 1 | Modify `renderHeroTitle()` function | 10 min |
| 2 | Test in browser (all 5 test cases) | 10 min |
| 3 | Validate with OpenSpec | 5 min |
| 4 | Update documentation | 5 min |
| **Total** | | **30 min** |

---

## Open Questions

None - this is a straightforward implementation following an established pattern.

---

## Acceptance Criteria

- [ ] Hero title displays bilingual structure (`<span lang="zh">` + `<span lang="en">`)
- [ ] Hero subtitle displays bilingual structure
- [ ] Language toggle updates hero title/subtitle instantly
- [ ] No visual regressions (layout remains unchanged)
- [ ] Code follows existing patterns in `gallery-hero.js`
- [ ] OpenSpec validation passes (`openspec validate fix-hero-title-bilingual-support --strict`)
