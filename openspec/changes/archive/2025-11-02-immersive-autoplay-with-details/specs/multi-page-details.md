# Capability Spec: Multi-Page Detail System

**Change**: `immersive-autoplay-with-details`
**Capability**: Multi-Page Detail Content System with Navigation
**Owner**: Implementation Phase 2
**Status**: Specification Ready

---

## Purpose

Provide rich, detailed contextual content about the exhibition (critic biographies, project vision, creation process) on separate pages, accessible via navigation menu, while keeping the main immersive gallery free of text clutter.

---

## Requirements

### Functional Requirements

#### FR1: Three Detail Page Types

##### FR1.1: Critics Page (/pages/critics.html)
- **Content**: Individual profiles of 6 critics/personas
- **Data Source**: `window.VULCA_DATA.personas`
- **Fields per Profile**:
  - Name (Chinese + English)
  - Historical period or description
  - Full biography (100+ words)
  - RPAIT scoring grid (visual bar chart)
  - Color accent (linked to persona)
- **Layout**: Grid responsive across breakpoints
- **Behavior**: Fully scrollable

##### FR1.2: About Page (/pages/about.html)
- **Content**: Project vision, mission, RPAIT framework explanation
- **Sections**:
  - Project title and tagline
  - Vision/Mission statement (100-200 words)
  - RPAIT framework detailed explanation (200+ words)
  - How RPAIT applies to artworks/reviews
  - Contact or "Get in Touch" section (optional)
- **Behavior**: Fully scrollable

##### FR1.3: Process Page (/pages/process.html)
- **Content**: Artwork creation process, review methodology
- **Sections**:
  - Concept development (how artworks were created)
  - Artwork creation timeline
  - How critics were selected and reviews commissioned
  - Exhibition curation process
  - Key decisions and insights
- **Behavior**: Fully scrollable

#### FR2: Navigation Menu
- **Location**: Accessible from all pages (main gallery + detail pages)
- **Type**: Hamburger menu (mobile) or horizontal menu (desktop)
- **Links**:
  - Main Gallery (return to index.html)
  - Critics (navigate to /pages/critics.html)
  - About (navigate to /pages/about.html)
  - Process (navigate to /pages/process.html)
- **Behavior**:
  - Menu appears as overlay on mobile
  - Menu auto-closes after link click (mobile)
  - Current page link highlighted as "active"
  - Accessible via keyboard (Tab, Enter, Escape)

#### FR3: Data-Driven Content
- **Source**: Central `window.VULCA_DATA` object in `js/data.js`
- **Update Behavior**: Edit data once, content updates everywhere
- **No Duplication**: Persona names, bios, RPAIT scores defined in one place

#### FR4: Full Scroll Capability
- **Requirement**: Detail pages must be fully scrollable
- **Implementation**: `overflow: auto`, no scroll prevention
- **Content Overflow**: Content can exceed viewport height
- **Behavior**: Vertical scrollbar visible when content overflows

---

## Non-Functional Requirements

### NFR1: Performance
- **Page Load**: Each page loads in < 2s on 4G
- **Smooth Scrolling**: 60 FPS scroll performance
- **Data Fetch**: No additional AJAX calls (data embedded in data.js)
- **Caching**: Browser caching applied to static assets

### NFR2: Responsive Design
- **Mobile (375px)**: Single column, touch-friendly
- **Tablet (768px)**: Two-column grid (critics), single column (others)
- **Desktop (1024px+)**: Multi-column, optimized spacing
- **No Horizontal Scroll**: Works at all breakpoints

### NFR3: Accessibility (WCAG 2.1 AA)
- **Color Contrast**: All text ≥ 4.5:1 ratio
- **Focus Indicators**: Visible on all interactive elements
- **Keyboard Navigation**: Tab through menu, links, inputs
- **Semantic HTML**: Proper heading hierarchy, alt text on images
- **Screen Reader**: Navigable with NVDA, JAWS, VoiceOver
- **Form Labels**: All form fields properly labeled (if included)

### NFR4: Cross-Browser Compatibility
- **Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Platforms**: Desktop, tablet, mobile

### NFR5: SEO & Metadata
- **Meta Title**: Descriptive per page (50-60 chars)
- **Meta Description**: Engaging (150-160 chars)
- **Open Graph Tags**: Title, description, image
- **Canonical URL**: If needed, prevent duplicate indexing
- **Structured Data**: Exhibition schema (optional, advanced)

---

## Architecture & Structure

### Directory Structure
```
VULCA-EMNLP2025/
├── index.html                    # Main immersive gallery
├── pages/
│   ├── critics.html              # Critics profiles page
│   ├── about.html                # About/vision page
│   └── process.html              # Creation process page
├── js/
│   ├── data.js                   # Central data source
│   ├── critics-page.js           # Critics page generator
│   ├── navigation.js             # Menu handler
│   └── scroll-prevention.js      # Scroll controller
├── styles/
│   └── main.css                  # All styles (unified)
└── assets/
    └── ...images...
```

