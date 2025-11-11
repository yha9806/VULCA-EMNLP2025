# Spec: Portfolio Homepage

**Change ID**: `rebuild-interactive-exhibition-platform`
**Capability**: `portfolio-homepage`
**Status**: Draft
**Created**: 2025-11-10

---

## Overview

This spec defines requirements for the new VULCA portfolio homepage that showcases all exhibitions and serves as the main entry point for curators, galleries, and visitors.

**User Intent**: "我需要一个主页展示所有的展览作品，让策展人可以看到VULCA的完整作品集。"

---

## ADDED Requirements

### Requirement: Portfolio Homepage Structure

The system SHALL create a new homepage at `/index.html` that displays a portfolio of all VULCA exhibitions.

**Acceptance Criteria**:
- Homepage SHALL replace the current single-exhibition content
- Homepage SHALL fetch exhibition list from `/api/exhibitions.json`
- Homepage SHALL display exhibition cards in a responsive grid
- Homepage SHALL include VULCA branding and project description
- Homepage SHALL be accessible without JavaScript (progressive enhancement)

#### Scenario: Homepage Loads and Displays Exhibition Grid

**Given** the user navigates to `https://vulcaart.art/`

**When** the page finishes loading

**Then** the system SHALL:
- Display the page title "VULCA - AI艺术批评的沉浸式展览平台"
- Show the VULCA logo and tagline
- Fetch `/api/exhibitions.json` via JavaScript
- Render exhibition cards in a 2-column grid (desktop) or 1-column (mobile)
- Display at least 1 exhibition card (for "潮汐的负形")
- Show a placeholder card for "更多展览即将到来"

**And** the system SHALL NOT:
- Display the old carousel interface
- Show artwork-specific content
- Load dialogue player

**Validation**:
```javascript
// Playwright test
await page.goto('https://vulcaart.art/');

// Verify page title
await expect(page).toHaveTitle(/VULCA/);

// Verify homepage loaded (not exhibition)
const hero = await page.$('.portfolio-hero');
expect(hero).toBeTruthy();

// Verify API fetched
await page.waitForResponse(response =>
  response.url().includes('/api/exhibitions.json') && response.status() === 200
);

// Verify exhibition cards rendered
const cards = await page.$$('.exhibition-card');
expect(cards.length).toBeGreaterThanOrEqual(1);

// Verify first card is "潮汐的负形"
const firstCardTitle = await page.textContent('.exhibition-card:first-child h3');
expect(firstCardTitle).toContain('潮汐的负形');
```

---

#### Scenario: Exhibition Card Displays Correct Metadata

**Given** an exhibition exists in `/api/exhibitions.json` with the following data:
```json
{
  "id": "negative-space-of-the-tide",
  "titleZh": "潮汐的负形",
  "titleEn": "Negative Space of the Tide",
  "year": 2025,
  "status": "live",
  "coverImage": "/exhibitions/negative-space-of-the-tide/assets/cover.jpg",
  "stats": {"artworks": 4, "personas": 6}
}
```

**When** the homepage renders the exhibition card

**Then** the system SHALL display:
- Cover image from the specified URL
- Chinese title: "潮汐的负形"
- English title: "Negative Space of the Tide"
- Year: "2025"
- Status badge: "LIVE NOW" (for status "live")
- Stats: "4 Artworks • 6 Cultural Perspectives"
- Call-to-action button: "进入展览 Enter Exhibition →"

**And** clicking the CTA button SHALL navigate to `/exhibitions/negative-space-of-the-tide/`

**Validation**:
```javascript
// Playwright test
const card = await page.$('.exhibition-card[data-id="negative-space-of-the-tide"]');

// Verify cover image
const img = await card.$('img');
const src = await img.getAttribute('src');
expect(src).toBe('/exhibitions/negative-space-of-the-tide/assets/cover.jpg');

// Verify titles
const titleZh = await card.$('.title-zh');
expect(await titleZh.textContent()).toBe('潮汐的负形');

const titleEn = await card.$('.title-en');
expect(await titleEn.textContent()).toBe('Negative Space of the Tide');

// Verify year
const year = await card.$('.year');
expect(await year.textContent()).toBe('2025');

// Verify status badge
const badge = await card.$('.badge');
expect(await badge.textContent()).toBe('LIVE NOW');

// Verify stats
const stats = await card.$$eval('.meta span', els => els.map(el => el.textContent));
expect(stats).toContain('4 Artworks');
expect(stats).toContain('6 Cultural Perspectives');

// Verify link
const link = await card.$('a.cta-button');
const href = await link.getAttribute('href');
expect(href).toBe('/exhibitions/negative-space-of-the-tide/');

// Test click navigation
await link.click();
await page.waitForURL(/\/exhibitions\/negative-space-of-the-tide/);
```

