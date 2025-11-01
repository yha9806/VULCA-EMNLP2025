# Phase 1 Implementation: Starting Now

**Status:** ✅ APPROVED - Beginning Phase 1 (Weeks 1-3)

**Timeline:** Flexible (no fixed deadline)

**Resources:** Single developer + Claude Code AI-assisted development

---

## Phase 1 Overview: Core Platform Structure

Phase 1 focuses on building the foundation: design system, data structures, and core UI components.

### 1.1 Design System & Aesthetics
**Sougwen Chung Aesthetic (CONFIRMED)**

Key Design Principles:
- ✅ Generous negative (white) space
- ✅ Minimalist color palette
- ✅ Organic, flowing animations
- ✅ Poetic, subtle typography
- ✅ Large intentional empty areas
- ✅ Emphasis on process and imperfection

**Color Palette** (from design.md):
```
Primary Colors:
  - Warm White: #F8F7F4 (main background)
  - Pure White: #FFFFFF (cards, highlights)
  - Deep Blue: #1A2844 (text, accents)
  - Accent Gray: #D4D2CE (borders, subtle elements)

Typography:
  - Display: Crimson Text (serif, poetic)
  - Body: Inter (sans-serif, clean)
  - Monospace: SF Mono (technical elements)
```

**Animation Philosophy:**
- Fade transitions (400ms)
- Smooth easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Organic micro-interactions
- No jarring transitions

### 1.2 Project Structure & Setup

**Repository:** `/home/MyhrDyzy/vulca-exhibition` or `C:\Users\MyhrDyzy\vulca-exhibition`

```
vulca-exhibition/
├── index.html                    # Landing page
├── exhibition.html               # Main exhibition interface
├── styles/
│   ├── reset.css               # CSS reset
│   ├── variables.css           # Design tokens (colors, spacing, typography)
│   ├── layout.css              # Main layout and grid
│   ├── components.css          # Reusable components
│   ├── aesthetic.css           # Sougwen aesthetic specifics
│   └── responsive.css          # Mobile optimization
├── js/
│   ├── app.js                  # Main app initialization
│   ├── gallery.js              # Artwork gallery logic
│   ├── personas.js             # Persona selector
│   ├── state.js                # Simple state management
│   └── utils.js                # Helper functions
├── data/
│   ├── artworks.json           # 4 artwork definitions (TBD)
│   ├── personas.json           # 6 persona definitions
│   └── config.json             # Exhibition configuration
├── assets/
│   ├── artworks/               # High-res artwork images
│   ├── personas/               # Persona portraits
│   ├── process/                # Process documentation
│   └── icons/                  # UI icons
├── .gitignore
├── CNAME                        # GitHub Pages domain
├── README.md                    # Project documentation
└── service-worker.js           # Offline support (Phase 3)
```

### 1.3 Artwork Data System

**Schema: artworks.json**
```json
{
  "artworks": [
    {
      "id": "artwork-01",
      "title": "[Title TBD]",
      "artist": "[Artist TBD]",
      "year": 2024,
      "dimensions": {
        "width": 0,
        "height": 0,
        "unit": "cm"
      },
      "medium": "[Medium TBD]",
      "description": "[Description TBD]",
      "artist_statement": "[Statement TBD]",
      "inspiration": "[Inspiration TBD]",
      "images": {
        "high_res": "/assets/artworks/artwork-01-hires.jpg",
        "thumbnail": "/assets/artworks/artwork-01-thumb.jpg"
      },
      "process": {
        "sketches": [
          "/assets/process/artwork-01-sketch-01.jpg",
          "/assets/process/artwork-01-sketch-02.jpg"
        ],
        "iterations": [
          {
            "title": "First iteration",
            "image": "/assets/process/artwork-01-iter-01.jpg",
            "notes": "Initial concept"
          }
        ],
        "documentation": "Detailed process notes..."
      },
      "related_themes": ["theme1", "theme2"],
      "cultural_references": ["ref1", "ref2"]
    }
    // ... artworks 02, 03, 04
  ]
}
```

**Status:** Awaiting artwork data from stakeholder

### 1.4 Persona System Setup

**6 Cultural Critic Personas (CONFIRMED)**

```json
{
  "personas": [
    {
      "id": "persona-suShi",
      "name_zh": "苏轼",
      "name_en": "Su Shi",
      "era": "Northern Song Dynasty (1037-1101)",
      "role": "Literati Painter & Philosopher",
      "biography": "Northern Song literati painter and philosopher who emphasized personal expression and scholarly cultivation in art.",
      "rpait_weights": {
        "representation": 7,
        "philosophy": 9,
        "aesthetics": 8,
        "interpretation": 8,
        "technique": 6
      },
      "portrait": "/assets/personas/su-shi.jpg",
      "analytical_framework": "Literati aesthetics, personal expression, scholarly perspective",
      "sample_critique": "Sample critique demonstrating Su Shi's voice and analytical approach...",
      "key_concepts": ["literati culture", "personal expression", "scholarly view"]
    },
    // ... personas: Guo Xi, John Ruskin, Mama Zola, Professor Petrova, AI Ethics Reviewer
  ]
}
```

**RPAIT Visualization:**
- Radar chart showing 5-dimension weights
- Tooltips explaining each dimension
- Visual representation of analytical focus

### 1.5 Main Navigation & Landing Page

