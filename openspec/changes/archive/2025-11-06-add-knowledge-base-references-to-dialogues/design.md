# Design: Add Knowledge Base References to Dialogues

**Change ID**: `add-knowledge-base-references-to-dialogues`
**Status**: Draft
**Created**: 2025-11-06

---

## Overview

This document explains the architectural decisions and design choices for integrating knowledge base references into the VULCA dialogue system.

---

## Design Decisions

### Decision 1: Manual Reference Addition (Not Automated)

**Context**: We could use LLM to auto-generate references or manually match them.

**Options Considered**:

| Option | Pros | Cons |
|--------|------|------|
| **A. Manual Matching** | - Higher accuracy<br>- Full control over quality<br>- Deep understanding of content | - Time-consuming (9-13 hours)<br>- Requires human analysis |
| **B. LLM Auto-generation** | - Fast (1-2 hours)<br>- Scalable to Phase 3.4 | - Hallucination risk<br>- Lower accuracy<br>- API costs<br>- Less control |
| **C. Hybrid (LLM + Manual Review)** | - Faster than pure manual<br>- Better than pure auto | - Still requires significant time<br>- Complex workflow |

**Decision**: ✅ **Option A - Manual Matching**

**Rationale**:
- Phase 1A knowledge bases contain **curated, high-quality references** (~2000 lines, 300+ citations)
- 85 messages is manageable for manual work (not 900 messages yet)
- User explicitly approved this approach (Q1: "是，立即开始")
- Establishes quality baseline for Phase 3.4 automation
- Reduces risk of incorrect attributions (critical for academic credibility)

---

### Decision 2: Dual UI Pattern (Expandable + Tooltip)

**Context**: User requested both click-to-expand list AND tooltip hover (Q2).

**Options Considered**:

| Option | Pros | Cons |
|--------|------|------|
| **A. Expandable List Only** | - Simple implementation<br>- One interaction pattern | - No quick preview<br>- Must click every time |
| **B. Tooltip Only** | - Fast preview<br>- No UI clutter | - Limited space<br>- Not mobile-friendly |
| **C. Dual (A + B)** ⭐ | - Best of both worlds<br>- Different use cases | - More complex implementation<br>- Potential redundancy |
| **D. Sidebar Panel** | - Always visible<br>- More space | - Takes screen space<br>- Not mobile-friendly |

**Decision**: ✅ **Option C - Dual Pattern (Expandable + Tooltip)**

**Rationale**:
- User explicitly requested this (Q2: "方案 A: 点击展开列表+方案B：Tooltip悬停显示")
- Serves different interaction patterns:
  - **Tooltip**: Quick quote preview (hover-and-read)
  - **Expandable**: Full reference details (deep dive)
- Mobile-friendly: Tooltip becomes tap-to-show modal
- Aligns with test-quote-interaction.html design (already proven UX)

**Implementation Strategy**:
```javascript
// Badge with reference count
<span class="reference-badge" data-count="3">
  📚 3 references
</span>

// Click-to-expand list
<div class="reference-list" hidden>
  <div class="reference-item">
    <strong>Source:</strong> poetry-and-theory.md
    <blockquote>"笔墨当随时代"</blockquote>
  </div>
</div>

// Tooltip for quotes (hover)
<span class="quoted-text" data-tooltip="...">
  笔墨当随时代
</span>
```

---

### Decision 3: Test-First Integration (Phased Rollout)

**Context**: Should we integrate directly to main site or test first?

**Options Considered**:

| Option | Pros | Cons |
|--------|------|------|
| **A. Direct Integration** | - Faster to production<br>- One deployment | - High risk if UI rejected<br>- No user review |
| **B. Test Page First** ⭐ | - User approval before deploy<br>- Safe iteration | - Extra step<br>- Longer timeline |
| **C. Feature Flag** | - A/B testing possible<br>- Easy rollback | - Complex implementation<br>- Overkill for static site |

**Decision**: ✅ **Option B - Test Page First** (pages/dialogues.html)

**Rationale**:
- User explicitly requested this (Q3: "方案C" - test first, then decide)
- Minimizes risk of main site disruption
- Allows user to preview before committing
- Aligns with project philosophy: "沉浸式/细节分离" (immersive/detail separation)
- Static site makes feature flags impractical

**Rollout Plan**:
1. **Phase 3.2**: Create `pages/dialogues.html` with reference UI
2. **User Review**: User tests and provides feedback
3. **Phase 3.3** (conditional): If approved, integrate to main site navigation
4. **Fallback**: If rejected, iterate on test page without affecting main site

---

### Decision 4: 2-3 References Per Message (Optimal Density)

**Context**: How many references should each message have?

**Options Considered**:

