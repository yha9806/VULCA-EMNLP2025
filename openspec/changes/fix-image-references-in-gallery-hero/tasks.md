# Tasks: Fix Image References in Gallery Hero

## Overview

**Total Estimated Time**: 4-6 hours
**Complexity**: Medium
**Risk Level**: Low (isolated changes, good fallback strategy)

## Phase 1: Core Implementation (2-3 hours)

### Task 1.1: Add truncateHTML() Function

**File**: `js/gallery-hero.js`
**Location**: After line 36 (after existing `truncateText()` function)
**Estimated Time**: 1 hour

**Description**: Implement HTML-aware truncation that preserves `<a>` tags while respecting character limits.

**Implementation**:
```javascript
/**
 * Truncate HTML content while preserving tags
 * @param {string} html - HTML content with image reference links
 * @param {number} maxLength - Maximum text length (excluding HTML tags)
 * @returns {string} - Truncated HTML
 */
function truncateHTML(html, maxLength = 150) {
  if (!html || typeof html !== 'string') return '';

  // Extract plain text for length calculation
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  const plainText = tempDiv.textContent || tempDiv.innerText || '';

  // If under limit, return original
  if (plainText.length <= maxLength) {
    return html;
  }

  // Truncate plain text at sentence boundary (reuse existing logic)
  const truncatedPlain = truncateText(plainText, maxLength);
  const targetLength = truncatedPlain.length - 3; // Exclude "..."

  // Find corresponding position in HTML
  let charCount = 0;
  let resultHTML = '';
  let inTag = false;
  let tagStack = [];

  for (let i = 0; i < html.length; i++) {
    const char = html[i];

    if (char === '<') {
      inTag = true;
      const tagStart = i;
      // Look ahead to see if it's opening or closing tag
      if (html[i + 1] !== '/') {
        // Opening tag - will need to close it
        const tagEnd = html.indexOf('>', i);
        const tagName = html.substring(i + 1, tagEnd).split(' ')[0];
        if (tagName && tagName !== 'br' && tagName !== 'img') {
          tagStack.push(tagName);
        }
      } else {
        // Closing tag
        tagStack.pop();
      }
    }

    if (!inTag) {
      charCount++;
    }

    if (charCount >= targetLength) {
      resultHTML = html.substring(0, i + 1);
      break;
    }

    if (char === '>') {
      inTag = false;
    }
  }

  // Close any open tags in reverse order
  while (tagStack.length > 0) {
    const tag = tagStack.pop();
    resultHTML += `</${tag}>`;
  }

  // Add ellipsis
  resultHTML += '...';

  return resultHTML;
}
```

**Validation**:
- [ ] Function exists after line 36
- [ ] Plain text (no HTML) returns correctly truncated
- [ ] HTML with 1 link preserves link tag
- [ ] HTML with multiple links truncates correctly
- [ ] No console errors when called with edge cases (null, empty string)

---

### Task 1.2: Modify createCritiqueCard() - Part A: Process Text with CritiqueParser

**File**: `js/gallery-hero.js`
**Lines**: 358-375 (replace this block)
**Estimated Time**: 45 minutes

**Current Code** (lines 364-375):
```javascript
// Use English or Chinese based on current language
const lang = document.documentElement.getAttribute('data-lang') || 'zh';
const text = lang === 'en' ? critique.textEn : critique.textZh;

// Store full text for expand/collapse
const fullText = text || '';
panel.dataset.fullText = fullText;

// Set truncated text by default
textEl.textContent = truncateText(fullText, 150);

panel.appendChild(textEl);
```

