# Spec: Full-Site Bilingual Content Support

**Feature**: bilingual-content
**Change ID**: implement-full-site-bilingual-support
**Created**: 2025-11-03

---

## ADDED Requirements

### Requirement 1: HTML Static Content MUST Support Bilingual Marking

**Description**: All static content in HTML files SHALL be marked with `lang` attributes to support both Chinese and English languages.

**Pattern**:
```html
<element>
  <span lang="zh">中文内容</span>
  <span lang="en">English Content</span>
</element>
```

**Scope**:
- index.html: UI text, error messages, loading states
- pages/about.html: All headings, paragraphs, lists (~800 words)
- pages/critics.html: Page headings, descriptions (~300 words)
- pages/process.html: All content including 7 development steps (~1000 words)

**Acceptance Criteria**:
- [ ] Every user-visible text element contains both `lang="zh"` and `lang="en"` versions
- [ ] `lang` attributes are properly nested within semantic HTML elements
- [ ] No hardcoded Chinese-only text remains (except in `lang="zh"` spans)

#### Scenario 1.1: about.html Page Header Bilingual Marking

**Given**: User visits `/pages/about.html`

**When**: Page loads

**Then**:
- Page title SHALL display as `<h1><span lang="zh">关于VULCA</span><span lang="en">About VULCA</span></h1>`
- Subtitle SHALL display as `<p class="subtitle"><span lang="zh">AI艺术评论实验系统</span><span lang="en">AI-Powered Art Criticism Experimental System</span></p>`
- Both versions SHALL be present in DOM
- Only active language version SHALL be visible (controlled by CSS)

**Verification**:
```javascript
const h1 = document.querySelector('.page-header h1');
const zhSpan = h1.querySelector('[lang="zh"]');
const enSpan = h1.querySelector('[lang="en"]');

assert(zhSpan.textContent === '关于VULCA');
assert(enSpan.textContent === 'About VULCA');
assert(h1.children.length === 2);
```

#### Scenario 1.2: RPAIT Framework Section Bilingual Content

**Given**: User is on `/pages/about.html`

**When**: Viewing the RPAIT framework section

**Then**:
- Section heading SHALL contain: `<h2><span lang="zh">RPAIT 评论框架</span><span lang="en">RPAIT Critique Framework</span></h2>`
- Each of 5 framework cards (R/P/A/I/T) SHALL contain:
  - Bilingual heading (e.g., `<h3><span lang="zh">R - 代表性</span><span lang="en">R - Representation</span></h3>`)
  - Bilingual description paragraph
- All terminology SHALL match `TRANSLATION_GLOSSARY.md`

**Verification**:
```javascript
const frameworkCards = document.querySelectorAll('.framework-card');
assert(frameworkCards.length === 5);

frameworkCards.forEach(card => {
  const h3 = card.querySelector('h3');
  const zhSpan = h3.querySelector('[lang="zh"]');
  const enSpan = h3.querySelector('[lang="en"]');

  assert(zhSpan !== null);
  assert(enSpan !== null);
  assert(enSpan.textContent.length > 0);
});
```

#### Scenario 1.3: process.html Development Steps Bilingual Content

**Given**: User visits `/pages/process.html`

**When**: Viewing the 7 development steps

**Then**:
- Each step heading SHALL be bilingual (e.g., `<h2><span lang="zh">1. 研究设计</span><span lang="en">1. Research Design</span></h2>`)
- Each step description paragraph SHALL be bilingual
- List items SHALL be bilingual
- Total of ~1000 words in English SHALL be added

**Verification**:
```javascript
const stepHeadings = document.querySelectorAll('.content-section h2');
assert(stepHeadings.length >= 7);

stepHeadings.forEach(heading => {
  const zhSpan = heading.querySelector('[lang="zh"]');
  const enSpan = heading.querySelector('[lang="en"]');

  assert(zhSpan !== null);
  assert(enSpan !== null);
  // Verify both languages contain meaningful content
  assert(zhSpan.textContent.trim().length > 0);
  assert(enSpan.textContent.trim().length > 0);
});
```

