# Design: Fix Homepage Display and Click-based Navigation

## Problem Analysis

### Why Current Auto-Play Doesn't Work

1. **Gallery below the fold**: Hero section occupies full viewport, gallery content is out of view
2. **"Scroll to explore" is invalid**: Scroll is disabled, so this CTA is impossible to fulfill
3. **Auto-play animation timing**: Even if visible, animations are too quick or too slow for proper content absorption
4. **No visual affordance**: User doesn't know how to interact - no buttons, no hint about navigation

### Why Click-Based is Better

- Explicit user intent: Click clearly shows user wants to see next artwork
- Accessibility: Works with screen readers and keyboard navigation
- Mobile-friendly: Touch swipe is natural on mobile devices
- Allows self-paced viewing: User can spend as long as they want on each artwork

---

## Architecture Overview

### Layout Strategy

**Current (Broken):**
```
┌─────────────────┐
│  Hero Section   │  <- Full viewport, confusing "scroll" message
│  (no content)   │
├─────────────────┤
│  Gallery        │  <- Below fold, never seen!
│  Artwork 1      │
│  (24 reviews)   │
│  ...            │
└─────────────────┘
```

**Proposed (Fixed):**
```
┌─────────────────────────────────────┐
│      Header (compact, sticky)       │  <- 60px
├─────────────────────────────────────┤
│                                     │
│   Current Artwork + Reviews         │  <- Main viewport area
│   (Image + 2-3 critic panels)       │     (Fill remaining space)
│                                     │
├─────────────────────────────────────┤
│  Navigation Controls                │  <- 80px
│  [◄] Artwork X of 4 [►]             │
│  • Art1 • Art2 • Art3 • Art4        │
└─────────────────────────────────────┘
```

### Responsive Breakpoints

**Mobile (375px):**
- Header: 50px
- Image: full width, height: 40vh
- Critic panels: stacked vertically, scrollable internally (if needed)
- Nav buttons: full width at bottom
- Layout: single column

**Tablet (768px):**
- Header: 60px
- Image: 40% width, height: 70vh
- Critic panels: 60% width, 2-column grid
- Nav buttons: positioned on sides (left/right)
- Layout: 2-column

**Desktop (1024px+):**
- Header: 70px
- Image: 50% width, height: 80vh
- Critic panels: 50% width, flexible floating
- Nav buttons: positioned on left/right edges
- Layout: flexible floating

---

## Component Design

### 1. Hero Section Refactor

**Current HTML:**
```html
<section class="hero-minimal">
  <div class="hero-content">
    <h1>潮汐的负形</h1>
    <p>一场关于艺术评论的视角之旅</p>
  </div>
  <div class="scroll-prompt">
    <span>向下滚动探索</span>
    <svg>...</svg>
  </div>
</section>
```

**Proposed HTML:**
```html
<!-- Remove hero-minimal section OR convert to intro modal -->
<!-- Move first artwork to main content area immediately -->
<main id="main-content">
  <section class="gallery-hero" id="gallery-hero">
    <!-- First artwork displayed here on load -->
    <div class="artwork-display">
      <div class="artwork-image-container">
        <img src="..." alt="..." />
      </div>
      <div class="critiques-panel">
        <!-- 2-3 critic reviews displayed -->
      </div>
    </div>
  </section>

  <section class="gallery-nav">
    <button id="nav-prev" aria-label="Previous artwork">◄</button>
    <div class="artwork-indicator">
      <span id="artwork-current">1</span> of <span id="artwork-total">4</span>
    </div>
    <button id="nav-next" aria-label="Next artwork">►</button>

    <div class="artwork-dots">
      <button class="dot active" data-index="0">Artwork 1</button>
      <button class="dot" data-index="1">Artwork 2</button>
      <button class="dot" data-index="2">Artwork 3</button>
      <button class="dot" data-index="3">Artwork 4</button>
    </div>
  </section>

  <!-- Hidden gallery for detail pages -->
  <section class="gallery" id="gallery" style="display: none;">
    <!-- Full gallery content for detail view -->
  </section>
</main>
```

### 2. Carousel Controller

**Responsibility:**
- Manage current artwork index
- Handle next/previous/goto operations
- Trigger DOM updates
- Coordinate with critique panel display

**Key Methods:**
```javascript
class ArtworkCarousel {
  constructor(artworks, data) { }

  getCurrentArtwork() { }

  goToArtwork(index) {
    // Update display
    // Update indicator
    // Animate transition
  }

  nextArtwork() { }
  previousArtwork() { }

  onSwipe(direction) { }
}
```

### 3. Touch/Swipe Support

**Strategy:**
- Use pointer events (pointerdown, pointermove, pointerup)
- Detect horizontal movement > vertical movement
- Threshold: 50px horizontal movement = swipe
- Left swipe = next artwork, right swipe = previous

