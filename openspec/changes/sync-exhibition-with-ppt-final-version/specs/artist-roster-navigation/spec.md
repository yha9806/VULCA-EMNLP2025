# Spec: Artist Roster Navigation

**Capability**: `artist-roster-navigation`
**Change**: `sync-exhibition-with-ppt-final-version`
**Created**: 2025-11-14

---

## ADDED Requirements

### Requirement 1: Create Artist Roster Page

The system SHALL create a dedicated artist roster page at `/pages/artists.html` displaying all 46 artworks in a grid layout.

**Priority**: P0 (Critical)
**Dependencies**: None

#### Scenario: Display All Artists in Grid

**Given** a user navigates to `/pages/artists.html`
**When** the page loads
**Then** the page SHALL display 46 artist cards in a responsive grid
**And** each card SHALL show artist name, school, and artwork thumbnail
**And** the grid SHALL be responsive (3 columns desktop, 2 tablet, 1 mobile)

**Validation**:
```javascript
// Playwright test
await page.goto('http://localhost:9999/pages/artists.html');

const cardCount = await page.locator('.artist-card').count();
expect(cardCount).toBe(46);

// Check responsive breakpoints
await page.setViewportSize({ width: 1200, height: 800 }); // Desktop
const desktopColumns = await page.evaluate(() =>
  window.getComputedStyle(document.querySelector('.artist-grid')).gridTemplateColumns.split(' ').length
);
expect(desktopColumns).toBe(3);

await page.setViewportSize({ width: 768, height: 600 }); // Tablet
const tabletColumns = await page.evaluate(() =>
  window.getComputedStyle(document.querySelector('.artist-grid')).gridTemplateColumns.split(' ').length
);
expect(tabletColumns).toBe(2);
```

#### Scenario: Differentiate Confirmed vs Pending Artists

**Given** the artist roster contains both confirmed and pending artworks
**When** the page renders
**Then** confirmed artworks SHALL display a "✓ Confirmed" badge
**And** pending artworks SHALL display a "⏳ Coming Soon" badge
**And** pending artworks SHALL have a visual overlay or dimmed appearance

**Validation**:
```javascript
const confirmedBadges = await page.locator('.status-badge.confirmed').count();
expect(confirmedBadges).toBe(43);

const pendingBadges = await page.locator('.status-badge.pending').count();
expect(pendingBadges).toBe(3);

// Check visual distinction
const pendingCard = page.locator('.artist-card[data-status="pending"]').first();
const opacity = await pendingCard.evaluate(el =>
  window.getComputedStyle(el).opacity
);
expect(parseFloat(opacity)).toBeLessThan(1.0);
```

#### Scenario: Navigate to Artwork Detail

**Given** a user clicks an artist card
**When** the click event fires
**Then** the browser SHALL navigate to the artwork detail page
**And** the URL SHALL include the artwork anchor (e.g., `#artwork-39`)
**And** the navigation state SHALL be saved for "Return to List" functionality

**Validation**:
```javascript
await page.goto('http://localhost:9999/pages/artists.html');

await page.click('.artist-card[data-id="artwork-39"]');

// Check URL changed
expect(page.url()).toContain('/exhibitions/negative-space-of-the-tide/');
expect(page.url()).toContain('#artwork-39');

// Check navigation state stored
const navState = await page.evaluate(() =>
  sessionStorage.getItem('nav_state')
);
expect(JSON.parse(navState).from).toBe('artist-roster');
```

---

### Requirement 2: Implement Filter Controls

The system SHALL provide filter controls on the artist roster page to help users find specific artworks.

**Priority**: P1 (High)
**Dependencies**: Artist roster page exists

#### Scenario: Filter by School

**Given** the artist roster page is loaded
**When** the user selects "中央美术学院" from the school filter dropdown
**Then** the page SHALL display only artworks from that school
**And** the count indicator SHALL update to show filtered results
**And** the URL query parameter SHALL be updated (e.g., `?school=cafa`)

**Validation**:
```javascript
await page.goto('http://localhost:9999/pages/artists.html');

// Select filter
await page.selectOption('select[name="school"]', '中央美术学院');

// Wait for filter to apply
await page.waitForSelector('.artist-card:visible');

// Check filtered results
const visibleCards = await page.locator('.artist-card:visible').count();
const allCAFACards = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('.artist-card'))
    .filter(card => card.dataset.school === '中央美术学院')
    .length;
});

expect(visibleCards).toBe(allCAFACards);

// Check URL updated
expect(page.url()).toContain('school=');
```

#### Scenario: Filter by Status

**Given** the artist roster page is loaded
**When** the user selects "Pending" from the status filter
**Then** the page SHALL display only 3 pending artworks
**And** the confirmed artworks SHALL be hidden

