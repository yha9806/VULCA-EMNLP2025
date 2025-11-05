# Proposal: Refine Dialogue System Visual Design and UX

**Change ID**: `refine-dialogue-system-visual-ux`
**Status**: Proposed
**Created**: 2025-11-05
**Priority**: High
**Estimated Time**: 6-8 hours

---

## What Changes

This proposal refines the dialogue system's visual design and user experience to align with VULCA's overall design language and improve content readability and interaction clarity.

**Core Improvements**:

1. **Color System Alignment** - Replace purple gradient with warm, earthy tones matching the site's aesthetic
2. **Header Typography Optimization** - Fix title overflow, reduce font size, improve design balance
3. **Content Visibility Fix** - Ensure all dialogue threads render correctly (fix empty panels)
4. **Progressive Focus Interaction** - Highlight current message, dim context, show "generating..." for upcoming content
5. **Quote Interaction Enhancement** - Hover/click-to-expand quotes instead of always visible

---

## Why

### Problem 1: Color Mismatch ❌

**Current State**: Dialogue player uses a vibrant purple gradient (`#667eea → #764ba2`)

**Website Palette**: Warm, earthy tones
- Background: `#F9F8F6` (warm off-white)
- Personas: `#B85C3C` (terracotta), `#2D5F4F` (forest green), `#6B4C8A` (plum), `#D4A574` (gold)

**Impact**: Visual disconnection breaks immersion, looks like a third-party widget

---

### Problem 2: Header Typography Issues ❌

**Current State**:
- Title: `font-size: 1.5rem` (too large for 800px container)
- English subtitle: `font-size: 1.1rem` (unbalanced)
- Both languages stack vertically, causing overflow

**User Report**: "机械笔触中的自然韵律 / Natural Rhythm in Mechanical Brushstrokes 这个内容被遮挡了，字体太大，缺乏设计感"

**Impact**:
- Title content gets clipped
- Lacks typographic hierarchy
- Feels cramped and unpolished

---

### Problem 3: Missing Content ❌

**User Report**: "其余板块是空的，没有显示（从前端看）"

**Suspected Causes**:
- JavaScript errors preventing render
- Data loading race conditions
- CSS display issues

**Impact**: Users see empty dialogue sections, breaking the experience

---

### Problem 4: Weak Interaction Cues ❌

**User Request**:
> "对话的信息板块交互不明显，可以只居中显示最新出现的评论内容板块，然后上文板块变成半透明，下文板块也是半透明，并显示（生成中...）这样的字样"

**Current State**: All messages have equal visual weight once revealed

**Desired UX**:
- **Current message**: Full opacity, centered in view
- **Past messages**: 40% opacity (context, not focus)
- **Future messages**: 40% opacity + "生成中..." badge
- **Progressive reveal**: Smooth transitions between states

**Impact**: Hard to track which message is "speaking" right now

---

### Problem 5: Quote Block Visibility ❌

**User Request**:
> "引文可以再减小一点，pc端可以鼠标悬停，然后展示，手机端可以点击出现小窗气泡展示"

**Current State**: Quote blocks always visible, consume vertical space

**Desired UX**:
- **Desktop**: Hidden by default, show on hover (tooltip/popover)
- **Mobile**: Tap to open modal or popover
- **Visual**: Inline icon/indicator (↩ or 💬)

**Impact**: Better content density, cleaner reading flow

---

## How

### Phase 1: Color System Alignment (1-2 hours)

**Approach**: Replace purple gradient with warm gradient from persona palette

**Options**:
- **A**: Su Shi gradient (`#B85C3C → #D4A574`) - Warm terracotta to gold
- **B**: Multi-persona adaptive color (header color matches first participant)
- **C**: Neutral warm gradient (`#D4A574 → #E0C097`) - Subtle gold tones

**Recommendation**: **Option A** - Consistent, warm, aligns with primary persona Su Shi

---

### Phase 2: Header Typography Refactor (1-2 hours)

**Changes**:
1. Reduce title size: `1.5rem → 1.2rem` (Chinese)
2. Reduce subtitle size: `1.1rem → 0.95rem` (English)
3. Add max-width constraints with ellipsis overflow
4. Improve line-height and letter-spacing
5. Add subtle text-shadow for readability on gradient

**Responsive**:
- Mobile: Further reduce to `1rem / 0.85rem`
- Tablet: `1.1rem / 0.9rem`

---

### Phase 3: Content Visibility Debug (1 hour)

**Investigation Steps**:
1. Check browser console for JavaScript errors
2. Verify all dialogue threads have valid data
3. Confirm CSS classes applied correctly
4. Test rendering with different thread counts

