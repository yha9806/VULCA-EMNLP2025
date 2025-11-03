# Design Document: Optimize Gallery Navigation Bar

**Change ID**: `optimize-gallery-navigation-bar`
**Last Updated**: 2025-11-03

---

## Architecture Overview

This change implements an auto-hide navigation bar using a **CSS-first approach** with optional JavaScript enhancement for improved UX.

### Design Principles

1. **Progressive Enhancement**: Core functionality works with CSS alone
2. **Mobile-First Responsive**: Different behavior for touch vs. mouse devices
3. **Performance-Oriented**: Use GPU-accelerated transforms, avoid layout thrashing
4. **Accessibility-First**: Keyboard navigation must not be hindered

---

## Technical Architecture

### 1. CSS Transform-Based Hiding

**Why transforms over `display: none` or `opacity`?**

| Approach | Pros | Cons | Decision |
|----------|------|------|----------|
| `transform: translateY()` | GPU-accelerated, smooth animation, maintains layout | Requires overflow management | ✅ **SELECTED** |
| `display: none` | Complete removal from flow | No animation, janky transitions | ❌ Rejected |
| `opacity: 0` | Smooth fade, simple | Blocks clicks, still occupies space | ❌ Rejected |
| `visibility: hidden` | Maintains layout | No animation support | ❌ Rejected |

**Decision**: Use `transform: translateY(100%)` for smooth, performant slide animation.

---

### 2. Hover Detection Strategy

#### Option A: Pure CSS `:hover` (Implemented First)

```css
.gallery-nav:hover {
  transform: translateY(0);
}
```

**Pros**:
- No JavaScript required
- Zero performance overhead
- Works immediately on page load

**Cons**:
- Requires mouse to be directly over the nav bar (already hidden)
- Poor discoverability

**Verdict**: Insufficient - needs activation zone

---

#### Option B: Hover Detection Zone (CSS Pseudo-Element)

```css
body::after {
  content: '';
  position: fixed;
  bottom: 0;
  height: 100px;
  width: 100%;
  pointer-events: none; /* Don't block clicks */
}

body:hover .gallery-nav {
  transform: translateY(0);
}
```

**Pros**:
- Pure CSS solution
- Large activation area (100px from bottom)
- No JavaScript overhead

**Cons**:
- Complex CSS selectors
- May not work reliably across browsers

**Verdict**: Promising but needs testing

---

#### Option C: JavaScript MouseMove Listener (Recommended)

```javascript
let navVisible = false;
let hideTimeout;

document.addEventListener('mousemove', (e) => {
  if (window.innerWidth < 600) return; // Skip on mobile

  const distanceFromBottom = window.innerHeight - e.clientY;
  const nav = document.querySelector('.gallery-nav');

  if (distanceFromBottom < 100 && !navVisible) {
    nav.classList.add('show');
    navVisible = true;
    clearTimeout(hideTimeout);
  } else if (distanceFromBottom >= 100 && navVisible) {
    hideTimeout = setTimeout(() => {
      nav.classList.remove('show');
      navVisible = false;
    }, 500); // Delay hide for smoother UX
  }
});
```

**Pros**:
- Precise control over activation zone
- Can add debouncing/throttling for performance
- Flexible for future enhancements

**Cons**:
- Requires JavaScript
- Minor performance cost (mitigated with throttling)

**Verdict**: **SELECTED** - Best UX with acceptable tradeoff

---

### 3. Visual Hint Design

**Purpose**: Indicate that navigation exists at bottom of screen

#### Indicator Options

| Design | Visual | Visibility | Intrusiveness |
|--------|--------|-----------|---------------|
| Small bar (4px × 40px) | Minimal | Subtle | Low ✅ |
| Chevron icon (^) | Clear | Moderate | Medium |
| Pulsing dot | Attention-grabbing | High | High |
| Shadow gradient | Atmospheric | Very subtle | Very low |

**Decision**: Small horizontal bar (4px × 40px) with 20% opacity
- Enough to notice without distraction
- Fades out when navigation appears
- Matches "swipe up" gesture hints on mobile

---

## Component Interactions

### Interaction Flow Diagram

```
User moves mouse
       ↓
JavaScript mousemove listener
       ↓
Calculate distance from bottom edge
       ↓
  < 100px?
   ↙     ↘
 YES      NO
  ↓        ↓
Add       Set timeout (500ms)
.show      ↓
class    Remove .show class
  ↓        ↓
CSS transition: translateY(0)
  ↓
Navigation visible
```

### State Management

```javascript
// State machine for navigation visibility
const NavState = {
  HIDDEN: 'hidden',
  SHOWING: 'showing',
  VISIBLE: 'visible',
  HIDING: 'hiding'
};

let currentState = NavState.HIDDEN;
```

---

## Responsive Behavior

### Breakpoint Strategy

