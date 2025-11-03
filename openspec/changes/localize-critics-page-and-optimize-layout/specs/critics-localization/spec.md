# Spec: Critics Page Localization

## Overview

This specification defines requirements for localizing the critics.html page from English to Chinese, including biographies for all 6 critics, visual de-emphasis of English names, and layout optimizations.

**Target**: `pages/critics.html` + `js/critics-page.js` + `js/data.js` + `styles/main.css`

**Status**: ADDED (new localization capability)

---

## ADDED Requirements

### Requirement: System SHALL support Chinese biographies for all critic personas
Each persona object in `VULCA_DATA.personas` SHALL have a `bioZh` field containing Chinese biography text. The `bioZh` field SHALL be optional with fallback to `bio` if missing. Fictional personas (Mama Zola, Professor Petrova) SHALL include disclaimer text in their `bioZh` field. All Chinese text SHALL be encoded in UTF-8.

#### Scenario 1.1: Real Historical Critic Biography
```gherkin
Given a persona with id "su-shi"
When the data.js file is loaded
Then the persona SHALL have a bioZh field
And the bioZh text SHALL describe 苏轼's art theory in Chinese
And the bioZh text SHALL be approximately 300 characters
And the bioZh text SHALL mention "文人画", "诗画一律", and "以形写神"
```

#### Scenario 1.2: Fictional Persona with Disclaimer
```gherkin
Given a persona with id "mama-zola"
When the data.js file is loaded
Then the persona SHALL have a bioZh field
And the bioZh text SHALL end with "*注：此为AI创建的虚构角色，代表西非griot口述传统和集体诠释范式。*"
And the disclaimer SHALL be separated from biography text by a blank line
```

#### Scenario 1.3: Fallback to English Biography
```gherkin
Given a persona with only a bio field (no bioZh)
When the critics page renders the persona card
Then the system SHALL display the English bio text
And no error SHALL be logged to console
```

**Validation Code**:
```javascript
// Verify all 6 personas have bioZh
const personas = window.VULCA_DATA.personas;
const realCritics = personas.filter(p =>
  ['su-shi', 'guo-xi', 'john-ruskin', 'ai-ethics'].includes(p.id)
);
const fictionalCritics = personas.filter(p =>
  ['mama-zola', 'professor-petrova'].includes(p.id)
);

// Test REQ-1
realCritics.forEach(p => {
  console.assert(p.bioZh, `${p.id} missing bioZh`);
  console.assert(!p.bioZh.includes('*注：'), `${p.id} should not have fictional disclaimer`);
});

fictionalCritics.forEach(p => {
  console.assert(p.bioZh, `${p.id} missing bioZh`);
  console.assert(p.bioZh.includes('*注：此为AI创建的虚构角色'), `${p.id} missing fictional disclaimer`);
});
```

---

### Requirement: Critics page JavaScript SHALL prioritize Chinese biographies over English biographies
The `critics-page.js` file SHALL use `persona.bioZh || persona.bio` to select biography text. If `bioZh` exists, it SHALL be displayed instead of `bio`. If `bioZh` is missing or empty, `bio` SHALL be displayed as fallback. Biography text SHALL preserve line breaks and markdown formatting.

#### Scenario 2.1: Render Chinese Biography
```gherkin
Given a persona with both bioZh and bio fields
When the critics page renders the card
Then the displayed biography SHALL match the bioZh text
And the bio text SHALL NOT be displayed
```

#### Scenario 2.2: Biography Markdown Rendering
```gherkin
Given a bioZh text containing "*注：...*" (italic markdown)
When the biography is rendered
Then the text SHALL display in italic style
And the asterisks SHALL NOT be visible
```

**Validation Code**:
```javascript
// Test REQ-2: Check rendered biography source
const criticBios = document.querySelectorAll('.critic-bio');
criticBios.forEach((bioElement, index) => {
  const persona = window.VULCA_DATA.personas[index];
  const expectedText = persona.bioZh || persona.bio;
  console.assert(
    bioElement.textContent === expectedText,
    `Biography mismatch for ${persona.id}: expected ${expectedText.substring(0, 50)}...`
  );
});
```

---

