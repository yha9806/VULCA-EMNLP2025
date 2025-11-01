# Design: Immersive Auto-Play Gallery with Detailed Content Pages

## Overview

This document details the architectural reasoning behind the three integrated capabilities for the VULCA immersive exhibition redesign. It addresses implementation tradeoffs, constraints, and decisions made based on user feedback and technical requirements.

---

## 1. Anti-Scroll Implementation Strategy

### Problem Context

The previous implementation disabled scrolling aggressively across the entire site, causing two critical issues:
1. **Detail pages became unusable** - Users couldn't navigate content they needed to read
2. **User feedback**: "You only disabled scrolling but didn't provide useful practical solutions"

### Proposed Solution: Scoped Anti-Scroll (Main Page Only)

**Architecture Decision**: Implement scroll prevention ONLY on the immersive gallery (index.html), while allowing full scroll functionality on detail pages (/pages/*.html).

#### Implementation Approach

```
Main Gallery (index.html)
  ├── Scroll Prevention: ENABLED
  │   ├── wheel events → preventDefault()
  │   ├── keyboard (Space, Arrow, Page Down) → preventDefault()
  │   └── touch scrolling → preventDefault()
  ├── Behavior: Full-screen immersive with no scroll distractions
  └── Transition: Navigation to detail pages via menu removes scroll block

Detail Pages (/pages/critics.html, /pages/about.html, /pages/process.html)
  ├── Scroll Prevention: DISABLED
  ├── Behavior: Full scrollable content with readable text, images, lists
  └── Navigation: Hamburger menu always available to return to main
```

#### Multi-Vector Scroll Prevention

Prevent scrolling via:

1. **Mouse Wheel**: `wheel` event with `preventDefault()`
   - Works on: Firefox, Chrome, Safari, Edge
   - Handles: Trackpad, external mouse

2. **Keyboard Navigation**: Intercept specific keys
   - `Space`, `ArrowUp`, `ArrowDown`, `PageUp`, `PageDown`
   - Prevent default scroll behavior

3. **Touch Scrolling**: `touchmove` event
   - Essential for mobile/tablet immersive experience
   - Prevents swipe-scroll on touch devices

4. **CSS Overflow**: Set `body { overflow: hidden }` on main page
   - Backup mechanism for edge cases
   - Removes scrollbar from view

#### Why This Approach

- **Targeted**: Only affects main gallery where immersion is critical
- **User-Friendly**: Detail pages remain fully accessible and readable
- **Reversible**: Easy to enable/disable by changing active page
- **Progressive**: Can add subtle scroll hints ("use menu to navigate") without harsh restrictions

---

## 2. CSS Floating Layout vs Grid-Based Systems

### Problem Context

The exhibition needs:
- **Image dominance**: 70% of viewport width
- **Flexible panel positioning**: Not rigid rows/columns
- **Conversational aesthetic**: Floating, experimental, random-feeling
- **Responsive**: Mobile → Desktop without layout shift

### Design Decision: Absolute Positioning with Container-Based Scaling

**Why NOT Grid/Flexbox**: While modern CSS Grid/Flexbox are powerful, they enforce order and alignment. For a "conversational, experimental, floating random feeling," absolute positioning better captures the design intent.

#### Three-Zone Layout System

```
┌─────────────────────────────────────────────────────────────────┐
│                         Main Gallery Container (viewport)       │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────┐  ┌────────────────────┐  │
│  │                             │  │  Critique Panel 1  │  │
│  │                             │  │  (top-right)       │  │
│  │       Artwork Image         │  │  rgba(255,255,255) │  │
│  │       (70% width)           │  │  0.3 opacity       │  │
│  │       (position: relative)  │  │  backdrop-blur(8px)│  │
│  │                             │  │  floating-right    │  │
│  │                             │  └────────────────────┘  │
│  │                             │                          │
│  │                             │  ┌────────────────────┐  │
│  │                             │  │  Critique Panel 2  │  │
│  │                             │  │  (mid-right)       │  │
│  │                             │  │  absolute position │  │
│  └─────────────────────────────┘  └────────────────────┘  │
│                                                               │
│  ┌────────────────────┐                                     │
│  │  Visualization     │                                     │
│  │  (bottom-left)     │                                     │
│  │  RPAIT grid chart  │                                     │
│  └────────────────────┘                                     │
│                                                               │
└─────────────────────────────────────────────────────────────┐
```

#### CSS Architecture

**Base Container**:
```css
.gallery-container {
  position: relative;           /* Establish positioning context */
  width: 100%;
  height: 100vh;
  overflow: hidden;             /* Prevent scroll, clip floating panels */
  background: linear-gradient(135deg, #f5f5f5, #ffffff);
}
```

**Image (Primary Focus)**:
```css
.artwork-image {
  position: relative;           /* Part of normal flow, takes 70% width */
  width: 70%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  flex-shrink: 0;
}
```

**Floating Critique Panels**:
```css
.critique-panel {
  position: absolute;           /* Float independent of content */
  right: calc(30% + 2rem);      /* Float right, adjust for image width */
  top: 50%;
  transform: translateY(-50%);  /* Vertical center */
  width: 280px;
  max-height: 400px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
  border-left: 3px solid var(--color-persona);  /* Color coded per critic */
  padding: 1.5rem;
  border-radius: 0;             /* No rounded corners - sharp ghost UI */
  box-shadow: none;             /* No depth, no shadows */
}
```

**Visualization (Bottom-Left)**:
```css
.visualization-container {
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  width: 280px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(6px);
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);  /* RPAIT grid: R P / A I T */
  gap: 0.75rem;
}
```

#### Responsive Breakpoints

```
Mobile (375px - 767px):
  └─ Image: 100% width (full screen)
  └─ Panels: Stack vertically below image, position: static
  └─ Visualization: Below panels, position: static
  └─ Behavior: Vertical scrolling on detail pages ONLY

