# Proposal: Add URL Parameter Navigation to Exhibition

**Change ID**: `add-url-parameter-navigation-to-exhibition`
**Status**: Draft
**Created**: 2025-11-12
**Author**: Claude Code

## Problem Statement

### Issue 1: No Way to Link to Specific Artworks
**Current State**: `index.html` always shows artwork-1 on load. No URL-based navigation to view specific artworks.

**User Impact**:
- Cannot share links to specific artwork dialogues (e.g., "Check out artwork-7")
- Cannot bookmark specific artworks
- Must manually navigate through 38 artworks to find a specific one

**Expected Behavior**:
- `index.html` → Shows artwork-1 (default)
- `index.html?artwork=artwork-7` → Shows artwork-7 directly
- `index.html?artwork=artwork-15` → Shows artwork-15 directly

### Issue 2: Unnecessary Files Created
**Current State**: Attempted to create `dialogues.html` as a separate page, but `index.html` already has all the functionality needed.

**Files to Clean Up**:
- `exhibitions/negative-space-of-the-tide/dialogues.html` (just created, not needed)
- Any other test pages that are no longer used

**Expected Behavior**: Use `index.html` as the single source of truth for the exhibition.

### Issue 3: Display State Issues Still Present
**Current State** (in `index.html`):
1. **Knowledge base references**: Need to verify they're collapsed by default
2. **Future messages**: Need to verify they're completely hidden (not semi-transparent)

**Expected Behavior**:
1. References collapsed on load, expand only when badge clicked
2. Future messages use `display: none` (not `opacity: 0.4`)

## Proposed Solution

### Part 1: Add URL Parameter Support to index.html
**Implementation**:
1. Parse `?artwork=artwork-X` from URL on page load
2. If parameter exists and valid → load that artwork
3. If parameter missing or invalid → default to artwork-1
4. Update browser URL when user navigates to different artwork (via prev/next buttons)

**Code Location**: `exhibitions/negative-space-of-the-tide/index.html` (inline script or `js/gallery-init.js`)

**Validation**:
- `index.html` → Shows artwork-1
- `index.html?artwork=artwork-7` → Shows artwork-7
- `index.html?artwork=invalid` → Shows artwork-1 (fallback)
- Clicking "Next Artwork" → Updates URL to `?artwork=artwork-2`

### Part 2: Clean Up Unnecessary Files
**Files to Delete**:
1. `exhibitions/negative-space-of-the-tide/dialogues.html` (redundant)
2. Any test pages no longer in use (to be identified)

**Validation**:
- Verify all functionality still works after deletion
- Check that no internal links reference deleted files

### Part 3: Verify Display States
**Check Current Behavior**:
1. Load `index.html?artwork=artwork-1`
2. Inspect knowledge base references (should be collapsed)
3. Inspect future messages (should be `display: none`)

**Fix if Needed**:
- Already fixed in `dialogue-player.css` (lines 195-199 changed to `display: none`)
- Verify `reference-list.css` is loaded correctly

## User Requirements Met

✅ **Requirement 1**: "这个网页需要集成在现有的主网站上"
- Solution: Use existing `index.html` with URL parameters

✅ **Requirement 2**: "作品的评论旁边需要有图片，图片在左边，评论内容和对话在右面"
- Already implemented in `index.html` (40/60 split layout)

✅ **Requirement 3**: "reference的内容没有按钮（点击显示），而是长时间一直显示"
- Solution: Verify references are collapsed by default

✅ **Requirement 4**: "思考延迟逐一出现的效果部分，他会一直处于半透明的状态显示"
- Solution: Future messages use `display: none` (already fixed in CSS)

## Risks and Mitigations

**Risk 1**: Breaking existing functionality
- **Mitigation**: Test all navigation flows before and after changes

**Risk 2**: Browser history pollution
- **Mitigation**: Use `history.replaceState()` for first load, `pushState()` for user navigation

**Risk 3**: SEO impact of URL parameters
- **Mitigation**: Add canonical links, use proper meta tags

## Success Criteria

1. ✅ Can navigate to any artwork via URL: `index.html?artwork=artwork-X`
2. ✅ Default artwork (no parameter) shows artwork-1
3. ✅ Browser back/forward buttons work correctly
4. ✅ URL updates when user clicks prev/next navigation
5. ✅ All unnecessary files deleted
6. ✅ References collapsed by default
7. ✅ Future messages completely hidden
8. ✅ All existing functionality preserved

## Timeline Estimate

- Part 1 (URL parameters): 2 hours
- Part 2 (File cleanup): 30 minutes
- Part 3 (Display state verification): 1 hour
- **Total**: ~3.5 hours