### Requirement: English names SHALL be visually de-emphasized while remaining accessible
English name element SHALL be rendered as `<p>` (not `<h3>`). English name CSS class `.critic-name-en` SHALL apply smaller font size (0.9rem), gray color (#666), and italic font style. English name SHALL maintain at least 4.5:1 color contrast ratio (WCAG AA).

#### Scenario 3.1: English Name DOM Structure
```gherkin
Given the critics page is loaded
When I inspect a critic card
Then the English name SHALL be a <p> element
And the English name SHALL have class "critic-name-en"
And the English name SHALL NOT be a <h3> element
```

#### Scenario 3.2: English Name Visual Hierarchy
```gherkin
Given a critic card with Chinese name "苏轼" and English name "Su Shi"
When the card is rendered
Then the Chinese name SHALL be larger than the English name
And the Chinese name SHALL use black color
And the English name SHALL use gray color
And the English name SHALL be in italic style
```

**Validation Code**:
```javascript
// Test REQ-3: English name styling
const englishNames = document.querySelectorAll('.critic-name-en');
englishNames.forEach(nameEl => {
  console.assert(nameEl.tagName === 'P', `English name should be <p>, got <${nameEl.tagName}>`);

  const style = getComputedStyle(nameEl);
  console.assert(style.fontSize === '0.9rem' || parseFloat(style.fontSize) < 16, 'English name should be smaller');
  console.assert(style.fontStyle === 'italic', 'English name should be italic');
  console.assert(style.color === 'rgb(102, 102, 102)', 'English name should be gray (#666)');
});
```

---

### Requirement: Biography sections SHALL have improved readability through optimized spacing
The `.critic-bio` class SHALL have line-height of 1.7 and bottom margin of 1.5rem (separating from RPAIT grid). The `.critic-bio` SHALL use dark text color (#333) for readability. RPAIT bars SHALL have 0.75rem spacing between them. RPAIT grid SHALL have 1.5rem top margin (separating from biography).

#### Scenario 4.1: Biography Spacing
```gherkin
Given a critic card is rendered
When I measure the biography element
Then the line-height SHALL be 1.7 or greater
And the margin-bottom SHALL be 1.5rem or 24px
And there SHALL be visible whitespace between biography and RPAIT grid
```

#### Scenario 4.2: RPAIT Grid Spacing
```gherkin
Given a critic card with 5 RPAIT dimension bars
When the card is rendered
Then each bar SHALL have 0.75rem vertical spacing
And the grid SHALL have 1.5rem top margin
And no bars SHALL overlap or touch
```

**Validation Code**:
```javascript
// Test REQ-4: Layout spacing
const criticBios = document.querySelectorAll('.critic-bio');
criticBios.forEach(bio => {
  const style = getComputedStyle(bio);
  console.assert(parseFloat(style.lineHeight) >= parseFloat(style.fontSize) * 1.7, 'Line height should be 1.7');
  console.assert(parseFloat(style.marginBottom) >= 20, 'Biography margin-bottom should be 1.5rem');
});

const rpaitBars = document.querySelectorAll('.rpait-bar');
rpaitBars.forEach(bar => {
  const style = getComputedStyle(bar);
  console.assert(parseFloat(style.marginBottom) >= 10, 'RPAIT bars should have spacing');
});
```

---

### Requirement: All files containing Chinese text SHALL be saved with UTF-8 encoding
The `js/data.js` file SHALL be saved as UTF-8 without BOM. Chinese characters SHALL render correctly in all modern browsers. No mojibake (乱码) SHALL occur when viewing the page. Console SHALL NOT show encoding-related warnings.

#### Scenario 5.1: Chinese Text Rendering
```gherkin
Given the critics page is loaded in Chrome/Firefox/Safari
When I view a critic biography with Chinese text
Then all characters SHALL display correctly
And punctuation marks (、。！) SHALL render properly
And no boxes or question marks SHALL appear
```

#### Scenario 5.2: File Encoding Validation
```gherkin
Given data.js is opened in a text editor
When I check the file encoding
Then it SHALL be UTF-8
And it SHALL NOT have BOM (Byte Order Mark)
```

**Validation Code**:
```bash
# Test REQ-5: Check file encoding
file -i js/data.js | grep -q "charset=utf-8" && echo "✓ UTF-8 encoding verified"

# Check for BOM
hexdump -n 3 -C js/data.js | grep -q "ef bb bf" && echo "⚠ BOM detected" || echo "✓ No BOM"
```

---

## Dependencies

**None** - This is a standalone localization and styling change.

**No breaking changes**: Fallback mechanism ensures English biographies continue to work.

---

## Testing Matrix

| Browser | Version | Test Status |
|---------|---------|-------------|
| Chrome  | 90+     | [ ] Passed  |
| Firefox | 88+     | [ ] Passed  |
| Safari  | 14+     | [ ] Passed  |
| Edge    | 90+     | [ ] Passed  |

| Device Width | Layout Test | Chinese Text | RPAIT Grid |
|--------------|-------------|--------------|------------|
| 375px (mobile) | [ ] Passed | [ ] Passed | [ ] Passed |
| 768px (tablet) | [ ] Passed | [ ] Passed | [ ] Passed |
| 1440px (desktop) | [ ] Passed | [ ] Passed | [ ] Passed |

---

## Validation Checklist

Before marking this spec as complete:

- [ ] All 6 personas have `bioZh` field in data.js
- [ ] Fictional personas (2) have disclaimer text
- [ ] critics-page.js uses `bioZh || bio` fallback logic
- [ ] English name element changed from `<h3>` to `<p>`
- [ ] `.critic-name-en` CSS rule added with correct styling
- [ ] Biography line-height set to 1.7
- [ ] RPAIT grid spacing adjusted
- [ ] UTF-8 encoding verified for data.js
- [ ] All 6 biographies display correctly on critics.html
- [ ] Fictional disclaimers appear in italic style
- [ ] English names visually de-emphasized
- [ ] Layout responsive at 375px, 768px, 1440px
- [ ] Cross-browser testing completed (Chrome, Firefox, Safari)
- [ ] No console errors or warnings
- [ ] Color contrast meets WCAG AA (4.5:1 minimum)

---

**Spec Status**: Complete
**Created**: 2025-11-03
**Requirements**: 5 ADDED
**Scenarios**: 11 total