**Validation**:
```javascript
await page.selectOption('select[name="status"]', 'pending');

const visiblePending = await page.locator('.artist-card[data-status="pending"]:visible').count();
expect(visiblePending).toBe(3);

const visibleConfirmed = await page.locator('.artist-card[data-status="confirmed"]:visible').count();
expect(visibleConfirmed).toBe(0);
```

#### Scenario: Search by Artist Name

**Given** the artist roster page is loaded
**When** the user types "凌筱薇" into the search box
**Then** the page SHALL display only artwork-39
**And** all other artworks SHALL be hidden

**Validation**:
```javascript
await page.fill('input[name="search"]', '凌筱薇');

// Wait for debounce (300ms)
await page.waitForTimeout(350);

const visibleCards = await page.locator('.artist-card:visible').count();
expect(visibleCards).toBe(1);

const visibleArtist = await page.locator('.artist-card:visible').textContent();
expect(visibleArtist).toContain('凌筱薇');
```

---

### Requirement 3: Add "Return to List" Navigation

The system SHALL add a "Return to Artist List" button to all artwork detail pages for easy navigation back to the roster.

**Priority**: P0 (Critical)
**Dependencies**: Artist roster page exists

#### Scenario: Display Return Button

**Given** a user navigates to an artwork detail page from the artist roster
**When** the page loads
**Then** a "← Return to Artist List" button SHALL be visible
**And** the button SHALL be positioned in the top-left corner
**And** the button SHALL have hover effects

**Validation**:
```javascript
// Navigate from artist roster
await page.goto('http://localhost:9999/pages/artists.html');
await page.click('.artist-card[data-id="artwork-39"]');

// Check button exists
const returnBtn = page.locator('.return-to-list-btn');
await expect(returnBtn).toBeVisible();

// Check text
const btnText = await returnBtn.textContent();
expect(btnText).toMatch(/返回.*名单|Return.*List/i);

// Check position
const position = await returnBtn.boundingBox();
expect(position.x).toBeLessThan(200); // Left side
expect(position.y).toBeLessThan(100); // Top
```

#### Scenario: Navigate Back to Roster

**Given** a user is on an artwork detail page with the return button visible
**When** the user clicks the "Return to Artist List" button
**Then** the browser SHALL navigate to `/pages/artists.html`
**And** the previous scroll position SHALL be restored
**And** the previously viewed artwork card SHALL have a visual indicator

**Validation**:
```javascript
// Navigate from roster (scroll position 500px)
await page.goto('http://localhost:9999/pages/artists.html');
await page.evaluate(() => window.scrollTo(0, 500));
await page.click('.artist-card[data-id="artwork-39"]');

// Click return button
await page.click('.return-to-list-btn');

// Check URL
expect(page.url()).toContain('/pages/artists.html');

// Check scroll position restored (within 50px tolerance)
const scrollY = await page.evaluate(() => window.scrollY);
expect(Math.abs(scrollY - 500)).toBeLessThan(50);

// Check viewed card has indicator
const viewedCard = page.locator('.artist-card[data-id="artwork-39"]');
await expect(viewedCard).toHaveClass(/recently-viewed/);
```

#### Scenario: Handle Direct Navigation (No Return State)

**Given** a user directly visits an artwork detail page (not from artist roster)
**When** the page loads
**Then** the "Return to Artist List" button SHALL still be visible
**And** clicking it SHALL navigate to the artist roster without scroll restoration

**Validation**:
```javascript
// Direct navigation
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/#artwork-39');

// Button should exist
const returnBtn = page.locator('.return-to-list-btn');
await expect(returnBtn).toBeVisible();

// Click should work
await returnBtn.click();
expect(page.url()).toContain('/pages/artists.html');

// Scroll should be at top (no restoration)
const scrollY = await page.evaluate(() => window.scrollY);
expect(scrollY).toBe(0);
```

---

### Requirement 4: Update Global Navigation Menu

The system SHALL add "Artist List" link to the global hamburger menu.

**Priority**: P1 (High)
**Dependencies**: Artist roster page exists

#### Scenario: Display Artist List Menu Item

**Given** a user opens the hamburger menu
**When** the menu expands
**Then** an "艺术家名单 / Artist List" menu item SHALL be visible
**And** the item SHALL be positioned between "主页" and "展览归档"

**Validation**:
```javascript
await page.goto('http://localhost:9999/');
await page.click('#menu-toggle');

// Wait for menu to expand
await page.waitForSelector('.navigation-menu.open');

// Check menu item exists
const menuItem = page.locator('a[href="/pages/artists.html"]');
await expect(menuItem).toBeVisible();

// Check text
const text = await menuItem.textContent();
expect(text).toMatch(/艺术家名单|Artist List/i);

// Check order
const menuItems = await page.locator('.navigation-menu a').allTextContents();
const artistListIndex = menuItems.findIndex(t => t.includes('艺术家'));
const homeIndex = menuItems.findIndex(t => t.includes('主页'));
const archiveIndex = menuItems.findIndex(t => t.includes('展览归档'));

expect(artistListIndex).toBeGreaterThan(homeIndex);
expect(artistListIndex).toBeLessThan(archiveIndex);
```