Tablet (768px - 1023px):
  └─ Image: 65% width
  └─ Panels: Absolute, right side, floating
  └─ Visualization: Absolute, bottom-left
  └─ Behavior: Dual-column feeling with floating accent

Desktop (1024px+):
  └─ Image: 70% width (design intent)
  └─ Panels: Absolute, right side, mid-screen
  └─ Visualization: Absolute, bottom-left corner
  └─ Behavior: Full floating experimental layout
```

#### Why Absolute Positioning

1. **Independence**: Panels don't affect image layout or flow
2. **Flexibility**: Easy to reposition for different artworks (top vs mid vs bottom)
3. **Experimental**: Matches "floating, random feeling" requirement
4. **Performance**: No reflow calculations for floating elements
5. **Responsive**: `right: calc(30% + 2rem)` scales with viewport

---

## 3. Data Sharing Between Main and Detail Pages

### Architecture: Central Data Object

**Principle**: Single source of truth - all pages reference the same data structure.

#### Data Structure

```javascript
window.VULCA_DATA = {
  artworks: [
    {
      id: "artwork_1",
      titleZh: "记忆（绘画操作单元：第二代）",
      titleEn: "Memory (Painting Operation Unit: Second Generation)",
      year: 2022,
      image: "/assets/artwork1.jpg",
      description: "A meditation on technological memory...",
      details: {
        size: "150cm × 100cm",
        medium: "Oil on canvas",
        context: "Created during residency at..."
      }
    },
    // ... more artworks (4 total)
  ],

  personas: [
    {
      id: "su-shi",
      nameZh: "苏轼",
      nameEn: "Su Shi",
      period: "北宋文人 (1037-1101)",
      bio: "Northern Song literati painter and poet...",
      rpait: { R: 7, P: 8, A: 8, I: 8, T: 6 },
      color: "#B85C3C"  // Used for panel color-coding
    },
    // ... more personas (6 total)
  ],

  critiques: [
    {
      artworkId: "artwork_1",
      personaId: "su-shi",
      text: "This work speaks to the contemporary...",
      remark: "Brief highlight quote"
    },
    // ... multiple critiques per artwork
  ]
}
```

#### Implementation Pattern

**Main Page** (`index.html`):
```javascript
// js/data.js loads first
// js/gallery-init.js calls window.VULCA_DATA

// js/autoplay.js cycles through:
const artwork = window.VULCA_DATA.artworks[index];
const critique = window.VULCA_DATA.critiques.find(c => c.artworkId === artwork.id);
const persona = window.VULCA_DATA.personas.find(p => p.id === critique.personaId);

// Display: artwork.image, persona.color, critique.text
```

**Detail Pages** (`/pages/critics.html`):
```javascript
// js/data.js loads first
// js/critics-page.js dynamically generates:

window.VULCA_DATA.personas.forEach(persona => {
  // Create profile card with:
  // - persona.color (background accent)
  // - persona.bio (full biography)
  // - persona.rpait (visual RPAIT grid)
});
```

#### Why This Approach

1. **Single Source**: No data duplication between pages
2. **Consistency**: Changes to persona info auto-reflect everywhere
3. **Maintainability**: Edit `js/data.js` once, all pages update
4. **Extensibility**: Easy to add new data fields (sizes, mediums, contexts)
5. **Performance**: Data loads once via single file, cached by browser

---

## 4. Responsive Breakpoint Strategy

### Philosophy: Mobile-First Progressive Enhancement

Start with mobile constraints, enhance for larger screens.

### Breakpoints

```javascript
// CSS Variables for consistency
:root {
  --breakpoint-sm: 375px;    /* Mobile phones */
  --breakpoint-md: 768px;    /* Tablets */
  --breakpoint-lg: 1024px;   /* Desktops */
  --breakpoint-xl: 1440px;   /* Large desktops */
  --breakpoint-2xl: 2560px;  /* Ultra-wide */
}
```

### Layout Transformations

#### Mobile (375px - 767px)

```css
/* Single column, vertical flow */
.gallery-container {
  flex-direction: column;
}

.artwork-image {
  width: 100%;
  height: 50vh;
  object-fit: cover;
}

.critique-panel {
  position: static;           /* Back to normal flow */
  width: 100%;
  margin: 1rem;
  transform: none;
}

.visualization-container {
  position: static;           /* Back to normal flow */
}
```

**Behavior**:
- Main page: Full-screen artwork at top, panels below
- Detail pages: Normal scrollable content
- Navigation: Hamburger menu always visible and accessible

#### Tablet (768px - 1023px)

```css
/* Transitional: image on left, floating panels on right */
.gallery-container {
  display: flex;
  gap: 1rem;
  padding: 1rem;
}

.artwork-image {
  width: 65%;
  height: 90vh;
}

.critique-panel {
  position: absolute;
  right: 2rem;
  width: 240px;
}
```

**Behavior**:
- Main page: Image takes 65%, panels float right
- Detail pages: Two-column layout where feasible
- Navigation: Menu works on both landscape/portrait

#### Desktop (1024px+)

```css
/* Full design intent: image 70%, panels floating */
.gallery-container {
  display: flex;
  align-items: center;
}

.artwork-image {
  width: 70%;
  height: 100vh;
}

.critique-panel {
  position: absolute;
  right: calc(30% + 2rem);
  top: 50%;
  width: 280px;
  max-height: 400px;
}

.visualization-container {
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  width: 280px;
}
```

**Behavior**:
- Main page: Full immersive floating experimental layout
- Detail pages: Wide single/multi-column content
- Navigation: Full menu with descriptive labels

### Responsive Image Handling

```css
/* Responsive image sizing */
.artwork-image {
  width: 100%;      /* Mobile: full width */
  height: auto;
  max-width: 100%;
  aspect-ratio: 4/3;  /* Maintain aspect, prevent CLS */
}

@media (min-width: 1024px) {
  .artwork-image {
    width: 70%;
    height: 100vh;
    aspect-ratio: auto;  /* Let image breathe on desktop */
  }
}
```

### Touch-Optimized Interactions

```javascript
// Mobile: Larger tap targets
@media (max-width: 767px) {
  .menu-button { min-width: 48px; min-height: 48px; }
  .critique-panel { min-height: 200px; }
}