**Implementation:**
```javascript
function handleSwipe() {
  let startX, startY;

  element.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
    startY = e.clientY;
  });

  element.addEventListener('pointerup', (e) => {
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) carousel.nextArtwork();
      else carousel.previousArtwork();
    }
  });
}
```

---

## Data Flow

```
VULCA_DATA (js/data.js)
  ├─ artworks[4]
  ├─ personas[6]
  └─ critiques[24]
      ↓
  ArtworkCarousel (new module)
      ├─ currentIndex: 0
      ├─ getCurrentArtwork() → artworks[0]
      ├─ getRelevantCritiques() → critiques filtered by artwork
      └─ render() → updates DOM
      ↓
  DOM Update
      ├─ .artwork-image → <img src="...">
      ├─ .critiques-panel → render critique elements
      ├─ .artwork-indicator → update "1 of 4"
      └─ .artwork-dots → highlight current dot
```

---

## CSS Layout Strategy

### Main Container

```css
.gallery-hero {
  display: flex;
  min-height: 100vh;
  padding: 70px 20px 80px; /* top header, bottom nav */
  gap: 20px;
}

/* Mobile stacked */
@media (max-width: 767px) {
  .gallery-hero {
    flex-direction: column;
    min-height: auto;
  }
}

/* Tablet 2-column */
@media (768px <= width < 1024px) {
  .artwork-image-container {
    flex: 0 0 40%;
  }
  .critiques-panel {
    flex: 0 0 60%;
  }
}

/* Desktop flexible */
@media (width >= 1024px) {
  .artwork-image-container {
    flex: 1;
  }
  .critiques-panel {
    flex: 1;
  }
}
```

### Image Container

```css
.artwork-image-container {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  background: #f0f0f0;
}

.artwork-image-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}
```

### Critiques Panel

```css
.critiques-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  max-height: 100%;
  padding-right: 8px; /* scrollbar space */
}

.critique-item {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

/* Limit to 2-3 visible critics */
.critique-item:nth-child(n+3) {
  display: none; /* Show only 2-3 */
}

@media (min-width: 1200px) {
  .critique-item:nth-child(n+3) {
    display: block; /* Show more on large screens */
  }
}
```

### Navigation Bar

```css
.gallery-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: rgba(255, 255, 255, 0.95);
  border-top: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 0 20px;
  z-index: 50;
}

.gallery-nav button {
  background: none;
  border: 1px solid #ccc;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 18px;
  border-radius: 4px;
  transition: all 0.2s;
}

.gallery-nav button:hover {
  background: #f5f5f5;
  border-color: #999;
}

.artwork-indicator {
  font-size: 14px;
  color: #666;
}

.artwork-dots {
  display: flex;
  gap: 8px;
  margin-left: 20px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ccc;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.dot.active {
  background: #333;
}
```

---

## Animation & Transitions

**Artwork Transition:**
- Fade out current artwork (200ms)
- Load new artwork data
- Fade in new artwork (300ms)
- No interruption of navigation during transition

**Button Feedback:**
- Hover: slight background change
- Active: visual indication
- Disabled state (when at boundaries? no, loop instead)

---

## Accessibility Considerations

1. **Keyboard Navigation:**
   - Left Arrow = previous artwork
   - Right Arrow = next artwork
   - Tab to navigate buttons
   - Enter/Space to activate buttons

2. **ARIA Labels:**
   - Buttons have `aria-label` describing action
   - Indicator updated with live region: `aria-live="polite"`
   - Dots have accessible names

3. **Focus Management:**
   - Focus visible on navigation buttons
   - Logical tab order

4. **Screen Reader:**
   - Announce current artwork on change
   - Describe navigation options

---

## Mobile Considerations

**Touch Interactions:**
- Swipe left (fast) = next artwork
- Swipe right (fast) = previous artwork
- Tap buttons = same as click
- Visual feedback on swipe (no delay)

**Viewport Optimization:**
- Hide dots on very small screens (< 500px)
- Show indicator text instead
- Full-width buttons on mobile

---

## Performance Notes

- Lazy load images for next/previous artworks?
- Pre-cache critique text?
- No unnecessary DOM redraws during swipe
- Use CSS transforms for animations (GPU acceleration)

---

## Migration Path from Auto-Play

**Old System:**
- `autoplay.js` - Auto-play controller (can be removed)
- `gallery-init.js` - Gallery initialization (can be modified to be carousel-aware)

**New System:**
- `carousel.js` - NEW: Carousel controller
- `gallery-hero.js` - NEW: Hero section renderer
- `swipe-handler.js` - NEW: Touch swipe support
- Modified: `index.html`, `styles/main.css`

**Backwards Compatibility:**
- Keep full gallery hidden for detail page access
- Maintain gallery-init for future use
- Keep data.js unchanged