**Fix Strategy**: Add defensive null checks, loading states, error boundaries

---

### Phase 4: Progressive Focus Interaction (2-3 hours)

**Implementation**:

1. **State Management**:
   ```javascript
   _currentMessageIndex = 0;
   _revealedCount = 0;
   ```

2. **Visual States**:
   ```css
   .dialogue-message.past { opacity: 0.4; }
   .dialogue-message.current { opacity: 1; transform: scale(1.02); }
   .dialogue-message.future { opacity: 0.4; }
   .dialogue-message.future::after { content: "生成中..."; }
   ```

3. **Scroll Behavior**:
   - Auto-scroll current message to center
   - Smooth transitions (400ms ease-out)

---

### Phase 5: Quote Interaction Enhancement (1-2 hours)

**Desktop (Hover)**:
1. Hide quote blocks by default
2. Show inline indicator: `<span class="quote-ref">↩ Reply to [Name]</span>`
3. On hover: Show floating tooltip with quote content
4. Position: Above/below based on available space

**Mobile (Click)**:
1. Same inline indicator
2. On tap: Show modal/bottom sheet with quote content
3. Dismiss: Tap outside or close button

**Fallback**: For accessibility, always allow keyboard focus to reveal quotes

---

## Success Criteria

### Visual Alignment ✅
- [ ] Header gradient uses warm tones (`#B85C3C` range)
- [ ] Colors pass WCAG AA contrast requirements
- [ ] No purple or cold colors in dialogue UI

### Typography ✅
- [ ] Title never overflows on 375px mobile
- [ ] Bilingual title fits comfortably in header
- [ ] Clear visual hierarchy (ZH primary, EN secondary)

### Content Visibility ✅
- [ ] All dialogue threads render without empty panels
- [ ] Console shows no JavaScript errors during render
- [ ] Loading states visible before content appears

### Progressive Focus ✅
- [ ] Current message centered and full opacity
- [ ] Past messages dimmed to 40% opacity
- [ ] Future messages show "生成中..." badge
- [ ] Smooth auto-scroll to current message

### Quote Interaction ✅
- [ ] Quote blocks hidden by default
- [ ] Desktop: Hover shows tooltip within 200ms
- [ ] Mobile: Tap opens modal/popover
- [ ] Keyboard accessible (focus to reveal)

---

## Impact Analysis

### User Experience
- **Positive**: Better visual cohesion, clearer interaction flow, less clutter
- **Risk**: Hover/click quotes may feel less "transparent" initially

### Performance
- **Neutral**: No significant performance impact
- **Optimization**: Tooltip/modal lazy-loaded only when needed

### Accessibility
- **Positive**: Improved contrast ratios, keyboard-accessible quotes
- **Risk**: Must ensure screen readers announce quote context correctly

### Development
- **Complexity**: Moderate - requires CSS refinement + JS state management
- **Testing**: High - must test across devices and interaction modes

---

## Dependencies

- No blocking dependencies
- Can implement in parallel with other dialogue system work
- Should complete before deploying dialogue system to production

---

## Alternatives Considered

### Alt 1: Keep Current Design
- **Pro**: No work required
- **Con**: Visual mismatch remains, UX issues unresolved

### Alt 2: Major UI Overhaul
- **Pro**: Opportunity for radical improvement
- **Con**: High risk, long timeline (12+ hours)
- **Decision**: Too risky, prefer incremental refinement

### Alt 3: Only Fix Colors
- **Pro**: Quick win (2 hours)
- **Con**: Leaves typography and interaction issues unaddressed
- **Decision**: Not sufficient to meet user expectations

---

## Implementation Plan

See `tasks.md` for detailed implementation breakdown.

**Phases**:
1. Phase 1: Color System Alignment (1-2h)
2. Phase 2: Header Typography Refactor (1-2h)
3. Phase 3: Content Visibility Debug (1h)
4. Phase 4: Progressive Focus Interaction (2-3h)
5. Phase 5: Quote Interaction Enhancement (1-2h)

**Total**: 6-10 hours

---

## Rollback Strategy

If issues arise:
1. **Quick revert**: Git revert commits by phase
2. **Partial rollback**: Keep color changes, revert interaction changes
3. **Feature flag**: Add `enableProgressiveFocus` config option

---

## Notes

- User explicitly requested these changes with "ultrathink" priority
- Dialogue system currently in feature branch, not yet merged to master
- Changes should be tested thoroughly before merging
- Consider A/B testing progressive focus feature with users