---

### Requirement 2: CSS Language Switching Rules MUST Hide Inactive Language

**Description**: CSS SHALL use `[data-lang]` attribute selectors to show only the active language and hide the inactive language.

**Implementation**:
```css
/* Hide English when Chinese is active */
[data-lang="zh"] [lang="en"] {
  display: none;
}

/* Hide Chinese when English is active */
[data-lang="en"] [lang="zh"] {
  display: none;
}

/* Show active language inline */
[data-lang="zh"] [lang="zh"],
[data-lang="en"] [lang="en"] {
  display: inline;
}
```

**Acceptance Criteria**:
- [ ] CSS rules apply to all `[lang]` elements globally
- [ ] No FOUC (Flash of Unstyled Content) when switching languages
- [ ] Inline elements remain inline, block elements remain block

#### Scenario 2.1: Language Visibility Toggle

**Given**: Page has bilingual content with `<span lang="zh">中文</span><span lang="en">English</span>`

**When**: `document.documentElement.setAttribute('data-lang', 'en')`

**Then**:
- Element with `lang="zh"` SHALL have `display: none` (computed style)
- Element with `lang="en"` SHALL have `display: inline` (computed style)
- Content layout SHALL NOT shift or break

**Verification**:
```javascript
document.documentElement.setAttribute('data-lang', 'en');

const zhSpan = document.querySelector('[lang="zh"]');
const enSpan = document.querySelector('[lang="en"]');

const zhStyle = window.getComputedStyle(zhSpan);
const enStyle = window.getComputedStyle(enSpan);

assert(zhStyle.display === 'none');
assert(enStyle.display === 'inline');
```

#### Scenario 2.2: No FOUC on Page Load

**Given**: User visits page with `?lang=en` URL parameter

**When**: Page loads

**Then**:
- `data-lang="en"` SHALL be set BEFORE first paint
- Chinese content SHALL NEVER be visible
- Only English content SHALL be visible from the start

**Verification**:
```javascript
// In <head>, before any body content
(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const lang = urlParams.get('lang') ||
               localStorage.getItem('preferred-lang') ||
               'zh';
  document.documentElement.setAttribute('data-lang', lang);
})();
```

---

### Requirement 3: Navigation Menu MUST Support Dynamic Language Switching

**Description**: Navigation menu items SHALL update dynamically when language changes, using JavaScript i18n rather than HTML marking.

**Implementation**:
```javascript
// js/navigation-i18n.js
const NAV_I18N = {
  'menu-home': { zh: '主画廊', en: 'Gallery' },
  'menu-critics': { zh: '评论家', en: 'Critics' },
  'menu-about': { zh: '关于', en: 'About' },
  'menu-process': { zh: '过程', en: 'Process' }
};

function updateMenuLanguage(lang) {
  Object.keys(NAV_I18N).forEach(key => {
    const element = document.querySelector(`.${key} .menu-label`);
    if (element) {
      element.textContent = NAV_I18N[key][lang];
    }
  });
}
```

**Acceptance Criteria**:
- [ ] All 4 menu items update correctly when language changes
- [ ] Menu update happens within 10ms of language change
- [ ] No DOM structure changes (only textContent update)

#### Scenario 3.1: Menu Updates on Language Toggle

**Given**: User is viewing the site in Chinese (`data-lang="zh"`)

**When**: User clicks language toggle button

**Then**:
- `data-lang` SHALL change to "en"
- Menu item ".menu-home .menu-label" SHALL change from "主画廊" to "Gallery"
- Menu item ".menu-critics .menu-label" SHALL change from "评论家" to "Critics"
- Menu item ".menu-about .menu-label" SHALL change from "关于" to "About"
- Menu item ".menu-process .menu-label" SHALL change from "过程" to "Process"
- Update SHALL complete within 10ms