---

#### Scenario: Responsive Grid Layout

**Given** the homepage is loaded on different device widths

**When** the user resizes the browser window

**Then** the system SHALL:
- **Desktop (≥1024px)**: Display 2-column grid with 40px gap
- **Tablet (768px-1023px)**: Display 2-column grid with 24px gap
- **Mobile (<768px)**: Display 1-column stack with 16px gap

**And** each card SHALL:
- Maintain 3:2 aspect ratio for cover image
- Scale typography proportionally
- Keep button accessible (min 44x44px tap target)

**Validation**:
```javascript
// Playwright test - Desktop
await page.setViewportSize({ width: 1440, height: 900 });
const gridDesktop = await page.$('.exhibition-grid');
const columnsDesktop = await gridDesktop.evaluate(el =>
  window.getComputedStyle(el).getPropertyValue('grid-template-columns')
);
expect(columnsDesktop).toContain('1fr 1fr');  // 2 columns

// Tablet
await page.setViewportSize({ width: 768, height: 1024 });
const gridTablet = await page.$('.exhibition-grid');
const columnsTablet = await gridTablet.evaluate(el =>
  window.getComputedStyle(el).getPropertyValue('grid-template-columns')
);
expect(columnsTablet).toContain('1fr 1fr');  // 2 columns

// Mobile
await page.setViewportSize({ width: 375, height: 667 });
const gridMobile = await page.$('.exhibition-grid');
const columnsMobile = await gridMobile.evaluate(el =>
  window.getComputedStyle(el).getPropertyValue('grid-template-columns')
);
expect(columnsMobile).toContain('1fr');  // 1 column

// Verify image aspect ratio
const card = await page.$('.exhibition-card:first-child');
const img = await card.$('.card-image img');
const { width, height } = await img.boundingBox();
const aspectRatio = width / height;
expect(aspectRatio).toBeCloseTo(1.5, 1);  // 3:2 ratio
```

---

### Requirement: API Endpoint for Exhibitions List

The system SHALL provide an API endpoint `/api/exhibitions.json` that returns a list of all exhibitions with metadata.

**Acceptance Criteria**:
- Endpoint SHALL be a static JSON file (no server-side processing)
- Endpoint SHALL return valid JSON conforming to schema
- Endpoint SHALL include only lightweight metadata (no full exhibition data)
- Endpoint SHALL be accessible via GET request
- Endpoint SHALL include cache headers for performance

#### Scenario: API Returns Valid Exhibition List

**Given** the API file exists at `/api/exhibitions.json`

**When** a client makes a GET request to `/api/exhibitions.json`

**Then** the system SHALL:
- Return HTTP 200 status code
- Return `Content-Type: application/json`
- Return JSON matching the following schema:
```json
{
  "exhibitions": [
    {
      "id": "string",
      "slug": "string",
      "titleZh": "string",
      "titleEn": "string",
      "year": "number",
      "status": "live|archived|upcoming",
      "coverImage": "string (URL)",
      "url": "string (relative URL)",
      "stats": {
        "artworks": "number",
        "personas": "number"
      }
    }
  ],
  "total": "number",
  "updated": "string (ISO 8601 date)"
}
```

**Validation**:
```javascript
// Playwright test
const response = await page.request.get('https://vulcaart.art/api/exhibitions.json');

// Verify status
expect(response.status()).toBe(200);

// Verify content type
expect(response.headers()['content-type']).toContain('application/json');

// Verify JSON structure
const data = await response.json();
expect(data).toHaveProperty('exhibitions');
expect(data).toHaveProperty('total');
expect(data).toHaveProperty('updated');

// Verify exhibitions array
expect(Array.isArray(data.exhibitions)).toBe(true);
expect(data.exhibitions.length).toBeGreaterThan(0);

// Verify first exhibition schema
const firstExhibition = data.exhibitions[0];
expect(firstExhibition).toHaveProperty('id');
expect(firstExhibition).toHaveProperty('slug');
expect(firstExhibition).toHaveProperty('titleZh');
expect(firstExhibition).toHaveProperty('titleEn');
expect(firstExhibition).toHaveProperty('year');
expect(firstExhibition).toHaveProperty('status');
expect(firstExhibition).toHaveProperty('coverImage');
expect(firstExhibition).toHaveProperty('url');
expect(firstExhibition).toHaveProperty('stats');

// Verify stats sub-object
expect(firstExhibition.stats).toHaveProperty('artworks');
expect(firstExhibition.stats).toHaveProperty('personas');
expect(typeof firstExhibition.stats.artworks).toBe('number');
```

---

#### Scenario: API Data Matches Exhibition Configs

