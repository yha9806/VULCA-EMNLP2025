# Design: Refine Dialogue System Visual Design and UX

**Change ID**: `refine-dialogue-system-visual-ux`
**Created**: 2025-11-05

---

## Architectural Decisions

### Decision 1: Color System Strategy

**Context**: Dialogue player header uses purple gradient (#667eea → #764ba2) that doesn't match VULCA's warm, earthy palette.

**Options**:

**A. Fixed Warm Gradient** (Su Shi colors)
- Gradient: `#B85C3C → #D4A574` (terracotta to gold)
- **Pros**: Consistent, aligns with primary persona (Su Shi), simple to implement
- **Cons**: Not adaptive to thread participants
- **Implementation**: 5 lines CSS

**B. Dynamic Persona-Based Colors**
- Header color adapts to first participant in thread
- **Pros**: Visually connects header to content, persona-specific
- **Cons**: Complex logic, inconsistent header colors, may confuse users
- **Implementation**: 20+ lines JS

**C. Neutral Warm Gradient**
- Gradient: `#D4A574 → #E0C097` (subtle gold tones)
- **Pros**: Safe, professional, site-agnostic
- **Cons**: Less distinctive, less connection to persona system
- **Implementation**: 5 lines CSS

**Decision**: **Option A - Fixed Warm Gradient**

**Rationale**:
- Simplest implementation, lowest risk
- Su Shi is the most prominent persona (appears first)
- Warm tones align perfectly with site aesthetic
- Consistency aids user recognition ("this is the dialogue UI")

---

### Decision 2: Header Typography Approach

**Context**: Current header overflows on mobile, lacks typographic hierarchy.

**Current State**:
```css
.dialogue-player__topic { font-size: 1.5rem; }
.dialogue-player__topic-en { font-size: 1.1rem; }
```

**Problems**:
- Too large for 800px max-width container
- No responsive scaling
- No overflow handling

**Options**:

**A. Fixed Size Reduction**
- ZH: `1.5rem → 1.2rem`, EN: `1.1rem → 0.95rem`
- **Pros**: Simple, predictable
- **Cons**: May still overflow with long titles
- **Implementation**: 2 lines CSS

**B. Responsive Clamp**
- ZH: `clamp(1rem, 3vw, 1.2rem)`
- EN: `clamp(0.85rem, 2.5vw, 0.95rem)`
- **Pros**: Adapts to viewport, future-proof
- **Cons**: More complex, harder to debug
- **Implementation**: 2 lines CSS (clamp)

**C. Ellipsis Overflow**
- Fixed size + `overflow: hidden; text-overflow: ellipsis;`
- **Pros**: Guarantees no overflow, clean
- **Cons**: Hides content, requires tooltip on hover
- **Implementation**: 4 lines CSS + tooltip JS

**D. Multi-line with Line Clamp**
- Allow 2 lines with `-webkit-line-clamp: 2`
- **Pros**: Shows more content than ellipsis
- **Cons**: Increases header height variably
- **Implementation**: 5 lines CSS

**Decision**: **Hybrid of B + D**

**Rationale**:
- Use responsive clamp for primary sizing
- Allow 2-line wrap for Chinese title
- Apply line-clamp with ellipsis for overflow
- Adds tooltip on hover for full title
- **Best of all worlds**: Responsive, clean, no hidden content loss

**Implementation**:
```css
.dialogue-player__topic-zh {
  font-size: clamp(1rem, 3vw, 1.2rem);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
}

.dialogue-player__topic-en {
  font-size: clamp(0.85rem, 2.5vw, 0.95rem);
  opacity: 0.9;
}
```

---

### Decision 3: Progressive Focus Implementation Pattern

**Context**: Need to highlight current message while dimming context (past/future messages).

**Options**:

**A. Pure CSS Classes**
- Add `.past`, `.current`, `.future` classes
- JavaScript only updates classes on reveal
- **Pros**: Simple, performant, no animation logic in JS
- **Cons**: Less control over timing, CSS transitions only
- **Implementation**: 15 lines CSS, 10 lines JS

**B. JavaScript-Driven Animations**
- Use GSAP or anime.js for complex animations
- **Pros**: Smooth, complex easing, timeline control
- **Cons**: 30KB+ library dependency, overkill for this use case
- **Implementation**: 50+ lines JS, new dependency

**C. Web Animations API**
- Use `element.animate()` for JavaScript-controlled CSS animations
- **Pros**: No dependencies, powerful, good browser support
- **Cons**: More verbose than CSS, harder to maintain
- **Implementation**: 30 lines JS

**Decision**: **Option A - Pure CSS Classes**

**Rationale**:
- Aligns with project's "no heavy dependencies" philosophy
- CSS transitions sufficient for opacity/scale changes
- JavaScript only manages state, not animation
- Easiest to maintain and debug
- Best performance (GPU-accelerated CSS)

**Implementation Pattern**:
```javascript
// In _revealMessage()
_revealMessage(messageId) {
  // Update previous current message to past
  if (this._currentMessageEl) {
    this._currentMessageEl.classList.remove('current');
    this._currentMessageEl.classList.add('past');
  }

  // Reveal and set new current message
  const msgEl = this.messageElements.get(messageId);
  msgEl.classList.remove('message-hidden', 'future');
  msgEl.classList.add('current');

  this._currentMessageEl = msgEl;

  // Mark all future messages
  this._markFutureMessages();

  // Scroll current into view
  msgEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
```

---

### Decision 4: Quote Interaction UI Pattern

**Context**: Need hover (desktop) and click (mobile) interactions for quote blocks.

**Options**:

**A. Native HTML `<details>` Element**
```html
<details class="quote-block">
  <summary>↩ Reply to [Name]</summary>
  <blockquote>...</blockquote>
</details>
```
- **Pros**: Semantic, accessible, no JS required, mobile-friendly
- **Cons**: Limited styling, no hover on desktop, awkward UX
- **Implementation**: 10 lines HTML/CSS

**B. Custom Tooltip Library** (Tippy.js, Popper.js)
- **Pros**: Rich features, polished, good positioning logic
- **Cons**: 20-50KB dependency, overkill, setup complexity
- **Implementation**: 20 lines JS + library

**C. Custom Pure CSS Tooltip (Desktop) + Modal (Mobile)**
- Desktop: CSS `:hover` → show positioned absolute tooltip
- Mobile: JS click → show modal overlay
- **Pros**: No dependencies, full control, lightweight
- **Cons**: More code to write, positioning logic needed
- **Implementation**: 40 lines CSS, 30 lines JS

**D. Unified Popover (CSS `popover` API)**
- Use new HTML `popover` attribute (Chrome 114+)
- **Pros**: Native browser support, minimal JS, semantic
- **Cons**: Limited browser support (not Safari <17), fallback needed
- **Implementation**: 15 lines HTML/CSS + 10 lines JS fallback

**Decision**: **Option C - Custom CSS Tooltip + Modal**

**Rationale**:
- **No dependencies**: Aligns with project philosophy
- **Full control**: Can match VULCA's exact design language
- **Browser support**: Works everywhere without polyfills
- **UX clarity**: Different interaction patterns for desktop/mobile make sense
- **Performance**: Lightweight, no library overhead

**Why not D (Popover API)**:
- Safari support too recent (Sept 2023), not stable enough
- Fallback complexity negates benefits
- Revisit in 2025 when support is universal

**Implementation Strategy**:
```css
/* Desktop Hover Tooltip */
@media (hover: hover) and (pointer: fine) {
  .quote-ref {
    cursor: help;
    position: relative;
  }

  .quote-ref-tooltip {
    display: none;
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    /* ... styling ... */
  }

  .quote-ref:hover .quote-ref-tooltip {
    display: block;
    animation: fadeIn 200ms ease-out;
  }
}

/* Mobile Click Modal */
@media (hover: none) or (pointer: coarse) {
  .quote-modal {
    /* ... modal styling ... */
  }
}
```

---

### Decision 5: Content Visibility Debug Strategy

**Context**: User reports "其余板块是空的" (panels are empty).

**Root Cause Hypotheses**:
1. **Data Issue**: Some dialogue threads missing data
2. **Render Race**: JavaScript executes before DOM ready
3. **CSS Issue**: Elements rendered but hidden by CSS
4. **JS Error**: Exception breaks render loop

**Investigation Strategy**:

**Approach 1: Console Logging Audit**
- Add extensive console.log in render functions
- **Pros**: Quick to implement, easy to debug
- **Cons**: Noisy, not production-friendly

**Approach 2: Error Boundary Pattern**
- Wrap render logic in try-catch, show error UI
- **Pros**: Graceful degradation, user-visible
- **Cons**: Doesn't prevent error, only handles it

**Approach 3: Defensive Null Checks**
- Add guards: `if (!thread || !thread.messages) return;`
- **Pros**: Prevents crashes, production-safe
- **Cons**: Silent failures, hard to debug

**Approach 4: Loading State Machine**
- Track render state: `loading → success → error`
- Show spinners/error messages based on state
- **Pros**: Best UX, clear feedback, debuggable
- **Cons**: Most complex, requires state management

**Decision**: **Hybrid of Approach 3 + 4**

**Rationale**:
- Add defensive null checks to prevent crashes
- Implement simple loading state (3 states: loading/success/error)
- Show loading spinner during initial render
- Show error message if render fails
- Log errors to console for debugging

**Implementation**:
```javascript
_render() {
  this.state = 'loading';
  this._showLoadingState();

  try {
    // Defensive checks
    if (!this.thread) {
      throw new Error('No dialogue thread data');
    }
    if (!this.thread.messages || this.thread.messages.length === 0) {
      throw new Error('Thread has no messages');
    }

    // Render logic...
    this._renderAllMessages();

    this.state = 'success';
    this._hideLoadingState();
  } catch (error) {
    console.error('[DialoguePlayer] Render failed:', error);
    this.state = 'error';
    this._showErrorState(error.message);
  }
}
```

---

### Decision 6: Scroll Behavior for Current Message

**Context**: When revealing a new message, should it auto-scroll? Where?

**Options**:

**A. No Auto-Scroll**
- User manually scrolls to see new messages
- **Pros**: User control, no jarring jumps
- **Cons**: Easy to miss new messages, poor UX

**B. Scroll to Top of Message**
- `element.scrollIntoView({ block: 'start' })`
- **Pros**: Ensures message fully visible
- **Cons**: Message at top of container, not centered

**C. Scroll to Center of Message**
- `element.scrollIntoView({ block: 'center' })`
- **Pros**: Cinematic, clear focus, matches user request
- **Cons**: May cut off previous message

**D. Scroll with Offset**
- Manually calculate scroll position with padding
- **Pros**: Full control, can ensure context visible
- **Cons**: Complex, brittle, cross-browser issues

**Decision**: **Option C - Scroll to Center**

**Rationale**:
- **Matches user request**: "居中显示最新出现的评论内容板块"
- **Best focus**: Clearly indicates which message is active
- **Simple API**: `scrollIntoView({ block: 'center', behavior: 'smooth' })`
- **Acceptable trade-off**: Previous message dimming provides enough context

**Fallback**: If message height > 80% of container, scroll to top instead

---

## Technical Constraints

### Browser Support
- **Target**: Last 2 versions of major browsers
- **Minimum**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Constraints**: No CSS `popover` (too new), no `:has()` (Safari < 15.4)

### Performance Budget
- **Animation FPS**: Must maintain 60 FPS during message reveal
- **JS Execution**: < 50ms per reveal operation
- **Memory**: No memory leaks from event listeners

### Accessibility
- **Keyboard**: All interactions must be keyboard-accessible
- **Screen Reader**: Quote references must be announced
- **Contrast**: All colors must pass WCAG AA (4.5:1 for text)

---

## Testing Strategy

### Visual Regression
- Screenshot tests for color changes (header gradient)
- Typography overflow tests (long titles)

### Interaction Testing
- Progressive focus state transitions
- Quote hover (desktop) and click (mobile)
- Scroll behavior on message reveal

### Cross-Device
- Test on real devices (iOS, Android)
- Test on desktop (Chrome, Firefox, Safari)

### Accessibility
- Keyboard navigation tests
- Screen reader tests (NVDA, VoiceOver)
- Color contrast validation

---

## Migration Path

### From Current to New Design

**Phase 1**: Color system
- Update CSS variables
- No JavaScript changes
- Zero breaking changes

**Phase 2**: Typography
- Update CSS sizes
- Add line-clamp
- No JavaScript changes
- Zero breaking changes

**Phase 3**: Progressive focus
- Add new CSS classes
- Update reveal logic in JS
- **Breaking**: Changes internal state management
- **Mitigation**: Fully backward compatible, old messages still work

**Phase 4**: Quote interaction
- Add new HTML structure for quotes
- Add tooltip/modal logic
- **Breaking**: Changes quote block rendering
- **Mitigation**: Graceful degradation, quotes still readable

---

## Future Enhancements

### Post-Launch Iterations

1. **A/B Test Progressive Focus**
   - Compare engagement metrics with/without dimming
   - Track scroll behavior and dwell time

2. **Add Animation Curves Library**
   - If we need more complex animations later
   - Consider lightweight library like anime.js (9KB)

3. **Explore Native Popover API**
   - Revisit in 2025 when Safari support stable
   - Simplify tooltip/modal logic

4. **Add Gesture Support**
   - Swipe between messages on mobile
   - Pinch to zoom on quote content

---

## Open Questions

1. **Should "生成中..." badge be animated?**
   - Pulsing dots animation?
   - Static text?
   - **Answer Needed**: User preference

2. **Should past messages be collapsible?**
   - Click to collapse/expand past messages?
   - Always visible but dimmed?
   - **Answer Needed**: UX testing

3. **What happens with very long quotes?**
   - Truncate in tooltip?
   - Show full content in modal?
   - **Answer Needed**: Content analysis

---

## Summary

This design prioritizes:
- **Simplicity**: Pure CSS over heavy JS frameworks
- **Performance**: No new dependencies, GPU-accelerated animations
- **Consistency**: Matches VULCA's design language
- **Accessibility**: Keyboard, screen reader, high contrast support
- **Maintainability**: Clear separation of concerns, documented decisions

All decisions optimize for the "80% case" while providing graceful degradation for edge cases.
