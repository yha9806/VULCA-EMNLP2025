# Tasks: Implement Full-Site Bilingual Support

**Total Estimated Time**: 17.5 hours
**Status**: Proposed

---

## Phase 1: Core Infrastructure (2 hours)

### Task 1.1: Create Translation Glossary
**Estimate**: 20 min
**File**: `TRANSLATION_GLOSSARY.md`

**Steps**:
1. Create new file `TRANSLATION_GLOSSARY.md` in project root
2. Add table header: `| 中文术语 | 英文翻译 | 首次出现位置 | 备注 |`
3. Add initial terms:
   - RPAIT Framework (不翻译)
   - 代表性 → Representation
   - 哲学性 → Philosophicality
   - 美学性 → Aesthetics
   - 诠释性 → Interpretability
   - 技巧性 → Technicality
   - griot传统 → griot tradition (不翻译griot)
   - 陌生化 → defamiliarization
   - 文人画 → literati painting
   - 三远法 → Three Distances
   - 跨时代艺术评论 → cross-temporal art criticism
4. Save file

**Success Criteria**:
- [ ] File created with ≥11 entries
- [ ] Table format correct (4 columns)
- [ ] All entries have non-empty values

---

### Task 1.2: Extend CSS Language Switching Rules
**Estimate**: 30 min
**File**: `styles/main.css`

**Steps**:
1. Open `styles/main.css`
2. Find existing language rules (around line 733)
3. Add comprehensive rules at the end of file:
```css
/* ==================== LANGUAGE SWITCHING ==================== */

/* Hide inactive language content */
[data-lang="zh"] [lang="en"],
[data-lang="en"] [lang="zh"] {
  display: none;
}

/* Show active language content */
[data-lang="zh"] [lang="zh"],
[data-lang="en"] [lang="en"] {
  display: inline;
}

/* Block-level elements should remain block */
[data-lang="zh"] h1 [lang="zh"],
[data-lang="en"] h1 [lang="en"],
[data-lang="zh"] h2 [lang="zh"],
[data-lang="en"] h2 [lang="en"],
[data-lang="zh"] h3 [lang="zh"],
[data-lang="en"] h3 [lang="en"],
[data-lang="zh"] p [lang="zh"],
[data-lang="en"] p [lang="en"],
[data-lang="zh"] li [lang="zh"],
[data-lang="en"] li [lang="en"] {
  display: block;
}

/* Inline elements */
[data-lang="zh"] span[lang="zh"],
[data-lang="en"] span[lang="en"] {
  display: inline;
}
```
4. Save file
5. Test in browser: change `data-lang` attribute manually

**Success Criteria**:
- [ ] CSS rules added (~30 lines)
- [ ] No syntax errors
- [ ] Manual test: changing data-lang hides/shows correct content

**Validation Command**:
```bash
# Check CSS syntax
npx stylelint styles/main.css
```

---

### Task 1.3: Create Navigation i18n Module
**Estimate**: 40 min
**File**: `js/navigation-i18n.js`

**Steps**:
1. Create new file `js/navigation-i18n.js`
2. Add translation data:
```javascript
/**
 * Navigation Menu Internationalization
 * Manages bilingual menu labels
 */

const NAV_I18N = {
  'menu-home': { zh: '主画廊', en: 'Gallery' },
  'menu-critics': { zh: '评论家', en: 'Critics' },
  'menu-about': { zh: '关于', en: 'About' },
  'menu-process': { zh: '过程', en: 'Process' }
};

function updateMenuLanguage(lang) {
  if (!['zh', 'en'].includes(lang)) {
    console.warn(`[Nav i18n] Invalid language: ${lang}`);
    return;
  }

  Object.keys(NAV_I18N).forEach(key => {
    const element = document.querySelector(`.${key} .menu-label`);
    if (element) {
      element.textContent = NAV_I18N[key][lang];
    }
  });

  console.log(`[Nav i18n] Menu updated to: ${lang}`);
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.updateMenuLanguage = updateMenuLanguage;
}

console.log('✓ Navigation i18n loaded');
```
3. Save file
4. Add script tag to all HTML files (before navigation.js):
```html
<script src="/js/navigation-i18n.js"></script>
```

**Success Criteria**:
- [ ] File created (~30 lines)
- [ ] No syntax errors
- [ ] Function available on window object
- [ ] Console logs success message

---

### Task 1.4: Create Language Manager Module
**Estimate**: 50 min
**File**: `js/lang-manager.js`

**Steps**:
1. Create new file `js/lang-manager.js`
2. Implement LanguageManager class:
```javascript
/**
 * Language Manager
 * Handles language selection with priority: URL > localStorage > default
 */

class LanguageManager {
  constructor() {
    this.defaultLang = 'zh';
    this.storageKey = 'preferred-lang';
    this.validLangs = ['zh', 'en'];
  }

  getCurrentLanguage() {
    // 1. Check URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && this.validLangs.includes(urlLang)) {
      return urlLang;
    }

    // 2. Check localStorage
    const storedLang = localStorage.getItem(this.storageKey);
    if (storedLang && this.validLangs.includes(storedLang)) {
      return storedLang;
    }

    // 3. Default
    return this.defaultLang;
  }

  setLanguage(lang, updateStorage = true) {
    if (!this.validLangs.includes(lang)) {
      console.error(`[LangManager] Invalid language: ${lang}`);
      return;
    }

    document.documentElement.setAttribute('data-lang', lang);

    // Only update localStorage if not from URL parameter
    if (updateStorage) {
      localStorage.setItem(this.storageKey, lang);
    }

    // Update navigation menu
    if (typeof window.updateMenuLanguage === 'function') {
      window.updateMenuLanguage(lang);
    }

    // Update meta tags
    if (typeof window.updateMetaTags === 'function') {
      window.updateMetaTags(lang);
    }

    // Dispatch custom event
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));

    console.log(`[LangManager] Language set to: ${lang}`);
  }

  initialize() {
    const lang = this.getCurrentLanguage();
    const fromUrl = new URLSearchParams(window.location.search).has('lang');

    // Set language without updating storage if from URL
    this.setLanguage(lang, !fromUrl);

    // Update button text
    this.updateToggleButton(lang);
  }

  updateToggleButton(lang) {
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
      const langText = langToggle.querySelector('.lang-text');
      if (langText) {
        langText.textContent = lang === 'zh' ? 'EN/中' : 'ZH/英';
      }
    }
  }
}

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const langManager = new LanguageManager();
    langManager.initialize();
    window.langManager = langManager;
  });
} else {
  const langManager = new LanguageManager();
  langManager.initialize();
  window.langManager = langManager;
}

console.log('✓ Language Manager loaded');
```
3. Save file
4. Add script tag to all HTML files (in `<head>` before body content):
```html
<script src="/js/lang-manager.js"></script>
```

**Success Criteria**:
- [ ] File created (~80 lines)
- [ ] No syntax errors
- [ ] Auto-initialization works
- [ ] Language set correctly on page load

---

### Task 1.5: Update Existing Language Toggle Logic
**Estimate**: 20 min
**File**: Multiple HTML files

**Steps**:
1. Open `index.html`
2. Find existing language toggle code (around line 383-396)
3. Replace with call to LanguageManager:
```javascript
// Language toggle
const langToggle = document.getElementById('lang-toggle');
if (langToggle) {
  langToggle.addEventListener('click', () => {
    const currentLang = document.documentElement.getAttribute('data-lang');
    const newLang = currentLang === 'zh' ? 'en' : 'zh';

    if (window.langManager) {
      window.langManager.setLanguage(newLang, true); // true = update localStorage
    }
  });
}
```
4. Repeat for `pages/about.html`, `pages/critics.html`, `pages/process.html`
5. Save all files
6. Test: Click language toggle button, verify language switches

**Success Criteria**:
- [ ] All 4 HTML files updated
- [ ] Language toggle works on all pages
- [ ] localStorage updated on manual toggle

---

## Phase 2: Navigation & UI Elements (1.5 hours)

### Task 2.1: Create Meta Tags i18n Module
**Estimate**: 40 min
**File**: `js/meta-i18n.js`

