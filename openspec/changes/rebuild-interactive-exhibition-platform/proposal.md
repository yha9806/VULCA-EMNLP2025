# Proposal: Rebuild Interactive Exhibition Platform as Multi-Exhibition Portfolio

**Change ID**: `rebuild-interactive-exhibition-platform`
**Status**: Draft
**Created**: 2025-11-10
**Target Version**: 4.0.0

---

## What Changes

Transform VULCA from a **single-exhibition website** into a **multi-exhibition portfolio platform** with CMS-style architecture.

### Current Architecture (Version 3.x)
```
/ (index.html) = "潮汐的负形" single exhibition
├── pages/critics.html, about.html, process.html
├── js/data.js (hardcoded exhibition data)
└── assets/ (exhibition-specific resources)
```

### Target Architecture (Version 4.0)
```
/ (index.html) = VULCA portfolio homepage
├── exhibitions/
│   ├── negative-space-of-the-tide/      # Current exhibition
│   │   ├── index.html                    # Exhibition page (template-based)
│   │   ├── config.json                   # Exhibition metadata
│   │   ├── data.json                     # Artworks, personas, critiques
│   │   ├── dialogues.json                # Dialogue messages
│   │   └── assets/                       # Exhibition-specific assets
│   └── [future-exhibition-id]/           # Future exhibitions (repeatable)
├── shared/                                # Shared resources
│   ├── styles/exhibition-base.css
│   ├── js/components/                    # Reusable components
│   └── templates/exhibition.html         # Exhibition page template
├── api/
│   └── exhibitions.json                  # Exhibition list API
└── pages/
    ├── about.html                        # About VULCA (not specific exhibition)
    └── exhibitions-archive.html          # All exhibitions gallery
```

### Key Changes
1. **Homepage**: New portfolio landing page showcasing all exhibitions
2. **Exhibition Structure**: Each exhibition in isolated directory with JSON configs
3. **Template System**: Shared HTML template loaded dynamically with exhibition data
4. **API Layer**: JSON endpoints for exhibition discovery and metadata
5. **Shared Resources**: Component library for reusable UI elements
6. **URL Structure**: Clean paths (`/exhibitions/[slug]/` instead of `/tide.html`)

---

## Why

### User Need
> "我需要这个网站作为 VULCA 项目的主页，展示我们所有的展览作品。每次投稿新的艺术展览，我可以快速创建一个新的子页面，而不需要重写整个网站。"

**Translation**: "I need this website to be the VULCA project homepage, showcasing all our exhibition works. Each time I submit to a new art exhibition, I can quickly create a new sub-page without rewriting the entire site."

### Problems with Current Architecture

**Problem 1: Single Exhibition Limitation**
- Current site is tightly coupled to "潮汐的负形" exhibition
- Cannot showcase multiple exhibitions
- Difficult to reuse for new exhibitions

**Problem 2: Code Duplication Risk**
- Adding new exhibitions would require copying entire codebase
- No shared component library
- Hard to maintain consistency across exhibitions

**Problem 3: Portfolio Presentation**
- No unified entry point for curators/galleries
- Cannot show VULCA's body of work
- Missing professional portfolio structure

**Problem 4: Scalability Issues**
- Adding 10+ exhibitions would create file chaos at root level
- No systematic organization by year/type/status
- Asset management becomes unmanageable

**Problem 5: Investment Efficiency**
- 100+ hours of development locked to single exhibition
- Cannot amortize development cost across multiple exhibitions
- Each new exhibition requires near-full rebuild

### Business Value

**For Art Submissions (Open Calls)**:
- ✅ Show curators VULCA's complete portfolio
- ✅ Provide direct links to specific exhibitions
- ✅ Demonstrate technical sophistication and reusability
- ✅ Professional presentation increases acceptance rate

**For Long-Term Platform Growth**:
- ✅ Build exhibition library (3-5 exhibitions in Year 1)
- ✅ Establish VULCA as ongoing art project, not one-off
- ✅ Create reusable infrastructure for future work
- ✅ Enable collaboration (other artists can use platform)

**For Research Impact**:
- ✅ Showcase RPAIT framework across different artworks
- ✅ Compare AI critique performance across exhibitions
- ✅ Build dataset of cultural perspectives on diverse art
- ✅ Strengthen academic publication potential

