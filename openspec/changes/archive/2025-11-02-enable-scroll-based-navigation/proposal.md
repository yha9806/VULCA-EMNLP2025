# Enable Scroll-Based Navigation with Fade-In Animations

## Meta
- **Status**: Proposed
- **Proposer**: User
- **Date**: 2025-11-02
- **Priority**: High

## Why

### Problem
The current immersive mode (`IMMERSIVE_MODE = true`) with disabled scrolling creates a critical UX issue:

1. **Content Overflow**: Each artwork displays 6 critic reviews + RPAIT visualization, which **exceeds viewport height** on most screens
2. **Hidden Content**: Users cannot scroll to see all content because `overflow: hidden` and scroll prevention are active
3. **Poor Accessibility**: Users with smaller screens or those who need to zoom cannot access full content
4. **Incomplete Experience**: The design shows only partial information for each artwork, defeating the purpose of comprehensive multi-perspective criticism

**Current behavior**:
- Homepage sets `window.IMMERSIVE_MODE = true`
- `scroll-prevention.js` disables wheel, keyboard, and touch scrolling
- CSS sets `overflow: hidden` on body/html
- Result: **Content beyond first viewport is completely inaccessible**

### Solution
Enable scroll-based navigation with progressive content reveal:

1. **Disable IMMERSIVE_MODE** on homepage to allow natural scrolling
2. **Add scroll-triggered fade-in animations** for progressive content display
3. **Implement Intersection Observer** to detect when elements enter viewport
4. **Apply CSS transitions** for smooth fade-in/slide-up effects on each critique card and visualization

**Benefits**:
- ✅ Users can scroll to see all 6 critic reviews and complete RPAIT data
- ✅ Smoother, more engaging experience with fade-in animations
- ✅ Better accessibility and mobile experience
- ✅ Maintains visual rhythm through progressive reveal
- ✅ Keeps carousel navigation as optional quick-access method

## What

### Capabilities
This change introduces one new capability:

1. **scroll-reveal-animations**: Enable scrolling with intersection-observer-based content animations

### Requirements Overview

**scroll-reveal-animations**:
- Disable IMMERSIVE_MODE on homepage (index.html)
- Remove or conditionally disable scroll-prevention.js
- Implement Intersection Observer for content detection
- Add CSS animation classes for fade-in/slide-up effects
- Apply animations to critique cards and RPAIT visualization
- Ensure animations are performant (use CSS transforms/opacity only)
- Provide reduced-motion fallback for accessibility

### Scope
- **In Scope**: Homepage scroll behavior, fade-in animations, Intersection Observer
- **Out of Scope**: Detail pages (already scrollable), carousel navigation changes, new UI components

## How

### Implementation Approach

**Phase 1: Disable Scroll Prevention**
1. Modify `index.html`: Set `window.IMMERSIVE_MODE = false`
2. Ensure `scroll-prevention.js` respects this flag and allows scrolling
3. Remove CSS `overflow: hidden` overrides

**Phase 2: Add Scroll-Reveal Infrastructure**
1. Create `js/scroll-reveal.js` module with Intersection Observer
2. Add CSS animation classes (`.fade-in`, `.slide-up`)
3. Mark critique cards and visualizations with `data-reveal` attribute

**Phase 3: Apply Animations**
1. On page load, add `.reveal-pending` class to all `[data-reveal]` elements
2. Use Intersection Observer to detect viewport entry
3. When element enters viewport, replace `.reveal-pending` with `.revealed`
4. CSS transitions handle the actual animation

**Phase 4: Testing & Polish**
1. Test on mobile (touch scroll)
2. Test on desktop (wheel scroll)
3. Test keyboard navigation
4. Verify `prefers-reduced-motion` fallback
5. Check performance (no layout thrashing)

### Technical Details

**Intersection Observer Setup**:
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      entry.target.classList.remove('reveal-pending');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
```

**CSS Animation**:
```css
[data-reveal] {
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.reveal-pending {
  opacity: 0;
  transform: translateY(30px);
}

.revealed {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  [data-reveal] {
    transition: none !important;
  }
  .reveal-pending {
    opacity: 1;
    transform: none;
  }
}
```

### Dependencies
- None (uses native Intersection Observer API, supported in all modern browsers)

### Risks & Mitigations
- **Risk**: Performance impact from many observers
  - **Mitigation**: Use single observer for all elements, unobserve after reveal
- **Risk**: Animation jank on low-end devices
  - **Mitigation**: Use only `opacity` and `transform` (GPU-accelerated), respect `prefers-reduced-motion`
- **Risk**: Breaking existing carousel navigation
  - **Mitigation**: Keep carousel functional, make scroll and click both work

### Alternatives Considered
1. **Keep IMMERSIVE_MODE, add "View More" button**: Rejected - adds friction
2. **Snap-scroll to each artwork**: Rejected - too rigid for long content
3. **Modal popup for full content**: Rejected - breaks immersive flow

## Success Criteria
- ✅ Users can scroll homepage vertically to see all content
- ✅ Critique cards fade in as they enter viewport
- ✅ No console errors or performance warnings
- ✅ Works on mobile (touch), desktop (wheel), and keyboard (arrow keys)
- ✅ Respects `prefers-reduced-motion` setting
- ✅ Carousel navigation still functional (optional navigation method)

## References
- Current implementation: `js/scroll-prevention.js`
- Related: `openspec/changes/immersive-autoplay-with-details` (completed)
- MDN: Intersection Observer API
- CSS: `prefers-reduced-motion` media query