**Steps**:
1. Create new file `js/meta-i18n.js`
2. Add meta translations:
```javascript
/**
 * Meta Tags Internationalization
 * Updates SEO meta tags based on language
 */

const META_I18N = {
  'description': {
    '/': {
      zh: '潮汐的负形 - VULCA艺术展览',
      en: 'Negative Space of the Tide - VULCA Art Exhibition'
    },
    '/index.html': {
      zh: '潮汐的负形 - VULCA艺术展览',
      en: 'Negative Space of the Tide - VULCA Art Exhibition'
    },
    '/pages/about.html': {
      zh: '关于VULCA - AI艺术评论实验系统，探索跨时代评论家视角和RPAIT五维评论框架',
      en: 'About VULCA - AI-powered art criticism experimental system exploring cross-temporal critic perspectives and RPAIT five-dimensional framework'
    },
    '/pages/critics.html': {
      zh: 'VULCA艺术评论家简介 - 了解6位跨越时代的艺术评论家如何评价当代艺术',
      en: 'VULCA Art Critics - Discover how 6 cross-temporal critics evaluate contemporary art'
    },
    '/pages/process.html': {
      zh: 'VULCA系统开发过程 - 研究设计、角色建模、评论生成、数据验证的完整流程',
      en: 'VULCA Development Process - Complete workflow of research design, persona modeling, critique generation, and data validation'
    }
  },
  'og:description': {
    '/': {
      zh: '探索AI艺术评论的实验系统',
      en: 'Explore AI-powered art criticism experimental system'
    },
    '/index.html': {
      zh: '探索AI艺术评论的实验系统',
      en: 'Explore AI-powered art criticism experimental system'
    },
    '/pages/about.html': {
      zh: '了解VULCA系统、研究目标、系统架构和研究意义',
      en: 'Learn about VULCA system, research objectives, architecture, and significance'
    },
    '/pages/critics.html': {
      zh: '认识VULCA展览的6位艺术评论家及其评论维度',
      en: 'Meet 6 art critics of VULCA exhibition and their critique dimensions'
    },
    '/pages/process.html': {
      zh: 'VULCA系统从研究设计到展示应用的完整开发流程',
      en: 'Complete development process from research design to exhibition application'
    }
  }
};

function updateMetaTags(lang) {
  const path = window.location.pathname;

  // Update description
  const descMeta = document.querySelector('meta[name="description"]');
  if (descMeta && META_I18N.description[path]) {
    descMeta.setAttribute('content', META_I18N.description[path][lang]);
  }

  // Update og:description
  const ogDescMeta = document.querySelector('meta[property="og:description"]');
  if (ogDescMeta && META_I18N['og:description'][path]) {
    ogDescMeta.setAttribute('content', META_I18N['og:description'][path][lang]);
  }

  console.log(`[Meta i18n] Meta tags updated to: ${lang}`);
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.updateMetaTags = updateMetaTags;
}

console.log('✓ Meta i18n loaded');
```
3. Save file
4. Add script tag to all HTML files:
```html
<script src="/js/meta-i18n.js"></script>
```

**Success Criteria**:
- [ ] File created (~80 lines)
- [ ] Meta tags update correctly on language change
- [ ] All 5 pages have translations

---

### Task 2.2: Add Script Tags to All HTML Files
**Estimate**: 20 min
**Files**: `index.html`, `pages/about.html`, `pages/critics.html`, `pages/process.html`

**Steps**:
1. Open each HTML file
2. Add script tags in `<head>` section (before `<script>window.IMMERSIVE_MODE`):
```html
<!-- Language Support -->
<script src="/js/navigation-i18n.js"></script>
<script src="/js/meta-i18n.js"></script>
<script src="/js/lang-manager.js"></script>
```
3. Save each file
4. Test: Load each page, check console for "✓ loaded" messages

**Success Criteria**:
- [ ] All 4 HTML files have script tags
- [ ] Scripts load in correct order
- [ ] Console shows 3 success messages

---

### Task 2.3: Test Infrastructure
**Estimate**: 30 min

**Steps**:
1. Start local server: `python -m http.server 9999`
2. Open `http://localhost:9999`
3. Test language toggle:
   - [ ] Click toggle button → language switches
   - [ ] Menu labels update (主画廊 ↔ Gallery)
   - [ ] localStorage updated
4. Test URL parameter:
   - [ ] Visit `?lang=en` → displays English
   - [ ] Visit `?lang=zh` → displays Chinese
   - [ ] localStorage NOT updated from URL
5. Test meta tags:
   - [ ] Open DevTools → Elements
   - [ ] Find `<meta name="description">`
   - [ ] Toggle language → content updates
6. Fix any issues found

**Success Criteria**:
- [ ] All tests pass
- [ ] No console errors
- [ ] All functionality works as expected

---

## Phase 3: About Page (pages/about.html) (4 hours)

### Task 3.1: Translate Page Header
**Estimate**: 15 min
**File**: `pages/about.html`

**Steps**:
1. Open `pages/about.html`
2. Find page header (lines 42-44):
```html
<section class="page-header">
  <h1>关于VULCA</h1>
  <p class="subtitle">AI艺术评论实验系统</p>
</section>
```
3. Replace with bilingual version:
```html
<section class="page-header">
  <h1>
    <span lang="zh">关于VULCA</span>
    <span lang="en">About VULCA</span>
  </h1>
  <p class="subtitle">
    <span lang="zh">AI艺术评论实验系统</span>
    <span lang="en">AI-Powered Art Criticism Experimental System</span>
  </p>
</section>
```
4. Save file
5. Test: Toggle language, verify header switches

**Success Criteria**:
- [ ] Header bilingual
- [ ] Language switch works
- [ ] Layout unchanged

---

### Task 3.2: Translate "VULCA系统简介" Section
**Estimate**: 30 min
**File**: `pages/about.html`

**Steps**:
1. Find section (lines 47-54)
2. Translate heading:
```html
<h2>
  <span lang="zh">VULCA 系统简介</span>
  <span lang="en">VULCA System Overview</span>
</h2>
```
3. Translate first paragraph (~40 words):
```html
<p>
  <span lang="zh">VULCA（跨时代艺术评论视角）是一个基于人工智能的艺术评论实验系统，旨在探索不同历史时期的艺术评论家如何评价当代艺术作品。</span>
  <span lang="en">VULCA (Cross-Temporal Art Criticism Perspectives) is an AI-powered art criticism experimental system designed to explore how art critics from different historical periods evaluate contemporary artworks.</span>
</p>
```
4. Translate second paragraph (~60 words):
```html
<p>
  <span lang="zh">系统采用AI角色扮演技术，模拟6位来自不同时代和文化背景的艺术评论家，对4件当代艺术作品进行多维度评论。每位AI评论家基于历史文献和理论文本进行角色建模，在RPAIT五维框架下生成评论，形成6×4×5=120个评论数据点的实验数据集。</span>
  <span lang="en">The system employs AI role-playing technology to simulate 6 art critics from different historical periods and cultural backgrounds, providing multi-dimensional critiques of 4 contemporary artworks. Each AI critic is modeled based on historical documents and theoretical texts, generating critiques under the RPAIT five-dimensional framework, forming an experimental dataset of 6×4×5=120 critique data points.</span>
</p>
```
5. Translate third paragraph (~50 words):
```html
<p>
  <span lang="zh">通过这一系统，我们探索以下研究问题：历史上的艺术评论家会如何看待当代艺术？AI能否准确模拟历史人物的评论风格和思想体系？结构化的评论框架能否帮助我们更系统地理解艺术作品？</span>
  <span lang="en">Through this system, we explore the following research questions: How would historical art critics view contemporary art? Can AI accurately simulate the critical style and ideological systems of historical figures? Can a structured critique framework help us understand artworks more systematically?</span>
</p>
```
6. Save file
7. Test bilingual display

**Success Criteria**:
- [ ] All 3 paragraphs bilingual (~150 words English added)
- [ ] Terminology matches glossary (RPAIT, cross-temporal, etc.)
- [ ] Language switch works correctly

---

### Task 3.3: Translate "RPAIT评论框架" Section
**Estimate**: 45 min
**File**: `pages/about.html`

**Steps**:
1. Find section (lines 56-86)
2. Translate section heading:
```html
<h2>
  <span lang="zh">RPAIT 评论框架</span>
  <span lang="en">RPAIT Critique Framework</span>
</h2>
```
3. Translate intro paragraph:
```html
<p>
  <span lang="zh">RPAIT是VULCA评论的核心框架，由五个关键维度组成：</span>
  <span lang="en">RPAIT is the core framework of VULCA critiques, consisting of five key dimensions:</span>
</p>
```
4. Translate each of 5 framework cards:

