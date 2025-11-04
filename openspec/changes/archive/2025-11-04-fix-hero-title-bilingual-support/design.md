# Design: Fix Hero Title Bilingual Support

**Change ID**: `fix-hero-title-bilingual-support`
**Created**: 2025-11-04
**Status**: Proposed

---

## Architecture Decision Record

### Context

The hero title section on the homepage contains hard-coded Chinese text that does not update when users switch languages. This breaks the expectation of a fully bilingual site and is inconsistent with other dynamic content (critiques, critic names) that already support language switching.

**Current Implementation**:
```javascript
// js/gallery-hero.js:269-274
title.textContent = '潮汐的负形';
subtitle.textContent = '一场关于艺术评论的视角之旅';
```

**Problem**: Setting `textContent` replaces the entire content with a plain string, leaving no room for bilingual structure.

---

## Design Decisions

### Decision 1: Bilingual Structure Pattern

**Question**: How should we structure the bilingual hero title?

**Options Considered**:

#### A. Use `textContent` + `langchange` event listener
```javascript
// Listen to langchange event
document.addEventListener('langchange', (e) => {
  const lang = e.detail.lang;
  title.textContent = lang === 'zh' ? '潮汐的负形' : 'Negative Space of the Tide';
  subtitle.textContent = lang === 'zh' ? '一场关于艺术评论的视角之旅' : 'A Perspective Journey Through Art Critiques';
});
```

**Pros**:
- Simple logic
- No DOM complexity

**Cons**:
- Requires manual event handling
- JavaScript-dependent (no content if JS fails)
- Inconsistent with existing patterns (critiques, names use `<span lang="...">`)
- Does not leverage existing CSS `[data-lang]` selectors

#### B. Use `<span lang="...">` + CSS (SELECTED)
```javascript
const titleZh = document.createElement('span');
titleZh.lang = 'zh';
titleZh.textContent = '潮汐的负形';

const titleEn = document.createElement('span');
titleEn.lang = 'en';
titleEn.textContent = 'Negative Space of the Tide';

title.appendChild(titleZh);
title.appendChild(titleEn);
```

**Pros**:
- ✅ Consistent with existing patterns (lines 314-318, 506-510 in `gallery-hero.js`)
- ✅ Leverages existing CSS `[data-lang]` selectors (no new styles needed)
- ✅ Works with existing `langchange` event listener (lines 229-232)
- ✅ Progressive enhancement (both languages in DOM, CSS controls visibility)
- ✅ Semantic HTML (`lang` attribute aids accessibility)

**Cons**:
- Slightly more DOM nodes (2 extra `<span>` elements per text)

**Decision**: **Option B** - Use `<span lang="...">` structure

**Rationale**:
- This is the **established pattern** used throughout the codebase
- Minimal implementation effort (reuse existing logic)
- No need to modify CSS or event handling
- Better accessibility (screen readers can detect language)

---

### Decision 2: Translation Source

**Question**: Where should the English translations come from?

**Options Considered**:

#### A. Hard-code translations in JavaScript
```javascript
const translations = {
  title: { zh: '潮汐的负形', en: 'Negative Space of the Tide' },
  subtitle: { zh: '一场关于艺术评论的视角之旅', en: 'A Perspective Journey Through Art Critiques' }
};
```

**Pros**:
- Centralized translation data
- Easy to maintain

**Cons**:
- Adds complexity
- Requires new data structure

#### B. Inline translations in `renderHeroTitle()` (SELECTED)
```javascript
// Directly in the function
titleZh.textContent = '潮汐的负形';
titleEn.textContent = 'Negative Space of the Tide';
```

**Pros**:
- ✅ Simple and direct
- ✅ Consistent with existing code (e.g., lines 506-510 for critic names)
- ✅ No new data structures

**Cons**:
- Translations not centralized (but only 2 strings)

**Decision**: **Option B** - Inline translations

**Rationale**:
- These are **static, unchanging strings** (not dynamic data like artwork titles)
- Only 2 strings total, not worth creating a centralization system
- Matches the pattern used for other bilingual content in the same file

---

### Decision 3: Re-render Trigger

**Question**: How should the hero title update when language changes?

**Options Considered**:

#### A. Add specific `langchange` handler for title
```javascript
document.addEventListener('langchange', () => {
  renderHeroTitle(carousel);
});
```

**Pros**:
- Explicit control

**Cons**:
- Redundant (already have global re-render)

#### B. Use existing global `langchange` handler (SELECTED)
```javascript
// Already exists (lines 229-232):
document.addEventListener('langchange', () => {
  console.log('[Gallery Hero] Language changed, re-rendering...');
  render(carousel);  // ← This calls renderHeroTitle()
});
```

**Pros**:
- ✅ No additional code needed
- ✅ Ensures all content updates atomically
- ✅ Consistent with existing architecture

**Cons**:
- None

**Decision**: **Option B** - Use existing global handler

**Rationale**:
- The `render()` function already calls `renderHeroTitle()` (line 241)
- The existing `langchange` handler (lines 229-232) already triggers `render()`
- **No new code needed** - the fix will work automatically once we change the DOM structure

---

## Implementation Details

### Code Changes

**File**: `js/gallery-hero.js`
**Function**: `renderHeroTitle()` (lines 252-280)

**Before**:
```javascript
const title = document.createElement('h1');
title.className = 'hero-title';
title.lang = 'zh';
title.textContent = '潮汐的负形';

const subtitle = document.createElement('p');
subtitle.className = 'hero-subtitle';
subtitle.lang = 'zh';
subtitle.textContent = '一场关于艺术评论的视角之旅';
```

