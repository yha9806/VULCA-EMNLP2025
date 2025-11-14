# Design: Sync Exhibition with PPT Final Version

**Change ID**: `sync-exhibition-with-ppt-final-version`
**Last Updated**: 2025-11-14

---

## Architectural Overview

### System Context

```
┌─────────────────────────────────────────────────────────────┐
│                   VULCA Exhibition Platform                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐      ┌──────────────┐      ┌────────────┐│
│  │  PPT Final   │─────▶│  Data Sync   │─────▶│  Website   ││
│  │   Version    │      │   Pipeline   │      │  Display   ││
│  └──────────────┘      └──────────────┘      └────────────┘│
│        (Source)             (Process)           (Destination)│
│                                                               │
│  Components Updated:                                          │
│  • data.json (38→46 artworks)                                │
│  • dialogues/ (38→46 files)                                  │
│  • pages/artists.html (NEW)                                  │
│  • Navigation system (enhanced)                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Design Decisions

### Decision 1: Phased Sync vs. Complete Wait

**Context**: 8 new artists identified, but 3 have pending artwork status.

**Options Considered**:

| Option | Pros | Cons | Chosen |
|--------|------|------|--------|
| A. Phased (5 confirmed + 3 placeholders) | Fast deployment, shows progress | Requires placeholder UI | ✅ YES |
| B. Wait for all confirmations | Clean, complete | Delays weeks, website outdated | ❌ NO |
| C. Add only confirmed 5 | Simple implementation | Incomplete exhibition (43%) | ❌ NO |

**Decision**: **Option A - Phased Sync**

**Rationale**:
1. **User Value**: 5 confirmed artists = 13% growth in content, deployable immediately
2. **Transparency**: Placeholder cards show exhibition is active/growing
3. **Flexibility**: Easy to upgrade pending → confirmed (just swap data, no code change)
4. **Professional**: Shows curators actively expanding exhibition

**Trade-offs Accepted**:
- ⚠️ Need to build "Coming Soon" UI component (1 hour extra dev time)
- ⚠️ Risk: Pending artists may never confirm (mitigated by 2-week deadline)

---

### Decision 2: Artist Roster Page Architecture

**Context**: PPT adds "返回名单" (Return to List) to 89/96 slides. Need equivalent web UX.

**Options Considered**:

| Option | Implementation | UX Quality | Effort |
|--------|---------------|------------|--------|
| A. Dedicated `/pages/artists.html` | Standalone page, grid layout | Excellent | 2 hours |
| B. Modal overlay on homepage | JavaScript popup | Good | 1.5 hours |
| C. Sidebar on all pages | Persistent sidebar | Fair | 3 hours |

**Decision**: **Option A - Dedicated Page**

**Rationale**:
1. **Scalability**: Grid supports 46+ artworks without clutter
2. **SEO**: Separate URL indexable by search engines
3. **Performance**: Only loads when needed (not always in DOM)
4. **Maintainability**: Clear separation of concerns

**Implementation Details**:
```html
<!-- /pages/artists.html -->
<div class="artist-roster">
  <div class="filters">
    <select name="school">...</select>
    <select name="status">...</select>
  </div>

  <div class="artist-grid">
    <div class="artist-card" data-status="confirmed">
      <img src="/assets/artist-thumbnail.jpg" alt="Artist Name">
      <h3>Artist Name</h3>
      <p class="school">School Name</p>
      <span class="status-badge confirmed">✓ Confirmed</span>
    </div>

    <div class="artist-card" data-status="pending">
      <div class="placeholder-image">🎨</div>
      <h3>Artist Name</h3>
      <p class="school">School Name</p>
      <span class="status-badge pending">⏳ Coming Soon</span>
    </div>
  </div>
