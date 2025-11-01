# Layer 2 Physics Engine - Specification

**Capability:** Cursor-driven interactive particle physics with wind fields and trails

---

## ADDED Requirements

### R1: Cursor Position Tracking
The system SHALL continuously track the cursor position within the exhibition canvas.

#### Scenario: Cursor enters canvas
```gherkin
Given the exhibition is displayed
When the user moves cursor over the canvas
Then the cursor position is updated every frame
And position is accessible to particle systems
```

**Acceptance Criteria:**
- `getCursorPosition()` returns `{x, y}` in pixels
- Updates ≥30 times per second
- Works with both mouse and touch events
- Returns null when cursor outside canvas

---

### R2: Attraction Force Calculation
Particles SHALL be attracted to the cursor using inverse-square-law physics.

#### Scenario: Particle attracted to cursor
```gherkin
Given particles are positioned randomly on canvas
When cursor is at (500, 300)
Then particles within 300px distance calculate attraction force
And force is proportional to 1/(distance²)
And particles accelerate toward cursor
```

**Acceptance Criteria:**
- Distance calculation is Euclidean: `sqrt(dx² + dy²)`
- Force = `G / (distance + 1)²` where G is tunable (default: 5000)
- Effective range: 0-300px (falloff outside)
- Force applied: `particle.velocity += normalizedDirection × force`
- No infinite forces (distance+1 prevents division by zero)

**Tunable Parameters:**
```javascript
CURSOR_ATTRACTION_STRENGTH = 5000;    // G constant
CURSOR_ATTRACTION_RANGE = 300;        // Max distance
CURSOR_ATTRACTION_ENABLED = true;     // Feature toggle
```

---

### R3: Wind Field Generation
The system SHALL generate animated wind fields using Perlin noise.

#### Scenario: Wind field animated
```gherkin
Given time is advancing
When physics engine runs
Then Perlin noise generates (windX, windY) forces
And wind direction/magnitude changes smoothly
And particles follow wind patterns
```

**Acceptance Criteria:**
- For each particle at (x, y, t):
  - `windX = Perlin(x/scale, y/scale, t) × strength`
  - `windY = Perlin(x/scale, y/scale, t+1000) × strength`
- Wind is continuous (no jumpsdirection)
- Speed control: `t += TIME_DELTA × windSpeed`
- Visible patterns emerge (swirls, flows)

**Tunable Parameters:**
```javascript
WIND_SCALE = 100;           // Zoom level of noise
WIND_STRENGTH = 0.5;        // Force magnitude
WIND_SPEED = 1.0;           // Animation speed (t progression)
```

---

### R4: Velocity Damping
Particles SHALL decelerate naturally to prevent runaway motion.

#### Scenario: Particle slows without external force
```gherkin
Given particle has velocity (vx, vy)
When no attraction or wind force applied
Then velocity decreases smoothly each frame
And particle eventually stops
```

**Acceptance Criteria:**
- Each frame: `velocity *= damping_coefficient` (default: 0.98)
- Exponential decay: `v(t) = v₀ × (damping)^t`
- Particle comes to rest, doesn't oscillate
- Adjustable: `PARTICLE_DAMPING = 0.95 to 0.99`

---

### R5: Particle Trail Rendering
Particles SHALL leave visual trails as they move.

#### Scenario: Dragging cursor creates visible trail
```gherkin
Given user moves cursor rapidly
When particles follow wind/attraction forces
Then trail line is drawn behind each particle
And trail fades (alpha decreases) from old to new positions
```

**Acceptance Criteria:**
- Trail stores last N positions (10-20 positions per particle)
- Trail lines drawn each frame
- Alpha gradient: `alpha = 1 - (position_index / trail_length)`
- Trail color matches particle color
- Optional toggle: `PARTICLE_TRAILS_ENABLED = true`

---

### R6: Physics Update Cycle
The physics engine SHALL update all particles consistently each frame.

#### Scenario: 1920 particles update smoothly
```gherkin
Given 1920 particles in scene
When render loop runs at ≥24 FPS
Then all particles update position using:
  1. Apply attraction force toward cursor
  2. Apply wind field forces
  3. Apply velocity damping
  4. Update position: x += vx, y += vy
  5. Clamp to canvas bounds
```

**Acceptance Criteria:**
- Update order is deterministic
- No particles escape canvas
- All 1920 update each frame
- FPS ≥20 on target hardware

---

## MODIFIED Requirements

### R7: ParticleSystem - Add Physics Properties
The ParticleSystem class SHALL include physics state variables.

**New Properties:**
```javascript
class Particle {
  // ... existing properties
  vx: number = 0;           // Velocity X
  vy: number = 0;           // Velocity Y
  trailPositions: Position[] = [];  // History for trails
}
```

---

### R8: InteractionManager - Cursor Position
The InteractionManager SHALL track and expose cursor position.

**New Methods:**
```javascript
getCursorPosition(): { x: number, y: number };
onCursorMove(callback: (x, y) => void): void;
```

---

## Performance Requirements

**R9: Physics Performance**
- 1920 particles updating
- Cursor tracking ≥30 Hz
- Target FPS: ≥20 (acceptable), ≥24 (desired)
- Memory: <10MB for physics state
- GPU acceleration: Optional (CPU sufficient for MVP)

---

## Testing Requirements

**R10: Physics Unit Tests**
```javascript
test('attraction force decreases with distance squared', () => {
  const force1 = calculateAttraction(100);
  const force2 = calculateAttraction(200);
  expect(force1).toBeCloseTo(4 * force2, 1);
});

test('wind field produces continuous values', () => {
  const wind1 = generateWind(0, 0, 0);
  const wind2 = generateWind(0, 0, 0.016);
  expect(distance(wind1, wind2)).toBeLessThan(0.1);
});

test('damping exponentially reduces velocity', () => {
  let v = 10;
  v *= 0.98;
  v *= 0.98;
  expect(v).toBeCloseTo(9.6, 1);
});
```

**R11: Integration Tests**
```javascript
test('cursor attraction + wind + damping together', () => {
  const particle = createParticle(250, 250);
  const cursor = { x: 200, y: 200 };  // 50px away

  // Apply one frame of physics
  applyAttraction(particle, cursor);
  applyWind(particle, time);
  applyDamping(particle);
  updatePosition(particle);

  // Particle should move toward cursor slightly
  expect(particle.x).toBeLessThan(250);
  expect(particle.y).toBeLessThan(250);
});
```