**Card R**:
```html
<div class="framework-card">
  <h3>
    <span lang="zh">R - 代表性</span>
    <span lang="en">R - Representation</span>
  </h3>
  <p>
    <span lang="zh">作品如何呈现现实或观念？它选择了什么，又回避了什么？代表性涉及艺术家对现实的选择性解读和表达方式。</span>
    <span lang="en">How does the work present reality or concepts? What does it select, and what does it avoid? Representation involves the artist's selective interpretation and expression of reality.</span>
  </p>
</div>
```

**Card P**:
```html
<div class="framework-card">
  <h3>
    <span lang="zh">P - 哲学性</span>
    <span lang="en">P - Philosophicality</span>
  </h3>
  <p>
    <span lang="zh">作品所体现的哲学思想和世界观是什么？它涉及什么样的人类根本问题？哲学性关乎作品的理念深度。</span>
    <span lang="en">What philosophical thoughts and worldviews does the work embody? What fundamental human questions does it address? Philosophicality concerns the conceptual depth of the work.</span>
  </p>
</div>
```

**Card A**:
```html
<div class="framework-card">
  <h3>
    <span lang="zh">A - 美学性</span>
    <span lang="en">A - Aesthetics</span>
  </h3>
  <p>
    <span lang="zh">作品的视觉形式、颜色、构图、材料等如何创造美的体验？美学性是艺术最直接的感官维度。</span>
    <span lang="en">How do the work's visual form, color, composition, and materials create aesthetic experience? Aesthetics is art's most direct sensory dimension.</span>
  </p>
</div>
```

**Card I**:
```html
<div class="framework-card">
  <h3>
    <span lang="zh">I - 诠释性</span>
    <span lang="en">I - Interpretability</span>
  </h3>
  <p>
    <span lang="zh">作品能够被如何诠释？它开放了多少种可能的意义？诠释性反映了作品的意义开放性和观众的参与空间。</span>
    <span lang="en">How can the work be interpreted? How many possible meanings does it open? Interpretability reflects the work's semantic openness and audience participation space.</span>
  </p>
</div>
```

**Card T**:
```html
<div class="framework-card">
  <h3>
    <span lang="zh">T - 技巧性</span>
    <span lang="en">T - Technicality</span>
  </h3>
  <p>
    <span lang="zh">艺术家运用了什么样的技法和表现手段？技巧的娴熟度如何？技巧性体现了艺术执行的专业性。</span>
    <span lang="en">What techniques and expressive means does the artist employ? How skillful is the execution? Technicality embodies the professionalism of artistic execution.</span>
  </p>
</div>
```

5. Save file
6. Test all 5 cards switch language correctly

**Success Criteria**:
- [ ] Section heading bilingual
- [ ] Intro paragraph bilingual
- [ ] All 5 cards bilingual (~150 words English added)
- [ ] Terminology matches glossary (Representation, Philosophicality, etc.)

---

### Task 3.4: Translate "研究目标" Section
**Estimate**: 30 min
**File**: `pages/about.html`

**Steps**:
1. Find section (lines 88-99)
2. Translate heading:
```html
<h2>
  <span lang="zh">研究目标</span>
  <span lang="en">Research Objectives</span>
</h2>
```
3. Translate intro paragraph:
```html
<p>
  <span lang="zh">VULCA系统的核心研究目标包括以下三个方面：</span>
  <span lang="en">The core research objectives of the VULCA system include the following three aspects:</span>
</p>
```
4. Translate 3 list items in `<ul class="feature-list">`:

**Item 1**:
```html
<li>
  <strong>
    <span lang="zh">跨时代艺术评论探索</span>
    <span lang="en">Cross-Temporal Art Criticism Exploration</span>
  </strong>
  <span lang="zh"> - 通过AI角色扮演，探索不同历史时期的艺术评论家对当代艺术的可能观点，建立跨越时代的艺术对话</span>
  <span lang="en"> - Through AI role-playing, explore possible perspectives of art critics from different historical periods on contemporary art, establishing cross-temporal artistic dialogue</span>
</li>
```

**Item 2**:
```html
<li>
  <strong>
    <span lang="zh">RPAIT评论框架验证</span>
    <span lang="en">RPAIT Framework Validation</span>
  </strong>
  <span lang="zh"> - 验证结构化的五维评论框架（代表性、哲学性、美学性、诠释性、技巧性）在艺术评论中的有效性和适用性</span>
  <span lang="en"> - Validate the effectiveness and applicability of the structured five-dimensional critique framework (Representation, Philosophicality, Aesthetics, Interpretability, Technicality) in art criticism</span>
</li>
```

**Item 3**:
```html
<li>
  <strong>
    <span lang="zh">AI角色扮演准确性研究</span>
    <span lang="en">AI Role-Playing Accuracy Research</span>
  </strong>
  <span lang="zh"> - 评估大语言模型在模拟历史人物评论风格、思想体系和理论立场方面的能力和局限性</span>
  <span lang="en"> - Assess the capabilities and limitations of large language models in simulating historical figures' critical styles, ideological systems, and theoretical stances</span>
</li>
```

5. Translate closing paragraph:
```html
<p>
  <span lang="zh">通过这些研究，我们希望为AI辅助的艺术评论、历史人物角色建模以及跨时代文化对话提供新的视角和方法。</span>
  <span lang="en">Through these studies, we aim to provide new perspectives and methods for AI-assisted art criticism, historical figure persona modeling, and cross-temporal cultural dialogue.</span>
</p>
```

6. Save file
7. Test list items and closing paragraph

**Success Criteria**:
- [ ] Heading bilingual
- [ ] Intro paragraph bilingual
- [ ] All 3 list items bilingual (~100 words English)
- [ ] Closing paragraph bilingual
- [ ] Terminology consistent

---

### Task 3.5: Translate "系统架构" Section
**Estimate**: 40 min
**File**: `pages/about.html`

**Steps**:
1. Find section (lines 101-127)
2. Translate heading and intro:
```html
<h2>
  <span lang="zh">系统架构</span>
  <span lang="en">System Architecture</span>
</h2>
<p>
  <span lang="zh">VULCA系统由三个核心组件构成：</span>
  <span lang="en">The VULCA system consists of three core components:</span>
</p>
```

3. Translate 3 framework cards:

**Card 1: AI评论家角色系统**:
```html
<div class="framework-card">
  <h3>
    <span lang="zh">AI评论家角色系统</span>
    <span lang="en">AI Critic Persona System</span>
  </h3>
  <p>
    <span lang="zh">基于历史文献和理论文本，为每位评论家建立角色模型，包括其美学观点、哲学立场、文化背景和评论风格。系统采用</span>
    <span lang="en">Based on historical documents and theoretical texts, establish persona models for each critic, including their aesthetic views, philosophical stances, cultural backgrounds, and critical styles. The system employs a mixed design of </span>
    <strong>
      <span lang="zh">4位真实历史人物</span>
      <span lang="en">4 real historical figures</span>
    </strong>
    <span lang="zh">和</span>
    <span lang="en"> and </span>
    <strong>
      <span lang="zh">2位虚构AI角色</span>
      <span lang="en">2 fictional AI personas</span>
    </strong>
    <span lang="zh">的混合设计：</span>
    <span lang="en">:</span>
  </p>

  <p>
    <strong>
      <span lang="zh">真实历史评论家（4位）</span>
      <span lang="en">Real Historical Critics (4)</span>
    </strong>
    <span lang="zh">：苏轼（北宋文人，1037-1101）、郭熙（北宋山水画家，1020-1100）、约翰·罗斯金（维多利亚时期评论家，1819-1900）、凯特·克劳福德（当代AI伦理学家）。这些评论家的理论立场和著作均有历史文献支撑。</span>
    <span lang="en">: Su Shi (Northern Song literatus, 1037-1101), Guo Xi (Northern Song landscape painter, 1020-1100), John Ruskin (Victorian critic, 1819-1900), Kate Crawford (contemporary AI ethicist). These critics' theoretical positions and works are supported by historical documents.</span>
  </p>

  <p>
    <strong>
      <span lang="zh">虚构AI角色（2位）</span>
      <span lang="en">Fictional AI Personas (2)</span>
    </strong>
    <span lang="zh">：佐拉妈妈（代表西非griot口述传统和集体诠释视角）、埃琳娜·佩特洛娃教授（代表俄罗斯形式主义结构分析传统）。这两位虚构角色由AI创建，用于代表特定的批评范式和文化视角，是本研究探索AI角色扮演能力的实验设计。</span>
    <span lang="en">: Mama Zola (representing West African griot oral tradition and collective interpretive perspective), Professor Elena Petrova (representing Russian formalist structural analysis tradition). These two fictional personas are created by AI to represent specific critical paradigms and cultural perspectives, serving as experimental design for exploring AI role-playing capabilities in this research.</span>
  </p>

  <p>
    <span lang="zh">这种真实与虚构相结合的设计，既保证了历史评论传统的准确性，又探索了AI在构建新型批评视角时的创造潜力。</span>
    <span lang="en">This combined design of real and fictional ensures both the accuracy of historical critical traditions and explores AI's creative potential in constructing novel critical perspectives.</span>
  </p>
</div>
```