**Design Mockup:**
```
┌─────────────────────────────────────────────────┐
│  vulcaart.art | 潮汐的负形                      │
├─────────────────────────────────────────────────┤
│                                                 │
│     [Large hero section with poetic intro]      │
│     [Generous whitespace]                       │
│                                                 │
│     [Enter Exhibition Button]                   │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Exhibition Overview                            │
│  - 4 Artworks                                   │
│  - 6 Cultural Critics                           │
│  - AI-Driven Critique System                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

Navigation Menu:
- Home
- Exhibition
- Personas
- Process
- About

### 1.6 Artwork Gallery View

**Interactive Gallery Component:**
- Smooth carousel between 4 artworks
- Large, high-resolution image display (>2000px)
- Artwork metadata panel (title, artist, dimensions, description)
- "Process" section toggle showing iterations and sketches
- Clean, minimalist UI with generous whitespace

### 1.7 Persona Cards & Showcase

**Persona Card Layout:**
```
┌──────────────────────────┐
│  [Portrait/Icon]         │
├──────────────────────────┤
│  Name (ZH & EN)          │
│  Era / Period            │
│  Biography (3-4 lines)   │
│                          │
│  RPAIT Visualization     │
│  (Radar or bar chart)    │
│                          │
│  [View Details Button]   │
└──────────────────────────┘
```

Components to Build:
- Persona card component (reusable)
- Persona grid/carousel display
- RPAIT visualization component
- Persona detail modal/page

### 1.8 Responsive Design & Accessibility

**Breakpoints:**
```css
Mobile: 320px - 480px
Tablet: 481px - 1024px
Desktop: 1025px+
```

**Accessibility (WCAG 2.1 AA):**
- Keyboard navigation fully functional
- Screen reader compatible
- Color contrast ≥4.5:1 for text
- Alt text for all images
- Proper semantic HTML

**Performance Targets:**
- Page load: <3 seconds on 4G
- Lighthouse Performance: >90
- Lighthouse Accessibility: >95
- No cumulative layout shift

---

## Immediate Next Steps

### Step 1: Prepare Project Structure
- [ ] Set up vulca-exhibition directory structure
- [ ] Create base HTML files (index.html, exhibition.html)
- [ ] Create CSS structure with design tokens

### Step 2: Design System Implementation
- [ ] Define color palette in CSS variables
- [ ] Implement typography system
- [ ] Create layout grid system
- [ ] Build component library (buttons, cards, galleries)

### Step 3: Data Structure Definition
- [ ] Finalize artworks.json schema
- [ ] Finalize personas.json schema
- [ ] Create exhibition-config.json

### Step 4: Artwork Data Collection
- [ ] Receive 4 artwork selections from stakeholder
- [ ] Gather high-resolution images (>2000px)
- [ ] Collect artwork metadata and descriptions
- [ ] Organize process documentation

### Step 5: Persona Development
- [ ] Complete all 6 persona profiles
- [ ] Define RPAIT weights for each persona
- [ ] Create persona portraits/icons
- [ ] Write sample critiques

### Step 6: Core UI Implementation
- [ ] Build landing page with hero section
- [ ] Implement navigation menu
- [ ] Create artwork gallery component
- [ ] Create persona cards component

---

## Success Criteria for Phase 1

- [ ] Project structure matches design.md specifications
- [ ] CSS variables properly define all design tokens
- [ ] All HTML pages validate (W3C)
- [ ] No console errors
- [ ] Responsive design works on all breakpoints
- [ ] Accessibility meets WCAG 2.1 AA standards
- [ ] Gallery and personas display correctly
- [ ] Page loads in <3 seconds
- [ ] No layout shift issues

---

## Design System Details (Sougwen Aesthetic)

### Spacing Scale
```
xs: 8px
sm: 16px
md: 24px
lg: 32px
xl: 48px
2xl: 64px
3xl: 96px
```

### Typography Scale
```
Display Large (h1): 48px / 1.2
Display Small (h2): 32px / 1.3
Heading (h3): 24px / 1.4
Subheading (h4): 18px / 1.5
Body Large: 16px / 1.6
Body Regular: 14px / 1.6
Caption: 12px / 1.5
```

### Animation Easing
```css
standard: cubic-bezier(0.4, 0, 0.2, 1)
entrance: cubic-bezier(0, 0, 0.2, 1)
exit: cubic-bezier(0.4, 0, 1, 1)
```

### Component Styles

**Buttons:**
- Minimal borders or subtle background
- Generous padding
- Smooth hover states
- No hard shadows (use subtle borders)

**Cards:**
- Generous padding (32px+)
- Light borders (#D4D2CE)
- Large whitespace above/below
- Subtle shadows only on hover

**Gallery Items:**
- Full-width on mobile
- Maximum width constraint on desktop
- Large margins between items
- Smooth transitions on select

---

## Ready to Begin!

Phase 1 is approved and ready to start. Stakeholder has confirmed:

✅ Sougwen aesthetic direction
✅ Flexible timeline (no deadline pressure)
✅ Pay-as-you-go API budget
✅ Single developer + AI-assisted approach
✅ Full process documentation available

**Next action:** Start with **Step 1 - Project Structure Setup**

---

**Document Version:** 1.0
**Date:** 2025-11-01
**Prepared by:** Claude Code