**Given** an exhibition exists at `/exhibitions/negative-space-of-the-tide/config.json` with data:
```json
{
  "id": "negative-space-of-the-tide",
  "titleZh": "潮汐的负形",
  "stats": {"artworks": 4, "personas": 6}
}
```

**When** the API file `/api/exhibitions.json` is generated

**Then** the system SHALL ensure:
- API entry for this exhibition matches the config values
- No data duplication or inconsistency
- Stats match the actual counts in `data.json`

**Validation**:
```javascript
// Node.js validation script
const fs = require('fs');

// Load API data
const apiData = JSON.parse(fs.readFileSync('./api/exhibitions.json', 'utf8'));

// Load exhibition config
const configData = JSON.parse(fs.readFileSync('./exhibitions/negative-space-of-the-tide/config.json', 'utf8'));

// Verify consistency
const apiExhibit = apiData.exhibitions.find(e => e.id === 'negative-space-of-the-tide');
expect(apiExhibit.titleZh).toBe(configData.titleZh);
expect(apiExhibit.stats.artworks).toBe(configData.stats.artworks);

// Verify stats match actual data
const dataJson = JSON.parse(fs.readFileSync('./exhibitions/negative-space-of-the-tide/data.json', 'utf8'));
expect(apiExhibit.stats.artworks).toBe(dataJson.artworks.length);
expect(apiExhibit.stats.personas).toBe(dataJson.personas.length);
```

---

### Requirement: Hero Section with VULCA Branding

The homepage SHALL include a hero section that introduces the VULCA project and establishes brand identity.

**Acceptance Criteria**:
- Hero section SHALL be the first element on the page
- Hero SHALL display VULCA logo/wordmark
- Hero SHALL include bilingual tagline (Chinese/English)
- Hero SHALL include brief project description (1-2 sentences)
- Hero SHALL be visually distinct from exhibition grid

#### Scenario: Hero Section Renders Complete Content

**Given** the user lands on the homepage

**When** the hero section loads

**Then** the system SHALL display:
- Brand name: "VULCA" in prominent typography
- Chinese tagline: "AI艺术批评的沉浸式展览平台"
- English tagline: "An Immersive Art Exhibition Platform for AI-Generated Art Criticism"
- Description: Brief explanation of VULCA's purpose
- Visual hierarchy: Brand name largest, taglines medium, description smaller

