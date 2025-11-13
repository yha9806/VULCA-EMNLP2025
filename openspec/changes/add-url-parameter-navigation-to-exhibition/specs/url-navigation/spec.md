# Spec: URL Parameter Navigation

**Feature**: URL Parameter Navigation
**Change**: `add-url-parameter-navigation-to-exhibition`
**Last Updated**: 2025-11-12

## ADDED Requirements

### Requirement: URL Parameter Parsing on Page Load
**ID**: URL-NAV-001
**Priority**: MUST

The exhibition page SHALL parse the `artwork` URL parameter on page load and initialize the gallery with the specified artwork.

**Acceptance Criteria**:
- Parse `?artwork=artwork-X` using URLSearchParams
- Validate artwork ID exists in VULCA_DATA.artworks
- Default to 'artwork-1' if parameter missing or invalid
- Initialize gallery with correct artwork index

#### Scenario: User loads page with valid artwork parameter
**Given** the exhibition has 38 artworks (artwork-1 through artwork-38)
**When** the user navigates to `index.html?artwork=artwork-7`
**Then** the page SHALL load artwork-7
**And** artwork-7 image SHALL be displayed
**And** artwork-7 dialogue SHALL be initialized
**And** navigation buttons SHALL show "Artwork 7 of 38"

**Test Code**:
```javascript
// Navigate to artwork-7
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/index.html?artwork=artwork-7');

// Wait for gallery to initialize
await page.waitForSelector('[data-artwork-id="artwork-7"]', { timeout: 5000 });

// Verify artwork metadata
const title = await page.locator('.artwork-header h2').textContent();
assert(title.includes('我永远在你的背后') || title.includes('I Am Always Behind You'));

// Verify navigation counter
const counter = await page.locator('.artwork-nav-counter').textContent();
assert(counter.includes('7'));
```

#### Scenario: User loads page without artwork parameter
**Given** no URL parameter is provided
**When** the user navigates to `index.html`
**Then** the page SHALL default to artwork-1
**And** artwork-1 SHALL be displayed

**Test Code**:
```javascript
// Navigate without parameter
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/index.html');

// Verify artwork-1 loaded
await page.waitForSelector('[data-artwork-id="artwork-1"]');
const title = await page.locator('.artwork-header h2').textContent();
assert(title.includes('记忆（绘画操作单元：第二代）') || title.includes('Memory'));
```

#### Scenario: User loads page with invalid artwork parameter
**Given** an invalid artwork ID is provided
**When** the user navigates to `index.html?artwork=invalid-123`
**Then** the page SHALL fallback to artwork-1
**And** the URL SHALL be updated to `?artwork=artwork-1`

**Test Code**:
```javascript
// Navigate with invalid parameter
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/index.html?artwork=invalid-123');

// Wait for redirect/fallback
await page.waitForTimeout(1000);

// Verify fallback to artwork-1
const url = page.url();
assert(url.includes('artwork=artwork-1') || !url.includes('artwork='));

const artworkId = await page.locator('[data-artwork-id]').first().getAttribute('data-artwork-id');
assert(artworkId === 'artwork-1');
```

---

### Requirement: Browser History Integration
**ID**: URL-NAV-002
**Priority**: MUST

The system SHALL update the browser URL when the user navigates to different artworks using the prev/next buttons.

**Acceptance Criteria**:
- Use `history.replaceState()` for initial page load
- Use `history.pushState()` for user-initiated navigation
- Listen to `popstate` event for back/forward button support
- Update gallery when browser back/forward buttons clicked

#### Scenario: User clicks next artwork button
**Given** the user is viewing artwork-7
**When** the user clicks the "Next Artwork" button
**Then** the page SHALL navigate to artwork-8
**And** the URL SHALL update to `?artwork=artwork-8`
**And** artwork-8 dialogue SHALL load
**And** a new history entry SHALL be created (pushState)

**Test Code**:
```javascript
// Load artwork-7
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/index.html?artwork=artwork-7');
await page.waitForSelector('[data-artwork-id="artwork-7"]');

// Click next button
const nextBtn = await page.locator('[data-nav="next"]');
await nextBtn.click();

// Wait for navigation
await page.waitForTimeout(500);

// Verify URL updated
const url = page.url();
assert(url.includes('artwork=artwork-8'));

// Verify artwork-8 loaded
const artworkId = await page.locator('[data-artwork-id]').first().getAttribute('data-artwork-id');
assert(artworkId === 'artwork-8');
```

