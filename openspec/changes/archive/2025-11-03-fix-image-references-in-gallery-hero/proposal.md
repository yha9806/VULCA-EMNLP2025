# Proposal: Fix Image References in Gallery Hero Critiques

## Why

### Problem Statement

In the main gallery page (index.html), critique text contains image reference markers like `[img:img-1-1]` that are intended to be rendered as clickable links to navigate to specific images in the artwork carousel. However, **these references are currently displayed as plain text** instead of interactive links.

**Example from data.js (line 323)**:
```
"如[img:img-1-1]所示，此作品展现了笔墨与机器的对话。机械臂如同现代文人画家之手..."
```

**Current Behavior**: Displays literally as "[img:img-1-1]" in the critique card
**Expected Behavior**: Should render as "如图片1所示..." with a clickable link that navigates to image 1

### Root Causes

**Technical Analysis**:

1. **CritiqueParser utility exists and works correctly**
   - Location: `js/utils/critique-parser.js`
   - Function: `renderImageReferences(text, artwork, options)`
   - Converts `[img:id]` → `<a href="#" data-image-id="id">图片N</a>`
   - Already used successfully in `gallery-init.js` (lines 242-268)

2. **gallery-hero.js doesn't use CritiqueParser**
   - Location: `js/gallery-hero.js` lines 358-373
   - Line 373: `textEl.textContent = truncateText(fullText, 150);`
   - Uses `.textContent` which strips all HTML
   - Should use `.innerHTML` with `CritiqueParser.renderImageReferences()`

3. **Inconsistency between two gallery renderers**
   - `gallery-init.js` (older system): ✅ Uses CritiqueParser correctly
   - `gallery-hero.js` (current homepage): ❌ Missing CritiqueParser integration

### Impact

**User Experience**:
- ⚠️ **Critical UX Issue**: Users cannot navigate to referenced images from critiques
- ⚠️ **Confusion**: Text like "[img:img-1-3]" appears as gibberish to users
- ⚠️ **Reduced Engagement**: Multi-image system's full potential is not utilized
- ⚠️ **Accessibility**: Screen reader users get incorrect content

**Data Integrity**:
- 24 critiques in `data.js` contain image references
- 6 images per artwork are referenced but not accessible
- Investment in creating image reference system is wasted

**Scope**:
- Affects: All critique cards on main homepage (index.html)
- Does NOT affect: Critics page, demo page, test pages (they use gallery-init.js or test parsers)
- Severity: **High** - Core feature not working on primary user-facing page

## What Changes

### Overview

Enable CritiqueParser integration in gallery-hero.js to transform image reference syntax into clickable navigation links, matching the behavior already implemented in gallery-init.js.

### Core Changes

#### 1. Modify createCritiqueCard() in gallery-hero.js

**Location**: `js/gallery-hero.js` lines 323-403

**Current Code** (line 373):
```javascript
textEl.textContent = truncateText(fullText, 150);
```

**New Code**:
```javascript
// Process image references with CritiqueParser
if (window.CritiqueParser && artwork) {
  const processedText = window.CritiqueParser.renderImageReferences(fullText, artwork, {
    linkClass: 'image-reference-link',
    showImageTitle: false,
    invalidClass: 'image-reference-invalid'
  });

  // Truncate HTML content while preserving tags
  textEl.innerHTML = truncateHTML(processedText, 150);
} else {
  // Fallback: plain text
  textEl.textContent = truncateText(fullText, 150);
}
```

#### 2. Add HTML-aware truncation function

**New Function**: `truncateHTML(html, maxLength)`

**Purpose**: Truncate text while preserving HTML structure for image reference links

**Algorithm**:
1. Strip HTML tags to calculate text-only length
2. If under limit, return original HTML
3. If over limit, truncate to sentence boundary (preserve existing logic)
4. Reconstruct with preserved `<a>` tags

**Location**: Add after `truncateText()` function (after line 36)

#### 3. Add click event handlers for image reference links

