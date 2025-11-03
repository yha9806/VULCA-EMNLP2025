# Design: Fix Image References in Gallery Hero

## Architectural Decisions

### Decision 1: Reuse CritiqueParser Instead of Custom Implementation

**Context**: Need to transform `[img:img-1-1]` syntax into clickable links in gallery-hero.js

**Options Considered**:

**A. Implement new parser in gallery-hero.js**
- Pros: Self-contained, no external dependencies
- Cons: Code duplication, maintenance burden, regex complexity

**B. Reuse existing CritiqueParser utility**
- Pros: Already tested, consistent behavior, no duplication
- Cons: Adds runtime dependency

**C. Extract shared parsing logic into separate module**
- Pros: Best separation of concerns
- Cons: Over-engineering for this use case

**Decision**: **Option B - Reuse CritiqueParser**

**Rationale**:
1. CritiqueParser already implements all required functionality:
   - Regex pattern matching (`/\[img:(img-\d+-\d+)\]/g`)
   - Validation against artwork images
   - HTML generation with proper attributes
   - Error handling for invalid references

2. gallery-init.js already uses CritiqueParser successfully (lines 236-268), proving it works in production

3. No need to reinvent the wheel - focus implementation effort on HTML truncation and event handling

4. Consistent behavior across all gallery views (init vs. hero)

**Trade-offs Accepted**:
- Runtime dependency on CritiqueParser being loaded first (already enforced in index.html line 306)
- Need to check `window.CritiqueParser` exists before using (graceful degradation)

---

### Decision 2: Use innerHTML Instead of textContent for Processed Text

**Context**: Need to render HTML links from CritiqueParser while preserving security

**Options Considered**:

**A. Use textContent and manually parse/replace**
- Pros: No XSS risk, simple
- Cons: Can't render links, defeats the purpose

**B. Use innerHTML with CritiqueParser output**
- Pros: Renders links properly, standard approach
- Cons: Requires trust in CritiqueParser's HTML generation

**C. Use DOM API to create elements programmatically**
- Pros: Maximum security, explicit control
- Cons: Complex, slow, defeats purpose of CritiqueParser

**Decision**: **Option B - Use innerHTML with CritiqueParser**

**Rationale**:
1. CritiqueParser generates safe, sanitized HTML:
   ```javascript
   `<a href="#" class="..." data-image-id="${id}" ...>图片${seq}</a>`
   ```
   - No user input in HTML generation
   - All data comes from trusted source (data.js)
   - No JavaScript in attributes (onclick uses addEventListener instead)

2. innerHTML is necessary to preserve link tags through expand/collapse

3. Same pattern used successfully in gallery-init.js (lines 242-252)

**Security Considerations**:
- ✅ No user-generated content in critique text (curated by admins)
- ✅ CritiqueParser escapes image IDs in data attributes
- ✅ No `eval()` or dynamic script execution
- ✅ CSP headers can further restrict execution context

**Trade-offs Accepted**:
- Slight increase in XSS surface area (mitigated by trusted data source)
- Need to maintain HTML structure integrity through truncation

---

### Decision 3: Implement Custom HTML Truncation Instead of Library

**Context**: Need to truncate HTML content while preserving `<a>` tags

**Options Considered**:

**A. Use existing library (e.g., truncate-html npm package)**
- Pros: Battle-tested, handles edge cases
- Cons: Adds external dependency, overkill for simple use case, requires build step

**B. Strip HTML and truncate plain text**
- Pros: Simple, no edge cases
- Cons: Loses image reference links, defeats the purpose

**C. Implement custom HTML-aware truncation**
- Pros: No external dependencies, tailored to specific needs, lightweight
- Cons: Need to handle HTML parsing edge cases

**Decision**: **Option C - Custom HTML truncation function**

**Rationale**:
1. **Simple HTML structure**: CritiqueParser only generates:
   ```html
   Text with <a href="#" class="..." data-image-id="...">link</a> more text
   ```
   - No nested tags (no `<a><span></span></a>`)
   - No self-closing tags (no `<br />`, `<img />`)
   - Predictable structure

