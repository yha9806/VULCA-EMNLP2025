# Advanced Features Design Document

---

## 1. Layer 2 Physics Engine Design

### 1.1 Architecture

```javascript
class Layer2PhysicsEngine {
  // Core responsibilities:
  // 1. Track cursor position
  // 2. Calculate attraction forces
  // 3. Generate wind fields (Perlin noise)
  // 4. Apply boids behavior
  // 5. Update velocities and positions
  // 6. Manage particle trails
}
```

### 1.2 Core Physics Model

#### Attraction Force (Cursor-Particle)
```
Force = (G × mass₁ × mass₂) / distance²

Where:
- G = gravitational constant (tuned for feel)
- Effective range: 0-300px
- Falloff: smooth (no hard cutoff)
- Direction: toward cursor
```

#### Wind Field (Perlin Noise)
```
For each particle at (x, y, time):
  windX = Perlin(x/scale, y/scale, time) × strength
  windY = Perlin(x/scale, y/scale, time+offset) × strength

This creates flowing, organic patterns
```

#### Boids Flocking (Optional Advanced)
```
Three forces per particle:
1. Separation: avoid crowding neighbors
2. Alignment: steer toward average heading
3. Cohesion: steer toward center of neighbors

Weight each force and combine
```

#### Velocity Damping
```
velocity *= 0.98  // per frame

Creates natural deceleration, prevents runaway particles
```

### 1.3 Implementation Strategy

**Step 1: Basic Cursor Tracking**
```javascript
mouseMoveListener.on('pointermove', (x, y) => {
  engine.setCursorPosition(x, y);
  // Each particle sees cursor and calculates attraction
});
```

**Step 2: Attraction Force**
```javascript
for (particle of particles) {
  dx = cursorX - particle.x;
  dy = cursorY - particle.y;
  dist = sqrt(dx² + dy²);

  if (dist < maxRange) {
    force = G / (dist + 1)² // +1 to avoid division by zero
    particle.vx += (dx / dist) * force;
    particle.vy += (dy / dist) * force;
  }
}
```

**Step 3: Wind Field**
```javascript
for (particle of particles) {
  windX = perlin(particle.x/scale, particle.y/scale, time);
  windY = perlin(particle.x/scale, particle.y/scale, time+offset);

  particle.vx += windX * windStrength;
  particle.vy += windY * windStrength;
}
```

**Step 4: Trails**
```javascript
class ParticleTrail {
  positions = []  // Keep last N positions
  maxLength = 10  // Trail length

  update(particle) {
    positions.push({x: particle.x, y: particle.y});
    if (positions.length > maxLength) positions.shift();
  }

  render() {
    // Draw lines connecting trail points
    // Fade alpha from old to new
  }
}
```

### 1.4 Performance Optimization

| Optimization | Impact | Complexity |
|-------------|--------|-----------|
| **Spatial Hashing** | Only compute forces for nearby particles | Medium |
| **GPU Compute Shaders** | Move physics to GPU | High |
| **Adaptive Framerate** | Reduce updates when CPU overloaded | Low |
| **Instancing** | Batch render identical particles | Medium |

**Initial Target:** CPU-based for all 1920 particles at 24-30 FPS (acceptable)

---

## 2. RPAIT Visualization System Design

### 2.1 Data Structure

```typescript
interface RPAITVisualization {
  // Single artwork × persona view
  artworkId: string;
  personaId: string;

  dimensions: {
    Representation: { score: 0-10, description: string };
    Philosophy: { score: 0-10, description: string };
    Aesthetics: { score: 0-10, description: string };
    Interpretation: { score: 0-10, description: string };
    Technique: { score: 0-10, description: string };
  };

  // For comparison view
  comparisonWith?: {
    personaId: string;
    dimensionDifferences: { [key: string]: number };
  };
}
```

### 2.2 Visualization Types

#### Radar Chart (Primary)
```
         Representation
              |
    Philosophy - Aesthetics
              |
         Interpretation - Technique

Each dimension: 0-10 scale
Lines connect scores
Fill with semi-transparent color
```

**Library:** Chart.js + custom radar plugin