### Data Structure (js/data.js)

```javascript
window.VULCA_DATA = {
  artworks: [
    {
      id: "artwork_1",
      titleZh: "记忆（绘画操作单元：第二代）",
      titleEn: "Memory (Painting Operation Unit: Second Generation)",
      year: 2022,
      image: "/assets/artwork1.jpg",
      description: "A meditation on technological memory and human creativity...",
      details: {
        size: "150cm × 100cm",
        medium: "Oil on canvas",
        context: "Created during residency at..."
      }
    },
    // ... 4 artworks total
  ],

  personas: [
    {
      id: "su-shi",
      nameZh: "苏轼",
      nameEn: "Su Shi",
      period: "北宋文人 (1037-1101)",
      bio: "Northern Song literati painter, poet, and philosophical thinker known for...",
      rpait: { R: 7, P: 8, A: 8, I: 8, T: 6 },
      color: "#B85C3C"  // Used for profile color accent
    },
    // ... 6 personas total
  ],

  critiques: [
    {
      artworkId: "artwork_1",
      personaId: "su-shi",
      text: "This work speaks to the contemporary interplay between...",
      remark: "Masterful technical execution"
    },
    // ... 24 critiques total (4 artworks × 6 critics)
  ]
}
```

### Page Structure Pattern

Each detail page follows this HTML structure:

```html
<!DOCTYPE html>
<html lang="zh-Hans">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Critics - VULCA</title>
  <meta name="description" content="Meet the critics reviewing VULCA artworks">
  <meta property="og:title" content="Critics - VULCA">
  <meta property="og:image" content="/assets/og-image.jpg">
  <link rel="stylesheet" href="/styles/main.css">
</head>
<body>
  <!-- Navigation Menu (shared across pages) -->
  <nav class="main-menu">
    <!-- Menu content -->
  </nav>

  <!-- Page Content -->
  <main class="page-content">
    <h1>Critics</h1>
    <div id="critics-grid" class="grid">
      <!-- Dynamically generated by critics-page.js -->
    </div>
  </main>

  <!-- Scripts -->
  <script src="/js/data.js"></script>
  <script src="/js/critics-page.js"></script>
  <script src="/js/navigation.js"></script>
  <script src="/js/scroll-prevention.js"></script>
</body>
</html>
```

---

## Implementation Details

### JavaScript Generators

#### Critics Page Generator (js/critics-page.js)

```javascript
// Pseudocode
function initCriticsPage() {
  const container = document.getElementById('critics-grid');

  window.VULCA_DATA.personas.forEach(persona => {
    const card = createCriticCard(persona);
    container.appendChild(card);
  });
}

function createCriticCard(persona) {
  const card = document.createElement('div');
  card.className = 'critic-card';
  card.style.borderLeftColor = persona.color;

  card.innerHTML = `
    <div class="critic-card-header" style="background-color: ${persona.color}40;">
      <h2>${persona.nameZh}</h2>
      <h3>${persona.nameEn}</h3>
      <p class="period">${persona.period}</p>
    </div>

    <div class="critic-card-body">
      <p class="bio">${persona.bio}</p>
      <div class="rpait-grid">
        ${createRPAITChart(persona.rpait)}
      </div>
    </div>
  `;

  return card;
}

function createRPAITChart(rpait) {
  // Generate 5 bar charts (R, P, A, I, T) with scores
  return `
    <div class="rpait-bar" data-dimension="R">
      <label>Representation: ${rpait.R}/10</label>
      <div class="bar"><div class="fill" style="width: ${rpait.R * 10}%"></div></div>
    </div>
    <!-- ... repeat for P, A, I, T ... -->
  `;
}

initCriticsPage();
```

#### Navigation Handler (js/navigation.js)

```javascript
// Pseudocode
class MenuHandler {
  constructor() {
    this.menuButton = document.querySelector('[aria-label="Menu"]');
    this.menuDrawer = document.querySelector('.menu-drawer');
    this.menuLinks = document.querySelectorAll('.menu-link');

    this.init();
  }

  init() {
    // Toggle menu on button click
    this.menuButton.addEventListener('click', () => this.toggleMenu());

    // Close menu on link click or escape key
    this.menuLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeMenu();
    });

    // Highlight current page
    this.highlightCurrentPage();
  }

  toggleMenu() {
    this.menuDrawer.classList.toggle('open');
  }

  closeMenu() {
    this.menuDrawer.classList.remove('open');
  }

  highlightCurrentPage() {
    const currentPath = window.location.pathname;
    this.menuLinks.forEach(link => {
      if (link.href.includes(currentPath)) {
        link.classList.add('active');
      }
    });
  }
}

new MenuHandler();
```

