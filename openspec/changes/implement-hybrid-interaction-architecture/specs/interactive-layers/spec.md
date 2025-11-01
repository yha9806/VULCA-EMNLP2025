# Specification: Interactive Layers System

**Change ID:** `implement-hybrid-interaction-architecture`
**Capability ID:** `interactive-layers`
**Type:** ADDED (new system)
**Date:** 2025-11-01

---

## Overview

Three-layer interactive system enabling spatial focus (Layer 1), cursor physics (Layer 2), and automatic exploration (Layer 3).

---

## ADDED Requirements

### Requirement: Layer 1 - Spatial Focus with Gallery Walk Metaphor

#### Summary
Hovering over an artwork region focuses that region, fading in its 6 critic particle systems sequentially while others fade to baseline visibility.

#### Details
- **Hover Action:** When cursor enters region hitArea, `regionFocused = true` for that region's systems
- **Fade-In:** Particles fade from 0% to 100% opacity over 1.0-1.5 seconds
- **Sequential Reveal:** 6 critics appear 250ms apart (苏轼 → 郭熙 → 约翰罗斯金 → 佐拉妈妈 → 埃琳娜佩特洛娃 → AI伦理评审员)
- **Baseline:** Non-hovered regions remain at 5% opacity (negative space visibility)
- **Hover Out:** Fading out takes 1.5 seconds
- **Region Exit:** After leaving region for 3+ seconds with no new interaction, auto-play can resume

#### Scenario: User Hovers Over Artwork 1

**Given:**
- Exhibition page loaded
- Artwork 1-4 at baseline visibility (5%)
- Cursor ready to move

**When:**
- User moves cursor into Artwork 1 region hitArea

**Then:**
- Auto-play pauses
- Artwork 1's 6 critic systems begin fade-in
- T=0ms: 苏轼 particles start appearing (grey color)
- T=250ms: 郭熙 particles start appearing (green color)
- T=500ms: 约翰罗斯金 particles start appearing (purple color)
- T=750ms: 佐拉妈妈 particles start appearing (brown color)
- T=1000ms: 埃琳娜佩特洛娃 particles start appearing (red color)
- T=1250ms: AI伦理评审员 particles start appearing (blue color)
- T=1500ms: All 6 colors fully visible, particles at ~100% opacity
- Other regions (Artwork 2-4) remain at 5% opacity

**And When:**
- User moves cursor out of Artwork 1 region

**Then:**
- Artwork 1 particles fade out over 1.5 seconds
- Region returns to 5% baseline visibility
- If no new interaction for 3 seconds, auto-play resumes

#### Acceptance Criteria
- [ ] Hover detection correctly identifies region entry/exit
- [ ] Fade-in/fade-out curves are smooth (no popping)
- [ ] 250ms stagger is perceivable but not jarring
- [ ] Other regions remain at 5% opacity during hover
- [ ] 3-second inactivity timer functions correctly

---

### Requirement: Layer 3 - Automatic Region Cycling

#### Summary
When no user interaction occurs for 3+ seconds, auto-play manager automatically cycles through regions every 15 seconds, adjusting prominence weighting to highlight current region while fading others to baseline.

#### Details
- **Trigger:** 3+ seconds since last user interaction
- **Cycle Order:** artwork_1 → artwork_2 → artwork_3 → artwork_4 → (repeat)
- **Duration Per Region:** 15 seconds
- **Prominence Logic:**
  - Current region: prominence fades from 5% → 100% (smooth)
  - Other regions: prominence fades from previous value → 5% (smooth)
- **Visual Effect:** Current region becomes brighter while others fade
- **Alpha Calculation:** `finalAlpha = fadeAlpha × (0.05 + prominence × 0.95)`
  - Minimum: 0.05 × 1.0 = 5% (never completely hidden)
  - Maximum: 1.0 × 1.95 = 100% (fully opaque)
- **User Control:** Hovering region pauses auto-play; 3s idle resumes

#### Scenario: User Watches Auto-Play Cycle

**Given:**
- Exhibition page loaded
- User is not interacting with any region
- Timer at 3+ seconds since last interaction

**When:**
- Auto-play manager is enabled

**Then:**
- T=0-15s: Artwork 1 prominence → 100%, others → 5%
  - Artwork 1 visual appearance increases over time
  - Other regions fade to subtle background
  - At T=15s, Artwork 1 fully prominent

