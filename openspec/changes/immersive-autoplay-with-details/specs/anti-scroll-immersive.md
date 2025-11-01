# Capability Spec: Anti-Scroll on Main Gallery

**Change**: `immersive-autoplay-with-details`
**Capability**: Anti-Scroll Immersive Experience on Main Page
**Owner**: Implementation Phase 1
**Status**: Specification Ready

---

## Purpose

Prevent audience from scrolling on the main immersive auto-play gallery, ensuring a fully focused, distraction-free experience while auto-play cycles through artworks and reviews.

---

## Requirements

### Functional Requirements

#### FR1: Multi-Vector Scroll Prevention
- **Scope**: Only on main gallery page (`index.html`)
- **Vectors to Block**:
  - Mouse wheel scroll (scrolling with trackpad or external mouse)
  - Keyboard scroll (Space, Arrow Up/Down, Page Up/Down keys)
  - Touch scroll (finger swipe on touchscreen devices)
  - All scroll directions: up, down, left, right

#### FR2: Page-Specific Enablement
- **Requirement**: Scroll prevention must be selectively enabled/disabled per page
- **Implementation**: Use flag `window.IMMERSIVE_MODE` to control behavior
  - `index.html`: Set `window.IMMERSIVE_MODE = true`
  - `/pages/*.html`: Set `window.IMMERSIVE_MODE = false`
  - Detail pages must have FULL scroll capability

#### FR3: No Scrollbar Display
- **Requirement**: No vertical or horizontal scrollbar visible on main page
- **Implementation**: CSS `overflow: hidden` on main page body
- **Detail Pages**: CSS `overflow: auto` (default) to show scrollbar

#### FR4: CSS Overflow Control
- **Requirement**: Prevent content from overflowing viewport
- **Behavior**: All content fits within viewport without scroll overflow

---

## Non-Functional Requirements

### NFR1: Performance
- **Requirement**: Scroll prevention must not impact page performance
- **Benchmark**: No FCP (First Contentful Paint) degradation
- **Implementation**: Event listeners added only once on page load
- **Cleanup**: Listeners removed when navigating away

### NFR2: Cross-Browser Compatibility
- **Desktop Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Browsers**: Safari iOS 14+, Chrome Android 90+, Samsung Internet 14+
- **Fallback**: CSS `overflow: hidden` as primary backup for any JS failures

### NFR3: Accessibility
- **Requirement**: Scroll prevention must not block accessible keyboard navigation
- **Detail**: Cannot prevent TAB key, Enter key, or other essential a11y keys
- **Partial**: Can prevent Space (scroll) but not Tab (focus)
- **Rationale**: Users with keyboard-only navigation can still use menu

### NFR4: User Experience
- **Requirement**: Clear visual feedback that scrolling is disabled
- **Options**:
  - No scrollbar visible (implicit)
  - Toast/notification on page load (optional: "Use menu to navigate")
  - Cursor behavior unchanged (no special cursor)
- **Goal**: Users understand quickly without confusion

---

## Implementation Details

### Architecture

```javascript
// File: js/scroll-prevention.js
// Loaded: On every page via <script> tag

class ScrollPrevention {
  constructor() {
    this.isEnabled = false;
    this.preventWheelScroll = this.preventWheelScroll.bind(this);
    this.preventKeyScroll = this.preventKeyScroll.bind(this);
    this.preventTouchScroll = this.preventTouchScroll.bind(this);
  }

  enable() {
    // 1. Add event listeners
    // 2. Set overflow hidden
    // 3. Set flag
  }

  disable() {
    // 1. Remove event listeners
    // 2. Clear overflow
    // 3. Clear flag
  }

  preventWheelScroll(e) {
    if (window.IMMERSIVE_MODE) e.preventDefault();
  }

  preventKeyScroll(e) {
    const scrollKeys = ['Space', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'];
    if (window.IMMERSIVE_MODE && scrollKeys.includes(e.code)) {
      e.preventDefault();
    }
  }

  preventTouchScroll(e) {
    if (window.IMMERSIVE_MODE) e.preventDefault();
  }
}

// Usage on index.html
window.IMMERSIVE_MODE = true;
window.scrollPrevention = new ScrollPrevention();
window.scrollPrevention.enable();
```