**Card 2: RPAIT评论框架**:
```html
<div class="framework-card">
  <h3>
    <span lang="zh">RPAIT评论框架</span>
    <span lang="en">RPAIT Critique Framework</span>
  </h3>
  <p>
    <span lang="zh">五维度结构化评论系统，确保评论的全面性和可比性。每个维度都有明确的评估标准：代表性关注作品对现实的呈现方式，哲学性关注思想深度，美学性关注视觉形式，诠释性关注意义的开放性，技巧性关注艺术执行的专业性。每个维度采用1-10分量化评分。</span>
    <span lang="en">A five-dimensional structured critique system ensuring comprehensiveness and comparability of critiques. Each dimension has clear evaluation criteria: Representation focuses on how the work presents reality, Philosophicality on conceptual depth, Aesthetics on visual form, Interpretability on semantic openness, and Technicality on professional execution. Each dimension uses a 1-10 quantified scoring system.</span>
  </p>
</div>
```

**Card 3: 评论生成管道**:
```html
<div class="framework-card">
  <h3>
    <span lang="zh">评论生成管道</span>
    <span lang="en">Critique Generation Pipeline</span>
  </h3>
  <p>
    <span lang="zh">结合AI生成和人工审核的混合流程。首先通过大语言模型基于角色设定和RPAIT框架生成初稿评论，然后由研究团队进行历史准确性验证、理论一致性检查和文本质量控制，最终形成符合学术标准的评论数据集。</span>
    <span lang="en">A hybrid workflow combining AI generation and human review. First, large language models generate initial critiques based on persona settings and the RPAIT framework, then the research team performs historical accuracy verification, theoretical consistency checks, and text quality control, ultimately forming an academically rigorous critique dataset.</span>
  </p>
</div>
```

4. Save file
5. Test all 3 cards

**Success Criteria**:
- [ ] Heading and intro bilingual
- [ ] All 3 cards fully bilingual (~250 words English)
- [ ] Terminology matches glossary (griot, formalist, etc.)

---

### Task 3.6: Translate "研究意义" Section
**Estimate**: 30 min
**File**: `pages/about.html`

**Steps**:
1. Find section (lines 129-138)
2. Translate heading:
```html
<h2>
  <span lang="zh">研究意义</span>
  <span lang="en">Research Significance</span>
</h2>
```

3. Translate intro:
```html
<p>
  <span lang="zh">VULCA系统在学术研究和实际应用方面都具有重要意义：</span>
  <span lang="en">The VULCA system holds significant importance in both academic research and practical applications:</span>
</p>
```

4. Translate academic contribution paragraph:
```html
<p>
  <strong>
    <span lang="zh">学术贡献</span>
    <span lang="en">Academic Contributions</span>
  </strong>
  <span lang="zh">：本研究为艺术评论的计算方法、历史人物的AI建模以及跨时代文化对话提供了新的研究范式。RPAIT框架为艺术评论的结构化分析提供了可复用的工具，而AI角色扮演技术为人文研究中的"反事实历史"探索开辟了新路径。</span>
  <span lang="en">: This research provides new paradigms for computational methods in art criticism, AI modeling of historical figures, and cross-temporal cultural dialogue. The RPAIT framework offers reusable tools for structured analysis of art criticism, while AI role-playing technology opens new paths for exploring "counterfactual history" in humanities research.</span>
</p>
```

5. Translate application scenario paragraph:
```html
<p>
  <strong>
    <span lang="zh">应用场景</span>
    <span lang="en">Application Scenarios</span>
  </strong>
  <span lang="zh">：系统的方法和框架可应用于艺术教育（帮助学生从多维度理解艺术）、策展实践（为展览提供多元评论视角）、艺术批评研究（系统分析不同批评传统的特点）以及AI人文应用（探索AI在历史人物建模和文化传承中的可能性）。</span>
  <span lang="en">: The system's methods and frameworks can be applied to art education (helping students understand art from multiple dimensions), curatorial practice (providing diverse critical perspectives for exhibitions), art criticism research (systematically analyzing characteristics of different critical traditions), and AI humanities applications (exploring AI's potential in historical figure modeling and cultural transmission).</span>
</p>
```

6. Translate closing paragraph:
```html
<p>
  <span lang="zh">更重要的是，VULCA系统提出了一个关键问题：当我们让AI"代言"历史人物时，我们究竟在创造什么？是对历史的再现，还是一种新的诠释？这一问题对于理解AI在人文领域的作用至关重要。</span>
  <span lang="en">More importantly, the VULCA system raises a crucial question: When we let AI "represent" historical figures, what exactly are we creating? Is it historical reproduction or a new interpretation? This question is crucial for understanding AI's role in the humanities.</span>
</p>
```

7. Save file
8. Test all paragraphs

**Success Criteria**:
- [ ] Heading bilingual
- [ ] All paragraphs bilingual (~120 words English)
- [ ] Academic terminology accurate

---

### Task 3.7: Translate "联系我们" Section
**Estimate**: 10 min
**File**: `pages/about.html`

**Steps**:
1. Find section (lines 140-144)
2. Translate:
```html
<section class="content-section">
  <h2>
    <span lang="zh">联系我们</span>
    <span lang="en">Contact Us</span>
  </h2>
  <p>
    <span lang="zh">对VULCA项目有任何问题或建议？欢迎联系：</span>
    <span lang="en">Have any questions or suggestions about the VULCA project? Feel free to contact:</span>
  </p>
  <p><a href="mailto:info@vulcaart.art">info@vulcaart.art</a></p>
</section>
```

3. Save file
4. Test

**Success Criteria**:
- [ ] Contact section bilingual
- [ ] Email link unchanged

---

### Task 3.8: Translate Footer
**Estimate**: 10 min
**File**: `pages/about.html`

**Steps**:
1. Find footer (lines 147-150)
2. Translate:
```html
<footer class="page-footer">
  <p>
    <span lang="zh">© 2024 VULCA. All rights reserved.</span>
    <span lang="en">© 2024 VULCA. All rights reserved.</span>
  </p>
  <p><a href="mailto:info@vulcaart.art">info@vulcaart.art</a></p>
</footer>
```

3. Save file

**Success Criteria**:
- [ ] Footer bilingual (content same in both languages)

---

### Task 3.9: Test about.html Completely
**Estimate**: 20 min

**Steps**:
1. Visit `http://localhost:9999/pages/about.html`
2. Verify default language (zh)
3. Click language toggle → verify all content switches to English
4. Check each section:
   - [ ] Page header
   - [ ] VULCA系统简介 (3 paragraphs)
   - [ ] RPAIT评论框架 (5 cards)
   - [ ] 研究目标 (3 list items)
   - [ ] 系统架构 (3 cards)
   - [ ] 研究意义 (3 paragraphs)
   - [ ] 联系我们
5. Test URL: `?lang=en` → should display English
6. Test localStorage persistence
7. Fix any issues found

**Success Criteria**:
- [ ] All sections display correctly in both languages
- [ ] No layout breaks
- [ ] No missing translations
- [ ] Total ~800 words English added to about.html

---

## Phase 4: Critics Page (pages/critics.html) (2 hours)

### Task 4.1: Translate Page Header
**Estimate**: 10 min
**File**: `pages/critics.html`

**Steps**:
1. Open `pages/critics.html`
2. Find page header (lines 92-98):
```html
<section class="page-header">
  <h1>评论家</h1>
  <p class="subtitle">认识6位跨越时代的艺术评论家</p>
</section>
```
3. Replace with:
```html
<section class="page-header">
  <h1>
    <span lang="zh">评论家</span>
    <span lang="en">Critics</span>
  </h1>
  <p class="subtitle">
    <span lang="zh">认识6位跨越时代的艺术评论家</span>
    <span lang="en">Meet 6 Art Critics Across Time</span>
  </p>
</section>
```
4. Save and test

