# Specification: Hero Title Bilingual Support

**Capability**: `hero-title-bilingual`
**Change**: `fix-hero-title-bilingual-support`
**Status**: Proposed
**Priority**: High

---

## Overview

This specification defines the requirements for making the homepage hero title and subtitle support bilingual display (Chinese and English) with automatic language switching.

---

## ADDED Requirements

### Requirement: Hero Title SHALL Display Bilingual Structure

**ID**: `HT-BIL-001`
**Priority**: High

The hero title element SHALL contain both Chinese and English text using semantic `<span lang="...">` markup.

**Acceptance Criteria**:
- The `<h1 class="hero-title">` element contains two child `<span>` elements
- First `<span>` has `lang="zh"` attribute and contains "潮汐的负形"
- Second `<span>` has `lang="en"` attribute and contains "Negative Space of the Tide"
- Both spans are always present in the DOM (CSS controls visibility)

#### Scenario: Hero title renders with bilingual structure on page load

**Given** the user navigates to the homepage (`http://localhost:9999`)
**When** the page finishes loading
**Then** the DOM contains:
```html
<h1 class="hero-title">
  <span lang="zh">潮汐的负形</span>
  <span lang="en">Negative Space of the Tide</span>
</h1>
```
**And** the Chinese span is visible
**And** the English span is hidden (via CSS `display: none`)

**Verification**:
```javascript
// DOM Inspection
const title = document.querySelector('.hero-title');
const zhSpan = title.querySelector('[lang="zh"]');
const enSpan = title.querySelector('[lang="en"]');

console.assert(zhSpan.textContent === '潮汐的负形', 'Chinese text missing');
console.assert(enSpan.textContent === 'Negative Space of the Tide', 'English text missing');
console.assert(getComputedStyle(zhSpan).display !== 'none', 'Chinese not visible by default');
console.assert(getComputedStyle(enSpan).display === 'none', 'English should be hidden by default');
```

---

### Requirement: Hero Subtitle SHALL Display Bilingual Structure

**ID**: `HT-BIL-002`
**Priority**: High

The hero subtitle element SHALL contain both Chinese and English text using semantic `<span lang="...">` markup.

**Acceptance Criteria**:
- The `<p class="hero-subtitle">` element contains two child `<span>` elements
- First `<span>` has `lang="zh"` attribute and contains "一场关于艺术评论的视角之旅"
- Second `<span>` has `lang="en"` attribute and contains "A Perspective Journey Through Art Critiques"
- Both spans are always present in the DOM (CSS controls visibility)

#### Scenario: Hero subtitle renders with bilingual structure on page load

**Given** the user navigates to the homepage
**When** the page finishes loading
**Then** the DOM contains:
```html
<p class="hero-subtitle">
  <span lang="zh">一场关于艺术评论的视角之旅</span>
  <span lang="en">A Perspective Journey Through Art Critiques</span>
</p>
```
**And** the Chinese span is visible
**And** the English span is hidden (via CSS `display: none`)

**Verification**:
```javascript
const subtitle = document.querySelector('.hero-subtitle');
const zhSpan = subtitle.querySelector('[lang="zh"]');
const enSpan = subtitle.querySelector('[lang="en"]');

console.assert(zhSpan.textContent === '一场关于艺术评论的视角之旅', 'Chinese subtitle missing');
console.assert(enSpan.textContent === 'A Perspective Journey Through Art Critiques', 'English subtitle missing');
console.assert(getComputedStyle(zhSpan).display !== 'none', 'Chinese subtitle not visible by default');
console.assert(getComputedStyle(enSpan).display === 'none', 'English subtitle should be hidden by default');
```

---

### Requirement: Hero Title SHALL Switch Language on User Toggle

**ID**: `HT-BIL-003`
**Priority**: High

When the user clicks the language toggle button, the hero title and subtitle SHALL immediately switch to the selected language.

