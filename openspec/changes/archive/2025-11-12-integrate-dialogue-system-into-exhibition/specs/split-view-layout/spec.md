# Spec: Split-View Layout

**Feature**: Split-View Layout
**Change**: `integrate-dialogue-system-into-exhibition`
**Last Updated**: 2025-11-12

## ADDED Requirements

### Requirement: Desktop Split-View Layout
**ID**: LAYOUT-001
**Priority**: MUST

The dialogue page SHALL display a split-view layout on desktop devices (viewport width > 768px) with artwork image on the left (40% width) and dialogue player on the right (60% width).

**Acceptance Criteria**:
- CSS Grid used for layout
- Left panel: 40% width, sticky positioning
- Right panel: 60% width, scrollable
- Gap between panels: 2rem
- Max container width: 1600px, centered

#### Scenario: User views dialogue on desktop (1920px)
**Given** the viewport width is 1920px
**When** the user loads any artwork dialogue page
**Then** the layout SHALL be split into two columns
**And** the left column SHALL occupy 40% width
**And** the right column SHALL occupy 60% width
**And** the artwork image SHALL remain visible while scrolling dialogue

**Test Code**:
```javascript
// Set desktop viewport
await page.setViewportSize({ width: 1920, height: 1080 });
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/dialogues.html?artwork=artwork-5');

// Verify split layout
const container = await page.locator('.dialogue-page-container');
const gridColumns = await container.evaluate(el =>
  window.getComputedStyle(el).gridTemplateColumns
);

// Should be "40% 60%" or similar (px values also acceptable)
assert(gridColumns.includes('40') || gridColumns.split(' ').length === 2);

// Verify sticky positioning
const artworkPanel = await page.locator('.artwork-panel');
const position = await artworkPanel.evaluate(el =>
  window.getComputedStyle(el).position
);
assert(position === 'sticky');
```

#### Scenario: User scrolls dialogue on desktop
**Given** the viewport is 1440px wide
**And** the dialogue has 10+ messages
**When** the user scrolls down the page
**Then** the artwork image SHALL remain fixed in the viewport (sticky)
**And** the dialogue messages SHALL scroll independently

**Test Code**:
```javascript
// Set desktop viewport
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/dialogues.html?artwork=artwork-5');

// Wait for dialogue to load
await page.waitForSelector('.dialogue-message', { timeout: 5000 });

// Get initial image position
const artworkPanel = await page.locator('.artwork-panel');
const initialTop = await artworkPanel.boundingBox().then(box => box.y);

// Scroll down 500px
await page.evaluate(() => window.scrollBy(0, 500));
await page.waitForTimeout(500);

// Get new image position
const newTop = await artworkPanel.boundingBox().then(box => box.y);

// Image should have moved (sticky behavior) but stayed in viewport
assert(newTop >= 0, 'Image should still be visible');
assert(Math.abs(newTop - initialTop) < 100, 'Image should stay near top of viewport');
```

---

### Requirement: Mobile Stacked Layout
**ID**: LAYOUT-002
**Priority**: MUST

The dialogue page SHALL display a stacked layout on mobile devices (viewport width ≤ 768px) with artwork image above dialogue player.

**Acceptance Criteria**:
- Single column layout
- Artwork image: full width, static positioning
- Dialogue player: full width, scrollable
- Gap between sections: 1rem
- No sticky positioning on mobile

#### Scenario: User views dialogue on mobile (375px)
**Given** the viewport width is 375px
**When** the user loads any artwork dialogue page
**Then** the layout SHALL be a single column
**And** the artwork image SHALL be displayed at the top
**And** the dialogue player SHALL be displayed below the image
**And** the user SHALL scroll through both sections vertically

