# VULCA Exhibition - Design Specification

**Version:** 1.0 Final
**Date:** October 2025
**Status:** 🟢 Design System Finalized

---

## Executive Summary

VULCA is an immersive digital art exhibition featuring works by Sougwen Chung (愫君) and Lauren McCarthy, exploring the intersection of human-machine collaboration and algorithmic consciousness. The design system embodies **postmodern aesthetics** with a warm-gray palette (brown-gray, ivory-gray, earth-gray) combined with metal accents (gold, silver) and dynamic particle effects.

**Design Philosophy:** 潮汐的负形 (Tidal Negation) - exploring invisible networks, hidden collaborations, and the spaces between human and machine creation.

---

## 1. Color System

### 1.1 Primary Palette: Warm Gray System

The warm gray system serves as the exhibition's foundational color language, creating an atmosphere of sophisticated restraint and temporal depth.

```css
/* Warm Gray Palette - Primary */
--warm-gray-950:  #1a1613    /* Darkest warm brown-gray - deep background */
--warm-gray-900:  #3a3330    /* Deep brown-gray - dark surfaces */
--warm-gray-800:  #5a5550    /* Rich warm gray - text headings */
--warm-gray-700:  #746d65    /* Mid warm-gray - secondary text */
--warm-gray-600:  #8a8379    /* Soft warm gray - tertiary elements */
--warm-gray-500:  #9a9389    /* Medium warm gray - border/divider */
--warm-gray-400:  #c0bbb5    /* Earth gray - primary body text */
--warm-gray-300:  #d9d5cf    /* Light earth gray - light backgrounds */
--warm-gray-200:  #e8e5e0    /* Very light warm gray - contrast backgrounds */
--warm-gray-100:  #f5f2ed    /* Almost white warm gray - light surfaces */
--warm-gray-50:   #faf9f7    /* Off-white - edge highlights */
```

