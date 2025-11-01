# OpenSpec Change: Rebuild Interactive Exhibition Platform

**Change ID:** `rebuild-interactive-exhibition-platform`

**Created:** 2025-11-01

**Status:** 📋 PROPOSAL SUBMITTED - Awaiting Stakeholder Approval

---

## 📁 Contents

This change includes three key documents:

### 1. **proposal.md** 
The executive proposal outlining:
- Vision and purpose (transform vulcaart.art from academic website to art exhibition platform)
- Problem statement (why current website is misaligned with project goals)
- Proposed solution (interactive "artwork × critic persona" system)
- Detailed requirements (aesthetics, functionality, technical specs)
- Success criteria and metrics

**Key Sections:**
- Executive Summary (Section 1)
- Problem Statement (Section 2)
- Proposed Solution (Section 3)
- Detailed Requirements (Section 4)
- Scope & Phasing (Section 5)
- Dependencies & Constraints (Section 7)
- Success Criteria (Section 6)

### 2. **tasks.md**
The implementation roadmap with:
- 8-week timeline broken into 3 phases
- Detailed task breakdown for each phase
- Quality assurance checklist
- Dependencies and blockers
- Estimated timeline table

**Phase Breakdown:**
- **Phase 1 (3 weeks):** Core platform structure
  - Design system & aesthetics
  - Artwork data system (4 pieces)
  - Persona system (6 cultural critics)
  - Gallery and navigation UI
  
- **Phase 2 (3 weeks):** AI integration & interactivity
  - OpenAI API setup
  - Critique generation
  - Interactive selection & comparison
  - Social sharing
  
- **Phase 3 (2 weeks):** Optimization & deployment
  - Performance optimization
  - Testing & quality assurance
  - Deployment to GitHub Pages

### 3. **design.md**
The technical architecture and design philosophy with:
- System architecture overview
- Aesthetic & design philosophy (Sougwen Chung reference)
- Data schemas (JSON structures for artworks, personas, exhibition)
- Critique generation workflow
- UI component library
- State management approach
- Performance optimization strategies
- Accessibility & inclusion guidelines
- Deployment & DevOps strategy

**Key Topics:**
- Architecture diagram (Section 1)
- Sougwen Chung design principles (Section 2)
- Data structures & schemas (Section 3)
- Critique generation workflow (Section 4)
- UI components (Section 5)
- Performance optimizations (Section 7)
- Accessibility (WCAG 2.1 AA compliance) (Section 8)

---

## 🎯 Core Vision

Transform **vulcaart.art** from a generic MLLM research landing page into a **poetic, interactive art exhibition platform** that embodies the "潮汐的负形" (Tides of Negative Space) theme.

### Key Innovation: "作品 × 角色卡" System

Users can:
1. Browse 4 curated artworks
2. Select one artwork
3. Choose from 6 cultural critic personas (Su Shi, Guo Xi, Ruskin, Mama Zola, Professor Petrova, AI Ethics Reviewer)
4. Generate an AI-powered critique reflecting that persona's perspective
5. Compare how different personas interpret the same artwork
6. Share critiques on social media

### Aesthetic Direction

Inspired by **Sougwen Chung** (TIME 100 Most Influential in AI):
- Generous negative white space
- Minimalist color palette
- Organic, fluid animations
- Poetic clarity
- Process visibility (showing creative journey)
- Ephemeral quality

---

## 📊 Project Scope

**Duration:** 8 weeks from approval to live deployment

**Deliverables:**
- Interactive website at vulcaart.art
- 4 high-resolution artwork displays
- 6 complete cultural critic personas
- AI-powered critique generation system
- Physical exhibition space visualization
- Process documentation gallery
- Shareable critique images
- Mobile-responsive design

**Technical Stack:**
- Frontend: Vanilla HTML/CSS/JavaScript
- Hosting: GitHub Pages
- AI API: OpenAI GPT-3.5 Turbo (+ fallbacks)
- Data: JSON files
- Offline: Service Worker + IndexedDB

---

## ❓ Questions Requiring Approval

Before implementation begins, clarify:

1. **Artwork Selection** - Which 4 pieces will be featured?
2. **Image Sources** - Where do high-resolution artwork images come from?
3. **Process Docs** - What iterations/sketches will be shown?
4. **Design Direction** - Confirm Sougwen aesthetic approach?
5. **API Budget** - OpenAI API allocation for 30-day exhibition?
6. **Timeline** - Can we commit to 8-week schedule?
7. **Resources** - Team availability for implementation?

---

## ✅ Success Criteria

### Functional
- All 4 artworks display correctly (>2000px)
- Critique generation works for all 24 artwork-persona combinations
- AI response time <5 seconds
- Share functionality produces valid content
- Works offline with Service Worker

### Design
- Aesthetic aligns with Sougwen references
- Responsive on all major devices
- WCAG 2.1 AA accessibility compliant
- Smooth, organic animations
- <3 second page load on 4G

### User Experience
- Clear journey: browse → select → generate → share
- Avg session duration >2 minutes
- 60%+ of visitors generate a critique
- 30%+ of critiques shared socially

---

## 🚀 Next Steps

1. **Review** - Stakeholders review all three documents
2. **Clarify** - Answer the 7 questions above
3. **Approve** - Official approval to proceed
4. **Prepare** - Content prep (artwork images, persona metadata)
5. **Implement** - Phase 1 execution (design system, data structures)
6. **Deploy** - Phase 3 completion and live launch

---

## 📝 Document Sign-Off

**Prepared by:** Claude Code

**Date:** 2025-11-01

**Version:** 1.0 (Initial Proposal)

**Status:** ✅ APPROVED - READY FOR PHASE 1 IMPLEMENTATION

---

## ✅ Stakeholder Decisions Recorded

### Content & Assets
- **Artwork Selection:** To be provided in separate step
- **Image Sources:** Using existing digital assets (>2000px)
- **Process Documentation:** Full documentation available ("负形关注" theme emphasis)

### Design & Technical
- **Aesthetic Direction:** ✅ Confirmed Sougwen Chung aesthetic (whitespace, minimalism, organic animations)
- **API Budget:** Pay-as-you-go flexible model (monitor and optimize as needed)
- **Timeline:** Flexible - no fixed deadline, ship when ready
- **Resources:** Single developer + AI-assisted development (Claude Code)

---

## 📚 Related Documents

- **REVIEW_SUMMARY.md** - Comprehensive audit of website purpose
- **proposal.md** - Full proposal document (start here!)
- **tasks.md** - Detailed 8-week implementation plan
- **design.md** - Technical architecture & design philosophy

---

## 💡 Questions?

Refer to the detailed documents for more information:
- For **why** → Read `proposal.md` Section 2 (Problem Statement)
- For **what** → Read `proposal.md` Section 4 (Detailed Requirements)
- For **how** → Read `design.md` Sections 1-6
- For **when** → Read `tasks.md` (8-week timeline)
- For **architecture** → Read `design.md` Section 1

---

**This OpenSpec proposal is ready for stakeholder review and approval.** 🎨