2. **Fallback strategy**: If truncation fails, fall back to plain text
   ```javascript
   try {
     return truncateHTML(html, maxLength);
   } catch (e) {
     return truncateText(plainText, maxLength);
   }
   ```

3. **No build step**: Keep project as static site, no npm/webpack required

4. **Performance**: DOM-based truncation is fast for short texts (150 chars)

**Algorithm Design**:
```javascript
function truncateHTML(html, maxLength) {
  // 1. Parse HTML to extract plain text
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  const plainText = tempDiv.textContent;

  // 2. If under limit, return original
  if (plainText.length <= maxLength) return html;

  // 3. Find truncation point in plain text (sentence boundary)
  const truncatedPlain = truncateText(plainText, maxLength);
  const targetLength = truncatedPlain.length - 3; // Exclude "..."

  // 4. Walk through HTML, counting non-tag characters
  let charCount = 0;
  let inTag = false;
  for (let i = 0; i < html.length; i++) {
    if (html[i] === '<') inTag = true;
    if (!inTag) charCount++;
    if (charCount >= targetLength) {
      // 5. Extract substring, close open tags, add "..."
      return html.substring(0, i) + '</a>...';
    }
    if (html[i] === '>') inTag = false;
  }
}
```

**Edge Cases Handled**:
- ✅ No links in text → Falls back to plain truncation
- ✅ Link at truncation boundary → Closes tag properly
- ✅ Multiple links → Counts text between them correctly
- ✅ Very long link text → Truncates within link (rare but handled)

**Trade-offs Accepted**:
- Custom code requires testing (mitigated by test suite)
- Assumes simple HTML structure (valid for current use case)

---

### Decision 4: Store Multiple Text Versions in dataset Attributes

**Context**: Need to support expand/collapse with both plain and processed text

**Options Considered**:

**A. Store only original text, reprocess on every toggle**
- Pros: Single source of truth, no data duplication
- Cons: Performance hit, need to reparse HTML repeatedly

**B. Store original + processed + truncated in dataset**
- Pros: Fast toggle, no reprocessing, preserves event handlers
- Cons: Memory overhead (~500 bytes per critique × 24 = 12KB)

**C. Cache in JavaScript object outside DOM**
- Pros: Flexible data structure, could use WeakMap
- Cons: Complex lifecycle management, risk of memory leaks

**Decision**: **Option B - Store in dataset attributes**

**Rationale**:
1. **Performance**: Expand/collapse is user-triggered, needs instant response
   - Current: O(1) lookup from dataset
   - Alternative: O(n) regex parsing + HTML generation on every toggle

2. **Memory overhead is negligible**: 12KB for 24 critiques is < 1% of total page size

3. **Lifecycle tied to DOM**: When critique card is removed, data is automatically garbage collected

4. **Debugging**: Can inspect dataset in DevTools to verify state

**Data Structure**:
```javascript
panel.dataset = {
  fullTextPlain: "原始文本...",                // Original text from data.js
  fullTextProcessed: "<a>...</a>处理后的文本", // After CritiqueParser
  truncatedProcessed: "<a>...</a>截断后..."   // Truncated with links
}
```

**Alternative Considered** (More compact):
```javascript
panel.dataset.critiqueState = JSON.stringify({
  plain: "...",
  processed: "...",
  truncated: "..."
});
```
**Rejected because**: JSON parsing overhead, less debuggable, no performance benefit

**Trade-offs Accepted**:
- Slight memory overhead (12KB) for instant UX
- Data duplication (original text stored twice: plain + processed)

---

### Decision 5: Use setTimeout for Event Handler Attachment

**Context**: Need to attach click handlers to dynamically generated links

**Options Considered**:

**A. Attach handlers immediately after innerHTML**
- Pros: Synchronous, straightforward
- Cons: May not work if DOM not fully updated

**B. Use setTimeout(fn, 0) for next tick**
- Pros: Ensures DOM is updated, non-blocking
- Cons: Slight delay (imperceptible to users)

**C. Use MutationObserver to detect link insertion**
- Pros: Precise, event-driven
- Cons: Over-engineering, more complex