</div>
```

**Trade-offs Accepted**:
- ⚠️ Extra page load when navigating from homepage
- ✅ Mitigated by: Prefetch artist page on homepage hover

---

### Decision 3: Data Schema for Pending Artworks

**Context**: Need to store incomplete artwork data without breaking existing components.

**Options Considered**:

| Option | Schema Change | Component Impact | Risk |
|--------|--------------|------------------|------|
| A. Add `status` field | `"status": "confirmed"\|"pending"` | Minimal (check before render) | Low |
| B. Separate `pending_artworks` array | New top-level key | High (need dual logic) | Medium |
| C. Use `null` fields for pending | No schema change | High (null checks everywhere) | High |

**Decision**: **Option A - Status Field**

**Schema Extension**:
```json
{
  "artworks": [
    {
      "id": "artwork-39",
      "titleZh": "渴望说出难以忘怀的事物 III",
      "titleEn": "Longing to Speak of Unforgettable Things III",
      "year": 2024,
      "artist": "凌筱薇 (Ling Xiaowei)",
      "imageUrl": "/assets/artworks/artwork-39/01.jpg",
      "status": "confirmed",  // NEW FIELD
      "metadata": {
        "school": "中央美术学院",
        "confirmationDate": "2025-11-14"
      }
    },
    {
      "id": "artwork-40",
      "titleZh": "作品待定",
      "titleEn": "Artwork TBD",
      "year": 2025,
      "artist": "金钛锆 (Jin Taigao)",
      "imageUrl": "/assets/placeholders/pending-artwork.svg",
      "status": "pending",  // NEW FIELD
      "metadata": {
        "school": "Unknown",
        "expectedDate": "2025-12-01"
      }
    }
  ]
}
```

**Component Updates Needed**:
```javascript
// Before
function renderArtwork(artwork) {
  return `<img src="${artwork.imageUrl}" alt="${artwork.titleZh}">`;
}

// After
function renderArtwork(artwork) {
  if (artwork.status === 'pending') {
    return `
      <div class="pending-artwork">
        <img src="${artwork.imageUrl}" alt="Coming Soon">
        <div class="pending-overlay">
          <span>⏳ Coming Soon</span>
        </div>
      </div>
    `;
  }
  return `<img src="${artwork.imageUrl}" alt="${artwork.titleZh}">`;
}
```

**Backward Compatibility**:
- Existing artworks default to `status: "confirmed"` (implicit)
- All components check status before rendering special UI
- Dialogue system skips pending artworks (no dialogues yet)

**Trade-offs Accepted**:
- ⚠️ All UI components must handle status field
- ✅ Mitigated by: Centralized render utility function

---

### Decision 4: Dialogue Generation Strategy

**Context**: Need dialogues for 8 new artworks (5 confirmed + 3 pending).

**Options Considered**:

| Option | Quality | Speed | Manual Effort |
|--------|---------|-------|---------------|
| A. Auto-generate all | Medium | Fast (3 hours) | Low |
| B. Manual curation | High | Slow (20+ hours) | Very High |
| C. Hybrid (generate + review) | High | Medium (5 hours) | Medium |

**Decision**: **Option C - Hybrid Approach**

**Process**:
1. **For Confirmed Artists (5)**:
   - Auto-generate dialogues using `scripts/convert-critiques-to-dialogues.js`
   - Manual review: Check persona voice consistency
   - Manual edits: Enhance 2-3 key messages per artwork
   - Quality bar: 80% auto + 20% manual refinement

2. **For Pending Artists (3)**:
   - Generate placeholder dialogues (generic, reusable)
   - Use template: "This artwork is still being created..."
   - Replace entirely when artwork confirmed

**Quality Assurance**:
```bash
# Step 1: Generate
node scripts/convert-critiques-to-dialogues.js --batch 39-46

# Step 2: Validate
node scripts/validate-dialogue-data.js --artworks 39-46

# Step 3: Manual Review (checklist)
# - [ ] Su Shi uses classical Chinese references
# - [ ] Guo Xi discusses landscape principles
# - [ ] John Ruskin emphasizes moral dimensions
# - [ ] Mama Zola centers community values
# - [ ] Professor Petrova analyzes formal structure
# - [ ] AI Ethics Reviewer questions power dynamics
```

**Trade-offs Accepted**:
- ⚠️ Auto-generated dialogues less poetic than fully manual
- ✅ Acceptable: Users prioritize content breadth over perfection
- ✅ Mitigated by: 20% manual enhancement for key moments

---

### Decision 5: Navigation Flow Architecture

**Context**: Implement "Return to Artist List" pattern from PPT.

**User Journey**:
```
Homepage
   ↓
[Click "Artists"]
   ↓
Artist Roster Page (/pages/artists.html)
   ↓
[Click Artist Card]
   ↓
Artwork Detail (展览页面)
   ↓
[Click "← Return to List"]
   ↓
Artist Roster Page
```

**Implementation**:

```javascript
// Global navigation state
const NAVIGATION_STATE = {
  from: null,  // 'homepage' | 'artist-roster'
  scrollPosition: 0
};