#### Comparison Heatmap
```
Personas    R    P    A    I    T
─────────────────────────────────
Su Shi     7    9    8    8    6
Guo Xi     8    7    9    7    8
Ruskin     6    8    8    9    5
Zola       7    6    7    8    6

Color intensity: darker = higher score
```

#### Dimension Scatter
```
X-axis: Philosophy
Y-axis: Aesthetics
Bubbles: Each persona
Size: Representation score
Color: Interpretation score
```

### 2.3 Interaction Model

```
User selects artwork + persona
    ↓
Show radar chart for that combination
    ↓
User clicks "Compare"
    ↓
Show 2-3 additional personas' radars
    ↓
User can toggle dimensions
    ↓
User can export data (JSON/CSV)
```

### 2.4 Implementation Steps

**Step 1: Data Aggregation**
```javascript
function generateRPAITVisualization(artworkId, personaId) {
  const critique = findCritique(artworkId, personaId);
  const scores = {
    R: critique.rpait.representation,
    P: critique.rpait.philosophy,
    A: critique.rpait.aesthetics,
    I: critique.rpait.interpretation,
    T: critique.rpait.technique
  };
  return scores;
}
```

**Step 2: Chart Rendering**
```javascript
const radarChart = new Chart(canvasElement, {
  type: 'radar',
  data: {
    labels: ['R', 'P', 'A', 'I', 'T'],
    datasets: [{
      label: personaName,
      data: [7, 9, 8, 8, 6],
      borderColor: personaColor,
      backgroundColor: personaColor + '33'
    }]
  }
});
```

**Step 3: Comparison View**
```javascript
function showComparison(personaIds) {
  const datasets = personaIds.map(pid => ({
    label: getPersonaName(pid),
    data: generateRPAITVisualization(artworkId, pid),
    ...chartConfig
  }));

  radarChart.data.datasets = datasets;
  radarChart.update();
}
```

### 2.5 Performance

- Chart rendering: <100ms (client-side)
- Data aggregation: <10ms
- Switching artworks: instant (no server calls)
- Mobile: Responsive design, touch-friendly

---

## 3. Content Interaction System Design

### 3.1 Search System

#### Data Indexing
```javascript
class CritiqueIndex {
  // Pre-compute searchable content at load time
  index = {
    byKeyword: Map<string, CritiqueId[]>,
    byPersona: Map<PersonaId, CritiqueId[]>,
    byArtwork: Map<ArtworkId, CritiqueId[]>,
    byDimension: Map<Dimension, CritiqueId[]>
  };

  search(query) {
    // Tokenize query
    // Look up in indexes
    // Return matching critiques
    // Rank by relevance
  }
}
```

#### Query Types
```
Natural queries:
- "Su Shi Aesthetics" → find critiques where persona=Su Shi AND dimension=Aesthetics
- "high technique score" → find critiques where technique ≥ 8
- "philosophy" → find all mentions of philosophy dimension
- "风" (wind) → search in critique text
```

#### Implementation
```javascript
// Client-side full-text search (lightweight)
// Use simple tokenization + rank by match count

searchCritiques(query) {
  const tokens = query.toLowerCase().split(/\s+/);
  const results = [];

  for (const critique of allCritiques) {
    let matchCount = 0;
    for (const token of tokens) {
      if (critique.text.includes(token)) matchCount++;
      if (critique.persona === token) matchCount++;
      if (critique.artwork === token) matchCount++;
    }
    if (matchCount > 0) {
      results.push({ critique, score: matchCount });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
```

### 3.2 Filtering System

```javascript
class CritiqueFilter {
  filters = {
    personas: [],      // Selected personas
    artworks: [],      // Selected artworks
    dimensions: [],    // Selected dimensions
    scoreRange: [0, 10] // Min-max score
  };

  apply(critiques) {
    return critiques.filter(c => {
      if (this.filters.personas.length && !this.filters.personas.includes(c.persona)) return false;
      if (this.filters.artworks.length && !this.filters.artworks.includes(c.artwork)) return false;
      if (this.filters.dimensions.length && !this.filters.dimensions.includes(c.dimension)) return false;
      // ... check score range
      return true;
    });
  }
}
```

### 3.3 Bookmarking System