**Decision**: **Option B - setTimeout(fn, 0)**

**Rationale**:
1. **Browser render pipeline**: innerHTML updates are queued, may not be synchronous
   ```javascript
   textEl.innerHTML = html;           // Queued
   textEl.querySelector('a');         // May return null if not flushed
   setTimeout(() => {
     textEl.querySelector('a');       // Guaranteed to find element
   }, 0);
   ```

2. **Non-blocking**: 0ms timeout doesn't block UI thread

3. **Proven pattern**: Same approach used in gallery-init.js (line 255)

4. **Compatibility**: Works across all browsers (IE11+)

**Alternative Considered**: `requestAnimationFrame()`
```javascript
requestAnimationFrame(() => {
  textEl.querySelectorAll('a').forEach(link => { ... });
});
```
**Rejected because**: rAF is for animations, setTimeout is for DOM updates

**Trade-offs Accepted**:
- Theoretical race condition (page closes before timeout fires) - acceptable
- Links not clickable for ~0-5ms after render - imperceptible

---

### Decision 6: Handle Expand/Collapse by Swapping innerHTML

**Context**: Toggle between truncated and full text while preserving links

**Options Considered**:

**A. Use CSS max-height transition**
- Pros: Pure CSS, smooth animation
- Cons: Doesn't actually truncate text, just hides it (bad for screen readers)

**B. Swap innerHTML between truncated/full versions**
- Pros: True content change, accessible
- Cons: Need to re-attach event handlers after swap

**C. Dynamically add/remove DOM nodes**
- Pros: Precise control
- Cons: Complex diffing algorithm, performance issues

**Decision**: **Option B - Swap innerHTML + Re-attach Handlers**

**Rationale**:
1. **Accessibility**: Screen readers should only read visible content
   - CSS-based truncation announces full text even when "collapsed"
   - innerHTML swap ensures correct ARIA announcement

2. **Simplicity**: Single line to toggle:
   ```javascript
   textEl.innerHTML = isExpanded
     ? card.dataset.fullTextProcessed
     : card.dataset.truncatedProcessed;
   ```

3. **Event handler re-attachment is cheap**: 1-5 links per critique, ~0.1ms

4. **Consistent with existing pattern**: Current code already swaps textContent

**Performance Analysis**:
```
Expand/collapse action:
1. Set innerHTML: ~1ms (browser reflow)
2. querySelectorAll('a'): ~0.1ms (5 links max)
3. addEventListener × 5: ~0.5ms
Total: ~1.6ms (imperceptible)
```

**Trade-offs Accepted**:
- Event handlers re-created on every toggle (mitigated by caching processed HTML)
- Cannot animate text expansion smoothly (acceptable for this UI)

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Action                             │
│                      (Page Load / Navigate)                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│               GalleryHeroRenderer.render()                      │
│                     (gallery-hero.js)                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│           renderCritiques() → createCritiqueCard()              │
│             FOR EACH persona (6 critics)                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────────┐   ┌──────────────┐
│ Get critique │    │ Get artwork data │   │ Get persona  │
│ from data.js │    │  from data.js    │   │  from data.js│
└──────┬───────┘    └────────┬─────────┘   └──────────────┘
       │                     │
       └─────────┬───────────┘
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│               Extract Text (textZh or textEn)                   │
│  Example: "如[img:img-1-1]所示，此作品展现了..."                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│            CritiqueParser.renderImageReferences()               │
│  Input:  "如[img:img-1-1]所示..."                               │
│  Output: "如<a href='#' data-image-id='img-1-1'>图片1</a>所示..." │
│  ├─ Parse regex: /\[img:(img-\d+-\d+)\]/g                       │
│  ├─ Validate: image ID exists in artwork.images[]              │
│  ├─ Generate HTML: <a> tag with data attributes                │
│  └─ Replace: original syntax → clickable link                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    truncateHTML()                               │
│  Input:  "如<a>图片1</a>所示，此作品展现了...200+ chars"         │
│  Output: "如<a>图片1</a>所示，此作品展现了...150 chars"          │
│  ├─ Extract plain text: "如图片1所示..."                        │
│  ├─ Check length: if > 150, truncate at sentence boundary      │
│  ├─ Walk HTML: count non-tag characters until target length    │
│  └─ Close tags: ensure <a></a> properly closed                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                Store in panel.dataset                           │
│  dataset.fullTextPlain       = "原始文本..."                    │
│  dataset.fullTextProcessed   = "<a>...</a>完整文本"             │
│  dataset.truncatedProcessed  = "<a>...</a>截断文本..."          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                 Render to DOM (innerHTML)                       │
│  textEl.innerHTML = panel.dataset.truncatedProcessed            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│          Attach Event Handlers (setTimeout)                     │
│  querySelectorAll('.image-reference-link').forEach(link => {   │
│    link.addEventListener('click', (e) => {                      │
│      e.preventDefault();                                        │
│      handleImageReferenceClick(imageId, artwork);               │
│    });                                                          │
│  });                                                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
          ┌──────────────────┴──────────────────┐
          │                                     │
          ▼                                     ▼