---

## How

### Implementation Strategy: 3-Phase Rollout

#### Phase 1: Foundation (Core Infrastructure)
**Goal**: Create multi-exhibition architecture without breaking existing site
**Duration**: 6-8 hours
**Deliverables**:
1. New VULCA homepage (`/index.html`)
2. Exhibition template system (`/shared/templates/`)
3. Data schema definition (`config.json`, `data.json`, `dialogues.json`)
4. API endpoint (`/api/exhibitions.json`)
5. GitHub feature branch: `feature/multi-exhibition-platform`

**Validation**:
- [ ] New homepage displays placeholder exhibition card
- [ ] Template system loads and renders test data
- [ ] JSON configs validate against schema
- [ ] API endpoint returns valid JSON

#### Phase 2: Migration (Move Current Exhibition)
**Goal**: Migrate "潮汐的负形" to new structure
**Duration**: 4-6 hours
**Deliverables**:
1. Create `/exhibitions/negative-space-of-the-tide/`
2. Generate JSON configs from existing `js/data.js`
3. Migrate dialogue data to `dialogues.json`
4. Update asset paths to relative URLs
5. Test exhibition page with template system

**Validation**:
- [ ] Exhibition accessible at `/exhibitions/negative-space-of-the-tide/`
- [ ] All features work identically to current site
- [ ] No broken links or missing assets
- [ ] Lighthouse score maintained (>90)

#### Phase 3: Polish (Production Readiness)
**Goal**: Finalize design and deploy to production
**Duration**: 2-4 hours
**Deliverables**:
1. Homepage design implementation (responsive, accessible)
2. Exhibition archive page
3. Updated navigation system
4. SEO optimization (meta tags, OG images per exhibition)
5. Documentation for adding new exhibitions

**Validation**:
- [ ] Homepage passes accessibility audit (WCAG 2.1 AA)
- [ ] All pages responsive (375px to 1920px)
- [ ] Each exhibition has unique meta tags
- [ ] Documentation tested with mock exhibition

### Technical Approach

#### Data-Driven Architecture
**Exhibition Config Schema** (`config.json`):
```json
{
  "id": "negative-space-of-the-tide",
  "slug": "negative-space-of-the-tide",
  "titleZh": "潮汐的负形",
  "titleEn": "Negative Space of the Tide",
  "year": 2025,
  "status": "live",  // live | archived | upcoming
  "venue": {
    "name": "EMNLP 2025 Findings",
    "url": "https://aclanthology.org/2025.findings-emnlp.103/"
  },
  "coverImage": "./assets/cover.jpg",
  "ogImage": "./assets/og-image.jpg",
  "descriptionZh": "探索AI如何从6种文化视角理解艺术...",
  "descriptionEn": "Exploring how AI understands art from 6 cultural perspectives...",
  "stats": {
    "artworks": 4,
    "personas": 6,
    "messages": 30,
    "dialogues": 4
  },
  "features": [
    "dialogue-player",
    "image-carousel",
    "knowledge-base-references",
    "thought-chain-visualization"
  ],
  "theme": {
    "primaryColor": "#B85C3C",
    "accentColor": "#D4A574"
  }
}
```

**Exhibition Data Schema** (`data.json`):
```json
{
  "artworks": [ /* existing artwork objects */ ],
  "personas": [ /* existing persona objects */ ],
  "critiques": [ /* existing critique objects */ ]
}
```

**Dialogue Data Schema** (`dialogues.json`):
```json
{
  "dialogues": [ /* existing dialogue threads */ ]
}
```

#### Template-Based Rendering
**Exhibition Page Template** (`/shared/templates/exhibition.html`):
- Generic HTML structure
- Placeholder elements for dynamic content
- JavaScript loader fetches `config.json` and renders
- All shared components imported from `/shared/js/components/`

**Example**:
```html
<!-- Simplified structure -->
<div id="exhibition-root" data-exhibition-id="from-url-path">
  <header id="exhibition-header"></header>
  <main id="exhibition-content"></main>
  <footer id="exhibition-footer"></footer>
</div>

<script type="module">
  import { ExhibitionRenderer } from '/shared/js/exhibition-renderer.js';

  const exhibitionId = window.location.pathname.split('/')[2];
  const renderer = new ExhibitionRenderer(exhibitionId);
  await renderer.load();
  renderer.render('#exhibition-root');
</script>
```

