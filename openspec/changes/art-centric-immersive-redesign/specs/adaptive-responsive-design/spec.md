# Adaptive Responsive Design - Capability Specification

**Capability ID**: `adaptive-responsive-design`
**Scope**: Device-specific layout strategies, breakpoints, interaction patterns
**Related Capabilities**: immersive-gallery, artistic-visualization

---

## Overview

Implement device-specific design strategies optimized for:
1. **Large Electronic Displays** (55"+ kiosks, event installations)
2. **Desktop** (1440px+, mouse-based interaction)
3. **Tablet** (768-1024px, touch-based)
4. **Mobile** (375-768px, vertical scrolling)
5. **Accessibility** (high contrast, reduced motion, keyboard-only)

Each device class has distinct interaction patterns, typography sizes, and layout priorities.

---

## Requirements

### ADDED Requirements

#### Requirement: Device Detection & CSS Custom Properties
**ID**: `device-detection`
**Priority**: P0 (Critical)

**Description**: Use CSS media queries to detect device type and set custom properties that cascade to all child components.

**Breakpoint Strategy**:

```css
/* Mobile-First Approach */

/* Default (Mobile: 375-600px) */
:root {
  --viewport-class: "mobile";
  --artwork-viewport: 90vh;
  --title-size: 32px;
  --body-size: 16px;
  --critique-columns: 1;
  --spacing-unit: 16px;
}

/* Tablet Portrait (768px) */
@media (min-width: 768px) {
  :root {
    --viewport-class: "tablet";
    --artwork-viewport: 75vh;
    --title-size: 40px;
    --body-size: 17px;
    --critique-columns: 2;
    --spacing-unit: 24px;
  }
}

/* Tablet Landscape / Small Desktop (1024px) */
@media (min-width: 1024px) {
  :root {
    --viewport-class: "desktop";
    --artwork-viewport: 70vh;
    --title-size: 48px;
    --body-size: 18px;
    --critique-columns: 2-3;
    --spacing-unit: 32px;
  }
}

/* Desktop (1440px) */
@media (min-width: 1440px) {
  :root {
    --viewport-class: "desktop-large";
    --artwork-viewport: 80vh;
    --title-size: 56px;
    --body-size: 18px;
    --critique-columns: 3;
    --spacing-unit: 40px;
  }
}

/* Large Display (2560px+) */
@media (min-width: 2560px) {
  :root {
    --viewport-class: "large-display";
    --artwork-viewport: 85vh;
    --title-size: 72px;
    --body-size: 20px;
    --critique-columns: 4;
    --spacing-unit: 48px;
  }
}
```

**JavaScript Integration**:
```javascript
// Detect device type and enable features
const deviceType = getComputedStyle(document.documentElement)
  .getPropertyValue('--viewport-class');

if (deviceType.includes('large-display')) {
  enableAutoPlayMode();     // For kiosk installations
  enableGestureRecognition(); // For hand/foot control
} else if (deviceType.includes('mobile')) {
  disableHoverStates();     // Hover irrelevant on touch
  enableSwipeGestures();     // Add swipe navigation
}
```

---

#### Requirement: Mobile-Specific Layout (375-768px)
**ID**: `mobile-layout`
**Priority**: P0 (Critical)

**Mobile Design Philosophy**: Maximize artwork immersion, minimize chrome, single-column layout.

**Layout Specifications**:

**Single Column Grid**:
```css
.gallery {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-unit);
}

.artwork-section {
  width: 100vw;  /* Full viewport width */
  margin-left: calc(-50vw + 50%);  /* Center alignment trick */
}
```

**Artwork Display**:
- Image: 90vh height (maximize immersion)
- Title below image: 32px serif font
- Metadata (year, artist): 14px sans font

**Critique Panels**:
- Full-width, single at a time
- Show "1 of 6 more perspectives" badge
- Tap badge to reveal next critique (swipe-able carousel)
- Critiques remain swipeable without full-page scroll

**RPAIT Visualization**:
- Simplified: bar charts instead of radar (easier to read on small screen)
- OR: circular form with smaller radius
- Numeric fallback: "R: 7 | P: 9 | A: 8 | I: 8 | T: 6"

**Typography Sizes**:
- Title: 32px (Crimson Text serif)
- Subtitle: 24px (gray, lighter)
- Critic name: 16px bold
- Body text: 16px (line-height: 1.6)
- Labels: 12px sans-serif

**Gesture Controls**:
- Swipe up/down: Scroll through artworks
- Swipe left/right: Navigate critiques within artwork
- Tap critique: Expand full text (modal overlay)
- Tap artwork: Close any open panels, show full artwork
- Long-press: Share or save options (iOS-style menu)

**Navigation**:
- Hamburger menu icon (top-left, 32px tap target)
- Language toggle (top-right, 32px tap target)
- "Back to Top" button (bottom-right, fixed, appears after 3 artworks scrolled)

---

#### Requirement: Tablet-Specific Layout (768-1024px)
**ID**: `tablet-layout`
**Priority**: P1 (High)

**Tablet Design Philosophy**: Leverage larger screen, support both portrait and landscape, touch-friendly.

**Portrait Orientation (768x1024)**:
```
┌──────────────┐
│  ARTWORK(80%)│
│              │
├──────────────┤
│ Critique 1   │
├──────────────┤
│ Critique 2   │
├──────────────┤
│ RPAIT Viz    │
└──────────────┘
```

**Landscape Orientation (1024x768)**:
```
┌──────────────────────────┐
│  ARTWORK(50%) │ Crit(50%)│
│               │          │
│               ├──────────┤
│               │ RPAIT Viz│
└──────────────────────────┘
```

**Dynamic Layout Switching**:
```javascript
window.addEventListener('orientationchange', () => {
  if (window.matchMedia('(orientation: landscape)').matches) {
    enableSideBySideLayout();
  } else {
    enableSingleColumnLayout();
  }
});
```

**Critique Panels**:
- Option 1: Stack vertically (portrait), side-by-side (landscape)
- Option 2: Swipe-able horizontal carousel (always)
- Show 2 critiques visible at once (landscape) / 1 (portrait)

**Touch Interactions**:
- Tap to expand: Full-screen critique modal (can swipe to next)
- Pinch to zoom: Artwork image (up to 2x)
- Swipe to navigate: Between artworks or critiques

---

#### Requirement: Desktop-Specific Layout (1024px+)
**ID**: `desktop-layout`
**Priority**: P1 (High)

**Desktop Design Philosophy**: Leverage mouse interaction, multi-column layouts, rich hover states.

**Dual/Tri-Column Layout**:
```
┌─────────────────────────────────┐
│ ARTWORK(60%) │ Critic1(20%) │ Cr│
│              │              │ i2│
│              │ ┌────────┐   │(2│
│              │ │Crit    │   │0%│
│              │ │Text    │   │)│
│              │ │        │   │ │
│              │ └────────┘   │ │
├──────────────┴──────────────┴──┤
│ RPAIT Visualization (100% width)│
└────────────────────────────────┘
```

**Keyboard Navigation**:
- ← / → : Previous/next artwork
- ↑ / ↓ : Scroll within critiques
- Space : Expand next critique
- Escape: Close any open panels
- Tab : Cycle through all interactive elements
- Enter : Activate focused element

**Mouse Interactions**:
- Hover over critique panel: Show full text preview (tooltip)
- Hover over persona name: Show persona biography (popup)
- Hover over RPAIT dimension: Highlight in chart
- Click artwork: Toggle comparison mode (show 2 artworks side-by-side)
- Scroll wheel: Natural waterfall navigation

**Typography Sizes**:
- Title: 48-56px
- Body text: 18px (line-height: 1.8)
- Critique body: 17px
- Labels: 14px

---

#### Requirement: Large Display Strategy (2560px+, Kiosk)
**ID**: `large-display-layout`
**Priority**: P2 (Medium)

**Large Display Design Philosophy**: Museum/event installation, view from distance, auto-play, gesture recognition.

**Layout**:
```
┌────────────────────────────────────────┐
│ ARTWORK (80%) │ Critique 1 │ Critique 2 │
│               │ (10%)      │ (10%)      │
│               │            │            │
│               │            │            │
│               │            │            │
├───────────────┴────────────┴────────────┤
│ RPAIT Visualization (100% width)       │
└────────────────────────────────────────┘
```

**Auto-Play Mode**:
```javascript
// Continuous scroll through artworks every 30s
setInterval(() => {
  scrollToNextArtwork();
}, 30000);
```

**Typography**:
- Title: 72px (readable from 10+ meters away)
- Body text: 20px
- No text smaller than 16px (readability from distance)

**Gesture Recognition** (Optional):
- Hand swipe: Navigate to next/previous artwork
- Foot pedal: Toggle critique panels visibility
- Voice commands: Skip to specific artwork (future)

**Interaction-Reduced**:
- No hover states (viewed from distance)
- Large tap/click targets (hand-friendly)
- Clear visual feedback (color changes, animations)

---

#### Requirement: Accessibility Responsive Design
**ID**: `accessibility-responsive`
**Priority**: P0 (Critical)

**High Contrast Mode**:
```css
@media (prefers-contrast: more) {
  :root {
    --color-text: #000000;  /* Pure black */
    --color-bg: #FFFFFF;    /* Pure white */
    --color-border: #000000;
  }

  /* Increase line weights */
  * { border-width: 2px !important; }
}
```

**Reduced Motion**:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Large Text Mode**:
```css
@media (prefers-reduced-motion: reduce) {
  /* Scale up fonts 20% */
  body { font-size: 1.2em; }
  h2 { font-size: 1.2em; }
}
```

**Dark Mode Support**:
```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1a1a1a;
    --color-text: #e0e0e0;
  }
}
```

---

### MODIFIED Requirements

#### Requirement: Typography Scaling System
**ID**: `typography-scaling`
**Priority**: P1 (High)

**Current State**: Fixed font sizes (likely 16px base)
**Future State**: Responsive font sizes using CSS custom properties and clamp()

**Recommendation**: Use CSS clamp() for fluid typography
```css
h2 {
  font-size: clamp(32px, 5vw, 72px);
  /* Min: 32px (mobile), Max: 72px (large displays) */
}

body {
  font-size: clamp(16px, 2vw, 20px);
  /* Min: 16px (mobile), Max: 20px (large displays) */
}
```

---

## Success Criteria

✅ **Mobile (375-768px)**
- Artwork fills viewport (90vh+)
- Tap targets 48x48px minimum
- Single-column layout (no horizontal scroll)
- Swipe gestures work smoothly
- Performance: <2s load time

✅ **Tablet (768-1024px)**
- Both portrait and landscape work
- Touch-optimized (large tap targets)
- 2-column layout at least
- Pinch-to-zoom functional
- Landscape specific layout tested

✅ **Desktop (1024px+)**
- Multi-column layout (2-3 columns)
- Keyboard navigation complete
- Hover states functional
- <50ms hover response
- 60fps mouse tracking

✅ **Large Display (2560px+)**
- 72px+ title readable from 10+ meters
- Auto-play mode works
- Gesture recognition (if implemented)
- No interaction delays

✅ **Accessibility**
- High contrast mode: 7:1 contrast ratio
- Reduced motion: no animations
- Dark mode: colors inverted intelligently
- All breakpoints: WCAG AA compliant

---

## Testing Strategy

**Manual Testing Checklist**:
- [ ] Test on 5+ actual devices (mobile, tablet, desktop, large display)
- [ ] Test both portrait/landscape orientation (tablet, mobile)
- [ ] Test with keyboard-only navigation
- [ ] Test with mouse + trackpad
- [ ] Test with touch (swipe, pinch, long-press)
- [ ] Test with high-contrast mode enabled
- [ ] Test with reduced-motion preference enabled
- [ ] Test with dark mode enabled
- [ ] Verify 60fps scrolling on all devices
- [ ] Verify <2s initial load on all connection speeds

**Automated Testing**:
```javascript
describe('Responsive Design', () => {
  test('Mobile layout at 375px', () => {
    // Set viewport to 375x667
    // Verify single column, 90vh artwork
  });

  test('Tablet landscape at 1024x768', () => {
    // Set viewport to 1024x768
    // Verify 2-column layout
  });

  test('Desktop multi-column at 1440px', () => {
    // Set viewport to 1440x900
    // Verify 3-column layout
  });

  test('Keyboard navigation complete', () => {
    // Tab through all interactive elements
    // Verify focus visible on all
    // Verify Escape closes panels
    // Verify Arrow keys navigate
  });
});
```

---

**End of Adaptive Responsive Design Specification**

Version: 1.0 | Last Updated: 2025-11-01
