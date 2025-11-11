# Design: Multi-Exhibition Platform Architecture

**Change ID**: `rebuild-interactive-exhibition-platform`
**Status**: Draft
**Created**: 2025-11-10

---

## Architectural Overview

### System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     VULCA Portfolio Site                     │
│                    (vulcaart.art)                            │
└─────────────────────────────────────────────────────────────┘
                             │
                ┌────────────┴─────────────┐
                │                          │
       ┌────────▼────────┐       ┌────────▼────────┐
       │  Portfolio Home │       │   API Layer     │
       │  /index.html    │       │  /api/*.json    │
       └────────┬────────┘       └────────┬────────┘
                │                         │
                │  Fetches exhibition     │
                │  list metadata          │
                │                         │
                └────────┬────────────────┘
                         │
          ┌──────────────┴──────────────┐
          │                             │
  ┌───────▼────────┐           ┌───────▼────────┐
  │  Exhibition 1   │           │  Exhibition N   │
  │  /exhibitions/  │    ...    │  /exhibitions/  │
  │  [slug-1]/      │           │  [slug-n]/      │
  └───────┬─────────┘           └───────┬─────────┘
          │                             │
          │ Loads config + data         │
          │                             │
  ┌───────▼─────────────────────────────▼─────────┐
  │         Shared Component Library              │
  │  /shared/js/components/                       │
  │  - DialoguePlayer                             │
  │  - ArtworkCarousel                            │
  │  - ReferenceSystem                            │
  │  - RPAITVisualizations                        │
  └──────────────────────────────────────────────┘
```

---

## Design Decisions

### Decision 1: Client-Side Rendering vs Static Site Generation

**Context**: Need to support multiple exhibitions without backend infrastructure.

**Options Considered**:

**Option A: Pure Static HTML (No Dynamic Loading)**
- **Pros**:
  - Fastest performance (no JS required)
  - SEO-friendly out of box
  - Works with JS disabled
- **Cons**:
  - Code duplication across exhibitions
  - Hard to maintain consistency
  - No component reuse
- **Verdict**: ❌ Rejected - Defeats purpose of platform architecture

**Option B: Static Site Generator (11ty, Hugo, Jekyll)**
- **Pros**:
  - Build-time rendering (best of both worlds)
  - Template reuse
  - Markdown-based content
- **Cons**:
  - Requires build tooling (Node.js, Ruby, Go)
  - Build step adds complexity
  - Harder for non-technical users
  - GitHub Pages Jekyll has limitations
- **Verdict**: 🤔 Deferred - Consider for v5.0

**Option C: Client-Side Template + JSON** ✅ **SELECTED**
- **Pros**:
  - No build step (works directly on GitHub Pages)
  - Simple to understand (HTML + JSON)
  - Fast iteration (edit JSON, refresh)
  - Component reuse via ES6 modules
- **Cons**:
  - Small runtime overhead
  - Requires JavaScript enabled
  - Slightly slower first paint
- **Verdict**: ✅ **Selected** - Best fit for current scale (1-10 exhibitions)

**Implementation Details**:
```javascript
// Exhibition page loads like this:
// 1. Load template HTML
<div id="exhibition-root"></div>

// 2. Fetch config
const config = await fetch('./config.json').then(r => r.json());

// 3. Load data
const data = await fetch('./data.json').then(r => r.json());

// 4. Render with shared components
import { ExhibitionRenderer } from '/shared/js/exhibition-renderer.js';
const renderer = new ExhibitionRenderer(config, data);
renderer.render('#exhibition-root');
```

---

### Decision 2: File Organization - Monolithic vs Modular

**Context**: How to structure exhibition files and shared resources.

**Option A: Monolithic (All exhibitions share same JS bundle)**
```
/js/app.js (contains all exhibitions' logic)
/data/exhibitions.json (all data in one file)
```
- **Pros**: Single download, shared cache
- **Cons**: Large bundle, hard to maintain, exhibitions coupled
- **Verdict**: ❌ Rejected - Poor separation of concerns

**Option B: Per-Exhibition Bundles (Copy all code)**
```
/exhibitions/exhibit-1/js/app.js (full copy)
/exhibitions/exhibit-2/js/app.js (full copy)
```
- **Pros**: Complete isolation
- **Cons**: Massive code duplication, no updates propagate
- **Verdict**: ❌ Rejected - Maintenance nightmare

**Option C: Shared Components + Exhibition Data** ✅ **SELECTED**
```
/shared/js/components/       (reusable UI components)
/shared/styles/              (base styles)
/exhibitions/[slug]/
  ├── config.json            (exhibition metadata)
  ├── data.json              (artworks, personas, critiques)
  ├── dialogues.json         (dialogue messages)
  └── assets/                (exhibition-specific images)
```
- **Pros**:
  - Code reuse without duplication
  - Data isolation (exhibitions independent)
  - Easy updates (fix shared component once)
  - Clear separation of concerns
- **Cons**:
  - Multiple HTTP requests
  - Need careful versioning for components
- **Verdict**: ✅ **Selected** - Standard module pattern, industry best practice

**Asset Path Strategy**:
- Shared resources: Absolute paths (`/shared/js/...`)
- Exhibition assets: Relative paths (`./assets/cover.jpg`)
- This allows exhibitions to be self-contained and portable

---

### Decision 3: Data Schema - Normalized vs Denormalized

**Context**: How to structure exhibition JSON data.

**Option A: Normalized (Relational-style)**
```json
{
  "artworks": [{"id": "art-1", "title": "..."}],
  "personas": [{"id": "su-shi", "name": "..."}],
  "critiques": [{"artworkId": "art-1", "personaId": "su-shi", "text": "..."}]
}
```
- **Pros**: No duplication, easy to update
- **Cons**: Requires joins in JS, complex queries
- **Verdict**: ✅ **Selected** - Matches existing `data.js` structure

**Option B: Denormalized (Document-style)**
```json
{
  "artworks": [
    {
      "id": "art-1",
      "title": "...",
      "critiques": [
        {"persona": "su-shi", "text": "..."}
      ]
    }
  ]
}
```
- **Pros**: Fast reads, no joins
- **Cons**: Data duplication, hard to update personas
- **Verdict**: ❌ Rejected - Harder to maintain, duplicates persona info

**Selected Schema Structure**:
- `config.json` - Exhibition metadata (title, year, status, stats)
- `data.json` - Artworks, personas, critiques (normalized)
- `dialogues.json` - Dialogue messages (separate for large size)

**Rationale**:
- Separating `dialogues.json` keeps main `data.json` small for fast loading
- Dialogue data only loaded when DialoguePlayer is activated
- Config loaded first (lightweight) for instant preview cards

---

### Decision 4: URL Structure

**Context**: How to expose exhibitions via URLs.

**Options Considered**:

**Option A: Query Parameters**
```
/exhibition.html?id=negative-space-of-the-tide
```
- **Pros**: Single HTML file
- **Cons**: Ugly URLs, bad SEO, no direct linking
- **Verdict**: ❌ Rejected - Unprofessional

**Option B: Hash Routing**
```
/exhibitions.html#negative-space-of-the-tide
```
- **Pros**: No server config needed
- **Cons**: Bad SEO (hash not indexed), SPA complexity
- **Verdict**: ❌ Rejected - SEO critical for art site

**Option C: Directory-Based (index.html)** ✅ **SELECTED**
```
/exhibitions/negative-space-of-the-tide/index.html
→ Accessed as: /exhibitions/negative-space-of-the-tide/
```
- **Pros**:
  - Clean URLs (no .html extension visible)
  - SEO-friendly (each page indexed)
  - Shareable links
  - Works with GitHub Pages
- **Cons**:
  - Need `index.html` in each directory
- **Verdict**: ✅ **Selected** - Standard web practice

**URL Map**:
- Homepage: `/` (VULCA portfolio)
- Exhibition: `/exhibitions/[slug]/` (individual exhibition)
- Archive: `/pages/exhibitions-archive.html` (all exhibitions gallery)
- About: `/pages/about.html` (about VULCA project)

---

### Decision 5: API Design - Single vs Multiple Endpoints

**Context**: How to expose exhibition list for homepage.

**Option A: Single Aggregated Endpoint**
```json
// /api/exhibitions.json (all data in one request)
{
  "exhibitions": [ {...}, {...} ],
  "total": 2,
  "updated": "2025-11-10T00:00:00Z"
}
```
- **Pros**: One request, simple to implement
- **Cons**: Grows large with many exhibitions
- **Verdict**: ✅ **Selected for v4.0** - Fine for <20 exhibitions

**Option B: Paginated API**
```
/api/exhibitions.json?page=1&limit=10
```
- **Pros**: Scales to 100+ exhibitions
- **Cons**: Requires query parsing, complex for static site
- **Verdict**: 🤔 Deferred - Implement when >20 exhibitions

**Option C: Per-Exhibition Metadata**
```
/api/exhibitions/negative-space-of-the-tide/meta.json
```
- **Pros**: Distributed loading, no central bottleneck
- **Cons**: N+1 requests problem, slow homepage load
- **Verdict**: ❌ Rejected - Too many requests

**Selected Implementation**:
- Single `/api/exhibitions.json` for v4.0
- Include only lightweight metadata (no full data)
- Homepage makes 1 request, renders N cards
- Individual exhibition pages load their own `config.json`

**API Response Schema**:
```json
{
  "exhibitions": [
    {
      "id": "negative-space-of-the-tide",
      "slug": "negative-space-of-the-tide",
      "titleZh": "潮汐的负形",
      "titleEn": "Negative Space of the Tide",
      "year": 2025,
      "status": "live",
      "coverImage": "/exhibitions/negative-space-of-the-tide/assets/cover.jpg",
      "url": "/exhibitions/negative-space-of-the-tide/",
      "stats": {"artworks": 4, "personas": 6}
    }
  ],
  "total": 1,
  "updated": "2025-11-10T00:00:00Z"
}
```

---

### Decision 6: Component Versioning Strategy

**Context**: Shared components will evolve, but old exhibitions may rely on specific versions.

**Option A: Always Use Latest (No Versioning)**
```javascript
import { DialoguePlayer } from '/shared/js/components/dialogue-player.js';
```
- **Pros**: Simplest, all exhibitions auto-update
- **Cons**: Breaking changes break old exhibitions
- **Verdict**: ⚠️ **Selected with Caution** - Requires strict SemVer + testing

**Option B: Locked Versions**
```javascript
import { DialoguePlayer } from '/shared/js/components/dialogue-player@v3.0.0.js';
```
- **Pros**: Exhibitions never break
- **Cons**: Bug fixes don't propagate, version explosion
- **Verdict**: ❌ Rejected - Maintenance burden

**Option C: Optional Overrides**
```javascript
// Default: use latest from /shared/
// Override: copy specific version to exhibition dir
import { DialoguePlayer } from './js/dialogue-player.js';  // Local override
```
- **Pros**:
  - Default: auto-update
  - Safety valve: can freeze if needed
- **Cons**:
  - Slightly complex import logic
- **Verdict**: 🤔 **Considered for v4.1** - Good escape hatch

**Selected Strategy for v4.0**:
1. Use latest shared components (no versioning)
2. Enforce **semantic versioning** for components
3. **Breaking changes** require major version bump + migration guide
4. **Test all exhibitions** before deploying component updates
5. Keep change log in `/shared/CHANGELOG.md`

**Component Compatibility Matrix**:
```markdown
| Component          | v3.x Exhibition | v4.x Exhibition |
|--------------------|-----------------|-----------------|
| DialoguePlayer v3  | ✅              | ⚠️ (deprecated) |
| DialoguePlayer v4  | ❌              | ✅              |
| ArtworkCarousel v2 | ✅              | ✅              |
```

---

### Decision 7: Exhibition Template Approach

**Context**: How to create exhibition pages - static HTML or dynamic template.

**Option A: Static HTML per Exhibition**
```html
<!-- /exhibitions/exhibit-1/index.html (full HTML) -->
<!DOCTYPE html>
<html>
<head>...</head>
<body>
  <div class="dialogue-container">...</div>
</body>
</html>
```
- **Pros**: Full control, no JS required for structure
- **Cons**: Duplicate structure, hard to update layout
- **Verdict**: ❌ Rejected - Defeats template purpose

**Option B: Single Template + Data Injection** ✅ **SELECTED**
```html
<!-- /shared/templates/exhibition.html -->
<!DOCTYPE html>
<html>
<head>
  <meta id="meta-title" content="">  <!-- Filled by JS -->
</head>
<body>
  <div id="exhibition-root"></div>  <!-- Rendered by JS -->
  <script type="module" src="/shared/js/exhibition-loader.js"></script>
</body>
</html>
```
- **Pros**:
  - Single source of truth
  - Easy updates (fix once, apply to all)
  - Consistent structure
- **Cons**:
  - Requires JS for rendering
  - Slightly slower first paint
- **Verdict**: ✅ **Selected** - Standard SPA approach

**Option C: Hybrid (Static Shell + Dynamic Content)**
```html
<!-- /exhibitions/exhibit-1/index.html -->
<!DOCTYPE html>
<html>
<head>
  <title>潮汐的负形</title>  <!-- Static for SEO -->
</head>
<body>
  <div id="exhibition-root">
    <noscript>
      <h1>潮汐的负形</h1>
      <p>Please enable JavaScript...</p>
    </noscript>
  </div>
  <script>loadExhibition('negative-space-of-the-tide');</script>
</body>
</html>
```
- **Pros**:
  - SEO-friendly (static meta tags)
  - Graceful degradation
  - Fast perceived load
- **Cons**:
  - Small duplication (meta tags)
- **Verdict**: 🤔 **Consider for SEO optimization** - May implement in Phase 3

**Selected for v4.0**: Option B (Single Template)
- Prioritize maintainability over first-paint speed
- Use preload hints to mitigate JS load delay
- Consider hybrid approach if SEO issues arise

---

### Decision 8: Navigation System Architecture

**Context**: How to handle navigation between homepage, exhibitions, and pages.

**Current Navigation** (v3.x):
```
Hamburger Menu (☰)
├── 主画廊 / Main Gallery (/)
├── 评论家 / Critics (/pages/critics.html)
├── 关于 / About (/pages/about.html)
└── 过程 / Process (/pages/process.html)
```

**Target Navigation** (v4.0):
```
Hamburger Menu (☰)
├── 主页 / Home (/)                           # VULCA portfolio
├── 展览 / Exhibitions
│   ├── 潮汐的负形 / Negative Space (...)
│   └── [其他展览] / [Other Exhibitions]
├── 关于 / About (/pages/about.html)          # About VULCA
└── 展览归档 / Exhibition Archive (...)
```

**Design Choices**:

**Option A: Context-Aware Navigation**
- Homepage: Shows "展览归档" + "关于"
- Exhibition: Shows "← 返回主页" + Exhibition-specific pages
- **Pros**: Clean, focused navigation
- **Cons**: Different nav per page type
- **Verdict**: ✅ **Selected** - Better UX

**Option B: Global Navigation**
- Same navigation on all pages
- **Pros**: Consistent, predictable
- **Cons**: Cluttered, not all links relevant everywhere
- **Verdict**: ❌ Rejected - Poor information architecture

**Implementation**:
```javascript
// /shared/js/components/navigation.js
class ContextualNavigation {
  constructor(context) {
    this.context = context;  // 'homepage' | 'exhibition' | 'page'
  }

  render() {
    if (this.context === 'exhibition') {
      return this.renderExhibitionNav();
    } else if (this.context === 'homepage') {
      return this.renderHomeNav();
    }
  }

  renderExhibitionNav() {
    return `
      <nav>
        <a href="/">← VULCA 主页</a>
        <a href="#artworks">作品</a>
        <a href="#critiques">评论</a>
      </nav>
    `;
  }
}
```

---

### Decision 9: Asset Management Strategy

**Context**: How to handle images and media across exhibitions.

**Shared vs Exhibition-Specific**:

| Asset Type | Location | Rationale |
|------------|----------|-----------|
| Exhibition covers | `/exhibitions/[slug]/assets/cover.jpg` | Unique per exhibition |
| Artwork images | `/exhibitions/[slug]/assets/artwork-*.jpg` | Unique per exhibition |
| OG images | `/exhibitions/[slug]/assets/og-image.jpg` | Unique for social sharing |
| Component icons | `/shared/assets/icons/` | Reused across site |
| Fonts | `/shared/assets/fonts/` | Brand consistency |
| Favicon | `/assets/favicon.svg` | Site-wide branding |

**Asset Loading Strategy**:
```javascript
// In config.json:
{
  "assets": {
    "cover": "./assets/cover.jpg",      // Relative to exhibition dir
    "og": "./assets/og-image.jpg",
    "artworks": {
      "artwork-1": "./assets/artwork-1.jpg"
    }
  }
}

// Loader resolves relative to exhibition URL:
const baseUrl = '/exhibitions/negative-space-of-the-tide/';
const coverUrl = new URL(config.assets.cover, baseUrl).href;
// Result: /exhibitions/negative-space-of-the-tide/assets/cover.jpg
```

**Image Optimization**:
- Original: High-res (for exhibitions)
- Thumbnail: 400x300px (for homepage cards)
- OG Image: 1200x630px (for social sharing)
- Format: WebP with JPG fallback (future enhancement)

---

## Component Architecture

### Shared Component Library

**Component Inventory**:

| Component | Current Location | Target Location | Dependencies |
|-----------|-----------------|-----------------|--------------|
| DialoguePlayer | `/js/components/dialogue-player.js` | `/shared/js/components/dialogue-player.js` | VULCA_DATA |
| ArtworkCarousel | `/js/components/artwork-carousel.js` | `/shared/js/components/artwork-carousel.js` | None |
| UnifiedNavigation | `/js/components/unified-navigation.js` | `/shared/js/components/unified-navigation.js` | None |
| ReferenceBadge | (inline) | `/shared/js/components/reference-badge.js` | None |
| ReferenceList | (inline) | `/shared/js/components/reference-list.js` | None |
| RPAITRadar | `/js/visualizations/rpait-radar.js` | `/shared/js/visualizations/rpait-radar.js` | Chart.js |
| PersonaMatrix | `/js/visualizations/persona-matrix.js` | `/shared/js/visualizations/rpait-matrix.js` | Chart.js |

**Component Interface Design**:
```javascript
// Example: DialoguePlayer component
export class DialoguePlayer {
  constructor(dialogue, container, options = {}) {
    this.dialogue = dialogue;      // From dialogues.json
    this.container = container;    // DOM element
    this.options = {
      autoPlay: true,
      speed: 1.0,
      lang: 'zh',
      ...options
    };
  }

  async render() {
    // Render UI
  }

  destroy() {
    // Cleanup
  }
}

// Usage in exhibition:
import { DialoguePlayer } from '/shared/js/components/dialogue-player.js';
const dialogue = await loadDialogue('artwork-1');
const player = new DialoguePlayer(dialogue, '#dialogue-container');
await player.render();
```

**Component Communication**:
- Use **Custom Events** for cross-component messaging
- Example: Carousel fires `artworkChange` event → DialoguePlayer listens and updates

```javascript
// Carousel dispatches event:
carousel.addEventListener('change', () => {
  const event = new CustomEvent('artworkChange', {
    detail: { artworkId: this.currentArtwork.id }
  });
  window.dispatchEvent(event);
});

// DialoguePlayer listens:
window.addEventListener('artworkChange', (e) => {
  this.loadDialogue(e.detail.artworkId);
});
```

---

## Data Flow

### Exhibition Loading Sequence

```
1. User visits: /exhibitions/negative-space-of-the-tide/
   └─> Browser loads: index.html (from that directory)

2. index.html contains:
   <script type="module" src="/shared/js/exhibition-loader.js"></script>

3. exhibition-loader.js:
   ├─ Detect exhibition ID from URL pathname
   ├─ Fetch config.json (lightweight metadata)
   ├─ Update page <title>, <meta> tags
   └─ Render exhibition shell

4. User interacts:
   ├─ Click artwork → Fetch data.json (artworks, personas, critiques)
   ├─ Open dialogue → Fetch dialogues.json (dialogue messages)
   └─ View references → Already in dialogues.json

5. Caching strategy:
   ├─ config.json: Cache for 1 hour (rarely changes)
   ├─ data.json: Cache for 1 day (static after exhibition launch)
   └─ dialogues.json: Cache for 1 day
```

### Homepage Loading Sequence

```
1. User visits: /
   └─> Browser loads: index.html (portfolio homepage)

2. index.html contains:
   <script type="module" src="/js/homepage.js"></script>

3. homepage.js:
   ├─ Fetch /api/exhibitions.json (list of all exhibitions)
   ├─ Render exhibition cards in grid
   └─ Lazy load cover images

4. User clicks exhibition card:
   └─> Navigate to /exhibitions/[slug]/
```

---

## Performance Considerations

### Loading Strategy

**Critical Path**:
1. HTML (inline styles for above-fold)
2. CSS (base styles)
3. Exhibition config (JSON)
4. Template rendering (JS)

**Deferred Resources**:
- Dialogue data (loaded on demand)
- Artwork images (lazy loaded)
- Visualization libraries (Chart.js)

**Caching Headers** (GitHub Pages default):
```
Cache-Control: max-age=600  (10 minutes)
```

**Service Worker** (future enhancement):
- Cache shared components for offline access
- Precache active exhibitions
- Serve stale-while-revalidate for API

---

## Security Considerations

### XSS Prevention

**Risk**: User-generated content in JSON could contain malicious scripts.

**Mitigation**:
- Sanitize all JSON content before rendering
- Use `textContent` instead of `innerHTML` for user data
- Validate JSON schema before loading

**Example**:
```javascript
// ❌ Unsafe:
element.innerHTML = config.titleZh;

// ✅ Safe:
element.textContent = config.titleZh;

// ✅ Safe (for formatted content):
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(config.descriptionZh);
```

### Path Traversal

**Risk**: Malicious `config.json` could reference `../../../etc/passwd`.

**Mitigation**:
- Validate all asset paths are relative and within exhibition directory
- Use `new URL(path, baseUrl)` for safe path resolution

**Example**:
```javascript
function validateAssetPath(path, exhibitionBase) {
  const resolved = new URL(path, exhibitionBase);
  if (!resolved.href.startsWith(exhibitionBase)) {
    throw new Error('Invalid asset path: outside exhibition directory');
  }
  return resolved.href;
}
```

---

## Testing Strategy

### Test Levels

**Unit Tests**:
- Component rendering (DialoguePlayer, Carousel)
- Data loading utilities
- URL parsing helpers

**Integration Tests**:
- Exhibition page loads and renders
- Navigation between pages
- Data fetching and caching

**End-to-End Tests** (Playwright):
- Homepage displays exhibition cards
- Click card navigates to exhibition
- Dialogue player auto-plays
- All interactive features work

**Visual Regression Tests** (future):
- Homepage layout
- Exhibition card grid
- Dialogue player UI

---

## Migration Strategy

### Phase 1: Parallel Development

```
/index.html                     (OLD - unchanged)
/index-portfolio.html           (NEW - portfolio homepage)
/exhibitions/
  └── negative-space-of-the-tide/
      └── index.html            (NEW - migrated exhibition)
```

**Validation**:
- Old site works at `/index.html`
- New site works at `/index-portfolio.html`
- Both tested in staging

### Phase 2: Cutover

```bash
# When ready to deploy:
mv index.html index-old.html              # Backup
mv index-portfolio.html index.html        # Promote new homepage

# Create redirect
echo '<meta http-equiv="refresh" content="0; url=/exhibitions/negative-space-of-the-tide/">' > index-old.html
```

**Rollback Plan**:
```bash
# If issues found:
mv index.html index-portfolio.html        # Demote
mv index-old.html index.html              # Restore
```

---

## Future Enhancements

### v4.1 Enhancements
- Exhibition search functionality
- Filtering by year/status/artist
- Social sharing optimization
- Performance monitoring

### v5.0 Vision
- Backend CMS (if scaling to 20+ exhibitions)
- User accounts (for curators)
- Exhibition versioning
- Analytics dashboard
- Multi-author support

---

## Appendix: File Structure Reference

```
VULCA-EMNLP2025/
├── index.html                              # Portfolio homepage (NEW)
├── api/
│   └── exhibitions.json                    # Exhibition list API (NEW)
├── exhibitions/
│   └── negative-space-of-the-tide/
│       ├── index.html                      # Exhibition page (MIGRATED)
│       ├── config.json                     # Exhibition config (NEW)
│       ├── data.json                       # Artworks/personas/critiques (NEW)
│       ├── dialogues.json                  # Dialogue messages (NEW)
│       └── assets/
│           ├── cover.jpg
│           ├── og-image.jpg
│           └── artwork-*.jpg
├── shared/
│   ├── js/
│   │   ├── components/
│   │   │   ├── dialogue-player.js
│   │   │   ├── artwork-carousel.js
│   │   │   ├── unified-navigation.js
│   │   │   ├── reference-badge.js
│   │   │   └── reference-list.js
│   │   ├── visualizations/
│   │   │   ├── rpait-radar.js
│   │   │   └── rpait-matrix.js
│   │   ├── utils/
│   │   │   ├── data-loader.js
│   │   │   └── url-parser.js
│   │   └── exhibition-loader.js            # Main exhibition renderer
│   ├── styles/
│   │   ├── exhibition-base.css
│   │   └── components/
│   │       ├── dialogue-player.css
│   │       ├── reference-badge.css
│   │       └── reference-list.css
│   └── templates/
│       └── exhibition.html                 # Optional: HTML template
├── pages/
│   ├── about.html                          # About VULCA (UPDATED)
│   └── exhibitions-archive.html            # Exhibition gallery (NEW)
├── assets/                                 # Site-wide assets (UNCHANGED)
│   ├── favicon.svg
│   └── og-image-vulca.jpg
└── styles/
    └── main.css                            # Portfolio homepage styles (NEW)
```

---

**Status**: Design Complete, Ready for Spec Writing
**Next**: Create spec files for each capability
