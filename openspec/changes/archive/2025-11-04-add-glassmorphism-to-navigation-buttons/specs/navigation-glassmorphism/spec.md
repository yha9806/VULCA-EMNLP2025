# Spec: Navigation Glassmorphism Styling

**Capability**: `navigation-glassmorphism`
**Change**: `add-glassmorphism-to-navigation-buttons`
**Version**: 1.0.0

---

## MODIFIED Requirements

### REQ-MOD-001: Button Background Transparency

The artwork navigation buttons SHALL use a background opacity of 0.7 (70%) instead of the current 0.9 (90%).

**Acceptance Criteria**:
- [ ] `.artwork-nav-button` base background is `rgba(255, 255, 255, 0.7)`
- [ ] Hover state maintains glassmorphism with `rgba(0, 0, 0, 0.85)`
- [ ] Disabled state uses reduced opacity `0.4` on top of glassmorphism base
- [ ] Fallback for unsupported browsers uses `rgba(255, 255, 255, 0.85)`

#### Scenario: Default Button Opacity

**Given** the user is viewing the gallery on desktop (1440px width)
**When** the page renders with the navigation buttons
**Then** the Previous and Next buttons MUST have background `rgba(255, 255, 255, 0.7)`
**And** the artwork behind the buttons MUST be partially visible through the buttons

**Validation**:
```javascript
const prevButton = document.querySelector('#unified-artwork-prev');
const styles = window.getComputedStyle(prevButton);
const bgColor = styles.backgroundColor;

// Extract RGBA values
const rgba = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
const opacity = parseFloat(rgba[4]);

console.assert(
  Math.abs(opacity - 0.7) < 0.01,
  `Button opacity is ${opacity}, expected 0.7`
);
```

#### Scenario: Hover State Glassmorphism

**Given** the user hovers over the "Next Artwork" button
**When** the hover state activates
**Then** the button background MUST change to `rgba(0, 0, 0, 0.85)`
**And** the text color MUST invert to white
**And** the backdrop blur MUST increase to 12px

**Validation**:
```javascript
const nextButton = document.querySelector('#unified-artwork-next');
nextButton.dispatchEvent(new MouseEvent('mouseenter'));

const styles = window.getComputedStyle(nextButton);
const bgColor = styles.backgroundColor;
const textColor = styles.color;
const backdropFilter = styles.backdropFilter || styles.webkitBackdropFilter;

// Verify dark glassmorphism background
const rgba = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
const opacity = parseFloat(rgba[4]);
console.assert(opacity >= 0.8, `Hover opacity too low: ${opacity}`);

// Verify blur increased
console.assert(backdropFilter.includes('blur(12px)'), 'Hover blur not applied');
```

---

### REQ-MOD-002: Backdrop Blur Effect

The artwork navigation buttons and indicator SHALL apply a backdrop blur effect using `backdrop-filter: blur(10px)`.

**Acceptance Criteria**:
- [ ] `.artwork-nav-button` has `backdrop-filter: blur(10px)`
- [ ] `.artwork-nav-button` has `-webkit-backdrop-filter: blur(10px)` for Safari
- [ ] `.artwork-indicator` has `backdrop-filter: blur(8px)` (slightly less than buttons)
- [ ] Hover state increases blur to `12px`
- [ ] `@supports` fallback exists for unsupported browsers

#### Scenario: Blur Applied on Modern Browsers

**Given** the user is on Chrome 120+ or Firefox 120+ or Safari 17+
**When** the page loads and the navigation renders
**Then** the Previous and Next buttons MUST have `backdrop-filter: blur(10px)` applied
**And** the frosted glass effect MUST be visible when artwork shows through the button

**Validation**:
```javascript
const button = document.querySelector('.artwork-nav-button');
const styles = window.getComputedStyle(button);
const backdropFilter = styles.backdropFilter || styles.webkitBackdropFilter;

console.assert(
  backdropFilter.includes('blur(10px)'),
  `Backdrop filter is "${backdropFilter}", expected blur(10px)`
);
```

#### Scenario: Graceful Degradation on Unsupported Browsers

**Given** the user is on a browser that doesn't support backdrop-filter (e.g., IE 11)
**When** the page loads
**Then** the buttons MUST fall back to `rgba(255, 255, 255, 0.85)` (slightly more opaque)
**And** no JavaScript errors MUST occur
**And** buttons MUST remain fully functional

**Validation**:
```css
/* Verify fallback CSS exists */
@supports not (backdrop-filter: blur()) {
  .artwork-nav-button {
    background: rgba(255, 255, 255, 0.85);
  }
}
```

---

### REQ-MOD-003: Reduced Button Sizing

The artwork navigation buttons SHALL have reduced padding and font sizes across all responsive breakpoints.

**Acceptance Criteria**:
- [ ] Desktop (≥1024px): `padding: 8px 18px`, `font-size: 0.9rem`
- [ ] Tablet (768-1023px): `padding: 6px 14px`, `font-size: 0.85rem`
- [ ] Mobile (<768px): `padding: 6px 12px`, `font-size: 0.8rem`
- [ ] Touch targets on mobile remain ≥ 44px tall (WCAG 2.1 AA)
- [ ] Icon size (`16px`) remains unchanged

