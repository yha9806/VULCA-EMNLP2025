# Design Document: Hybrid Interaction Architecture

**Change ID:** `implement-hybrid-interaction-architecture`
**Date:** 2025-11-01
**Architecture Owners:** AI + UX Design

---

## Problem Statement

### Current State (Week 2-3 Implementation)
- All 24 particle systems activate simultaneously on page load
- No spatial hierarchy or temporal pacing
- Visual result: chaotic, overwhelming, lacks contemplative quality
- Violates Sougwen Chung "负形" (negative space) principle
- User feedback: "这个效果太差了" (effect is too poor)

### Root Cause Analysis

| Aspect | Current Problem | Design Principle Violated |
|--------|-----------------|-------------------------|
| **Time** | All particles visible at T=0 | Temporal pacing required |
| **Space** | All regions equally prominent | Spatial hierarchy needed |
| **Interaction** | No user control | Interactivity should enable discovery |
| **Voice Clarity** | 24 critics talk simultaneously | Single voice at a time |
| **Aesthetic** | Web component feel | Art installation feeling |

---

## Design Philosophy

### Three Guiding Principles

#### 1. Negative Space as Active Design
**Inspiration:** Sougwen Chung's "负形" (negative form) aesthetic
- Whitespace = intentional design choice, not absence
- Default state is empty (5% baseline opacity)
- Content emerges through interaction
- What's *not* shown defines what *is* important

**Implementation:**
```
ParticleSystem.finalAlpha = fadeAlpha × (0.05 + prominence × 0.95)
                         ↑ minimum 5% always visible
```

#### 2. Temporal Pacing Creates Contemplation
**Inspiration:** Dave Whyte (Bees & Bombs) minimalist motion philosophy
- Sequential reveal: 6 critics appear 250ms apart
- Clear rhythm prevents overwhelm
- Time-based transitions feel organic
- Allows reflection on each perspective

**Implementation:**
```
T=0ms:    Critic 1 fades in
T=250ms:  Critic 2 fades in
T=500ms:  Critic 3 fades in
... (total 1500ms to full reveal)
```

#### 3. User Agency Without Friction
**Inspiration:** Refik Anadol immersive experiences
- Passive mode: auto-play for non-interactive browsing
- Active mode: hover/click for exploration
- No explanation needed (intuitive gestures)
- Graceful mode transition (pause/resume seamless)

**Implementation:**
```
Passive (Layer 3): Auto-play cycles regions every 15 seconds
Active (Layer 2):  Cursor interaction activates instantly
Transition:        3 second inactivity timer triggers resume
```

---

## Three-Layer Architecture Rationale

### Why Three Layers?

**Single-layer approaches fail:**
- Layer 1 alone: boring, no automation
- Layer 2 alone: requires active participation
- Layer 3 alone: no user control, impersonal

**Three-layer benefits:**
- Gracefully degrades if one layer disabled
- Serves different user types (passive/active)
- Enables complex behaviors through layer composition
- Separates concerns (state, animation, physics)

### Layer 1: Base (Gallery Walk)

**Purpose:** Provide clear spatial focus and temporal structure

**Mechanism:**
```
User hovers region A
  ↓
layout.hoveredRegion = "artwork_1"
  ↓
Systems for artwork_1:
  system.regionFocused = true
  system.fadeAlpha += 0.02  // 50 iterations = 1000ms fade
  ↓
system.finalAlpha = fadeAlpha × (0.05 + 0.95)
                  = 0.5 × 1.0 = 50% at halfway point
```

**Why This Works:**
- Focuses attention on single region
- Sequential fade-in respects temporal pacing
- Baseline visibility (5%) maintains negative space
- No calculation overhead (simple alpha multiplication)

### Layer 2: Interaction (Data Constellation)

**Purpose:** Enable cursor-driven discovery and particle physics

**Mechanism:**
```
Cursor position (x, y)
  ↓
For each particle in active region:
  distance = sqrt((x - px)² + (y - py)²)

  if distance < 150px:
    angle = atan2(y - py, x - px)
    force = (150 - distance) / 150  // 0-1 scale

    particle.vx += cos(angle) × force × 0.5
    particle.vy += sin(angle) × force × 0.5
  ↓
Trail History: Keep last 20 cursor positions
  Render as fading line connecting trail points
```

