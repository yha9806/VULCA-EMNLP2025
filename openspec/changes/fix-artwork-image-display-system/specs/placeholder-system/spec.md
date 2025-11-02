# Spec: Artwork Image Placeholder System

## Overview

This spec defines the placeholder system that displays artwork metadata when image files are missing, ensuring the gallery remains functional and visually coherent during asset acquisition.

---

## ADDED Requirements

### Requirement: Display Placeholder When Image Fails to Load

**Identifier**: `placeholder-system-001`

When an artwork image fails to load (404 error, network timeout, or missing file), the system SHALL display a CSS-based placeholder containing artwork metadata.

**Rationale**: Prevents broken image icons, provides context to users, enables development/testing without real images.

**Dependencies**: None

**Priority**: P0 (Critical - blocks all visual validation)

#### Scenario: Missing Image Shows Metadata Placeholder

**Given** artwork data exists in `js/data.js` with `imageUrl: "/assets/artwork-1.jpg"`
**And** the file `/assets/artwork-1.jpg` does not exist
**When** gallery-hero renderer attempts to load the image
**Then** the `img.onerror` event fires
**And** a placeholder `<div class="artwork-placeholder">` is rendered
**And** the placeholder displays:
  - Artwork title in Chinese (`titleZh`)
  - Artwork title in English (`titleEn`)
  - Artist name (`artist`)
  - Year (`year`)
  - "Image Pending Acquisition" status message

**Validation**:
```javascript
// Test in browser console
const container = document.getElementById('artwork-image-container');
const placeholder = container.querySelector('.artwork-placeholder');
assert(placeholder !== null, 'Placeholder should exist');
assert(placeholder.textContent.includes('记忆'), 'Should show Chinese title');
assert(placeholder.textContent.includes('Memory'), 'Should show English title');
```

#### Scenario: Successful Image Load Skips Placeholder

**Given** artwork data with `imageUrl: "/assets/artwork-1.jpg"`
**And** the file `/assets/artwork-1.jpg` exists and is valid
**When** gallery-hero renderer loads the image
**Then** the image displays normally in `<img>` element
**And** no placeholder is shown
**And** no error is logged to console

---

### Requirement: Unique Visual Identity Per Artwork Placeholder

**Identifier**: `placeholder-system-002`

Each artwork's placeholder SHALL have a unique visual identity using different gradient backgrounds to distinguish artworks visually.

**Rationale**: Helps users differentiate artworks even without images, provides aesthetic continuity, aids testing.

**Dependencies**: `placeholder-system-001`

**Priority**: P1 (High - improves UX)

#### Scenario: Different Artworks Have Different Placeholder Colors