#### Scenario: Desktop Button Sizing

**Given** the user is viewing the gallery on desktop (1440px width)
**When** measuring the Previous/Next buttons
**Then** button padding MUST be `8px 18px` (vertical horizontal)
**And** button font size MUST be `0.9rem`
**And** button icon (arrow) MUST remain `16px × 16px`

**Validation**:
```javascript
const button = document.querySelector('.artwork-nav-button');
const styles = window.getComputedStyle(button);

const paddingTop = parseInt(styles.paddingTop);
const paddingLeft = parseInt(styles.paddingLeft);
const fontSize = parseFloat(styles.fontSize);

console.assert(paddingTop === 8, `Padding-top: ${paddingTop}px (expected 8px)`);
console.assert(paddingLeft === 18, `Padding-left: ${paddingLeft}px (expected 18px)`);
console.assert(Math.abs(fontSize - 14.4) < 1, `Font-size: ${fontSize}px (expected ~14.4px = 0.9rem)`);
```

#### Scenario: Mobile Touch Target Validation

**Given** the user is on mobile (375px width)
**When** measuring the button height
**Then** the button MUST be at least 44px tall to meet WCAG 2.1 AA touch target requirements

**Validation**:
```javascript
// Simulate mobile viewport
window.resizeTo(375, 667);

const button = document.querySelector('.artwork-nav-button');
const height = button.getBoundingClientRect().height;

console.assert(
  height >= 44,
  `Button height is ${height}px, must be ≥44px for WCAG AA`
);
```

---

## ADDED Requirements

### REQ-ADD-001: Artwork Indicator Glassmorphism

The artwork indicator ("1 of 4") SHALL have glassmorphism styling to match the navigation buttons.

**Acceptance Criteria**:
- [ ] `.artwork-indicator` has `background: rgba(255, 255, 255, 0.6)` (more transparent than buttons)
- [ ] `.artwork-indicator` has `backdrop-filter: blur(8px)` (less blur than buttons)
- [ ] `.artwork-indicator` has `padding: 6px 12px` and `border-radius: 4px`
- [ ] Visual hierarchy: Indicator appears less prominent than buttons

#### Scenario: Indicator Glassmorphism Applied

**Given** the user is viewing the gallery
**When** the navigation renders
**Then** the indicator ("1 of 4") MUST have a semi-transparent background `rgba(255, 255, 255, 0.6)`
**And** the indicator MUST have a subtle blur effect `backdrop-filter: blur(8px)`
**And** the indicator MUST appear visually distinct but less prominent than buttons

**Validation**:
```javascript
const indicator = document.querySelector('.artwork-indicator');
const styles = window.getComputedStyle(indicator);

const bgColor = styles.backgroundColor;
const backdropFilter = styles.backdropFilter || styles.webkitBackdropFilter;

// Verify lower opacity than buttons
const rgba = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
const opacity = parseFloat(rgba[4]);
console.assert(opacity === 0.6, `Indicator opacity: ${opacity} (expected 0.6)`);

// Verify less blur than buttons
console.assert(backdropFilter.includes('blur(8px)'), 'Indicator blur not applied');
```

---

### REQ-ADD-002: Semi-Transparent Border

Navigation buttons SHALL have semi-transparent borders to match glassmorphism aesthetic.

**Acceptance Criteria**:
- [ ] Button border is `2px solid rgba(45, 45, 45, 0.4)` (40% opacity)
- [ ] Border thickness remains 2px (not reduced to 1px)
- [ ] Border provides clear visual boundaries on all backgrounds
- [ ] Hover state border remains visible

#### Scenario: Border Opacity Applied

**Given** the user views the navigation buttons
**When** inspecting button styles
**Then** the border MUST be `2px solid rgba(45, 45, 45, 0.4)`
**And** the border MUST remain visible on light and dark artwork backgrounds

**Validation**:
```javascript
const button = document.querySelector('.artwork-nav-button');
const styles = window.getComputedStyle(button);
const border = styles.border;

// Verify border width
console.assert(border.includes('2px'), `Border width incorrect: ${border}`);

// Verify border color has opacity (check for 'rgba')
const borderColor = styles.borderColor;
console.assert(borderColor.includes('rgba'), 'Border should use rgba for transparency');
```

---

### REQ-ADD-003: Accessibility Contrast Validation

Navigation buttons MUST maintain WCAG 2.1 AA contrast ratios (≥4.5:1) on all artwork backgrounds.

**Acceptance Criteria**:
- [ ] Text contrast ≥4.5:1 on artwork-1 background
- [ ] Text contrast ≥4.5:1 on artwork-2 background (light tones - critical)
- [ ] Text contrast ≥4.5:1 on artwork-3 background
- [ ] Text contrast ≥4.5:1 on artwork-4 background
- [ ] If fails, increase opacity to 0.75 or add subtle text-shadow

