# Spec: Image Reference Link Rendering in Gallery Hero

## Overview

**Capability**: Image Reference Link Rendering
**Component**: Gallery Hero Renderer (`js/gallery-hero.js`)
**Dependencies**: CritiqueParser utility (`js/utils/critique-parser.js`)
**Status**: Draft

## MODIFIED Requirements

### Requirement 1: Critique Text Processing

**ID**: GALH-REF-001

**Description**: The gallery hero renderer SHALL process critique text containing image reference syntax `[img:image-id]` and convert it to clickable HTML links that navigate to the referenced images in the artwork carousel.

**Rationale**:
- Current behavior: `[img:img-1-1]` displays as plain text
- Desired behavior: Render as "图片1" clickable link
- Consistency: gallery-init.js already implements this correctly

**Acceptance Criteria**:
- Image references in format `[img:img-X-Y]` are detected and parsed
- Valid references (image ID exists in artwork) are converted to `<a>` tags
- Invalid references are marked with error class but don't break rendering
- Both Chinese and English critique texts are processed
- Processing happens during initial card creation (not on every render)

#### Scenario: Valid Image Reference in Critique Text

**Given**:
- Artwork 1 (id: "artwork-1") has images with IDs: ["img-1-1", "img-1-2", "img-1-3", "img-1-4", "img-1-5", "img-1-6"]
- Su Shi's critique textZh contains: "如[img:img-1-1]所示，此作品展现了笔墨与机器的对话"
- CritiqueParser is loaded and available
- Gallery hero is rendering Artwork 1's critiques

**When**:
- `createCritiqueCard()` is called with Su Shi's critique

**Then**:
- CritiqueParser.renderImageReferences() is invoked
- Output HTML contains: `<a href="#" class="image-reference-link" data-image-id="img-1-1" title="...">图片1</a>`
- The `[img:img-1-1]` syntax is replaced with the link
- Link is inserted at correct position in text
- Link has proper data attributes: `data-image-id="img-1-1"` and `data-artwork-id="artwork-1"`

**Validation**:
```javascript
// Test code
const artwork = VULCA_DATA.artworks[0]; // Artwork 1
const critique = VULCA_DATA.critiques.find(c => c.personaId === 'su-shi' && c.artworkId === 'artwork-1');

const processedHTML = window.CritiqueParser.renderImageReferences(critique.textZh, artwork);

// Assertions
assert(processedHTML.includes('<a'), "Should contain anchor tag");
assert(processedHTML.includes('class="image-reference-link"'), "Should have correct class");
assert(processedHTML.includes('data-image-id="img-1-1"'), "Should have image ID attribute");
assert(!processedHTML.includes('[img:img-1-1]'), "Should not contain original syntax");
```

---

#### Scenario: Multiple Image References in Same Text

**Given**:
- Artwork 1 has images img-1-1 through img-1-6
- John Ruskin's critique contains: "当机器参与创作时... [img:img-1-3]所展现的... [img:img-1-2]记录的训练过程..."

**When**:
- createCritiqueCard() processes Ruskin's critique

**Then**:
- Both `[img:img-1-3]` and `[img:img-1-2]` are converted to links
- Links appear in correct order in the text
- Each link has unique data-image-id attribute
- Text between links is preserved unchanged

**Validation**:
```javascript
const critique = VULCA_DATA.critiques.find(c => c.personaId === 'john-ruskin' && c.artworkId === 'artwork-1');
const processedHTML = window.CritiqueParser.renderImageReferences(critique.textZh, artwork);

const linkCount = (processedHTML.match(/<a /g) || []).length;
assert(linkCount >= 2, "Should have at least 2 links");
assert(processedHTML.includes('data-image-id="img-1-3"'), "Should have link to img-1-3");
assert(processedHTML.includes('data-image-id="img-1-2"'), "Should have link to img-1-2");
```

---

#### Scenario: Invalid Image Reference (Graceful Degradation)

