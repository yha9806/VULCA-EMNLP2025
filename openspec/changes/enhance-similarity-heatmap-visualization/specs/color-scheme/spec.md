# Color Scheme Specification

**Feature**: Viridis Color Gradient for Similarity Values
**Component**: `js/visualizations/similarity-heatmap.js`, `styles/main.css`
**Status**: Proposed

---

## Overview

Replace the current subtle HSL color scheme with a high-contrast viridis color gradient that provides better visual differentiation and supports color-blind users.

---

## MODIFIED Requirements

### Requirement: Color Function SHALL Use Viridis Gradient

The `getHeatmapColor()` function MUST be replaced with a viridis-based color interpolation that maps similarity values (0.0-1.0) to perceptually uniform colors.

**Previous**: HSL colors with constant 75% lightness
**New**: Viridis gradient with varying lightness and hue

**Rationale**: Current HSL colors all use 75% lightness, making them visually indistinguishable. Viridis provides scientifically validated perceptually uniform colors.

#### Scenario: Low similarity values (0.0-0.3) render as deep purple

**Given** a heatmap cell with similarity value 0.15
**When** the color function is called
**Then** the background color SHALL be `#440154` (deep purple) or interpolated between `#440154` and `#31688e`
**And** the color SHALL have sufficient contrast for text

**Validation**:
```javascript
const color = getViridisColor(0.15);
assert(color === '#440154' || isColorBetween(color, '#440154', '#31688e'));

// Verify it's different from medium similarity color
const mediumColor = getViridisColor(0.6);
assert(color !== mediumColor, 'Low and medium colors should differ');
```

#### Scenario: Medium similarity values (0.5-0.7) render as green

**Given** a heatmap cell with similarity value 0.6
**When** the color function is called
**Then** the background color SHALL be interpolated between `#35b779` (green) and nearby stops
**And** the color SHALL be visually distinct from low (purple) and high (yellow) similarities

**Validation**:
```javascript
const color = getViridisColor(0.6);
const rgb = hexToRgb(color);

// Green should have higher G value than R and B
assert(rgb.g > rgb.r && rgb.g > rgb.b, 'Green should be dominant component');
```

#### Scenario: High similarity values (0.9-1.0) render as yellow-white

**Given** a heatmap cell with similarity value 0.95
**When** the color function is called
**Then** the background color SHALL be interpolated between `#fde724` (yellow) and `#ffffff` (white)
**And** the color SHALL be the lightest in the gradient

**Validation**:
```javascript
const color = getViridisColor(0.95);
const rgb = hexToRgb(color);

// Should be very bright
const brightness = (rgb.r + rgb.g + rgb.b) / 3;
assert(brightness > 220, 'High similarity should be very bright');
```

---

### Requirement: Color Interpolation Function SHALL Be Implemented

A new `interpolateViridisColor()` function MUST interpolate between defined color stops based on similarity value.

**Rationale**: Smooth gradients require interpolation between discrete color stops.

#### Scenario: Interpolating between two color stops

**Given** color stops at value 0.3 (`#31688e`) and 0.5 (`#35b779`)
**And** a similarity value of 0.4 (midpoint)
**When** the interpolation function is called
**Then** the returned color SHALL be approximately halfway between the two stops in RGB space

**Validation**:
```javascript
const colorStops = [
  { value: 0.3, color: '#31688e' },
  { value: 0.5, color: '#35b779' }
];

const interpolated = interpolateViridisColor(0.4, colorStops);
const start = hexToRgb('#31688e');
const end = hexToRgb('#35b779');
const result = hexToRgb(interpolated);

// Check R channel is approximately midpoint
const expectedR = Math.round((start.r + end.r) / 2);
assert(Math.abs(result.r - expectedR) <= 5, 'R channel should be interpolated');
```

---

### Requirement: Color Stops SHALL Be Defined as Constants

The viridis color stops MUST be defined as a constant array with 5 stops spanning the full 0.0-1.0 range.

#### Scenario: Color stops definition

**Given** the similarity heatmap module is loaded
**When** checking the color stops constant
**Then** it SHALL contain exactly 5 stops:
  - 0.0 → `#440154` (deep purple)
  - 0.3 → `#31688e` (blue)
  - 0.5 → `#35b779` (green)
  - 0.7 → `#fde724` (yellow)
  - 1.0 → `#ffffff` (white)

