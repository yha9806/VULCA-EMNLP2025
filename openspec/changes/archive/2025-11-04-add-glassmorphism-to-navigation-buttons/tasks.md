# Tasks: Add Glassmorphism to Navigation Buttons

**Change ID**: `add-glassmorphism-to-navigation-buttons`
**Total Estimated Time**: 1.5 hours

---

## Phase 1: Core Glassmorphism Implementation (30 minutes)

### Task 1.1: Update Button Base Styles
**Estimated Time**: 10 minutes
**Files**: `styles/components/unified-navigation.css` (lines 39-54)

**Changes**:
1. Change `.artwork-nav-button` background from `rgba(255, 255, 255, 0.9)` to `rgba(255, 255, 255, 0.7)`
2. Add `backdrop-filter: blur(10px)`
3. Add `-webkit-backdrop-filter: blur(10px)` for Safari support
4. Add `will-change: backdrop-filter` for performance optimization

**Success Criteria**:
- [ ] Background opacity is 0.7
- [ ] Blur effect visible in browser
- [ ] No console errors

**Validation**:
```bash
# Visual test in browser
python -m http.server 9999
# Navigate to http://localhost:9999 and inspect button background
```

---

### Task 1.2: Add Browser Fallback Support
**Estimated Time**: 5 minutes
**Files**: `styles/components/unified-navigation.css` (after `.artwork-nav-button` block)

**Changes**:
1. Add `@supports not (backdrop-filter: blur())` fallback
2. Set fallback background to `rgba(255, 255, 255, 0.85)` (more opaque)

**Success Criteria**:
- [ ] Fallback CSS exists
- [ ] Can verify fallback in older browsers (or simulate with DevTools)

**Code**:
```css
@supports not (backdrop-filter: blur()) {
  .artwork-nav-button {
    background: rgba(255, 255, 255, 0.85);
  }
}
```

---

### Task 1.3: Update Button Border Opacity
**Estimated Time**: 3 minutes
**Files**: `styles/components/unified-navigation.css` (line 49)

**Changes**:
1. Change border from `2px solid var(--color-text)` to `2px solid rgba(45, 45, 45, 0.4)`

**Success Criteria**:
- [ ] Border is semi-transparent (40% opacity)
- [ ] Border remains visible on all artwork backgrounds

---

### Task 1.4: Reduce Button Padding (Desktop)
**Estimated Time**: 5 minutes
**Files**: `styles/components/unified-navigation.css` (line 43-44)

**Changes**:
1. Change padding from `12px 24px` to `8px 18px`
2. Change font-size from `1rem` to `0.9rem`

**Success Criteria**:
- [ ] Buttons are visibly smaller than before
- [ ] Text remains legible
- [ ] Icons (16px) remain unchanged

---

### Task 1.5: Update Hover State Glassmorphism
**Estimated Time**: 7 minutes
**Files**: `styles/components/unified-navigation.css` (lines 56-61)

**Changes**:
1. Change hover background from `var(--color-text)` to `rgba(0, 0, 0, 0.85)`
2. Add `backdrop-filter: blur(12px)` to hover state
3. Add `-webkit-backdrop-filter: blur(12px)`

**Success Criteria**:
- [ ] Hover shows dark glassmorphism effect
- [ ] Text inverts to white
- [ ] Blur increases on hover

---

## Phase 2: Indicator Glassmorphism (10 minutes)

### Task 2.1: Add Indicator Background and Blur
**Estimated Time**: 7 minutes
**Files**: `styles/components/unified-navigation.css` (lines 92-102)

**Changes**:
1. Add `background: rgba(255, 255, 255, 0.6)` to `.artwork-indicator`
2. Add `backdrop-filter: blur(8px)`
3. Add `-webkit-backdrop-filter: blur(8px)`
4. Add `padding: 6px 12px`
5. Add `border-radius: 4px`

**Success Criteria**:
- [ ] Indicator has glassmorphism effect
- [ ] Indicator is more transparent than buttons (0.6 vs 0.7)
- [ ] Indicator has less blur than buttons (8px vs 10px)

---

### Task 2.2: Add Fallback for Indicator
**Estimated Time**: 3 minutes
**Files**: `styles/components/unified-navigation.css` (after indicator styles)

**Changes**:
1. Add `@supports not (backdrop-filter: blur())` fallback for indicator
2. Set fallback background to `rgba(255, 255, 255, 0.75)`

---

## Phase 3: Responsive Sizing Adjustments (10 minutes)

### Task 3.1: Update Tablet Breakpoint (768-1023px)
**Estimated Time**: 5 minutes
**Files**: `styles/components/unified-navigation.css` (lines 130-150)