**Test Code**:
```javascript
// Set mobile viewport
await page.setViewportSize({ width: 375, height: 667 });
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/dialogues.html?artwork=artwork-5');

// Verify single column layout
const container = await page.locator('.dialogue-page-container');
const gridColumns = await container.evaluate(el =>
  window.getComputedStyle(el).gridTemplateColumns
);

// Should be "1fr" or single column
assert(!gridColumns.includes('40%') && !gridColumns.includes('60%'));

// Verify artwork panel is not sticky
const artworkPanel = await page.locator('.artwork-panel');
const position = await artworkPanel.evaluate(el =>
  window.getComputedStyle(el).position
);
assert(position === 'static' || position === 'relative');

// Verify stacking order (image above dialogue)
const imageBox = await page.locator('.artwork-image').boundingBox();
const dialogueBox = await page.locator('.dialogue-panel').boundingBox();
assert(imageBox.y < dialogueBox.y, 'Image should be above dialogue');
```

---

### Requirement: Responsive Breakpoint Transition
**ID**: LAYOUT-003
**Priority**: MUST

The layout SHALL transition smoothly between desktop and mobile layouts at the 768px breakpoint.

**Acceptance Criteria**:
- Breakpoint triggers at 768px viewport width
- Layout changes without page reload
- No horizontal scrollbars at any width
- Content remains readable during transition

#### Scenario: User resizes window from desktop to mobile
**Given** the viewport starts at 1024px wide (desktop layout)
**When** the user resizes the window to 700px wide
**Then** the layout SHALL change to mobile (stacked)
**And** the artwork image SHALL no longer be sticky
**And** the dialogue SHALL remain readable

**Test Code**:
```javascript
// Start at desktop size
await page.setViewportSize({ width: 1024, height: 768 });
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/dialogues.html?artwork=artwork-5');

// Verify desktop layout
let gridColumns = await page.locator('.dialogue-page-container').evaluate(el =>
  window.getComputedStyle(el).gridTemplateColumns
);
assert(gridColumns.split(' ').length === 2, 'Should be 2 columns');

// Resize to mobile
await page.setViewportSize({ width: 700, height: 768 });
await page.waitForTimeout(300); // Allow CSS transition

// Verify mobile layout
gridColumns = await page.locator('.dialogue-page-container').evaluate(el =>
  window.getComputedStyle(el).gridTemplateColumns
);
assert(!gridColumns.includes('40%'), 'Should be 1 column');

// Verify no horizontal scroll
const hasHorizontalScroll = await page.evaluate(() =>
  document.documentElement.scrollWidth > document.documentElement.clientWidth
);
assert(!hasHorizontalScroll, 'Should not have horizontal scrollbar');
```

---

### Requirement: Artwork Image Aspect Ratio Preservation
**ID**: LAYOUT-004
**Priority**: MUST

The artwork image SHALL preserve its original aspect ratio at all viewport sizes using `object-fit: contain`.

**Acceptance Criteria**:
- Image uses `object-fit: contain` CSS property
- Width: 100% of container
- Height: auto or constrained by max-height
- No distortion or cropping
- Works with any aspect ratio (square, portrait, landscape)

#### Scenario: User views artwork with landscape aspect ratio
**Given** an artwork has a 3:2 landscape image
**When** the user loads the dialogue page
**Then** the image SHALL display with correct proportions
**And** the image SHALL not be stretched or squashed

**Test Code**:
```javascript
// Load dialogue with landscape image
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/dialogues.html?artwork=artwork-5');

// Get image element
const image = await page.locator('.artwork-image');
await image.waitFor({ state: 'visible' });

// Verify object-fit property
const objectFit = await image.evaluate(el =>
  window.getComputedStyle(el).objectFit
);
assert(objectFit === 'contain', 'Image should use object-fit: contain');

// Verify natural vs display dimensions (aspect ratio preserved)
const dimensions = await image.evaluate(el => ({
  naturalWidth: el.naturalWidth,
  naturalHeight: el.naturalHeight,
  displayWidth: el.clientWidth,
  displayHeight: el.clientHeight
}));

const naturalRatio = dimensions.naturalWidth / dimensions.naturalHeight;
const displayRatio = dimensions.displayWidth / dimensions.displayHeight;

// Allow 5% variance for container constraints
assert(Math.abs(naturalRatio - displayRatio) / naturalRatio < 0.05 ||
       dimensions.displayHeight < dimensions.naturalHeight,
       'Aspect ratio should be preserved');
```

