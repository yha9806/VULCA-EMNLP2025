# Immersive Gallery Layout - Capability Specification

**Capability ID**: `immersive-gallery`
**Scope**: DOM structure, gallery layout system, scroll-based reveals
**Related Capabilities**: artistic-visualization, adaptive-responsive-design

---

## Overview

The immersive gallery is the core spatial container that transforms VULCA from a "features showcase" into an "art-centric experience." It provides:

1. **Full-viewport artwork display** - Artworks as primary subjects, not cards
2. **Waterfall composition** - Content flows naturally from artwork → critique → viz → next artwork
3. **Spatial depth cues** - Layering, scrolling parallax, light/shadow interplay
4. **Scroll-triggered reveals** - Information unfolds as user scrolls (no modal dialogs)

---

## Requirements

### ADDED Requirements

#### Requirement: Gallery Container Structure
**ID**: `immersive-gallery-structure`
**Priority**: P0 (Critical)
**Category**: Architecture

**Description**:
The DOM structure must support a waterfall layout with clear section boundaries for artworks, critique panels, and visualizations.

**Requirements**:
- Artwork sections must be full-width and vertically stacked
- Each artwork section contains: image + metadata + critique panels + RPAIT viz
- Critique panels must be flexible container (1-6 panels per artwork)
- RPAIT viz must have dedicated container below critiques
- All sections use CSS Grid or Flexbox (no absolute positioning)
- Clear semantic HTML5 elements (`<article>`, `<section>`, `<aside>`)

**Scenario**:
```html
<section class="gallery">
  <article class="artwork-section" data-artwork-id="artwork-1">
    <!-- Hero/first artwork -->
  </article>

  <article class="artwork-section" data-artwork-id="artwork-2">
    <!-- Second artwork with critiques and viz -->
  </article>

  <!-- ... more artworks ... -->
</section>
```

---

#### Requirement: Artwork Display (Full Immersion)
**ID**: `artwork-full-display`
**Priority**: P0 (Critical)
**Category**: Visual

**Description**:
Artworks must be displayed in a way that emphasizes their importance as primary subjects, not ancillary data.

**Requirements**:
- Artwork image takes 60-90% of viewport height (device-dependent)
- Image is responsive (srcset for multiple resolutions)
- Artwork metadata (title, year, artist) displayed as overlay or below image
- Bilingual titles displayed with equal visual weight
- No navigation elements overlap artwork
- Artwork scrolls into/out of view naturally (no modal, no popup)
- High DPI support (2x retina images)

**Scenario**:
```
Desktop (1440px):
┌────────────────────────────────────────┐
│                                        │
│         ARTWORK IMAGE (80vh)           │
│         Large, immersive               │
│                                        │
│         Title (Bilingual) & Year       │
└────────────────────────────────────────┘

Mobile (375px):
┌──────────────┐
│              │
│  IMAGE (90vh)│
│              │
│  Title & Year│
└──────────────┘
```

---

#### Requirement: Critique Panel Reveal System
**ID**: `critique-reveal-system`
**Priority**: P0 (Critical)
**Category**: Interaction

**Description**:
Multiple critique perspectives must reveal themselves progressively as user interacts or scrolls, creating a sense of discovery rather than overwhelming with all information at once.

**Requirements**:
- Each artwork can display 1-6 critique panels
- Critique panels appear below artwork
- Reveal can be sequential, random, or clustered
- Reveal can be scroll-triggered or time-triggered (staggered)
- Reveal animation is smooth fade-in or slide-in (100-500ms)
- Reveal order is configurable per artwork
- Users can see how many critiques exist (badge or counter)
- Each critique panel is independently scrollable/readable

**Scenarios**:

**Scenario A: Sequential Reveal**
```
1. User scrolls to artwork
2. Artwork loads with first critique visible
3. After 2s, second critique appears
4. After 4s, third critique appears
5. ... all 6 appear over 10s
```

**Scenario B: Random Reveal on Revisit**
```
1. First visit: sees critiques in order (Su Shi, Guo Xi, ...)
2. Refreshes page or revisits later
3. Second visit: sees different order (John Ruskin first, then Su Shi, ...)
4. Encourages re-exploration
```

**Scenario C: Click to Expand**
```
1. Only first critique visible by default
2. "Show 5 more perspectives" button appears
3. User clicks button
4. Remaining critiques appear with staggered animation
```

---

#### Requirement: Scroll-Based Content Reveal
**ID**: `scroll-based-reveal`
**Priority**: P0 (Critical)
**Category**: Interaction

**Description**:
Content should reveal and animate in response to scroll position, creating sense of spatial progression.

**Requirements**:
- Use Intersection Observer API to detect when sections enter viewport
- Trigger animations when section becomes visible (threshold 10-50%)
- Animations include: fade-in, slide-left, scale-up, parallax
- Parallax effect on background/accent elements (subtle, 0.3-0.5 depth ratio)
- RPAIT chart animates on scroll reveal (draw effect for line charts)
- No auto-play animations (user-initiated only)
- Respect `prefers-reduced-motion` setting