**Why This Works:**
- Organic, responsive feel (no snapping)
- User feels particle "intelligence"
- Trail provides visual feedback of cursor path
- Force decay prevents particles flying offscreen

### Layer 3: Auto-Play (Prominence Cycling)

**Purpose:** Enable passive exploration and guided tour

**Mechanism:**
```
No user input for 3+ seconds
  ↓
autoPlayManager.isEnabled = true
  ↓
Every frame:
  timer += delta

  if timer >= 15000ms:
    currentIndex = (currentIndex + 1) % 4
    timer = 0
  ↓
Update prominence for all systems:
  if system.artworkId == currentRegion:
    system.prominenceLevel += 0.02  // Fade in
  else:
    system.prominenceLevel -= 0.02  // Fade out

  system.finalAlpha = fadeAlpha × (0.05 + prominence × 0.95)
```

**Why This Works:**
- Visitors can just watch without interaction
- Clear cycle (every region gets equal time)
- Smooth prominence transitions (no pops)
- Pause/resume maintains coherent experience

---

## Data Flow & State Management

### ParticleSystem State

```javascript
class ParticleSystem {
  // Layer 1: Gallery Walk (spatial focus)
  fadeAlpha: 0-1              // Temporal animation
  sequenceIndex: 0-5          // Entry order (for future stagger)
  regionFocused: boolean      // Is this region hovered?

  // Layer 2: Interaction (cursor physics)
  cursorDistance: number      // Distance to cursor
  attractionForce: 0-1        // Computed force magnitude
  trailHistory: Array<{x,y}>  // Cursor position history

  // Layer 3: Auto-Play (prominence weighting)
  prominenceLevel: 0-1        // 0.05 (min) to 1.0 (max)
  baseProminence: 0.05        // Static baseline visibility

  // Computed
  finalAlpha: 0-1             // = fadeAlpha × (0.05 + prominence × 0.95)

  // Rendering
  displayContainer: PIXI.Container
  particles: Array<Particle>
}
```

### ExhibitionLayout State

```javascript
class ExhibitionLayout {
  regions: {                      // 4 regions
    'artwork_1': PIXI.Container,
    'artwork_2': PIXI.Container,
    'artwork_3': PIXI.Container,
    'artwork_4': PIXI.Container
  }

  regionSystems: {                // Map regions to systems
    'artwork_1': [6 ParticleSystems],
    'artwork_2': [6 ParticleSystems],
    'artwork_3': [6 ParticleSystems],
    'artwork_4': [6 ParticleSystems]
  }

  hoveredRegion: string|null      // Currently hovered region
}
```

### AutoPlayManager State

```javascript
class AutoPlayManager {
  regions: ['artwork_1', 'artwork_2', 'artwork_3', 'artwork_4']
  currentIndex: 0-3               // Which region is prominent
  timer: number                   // Milliseconds in current region
  phaseTime: 15000                // Duration per region (ms)
  isEnabled: boolean              // Is auto-play running?
}
```

---

## RPAIT Dimension Mappings

### Design Rationale

Each RPAIT dimension maps to distinct visual encodings to make the framework *visible* rather than abstract:

### R (Representation / 表现力)

**Visual Encoding:** Particle count and size

**Rationale:** More particles = stronger visual presence = higher representation

```javascript
particleCount = 80 + (rpait.R × 20)    // 80-280 particles
particleSize = 2 + (rpait.R × 0.8)     // 2-10px diameter
```

**Example:**
- R=0: 80 tiny particles (subtle)
- R=5: 180 medium particles (balanced)
- R=10: 280 large particles (dominant)

### P (Philosophy / 哲学性)

**Visual Encoding:** Motion intensity and pattern

**Rationale:** More philosophical = more contemplative = slower, more deliberate motion

```javascript
driftIntensity = 1 + (rpait.P × 0.3)    // 1-4x base speed
attractionStrength = rpait.P / 10       // 0-1 scale for Layer 2
motionPattern = rhythmPatterns[floor(rpait.P / 2.5)]  // 4 rhythm types
```

**Example:**
- P=0: Mechanical, fast motion
- P=5: Balanced, natural drift
- P=10: Contemplative, slow waves

### A (Aesthetics / 美学)

**Visual Encoding:** Color and luminosity

**Rationale:** More aesthetic = more vibrant = richer hue, higher saturation