```typescript
interface Bookmark {
  id: string;
  created: Date;
  critiques: {
    artworkId: string;
    personaId: string;
  }[];
  notes: string;
  tags: string[];
}

class BookmarkManager {
  // localStorage-backed
  bookmarks: Bookmark[] = JSON.parse(localStorage.getItem('vulca_bookmarks')) || [];

  add(critique) {
    const bookmark = { id: uuid(), created: now(), critiques: [critique] };
    this.bookmarks.push(bookmark);
    this.save();
  }

  save() {
    localStorage.setItem('vulca_bookmarks', JSON.stringify(this.bookmarks));
  }
}
```

### 3.4 Sharing System

```javascript
function generateShareLink(selections) {
  const state = {
    artworks: selectedArtworks,
    personas: selectedPersonas,
    dimensions: selectedDimensions
  };

  const encoded = btoa(JSON.stringify(state)); // Base64 encode
  const shareUrl = `${baseUrl}?view=${encoded}`;

  return shareUrl;
}

// Load shared state on page load
function loadShareLink() {
  const params = new URLSearchParams(location.search);
  const encoded = params.get('view');

  if (encoded) {
    const state = JSON.parse(atob(encoded));
    applyFilters(state);
  }
}
```

### 3.5 Comparison View Design

```html
<!-- Side-by-side layout -->
<div class="comparison-container">
  <div class="critique-card">
    <h3>Su Shi</h3>
    <div class="critique-text">...</div>
    <div class="rpait-scores">R:7 P:9 A:8 I:8 T:6</div>
  </div>

  <div class="comparison-info">
    <h4>Differences</h4>
    <table>
      <tr><td>Representation</td><td>7 vs 8</td><td>+1</td></tr>
      <!-- ... -->
    </table>
  </div>

  <div class="critique-card">
    <h3>Guo Xi</h3>
    <div class="critique-text">...</div>
    <div class="rpait-scores">R:8 P:7 A:9 I:7 T:8</div>
  </div>
</div>
```

---

## 4. Integration Points

### With Existing Layer 1+3
```
Existing Particle System
    ↓
Layer 2 Physics Engine (NEW)
adds interactive cursor-driven motion
    ↓
RPAIT Visualization (NEW)
shows why particles behave this way
    ↓
Content Interaction (NEW)
helps users understand and share findings
```

### UI Layout
```
┌─────────────────────────────────────────┐
│ Header (Title + Navigation)              │
├──────────────────┬──────────────────────┤
│  Left Sidebar    │  Main Canvas         │
│  (Search/Filter) │  (Particles)         │
│                  │                      │
│  Search Box      │  ┌────────────────┐  │
│  Filters         │  │   Particle     │  │
│  Bookmarks       │  │   System +     │  │
│                  │  │   Cursor Trail │  │
├──────────────────┼──────────────────────┤
│ Bottom Panel     │ RPAIT Radar Chart    │
│ (Comparison)     │ (Right Panel)        │
└─────────────────────────────────────────┘
```

---

## 5. Trade-offs & Decisions

| Decision | Option A | Option B | Choice | Reason |
|----------|----------|----------|--------|--------|
| Physics Engine | GPU Shaders | CPU JS | CPU JS | Simpler, faster to implement |
| Chart Library | Chart.js | D3.js | Chart.js | Lighter, easier to customize |
| Storage | localStorage | Backend DB | localStorage | No server needed, simpler |
| Search | Client-side | Server-side | Client-side | Instant, works offline |

---

## 6. Testing Strategy

### Layer 2 Physics
- Unit tests: Force calculation accuracy
- Integration tests: Physics + rendering together
- Performance tests: 1920 particles, cursor tracking, FPS monitoring
- Visual tests: Motion feels natural, not jerky

### RPAIT Visualization
- Unit tests: Chart data transformation
- Comparison tests: Radar charts render correctly
- Accessibility tests: Charts have alt text
- Responsiveness tests: Mobile, tablet, desktop

### Content Interaction
- Search tests: Find correct critiques
- Filter tests: Combinations work correctly
- Bookmark tests: Persist across sessions
- Share tests: Links reconstruct state accurately

---

## 7. Future Enhancements

### Phase 5+ Potential
- GPU compute shaders for physics (60fps target)
- Advanced boids flocking
- Particle system presets (by RPAIT dimension)
- Custom color schemes
- Multi-language support
- Backend API for persistent bookmarks