// When navigating to artwork
function navigateToArtwork(artworkId) {
  NAVIGATION_STATE.from = 'artist-roster';
  NAVIGATION_STATE.scrollPosition = window.scrollY;
  sessionStorage.setItem('nav_state', JSON.stringify(NAVIGATION_STATE));

  window.location.href = `/exhibitions/negative-space-of-the-tide/#artwork-${artworkId}`;
}

// "Return to List" button
function returnToArtistList() {
  const state = JSON.parse(sessionStorage.getItem('nav_state') || '{}');

  window.location.href = '/pages/artists.html';

  // Restore scroll position on load
  window.addEventListener('load', () => {
    window.scrollTo(0, state.scrollPosition || 0);
  }, { once: true });
}
```

**Trade-offs Accepted**:
- ⚠️ SessionStorage-based state (lost on browser close)
- ✅ Acceptable: Most sessions are continuous
- ✅ Fallback: Button still works, just resets scroll position

---

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                     Data Sync Pipeline                        │
└──────────────────────────────────────────────────────────────┘

[PPT Final Version]
        ↓
  (Extract metadata)
        ↓
[scripts/ppt-to-json.py]  ← Manual: Map slide numbers to artwork IDs
        ↓
[New artwork entries (JSON)]
        ↓
  (Merge with existing)
        ↓
[exhibitions/.../data.json]  ← 38 artworks + 8 new = 46 artworks
        ↓
        ├─────────────────────────┬──────────────────────────┐
        ↓                         ↓                          ↓
  (Generate dialogues)      (Update UI)             (Update navigation)
        ↓                         ↓                          ↓
[js/data/dialogues/       [index.html]            [pages/artists.html]
 artwork-39.js to          Carousel updates         NEW: Artist roster
 artwork-46.js]            Status badges            Return buttons
        ↓                         ↓                          ↓
        └─────────────────────────┴──────────────────────────┘
                                  ↓
                          [Deploy to GitHub Pages]
                                  ↓
                         [User sees 46 artworks]
```

---

## Component Interaction

### Before (Current State)
```
Homepage
   ├─ Artwork Carousel (38 artworks)
   ├─ Hamburger Menu
   │    ├─ 主页
   │    ├─ 展览归档
   │    ├─ 评论家
   │    ├─ 关于
   │    └─ 过程
   └─ Dialogue Player
```

### After (New State)
```
Homepage
   ├─ Artwork Carousel (46 artworks)
   │    └─ Status Badge (pending/confirmed)
   ├─ Hamburger Menu
   │    ├─ 主页
   │    ├─ 艺术家名单 (NEW)
   │    ├─ 展览归档
   │    ├─ 评论家
   │    ├─ 关于
   │    └─ 过程
   ├─ Dialogue Player
   │    └─ Skip pending artworks
   └─ Return to List Button (NEW)

Artist Roster Page (NEW)
   ├─ Filter Controls
   │    ├─ By School
   │    ├─ By Status
   │    └─ Search
   ├─ Artist Grid (46 cards)
   │    ├─ Confirmed (43 cards)
   │    └─ Pending (3 cards with overlay)
   └─ Return to Homepage Button
```

---

## Performance Considerations

### Dialogue Loading Strategy

**Problem**: Loading 46 dialogue files (650KB+) on initial page load slows FCP.

**Solution**: Lazy load dialogues on demand.

```javascript
// Before: Load all dialogues upfront
import { DIALOGUES } from '/js/data/dialogues/index.js';  // 650KB

// After: Load on-demand
async function loadDialogue(artworkId) {
  const module = await import(`/js/data/dialogues/artwork-${artworkId}.js?v=3`);
  return module[`artwork${artworkId}Dialogue`];
}

// Preload next artwork's dialogue (predictive loading)
function preloadNextDialogue(currentArtworkId) {
  const nextId = currentArtworkId + 1;
  if (nextId <= 46) {
    import(`/js/data/dialogues/artwork-${nextId}.js?v=3`);
  }
}
```

**Performance Impact**:
- Initial load: 650KB → 17KB (96% reduction)
- On-demand load: ~17KB per artwork (amortized)
- Perceived speed: 3.5s → 1.2s (FCP improvement)

### Image Optimization

**Problem**: 8 new artworks need images, current approach uses PNG (200KB+ each).

**Solution**: Implement progressive image loading.

