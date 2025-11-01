# Artistic Data Visualization - Capability Specification

**Capability ID**: `artistic-visualization`
**Scope**: RPAIT dimension visualization in multiple artistic forms
**Related Capabilities**: immersive-gallery, adaptive-responsive-design

---

## Overview

Transform RPAIT (Representation, Philosophy, Aesthetics, Interpretation, Technique) dimension visualization from static radar charts into a **suite of artistic forms** that maintain data accuracy while exploring different aesthetic approaches. Each visualization form represents the same 5-dimensional data but invites different emotional responses.

---

## Requirements

### ADDED Requirements

#### Requirement: Multiple Visualization Forms
**ID**: `multi-form-visualization`
**Priority**: P0 (Critical)

All forms must:
- Display exactly 5 dimensions (R, P, A, I, T)
- Represent scores accurately (0-10 scale)
- Use persona color coding for visual recognition
- Animate smoothly (1-2 second reveal)
- Be responsive (adapt to screen size)
- Support data accuracy validation (±0.1% deviation tolerance)

**Supported Forms**:

1. **Radar Chart (Current)** - Star/spider shape with 5 points
2. **Concentric Circles** - Nested rings, each ring = one dimension
3. **Particle Flow** - Animated particles representing dimensions
4. **Color Temperature Heat Map** - Gradient from cool (low) to warm (high)
5. **Geometric Pentagon** - Morphing pentagon with points at dimension values
6. **Timeline Representation** - Historical context with dimension bars (for historical personas)
7. **Icon-Based Scoring** - Stylized icons with size/saturation representing scores
8. **Watercolor Overlay** - Transparency-based multi-persona comparison

---

#### Requirement: Form Selection Strategy
**ID**: `form-selection-strategy`
**Priority**: P1 (High)

**Description**: Determine which visualization form displays for each artwork, with consistency and variety in mind.

**Options**:

**Option A: Per-Artwork Mapping**
```javascript
{
  artwork_1: "radar",          // Always radar for artwork 1
  artwork_2: "concentric",     // Always concentric for artwork 2
  artwork_3: "particles",      // Always particles for artwork 3
  artwork_4: "heatmap"         // Always heatmap for artwork 4
}
```
✅ **Pros**: Consistent on revisit, predictable
❌ **Cons**: Less exploratory, user sees same form repeatedly

**Option B: Random Per Session**
```javascript
// On each visit, randomize form selection
// Store in sessionStorage to ensure consistency during single session
```
✅ **Pros**: Encourages re-exploration
❌ **Cons**: Inconsistent experience, harder to predict

**Option C: Random Per-Persona** (Recommended)
```javascript
// Artwork stays fixed, but form changes based on persona ID
// Su Shi → always radar
// Guo Xi → always concentric
// John Ruskin → always particles
// etc.
```
✅ **Pros**: Combines consistency with variety, unique persona "voice"
❌ **Cons**: Requires mapping persona → form

**Recommendation**: **Option C - Random Per-Persona**
- Each persona gets a signature visualization form
- Reinforces persona identity
- Consistent on revisit
- Encourages comparison (comparing personas = comparing visualization forms)

---

#### Requirement: Concentric Circles Visualization
**ID**: `concentric-circles-viz`
**Priority**: P1 (High)

**Description**: Nested circles where each ring represents one RPAIT dimension.

**Visual Structure**:
```
        R (Representation)
      ╱─────────────────╲
     │  ┌─────────────┐  │
     │  │ P (Phil)    │  │  8/10 (80% filled)
     │  │ ╱──────────╲│  │
     │  ││ ┌────────┐││  │
     │  ││ │A. 95/10│││  │  ← Innermost: Aesthetic
     │  ││ └────────┘││  │
     │  │ ╲──────────╱│  │
     │  │  └─────────┘   │
     │  └─────────────────┘
     └─────────────────────┘
```

**Data Mapping**:
- Ring position (outermost to innermost): R, P, A, I, T
- Ring fill percentage = score / 10 * 100%
- Ring color = persona signature color (from data.personas)
- Ring border = grayscale (unfilled portion)

**Animation**:
- Draw each ring sequentially (200ms per ring, staggered)
- Total animation: 1s
- Easing: ease-out (snappy, feels responsive)

---

#### Requirement: Particle Flow Visualization
**ID**: `particle-flow-viz`
**Priority**: P1 (High)

**Description**: Canvas-based animated particles representing RPAIT dimensions.