```javascript
hue = baseHue[criticId] + (rpait.A - 5) × 8  // ±40° variation
saturation = 40 + (rpait.A × 6)              // 40-100%
lightness = 35 + (rpait.A × 4)               // 35-75%
glowIntensity = 0.1 + (rpait.A × 0.15)       // 10-25%
```

**Example:**
- A=0: Desaturated, dark (minimal aesthetics)
- A=5: Base color, natural lighting
- A=10: Vivid, bright, glowing (high aesthetics)

### I (Interpretation / 解读深度)

**Visual Encoding:** Fade complexity and sedimentation curves

**Rationale:** Deeper interpretation = more complex decay patterns

```javascript
alphaMin = 0.05 + (rpait.I × 0.05)      // 5-55% minimum
alphaMax = 0.3 + (rpait.I × 0.2)        // 30-130% maximum (clamped)

fadeComplexity:
  I < 3: 'linear'       // Simple fade out
  I < 6: 'sinusoidal'   // Wavy fade
  I < 8: 'polynomial'   // Curved fade
  I ≥ 8: 'complex'      // Fractal-like fade
```

**Example:**
- I=0: Simple linear fade (surface-level reading)
- I=5: Sinusoidal fade (balanced interpretation)
- I=10: Complex fractal fade (deep, nuanced interpretation)

### T (Technique / 技巧)

**Visual Encoding:** Burst velocity and precision

**Rationale:** Better technique = faster, more precise movement

```javascript
burstVelocity = (rpait.T / 10) × 10      // 0-10 pixels/frame
speed = 1.5 + (rpait.T × 0.8)            // 1.5-9.5 base speed
precision = 0.5 + (rpait.T × 0.5)        // 0.5-5.5 accuracy
```

**Example:**
- T=0: Slow burst, loose particles
- T=5: Moderate burst, balanced precision
- T=10: Fast burst, tight control

---

## Performance Considerations

### Optimization Strategy

#### 1. Alpha Calculation Efficiency
- Single `finalAlpha = fadeAlpha × (0.05 + prominence × 0.95)` per system per frame
- No expensive operations (just multiplication and addition)
- Cached in `system.finalAlpha` to avoid recalculation in render()

#### 2. Particle Rendering Batching
- Use PixiJS `Graphics` batching, not individual sprites
- Single graphics object per system per frame
- Particles rendered as circles, not textured (cheaper)

#### 3. Conditional Rendering
```javascript
if (finalAlpha < 0.01) {
  displayContainer.removeChildren();
  return;  // Skip rendering entirely
}
```