**Validation**:
```javascript
const VIRIDIS_COLOR_STOPS = [
  { value: 0.0, color: '#440154' },
  { value: 0.3, color: '#31688e' },
  { value: 0.5, color: '#35b779' },
  { value: 0.7, color: '#fde724' },
  { value: 1.0, color: '#ffffff' }
];

assert(VIRIDIS_COLOR_STOPS.length === 5, 'Should have 5 color stops');
assert(VIRIDIS_COLOR_STOPS[0].value === 0.0, 'First stop at 0.0');
assert(VIRIDIS_COLOR_STOPS[4].value === 1.0, 'Last stop at 1.0');
```

---

## ADDED Requirements

### Requirement: Dynamic Text Color SHALL Ensure Readability

Cell text color MUST be dynamically calculated based on background luminance to ensure WCAG AA contrast ratio (≥4.5:1).

**Rationale**: Light backgrounds need dark text; dark backgrounds need light text.

#### Scenario: Dark background gets white text

**Given** a heatmap cell with dark background (viridis low similarity `#440154`)
**When** the cell is rendered
**Then** the text color SHALL be white (`#ffffff`) or light gray
**And** the contrast ratio SHALL be ≥4.5:1 (WCAG AA)

**Validation**:
```javascript
const cell = document.querySelector('.heatmap-cell[data-similarity="0.15"]');
const bgColor = window.getComputedStyle(cell).backgroundColor;
const textColor = window.getComputedStyle(cell).color;

const contrast = calculateContrastRatio(bgColor, textColor);
assert(contrast >= 4.5, 'Should meet WCAG AA contrast ratio');

const textRgb = parseRgb(textColor);
const brightness = (textRgb.r + textRgb.g + textRgb.b) / 3;
assert(brightness > 200, 'Text should be light on dark background');
```

#### Scenario: Light background gets dark text

**Given** a heatmap cell with light background (viridis high similarity `#fde724`)
**When** the cell is rendered
**Then** the text color SHALL be black (`#000000`) or dark gray
**And** the contrast ratio SHALL be ≥4.5:1

**Validation**:
```javascript
const cell = document.querySelector('.heatmap-cell[data-similarity="0.95"]');
const bgColor = window.getComputedStyle(cell).backgroundColor;
const textColor = window.getComputedStyle(cell).color;

const contrast = calculateContrastRatio(bgColor, textColor);
assert(contrast >= 4.5, 'Should meet WCAG AA contrast ratio');

const textRgb = parseRgb(textColor);
const brightness = (textRgb.r + textRgb.g + textRgb.b) / 3;
assert(brightness < 100, 'Text should be dark on light background');
```

---

### Requirement: Relative Luminance Calculation SHALL Follow WCAG Formula

A `getRelativeLuminance()` function MUST calculate luminance according to WCAG 2.1 specification.

**Rationale**: Accurate luminance calculation ensures correct text color selection.

#### Scenario: Calculating luminance for color selection

**Given** a background color in RGB format
**When** calculating relative luminance
**Then** the formula SHALL be: L = 0.2126 × R + 0.7152 × G + 0.0722 × B
**And** each channel SHALL be linearized before multiplication

**Validation**:
```javascript
function getRelativeLuminance(r, g, b) {
  const linearize = (channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };

  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

// Test with known values
const whiteLuminance = getRelativeLuminance(255, 255, 255);
assert(whiteLuminance === 1.0, 'White should have luminance 1.0');

const blackLuminance = getRelativeLuminance(0, 0, 0);
assert(blackLuminance === 0.0, 'Black should have luminance 0.0');
```

---

## REMOVED Requirements

### Requirement: HSL Color Function Shall Be Removed

The current `getHeatmapColor()` function that returns HSL colors SHALL be completely removed and replaced.

#### Scenario: Old HSL function no longer exists

**Given** the updated similarity heatmap module is loaded
**When** searching for HSL color references
**Then** no function SHALL return colors in `hsl(h, s, l)` format for cell backgrounds
**And** all cell backgrounds SHALL use hex color codes from viridis gradient

**Validation**:
```javascript
const moduleSource = getSimilarityHeatmapSource();
assert(!moduleSource.includes('hsl(120, 70%, 75%)'), 'Old HSL green should be removed');
assert(!moduleSource.includes('hsl(60, 70%, 75%)'), 'Old HSL yellow should be removed');
assert(!moduleSource.includes('hsl(0, 70%, 75%)'), 'Old HSL red should be removed');
```

---

## Non-Functional Requirements

### Accessibility

