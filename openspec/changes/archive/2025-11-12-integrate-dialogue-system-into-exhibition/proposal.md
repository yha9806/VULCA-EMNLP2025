# Proposal: Integrate Dialogue System into Exhibition

**Change ID**: `integrate-dialogue-system-into-exhibition`
**Status**: Draft
**Created**: 2025-11-12
**Author**: Claude Code

## Problem Statement

The dialogue system has been successfully developed and tested in standalone test pages (`test-artwork-5-dialogue.html`, `test-artwork-6-dialogue.html`), but it's not yet integrated into the main website structure. Additionally, there are three critical issues that need to be addressed:

### Issue 1: Isolated Test Pages
**Current State**: Dialogue player exists only in test pages (`test-*.html`), not accessible from main navigation or exhibition pages.

**User Impact**: Visitors cannot access the dialogue functionality from the main website. The feature is "hidden" in development test files.

**Expected Behavior**: Dialogue system should be accessible as a page within each exhibition (e.g., `/exhibitions/negative-space-of-the-tide/dialogues.html`), following the existing exhibition architecture pattern.

### Issue 2: Missing Artwork Images in Dialogue View
**Current State**: Dialogue messages display in a single column without accompanying artwork visuals.

**Reference Implementation**: The original Sougwen Chung exhibition and online website show a split-view layout:
- Left side: Artwork image (maintains aspect ratio)
- Right side: Dialogue/critique content

**User Impact**: Context is lost without visual reference to the artwork being discussed.

**Expected Behavior**:
- Desktop (>768px): Side-by-side layout (image left, dialogue right)
- Mobile (≤768px): Stacked layout (image top, dialogue bottom)
- Aspect ratio preservation at all breakpoints

### Issue 3: Incorrect Display States for Future Messages and References
**Current State**:
1. **Knowledge Base References**: Always expanded (`expanded` class added by default), showing full content immediately
2. **Future Messages**: Display with 40% opacity (`opacity: 0.4`) from page load, showing thought chains but visible as semi-transparent placeholders

**Expected Behavior**:
1. **References**: Collapsed by default, only expand when user clicks the "📚 X 个引用" badge
2. **Future Messages**: Completely hidden until they become "current" (revealed sequentially with animation)

**CSS Evidence** (from `styles/components/dialogue-player.css`):
```css
/* Line 195-199: Future messages shown with 40% opacity */
.dialogue-message.future {
  opacity: 0.4;
  transition: opacity 0.3s ease-out;
  position: relative;
}

/* Line 202-204: Content hidden but container still visible */
.dialogue-message.future .message-content {
  display: none !important;
}
```

**User Feedback**: "这个一直显示的问题同样出现在思考延迟逐一出现的效果部分，他会一直处于半透明的状态显示，这是不对的。我需要你随着正文显示才能显示。"

## Proposed Solution

### Part 1: Exhibition Integration (Architecture)
**Approach**: Follow existing exhibition pattern seen in `congsheng-2025` and `negative-space-of-the-tide`:

```
exhibitions/negative-space-of-the-tide/
├── index.html              # Main exhibition page (artworks grid)
├── dialogues.html          # NEW: Dialogue player page
├── data.json               # Existing: Critiques data
├── config.json             # Existing: Exhibition metadata
└── assets/                 # Artwork images
```

**Navigation Flow**:
1. User visits `/exhibitions/negative-space-of-the-tide/`
2. Sees 38 artworks in grid layout
3. Clicks artwork → Opens `/exhibitions/negative-space-of-the-tide/dialogues.html?artwork=artwork-5`
4. Dialogue player loads artwork-5 dialogue with artwork image visible

**Implementation Strategy**:
- Create `dialogues.html` template for negative-space-of-the-tide exhibition
- Add URL parameter handling for `?artwork=artwork-X`
- Load dialogue data from `js/data/dialogues/artwork-X.js`
- Load artwork metadata from `data.json`
- Integrate with global navigation system

### Part 2: Split-View Layout (UI/UX)
**Desktop Layout (>768px)**:
```
┌─────────────────────────────────────────┐
│ [Artwork Image]     │  [Dialogue Player]│
│  40% width          │    60% width      │
│  Sticky positioning │  Scrollable       │
│  Aspect ratio       │                   │
│  preserved          │                   │
└─────────────────────────────────────────┘
```