**Verification**:
```javascript
const langToggle = document.getElementById('lang-toggle');
const menuHome = document.querySelector('.menu-home .menu-label');

const startTime = performance.now();
langToggle.click();

// Wait for next frame
requestAnimationFrame(() => {
  const endTime = performance.now();
  const duration = endTime - startTime;

  assert(document.documentElement.getAttribute('data-lang') === 'en');
  assert(menuHome.textContent === 'Gallery');
  assert(duration < 10); // 10ms threshold
});
```

#### Scenario 3.2: Menu Initialized with Correct Language on Page Load

**Given**: User visits site with `?lang=en` URL parameter

**When**: Page loads and navigation.js initializes

**Then**:
- Menu items SHALL display in English immediately
- No flash of Chinese text SHALL occur
- `updateMenuLanguage('en')` SHALL be called during initialization

**Verification**:
```javascript
// navigation.js initialization
document.addEventListener('DOMContentLoaded', () => {
  const lang = document.documentElement.getAttribute('data-lang');
  updateMenuLanguage(lang);
});
```

---

### Requirement 4: URL Language Parameter SHALL Override User Preferences

**Description**: When URL contains `?lang=en` or `?lang=zh` parameter, it SHALL take precedence over localStorage preferences.

**Priority Logic**: URL parameter > localStorage > Default ('zh')

**Acceptance Criteria**:
- [ ] `?lang=en` displays English content, regardless of localStorage
- [ ] `?lang=zh` displays Chinese content, regardless of localStorage
- [ ] Invalid lang values (e.g., `?lang=fr`) SHALL be ignored
- [ ] URL parameter SHALL NOT update localStorage (to preserve user preference)

#### Scenario 4.1: URL Parameter Overrides localStorage Preference

**Given**:
- User has `localStorage.setItem('preferred-lang', 'zh')`
- User clicks a shared link: `https://vulcaart.art/pages/about.html?lang=en`

**When**: Page loads

**Then**:
- `data-lang` SHALL be set to "en" (from URL)
- English content SHALL be displayed
- localStorage SHALL still contain "zh" (NOT updated)

**Verification**:
```javascript
// Mock localStorage
localStorage.setItem('preferred-lang', 'zh');

// Simulate URL parameter
const url = new URL('https://vulcaart.art/pages/about.html?lang=en');
window.history.pushState({}, '', url);

// Initialize language manager
const langManager = new LanguageManager();
const lang = langManager.getCurrentLanguage();

assert(lang === 'en'); // URL parameter wins
assert(localStorage.getItem('preferred-lang') === 'zh'); // Not updated
```

#### Scenario 4.2: Invalid URL Parameter Ignored

**Given**: User visits `https://vulcaart.art/?lang=invalid`

**When**: Page loads

**Then**:
- Invalid parameter SHALL be ignored
- Language SHALL fall back to localStorage or default ('zh')
- No error SHALL be thrown

**Verification**:
```javascript
const url = new URL('https://vulcaart.art/?lang=invalid');
const urlParams = new URLSearchParams(url.search);
const urlLang = urlParams.get('lang');

// Whitelist validation
const validLangs = ['zh', 'en'];
const isValid = validLangs.includes(urlLang);

assert(isValid === false);

// Should fall back
const fallbackLang = localStorage.getItem('preferred-lang') || 'zh';
assert(['zh', 'en'].includes(fallbackLang));
```

---

### Requirement 5: Meta Tags MUST Update Dynamically on Language Change

**Description**: SEO-related meta tags (`description`, `og:description`, `og:title`) SHALL be updated when language changes to reflect the active language content.

**Acceptance Criteria**:
- [ ] Meta tags update within 10ms of language change
- [ ] Translations are page-specific (about.html, critics.html, process.html)
- [ ] Updates use `setAttribute('content', ...)` not `innerHTML`

#### Scenario 5.1: Meta Description Updates on Language Toggle

**Given**: User is on `/pages/about.html` with `data-lang="zh"`

**When**: User switches to English

**Then**:
- `<meta name="description">` content SHALL change from Chinese to English
- `<meta property="og:description">` content SHALL change from Chinese to English
- New content SHALL match English translation for about.html

