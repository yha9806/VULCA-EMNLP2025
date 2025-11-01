# OpenSpec Proposal: Implement Hybrid Interaction Architecture

**Change ID:** `implement-hybrid-interaction-architecture`
**Status:** Proposal (Pending Approval)
**Date Created:** 2025-11-01
**Priority:** P0 - Core Feature
**Effort Estimate:** 4 weeks (21 days development, Week 3-6)

---

## Executive Summary

Transform VULCA Exhibition platform from "website thinking" to "art installation thinking" by implementing a three-layer hybrid interaction architecture. This addresses critical user feedback: "这个效果太差了 重新思考一下" (This effect is too poor, rethink it).

**Problem:** Current implementation activates all 24 particle systems simultaneously, creating visual chaos rather than contemplative immersion.

**Solution:** Implement three-layer recursive interaction model:
- **Layer 1 (Base):** Spatial focus with Gallery Walk metaphor (negative space + sequential reveal)
- **Layer 2 (Interaction):** Cursor-driven particle attraction and trail effects
- **Layer 3 (Auto-Play):** Automatic region cycling for self-guided exploration

**Expected Outcome:** Immersive, meditative art installation that respects Sougwen Chung's "negative form" aesthetic while enabling deep interaction and RPAIT-driven visual understanding.

---

## Strategic Context

### User Needs

**Primary Intent:** Rebuild exhibition visualization to follow art installation principles rather than web UI patterns
- Embrace negative space as active design element (Sougwen Chung)
- Create temporal pacing (Gallery Walk: sequential reveal)
- Enable interaction-driven discovery (user co-creates experience)
- Make each critic's "voice" distinctly audible (not all simultaneous)

**Personas Affected:**
- Researchers: Need to understand RPAIT dimensions visually
- Art enthusiasts: Need contemplative, gallery-like experience
- Educators: Need intuitive interaction requiring no instructions

### Design Principles

1. **Negative Space Principle** - Whitespace dominates, interaction reveals content
2. **Temporal Pacing** - Sequential timing creates rhythm and prevents overwhelm
3. **User Agency** - Interaction can be passive (auto-play) or active (manual control)
4. **Clear Voices** - One region at a time ensures each critic perspective is audible
5. **Emergent Meaning** - RPAIT dimensions encoded in visual properties (color, motion, intensity)

---

## Scope & Deliverables

### In Scope

✅ **Layer 1: Base Gallery Walk**
- Spatial focus (hover region activates that region only)
- Sequential particle fade-in (6 critics × 250ms = 1.5s reveal)
- Fade-out on region exit (1.5s smooth exit)
- Negative space as default state (5% opacity baseline)

✅ **Layer 3: Auto-Play Manager**
- 15-second cycling through 4 artwork regions
- Prominence weighting system (active region: 100%, others: 5%)
- Pause/resume on user interaction

✅ **Layer 2: Cursor Interaction** (Phase 2)
- Cursor position tracking within region
- Particle attraction (150px radius)
- Trail effect (cursor history rendering)
- Visual feedback (glow on proximity)

✅ **Burst Animation & RPAIT Display** (Phase 3)
- Click triggers particle burst (explosion outward)
- Sedimentation curves (return-to-rest based on I dimension)
- RPAIT value panel (2-second display)
- T dimension controls burst velocity

✅ **Performance & Optimization**
- Maintain 60fps with 24 systems × 80 particles
- Alpha blending optimizations
- Memory footprint <50MB

### Out of Scope (Future Phases)

❌ Mobile touch gesture support (Phase 4)
❌ Audio synchronization (Phase 5)
❌ AR/VR integration (Phase 6)
❌ Additional artwork beyond 4 current works (Phase 7)

---

## Implementation Phases

### Phase 1: Week 3 (6-9 hours)
**Layer 1 + Layer 3 Core Implementation**
- Modify ParticleSystem (fadeAlpha, prominenceLevel)
- Modify ExhibitionLayout (region tracking)
- Create AutoPlayManager (new file)
- Integrate into animation loop
- Playwright MCP verification

**Deliverable:** Auto-play cycling + gallery walk fade in/out working

### Phase 2: Week 4 (6-8 hours)
**Layer 2 Cursor Interaction**
- Enhance InteractionManager (cursor tracking)
- Implement particle attraction physics
- Trail effect rendering
- Visual feedback system

**Deliverable:** Cursor-responsive particle behavior

### Phase 3: Week 5 (6-8 hours)
**Burst Animation + RPAIT Display**
- Click detection and burst animation
- Sedimentation logic (I-dimension driven)
- RPAIT panel UI
- Clamped particle restoration

**Deliverable:** Complete interaction chain

### Phase 4-6: Weeks 6-7 (Optimization + Polish)
- Performance profiling and optimization
- CSS animations and transitions
- Responsive design verification
- Final visual polish

**Deliverable:** Production-ready implementation

---

## Technical Approach

### Architecture Decisions

1. **Three-Layer Model**
   - Layer 1 provides clear spatial/temporal structure
   - Layer 2 enables tactile interaction
   - Layer 3 enables passive exploration
   - Layers operate independently; system fails gracefully if one layer disabled

2. **Alpha Blending Strategy**
   - `finalAlpha = fadeAlpha × (0.05 + prominenceLevel × 0.95)`
   - Minimum 5% baseline visibility (negative space visibility)
   - Smooth transitions via easing curves

