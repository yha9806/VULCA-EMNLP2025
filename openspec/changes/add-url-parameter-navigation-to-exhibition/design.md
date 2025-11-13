# Design: Add URL Parameter Navigation to Exhibition

**Change**: `add-url-parameter-navigation-to-exhibition`
**Last Updated**: 2025-11-12

## Architecture Decision

### Decision 1: Use index.html Instead of Creating dialogues.html

**Context**: Initially attempted to create a separate `dialogues.html` page, but `index.html` already has all required functionality:
- Split-view layout (image left, dialogue right)
- DialoguePlayer integration
- Image carousel
- Knowledge base references
- Prev/Next navigation

**Options Considered**:

**A. Separate dialogues.html Page**
- ✅ Clean separation of concerns
- ✅ Dedicated URL structure (`/dialogues.html?artwork=X`)
- ❌ Duplicate layout code
- ❌ Duplicate navigation logic
- ❌ Harder to maintain (two pages to update)
- ❌ Already built in index.html

**B. Use index.html with URL Parameters** ⭐ **SELECTED**
- ✅ Reuse existing, stable implementation
- ✅ Single source of truth
- ✅ Simpler maintenance
- ✅ Already has correct layout (40/60 split)
- ✅ References and display states already working
- ❌ Slightly longer URL (but same domain)

**Decision**: Option B - Extend `index.html` with URL parameter support.

**Rationale**: The user explicitly asked "为什么你一直在修复 dialogue.html? index.html 这个表现不是更稳定吗？" confirming that `index.html` is the preferred solution.

---

### Decision 2: URL Parameter Format

**Options Considered**:

**A. Query Parameter: `?artwork=artwork-7`** ⭐ **SELECTED**
- ✅ Standard web convention
- ✅ Easy to parse with `URLSearchParams`
- ✅ Works with existing navigation
- ✅ SEO-friendly with proper canonicalization

**B. Hash Fragment: `#artwork-7`**
- ✅ No server-side changes needed
- ❌ Harder to track in analytics
- ❌ Not standard for routing

**C. Path-based: `/artworks/artwork-7`**
- ✅ Clean URLs
- ❌ Requires server rewrites
- ❌ More complex to implement

**Decision**: Option A - Use query parameters.

**Implementation**:
```javascript
// Parse URL parameter
const urlParams = new URLSearchParams(window.location.search);
const artworkId = urlParams.get('artwork') || 'artwork-1';

// Validate artwork exists
const artworkIndex = VULCA_DATA.artworks.findIndex(a => a.id === artworkId);
if (artworkIndex === -1) {
  // Fallback to artwork-1
  artworkId = 'artwork-1';
  artworkIndex = 0;
}

// Initialize gallery with specific artwork
initializeGallery(artworkIndex);
```

---

### Decision 3: Browser History Management

**Options Considered**:

**A. Always Use pushState()**
- ✅ Full history stack
- ❌ Back button goes through every artwork user viewed

**B. Use replaceState() for First Load, pushState() for User Navigation** ⭐ **SELECTED**
- ✅ Back button returns to referrer (not previous artwork)
- ✅ User can still navigate forward through manually-clicked artworks
- ✅ Cleaner history

**C. Never Update URL**
- ✅ Simplest
- ❌ Can't bookmark specific artworks
- ❌ Can't share links

**Decision**: Option B - Hybrid approach.

**Implementation**:
```javascript
// On page load (from URL parameter)
history.replaceState({ artworkId }, '', `?artwork=${artworkId}`);

// On user navigation (prev/next click)
history.pushState({ artworkId }, '', `?artwork=${artworkId}`);

// Handle back/forward
window.addEventListener('popstate', (event) => {
  if (event.state?.artworkId) {
    navigateToArtwork(event.state.artworkId);
  }
});
```

---

### Decision 4: File Cleanup Strategy