**Acceptance Criteria**:
- Clicking the language toggle updates the `data-lang` attribute on `<html>`
- CSS `[data-lang]` selectors hide the inactive language
- The switch happens instantly (no visible delay)
- No JavaScript errors occur during the switch

#### Scenario: Hero title switches from Chinese to English

**Given** the page is loaded with Chinese as the default language
**And** the hero title displays "潮汐的负形"
**When** the user clicks the language toggle button (#lang-toggle)
**Then** the `<html>` element's `data-lang` attribute changes to "en"
**And** the Chinese span becomes hidden (via CSS `display: none`)
**And** the English span becomes visible
**And** the hero title displays "Negative Space of the Tide"
**And** the hero subtitle displays "A Perspective Journey Through Art Critiques"

**Verification**:
```javascript
// Simulate language toggle
const langToggle = document.getElementById('lang-toggle');
langToggle.click();

// Wait for DOM update (use MutationObserver or setTimeout)
setTimeout(() => {
  const html = document.documentElement;
  console.assert(html.getAttribute('data-lang') === 'en', 'Language not switched to English');

  const title = document.querySelector('.hero-title');
  const zhSpan = title.querySelector('[lang="zh"]');
  const enSpan = title.querySelector('[lang="en"]');

  console.assert(getComputedStyle(zhSpan).display === 'none', 'Chinese should be hidden');
  console.assert(getComputedStyle(enSpan).display !== 'none', 'English should be visible');
}, 100);
```

---

### Requirement: Hero Title SHALL Switch Language Back to Chinese

**ID**: `HT-BIL-004`
**Priority**: High

When the user toggles the language back to Chinese, the hero title and subtitle SHALL return to Chinese display.

**Acceptance Criteria**:
- Clicking the language toggle again updates the `data-lang` attribute back to "zh"
- CSS `[data-lang]` selectors restore Chinese visibility
- No layout shifts or visual glitches occur

#### Scenario: Hero title switches from English back to Chinese

**Given** the page is in English mode (data-lang="en")
**And** the hero title displays "Negative Space of the Tide"
**When** the user clicks the language toggle button again
**Then** the `<html>` element's `data-lang` attribute changes to "zh"
**And** the English span becomes hidden
**And** the Chinese span becomes visible
**And** the hero title displays "潮汐的负形"
**And** the hero subtitle displays "一场关于艺术评论的视角之旅"

**Verification**:
```javascript
// Assuming already in English mode, toggle back
const langToggle = document.getElementById('lang-toggle');
langToggle.click();

setTimeout(() => {
  const html = document.documentElement;
  console.assert(html.getAttribute('data-lang') === 'zh', 'Language not switched back to Chinese');

  const title = document.querySelector('.hero-title');
  const zhSpan = title.querySelector('[lang="zh"]');
  const enSpan = title.querySelector('[lang="en"]');

  console.assert(getComputedStyle(zhSpan).display !== 'none', 'Chinese should be visible');
  console.assert(getComputedStyle(enSpan).display === 'none', 'English should be hidden');
}, 100);
```

---

### Requirement: Hero Title SHALL Persist Language Preference on Page Refresh

**ID**: `HT-BIL-005`
**Priority**: Medium

When the user switches to English and refreshes the page, the hero title SHALL display in English on page load.

**Acceptance Criteria**:
- Language preference is stored in `localStorage` (key: "preferred-lang")
- On page load, `lang-manager.js` reads `localStorage` and sets `data-lang` accordingly
- Hero title renders with correct language visible on initial render

#### Scenario: Hero title displays in English after page refresh

**Given** the user has switched to English (data-lang="en")
**And** `localStorage.getItem('preferred-lang')` returns "en"
**When** the user refreshes the page (F5 or Ctrl+R)
**Then** the page loads with `<html data-lang="en">`
**And** the hero title displays "Negative Space of the Tide"
**And** the hero subtitle displays "A Perspective Journey Through Art Critiques"

**Verification**:
```javascript
// Simulate page refresh by reloading
localStorage.setItem('preferred-lang', 'en');
window.location.reload();

// After reload (in DOMContentLoaded):
document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  console.assert(html.getAttribute('data-lang') === 'en', 'Language not restored from localStorage');

  const title = document.querySelector('.hero-title');
  const enSpan = title.querySelector('[lang="en"]');
  console.assert(getComputedStyle(enSpan).display !== 'none', 'English should be visible on reload');
});
```

---

### Requirement: Hero Title SHALL Respect URL Language Parameter

**ID**: `HT-BIL-006`
**Priority**: Low

When the user navigates to the homepage with a `?lang=en` URL parameter, the hero title SHALL display in English regardless of localStorage.

**Acceptance Criteria**:
- URL parameter `?lang=en` overrides localStorage
- Hero title renders in the URL-specified language
- Language toggle button reflects the active language

#### Scenario: Hero title displays in English from URL parameter

**Given** the user's localStorage has "zh" stored
**When** the user navigates to `http://localhost:9999?lang=en`
**Then** the page loads with `<html data-lang="en">`
**And** the hero title displays "Negative Space of the Tide"
**And** the language toggle button shows "中" (indicating it can switch to Chinese)

**Verification**:
```javascript
// Simulate URL navigation (manually test in browser)
// Navigate to: http://localhost:9999?lang=en

// Verify:
const html = document.documentElement;
console.assert(html.getAttribute('data-lang') === 'en', 'URL param not respected');

const title = document.querySelector('.hero-title');
const enSpan = title.querySelector('[lang="en"]');
console.assert(getComputedStyle(enSpan).display !== 'none', 'English should be visible from URL param');
```

---

## ADDED Requirements

None - this change modifies existing behavior without adding new features.

---

## REMOVED Requirements

None - no functionality is being removed.

---

## Dependencies

### Internal Dependencies

- **lang-manager.js**: Handles language switching and `langchange` event
- **main.css**: Contains `[data-lang]` CSS selectors for show/hide logic
- **gallery-hero.js**: `render()` function already listens to `langchange` event

### External Dependencies

None - uses only existing browser APIs (DOM, CSS).

---

## Validation

### OpenSpec Validation

Run the following command to validate this specification:
```bash
openspec validate fix-hero-title-bilingual-support --strict
```

### Manual Testing Checklist

- [ ] Hero title displays both Chinese and English in DOM (inspect with DevTools)
- [ ] Only Chinese is visible on initial page load (default language)
- [ ] Clicking language toggle switches title to English
- [ ] Clicking language toggle again switches title back to Chinese
- [ ] Refreshing page with English selected keeps title in English
- [ ] Navigating to `?lang=en` displays title in English
- [ ] No console errors during language switching
- [ ] No layout shifts or visual glitches

---

## Non-Functional Requirements

### Performance

- Language switch SHALL complete within 100ms
- No visible flicker during language transition

### Accessibility

- Hero title SHALL include `lang` attributes for screen reader pronunciation
- Language switching SHALL not disrupt keyboard navigation
- No ARIA labels needed (semantic HTML is sufficient)

### Cross-Browser Compatibility

- SHALL work in Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- SHALL work on mobile browsers (iOS Safari, Chrome Android)

---

## Acceptance Criteria Summary

| ID | Description | Status |
|----|-------------|--------|
| HT-BIL-001 | Hero title bilingual structure | ✅ Specified |
| HT-BIL-002 | Hero subtitle bilingual structure | ✅ Specified |
| HT-BIL-003 | Language switch to English | ✅ Specified |
| HT-BIL-004 | Language switch back to Chinese | ✅ Specified |
| HT-BIL-005 | Persist language preference | ✅ Specified |
| HT-BIL-006 | Respect URL language parameter | ✅ Specified |

---

## Notes

- English translations are taken from existing documentation (README.md, SPEC.md)
- This change aligns with the existing bilingual pattern used for critiques and critic names
- No new CSS styles are required (uses existing `[data-lang]` selectors)