**Success Criteria**:
- [ ] Header bilingual
- [ ] Language switch works

---

### Task 4.2: Translate "评论家构成说明" Section
**Estimate**: 45 min
**File**: `pages/critics.html`

**Steps**:
1. Find section (lines 110-133)
2. Translate heading:
```html
<h2>
  <span lang="zh">评论家构成说明</span>
  <span lang="en">Critic Composition Description</span>
</h2>
```

3. Translate intro:
```html
<p>
  <span lang="zh">VULCA系统的6位评论家采用</span>
  <span lang="en">The 6 critics of the VULCA system employ a mixed design of </span>
  <strong>
    <span lang="zh">真实历史人物与虚构AI角色相结合</span>
    <span lang="en">real historical figures and fictional AI personas</span>
  </strong>
  <span lang="zh">的研究设计：</span>
  <span lang="en">:</span>
</p>
```

4. Translate Real Historical Critics section:
```html
<div style="margin: 1.5rem 0;">
  <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem;">
    <span lang="zh">✓ 真实历史评论家（4位）</span>
    <span lang="en">✓ Real Historical Critics (4)</span>
  </h3>
  <ul style="margin-left: 1.5rem; line-height: 1.8;">
    <li>
      <strong>
        <span lang="zh">苏轼</span>
        <span lang="en">Su Shi</span>
      </strong>
      <span lang="zh">（北宋文人，1037-1101）- 代表中国古典文人美学和诗画一律传统</span>
      <span lang="en"> (Northern Song literatus, 1037-1101) - Represents classical Chinese literati aesthetics and poetic-painting unity tradition</span>
    </li>
    <li>
      <strong>
        <span lang="zh">郭熙</span>
        <span lang="en">Guo Xi</span>
      </strong>
      <span lang="zh">（北宋山水画家，1020-1100）- 代表山水画理论和形式构图法则</span>
      <span lang="en"> (Northern Song landscape painter, 1020-1100) - Represents landscape painting theory and formal compositional principles</span>
    </li>
    <li>
      <strong>
        <span lang="zh">约翰·罗斯金</span>
        <span lang="en">John Ruskin</span>
      </strong>
      <span lang="zh">（维多利亚时期评论家，1819-1900）- 代表道德美学和社会责任视角</span>
      <span lang="en"> (Victorian critic, 1819-1900) - Represents moral aesthetics and social responsibility perspective</span>
    </li>
    <li>
      <strong>
        <span lang="zh">凯特·克劳福德</span>
        <span lang="en">Kate Crawford</span>
      </strong>
      <span lang="zh">（当代AI伦理学家）- 代表技术伦理和人机协作批评</span>
      <span lang="en"> (Contemporary AI ethicist) - Represents technology ethics and human-machine collaboration criticism</span>
    </li>
  </ul>
</div>
```

5. Translate Fictional AI Personas section:
```html
<div style="margin: 1.5rem 0;">
  <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem;">
    <span lang="zh">◆ 虚构AI角色（2位）</span>
    <span lang="en">◆ Fictional AI Personas (2)</span>
  </h3>
  <ul style="margin-left: 1.5rem; line-height: 1.8;">
    <li>
      <strong>
        <span lang="zh">佐拉妈妈</span>
        <span lang="en">Mama Zola</span>
      </strong>
      <span lang="zh">（西非传统文化）- AI创建的虚构角色，代表西非griot口述传统和集体诠释范式</span>
      <span lang="en"> (West African traditional culture) - AI-created fictional persona representing West African griot oral tradition and collective interpretive paradigm</span>
    </li>
    <li>
      <strong>
        <span lang="zh">埃琳娜·佩特洛娃教授</span>
        <span lang="en">Professor Elena Petrova</span>
      </strong>
      <span lang="zh">（俄罗斯形式主义）- AI创建的虚构角色，代表结构分析和视觉语言研究传统</span>
      <span lang="en"> (Russian Formalism) - AI-created fictional persona representing structural analysis and visual language research tradition</span>
    </li>
  </ul>
</div>
```

6. Translate closing note:
```html
<p style="margin-top: 1rem; font-style: italic; color: #666;">
  <span lang="zh">这种混合设计是本研究的核心实验设计：真实历史人物确保批评传统的准确性，虚构AI角色探索AI在构建新型批评视角时的能力与局限。</span>
  <span lang="en">This mixed design is the core experimental design of this research: real historical figures ensure the accuracy of critical traditions, while fictional AI personas explore AI's capabilities and limitations in constructing novel critical perspectives.</span>
</p>
```

7. Save file
8. Test bilingual display

**Success Criteria**:
- [ ] All critic names bilingual
- [ ] All descriptions bilingual (~200 words English)
- [ ] List formatting preserved

---

### Task 4.3: Translate "RPAIT评论维度" Section
**Estimate**: 20 min
**File**: `pages/critics.html`

**Steps**:
1. Find section (lines 136-146)
2. Translate heading:
```html
<h2>
  <span lang="zh">RPAIT 评论维度</span>
  <span lang="en">RPAIT Critique Dimensions</span>
</h2>
```

3. Translate intro:
```html
<p>
  <span lang="zh">每位评论家使用五个维度来评价艺术作品：</span>
  <span lang="en">Each critic evaluates artworks using five dimensions:</span>
</p>
```

4. Translate 5 list items:
```html
<ul class="rpait-dimensions">
  <li>
    <strong>
      <span lang="zh">R - 代表性</span>
      <span lang="en">R - Representation</span>
    </strong>
    <span lang="zh">：作品对现实或观念的呈现方式</span>
    <span lang="en">: How the work presents reality or concepts</span>
  </li>
  <li>
    <strong>
      <span lang="zh">P - 哲学性</span>
      <span lang="en">P - Philosophicality</span>
    </strong>
    <span lang="zh">：作品所体现的哲学思想和世界观</span>
    <span lang="en">: Philosophical thoughts and worldviews embodied in the work</span>
  </li>
  <li>
    <strong>
      <span lang="zh">A - 美学性</span>
      <span lang="en">A - Aesthetics</span>
    </strong>
    <span lang="zh">：作品的视觉形式和美学价值</span>
    <span lang="en">: Visual form and aesthetic value of the work</span>
  </li>
  <li>
    <strong>
      <span lang="zh">I - 诠释性</span>
      <span lang="en">I - Interpretability</span>
    </strong>
    <span lang="zh">：作品的意义层次和诠释空间</span>
    <span lang="en">: Semantic layers and interpretive space of the work</span>
  </li>
  <li>
    <strong>
      <span lang="zh">T - 技巧性</span>
      <span lang="en">T - Technicality</span>
    </strong>
    <span lang="zh">：艺术家的技法和表现手段</span>
    <span lang="en">: Techniques and expressive means of the artist</span>
  </li>
</ul>
```

5. Save file
6. Test

**Success Criteria**:
- [ ] Heading bilingual
- [ ] All 5 dimensions bilingual (~50 words English)
- [ ] Terminology matches glossary

---

### Task 4.4: Translate "加载中" Loading Message
**Estimate**: 5 min
**File**: `pages/critics.html`

**Steps**:
1. Find critics grid section (lines 103-107)
2. Replace loading message:
```html
<section class="critics-section">
  <div id="critics-grid" class="critics-grid">
    <!-- Dynamically generated by critics-page.js -->
    <p class="loading-message">
      <span lang="zh">加载中...</span>
      <span lang="en">Loading...</span>
    </p>
  </div>
</section>
```
3. Save file
4. Test (loading message should switch language)

**Success Criteria**:
- [ ] Loading message bilingual

---

### Task 4.5: Translate Footer
**Estimate**: 10 min
**File**: `pages/critics.html`

**Steps**:
1. Find footer (lines 150-157)
2. Translate:
```html
<footer class="page-footer">
  <div class="footer-content">
    <p>
      <span lang="zh">© 2024 VULCA. All rights reserved.</span>
      <span lang="en">© 2024 VULCA. All rights reserved.</span>
    </p>
    <p>
      <a href="mailto:info@vulcaart.art">info@vulcaart.art</a>
    </p>
  </div>
</footer>
```
3. Save file