**Verification**:
```javascript
// Initial state
const descMeta = document.querySelector('meta[name="description"]');
const initialDesc = descMeta.getAttribute('content');
assert(initialDesc.includes('VULCA') && initialDesc.includes('艺术'));

// Switch language
document.documentElement.setAttribute('data-lang', 'en');
updateMetaTags('en');

// Verify update
const newDesc = descMeta.getAttribute('content');
assert(newDesc.includes('VULCA') && newDesc.includes('AI-powered'));
assert(!newDesc.includes('艺术')); // No Chinese characters
```

#### Scenario 5.2: Page-Specific Meta Content

**Given**: Three pages with different meta descriptions:
- about.html: "关于VULCA - AI艺术评论实验系统..."
- critics.html: "VULCA艺术评论家简介..."
- process.html: "VULCA系统开发过程..."

**When**: Language switches to English on each page

**Then**:
- about.html SHALL use: "About VULCA - AI-powered art criticism system..."
- critics.html SHALL use: "VULCA Art Critics - Discover how..."
- process.html SHALL use: "VULCA Development Process - Complete workflow..."
- Each page SHALL have unique English meta description

**Verification**:
```javascript
const META_I18N = {
  'description': {
    '/pages/about.html': {
      zh: '关于VULCA - AI艺术评论实验系统...',
      en: 'About VULCA - AI-powered art criticism system...'
    },
    '/pages/critics.html': {
      zh: 'VULCA艺术评论家简介...',
      en: 'VULCA Art Critics - Discover how...'
    }
    // ...
  }
};

function updateMetaTags(lang) {
  const path = window.location.pathname;
  const descMeta = document.querySelector('meta[name="description"]');

  if (META_I18N.description[path]) {
    descMeta.setAttribute('content', META_I18N.description[path][lang]);
  }
}
```

---

### Requirement 6: Translation Quality MUST Meet Academic Standards

**Description**: All English translations SHALL meet academic writing standards with accurate terminology, fluent language, and complete semantic preservation.

**Quality Criteria**:
- **Accuracy**: Correctly conveys original meaning without omissions or distortions
- **Fluency**: Reads naturally in academic English, not literal translation
- **Terminology**: Uses standardized academic terms (from `TRANSLATION_GLOSSARY.md`)
- **Completeness**: Preserves all semantic information from Chinese original
- **Consistency**: Same terms translated consistently across all pages

**Acceptance Criteria**:
- [ ] All translations reviewed by human editor
- [ ] Translation glossary established for key terms
- [ ] Grammar error rate < 0.5% (< 1 error per 200 words)
- [ ] Terminology consistency rate > 95%

#### Scenario 6.1: RPAIT Term Consistency Across Pages

**Given**: RPAIT framework appears in multiple pages:
- about.html: Full framework explanation
- critics.html: Brief dimension list
- process.html: Evaluation criteria description

**When**: All pages are translated to English

**Then**:
- "代表性" SHALL always translate to "Representation"
- "哲学性" SHALL always translate to "Philosophicality"
- "美学性" SHALL always translate to "Aesthetics"
- "诠释性" SHALL always translate to "Interpretability"
- "技巧性" SHALL always translate to "Technicality"
- No alternative translations SHALL be used

**Verification**:
```javascript
// Grep all English spans for RPAIT terms
const allEnSpans = document.querySelectorAll('[lang="en"]');
const rpaitTerms = {
  'Representation': 0,
  'Philosophicality': 0,
  'Aesthetics': 0,
  'Interpretability': 0,
  'Technicality': 0
};

allEnSpans.forEach(span => {
  Object.keys(rpaitTerms).forEach(term => {
    if (span.textContent.includes(term)) {
      rpaitTerms[term]++;
    }
  });
});

// Verify each term appears consistently (no alternatives)
assert(rpaitTerms['Representation'] >= 3); // Appears on multiple pages
// No 'Representativeness' or other variants
```

#### Scenario 6.2: Academic Writing Style Verification

**Given**: English translation of about.html research objectives section

**When**: Human reviewer checks writing quality

