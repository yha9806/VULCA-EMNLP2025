# Proposal: Enhance Visual Design System

**Change ID**: `enhance-visual-design-system`
**Status**: Draft
**Created**: 2025-11-11
**Target Version**: 4.1.0

---

## What Changes

Unify and enhance the visual design system across **new portfolio homepage** and **existing exhibition pages** to ensure consistent brand identity and improved user experience.

### Current State (v4.0)

**Portfolio Homepage** (new):
```
- Hero: 60vh with Terracotta → Gold gradient
- Cards: border-radius 8px, shadow 0 2px 8px rgba(0,0,0,0.1)
- Navigation: Global nav with sticky positioning
- Typography: clamp() responsive scaling
- Colors: CSS variables defined
```

**Exhibition Pages** (existing):
```
- Dialogue Player: border-radius 12px, shadow 0 4px 20px rgba(0,0,0,0.08)
- Components: Warm terracotta-gold theme
- Typography: Mixed font sizes and line heights
- Spacing: Organic, case-by-case
```

### Target State (v4.1)

**Unified Design System**:
```
1. Visual Consistency
   - Standardized shadows (--shadow-sm/md/lg)
   - Unified border radius (--radius-md: 12px)
   - Consistent hover effects across all cards
   - Unified button styles

2. Typography System
   - Defined type scale (h1-h6, body, caption)
   - Optimized line heights (1.2 for headings, 1.6 for body)
   - Improved Chinese-English bilingual spacing
   - Responsive typography with consistent ratios

3. Spacing & Rhythm
   - Vertical rhythm based on 8px grid
   - Consistent section padding
   - Improved content area max-widths
   - Enhanced whitespace and breathing room
```

---

## Why

### User Need

> "我想优化可视化和排版以及配色等内容。跟原来的子页面不要有太大出入。"

**Translation**: "I want to optimize visualization, typography, and color scheme. Don't have too much difference from the original exhibition pages."

### Problems with Current State

**Problem 1: Visual Inconsistency**
- Homepage cards use 8px radius, exhibition components use 12px
- Shadow depths vary (2px/4px/8px) without clear hierarchy
- Hover effects differ across interactive elements
- Buttons have mixed styles

**Problem 2: Typography Lacks System**
- Font sizes chosen case-by-case without type scale
- Line heights inconsistent (1.2/1.3/1.6/1.8)
- Chinese-English mixed text lacks proper spacing
- No clear visual hierarchy across pages

**Problem 3: Spacing Unpredictable**
- Vertical rhythm not based on grid
- Section padding varies arbitrarily
- Content widths inconsistent (700px/800px/1400px)
- Difficult to maintain consistency when adding new pages

**Problem 4: Design Tokens Not Utilized**
- CSS variables defined but not fully used
- Magic numbers scattered in stylesheets
- Hard to make global design changes
- No single source of truth for design values

### Business Value

**For User Experience**:
- ✅ Unified visual language increases trust and professionalism
- ✅ Consistent typography improves readability
- ✅ Better spacing creates comfortable reading experience
- ✅ Polished design increases perceived quality

**For Maintainability**:
- ✅ Design tokens make global changes easy
- ✅ Systematic approach reduces CSS complexity
- ✅ Clear standards guide future development
- ✅ Less time debugging visual inconsistencies

**For Portfolio Presentation**:
- ✅ Professional design impresses curators
- ✅ Consistent brand identity across all exhibitions
- ✅ Shows attention to detail and craft
- ✅ Competitive advantage in art submissions

---

## How

### Implementation Strategy: 3-Layer Enhancement

#### Layer 1: Design Tokens (Foundation)
**Goal**: Establish single source of truth for design values
**Duration**: 30 minutes
**Approach**:
1. Define comprehensive CSS variables
2. Create design token documentation
3. Apply tokens to existing components

**Design Tokens**:
```css
:root {
  /* Colors (existing, keep) */
  --color-primary: #B85C3C;
  --color-accent: #D4A574;
  --color-dark: #2d2d2d;
  --color-light: #f9f9f9;

  /* Shadows (new) */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
  --shadow-xl: 0 12px 32px rgba(0, 0, 0, 0.15);

  /* Radius (new) */
  --radius-sm: 4px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Typography Scale (new) */
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */
  --font-size-5xl: 3rem;      /* 48px */
  --font-size-6xl: 4rem;      /* 64px */

  /* Line Heights (new) */
  --leading-tight: 1.2;
  --leading-snug: 1.4;
  --leading-normal: 1.6;
  --leading-relaxed: 1.8;

  /* Spacing (enhanced) */
  --spacing-xs: 0.5rem;   /* 8px */
  --spacing-sm: 1rem;     /* 16px */
  --spacing-md: 2rem;     /* 32px */
  --spacing-lg: 4rem;     /* 64px */
  --spacing-xl: 6rem;     /* 96px */
  --spacing-2xl: 8rem;    /* 128px */
}
```