**Success Criteria**:
- [ ] Footer bilingual

---

### Task 4.6: Test critics.html Completely
**Estimate**: 20 min

**Steps**:
1. Visit `http://localhost:9999/pages/critics.html`
2. Verify default language (zh)
3. Click language toggle → verify all static text switches
4. Check:
   - [ ] Page header
   - [ ] 评论家构成说明 (2 sections + closing note)
   - [ ] RPAIT评论维度 (5 dimensions)
   - [ ] Loading message
   - [ ] Footer
5. Note: Critic cards (biographies) are handled by separate change `localize-critics-page-and-optimize-layout`
6. Fix any issues

**Success Criteria**:
- [ ] All static text bilingual
- [ ] Total ~300 words English added
- [ ] No layout breaks

---

## Phase 5: Process Page (pages/process.html) (5 hours)

### Task 5.1: Translate Page Header
**Estimate**: 10 min
**File**: `pages/process.html`

**Steps**:
1. Open `pages/process.html`
2. Find page header (lines 42-44)
3. Replace with bilingual version:
```html
<section class="page-header">
  <h1>
    <span lang="zh">系统开发过程</span>
    <span lang="en">System Development Process</span>
  </h1>
  <p class="subtitle">
    <span lang="zh">从研究设计到展示应用</span>
    <span lang="en">From Research Design to Exhibition Application</span>
  </p>
</section>
```
4. Save and test

**Success Criteria**:
- [ ] Header bilingual

---

### Task 5.2: Translate Step 1 "研究设计"
**Estimate**: 40 min
**File**: `pages/process.html`

**Steps**:
1. Find Step 1 section (lines 47-61)
2. Translate heading:
```html
<h2>
  <span lang="zh">1. 研究设计</span>
  <span lang="en">1. Research Design</span>
</h2>
```

3. Translate content paragraphs (use AI-assisted translation + human review):
```html
<p>
  <span lang="zh">第一步是确定研究问题和系统框架。我们提出核心研究问题：历史上的艺术评论家会如何看待当代艺术？为此，我们设计了跨时代评论家模拟系统，并建立了RPAIT五维评论框架作为评价标准。</span>
  <span lang="en">The first step is to define research questions and the system framework. We posed the core research question: How would historical art critics view contemporary art? For this, we designed a cross-temporal critic simulation system and established the RPAIT five-dimensional critique framework as the evaluation standard.</span>
</p>

<p>
  <span lang="zh">研究设计阶段的关键决策包括：</span>
  <span lang="en">Key decisions in the research design phase include:</span>
</p>

<ul>
  <li>
    <strong>
      <span lang="zh">评论家选择</span>
      <span lang="en">Critic Selection</span>
    </strong>
    <span lang="zh">：确定6位来自不同时代和文化背景的评论家（4位真实历史人物 + 2位虚构AI角色）</span>
    <span lang="en">: Selecting 6 critics from different historical periods and cultural backgrounds (4 real historical figures + 2 fictional AI personas)</span>
  </li>
  <li>
    <strong>
      <span lang="zh">作品选择</span>
      <span lang="en">Artwork Selection</span>
    </strong>
    <span lang="zh">：选择4件代表性的当代艺术作品，涵盖数字艺术、装置艺术等多种形式</span>
    <span lang="en">: Selecting 4 representative contemporary artworks covering digital art, installation art, and other forms</span>
  </li>
  <li>
    <strong>
      <span lang="zh">框架建立</span>
      <span lang="en">Framework Establishment</span>
    </strong>
    <span lang="zh">：设计RPAIT五维评论框架（代表性、哲学性、美学性、诠释性、技巧性）</span>
    <span lang="en">: Designing the RPAIT five-dimensional critique framework (Representation, Philosophicality, Aesthetics, Interpretability, Technicality)</span>
  </li>
</ul>
```

4. Save file
5. Test

**Success Criteria**:
- [ ] Heading bilingual
- [ ] All paragraphs and list items bilingual (~150 words English)
- [ ] Terminology consistent

---

### Task 5.3: Translate Step 2 "评论家角色建模"
**Estimate**: 40 min
**File**: `pages/process.html`

**Steps**:
1. Find Step 2 section (lines 62-76)
2. Translate heading:
```html
<h2>
  <span lang="zh">2. 评论家角色建模</span>
  <span lang="en">2. Critic Persona Modeling</span>
</h2>
```

3. Translate content (similar pattern as Task 5.2):
```html
<p>
  <span lang="zh">基于历史文献和理论文本，为每位评论家建立详细的角色模型。真实历史人物的建模依据其代表性著作和理论立场，虚构AI角色的建模则基于特定的批评范式和文化视角。</span>
  <span lang="en">Based on historical documents and theoretical texts, establish detailed persona models for each critic. Real historical figures are modeled based on their representative works and theoretical positions, while fictional AI personas are modeled based on specific critical paradigms and cultural perspectives.</span>
</p>

<p>
  <span lang="zh">角色建模包括以下关键要素：</span>
  <span lang="en">Persona modeling includes the following key elements:</span>
</p>

<ul>
  <li>
    <strong>
      <span lang="zh">美学观点</span>
      <span lang="en">Aesthetic Views</span>
    </strong>
    <span lang="zh">：每位评论家对艺术本质和美学价值的核心理解</span>
    <span lang="en">: Each critic's core understanding of art's essence and aesthetic value</span>
  </li>
  <li>
    <strong>
      <span lang="zh">哲学立场</span>
      <span lang="en">Philosophical Stance</span>
    </strong>
    <span lang="zh">：评论家的世界观、价值观和理论基础</span>
    <span lang="en">: The critic's worldview, values, and theoretical foundation</span>
  </li>
  <li>
    <strong>
      <span lang="zh">评论风格</span>
      <span lang="en">Critical Style</span>
    </strong>
    <span lang="zh">：语言特点、论证方式和表达习惯</span>
    <span lang="en">: Linguistic characteristics, argumentation methods, and expressive habits</span>
  </li>
  <li>
    <strong>
      <span lang="zh">文化背景</span>
      <span lang="en">Cultural Background</span>
    </strong>
    <span lang="zh">：评论家所处的历史时期、地域文化和社会环境</span>
    <span lang="en">: The critic's historical period, regional culture, and social environment</span>
  </li>
</ul>
```

4. Save file
5. Test

**Success Criteria**:
- [ ] Heading bilingual
- [ ] Content bilingual (~150 words English)

---

### Task 5.4: Translate Step 3 "评论生成系统"
**Estimate**: 40 min
**File**: `pages/process.html`

**Steps**:
1. Find Step 3 section (lines 77-91)
2. Translate heading:
```html
<h2>
  <span lang="zh">3. 评论生成系统</span>
  <span lang="en">3. Critique Generation System</span>
</h2>
```

3. Translate content:
```html
<p>
  <span lang="zh">使用大语言模型（Claude Sonnet 4.5）基于角色设定和RPAIT框架生成评论。系统通过精心设计的提示词（prompt）确保评论符合各评论家的风格和理论立场。</span>
  <span lang="en">Use large language models (Claude Sonnet 4.5) to generate critiques based on persona settings and the RPAIT framework. The system ensures critiques align with each critic's style and theoretical position through carefully designed prompts.</span>
</p>

<p>
  <span lang="zh">评论生成流程包括：</span>
  <span lang="en">The critique generation process includes:</span>
</p>

<ul>
  <li>
    <strong>
      <span lang="zh">Prompt工程</span>
      <span lang="en">Prompt Engineering</span>
    </strong>
    <span lang="zh">：为每位评论家设计专门的提示词模板，包含角色设定、理论背景和评价框架</span>
    <span lang="en">: Designing specialized prompt templates for each critic, including persona settings, theoretical background, and evaluation framework</span>
  </li>
  <li>
    <strong>
      <span lang="zh">初稿生成</span>
      <span lang="en">Initial Draft Generation</span>
    </strong>
    <span lang="zh">：AI根据提示词和RPAIT框架生成评论初稿</span>
    <span lang="en">: AI generates initial critique drafts based on prompts and the RPAIT framework</span>
  </li>
  <li>
    <strong>
      <span lang="zh">质量控制</span>
      <span lang="en">Quality Control</span>
    </strong>
    <span lang="zh">：检查评论是否符合角色设定、理论一致性和语言风格</span>
    <span lang="en">: Checking whether critiques align with persona settings, theoretical consistency, and linguistic style</span>
  </li>
  <li>
    <strong>
      <span lang="zh">迭代优化</span>
      <span lang="en">Iterative Refinement</span>
    </strong>
    <span lang="zh">：根据反馈调整提示词和评论内容，直至满足质量标准</span>
    <span lang="en">: Adjusting prompts and critique content based on feedback until meeting quality standards</span>
  </li>
</ul>
```