#### Shared Component Library
**Components** (`/shared/js/components/`):
- `dialogue-player.js` (existing, moved)
- `artwork-carousel.js` (existing, moved)
- `unified-navigation.js` (existing, adapted for exhibitions)
- `reference-badge.js` (existing, moved)
- `rpait-visualizations.js` (existing, moved)

**Benefits**:
- Single source of truth for UI components
- Bug fixes apply to all exhibitions
- Consistent user experience
- Smaller bundle size (shared caching)

#### API Design
**Exhibitions List** (`/api/exhibitions.json`):
```json
{
  "exhibitions": [
    {
      "id": "negative-space-of-the-tide",
      "titleZh": "潮汐的负形",
      "titleEn": "Negative Space of the Tide",
      "year": 2025,
      "status": "live",
      "coverImage": "/exhibitions/negative-space-of-the-tide/assets/cover.jpg",
      "url": "/exhibitions/negative-space-of-the-tide/",
      "stats": { "artworks": 4, "personas": 6 }
    }
    // ... more exhibitions
  ],
  "total": 1,
  "updated": "2025-11-10T00:00:00Z"
}
```

**Homepage Consumption**:
```javascript
fetch('/api/exhibitions.json')
  .then(res => res.json())
  .then(data => {
    renderExhibitionGrid(data.exhibitions);
  });
```

### Migration Path (Zero Downtime)