#### Layer 2: Component Unification
**Goal**: Apply design tokens to all components
**Duration**: 2 hours
**Approach**:
1. Update homepage components
2. Update shared components
3. Verify exhibition pages still work
4. Test responsive behavior

**Components to Update**:
- Exhibition cards (homepage, archive)
- Global navigation
- Buttons and CTAs
- Dialogue player (verify only)
- Footer

#### Layer 3: Typography & Spacing
**Goal**: Implement systematic typography and spacing
**Duration**: 1.5 hours
**Approach**:
1. Apply type scale to all headings
2. Optimize line heights and letter spacing
3. Implement 8px vertical rhythm
4. Improve Chinese-English spacing

---

## Validation

### Before/After Checklist

**Visual Consistency** (30 items):
- [ ] All cards use 12px border radius
- [ ] All shadows use design tokens
- [ ] All hover effects consistent
- [ ] All buttons follow same style
- [ ] Colors match across pages
- [ ] (25 more items...)

**Typography** (20 items):
- [ ] All h1 use same font size
- [ ] All body text uses 1.6 line height
- [ ] Chinese-English spacing correct
- [ ] (17 more items...)

**Spacing** (15 items):
- [ ] Vertical rhythm follows 8px grid
- [ ] Section padding consistent
- [ ] (13 more items...)

### Browser Testing

- [ ] Chrome 90+ (Windows, Mac)
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Mobile Safari (iOS 14+)
- [ ] Chrome Mobile (Android 10+)

### Responsive Testing

- [ ] 375px (iPhone SE)
- [ ] 768px (iPad)
- [ ] 1024px (iPad Pro)
- [ ] 1440px (Desktop)
- [ ] 1920px (Large Desktop)

---

## Risk Assessment

### Risk 1: Breaking Existing Exhibition Pages
**Probability**: Medium
**Impact**: High
**Mitigation**:
- Test exhibition pages after each change
- Use CSS variables (easy to revert)
- Keep changes scoped to specific classes

### Risk 2: Responsive Design Breakage
**Probability**: Low
**Impact**: Medium
**Mitigation**:
- Test at each breakpoint
- Use clamp() for font sizes
- Verify mobile navigation

### Risk 3: Performance Impact
**Probability**: Very Low
**Impact**: Low
**Mitigation**:
- CSS changes have minimal performance impact
- No new JavaScript added
- Design tokens actually reduce CSS size

---

## Timeline

**Total Estimated Time**: 4 hours

- Layer 1: Design Tokens — 30 minutes
- Layer 2: Component Unification — 2 hours
- Layer 3: Typography & Spacing — 1.5 hours

**Phases**:
1. ✅ Proposal & Design (completed)
2. ⏳ Implementation (this change)
3. ⏸️ Testing (after implementation)
4. ⏸️ Documentation (update CLAUDE.md)

---

## Success Criteria

### Functional Requirements
- ✅ All pages render correctly
- ✅ No visual regressions on exhibition pages
- ✅ Responsive design works at all breakpoints
- ✅ No console errors

### Quality Requirements
- ✅ Visual consistency score: 95%+ (manual checklist)
- ✅ Typography follows type scale: 100%
- ✅ Design tokens used: 90%+ (reduce magic numbers)
- ✅ Lighthouse Accessibility: 95+

### User Acceptance
- ✅ User confirms: "新主页和展览页面看起来像同一个设计师做的"
- ✅ User confirms: "排版更清晰舒适了"
- ✅ User confirms: "没有破坏原有展览页面"

---

## Related Changes

- **Depends On**: `rebuild-interactive-exhibition-platform` (Phase 1-5)
- **Blocks**: Testing & deployment of v4.0 platform
- **Related**: Future exhibition creation will use these design tokens

---

**Document Created**: 2025-11-11
**Author**: Claude (AI Assistant)
**Status**: ✅ Ready for Implementation