- T=15-30s: Artwork 2 prominence → 100%, Artwork 1 → 5%, others → 5%
  - Visual focus smoothly transitions to Artwork 2
  - Artwork 1 fades to background

- T=30-45s: Artwork 3 prominent
- T=45-60s: Artwork 4 prominent
- T=60-75s: Back to Artwork 1 (cycle repeats)

**And When:**
- User hovers over any region during auto-play

**Then:**
- Auto-play immediately pauses
- Hovered region takes focus (Layer 1)
- Manual control resumes

**And When:**
- User moves cursor away and stays inactive for 3+ seconds

**Then:**
- Auto-play resumes from next region in cycle (not interrupted cycle point)

#### Acceptance Criteria
- [ ] Auto-play triggers after 3 seconds inactivity
- [ ] Regions cycle in correct order
- [ ] 15-second duration per region (±100ms)
- [ ] Prominence values smooth and in [0.05, 1.0] range
- [ ] Pause/resume cycle doesn't drop frames
- [ ] Visual transitions smooth (no pops)

---

### Requirement: Layer 1 + Layer 3 Integration

#### Summary
Layers 1 and 3 cooperate: Layer 1 hover pauses Layer 3 auto-play, and resumption respects current cycle position.

#### Details
- **Pause Trigger:** `hoveredRegion != null` (any region being hovered)
- **Resume Trigger:** `Date.now() - lastInteractionTime >= 3000` (3+ seconds idle)
- **State Preservation:** currentIndex is preserved during pause, cycle resumes from next region
- **No Conflict:** If user hovers multiple regions quickly, no duplicate cycling
- **Edge Case:** User hovers, releases, hovers again within 3s → auto-play stays paused

#### Scenario: User Interrupts Auto-Play, Then Leaves

**Given:**
- Auto-play cycling at Artwork 2 (T=20s / 15s)
- All 4 regions have prominence values in smooth transition

**When:**
- User hovers over Artwork 3

**Then:**
- Auto-play pauses immediately
- Artwork 2 stops fading (preserves current prominence level)
- Artwork 3 takes Layer 1 focus (fade-in starts)
- Other regions remain at current prominence

**And When:**
- User moves cursor out of Artwork 3

**Then:**
- 3-second inactivity timer starts
- At T=3s: Auto-play resumes
- Resume position: Next region in cycle (Artwork 3 in this case)
- Artwork 2 prominence continues fading from where it was

#### Acceptance Criteria
- [ ] Pause occurs immediately on hover (no delay)
- [ ] Resume occurs exactly 3 seconds after cursor leaves
- [ ] Current prominence values preserved during pause
- [ ] No visual artifacts when resuming
- [ ] Multiple hovers don't cause confusion

---

## MODIFIED Requirements

### Requirement: ParticleSystem Alpha Blending

#### Summary
ParticleSystem alpha calculations now use three-component blending: fade animation × baseline × prominence weighting.

#### Details

**Previous Formula:**
```
finalAlpha = fadeOutAlpha × 1.0
```

**New Formula:**
```
finalAlpha = fadeAlpha × (baseProminence + prominenceLevel × 0.95)
           = fadeAlpha × (0.05 + prominenceLevel × 0.95)
```

**Components:**
- `fadeAlpha` ∈ [0, 1]: Temporal fade-in/fade-out animation (Layer 1)
- `baseProminence` = 0.05: Static baseline for negative space (always visible)
- `prominenceLevel` ∈ [0.05, 1.0]: Dynamic weighting (Layer 3)
- Multiplier term: `0.05 + prominenceLevel × 0.95`
  - Minimum: 0.05 + 0.05 × 0.95 = 0.0975 (≈10% of baseline)
  - Maximum: 0.05 + 1.0 × 0.95 = 1.0 (100%)

**Example Values:**
```
Scenario 1: Non-hovered region, no auto-play
  fadeAlpha = 0, prominenceLevel = 0.05
  finalAlpha = 0 × (0.05 + 0.05 × 0.95) = 0 × 0.0975 = 0%

Scenario 2: Hovered region, fade-in halfway
  fadeAlpha = 0.5, prominenceLevel = 1.0
  finalAlpha = 0.5 × (0.05 + 1.0 × 0.95) = 0.5 × 1.0 = 50%

Scenario 3: Auto-play region, fully prominent
  fadeAlpha = 1.0, prominenceLevel = 1.0
  finalAlpha = 1.0 × (0.05 + 1.0 × 0.95) = 1.0 × 1.0 = 100%

Scenario 4: Auto-play region, other regions, not prominent
  fadeAlpha = 1.0, prominenceLevel = 0.05
  finalAlpha = 1.0 × (0.05 + 0.05 × 0.95) = 1.0 × 0.0975 ≈ 10%
```