4. Save file
5. Test

**Success Criteria**:
- [ ] Heading bilingual
- [ ] Content bilingual (~150 words English)

---

### Task 5.5: Translate Step 4 "数据标注与验证"
**Estimate**: 40 min
**File**: `pages/process.html`

**Steps**:
1. Find Step 4 section (lines 92-106)
2. Translate heading:
```html
<h2>
  <span lang="zh">4. 数据标注与验证</span>
  <span lang="en">4. Data Annotation and Validation</span>
</h2>
```

3. Translate content:
```html
<p>
  <span lang="zh">对生成的评论进行人工审核和质量验证。研究团队从历史准确性、理论一致性和学术规范等多个维度对评论进行评估，确保数据集的学术价值。</span>
  <span lang="en">Conduct human review and quality validation of generated critiques. The research team evaluates critiques from multiple dimensions including historical accuracy, theoretical consistency, and academic standards, ensuring the dataset's scholarly value.</span>
</p>

<p>
  <span lang="zh">验证流程包括：</span>
  <span lang="en">The validation process includes:</span>
</p>

<ul>
  <li>
    <strong>
      <span lang="zh">历史准确性验证</span>
      <span lang="en">Historical Accuracy Verification</span>
    </strong>
    <span lang="zh">：核对评论是否符合评论家的历史立场和理论观点</span>
    <span lang="en">: Verifying whether critiques align with critics' historical positions and theoretical views</span>
  </li>
  <li>
    <strong>
      <span lang="zh">理论一致性检查</span>
      <span lang="en">Theoretical Consistency Check</span>
    </strong>
    <span lang="zh">：确保评论在理论逻辑和论证方式上保持一致</span>
    <span lang="en">: Ensuring critiques maintain consistency in theoretical logic and argumentation methods</span>
  </li>
  <li>
    <strong>
      <span lang="zh">RPAIT评分复核</span>
      <span lang="en">RPAIT Scoring Review</span>
    </strong>
    <span lang="zh">：验证五维度评分是否合理反映评论内容</span>
    <span lang="en">: Verifying whether five-dimensional scores reasonably reflect critique content</span>
  </li>
  <li>
    <strong>
      <span lang="zh">交叉验证</span>
      <span lang="en">Cross-Validation</span>
    </strong>
    <span lang="zh">：多位研究人员独立审核同一评论，确保评估的客观性</span>
    <span lang="en">: Multiple researchers independently review the same critique to ensure objectivity</span>
  </li>
</ul>
```

4. Save file
5. Test

**Success Criteria**:
- [ ] Heading bilingual
- [ ] Content bilingual (~150 words English)

---

### Task 5.6: Translate Step 5 "系统展示与应用"
**Estimate**: 40 min
**File**: `pages/process.html`

**Steps**:
1. Find Step 5 section (lines 107-121)
2. Translate heading:
```html
<h2>
  <span lang="zh">5. 系统展示与应用</span>
  <span lang="en">5. System Exhibition and Application</span>
</h2>
```

3. Translate content:
```html
<p>
  <span lang="zh">将评论系统通过网站形式向公众展示。开发交互式展览平台，让观众可以切换不同评论家视角，探索多维度的艺术评论，体验跨时代的艺术对话。</span>
  <span lang="en">Present the critique system to the public through a website. Develop an interactive exhibition platform allowing audiences to switch between different critic perspectives, explore multi-dimensional art criticism, and experience cross-temporal artistic dialogue.</span>
</p>

<p>
  <span lang="zh">系统开发包括：</span>
  <span lang="en">System development includes:</span>
</p>

<ul>
  <li>
    <strong>
      <span lang="zh">网站架构设计</span>
      <span lang="en">Website Architecture Design</span>
    </strong>
    <span lang="zh">：设计沉浸式主画廊和详细内容页面的分离式架构</span>
    <span lang="en">: Designing a separated architecture of immersive main gallery and detailed content pages</span>
  </li>
  <li>
    <strong>
      <span lang="zh">交互设计</span>
      <span lang="en">Interaction Design</span>
    </strong>
    <span lang="zh">：实现评论家切换、作品浏览和RPAIT维度可视化等交互功能</span>
    <span lang="en">: Implementing interactive features including critic switching, artwork browsing, and RPAIT dimension visualization</span>
  </li>
  <li>
    <strong>
      <span lang="zh">视觉设计</span>
      <span lang="en">Visual Design</span>
    </strong>
    <span lang="zh">：采用"幽灵UI"美学，营造沉浸式艺术展览氛围</span>
    <span lang="en">: Adopting "Ghost UI" aesthetics to create an immersive art exhibition atmosphere</span>
  </li>
  <li>
    <strong>
      <span lang="zh">响应式优化</span>
      <span lang="en">Responsive Optimization</span>
    </strong>
    <span lang="zh">：确保网站在手机、平板和桌面设备上都能良好显示</span>
    <span lang="en">: Ensuring the website displays well on mobile, tablet, and desktop devices</span>
  </li>
</ul>
```

4. Save file
5. Test

**Success Criteria**:
- [ ] Heading bilingual
- [ ] Content bilingual (~150 words English)

---

### Task 5.7: Translate Remaining Steps (if any)
**Estimate**: Variable
**File**: `pages/process.html`

**Steps**:
1. Check if there are more steps beyond Step 5
2. If yes, follow same pattern as Tasks 5.2-5.6
3. Translate each step heading and content
4. Save and test

**Success Criteria**:
- [ ] All remaining steps bilingual

**Note**: Process page mentioned "7个步骤" in proposal, need to verify actual count in HTML.

---

### Task 5.8: Translate Footer
**Estimate**: 10 min
**File**: `pages/process.html`

**Steps**:
1. Find footer
2. Translate (same as other pages):
```html
<footer class="page-footer">
  <p>
    <span lang="zh">© 2024 VULCA. All rights reserved.</span>
    <span lang="en">© 2024 VULCA. All rights reserved.</span>
  </p>
  <p><a href="mailto:info@vulcaart.art">info@vulcaart.art</a></p>
</footer>
```
3. Save file

**Success Criteria**:
- [ ] Footer bilingual

---

### Task 5.9: Test process.html Completely
**Estimate**: 30 min

**Steps**:
1. Visit `http://localhost:9999/pages/process.html`
2. Verify default language (zh)
3. Click language toggle → verify all content switches
4. Check each step section:
   - [ ] Page header
   - [ ] Step 1: 研究设计
   - [ ] Step 2: 评论家角色建模
   - [ ] Step 3: 评论生成系统
   - [ ] Step 4: 数据标注与验证
   - [ ] Step 5: 系统展示与应用
   - [ ] Any additional steps
   - [ ] Footer
5. Test URL: `?lang=en`
6. Fix any issues

**Success Criteria**:
- [ ] All sections bilingual
- [ ] Total ~1000 words English added
- [ ] No layout breaks
- [ ] Terminology consistent

---

## Phase 6: Main Page (index.html) (1 hour)

### Task 6.1: Identify UI Text Elements
**Estimate**: 20 min
**File**: `index.html`

**Steps**:
1. Open `index.html`
2. Search for all user-visible text that's not in `js/data.js`
3. Create list of elements to translate:
   - [ ] Loading states (if any)
   - [ ] Error messages (if any)
   - [ ] Tooltip text (if any)
   - [ ] Button labels (if any)
   - [ ] Other UI text
4. Document findings

**Success Criteria**:
- [ ] Complete list of UI text to translate

---

### Task 6.2: Translate Identified UI Elements
**Estimate**: 30 min
**File**: `index.html`

**Steps**:
1. For each UI element identified in Task 6.1:
2. Apply bilingual pattern:
```html
<element>
  <span lang="zh">中文文本</span>
  <span lang="en">English Text</span>
</element>
```
3. Save file
4. Test each element

**Success Criteria**:
- [ ] All UI elements bilingual
- [ ] No hardcoded Chinese text remains

---

### Task 6.3: Test index.html
**Estimate**: 10 min

