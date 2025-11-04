# Spec: Navigation Layout and Text Simplification

**Capability**: `navigation-layout`
**Change**: `fix-navigation-alignment-and-text`
**Version**: 1.0.0

---

## MODIFIED Requirements

### REQ-MOD-001: Image-Critiques Vertical Alignment

The image display area top edge SHALL align horizontally with the critiques panel top edge, regardless of the artwork navigation bar position.

**Acceptance Criteria**:
- [ ] Image container top and critiques panel top are on the same horizontal line
- [ ] Artwork navigation bar does not occupy vertical layout space
- [ ] Navigation remains visually above the image display area
- [ ] Alignment is maintained across all responsive breakpoints (375px, 768px, 1024px, 1440px)

#### Scenario: Desktop Layout Alignment

**Given** the user is viewing the gallery on desktop (1440px width)
**When** the page renders with artwork-1 selected
**Then** the top edge of the image display area MUST be horizontally aligned with the top edge of the first critique card
**And** the artwork navigation bar MUST float above the image without pushing it downward

**Validation**:
```javascript
// Browser DevTools verification
const imageTop = document.querySelector('.image-display-container').getBoundingClientRect().top;
const critiqueTop = document.querySelector('.critiques-panel').getBoundingClientRect().top;
const tolerance = 1; // 1px tolerance for sub-pixel rendering

console.assert(
  Math.abs(imageTop - critiqueTop) <= tolerance,
  `Image and critiques misaligned: ${imageTop} vs ${critiqueTop}`
);
```

#### Scenario: Mobile Layout Alignment

**Given** the user is viewing the gallery on mobile (375px width)
**When** the page renders in vertical stack mode
**Then** the navigation bar MUST float above the image without creating vertical gap
**And** the image MUST start at the top of its container (no offset from navigation)

**Validation**:
```javascript
const wrapper = document.querySelector('.unified-navigation-wrapper');
const image = document.querySelector('.image-display-container');
const wrapperTop = wrapper.getBoundingClientRect().top;
const imageTop = image.getBoundingClientRect().top;

// Image should start at wrapper top (no gap from navigation)
console.assert(
  Math.abs(wrapperTop - imageTop) <= 1,
  `Image not at wrapper top: wrapper=${wrapperTop}, image=${imageTop}`
);
```

#### Scenario: Navigation Switches Artworks

**Given** the user is viewing artwork-1 with aligned layout
**When** the user clicks "Next Artwork ►" to switch to artwork-2
**Then** the alignment MUST be maintained (image top = critiques top)
**And** the navigation bar MUST remain floating above the new image

**Validation**: Same as Scenario 1 (verify after each artwork transition)

---

### REQ-MOD-002: Navigation Text English-Only Display

All visible navigation text (buttons and indicator) SHALL display in English only, removing bilingual Chinese/English spans.

**Acceptance Criteria**:
- [ ] Previous button displays: "◄ Previous Artwork" (no Chinese text)
- [ ] Next button displays: "Next Artwork ►" (no Chinese text)
- [ ] Indicator displays: "1 of 4" (English "of", not Chinese "的")
- [ ] No `<span lang="zh">` or `<span lang="en">` elements in navigation HTML
- [ ] Button and indicator text updates correctly when artwork changes

#### Scenario: Initial Render (First Artwork)

**Given** the gallery initializes on the first artwork (artwork-1)
**When** the unified navigation component renders
**Then** the previous button MUST display the text "◄ Previous Artwork"
**And** the next button MUST display the text "Next Artwork ►"
**And** the indicator MUST display "1 of 4"
**And** NO Chinese characters MUST appear in the navigation bar

**Validation**:
```javascript
const prevButton = document.querySelector('#unified-artwork-prev');
const nextButton = document.querySelector('#unified-artwork-next');
const indicator = document.querySelector('.artwork-indicator');

// Check button text (excluding icon spans)
const prevText = prevButton.querySelector('.button-text').textContent.trim();
const nextText = nextButton.querySelector('.button-text').textContent.trim();
const indicatorText = indicator.textContent.trim();

console.assert(prevText === 'Previous Artwork', `Prev button text: ${prevText}`);
console.assert(nextText === 'Next Artwork', `Next button text: ${nextText}`);
console.assert(indicatorText === '1 of 4', `Indicator text: ${indicatorText}`);

// Verify no Chinese language spans exist
const zhSpans = document.querySelectorAll('.artwork-navigation [lang="zh"]');
console.assert(zhSpans.length === 0, `Found ${zhSpans.length} Chinese spans (expected 0)`);
```

#### Scenario: Indicator Updates on Navigation

**Given** the user is on artwork-2 (indicator shows "2 of 4")
**When** the user clicks "Next Artwork ►" to go to artwork-3
**Then** the indicator MUST update to display "3 of 4"
**And** the separator MUST remain English ("of", not "的")

**Validation**:
```javascript
// After clicking next button
const indicator = document.querySelector('.artwork-indicator');
const separatorSpan = indicator.querySelector('.separator');

console.assert(indicator.textContent.trim() === '3 of 4', `Indicator: ${indicator.textContent}`);
console.assert(separatorSpan.textContent.trim() === 'of', `Separator: ${separatorSpan.textContent}`);
```