**Mobile Layout (≤768px)**:
```
┌─────────────────────┐
│ [Artwork Image]     │
│  Full width         │
│  Aspect ratio       │
│  preserved          │
├─────────────────────┤
│ [Dialogue Player]   │
│  Full width         │
│  Scrollable         │
└─────────────────────┘
```

**CSS Architecture**:
```css
.dialogue-page-container {
  display: grid;
  grid-template-columns: 40% 60%; /* Desktop */
  gap: 2rem;
}

@media (max-width: 768px) {
  .dialogue-page-container {
    grid-template-columns: 1fr; /* Mobile: stacked */
  }
}
```

**Image Handling**:
- Use `<img>` with `object-fit: contain` for aspect ratio preservation
- Load from `exhibitions/negative-space-of-the-tide/assets/artwork-X.jpg`
- Fallback to placeholder if image missing (existing system)

### Part 3: Display State Fixes (Logic)

#### Fix 3A: References Collapsed by Default
**Problem**: References currently have `expanded` class added at creation time.

**Solution**: Remove default expansion logic, ensure collapsed state on initial render.

**Code Change** (in `js/components/dialogue-player.js`):
```javascript
// BEFORE (line ~1081):
refList.classList.toggle('expanded');

// AFTER:
refList.classList.remove('expanded'); // Start collapsed
```

**Verification**: Badge shows "📚 X 个引用" with collapsed list, expands only on click.

#### Fix 3B: Future Messages Hidden Until Revealed
**Problem**: `.future` class sets `opacity: 0.4`, making messages visible as semi-transparent.

**Solution**: Change from opacity-based dimming to visibility-based hiding.

**CSS Change** (in `styles/components/dialogue-player.css`):
```css
/* BEFORE (line 195-199): */
.dialogue-message.future {
  opacity: 0.4;
  transition: opacity 0.3s ease-out;
  position: relative;
}

/* AFTER: */
.dialogue-message.future {
  display: none; /* Completely hidden, not dimmed */
  position: relative;
}
```

**Animation Flow**:
1. Message starts with `.future` (display: none)
2. When timestamp reached, remove `.future`, add `.current`
3. Apply fade-in animation via `.current` class
4. After delay, change to `.past` for context

**User-Visible Impact**:
- Page loads showing only first message
- Future messages appear one-by-one as they're "generated"
- No semi-transparent placeholders visible

## Impact Assessment

### Affected Components
1. **New Files**:
   - `exhibitions/negative-space-of-the-tide/dialogues.html`
   - `styles/components/dialogue-split-view.css` (optional, can be inline)

2. **Modified Files**:
   - `js/components/dialogue-player.js` (reference collapse logic)
   - `styles/components/dialogue-player.css` (future message visibility)
   - `exhibitions/negative-space-of-the-tide/index.html` (add navigation links)

3. **No Breaking Changes**:
   - Test pages (`test-*.html`) continue to work unchanged
   - Existing critique system (`data.json`) unchanged
   - Dialogue data files (`js/data/dialogues/*.js`) unchanged

### User Experience Improvements
1. **Discoverability**: Dialogue feature accessible via exhibition navigation
2. **Context**: Artwork image visible alongside dialogue for visual reference
3. **Clarity**: References collapsed by default, reducing visual clutter
4. **Natural Flow**: Messages appear sequentially without visible "future" placeholders

### Performance Considerations
- **Image Loading**: Lazy loading for artwork images (`loading="lazy"`)
- **Dialogue Data**: Already modular (per-artwork files), no bulk loading
- **CSS**: Minimal additional styles (~50 lines for split-view layout)

## Validation Criteria

### Success Metrics
1. **Integration**:
   - [ ] Dialogue page accessible from exhibition index via URL parameter
   - [ ] Global navigation shows current page as "对话" (Dialogues)
   - [ ] Browser back button returns to exhibition index

