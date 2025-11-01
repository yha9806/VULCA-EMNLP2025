# DOM Refactor Plan - Art-Centric Immersive Redesign

**Date**: 2025-11-01
**Phase**: 1.1
**Status**: In Progress

---

## Current HTML Structure Analysis

### Sections (286 lines)

```
1. Header + Navigation (lines 53-89)
   - Desktop nav with 4 links (Exhibition, Critics, Process, About)
   - Mobile hamburger menu
   - Brand logo "vulcaart"

2. Hero Section (lines 93-101)
   - Title: "潮汐的负形"
   - Description paragraph
   - CTA button: "进入展览"

3. Exhibition Section (lines 103-146)
   - "核心体验" heading
   - Feature cards: "4件精选作品", "6位评论家"
   - Interactive panel with:
     * Artworks selector (div#artworks-selector)
     * Personas selector (div#personas-selector)
     * Buttons: "获取评论", "对比视图"
     * Critique output (div#critique-output)

4. Personas Section (lines 148-158)
   - "6位文化评论家" heading
   - Descriptions
   - Personas container (div#personas-container)

5. Process Section (lines 160-186)
   - "创作过程" heading
   - 4 process cards

6. About Section (lines 188-219)
   - Project description
   - Philosophy points

7. Footer (lines 222-260)
   - Links
   - Contact info
   - Copyright

8. Scripts (lines 262-271)
   - 11 JS files loaded (data.js, plan.js, dataIndexes.js, etc.)
   - Inline mobile menu toggle
```

---

## New Gallery Structure (Target)

### Minimal Layout

```
1. Header (SIMPLIFIED)
   - Hamburger menu icon (top-left, hidden by default)
   - Language toggle (top-right)
   - NO brand logo, NO navigation links

2. Hero (MINIMAL)
   - H1 title only: "潮汐的负形"
   - Optional: Subtitle or first artwork as background
   - Scroll indicator

3. Gallery (MAIN)
   <section class="gallery">
     <article class="artwork-section" data-artwork-id="artwork-1">
       <header class="artwork-header">
         <figure class="artwork-image">
           <img src="..." alt="...">
         </figure>
         <div class="artwork-metadata">
           <h2 class="artwork-title">
             <span lang="zh">Chinese Title</span>
             <span lang="en">English Title</span>
           </h2>
           <time>2022</time>
         </div>
       </header>

       <section class="critiques-container">
         <article class="critique-panel" data-persona-id="persona-id">
           <header class="critique-header">
             <h3 class="persona-name">Persona Name</h3>
             <span class="persona-era">Era/Region</span>
           </header>
           <div class="critique-content">
             <p lang="zh">Chinese critique text...</p>
             <p lang="en">English critique text...</p>
           </div>
           <div class="critique-scores">
             <span class="rpait-score">R: 7</span>
             <!-- ... -->
           </div>
         </article>
         <!-- ... more critiques (1-6) ... -->
       </section>

       <section class="visualization-container">
         <div id="rpait-viz-artwork-1">
           <!-- RPAIT chart will render here -->
         </div>
       </section>
     </article>

     <!-- ... artwork-2, artwork-3, artwork-4 ... -->
   </section>

4. Floating Menu
   <nav class="floating-menu" hidden>
     <button class="menu-home">🏠</button>
     <button class="menu-language">🔤</button>
     <button class="menu-settings">⚙️</button>
   </nav>

5. Footer (MINIMAL)
   - Contact info only
   - NO logo, NO extensive links
```

---

## Sections to Keep, Remove, Modify

| Section | Status | Action |
|---------|--------|--------|
| Header | MODIFY | Remove nav links, brand logo → minimal hamburger + language toggle |
| Hero | MODIFY | Remove description + CTA → just title + scroll indicator |
| Exhibition | REMOVE | Replace entirely with immersive gallery |
| Personas | REMOVE | Convert to modular critique panels in gallery |
| Process | ARCHIVE | Move to about/footer section or hide for future |
| About | KEEP | Keep but move to floating menu or end of page |
| Footer | KEEP | Keep but simplify |

---

## Data Flow Changes

### Current Flow (Old)
```
User → Clicks artwork card → Selects persona → Clicks "获取评论"
→ JavaScript fetches critique → Displays in output panel
```

### New Flow (Immersive)
```
User scrolls → Artwork enters viewport → Critiques fade in (staggered)
→ RPAIT visualization animates → User sees all perspectives naturally
→ Optional: Click to expand, compare, share
```

---

## Key Decisions

### 1. What to Keep from Current HTML

