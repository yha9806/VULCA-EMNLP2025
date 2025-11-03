# Design: Add EMNLP 2025 Paper Citation and Update Contact Email

## Architecture Decisions

### Decision 1: Paper Citation Placement Strategy

**Options Considered**:

- **Option A**: Add paper citation to all pages (header/navbar)
  - ✅ Maximum visibility
  - ❌ Clutters every page, distracts from art content
  - ❌ Requires navbar redesign

- **Option B**: Add to about page only
  - ✅ Contextually appropriate (research information page)
  - ❌ Low visibility for casual visitors
  - ❌ Visitors may not discover the paper

- **Option C**: Add to about page (full citation) + homepage footer (link)
  - ✅ Detailed citation where appropriate (about page)
  - ✅ Discoverable link for all visitors (homepage footer)
  - ✅ No clutter on art-focused pages
  - ❌ Slightly more implementation work

**Decision**: **Option C** - About page full citation + homepage footer link

**Reasoning**:
1. **About page** is the natural place for academic context - visitors seeking research details will find full bibliographic information here
2. **Homepage footer** link provides visibility without interfering with the immersive art gallery experience
3. Critics and process pages remain focused on their specific content
4. Balances discoverability with non-intrusive design

---

### Decision 2: BibTeX Citation Display Format

**Options Considered**:

- **Option A**: Display full BibTeX in plain text always visible
  - ✅ No interaction required
  - ❌ Very long, clutters page
  - ❌ Most users don't need BibTeX

- **Option B**: "Copy BibTeX" button that copies to clipboard
  - ✅ Clean interface
  - ❌ Requires JavaScript clipboard API
  - ❌ Users can't see citation before copying

- **Option C**: Collapsible `<details>` element with summary
  - ✅ Clean collapsed state
  - ✅ Full citation visible when expanded
  - ✅ Native HTML, no JavaScript required
  - ✅ Accessible (keyboard navigable)

**Decision**: **Option C** - Collapsible `<details>` with "BibTeX 引用" summary

**Reasoning**:
1. HTML `<details>`/`<summary>` is semantically correct and accessible
2. Users who need BibTeX can expand; others see clean interface
3. No JavaScript dependency (pure HTML/CSS)
4. Mobile-friendly (touch to expand)
5. Screen reader compatible

**Implementation**:
```html
<details class="paper-bibtex">
  <summary><span lang="zh">BibTeX 引用</span><span lang="en">BibTeX Citation</span></summary>
  <pre><code>@inproceedings{...}</code></pre>
</details>
```

---

### Decision 3: Paper Link Style on Homepage

**Options Considered**:

- **Option A**: DOI badge (image/SVG)
  - ✅ Professional look
  - ❌ External dependency (DOI service)
  - ❌ User didn't request this style

- **Option B**: Plain text link in footer
  - ✅ Simple, consistent with existing footer
  - ❌ Low visual prominence
  - ❌ May be overlooked

- **Option C**: Text link with emoji icon (📄) + conference name
  - ✅ Visible without being intrusive
  - ✅ Emoji provides visual anchor
  - ✅ "EMNLP 2025 Findings" is recognizable to academics
  - ✅ Consistent with site's clean design

**Decision**: **Option C** - Emoji icon + conference name link

**Reasoning**:
1. Emoji (📄) provides visual interest without external assets
2. "EMNLP 2025 Findings" is concise and informative
3. Maintains footer's text-based aesthetic
4. No additional CSS/images required
5. User explicitly requested "simple link" rather than badge

**Implementation**:
```html
<p class="paper-link">
  <span lang="zh">📄 研究论文：</span><span lang="en">📄 Research Paper: </span>
  <a href="https://aclanthology.org/2025.findings-emnlp.103/" target="_blank" rel="noopener">
    EMNLP 2025 Findings
  </a>
</p>
```

---

### Decision 4: Email Replacement Strategy

**Options Considered**:

- **Option A**: Keep old email as alias forwarding to new email
  - ❌ User stated old email is "无效的" (invalid/non-functional)
  - ❌ No forwarding infrastructure exists

- **Option B**: Replace in HTML files only, keep in documentation as legacy
  - ❌ Inconsistent, confusing
  - ❌ Users may still try to use old email

- **Option C**: Global replacement across all files (HTML + Markdown)
  - ✅ Consistent site-wide
  - ✅ Eliminates confusion
  - ✅ All contact points show valid email
  - ❌ More files to update

**Decision**: **Option C** - Global replacement in all HTML and Markdown files

**Reasoning**:
1. User explicitly stated old email is invalid (must be removed entirely)
2. Inconsistent contact information damages credibility
3. Global search-and-replace is straightforward
4. Future-proof: no one will accidentally reference old email

**Files to Update**:
- HTML: `index.html`, `pages/*.html` (4 files)
- Markdown: `README.md`, `CLAUDE.md`, `SPEC.md`, `docs/*.md` (5+ files)
- Excluded: `backups/`, `openspec/changes/archive/` (historical records)

**Implementation**:
```bash
# HTML files
find pages/ -name "*.html" -exec sed -i 's/info@vulcaart\.art/yuhaorui48@gmail.com/g' {} +
sed -i 's/info@vulcaart\.art/yuhaorui48@gmail.com/g' index.html

# Markdown files
find . -maxdepth 1 -name "*.md" -exec sed -i 's/info@vulcaart\.art/yuhaorui48@gmail.com/g' {} +
find docs/ -name "*.md" -exec sed -i 's/info@vulcaart\.art/yuhaorui48@gmail.com/g' {} +
```

---

### Decision 5: CSS Styling Approach for Paper Citation

**Options Considered**:

- **Option A**: Minimal styling (just text)
  - ❌ Doesn't visually distinguish paper citation from body text
  - ❌ Low visual hierarchy

- **Option B**: Card-based styling with shadow and rounded corners
  - ❌ Too prominent, doesn't match site aesthetic
  - ❌ Overdesigned for simple citation

- **Option C**: Subtle highlighted box with left border accent
  - ✅ Matches existing `.content-section` style
  - ✅ Light background provides visual separation
  - ✅ Colored left border adds emphasis without distraction
  - ✅ Consistent with site's minimalist design

**Decision**: **Option C** - Light background + colored left border