#### Scenario: User uses browser back button
**Given** the user navigated from artwork-7 to artwork-8
**When** the user clicks the browser back button
**Then** the page SHALL return to artwork-7
**And** artwork-7 dialogue SHALL be restored

**Test Code**:
```javascript
// Navigate artwork-7 → artwork-8
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/index.html?artwork=artwork-7');
await page.waitForSelector('[data-artwork-id="artwork-7"]');

const nextBtn = await page.locator('[data-nav="next"]');
await nextBtn.click();
await page.waitForTimeout(500);
assert(page.url().includes('artwork-8'));

// Go back
await page.goBack();
await page.waitForTimeout(500);

// Verify returned to artwork-7
assert(page.url().includes('artwork-7'));
const artworkId = await page.locator('[data-artwork-id]').first().getAttribute('data-artwork-id');
assert(artworkId === 'artwork-7');
```

---

### Requirement: Display State Verification
**ID**: URL-NAV-003
**Priority**: MUST

Knowledge base references SHALL be collapsed by default, and future dialogue messages SHALL be completely hidden.

**Acceptance Criteria**:
- References have `max-height: 0` and no `expanded` class on load
- Future messages use `display: none` (not `opacity: 0.4`)
- Clicking reference badge expands that message's references only
- Message reveal is sequential with fade-in animation

#### Scenario: User loads dialogue with references
**Given** artwork-1 has messages with knowledge base references
**When** the user loads `index.html?artwork=artwork-1`
**Then** all reference lists SHALL be collapsed (not visible)
**And** reference badges SHALL show "📚 X 个引用"
**And** clicking a badge SHALL expand only that message's references

**Test Code**:
```javascript
// Load artwork-1
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/index.html?artwork=artwork-1');
await page.waitForSelector('.dialogue-message');

// Get first reference list
const firstRefList = await page.locator('.reference-list').first();

// Verify collapsed on load
const initialHeight = await firstRefList.evaluate(el =>
  window.getComputedStyle(el).maxHeight
);
assert(initialHeight === '0px' || parseInt(initialHeight) === 0,
       'References should be collapsed (max-height: 0)');

// Verify not visible
const hasExpanded = await firstRefList.evaluate(el =>
  el.classList.contains('expanded')
);
assert(!hasExpanded, 'Should not have expanded class');
```

#### Scenario: User observes future messages are hidden
**Given** a dialogue has 30 messages
**When** the page loads
**Then** only the first message SHALL be visible
**And** future messages SHALL have `display: none`
**And** no semi-transparent placeholders SHALL be visible

**Test Code**:
```javascript
// Load dialogue
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/index.html?artwork=artwork-1');
await page.waitForSelector('.dialogue-message.current');

// Count visible messages
const visibleMessages = await page.locator('.dialogue-message').evaluateAll(messages =>
  messages.filter(msg => {
    const style = window.getComputedStyle(msg);
    return style.display !== 'none' && parseFloat(style.opacity) > 0.5;
  }).length
);

assert(visibleMessages === 1, 'Only first message should be fully visible');

// Verify future messages are hidden
const futureMessages = await page.locator('.dialogue-message.future');
const futureCount = await futureMessages.count();
assert(futureCount > 0, 'Should have future messages');

const futureDisplay = await futureMessages.first().evaluate(el =>
  window.getComputedStyle(el).display
);
assert(futureDisplay === 'none', 'Future messages should have display: none');
```

---

## MODIFIED Requirements

None. This is a new feature addition with no modifications to existing functionality.

---

## REMOVED Requirements

None. No features are being removed.

---

## Cross-References

- **Depends On**: Existing DialoguePlayer component (`js/components/dialogue-player.js`)
- **Depends On**: Existing UnifiedNavigation component (`js/components/unified-navigation.js`)
- **Related**: Display state fixes from previous archived change
- **Related**: Exhibition architecture pattern (existing)

---

## Validation Checklist

- [ ] URL parameter parsing tested with valid/invalid inputs
- [ ] Default artwork (no parameter) shows artwork-1
- [ ] Navigation updates URL correctly (prev/next)
- [ ] Browser back/forward buttons work
- [ ] References collapsed by default
- [ ] Future messages completely hidden
- [ ] All 38 artworks can be accessed via URL
- [ ] Mobile and desktop behavior consistent
- [ ] Language switching preserves artwork state