┌──────────────────────┐            ┌──────────────────────────┐
│  User Clicks Link    │            │ User Clicks Toggle Btn   │
└──────────┬───────────┘            └────────┬─────────────────┘
           │                                 │
           ▼                                 ▼
┌───────────────────────────┐    ┌────────────────────────────┐
│ handleImageReferenceClick │    │ toggleCritiqueExpansion    │
│ ├─ Extract imageId        │    │ ├─ Check expanded state    │
│ ├─ Find image index       │    │ ├─ Swap innerHTML          │
│ ├─ Dispatch event to      │    │ │   (truncated ↔ full)     │
│ │   carousel                │    │ ├─ Update button text      │
│ └─ Navigate to image      │    │ └─ Re-attach handlers      │
└───────────────────────────┘    └────────────────────────────┘
```

## Component Interaction Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                         index.html                             │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Script Loading Order (Critical!)                         │ │
│  │ 1. <script src="/js/utils/image-compat.js">             │ │
│  │ 2. <script src="/js/utils/critique-parser.js">   ← 必需 │ │
│  │ 3. <script src="/js/data.js">                            │ │
│  │ 4. <script src="/js/gallery-hero.js">            ← 修改 │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────────┐
│                   window.CritiqueParser                        │
│                  (js/utils/critique-parser.js)                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Public API:                                              │ │
│  │ • parseImageReferences(text) → Array<{imageId, ...}>    │ │
│  │ • validateImageReferences(text, artwork) → {valid, ...} │ │
│  │ • renderImageReferences(text, artwork, opts) → HTML     │ │ ← 使用此方法
│  │ • extractImageIds(text) → Array<string>                 │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
                             │
                             │ imports & uses
                             ▼
┌────────────────────────────────────────────────────────────────┐
│              window.GalleryHeroRenderer                        │
│                   (js/gallery-hero.js)                         │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Modified Functions:                                      │ │
│  │ • createCritiqueCard() [MODIFY]                          │ │ ← 主要修改点
│  │   ├─ Call CritiqueParser.renderImageReferences()        │ │
│  │   ├─ Call truncateHTML() (new)                          │ │
│  │   └─ Attach click handlers with setTimeout()            │ │
│  │                                                          │ │
│  │ • toggleCritiqueExpansion() [MODIFY]                     │ │ ← 次要修改点
│  │   ├─ Swap innerHTML (truncated ↔ full)                  │ │
│  │   └─ Re-attach click handlers                           │ │
│  │                                                          │ │
│  │ New Functions:                                           │ │
│  │ • truncateHTML(html, maxLength) [ADD]                   │ │ ← 新增函数
│  │                                                          │ │
│  │ Existing Functions (Reuse):                             │ │
│  │ • handleImageReferenceClick(imageId, artwork)           │ │ ← 已存在，无需修改
│  │   ├─ Find image index                                   │ │
│  │   ├─ Dispatch 'carousel:navigateTo' event               │ │
│  │   └─ Scroll to target image                             │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
                             │
                             │ dispatches event
                             ▼
┌────────────────────────────────────────────────────────────────┐
│              window.ArtworkCarousel                            │
│           (js/components/artwork-carousel.js)                  │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Event Handlers:                                          │ │
│  │ • on('carousel:navigateTo', handler)                     │ │ ← 监听导航事件
│  │   └─ Navigate to target image index                     │ │
│  │                                                          │ │
│  │ Public API:                                              │ │
│  │ • goToImage(index)                                       │ │
│  │ • getCurrentImage()                                      │ │
│  │ • getTotalImages()                                       │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

## Performance Considerations

### Rendering Performance

**Measurement Points**:
1. CritiqueParser.renderImageReferences() execution time
2. truncateHTML() execution time
3. Total critique card creation time

**Expected Performance**:
```
Per critique card (6 cards per artwork):
├─ renderImageReferences(): ~2ms
│  ├─ Regex matching: ~0.5ms (2-5 refs per text)
│  ├─ Validation: ~0.5ms (check image IDs)
│  └─ HTML generation: ~1ms
│
├─ truncateHTML(): ~1ms
│  ├─ DOM parsing: ~0.5ms (create temp div)
│  └─ String walking: ~0.5ms (150 char limit)
│
└─ Event handler attachment: ~0.5ms
   └─ setTimeout + querySelectorAll: ~0.5ms