**Steps**:
1. Visit `http://localhost:9999`
2. Toggle language
3. Verify all UI text switches
4. Test URL parameter: `?lang=en`
5. Fix any issues

**Success Criteria**:
- [ ] All UI text switches correctly
- [ ] No missing translations
- [ ] Dynamic content (artworks, critiques) already bilingual (from js/data.js)

---

## Phase 7: Validation & Testing (2 hours)

### Task 7.1: Language Switching Functionality Test
**Estimate**: 30 min

**Test Cases**:
1. **Test 1: Manual Toggle**:
   - [ ] Click toggle → language switches
   - [ ] localStorage updated
   - [ ] Menu labels update
   - [ ] Meta tags update
   - [ ] All page content switches

2. **Test 2: URL Parameter**:
   - [ ] `?lang=en` → displays English
   - [ ] `?lang=zh` → displays Chinese
   - [ ] localStorage NOT updated

3. **Test 3: Persistence**:
   - [ ] Set language to English
   - [ ] Refresh page → still English
   - [ ] Open new tab → still English
   - [ ] Close browser and reopen → still English

4. **Test 4: Priority Logic**:
   - [ ] localStorage='en', visit `?lang=zh` → displays Chinese
   - [ ] localStorage NOT changed to 'zh'
   - [ ] Remove URL param → reverts to English

**Success Criteria**:
- [ ] All test cases pass

---

### Task 7.2: Translation Quality Review
**Estimate**: 45 min

**Review Process**:
1. **Accuracy Check**: Read all English translations, verify meaning matches Chinese
2. **Terminology Check**: Use `TRANSLATION_GLOSSARY.md` to verify all specialized terms
3. **Grammar Check**: Proofread for grammar errors, typos
4. **Style Check**: Verify academic writing style, formal tone

**Checklist**:
- [ ] about.html: All translations accurate (~800 words)
- [ ] critics.html: All translations accurate (~300 words)
- [ ] process.html: All translations accurate (~1000 words)
- [ ] index.html: All UI text accurate
- [ ] Navigation menu: All labels correct
- [ ] No grammar errors found
- [ ] Terminology 100% consistent

**Success Criteria**:
- [ ] Grammar error rate < 0.5%
- [ ] Terminology consistency > 95%
- [ ] All translations approved

---

### Task 7.3: Terminology Consistency Validation
**Estimate**: 15 min

**Steps**:
1. Open `TRANSLATION_GLOSSARY.md`
2. For each term in glossary:
   - [ ] Search all HTML files for English translation
   - [ ] Verify term used consistently
   - [ ] Note any inconsistencies
3. Fix inconsistencies if found
4. Update glossary if new terms discovered

**Validation Method**:
```bash
# Example: Check "Representation" consistency
rg "代表性" pages/*.html --context 1 | grep "Representation"

# Should find multiple matches, all using "Representation"
# (not "Representativeness" or other variants)
```

**Success Criteria**:
- [ ] All glossary terms used consistently
- [ ] No alternative translations found
- [ ] Glossary complete (no missing terms)

---

### Task 7.4: Responsive Layout Testing
**Estimate**: 20 min

**Test Devices**:
1. **Mobile (375px)**:
   - [ ] about.html: All content displays correctly
   - [ ] critics.html: Cards stack vertically
   - [ ] process.html: Text wraps properly
   - [ ] English text doesn't break layout

2. **Tablet (768px)**:
   - [ ] All pages readable
   - [ ] Menu accessible
   - [ ] No horizontal scroll

3. **Desktop (1440px)**:
   - [ ] All pages render beautifully
   - [ ] English text doesn't overflow containers

**Success Criteria**:
- [ ] All pages responsive on all devices
- [ ] No layout breaks from English content

---

### Task 7.5: Cross-Browser Testing
**Estimate**: 20 min

**Browsers**:
1. **Chrome 90+**:
   - [ ] Language switch works
   - [ ] CSS rules apply correctly
   - [ ] No console errors

2. **Firefox 88+**:
   - [ ] Language switch works
   - [ ] CSS rules apply correctly
   - [ ] No console errors

3. **Safari 14+**:
   - [ ] Language switch works
   - [ ] CSS rules apply correctly
   - [ ] localStorage works

4. **Edge 90+**:
   - [ ] Language switch works
   - [ ] All functionality works

**Success Criteria**:
- [ ] All browsers pass all tests
- [ ] No browser-specific issues

---

### Task 7.6: Performance Validation
**Estimate**: 10 min

**Metrics**:
1. **File Size**:
   - [ ] about.html: ~24KB (doubled from 12KB)
   - [ ] critics.html: ~12KB (doubled from 6KB)
   - [ ] process.html: ~28KB (doubled from 14KB)
   - [ ] Total increase: ~30KB (acceptable)

2. **Load Time**:
   - [ ] Initial page load: < 500ms (no significant increase)
   - [ ] Language switch: < 10ms (instant)

3. **Memory**:
   - [ ] No memory leaks after repeated language switching

**Success Criteria**:
- [ ] Performance degradation < 10%
- [ ] User experience unaffected

---

### Task 7.7: Create Final Validation Report
**Estimate**: 20 min
**File**: `BILINGUAL_VALIDATION_REPORT.md`

**Steps**:
1. Create new file `BILINGUAL_VALIDATION_REPORT.md`
2. Document:
   - [ ] Test results summary
   - [ ] Translation statistics (word count per page)
   - [ ] Issues found and fixed
   - [ ] Browser compatibility matrix
   - [ ] Performance metrics
   - [ ] Final approval status

**Template**:
```markdown
# Bilingual Support Validation Report

**Date**: 2025-11-03
**Validator**: [Name]

## Translation Statistics

| Page | Chinese Words | English Words | Status |
|------|---------------|---------------|--------|
| about.html | ~800 | ~800 | ✅ Complete |
| critics.html | ~300 | ~300 | ✅ Complete |
| process.html | ~1000 | ~1000 | ✅ Complete |
| index.html | ~50 | ~50 | ✅ Complete |
| **Total** | ~2150 | ~2150 | ✅ Complete |

## Functionality Tests

- [x] Language toggle button
- [x] URL parameter support
- [x] localStorage persistence
- [x] Menu labels update
- [x] Meta tags update

## Quality Assurance

- [x] Translation accuracy verified
- [x] Terminology consistency: 100%
- [x] Grammar error rate: 0%
- [x] Academic style maintained

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Pass |
| Firefox | 88+ | ✅ Pass |
| Safari | 14+ | ✅ Pass |
| Edge | 90+ | ✅ Pass |

## Performance

- Initial load time: 450ms (baseline: 420ms, +7%)
- Language switch time: 6ms
- Memory usage: +15KB (+12%)

## Issues Found

None

## Final Approval

✅ **APPROVED** - Ready for deployment

Signature: ___________________
Date: ___________________
```

3. Fill in all sections based on test results
4. Save file

**Success Criteria**:
- [ ] Report complete
- [ ] All sections filled
- [ ] Final approval given (or issues documented)

---

## Summary

**Total Estimated Time**: 17.5 hours (1050 minutes)

**Phase Breakdown**:
- Phase 1: Core Infrastructure - 2 hours
- Phase 2: Navigation & UI Elements - 1.5 hours
- Phase 3: About Page - 4 hours
- Phase 4: Critics Page - 2 hours
- Phase 5: Process Page - 5 hours
- Phase 6: Main Page - 1 hour
- Phase 7: Validation & Testing - 2 hours

**Files Modified**:
- HTML: 4 files (index.html, about.html, critics.html, process.html)
- CSS: 1 file (main.css +30 lines)
- JavaScript: 5 files (3 new, 2 updated)
  - New: navigation-i18n.js, lang-manager.js, meta-i18n.js
  - Updated: navigation.js (minor), inline scripts (all pages)

**New Files Created**:
- TRANSLATION_GLOSSARY.md
- BILINGUAL_VALIDATION_REPORT.md

**Translation Volume**:
- Total: ~2150 words (Chinese) → ~2150 words (English)
- about.html: ~800 words
- critics.html: ~300 words
- process.html: ~1000 words
- index.html + UI: ~50 words

**Deliverables**:
- [ ] All pages support bilingual switching
- [ ] URL parameter `?lang=en/zh` works
- [ ] localStorage persistence works
- [ ] Translation glossary complete
- [ ] Validation report approved

---

**Task List Status**: Draft
**Last Updated**: 2025-11-03
**Ready for Implementation**: Yes
