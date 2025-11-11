# Design Document: Visual Design System Enhancement

**Change ID**: `enhance-visual-design-system`
**Created**: 2025-11-11
**Status**: Approved

---

## Design Goals

1. **Unify** visual language across portfolio homepage and exhibition pages
2. **Preserve** existing exhibition page aesthetics (Terracotta-Gold theme)
3. **Systematize** design decisions through tokens and standards
4. **Improve** user experience through better typography and spacing

---

## Architecture Decisions

### AD-1: CSS Variables as Single Source of Truth

**Decision**: Use CSS variables (custom properties) for all design tokens

**Rationale**:
- ✅ Global changes in one place
- ✅ Easy to maintain consistency
- ✅ Runtime theming possible (future)
- ✅ Better than SASS variables (no build step)

**Alternatives Considered**:
- ❌ SASS variables: Requires build step, not runtime-editable
- ❌ Inline styles: No reusability, hard to maintain
- ❌ Utility classes: Adds complexity, learning curve

**Implementation**:
```css
/* Define in :root */
:root {
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Use in components */
.card {
  box-shadow: var(--shadow-md);
}
```

---

### AD-2: 12px Border Radius as Standard

**Decision**: Standardize on 12px border radius for all cards and components

**Rationale**:
- ✅ Exhibition pages already use 12px (dialogue-player.css)
- ✅ More modern and friendly than 8px
- ✅ Aligns with contemporary design trends
- ✅ Matches brand personality (warm, approachable)

**Alternatives Considered**:
- ❌ 8px: Too conservative, already used in v3.0
- ❌ 16px: Too rounded, not suitable for content-heavy cards
- ❌ Mixed radii: Creates visual inconsistency

**Implementation**:
```css
--radius-md: 12px;

.exhibition-card { border-radius: var(--radius-md); }
.dialogue-player { border-radius: var(--radius-md); }
```

---

### AD-3: Three-Tier Shadow System

**Decision**: Define 3 shadow depths (sm/md/lg) instead of arbitrary values

**Rationale**:
- ✅ Provides clear visual hierarchy
- ✅ Enough variety without overwhelming
- ✅ Easy to remember and apply
- ✅ Based on Material Design principles

**Shadow Depths**:
```css
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);   /* Subtle, resting state */
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);  /* Default cards */
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);  /* Hover, elevated */
--shadow-xl: 0 12px 32px rgba(0, 0, 0, 0.15); /* Modal, floating */
```

**Usage Guidelines**:
- `sm`: Subtle elements (badges, tags)
- `md`: Cards, panels (default)
- `lg`: Hover states, dropdowns
- `xl`: Modals, tooltips

---

### AD-4: Modular Scale for Typography

**Decision**: Use modular scale (ratio 1.25) for font sizes instead of arbitrary values

**Rationale**:
- ✅ Creates harmonious visual rhythm
- ✅ Mathematically consistent
- ✅ Easy to scale up/down
- ✅ Industry standard (1.2-1.333 typical)

**Type Scale**:
```
Base: 16px (1rem)
Ratio: 1.25 (Major Third)

6xl: 64px (4rem)     — Hero titles
5xl: 48px (3rem)     — Page titles
4xl: 36px (2.25rem)  — Section titles
3xl: 30px (1.875rem) — Large headings
2xl: 24px (1.5rem)   — Headings
xl:  20px (1.25rem)  — Subheadings
lg:  18px (1.125rem) — Large body
base: 16px (1rem)    — Body text
sm:  14px (0.875rem) — Small text
xs:  12px (0.75rem)  — Captions
```

**Alternatives Considered**:
- ❌ Ratio 1.2 (Minor Third): Steps too small
- ❌ Ratio 1.333 (Perfect Fourth): Steps too large
- ❌ Fixed increments (2px steps): Not harmonious

---

### AD-5: 8px Vertical Rhythm Grid

**Decision**: Base all vertical spacing on multiples of 8px

**Rationale**:
- ✅ Creates predictable rhythm
- ✅ Aligns with most screen densities (divisible by 2/4/8)
- ✅ Easy mental math (8, 16, 24, 32, 40, 48...)
- ✅ Industry standard (iOS, Android, Web)

**Spacing Scale**:
```css
--spacing-xs: 0.5rem;  /* 8px */
--spacing-sm: 1rem;    /* 16px */
--spacing-md: 2rem;    /* 32px */
--spacing-lg: 4rem;    /* 64px */
--spacing-xl: 6rem;    /* 96px */
--spacing-2xl: 8rem;   /* 128px */
```

**Application**:
- Margins, padding, gaps should use these values
- Exception: Fine-tuning adjustments (±4px acceptable)

---

### AD-6: Preserve Existing Exhibition Components