✅ Keep:
- `<meta>` tags (SEO, Open Graph, etc.)
- `<link rel="stylesheet" href="/styles/main.css">`
- External libraries: Chart.js, Sparticles
- Font preconnect + Google Fonts
- Script imports for data, events, etc.
- Semantic HTML5 structure

### 2. What to Discard

❌ Remove:
- Exhibition section (feature cards, interactive panel, selectors)
- Personas section (description text)
- Process section (4 process cards) — can be moved to footer/about
- Extensive descriptive text (let artwork speak for itself)

### 3. New Elements to Add

✨ Add:
- `class="gallery"` main container
- `class="artwork-section"` repeated per artwork
- `class="critique-panel"` repeated per critique
- `class="visualization-container"` for RPAIT charts
- `class="floating-menu"` for hamburger + settings
- `data-artwork-id` and `data-persona-id` attributes for JS targeting
- `lang="zh"` and `lang="en"` attributes for bilingual content

---

## HTML Template Structure

### Artwork Section Template

```html
<article class="artwork-section" data-artwork-id="artwork-1">
  <header class="artwork-header">
    <figure class="artwork-image">
      <img
        src="/assets/artwork-1-large.jpg"
        srcset="
          /assets/artwork-1-small.jpg 600w,
          /assets/artwork-1-medium.jpg 1000w,
          /assets/artwork-1-large.jpg 1600w
        "
        alt="记忆（绘画操作单元：第二代）Memory (Painting Operation Unit: Second Generation)"
        loading="lazy"
      />
    </figure>
    <div class="artwork-metadata">
      <h2 class="artwork-title">
        <span lang="zh">记忆（绘画操作单元：第二代）</span>
        <span lang="en">Memory (Painting Operation Unit: Second Generation)</span>
      </h2>
      <time class="artwork-year" datetime="2022">2022</time>
    </div>
  </header>

  <section class="critiques-container" aria-label="Critique perspectives">
    <!-- Critique panels will be inserted here by JavaScript -->
    <!-- For each of 1-6 personas -->
  </section>

  <section class="visualization-container" aria-label="RPAIT visualization">
    <!-- Chart.js canvas or SVG will be rendered here -->
  </section>
</article>
```

### Critique Panel Template

```html
<article class="critique-panel" data-persona-id="su-shi">
  <header class="critique-header">
    <h3 class="persona-name">苏轼</h3>
    <span class="persona-era">北宋文人 (1037-1101)</span>
    <span class="persona-color-indicator" style="background: #B85C3C;"></span>
  </header>

  <div class="critique-body">
    <p lang="zh" class="critique-text">
      <!-- Chinese critique text -->
    </p>
    <p lang="en" class="critique-text" style="display:none;">
      <!-- English critique text (hidden by default) -->
    </p>
  </div>

  <footer class="critique-footer">
    <div class="rpait-scores">
      <span class="rpait-label">RPAIT:</span>
      <span class="score-r">R: 7</span>
      <span class="score-p">P: 9</span>
      <span class="score-a">A: 8</span>
      <span class="score-i">I: 8</span>
      <span class="score-t">T: 6</span>
    </div>
  </footer>
</article>
```

---

## Migration Checklist

- [ ] Create new index.html with minimal header
- [ ] Create gallery wrapper section
- [ ] Remove exhibition interactive panel
- [ ] Remove personas selector
- [ ] Create artwork section templates (4x)
- [ ] Create critique panel templates (24x = 4 artworks × 6 personas)
- [ ] Move artwork images to /assets/ (verify paths)
- [ ] Populate critique text from js/data.js
- [ ] Add RPAIT score data to critique panels
- [ ] Create minimal hero section
- [ ] Create floating hamburger menu
- [ ] Simplify footer
- [ ] Keep all script includes
- [ ] Test structure with browser DevTools

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| index.html | REFACTOR | New gallery-based structure |
| styles/main.css | ENHANCE | Add gallery, critique panel, visualization styles |
| js/gallery.js | CREATE | Scroll-based reveal system |
| js/critique.js | CREATE | Critique reveal patterns + animations |
| js/language.js | CREATE | Bilingual content toggle |
| js/visualization.js | CREATE | RPAIT visualization forms |

---

## Success Criteria for 1.1

✅ DOM structure audit complete
✅ New gallery structure planned and documented
✅ Artwork section templates created (ready for implementation)
✅ Critique panel templates created (ready for implementation)
✅ Migration checklist prepared
✅ No functionality lost (all data preserved, just reorganized)
✅ Semantic HTML5 maintained

---

**Next Step**: Begin Task 1.2 - Create Minimal Hero Section

**Status**: ✅ Planning Complete | ⏳ Ready for Implementation
