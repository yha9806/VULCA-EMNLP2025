# Design: Integrate Dialogue System into Exhibition

**Change ID**: `integrate-dialogue-system-into-exhibition`
**Last Updated**: 2025-11-12

## Architectural Decisions

### AD-1: Exhibition Page Architecture (Dedicated Dialogue Page)

**Context**: Dialogue player needs to be accessible from main website, integrated with exhibition structure.

**Options Considered**:
1. **Modal Overlay**: Show dialogue in modal when artwork clicked
2. **Inline Expansion**: Accordion-style expansion within grid
3. **Dedicated Page**: Separate `dialogues.html` within exhibition folder
4. **Section Navigation**: Add dialogue section below artwork grid on `index.html`

**Decision**: **Option 3 - Dedicated Page**

**Rationale**:
- ✅ **Clean Separation**: Dialogue experience distinct from critique browsing
- ✅ **URL Shareable**: Direct link to specific artwork dialogue (`?artwork=artwork-5`)
- ✅ **Full Screen Space**: Dialogue player needs room for message flow (30+ messages)
- ✅ **Browser Navigation**: Back button returns to exhibition index (natural UX)
- ✅ **Performance**: Only load dialogue data when needed
- ❌ Requires additional navigation link (minor cost)

**Rejected Alternatives**:
- **Option 1**: Modal poor UX for long conversations, artwork context lost
- **Option 2**: Disrupts grid layout, nested scrolling awkward
- **Option 4**: Very long page, poor URL sharing, mixed concerns

**Implementation Pattern**:
```
exhibitions/negative-space-of-the-tide/
├── index.html           # Grid of 38 artworks
├── dialogues.html       # Dialogue player (NEW)
└── assets/              # Artwork images
```

**URL Schema**:
- Exhibition index: `/exhibitions/negative-space-of-the-tide/`
- Specific dialogue: `/exhibitions/negative-space-of-the-tide/dialogues.html?artwork=artwork-5`
- Fallback (no param): Show artwork selector or redirect to first artwork

---

### AD-2: Split-View Layout (CSS Grid)

**Context**: Need to show artwork image alongside dialogue for visual context.

**Options Considered**:
1. **CSS Grid**: `grid-template-columns: 40% 60%`
2. **Flexbox**: `display: flex` with `flex-basis`
3. **Float**: Legacy float-based layout
4. **Absolute Positioning**: Fixed left panel, scrollable right

**Decision**: **Option 1 - CSS Grid**

**Rationale**:
- ✅ **Modern Standard**: Grid designed for 2D layouts
- ✅ **Responsive**: Single property change for mobile (`grid-template-columns: 1fr`)
- ✅ **Gap Handling**: Built-in `gap` property for spacing
- ✅ **Readability**: Intent clear from CSS
- ❌ IE11 unsupported (acceptable for 2025 project)

**Layout Specifications**:

**Desktop (>768px)**:
```css
.dialogue-page-container {
  display: grid;
  grid-template-columns: 40% 60%;
  gap: 2rem;
  align-items: start;
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem;
}

.artwork-panel {
  position: sticky;
  top: 2rem; /* Stays in view during scroll */
}

.dialogue-panel {
  /* Scrollable content */
}
```

**Mobile (≤768px)**:
```css
@media (max-width: 768px) {
  .dialogue-page-container {
    grid-template-columns: 1fr; /* Stack */
    gap: 1rem;
    padding: 1rem;
  }

  .artwork-panel {
    position: static; /* No sticky on mobile */
  }
}
```

**Rejected Alternatives**:
- **Option 2**: Flexbox more verbose for this use case
- **Option 3**: Float outdated, poor responsive behavior
- **Option 4**: Complex z-index management, accessibility issues

**Aspect Ratio Preservation**:
```css
.artwork-image {
  width: 100%;
  height: auto;
  object-fit: contain; /* Preserve aspect ratio */
  max-height: 80vh;    /* Limit height on desktop */
}
```

---

### AD-3: Future Message Visibility Strategy (display: none)

**Context**: Current implementation shows future messages with 40% opacity, creating semi-transparent placeholders. User feedback: "我需要你随着正文显示才能显示" (messages should only appear when revealed).

**Options Considered**:
1. **Opacity-based** (current): `opacity: 0.4` → `opacity: 1` transition
2. **Display-based**: `display: none` → `display: block` with fade-in
3. **Height-based**: `max-height: 0` → `max-height: 500px` collapse/expand
4. **Transform-based**: `transform: translateY(20px)` → `translateY(0)` slide-in

**Decision**: **Option 2 - Display-based with Fade-in**

**Rationale**:
- ✅ **User Requirement**: Complete hiding until reveal ("随着正文显示")
- ✅ **No Visual Leak**: `display: none` removes from layout entirely
- ✅ **Performance**: Browser doesn't render hidden messages (better than opacity)
- ✅ **Accessibility**: Screen readers skip `display: none` elements
- ❌ Can't use CSS transitions with `display` (requires animation workaround)

**Implementation Strategy**:

**CSS Changes** (`styles/components/dialogue-player.css`):
```css
/* BEFORE (line 195-199): */
.dialogue-message.future {
  opacity: 0.4;
  transition: opacity 0.3s ease-out;
  position: relative;
}

/* AFTER: */
.dialogue-message.future {
  display: none; /* Completely hidden */
}

/* Reveal animation when .future removed */
.dialogue-message.current {
  opacity: 1;
  animation: fadeInMessage 0.5s ease-out;
}

@keyframes fadeInMessage {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**State Machine**:
```
[Not Created] → create DOM element → [.future (hidden)]
                                            ↓ timestamp reached
                          [.current (visible, animated)]
                                            ↓ next message appears
                            [.past (dimmed, context)]
```

**Rejected Alternatives**:
- **Option 1** (current): User explicitly rejected this ("不对的")
- **Option 3**: Complex height calculation, jumpy animation
- **Option 4**: Still visible during transform (doesn't meet requirement)

---

### AD-4: Knowledge Base References Default State (Collapsed)

**Context**: References currently show with `expanded` class, displaying full content immediately. User feedback: "现在的reference的内容没有按钮（点击显示），而是长时间一直显示，这个要修改".

**Options Considered**:
1. **Always Expanded** (current): Show all references by default
2. **Always Collapsed**: Require click to expand (user preference)
3. **Lazy Load**: Fetch reference content only on expand
4. **Progressive Disclosure**: Show first reference, collapse others

**Decision**: **Option 2 - Always Collapsed**

**Rationale**:
- ✅ **User Requirement**: "没有按钮（点击显示）" → need clickable control
- ✅ **Reduced Clutter**: Each message has 2+ KB references, collapsing improves readability
- ✅ **Existing UI**: Badge already shows "📚 X 个引用" with click handler
- ✅ **Progressive Disclosure**: User explores references only when interested
- ❌ Extra click for users who want references (acceptable trade-off)

**Code Change** (`js/components/dialogue-player.js`):

```javascript
// Location: ~line 1050-1100 in _createMessageElement()

// BEFORE:
const refList = document.createElement('div');
refList.className = 'kb-references-list';
// ... populate references ...
// No explicit collapsed state

