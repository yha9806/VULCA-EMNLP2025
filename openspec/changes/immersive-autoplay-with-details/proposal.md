# Proposal: Immersive Auto-Play Gallery with Detailed Content Pages

## Summary

Enhance VULCA exhibition platform with an immersive, scroll-free auto-play gallery on the main page, combined with a flexible floating layout for critique panels, while preserving detailed contextual content on separate pages accessible via navigation menu.

**Change ID:** `immersive-autoplay-with-details`

**Scope:**
- Main exhibition page: Auto-play gallery with scroll prevention
- Detail pages: Critics profiles, about project, creation process
- Layout system: Image-dominant flexible floating critique panels
- Navigation: Hamburger menu linking to all detail pages

---

## Problem Statement

Current exhibition needs:

1. **Main Gallery**: Audience should be fully immersed in the auto-play experience without distractions or ability to interrupt via scrolling
2. **Content Richness**: Detailed contextual information (critic biographies, RPAIT framework, process documentation) should still be available but not interrupt immersive flow
3. **Visual Hierarchy**: Images should be the primary focus with flexible comment positioning creating a conversational feel, not a rigid grid

---

## Proposed Solution

### Three Integrated Capabilities

1. **Immersive Auto-Play with Anti-Scroll**
   - Main page cycles through 4 artworks with 6 critic reviews each
   - Smooth fade-in/fade-out animations
   - Complete scroll prevention (wheel, keyboard, touch)
   - Infinite loop playback

2. **Multi-Page Detail System**
   - Separate pages for critics, about, process
   - Dynamic content loading from central data
   - Scrollable (scroll ENABLED on detail pages only)
   - Accessible via hamburger navigation menu

3. **Floating Experimental Layout**
   - Image takes 70% width focus
   - Critique panels float absolutely (top-right, mid-screen)
   - Visualization floats (bottom-left corner)
   - Responsive across mobile/tablet/desktop
   - Creates conversational, experimental aesthetic

---

## Success Criteria

- ✅ Main page: User cannot scroll (all scroll vectors blocked)
- ✅ Main page: Auto-play cycles continuously (4 artworks × 6 reviews)
- ✅ Main page: Image-dominant layout with flexible floating panels
- ✅ Detail pages: Fully scrollable and information-rich
- ✅ Navigation: Menu accessible from all pages
- ✅ Responsive: Works on mobile (375px), tablet (768px), desktop (1024px+)
- ✅ Aesthetic: Ghost UI (transparency, blur, minimal borders)

---

## Architectural Decisions

See `design.md` for detailed architectural reasoning on:
- Anti-scroll implementation strategy
- CSS floating layout vs grid-based systems
- Data sharing between main and detail pages
- Responsive breakpoint strategy

---

## Dependencies & Sequencing

1. **Phase 1** (Foundational): Implement auto-play controller + anti-scroll on main page
2. **Phase 2** (Content): Create detail pages with dynamic generators
3. **Phase 3** (Polish): Floating layout + responsive refinement + navigation integration

Phases can be validated independently.

---

## Related Changes

- `art-centric-immersive-redesign` - Earlier immersive work (different approach, can be reviewed)
- All other active changes - Work on different concerns

---

## Questions for Review

1. Should detail pages have auto-play disabled or allow manual navigation?
2. What's the desired autoplay speed (current config: 2-3s per review)?
3. Should floating panels have specific positioning rules or stay random?