**Then**:
- Language SHALL be formal and academic (not conversational)
- Sentences SHALL be well-structured with proper transitions
- Technical terms SHALL be used correctly
- No grammatical errors SHALL be present
- Register SHALL match Chinese original (equally formal)

**Review Checklist**:
```markdown
[ ] Formal academic tone maintained
[ ] No colloquialisms or informal expressions
[ ] Technical terms accurate (RPAIT, griot, defamiliarization, etc.)
[ ] Sentence structure varies appropriately
[ ] Transitions between ideas are clear
[ ] No run-on sentences or fragments
[ ] Verb tenses consistent
[ ] Active/passive voice used appropriately
```

---

### Requirement 7: Language Preference SHALL Persist Across Sessions

**Description**: When user manually changes language (clicks toggle button), their preference SHALL be saved to localStorage and restored on future visits.

**Behavior**:
- Manual language change → Update localStorage
- URL parameter visit → Do NOT update localStorage
- New session → Restore from localStorage (if no URL parameter)

**Acceptance Criteria**:
- [ ] `localStorage.setItem('preferred-lang', lang)` called on manual toggle
- [ ] `localStorage.getItem('preferred-lang')` used on page load
- [ ] Preference persists across browser sessions
- [ ] Preference persists across different pages

#### Scenario 7.1: Manual Toggle Saves to localStorage

**Given**: User visits site (default: Chinese)

**When**:
1. User clicks language toggle button
2. Language changes to English

**Then**:
- `localStorage.getItem('preferred-lang')` SHALL return "en"
- On next visit (no URL parameter), site SHALL load in English
- Preference SHALL persist after browser restart

**Verification**:
```javascript
// Initial state
assert(localStorage.getItem('preferred-lang') === null ||
       localStorage.getItem('preferred-lang') === 'zh');

// Click toggle
const langToggle = document.getElementById('lang-toggle');
langToggle.click();

// Verify localStorage updated
assert(localStorage.getItem('preferred-lang') === 'en');

// Simulate new session
window.location.reload();

// Verify language restored
assert(document.documentElement.getAttribute('data-lang') === 'en');
```

#### Scenario 7.2: URL Parameter Does NOT Overwrite localStorage

**Given**:
- User has `localStorage.setItem('preferred-lang', 'en')`
- User clicks shared Chinese link: `?lang=zh`

**When**: Page loads with `?lang=zh`

**Then**:
- Page SHALL display in Chinese (URL parameter takes effect)
- `localStorage.getItem('preferred-lang')` SHALL still return "en" (NOT overwritten)
- After removing URL parameter, language SHALL revert to English (localStorage)

**Verification**:
```javascript
// Setup
localStorage.setItem('preferred-lang', 'en');

// Visit with URL parameter
const url = new URL('https://vulcaart.art/?lang=zh');
window.history.pushState({}, '', url);

// Initialize
const langManager = new LanguageManager();
langManager.initialize();

// Verify language from URL
assert(document.documentElement.getAttribute('data-lang') === 'zh');

// Verify localStorage NOT changed
assert(localStorage.getItem('preferred-lang') === 'en');

// Remove URL parameter
const cleanUrl = new URL('https://vulcaart.art/');
window.history.pushState({}, '', cleanUrl);
window.location.reload();

// Verify fallback to localStorage
assert(document.documentElement.getAttribute('data-lang') === 'en');
```

---

### Requirement 8: Translation Glossary MUST Be Maintained

**Description**: A `TRANSLATION_GLOSSARY.md` file SHALL document all standardized term translations to ensure consistency across the project.

**Format**:
```markdown
| 中文术语 | 英文翻译 | 首次出现 | 备注 |
|---------|---------|---------|------|
| RPAIT框架 | RPAIT Framework | about.html | 不翻译缩写 |
| griot传统 | griot tradition | about.html | 不翻译griot |
```

**Acceptance Criteria**:
- [ ] Glossary contains all specialized terms (≥15 entries)
- [ ] Each entry includes: Chinese, English, first appearance, notes
- [ ] Glossary is referenced during translation review
- [ ] New terms are added to glossary before use

#### Scenario 8.1: Glossary Covers All Specialized Terms