**Scenario**:
```
Scroll Position        Content State
─────────────────────────────────────
Artwork enters view    → Image fade-in + title slide-up
Critiques enter view   → First critique fade-in (0s), second (2s), third (4s)
RPAIT viz enters view  → Chart draws/animates (1-2s duration)
Next artwork enters    → Process repeats
```

---

#### Requirement: Spatial Depth & Layering
**ID**: `spatial-depth-layering`
**Priority**: P1 (High)
**Category**: Visual

**Description**:
Visual hierarchy and depth cues should communicate the relationship between artwork, critique, and data.

**Requirements**:
- Artwork has subtle shadow/vignette (depth effect)
- Critique panels have colored shadow matching persona color
- Layering: artwork → layer below → critiques → layer below → RPAIT viz
- Parallax scroll creates depth (background moves slower than foreground)
- Whitespace is generous (breathing room between sections)
- Accent colors (persona colors) create visual separation
- Z-index hierarchy clear and intentional

**Scenario**:
```
┌─────────────────────────────────┐ Depth Layer 1
│                                 │ (Artwork)
│         ARTWORK                 │
│      (cast shadow)              │
│                                 │
└─────────────────────────────────┘
        (whitespace)
┌──────────┐ ┌──────────┐ Depth Layer 2
│ Critique │ │ Critique │ (Critique panels, subtle colored shadow)
│ Panel 1  │ │ Panel 2  │
└──────────┘ └──────────┘
        (whitespace)
┌─────────────────────────────────┐ Depth Layer 3
│     RPAIT VISUALIZATION         │ (Data viz, above layer 2)
│      (subtle accent color)      │
└─────────────────────────────────┘
```

---

#### Requirement: Minimal Navigation Within Gallery
**ID**: `minimal-navigation`
**Priority**: P1 (High)
**Category**: UX

**Description**:
Navigation should be nearly invisible, with content serving as the primary wayfinding.

**Requirements**:
- No navbar visible during scrolling (only on hero)
- Scroll indicator (subtle, top-right: % of page scrolled)
- Hamburger menu icon (top-left, only visible on demand)
- "Back to top" button appears only after scrolling past hero
- Keyboard shortcuts documented (arrow keys, space bar)
- No breadcrumbs or progress bars (content position IS the progress)
- Homepage link available but not prominent

**Scenario**:
```
Hero Section:
┌─────────────────────────────────────┐
│  [☰ Menu]   VULCA         [EN/中文] │
│                                     │
│    Large hero image/title           │
│                                     │
│    Scroll indicator: ▓▓░░░░░░░░ 18% │
└─────────────────────────────────────┘

Gallery Section (while scrolling):
                                    ▓▓▓░░░░░░░ 30%
  [Artwork displayed]

  [Critique panels appearing]

  [RPAIT visualization]

                          [↑ Back to Top]
```

---

#### Requirement: Responsive Layout Adaptation
**ID**: `responsive-gallery-layout`
**Priority**: P1 (High)
**Category**: Responsive

**Description**:
Gallery layout must adapt from 1-column (mobile) to 3-column (large desktop) without loss of immersion.

**Requirements**:
- Mobile (375px): Single column, full-width artwork, stacked critiques
- Tablet (768px): Single column, artwork + 1-2 critiques visible
- Desktop (1024px): Dual column (artwork + 1 critique), wrap critiques below
- Large (1440px+): 3-column (artwork 60% + 2 critiques 20% each)
- Large Display (2560px+): 4-column (artwork + 3 critiques)
- Artwork sizing adapts smoothly (no layout jumps)
- Critique panels reflow without lost content

**Scenario**:
```
Mobile (375px)            Desktop (1440px)
┌─────────┐               ┌──────────┬──────┬──────┐
│ ARTWORK │               │          │      │      │
│         │               │ ARTWORK  │Crit1 │Crit2 │
│  Title  │               │  (60%)   │(20%) │(20%) │
├─────────┤               │          │      │      │
│ Critic1 │               ├──────────┴──────┴──────┤
│ text    │               │ RPAIT Visualization   │
├─────────┤               └───────────────────────┘
│ Critic2 │
│ text    │
├─────────┤
│ Viz     │
└─────────┘
```

---

### MODIFIED Requirements

#### Requirement: Existing Hero Section → Minimal Intro
**ID**: `hero-minimized`
**Priority**: P0 (Critical)
**Category**: Migration

**Description**:
The current hero section (with CTA and explanation) must be simplified to just artwork/visual + minimal title.

**Current**: Hero has tagline, description, CTA button, project intro
**Future**: Hero is single artwork or abstract visual + title only
**Rationale**: Let visitor understand context from artwork, not explanation

**Migration Path**:
1. Keep hero section HTML but remove explanation text
2. Replace hero content with first artwork OR thematic visual
3. Move CTA ("进入展览") to "scroll down" implicit action
4. Keep language toggle in top-right corner