| Option | Total References | Pros | Cons |
|--------|------------------|------|------|
| **A. 1 reference/message** | 85 refs | - Fast to add<br>- Minimal clutter | - Insufficient depth<br>- Weak scholarly grounding |
| **B. 2-3 refs/message** ⭐ | 170-255 refs | - Balanced depth<br>- Multiple perspectives<br>- Manageable UI | - Moderate time investment |
| **C. 4-5 refs/message** | 340-425 refs | - Maximum depth<br>- Comprehensive coverage | - UI clutter<br>- Diminishing returns<br>- Excessive time |
| **D. Variable (1-5)** | ~200 refs | - Flexible per message | - Inconsistent experience<br>- Complex guidelines |

**Decision**: ✅ **Option B - 2-3 References Per Message**

**Rationale**:
- User explicitly approved this (Q4: "2-3 个引用/消息（我推荐）")
- Balances academic credibility with readability
- Allows for:
  - Primary source (core argument)
  - Supporting source (context or extension)
  - Optional third source (counterpoint or historical background)
- Total ~170-255 references is manageable (not overwhelming)
- UI can display 2-3 items without scroll in expandable list

**Example Message Allocation**:
```javascript
// Message: Su Shi commenting on AI art's temporal nature
references: [
  {
    // Primary: Core concept from Su Shi's philosophy
    critic: "su-shi",
    source: "key-concepts.md",
    quote: "笔墨当随时代 (Brush and ink must follow the times)",
    page: "Core Concept #1"
  },
  {
    // Supporting: Specific theory elaboration
    critic: "su-shi",
    source: "poetry-and-theory.md",
    quote: "论画以形似，见与儿童邻...",
    page: "Section: 论画以形似"
  },
  {
    // Optional: Historical context
    critic: "su-shi",
    source: "references.md",
    quote: "《东坡诗集》卷三",
    page: "Primary Sources"
  }
]
```

---

### Decision 5: Phase 3.4 Deferral (Content Generation)

**Context**: Should we generate new content now or later?

**Options Considered**:

| Option | Timeline | Pros | Cons |
|--------|----------|------|------|
| **A. Now (Phase 3 includes generation)** | 3-5 days | - Complete solution<br>- Scale to 600-900 messages | - User data not ready<br>- High time investment (87-113 hours) |
| **B. Later (Phase 3.4 separate)** ⭐ | Phase 3: 2-3 days<br>Phase 3.4: TBD | - User can collect artworks first<br>- Phased delivery<br>- Learn from Phase 3.1-3.3 | - Delayed full scale |
| **C. Never (keep 85 messages)** | 2-3 days | - Fastest<br>- Simplest | - Misses project vision<br>- Limited content variety |

**Decision**: ✅ **Option B - Defer to Phase 3.4**

**Rationale**:
- User explicitly stated: "然后等我完成作品收集，再做方向B"
  (Translation: "Then wait for me to complete artwork collection before doing direction B")
- Prerequisites not met:
  - ❌ User hasn't provided 20-30 artwork images
  - ❌ User hasn't provided artwork metadata
  - ❌ Content generation strategy not finalized
- Benefits of deferral:
  - ✅ Phase 3.1-3.3 validates reference workflow
  - ✅ Phase 3.2 UI becomes template for Phase 3.4 UI
  - ✅ User has time to curate high-quality artwork collection
  - ✅ Can learn from Phase 3.1 manual process to improve Phase 3.4 automation

**Phase 3.4 Trigger Conditions**:
1. User provides artwork images (20-30 pieces)
2. User provides artwork metadata (artist, year, title, context)
3. User reviews and approves Phase 3.3 (main site integration)
4. User decides to scale up content

---

### Decision 6: Main Site Integration Strategy (Homepage Replacement)

**Context**: How should Phase 3.2 dialogue system integrate into the main site?

**Options Considered**:

| Option | Pros | Cons |
|--------|------|------|
| **A. Replace Homepage Critiques** ⭐ | - Unified experience<br>- Dialogue auto-plays with artwork<br>- No additional navigation | - Higher implementation risk<br>- Replaces existing content |
| **B. Add as Subpage** | - Safe (no main page changes)<br>- Keeps old content<br>- Easy rollback | - Requires navigation<br>- Split user experience<br>- Lower engagement |
| **C. Tabbed Interface** | - Both modes accessible<br>- User choice | - UI complexity<br>- Development overhead |
| **D. Modal Overlay** | - Non-intrusive<br>- Quick access | - Not immersive<br>- Limited space |

**Decision**: ✅ **Option A - Replace Homepage `critiques-panel`**