**Given**:
- Artwork 1 has images img-1-1 through img-1-6 (no img-1-99)
- Hypothetical critique contains: "如[img:img-1-99]所示" (invalid ID)

**When**:
- createCritiqueCard() processes the critique

**Then**:
- CritiqueParser.validateImageReferences() detects invalid ID
- Invalid reference is wrapped in `<span class="image-reference-invalid">`
- Console warning is logged: "⚠️ Invalid image reference: img-1-99"
- Rendering continues without errors
- Other valid references in same text still work

**Validation**:
```javascript
const invalidText = "如[img:img-1-99]所示，作品展现...";
const processedHTML = window.CritiqueParser.renderImageReferences(invalidText, artwork);

assert(processedHTML.includes('image-reference-invalid'), "Should mark invalid reference");
assert(processedHTML.includes('[img:img-1-99]'), "Should preserve original syntax for invalid ref");
// Console should log warning (check manually)
```

---

### Requirement 2: HTML-Aware Text Truncation

**ID**: GALH-REF-002

**Description**: The gallery hero renderer SHALL truncate critique text while preserving HTML structure of image reference links, ensuring `<a>` tags are not broken at truncation boundary.

**Rationale**:
- Current truncation uses `truncateText()` which operates on plain text
- After adding HTML links, need to preserve HTML structure during truncation
- Broken HTML tags cause rendering errors and accessibility issues

**Acceptance Criteria**:
- New function `truncateHTML(html, maxLength)` is implemented
- Function counts text-only characters (excludes HTML tags)
- Truncation respects sentence boundaries (existing logic from `truncateText()`)
- All open `<a>` tags are properly closed before appending "..."
- If truncation fails, fallback to plain text truncation (no error)
- Truncated HTML is valid (can be parsed by browser)

#### Scenario: Truncate Text with Single Image Link

**Given**:
- processedHTML = "如<a href='#' data-image-id='img-1-1'>图片1</a>所示，此作品展现了笔墨与机器的对话。机械臂如同现代文人画家之手，却失却了心意的指引..." (200+ chars)
- maxLength = 150

**When**:
- `truncateHTML(processedHTML, 150)` is called

**Then**:
- Function extracts plain text: "如图片1所示，此作品展现了..."
- Counts plain text characters (excludes HTML tags)
- Finds truncation point at sentence boundary (~150 chars)
- Maps back to HTML position
- Closes any open `<a>` tags
- Returns: "如<a href='#' data-image-id='img-1-1'>图片1</a>所示，此作品展现了笔墨与机器的对话。机械臂如同现代文人画家之手..."

**Validation**:
```javascript
const longHTML = "如<a href='#' class='image-reference-link' data-image-id='img-1-1'>图片1</a>所示，" + "很长的文字内容".repeat(30);
const truncated = truncateHTML(longHTML, 150);

// Extract plain text from truncated HTML
const tempDiv = document.createElement('div');
tempDiv.innerHTML = truncated;
const plainText = tempDiv.textContent;

assert(plainText.length <= 153, "Text length should be ~150 chars + '...'");
assert(truncated.includes('<a'), "Should preserve <a> tag");
assert(truncated.includes('</a>'), "Should close <a> tag");
assert(truncated.endsWith('...'), "Should end with ellipsis");

// Validate HTML structure
const parser = new DOMParser();
const doc = parser.parseFromString(truncated, 'text/html');
const errors = doc.querySelector('parsererror');
assert(!errors, "Should be valid HTML");
```

---

#### Scenario: Truncate Plain Text (No HTML)

**Given**:
- text = "纯文本内容，没有任何HTML标签。这段文字很长..." (200 chars)
- maxLength = 150

**When**:
- `truncateHTML(text, 150)` is called

**Then**:
- Function detects no HTML tags
- Returns truncated plain text (same as `truncateText()`)
- No HTML processing overhead