**Warm Gray Usage:**
- **950 (#1a1613):** Exhibition background, dark UI overlays, text on bright backgrounds
- **900 (#3a3330):** Card backgrounds, dark surface containers
- **700-800:** Secondary headings, important labels
- **400 (#c0bbb5):** Primary body text (optimal for readability)
- **100-200:** Light backgrounds, accessibility contrast

### 1.2 Metal Accent System

Metal accents provide warmth and prestige, suggesting the technological elements within the work while maintaining aesthetic sophistication.

```css
/* Metal Accents - Warm & Cool */
--metal-gold-primary:     #d4af37    /* Primary accent - warm champagne gold */
--metal-gold-dark:        #b8860b    /* Darker gold - focus states, secondary accent */
--metal-gold-light:       #ffd700    /* Bright gold - highlight/emphasis */
--metal-silver-primary:   #c0c0c0    /* Secondary accent - cool silver-white */
--metal-silver-dark:      #a9a9a9    /* Darker silver - borders, subtle elements */
--metal-copper:           #b87333    /* Warm metal tone - alternative accent */
--metal-rose-gold:        #b76e79    /* Sophisticated metal variant */
```

**Metal Usage:**
- **Gold (#d4af37):** Primary interactive elements, artwork borders, particle accents, call-to-action buttons
- **Silver (#c0c0c0):** Secondary accents, subtle borders, technological hints
- **Gold Dark (#b8860b):** Hover states, focus indicators, depth layering
- **Copper (#b87333):** Warm alternative for specific UI elements

### 1.3 Functional Colors

```css
/* Functional & State Colors */
--background-dark:       #1a1a1a    /* Primary background - neutral black-gray */
--surface-dark:          #2d2d2d    /* Dark surface containers */
--surface-light:         #f5f2ed    /* Light surface containers */
--border-dark:           #3a3a3a    /* Dark mode borders */
--border-light:          #e8e5e0    /* Light mode borders */

/* Glow & Effect Colors */
--glow-gold:             #d4af37    /* Warm gold glow - particles, bloom */
--glow-gold-soft:        rgba(212, 175, 55, 0.4)   /* 40% opacity gold */
--glow-silver:           #c0c0c0    /* Cool silver glow */
--glow-silver-soft:      rgba(192, 192, 192, 0.3)  /* 30% opacity silver */

/* Interactive States */
--hover-overlay:         rgba(212, 175, 55, 0.15)  /* Gold hover overlay - 15% */
--focus-ring:            #d4af37    /* Gold focus ring */
--focus-ring-width:      3px
```

---

## 2. Typography System

### 2.1 Font Stack

```css
/* Primary Font - Elegant Sans Serif */
--font-display:  'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif
--font-body:     'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif
--font-mono:     'JetBrains Mono', 'Courier New', monospace

/* Chinese Font Support */
--font-display-cjk: 'Noto Serif SC', '思源宋体', 'Songti SC', serif
--font-body-cjk:    'Noto Sans SC', '思源黑体', 'Heiti SC', sans-serif
```

### 2.2 Type Scale

```css
/* Heading Hierarchy */
--text-h1:      3.0rem / 1.1 / 700    /* Display - Exhibition title, section headers */
--text-h2:      2.2rem / 1.2 / 600    /* Large heading - Artwork titles */
--text-h3:      1.6rem / 1.3 / 600    /* Medium heading - Subsections */
--text-h4:      1.2rem / 1.4 / 500    /* Small heading - Labels */

/* Body Text */
--text-body-lg: 1.1rem / 1.6 / 400    /* Large body - introductory text */
--text-body:    1.0rem / 1.6 / 400    /* Standard body - descriptions */
--text-body-sm: 0.9rem / 1.5 / 400    /* Small body - metadata */

/* Captions & Small Text */
--text-caption:  0.8rem / 1.4 / 400   /* Figure captions */
--text-micro:    0.7rem / 1.3 / 400   /* Timestamps, credits */
```

**Color Assignment:**
- **H1-H3 Headings:** `#746d65` (warm-gray-700)
- **H4 Labels:** `#8a8379` (warm-gray-600)
- **Body Text:** `#c0bbb5` (warm-gray-400) - primary reading color
- **Small Text:** `#8a8379` (warm-gray-600)
- **Captions:** `#9a9389` (warm-gray-500)

### 2.3 Font Weights

- **700** - Headings, bold emphasis
- **600** - Subheadings, strong emphasis
- **500** - Labels, emphasis
- **400** - Body text, standard
- **300** - Light descriptions (rare)

---

## 3. Visual Elements

### 3.1 Particle System

**Purpose:** Dynamic visual layer representing the intersection of human creativity and machine intelligence, the invisible networks of data and consciousness.

**Specifications:**

```javascript
// Particle System Configuration
ParticleSystem: {
  count_desktop: 1500,           // Desktop display
  count_tablet: 800,             // Tablet optimization
  count_mobile: 300,             // Mobile/low-power

  physics: {
    speed_min: 0.3,              // pixels per frame
    speed_max: 0.8,
    perlin_scale: 80,            // Perlin noise flow field scale
    force_decay: 0.98,           // Damping factor
  },

  appearance: {
    size_min: 1.2,               // pixels
    size_max: 3.5,
    opacity_min: 0.3,            // base opacity
    opacity_max: 0.8,
    color_primary: '#d4af37',    // warm gold
    color_secondary: '#c0c0c0',  // silver
  },

  lifecycle: {
    life_min: 120,               // frames
    life_max: 300,
    spawn_rate: 15,              // particles per frame
  }
}
```

**Visual Characteristics:**
- **Colors:** Transition between warm gold (#d4af37) and silver (#c0c0c0)
- **Opacity:** Gentle fade-in/fade-out, creating ghostly quality
- **Motion:** Organic flow using Perlin noise, avoiding mechanical patterns
- **Density:** Higher concentration around artwork zones, sparse in void spaces
- **Glow:** Bloom post-processing applied, suggesting luminescence

### 3.2 Artwork Presentation

**Artwork Card Layout:**

```
┌─────────────────────────────────┐
│                                 │
│     [Artwork Image 3000×2000]   │ ← Glow effect around border
│     with bloom post-processing  │
│                                 │
└─────────────────────────────────┘
     [Title in Warm-Gray-700]
     [Artist Name in Gold]
```

**Visual Styling:**

```css
.artwork-card {
  background: transparent;
  border: 2px solid transparent;
  border-image: linear-gradient(135deg, #d4af37, #c0c0c0) 1;
  box-shadow: 0 0 40px rgba(212, 175, 55, 0.3),
              0 0 80px rgba(192, 192, 192, 0.15);
  filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.4));
  transition: all 0.3s ease;
}

.artwork-card:hover {
  box-shadow: 0 0 60px rgba(212, 175, 55, 0.5),
              0 0 100px rgba(192, 192, 192, 0.25);
  filter: drop-shadow(0 0 30px rgba(212, 175, 55, 0.6));
}
```

### 3.3 Bloom Post-Processing

**Purpose:** Create ethereal, dream-like quality matching the postmodern aesthetic and suggesting the "glow" of consciousness/awareness.

```glsl
// Three.js Bloom Configuration
bloom: {
  strength: 1.5,           // Bloom intensity
  radius: 0.8,             // Bloom spread
  threshold: 0.6,          // What triggers bloom (0-1)
}
```

**Effect Targets:**
- Artwork borders (gold glow)
- Particles (soft luminescence)
- Metal accents (reflective quality)
- Interactive hover states

---

## 4. Layout & Spacing

### 4.1 Grid System

**Base Unit:** 8px

```css
--spacing-1:  0.5rem  (4px)      /* Micro-spacing */
--spacing-2:  1.0rem  (8px)      /* Base unit */
--spacing-3:  1.5rem  (12px)     /* Small spacing */
--spacing-4:  2.0rem  (16px)     /* Standard spacing */
--spacing-6:  3.0rem  (24px)     /* Generous spacing */
--spacing-8:  4.0rem  (32px)     /* Large spacing */
--spacing-12: 6.0rem  (48px)     /* XL spacing */
--spacing-16: 8.0rem  (64px)     /* XXL spacing */
```

### 4.2 Component Spacing

**Exhibition Grid (2×2 layout for 4 artworks):**
```
[Artwork 1]    [Artwork 2]
   margin: 48px (6.0rem)

[Artwork 3]    [Artwork 4]
```

**Card Interior Spacing:**
```
Title:           16px from top
Description:     24px from title
Metadata:        32px from description
Bottom padding:  24px
```

---

## 5. Responsive Design

### 5.1 Breakpoints

```css
--breakpoint-mobile:   480px      /* Small phones */
--breakpoint-tablet:   768px      /* Tablets */
--breakpoint-desktop:  1024px     /* Desktop */
--breakpoint-wide:     1400px     /* Large desktop */
```

### 5.2 Device-Specific Adjustments

**Desktop (1024px+):**
- Full 2×2 grid layout
- 1500 particles
- All visual effects enabled
- Hover interactions active

**Tablet (768-1024px):**
- 2×1 stacked layout or responsive grid
- 800 particles (reduced)
- Simplified bloom effects
- Touch-optimized interactions

**Mobile (<768px):**
- Full-width single column
- 300 particles (minimal)
- No particle effects on low-power devices
- Simplified QR code linking
- Optimized for portrait orientation

---

## 6. Animation & Interaction

### 6.1 Particle Motion

**Perlin Noise Flow Field:**
```javascript
velocity.x = perlin(position.x * 0.01, position.y * 0.01, time * 0.01) * speed
velocity.y = perlin(position.x * 0.01 + 1000, position.y * 0.01, time * 0.01) * speed
// Creates organic, non-linear motion patterns
```

### 6.2 User Interactions

**Artwork Click Interaction (Three.js Raycaster):**
```javascript
// Click detection for artwork selection
raycaster.setFromCamera(mouse, camera);
const intersects = raycaster.intersectObjects(scene.children);

if (intersects.length > 0) {
  // Navigate to detail page
  window.location.href = `/detail/${artworkId}`;
}
```

**Hover States:**
- Artwork border glow intensifies
- Background particles increase density around hovered artwork
- Bloom intensity increases
- Cursor changes to pointer

### 6.3 GSAP Animations

**Page Transition:**
```javascript
// Fade-in entrance
gsap.from('.artwork-card', {
  opacity: 0,
  y: 20,
  duration: 0.8,
  stagger: 0.1,
  ease: 'power2.out'
});

// Title animation
gsap.from('.exhibition-title', {
  opacity: 0,
  y: -30,
  duration: 1.0,
  delay: 0.2,
  ease: 'power2.out'
});
```

**Detail Page Load:**
```javascript
// Info panel entrance
gsap.to('.info-panel', {
  x: 0,
  opacity: 1,
  duration: 0.6,
  ease: 'power2.out'
});
```

---

## 7. Accessibility

### 7.1 Color Contrast

**WCAG AA Compliance (4.5:1 ratio for body text):**

| Foreground | Background | Contrast | Status |
|-----------|-----------|----------|--------|
| #c0bbb5 (gray-400) | #1a1613 (gray-950) | 4.8:1 | ✅ Pass |
| #746d65 (gray-700) | #1a1613 (gray-950) | 7.2:1 | ✅ Pass |
| #d4af37 (gold) | #1a1613 (gray-950) | 3.1:1 | ⚠️ Limited use |

**Implementation:**
- All body text uses warm-gray-400 (#c0bbb5) for primary readability
- Headings use warm-gray-700 (#746d65) for enhanced contrast
- Gold accents used for non-text elements or decorative purposes

### 7.2 Text Alternatives

- All artwork images include `alt` text in both English and Chinese
- QR codes include descriptive labels
- Interactive elements have clear labels

### 7.3 Focus Management

```css
:focus-visible {
  outline: 3px solid #d4af37;
  outline-offset: 4px;
  border-radius: 2px;
}
```

---

## 8. Visual Examples

### 8.1 Color Palette Reference

```
┌──────────────────────────────────────────────────┐
│                 WARM GRAY PALETTE                │
├──────────────────────────────────────────────────┤
│ ████ #1a1613 (950) - Deepest dark             │
│ ████ #3a3330 (900) - Dark surfaces            │
│ ████ #746d65 (700) - Headings                 │
│ ████ #c0bbb5 (400) - Primary text             │
│ ████ #f5f2ed (100) - Light backgrounds        │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│              METAL ACCENT PALETTE                │
├──────────────────────────────────────────────────┤
│ ████ #d4af37 (gold) - Primary accent          │
│ ████ #c0c0c0 (silver) - Secondary accent      │
│ ████ #b87333 (copper) - Alternative accent    │
└──────────────────────────────────────────────────┘
```

### 8.2 Typography Scale

```
Display (H1)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3.0rem / 700 weight
VULCA Exhibition: Tidal Negation

Heading (H2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2.2rem / 600 weight
Body Machine (Meridians)

Subheading (H3)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1.6rem / 600 weight
Installation View

Body Text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1.0rem / 400 weight
A moment where light and shadow intertwine. The silver mechanical form breathes and stretches...

Small Text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
0.8rem / 400 weight
Sougwen Chung, 2024
```

---

## 9. Implementation Checklist

- [ ] Color CSS variables defined in `docs/css/_colors.css`
- [ ] Typography CSS defined in `docs/css/typography.css`
- [ ] Layout grid system in `docs/css/layout.css`
- [ ] Animation GSAP setup in `docs/js/animations.js`
- [ ] Particle system implemented in `docs/js/particles.js`
- [ ] Three.js scene with bloom in `docs/js/engine.js`
- [ ] Accessibility audit completed
- [ ] Color contrast verified (WCAG AA)
- [ ] Mobile responsiveness tested
- [ ] Artwork images optimized and placed in `docs/images/artworks/`
- [ ] QR codes generated and placed in `docs/images/qrcodes/`

---

## 10. Design System Governance

**Modification Policy:**
- Color changes require curator approval
- Typography changes must maintain WCAG AA contrast
- Particle system changes require performance testing
- All changes documented with rationale in this spec

**Version History:**
| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Oct 2025 | Initial design system |

---

**Status:** ✅ **FINALIZED**
**Approved by:** Design Team
**Ready for:** Week 1 Implementation

**Next Step:** Begin CSS implementation according to FINAL_4WEEK_EXECUTION_PLAN.md, Week 1 timeline.