#### Scenario: Alpha Calculation Consistency

**Given:**
- 24 particle systems active
- Layer 1 and 3 both updating state
- 60fps rendering target

**When:**
- Each frame, finalAlpha is calculated as: `fadeAlpha × (0.05 + prominenceLevel × 0.95)`

**Then:**
- All particles rendered with correct alpha
- No visual popping or discontinuities
- Values strictly within [0%, 100%] range
- Transitions smooth over time

#### Acceptance Criteria
- [ ] Formula produces values in [0, 1] range always
- [ ] Rendering applies finalAlpha correctly to particles
- [ ] No visual artifacts or discontinuities
- [ ] Math verified with unit tests

---

### Requirement: ExhibitionLayout Region Tracking

#### Summary
Layout now tracks which region is hovered and maps each region to its 6 particle systems.

#### Details
- **hoveredRegion property:** String or null
  - null = no region hovered
  - "artwork_1" | "artwork_2" | "artwork_3" | "artwork_4" = which region hovered
- **regionSystems mapping:** Map or object
  - Key: "artwork_1", "artwork_2", etc.
  - Value: Array of 6 ParticleSystems for that region
- **handleRegionHover(regionKey, isHovering) method:**
  - Updates `hoveredRegion`
  - Sets `regionFocused = true/false` on all systems in that region

#### Scenario: Region Detection

**Given:**
- 4 regions with 24 particle systems (6 per region)
- User cursor in motion

**When:**
- Cursor enters Artwork 1 hitArea
  - `handleRegionHover("artwork_1", true)` called

**Then:**
- `hoveredRegion = "artwork_1"`
- 6 systems with `artworkId = "artwork_1"` get `regionFocused = true`
- Other 18 systems get `regionFocused = false`

**And When:**
- Cursor leaves Artwork 1, enters Artwork 3

**Then:**
- `handleRegionHover("artwork_1", false)` called
- `handleRegionHover("artwork_3", true)` called
- Artwork 1's systems: `regionFocused = false`
- Artwork 3's systems: `regionFocused = true`
- Artwork 2 & 4 systems: `regionFocused = false`

#### Acceptance Criteria
- [ ] Exactly 24 systems mapped (6×4)
- [ ] Each region correctly identified
- [ ] regionFocused flag propagates correctly
- [ ] No systems left unmapped

---

## Implementation Notes

### Phase 1 Deliverables (Week 3)

**New Files:**
- `vulca-exhibition/js/exhibition/AutoPlayManager.js` (new class)

**Modified Files:**
- `vulca-exhibition/js/exhibition/ParticleSystem.js` (add properties, modify render)
- `vulca-exhibition/js/exhibition/ExhibitionLayout.js` (add tracking)
- `vulca-exhibition/js/exhibition/InteractionManager.js` (add pause/resume)
- `vulca-exhibition/js/app.js` (integrate autoPlayManager, animation loop)
- `vulca-exhibition/index.html` (load AutoPlayManager.js)
- `vulca-exhibition/styles/*.css` (add interaction feedback)

**Test Coverage:**
- Playwright MCP auto-play cycling verification
- Region hover detection
- Layer 1 + Layer 3 integration
- FPS ≥60 with 1920 particles

---

## Success Metrics

| Metric | Target | Method |
|--------|--------|--------|
| Hover Detection Latency | <100ms | Chrome DevTools Performance tab |
| Fade Smoothness | 60fps | FPS monitor during fade animation |
| Auto-Play Precision | ±100ms from 15s target | Timer logging |
| Memory Overhead | <5MB additional | Chrome DevTools Memory tab |
| Alpha Calculation Error | 0% deviation from formula | Unit test validation |

---

## References

- **Design Document:** `design.md` (architecture reasoning)
- **Tasks:** `tasks.md` (implementation steps)
- **Proposal:** `proposal.md` (strategic context)

---

**Specification Status:** Ready for Implementation
**Created:** 2025-11-01