**Location**: After line 389 (after toggle button is appended)

**Code**:
```javascript
// Attach click handlers to image reference links
setTimeout(() => {
  textEl.querySelectorAll('.image-reference-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const imageId = link.dataset.imageId;
      handleImageReferenceClick(imageId, artwork);
    });
  });
}, 0);
```

**Note**: `handleImageReferenceClick()` already exists (lines 483-518), so we just need to wire it up.

#### 4. Update toggleCritiqueExpansion() to handle HTML

**Location**: `js/gallery-hero.js` lines 45-63

**Current Issue**: Expansion/collapse uses `.textContent`, which strips HTML

**Fix**: Modify lines 51 and 58:
```javascript
// Line 51 (collapse)
textEl.innerHTML = processedAndTruncatedHTML; // Store this in panel.dataset

// Line 58 (expand)
textEl.innerHTML = processedFullHTML; // Store this in panel.dataset
```

**Data Storage Strategy**:
```javascript
panel.dataset.fullTextPlain = fullText;           // Original text
panel.dataset.fullTextProcessed = processedHTML;  // With image links
panel.dataset.truncatedProcessed = truncatedHTML; // Truncated with links
```

### CSS Changes

**Location**: `styles/main.css`

**Add Styles** (if not already present):
```css
/* Image reference links in critique text */
.image-reference-link {
  color: var(--color-primary, #007bff);
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px dotted currentColor;
  cursor: pointer;
  transition: color 0.2s ease;
}

.image-reference-link:hover {
  color: var(--color-primary-dark, #0056b3);
  border-bottom-style: solid;
}

.image-reference-link:focus {
  outline: 2px solid var(--color-focus, #0056b3);
  outline-offset: 2px;
}

/* Invalid references (image ID not found) */
.image-reference-invalid {
  color: var(--color-error, #dc3545);
  text-decoration: line-through;
  cursor: not-allowed;
}
```

### Success Criteria

**Must Have (P0)**:
- ✅ Image references render as clickable links (not plain text)
- ✅ Clicking link navigates to corresponding image in carousel
- ✅ Both truncated and expanded states preserve links
- ✅ Existing expand/collapse functionality continues to work
- ✅ No console errors or warnings