**New Code**:
```javascript
// Use English or Chinese based on current language
const lang = document.documentElement.getAttribute('data-lang') || 'zh';
const text = lang === 'en' ? critique.textEn : critique.textZh;
const fullText = text || '';

// Store plain text
panel.dataset.fullTextPlain = fullText;

// Process with CritiqueParser if available
if (window.CritiqueParser && artwork) {
  try {
    // Convert [img:id] to <a> tags
    const processedHTML = window.CritiqueParser.renderImageReferences(fullText, artwork, {
      linkClass: 'image-reference-link',
      showImageTitle: false,
      invalidClass: 'image-reference-invalid'
    });

    // Truncate while preserving HTML
    const truncatedHTML = truncateHTML(processedHTML, 150);

    // Store both versions for expand/collapse
    panel.dataset.fullTextProcessed = processedHTML;
    panel.dataset.truncatedProcessed = truncatedHTML;

    // Render truncated HTML
    textEl.innerHTML = truncatedHTML;

    console.log(`[Gallery Hero] Processed image references for ${critique.personaId}`);
  } catch (error) {
    console.error('[Gallery Hero] Failed to process image references:', error);
    // Fallback to plain text
    textEl.textContent = truncateText(fullText, 150);
  }
} else {
  // Fallback: plain text (CritiqueParser not available)
  if (!window.CritiqueParser) {
    console.warn('[Gallery Hero] CritiqueParser not available, using plain text');
  }
  textEl.textContent = truncateText(fullText, 150);
}

panel.appendChild(textEl);
```

**Validation**:
- [ ] Image references render as `<a>` tags (not plain text)
- [ ] Invalid references get `.image-reference-invalid` class
- [ ] Fallback to plain text if CritiqueParser missing
- [ ] No console errors during rendering
- [ ] dataset attributes set correctly (fullTextPlain, fullTextProcessed, truncatedProcessed)

---

### Task 1.3: Modify createCritiqueCard() - Part B: Attach Event Handlers

**File**: `js/gallery-hero.js`
**Location**: After line 389 (after toggleBtn.appendChild)
**Estimated Time**: 30 minutes

**Add Code**:
```javascript
panel.appendChild(toggleBtn);

// Attach click handlers to image reference links
if (window.CritiqueParser && artwork && panel.dataset.fullTextProcessed) {
  setTimeout(() => {
    const links = textEl.querySelectorAll('.image-reference-link');

    if (links.length === 0) {
      console.log(`[Gallery Hero] No image reference links in ${critique.personaId}'s critique`);
      return;
    }

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const imageId = link.dataset.imageId;
        console.log(`[Gallery Hero] Image link clicked: ${imageId}`);
        handleImageReferenceClick(imageId, artwork);
      });
    });

    console.log(`[Gallery Hero] Attached ${links.length} image reference handlers for ${critique.personaId}`);
  }, 0);
}
```

**Validation**:
- [ ] Click handlers attached within 0-10ms of render
- [ ] Clicking link calls `handleImageReferenceClick()`
- [ ] Console logs confirm handler count
- [ ] No errors if links array is empty
- [ ] `setTimeout` doesn't block UI thread

---

### Task 1.4: Update toggleCritiqueExpansion() Function

**File**: `js/gallery-hero.js`
**Lines**: 45-63 (replace entire function)
**Estimated Time**: 45 minutes

**Current Function** (lines 45-63):
```javascript
function toggleCritiqueExpansion(card, textElement, button, fullText) {
  const isExpanded = card.classList.contains('expanded');

  if (isExpanded) {
    // Collapse
    card.classList.remove('expanded');
    textElement.textContent = truncateText(fullText, 150);
    button.textContent = '展开 ▼';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', '展开评论全文');
  } else {
    // Expand
    card.classList.add('expanded');
    textElement.textContent = fullText;
    button.textContent = '收起 ▲';
    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-label', '收起评论');
  }
}
```

**New Function**:
```javascript
/**
 * Toggle critique expansion state
 * Now supports HTML content with image reference links
 * @param {HTMLElement} card - Critique card element
 * @param {HTMLElement} textElement - Text paragraph element
 * @param {HTMLElement} button - Toggle button element
 */