- **Requirement**: Color gradient MUST pass Color Blind Vision Simulator tests for:
  - Deuteranopia (red-green color blindness, most common)
  - Protanopia (red color blindness)
  - Tritanopia (blue-yellow color blindness)
- **Requirement**: ALL cell text SHALL meet WCAG AA contrast ratio (≥4.5:1)
- **Requirement**: Color SHALL NOT be the only way to distinguish values (text values also shown)

### Performance

- **Requirement**: Color calculation SHALL complete in <5ms per cell
- **Requirement**: Re-coloring all 36 cells SHALL complete in <50ms

### Visual Quality

- **Requirement**: Color transitions SHALL be smooth with no visible banding
- **Requirement**: Adjacent similarity values (e.g., 0.7 vs 0.71) SHALL have visually similar colors
- **Requirement**: Distant similarity values (e.g., 0.3 vs 0.9) SHALL have clearly distinct colors

---

## Implementation Notes

### Viridis Color Interpolation

```javascript
const VIRIDIS_COLOR_STOPS = [
  { value: 0.0, color: '#440154' }, // Deep purple
  { value: 0.3, color: '#31688e' }, // Blue
  { value: 0.5, color: '#35b779' }, // Green
  { value: 0.7, color: '#fde724' }, // Yellow
  { value: 1.0, color: '#ffffff' }  // White
];

function interpolateViridisColor(value, stops) {
  // Clamp value to [0, 1]
  value = Math.max(0, Math.min(1, value));

  // Find surrounding stops
  let lowerStop, upperStop;
  for (let i = 0; i < stops.length - 1; i++) {
    if (value >= stops[i].value && value <= stops[i + 1].value) {
      lowerStop = stops[i];
      upperStop = stops[i + 1];
      break;
    }
  }

  // Interpolate
  const t = (value - lowerStop.value) / (upperStop.value - lowerStop.value);
  return interpolateHex(lowerStop.color, upperStop.color, t);
}

function interpolateHex(hex1, hex2, t) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * t);
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * t);
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * t);

  return rgbToHex(r, g, b);
}
```

### Dynamic Text Color Selection

```javascript
function getTextColorForBackground(bgHex) {
  const rgb = hexToRgb(bgHex);
  const luminance = getRelativeLuminance(rgb.r, rgb.g, rgb.b);

  // Use white text for dark backgrounds (luminance < 0.5)
  // Use black text for light backgrounds (luminance >= 0.5)
  return luminance < 0.5 ? '#ffffff' : '#000000';
}

function getRelativeLuminance(r, g, b) {
  const linearize = (channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };

  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}
```

---

## Test Cases

| Test ID | Description | Expected Result |
|---------|-------------|-----------------|
| CS-01 | Low similarity color | Deep purple (#440154 region) |
| CS-02 | Medium-low color | Blue (#31688e region) |
| CS-03 | Medium color | Green (#35b779 region) |
| CS-04 | High color | Yellow (#fde724 region) |
| CS-05 | Very high color | White (#ffffff region) |
| CS-06 | Interpolation accuracy | Smooth gradient between stops |
| CS-07 | Dark bg text color | White text on purple/blue backgrounds |
| CS-08 | Light bg text color | Black text on yellow/white backgrounds |
| CS-09 | WCAG AA contrast | All cells meet ≥4.5:1 ratio |
| CS-10 | Deuteranopia test | Colors distinguishable in color-blind sim |
| CS-11 | Protanopia test | Colors distinguishable in color-blind sim |
| CS-12 | Performance | All 36 cells colored in <50ms |
| CS-13 | Old HSL removed | No HSL(70%, 75%) references remain |

---

## Color Blind Testing

Use one of these tools to validate color differentiation:
- **Coblis**: https://www.color-blindness.com/coblis-color-blindness-simulator/
- **Chromatic Vision Simulator**: Browser extension
- **Photoshop**: View > Proof Setup > Color Blindness

**Test procedure**:
1. Take screenshot of heatmap with viridis colors
2. Run through deuteranopia simulator
3. Verify that low (purple), medium (green), and high (yellow) similarities are still distinguishable
4. Repeat for protanopia and tritanopia

---

## Dependencies

- No external libraries required (manual interpolation)
- Browser support: All modern browsers (IE11 not required)

---

## Related Specs

- `value-display/spec.md` - Text color based on background luminance
- `legend-improvement/spec.md` - Legend shows viridis color swatches
- `axis-labels/spec.md` - Labels styled consistently with new color scheme