#### Scenario: Navigate via Menu Item

**Given** the hamburger menu is open
**When** the user clicks "Artist List"
**Then** the browser SHALL navigate to `/pages/artists.html`
**And** the menu SHALL automatically close (mobile)

**Validation**:
```javascript
await page.setViewportSize({ width: 375, height: 667 }); // Mobile
await page.goto('http://localhost:9999/');
await page.click('#menu-toggle');

// Click artist list item
await page.click('a[href="/pages/artists.html"]');

// Check navigation
expect(page.url()).toContain('/pages/artists.html');

// Check menu closed (mobile behavior)
const menuOpen = await page.locator('.navigation-menu.open').count();
expect(menuOpen).toBe(0);
```

---

## MODIFIED Requirements

### Requirement 5: Enhance Artwork Carousel with Status Indicators

The system SHALL modify the artwork carousel component to display status badges for pending artworks.

**Priority**: P1 (High)
**Dependencies**: Carousel component exists

#### Scenario: Display Pending Badge in Carousel

**Given** the carousel displays artwork-40 (pending status)
**When** the artwork card is rendered
**Then** a "⏳ Coming Soon" badge SHALL overlay the thumbnail
**And** the artwork SHALL have reduced opacity (0.7)
**And** clicking the card SHALL NOT trigger dialogue playback

**Validation**:
```javascript
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/');

// Navigate to artwork-40
await page.click('.carousel-next'); // Assume it's at position 40

// Check badge
const badge = page.locator('.artwork-card[data-id="artwork-40"] .status-badge');
await expect(badge).toBeVisible();
await expect(badge).toContainText(/Coming Soon|即将推出/);

// Check opacity
const opacity = await page.locator('.artwork-card[data-id="artwork-40"]').evaluate(el =>
  window.getComputedStyle(el).opacity
);
expect(parseFloat(opacity)).toBeCloseTo(0.7, 1);

// Check dialogue blocked
await page.click('.artwork-card[data-id="artwork-40"]');
const dialoguePlayer = page.locator('.dialogue-player');
await expect(dialoguePlayer).not.toBeVisible();
```

#### Scenario: Confirmed Artworks Have No Badge

**Given** the carousel displays artwork-39 (confirmed status)
**When** the artwork card is rendered
**Then** no status badge SHALL be visible
**And** the artwork SHALL have normal opacity (1.0)
**And** clicking SHALL trigger dialogue playback normally

**Validation**:
```javascript
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/#artwork-39');

// Check no badge
const badge = page.locator('.artwork-card[data-id="artwork-39"] .status-badge');
await expect(badge).not.toBeVisible();

// Check opacity
const opacity = await page.locator('.artwork-card[data-id="artwork-39"]').evaluate(el =>
  window.getComputedStyle(el).opacity
);
expect(opacity).toBe('1');

// Check dialogue works
const dialoguePlayer = page.locator('.dialogue-player');
await expect(dialoguePlayer).toBeVisible();
```

---

## Testing Checklist

### Artist Roster Page
- [ ] Page loads successfully at `/pages/artists.html`
- [ ] All 46 artist cards render
- [ ] Grid responsive at 3 breakpoints
- [ ] Confirmed/pending badges display correctly
- [ ] Card click navigates to artwork detail
- [ ] Navigation state saved to sessionStorage

### Filter Controls
- [ ] School filter works
- [ ] Status filter works
- [ ] Search works (with debounce)
- [ ] Multiple filters combine correctly
- [ ] URL query parameters update
- [ ] Filter reset button works

### Return to List Navigation
- [ ] Button visible on artwork pages
- [ ] Button navigates back to roster
- [ ] Scroll position restored
- [ ] Recently viewed indicator appears
- [ ] Works without navigation state (direct access)

### Global Navigation
- [ ] "Artist List" menu item visible
- [ ] Menu item navigates correctly
- [ ] Menu closes after navigation (mobile)
- [ ] Menu item highlighted when on artist page

### Carousel Integration
- [ ] Pending badges show in carousel
- [ ] Pending artworks have reduced opacity
- [ ] Dialogue blocked for pending artworks
- [ ] Confirmed artworks work normally
- [ ] Status attribute accessible for filtering

### Accessibility
- [ ] All buttons have aria-labels
- [ ] Keyboard navigation works
- [ ] Screen reader announces status
- [ ] Focus management correct
- [ ] Color contrast meets WCAG AA