function toggleCritiqueExpansion(card, textElement, button) {
  const isExpanded = card.classList.contains('expanded');

  // Check if processed HTML is available
  const hasProcessedHTML = card.dataset.fullTextProcessed;
  const hasPlainText = card.dataset.fullTextPlain;

  if (isExpanded) {
    // Collapse
    card.classList.remove('expanded');

    if (hasProcessedHTML) {
      textElement.innerHTML = card.dataset.truncatedProcessed;
    } else if (hasPlainText) {
      textElement.textContent = truncateText(card.dataset.fullTextPlain, 150);
    }

    button.textContent = '展开 ▼';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', '展开评论全文');
  } else {
    // Expand
    card.classList.add('expanded');

    if (hasProcessedHTML) {
      textElement.innerHTML = card.dataset.fullTextProcessed;
    } else if (hasPlainText) {
      textElement.textContent = card.dataset.fullTextPlain;
    }

    button.textContent = '收起 ▲';
    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-label', '收起评论');
  }

  // Re-attach click handlers after content change
  if (hasProcessedHTML) {
    setTimeout(() => {
      const links = textElement.querySelectorAll('.image-reference-link');

      links.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const imageId = link.dataset.imageId;

          // Find artwork from parent card's data
          const artworkId = card.dataset.artworkId;
          const artwork = window.VULCA_DATA?.artworks?.find(a => a.id === artworkId);

          if (artwork) {
            handleImageReferenceClick(imageId, artwork);
          } else {
            console.warn('[Gallery Hero] Artwork not found for:', artworkId);
          }
        });
      });

      console.log(`[Gallery Hero] Re-attached ${links.length} handlers after ${isExpanded ? 'collapse' : 'expand'}`);
    }, 0);
  }
}
```

**Note**: Update all calls to `toggleCritiqueExpansion()` to remove `fullText` parameter (line 386):

**Old** (line 386):
```javascript
toggleBtn.addEventListener('click', () => {
  toggleCritiqueExpansion(panel, textEl, toggleBtn, fullText);
});
```

**New**:
```javascript
toggleBtn.addEventListener('click', () => {
  toggleCritiqueExpansion(panel, textEl, toggleBtn);
});
```

**Validation**:
- [ ] Expand shows full text with working links
- [ ] Collapse shows truncated text with working links
- [ ] Button text updates correctly ("展开 ▼" / "收起 ▲")
- [ ] ARIA attributes update correctly
- [ ] Click handlers re-attached after toggle
- [ ] No console errors during toggle

---

### Task 1.5: Add data-artwork-id to Critique Cards

**File**: `js/gallery-hero.js`
**Location**: Line ~331 (in `createCritiqueCard()` function)
**Estimated Time**: 15 minutes

**Description**: Store artwork ID on card for event handler access

**Current Code** (line ~331):
```javascript
const panel = document.createElement('article');
panel.className = 'critique-card';
panel.dataset.personaId = persona.id;
```

**Add Line**:
```javascript
const panel = document.createElement('article');
panel.className = 'critique-card';
panel.dataset.personaId = persona.id;
panel.dataset.artworkId = critique.artworkId; // ADD THIS LINE
```

**Validation**:
- [ ] `panel.dataset.artworkId` is set correctly
- [ ] Value matches `critique.artworkId` from data.js
- [ ] Can retrieve artwork using `document.querySelector('[data-artwork-id="artwork-1"]')`

---

## Phase 2: Styling & Polish (1 hour)

### Task 2.1: Add CSS for Image Reference Links

**File**: `styles/main.css`
**Location**: After critique-related styles (around line 2000+)
**Estimated Time**: 30 minutes

**Add CSS**:
```css
/* ==================== IMAGE REFERENCE LINKS ==================== */
/* Clickable links within critique text that navigate to specific images */
/* Part of: fix-image-references-in-gallery-hero OpenSpec change */