#### Scenario: Last Artwork (Boundary Condition)

**Given** the user is on artwork-4 (the last artwork)
**When** the navigation renders
**Then** the indicator MUST display "4 of 4"
**And** the next button MUST be disabled
**And** the button text MUST still be "Next Artwork ►" (not hidden)

**Validation**:
```javascript
const nextButton = document.querySelector('#unified-artwork-next');
const indicator = document.querySelector('.artwork-indicator');

console.assert(indicator.textContent.trim() === '4 of 4', 'Indicator at last artwork');
console.assert(nextButton.disabled === true, 'Next button disabled');
console.assert(nextButton.querySelector('.button-text').textContent.trim() === 'Next Artwork', 'Button text persists');
```

---

### REQ-MOD-003: Bilingual ARIA Labels Preserved

Navigation buttons SHALL maintain bilingual ARIA labels (Chinese + English artwork titles) for screen reader accessibility, even though visible text is English-only.

**Acceptance Criteria**:
- [ ] Previous button `aria-label` includes previous artwork's Chinese AND English title
- [ ] Next button `aria-label` includes next artwork's Chinese AND English title
- [ ] ARIA labels update correctly when navigating between artworks
- [ ] Disabled buttons have appropriate ARIA labels (no artwork title if no next/prev exists)

#### Scenario: ARIA Label on Next Button (Artwork-1 → Artwork-2)

**Given** the user is on artwork-1
**When** the next button renders
**Then** its `aria-label` MUST include artwork-2's title in both languages
**Example**: `"Next artwork: 绘画操作单元：第一代（模仿） Painting Operation Unit: First Generation (Imitation)"`

**Validation**:
```javascript
const nextButton = document.querySelector('#unified-artwork-next');
const ariaLabel = nextButton.getAttribute('aria-label');

// Should contain both Chinese and English title
console.assert(
  ariaLabel.includes('绘画操作单元') && ariaLabel.includes('Painting Operation Unit'),
  `ARIA label missing bilingual title: ${ariaLabel}`
);
```

#### Scenario: ARIA Label on Disabled Button (First Artwork)

**Given** the user is on artwork-1 (first artwork)
**When** the previous button renders
**Then** it MUST be disabled
**And** its `aria-label` MUST be generic: "Previous artwork" (no specific title)

**Validation**:
```javascript
const prevButton = document.querySelector('#unified-artwork-prev');

console.assert(prevButton.disabled === true, 'Prev button not disabled at first artwork');
console.assert(
  prevButton.getAttribute('aria-label') === 'Previous artwork',
  `ARIA label: ${prevButton.getAttribute('aria-label')}`
);
```

---

## ADDED Requirements

### REQ-ADD-001: Absolute Positioning CSS Implementation

The artwork navigation bar SHALL use absolute positioning within its wrapper to float above the image without occupying layout space.

**Acceptance Criteria**:
- [ ] `.artwork-navigation` has `position: absolute`
- [ ] `.artwork-navigation` has `top`, `left`, `right` positioning values
- [ ] `.artwork-navigation` has `z-index` >= 10
- [ ] `.unified-navigation-wrapper` has `position: relative` (container for absolute child)
- [ ] `.image-display-container` fills full height of wrapper (no gap from navigation)

#### Scenario: CSS Properties Verification

**Given** the navigation component is rendered
**When** inspecting computed styles
**Then** the navigation bar MUST have the following CSS properties:

```javascript
const nav = document.querySelector('.artwork-navigation');
const wrapper = document.querySelector('.unified-navigation-wrapper');
const styles = window.getComputedStyle(nav);
const wrapperStyles = window.getComputedStyle(wrapper);

console.assert(styles.position === 'absolute', `Nav position: ${styles.position}`);
console.assert(parseInt(styles.zIndex) >= 10, `Nav z-index: ${styles.zIndex}`);
console.assert(wrapperStyles.position === 'relative', `Wrapper position: ${wrapperStyles.position}`);
```

#### Scenario: Navigation Does Not Affect Layout Flow

**Given** the navigation bar is rendered
**When** measuring the wrapper's height
**Then** the wrapper height MUST equal the image display area height
**And** it MUST NOT include the navigation bar height

**Validation**:
```javascript
const wrapper = document.querySelector('.unified-navigation-wrapper');
const imageContainer = document.querySelector('.image-display-container');
const nav = document.querySelector('.artwork-navigation');

const wrapperHeight = wrapper.getBoundingClientRect().height;
const imageHeight = imageContainer.getBoundingClientRect().height;
const navHeight = nav.getBoundingClientRect().height;

// Wrapper height should match image height (nav doesn't contribute to layout)
console.assert(
  Math.abs(wrapperHeight - imageHeight) <= 2,
  `Wrapper height (${wrapperHeight}) doesn't match image height (${imageHeight})`
);

