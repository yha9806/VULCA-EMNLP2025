# Design Document: Interactive Exhibition Platform Architecture

**Change ID:** `rebuild-interactive-exhibition-platform`

---

## 1. Architectural Overview

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interface Layer                    │
│  (HTML/CSS/JS - GitHub Pages - vulcaart.art)               │
├─────────────────────────────────────────────────────────────┤
│                   Application Logic Layer                    │
│  ├─ Artwork Gallery System                                 │
│  ├─ Persona Selection System                               │
│  ├─ Critique Generation Orchestrator                       │
│  ├─ Cache & Storage Manager                                │
│  └─ Social Sharing System                                  │
├─────────────────────────────────────────────────────────────┤
│                    Data Access Layer                         │
│  ├─ Local JSON Data (artworks, personas, exhibition)       │
│  ├─ Browser LocalStorage (critique cache, history)         │
│  └─ Browser IndexedDB (offline content)                    │
├─────────────────────────────────────────────────────────────┤
│                  External Services Layer                     │
│  └─ OpenAI API (GPT-3.5 Turbo for critique generation)    │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack Rationale

**Frontend Choices:**
- **HTML/CSS/JavaScript (Vanilla)** - No framework overhead; GitHub Pages can serve static files; minimal dependencies; full control over Sougwen aesthetic
- **Responsive CSS Grid/Flexbox** - Native browser support; elegant layout control; future-proof
- **Canvas/SVG for Graphics** - Exhibition layout visualization; persona RPAIT charts
- **Service Worker for Offline** - Progressive enhancement; offline-first design

