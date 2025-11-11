# Tasks: Rebuild Interactive Exhibition Platform

**Change ID**: `rebuild-interactive-exhibition-platform`
**Status**: Draft
**Created**: 2025-11-10
**Estimated Total Time**: 12-18 hours

---

## Phase 1: Foundation & Setup (4-6 hours)

### GitHub Branch Management

- [ ] **Task 1.1: Create feature branch** (10min)
  - Use GitHub CLI to create branch: `gh repo clone yha9806/VULCA-EMNLP2025 && cd VULCA-EMNLP2025 && git checkout -b feature/multi-exhibition-platform`
  - Push branch: `git push -u origin feature/multi-exhibition-platform`
  - **Success**: Branch exists on GitHub, local branch tracks remote
  - **Dependencies**: None

- [ ] **Task 1.2: Create project backup** (5min)
  - Create backup: `git tag backup-before-rebuild-$(date +%Y%m%d)`
  - Export current state: `git archive --format=zip HEAD > backups/pre-rebuild-$(date +%Y%m%d).zip`
  - **Success**: Backup tag created, zip file in backups/
  - **Dependencies**: None

### Directory Structure Creation

- [ ] **Task 1.3: Create shared resources directory** (5min)
  - Create: `mkdir -p shared/{js/components,js/utils,js/visualizations,styles/components,templates}`
  - Create: `mkdir -p api`
  - Create: `mkdir -p exhibitions`
  - **Success**: All directories exist
  - **Dependencies**: Task 1.1