**Given** 4 artworks with IDs "artwork-1" through "artwork-4"
**When** placeholders are rendered for each artwork
**Then** each placeholder has class `artwork-{id}` (e.g., `artwork-1`)
**And** CSS gradients are defined per artwork:
  - `artwork-1`: Blue-purple gradient (#667eea → #764ba2)
  - `artwork-2`: Green-teal gradient (#11998e → #38ef7d)
  - `artwork-3`: Orange-red gradient (#eb3349 → #f45c43)
  - `artwork-4`: Pink-purple gradient (#d66d75 → #e29587)

**Validation**:
```javascript
const placeholder1 = document.querySelector('.artwork-1.artwork-placeholder');
const bgColor = window.getComputedStyle(placeholder1).background;
assert(bgColor.includes('linear-gradient'), 'Should have gradient background');
```

---

### Requirement: Responsive Placeholder Sizing

**Identifier**: `placeholder-system-003`

Placeholders SHALL maintain the same responsive sizing behavior as real artwork images across all breakpoints.

**Rationale**: Ensures layout consistency, validates responsive design, prevents layout shift when images load.

**Dependencies**: `responsive-layout-optimization` (spec)

**Priority**: P1 (High - critical for responsive testing)

#### Scenario: Placeholder Respects Responsive Breakpoints

**Given** placeholder is rendered in artwork-image-container
**When** viewport width is 375px (mobile)
**Then** placeholder width is 100% of container
**And** aspect-ratio is 3:2 (maintained via CSS)

**When** viewport width is 768px (tablet)
**Then** placeholder width is 100% of container
**And** aspect-ratio is 3:2

**When** viewport width is 1024px (desktop)
**Then** placeholder width is 70% of viewport width
**And** aspect-ratio is 3:2

**Validation**:
```javascript
// Test at 1024px viewport
const placeholder = document.querySelector('.artwork-placeholder');
const rect = placeholder.getBoundingClientRect();
const aspectRatio = rect.width / rect.height;
assert(Math.abs(aspectRatio - 1.5) < 0.1, 'Aspect ratio should be ~3:2');
```

---

### Requirement: Console Logging for Missing Images

**Identifier**: `placeholder-system-004`

When an image fails to load, the system SHALL log a warning to the browser console indicating which image is missing.

**Rationale**: Aids debugging, provides visibility into missing assets, helps developers track asset acquisition progress.

**Dependencies**: None

**Priority**: P2 (Medium - developer experience)

#### Scenario: Missing Image Logged to Console

**Given** artwork with `imageUrl: "/assets/artwork-1.jpg"`
**And** the file does not exist
**When** image load fails
**Then** console displays warning: `⚠ Image not found: /assets/artwork-1.jpg`
**And** warning includes artwork ID for traceability

**Validation**:
```javascript
// Monitor console in browser dev tools
// Expected output:
// ⚠ Image not found: /assets/artwork-1.jpg (artwork-1)
```

---

### Requirement: Placeholder Accessibility

**Identifier**: `placeholder-system-005`

Placeholders SHALL be accessible to screen readers and keyboard navigation, providing equivalent information to visual users.

**Rationale**: Ensures WCAG compliance, supports users with visual impairments, maintains semantic HTML.

**Dependencies**: None

**Priority**: P1 (High - accessibility requirement)

#### Scenario: Screen Reader Announces Placeholder Content

**Given** placeholder is rendered for artwork
**When** screen reader focuses on placeholder
**Then** it announces: "[Chinese Title] [English Title], [Artist], [Year], Image Pending Acquisition"
**And** placeholder has appropriate ARIA labels

**Validation**:
```html
<div class="artwork-placeholder artwork-1"
     role="img"
     aria-label="记忆（绘画操作单元：第二代） Memory (Painting Operation Unit: Second Generation), Sougwen Chung, 2022, Image Pending Acquisition">
  <!-- content -->
</div>
```

---

## MODIFIED Requirements

None (this is a new capability)

---

## REMOVED Requirements

None

---

## Cross-References

- **Related Specs**:
  - `responsive-layout-optimization` - Placeholder sizing must respect responsive breakpoints
  - `scroll-reveal-animations` - Placeholders may use reveal animations

- **Related Changes**:
  - `immersive-autoplay-with-details` (archived) - Gallery hero renderer is the primary consumer

---

## Implementation Notes

### CSS Structure

```css
/* Base placeholder styles */
.artwork-placeholder {
  aspect-ratio: 3/2;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  border-radius: 8px;
  color: white;
}

/* Unique gradients per artwork */
.artwork-placeholder.artwork-1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.artwork-placeholder.artwork-2 {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.artwork-placeholder.artwork-3 {
  background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
}

.artwork-placeholder.artwork-4 {
  background: linear-gradient(135deg, #d66d75 0%, #e29587 100%);
}

/* Content styling */
.placeholder-content {
  max-width: 500px;
}

.placeholder-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.placeholder-title-en {
  font-size: 1.2rem;
  font-style: italic;
  margin-bottom: 1rem;
}

.placeholder-meta {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.placeholder-status {
  font-size: 0.875rem;
  opacity: 0.8;
  font-style: italic;
}
```

### JavaScript Structure

```javascript
// In js/gallery-hero.js, modify renderArtworkImage function

function renderArtworkImage(carousel) {
  const container = document.getElementById('artwork-image-container');
  if (!container) return;

  const artwork = carousel.getCurrentArtwork();
  if (!artwork) return;

  container.innerHTML = '';

  const img = document.createElement('img');
  img.src = artwork.imageUrl;
  img.alt = `${artwork.titleZh} ${artwork.titleEn}`;
  img.loading = 'eager';

  // Add error handler for missing images
  img.onerror = () => {
    console.warn(`⚠ Image not found: ${artwork.imageUrl} (${artwork.id})`);
    container.innerHTML = '';
    const placeholder = createPlaceholder(artwork);
    container.appendChild(placeholder);
  };

  const figure = document.createElement('figure');
  figure.className = 'artwork-image';
  figure.appendChild(img);
  container.appendChild(figure);

  console.log(`✓ Rendering artwork: ${artwork.titleZh}`);
}

function createPlaceholder(artwork) {
  const div = document.createElement('div');
  div.className = `artwork-placeholder ${artwork.id}`;
  div.setAttribute('role', 'img');
  div.setAttribute('aria-label',
    `${artwork.titleZh} ${artwork.titleEn}, ${artwork.artist}, ${artwork.year}, Image Pending Acquisition`
  );

  div.innerHTML = `
    <div class="placeholder-content">
      <h3 class="placeholder-title" lang="zh">${artwork.titleZh}</h3>
      <p class="placeholder-title-en" lang="en">${artwork.titleEn}</p>
      <p class="placeholder-meta">${artwork.artist} • ${artwork.year}</p>
      <p class="placeholder-status">🖼️ Image Pending Acquisition</p>
    </div>
  `;

  return div;
}
```

---

## Testing Checklist

- [ ] Placeholder displays when image URL is 404
- [ ] Placeholder displays when network is offline
- [ ] Placeholder shows correct artwork metadata (title, artist, year)
- [ ] Each artwork has unique gradient color
- [ ] Placeholder maintains 3:2 aspect ratio
- [ ] Placeholder is responsive across all breakpoints (375/768/1024/1440/1920px)
- [ ] Console warning logged for missing images
- [ ] Screen reader announces placeholder content correctly
- [ ] Placeholder has ARIA role="img"
- [ ] Placeholder supports keyboard navigation
- [ ] When real image loads, placeholder is replaced
- [ ] No layout shift when transitioning placeholder → image