**Rationale**:
- User explicitly requested: "我需要这个对话系统替换主页面，主网站的文字评论板块的老旧内容。而不是成为一个子页面" (Translation: "I need this dialogue system to **replace** the homepage text critique section's old content, not become a subpage")
- Aligns with project vision: Immersive dialogue experience integrated with artwork viewing
- Auto-play dialogue when switching artworks creates seamless narrative flow
- Preserves all Phase 3.2 features (badges, references, tooltips, thought chains)
- Removes redundant static critique cards (now superseded by dynamic dialogue)

**Implementation Strategy**:

**Target Location**: `index.html` line 118-120
```html
<!-- BEFORE (Old static critique cards) -->
<div class="critiques-panel" id="critiques-panel">
  <!-- Critic reviews will be rendered here by gallery-hero.js -->
</div>

<!-- AFTER (DialoguePlayer integration) -->
<div class="critiques-panel" id="critiques-panel">
  <!-- DialoguePlayer will be mounted here -->
</div>
```

**Key Changes**:

1. **Modify `js/gallery-hero.js`**:
   - Replace `renderCritiques()` function → `renderDialogue(artworkId)`
   - Integrate DialoguePlayer instantiation
   - Handle artwork switching: destroy old player, create new player
   - Wire auto-play functionality

2. **Add Script Dependencies to `index.html`**:
   ```html
   <!-- Dialogue System CSS -->
   <link rel="stylesheet" href="/styles/components/dialogue-player.css">
   <link rel="stylesheet" href="/styles/components/reference-badge.css">
   <link rel="stylesheet" href="/styles/components/reference-list.css">

   <!-- Dialogue System JS (after data.js) -->
   <script type="module" src="/js/data/dialogues/index.js"></script>
   <script src="/js/components/dialogue-player.js"></script>
   ```

3. **Export Global Variables** (`js/data/dialogues/index.js`):
   ```javascript
   // Gallery-hero.js is not ES6 module, needs global access
   window.DIALOGUES = [...];
   window.getDialogueForArtwork = function(artworkId) { ... };
   ```

4. **Memory Management**:
   ```javascript
   // Store current player instance for cleanup
   window.currentDialoguePlayer = player;

   // On artwork switch: destroy old, create new
   if (window.currentDialoguePlayer) {
     window.currentDialoguePlayer.destroy();
   }
   ```

**Features Preserved from Phase 3.2**:
- ✅ Reference badges (📚 X个引用)
- ✅ Click-to-expand reference lists
- ✅ Thought chain visualization ("思考中...")
- ✅ Reply references ("↩ 回复 [评论家]")
- ✅ Auto-play natural dialogue flow (4-7s intervals)
- ✅ Responsive design (desktop + mobile)

**Removed**:
- ❌ Static critique cards (`critique-panel` elements)
- ❌ `renderCritiques()` function
- ❌ `createCriticPanel()` helper

**Testing Requirements**:
- [ ] Dialogue loads on page load (first artwork)
- [ ] Dialogue updates when clicking next/prev artwork
- [ ] Auto-play starts automatically
- [ ] References display correctly
- [ ] No memory leaks (multiple artwork switches)
- [ ] Responsive design intact (mobile/desktop)
- [ ] No console errors
- [ ] Performance acceptable (<2s initial load)

---

## Data Flow Architecture

### Phase 3.1: Reference Addition Flow

```
1. Human Analysis
   ↓
   Read dialogue message (textZh, textEn)
   ↓
   Identify core argument/concept
   ↓
   Match to knowledge base

2. Knowledge Base Lookup
   ↓
   Read knowledge-base/critics/[persona-id]/
   ↓
   Find relevant sections (README.md, key-concepts.md, [topic].md)
   ↓
   Extract quote + source metadata

3. Reference Creation
   ↓
   Create reference object:
   {
     critic: personaId,
     source: "filename.md",
     quote: "extracted text",
     page: "Section: Title"
   }
   ↓
   Add to message.references array (2-3 items)

4. Validation
   ↓
   Run scripts/validate-dialogue-data.js
   ↓
   Check:
   - Critic ID valid (in VULCA_DATA.personas)
   - Source file exists (knowledge-base/critics/...)
   - Quote non-empty
   - Persona-reference consistency
   ↓
   Fix errors → Re-validate
```

### Phase 3.2: UI Rendering Flow

```
1. Page Load
   ↓
   Load js/data/dialogues/artwork-X.js
   ↓
   DialoguePlayer instance created

2. Message Rendering
   ↓
   For each message with references array:
   ↓
   Render message bubble + text
   ↓
   Render reference badge (📚 X references)
   ↓
   Render expandable list (hidden by default)

3. User Interaction
   ↓
   [Badge Click] → Toggle expandable list
   ↓
   Show/hide reference items
   ↓
   [Quote Hover] → Show tooltip with source info
   ↓
   Tooltip positioned near cursor

4. Responsive Behavior
   ↓
   Desktop: Tooltip on hover
   ↓
   Mobile: Tooltip on tap (modal overlay)
```

