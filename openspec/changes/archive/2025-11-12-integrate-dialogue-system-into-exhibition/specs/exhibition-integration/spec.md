# Spec: Exhibition Integration

**Feature**: Exhibition Integration
**Change**: `integrate-dialogue-system-into-exhibition`
**Last Updated**: 2025-11-12

## ADDED Requirements

### Requirement: Dialogue Page Creation
**ID**: EXH-INT-001
**Priority**: MUST

The system SHALL create a dedicated dialogue player page within each exhibition directory structure.

**Acceptance Criteria**:
- Page located at `/exhibitions/{exhibition-id}/dialogues.html`
- Page follows existing exhibition template structure
- Page loads independently without errors
- Page integrates with global navigation system

#### Scenario: User navigates to dialogue page directly
**Given** the exhibition has dialogue data for 38 artworks
**And** the user knows the direct URL
**When** the user navigates to `/exhibitions/negative-space-of-the-tide/dialogues.html?artwork=artwork-5`
**Then** the dialogue page SHALL load successfully
**And** artwork-5 dialogue SHALL be displayed
**And** artwork-5 image SHALL be loaded (or placeholder if missing)
**And** global navigation SHALL highlight "对话" (Dialogues) menu item

**Test Code**:
```javascript
// Navigate directly to dialogue page
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/dialogues.html?artwork=artwork-5');

// Verify page loaded
const title = await page.title();
assert(title.includes('对话') || title.includes('Dialogue'));

// Verify artwork data loaded
const messageCount = await page.locator('.dialogue-message').count();
assert(messageCount >= 1, 'At least one message should be visible');

// Verify image loaded or placeholder shown
const image = await page.locator('.artwork-image');
assert(await image.isVisible());
```

---

### Requirement: URL Parameter Handling
**ID**: EXH-INT-002
**Priority**: MUST

The dialogue page SHALL parse the `artwork` URL parameter to determine which artwork's dialogue to display.

**Acceptance Criteria**:
- Parse `?artwork=artwork-X` from URL
- Load corresponding dialogue data from `js/data/dialogues/artwork-X.js`
- Load corresponding artwork metadata from `data.json`
- Handle missing or invalid artwork IDs gracefully

#### Scenario: User navigates with valid artwork ID
**Given** the exhibition has dialogue for artwork-5
**When** the user navigates to `dialogues.html?artwork=artwork-5`
**Then** the system SHALL parse the parameter correctly
**And** artwork-5 dialogue data SHALL be loaded
**And** artwork-5 metadata (title, artist, year) SHALL be loaded
**And** the dialogue player SHALL initialize with artwork-5 data

**Test Code**:
```javascript
// Navigate with artwork parameter
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/dialogues.html?artwork=artwork-10');

// Verify correct artwork loaded
const artworkTitle = await page.locator('.artwork-title').textContent();
assert(artworkTitle.includes('artwork-10') || artworkTitle.length > 0);

// Verify dialogue data matches artwork-10
const firstMessage = await page.locator('.dialogue-message').first();
const messageId = await firstMessage.getAttribute('data-message-id');
assert(messageId.includes('artwork-10'));
```

#### Scenario: User navigates without artwork parameter
**Given** no artwork parameter is provided
**When** the user navigates to `dialogues.html` (no query string)
**Then** the system SHALL show an artwork selector interface
**Or** redirect to the first artwork (artwork-1)
**And** the user SHALL be able to select an artwork

**Test Code**:
```javascript
// Navigate without parameter
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/dialogues.html');

// Verify selector or redirect
const url = page.url();
if (url.includes('artwork=')) {
  // Redirected to artwork-1
  assert(url.includes('artwork=artwork-1'));
} else {
  // Selector shown
  const selector = await page.locator('.artwork-selector');
  assert(await selector.isVisible());
}
```

#### Scenario: User navigates with invalid artwork ID
**Given** an invalid artwork ID is provided
**When** the user navigates to `dialogues.html?artwork=invalid-123`
**Then** the system SHALL display an error message
**And** provide a link to return to exhibition index
**Or** redirect to artwork selector

**Test Code**:
```javascript
// Navigate with invalid parameter
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/dialogues.html?artwork=invalid-123');

// Verify error handling
const errorMessage = await page.locator('.error-message');
assert(await errorMessage.isVisible());

const returnLink = await page.locator('a[href*="index.html"]');
assert(await returnLink.isVisible());
```

---

### Requirement: Exhibition Index Navigation
**ID**: EXH-INT-003
**Priority**: SHOULD

The exhibition index page SHALL provide navigation links to the dialogue page for each artwork.

**Acceptance Criteria**:
- Each artwork card has a "View Dialogue" button or link
- Button visible on hover (desktop) or always visible (mobile)
- Clicking button navigates to `dialogues.html?artwork={artworkId}`
- Button styled consistently with existing exhibition UI