### CSS Styling Pattern

```css
/* Critics Grid (responsive) */
.critics-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  padding: 2rem;
}

@media (min-width: 768px) {
  .critics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .critics-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Critic Card */
.critic-card {
  background: rgba(255, 255, 255, 0.8);
  border-left: 4px solid var(--color-persona);
  padding: 1.5rem;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.critic-card-header {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(128, 128, 128, 0.1);
}

.critic-card h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
}

.critic-card h3 {
  font-size: 0.9rem;
  font-weight: 400;
  margin: 0 0 0.5rem 0;
  color: #666;
}

.critic-card .period {
  font-size: 0.8rem;
  color: #999;
  margin: 0;
}

.critic-card .bio {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 1rem;
}

/* RPAIT Grid */
.rpait-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
}

.rpait-bar {
  font-size: 0.75rem;
}

.rpait-bar label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.rpait-bar .bar {
  height: 20px;
  background: #f0f0f0;
  border-radius: 2px;
  overflow: hidden;
}

.rpait-bar .fill {
  height: 100%;
  background: linear-gradient(90deg, #B85C3C, #D4795F);
  transition: width 0.3s ease;
}
```

---

## Validation Criteria

### Functional Validation

- [ ] **VC1**: Critics page renders all 6 personas
  - **Test**: Navigate to /pages/critics.html
  - **Expected**: All 6 cards visible with names, bios, RPAIT scores

- [ ] **VC2**: Critics page RPAIT scoring displays correctly
  - **Test**: Visual inspection of RPAIT grid
  - **Expected**: 5 bars (R/P/A/I/T) with correct scores for each critic

- [ ] **VC3**: About page content is complete
  - **Test**: Navigate to /pages/about.html
  - **Expected**: Vision statement, RPAIT explanation, contact info visible

- [ ] **VC4**: Process page content is complete
  - **Test**: Navigate to /pages/process.html
  - **Expected**: Creation process, timeline, methodology documented

- [ ] **VC5**: Navigation menu works on all pages
  - **Test**: Click menu button on main, critics, about, process pages
  - **Expected**: Menu opens and shows 4 links (Gallery, Critics, About, Process)

- [ ] **VC6**: Navigation menu closes after link click
  - **Test**: Click link in menu
  - **Expected**: Menu closes, page navigates

- [ ] **VC7**: Active page link highlighted in menu
  - **Test**: Navigate to /pages/critics.html, open menu
  - **Expected**: "Critics" link has "active" styling

- [ ] **VC8**: Scroll works on all detail pages
  - **Test**: On /pages/critics.html, scroll with wheel, keyboard, touch
  - **Expected**: Page scrolls smoothly (not prevented)

- [ ] **VC9**: No data errors in console
  - **Test**: Open DevTools, navigate to detail pages
  - **Expected**: No errors like "Cannot read property 'bio' of undefined"

### Content Validation

- [ ] **VC10**: Bio text is readable and compelling
  - **Test**: Manual review of all 6 bios
  - **Expected**: 100+ words per persona, engaging prose

- [ ] **VC11**: RPAIT framework explained clearly
  - **Test**: Read about page
  - **Expected**: Clear explanation of 5 dimensions and how they apply

- [ ] **VC12**: Process documentation is comprehensive
  - **Test**: Read process page
  - **Expected**: Covers creation, methodology, curation decisions

### Responsive Validation

- [ ] **VC13**: Mobile responsive (375px)
  - **Test**: View all pages at 375px width
  - **Expected**: Single column layout, readable text, no horizontal scroll

- [ ] **VC14**: Tablet responsive (768px)
  - **Test**: View at 768px width
  - **Expected**: Two-column grid (critics), readable spacing

- [ ] **VC15**: Desktop responsive (1024px+)
  - **Test**: View at 1024px and 1440px widths
  - **Expected**: Three-column grid, optimal spacing

### Accessibility Validation

- [ ] **VC16**: Color contrast meets WCAG AA
  - **Test**: Use contrast checker tool
  - **Expected**: All text ≥ 4.5:1 ratio

- [ ] **VC17**: Keyboard navigation works
  - **Test**: Tab through menu, links, interactive elements
  - **Expected**: All elements reachable via Tab, focusable

- [ ] **VC18**: Screen reader compatible
  - **Test**: Use NVDA/JAWS on critics page
  - **Expected**: Can read all content, menu navigable

- [ ] **VC19**: Heading hierarchy correct
  - **Test**: Browser outline view
  - **Expected**: H1 > H2 > H3 structure, no skipped levels

### Performance Validation

- [ ] **VC20**: Page load < 2s on 4G
  - **Test**: Chrome DevTools throttling (4G)
  - **Expected**: Lighthouse first-paint < 1.5s, interactive < 3s