---

## Component Design

### Reference Badge Component

```html
<!-- Badge (always visible) -->
<div class="message-references">
  <button class="reference-badge" aria-expanded="false">
    <span class="badge-icon">📚</span>
    <span class="badge-count">3</span>
    <span class="badge-label" data-lang="zh">条引用</span>
    <span class="badge-label" data-lang="en">references</span>
  </button>
</div>
```

**CSS** (styles/components/reference-badge.css):
```css
.reference-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #B85C3C, #D4A574);
  color: white;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  transition: transform 0.2s;
}

.reference-badge:hover {
  transform: scale(1.05);
}
```

### Expandable List Component

```html
<!-- Expandable list (hidden by default) -->
<div class="reference-list" hidden>
  <div class="reference-item">
    <div class="reference-header">
      <strong class="reference-critic">苏轼 (Su Shi)</strong>
      <span class="reference-source">poetry-and-theory.md</span>
    </div>
    <blockquote class="reference-quote" lang="zh">
      笔墨当随时代
    </blockquote>
    <p class="reference-page">Section: 论画以形似</p>
  </div>
  <!-- Repeat for 2-3 references -->
</div>
```

**CSS** (styles/components/reference-list.css):
```css
.reference-list {
  margin-top: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border-left: 3px solid var(--persona-color);
  border-radius: 0.5rem;
}

.reference-item + .reference-item {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}
```

### Tooltip Component

```html
<!-- Tooltip (shown on hover) -->
<span class="quoted-text" data-tooltip="来源: poetry-and-theory.md">
  笔墨当随时代
</span>

<!-- Tooltip overlay (positioned dynamically) -->
<div class="reference-tooltip" role="tooltip">
  <div class="tooltip-content">
    <strong>来源 / Source:</strong> poetry-and-theory.md
  </div>
</div>
```

**JavaScript** (js/components/reference-tooltip.js):
```javascript
class ReferenceTooltip {
  constructor() {
    this.tooltip = this.createTooltip();
    this.attachListeners();
  }

  show(target, content) {
    this.tooltip.textContent = content;
    const rect = target.getBoundingClientRect();
    this.tooltip.style.top = `${rect.bottom + 8}px`;
    this.tooltip.style.left = `${rect.left}px`;
    this.tooltip.hidden = false;
  }

  hide() {
    this.tooltip.hidden = true;
  }
}
```

---

## Validation Strategy

### Reference Validation Rules

Implemented in `scripts/validate-dialogue-data.js` (extended):

1. **Critic ID Valid**
   ```javascript
   const validCriticIds = VULCA_DATA.personas.map(p => p.id);
   if (!validCriticIds.includes(ref.critic)) {
     errors.push(`Invalid critic ID: ${ref.critic}`);
   }
   ```

2. **Source File Exists**
   ```javascript
   const sourcePath = `knowledge-base/critics/${ref.critic}/${ref.source}`;
   if (!fs.existsSync(sourcePath)) {
     errors.push(`Source file not found: ${sourcePath}`);
   }
   ```

3. **Quote Non-Empty**
   ```javascript
   if (!ref.quote || ref.quote.trim().length === 0) {
     errors.push(`Empty quote in reference`);
   }
   ```

4. **Persona-Reference Consistency**
   ```javascript
   if (message.personaId !== ref.critic) {
     warnings.push(`Message from ${message.personaId} references ${ref.critic}`);
   }
   ```

---

## Risk Mitigation

### Risk 1: Manual Work Time Overrun

**Mitigation**:
- Break into daily milestones (Day 1: 30 messages, Day 2: 30 messages, Day 3: 25 + validation)
- Parallelize with other work (can pause/resume)
- Reusable patterns emerge after first 10-15 messages

### Risk 2: UI Rejection by User

**Mitigation**:
- Phase 3.2 is test-first (user reviews before main site)
- Can iterate on test page without affecting production
- Dual UI approach provides flexibility (can disable one if redundant)

### Risk 3: Reference Quality Issues

**Mitigation**:
- Validation script catches structural errors
- Manual review ensures semantic correctness
- Can refine in future iterations (references are additive, not breaking)

---

## Future Enhancements (Phase 3.4+)

1. **Automated Reference Suggestion**
   - Use embeddings to match message → knowledge base
   - Human review before committing

2. **Reference Search**
   - Filter dialogues by referenced source
   - Find all messages citing a specific text

3. **Interactive Knowledge Graph**
   - Visualize connections between messages and sources
   - Click reference → see all related messages

4. **Multilingual References**
   - Add English translations for Chinese quotes
   - Support bilingual source files

---

**Status**: Design complete, ready for implementation
**Next**: Create tasks.md and specs/