#### Scenario: Contrast on Light Artwork Background

**Given** the user is viewing artwork-2 (light tones)
**When** measuring button text contrast
**Then** the contrast ratio MUST be at least 4.5:1 between button text and button background

**Validation**:
```javascript
// Use Chrome DevTools Accessibility panel or automated tool
const button = document.querySelector('.artwork-nav-button');
const textColor = window.getComputedStyle(button).color;
const bgColor = window.getComputedStyle(button).backgroundColor;

// Calculate contrast ratio (simplified - use actual WCAG algorithm)
const contrast = calculateContrastRatio(textColor, bgColor);

console.assert(
  contrast >= 4.5,
  `Contrast ratio ${contrast}:1 fails WCAG AA (requires 4.5:1)`
);
```

---

### REQ-ADD-004: Performance Validation

Glassmorphism effects MUST NOT degrade page performance below 60fps (16ms frame time).

**Acceptance Criteria**:
- [ ] Backdrop-filter rendering adds <5ms per frame
- [ ] Total frame time remains <16ms (60fps target)
- [ ] No layout thrashing or repaints on navigation interaction
- [ ] GPU compositing layers remain within reasonable limits (<20 layers)

#### Scenario: Render Performance Testing

**Given** the user interacts with navigation (hover, click)
**When** measuring performance in Chrome DevTools
**Then** frame time MUST remain under 16ms
**And** no forced reflows or layout thrashing MUST occur

**Validation**:
```javascript
// Use Chrome DevTools Performance panel
// 1. Start recording
// 2. Hover over buttons, click through artworks
// 3. Stop recording
// 4. Verify:
//    - Frame time < 16ms
//    - No "Forced reflow" warnings
//    - Composite layers < 20
```

---

## REMOVED Requirements

_None_ - This change is additive, no existing requirements are removed.

---

## Cross-Capability Dependencies

### Depends On:
- `fix-navigation-alignment-and-text` (predecessor change) - Provides the current navigation component structure

### Related Specs:
- `openspec/changes/fix-navigation-alignment-and-text/specs/navigation-layout/spec.md` - Original navigation layout and text requirements

---

## Test Coverage Matrix

| Requirement | Unit Test | Integration Test | Visual Test | A11y Test | Perf Test |
|-------------|-----------|------------------|-------------|-----------|-----------|
| REQ-MOD-001 | N/A | ✅ Browser styles | ✅ Screenshot | N/A | N/A |
| REQ-MOD-002 | N/A | ✅ Browser styles | ✅ Screenshot | N/A | N/A |
| REQ-MOD-003 | N/A | ✅ Touch targets | ✅ Responsive | ✅ WCAG | N/A |
| REQ-ADD-001 | N/A | ✅ Browser styles | ✅ Screenshot | N/A | N/A |
| REQ-ADD-002 | N/A | ✅ Browser styles | ✅ Screenshot | N/A | N/A |
| REQ-ADD-003 | N/A | ✅ Contrast calc | N/A | ✅ WCAG AA | N/A |
| REQ-ADD-004 | N/A | N/A | N/A | N/A | ✅ DevTools |

---

## Browser Compatibility

**Supported Browsers**:
- Chrome/Edge 76+ ✅
- Firefox 103+ ✅
- Safari 9+ ✅ (with `-webkit-` prefix)

**CSS Features Used**:
- `backdrop-filter: blur()` (modern browsers, 95%+ support)
- `rgba()` colors (universal support)
- `@supports` queries (universal support)

**Graceful Degradation**:
- IE 11: Falls back to solid background (0.85 opacity, no blur)
- Old Chrome/Firefox: Falls back to solid background via `@supports not ()`

---

## Validation Checklist

### Manual QA Checklist
- [ ] Button opacity is 0.7 (visually semi-transparent)
- [ ] Blur effect visible (frosted glass appearance)
- [ ] Buttons smaller than before (reduced padding)
- [ ] Indicator has glassmorphism styling
- [ ] Border is semi-transparent (0.4 opacity)
- [ ] Hover state works with glassmorphism
- [ ] All 4 artworks tested for contrast
- [ ] Mobile touch targets ≥44px
- [ ] No visual artifacts or glitches
- [ ] Performance remains smooth (<16ms frame time)

### Automated Validation
```bash
# Run browser tests
npm run test:browser

# Run accessibility tests
npm run test:a11y

# Run visual regression tests
npm run test:visual

# Run performance tests
npm run test:performance
```

---

## Rollback Criteria

**Trigger Rollback If**:
1. Contrast ratio fails on any artwork background (<4.5:1)
2. Mobile touch targets <44px
3. Performance degradation >20ms frame time
4. Visual bugs on supported browsers (Chrome, Firefox, Safari, Edge)
5. User feedback indicates reduced usability

**Rollback Steps**:
1. Revert CSS changes to `styles/components/unified-navigation.css`
2. Increment version parameter in index.html to bust cache
3. Clear browser cache and verify rollback
4. Document issue in `openspec/changes/add-glassmorphism-to-navigation-buttons/ROLLBACK.md`