**Should Have (P1)**:
- ✅ Links styled consistently with design system
- ✅ Hover and focus states for accessibility
- ✅ Invalid references handled gracefully (if image ID doesn't exist)
- ✅ HTML truncation preserves link integrity (no broken tags)

**Nice to Have (P2)**:
- ✅ Smooth scroll to target image in carousel
- ✅ Visual feedback when clicking (loading state)
- ✅ Keyboard navigation (Enter/Space on focused link)

## Dependencies & Sequencing

### Prerequisites (Already Complete)

- ✅ CritiqueParser utility (`js/utils/critique-parser.js`) - Implemented in Phase 2
- ✅ ImageCompat utility (`js/utils/image-compat.js`) - Provides artwork image access
- ✅ Artwork carousel component (`js/components/artwork-carousel.js`) - Handles navigation
- ✅ Image reference data in `data.js` - All 24 critiques contain references
- ✅ `handleImageReferenceClick()` function exists in gallery-hero.js (lines 483-518)

### No Blocking Dependencies

This change is **purely internal to gallery-hero.js** and requires no new infrastructure.

### Testing Sequence

1. **Unit Test**: Verify CritiqueParser integration in isolation
2. **Integration Test**: Test full click-to-navigate flow
3. **Regression Test**: Ensure expand/collapse still works
4. **Visual Test**: Verify link styling and hover states
5. **Accessibility Test**: Screen reader and keyboard navigation

## How to Implement

### Step 1: Add truncateHTML() function

**File**: `js/gallery-hero.js`
**Location**: After line 36 (after `truncateText()`)

```javascript
/**
 * Truncate HTML content while preserving tags
 * @param {string} html - HTML content with image reference links
 * @param {number} maxLength - Maximum text length (excluding HTML tags)
 * @returns {string} - Truncated HTML
 */
function truncateHTML(html, maxLength = 150) {
  // Extract plain text for length calculation
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  const plainText = tempDiv.textContent || tempDiv.innerText || '';

  // If under limit, return original
  if (plainText.length <= maxLength) {
    return html;
  }

  // Truncate plain text at sentence boundary
  const truncatedPlain = truncateText(plainText, maxLength);
  const truncateIndex = truncatedPlain.length - 3; // Exclude "..."

  // Find corresponding position in HTML
  let charCount = 0;
  let resultHTML = '';
  let inTag = false;

  for (let i = 0; i < html.length; i++) {
    const char = html[i];

    if (char === '<') {
      inTag = true;
    }

    if (!inTag) {
      charCount++;
    }

    if (charCount >= truncateIndex) {
      resultHTML += html.substring(0, i + 1);
      break;
    }

    if (char === '>') {
      inTag = false;
    }
  }

  // Close any open tags and add "..."
  return resultHTML + '...</a>';
}
```

### Step 2: Modify createCritiqueCard()

**File**: `js/gallery-hero.js`
**Lines to modify**: 358-389

**Replace block starting at line 366**:
```javascript
// Use English or Chinese based on current language
const lang = document.documentElement.getAttribute('data-lang') || 'zh';
const text = lang === 'en' ? critique.textEn : critique.textZh;

// Store full text for expand/collapse
const fullText = text || '';
panel.dataset.fullText = fullText;

// Process with CritiqueParser if available
if (window.CritiqueParser && artwork) {
  const processedHTML = window.CritiqueParser.renderImageReferences(fullText, artwork, {
    linkClass: 'image-reference-link',
    showImageTitle: false,
    invalidClass: 'image-reference-invalid'
  });

  const truncatedHTML = truncateHTML(processedHTML, 150);

  // Store both versions
  panel.dataset.fullTextPlain = fullText;
  panel.dataset.fullTextProcessed = processedHTML;
  panel.dataset.truncatedProcessed = truncatedHTML;

  // Set truncated HTML by default
  textEl.innerHTML = truncatedHTML;
} else {
  // Fallback: plain text
  panel.dataset.fullText = fullText;
  textEl.textContent = truncateText(fullText, 150);
}

panel.appendChild(textEl);

// Toggle button for expand/collapse
const toggleBtn = document.createElement('button');
toggleBtn.className = 'critique-toggle-btn';
toggleBtn.textContent = '展开 ▼';
toggleBtn.setAttribute('aria-expanded', 'false');
toggleBtn.setAttribute('aria-label', '展开评论全文');
toggleBtn.setAttribute('aria-controls', textId);

toggleBtn.addEventListener('click', () => {
  toggleCritiqueExpansion(panel, textEl, toggleBtn);
});

panel.appendChild(toggleBtn);

// Attach click handlers to image reference links
if (window.CritiqueParser && artwork) {
  setTimeout(() => {
    textEl.querySelectorAll('.image-reference-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const imageId = link.dataset.imageId;
        handleImageReferenceClick(imageId, artwork);
      });
    });
  }, 0);
}
```

### Step 3: Update toggleCritiqueExpansion()

**File**: `js/gallery-hero.js`
**Lines to modify**: 45-63

**Replace function**:
```javascript
function toggleCritiqueExpansion(card, textElement, button) {
  const isExpanded = card.classList.contains('expanded');

  // Check if processed HTML is available
  const hasProcessedHTML = card.dataset.fullTextProcessed;

  if (isExpanded) {
    // Collapse
    card.classList.remove('expanded');

    if (hasProcessedHTML) {
      textElement.innerHTML = card.dataset.truncatedProcessed;
    } else {
      textElement.textContent = truncateText(card.dataset.fullText, 150);
    }

    button.textContent = '展开 ▼';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', '展开评论全文');
  } else {
    // Expand
    card.classList.add('expanded');

    if (hasProcessedHTML) {
      textElement.innerHTML = card.dataset.fullTextProcessed;
    } else {
      textElement.textContent = card.dataset.fullText;
    }

    button.textContent = '收起 ▲';
    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-label', '收起评论');
  }

  // Re-attach click handlers after content change
  if (hasProcessedHTML) {
    setTimeout(() => {
      textElement.querySelectorAll('.image-reference-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const imageId = link.dataset.imageId;
          const artwork = window.VULCA_DATA?.artworks?.find(a => a.id === card.closest('.critique-panel').dataset.artworkId);
          if (artwork) {
            window.GalleryHeroRenderer.handleImageReferenceClick(imageId, artwork);
          }
        });
      });
    }, 0);
  }
}
```

### Step 4: Add CSS styles

**File**: `styles/main.css`
**Location**: After critique-related styles (around line 2000)

```css
/* ==================== IMAGE REFERENCE LINKS ==================== */
/* Links within critique text that navigate to specific images */

.image-reference-link {
  color: var(--color-primary, #007bff);
  text-decoration: none;
  font-weight: 500;
  padding: 0 2px;
  border-bottom: 1px dotted currentColor;
  cursor: pointer;
  transition: all 0.2s ease;
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

.image-reference-link:active {
  transform: translateY(1px);
}

/* Invalid image references */
.image-reference-invalid {
  color: var(--color-error, #dc3545);
  text-decoration: line-through;
  cursor: not-allowed;
  font-style: italic;
}

.image-reference-invalid::before {
  content: "⚠️ ";
  font-style: normal;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .image-reference-link {
    font-weight: 600;
    padding: 2px 4px;
  }
}
```

### Step 5: Testing

**Manual Testing Checklist**:
1. Open index.html in browser
2. Navigate to Artwork 1 (Sougwen Chung - Memory)
3. Locate Su Shi's critique card
4. Verify `[img:img-1-1]` renders as "图片1" link (not plain text)
5. Click the link → carousel should navigate to image 1
6. Click "展开" to expand critique → links should still work
7. Click "收起" to collapse → links should persist
8. Test all 6 critiques for Artwork 1
9. Test keyboard navigation (Tab to link, Enter to activate)
10. Test with browser dev tools (check for console errors)

**Validation**:
- No console errors
- Network tab shows no failed image requests
- Links styled consistently
- Clicking works in both collapsed and expanded states

## Risks & Mitigations

### Risk 1: HTML truncation breaks tags

**Probability**: Medium
**Impact**: High (broken HTML on page)

**Mitigation**:
- Implement robust HTML parser in `truncateHTML()`
- Unit test with various HTML structures
- Fallback to plain text if parsing fails

### Risk 2: Performance impact from DOM manipulation

**Probability**: Low
**Impact**: Low (slight render delay)

**Mitigation**:
- Use `setTimeout()` for event handler attachment (non-blocking)
- Limit number of links per critique (natural constraint)
- Test on mobile devices

### Risk 3: Regression in expand/collapse behavior

**Probability**: Medium
**Impact**: Medium (existing feature breaks)

**Mitigation**:
- Comprehensive regression testing
- Preserve fallback to plain text if CritiqueParser not loaded
- Test edge cases (empty text, very long text)

### Risk 4: Invalid image references cause errors

**Probability**: Low (data is curated)
**Impact**: Low (graceful degradation)

**Mitigation**:
- CritiqueParser already validates image IDs
- Invalid refs styled with `.image-reference-invalid`
- Console warnings guide debugging

## Validation & Testing

### Automated Tests

**Create test file**: `test-gallery-hero-image-refs.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>Gallery Hero Image Reference Test</title>
  <script src="/js/utils/image-compat.js"></script>
  <script src="/js/utils/critique-parser.js"></script>
  <script src="/js/data.js"></script>
  <script src="/js/gallery-hero.js"></script>
</head>
<body>
  <div id="test-results"></div>
  <script>
    // Test suite
    const tests = [
      {
        name: "Image references are parsed",
        fn: () => {
          const artwork = window.VULCA_DATA.artworks[0];
          const critique = window.VULCA_DATA.critiques[0];
          const text = critique.textZh;

          const html = window.CritiqueParser.renderImageReferences(text, artwork);

          return html.includes('<a') && html.includes('image-reference-link');
        }
      },
      {
        name: "truncateHTML preserves links",
        fn: () => {
          const html = '如<a href="#">图片1</a>所示，此作品展现了很长的文字内容，超过了150个字符的限制...';
          const truncated = window.GalleryHeroRenderer.truncateHTML(html, 30);

          return truncated.includes('<a') && truncated.includes('</a>');
        }
      }
      // Add more tests...
    ];

    tests.forEach(test => {
      const result = test.fn();
      console.log(`${test.name}: ${result ? '✅ PASS' : '❌ FAIL'}`);
    });
  </script>
</body>
</html>
```

### User Acceptance Criteria

**Definition of Done**:
- [ ] All 24 critiques across 4 artworks have working image links
- [ ] Links navigate correctly to target images in carousel
- [ ] Expand/collapse preserves link functionality
- [ ] No visual regressions in critique card layout
- [ ] Browser console shows no errors
- [ ] Accessibility: Links announce correctly in NVDA/JAWS
- [ ] Mobile: Touch targets are adequately sized (min 44x44px)
- [ ] Performance: No noticeable lag when expanding/collapsing

## Timeline Estimate

**Total Time**: 4-6 hours

| Task | Time | Notes |
|------|------|-------|
| Add truncateHTML() function | 1h | Complex HTML parsing logic |
| Modify createCritiqueCard() | 1h | Careful integration with existing code |
| Update toggleCritiqueExpansion() | 1h | Handle state transitions |
| Add CSS styles | 0.5h | Design consistent links |
| Write automated tests | 1h | Cover edge cases |
| Manual testing | 1-2h | Test all 24 critiques × expand/collapse |
| Fix bugs/polish | 0.5-1h | Buffer for issues |

## Alternatives Considered

### Alternative 1: Keep plain text, add image navigation panel

**Description**: Don't parse references, instead add separate image navigation UI

**Pros**:
- No code changes to gallery-hero.js
- Simpler implementation

**Cons**:
- Doesn't solve the core UX issue (references are still gibberish)
- Adds UI complexity
- Investment in image reference syntax is wasted

**Verdict**: ❌ Rejected

### Alternative 2: Remove image references from critique text

**Description**: Edit all 24 critiques to remove `[img:...]` syntax

**Pros**:
- No code changes needed
- Simple data fix

**Cons**:
- Loses rich contextual connections
- Defeats purpose of multi-image system
- Reduces exhibition depth

**Verdict**: ❌ Rejected

### Alternative 3: Use tooltip hover instead of navigation links

**Description**: Parse references but show image preview on hover, not navigation

**Pros**:
- Less disruptive to reading flow
- No carousel navigation complexity

**Cons**:
- Doesn't leverage existing carousel infrastructure
- Mobile/touch devices can't hover
- Requires loading all images (performance hit)

**Verdict**: ❌ Rejected (could be Phase 2 enhancement)

## Related Work

### Similar Implementations

1. **gallery-init.js** (lines 236-268)
   - Already uses CritiqueParser correctly
   - Reference implementation to follow

2. **demo.html**
   - Demonstrates CritiqueParser usage in examples
   - Shows expected output format

3. **test-critique-parser.html**
   - Full test suite for CritiqueParser
   - Can adapt tests for gallery-hero.js

### OpenSpec Changes

**Related Changes**:
- `implement-multi-image-artwork-series` (archived)
  - Created the CritiqueParser utility
  - Defined image reference syntax
  - Implemented carousel navigation

**This change completes the original vision by enabling image references in the primary gallery view.**

---

**Proposal Status**: Draft
**Created**: 2025-11-03
**Author**: Claude (via user request)
**Complexity**: Medium
**Priority**: High (P0 - Core feature not working)