**Reasoning**:
1. Site uses minimalist design with subtle highlights
2. Light gray background (#f9f9f9) separates citation from body text
3. Blue left border (4px, primary color) adds visual anchor
4. Padding (1.5rem) creates comfortable reading space
5. Consistent with existing design patterns

**CSS Structure**:
```css
.paper-citation {
  background: #f9f9f9;              /* Subtle highlight */
  border-left: 4px solid var(--color-primary);  /* Visual anchor */
  padding: 1.5rem;                  /* Breathing room */
  border-radius: 4px;               /* Soft corners */
}
```

**Text Hierarchy**:
- Title: 1.1rem, bold, primary color, underline on hover
- Authors: 0.95rem, gray (#555)
- Venue: 0.9rem, lighter gray (#666), italic
- BibTeX code: 0.85rem, monospace, horizontal scroll

---

## Data Flow

```
User visits about page
         ↓
Browser loads about.html
         ↓
"相关论文" section renders
         ↓
Paper title link → ACL Anthology (new tab)
BibTeX summary → Click → Expand code block
         ↓
CSS applies:
  - Light background to .paper-citation
  - Blue left border
  - Monospace font to BibTeX code
         ↓
Bilingual support:
  - [data-lang="zh"] shows Chinese labels
  - [data-lang="en"] shows English labels
         ↓
User clicks paper link → Opens ACL Anthology in new tab
```

---

## Bilingual Support Strategy

**Existing Pattern**: Site uses `<span lang="zh">` and `<span lang="en">` with CSS-based switching

**Application to Paper Citation**:

```html
<!-- Section heading -->
<h2>
  <span lang="zh">相关论文</span>
  <span lang="en">Related Publication</span>
</h2>

<!-- BibTeX summary -->
<summary>
  <span lang="zh">BibTeX 引用</span>
  <span lang="en">BibTeX Citation</span>
</summary>

<!-- Homepage footer link -->
<span lang="zh">📄 研究论文：</span>
<span lang="en">📄 Research Paper: </span>
```

**CSS (already exists in main.css)**:
```css
[data-lang="zh"] [lang="en"] { display: none; }
[data-lang="en"] [lang="zh"] { display: none; }
```

**Result**: Language toggle button switches all labels automatically, including new paper citation content.

---

## Accessibility Considerations

1. **Link Opening Behavior**:
   - `target="_blank"` for external links (ACL Anthology)
   - `rel="noopener"` prevents security issues
   - User can still open in same tab via right-click if preferred

2. **BibTeX Collapsible**:
   - `<details>`/`<summary>` are keyboard navigable (Enter/Space to toggle)
   - Screen readers announce "expandable group"
   - No JavaScript required (native HTML behavior)

3. **Email Links**:
   - `href="mailto:yuhaorui48@gmail.com"` opens default email client
   - Users without email client configured can still copy address

4. **Code Block Readability**:
   - Monospace font ('Courier New') for BibTeX
   - Horizontal scroll for long lines (better than wrapping)
   - Gray background (#f0f0f0) improves contrast

---

## Performance Impact

**Expected**: Negligible

- Content size increase: ~1KB (BibTeX text)
- CSS size increase: ~500 bytes (paper citation styles)
- No JavaScript required
- No external dependencies (no images, no fonts)
- No network requests (except when user clicks ACL Anthology link)

**Measurement**: Use Chrome DevTools Performance tab. Expected difference: <1ms page load time.

---

## Testing Strategy

### Unit Testing
- Verify paper citation HTML renders correctly
- Test BibTeX details expand/collapse
- Verify ACL Anthology link opens in new tab
- Test bilingual label switching

### Visual Regression Testing
- Compare before/after screenshots of about page
- Verify homepage footer layout with paper link
- Check responsive behavior at 375px, 768px, 1440px

### Email Validation
- Grep all files for old email (should return no matches in active files)
- Verify new email appears in all 4 HTML pages
- Test mailto: links open email client

### Cross-Browser Testing
- Chrome/Edge 90+: Primary target
- Firefox 88+: BibTeX code block rendering
- Safari 14+: Details element behavior

---

## Risk Mitigation

### Risk 1: BibTeX Code Too Wide (Horizontal Overflow)

- **Mitigation**: Apply `overflow-x: auto` to `<pre>` element
- **Validation**: Test with 1920px wide screen, verify no page-wide scrollbar

### Risk 2: Email Replacement Breaks Mailto: Links

- **Mitigation**: Use exact string replacement, preserve `mailto:` prefix
- **Validation**: Click all email links after replacement, verify email client opens

### Risk 3: Bilingual Labels Don't Switch

- **Mitigation**: Use existing `lang="zh"` and `lang="en"` pattern
- **Validation**: Toggle language button, verify all labels update

### Risk 4: Paper Citation Breaks Mobile Layout

- **Mitigation**: Test responsive behavior at 375px width
- **Validation**: Verify padding/border don't cause horizontal scroll

---

## Future Enhancements

### Phase 2 (Not in this change):
- Add "Copy Citation" button with clipboard API
- Add Google Scholar citation count badge
- Add DOI badge alongside text link
- Add "Related Publications" section if more papers published

### Phase 3 (Not in this change):
- Automatically fetch citation count from Google Scholar
- Add Altmetric donut for social media impact
- Add "Cite this work" page with multiple citation formats (APA, MLA, Chicago)

---

**Design Status**: Complete
**Reviewed**: 2025-11-03
**Dependencies**: None - standalone content and styling update