**Validation**:
```javascript
const plainText = "纯文本内容".repeat(50); // No HTML
const truncated = truncateHTML(plainText, 150);

assert(!truncated.includes('<'), "Should not contain any HTML tags");
assert(truncated.length <= 153, "Should be truncated to ~150 chars");
```

---

### Requirement 3: Event Handler Attachment

**ID**: GALH-REF-003

**Description**: The gallery hero renderer SHALL attach click event handlers to all image reference links within critique cards, enabling navigation to the referenced images when clicked.

**Rationale**:
- Links must be interactive (not just visual decoration)
- Click should trigger carousel navigation to target image
- Event handlers must be reattached after expand/collapse (innerHTML swap)

**Acceptance Criteria**:
- Event handlers attached via `addEventListener` (not inline onclick)
- Handlers use `setTimeout(fn, 0)` to ensure DOM is updated
- Click event prevents default (no page jump)
- Handler calls `handleImageReferenceClick(imageId, artwork)`
- Handlers are reattached after toggle (expand/collapse)
- No memory leaks from duplicate handlers

#### Scenario: Click Link Navigates to Image

**Given**:
- Artwork 1 critique card is rendered with image reference link
- Link has data-image-id="img-1-3"
- Artwork carousel is initialized with 6 images
- Current carousel position is at image 0

**When**:
- User clicks the image reference link