// Desktop: Precise interactions
@media (min-width: 1024px) {
  .menu-button { min-width: 40px; min-height: 40px; }
  .critique-panel { min-height: 300px; }
}
```

---

## 5. Ghost UI Aesthetic Implementation

### Design Principle

Ghost UI = High transparency + Minimal borders + Blur backdrop

```css
.critique-panel {
  /* Transparency */
  background: rgba(255, 255, 255, 0.3);

  /* Minimal border */
  border-left: 3px solid var(--color-persona);
  border: 1px solid rgba(128, 128, 128, 0.1);

  /* Blur backdrop */
  backdrop-filter: blur(8px);

  /* No depth */
  box-shadow: none;
  border-radius: 0;

  /* Sharp edges for experimental feel */
  font-weight: 500;
  letter-spacing: 0.3px;
}
```

### Color Coding Per Critic

Each persona has a color that appears as:
- Panel left border: `border-left: 3px solid var(--color-persona)`
- Background tint: Subtle color overlay via `rgba(R, G, B, 0.05)`
- RPAIT grid accent: Chart colors match persona color

Example:
```javascript
{
  id: "su-shi",
  nameZh: "苏轼",
  color: "#B85C3C",  // Warm terracotta
  rpait: { R: 7, P: 8, A: 8, I: 8, T: 6 }
}
```

---

## 6. Auto-Play Timing Configuration

### Design Timing

```javascript
const AUTO_PLAY_CONFIG = {
  ARTWORK_APPEAR: 1200,    // Fade-in artwork (1.2s)
  CRITIQUE_DELAY: 500,     // Wait before critique appears
  CRITIQUE_APPEAR: 1200,   // Fade-in critique (1.2s)
  CRITIQUE_DISPLAY: 2000,  // Hold on screen (2.0s)
  CRITIQUE_DISAPPEAR: 800, // Fade-out (0.8s)
  VISUALIZATION_DISPLAY: 3000,  // RPAIT grid (3.0s)
  SECTION_DELAY: 500,      // Gap between artworks (0.5s)
};

// Per artwork: 1 artwork + 6 critiques
// Time = ARTWORK_APPEAR (1.2s) +
//        (CRITIQUE_DELAY + CRITIQUE_APPEAR + CRITIQUE_DISPLAY + CRITIQUE_DISAPPEAR) × 6 +
//        VISUALIZATION_DISPLAY (3.0s) +
//        SECTION_DELAY (0.5s)
// = 1.2 + (0.5 + 1.2 + 2.0 + 0.8) × 6 + 3.0 + 0.5
// = 1.2 + 4.5 × 6 + 3.0 + 0.5
// = 1.2 + 27 + 3.0 + 0.5
// = 31.7 seconds per artwork section
// = 4 artworks × 31.7s = ~2 minutes per full cycle
```

### Why These Values

- **1.2s artwork fade-in**: Enough time to perceive without feeling rushed
- **2.0s critique display**: Enough to read ~2-3 lines of text comfortably
- **3.0s visualization**: Enough to absorb RPAIT chart without overwhelming
- **~2 min full cycle**: Long enough for contemplation, short enough to loop smoothly

---

## 7. Implementation Phases & Validation

### Phase 1: Foundation (Main Page Immersive Experience)

**Deliverables**:
- Anti-scroll logic on main page only
- Auto-play controller cycling artworks
- Ghost UI styling for critique panels

**Validation**: User cannot scroll on main page; gallery cycles infinitely

### Phase 2: Content (Detail Pages)

**Deliverables**:
- `/pages/critics.html` - Dynamic persona cards
- `/pages/about.html` - Project vision & framework
- `/pages/process.html` - Creation documentation
- Data-driven generators using `window.VULCA_DATA`

**Validation**: Detail pages render all content; scroll works; no data errors

### Phase 3: Polish (Floating Layout & Navigation)

**Deliverables**:
- Absolute positioning for floating panels
- Responsive breakpoint refinement
- Hamburger menu navigation
- Menu links to detail pages

**Validation**: Floating layout matches design; menu works on all breakpoints

---

## 8. Risk Mitigation

### Risk: Scroll Prevention Blocks Legitimate Use (ADDRESSED)

**Previous Issue**: Aggressive scroll prevention made detail pages unusable

**Mitigation**:
- Scope scroll prevention to main page ONLY
- Use page-specific flag: `window.IMMERSIVE_MODE = true` on index.html
- Check flag before preventing scroll: `if (window.IMMERSIVE_MODE) { preventDefault() }`
- Detail pages set `window.IMMERSIVE_MODE = false`

### Risk: Floating Panels Overlap Content

**Mitigation**:
- Set `z-index` hierarchy clearly
- Use `@media` queries to switch to static layout on mobile
- Ensure text never gets hidden behind transparent panels

### Risk: Performance Degradation from Backdrop-Filter

**Mitigation**:
- Use `will-change: transform` on animated elements only
- Limit blur to non-animated elements
- Test on mid-range devices (iPhone 8, Galaxy S10)

---

## Conclusion

This design balances the three user requirements:
1. **Anti-scroll**: Implemented only where needed, allowing full content access elsewhere
2. **Content richness**: Multi-page system with dynamic generators
3. **Flexible layout**: Absolute positioning with responsive fallbacks

The approach is incremental (3 phases), testable (each phase validates independently), and data-driven (single source of truth).