// AFTER:
const refList = document.createElement('div');
refList.className = 'kb-references-list'; // Start without 'expanded'
// ... populate references ...
// Badge click will toggle 'expanded' class
```

**CSS State** (already correct in `styles/components/reference-list.css`):
```css
.kb-references-list {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.kb-references-list.expanded {
  max-height: 2000px; /* Expands when clicked */
}
```

**User Interaction Flow**:
1. Message loads with badge: "📚 2 个引用 references"
2. Click badge → `refList.classList.add('expanded')`
3. References expand with smooth animation
4. Click again → `refList.classList.remove('expanded')` → collapse

**Rejected Alternatives**:
- **Option 1**: User explicitly requested change
- **Option 3**: Over-engineered, references already in data
- **Option 4**: Inconsistent behavior, confusing UX

---

### AD-5: Artwork Image Loading Strategy (Lazy + Placeholder)

**Context**: 38 artworks, varying availability of actual images.

**Options Considered**:
1. **Eager Loading**: Load all images upfront
2. **Lazy Loading**: `loading="lazy"` attribute
3. **Progressive JPEG**: Use progressive encoding
4. **CDN + srcset**: Multiple resolutions for responsive images

**Decision**: **Option 2 - Lazy Loading with Existing Placeholder System**

**Rationale**:
- ✅ **Performance**: Only load image when user navigates to artwork dialogue
- ✅ **Existing System**: Placeholder already implemented (Phase 1: fix-artwork-image-display-system)
- ✅ **Browser Native**: `loading="lazy"` widely supported
- ✅ **Graceful Degradation**: Falls back to eager loading in old browsers
- ❌ No multi-resolution support yet (future enhancement)

**Implementation**:
```html
<img
  src="/exhibitions/negative-space-of-the-tide/assets/artwork-5.jpg"
  alt="作品标题"
  class="artwork-image"
  loading="lazy"
  onerror="this.onerror=null; this.src='/assets/placeholder.svg';"
>
```

**Placeholder Fallback** (already exists):
- If image fails to load → `onerror` handler
- Show gradient placeholder with metadata (title, artist, year)
- Reference: `js/gallery-hero.js` lines 277-314

**Future Enhancement** (out of scope):
- Add `srcset` for responsive images (375w, 768w, 1024w)
- Compress images with optimized JPEG/WebP
- Consider lazy loading library for more control

---

## Data Flow Diagram

```
User clicks artwork in exhibition grid
           ↓
Navigate to dialogues.html?artwork=artwork-5
           ↓
JavaScript parses URL param
           ↓
Load artwork metadata from data.json
           ↓
Load dialogue from js/data/dialogues/artwork-5.js
           ↓
Render split-view layout:
  ├─ Left: Artwork image (lazy load)
  └─ Right: DialoguePlayer instance
           ↓
DialoguePlayer auto-plays:
  1. Show first message (.current)
  2. Hide future messages (display: none)
  3. Collapse references by default
  4. Animate message reveal every 6-8s
           ↓
User interactions:
  - Click reference badge → expand/collapse
  - Click quote → scroll to original
  - Language toggle → re-render messages
```

## Component Responsibilities

### `dialogues.html` (New File)
**Responsibility**: Exhibition-specific dialogue page template

**Key Functions**:
- Parse URL parameter `?artwork=artwork-X`
- Load artwork metadata and image path
- Initialize DialoguePlayer with dialogue data
- Render split-view container (image + dialogue)
- Handle missing artwork parameter (show selector)

**Dependencies**:
- `/js/data/dialogues/artwork-X.js` (dialogue data)
- `/exhibitions/negative-space-of-the-tide/data.json` (artwork metadata)
- `/js/components/dialogue-player.js` (player component)
- `/styles/components/dialogue-player.css` (existing styles)

### `dialogue-player.js` (Modified)
**Responsibility**: Core dialogue playback logic

**Changes Required**:
1. Remove default `expanded` class from references (line ~1080)
2. Ensure `.future` messages not rendered until timestamp reached

**No Changes Needed**:
- Auto-play logic (already works)
- Thought chain animation (already works)
- Quote interaction (already works)
- Language switching (already works)

### `dialogue-player.css` (Modified)
**Responsibility**: Visual styling for dialogue messages

**Changes Required**:
1. Change `.future` from `opacity: 0.4` to `display: none` (line 195-199)
2. Add fade-in animation for `.current` state
3. Ensure `.kb-references-list` starts collapsed (already correct)

**No Changes Needed**:
- Split-view styles (will be in `dialogues.html` inline styles or new file)
- Existing responsive breakpoints
- Quote tooltip/modal styles

## Testing Strategy

### Unit Testing (Manual)
1. **References Collapse**:
   - Load any artwork dialogue
   - Verify references hidden on load
   - Click badge → verify expansion
   - Click again → verify collapse

2. **Future Message Hiding**:
   - Load any artwork dialogue
   - Verify only first message visible
   - Wait 6-8 seconds → verify second message appears
   - Inspect DOM → verify future messages have `display: none`

3. **Image Loading**:
   - Load artwork with image → verify image displays
   - Load artwork without image → verify placeholder shows
   - Resize window → verify aspect ratio preserved

### Integration Testing (Manual)
1. **Navigation Flow**:
   - Start at `/exhibitions/negative-space-of-the-tide/`
   - Click artwork → verify navigates to `dialogues.html?artwork=X`
   - Click back button → verify returns to exhibition index

2. **Responsive Behavior**:
   - Desktop (>768px): Verify split-view (40/60)
   - Mobile (≤768px): Verify stacked layout
   - Tablet (768px): Verify breakpoint transition

3. **Cross-browser**:
   - Test in Chrome, Firefox, Safari, Edge
   - Verify lazy loading works
   - Verify CSS Grid support (fallback not needed for 2025)

### Regression Testing
1. **Existing Features**:
   - Test pages (`test-*.html`) still work
   - Critique modal in exhibition index unchanged
   - Global navigation still functional

2. **Performance**:
   - Verify page load < 3 seconds (local)
   - Verify smooth scrolling (60fps)
   - Verify no memory leaks (DevTools Memory tab)

## Rollout Plan

### Phase 1: Core Implementation (Days 1-2)
- Create `dialogues.html` template
- Implement URL parameter parsing
- Add split-view CSS
- Test with artwork-5 (has dialogue data)

### Phase 2: Display State Fixes (Day 3)
- Modify `dialogue-player.css` (future message hiding)
- Modify `dialogue-player.js` (reference collapse default)
- Test animation flow
- Verify no regressions in test pages

### Phase 3: Exhibition Integration (Day 4)
- Add navigation links from exhibition index
- Add prev/next artwork navigation
- Update global navigation highlighting
- Test full user flow

### Phase 4: Polish & Documentation (Day 5)
- Cross-browser testing
- Mobile device testing
- Update CLAUDE.md with new page structure
- Create user guide (if needed)

## Risk Mitigation

### Risk 1: Breaking Test Pages
**Mitigation**: Use scoped CSS classes, avoid modifying existing selectors
**Rollback**: Revert `dialogue-player.css` changes, test pages unaffected

### Risk 2: Image Aspect Ratio Issues
**Mitigation**: Use `object-fit: contain`, test with various artwork ratios
**Fallback**: Set max-height constraint, allow vertical scrolling if needed

### Risk 3: Performance Degradation
**Mitigation**: Lazy loading, only load one dialogue at a time, no bulk data fetching
**Monitoring**: Check DevTools Performance tab during testing

### Risk 4: Mobile UX Issues
**Mitigation**: Test on real devices (not just DevTools), verify touch interactions
**Fallback**: Adjust breakpoint to 600px if 768px too restrictive

---

**Next Steps**: See `specs/` directory for detailed requirements and `tasks.md` for implementation checklist.