// Wrapper should NOT be (nav + image) height
console.assert(
  wrapperHeight < (navHeight + imageHeight - 10),
  `Navigation is occupying layout space (wrapper too tall)`
);
```

---

### REQ-ADD-002: Responsive Navigation Positioning

The navigation bar's absolute positioning SHALL adapt to different screen sizes with appropriate spacing adjustments.

**Acceptance Criteria**:
- [ ] Mobile (< 600px): Navigation has reduced `top`/`left`/`right` margins
- [ ] Desktop (> 1024px): Navigation has standard margins (`var(--spacing-md)`)
- [ ] Navigation never extends beyond image container boundaries
- [ ] Touch targets remain >= 44px on mobile (WCAG 2.1 AA)

#### Scenario: Mobile Responsive Margins

**Given** the user is on mobile (375px width)
**When** inspecting navigation position
**Then** navigation MUST have smaller margins to maximize screen space
**And** buttons MUST still be at least 44px tall for touch accessibility

**Validation**:
```javascript
// Simulate mobile viewport
window.resizeTo(375, 667);

const nav = document.querySelector('.artwork-navigation');
const styles = window.getComputedStyle(nav);
const buttons = document.querySelectorAll('.artwork-nav-button');

// Check margins are reduced (< 16px)
const top = parseInt(styles.top);
console.assert(top <= 16, `Mobile top margin too large: ${top}px`);

// Check touch target size
buttons.forEach(btn => {
  const btnHeight = btn.getBoundingClientRect().height;
  console.assert(btnHeight >= 44, `Button too small for touch: ${btnHeight}px`);
});
```

---

## REMOVED Requirements

### REQ-REMOVED-001: Language Toggle Support for Navigation Text

**Previous Requirement**: Navigation buttons and indicator SHALL display bilingual text (Chinese/English) controlled by `[data-lang]` CSS selectors

**Reason for Removal**: User feedback indicated Chinese numeric separator "1 的 4" reads awkwardly; English-only format ("1 of 4") is universally understood and reduces visual clutter

**Migration Path**: Replace bilingual `<span>` structure with single English text spans in `unified-navigation.js` (lines 350-390)

---

## Cross-Capability Dependencies

### Depends On:
- `unify-navigation-to-image-area` (predecessor change) - Provides the base `UnifiedNavigation` component

### Related Specs:
- `openspec/changes/unify-navigation-to-image-area/specs/unified-navigation/spec.md` - Original navigation component spec

---

## Test Coverage Matrix

| Requirement | Unit Test | Integration Test | Visual Test | A11y Test |
|-------------|-----------|------------------|-------------|-----------|
| NAV-ALIGN-001 | N/A | ✅ Browser layout | ✅ Screenshot | N/A |
| NAV-TEXT-002 | ✅ Text generation | ✅ Render output | ✅ Visual check | N/A |
| NAV-ARIA-003 | ✅ Label generation | ✅ DOM attributes | N/A | ✅ Screen reader |
| NAV-CSS-004 | N/A | ✅ Computed styles | ✅ Z-index check | N/A |
| NAV-RESP-005 | N/A | ✅ Multi-viewport | ✅ Responsive | ✅ Touch targets |

---

## Performance Requirements

### Rendering Performance
- **Target**: Layout shift from static to absolute positioning MUST complete within 16ms (1 frame at 60fps)
- **Measurement**: Chrome DevTools Performance panel → "Layout Shift" metric

### Accessibility Performance
- **Target**: ARIA label announcement MUST complete within 2 seconds on screen reader
- **Measurement**: Manual testing with NVDA/JAWS

---

## Browser Compatibility

**Supported Browsers**:
- Chrome/Edge 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅

**CSS Features Used**:
- `position: absolute` (universal support)
- CSS variables (IE11 not supported, acceptable)
- `z-index` (universal support)

---

## Validation Checklist

### Manual QA Checklist
- [ ] Image top aligns with critiques top (desktop 1440px)
- [ ] Image top aligns with critiques top (tablet 768px)
- [ ] Navigation floats above image (mobile 375px)
- [ ] Buttons display "◄ Previous Artwork" and "Next Artwork ►"
- [ ] Indicator displays "1 of 4", "2 of 4", etc.
- [ ] No Chinese characters visible in navigation
- [ ] ARIA labels include bilingual artwork titles
- [ ] Keyboard navigation works (Shift+Arrow)
- [ ] Focus indicators visible on buttons
- [ ] Touch targets >= 44px on mobile

### Automated Validation
```bash
# Run browser tests
npm run test:browser

# Run accessibility tests
npm run test:a11y

# Run visual regression tests
npm run test:visual
```

---

## Rollback Criteria

**Trigger Rollback If**:
1. Navigation occludes critical image content (> 20% of image height)
2. ARIA labels break screen reader functionality
3. Alignment fails on any supported browser/viewport
4. Performance degradation (> 100ms render time)

**Rollback Steps**:
1. Revert CSS changes to `styles/components/unified-navigation.css`
2. Revert JS changes to `js/components/unified-navigation.js`
3. Clear browser cache and verify rollback
4. Document issue in `openspec/changes/fix-navigation-alignment-and-text/ROLLBACK.md`