**Behavior**:
- ~200-300 particles per visualization
- Each particle "belongs" to a dimension (5 colors)
- Particles move in patterns influenced by score values
- High scores: particles move outward/spread
- Low scores: particles cluster inward
- Color gradient: cool (low score) → warm (high score)
- Movement feels organic, wave-like

---

#### Requirement: Color Temperature Heat Map
**ID**: `heatmap-viz`
**Priority**: P1 (High)

**Description**: Gradient visualization showing temperature/intensity of RPAIT dimensions.

**Layout**:
```
Dimension  Score Distribution (0 → 10)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
R ▓▓▓▓▓▓▓░░ (7/10)   Blue ← Medium → Orange
P ▓▓▓▓▓▓▓▓▓▓ (10/10)  [Gradient]
A ▓▓▓▓▓▓░░░ (6/10)
I ▓░░░░░░░░ (1/10)    Darker = Higher
T ▓▓▓▓░░░░░ (4/10)    Lighter = Lower
```

**Color Mapping**:
- 0 points: #1E40AF (deep blue, cool)
- 5 points: #FBBF24 (warm gold, neutral)
- 10 points: #F97316 (burnt orange, hot)

---

#### Requirement: Geometric Pentagon Visualization
**ID**: `pentagon-viz`
**Priority**: P1 (High)

**Description**: SVG-based pentagon with 5 points, one per dimension.

**Geometry**:
- Pentagon centered, 200px radius baseline
- Each point represents one dimension (R, P, A, I, T)
- Point distance from center = score × 20px (max 10 × 20 = 200px)
- Point color = persona color
- Pentagon fill = semi-transparent persona color
- Pentagon outline = solid persona color

**Interaction**:
- Hover dimension name → highlight that point
- Can morph between two pentagons (comparison mode)
- Rotation optional (4-8 second slow rotation for visual interest)

---

#### Requirement: Data Accuracy Validation
**ID**: `data-accuracy-validation`
**Priority**: P0 (Critical)

**Description**: All visualization forms must represent the same data with high fidelity.

**Validation Criteria**:
- Score deviation: ±0.1% (5/10 must display as 5.0 ± 0.005 conceptually)
- All forms display same 5 dimensions (no missing dimensions)
- All forms use same color mapping (same persona color = same data)
- Sum check: Verify data hasn't been normalized/transformed

**Test Cases**:
```javascript
// Test data: { R: 7, P: 9, A: 8, I: 8, T: 6 }

test('All forms display same scores', () => {
  const radarScores = getRadarScores();
  const circleScores = getCircleScores();
  const particleScores = getParticleScores();

  expect(radarScores).toEqual(circleScores);
  expect(circleScores).toEqual(particleScores);
});
```

---

### MODIFIED Requirements

#### Requirement: Chart.js Radar to Multiple Forms
**ID**: `chart-migration`
**Priority**: P1 (High)

**Current State**: Chart.js radar charts for all visualizations
**Future State**: Multiple forms, Chart.js used for some (radar, potentially heatmap)
**Migration Strategy**:
1. Keep Chart.js for backward compatibility (radar form)
2. Create new modules for other forms (canvas, SVG)
3. Abstract visualization interface (common API for all forms)
4. Gradually migrate existing code to new system

---

## Success Criteria

✅ **Data Accuracy**
- All 6+ visualization forms tested with same data
- No score deviation >0.1%
- All 5 dimensions visible in all forms
- Color consistency across forms

✅ **Visual Performance**
- Animation reveals in 1-2 seconds
- 60fps animation on target devices
- Canvas-based viz use < 30MB memory
- SVG-based viz render in <100ms

✅ **Aesthetic Quality**
- Forms feel artistic, not purely functional
- Persona colors are clearly visible
- No form is objectively "better" (invites preference)
- Overall visual cohesion maintained

✅ **User Experience**
- Visualizations are intuitive (users understand scores without legend)
- Comparison between forms reveals artistic intent
- No confusion about what dimensions are shown
- Accessibility: all forms include numeric data fallback

---

## Accessibility Considerations

- All forms include numeric score display fallback
- High contrast between form elements and background
- No animation-only communication (always paired with text)
- Screen reader announces: "RPAIT Visualization: R 7, P 9, A 8, I 8, T 6"

---

## Testing Strategy

**Validation Checklist**:
- [ ] All 6+ forms render correctly
- [ ] Score data accurate ±0.1%
- [ ] Animation smooth (60fps)
- [ ] Colors match persona color scheme
- [ ] Responsive (adapts to mobile/desktop)
- [ ] Fallback for unsupported browsers (canvas fallback, SVG fallback)
- [ ] Performance profile (<2MB per form, <100ms render)

---

**End of Artistic Visualization Specification**
