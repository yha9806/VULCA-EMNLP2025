# OpenSpec Proposal: Rebuild vulcaart.art as Interactive Exhibition Platform

**Change ID:** `rebuild-interactive-exhibition-platform`

**Date:** 2025-11-01

**Status:** Proposal (Awaiting Approval)

---

## 1. Executive Summary

The current vulcaart.art website is a generic landing page that does not align with the actual VULCA art installation project ("潮汐的负形" / "Tides of Negative Space"). This proposal rebuilds the website into **an interactive digital exhibition platform** that embodies Sougwen Chung's aesthetic philosophy and fully implements the "作品 × 角色卡" (artwork × critic persona) methodology outlined in "方案A.pdf".

**Core Change:** Transform from static informational website → **dynamic interactive art exhibition platform**

---

## 2. Problem Statement

### Current State
- vulcaart.art presents VULCA as an academic research framework
- No interactive functionality; purely descriptive content
- Lacks artistic vision and visual poetry (Sougwen reference aesthetic)
- Does not demonstrate the core methodology: selecting artwork + choosing cultural critic persona + generating AI critique
- Missing the "潮汐的负形" (tides of negative space) conceptual framework
- No space layout visualization or audience journey mapping

### Issues with Current Website
1. **Misaligned Purpose** - Appears as tech/academic project rather than art exhibition
2. **Missing Core Interaction** - No working demo of "作品 × 角色卡" system
3. **Aesthetic Mismatch** - Corporate design vs. artistic/poetic vision
4. **Incomplete Content** - No artwork showcase, no physical space layout, no process documentation
5. **Non-functional Demo** - Viewer cannot actually generate critiques using AI

### User Impact
- Visitors cannot understand the artistic methodology through interaction
- No hands-on experience of multi-perspectival art critique
- Fails to communicate the role of AI in art critique and cultural understanding
- Does not encourage sharing or social engagement

---

## 3. Proposed Solution

### Vision
Rebuild vulcaart.art as an **immersive digital exhibition platform** that:

1. **Embodies Aesthetic Philosophy** - Inspired by Sougwen Chung: poetic, minimalist, with intentional negative space
2. **Enables Core Interaction** - Fully functional "选择作品 → 选择角色 → 生成评论 → 分享" workflow
3. **Showcases 6 Cultural Critics** - Detailed personas with evaluation dimensions (RPAIT weights)
4. **Displays 4 Artwork Series** - High-quality art display with metadata and interpretation layers
5. **Visualizes Physical Space** - 10m² exhibition layout with audience flow documentation
6. **Documents Creative Process** - "负形关注" - show drafts, iterations, process documentation

### Technical Architecture

#### Frontend (Visual & Interaction Layer)
- **Framework:** Static HTML/CSS/JavaScript (future: React for enhanced interactivity)
- **Hosting:** GitHub Pages (vulca-exhibition repository)
- **Design System:** Sougwen-inspired (minimalism, organic flows, negative space, fluid animations)

#### Backend (AI Commentary Generation)
- **API:** GPT-3.5 Turbo (primary) + backup models (通义千问, 文心一言)
- **Persona System:** 6 cultural critic personas with RPAIT weights
- **Integration:** OpenAI API with result caching

#### Data Layer
- **Artworks:** 4 core pieces + metadata (image, description, dimensions, process docs)
- **Personas:** 6 cultural critics with:
  - Biographical info & influence
  - Evaluation dimensions (RPAIT weights)
  - Sample critique style
  - Visual representation (portrait or symbolic icon)
- **Knowledge Base:** Art history, cultural context, interpretation frameworks

### Proposed Structure

