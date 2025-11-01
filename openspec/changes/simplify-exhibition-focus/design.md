# Design Documentation: simplify-exhibition-focus

**Change:** Simplify Exhibition Platform - Pure Art Focus

**Design Philosophy:** Embodying "负形" (Negative Space) through content deletion

---

## Conceptual Foundation

### The Problem with Current Design

The website contains **two competing narratives**:

1. **Narrative A: Art Exhibition**
   - "Choose an artwork → Select a critic persona → Read critique"
   - Focus: Multi-perspectival art appreciation
   - Time spent: 80%

2. **Narrative B: Project Proposal**
   - "Here's our exhibition budget (¥10,700), timeline (4 weeks), risks, and upgrade paths"
   - Focus: Implementation logistics
   - Time spent: 0% (users don't care)

**Result:** The website confuses two audiences:
- **Art viewers** see business planning content and lose artistic focus
- **Project stakeholders** have to dig through art content to find budget details

### The Solution: Singular Purpose

**One narrative, one focus, one user journey:**

```
Visual Invitation
    ↓
Immersive Artwork Experience (作品 × 评论家)
    ↓
Deeper Understanding (Persona Profiles)
    ↓
Reflection (Process, simplified)
    ↓
Context (About, condensed)
```

No detours. No project logistics. Pure art experience.

---

## Aesthetic Principle: "负形" Through Deletion

### What is 负形 (Negative Space)?

In art, negative space is the **empty space around and between objects**. It's not "nothing"—it's intentional emptiness that gives form meaning.

**Sougwen Chung's Application:**
- Canvas: White/minimal
- Brushstrokes: Deliberate, sparse
- Movement: Gesture leaves traces
- Result: Space itself becomes subject

### How Deletion Embodies 负形

By **removing planning content**, we're not just cutting text—we're applying the same principle:

```
Current Site (Cluttered):
[Hero] [Exhibition] [Personas] [Process] [About] [PLAN SECTION] [Upgrade] [Risk]
       ↑ User gets lost navigating through irrelevant content ↑

Redesigned Site (Negative Space):
[Hero] [Exhibition] [Personas] [Process] [About]
       ↑ Clear focus, breathing room, intentional design ↑
```

**The "Negative" is the absence of planning content**—what's *not* shown defines what *is* important.

---

## Content Architecture (After Simplification)

### Layer 1: Invitation (Hero)
**Purpose:** Welcome, establish aesthetic tone

**Content:**
- "潮汐的负形" title
- One-line description
- "进入展览" call-to-action

**Aesthetic:** Large whitespace, minimal text, clear visual hierarchy

**User Behavior:** Land → understand concept → proceed (15-30 sec)

---

### Layer 2: Immersion (Exhibition Experience)
**Purpose:** Core interaction - artwork selection + critique generation

**Components:**
- Artwork selector (4 pieces with thumbnails)
- Persona selector (6 critics with icons)
- Critique display area (multi-language, styled)
- Comparison view (optional)

**Aesthetic:**
- Central focus
- Generous spacing around art
- Subtle interaction feedback
- Multi-sensory engagement

**User Behavior:** Select work → Select critic → Read critique → Explore variations (15-30 min)

---

### Layer 3: Understanding (Personas)
**Purpose:** Learn about the 6 cultural critics

**Content:**
- 6 persona cards with:
  - Portrait/icon
  - Name (Chinese + English)
  - Era/tradition
  - Biography (100-150 words)
  - RPAIT dimension values
  - Aesthetic philosophy

**Aesthetic:**
- Grid layout (responsive)
- Balanced visual weight
- Typography hierarchy
- Accessible structure

**User Behavior:** Browse → Select → Read deep profile (10-20 min)

---

### Layer 4: Reflection (Condensed Process)
**Purpose:** Meta-artistic layer - explain "why this design"

**Content (Shortened to ~200 words):**
- Conceptual development (brief)
- Design iteration (brief)
- Research phase (brief)
- Technical implementation (brief)

**Why Keep This?**
- Embodies "负形" principle literally (showing process behind negative space)
- Provides depth for intellectually curious visitors
- Adds artistic credibility (transparency)

**Aesthetic:**
- Section break from main experience
- Lighter typography
- Shorter paragraphs
- Breathing room

**User Behavior:** Curious visitors explore (5-10 min, optional)

---

### Layer 5: Context (Simplified About)
**Purpose:** Project context and meaning

**Content (2 paragraphs, ~150 words total):**
1. What VULCA is + What vulcaart.art does
2. The aesthetic philosophy and meaning

**Not Included:**
- Budget explanations
- Timeline details
- Risk mitigation
- Upgrade options

**Aesthetic:**
- Footer-like placement
- Smaller font size
- Secondary color
- Closing statement with meaning

**User Behavior:** Final context (2-5 min, optional)

---

## Visual Changes (Minimal, Intentional)

### What Stays the Same
- Color palette (no changes)
- Typography system (no new sizes)
- Layout grid (no restructuring)
- Responsive breakpoints (no new ones)
- Component styles (buttons, cards, etc.)
- Animation effects (transitions, easing)

### What Changes (Content-Driven)

#### Spacing Adjustments
```css
/* Sections now have more breathing room due to deletion */
section {
  margin-bottom: 80px;  /* Was ~60px, increase for breathing space */
  padding: 40px 20px;
}
```

**Rationale:** With fewer sections, gaps become more prominent and intentional

#### Section Heights
```css
/* No changes to hero or component heights */
.hero {
  min-height: 400px; /* Mobile - unchanged */
}

@media (min-width: 768px) {
  .hero {
    min-height: 550px; /* Tablet - unchanged */
  }
}
```

**Rationale:** Hero already embodies negative space principle

#### Typography (Text-Only Changes)
- No new font sizes
- Font weights unchanged
- Line heights unchanged
- Reduced paragraph count (content, not style)

**Rationale:** Fewer words, but styled the same way

### What Gets Deleted (CSS-wise)

**Removed CSS Classes:**
```css
/* Delete if used only in planning sections */
.budget-table { }
.budget-category { }
.price { }
.timeline { }
.timeline-phase { }
.upgrade-path { }
.upgrade-phase { }
.risk-matrix { }
.risk-card { }
```

**Remaining CSS:**
All component, layout, and aesthetic styles remain unchanged.

---

## User Experience Impact

### Before Simplification

```
Visitor Journey:
Land on hero (5 sec)
  ↓
Scroll past "核心体验" section (5 sec)
  ↓
Explore artwork + critique (15 min) ← User focus here
  ↓
Explore personas (5 min)
  ↓
Read "创作过程" (3 min) - too much text
  ↓
Land on "展览方案" section (5 min) - CONFUSED
  "Wait, what's this budget section doing here?"
  ↓
Scroll through budget table (2 min) - DISTRACTED
  ↓
Read risk control matrix (2 min) - DISTRACTED
  ↓
Skip timeline and upgrades, leave
```

**Problem:** User gets distracted by planning content, loses artistic focus

### After Simplification

```
Visitor Journey:
Land on hero (5 sec) ← Clear signal: art experience
  ↓
Scroll past "核心体验" section (5 sec)
  ↓
Explore artwork + critique (15 min) ← Undistracted focus
  ↓
Explore personas (5 min) ← Natural continuation
  ↓
(Optional) Read condensed "创作过程" (2 min)
  ↓
(Optional) Read "关于" context (1 min)
  ↓
Leave with clear understanding of artwork experience
```

**Improvement:** Linear focus, no confusion, pure artistic intent

---

## Interaction Patterns (Unchanged)

All interactions remain the same:

### Artwork Selection
```
Click artwork card
  → Visual feedback (border, background)
  → AppState.setSelectedArtwork()
  → Critique area updates if persona selected
  → (unchanged)
```

### Persona Selection
```
Click persona card
  → Visual feedback (border, background)
  → AppState.setSelectedPersona()
  → Critique area generates/displays critique
  → (unchanged)
```

### Critique Display
```
Artwork + Persona selected
  → Display critique template
  → Show English + Chinese
  → Show RPAIT dimensions
  → (unchanged)
```

---

## Accessibility Considerations

### What Remains Accessible
- Semantic HTML structure (still valid)
- Keyboard navigation (all sections keyboard-accessible)
- Focus states (unchanged)
- Color contrast (unchanged)
- Screen reader navigation (improved with fewer sections)

### Accessibility Improvement
- **Fewer elements = simpler DOM tree**
- **Easier navigation = better screen reader experience**
- **Clear hierarchy = better semantic structure**

---

## Performance Impact

### Metric Changes

**Before Simplification:**
- HTML size: ~45 KB
- Section count: 8
- Scroll depth: Long (requires scrolling past budget/timeline)

**After Simplification:**
- HTML size: ~28 KB (-38%)
- Section count: 5
- Scroll depth: Medium (content-focused, less distraction)

**Performance Improvement:**
- Faster page load (smaller HTML)
- Faster DevTools inspection (fewer elements)
- Faster screen reader navigation
- Faster cognitive load (clearer hierarchy)

---

## Rollback / Versioning

### If Stakeholders Need Planning Content Back

**Option 1: Add a separate "Documentation" link**
- Keep vulcaart.art as pure exhibition
- Create /docs.html for planning documentation
- Users interested in behind-the-scenes can navigate separately

**Option 2: Add collapsible section**
- Keep vulcaart.art as pure exhibition
- Hidden accordion: "View Implementation Plan" (collapsed by default)
- Advanced users can expand, casual visitors see pure art

**Current Decision:** Delete permanently, treat as archived with OpenSpec

---

## Aesthetic Statement

> "We delete the planning to reveal the art. What is *not* shown—the budget, timeline, risks—defines what *is* important: the pure experience of artworks through multiple perspectives. Like Sougwen Chung's canvas, the absence speaks louder than the presence. The website itself becomes a statement about artistic focus and intentional design."

---

**Design Document Version:** 1.0
**Created:** 2025-11-01
**Design Review Status:** Ready for Approval