```css
/* Mobile: ≤599px - Always visible */
@media (max-width: 599px) {
  .gallery-nav {
    transform: translateY(0) !important;
    transition: none;
  }

  .nav-hint {
    display: none; /* No hint needed when always visible */
  }
}

/* Tablet/Desktop: ≥600px - Auto-hide */
@media (min-width: 600px) {
  .gallery-nav {
    transform: translateY(100%);
    transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .gallery-nav.show,
  .gallery-nav:focus-within {
    transform: translateY(0);
  }
}
```

**Why 600px breakpoint?**
- Matches existing mobile/desktop split in project
- Tablets (≥600px) have mouse support via Bluetooth/trackpad
- Touch-only devices typically <600px width

---

## Accessibility Considerations

### Keyboard Navigation

**Requirement**: Tab key must reveal navigation

**Implementation**:
```css
.gallery-nav:focus-within {
  transform: translateY(0);
}
```

**Flow**:
1. User presses Tab repeatedly
2. Focus moves to navigation buttons
3. `:focus-within` triggers on `.gallery-nav`
4. Navigation slides into view
5. User can interact with buttons

### Screen Reader Compatibility

**Announcement**: Navigation must be announced even when hidden

```html
<section
  class="gallery-nav"
  id="gallery-nav"
  role="navigation"
  aria-label="Artwork navigation"
>
  <!-- Buttons remain in DOM, accessible to screen readers -->
</section>
```

**Testing**:
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)

---

## Performance Optimization

### Animation Performance

**Use Case**: Slide transition 60fps on mid-range devices

**Optimization Techniques**:

1. **CSS `will-change` hint**:
```css
.gallery-nav {
  will-change: transform;
}
```

2. **Hardware acceleration**:
```css
.gallery-nav {
  transform: translateZ(0); /* Force GPU layer */
}
```

3. **Throttle mousemove listener**:
```javascript
import { throttle } from './utils';

const handleMouseMove = throttle((e) => {
  // Navigation logic
}, 100); // Max 10 updates/second

document.addEventListener('mousemove', handleMouseMove);
```

### Memory Considerations

- **Single event listener** on document (not per element)
- **Cleanup on unmount** (if used in SPA context)
- **Passive event listener** for scroll performance:

```javascript
document.addEventListener('mousemove', handleMouseMove, { passive: true });
```

---

## Testing Strategy

### Unit Tests

1. **CSS Transform Application**
   - Verify `translateY(100%)` on desktop
   - Verify `translateY(0)` on mobile

2. **State Transitions**
   - Hidden → Visible when mouse within 100px
   - Visible → Hidden after 500ms delay

### Integration Tests

1. **Cross-Browser Compatibility**
   - Chrome 90+
   - Firefox 88+
   - Safari 14+
   - Edge 90+

2. **Responsive Behavior**
   - Test at 375px (mobile)
   - Test at 768px (tablet)
   - Test at 1920px (desktop)

### Accessibility Tests

1. **Keyboard Navigation**
   - Tab to navigation buttons
   - Verify navigation appears

2. **Screen Reader Announcement**
   - VoiceOver: "Artwork navigation, Previous artwork, button"

### User Acceptance Testing

1. **Discoverability**: 8/10 users discover hidden nav within 10 seconds
2. **Performance**: Animation maintains 60fps on target devices
3. **Preference**: 9/10 users prefer auto-hide over always-visible

---

## Rollback Plan

If auto-hide causes usability issues:

### Quick Revert (5 minutes)

```css
/* Add this single line to disable auto-hide */
.gallery-nav {
  transform: translateY(0) !important;
}
```

### Alternative: Compact Mode

Reduce height instead of hiding:

```css
.gallery-nav {
  height: 50px; /* Down from 80px */
}

.nav-button {
  padding: 6px 12px;
  font-size: 14px;
}
```

---

## Future Enhancements

### Phase 2 Considerations

1. **User Preference Toggle**
   - Add settings icon to navigation
   - Let users choose: Auto-hide, Always visible, Compact

2. **Smart Context Awareness**
   - Hide when user scrolls down (viewing content)
   - Show when user scrolls up (seeking navigation)

3. **Gesture Support**
   - Swipe up from bottom on touch devices
   - Similar to iOS Control Center

4. **Analytics Integration**
   - Track how often users reveal navigation
   - Measure time-to-first-interaction

---

## References

### Related Patterns

- **YouTube Player Controls**: Auto-hide video controls
- **Medium Reading Mode**: Minimal chrome during reading
- **macOS Dock Auto-Hide**: System-level precedent

### Technical References

- CSS Transforms: [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
- WCAG 2.1 Focus Visible: [W3C Guideline 2.4.7](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible)
- Passive Event Listeners: [Chrome Developers](https://developer.chrome.com/docs/lighthouse/best-practices/uses-passive-event-listeners/)

### Code Locations

- Navigation HTML: `index.html:121-137`
- Navigation CSS: `styles/main.css:1453-1467`
- Mobile responsive: `styles/main.css:1676-1680`