**Given**: Translation work on all 3 pages (about, critics, process)

**When**: Translator encounters specialized term

**Then**:
- Term SHALL be looked up in `TRANSLATION_GLOSSARY.md`
- If found, standardized translation SHALL be used
- If not found, term SHALL be added to glossary before first use

**Glossary Completeness Check**:
```markdown
Required terms:
[ ] RPAIT (acronym - not translated)
[ ] 代表性 → Representation
[ ] 哲学性 → Philosophicality
[ ] 美学性 → Aesthetics
[ ] 诠释性 → Interpretability
[ ] 技巧性 → Technicality
[ ] griot传统 → griot tradition
[ ] 陌生化 → defamiliarization
[ ] 文人画 → literati painting
[ ] 三远法 → Three Distances
[ ] 跨时代艺术评论 → cross-temporal art criticism
[ ] AI评论家角色 → AI critic persona
[ ] 虚构角色 → fictional persona
[ ] 真实历史人物 → real historical figure
[ ] 评论生成管道 → critique generation pipeline
```

#### Scenario 8.2: Glossary Usage in Translation Review

**Given**: Human reviewer is checking English translation quality

**When**: Reviewer encounters technical term in English text

**Then**:
- Reviewer SHALL cross-reference `TRANSLATION_GLOSSARY.md`
- If translation matches glossary → Approve
- If translation differs → Flag as inconsistency error
- Consistency rate SHALL be > 95%

**Review Process**:
```javascript
// Pseudo-code for automated consistency check
function checkTermConsistency(text, glossary) {
  const errors = [];

  glossary.forEach(entry => {
    const chineseTerm = entry.chinese;
    const standardEnglish = entry.english;

    // Find all translations of this Chinese term
    const translations = extractTranslations(text, chineseTerm);

    translations.forEach(trans => {
      if (trans !== standardEnglish) {
        errors.push({
          term: chineseTerm,
          found: trans,
          expected: standardEnglish
        });
      }
    });
  });

  return errors;
}
```

---

## MODIFIED Requirements

_No existing requirements are modified by this change._

---

## REMOVED Requirements

_No existing requirements are removed by this change._

---

## Validation

### Automated Tests

**CSS Language Switching**:
```javascript
describe('CSS Language Switching', () => {
  it('should hide English content when Chinese is active', () => {
    document.documentElement.setAttribute('data-lang', 'zh');
    const enSpan = document.querySelector('[lang="en"]');
    expect(window.getComputedStyle(enSpan).display).toBe('none');
  });

  it('should hide Chinese content when English is active', () => {
    document.documentElement.setAttribute('data-lang', 'en');
    const zhSpan = document.querySelector('[lang="zh"]');
    expect(window.getComputedStyle(zhSpan).display).toBe('none');
  });
});
```

**Language Manager**:
```javascript
describe('LanguageManager', () => {
  it('should prioritize URL over localStorage', () => {
    // Test Scenario 4.1
  });

  it('should save preference on manual toggle', () => {
    // Test Scenario 7.1
  });

  it('should not save URL parameter to localStorage', () => {
    // Test Scenario 7.2
  });
});
```

### Manual Testing Checklist

**Content Coverage**:
- [ ] about.html: All headings bilingual
- [ ] about.html: All paragraphs bilingual
- [ ] about.html: RPAIT cards bilingual
- [ ] critics.html: All static text bilingual
- [ ] process.html: All 7 steps bilingual
- [ ] index.html: All UI text bilingual

**Functionality**:
- [ ] Language toggle button works
- [ ] URL parameter `?lang=en` works
- [ ] URL parameter `?lang=zh` works
- [ ] localStorage persistence works
- [ ] Meta tags update correctly
- [ ] Navigation menu updates correctly

**Translation Quality**:
- [ ] All English reads naturally
- [ ] No grammar errors
- [ ] Terminology consistent
- [ ] Academic tone maintained

**Cross-Browser**:
- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+

---

**Spec Status**: Draft
**Last Updated**: 2025-11-03
**Estimated Testing Time**: 2 hours