3. **RPAIT Mapping**
   - R → particle count/size
   - P → motion intensity (attraction strength, oscillation)
   - A → color generation (HSL dynamic)
   - I → fade complexity (sedimentation curve)
   - T → burst velocity

### Data Flow

```
User Input (mouse move/click)
  ↓
InteractionManager (Layer 2)
  ↓
ExhibitionLayout (region detection)
  ↓
ParticleSystem (update state)
  ↓
Animation Loop
  ↓
Rendering (render() or renderWithGlow())
  ↓
PixiJS (GPU drawing)
```

### State Management

```javascript
ParticleSystem {
  // Layer 1: Gallery Walk
  fadeAlpha: 0-1                 // Temporal fade in/out
  sequenceIndex: 0-5             // Order of appearance
  regionFocused: boolean         // This region is hovered

  // Layer 3: Auto-Play Prominence
  prominenceLevel: 0-1           // 0.05 (min) to 1.0 (max)
  baseProminence: 0.05           // Static baseline

  // Final Rendering
  finalAlpha = fadeAlpha × (baseProminence + prominenceLevel × 0.95)
}

AutoPlayManager {
  currentRegion: string          // artwork_1, artwork_2, etc.
  timer: number                  // Time in current region
  isEnabled: boolean             // pause/resume control
  phaseTime: number              // 15000ms per region
}

ExhibitionLayout {
  hoveredRegion: string          // Current hovered region or null
  regionSystems: Map             // Map each region to its 6 systems
}
```

---

## Success Criteria

### Functional Requirements

✅ **FR-1: Auto-Play Cycling**
- 4 regions cycle in order, 15 seconds each
- Smooth prominence transitions
- Pause on user interaction, resume after 3 seconds of inactivity

✅ **FR-2: Gallery Walk Reveal**
- Hover region → 6 critics fade in sequentially (250ms intervals)
- Hover out → fade to baseline (5% opacity)
- No interaction required, purely pointer-driven

✅ **FR-3: RPAIT Visualization**
- R dimension visible as particle count increase
- P dimension visible as motion intensity
- A dimension visible as color variation
- I dimension visible in fade complexity
- T dimension visible in burst speed

✅ **FR-4: Interaction Layers**
- Layer 1 always active
- Layer 2 activates on cursor movement
- Layer 3 activates when Layer 1 idle >3 seconds
- All three can operate simultaneously without conflicts

### Non-Functional Requirements

✅ **Performance**
- Maintain 60fps minimum with 1920 active particles
- Alpha calculations <1ms per frame
- Memory usage <50MB steady state
- Loading time <2 seconds

✅ **Accessibility**
- No color-only information encoding (add text labels)
- Keyboard support for region cycling (arrow keys)
- Hover states clearly visible
- Text contrast ratio ≥4.5:1

✅ **Browser Compatibility**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (Phase 4)

---

## Risk Analysis

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| Performance degradation at layer overlap | High | Medium | Alpha calculation optimization, profile early |
| Confusion between manual/auto modes | Medium | Medium | Clear visual feedback when auto-play active |
| RPAIT semantics unclear to users | Medium | Low | Add tooltip/help system (Phase 4) |
| Browser compatibility issues | Medium | Low | Test on 3+ browsers during Week 6 |
| Memory leaks in displayContainer | High | Low | Ensure proper PIXI destruction sequence |

---

## Dependencies & Assumptions

### Dependencies

- ✅ Existing ParticleSystem.js (Week 2-3 implementation)
- ✅ Existing ExhibitionLayout.js (Week 1-2 implementation)
- ✅ PixiJS 8.6.0+ (already loaded)
- ✅ RPAIT data structure (already in place)

### Assumptions

- Users have modern browsers (ES6+ support)
- 60fps target is achievable with PixiJS optimizations
- 24 systems × 80 particles = 1920 particles is acceptable target
- Sougwen Chung aesthetic preferences align with "minimal, negative space" interpretation

---

## Approval Gates

**Gate 1: Proposal Review** (Current)
- [ ] Architecture clarity confirmed
- [ ] Phase breakdown approved
- [ ] Risk mitigation accepted
- [ ] Success criteria understood

**Gate 2: Implementation Start** (After approval)
- [ ] Code review checklist prepared
- [ ] Test scenarios defined
- [ ] Git commit strategy reviewed

**Gate 3: Phase Completion**
- [ ] All tasks in phase marked complete
- [ ] Playwright MCP verification passed
- [ ] Performance targets met

---

## References

- **Hybrid Design Document:** `HYBRID_DESIGN_PROPOSAL.md` (design philosophy)
- **Implementation Checklist:** `IMPLEMENTATION_CHECKLIST.md` (detailed tasks)
- **Reference Analysis:** `REFERENCE_ANALYSIS_AND_REDESIGN_PROPOSALS.md` (design research)
- **Design Direction:** `DESIGN_DIRECTION_SUMMARY.md` (approach overview)

---

## Next Steps

1. **Approval** - Confirm proposal aligns with vision
2. **Task Planning** - Update `tasks.md` with any adjustments
3. **Implementation** - Begin Phase 1 (Week 3) per OpenSpec workflow
4. **Verification** - Use Playwright MCP for each phase delivery
5. **Documentation** - Update README and deployment guides as needed

---

**Proposal Status:** ⏳ Awaiting Approval
**Created:** 2025-11-01 by Claude Code
**Last Updated:** 2025-11-01