**API Integration:**
- **OpenAI GPT-3.5 Turbo** - Cost-effective, reliable, excellent Chinese language understanding
- **Backup Models** - 通义千问, 文心一言 (Alibaba's free tier for resilience)
- **Client-side API calls** - No backend server needed; leverage GitHub Pages simplicity

**Data Storage:**
- **JSON files** - Artworks, personas, exhibition metadata (version-controlled)
- **LocalStorage** - Critique cache, session state (up to 5-10MB)
- **IndexedDB** - Offline content, large asset caching (up to 50MB+)

---

## 2. Aesthetic & Design Philosophy

### Sougwen Chung Design Reference

**Core Principles:**
1. **Minimalism with Purpose** - Every element serves a function; excessive decoration removed
2. **Negative Space as Content** - Large white/empty areas are intentional, not mistakes
3. **Organic Movement** - Animations mimic natural flow; no rigid, mechanical transitions
4. **Poetic Clarity** - Content is beautiful and understandable simultaneously
5. **Process Visibility** - Show the work, the thinking, the iterations
6. **Ephemeral Quality** - Sense of impermanence; elements appear/fade naturally
7. **Cross-cultural Synthesis** - East-meets-West aesthetic language

### Visual Design Guidelines

#### Color Palette
```css
--primary-white: #F8F7F4;      /* Warm white background */
--secondary-white: #FFFFFF;     /* Pure white accents */
--dark-blue: #1A2844;          /* Deep blue for text/structure */
--light-gray: #E8E6E1;         /* Subtle borders/dividers */
--accent-warm: #B8860B;        /* Warm gold for highlights (sparse) */

/* Semantic colors */
--success: #5A9E6F;            /* Muted green for positive actions */
--alert: #C85A54;              /* Muted red for alerts */
--info: #4A7BA7;               /* Muted blue for information */
```

**Rationale:** Warm whites and muted tones create calm, contemplative mood. Gold accent appears rarely, creating visual punctuation. Avoids harsh blacks or bright primaries.

#### Typography

```css
/* Headlines - poetic, spacious */
--font-display: "Crimson Text", Georgia, serif;
--font-size-h1: 3.5rem;  /* Hero/main titles - generous */
--font-size-h2: 2.5rem;
--font-size-h3: 1.75rem;
--line-height-display: 1.2;

/* Body - readable, elegant */
--font-body: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
--font-size-body: 1rem;
--line-height-body: 1.6;
--letter-spacing-body: 0.3px;

/* Monospace - for technical info */
--font-mono: "SF Mono", Monaco, monospace;
--font-size-mono: 0.875rem;
```

**Rationale:** Serif for headlines creates elegance and timelessness (reflects art history tradition). Sans-serif for body ensures readability. Generous line-height (1.6) creates breathing room. Slight letter-spacing enhances readability and creates "luxury" feel.

#### Spacing & Layout

```css
/* Modular spacing scale */
--space-xs: 0.5rem;   /* 8px */
--space-sm: 1rem;     /* 16px */
--space-md: 2rem;     /* 32px */
--space-lg: 3rem;     /* 48px */
--space-xl: 4rem;     /* 64px */
--space-2xl: 6rem;    /* 96px */

/* Key principle: Generous use of space-lg and space-xl */
/* Create breathing room, avoid cramped layouts */
```

#### Animation Philosophy

**Principles:**
- Animations serve navigation/understanding, not decoration
- Prefer subtle fade-ins over dramatic zoom/slide effects
- Use cubic-bezier easing for natural motion
- Duration: 300-600ms typically (slower = more intentional)
- Never animation that prevents interaction

**Examples:**
```css
/* Fade-in on load */
.artwork { opacity: 0; animation: fade-in 0.6s ease-out forwards; }
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

/* Smooth persona transition */
.persona-card {
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              opacity 0.4s ease-out;
}

/* Critique generation loading */
.generating { animation: pulse 1.5s ease-in-out infinite; }
@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
```

---

## 3. Data Schema & Structures

### Artworks Data (`artworks.json`)

```json
{
  "artworks": [
    {
      "id": "artwork-001",
      "title": "Title in English",
      "title_cn": "中文标题",
      "artist": "Artist Name",
      "year": 2024,
      "medium": "Digital, mixed media",
      "dimensions": {
        "width": 1200,
        "height": 1600,
        "unit": "px"
      },
      "description": "Brief poetic description of the work...",
      "description_cn": "作品的简洁诗意描述...",
      "themes": ["潮汐", "负形", "过程性"],
      "images": {
        "full": "assets/artworks/artwork-001-full.jpg",
        "thumbnail": "assets/artworks/artwork-001-thumb.jpg",
        "webp": "assets/artworks/artwork-001.webp"
      },
      "process": [
        {
          "phase": "Research",
          "description": "Initial concept exploration",
          "image": "assets/process/artwork-001-phase-1.jpg"
        }
      ],
      "metadata": {
        "color_palette": ["#F8F7F4", "#1A2844"],
        "complexity": 0.75,
        "cultural_references": ["Song Dynasty aesthetics", "contemporary digital"]
      }
    }
  ]
}
```

### Personas Data (`personas.json`)

```json
{
  "personas": [
    {
      "id": "su-shi",
      "name_en": "Su Shi",
      "name_cn": "苏轼",
      "name_pinyin": "Sū Shī",
      "era": "Northern Song Dynasty (1037-1101)",
      "origin": "China",
      "biography": "Literati painter, poet, and official of Northern Song Dynasty...",
      "analytical_approach": "Emphasizes spiritual expression over technical imitation...",
      "rpait_weights": {
        "representation": 6,
        "philosophy": 5,
        "aesthetics": 7,
        "interpretation": 3,
        "technique": 2
      },
      "sample_critique": "This work embodies the 意 (yì - concept/meaning) over mere 形 (xíng - form)...",
      "key_concepts": ["literati spirit", "spiritual resonance", "personal expression"],
      "portrait": "assets/personas/su-shi-portrait.jpg",
      "icon": "assets/personas/su-shi-icon.svg",
      "style_keywords": ["transcendent", "philosophical", "intimate"],
      "system_prompt_template": "You are {name}, a {era} art critic from {origin}..."
    }
  ]
}
```

### Exhibition Configuration (`exhibition-config.json`)

```json
{
  "exhibition": {
    "title": "潮汐的负形 (Tides of Negative Space)",
    "subtitle": "An Interactive Art Installation & Digital Exhibition",
    "description": "...",
    "physical_space": {
      "area_sqm": 10,
      "layout": "assets/exhibition/layout.svg",
      "artworks_per_wall": [2, 2],
      "lighting": "daylight balanced, 3000K warm",
      "dimensions": { "width": 4, "length": 2.5, "unit": "meters" }
    },
    "digital_experience": {
      "primary_artworks": 4,
      "total_personas": 6,
      "total_critique_combinations": 24
    },
    "exhibition_dates": "2025-01-XX to 2025-02-XX",
    "opening_hours": "10:00 - 18:00 daily",
    "venue": "TBD"
  }
}
```

---

## 4. Critique Generation System

### Workflow

```
User Input: Artwork A + Persona B
     ↓
Check Cache (LocalStorage)
     ├─ HIT: Return cached critique
     └─ MISS:
        ↓
   Build System Prompt
   ├─ Persona biography & approach
   ├─ Artwork context & images
   ├─ Evaluation dimensions (RPAIT)
   └─ Example style
        ↓
   Call OpenAI API (GPT-3.5 Turbo)
        ↓
   Generate Critique (300-500 chars)
        ↓
   Store in Cache + History
        ↓
   Display & Allow Share
```

### System Prompt Template

```
You are {persona_name}, a {era} art critic from {origin}.

Your analytical approach: {analytical_approach}

Key concepts you emphasize:
- {concept_1}
- {concept_2}
- {concept_3}

Your evaluation focuses on:
- Representation/Visual Elements: {rpait_weights.representation}/10
- Philosophy/Ideas: {rpait_weights.philosophy}/10
- Aesthetics/Beauty: {rpait_weights.aesthetics}/10
- Interpretation/Meaning: {rpait_weights.interpretation}/10
- Technique/Skill: {rpait_weights.technique}/10

Your critique style uses phrases like:
"{style_sample_1}"
"{style_sample_2}"

Now, critique this artwork:
Title: {artwork_title}
Description: {artwork_description}
[Image encoded as base64]

Provide a thoughtful critique (300-500 characters) that reflects {persona_name}'s unique perspective. Focus on what this artwork reveals about cultural understanding, artistic vision, and the interplay between tradition and innovation.
```

### Error Handling & Fallbacks

**Primary Flow:**
1. OpenAI API call → Success → Return critique

**Fallback 1 (API overload):**
2. Try Alibaba 通义千问 API → Success → Return critique

**Fallback 2 (All APIs down):**
3. Serve pre-cached sample critique from `critique_cache.json`

**Fallback 3 (Complete offline):**
4. Show "This critique could not be generated. Please try again later." + show related metadata

### Caching Strategy

```javascript
// LocalStorage cache key format
const cacheKey = `critique_${artworkId}_${personaId}`;

// Cache object structure
{
  artwork_id: "artwork-001",
  persona_id: "su-shi",
  critique: "This work embodies...",
  model: "gpt-3.5-turbo",
  timestamp: 1730432400000,
  ttl: 2592000000  // 30 days
}

// Cleanup: Remove critiques older than 30 days on every page load
```

---

## 5. User Interface Components

### Core Component Library

#### 1. Artwork Selector

```
State:
- selectedArtwork: artwork object
- viewMode: "gallery" | "detail" | "compare"

Props:
- artworks: array of artwork objects
- onArtworkSelect: callback function

Behavior:
- Display 4 artworks as grid/carousel
- Highlight selected artwork
- Show smooth transition on change
- Display brief description on hover
```

#### 2. Persona Selector

```
State:
- selectedPersona: persona object
- expandedPersona: persona id (for details)

Props:
- personas: array of persona objects
- onPersonaSelect: callback function
- showRPAIT: boolean

Behavior:
- Display 6 persona cards in grid
- Show RPAIT radar chart on hover/expand
- Highlight selected persona
- Link to detailed persona modal
```

#### 3. Critique Display Card

```
Props:
- artwork: artwork object
- persona: persona object
- critique: string
- isLoading: boolean

Components:
- Persona avatar + name
- Artwork thumbnail
- Critique text (animated fade-in)
- Timestamps & metadata
- Share button
- "Generate Another" button
```

#### 4. RPAIT Visualization

**Approach 1: Radar Chart**
```
- 5 axes (R, P, A, I, T)
- Persona polygon shape
- Scale 0-10 per dimension
- Color-coded per persona
```

**Approach 2: Horizontal Bars**
```
- 5 rows (one per dimension)
- Bar width represents weight
- Labels with icons
- More accessible than radar
```

**Recommendation:** Use bars for accessibility; radar chart as decorative secondary visualization.

#### 5. Exhibition Layout Visualization

```
SVG Component:
- 10m² floor plan (4m × 2.5m)
- Artwork wall positions (scaled)
- Persona card display area
- QR code zone
- Lighting zones
- Audience flow path (dashed line)
- Annotations for technical specs
```

---

## 6. State Management Approach

**Philosophy:** Keep state simple; avoid complex state libraries (no Redux/Context needed for static site)

```javascript
// Global application state (in-memory object)
const AppState = {
  // User selections
  selectedArtwork: null,
  selectedPersona: null,

  // Generated critiques (in-memory + LocalStorage)
  critiques: {},  // { "artwork-001_su-shi": {...} }

  // UI state
  isLoading: false,
  viewMode: "gallery",  // "gallery", "detail", "compare"

  // Error state
  lastError: null,
  errorCount: 0
};

// State updates via simple functions
function selectArtwork(artworkId) {
  AppState.selectedArtwork = findArtworkById(artworkId);
  updateUI();
  persistToLocalStorage();
}

function generateCritique() {
  AppState.isLoading = true;
  callOpenAIAPI(AppState.selectedArtwork, AppState.selectedPersona)
    .then(critique => {
      AppState.critiques[cacheKey] = critique;
      AppState.isLoading = false;
    })
    .catch(error => handleError(error));
  updateUI();
}
```

---

## 7. Performance Optimization Strategies

### Image Optimization
- **Format:** Original format + WebP alternative with fallback
- **Sizes:** Full (2000px) + Thumbnail (400px) + Hero (1200px)
- **Compression:** TinyPNG/Squoosh for lossless optimization
- **Lazy loading:** Intersection Observer API for below-fold images

### Bundle Size
- **Target:** <500KB total HTML+CSS+JS
- **Minification:** Terser for JS, CSSNano for CSS
- **Critical CSS:** Inline above-fold styles in `<head>`
- **Defer non-critical:** Load personas.json after DOMContentLoaded

### API Efficiency
- **Caching:** 30-day TTL per critique
- **Batching:** Not applicable (single API call per critique)
- **Fallbacks:** Three tiers (OpenAI → Alibaba → Cache → Offline message)

### Network Optimization
- **Preload:** Preload fonts and critical images
- **DNS Prefetch:** OpenAI API domain
- **HTTP/2 Server Push:** GitHub Pages handles automatically

---

## 8. Accessibility & Inclusion

### WCAG 2.1 AA Compliance

**Color Contrast:**
- Text vs. background: 4.5:1 minimum (AA)
- Interactive elements: 3:1 minimum (AA)
- Use tools: WebAIM Contrast Checker

**Keyboard Navigation:**
- Tab order logical
- Focus visible (outline or highlight)
- All interactive elements keyboard accessible
- No keyboard traps

**Screen Reader Support:**
- Semantic HTML (`<nav>`, `<main>`, `<article>`)
- ARIA labels for images: `alt="artwork description"`
- Form labels associated with inputs
- Skip navigation link

**Motion & Animation:**
- Respect `prefers-reduced-motion` media query
- No auto-playing animations
- Allow pausing/stopping

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. Deployment & DevOps

### Continuous Deployment
- **Repository:** `vulca-exhibition` on GitHub
- **Branch:** Deploy from `main` branch
- **Hosting:** GitHub Pages (automatic)
- **Domain:** vulcaart.art via CNAME record
- **SSL:** GitHub Pages provides free HTTPS

### Monitoring
- **Uptime:** Check.host or StatusPage.io
- **Errors:** Browser console error tracking (optional Sentry)
- **Analytics:** Google Analytics 4 (optional)
- **Performance:** PageSpeed Insights automated checks

### Versioning & Rollback
- **Git tags:** Tag each release (v1.0.0, v1.0.1)
- **Rollback:** Revert to previous commit if needed
- **Changelog:** CHANGELOG.md in repo root

---

## 10. Future Enhancement Paths

### Phase 3+ Possibilities
1. **Real-time Collaborative Critique** - Multiple users viewing same artwork
2. **Community Personas** - Users create custom personas
3. **Audio/Voice Critiques** - Text-to-speech or user recordings
4. **AR Exhibition** - Augmented reality overlay on physical space
5. **Mobile App** - Native iOS/Android app with offline support
6. **Multi-language Interface** - Full Chinese, English, Japanese support
7. **Blockchain Certificates** - Critic "certificates" for shares
8. **Live Performances** - Real-time critique generation during exhibitions

---

## 11. Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| OpenAI API rate limits | High | Medium | Fallback to Alibaba API, cache results |
| Images fail to load | Medium | Low | WebP + fallback format, local copies |
| Service Worker conflicts | Low | High | Test thoroughly, clear caching strategy |
| Mobile keyboard interference | Medium | Low | Test on actual devices, adjust z-index |
| API quota exceeded mid-month | Low | High | Monitor usage, pre-generate sample critiques |
| Network latency (slow 4G) | High | Medium | Service Worker caching, lazy loading |

---

## 12. Definition of Success

✅ **Technical Metrics:**
- Lighthouse Performance: >90
- Lighthouse Accessibility: >95
- Page Load Time: <3 seconds on 4G
- API Success Rate: >99%
- Uptime: >99.9%

✅ **User Experience Metrics:**
- Average Session Duration: >2 minutes
- Critique Generation Rate: >60% of visitors
- Share Rate: >30% of generated critiques
- Mobile Usability: No critical issues

✅ **Design Metrics:**
- Sougwen aesthetic alignment: Team approval
- Content clarity: User testing feedback
- Responsive design: Works on 5+ device types
- Accessibility: WCAG 2.1 AA compliant

---

## Conclusion

This design approach prioritizes:
1. **Simplicity** - Vanilla JS, static hosting, minimal dependencies
2. **Resilience** - Graceful fallbacks, offline capability, error handling
3. **Beauty** - Sougwen-inspired aesthetics, thoughtful typography, intentional negative space
4. **Accessibility** - WCAG compliance, keyboard support, semantic HTML
5. **Performance** - Optimized images, caching strategy, <3s load time

The result: A poetic, interactive art exhibition platform that honors both technical excellence and artistic vision.

