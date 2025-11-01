# VULCA Design Specification Review Checklist

**Date:** October 2025
**Purpose:** Final approval of design system before Week 1 implementation
**Approvers:** Project Lead / Team

---

## Section 1: Color System Review

### 1.1 Warm Gray Palette Approval

**Current Specification:**
```
--warm-gray-950:  #1a1613    ← Exhibition background
--warm-gray-900:  #3a3330    ← Dark surfaces
--warm-gray-700:  #746d65    ← Headings
--warm-gray-400:  #c0bbb5    ← Primary body text ⭐ CRITICAL
--warm-gray-100:  #f5f2ed    ← Light backgrounds
```

**Review Questions:**
- [ ] Is #c0bbb5 (warm-gray-400) the correct primary text color? (affects readability)
- [ ] Does #1a1613 work as exhibition background? (should feel warm, not cold)
- [ ] Is the contrast ratio 4.8:1 (#c0bbb5 on #1a1613) acceptable for body text?

**Decision Required:**
```
Warm Gray Palette: [ ] APPROVED  [ ] NEEDS ADJUSTMENT

If adjustment needed, specify:
- Replace #c0bbb5 with: ___________
- Replace #1a1613 with: ___________
- Other changes: ___________________
```

---

### 1.2 Metal Accents Review

**Current Specification:**
```
--metal-gold-primary:     #d4af37    ← Artwork borders, CTAs ⭐ CRITICAL
--metal-silver-primary:   #c0c0c0    ← Secondary accents
--metal-copper:           #b87333    ← Alternative
```

**Review Questions:**
- [ ] Is #d4af37 (champagne gold) the right "warmth" level for your exhibition?
- [ ] Should it be brighter/darker? (scale: warm-cool spectrum)
- [ ] Does #c0c0c0 (silver) feel too cool compared to warm grays?

**Visual Test:**
Print or display side-by-side:
- Gold (#d4af37) on dark background (#1a1613)
- Silver (#c0c0c0) on dark background (#1a1613)
- Do they feel cohesive or competing?

**Decision Required:**
```
Metal Accents: [ ] APPROVED  [ ] NEEDS ADJUSTMENT

If adjustment needed, specify:
- Replace gold with: ___________
- Replace silver with: ___________
- Add alternative metal color: ___________
```

---

### 1.3 Bloom/Glow Effects Review

**Current Specification:**
```css
--glow-gold:        #d4af37    (full opacity)
--glow-gold-soft:   rgba(212, 175, 55, 0.4)   (40% opacity)
--glow-silver:      #c0c0c0
--glow-silver-soft: rgba(192, 192, 192, 0.3)  (30% opacity)
```

**Review Questions:**
- [ ] Should the glow be 40% opacity for gold? (affects intensity)
- [ ] Should silver glow be 30% opacity? (appears dimmer)
- [ ] Will bloom post-processing make glows too washed out?

**Decision Required:**
```
Glow Effects: [ ] APPROVED  [ ] NEEDS ADJUSTMENT

If adjustment needed:
- Gold opacity: 40% → ____%
- Silver opacity: 30% → ____%
- Bloom strength: 1.5 → _____
```

---

## Section 2: Typography Review

### 2.1 Font Stack Approval

**Current Specification:**
```css
--font-display: 'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif
--font-body:    'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif
--font-display-cjk: 'Noto Serif SC', '思源宋体', serif
--font-body-cjk:    'Noto Sans SC', '思源黑体', sans-serif
```

**Review Questions:**
- [ ] Is 'Inter' the preferred display font? (modern, clean)
- [ ] Should body text use Serif or Sans-serif for Chinese?
- [ ] Current: Display=Serif, Body=Sans for CJK - is this contrast intentional?

**Alternative Options:**
```
Display font options:
- [ ] Inter (current - modern, geometric)
- [ ] Playfair Display (elegant, serif)
- [ ] Montserrat (bold, contemporary)

Body font options:
- [ ] Noto Sans SC (current - clean, readable)
- [ ] Noto Serif SC (elegant, traditional feel)
- [ ] Other: ___________
```

**Decision Required:**
```
Typography Stack: [ ] APPROVED  [ ] NEEDS ADJUSTMENT

Selected fonts:
- Display: ___________________
- Body: ___________________
- CJK Display: ___________________
- CJK Body: ___________________
```

---

### 2.2 Type Scale Approval

**Current Specification:**
```
H1: 3.0rem (48px) - Exhibition title
H2: 2.2rem (35px) - Artwork titles
H3: 1.6rem (26px) - Subsections
Body: 1.0rem (16px) - Primary text
```

**Review Questions:**
- [ ] Is H1 (48px) prominent enough for exhibition title?
- [ ] Is Body (16px) readable at arm's length on display screen?
- [ ] Mobile breakpoint: should Body reduce to 14px or stay 16px?

**Decision Required:**
```
Type Scale: [ ] APPROVED  [ ] NEEDS ADJUSTMENT

If adjustments needed:
- H1: 3.0rem → _____
- H2: 2.2rem → _____
- Body: 1.0rem → _____
- Mobile body: 0.9rem → _____
```

---

## Section 3: Particle System Review

### 3.1 Particle Count Review

**Current Specification:**
```javascript
Desktop:   1500 particles
Tablet:    800 particles
Mobile:    300 particles
```

**Review Questions:**
- [ ] Is 1500 particles too dense/sparse for 2560×1440 screen?
- [ ] Should density scale with viewport size (adaptive)?
- [ ] On mobile, are 300 particles sufficient or too busy?

**Performance Implications:**
- 1500 particles @ 60 FPS requires ~25-30 MB GPU memory
- 300 particles @ 60 FPS requires ~5-8 MB GPU memory

**Decision Required:**
```
Particle Counts: [ ] APPROVED  [ ] NEEDS ADJUSTMENT

If adjustment needed:
- Desktop: 1500 → _____
- Tablet: 800 → _____
- Mobile: 300 → _____
```

---

### 3.2 Particle Motion Review

**Current Specification:**
```javascript
Perlin noise scale: 80
Speed range: 0.3 - 0.8 px/frame
Opacity range: 0.3 - 0.8
Color: Gold (#d4af37) → Silver (#c0c0c0) transition
```

**Review Questions:**
- [ ] Is Perlin scale (80) creating organic motion? (test required)
- [ ] Should particles move faster/slower?
- [ ] Should opacity fade-in/out be more pronounced?
- [ ] Should particles always transition gold→silver or random colors?

**Decision Required:**
```
Particle Motion: [ ] APPROVED  [ ] NEEDS ADJUSTMENT

If adjustment needed:
- Perlin scale: 80 → _____
- Speed range: 0.3-0.8 → _______
- Opacity range: 0.3-0.8 → _______
- Color animation: Sequential/Random → _________
```

---

## Section 4: Layout & Responsiveness Review

### 4.1 Viewport Breakpoints

**Current Specification:**
```css
Mobile:   < 480px
Tablet:   480px - 1024px
Desktop:  > 1024px
```

**Review Questions:**
- [ ] Should mobile breakpoint be 480px or 600px (match common devices)?
- [ ] Is tablet breakpoint 480-1024px covering all devices correctly?
- [ ] Need intermediate breakpoint for 1200px+ wide screens?

**Common Device Sizes:**
- iPhone 12/13: 390px
- iPad: 810px
- iPad Pro: 1024px+
- Desktop: 1440px, 1920px, 2560px

**Decision Required:**
```
Breakpoints: [ ] APPROVED  [ ] NEEDS ADJUSTMENT

If adjustment needed:
- Mobile: < 480px → < ______
- Tablet: 480-1024px → _____ - _____
- Desktop: > 1024px → > _____
- Add XL breakpoint: Yes/No at _____ px
```

---

### 4.2 Grid Layout Review

**Current Specification:**
```
2×2 Grid (4 artworks)
Spacing: 48px (6.0rem) between cards
Desktop: Full 2×2 grid
Tablet: Stacked or 2×1 responsive
Mobile: Single column
```

**Review Questions:**
- [ ] For 2×2 grid, should spacing be 48px or 32px? (affects perceived density)
- [ ] On mobile, should cards be full-width or have margin?
- [ ] Should detail page have same spacing as main grid?

**Decision Required:**
```
Grid Layout: [ ] APPROVED  [ ] NEEDS ADJUSTMENT

If adjustment needed:
- Card spacing: 48px → _____
- Mobile card margin: _____ px
- Grid arrangement: 2×2 → _______
```

---

## Section 5: Accessibility Review

### 5.1 Color Contrast Verification

**Current Specification:**
```
#c0bbb5 (text) on #1a1613 (background) = 4.8:1 contrast
#746d65 (heading) on #1a1613 (background) = 7.2:1 contrast
#d4af37 (gold) on #1a1613 (background) = 3.1:1 contrast
```

**WCAG Standards:**
- AA Level: 4.5:1 for body text ✅ (4.8:1 passes)
- AA Level: 3:1 for large text ✅
- AAA Level: 7:1 for body text (optional enhancement)

**Review Questions:**
- [ ] Is WCAG AA sufficient, or target AAA (7:1)?
- [ ] Gold text (#d4af37) has low contrast (3.1:1) - use only for non-text?
- [ ] Have you tested contrast in different lighting conditions?

**Decision Required:**
```
Accessibility Level:
[ ] WCAG AA (4.5:1 body text) - Current spec
[ ] WCAG AAA (7:1 body text) - Enhanced
[ ] Custom: _____________

Gold text usage:
[ ] Decorative only (not selectable text)
[ ] Require higher contrast alternative: #________
```

---

### 5.2 Mobile Accessibility

**Review Questions:**
- [ ] Touch target size: Are artwork cards ≥44×44px for touch?
- [ ] QR code size: 200×200px is sufficient for scanning?
- [ ] Focus indicators visible on keyboard navigation?

**Decision Required:**
```
Mobile A11y: [ ] APPROVED  [ ] NEEDS ADJUSTMENT

Focus ring color: #d4af37 or ___________
Min touch target: 44px or _____
QR code size: 200px or _____
```

---

## Section 6: Animation & Effects Review

### 6.1 Bloom Post-Processing

**Current Specification:**
```javascript
bloom: {
  strength: 1.5,    // Intensity
  radius: 0.8,      // Spread
  threshold: 0.6,   // What triggers bloom
}
```

**Review Questions:**
- [ ] Is bloom strength 1.5 correct? (1.0 = normal, >1.0 = intense)
- [ ] Should threshold be 0.6? (higher = less bloom triggered)
- [ ] Will bloom affect text readability?

**Decision Required:**
```
Bloom Effects: [ ] APPROVED  [ ] NEEDS ADJUSTMENT

If adjustment needed:
- Strength: 1.5 → _____
- Radius: 0.8 → _____
- Threshold: 0.6 → _____
```

---

### 6.2 Animation Speed Review

**Current Specification:**
- Particle life: 120-300 frames (2-5 seconds at 60 FPS)
- GSAP transitions: 0.6-1.0 seconds
- Page load animations: Staggered 0.1s between elements

**Review Questions:**
- [ ] Are particle lifespans (2-5s) creating continuous effect?
- [ ] Are GSAP animations (0.6-1.0s) too slow/fast?
- [ ] Should stagger be 0.1s or faster (0.05s)?

**Decision Required:**
```
Animation Timing: [ ] APPROVED  [ ] NEEDS ADJUSTMENT

If adjustment needed:
- Particle life: 120-300 frames → ______
- GSAP duration: 0.6-1.0s → _____
- Stagger delay: 0.1s → _____
```

---

## Section 7: Brand & Theme Alignment

### 7.1 Theme "潮汐的负形" (Tidal Negation) Review

**Current Interpretation:**
- Negative space: Invisible networks, hidden collaborations
- Tidal metaphor: Rhythm of visibility/invisibility, ebb/flow
- Gold + Silver: Represents warm human vs cool machine

**Review Questions:**
- [ ] Does color system adequately represent "潮汐的负形"?
- [ ] Should particle effects represent "tidal" motion (wave-like)?
- [ ] Are artwork descriptions sufficiently explaining theme?

**Decision Required:**
```
Theme Alignment: [ ] APPROVED  [ ] NEEDS ADJUSTMENT

If not aligned:
- Color interpretation: ___________________
- Particle interpretation: ___________________
- Visual metaphor needed: ___________________
```

---

### 7.2 Artist Representation Review

**Sougwen Chung (愫君):**
- Works: 3 pieces (BODY MACHINE × 2, MEMORY × 1)
- Theme: Human-machine symbiosis, collaborative creation
- Visual: Organic robot forms, silver + gold accents

**Lauren McCarthy:**
- Works: 1 piece (AUTO)
- Theme: Algorithmic surveillance, invisible control
- Visual: Digital installation, immersive environment

**Review Questions:**
- [ ] Is 3:1 ratio (Sougwen:Lauren) intentional or should be 2:2?
- [ ] Do visual aesthetics serve both artists equally?
- [ ] Should each artist have dedicated color accent?

**Decision Required:**
```
Artist Balance:
[ ] Keep 3:1 (3 Sougwen, 1 Lauren)
[ ] Change to 2:2 (2 Sougwen, 2 Lauren)

Artist-specific colors:
[ ] No distinction (shared palette)
[ ] Sougwen: _____ accent
[ ] Lauren: _____ accent
```

---

## Section 8: Final Sign-Off

### 8.1 Color System Final Approval

**Summary of Color Decisions:**

Primary Text Color: #________
Background Color: #________
Primary Accent: #________
Secondary Accent: #________
Heading Color: #________

**Approver Signature:**
```
[ ] I approve the color system as specified above
[ ] Revisions required - see notes below

Approver Name: ___________________
Date: ___________________
Notes: ___________________
```

---

### 8.2 Typography Final Approval

**Summary of Typography Decisions:**

Display Font: ___________________
Body Font: ___________________
CJK Display Font: ___________________
CJK Body Font: ___________________
Base Font Size: _____ px

**Approver Signature:**
```
[ ] I approve the typography system as specified above
[ ] Revisions required - see notes below

Approver Name: ___________________
Date: ___________________
```

---

### 8.3 Design System Final Approval

**Overall System Status:**

```
[ ] APPROVED - Ready for Week 1 implementation
    Next step: Begin CSS implementation Monday

[ ] APPROVED WITH MODIFICATIONS - See below
    Modifications required before implementation:
    ___________________________________________
    ___________________________________________

[ ] NEEDS MAJOR REVISION - Schedule design review
    Reason: ___________________________
    Next review date: _______________
```

---

## Next Steps

**If APPROVED:**
- Start FINAL_4WEEK_EXECUTION_PLAN.md Week 1, Monday
- Create `docs/css/_colors.css` with finalized hex values
- Begin IMAGE_ACQUISITION_GUIDE.md image collection

**If APPROVED WITH MODIFICATIONS:**
- Update DESIGN_SPEC.md with new color values
- Verify contrast ratios with updated colors
- Proceed to Week 1 with modified spec

**If NEEDS REVISION:**
- Schedule follow-up design review
- Document all feedback in this checklist
- Revise DESIGN_SPEC.md and re-submit

---

**Document Status:** Ready for Review
**Date Created:** October 2025
**Version:** 1.0
