# Proposal: Optimize Gallery Navigation Bar

**Change ID**: `optimize-gallery-navigation-bar`
**Created**: 2025-11-03
**Status**: Proposed
**Author**: Claude Code

---

## Problem Statement

The current gallery navigation bar (bottom bar with prev/next buttons and page indicator) occupies too much vertical space and creates visual obstruction:

- **Fixed height of 80px** on desktop (100px on larger screens)
- **Always visible** regardless of user interaction
- **Blocks content** at the bottom of the viewport, especially when viewing artwork details or data visualizations
- **Reduces effective viewing area** by ~10-15% on typical screens

### Current Implementation

```css
.gallery-nav {
  position: fixed;
  bottom: 0;
  height: 80px;
  background: rgba(255, 255, 255, 0.95);
  z-index: var(--z-sticky);
}
```

Located at: `index.html` lines 121-137, `styles/main.css` lines 1453-1467

### User Impact

- Content at the bottom of the page is permanently obscured
- Data visualizations section requires scrolling past the navigation bar
- Immersive gallery experience is disrupted by persistent UI chrome

---

## Proposed Solution

Implement an **auto-hide navigation bar** that:

1. **Desktop/Tablet (≥600px)**:
   - Hides navigation bar by default (slides down off-screen)
   - Shows on mouse hover near bottom of viewport (within 100px from bottom edge)
   - Smooth slide-in/slide-out animation (300ms ease)
   - Maintains accessibility (keyboard focus still reveals the bar)

2. **Mobile (<600px)**:
   - Navigation bar remains always visible
   - Rationale: Touch devices don't have hover capability; swipe gestures may be less discoverable

3. **Visual Feedback**:
   - Subtle hint (small chevron or shadow) at screen bottom indicating hidden navigation
   - Smooth transitions prevent jarring visual jumps

---

## Implementation Approach

### 1. CSS-Based Auto-Hide (Primary Method)

Use CSS hover states and transforms for performance:

```css
/* Desktop: Hidden by default */
@media (min-width: 600px) {
  .gallery-nav {
    transform: translateY(100%);
    transition: transform 300ms ease-in-out;
  }

  /* Show on hover near bottom */
  .gallery-nav:hover,
  .gallery-nav:focus-within {
    transform: translateY(0);
  }

  /* Trigger zone at bottom of viewport */
  body::after {
    content: '';
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100px;
    pointer-events: none;
  }
}

/* Mobile: Always visible */
@media (max-width: 599px) {
  .gallery-nav {
    transform: translateY(0);
  }
}
```

### 2. JavaScript Enhancement (Optional)

Add hover detection zone for better UX:

```javascript
// Detect mouse position near bottom edge
let navTimeout;
document.addEventListener('mousemove', (e) => {
  const distanceFromBottom = window.innerHeight - e.clientY;
  const nav = document.querySelector('.gallery-nav');

  if (window.innerWidth >= 600) {
    if (distanceFromBottom < 100) {
      nav.classList.add('show');
    } else {
      clearTimeout(navTimeout);
      navTimeout = setTimeout(() => {
        nav.classList.remove('show');
      }, 300);
    }
  }
});
```

### 3. Visual Hint

Add a small indicator at bottom center:

```css
.nav-hint {
  position: fixed;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 4px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  transition: opacity 300ms;
  pointer-events: none;
}

.gallery-nav:hover ~ .nav-hint,
.gallery-nav.show ~ .nav-hint {
  opacity: 0;
}
```

---

## Alternatives Considered

### A. Semi-Transparent Hover
- **Pros**: Navigation always partially visible
- **Cons**: Still occupies space, doesn't solve obstruction problem
- **Decision**: Rejected - doesn't address core issue

### B. Move to Sidebar
- **Pros**: Doesn't block bottom content
- **Cons**: Breaks established UX pattern, complicates mobile layout
- **Decision**: Rejected - too disruptive

### C. Compact Mode (Reduced Height)
- **Pros**: Simple, less drastic change
- **Cons**: Still blocks content, only partially solves problem
- **Decision**: Alternative if auto-hide proves problematic

---

## Success Criteria

- [ ] Desktop navigation bar hidden by default
- [ ] Smooth slide-in animation when mouse near bottom edge (<100px)
- [ ] Navigation revealed on keyboard focus (accessibility)
- [ ] Mobile navigation always visible
- [ ] No layout shift or content jump
- [ ] Works across all supported browsers (Chrome, Firefox, Safari, Edge)
- [ ] Maintains WCAG 2.1 AA accessibility standards

---

## Dependencies

- No external library dependencies
- No breaking changes to existing navigation API
- Compatible with current carousel system

---

## Rollout Plan

1. **Phase 1**: Implement CSS-only version (1 hour)
2. **Phase 2**: Add visual hint indicator (30 min)
3. **Phase 3**: Optional JS enhancement for better hover detection (1 hour)
4. **Phase 4**: User testing and refinement (as needed)

**Total Estimated Time**: 2-3 hours

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Users don't discover hidden navigation | High | Add visual hint at bottom |
| Accessibility concern for keyboard users | High | Ensure `:focus-within` reveals nav |
| Animation performance on low-end devices | Medium | Use CSS transforms (GPU-accelerated) |
| Mobile users expect hover behavior | Low | Keep mobile always-visible |

---

## References

- Current navigation implementation: `index.html:121-137`, `styles/main.css:1453-1467`
- Similar UX pattern: YouTube video player controls, Medium reading interface
- Accessibility guidelines: WCAG 2.1 Focus Visible (2.4.7)