```
vulcaart.art/
├── index.html                    # Main landing + navigation
├── styles/
│   ├── main.css               # Core styling (Sougwen aesthetic)
│   ├── exhibition.css         # Exhibition-specific styles
│   ├── interaction.css        # Interactive elements
│   └── responsive.css         # Mobile optimization
├── js/
│   ├── app.js                 # Main application logic
│   ├── api-client.js          # OpenAI API communication
│   ├── artwork-gallery.js     # Artwork display & switching
│   ├── persona-selector.js    # Critic selection
│   ├── critique-generator.js  # AI critique generation
│   └── share-utils.js         # Social sharing functionality
├── data/
│   ├── artworks.json          # 4 artwork definitions
│   ├── personas.json          # 6 cultural critics
│   └── exhibition-config.json # Layout, themes, metadata
├── assets/
│   ├── artworks/              # High-res artwork images
│   ├── personas/              # Persona portraits/icons
│   ├── process/               # Process documentation, sketches
│   └── icons/                 # UI icons
└── README.md                   # Exhibition guide
```

---

## 4. Detailed Requirements

### 4.1 Aesthetics & Design Language
**Requirement:** Website must embody Sougwen Chung's artistic aesthetic principles

**Key Characteristics:**
- Generous negative (white) space
- Minimalist color palette: white, light gray, deep blue/black
- Organic, flowing animations and transitions
- Poetic, subtle typography
- Large, intentional empty areas in layout
- Fluid motion graphics (no jarring transitions)
- Emphasis on process and imperfection over polished completion

**Example Inspiration:** "BODY MACHINE (MERIDIANS)" exhibition design - floating forms, minimalist presentation, emphasis on gesture and flow

### 4.2 Exhibition Core Interaction
**Requirement:** Fully functional "作品 × 角色卡" interactive system

**User Journey:**
```
1. Browse (4 curated artworks displayed)
   ↓
2. Discover (Read artwork description + process notes)
   ↓
3. Select Artwork (Choose one to critique)
   ↓
4. Choose Persona (Select from 6 cultural critics)
   ↓
5. Generate (Click button → AI creates persona-specific critique)
   ↓
6. Read & Compare (View 300-500 character critique in persona voice)
   ↓
7. Explore More (See other personas' takes on same artwork)
   ↓
8. Share (Generate shareable image with artwork + critique)
```

**Technical Requirements:**
- Real-time AI API integration (GPT-3.5 Turbo)
- Result caching (avoid duplicate API calls for same artwork+persona combo)
- Graceful error handling (fallback text if API fails)
- Offline capability (pre-cached sample critiques)
- <5 second response time for critique generation

### 4.3 Artwork Showcase (4 Pieces)
**Requirement:** Display 4 representative artworks with full context

**Per-Artwork Content:**
- High-resolution image (>2000px, optimized)
- Title + artist/creator
- Dimension & medium information
- Artist/creation statement
- "Process" section: sketches, iterations, creation notes
- Quick metadata: date, inspiration, cultural references

**Recommendations for Selection:**
- Mix of mediums and styles
- Span the "潮汐的负形" thematic range
- Include both finished work and process documentation
- Showcase different evaluation dimensions (some emphasize technical skill, others conceptual depth)

### 4.4 Cultural Critic Personas (6 Total)
**Requirement:** Detailed persona cards with evaluation dimensions and sample critiques

**Per-Persona Card Content:**
- Portrait/symbolic icon
- Name (Chinese + English romanization)
- Time period / cultural origin
- 3-4 line biography
- "Evaluation Dimensions" with RPAIT weights visualization:
  - **R**epresentation (视觉表现)
  - **P**hilosophy (哲学思想)
  - **A**esthetics (美学原理)
  - **I**nterpretation (诠释深度)
  - **T**echnique (技术分析)
- Sample critique (2-3 sentence style example)
- Key analytical framework

**6 Personas (from 方案A.pdf):**
1. **苏轼 (Su Shi)** - Northern Song literati painter
2. **郭熙 (Guo Xi)** - Northern Song landscape master
3. **约翰·罗斯金 (John Ruskin)** - Victorian moralist
4. **佐拉妈妈 (Mama Zola)** - West African communal vision
5. **埃琳娜·佩特洛娃教授 (Professor Elena Petrova)** - Russian Formalist
6. **AI伦理评审 (AI Ethics Reviewer)** - Digital age perspective

**Visualization:** Interactive radar charts showing RPAIT weightings for each persona

### 4.5 Physical Exhibition Layout
**Requirement:** Visualize and document 10m² exhibition space design