```html
<!-- Before -->
<img src="/assets/artworks/artwork-39/01.png" alt="Artwork 39">

<!-- After -->
<picture>
  <source srcset="/assets/artworks/artwork-39/01.avif" type="image/avif">
  <source srcset="/assets/artworks/artwork-39/01.webp" type="image/webp">
  <img src="/assets/artworks/artwork-39/01.jpg"
       alt="Artwork 39"
       loading="lazy"
       width="1200"
       height="800">
</picture>
```

**Performance Impact**:
- File size: 200KB (PNG) → 50KB (WebP) → 30KB (AVIF)
- Bandwidth savings: 85% with AVIF support
- Lazy loading: Only load images when scrolled into view

---

## Security Considerations

### Input Validation

**Risk**: User-generated content in pending artwork titles.

**Mitigation**:
```javascript
// Sanitize all text inputs from PPT
function sanitizeText(text) {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .trim();
}

// Validate artwork data before merge
function validateArtwork(artwork) {
  const required = ['id', 'titleZh', 'titleEn', 'artist', 'year'];
  for (const field of required) {
    if (!artwork[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Validate year range
  if (artwork.year < 2000 || artwork.year > 2030) {
    throw new Error(`Invalid year: ${artwork.year}`);
  }

  return true;
}
```

### XSS Prevention

**Risk**: Dialogue content contains user-generated references.

**Mitigation**:
- All dialogue text rendered with `textContent` (not `innerHTML`)
- Knowledge base quotes escaped
- URL parameters validated before use

---

## Monitoring & Observability

### Metrics to Track

```javascript
// Analytics events
gtag('event', 'artwork_view', {
  artwork_id: 'artwork-39',
  status: 'confirmed',
  artist: '凌筱薇'
});

gtag('event', 'pending_artwork_click', {
  artwork_id: 'artwork-40',
  artist: '金钛锆'
});

gtag('event', 'return_to_list_click', {
  from_artwork: 'artwork-39'
});
```

### Error Tracking

```javascript
window.addEventListener('error', (e) => {
  if (e.filename.includes('dialogues')) {
    // Track dialogue loading errors
    gtag('event', 'dialogue_load_error', {
      artwork_id: extractArtworkId(e.filename),
      error_message: e.message
    });
  }
});
```

---

## Testing Strategy

### Unit Tests

```javascript
describe('Artwork Status Handling', () => {
  test('renders pending artwork with overlay', () => {
    const artwork = { id: 'artwork-40', status: 'pending', ... };
    const html = renderArtwork(artwork);
    expect(html).toContain('pending-overlay');
    expect(html).toContain('Coming Soon');
  });

  test('renders confirmed artwork normally', () => {
    const artwork = { id: 'artwork-39', status: 'confirmed', ... };
    const html = renderArtwork(artwork);
    expect(html).not.toContain('pending-overlay');
  });
});
```

### Integration Tests

```javascript
describe('Navigation Flow', () => {
  test('navigates from artist roster to artwork and back', async () => {
    await page.goto('http://localhost:9999/pages/artists.html');
    await page.click('.artist-card[data-id="artwork-39"]');

    expect(page.url()).toContain('#artwork-39');

    await page.click('.return-to-list-btn');
    expect(page.url()).toContain('/pages/artists.html');
  });
});
```

### Visual Regression Tests

- Snapshot pending artwork card
- Snapshot artist roster grid (46 items)
- Snapshot confirmed vs pending badge styles

---

## Rollout Plan

### Stage 1: Backend (Data + Dialogues)
- Deploy: `data.json` update (38→46 artworks)
- Deploy: 8 new dialogue files
- Verify: No broken references

### Stage 2: Frontend (UI Components)
- Deploy: Status badge component
- Deploy: Pending overlay component
- Verify: Visual appearance

### Stage 3: Navigation (Artist Roster)
- Deploy: `/pages/artists.html`
- Deploy: Return buttons
- Verify: Navigation flow

### Stage 4: Cache Invalidation
- Update version parameters (?v=4 → ?v=5)
- Force browser refresh
- Verify: No stale data

---

## Future Enhancements

### Phase 2 (Post-Launch)
- [ ] Artist search functionality
- [ ] Filter by artwork medium
- [ ] Sort by creation date
- [ ] Export artist roster as PDF

### Phase 3 (Advanced)
- [ ] Artwork comparison view (side-by-side)
- [ ] Personalized recommendations
- [ ] Visitor analytics dashboard
- [ ] Multilingual support (add traditional Chinese)

---

**Design Approved By**: @yuhaorui
**Implementation Start**: 2025-11-14