2. **Layout**:
   - [ ] Desktop: Image 40% width, sticky, aspect ratio preserved
   - [ ] Mobile: Image stacked above dialogue, full width
   - [ ] All breakpoints (375px, 768px, 1024px, 1440px) verified

3. **Display States**:
   - [ ] References collapsed on load, badge shows count
   - [ ] First click expands references, second click collapses
   - [ ] Future messages hidden (not visible at any opacity)
   - [ ] Messages appear one-by-one with fade-in animation

### Testing Checklist
- [ ] Test artwork-5 dialogue with real artwork image
- [ ] Test artwork-6 dialogue with placeholder fallback
- [ ] Verify language switching (EN/中) maintains state
- [ ] Verify mobile responsive behavior (DevTools + real device)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)

## Dependencies

### Required Before Implementation
- [x] Dialogue data files exist (`js/data/dialogues/artwork-1.js` to `artwork-38.js`)
- [x] Dialogue player component functional (`js/components/dialogue-player.js`)
- [x] Artwork metadata in `data.json` (38 artworks)
- [ ] Artwork images in `exhibitions/negative-space-of-the-tide/assets/` (or placeholder system working)

### No Dependencies On
- Other OpenSpec changes (independent implementation)
- API changes (static data)
- Build system changes (pure HTML/CSS/JS)

## Alternatives Considered

### Alternative 1: Modal Overlay (Rejected)
**Approach**: Show dialogue in modal overlay on artwork click (like current critique modal).

**Rejected Because**:
- Dialogue player needs full screen space for message flow
- Modal UX poor for long conversation (30+ messages)
- Artwork image context lost in modal

### Alternative 2: Inline Expansion (Rejected)
**Approach**: Expand dialogue accordion-style within artwork grid card.

**Rejected Because**:
- Disrupts grid layout flow
- Awkward scrolling behavior (nested scroll containers)
- Mobile UX especially poor

### Alternative 3: Separate Section on Same Page (Considered)
**Approach**: Add dialogue player as section below artwork grid on `index.html`.

**Pros**: No new page, simpler navigation
**Cons**: Very long page, awkward URL sharing, poor separation of concerns

**Decision**: Separate page (Proposal Part 1) provides better UX and cleaner architecture.

## Implementation Notes

### Phase Breakdown
**Phase 1**: Exhibition Integration (Architecture)
- Create `dialogues.html` page
- Add URL parameter handling
- Link from exhibition index

**Phase 2**: Split-View Layout (UI)
- Implement desktop/mobile responsive grid
- Add artwork image loading
- Style adjustments for new layout

**Phase 3**: Display State Fixes (Logic)
- Fix reference collapse default
- Fix future message visibility
- Test animation flow

**Estimated Time**: 4-6 hours total (1.5h + 2h + 1.5h + 1h testing)

### Risks and Mitigations
**Risk 1**: Image aspect ratios vary across artworks (not uniform)
- **Mitigation**: Use `object-fit: contain` to preserve any ratio

**Risk 2**: Some artworks may lack images
- **Mitigation**: Existing placeholder system already handles this

**Risk 3**: Breaking test pages by changing CSS
- **Mitigation**: Use scoped classes (`.dialogue-page-container`), keep existing classes unchanged

## Open Questions

1. **Exhibition Index Linking**: Should we add "View Dialogues" button to each artwork card in grid?
   - Proposed: Yes, add small button/icon on hover

2. **Direct Deep Linking**: Should `/exhibitions/negative-space-of-the-tide/dialogues.html` (no param) show all artworks or error?
   - Proposed: Show artwork selector (dropdown or grid of thumbnails)

3. **Artwork Navigation**: Should dialogue page have prev/next buttons to navigate between artworks?
   - Proposed: Yes, add navigation arrows (< artwork-4 | artwork-6 >)

4. **Analytics**: Track which artworks have most dialogue views?
   - Proposed: Out of scope for this change, can add later

## Approval Required

Before proceeding to implementation:
- [ ] User confirms split-view layout approach (40/60 ratio)
- [ ] User confirms future message hiding strategy (display: none vs opacity)
- [ ] User confirms dialogue page URL structure (`dialogues.html?artwork=X`)

---

**Next Steps**: See `tasks.md` for detailed implementation checklist.