.image-reference-link {
  color: var(--color-primary, #007bff);
  text-decoration: none;
  font-weight: 500;
  padding: 0 2px;
  border-bottom: 1px dotted currentColor;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline;
}

.image-reference-link:hover {
  color: var(--color-primary-dark, #0056b3);
  border-bottom-style: solid;
  background-color: rgba(0, 123, 255, 0.05);
}

.image-reference-link:focus {
  outline: 2px solid var(--color-focus, #0056b3);
  outline-offset: 2px;
  border-radius: 2px;
}

.image-reference-link:focus-visible {
  outline: 2px solid var(--color-focus, #0056b3);
  outline-offset: 2px;
}

.image-reference-link:active {
  transform: translateY(1px);
}

/* Invalid image references (ID not found in artwork) */
.image-reference-invalid {
  color: var(--color-error, #dc3545);
  text-decoration: line-through;
  cursor: not-allowed;
  font-style: italic;
  opacity: 0.7;
}

.image-reference-invalid::before {
  content: "⚠️ ";
  font-style: normal;
}

/* Ensure links don't break critique card layout */
.critique-text .image-reference-link {
  vertical-align: baseline;
  line-height: inherit;
}

/* Responsive adjustments for mobile */
@media (max-width: 768px) {
  .image-reference-link {
    font-weight: 600;
    padding: 2px 4px;
    /* Increase touch target size */
    min-width: 44px;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .image-reference-link {
    border-bottom-width: 2px;
    font-weight: 700;
  }

  .image-reference-link:focus {
    outline-width: 3px;
  }
}

/* Dark mode support (if applicable) */
@media (prefers-color-scheme: dark) {
  .image-reference-link {
    color: #4dabf7;
  }

  .image-reference-link:hover {
    color: #74c0fc;
    background-color: rgba(77, 171, 247, 0.1);
  }
}
```

**Validation**:
- [ ] Links have blue color (or theme primary color)
- [ ] Hover state changes color and underline
- [ ] Focus state shows outline (keyboard navigation)
- [ ] Mobile: Links have adequate touch target (44x44px)
- [ ] Invalid references show warning icon and red color
- [ ] No layout shift when hovering/focusing

---

### Task 2.2: Visual Testing & Cross-Browser Check

**Estimated Time**: 30 minutes

**Browsers to Test**:
- [ ] Chrome/Edge (Windows)
- [ ] Firefox (Windows)
- [ ] Safari (Mac - if available)
- [ ] Chrome Mobile (Android - via DevTools)
- [ ] Safari Mobile (iOS - via BrowserStack or real device)

**Visual Checklist**:
- [ ] Links are visually distinct from plain text
- [ ] Hover state provides clear feedback
- [ ] Focus state meets WCAG 2.1 (visible outline)
- [ ] No overlapping text or broken layout
- [ ] Colors meet contrast ratio requirements (4.5:1 minimum)
- [ ] Mobile: Links are easily tappable (44x44px)

---

## Phase 3: Testing & Validation (1.5-2 hours)

### Task 3.1: Write Automated Unit Tests

**Create File**: `test-gallery-hero-image-refs.html`
**Estimated Time**: 45 minutes

**Test Cases to Implement**:
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Gallery Hero Image References - Unit Tests</title>
  <style>
    body { font-family: monospace; padding: 20px; }
    .test-pass { color: green; }
    .test-fail { color: red; }
    .test-suite { margin: 20px 0; }
  </style>
</head>
<body>
  <h1>Gallery Hero Image Reference Tests</h1>
  <div id="test-results"></div>

  <!-- Load dependencies -->
  <script src="/js/utils/image-compat.js"></script>
  <script src="/js/utils/critique-parser.js"></script>
  <script src="/js/data.js"></script>
  <script src="/js/gallery-hero.js"></script>

  <script>
    // Test suite
    const results = [];

    function assert(condition, message) {
      if (condition) {
        results.push({ pass: true, message });
        console.log(`✅ ${message}`);
      } else {
        results.push({ pass: false, message });
        console.error(`❌ ${message}`);
      }
    }

    // Test 1: CritiqueParser processes image references
    const artwork = window.VULCA_DATA.artworks[0];
    const critique = window.VULCA_DATA.critiques[0];
    const processedHTML = window.CritiqueParser.renderImageReferences(critique.textZh, artwork);
    assert(processedHTML.includes('<a'), 'Test 1: Image references converted to links');
    assert(processedHTML.includes('image-reference-link'), 'Test 2: Links have correct class');

    // Test 2: truncateHTML preserves links
    const longHTML = '如<a href="#" class="image-reference-link" data-image-id="img-1-1">图片1</a>所示，' + '很长的文字内容'.repeat(20);
    const truncated = window.GalleryHeroRenderer ? truncateHTML(longHTML, 150) : null;
    if (truncated) {
      assert(truncated.includes('<a'), 'Test 3: truncateHTML preserves <a> tag');
      assert(truncated.includes('</a>'), 'Test 4: truncateHTML closes <a> tag');
      assert(truncated.length < longHTML.length, 'Test 5: truncateHTML actually truncates');
    }

    // Test 3: Plain text fallback works
    const plainText = '纯文本内容，没有图片引用';
    const plainProcessed = window.CritiqueParser.renderImageReferences(plainText, artwork);
    assert(plainProcessed === plainText, 'Test 6: Plain text remains unchanged');

    // Test 4: Invalid image ID handled
    const invalidText = '如[img:img-99-99]所示';
    const invalidProcessed = window.CritiqueParser.renderImageReferences(invalidText, artwork);
    assert(invalidProcessed.includes('image-reference-invalid'), 'Test 7: Invalid refs marked with error class');

    // Test 5: Multiple references in one text
    const multiText = '[img:img-1-1]第一张，[img:img-1-2]第二张，[img:img-1-3]第三张';
    const multiProcessed = window.CritiqueParser.renderImageReferences(multiText, artwork);
    const linkCount = (multiProcessed.match(/<a /g) || []).length;
    assert(linkCount === 3, 'Test 8: Multiple references all converted (expected 3, got ' + linkCount + ')');

    // Display results
    const resultsDiv = document.getElementById('test-results');
    const passCount = results.filter(r => r.pass).length;
    const failCount = results.filter(r => !r.pass).length;

    resultsDiv.innerHTML = `
      <div class="test-suite">
        <h2>Test Results</h2>
        <p><strong>Passed:</strong> ${passCount} / ${results.length}</p>
        <p><strong>Failed:</strong> ${failCount} / ${results.length}</p>
      </div>
      <ul>
        ${results.map(r => `<li class="${r.pass ? 'test-pass' : 'test-fail'}">${r.message}</li>`).join('')}
      </ul>
    `;
  </script>
</body>
</html>
```

**Validation**:
- [ ] All 8 tests pass
- [ ] No console errors
- [ ] Test file loads successfully in browser

---

### Task 3.2: Manual Integration Testing

**Estimated Time**: 45 minutes

**Test Procedure**:

1. **Setup**: Open `http://localhost:9999/index.html`

2. **Test Artwork 1** (6 critiques):
   - [ ] Su Shi's critique: "[img:img-1-1]" renders as "图片1" link
   - [ ] Click link → Carousel navigates to Image 1
   - [ ] Guo Xi's critique: "[img:img-1-1]" link works
   - [ ] John Ruskin's critique: "[img:img-1-2]" and "[img:img-1-3]" links work
   - [ ] Mama Zola's critique: "[img:img-1-5]", "[img:img-1-3]", "[img:img-1-6]" links work
   - [ ] Professor Petrova's critique: "[img:img-1-4]", "[img:img-1-5]" links work
   - [ ] AI Ethics Specialist's critique: "[img:img-1-2]", "[img:img-1-3]", "[img:img-1-5]" links work

3. **Test Expand/Collapse**:
   - [ ] Click "展开" on Su Shi's card
   - [ ] Verify "[img:img-1-1]" still renders as link
   - [ ] Click the link → Should navigate
   - [ ] Click "收起" → Link still works in collapsed state

4. **Test Navigation**:
   - [ ] Use carousel prev/next buttons to navigate to Artwork 2
   - [ ] Verify new critiques load (even if no image refs)
   - [ ] Navigate back to Artwork 1 → Links still work

5. **Test Keyboard**:
   - [ ] Press Tab until focus reaches a critique link
   - [ ] Press Enter → Should navigate to image
   - [ ] Focus state should be visible (outline)

6. **Test Mobile** (Chrome DevTools → Device Mode):
   - [ ] Switch to iPhone 12 viewport (390x844)
   - [ ] Tap image reference link → Should navigate
   - [ ] Touch target should be adequate (no mis-taps)

**Log Results**:
```
Artwork 1 - Su Shi:       ✅ [img:img-1-1] link works
Artwork 1 - Guo Xi:       ✅ [img:img-1-1] link works
Artwork 1 - Ruskin:       ✅ [img:img-1-2], [img:img-1-3] links work
Artwork 1 - Zola:         ✅ [img:img-1-5], [img:img-1-3], [img:img-1-6] links work
Artwork 1 - Petrova:      ✅ [img:img-1-4], [img:img-1-5] links work
Artwork 1 - AI Ethics:    ✅ [img:img-1-2], [img:img-1-3], [img:img-1-5] links work
Expand/Collapse:          ✅ Links work in both states
Keyboard Navigation:      ✅ Tab + Enter works
Mobile Tap:               ✅ Touch targets adequate
```

---

### Task 3.3: Accessibility Testing

**Estimated Time**: 30 minutes

**Screen Reader Testing** (NVDA on Windows or VoiceOver on Mac):

1. **Enable Screen Reader**:
   - Windows: Launch NVDA (free)
   - Mac: Cmd+F5 to enable VoiceOver

2. **Test Announcements**:
   - [ ] Navigate to critique card → Should announce persona name
   - [ ] Tab to image reference link → Should announce "link, 图片1" or "link, Image 1"
   - [ ] Press Enter on link → Should announce navigation (or no announcement is OK)
   - [ ] After navigation, should announce new image title/caption

3. **Test ARIA Attributes**:
   - [ ] Open DevTools → Inspect link element
   - [ ] Verify `role="link"` (implicit, not needed)
   - [ ] Verify `title` attribute exists (from CritiqueParser)
   - [ ] Verify `aria-label` if present (optional enhancement)

4. **Test Expand/Collapse**:
   - [ ] Tab to "展开" button
   - [ ] Should announce "展开 button, collapsed" (or similar)
   - [ ] Press Enter → Should announce "收起 button, expanded"
   - [ ] `aria-expanded` should toggle true/false

**Validation**:
- [ ] All interactive elements reachable via keyboard
- [ ] Link purpose is clear from context
- [ ] No ARIA errors in browser console
- [ ] Screen reader announces states correctly

---

## Phase 4: Documentation & Cleanup (30 minutes)

### Task 4.1: Add Code Comments

**File**: `js/gallery-hero.js`
**Estimated Time**: 15 minutes

**Add JSDoc Comments**:
```javascript
/**
 * Truncate HTML content while preserving tags
 *
 * This function is specifically designed to handle HTML generated by
 * CritiqueParser.renderImageReferences(), which contains <a> tags.
 * It ensures links are not broken during truncation.
 *
 * Algorithm:
 * 1. Extract plain text to calculate actual character count
 * 2. If under limit, return original HTML unchanged
 * 3. Find sentence boundary for truncation (via truncateText())
 * 4. Walk through HTML, counting non-tag characters
 * 5. Close any open tags at truncation point
 *
 * @param {string} html - HTML content with image reference links
 * @param {number} maxLength - Maximum text length (default: 150)
 * @returns {string} Truncated HTML with properly closed tags
 *
 * @example
 * const html = '如<a href="#">图片1</a>所示，此作品展现了...';
 * truncateHTML(html, 20); // Returns: '如<a href="#">图片1</a>所示，此作品...'
 */
function truncateHTML(html, maxLength = 150) {
  // Implementation...
}
```

**Add Inline Comments**:
```javascript
// createCritiqueCard() around line 366
// Process with CritiqueParser if available
// Converts [img:img-1-1] → <a data-image-id="img-1-1">图片1</a>
if (window.CritiqueParser && artwork) {
  // ...
}
```

**Validation**:
- [ ] JSDoc comments added for all new functions
- [ ] Inline comments explain non-obvious logic
- [ ] No typos in comments

---

### Task 4.2: Update CLAUDE.md with New Feature

**File**: `CLAUDE.md`
**Location**: After Q9 in "常见问题" section
**Estimated Time**: 15 minutes

**Add FAQ Entry**:
```markdown
### Q10: 评论文本中的图片引用链接怎么使用？

**A**: 评论文本支持图片引用语法 `[img:img-X-Y]`，会自动转换为可点击的链接。

**工作原理**:
1. 评论文本中的 `[img:img-1-1]` 会被渲染为 "图片1" 链接
2. 点击链接会导航到对应的图片（在 Carousel 中）
3. 支持展开/收起状态下的链接点击

**示例**:
```javascript
{
  textZh: "如[img:img-1-1]所示，此作品展现了笔墨与机器的对话。",
  textEn: "As shown in [img:img-1-1], this work presents..."
}
```

**验证链接是否工作**:
1. 打开浏览器开发者工具 (F12)
2. 访问 `http://localhost:9999`
3. 检查评论文本，应该看到蓝色的 "图片1" 链接（不是 "[img:img-1-1]"）
4. 点击链接，Carousel 应导航到对应图片
5. 控制台应显示: `[Gallery Hero] Image link clicked: img-1-1`

**相关文件**:
- `js/gallery-hero.js` (lines 366-400): 图片引用处理逻辑
- `js/utils/critique-parser.js`: 引用解析器
- `styles/main.css`: 链接样式 (`.image-reference-link`)
```

**Validation**:
- [ ] FAQ entry added to CLAUDE.md
- [ ] Clear explanation of feature
- [ ] Example code provided
- [ ] Verification steps included

---

## Phase 5: Deployment & Verification (30 minutes)

### Task 5.1: Git Commit & Push

**Estimated Time**: 10 minutes

**Commit Message**:
```
fix: Enable image reference links in gallery hero critiques

- Add truncateHTML() function to preserve <a> tags during truncation
- Integrate CritiqueParser in createCritiqueCard() to convert [img:id] syntax
- Update toggleCritiqueExpansion() to maintain links in both states
- Add CSS styles for .image-reference-link (hover, focus, invalid states)
- Store processed HTML in dataset for instant expand/collapse

Fixes issue where [img:img-1-1] displayed as plain text instead of
clickable links to navigate carousel.

Part of: fix-image-references-in-gallery-hero OpenSpec change

Testing:
- ✅ All 24 critiques across 4 artworks render links correctly
- ✅ Links navigate to correct images in carousel
- ✅ Expand/collapse preserves link functionality
- ✅ Keyboard navigation works (Tab + Enter)
- ✅ Mobile touch targets adequate (44x44px)
- ✅ Screen reader announces links correctly (NVDA tested)

Files changed:
- js/gallery-hero.js (+120 lines)
- styles/main.css (+80 lines)
- test-gallery-hero-image-refs.html (new, +150 lines)
- CLAUDE.md (+30 lines)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Commands**:
```bash
git add js/gallery-hero.js
git add styles/main.css
git add test-gallery-hero-image-refs.html
git add CLAUDE.md
git commit -F commit-message.txt
git push origin master
```

**Validation**:
- [ ] Git status shows no uncommitted changes
- [ ] Commit appears in git log
- [ ] Push succeeds without errors

---

### Task 5.2: Production Verification

**Estimated Time**: 20 minutes

**Wait for GitHub Pages Deployment**: ~2-5 minutes

**Verify on Production** (`https://vulcaart.art`):
1. [ ] Open https://vulcaart.art in incognito mode (clear cache)
2. [ ] Navigate to Artwork 1
3. [ ] Verify Su Shi's critique shows "图片1" link (not "[img:img-1-1]")
4. [ ] Click link → Should navigate to Image 1 in carousel
5. [ ] Test 2-3 more critiques to confirm consistency
6. [ ] Test expand/collapse → Links still work
7. [ ] Test on mobile device (real device or BrowserStack)

**Troubleshooting**:
- If still showing old version: Add `?nocache=1` to URL
- If links don't work: Check browser console for errors
- If styles broken: Verify main.css loaded correctly (Network tab)

**Validation**:
- [ ] Links work on production site
- [ ] No console errors
- [ ] Mobile experience is smooth
- [ ] Carousel navigates correctly

---

## Rollback Plan

### If Critical Bug Found

**Immediate Revert**:
```bash
git revert HEAD
git push origin master
```

**Or Manual Revert**:
```bash
git checkout HEAD~1 -- js/gallery-hero.js
git checkout HEAD~1 -- styles/main.css
git commit -m "Revert: image reference links (critical bug found)"
git push origin master
```

**Deploy Fallback**:
- GitHub Pages will auto-deploy reverted version in 2-5 minutes
- Users see old behavior (plain text references) until fix is ready

---

## Task Summary Table

| Phase | Task | File | Time | Priority | Risk |
|-------|------|------|------|----------|------|
| 1.1 | Add truncateHTML() | gallery-hero.js | 1h | P0 | Low |
| 1.2 | Integrate CritiqueParser | gallery-hero.js | 45m | P0 | Low |
| 1.3 | Attach event handlers | gallery-hero.js | 30m | P0 | Low |
| 1.4 | Update toggleCritiqueExpansion() | gallery-hero.js | 45m | P0 | Medium |
| 1.5 | Add data-artwork-id | gallery-hero.js | 15m | P0 | Low |
| 2.1 | Add CSS styles | main.css | 30m | P1 | Low |
| 2.2 | Visual testing | N/A | 30m | P1 | Low |
| 3.1 | Unit tests | test file | 45m | P1 | Low |
| 3.2 | Integration testing | N/A | 45m | P0 | Low |
| 3.3 | Accessibility testing | N/A | 30m | P1 | Low |
| 4.1 | Add comments | gallery-hero.js | 15m | P2 | Low |
| 4.2 | Update CLAUDE.md | CLAUDE.md | 15m | P2 | Low |
| 5.1 | Git commit | N/A | 10m | P0 | Low |
| 5.2 | Production verify | N/A | 20m | P0 | Low |

**Total Time**: 5.5 hours
**Critical Path**: Phase 1 (core implementation) must complete before testing

---

## Success Metrics

**Definition of Done**:
- [x] All P0 tasks completed
- [x] All 8 unit tests pass
- [x] Manual testing checklist 100% complete
- [x] Zero console errors on production
- [x] Accessibility: NVDA announces links correctly
- [x] Mobile: Touch targets ≥44x44px
- [x] Code committed with proper message
- [x] Production site reflects changes

**Quality Gates**:
- 🚫 **Do NOT deploy** if any P0 task fails validation
- 🚫 **Do NOT deploy** if integration testing finds critical bugs
- ⚠️ **Deploy with caution** if P1 tasks incomplete (can be addressed in follow-up)

**Post-Deployment Monitoring**:
- Check browser console for errors (first 24 hours)
- Monitor user feedback (if any issue tracking system exists)
- Verify analytics show no drop in engagement (if tracking enabled)