**Files to Delete**:
1. **`exhibitions/negative-space-of-the-tide/dialogues.html`**
   - Reason: Redundant, `index.html` has all functionality
   - Risk: Low (just created, no production usage)

2. **Test pages** (to be identified):
   - `test-artwork-5-dialogue.html`
   - `test-artwork-6-dialogue.html`
   - `test-quote-interaction.html` (⚠️ user said this is the preferred implementation, keep as reference)
   - Others TBD

**Validation Before Deletion**:
1. Check for internal links referencing these files
2. Search codebase for hardcoded paths
3. Verify no documentation references
4. Keep backups in git history

---

### Decision 5: Display State Fixes

**Problem**: References and future messages showing incorrectly.

**Root Cause Analysis**:
1. **References always expanded**:
   - Cause: `reference-list.css` not loaded in some pages
   - Fix: Ensure CSS file loaded in `index.html`

2. **Future messages semi-transparent**:
   - Cause: `dialogue-player.css` line 195 used `opacity: 0.4`
   - Fix: Already changed to `display: none` in previous work

**Verification Steps**:
1. Check `index.html` has `<link>` tags for:
   - `styles/components/dialogue-player.css`
   - `styles/components/reference-list.css`
   - `styles/components/reference-badge.css`

2. Inspect computed styles:
   - `.reference-list` should have `max-height: 0` initially
   - `.dialogue-message.future` should have `display: none`

---

## Component Relationships

```
index.html
├── URL Parameter Parser (NEW)
│   └── Validates artwork ID
│   └── Defaults to artwork-1
├── Gallery Initialization
│   └── Uses parsed artwork index
├── UnifiedNavigation
│   └── Prev/Next update URL (NEW)
├── DialoguePlayer
│   └── Loads dialogue for current artwork
└── Image Carousel
    └── Shows images for current artwork
```

---

## Testing Strategy

### Unit Tests (Manual Verification)
1. **URL Parsing**:
   - `index.html` → artwork-1
   - `index.html?artwork=artwork-7` → artwork-7
   - `index.html?artwork=invalid` → artwork-1 (fallback)
   - `index.html?artwork=artwork-39` → artwork-1 (out of range)

2. **Navigation**:
   - Click "Next" → URL updates to `?artwork=artwork-2`
   - Click "Prev" → URL updates to `?artwork=artwork-1`
   - Browser back → Returns to previous artwork
   - Browser forward → Goes to next artwork

3. **Display States**:
   - References collapsed on load
   - Clicking badge expands references
   - Future messages completely hidden
   - Messages reveal sequentially

### Integration Tests
1. Load `index.html?artwork=artwork-7`
2. Verify artwork-7 image displays
3. Verify artwork-7 dialogue loads
4. Click next → artwork-8 loads
5. Check URL is now `?artwork=artwork-8`

---

## Performance Considerations

**Impact**: Minimal
- URL parsing is synchronous and fast (<1ms)
- No additional network requests
- Same resources loaded as before

**Optimization**:
- Cache artwork lookup by ID for faster navigation
- Use `history.state` to avoid re-parsing URL on popstate

---

## Security Considerations

**XSS Risk**: Low
- Artwork ID is validated against known list
- Invalid IDs fall back to safe default
- No user input directly rendered to DOM

**Validation**:
```javascript
const ARTWORK_ID_PATTERN = /^artwork-\d+$/;
if (!ARTWORK_ID_PATTERN.test(artworkId)) {
  artworkId = 'artwork-1'; // Safe fallback
}
```

---

## Rollback Plan

If issues arise:
1. Remove URL parameter parsing code
2. Restore default artwork-1 initialization
3. Revert history.pushState() calls
4. Keep deleted files in git history for recovery

---

## Future Enhancements

**Phase 2** (not in this change):
- Add artwork index page with grid of all 38 artworks
- Add search/filter functionality
- Add deep links to specific messages within dialogue
- Add social sharing meta tags (Open Graph, Twitter Cards)