- [ ] **Task 1.4: Move components to shared/** (30min)
  - Move: `js/components/dialogue-player.js` → `shared/js/components/`
  - Move: `js/components/artwork-carousel.js` → `shared/js/components/`
  - Move: `js/components/unified-navigation.js` → `shared/js/components/`
  - Move: `js/visualizations/*.js` → `shared/js/visualizations/`
  - Update all import paths to use `/shared/js/...`
  - **Success**: Components in shared/, all imports work
  - **Dependencies**: Task 1.3
  - **Validation**: Run tests, check console for import errors

- [ ] **Task 1.5: Move styles to shared/** (20min)
  - Move: `styles/components/dialogue-player.css` → `shared/styles/components/`
  - Move: `styles/components/reference-*.css` → `shared/styles/components/`
  - Update HTML link tags to use `/shared/styles/...`
  - **Success**: Styles in shared/, no broken links
  - **Dependencies**: Task 1.3

### Schema Definitions

- [ ] **Task 1.6: Create JSON schemas** (45min)
  - Create: `schemas/exhibition-config.schema.json`
  - Create: `schemas/exhibition-data.schema.json`
  - Create: `schemas/dialogue-data.schema.json`
  - Create: `schemas/api-exhibitions.schema.json`
  - **Success**: All schemas valid, include descriptions
  - **Dependencies**: None
  - **Files**: See `exhibition-structure/spec.md` for schema definitions

- [ ] **Task 1.7: Install validation tools** (10min)
  - Install: `npm install --save-dev ajv ajv-cli`
  - Add script: `"validate-schema": "ajv compile -s schemas/*.schema.json"`
  - Run: `npm run validate-schema`
  - **Success**: All schemas compile without errors
  - **Dependencies**: Task 1.6

### Scaffolding Tools

- [ ] **Task 1.8: Create exhibition scaffolding tool** (60min)
  - Create: `scripts/scaffold-exhibition.js`
  - Implement: Interactive prompts for exhibition details
  - Implement: Directory and file creation
  - Implement: Template generation with placeholders
  - Add npm script: `"scaffold": "node scripts/scaffold-exhibition.js"`
  - **Success**: Can create new exhibition directory structure
  - **Dependencies**: Task 1.6
  - **Validation**: `npm run scaffold -- --slug test-exhibit --non-interactive`

- [ ] **Task 1.9: Create validation tool** (45min)
  - Create: `scripts/validate-exhibition.js`
  - Implement: JSON schema validation
  - Implement: Referential integrity checks
  - Implement: Asset existence checks
  - Add npm script: `"validate-exhibition": "node scripts/validate-exhibition.js"`
  - **Success**: Can validate exhibition structure
  - **Dependencies**: Task 1.6, Task 1.7
  - **Validation**: `npm run validate-exhibition negative-space-of-the-tide`

---

## Phase 2: Data Migration (4-6 hours)

### Extract Current Exhibition Data

- [ ] **Task 2.1: Create migration script** (30min)
  - Create: `scripts/migrate-current-exhibition.js`
  - Read: `js/data.js` (VULCA_DATA)
  - Read: `js/data/dialogues/*.js`
  - **Success**: Script loads all current data
  - **Dependencies**: Task 1.6

- [ ] **Task 2.2: Generate config.json** (20min)
  - Extract metadata from README.md and SPEC.md
  - Generate: `/exhibitions/negative-space-of-the-tide/config.json`
  - Validate against schema
  - **Success**: Valid config.json created
  - **Dependencies**: Task 2.1, Task 1.6
  - **Validation**: `npm run validate-schema config.json`

- [ ] **Task 2.3: Generate data.json** (30min)
  - Transform VULCA_DATA.artworks → data.json structure
  - Transform VULCA_DATA.personas → data.json structure
  - Transform VULCA_DATA.critiques → data.json structure
  - Generate: `/exhibitions/negative-space-of-the-tide/data.json`
  - Validate against schema
  - **Success**: Valid data.json created, stats match
  - **Dependencies**: Task 2.1
  - **Validation**: `jq .artworks[].id data.json` (should list all IDs)

- [ ] **Task 2.4: Generate dialogues.json** (30min)
  - Transform existing dialogue data from `js/data/dialogues/`
  - Preserve all message metadata (timestamp, replyTo, references)
  - Generate: `/exhibitions/negative-space-of-the-tide/dialogues.json`
  - Validate against schema
  - **Success**: Valid dialogues.json created, message count matches
  - **Dependencies**: Task 2.1
  - **Validation**: `jq '.dialogues[].messages | length' dialogues.json`

### Migrate Assets

- [ ] **Task 2.5: Create assets directory** (5min)
  - Create: `/exhibitions/negative-space-of-the-tide/assets/`
  - **Success**: Directory exists
  - **Dependencies**: None

- [ ] **Task 2.6: Generate cover image** (15min)
  - Extract first artwork image OR create composite cover
  - Resize to 1200x800px (3:2 ratio)
  - Optimize to <500KB
  - Save as: `assets/cover.jpg`
  - **Success**: Cover image exists, correct dimensions
  - **Dependencies**: Task 2.5
  - **Validation**: `file assets/cover.jpg` (should show JPEG, 1200x800)

- [ ] **Task 2.7: Generate OG image** (15min)
  - Create social sharing image with title overlay
  - Dimensions: 1200x630px
  - Include VULCA branding
  - Save as: `assets/og-image.jpg`
  - **Success**: OG image exists, correct dimensions
  - **Dependencies**: Task 2.5

- [ ] **Task 2.8: Copy artwork images** (20min)
  - Identify all artwork images from current `assets/`
  - Copy to: `/exhibitions/negative-space-of-the-tide/assets/artwork-*.jpg`
  - Update paths in `data.json`
  - **Success**: All artwork images in exhibition assets/
  - **Dependencies**: Task 2.3, Task 2.5
  - **Validation**: Count images, verify paths in data.json

### Create Exhibition Template

- [ ] **Task 2.9: Create exhibition index.html** (30min)
  - Create: `/exhibitions/negative-space-of-the-tide/index.html`
  - Include: Basic HTML structure
  - Include: Meta tags (dynamically populated)
  - Include: Script to load exhibition data
  - **Success**: HTML file valid, loads without errors
  - **Dependencies**: Task 2.2
  - **Validation**: Open in browser, check console

- [ ] **Task 2.10: Create exhibition README** (10min)
  - Create: `/exhibitions/negative-space-of-the-tide/README.md`
  - Document: Exhibition details, file structure
  - Include: Links to venue, artist
  - **Success**: README provides context
  - **Dependencies**: None

### Validate Migration

- [ ] **Task 2.11: Run validation tool** (10min)
  - Run: `npm run validate-exhibition negative-space-of-the-tide`
  - Fix any errors reported
  - **Success**: Validation passes with 0 errors
  - **Dependencies**: Task 1.9, Task 2.2-2.8
  - **Validation**: Exit code 0

- [ ] **Task 2.12: Compare stats with original** (15min)
  - Count artworks in data.json vs original js/data.js
  - Count personas, critiques, dialogue messages
  - Verify all IDs preserved
  - **Success**: All counts match, no data loss
  - **Dependencies**: Task 2.11
  - **Validation**: Script compares counts

---

## Phase 3: Template System (2-3 hours)

### Exhibition Loader

- [ ] **Task 3.1: Create exhibition loader utility** (45min)
  - Create: `shared/js/exhibition-loader.js`
  - Implement: `loadConfig(exhibitionId)` - fetches config.json
  - Implement: `loadData(exhibitionId)` - fetches data.json
  - Implement: `loadDialogues(exhibitionId)` - fetches dialogues.json
  - Include: Error handling, caching
  - **Success**: Can load all exhibition data
  - **Dependencies**: Task 1.3
  - **Validation**: Test with fetch requests

- [ ] **Task 3.2: Create exhibition renderer** (60min)
  - Create: `shared/js/exhibition-renderer.js`
  - Implement: `ExhibitionRenderer` class
  - Implement: `render(config, data, dialogues)` method
  - Implement: DOM manipulation for exhibition page
  - **Success**: Can render exhibition from data
  - **Dependencies**: Task 3.1, Task 1.4
  - **Validation**: Test render with sample data

- [ ] **Task 3.3: Update exhibition index.html** (30min)
  - Add script tag: `<script type="module" src="/shared/js/exhibition-loader.js"></script>`
  - Add initialization code: Detect exhibition ID from URL
  - Add loading state: Show spinner while loading
  - Add error state: Display error if load fails
  - **Success**: Exhibition page loads and renders
  - **Dependencies**: Task 3.1, Task 3.2, Task 2.9

- [ ] **Task 3.4: Implement meta tag population** (20min)
  - Read config.json metadata
  - Update `<title>` with exhibition title
  - Update `<meta name="description">` with description
  - Update `<meta property="og:*">` with OG data
  - **Success**: Meta tags reflect exhibition data
  - **Dependencies**: Task 3.1
  - **Validation**: Inspect page source, check meta tags

### Component Integration

- [ ] **Task 3.5: Adapt DialoguePlayer for exhibition data** (30min)
  - Update DialoguePlayer to accept `dialogues.json` format
  - Ensure backward compatibility with existing usage
  - Test with migrated dialogue data
  - **Success**: DialoguePlayer works with new data structure
  - **Dependencies**: Task 1.4, Task 2.4

- [ ] **Task 3.6: Adapt ArtworkCarousel for exhibition data** (20min)
  - Update carousel to load images from `data.json`
  - Update paths to use exhibition-relative URLs
  - **Success**: Carousel displays artwork images
  - **Dependencies**: Task 1.4, Task 2.3

- [ ] **Task 3.7: Test all interactive features** (30min)
  - Test: Dialogue auto-play
  - Test: Image carousel navigation
  - Test: Reference badge toggle
  - Test: Thought chain visualization
  - **Success**: All features work in exhibition context
  - **Dependencies**: Task 3.3, Task 3.5, Task 3.6
  - **Validation**: Playwright test suite

---

## Phase 4: Portfolio Homepage (3-4 hours)

### API Endpoint

- [ ] **Task 4.1: Create exhibitions.json API** (30min)
  - Create: `/api/exhibitions.json`
  - Include: Array of all exhibitions with metadata
  - Include: Total count, last updated timestamp
  - Validate against schema
  - **Success**: API file valid, returns exhibition list
  - **Dependencies**: Task 1.6, Task 2.2
  - **Validation**: `curl http://localhost:9999/api/exhibitions.json | jq .`

- [ ] **Task 4.2: Create API generation script** (20min)
  - Create: `scripts/generate-api.js`
  - Read all exhibition config.json files
  - Generate /api/exhibitions.json
  - Add npm script: `"generate-api": "node scripts/generate-api.js"`
  - **Success**: Can regenerate API from exhibition configs
  - **Dependencies**: Task 4.1
  - **Validation**: `npm run generate-api && git diff api/exhibitions.json`

### Homepage Design

- [ ] **Task 4.3: Create new index.html** (60min)
  - Rename current: `mv index.html index-old.html`
  - Create: `/index.html` (new portfolio homepage)
  - Add: HTML structure (hero, grid, footer)
  - Add: Link tags for CSS
  - Add: Script tags for JS
  - **Success**: New homepage exists, validates as HTML5
  - **Dependencies**: None
  - **Validation**: `npm run validate-html index.html`

- [ ] **Task 4.4: Create homepage styles** (45min)
  - Create: `/styles/portfolio-homepage.css`
  - Style: Hero section (brand, tagline, description)
  - Style: Exhibition grid (responsive, 2-column)
  - Style: Exhibition cards (image, text, CTA)
  - Style: Footer
  - **Success**: Homepage visually complete
  - **Dependencies**: Task 4.3
  - **Validation**: Visual inspection at 375px, 768px, 1440px

- [ ] **Task 4.5: Create homepage JavaScript** (45min)
  - Create: `/js/homepage.js`
  - Implement: Fetch `/api/exhibitions.json`
  - Implement: Render exhibition cards
  - Implement: Lazy load cover images
  - Implement: Handle click navigation
  - **Success**: Homepage interactive, cards render
  - **Dependencies**: Task 4.1, Task 4.3
  - **Validation**: Click cards, navigate to exhibitions

### Exhibition Cards

- [ ] **Task 4.6: Design exhibition card component** (30min)
  - HTML structure: image, title, description, stats, CTA
  - CSS styling: hover effects, transitions
  - JavaScript: Click handler, image loading
  - **Success**: Card component reusable
  - **Dependencies**: Task 4.4, Task 4.5
  - **Validation**: Render multiple cards, test interactions

- [ ] **Task 4.7: Implement status badges** (20min)
  - CSS: Badge styles for "LIVE NOW", "ARCHIVED", "UPCOMING"
  - JS: Render badge based on config.status
  - Colors: Green (live), gray (archived), blue (upcoming)
  - **Success**: Badges display correctly
  - **Dependencies**: Task 4.6
  - **Validation**: Test all status values

- [ ] **Task 4.8: Implement placeholder card** (15min)
  - Design: "更多展览即将到来" / "More Exhibitions Coming Soon"
  - Style: Dashed border, muted colors
  - No click action
  - **Success**: Placeholder card shows when <3 exhibitions
  - **Dependencies**: Task 4.6

### SEO & Meta Tags

- [ ] **Task 4.9: Add homepage meta tags** (20min)
  - Add: `<title>` tag
  - Add: Meta description
  - Add: Open Graph tags
  - Add: Twitter Card tags
  - Create: `/assets/og-image-vulca.jpg` (homepage OG image)
  - **Success**: All meta tags present, OG image exists
  - **Dependencies**: Task 4.3
  - **Validation**: Test with Facebook/Twitter link preview

- [ ] **Task 4.10: Create sitemap.xml** (15min)
  - Create: `/sitemap.xml`
  - Include: Homepage URL
  - Include: All exhibition URLs
  - Include: Page URLs (about, exhibitions-archive)
  - **Success**: Sitemap valid, includes all pages
  - **Dependencies**: Task 4.1
  - **Validation**: `npm run validate-sitemap`

---

## Phase 5: Navigation & Pages (1-2 hours)

### Navigation Updates

- [ ] **Task 5.1: Update navigation menu** (30min)
  - Change: "主画廊" → "主页" (Main Gallery → Home)
  - Add: "展览归档" link (Exhibition Archive)
  - Update: "关于" link text/description
  - Implement: Context-aware navigation (different per page type)
  - **Success**: Navigation shows correct links
  - **Dependencies**: Task 1.4
  - **Validation**: Test navigation on all pages

- [ ] **Task 5.2: Update navigation i18n** (15min)
  - Update: `js/navigation-i18n.js` with new translations
  - Test: Language toggle on new homepage
  - **Success**: Navigation bilingual
  - **Dependencies**: Task 5.1

### About Page Updates

- [ ] **Task 5.3: Update pages/about.html** (30min)
  - Change focus: From "潮汐的负形" to "VULCA project"
  - Update: Project description, vision, goals
  - Update: RPAIT framework explanation
  - Update: Navigation links (return to homepage)
  - **Success**: About page describes VULCA platform
  - **Dependencies**: None
  - **Validation**: Read through, verify content accuracy

### Exhibition Archive Page

- [ ] **Task 5.4: Create exhibitions-archive.html** (45min)
  - Create: `/pages/exhibitions-archive.html`
  - Fetch: `/api/exhibitions.json`
  - Render: All exhibitions in chronological grid
  - Include: Filters by year, status
  - Include: Search box (future enhancement)
  - **Success**: Archive page shows all exhibitions
  - **Dependencies**: Task 4.1
  - **Validation**: Test with multiple exhibitions

---

## Phase 6: Testing & Validation (2-3 hours)

### Automated Tests

- [ ] **Task 6.1: Update Playwright tests** (60min)
  - Update: Homepage tests (new portfolio design)
  - Add: Exhibition page tests (template rendering)
  - Add: Navigation tests (updated menu)
  - Add: API tests (exhibitions.json)
  - **Success**: All tests pass
  - **Dependencies**: Phase 1-5 complete
  - **Validation**: `npm run test`

- [ ] **Task 6.2: Add visual regression tests** (optional, 30min)
  - Install: `npm install --save-dev @playwright/test`
  - Create: Screenshot tests for homepage, exhibition
  - **Success**: Visual tests baseline established
  - **Dependencies**: Task 6.1

### Manual Testing

- [ ] **Task 6.3: Test responsive design** (30min)
  - Test: Homepage at 375px, 768px, 1024px, 1440px
  - Test: Exhibition page at all breakpoints
  - Test: Navigation menu on mobile
  - **Success**: All layouts work on all sizes
  - **Dependencies**: Phase 4 complete
  - **Validation**: Chrome DevTools responsive mode

- [ ] **Task 6.4: Test interactive features** (30min)
  - Test: Click exhibition card → navigate to exhibition
  - Test: Dialogue auto-play in exhibition
  - Test: Reference badge toggle
  - Test: Image carousel navigation
  - Test: Language toggle
  - **Success**: All features work without errors
  - **Dependencies**: Phase 3, 4 complete
  - **Validation**: No console errors

- [ ] **Task 6.5: Test SEO** (20min)
  - Test: Homepage meta tags with Facebook Debugger
  - Test: Exhibition meta tags with Twitter Card Validator
  - Test: Sitemap with Google Search Console
  - **Success**: All meta tags render correctly
  - **Dependencies**: Task 4.9, Task 4.10

### Performance Testing

- [ ] **Task 6.6: Run Lighthouse audits** (30min)
  - Run: Lighthouse on homepage
  - Run: Lighthouse on exhibition page
  - Target: Performance ≥90, Accessibility ≥95
  - **Success**: All scores meet targets
  - **Dependencies**: Phase 4, 5 complete
  - **Validation**: Generate Lighthouse reports

- [ ] **Task 6.7: Test loading performance** (20min)
  - Test: Homepage load time (fast 3G)
  - Test: Exhibition load time (fast 3G)
  - Test: API response time
  - Target: <2s homepage, <3s exhibition, <500ms API
  - **Success**: All times meet targets
  - **Dependencies**: Phase 4 complete
  - **Validation**: Chrome DevTools Network tab

### Accessibility Testing

- [ ] **Task 6.8: Test keyboard navigation** (20min)
  - Test: Tab through all interactive elements
  - Test: Enter key activates links/buttons
  - Test: Escape key closes modals (if any)
  - **Success**: All interactions keyboard-accessible
  - **Dependencies**: Phase 4, 5 complete
  - **Validation**: Navigate site without mouse

- [ ] **Task 6.9: Test screen reader** (30min)
  - Install: NVDA (Windows) or VoiceOver (Mac)
  - Test: Homepage content announced correctly
  - Test: Exhibition content announced
  - Test: Navigation menu announced
  - **Success**: All content accessible to screen readers
  - **Dependencies**: Phase 4, 5 complete
  - **Validation**: Listen to full page read

---

## Phase 7: Documentation & Deployment (1-2 hours)

### Documentation

- [ ] **Task 7.1: Update README.md** (30min)
  - Update: Project description (multi-exhibition platform)
  - Update: Quick start guide
  - Add: Section on adding new exhibitions
  - Add: Link to scaffolding tool docs
  - **Success**: README accurate and helpful
  - **Dependencies**: None

- [ ] **Task 7.2: Create CONTRIBUTING.md** (20min)
  - Document: How to add a new exhibition
  - Document: How to update existing exhibition
  - Document: How to run validation tools
  - **Success**: Contributors have clear guide
  - **Dependencies**: Task 1.8, Task 1.9

- [ ] **Task 7.3: Update CLAUDE.md** (30min)
  - Update: Architecture section (new structure)
  - Add: Exhibition management section
  - Update: File structure diagram
  - Add: Scaffolding tool instructions
  - **Success**: Claude Code has updated guidance
  - **Dependencies**: Phase 1-6 complete

### Deployment Preparation

- [ ] **Task 7.4: Create deployment checklist** (15min)
  - Document: Pre-deployment steps
  - Document: Deployment steps
  - Document: Post-deployment verification
  - **Success**: Checklist ready for use
  - **Dependencies**: None

- [ ] **Task 7.5: Generate final API** (5min)
  - Run: `npm run generate-api`
  - Verify: API includes all exhibitions
  - Commit: `/api/exhibitions.json`
  - **Success**: API up-to-date
  - **Dependencies**: Task 4.2, Task 2.11

- [ ] **Task 7.6: Run final validation** (10min)
  - Run: `npm run validate-exhibition negative-space-of-the-tide`
  - Run: `npm test` (all tests)
  - Run: Lighthouse audits
  - **Success**: All validations pass
  - **Dependencies**: Phase 1-6 complete

### Git Operations

- [ ] **Task 7.7: Commit all changes** (15min)
  - Stage: `git add .`
  - Commit: `git commit -m "feat: Rebuild as multi-exhibition platform (v4.0)"`
  - Push: `git push origin feature/multi-exhibition-platform`
  - **Success**: All changes committed and pushed
  - **Dependencies**: Phase 1-7 complete

- [ ] **Task 7.8: Create pull request** (10min)
  - Use: `gh pr create --title "feat: Multi-exhibition platform (v4.0)" --body "..."`
  - Include: Link to OpenSpec proposal
  - Include: Screenshots of new homepage
  - **Success**: PR created with detailed description
  - **Dependencies**: Task 7.7
  - **Validation**: PR shows on GitHub

- [ ] **Task 7.9: Merge and deploy** (10min)
  - Review: Check PR on GitHub
  - Merge: `gh pr merge <pr-number> --merge`
  - Monitor: GitHub Pages deployment
  - **Success**: Changes live on vulcaart.art
  - **Dependencies**: Task 7.8
  - **Validation**: Visit production site

### Post-Deployment

- [ ] **Task 7.10: Verify production** (20min)
  - Visit: https://vulcaart.art (new homepage)
  - Visit: https://vulcaart.art/exhibitions/negative-space-of-the-tide/
  - Test: All features in production
  - Check: Console for errors
  - Check: Network for 404s
  - **Success**: All pages work in production
  - **Dependencies**: Task 7.9

- [ ] **Task 7.11: Update search console** (10min)
  - Submit: New sitemap to Google Search Console
  - Request: Re-indexing of homepage
  - Monitor: Indexing status
  - **Success**: Sitemap submitted
  - **Dependencies**: Task 7.9

---

## Summary

**Total Tasks**: 77
**Estimated Time**: 12-18 hours
**Parallelizable**: Many Phase 1-2 tasks can run concurrently

**Critical Path**:
1. Foundation (Phase 1) → 2. Migration (Phase 2) → 3. Template (Phase 3) → 4. Homepage (Phase 4) → 6. Testing (Phase 6) → 7. Deployment (Phase 7)

**Phase 5** (Navigation) can be done in parallel with Phase 4.

**Next Step After Approval**:
Start with Task 1.1 (Create feature branch)