**Decision**: Apply design tokens to new pages only, verify (not rewrite) exhibition pages

**Rationale**:
- ✅ Minimize risk of breaking existing features
- ✅ User requirement: "不要有太大出入"
- ✅ Exhibition pages already have good design
- ✅ Focus effort on new homepage/archive

**Approach**:
1. **Update**: Portfolio homepage, archive page, about page, navigation
2. **Verify**: Exhibition pages still render correctly
3. **Don't Touch**: Dialogue player, thought chain, reference system (unless broken)

**Exception**: If exhibition components use non-token values that can be easily replaced (e.g., `border-radius: 12px` → `var(--radius-md)`), make the change for consistency.

---

### AD-7: Mobile-First Responsive Typography

**Decision**: Use `clamp()` for fluid typography instead of breakpoint-based font sizes

**Rationale**:
- ✅ Smooth scaling across all screen sizes
- ✅ Fewer media queries
- ✅ Better user experience (no sudden jumps)
- ✅ Modern CSS feature (95%+ browser support)

**Pattern**:
```css
/* clamp(min, preferred, max) */
font-size: clamp(1rem, 2.5vw, 1.5rem);

/* Reads as: "Between 16px and 24px, scale with viewport width" */
```

**Usage Guidelines**:
- Headings: Use clamp() for smooth scaling
- Body text: Fixed 16px (1rem) on mobile, clamp() on desktop
- UI elements: Fixed sizes (buttons, badges) for consistency

---

## Component Design Specifications

### Exhibition Card (Homepage/Archive)

**Before**:
```css
.exhibition-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.exhibition-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
```

**After**:
```css
.exhibition-card {
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
}
.exhibition-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}
```

---

### Global Navigation

**Before**:
```css
.global-nav {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.nav-logo {
  font-size: 1.5rem;
}
```

**After**:
```css
.global-nav {
  box-shadow: var(--shadow-sm);
}
.nav-logo {
  font-size: var(--font-size-2xl);
}
```

---

### Typography Hierarchy

**Heading Styles**:
```css
h1 {
  font-size: clamp(var(--font-size-3xl), 5vw, var(--font-size-6xl));
  line-height: var(--leading-tight);
  font-weight: 700;
}

h2 {
  font-size: clamp(var(--font-size-2xl), 4vw, var(--font-size-4xl));
  line-height: var(--leading-tight);
  font-weight: 600;
}

h3 {
  font-size: clamp(var(--font-size-xl), 3vw, var(--font-size-2xl));
  line-height: var(--leading-snug);
  font-weight: 600;
}

/* Body text */
p {
  font-size: var(--font-size-base);
  line-height: var(--leading-normal);
}

/* Small text */
.caption {
  font-size: var(--font-size-sm);
  line-height: var(--leading-snug);
}
```

---

## Implementation Notes

### File Changes Required

1. **styles/portfolio-homepage.css** (Major)
   - Replace magic numbers with CSS variables
   - Update shadow values
   - Update border radius
   - Apply type scale to headings

2. **shared/styles/global-navigation.css** (Minor)
   - Replace shadow values
   - Apply type scale to nav items

3. **pages/exhibitions-archive.html** (Inline styles)
   - Update shadow values in `<style>` block

4. **Create: styles/design-tokens.css** (New)
   - Central CSS variables file
   - Import in all pages

### Testing Strategy

**Visual Regression Testing**:
1. Take screenshots of all pages BEFORE changes
2. Apply design tokens
3. Take screenshots AFTER changes
4. Compare side-by-side

**Functional Testing**:
1. Navigate through all pages
2. Test hover/active states
3. Test responsive breakpoints (375px, 768px, 1024px, 1440px)
4. Test language toggle

**Cross-Browser Testing**:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS 14+)

---

## Design Principles

### Principle 1: Consistency Over Novelty
"Use design tokens even if the visual difference is subtle. Consistency builds trust."

### Principle 2: Preserve What Works
"Don't fix what isn't broken. Exhibition pages already have good design."

### Principle 3: Progressive Enhancement
"Start with solid foundations (tokens), then enhance (animations, interactions)."

### Principle 4: Measure Twice, Cut Once
"Test each change before committing. Visual regressions are hard to revert."

---

## Success Metrics

### Quantitative
- Design token usage: 90%+ (reduce magic numbers)
- CSS file size: <5% increase
- Lighthouse Accessibility: 95+
- No console errors

### Qualitative
- Visual consistency: "Looks like same designer"
- Typography: "More readable and clear"
- Spacing: "Comfortable breathing room"
- Brand: "Professional and polished"

---

**Document Version**: 1.0
**Last Updated**: 2025-11-11
**Status**: ✅ Approved for Implementation
