# Tasks: Add URL Parameter Navigation to Exhibition

**Change**: `add-url-parameter-navigation-to-exhibition`
**Last Updated**: 2025-11-12

## Phase 1: URL Parameter Support (Core Functionality)

### Task 1.1: Add URL Parameter Parsing to index.html
**Estimate**: 30 minutes
**Dependencies**: None

**Implementation**:
1. Open `exhibitions/negative-space-of-the-tide/index.html`
2. Find gallery initialization code (likely in `<script>` tag or `js/gallery-init.js`)
3. Add URL parameter parsing:
   ```javascript
   // Parse URL parameter
   const urlParams = new URLSearchParams(window.location.search);
   const artworkParam = urlParams.get('artwork');

   // Validate and get artwork index
   let initialArtworkIndex = 0; // Default to artwork-1

   if (artworkParam) {
     const artworkIndex = VULCA_DATA.artworks.findIndex(a => a.id === artworkParam);
     if (artworkIndex !== -1) {
       initialArtworkIndex = artworkIndex;
     } else {
       console.warn(`Invalid artwork ID: ${artworkParam}, defaulting to artwork-1`);
     }
   }
   ```
4. Pass `initialArtworkIndex` to gallery initialization

**Validation**:
- [ ] `index.html` loads artwork-1 by default
- [ ] `index.html?artwork=artwork-7` loads artwork-7
- [ ] `index.html?artwork=invalid` loads artwork-1 (fallback)
- [ ] Console shows warning for invalid IDs

---

### Task 1.2: Update UnifiedNavigation to Modify URL on Navigation
**Estimate**: 45 minutes
**Dependencies**: Task 1.1

**Implementation**:
1. Open `js/components/unified-navigation.js`
2. Find prev/next button click handlers
3. Add `history.pushState()` call after navigation:
   ```javascript
   // In navigateToArtwork() or similar function
   const newArtworkId = VULCA_DATA.artworks[newIndex].id;
   const newUrl = `?artwork=${newArtworkId}`;
   history.pushState({ artworkId: newArtworkId, index: newIndex }, '', newUrl);
   ```
4. Add `popstate` event listener to handle browser back/forward:
   ```javascript
   window.addEventListener('popstate', (event) => {
     if (event.state?.artworkId) {
       const artworkIndex = VULCA_DATA.artworks.findIndex(a => a.id === event.state.artworkId);
       if (artworkIndex !== -1) {
         navigateToArtwork(artworkIndex, false); // false = don't push history again
       }
     }
   });
   ```

**Validation**:
- [ ] Clicking "Next" updates URL to `?artwork=artwork-2`
- [ ] Clicking "Prev" updates URL to `?artwork=artwork-1`
- [ ] Browser back button returns to previous artwork
- [ ] Browser forward button goes to next artwork
- [ ] No duplicate history entries

---

### Task 1.3: Use replaceState for Initial Page Load
**Estimate**: 15 minutes
**Dependencies**: Task 1.1, 1.2

**Implementation**:
1. In gallery initialization (Task 1.1 location)
2. After determining initial artwork, replace URL:
   ```javascript
   const initialArtworkId = VULCA_DATA.artworks[initialArtworkIndex].id;
   const initialUrl = `?artwork=${initialArtworkId}`;
   history.replaceState({ artworkId: initialArtworkId, index: initialArtworkIndex }, '', initialUrl);
   ```

**Validation**:
- [ ] Loading `index.html` shows URL `?artwork=artwork-1`
- [ ] Loading `index.html?artwork=artwork-7` keeps URL unchanged
- [ ] Browser back button returns to referrer (not previous page load)

---

## Phase 2: File Cleanup

### Task 2.1: Delete Redundant dialogues.html
**Estimate**: 10 minutes
**Dependencies**: None

**Implementation**:
1. Verify `dialogues.html` is not referenced anywhere:
   ```bash
   cd /i/VULCA-EMNLP2025
   rg "dialogues\.html" --type html --type js
   ```
2. Delete file:
   ```bash
   rm exhibitions/negative-space-of-the-tide/dialogues.html
   ```
3. Commit deletion with message: "chore: Remove redundant dialogues.html (functionality in index.html)"

**Validation**:
- [ ] File deleted
- [ ] No broken links
- [ ] All functionality still works via index.html

---

### Task 2.2: Identify and Clean Up Test Pages
**Estimate**: 20 minutes
**Dependencies**: None

**Implementation**:
1. List all test pages:
   ```bash
   ls test-*.html
   ```
2. Identify which are still needed:
   - Keep: `test-quote-interaction.html` (reference implementation)
   - Delete: Pages that duplicate index.html functionality
3. Move kept test pages to `tests/` directory if needed
4. Delete obsolete test pages