**Step-by-Step Migration**:
1. Create new structure in feature branch
2. Add new homepage (doesn't replace existing yet)
3. Migrate one exhibition to `/exhibitions/`
4. Test both old and new URLs work
5. Update DNS/redirects only after validation
6. Keep old structure for 1 month as fallback

**Backward Compatibility**:
- Old URL (`/`) redirects to `/exhibitions/negative-space-of-the-tide/`
- Or: Old URL shows "Moved" notice with link to new location
- Preserve all existing `/pages/` URLs

---

## Risks and Mitigations

### Risk 1: Asset Path Changes
**Problem**: Moving files breaks relative paths
**Mitigation**:
- Use path validation script before deployment
- Test with Playwright on all exhibition pages
- Create asset migration checklist

### Risk 2: SEO Impact
**Problem**: Changing URLs harms search rankings
**Mitigation**:
- Implement 301 redirects from old URLs
- Submit new sitemap to Google
- Keep meta descriptions consistent
- Monitor Search Console for errors

### Risk 3: Increased Complexity
**Problem**: Template system harder to debug than static HTML
**Mitigation**:
- Comprehensive error handling in renderer
- Fallback to static render if JS fails
- Detailed logging for config loading
- Developer documentation with examples

### Risk 4: GitHub Pages Limitations
**Problem**: No server-side rendering, only client-side
**Mitigation**:
- Use static JSON files (no API backend needed)
- Pre-generate `exhibitions.json` with build script
- Progressive enhancement (works without JS for basic content)

### Risk 5: Performance Regression
**Problem**: Loading configs adds network requests
**Mitigation**:
- Cache exhibition configs in localStorage
- Use HTTP/2 for parallel loading
- Preload critical resources
- Lazy load non-critical components

---

## Success Metrics

### Functional Metrics
- [ ] New homepage loads in <2s (fast 3G)
- [ ] All existing features work in migrated exhibition
- [ ] Can add new exhibition in <30 minutes
- [ ] All tests pass (existing + new)

### User Experience Metrics
- [ ] Lighthouse Performance >90
- [ ] Lighthouse Accessibility >95
- [ ] Zero console errors
- [ ] Mobile responsive (375px to 1920px)

### Developer Experience Metrics
- [ ] Adding exhibition: <5 files to edit
- [ ] Clear documentation exists
- [ ] Example exhibition provided
- [ ] Validation tools catch config errors

### Business Metrics
- [ ] Portfolio page ready for curator presentations
- [ ] Can submit to 3+ open calls with custom exhibitions
- [ ] Reduced time to create new exhibition (from 40h to 4h)

---

## Dependencies

### External Dependencies
- GitHub Pages (static hosting)
- GitHub CLI (branch management)
- Playwright (testing)
- Chart.js (existing, for visualizations)

### Internal Dependencies
- Existing dialogue system (Phase 3.3)
- Existing component library (dialogue-player, carousel, etc.)
- Knowledge base structure (for references)

### Prerequisite Work
- All Phase 3.x features must be complete
- No active bugs in dialogue system
- Documentation up-to-date

---

## Out of Scope

**Not Included in This Change**:
- Backend CMS with admin panel (future enhancement)
- User authentication (not needed for public site)
- Exhibition analytics dashboard (future)
- Multi-language support beyond zh/en (future)
- Exhibition search functionality (future, when 10+ exhibitions)
- Social features (comments, likes, etc.)

**Explicitly Deferred**:
- Visual exhibition builder tool (CLI-based creation sufficient for now)
- Automated config generation from Notion/Airtable (manual JSON for v4.0)
- Exhibition versioning system (future when content changes frequently)

---

## Alternatives Considered

### Alternative A: Keep Single Exhibition, Duplicate for New Ones
**Pros**: No architecture change, fast to implement
**Cons**: Code duplication, maintenance nightmare, unprofessional
**Decision**: ❌ Rejected - Not scalable beyond 2-3 exhibitions

### Alternative B: Minimal Restructure (方案A from earlier analysis)
**Pros**: Low risk, quick implementation (2-3 hours)
**Cons**: URLs ugly (`/tide.html`), no shared components, limited scalability
**Decision**: ❌ Rejected - Doesn't meet long-term needs

### Alternative C: Full Backend CMS (Strapi, KeystoneJS, etc.)
**Pros**: Visual editor, user management, powerful features
**Cons**: Requires hosting ($), overkill for 5-10 exhibitions, breaks GitHub Pages
**Decision**: ❌ Rejected - Adds complexity without proportional value

### Alternative D: Static Site Generator (Hugo, Eleventy, etc.)
**Pros**: Build-time generation, fast performance, mature tooling
**Cons**: Requires build step, Node.js dependency, learning curve
**Decision**: 🤔 **Deferred** - Consider for v5.0 if scaling to 20+ exhibitions

### Selected Approach: Client-Side Template + JSON Configs
**Pros**:
- Works with GitHub Pages (no build step)
- Simple to understand (HTML + JSON)
- Fast iteration (no compilation)
- Progressive enhancement (works without JS)
**Cons**:
- Small performance overhead (runtime rendering)
- Manual JSON editing (no GUI)
**Decision**: ✅ **Selected** - Best balance for current needs (1-10 exhibitions)

---

## Timeline

### Week 1 (Nov 10-16): Foundation
- Day 1-2: Create feature branch, design data schemas
- Day 3-4: Build new homepage, template system
- Day 5: Create API endpoint, test rendering

### Week 2 (Nov 17-23): Migration
- Day 1-2: Migrate current exhibition to new structure
- Day 3: Test all features in new location
- Day 4-5: Fix bugs, optimize performance

### Week 3 (Nov 24-30): Polish & Deploy
- Day 1-2: Finalize homepage design, responsive testing
- Day 3: SEO optimization, documentation
- Day 4: Staging deployment, UAT
- Day 5: Production deployment

**Total Estimated Time**: 12-18 hours of development work

---

## Approval Checklist

Before proceeding with implementation:
- [ ] User confirms 方案C (CMS architecture) is correct choice
- [ ] Design mockups approved (homepage, exhibition cards)
- [ ] Data schema reviewed and validated
- [ ] Migration plan agreed upon (no downtime requirement)
- [ ] Success metrics accepted
- [ ] Timeline feasible for user's open call deadlines

---

## Next Steps

After proposal approval:
1. Create feature branch: `feature/multi-exhibition-platform`
2. Draft detailed `design.md` (architectural decisions)
3. Create spec files for each capability:
   - `portfolio-homepage/spec.md`
   - `exhibition-structure/spec.md`
   - `template-system/spec.md`
   - `data-migration/spec.md`
4. Draft `tasks.md` with 50+ granular tasks
5. Begin Phase 1 implementation

---

**Author**: Claude Code
**Reviewers**: User
**Status**: Awaiting Approval