#### 4. Memory Management
- ParticleContainer capacity: 100K (max, current use: 1920)
- No dynamic allocation per frame
- Array pooling for particles (reuse, don't create)

### Performance Targets

| Metric | Target | Rationale |
|--------|--------|-----------|
| FPS | 60 | Smooth animation |
| Per-frame CPU | <16ms | 60fps = 16.67ms per frame |
| Per-frame GPU | <5ms | Alpha blending is fast on GPU |
| Memory | <50MB | 24 × 80 + containers + state |
| Alpha calc | <1ms | 24 systems × single multiplication |

---

## Visual Semantics

### Color Language (Persona Identity)

Each critic has unique color identity encoding their cultural perspective:

```javascript
const colorIdentity = {
  '苏轼': 0x2F2E2C,            // 深灰 (deep grey) - literati restraint
  '郭熙': 0x2D5016,            // 深绿 (deep green) - landscape depth
  '约翰罗斯金': 0x6B4C9A,      // 紫色 (purple) - Victorian aesthetics
  '佐拉妈妈': 0x8B6F47,        // 棕色 (brown) - earthy community
  '埃琳娜佩特洛娃': 0xB22234,  // 红色 (red) - formal structure
  'AI伦理评审员': 0x0066CC     // 蓝色 (blue) - digital ethics
}
```

**Design Intent:** Colors are not arbitrary; each reflects the critic's cultural origin and values.

### Motion Language (Persona Movement Pattern)

Different motion patterns for different philosophical approaches:

```javascript
const motionPatterns = {
  '苏轼': 'brushStroke',           // Wave-like (ink painting flow)
  '郭熙': 'perspectiveDepth',      // Concentric circles (layered)
  '约翰罗斯金': 'ascendingNarrative', // Spiral (ascending narrative)
  '佐拉妈妈': 'circularSynchrony',    // Orbiting (community movement)
  '埃琳娜佩特洛娃': 'geometricStructure', // Grid (formal structure)
  'AI伦理评审员': 'algorithmicFractal'  // Self-similar (algorithms)
}
```

**Design Intent:** Motion style reflects analytical approach (not random).

---

## Error Handling & Graceful Degradation

### Layer Independence

Each layer can fail independently without breaking others:

```
If Layer 3 disabled:
  → Layer 1 + 2 still work (manual interaction only)

If Layer 2 disabled:
  → Layer 1 + 3 still work (hover focus + auto-play)

If Layer 1 disabled:
  → Layers 2 + 3 still work (all particles visible at base level)
```

### Fallback Behaviors

```javascript
// If AutoPlayManager fails to initialize
autoPlayManager = new NullAutoPlayManager();  // No-op manager

// If RPAIT data missing
rpait = { R: 5, P: 5, A: 5, I: 5, T: 5 };  // Neutral defaults

// If prominence calculation fails
finalAlpha = 0.5;  // Fallback to 50% visibility
```

---

## Testing Strategy

### Unit Testing

1. **ParticleSystem**
   - `fadeAlpha` interpolation (smooth, within 0-1)
   - `finalAlpha` calculation (correct formula)
   - Rendering conditions (skips when alpha < 0.01)

2. **AutoPlayManager**
   - Region cycling (correct order, 15s intervals)
   - Prominence updates (smooth, correct direction)
   - pause/resume logic

3. **ExhibitionLayout**
   - Region detection (correct hitArea)
   - System mapping (correct 6 systems per region)

### Integration Testing

1. **Layer 1 + Layout**
   - Hover region → fade-in/fade-out
   - Multiple regions → switch correctly
   - Keyboard input → same as hover

2. **Layer 2 + Interaction**
   - Cursor movement → particle attraction
   - Cursor trail → renders and decays
   - Click → burst animation

3. **Layer 3 + AutoPlay**
   - No interaction → auto-cycle
   - User interaction → pause auto-play
   - 3s inactivity → resume auto-play

### Visual Testing (Playwright MCP)

```
Screenshot T=0s:    Page load, all regions empty
Screenshot T=1s:    Artwork 1 fading in (Layer 3 active)
Screenshot T=3s:    Artwork 1 fully visible
Screenshot T=8s:    Artwork 1 fading out
Screenshot T=15s:   Artwork 2 fading in
...
With hover:         Move cursor to Artwork 3 (Layer 1 overrides)
With click:         Click region (Layer 2 burst animation)
```

---

## Future Enhancements

### Phase 4: Mobile & Accessibility
- Touch gesture support (drag = cursor attraction)
- Keyboard navigation (arrow keys cycle regions)
- Screen reader support (ARIA labels)
- High contrast mode

### Phase 5: Audio
- Musical accompaniment (P dimension = tempo)
- Spatial audio (particle position = pan)
- Ambient soundscape

### Phase 6: Advanced Interaction
- Multi-touch simultaneous interaction
- Gesture recognition (swipe = burst)
- Voice control ("show me this critic")

### Phase 7: Content Expansion
- Additional artworks (6-8 total)
- Comparative analysis (side-by-side)
- Timeline view (historical context)

---

## Success Definition

✅ **Aesthetic Success**
- Feels like art installation, not website component
- Respects negative space principle (whitespace present)
- Temporal pacing creates contemplation

✅ **Functional Success**
- Auto-play cycles without user input
- Hover interaction works smoothly
- All three layers function independently

✅ **Performance Success**
- 60fps maintained with 1920 particles
- <50MB memory usage
- <1s startup time

✅ **User Experience Success**
- No explanation needed (intuitive gestures)
- Clear visual feedback (cursor influences particles)
- Emergent understanding of RPAIT dimensions

---

## Design Decisions & Trade-offs

| Decision | Alternative | Reasoning |
|----------|-----------|-----------|
| Layer 1 + 3 in Week 3 | All 3 layers at once | Incremental delivery, lower risk |
| 15s per region | 10s or 20s | Optimal for contemplation (not too fast/slow) |
| 250ms stagger | 100ms or 500ms | Perceptible but not jarring |
| 150px cursor radius | 100px or 200px | Comfortable hand-eye coordination zone |
| 5% baseline visibility | 0% or 10% | Negative space visible without being distracting |

---

**Document Status:** Draft (Awaiting Approval)
**Last Updated:** 2025-11-01