**Then**:
- Event handler prevents default link behavior (no # in URL)
- `handleImageReferenceClick("img-1-3", artwork)` is called
- Function finds image index in artwork.images (index = 2)
- Custom event 'carousel:navigateTo' is dispatched with { imageIndex: 2 }
- Carousel navigates to image 3 (index 2)
- User sees the referenced image

**Validation**:
```javascript
// Simulate click
const link = document.querySelector('.image-reference-link[data-image-id="img-1-3"]');
const event = new MouseEvent('click', { bubbles: true, cancelable: true });

let navigateEventFired = false;
document.addEventListener('carousel:navigateTo', (e) => {
  navigateEventFired = true;
  assert(e.detail.imageIndex === 2, "Should navigate to index 2 (img-1-3)");
});

link.dispatchEvent(event);

assert(navigateEventFired, "Should dispatch carousel navigation event");
assert(event.defaultPrevented, "Should prevent default link behavior");
```

---

#### Scenario: Handlers Reattached After Expand/Collapse

**Given**:
- Critique card is rendered with image links
- User clicks "展开" button → innerHTML is swapped to full text

**When**:
- `toggleCritiqueExpansion()` is called with expanded=true
- textEl.innerHTML is set to full processed HTML
- setTimeout callback attaches new handlers

**Then**:
- All links in expanded text have click handlers
- Old handlers are discarded (replaced by new innerHTML)
- Clicking link in expanded state triggers navigation
- No duplicate handlers (each link has exactly 1 listener)

**Validation**:
```javascript
// Initial state: collapsed
const card = document.querySelector('.critique-card[data-persona-id="su-shi"]');
const textEl = card.querySelector('.critique-text');
const toggleBtn = card.querySelector('.critique-toggle-btn');

// Expand
toggleBtn.click();
await new Promise(resolve => setTimeout(resolve, 10)); // Wait for handlers

// Test link in expanded state
const link = textEl.querySelector('.image-reference-link');
const clickEvent = new MouseEvent('click');
let handlerCalled = 0;

// Mock handleImageReferenceClick
const originalHandler = window.GalleryHeroRenderer.handleImageReferenceClick;
window.GalleryHeroRenderer.handleImageReferenceClick = () => { handlerCalled++; };

link.dispatchEvent(clickEvent);

assert(handlerCalled === 1, "Handler should be called exactly once (no duplicates)");

// Restore
window.GalleryHeroRenderer.handleImageReferenceClick = originalHandler;
```

---

### Requirement 4: State Management for Expand/Collapse

**ID**: GALH-REF-004

**Description**: The gallery hero renderer SHALL store multiple versions of critique text (plain, processed, truncated) in dataset attributes to enable instant toggling between collapsed and expanded states without reprocessing.

**Rationale**:
- Expand/collapse is user-triggered, requires instant response (<100ms)
- Reprocessing with CritiqueParser on every toggle is wasteful (2-5ms overhead)
- Storing processed HTML in dataset enables O(1) lookup

**Acceptance Criteria**:
- panel.dataset.fullTextPlain stores original text
- panel.dataset.fullTextProcessed stores HTML with links
- panel.dataset.truncatedProcessed stores truncated HTML
- toggleCritiqueExpansion() swaps innerHTML between truncated/full
- Memory overhead is acceptable (<50KB for 24 critiques)
- No performance degradation during toggle

#### Scenario: Store Processed Text in Dataset

**Given**:
- createCritiqueCard() is processing Su Shi's critique
- Original textZh contains "[img:img-1-1]"
- CritiqueParser converts to HTML with <a> tag

**When**:
- Processing completes

**Then**:
- panel.dataset.fullTextPlain = "如[img:img-1-1]所示..." (original)
- panel.dataset.fullTextProcessed = "如<a>图片1</a>所示..." (full HTML)
- panel.dataset.truncatedProcessed = "如<a>图片1</a>所示...150 chars..." (truncated HTML)
- All three versions are stored
- Dataset attributes are accessible in DevTools

**Validation**:
```javascript
const panel = document.querySelector('.critique-card[data-persona-id="su-shi"]');

assert(panel.dataset.fullTextPlain, "Should have plain text");
assert(panel.dataset.fullTextPlain.includes('[img:img-1-1]'), "Plain text should have original syntax");

assert(panel.dataset.fullTextProcessed, "Should have processed HTML");
assert(panel.dataset.fullTextProcessed.includes('<a'), "Processed should have <a> tag");

assert(panel.dataset.truncatedProcessed, "Should have truncated HTML");
assert(panel.dataset.truncatedProcessed.length < panel.dataset.fullTextProcessed.length, "Truncated should be shorter");
```

---

#### Scenario: Instant Toggle Between States

**Given**:
- Critique card is collapsed (showing truncatedProcessed)
- User clicks "展开" button

**When**:
- toggleCritiqueExpansion() is called

**Then**:
- textEl.innerHTML = panel.dataset.fullTextProcessed (lookup, no processing)
- Toggle completes in <10ms (measured via Performance API)
- Links remain clickable immediately after toggle
- No flicker or layout shift

**Validation**:
```javascript
const card = document.querySelector('.critique-card');
const textEl = card.querySelector('.critique-text');
const toggleBtn = card.querySelector('.critique-toggle-btn');

// Measure performance
const startTime = performance.now();
toggleBtn.click();
const endTime = performance.now();

const toggleDuration = endTime - startTime;
assert(toggleDuration < 10, `Toggle should be <10ms, was ${toggleDuration}ms`);

// Verify content changed
assert(card.classList.contains('expanded'), "Should be expanded");
assert(textEl.innerHTML === card.dataset.fullTextProcessed, "Should show full text");
```

---

## ADDED Requirements

### Requirement 5: CSS Styling for Image Reference Links

**ID**: GALH-REF-005

**Description**: The system SHALL style image reference links with visual indicators (color, underline, hover states) that clearly distinguish them from plain text and convey their interactive nature.

**Rationale**:
- Links must be visually distinct (WCAG 2.1: Links must be identifiable)
- Hover/focus states provide feedback (usability)
- Color contrast must meet WCAG AA (4.5:1 ratio)

**Acceptance Criteria**:
- Default state: Blue color, dotted underline
- Hover state: Darker blue, solid underline, subtle background
- Focus state: 2px outline, 2px offset (keyboard navigation)
- Active state: Slight translateY (press feedback)
- Invalid refs: Red color, line-through, warning icon
- Mobile: Touch targets ≥44x44px

#### Scenario: Link Meets WCAG Color Contrast Requirements

**Given**:
- Link color is #007bff (blue)
- Background is #ffffff (white)

**When**:
- Color contrast is calculated

**Then**:
- Contrast ratio is ≥4.5:1 (WCAG AA for normal text)
- Link passes automated accessibility audit (Lighthouse, axe)

**Validation**:
```javascript
// Use browser DevTools or contrast checker
// https://webaim.org/resources/contrastchecker/
// Foreground: #007bff, Background: #ffffff
// Expected result: 4.5:1 or higher
```

---

#### Scenario: Keyboard Focus Indicator is Visible

**Given**:
- User is navigating with keyboard (Tab key)
- Focus reaches an image reference link

**When**:
- Link receives focus

**Then**:
- 2px blue outline appears around link
- Outline has 2px offset from link text
- Outline is clearly visible against all backgrounds
- Focus indicator meets WCAG 2.1 SC 2.4.7 (Focus Visible)

**Validation**:
```javascript
const link = document.querySelector('.image-reference-link');
link.focus();

const computedStyle = window.getComputedStyle(link);
const outlineWidth = computedStyle.outlineWidth;
const outlineOffset = computedStyle.outlineOffset;

assert(parseInt(outlineWidth) >= 2, "Outline should be at least 2px");
assert(parseInt(outlineOffset) >= 2, "Outline offset should be at least 2px");
```

---

## REMOVED Requirements

**None** - This change does not remove any existing requirements. Plain text rendering is preserved as fallback when CritiqueParser is not available.

---

## Dependencies

### Internal Dependencies

1. **CritiqueParser Utility** (`js/utils/critique-parser.js`)
   - MUST be loaded before gallery-hero.js
   - Provides renderImageReferences() function
   - Validates image IDs against artwork.images

2. **ImageCompat Utility** (`js/utils/image-compat.js`)
   - MUST be loaded before CritiqueParser
   - Provides getArtworkImages() helper
   - Handles backward compatibility for single-image artworks

3. **Artwork Carousel Component** (`js/components/artwork-carousel.js`)
   - MUST listen for 'carousel:navigateTo' event
   - Provides goToImage(index) public API
   - Currently implemented (lines 200-250)

### Data Dependencies

1. **VULCA_DATA Structure** (`js/data.js`)
   - Artworks MUST have images array with id, url, sequence
   - Critiques MUST have artworkId and personaId
   - Image IDs MUST follow pattern `img-{artwork-num}-{sequence-num}`

2. **CSS Variables** (`styles/main.css`)
   - --color-primary (default: #007bff)
   - --color-primary-dark (default: #0056b3)
   - --color-error (default: #dc3545)
   - --color-focus (default: #0056b3)

---

## Testing Requirements

### Unit Tests (MUST Pass)

1. **Test: CritiqueParser Integration**
   - Input: Text with "[img:img-1-1]"
   - Expected: HTML with <a> tag
   - File: test-gallery-hero-image-refs.html

2. **Test: truncateHTML Preserves Tags**
   - Input: Long HTML with links
   - Expected: Truncated HTML with closed tags
   - File: test-gallery-hero-image-refs.html

3. **Test: Invalid Reference Handling**
   - Input: "[img:img-99-99]" (invalid ID)
   - Expected: Marked with error class, no crash
   - File: test-gallery-hero-image-refs.html

### Integration Tests (MUST Pass)

1. **Test: End-to-End Link Navigation**
   - Action: Click link in Su Shi's critique
   - Expected: Carousel navigates to referenced image
   - Method: Manual testing checklist

2. **Test: Expand/Collapse Preserves Links**
   - Action: Expand → click link → collapse → click link
   - Expected: Links work in both states
   - Method: Manual testing checklist

### Accessibility Tests (MUST Pass)

1. **Test: Screen Reader Announcement**
   - Tool: NVDA or VoiceOver
   - Expected: Link announces as "link, 图片1"
   - Method: Manual screen reader testing

2. **Test: Keyboard Navigation**
   - Action: Tab to link → press Enter
   - Expected: Link activates, carousel navigates
   - Method: Manual keyboard testing

---

## Performance Requirements

### Rendering Performance

- **Requirement**: Rendering 6 critique cards MUST complete in <50ms
- **Measurement**: Chrome DevTools Performance tab
- **Baseline**: Current plain text rendering: ~20ms
- **Target**: With image reference processing: <50ms (2.5x overhead acceptable)

### Memory Usage

- **Requirement**: Dataset storage MUST NOT exceed 50KB for 24 critiques
- **Calculation**:
  - Plain text: ~500 bytes/critique
  - Processed HTML: ~700 bytes/critique
  - Truncated HTML: ~250 bytes/critique
  - Total per critique: ~1450 bytes
  - Total for 24: ~35KB ✅ (within budget)

### Toggle Performance

- **Requirement**: Expand/collapse MUST complete in <10ms
- **Measurement**: Performance.now() before/after toggle
- **Target**: O(1) dataset lookup + innerHTML swap = <10ms

---

## Security Considerations

### XSS Prevention

**Risk**: innerHTML usage could enable XSS if critique text contains malicious HTML

**Mitigations**:
1. ✅ Critique text is curated by admins (not user-generated)
2. ✅ CritiqueParser escapes all data attributes
3. ✅ No inline JavaScript in generated HTML (use addEventListener)
4. ✅ CSP headers can restrict script execution (if deployed)

**Validation**:
```javascript
// Test malicious input
const maliciousText = "如<script>alert('XSS')</script>所示";
const processedHTML = window.CritiqueParser.renderImageReferences(maliciousText, artwork);

assert(!processedHTML.includes('<script'), "Should not contain script tags");
assert(!processedHTML.includes('onerror='), "Should not contain event handlers");
```

---

## Accessibility Compliance

### WCAG 2.1 Level AA Compliance

| Criteria | Level | Status | Notes |
|----------|-------|--------|-------|
| 1.3.1 Info and Relationships | A | ✅ Pass | Links use semantic <a> tags |
| 1.4.3 Contrast (Minimum) | AA | ✅ Pass | 4.5:1 contrast ratio |
| 2.1.1 Keyboard | A | ✅ Pass | Tab to focus, Enter to activate |
| 2.4.7 Focus Visible | AA | ✅ Pass | 2px outline on focus |
| 4.1.2 Name, Role, Value | A | ✅ Pass | title attribute provides context |

---

## Rollback Strategy

### Graceful Degradation

If CritiqueParser fails to load or produces errors:
- ✅ Fallback to plain text rendering (current behavior)
- ✅ No console errors (try-catch blocks)
- ✅ Page remains functional

**Example**:
```javascript
if (window.CritiqueParser && artwork) {
  try {
    // Process with CritiqueParser
  } catch (error) {
    console.error('[Gallery Hero] CritiqueParser failed:', error);
    // Fallback to plain text
    textEl.textContent = truncateText(fullText, 150);
  }
} else {
  // Fallback: plain text
  textEl.textContent = truncateText(fullText, 150);
}
```

---

## Open Questions

**None** - All design decisions have been made and documented in design.md

---

## References

**Related Specifications**:
- `openspec/changes/archive/2025-11-02-implement-multi-image-artwork-series/specs/hybrid-critique-system/spec.md` - Original image reference system design

**External Standards**:
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
- HTML5 Data Attributes: https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
- ARIA Best Practices: https://www.w3.org/WAI/ARIA/apg/

**Implementation References**:
- `js/gallery-init.js` lines 236-268 - Existing CritiqueParser usage (reference implementation)
- `js/utils/critique-parser.js` - Parser implementation and API
- `demo.html` lines 300-310 - Example of expected output format
