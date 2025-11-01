# Complete Advanced Features - OpenSpec Change Proposal

## Overview

This OpenSpec proposal addresses the **75% gap** between the current VULCA exhibition platform (25% feature-complete) and the originally planned specification.

**Change ID:** `complete-advanced-features`
**Status:** Proposal (Awaiting Approval)
**Effort:** 200-240 hours (3-4 weeks)

## What's Included

### 1. Layer 2 Physics Engine
Transforms particles from static to **truly interactive** with cursor-driven physics:
- Cursor position tracking
- Inverse-square-law attraction (particles follow cursor)
- Perlin noise-based wind fields
- Velocity damping (smooth deceleration)
- Particle trail rendering

**Impact:** Particles become responsive to user input, creating a "living" exhibition

### 2. RPAIT Visualization System  
Transforms data from numbers to **visual insights**:
- 5-dimensional radar charts
- Side-by-side persona comparisons
- Heatmap views (all personas/dimensions at once)
- Difference highlighting
- JSON/CSV export

**Impact:** Users understand **why** personas differ, not just **what** they score

### 3. Content Interaction & Discovery
Transforms browsing from linear to **exploratory**:
- Full-text search across critiques
- Multi-dimensional filtering (persona, artwork, dimension, score)
- Bookmarking system (localStorage-backed)
- Comparison view (side-by-side critiques)
- Shareable links (reproducible state)
- Navigation breadcrumbs + content discovery

**Impact:** Users can deeply explore, compare, save, and share

## Key Statistics

| Metric | Value |
|--------|-------|
| New Features | 18 |
| New Code (estimated) | ~5,000 lines |
| Test Cases | 40+ |
| Documentation | 8 specs + 1 design doc + 1 task list |
| Breaking Changes | 0 (backward compatible) |
| Accessibility Target | WCAG 2.1 AA |
| Mobile Support | Full |

## Roadmap

```
Week 1: Layer 2 Physics (40-50h)
├─ Cursor tracking
├─ Attraction force
├─ Wind fields
└─ Trail rendering

Week 2: RPAIT Visualization (50-70h)
├─ Chart integration
├─ Radar charts
├─ Comparison view
├─ Heatmap
└─ Data export

Weeks 3-4: Content Interaction (60-80h)
├─ Search system
├─ Filtering
├─ Bookmarks
├─ Sharing
└─ Navigation helpers
```

## Success Criteria

✅ All 48 originally planned features implemented  
✅ 100% test coverage for new features  
✅ WCAG 2.1 AA accessibility compliance  
✅ Mobile-responsive (320px - 1440px+)  
✅ Performance: 1920 particles @ 24+ FPS  
✅ No breaking changes  
✅ Comprehensive documentation  

## Files in This Change

```
openspec/changes/complete-advanced-features/
├── proposal.md              (Executive summary + high-level design)
├── design.md                (Architecture, tech choices, tradeoffs)
├── tasks.md                 (170+ implementati checklist items)
├── specs/
│   ├── layer2-physics/
│   │   └── spec.md         (11 detailed requirements + tests)
│   ├── rpait-visualization/
│   │   └── spec.md         (5 detailed requirements + tests)
│   └── content-interaction/
│       └── spec.md         (6 detailed requirements + tests)
└── README.md                (This file)
```

## How to Review

1. **Start with:** `proposal.md` (overview + timeline)
2. **Then read:** `design.md` (architecture decisions)
3. **Then check:** `specs/*/spec.md` (detailed requirements)
4. **Finally:** `tasks.md` (implementation checklist)

## Approval Needed For

- [ ] Architecture approach approved
- [ ] Timeline realistic
- [ ] Scope appropriate
- [ ] Success criteria measurable
- [ ] Ready to implement

## Questions?

Refer to:
- `design.md` for "why" decisions
- `specs/*/spec.md` for detailed "what"
- `tasks.md` for "how" and timing

---

**Proposal Created:** 2025-11-01
**Change Lead:** Claude Code
**Status:** Ready for Review