### Event Listeners

```javascript
// 1. Wheel Events (Mouse + Trackpad)
document.addEventListener('wheel', preventWheelScroll, { passive: false });

// 2. Keyboard Events
document.addEventListener('keydown', preventKeyScroll);

// 3. Touch Events
document.addEventListener('touchmove', preventTouchScroll, { passive: false });

// 4. CSS Overflow
document.body.style.overflow = 'hidden';
```

### Page Load Behavior

**Main Page (index.html)**:
```html
<script>window.IMMERSIVE_MODE = true;</script>
<!-- ... other scripts ... -->
<script src="/js/scroll-prevention.js"></script>
```

**Detail Pages (/pages/*.html)**:
```html
<script>window.IMMERSIVE_MODE = false;</script>
<!-- ... other scripts ... -->
<script src="/js/scroll-prevention.js"></script>
```

---

## Validation Criteria

### Functional Validation

- [ ] **VC1**: Wheel scroll blocked on main page
  - **Test**: Open DevTools console, run `window.scrollY` before/after wheel event
  - **Expected**: `scrollY` remains 0 despite wheel scroll attempts
  - **Devices**: Trackpad, external mouse

- [ ] **VC2**: Keyboard scroll blocked on main page
  - **Test**: Press Space, Arrow Up/Down, Page Up/Down
  - **Expected**: Page does not scroll
  - **Excluded**: Tab key still works (focus navigation)

- [ ] **VC3**: Touch scroll blocked on mobile main page
  - **Test**: On iPhone/Android, swipe up/down on main page
  - **Expected**: Page does not scroll
  - **Device**: iPhone 12+, Android flagship device

- [ ] **VC4**: Scroll enabled on detail pages
  - **Test**: Navigate to `/pages/critics.html`, scroll with all three vectors
  - **Expected**: Page scrolls smoothly with wheel, keyboard, and touch
  - **Devices**: Desktop, tablet, mobile

- [ ] **VC5**: No scrollbar visible on main page
  - **Test**: Visual inspection
  - **Expected**: No vertical scrollbar on right edge

- [ ] **VC6**: Scrollbar visible on detail pages
  - **Test**: Visual inspection
  - **Expected**: Vertical scrollbar visible when content overflows

### Cross-Browser Validation

- [ ] **VC7**: Chrome (desktop, Android)
  - **Test**: Verify scroll blocked on main, works on detail
  - **Expected**: Consistent behavior

- [ ] **VC8**: Firefox (desktop)
  - **Test**: Verify scroll blocked on main, works on detail
  - **Expected**: Consistent behavior

- [ ] **VC9**: Safari (desktop, iOS)
  - **Test**: Verify scroll blocked on main, works on detail
  - **Expected**: Consistent behavior, including iOS swipe

- [ ] **VC10**: Edge (desktop)
  - **Test**: Verify scroll blocked on main, works on detail
  - **Expected**: Consistent behavior

### Performance Validation

- [ ] **VC11**: No performance regression
  - **Test**: Lighthouse audit main page before/after
  - **Expected**: FCP, LCP within 5% tolerance
  - **Benchmark**: FCP < 1.5s, LCP < 2.5s

- [ ] **VC12**: No console errors or warnings
  - **Test**: Open DevTools, reload page, check console
  - **Expected**: No errors related to scroll prevention

### Accessibility Validation

- [ ] **VC13**: Keyboard navigation works
  - **Test**: Press Tab repeatedly on main page
  - **Expected**: Focus moves through interactive elements (menu button, etc.)

- [ ] **VC14**: Screen reader announces properly
  - **Test**: Open main page with NVDA/JAWS
  - **Expected**: No announcement of "not scrollable" or similar
  - **Note**: Scrollbar absence should be intuitive, not announced

- [ ] **VC15**: Zoom/pinch still works (on mobile)
  - **Test**: On iOS/Android, pinch to zoom main page
  - **Expected**: Zoom works (browser-level, not app-level)
  - **Rationale**: Users should still be able to zoom for readability

---

## Edge Cases & Handling

### EC1: User Zooms Page
- **Behavior**: If user zooms main page, content may overflow
- **Handling**: Content should be designed to fit at default zoom (100%)
- **Fallback**: `overflow: hidden` ensures no scroll even if content overflows

### EC2: Keyboard Modifiers (Shift, Ctrl)
- **Behavior**: User presses Ctrl+Space or Shift+ArrowDown
- **Handling**: Still prevent scroll (intercepted at event level)
- **Implementation**: Check `e.code` only, not modifiers

### EC3: Browser Extensions
- **Behavior**: Some extensions may override scroll prevention
- **Handling**: Not in scope (acceptable limitation)
- **Mitigation**: Test with common extensions

### EC4: Mobile Safari Scroll Bounce
- **Behavior**: iOS sometimes allows "rubber band" scroll
- **Handling**: Prevent via `overscroll-behavior: none` CSS
- **Implementation**: Add to main page CSS

### EC5: Orientation Change (Mobile)
- **Behavior**: User rotates device from portrait to landscape
- **Handling**: Scroll prevention should remain active
- **Implementation**: Event listeners persist through orientation change

---

## Testing Strategy

### Unit Tests
```javascript
// Test 1: ScrollPrevention class instantiation
test('ScrollPrevention can be instantiated', () => {
  const sp = new ScrollPrevention();
  expect(sp.isEnabled).toBe(false);
});

// Test 2: Enable/disable methods
test('enable() sets IMMERSIVE_MODE flag', () => {
  window.IMMERSIVE_MODE = false;
  const sp = new ScrollPrevention();
  sp.enable();
  expect(window.IMMERSIVE_MODE).toBe(true);
});
```

### Integration Tests
```javascript
// Test 3: Wheel event prevented
test('Wheel event is prevented on main page', (done) => {
  window.IMMERSIVE_MODE = true;
  const wheelEvent = new WheelEvent('wheel', { deltaY: 10 });
  const prevented = !document.dispatchEvent(wheelEvent);
  expect(prevented).toBe(true);
  done();
});
```

### Manual Tests
1. Visual test: Open main page, verify no scrollbar
2. Interaction test: Wheel scroll, keyboard scroll, touch scroll all blocked
3. Navigation test: Click menu, navigate to detail page, verify scroll works
4. Responsive test: Test on 375px, 768px, 1024px viewports
5. Browser test: Test on Chrome, Firefox, Safari, Edge

---

## Dependencies

### Internal Dependencies
- `js/autoplay.js` - Must initialize AFTER scroll prevention
- `js/gallery-init.js` - May call scroll prevention enable

### External Dependencies
- None (uses native DOM APIs only)

### Breaking Changes
- None (scroll prevention is additive)

---

## Rollback Plan

If scroll prevention causes issues:

1. **Immediate Rollback**: Comment out scroll prevention script tag
   ```html
   <!-- <script src="/js/scroll-prevention.js"></script> -->
   ```

2. **Remove CSS Overflow Override**: Ensure `body { overflow: auto }` is default

3. **Test**: Verify scroll works after rollback

4. **Root Cause Analysis**: Check console errors, browser logs

---

## Documentation & Examples

### User-Facing Documentation
- Include in project README: "Main gallery is immersive and scroll-free"
- Add to About page: "The main gallery is designed for immersive viewing"

### Developer Documentation
- Document in CLAUDE.md: How to enable/disable scroll prevention
- Example: How to add new artwork (scroll prevention handled automatically)
- Troubleshooting: "Why is my detail page not scrolling?"

---

## Success Metrics

| Metric | Target | Actual |
|--------|--------|--------|
| Scroll events blocked on main page | 100% | TBD |
| Scroll events allowed on detail pages | 100% | TBD |
| Cross-browser compatibility | 4/4 browsers | TBD |
| Performance regression | < 5% | TBD |
| Accessibility issues | 0 | TBD |
| User confusion (support) | 0 reports | TBD |

---

## Approval & Sign-Off

- **Specification Owner**: Implementation team
- **Design Approval**: Pending
- **Technical Review**: Pending
- **User Testing**: Pending

---

## Version History

| Version | Date | Author | Change |
|---------|------|--------|--------|
| 1.0 | 2025-11-01 | Claude | Initial specification |