---

#### Requirement: Process Section → Optional Deep Dive
**ID**: `process-section-optional`
**Priority**: P2 (Medium)
**Category**: Migration

**Description**:
The current "Process" section (creating process explanation) becomes optional supplementary content, not primary navigation item.

**Current**: Process section in main navbar
**Future**: Move to about/info menu or footer
**Rationale**: Process documentation is interesting but not part of artwork experience

---

## Success Criteria

✅ **Functional**
- All 4 artworks display in sequence without modal dialogs
- All 24 critiques accessible via scroll/reveal (no missing critiques)
- Scroll performance: 60fps on target devices (mobile, desktop, tablet)
- Responsive layout works on all breakpoints (375px to 2560px+)

✅ **Experiential**
- First impression is artwork, not explanation
- Scrolling feels like "walking through gallery," not "navigating website"
- Critique reveals feel like discovery, not overwhelming data dump
- No jarring transitions or layout shifts during scrolling

✅ **Technical**
- DOM uses semantic HTML5
- CSS uses Grid/Flexbox (no absolute positioning hacks)
- Accessibility: keyboard navigation works, screen readers can access all content
- Performance: <2s initial load, <16.67ms per frame (60fps)

---

## Cross-Capability Dependencies

- **artistic-visualization**: RPAIT viz containers must have correct dimensions and animation triggers
- **adaptive-responsive-design**: Layout must adapt across all breakpoints using shared CSS variables
- **bilingual-content-system**: Artwork titles and metadata must support bilingual toggle

---

## Accessibility Considerations

- Keyboard navigation: Tab through artworks, critiques, interactions
- Screen reader: All artwork metadata and critique text must be in semantic HTML
- Focus visible: Clear focus rings on all interactive elements
- Color: Don't rely on color alone (use text labels)
- Motion: Respect `prefers-reduced-motion` (fallback to instant reveal)

---

## Implementation Notes

### DOM Structure Template

```html
<main class="gallery">
  <!-- Artwork Item Template -->
  <article class="artwork-section" data-artwork-id="artwork-1">
    <header class="artwork-header">
      <figure class="artwork-image">
        <img
          src="/assets/artwork-1-large.jpg"
          srcset="/assets/artwork-1-small.jpg 400w, /assets/artwork-1-large.jpg 1200w"
          alt="记忆（绘画操作单元：第二代） Memory (Painting Operation Unit: Second Generation)"
        />
      </figure>
      <div class="artwork-metadata">
        <h2 class="artwork-title">
          <span lang="zh">记忆（绘画操作单元：第二代）</span>
          <span lang="en">Memory (Painting Operation Unit: Second Generation)</span>
        </h2>
        <time class="artwork-year">2022</time>
      </div>
    </header>

    <section class="critiques-container">
      <!-- Critique Panels (1-6) -->
      <article class="critique-panel" data-persona-id="su-shi">
        <!-- Critique content -->
      </article>
    </section>

    <section class="visualization-container">
      <!-- RPAIT Visualization -->
    </section>
  </article>
</main>
```

### CSS Variables Required

```css
:root {
  /* Layout */
  --gallery-max-width: 1440px;
  --artwork-width: 100%;
  --artwork-aspect-ratio: 4 / 3;

  /* Spacing */
  --section-gap: 40px;
  --artwork-gap: 60px;

  /* Typography */
  --title-size: 48px;
  --body-size: 16px;

  /* Depths */
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.1);
  --shadow-md: 0 8px 16px rgba(0,0,0,0.15);

  /* Animations */
  --reveal-duration: 300ms;
  --reveal-delay: 2s;
}
```

---

## Testing Strategy

### Manual Testing Checklist

- [ ] Scroll through all 4 artworks without modal dialogs
- [ ] All critique panels appear in configured reveal order
- [ ] RPAIT visualization renders at correct position
- [ ] Parallax scroll effect visible (background moves slower)
- [ ] Responsive layout adapts at all breakpoints
- [ ] Keyboard navigation works (arrow keys, space, tab)
- [ ] Screen reader announces all content correctly
- [ ] 60fps performance verified with DevTools

### Automated Testing

```javascript
// Example test cases
describe('Immersive Gallery', () => {
  test('All 4 artworks render in sequence', () => {
    // Verify DOM contains 4 artwork-section elements
  });

  test('Critique reveals triggered on scroll', () => {
    // Mock scroll to artwork, verify Intersection Observer calls
  });

  test('Responsive layout adapts on viewport resize', () => {
    // Resize window, verify grid changes columns
  });
});
```

---

## Versioning & Future Enhancements

**Version 1.0**: Waterfall gallery with scroll-based reveals
**Future 1.1**:
- Grid view alternative (switch between waterfall/grid)
- Timeline view (artworks on horizontal timeline)
- Auto-play mode for kiosk displays
- Advanced gesture controls (pinch, long-press)

---

**End of Immersive Gallery Specification**

Version: 1.0 | Last Updated: 2025-11-01