- [ ] **VC21**: Scroll performance 60 FPS
  - **Test**: DevTools Performance tab, scroll page
  - **Expected**: Frame rate stays at 60 FPS, no jank

### SEO Validation

- [ ] **VC22**: Meta tags present on all pages
  - **Test**: View page source
  - **Expected**: Title, description, og tags present

- [ ] **VC23**: Canonical URLs correct (if applicable)
  - **Test**: View page source
  - **Expected**: Canonical URL matches current URL or correct alternate

---

## Edge Cases & Handling

### EC1: Missing Persona Data
- **Scenario**: A persona object lacks `bio` or `rpait`
- **Handling**: Show error in console, gracefully degrade
- **Implementation**: Check data before rendering

```javascript
if (!persona.bio) {
  console.error(`Missing bio for ${persona.nameZh}`);
  return null;  // Skip this card
}
```

### EC2: Very Long Biography Text
- **Scenario**: Bio text overflows card on mobile
- **Handling**: Text wrapping, no overflow hidden
- **Implementation**: Card adjusts height to fit content

### EC3: RPAIT Score Out of Range
- **Scenario**: Score > 10 or < 1
- **Handling**: Clamp value to 1-10, show console warning
- **Implementation**: `Math.max(1, Math.min(10, score))`

### EC4: Network Slow Load
- **Scenario**: Page takes > 3s to load
- **Handling**: Show loading spinner while data loads
- **Implementation**: Add `<div class="spinner"></div>` on page load

### EC5: Menu Drawer Overlaps Content
- **Scenario**: On narrow screens, menu drawer covers navigation links
- **Handling**: Set z-index high, ensure menu closable
- **Implementation**: `z-index: 1000` on menu drawer

---

## Testing Strategy

### Unit Tests
```javascript
test('Critics page generator creates cards for all personas', () => {
  const container = document.getElementById('critics-grid');
  initCriticsPage();
  const cards = container.querySelectorAll('.critic-card');
  expect(cards.length).toBe(6);
});

test('RPAIT chart displays correct score values', () => {
  const rpait = { R: 7, P: 8, A: 8, I: 8, T: 6 };
  const chart = createRPAITChart(rpait);
  expect(chart).toContain('7/10');
  expect(chart).toContain('8/10');
});
```

### Integration Tests
```javascript
test('Navigation menu toggles on button click', () => {
  const button = document.querySelector('[aria-label="Menu"]');
  const menu = document.querySelector('.menu-drawer');

  button.click();
  expect(menu.classList.contains('open')).toBe(true);

  button.click();
  expect(menu.classList.contains('open')).toBe(false);
});
```

### Manual Tests
1. Navigation flow: Main → Critics → About → Process → Main
2. Scroll test: Scroll to bottom of each detail page
3. Responsive test: Resize browser to 375px, 768px, 1024px
4. Mobile test: Test on actual iPhone and Android device
5. Accessibility test: Tab through all pages, test with screen reader

---

## Dependencies

### Internal Dependencies
- `js/data.js` - Must load first (contains persona data)
- `js/critics-page.js` - Depends on data.js
- `js/navigation.js` - Global menu handler

### External Dependencies
- None (all code using native DOM APIs)

### Breaking Changes
- None (additive, doesn't modify main gallery)

---

## Rollback Plan

If detail pages cause issues:

1. **Remove Pages**: Delete `/pages/` directory
2. **Remove Scripts**: Remove script tags for critics-page.js, navigation.js
3. **Update Menu**: Remove menu button from index.html
4. **Test**: Verify main gallery still works

---

## Documentation & Examples

### Developer Examples

#### Add a New Persona
```javascript
// In js/data.js, add to personas array:
{
  id: "new-critic",
  nameZh: "新评论家",
  nameEn: "New Critic",
  period: "Modern era",
  bio: "A new critic with insights...",
  rpait: { R: 6, P: 7, A: 8, I: 7, T: 8 },
  color: "#FF6B6B"
}
// Critics page automatically updates on reload
```

#### Customize Critic Card Styling
```css
/* In styles/main.css, modify: */
.critic-card {
  border-left-width: 6px;  /* Make border thicker */
  background: rgba(255, 255, 255, 0.95);  /* More opaque */
}
```

---

## Success Metrics

| Metric | Target | Actual |
|--------|--------|--------|
| Detail pages load successfully | 100% | TBD |
| All persona data displays | 100% | TBD |
| Navigation menu functional | 100% | TBD |
| Mobile responsive | 100% | TBD |
| Accessibility compliance | WCAG AA | TBD |
| Page load time | < 2s | TBD |
| User satisfaction | Positive feedback | TBD |

---

## Version History

| Version | Date | Author | Change |
|---------|------|--------|--------|
| 1.0 | 2025-11-01 | Claude | Initial specification |