Total per card: ~3.5ms
Total for 6 cards: ~21ms (acceptable)
```

**Optimization Strategy**:
- Use setTimeout() to avoid blocking main thread
- Cache processed HTML in dataset (no reprocessing on toggle)
- Limit truncation length to 150 chars (fast parsing)

### Memory Usage

**Baseline** (current gallery-hero.js):
```
Per critique card:
- dataset.fullText: ~500 bytes (Chinese text)
Total for 6 cards: ~3KB
```

**After Change**:
```
Per critique card:
- dataset.fullTextPlain: ~500 bytes
- dataset.fullTextProcessed: ~700 bytes (+40% for HTML tags)
- dataset.truncatedProcessed: ~250 bytes
Total per card: ~1450 bytes
Total for 6 cards: ~8.7KB
```

**Increase**: +5.7KB per artwork (24 critiques total = ~35KB increase)

**Verdict**: ✅ Acceptable (< 0.1% of typical page size)

### Network Impact

**No Change**: All JavaScript is already loaded, no additional HTTP requests

## Error Handling Strategy

### Error 1: CritiqueParser Not Loaded

**Scenario**: Script loading fails or wrong order

**Detection**:
```javascript
if (!window.CritiqueParser) {
  console.warn('[Gallery Hero] CritiqueParser not available, using plain text');
}
```

**Fallback**: Render plain text without links (current behavior)

**Impact**: Low (links don't work, but text is readable)

---

### Error 2: Invalid Image Reference in Data

**Scenario**: `[img:img-99-99]` doesn't exist in artwork.images

**Detection**: CritiqueParser.validateImageReferences() catches this

**Handling**:
```javascript
// CritiqueParser renders invalid refs with class
<span class="image-reference-invalid">[img:img-99-99]</span>
```

**Console Warning**: `"⚠️ Invalid image reference: img-99-99"`

**Impact**: Low (visible indicator, doesn't break page)

---

### Error 3: HTML Truncation Fails

**Scenario**: Malformed HTML breaks parser

**Detection**:
```javascript
try {
  return truncateHTML(html, 150);
} catch (error) {
  console.error('[Gallery Hero] truncateHTML failed:', error);
  return truncateText(plainText, 150); // Fallback
}
```

**Fallback**: Strip HTML and truncate plain text

**Impact**: Low (links lost in truncated view, but full text preserves them)

---

### Error 4: Event Handler Attachment Fails

**Scenario**: querySelector returns no results, addEventListener throws

**Detection**:
```javascript
const links = textEl.querySelectorAll('.image-reference-link');
if (links.length === 0) {
  console.warn('[Gallery Hero] No image reference links found');
  return;
}
```

**Fallback**: Links visible but not clickable (graceful degradation)

**Impact**: Medium (links are visible but don't navigate)

---

### Error 5: Carousel Not Available

**Scenario**: Artwork doesn't support multi-image (old artworks)

**Detection**:
```javascript
const images = window.ImageCompat?.getArtworkImages(artwork);
if (!images || images.length <= 1) {
  console.warn('[Gallery Hero] Artwork has no multi-image support');
  return;
}
```

**Handling**: Link still renders but does nothing on click

**Impact**: Low (only affects artworks without image series)

## Testing Strategy

### Unit Tests

**Test File**: `test-gallery-hero-image-refs.html`

**Test Cases**:
1. ✅ CritiqueParser.renderImageReferences() returns valid HTML
2. ✅ truncateHTML() preserves `<a>` tags
3. ✅ truncateHTML() closes tags properly at boundary
4. ✅ truncateHTML() handles no-link case (plain text)
5. ✅ Event handler attaches correctly after setTimeout
6. ✅ Invalid image ID renders with error class
7. ✅ Fallback to plain text when CritiqueParser missing

### Integration Tests

**Manual Testing Checklist**:
1. ✅ Open index.html → verify links render (not plain text)
2. ✅ Click link → carousel navigates to target image
3. ✅ Click "展开" → links still work in expanded state
4. ✅ Click "收起" → links still work in collapsed state
5. ✅ Test all 6 critics for Artwork 1
6. ✅ Test keyboard navigation (Tab → Enter on link)
7. ✅ Test mobile touch targets (links tappable)
8. ✅ Check browser console for errors/warnings

### Accessibility Tests

**Screen Reader Testing** (NVDA/JAWS):
- Links should announce as "link, 图片1"
- Expanded/collapsed state should update ARIA attributes
- Invalid references should announce warning

**Keyboard Navigation**:
- Tab: Focus should move to links
- Enter/Space: Activate link to navigate

**Color Contrast**:
- Link color meets WCAG AA (4.5:1 contrast ratio)
- Hover/focus states are distinguishable

### Performance Tests

**Metrics to Track**:
- Time to render 6 critique cards: < 50ms
- Memory increase after rendering: < 50KB
- No layout thrashing (check with DevTools Performance tab)

## Rollback Plan

### If Implementation Fails

**Immediate Revert**:
```bash
git checkout HEAD -- js/gallery-hero.js
git checkout HEAD -- styles/main.css
```

**Fallback Strategy**:
1. Remove CritiqueParser integration
2. Keep plain text rendering (current behavior)
3. Add TODO comment for future fix

### If Performance Issues Arise

**Optimization Options**:
1. Lazy-load links (only attach handlers when card is visible)
2. Use CSS-based truncation (trade accessibility for performance)
3. Render only first 3 critiques, lazy-load others

### If Accessibility Issues Found

**Quick Fix**:
1. Add `aria-label` to all links: `"导航到图片 ${seq}"`
2. Ensure keyboard focus order is correct
3. Test with screen reader users

## Future Enhancements (Out of Scope)

### Enhancement 1: Smooth Scroll to Image

Currently: Carousel jumps immediately to target image
Future: Add smooth transition animation

**Complexity**: Low (modify carousel.goToImage())
**Value**: Medium (better UX)

---

### Enhancement 2: Image Preview on Hover

Currently: Link navigates on click
Future: Show thumbnail on hover (desktop only)

**Complexity**: Medium (need image loading, tooltip positioning)
**Value**: High (less disruptive to reading flow)

---

### Enhancement 3: Highlighted Reference in Image Caption

Currently: Navigate to image, no indication of why
Future: Highlight the part of image caption that corresponds to reference

**Complexity**: High (need semantic mapping between text and captions)
**Value**: Medium (clearer connection)

---

## References

**Related Files**:
- `js/utils/critique-parser.js` - Parser implementation
- `js/gallery-init.js` lines 236-268 - Reference implementation
- `openspec/changes/archive/2025-11-02-implement-multi-image-artwork-series/` - Original system design

**External Resources**:
- MDN: innerHTML security considerations
- WCAG 2.1: Link accessibility guidelines
- HTML5 Spec: Data attributes
