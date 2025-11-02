# Proposal: Fix Homepage Display and Add Click-based Navigation

## Why

Users cannot see or interact with the main gallery because:
1. The hero section displays a "scroll to explore" prompt, but scrolling is disabled
2. The actual gallery content (artworks and reviews) is below the fold and invisible
3. Auto-play animations are too fast or poorly timed for content comprehension
4. Users have no clear way to navigate between artworks

This blocks the primary use case: exploring art and reading critiques.

## Summary

Fix critical homepage display issues where main gallery content is not visible, replace confusing "scroll to explore" messaging with actual content, and implement click/touch-based navigation instead of auto-play.

**Change ID:** `fix-homepage-display-and-interaction`

**Scope:**
- Replace auto-play system with click-based artwork carousel
- Fix hero section to show actual content instead of "scroll" prompt
- Implement swipe/click controls for artwork navigation
- Optimize layout so all content fits within viewport
- Maintain scroll prevention on main page

---

## Problem Statement

**Current Issues:**

1. **Hero Section Misleading**: "向下滚动探索" (Scroll to explore) is displayed, but scrolling is disabled - confuses users
2. **Gallery Not Visible**: Main gallery section is below the fold and not visible on initial page load
3. **Auto-play Ineffective**: Current auto-play animation timing doesn't allow sufficient content view time
4. **No Clear Interaction Model**: Users don't understand how to navigate between artworks

**User Expectations:**
- User should see engaging content immediately on page load
- User should be able to navigate artworks via click or touch (left/right swipe)
- All content for current artwork should be visible without scrolling
- Clear visual affordances for navigation

---

## Proposed Solution

### Redesigned Homepage Structure

```
┌─────────────────────────────────────┐
│         HEADER (compact)            │
│    ☰ Menu  |  EN/中  |  (logo?)     │
├─────────────────────────────────────┤
│                                     │
│      ACTIVE ARTWORK SECTION         │
│  ┌─────────────┐  ┌──────────────┐  │
│  │             │  │  Critic 1    │  │
│  │   Image     │  │  ──────────  │  │
│  │             │  │  Critique    │  │
│  │  (50-70%    │  │  Text...     │  │
│  │   height)   │  │              │  │
│  │             │  │ RPAIT: R P A │  │
│  └─────────────┘  └──────────────┘  │
│                  ┌──────────────┐    │
│                  │  Critic 2    │    │
│                  │  ──────────  │    │
│                  │  Critique... │    │
│                  └──────────────┘    │
├─────────────────────────────────────┤
│  [◄ Previous] Artwork 1 of 4        │
│              [Next ►]               │
│                                     │
│  Other artworks summary line:       │
│  • Artwork 2 • Artwork 3 • Artwork4 │
└─────────────────────────────────────┘
```

### Three Key Capabilities

1. **Hero Section Redesign**
   - Replace "scroll to explore" with actual first artwork display
   - Show artwork image + first 2 critic reviews immediately
   - Add visible navigation controls (Previous/Next buttons)

2. **Click/Touch-based Carousel**
   - Left/Right buttons for navigation
   - Touch swipe support (left swipe = next, right swipe = previous)
   - Keyboard arrow keys (optional enhancement)
   - Visual indicator: "Artwork X of 4"

3. **Optimized Viewport Layout**
   - Single artwork fits within viewport height
   - Responsive grid: artwork image + critique panels
   - Mobile: stacked (image on top)
   - Tablet: 2-column (image 40%, reviews 60%)
   - Desktop: flexible layout as above

---

## Success Criteria

- ✅ Hero section displays actual artwork content on page load
- ✅ User can navigate between 4 artworks via Next/Previous buttons
- ✅ Touch swipe gestures work on mobile/tablet
- ✅ All content for current artwork visible within viewport (no scroll needed)
- ✅ Scroll still disabled on main page
- ✅ Clear visual affordance showing which artwork is current ("Artwork X of 4")
- ✅ Responsive across mobile (375px), tablet (768px), desktop (1024px+)
- ✅ No auto-play interference with manual navigation

---

## Architectural Decisions

See `design.md` for detailed discussion on:
- When to show multiple critics (all 6? just top 2?)
- Button placement and styling
- Swipe gesture implementation
- Layout responsiveness strategy
- Animation transitions between artworks

---

## Dependencies & Sequencing

**Phase 1** (Critical - fixes homepage):
- Modify hero section HTML structure
- Move gallery section above fold
- Create carousel controller

**Phase 2** (Enhancement):
- Implement swipe gesture support
- Add keyboard navigation
- Polish animations

**Phase 3** (Polish):
- Responsive refinement
- Accessibility review (a11y)
- Performance optimization

---

## Related Changes

- `immersive-autoplay-with-details` - Previous auto-play approach (being replaced)
- `art-centric-immersive-redesign` - Earlier design exploration

---

## Questions for Review

1. Should hero show all 6 critics or just top 2-3 for readability?
2. Preferred button placement: above/below content, or side-positioned?
3. Should mobile swipe interfere with page closing menu?
4. Any animation preference for artwork transitions?
5. Keep scroll prevention or relax it slightly for accessibility?