**Content:**
- Interactive floor plan (SVG or canvas visualization)
- Artwork placement and sightlines
- Persona card display positioning
- QR code placement for digital access
- Audience flow path ("之字形" / Z-shaped movement pattern)
- Technical requirements (lighting, WiFi coverage, power points)

### 4.6 Process Documentation ("负形关注")
**Requirement:** Showcase creative process, iterations, and conceptual development

**Sections:**
- **Initial Concept** - Project vision and "潮汐的负形" interpretation
- **Research Phase** - Persona development, art selection rationale
- **Iteration Cycles** - Design mockups, content drafts, feedback loops
- **Technical Challenges** - Decisions made, trade-offs, solutions
- **Final Refinements** - Polish and optimization decisions

**Purpose:** Embody the "negative space" theme by highlighting what's invisible/behind-the-scenes

---

## 5. Scope & Phasing

### Phase 1: Core Platform (Weeks 1-3)
- Website structure and Sougwen-inspired aesthetic
- 4 artwork display system
- 6 persona cards with RPAIT visualization
- Basic AI critique generation integration
- Mobile responsiveness

### Phase 2: Enhanced Interactivity (Weeks 4-6)
- Full "作品 × 角色卡" workflow
- Multi-persona comparison view
- Shareable critique images
- Process documentation gallery
- Physical space layout visualization

### Phase 3: Optimization & Deployment (Weeks 7-8)
- Performance optimization
- Offline fallbacks
- Analytics & visitor tracking
- SEO optimization
- Final testing and deployment

---

## 6. Success Criteria

### Functional Requirements
- [ ] 4 artworks fully displayed with high-resolution images
- [ ] 6 personas with complete biographical and evaluation data
- [ ] AI critique generation works for all 24 artwork-persona combinations
- [ ] Results cache prevents duplicate API calls
- [ ] Response time <5 seconds for critique generation
- [ ] Offline fallback critiques available
- [ ] Share functionality generates valid image+text combinations

### Design Requirements
- [ ] Aesthetic aligns with Sougwen Chung references (whitespace, organic movement, poetic minimalism)
- [ ] Mobile-responsive (tested on phones, tablets, desktops)
- [ ] Accessibility meets WCAG 2.1 AA standards
- [ ] Page load time <3 seconds on 4G
- [ ] No jarring transitions; smooth, intentional animations

### User Experience Requirements
- [ ] Clear user journey from browse → critique → share
- [ ] Intuitive persona selection
- [ ] Artwork switching feels natural and fluid
- [ ] Critique generation provides meaningful insights
- [ ] Social sharing increases engagement

---

## 7. Dependencies & Constraints

### Technical Dependencies
- OpenAI API (GPT-3.5 Turbo) availability and rate limits
- GitHub Pages hosting stability
- Domain vulcaart.art DNS configuration (already set)

### Content Dependencies
- 4 high-resolution artwork images (must be acquired/created)
- 6 persona profiles with complete metadata
- 24 reference critiques (for caching/offline use)
- Process documentation and iteration materials

### Constraints
- **Budget:** Minimal (GitHub Pages free, OpenAI API pay-as-you-go)
- **Timeline:** 8 weeks to deployment
- **Team:** Single developer
- **Artistic Direction:** Must align with Sougwen Chung aesthetic philosophy

---

## 8. Metrics for Success

- **Engagement:** Avg session duration >2 minutes
- **Interaction:** >60% of visitors generate at least one critique
- **Sharing:** >30% of critiques shared on social media
- **Traffic:** >500 unique visitors in first month
- **Technical:** 99.9% uptime, <1% error rate on API calls

---

## Next Steps

1. **Clarify artwork selection** - Which 4 pieces will be featured?
2. **Finalize persona profiles** - Complete metadata for all 6 personas
3. **Design aesthetic mockups** - Sougwen-inspired visual direction
4. **Prepare content** - Artwork images, descriptions, process docs
5. **Approval & refinement** - Stakeholder review of this proposal
6. **Implementation** - Follow OpenSpec change workflow with tasks.md and design.md