#### Scenario: User views artwork with portrait aspect ratio
**Given** an artwork has a 2:3 portrait image
**When** the user loads the dialogue page
**Then** the image SHALL display with correct proportions
**And** the image SHALL fit within the container without cropping

**Test Code**:
```javascript
// Load dialogue with portrait image
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/dialogues.html?artwork=artwork-15');

// Get container and image
const container = await page.locator('.artwork-panel');
const image = await page.locator('.artwork-image');

// Verify image fits within container
const containerBox = await container.boundingBox();
const imageBox = await image.boundingBox();

assert(imageBox.width <= containerBox.width, 'Image should not overflow container width');
assert(imageBox.height <= containerBox.height || containerBox.height === 0,
       'Image should not overflow container height (or container is auto-height)');
```

---

### Requirement: Image Loading and Placeholder
**ID**: LAYOUT-005
**Priority**: MUST

The system SHALL load artwork images with lazy loading and display placeholders for missing images.

**Acceptance Criteria**:
- Images use `loading="lazy"` attribute
- Missing images trigger placeholder display
- Placeholder shows artwork metadata (title, artist, year)
- Placeholder uses existing system (Phase 1 implementation)

#### Scenario: User loads dialogue with existing image
**Given** artwork-5 has an image file at `assets/artwork-5.jpg`
**When** the user loads artwork-5 dialogue
**Then** the image SHALL load with lazy loading
**And** the image SHALL display correctly

**Test Code**:
```javascript
// Load dialogue with existing image
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/dialogues.html?artwork=artwork-5');

// Verify image element
const image = await page.locator('.artwork-image');
await image.waitFor({ state: 'visible', timeout: 5000 });

// Verify lazy loading attribute
const loading = await image.getAttribute('loading');
assert(loading === 'lazy', 'Image should have loading="lazy"');

// Verify image loaded (not placeholder)
const src = await image.getAttribute('src');
assert(src.includes('artwork-5') && !src.includes('placeholder'),
       'Should load actual image');
```

#### Scenario: User loads dialogue with missing image
**Given** artwork-99 has no image file
**When** the user loads artwork-99 dialogue
**Then** the system SHALL display a placeholder
**And** the placeholder SHALL show artwork metadata

**Test Code**:
```javascript
// Load dialogue with missing image
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/dialogues.html?artwork=artwork-99');

// Wait for placeholder or error handling
await page.waitForSelector('.artwork-placeholder, .artwork-image', { timeout: 5000 });

// Verify placeholder shown or error handled gracefully
const placeholder = await page.locator('.artwork-placeholder');
if (await placeholder.isVisible()) {
  // Verify metadata displayed
  const title = await placeholder.locator('.placeholder-title');
  assert(await title.isVisible(), 'Placeholder should show title');
} else {
  // Fallback image loaded
  const image = await page.locator('.artwork-image');
  const src = await image.getAttribute('src');
  assert(src.includes('placeholder') || src.includes('default'),
         'Should load fallback image');
}
```

---

## MODIFIED Requirements

None. This is a new feature addition.

---

## REMOVED Requirements

None.

---

## Cross-References

- **Depends On**: `exhibition-integration` spec (page structure)
- **Related**: Phase 1 `fix-artwork-image-display-system` (placeholder system)
- **Related**: Existing responsive design patterns in `styles/main.css`

---

## Validation Checklist

- [ ] Desktop split-view tested at 1024px, 1440px, 1920px
- [ ] Mobile stacked layout tested at 375px, 414px, 768px
- [ ] Breakpoint transition tested (resize window)
- [ ] Aspect ratio preservation tested with landscape and portrait images
- [ ] Lazy loading verified in Network tab
- [ ] Placeholder system tested with missing images
- [ ] No horizontal scrollbars at any width
- [ ] Sticky positioning works on desktop
- [ ] No sticky positioning on mobile