#### Scenario: User clicks artwork card to view dialogue
**Given** the user is on the exhibition index page
**And** the exhibition has dialogues for all 38 artworks
**When** the user hovers over artwork-5 card
**Then** a "View Dialogue" button SHALL appear
**When** the user clicks the button
**Then** the browser SHALL navigate to `dialogues.html?artwork=artwork-5`
**And** the dialogue page SHALL load with artwork-5 data

**Test Code**:
```javascript
// Visit exhibition index
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/');

// Find artwork-5 card
const artworkCard = await page.locator('[data-artwork-id="artwork-5"]');
await artworkCard.hover();

// Verify dialogue button appears
const dialogueButton = await artworkCard.locator('.view-dialogue-btn');
await expect(dialogueButton).toBeVisible({ timeout: 1000 });

// Click button
await dialogueButton.click();

// Verify navigation
await expect(page).toHaveURL(/dialogues\.html\?artwork=artwork-5/);
```

---

### Requirement: Browser Navigation Integration
**ID**: EXH-INT-004
**Priority**: MUST

The dialogue page SHALL integrate with browser navigation (back/forward buttons).

**Acceptance Criteria**:
- Back button returns to exhibition index (or referrer page)
- Forward button restores dialogue page state
- URL changes when navigating between artworks
- Browser history preserved correctly

#### Scenario: User navigates back from dialogue page
**Given** the user navigated from exhibition index to dialogue page
**When** the user clicks the browser back button
**Then** the browser SHALL navigate back to exhibition index
**And** the exhibition grid SHALL be displayed
**And** the scroll position SHOULD be preserved (if possible)

**Test Code**:
```javascript
// Start at exhibition index
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/');

// Navigate to dialogue
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/dialogues.html?artwork=artwork-5');
assert(page.url().includes('dialogues.html'));

// Go back
await page.goBack();

// Verify returned to index
assert(page.url().endsWith('negative-space-of-the-tide/') || page.url().includes('index.html'));

// Verify grid visible
const artworkGrid = await page.locator('.artworks-grid');
assert(await artworkGrid.isVisible());
```

---

### Requirement: Artwork Navigation
**ID**: EXH-INT-005
**Priority**: SHOULD

The dialogue page SHALL provide navigation controls to move between artworks.

**Acceptance Criteria**:
- Previous/Next buttons visible (arrows or text)
- Previous button navigates to `?artwork=artwork-{N-1}`
- Next button navigates to `?artwork=artwork-{N+1}`
- First artwork disables Previous button
- Last artwork disables Next button

#### Scenario: User navigates to next artwork
**Given** the user is viewing artwork-5 dialogue
**And** the exhibition has artwork-6 dialogue
**When** the user clicks the "Next" button
**Then** the URL SHALL change to `?artwork=artwork-6`
**And** artwork-6 dialogue SHALL load
**And** artwork-6 image SHALL be displayed
**And** the dialogue player SHALL reset and auto-play artwork-6

**Test Code**:
```javascript
// View artwork-5
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/dialogues.html?artwork=artwork-5');

// Click next button
const nextButton = await page.locator('.artwork-nav-next');
await nextButton.click();

// Verify navigation to artwork-6
await expect(page).toHaveURL(/artwork=artwork-6/);

// Verify new dialogue loaded
await page.waitForSelector('[data-message-id*="artwork-6"]');
const firstMessage = await page.locator('.dialogue-message').first();
const messageId = await firstMessage.getAttribute('data-message-id');
assert(messageId.includes('artwork-6'));
```

#### Scenario: User cannot navigate before first artwork
**Given** the user is viewing artwork-1 dialogue
**When** the page loads
**Then** the "Previous" button SHALL be disabled
**And** clicking it SHALL have no effect

**Test Code**:
```javascript
// View artwork-1
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/dialogues.html?artwork=artwork-1');

// Verify previous button disabled
const prevButton = await page.locator('.artwork-nav-prev');
assert(await prevButton.isDisabled() || !(await prevButton.isVisible()));

// Try clicking (should be no-op)
await prevButton.click({ force: true });
await page.waitForTimeout(500);

// Verify still on artwork-1
assert(page.url().includes('artwork=artwork-1'));
```

---

## MODIFIED Requirements

None. This is a new feature addition with no modifications to existing functionality.

---

## REMOVED Requirements

None. No features are being removed.

---

## Cross-References

- **Depends On**: `split-view-layout` spec (layout structure)
- **Depends On**: `display-state-fixes` spec (correct message visibility)
- **Related**: Phase 3.2 dialogue data generation (already completed)
- **Related**: Existing critique system (remains unchanged)

---

## Validation Checklist

- [ ] All 5 requirements have passing test scenarios
- [ ] URL parameter handling tested with valid/invalid inputs
- [ ] Browser navigation (back/forward) tested
- [ ] Artwork navigation (prev/next) tested
- [ ] Mobile and desktop viewport tested
- [ ] Language switching tested (EN/中)
- [ ] Cross-browser tested (Chrome, Firefox, Safari)
