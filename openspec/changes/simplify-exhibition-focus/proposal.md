# OpenSpec Proposal: Simplify Exhibition Platform - Pure Art Focus

**Change ID:** `simplify-exhibition-focus`

**Date:** 2025-11-01

**Status:** Proposal (Awaiting Approval)

---

## Why

The vulcaart.art website evolved to include exhibition planning documentation (budget, timeline, risk control, upgrade paths), which contradicts its core purpose: **to be an immersive art experience itself**.

### Current Problem

The website is a **hybrid document** serving two conflicting purposes:
1. A **planning document** (exhibition proposal, budgets, timelines)
2. An **art exhibition experience** (artworks, critique, exploration)

**Result:** Users encounter:
- "展览方案" section with budget tables (¥10,700 breakdown)
- "4周实施时间线" with project management details
- "升级路径" and "风险控制" sections
- Excessive explanatory text throughout

This **distracts from the core artistic experience** and treats the website as a project proposal rather than an art platform.

### Artistic Vision Problem

Sougwen Chung's aesthetic philosophy emphasizes:
- **Negative Space** (负形) - what's *hidden* is as important as what's *shown*
- **Minimalism** - only essential elements remain
- **Process Over Product** - show methodology, not bureaucracy

The current website **violates all three principles** by:
- Showing planning overhead (budget tables, risk matrices)
- Cluttering space with non-artistic content
- Revealing project logistics instead of creative process

---

## What Changes

### Core Change

**Transform vulcaart.art from a hybrid document into a pure art exhibition platform.**

Remove all project planning/execution documentation and refocus entirely on:
1. **Immersive Artwork Experience** (Hero → Works Selection → Critique Reading)
2. **Cultural Critic Exploration** (Persona Profiles)
3. **Creative Process Reflection** (Process Documentation - retained for meta-artistic value)
4. **Project Context** (Simplified "About" section only)

### Deleted Sections

**Complete removal:**
- ✗ "展览方案 · 实施规划" (entire section)
  - Budget breakdown table
  - Detailed cost analysis (¥3500, ¥2000, ¥3200, ¥1500 categories)
  - 4-week implementation timeline
  - Risk control matrix
  - Upgrade path (Phase 1, Phase 2, Terminal version)

### Simplified Sections

**Substantially condensed:**
- "创作过程 · 负形关注" - reduce conceptual explanations by 60%, keep only meta-artistic value
- "关于这个项目" - compress to 1-2 paragraphs essential context

### Retained Sections

**Unchanged (core experience):**
- Hero Section (邀请/Invitation)
- Exhibition Experience (作品选择 + 评论家选择 + 评论阅读)
- Cultural Critics (6 personas with RPAIT analysis)
- Process Documentation (shortened, retained for artistic value)
- About (simplified, essential context only)

### Visual/Content Impact

**Before:** ~8 major sections, heavy on planning text (40% of page content)
**After:** ~5 focused sections, 100% on artistic experience (0% planning overhead)

**Page Hierarchy:**
1. **Layer 1 (邀请)** - Invitation to the experience
2. **Layer 2 (沉浸)** - Immersive artwork + critique interaction (80% of time spent here)
3. **Layer 3 (认识)** - Understanding critics (personas)
4. **Layer 4 (反思)** - Meta reflection on process (condensed)
5. **Layer 5 (关于)** - Brief project context

---

## Design Principles (Technical Direction)

### Aesthetic Philosophy Implementation

1. **Negative Space** (Deletion as Design)
   - Remove non-essential content → visual breathing
   - Larger gaps between sections
   - Whitespace as intentional artistic choice

2. **Minimalist Content**
   - Hero height: 400px (mobile), 550px (tablet) - no change needed
   - Text reduction: -60% on Process, -80% on About
   - No new visual elements, only deletions

3. **Focus Architecture**
   - User attention: 80% → artwork + critique selection
   - 15% → persona exploration
   - 5% → supporting context

### Implementation Scope

**Content Layer (HTML/Text):**
- Delete ~2000+ characters of planning documentation
- Rewrite Process section (condensed)
- Rewrite About section (simplified)

**Visual Layer (CSS):**
- Minimal changes (if any)
- Potential: Increase section padding for breathing room
- Potential: Adjust spacing to reflect content reduction

**Interaction Layer (JavaScript):**
- No changes (event delegation, templates remain)
- No new components needed

---

## Success Criteria

1. **Completeness**: All planning documentation sections deleted
2. **Coherence**: Remaining sections form logical narrative flow
3. **Aesthetics**: Website embodies "负形" principle through content removal
4. **UX Focus**: User can engage with artwork + critique in <30 seconds of landing
5. **Meta Integrity**: Process section maintains artistic value while condensed

---

## Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Loss of project context | Low | Low | Retain simplified "About" section |
| Confused stakeholders (budget questions) | Medium | Low | Document decision in this proposal |
| Reduced discoverability (less SEO text) | Low | Low | Not applicable (art platform, not marketing) |
| Oversimplification | Medium | Medium | Keep Process section for meta-documentation |

---

## Related Decisions

**Archive:** Previous proposal (`rebuild-interactive-exhibition-platform`) captured that iteration's vision. This proposal represents the refined artistic vision emerging after stakeholder feedback.

**Sequential Change:** This builds on Phase 1 implementation (design system, layout, components) without requiring rework.

---

## Next Steps

1. **Approval:** Confirm stakeholder alignment with minimalist direction
2. **Proposal Validation:** `openspec validate simplify-exhibition-focus --strict`
3. **Task Generation:** Break into concrete content editing tasks
4. **Implementation:** Edit HTML/CSS/JS files per tasks.md
5. **Deployment:** Push to GitHub, verify at vulcaart.art

---

**Document Version:** 1.0
**Created:** 2025-11-01
**Status:** Ready for Stakeholder Review