**Validation**:
- [ ] Only active test pages remain
- [ ] Reference implementation preserved
- [ ] No orphaned CSS/JS files

---

## Phase 3: Display State Verification

### Task 3.1: Verify Reference List CSS Loaded in index.html
**Estimate**: 15 minutes
**Dependencies**: None

**Implementation**:
1. Open `exhibitions/negative-space-of-the-tide/index.html`
2. Check `<head>` section for CSS files:
   ```html
   <link rel="stylesheet" href="/styles/components/dialogue-player.css?v=2">
   <link rel="stylesheet" href="/styles/components/reference-badge.css?v=1">
   <link rel="stylesheet" href="/styles/components/reference-list.css?v=1">
   ```
3. If missing, add the missing `<link>` tags
4. Clear browser cache and reload

**Validation**:
- [ ] All 3 CSS files loaded in Network tab
- [ ] No 404 errors for CSS files
- [ ] References have correct collapsed styling

---

### Task 3.2: Test Reference Collapse/Expand Behavior
**Estimate**: 20 minutes
**Dependencies**: Task 3.1

**Test Steps**:
1. Load `index.html?artwork=artwork-1`
2. Inspect first message with references:
   - [ ] References not visible
   - [ ] Badge shows "📚 3 个引用"
   - [ ] Computed style: `max-height: 0px`
3. Click reference badge:
   - [ ] References expand smoothly
   - [ ] Content becomes visible
   - [ ] Computed style: `max-height: 600px`
4. Click badge again:
   - [ ] References collapse
   - [ ] Content becomes hidden

**Fix if Failing**:
- Check `reference-list.css` is loaded
- Verify DialoguePlayer creates references correctly
- Check for CSS conflicts

---

### Task 3.3: Test Future Message Visibility
**Estimate**: 20 minutes
**Dependencies**: None

**Test Steps**:
1. Load `index.html?artwork=artwork-1`
2. Inspect future messages (messages 2-30):
   - [ ] Completely hidden (not semi-transparent)
   - [ ] Computed style: `display: none`
   - [ ] No visible placeholders
3. Wait for message reveal (6-8 seconds):
   - [ ] Message 2 appears with fade-in
   - [ ] Message 1 becomes dimmed (.past class)
   - [ ] Message 3+ still hidden
4. Continue observing:
   - [ ] Messages reveal sequentially
   - [ ] Only current message fully visible

**Fix if Failing**:
- Check `dialogue-player.css` line 195-199
- Should be `display: none`, not `opacity: 0.4`
- Verify DialoguePlayer sets correct classes

---

## Phase 4: Cross-Browser Testing

### Task 4.1: Test in Chrome/Edge
**Estimate**: 15 minutes
**Dependencies**: All Phase 1-3 tasks

**Test Checklist**:
- [ ] URL parameters work
- [ ] Navigation updates URL
- [ ] Back/forward buttons work
- [ ] References collapsed
- [ ] Future messages hidden
- [ ] Animations smooth

---

### Task 4.2: Test in Firefox
**Estimate**: 15 minutes
**Dependencies**: All Phase 1-3 tasks

**Test Checklist**:
- [ ] Same as Task 4.1

---

### Task 4.3: Test in Safari (if available)
**Estimate**: 15 minutes
**Dependencies**: All Phase 1-3 tasks

**Test Checklist**:
- [ ] Same as Task 4.1

---

## Phase 5: Documentation and Finalization

### Task 5.1: Update CLAUDE.md with New Navigation
**Estimate**: 10 minutes
**Dependencies**: All implementation tasks

**Updates**:
1. Add section explaining URL parameter navigation
2. Document new URLs:
   - `index.html` → artwork-1
   - `index.html?artwork=artwork-X` → artwork-X
3. Update examples in "Local Testing" section

**Validation**:
- [ ] Documentation accurate
- [ ] Examples tested

---

### Task 5.2: Archive OpenSpec Change
**Estimate**: 5 minutes
**Dependencies**: All tasks complete

**Steps**:
1. Verify all tasks completed
2. Run: `openspec archive add-url-parameter-navigation-to-exhibition --yes`
3. Confirm specs updated correctly

**Validation**:
- [ ] Change archived
- [ ] Specs files moved
- [ ] Git commit created

---

## Summary

**Total Estimated Time**: ~4 hours
**Critical Path**: Phase 1 (URL navigation)
**Parallel Work**: Phase 2 (cleanup) can be done alongside Phase 3 (verification)

**Success Criteria**:
✅ All 38 artworks accessible via `index.html?artwork=artwork-X`
✅ Navigation updates URL and works with browser history
✅ References collapsed by default
✅ Future messages completely hidden
✅ All unnecessary files removed
✅ Cross-browser tested and working