**And** the hero section SHALL:
- Use VULCA brand colors (primary: #B85C3C, accent: #D4A574)
- Be centered on the page
- Occupy 60-80vh on first load
- Include subtle animation on page load (fade-in or slide-up)

**Validation**:
```javascript
// Playwright test
const hero = await page.$('.portfolio-hero');

// Verify brand name
const brandName = await hero.$('.brand');
expect(await brandName.textContent()).toBe('VULCA');

// Verify taglines
const taglineZh = await hero.$('.tagline-zh');
expect(await taglineZh.textContent()).toContain('AI艺术批评');

const taglineEn = await hero.$('.tagline-en');
expect(await taglineEn.textContent()).toContain('Immersive Art Exhibition Platform');

// Verify description exists
const description = await hero.$('.description');
expect(description).toBeTruthy();

// Verify visual hierarchy (font sizes)
const brandFontSize = await brandName.evaluate(el =>
  window.getComputedStyle(el).getPropertyValue('font-size')
);
const taglineFontSize = await taglineZh.evaluate(el =>
  window.getComputedStyle(el).getPropertyValue('font-size')
);
expect(parseFloat(brandFontSize)).toBeGreaterThan(parseFloat(taglineFontSize));

// Verify hero height
const heroHeight = await hero.boundingBox();
const viewportHeight = page.viewportSize().height;
expect(heroHeight.height).toBeGreaterThan(viewportHeight * 0.6);
expect(heroHeight.height).toBeLessThan(viewportHeight * 0.8);
```

---

### Requirement: SEO Optimization for Homepage

The homepage SHALL include comprehensive SEO metadata for search engines and social sharing.

**Acceptance Criteria**:
- Page SHALL have unique `<title>` tag
- Page SHALL have meta description
- Page SHALL have Open Graph tags for social sharing
- Page SHALL have Twitter Card tags
- Page SHALL include structured data (JSON-LD)

#### Scenario: Meta Tags Present and Correct

**Given** the homepage HTML is loaded

**When** inspecting the `<head>` section

**Then** the system SHALL include:

**Title Tag**:
```html
<title>VULCA - AI艺术批评的沉浸式展览平台 | Immersive Art Exhibition Platform</title>
```

**Meta Tags**:
```html
<meta name="description" content="VULCA展示AI驱动的多文化视角艺术批评。探索跨越北宋文人画、维多利亚道德批评、俄国形式主义等多种文化传统的艺术展览。">
<meta name="keywords" content="AI艺术批评, 沉浸式展览, 文化视角, 艺术平台, RPAIT框架">
```

**Open Graph Tags**:
```html
<meta property="og:type" content="website">
<meta property="og:url" content="https://vulcaart.art/">
<meta property="og:title" content="VULCA - AI艺术批评的沉浸式展览平台">
<meta property="og:description" content="探索AI如何从多种文化视角理解和批评艺术作品">
<meta property="og:image" content="https://vulcaart.art/assets/og-image-vulca.jpg">
```

**Validation**:
```javascript
// Playwright test
const title = await page.title();
expect(title).toContain('VULCA');

const metaDescription = await page.$eval('meta[name="description"]', el => el.content);
expect(metaDescription).toContain('AI');
expect(metaDescription.length).toBeGreaterThan(50);
expect(metaDescription.length).toBeLessThan(160);

// Verify OG tags
const ogTitle = await page.$eval('meta[property="og:title"]', el => el.content);
expect(ogTitle).toContain('VULCA');

const ogImage = await page.$eval('meta[property="og:image"]', el => el.content);
expect(ogImage).toContain('vulcaart.art');
expect(ogImage).toContain('.jpg');

// Verify OG image is accessible
const ogImageResponse = await page.request.get(ogImage);
expect(ogImageResponse.status()).toBe(200);
```

---

## MODIFIED Requirements

### Requirement: Navigation System Updated for Portfolio

The existing hamburger navigation SHALL be updated to support multi-exhibition architecture.

**Changes**:
- Menu SHALL show "主页 / Home" instead of "主画廊 / Main Gallery"
- Menu SHALL include link to "展览归档 / Exhibition Archive"
- Menu SHALL update "关于 / About" to describe VULCA (not specific exhibition)
- Menu SHALL dynamically highlight current page

**Acceptance Criteria**:
- Navigation accessible from homepage
- Navigation links to correct URLs
- Active page highlighted in menu
- Mobile responsive (hamburger menu)

#### Scenario: Navigation Menu Shows Updated Links

**Given** the user opens the hamburger menu on the homepage

**When** the menu is displayed

**Then** the system SHALL show:
- Link: "主页 / Home" → `/`
- Link: "展览归档 / Exhibition Archive" → `/pages/exhibitions-archive.html`
- Link: "关于 / About" → `/pages/about.html`
- Active indicator on "主页 / Home" (current page)

**And** clicking any link SHALL navigate to the correct URL

**Validation**:
```javascript
// Playwright test
await page.click('#menu-toggle');
await page.waitForSelector('.menu-nav', { state: 'visible' });

// Verify links
const links = await page.$$eval('.menu-nav a', els =>
  els.map(el => ({ text: el.textContent, href: el.getAttribute('href') }))
);

expect(links).toContainEqual({ text: expect.stringContaining('主页'), href: '/' });
expect(links).toContainEqual({ text: expect.stringContaining('展览归档'), href: '/pages/exhibitions-archive.html' });
expect(links).toContainEqual({ text: expect.stringContaining('关于'), href: '/pages/about.html' });

// Verify active state
const activeLink = await page.$('.menu-nav a.active, .menu-nav a[aria-current="page"]');
const activeText = await activeLink.textContent();
expect(activeText).toContain('主页');
```

---

## Non-Functional Requirements

### Performance

- **Page Load Time**: SHALL complete in <2 seconds on fast 3G
- **Time to Interactive**: SHALL be <3 seconds
- **Lighthouse Performance Score**: SHALL be ≥90
- **API Response Time**: `/api/exhibitions.json` SHALL load in <500ms

### Accessibility

- **WCAG Compliance**: SHALL meet WCAG 2.1 AA standards
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Reader**: All content announced correctly by NVDA/JAWS
- **Color Contrast**: Text SHALL have ≥4.5:1 contrast ratio

### Browser Compatibility

- **Chrome/Edge**: Version 90+
- **Firefox**: Version 88+
- **Safari**: Version 14+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+

### Responsive Design

- **Desktop**: 1920px, 1440px, 1024px
- **Tablet**: 768px
- **Mobile**: 375px (iPhone SE), 390px (iPhone 12), 414px (iPhone 14 Pro Max)

---

## Cross-Reference

**Related Specs**:
- `exhibition-structure/spec.md` - Defines exhibition directory layout and config schema
- `template-system/spec.md` - Defines how exhibitions are rendered
- `data-migration/spec.md` - Defines migration of current exhibition

**Dependencies**:
- Exhibition configs must exist before API can list them
- Cover images must be available for card rendering
- Exhibition URLs must be valid and accessible

---

**Status**: Spec Complete, Ready for Implementation
**Estimated Effort**: 6-8 hours