**Changes**:
1. Update tablet `.artwork-nav-button` padding from `10px 20px` to `6px 14px`
2. Update font-size from `0.9rem` to `0.85rem`

**Success Criteria**:
- [ ] Tablet buttons are smaller than current
- [ ] Touch targets remain adequate (~40px)

---

### Task 3.2: Update Mobile Breakpoint (<768px)
**Estimated Time**: 5 minutes
**Files**: `styles/components/unified-navigation.css` (lines 152-181)

**Changes**:
1. Update mobile `.artwork-nav-button` padding from `8px 16px` to `6px 12px`
2. Update font-size from `0.85rem` to `0.8rem`
3. **Critical**: Verify touch target height ≥44px

**Success Criteria**:
- [ ] Mobile buttons are smaller
- [ ] Touch targets ≥44px (WCAG 2.1 AA requirement)
- [ ] If fails, increase padding to `8px 12px`

**Validation**:
```javascript
// In browser console (375px viewport)
const button = document.querySelector('.artwork-nav-button');
const height = button.getBoundingClientRect().height;
console.log(`Button height: ${height}px (must be ≥44px)`);
```

---

## Phase 4: Version Bump and Cache Busting (2 minutes)

### Task 4.1: Update CSS Version in index.html
**Estimated Time**: 2 minutes
**Files**: `index.html`

**Changes**:
1. Find `<link rel="stylesheet" href="/styles/main.css?v=X">`
2. Increment version number (e.g., `v=10` → `v=11`)

**Success Criteria**:
- [ ] Version parameter incremented
- [ ] Browser fetches new CSS (no cache)

---

## Phase 5: Visual Regression Testing (15 minutes)

### Task 5.1: Desktop Visual Testing
**Estimated Time**: 5 minutes
**Browser**: Chrome 1440px width

**Test Cases**:
1. Navigate to http://localhost:9999
2. Verify button opacity is 0.7 (semi-transparent)
3. Verify blur effect visible (frosted glass)
4. Verify buttons are smaller than before
5. Test hover state (dark glassmorphism)
6. Test all 4 artworks (verify glassmorphism on each background)

**Success Criteria**:
- [ ] All visual changes correct
- [ ] No visual artifacts
- [ ] Hover/active states work

---

### Task 5.2: Tablet Visual Testing
**Estimated Time**: 5 minutes
**Browser**: Chrome 768px width

**Test Cases**:
1. Resize browser to 768px
2. Verify responsive padding applied (6px 14px)
3. Verify buttons still legible and clickable
4. Test navigation functionality

**Success Criteria**:
- [ ] Tablet sizing correct
- [ ] All interactions work

---

### Task 5.3: Mobile Visual Testing
**Estimated Time**: 5 minutes
**Browser**: Chrome 375px width

**Test Cases**:
1. Resize browser to 375px
2. Verify mobile padding applied (6px 12px)
3. **Critical**: Measure button height ≥44px
4. Test touch interaction (click buttons)
5. Verify glassmorphism visible on small screen

**Success Criteria**:
- [ ] Mobile sizing correct
- [ ] Touch targets ≥44px
- [ ] All interactions work

---

## Phase 6: Accessibility Validation (15 minutes)

### Task 6.1: Contrast Ratio Testing
**Estimated Time**: 10 minutes
**Tool**: Chrome DevTools Accessibility panel

**Test Cases**:
1. Navigate to artwork-1, inspect button text contrast
2. Navigate to artwork-2 (light tones - critical), inspect contrast
3. Navigate to artwork-3, inspect contrast
4. Navigate to artwork-4, inspect contrast
5. Verify all artworks have ≥4.5:1 contrast ratio

**Success Criteria**:
- [ ] Contrast ≥4.5:1 on artwork-1
- [ ] Contrast ≥4.5:1 on artwork-2 (light background - most critical)
- [ ] Contrast ≥4.5:1 on artwork-3
- [ ] Contrast ≥4.5:1 on artwork-4

**If Fails**:
- Increase button opacity to 0.75
- Or add subtle `text-shadow: 0 1px 2px rgba(0,0,0,0.1)`

---

### Task 6.2: Touch Target Validation
**Estimated Time**: 5 minutes
**Tool**: Browser DevTools + manual measurement

**Test Cases**:
1. Simulate mobile viewport (375px)
2. Measure button height in pixels
3. Verify ≥44px for WCAG 2.1 AA compliance

**Success Criteria**:
- [ ] Desktop: No requirement (mouse interaction)
- [ ] Tablet: ≥40px (acceptable with visual cues)
- [ ] Mobile: ≥44px (strict requirement)

**If Fails**:
- Increase mobile padding to `8px 12px`