**After**:
```javascript
const title = document.createElement('h1');
title.className = 'hero-title';

// Bilingual title
const titleZh = document.createElement('span');
titleZh.lang = 'zh';
titleZh.textContent = '潮汐的负形';

const titleEn = document.createElement('span');
titleEn.lang = 'en';
titleEn.textContent = 'Negative Space of the Tide';

title.appendChild(titleZh);
title.appendChild(titleEn);

const subtitle = document.createElement('p');
subtitle.className = 'hero-subtitle';

// Bilingual subtitle
const subtitleZh = document.createElement('span');
subtitleZh.lang = 'zh';
subtitleZh.textContent = '一场关于艺术评论的视角之旅';

const subtitleEn = document.createElement('span');
subtitleEn.lang = 'en';
subtitleEn.textContent = 'A Perspective Journey Through Art Critiques';

subtitle.appendChild(subtitleZh);
subtitle.appendChild(subtitleEn);
```

### Generated DOM Structure

**Before**:
```html
<div class="hero-title-section">
  <h1 class="hero-title" lang="zh">潮汐的负形</h1>
  <p class="hero-subtitle" lang="zh">一场关于艺术评论的视角之旅</p>
</div>
```

**After**:
```html
<div class="hero-title-section">
  <h1 class="hero-title">
    <span lang="zh">潮汐的负形</span>
    <span lang="en">Negative Space of the Tide</span>
  </h1>
  <p class="hero-subtitle">
    <span lang="zh">一场关于艺术评论的视角之旅</span>
    <span lang="en">A Perspective Journey Through Art Critiques</span>
  </p>
</div>
```

### CSS Behavior

**Existing Styles** (no changes needed):
```css
/* main.css - Global language selector */
[data-lang="zh"] [lang="en"] {
  display: none;
}

[data-lang="en"] [lang="zh"] {
  display: none;
}
```

**Behavior**:
- When `<html data-lang="zh">`: Chinese spans visible, English spans hidden
- When `<html data-lang="en">`: English spans visible, Chinese spans hidden

---

## Event Flow

### Language Switch Sequence

```
User clicks language toggle button
    ↓
langToggle.addEventListener('click') fires (index.html:449)
    ↓
window.langManager.setLanguage(newLang, true)
    ↓
document.documentElement.setAttribute('data-lang', newLang)
    ↓
CSS rules update [data-lang] selectors
    ↓ (instant visual change)
document.dispatchEvent('langchange')
    ↓
Gallery Hero's langchange handler fires (gallery-hero.js:229)
    ↓
render(carousel) called
    ↓
renderHeroTitle(carousel) called (line 241)
    ↓
Hero title DOM rebuilt with bilingual structure
    ↓
CSS [data-lang] selectors hide inactive language
```

**Key Insight**: The CSS update happens **immediately** when `data-lang` attribute changes, so users see the switch before JavaScript re-renders. This prevents any visible flicker.

---

## Visual Regression Prevention

### Layout Considerations

**Potential Issue**: Adding `<span>` elements might break existing CSS assumptions.

**Mitigation**: Verify that `.hero-title` and `.hero-subtitle` styles do not rely on direct text nodes.

**Verification**:
```bash
rg "\.hero-title|\.hero-subtitle" styles/main.css
```

**Expected Result**: Styles should target the container elements, not their children, so adding `<span>` should not affect layout.

---

## Accessibility

### ARIA & Semantic HTML

**Current**:
```html
<h1 class="hero-title" lang="zh">潮汐的负形</h1>
```
- Single language attribute on parent

**Proposed**:
```html
<h1 class="hero-title">
  <span lang="zh">潮汐的负形</span>
  <span lang="en">Negative Space of the Tide</span>
</h1>
```
- Language attributes on each span
- Screen readers can detect language switching

**Benefits**:
- Better language pronunciation by screen readers
- Follows W3C i18n best practices
- No additional ARIA attributes needed

---

## Testing Strategy

### Manual Tests

1. **Visual Inspection**
   - Verify title displays in Chinese on page load
   - Verify title switches to English when toggling language
   - Verify no layout shifts or styling issues

2. **Browser DevTools**
   - Inspect DOM structure (should show both `<span lang="zh">` and `<span lang="en">`)
   - Check computed styles (inactive language should have `display: none`)
   - Verify no console errors

3. **Cross-Browser**
   - Test in Chrome, Firefox, Edge
   - Test in mobile Safari (iOS)

### Automated Tests

Not applicable - this is a visual/DOM change without API contracts.

---

## Rollback Plan

If issues arise:
1. Revert `js/gallery-hero.js` lines 252-280 to original version
2. Clear browser cache (`Ctrl+Shift+Delete`)
3. Verify site returns to previous behavior

**Rollback Complexity**: Low - single file, single function change.

---

## Performance Impact

**DOM Size**: +4 nodes (2 `<span>` per text × 2 texts)
**CSS Selector Matching**: Negligible (existing `[data-lang]` selector)
**Re-render Cost**: None (already re-renders on `langchange`)

**Conclusion**: Zero measurable performance impact.

---

## Future Enhancements

### Potential Improvements

1. **Fade Animation**: Add CSS transition when language switches
   ```css
   [lang] {
     transition: opacity 0.2s ease;
   }
   ```

2. **Translation API**: If more texts need translation, consider centralized i18n system

3. **Dynamic Titles**: If hero title becomes artwork-specific, move translations to `data.js`

**Note**: These are out of scope for this fix, which focuses on consistency with existing patterns.

---

## Summary

This design follows the **principle of least surprise**:
- Uses the **exact same pattern** as existing bilingual content
- Leverages **existing CSS and event handling**
- Requires **minimal code changes** (9 lines modified)
- **No new dependencies** or architectural changes

The fix is **low-risk, high-confidence**, and can be implemented in under 30 minutes.
