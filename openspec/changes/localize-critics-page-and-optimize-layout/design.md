# Design: Localize Critics Page and Optimize Card Layout

## Architecture Decisions

### Decision 1: Bilingual Data Structure (`bioZh` + `bio`)

**Options Considered**:

- **Option A**: Replace `bio` field entirely with Chinese text
  - ✅ Simpler data structure
  - ❌ Breaks English language support
  - ❌ No fallback for incomplete localization

- **Option B**: Add `bioZh` field alongside existing `bio` field
  - ✅ Preserves backward compatibility
  - ✅ Enables gradual migration
  - ✅ Automatic fallback to English if Chinese missing
  - ❌ Slightly larger data structure

- **Option C**: Use language toggle to switch between English/Chinese
  - ✅ User choice
  - ❌ Requires complex state management
  - ❌ Not aligned with project's Chinese-first approach

**Decision**: **Option B** - Add `bioZh` field

**Reasoning**:
1. VULCA is a research project with international audience - preserving English content maintains accessibility
2. Fallback mechanism (`bioZh || bio`) ensures no broken UI during gradual localization
3. Minimal code changes required in `critics-page.js` (single line modification)
4. Aligns with existing bilingual pattern (`nameZh` + `nameEn`, `titleZh` + `titleEn`)

---

### Decision 2: English Name De-emphasis Strategy

**Options Considered**:

- **Option A**: Remove English names entirely
  - ✅ Cleaner visual hierarchy
  - ❌ Loses academic reference value (e.g., "John Ruskin" needed for citation)
  - ❌ International readers cannot identify critics

- **Option B**: Change element type (`<h3>` → `<p>`) + CSS de-emphasis
  - ✅ Preserves information
  - ✅ Clear visual hierarchy (Chinese primary, English secondary)
  - ✅ Minimal DOM changes

- **Option C**: Move English names to tooltip/modal
  - ❌ Hides useful information
  - ❌ Requires additional interaction

**Decision**: **Option B** - Element type change + CSS styling

**Reasoning**:
1. Semantic HTML: English name is supplementary information, not a heading → `<p>` is semantically correct
2. CSS approach (smaller font, italic, gray color) visually de-emphasizes without hiding
3. Screen readers still access English names for bilingual users
4. Single line change in JavaScript + 5 lines of CSS

**Implementation**:
```css
.critic-name-en {
  font-size: 0.9rem;     /* 10% smaller than body text */
  color: #666;           /* Gray, not black */
  font-style: italic;    /* Visual distinction */
  margin-top: 0.25rem;   /* Tight spacing to Chinese name */
  font-weight: 400;      /* Normal weight, not bold */
}
```

---

### Decision 3: Fictional Persona Disclaimer Placement

**Options Considered**:

- **Option A**: Add disclaimer to HTML page (static text)
  - ❌ Separates disclaimer from biography
  - ❌ Requires users to read separate section

- **Option B**: Inline disclaimer at end of each fictional biography
  - ✅ Immediate context
  - ✅ Clear attribution
  - ✅ No additional UI changes needed

- **Option C**: Visual badge/label on card
  - ❌ Clutters card design
  - ❌ Requires CSS/JS changes

**Decision**: **Option B** - Inline disclaimer in biography text

**Reasoning**:
1. Academic integrity: Disclaimer immediately follows content it qualifies
2. Zero UI changes: Uses existing biography rendering system
3. Markdown formatting (`*注：...*`) creates subtle italic styling
4. Pattern: "*Note: This is an AI-created fictional persona representing [tradition].*"

**Example**:
```javascript
bioZh: "西非口述传统和社区智慧的守护者...\n\n*注：此为AI创建的虚构角色，代表西非griot口述传统和集体诠释范式。*"
```

---

### Decision 4: Layout Optimization Approach

**Options Considered**:

- **Option A**: Complete card redesign (flex layout, grid changes)
  - ❌ High risk of breaking existing responsive behavior
  - ❌ Requires extensive testing

- **Option B**: Incremental CSS adjustments (spacing, line-height)
  - ✅ Low risk
  - ✅ Improves readability without structural changes
  - ✅ Easy to revert if issues arise

**Decision**: **Option B** - CSS spacing/readability improvements

**Reasoning**:
1. Current card structure works well, only needs polish
2. Three targeted improvements:
   - Biography line-height: 1.7 (from default 1.5) for better Chinese text readability
   - Biography margin-bottom: 1.5rem for clear separation from RPAIT grid
   - RPAIT bar spacing: 0.75rem between bars for visual breathing room
3. No layout shifts, only enhanced whitespace

**Impact**: Improved reading experience without breaking existing layout system.

---

### Decision 5: Biography Content Strategy

**Options Considered**:

- **Option A**: Machine translation of existing English biographies
  - ❌ Low quality for academic content
  - ❌ Loses cultural nuance

- **Option B**: Manual writing based on web research + project content
  - ✅ High quality, contextually accurate
  - ✅ Tailored to VULCA's academic focus
  - ✅ Incorporates project-specific framing

- **Option C**: User-provided biographies
  - ❌ Delays implementation
  - ❌ User may not have time/expertise

**Decision**: **Option B** - AI-assisted writing with human oversight

**Reasoning**:
1. Web research on real critics (苏轼, 郭熙, Ruskin, Crawford) ensures historical accuracy
2. Chinese biographies written in style matching VULCA's scholarly tone
3. Fictional personas (Mama Zola, Professor Petrova) written to match their theoretical traditions
4. Each biography ~300 characters (optimal for card layout)

**Quality Control**:
- Real critics: Cross-referenced with historical sources (林泉高致, Modern Painters, Atlas of AI)
- Fictional personas: Aligned with traditions they represent (griot oral tradition, Russian Formalism)
- All biographies reviewed for tone consistency with VULCA project

---

## Data Flow

```
User visits critics.html
         ↓
critics-page.js loads
         ↓
Reads VULCA_DATA.personas (from data.js)
         ↓
For each persona:
  1. Create card container
  2. Render Chinese name (<h2>)
  3. Render English name (<p>) ← Changed from <h3>
  4. Render biography: bioZh || bio ← New fallback logic
  5. Render RPAIT dimensions (5 bars)
         ↓
Apply CSS styling
  - .critic-name-en: small, italic, gray
  - .critic-bio: improved line-height
  - .rpait-grid: proper spacing
         ↓
User sees Chinese biographies with de-emphasized English names
```

---

## Testing Strategy

### Unit Testing
- Verify `bioZh || bio` fallback logic works correctly
- Test with personas that have only `bio` (should display English)
- Test with personas that have both (should prefer Chinese)

### Visual Regression Testing
- Compare card layouts before/after at 3 breakpoints (375px, 768px, 1440px)
- Verify RPAIT bars maintain alignment
- Check Chinese text wrapping behavior

### Content Validation
- Verify all 6 biographies display correctly
- Confirm fictional disclaimers appear (italic formatting)
- Check no broken characters (UTF-8 encoding)

### Cross-Browser Testing
- Chrome/Edge 90+: Primary target
- Firefox 88+: Unicode rendering validation
- Safari 14+: Font rendering validation

---

## Risk Mitigation

### Risk 1: Chinese Text Encoding Issues
- **Mitigation**: Ensure all files saved as UTF-8 without BOM
- **Validation**: Check `data.js` in text editor for proper encoding before commit

### Risk 2: Biography Text Too Long for Cards
- **Mitigation**: All biographies limited to ~300 characters
- **Validation**: Visual inspection at 375px width (mobile)

### Risk 3: CSS Changes Break Existing Layout
- **Mitigation**: Only add new `.critic-name-en` rule, modify existing rules minimally
- **Validation**: Side-by-side comparison with production site

### Risk 4: Fallback Logic Fails
- **Mitigation**: Test with mixed personas (some with `bioZh`, some without)
- **Validation**: Console.log each rendered biography to verify fallback

---

## Performance Impact

**Expected**: Negligible

- Data size increase: ~2KB (6 biographies × ~300 characters)
- Rendering time: No change (same DOM structure)
- Network: Static files, no additional requests
- Memory: Minimal increase (text content only)

**Measurement**: Use Chrome DevTools Performance tab to compare before/after page load times. Expected difference: <5ms.

---

## Accessibility Considerations

1. **Screen Reader Compatibility**:
   - Chinese biographies are plain text (fully accessible)
   - Fictional disclaimers use italic markdown (screen readers read as normal text)
   - English names remain accessible as `<p>` elements

2. **Language Attributes**:
   - Page already has `lang="zh-CN"` on `<html>` element
   - No need for individual `lang` attributes on biographies (all Chinese)

3. **Keyboard Navigation**:
   - No interactive elements added, no keyboard nav changes

4. **Color Contrast**:
   - English name gray color `#666` on white background: 5.74:1 ratio (WCAG AA compliant)

---

## Future Enhancements

### Phase 2 (Not in this change):
- Add language toggle to switch between `bioZh` and `bio`
- Translate RPAIT dimension labels to Chinese
- Add "fictional persona" visual badges

### Phase 3 (Not in this change):
- Editorial review of Chinese biographies by art history expert
- Add citations/references for real critics
- Expand biographies with "Read More" accordion

---

**Design Status**: Complete
**Reviewed**: 2025-11-03
**Dependencies**: None - standalone styling and content changes