---

## Phase 7: Browser Compatibility Testing (10 minutes)

### Task 7.1: Chrome/Edge Testing
**Estimated Time**: 3 minutes
**Browser**: Chrome 120+ or Edge 120+

**Test Cases**:
1. Verify backdrop-filter blur visible
2. Verify no visual glitches
3. Test hover/active states

**Success Criteria**:
- [ ] Glassmorphism works correctly
- [ ] No console errors

---

### Task 7.2: Firefox Testing
**Estimated Time**: 3 minutes
**Browser**: Firefox 120+

**Test Cases**:
1. Verify backdrop-filter blur visible
2. Verify no visual glitches
3. Test hover/active states

**Success Criteria**:
- [ ] Glassmorphism works correctly
- [ ] No console errors

---

### Task 7.3: Safari Testing
**Estimated Time**: 4 minutes
**Browser**: Safari 17+ (Mac only)

**Test Cases**:
1. Verify `-webkit-backdrop-filter` works
2. Verify no visual glitches
3. Test hover/active states

**Success Criteria**:
- [ ] Glassmorphism works correctly
- [ ] No console errors

---

## Phase 8: Performance Validation (8 minutes)

### Task 8.1: Chrome DevTools Performance Testing
**Estimated Time**: 8 minutes
**Tool**: Chrome DevTools Performance panel

**Test Cases**:
1. Open DevTools → Performance tab
2. Start recording
3. Hover over buttons (trigger blur transitions)
4. Click through all 4 artworks
5. Stop recording
6. Analyze frame time and composite layers

**Success Criteria**:
- [ ] Frame time remains <16ms (60fps)
- [ ] No "Forced reflow" warnings
- [ ] Composite layers <20
- [ ] No layout thrashing

**Acceptable Performance**:
- Frame time: 12-15ms (acceptable)
- Blur rendering overhead: <5ms per frame

---

## Phase 9: Git Commit and Deployment (5 minutes)

### Task 9.1: Stage and Commit Changes
**Estimated Time**: 3 minutes

**Commands**:
```bash
cd "I:\VULCA-EMNLP2025"
git add styles/components/unified-navigation.css index.html
git commit -m "feat: Add glassmorphism to navigation buttons

OpenSpec change: add-glassmorphism-to-navigation-buttons

Applied glassmorphism design pattern to artwork navigation buttons:
- Increased transparency: 0.9 → 0.7 opacity
- Added backdrop blur: 10px blur effect (12px on hover)
- Reduced button sizing: ~25-30% smaller across all breakpoints
- Added glassmorphism to indicator: 0.6 opacity, 8px blur
- Semi-transparent borders: rgba(45, 45, 45, 0.4)

Validated WCAG 2.1 AA contrast ratios across all artwork backgrounds.
Tested on Chrome, Firefox, Safari, Edge. Includes graceful degradation
for unsupported browsers via @supports fallback.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**Success Criteria**:
- [ ] Changes committed to git
- [ ] Commit message follows convention

---

### Task 9.2: Push to Remote and Deploy
**Estimated Time**: 2 minutes

**Commands**:
```bash
git push origin master
```

**Success Criteria**:
- [ ] Changes pushed to GitHub
- [ ] GitHub Pages auto-deployment triggered
- [ ] Live site updates within 1-2 minutes

---

## Task Dependencies

```
Phase 1 (Core) → Phase 2 (Indicator) → Phase 3 (Responsive)
                                                ↓
Phase 4 (Version Bump) → Phase 5 (Visual Testing) → Phase 6 (Accessibility)
                                                ↓
                        Phase 7 (Browser Testing) → Phase 8 (Performance)
                                                ↓
                                        Phase 9 (Deployment)
```

**Parallelizable Tasks**:
- Phase 7 (Browser Testing) can run in parallel on different machines
- Phase 6.1 (Contrast) and 6.2 (Touch Targets) can run in parallel

---

## Rollback Plan

**If Critical Issues Found**:
1. Revert commit: `git revert HEAD`
2. Push revert: `git push origin master`
3. Document issue in rollback notes
4. Re-plan fix with adjusted parameters

**Common Issues and Fixes**:
- **Contrast fails on artwork-2**: Increase opacity to 0.75
- **Touch targets too small**: Increase mobile padding to 8px 12px
- **Performance issues**: Reduce blur to 8px or remove blur on low-end devices

---

## Definition of Done

- [ ] All 9 phases completed
- [ ] All success criteria met
- [ ] No accessibility violations
- [ ] No performance regressions
- [ ] Changes committed and deployed
- [ ] Visual regression screenshots taken
- [ ] Documentation updated (if needed)
