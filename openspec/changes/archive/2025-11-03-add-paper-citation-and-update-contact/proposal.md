# Proposal: Add EMNLP 2025 Paper Citation and Update Contact Email

## Why

### Problem Statement

The VULCA exhibition website currently lacks two critical pieces of information:

1. **Missing Academic Citation**: The website does not reference the EMNLP 2025 paper that presents the research methodology and findings behind the VULCA system. This makes it difficult for:
   - Academic visitors to cite the work properly
   - Researchers to find the original publication
   - Users to understand the theoretical foundation of the system

2. **Invalid Contact Email**: All pages display `info@vulcaart.art` as the contact email, but this email is non-functional. Users attempting to contact the research team receive bounced emails.

**Current State**:
- `info@vulcaart.art` appears in 12 files across the codebase
- No academic paper citation visible on any page
- Users have no valid way to contact the research team

**Impact**:
- Academic credibility diminished without proper citation
- Lost communication opportunities (users cannot reach the team)
- Missed collaboration and feedback opportunities

---

## What Changes

Add EMNLP 2025 paper citation and replace contact email site-wide.

### 1. Add Paper Citation Section to About Page

**Location**: `pages/about.html` after "研究意义" section (line ~137)

**New Section**:
```html
<section class="content-section">
  <h2><span lang="zh">相关论文</span><span lang="en">Related Publication</span></h2>
  <div class="paper-citation">
    <h3 class="paper-title">
      <a href="https://aclanthology.org/2025.findings-emnlp.103/" target="_blank" rel="noopener">
        A Structured Framework for Evaluating and Enhancing Interpretive Capabilities of Multimodal LLMs in Culturally Situated Tasks
      </a>
    </h3>
    <p class="paper-authors">Haorui Yu, Ramon Ruiz-Dolz, Qiufeng Yi</p>
    <p class="paper-venue">
      <em>Findings of the Association for Computational Linguistics: EMNLP 2025</em>, pages 1945-1971, Suzhou, China
    </p>
    <details class="paper-bibtex">
      <summary><span lang="zh">BibTeX 引用</span><span lang="en">BibTeX Citation</span></summary>
      <pre><code>@inproceedings{yu-etal-2025-structured,
    title = "A Structured Framework for Evaluating and Enhancing Interpretive Capabilities of Multimodal {LLM}s in Culturally Situated Tasks",
    author = "Yu, Haorui  and
      Ruiz-Dolz, Ramon  and
      Yi, Qiufeng",
    editor = "Christodoulopoulos, Christos  and
      Chakraborty, Tanmoy  and
      Rose, Carolyn  and
      Peng, Violet",
    booktitle = "Findings of the Association for Computational Linguistics: EMNLP 2025",
    month = nov,
    year = "2025",
    address = "Suzhou, China",
    publisher = "Association for Computational Linguistics",
    url = "https://aclanthology.org/2025.findings-emnlp.103/",
    pages = "1945--1971",
    ISBN = "979-8-89176-335-7"
}</code></pre>
    </details>
  </div>
</section>
```

### 2. Add Paper Citation to Homepage Footer

**Location**: `index.html` footer (before or after copyright)

**New Element**:
```html
<p class="paper-link">
  <span lang="zh">📄 研究论文：</span><span lang="en">📄 Research Paper: </span>
  <a href="https://aclanthology.org/2025.findings-emnlp.103/" target="_blank" rel="noopener">
    EMNLP 2025 Findings
  </a>
</p>
```

### 3. Replace Contact Email Site-Wide

**Operation**: Global find-and-replace in all HTML files

**Files to Update** (12 total):
- `index.html`
- `pages/about.html`
- `pages/critics.html`
- `pages/process.html`
- `README.md`
- `CLAUDE.md`
- `SPEC.md`
- `docs/WRITING_CRITIQUES.md`
- `docs/ADDING_ARTWORKS.md`
- Other documentation files as needed

**Change**:
```
BEFORE: info@vulcaart.art
AFTER:  yuhaorui48@gmail.com
```

### 4. Add CSS Styling for Paper Citation

**Location**: `styles/main.css`

**New Styles**:
```css
/* Paper Citation Styling */
.paper-citation {
  background: #f9f9f9;
  border-left: 4px solid var(--color-primary);
  padding: 1.5rem;
  margin: 1.5rem 0;
  border-radius: 4px;
}

.paper-title {
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.paper-title a {
  color: var(--color-primary);
  text-decoration: none;
}

.paper-title a:hover {
  text-decoration: underline;
}

.paper-authors {
  font-size: 0.95rem;
  color: #555;
  margin: 0.25rem 0;
}

.paper-venue {
  font-size: 0.9rem;
  color: #666;
  margin: 0.25rem 0;
}

.paper-bibtex {
  margin-top: 1rem;
}

.paper-bibtex summary {
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--color-primary);
  font-weight: 500;
  user-select: none;
}

.paper-bibtex summary:hover {
  text-decoration: underline;
}

.paper-bibtex pre {
  background: #f0f0f0;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  line-height: 1.5;
}

.paper-bibtex code {
  font-family: 'Courier New', monospace;
}
```

---

## How to Implement

### Phase 1: Update About Page (30 min)

1. Open `pages/about.html`
2. Locate "研究意义" section end (line ~137)
3. Insert new "相关论文" section with paper citation HTML
4. Verify bilingual support works with existing lang switching
5. Test BibTeX collapsible details element

### Phase 2: Update Homepage (15 min)

1. Open `index.html`
2. Locate footer section
3. Add paper link before or after copyright notice
4. Ensure bilingual content displays correctly
5. Test link opens in new tab

### Phase 3: Global Email Replacement (30 min)

1. Run global find-and-replace in all HTML files:
   ```bash
   find . -type f -name "*.html" -exec sed -i 's/info@vulcaart\.art/yuhaorui48@gmail.com/g' {} +
   ```
2. Update Markdown documentation files (README.md, CLAUDE.md, SPEC.md)
3. Update docs/ files (WRITING_CRITIQUES.md, ADDING_ARTWORKS.md)
4. Verify all replacements successful with:
   ```bash
   grep -r "info@vulcaart.art" --include="*.html" --include="*.md"
   ```

### Phase 4: Add CSS Styling (15 min)

1. Open `styles/main.css`
2. Add `.paper-citation` styles at end of file (before language switching section)
3. Verify responsive behavior on mobile (375px), tablet (768px), desktop (1440px)
4. Test BibTeX code block horizontal scrolling

### Phase 5: Validation (20 min)

1. Open `http://localhost:8080/pages/about.html` and verify:
   - [ ] Paper citation section displays correctly
   - [ ] ACL Anthology link opens in new tab
   - [ ] BibTeX details expand/collapse works
   - [ ] Contact email shows `yuhaorui48@gmail.com`

2. Open `http://localhost:8080/` and verify:
   - [ ] Footer shows paper link
   - [ ] Link opens ACL Anthology in new tab
   - [ ] Email in footer updated

3. Cross-browser testing (Chrome, Firefox, Safari)

4. Responsive testing (375px, 768px, 1440px)

**Total Time**: ~2 hours

---

## Dependencies & Sequencing

**Prerequisites**: None - standalone content update

**Validation**:
- [ ] Paper citation displays on about.html
- [ ] Paper link displays on index.html
- [ ] All emails replaced with yuhaorui48@gmail.com
- [ ] Links open ACL Anthology in new tab
- [ ] BibTeX collapsible works
- [ ] Responsive layout maintained
- [ ] Bilingual support works for paper section

---

## Alternatives Considered

### Alternative 1: Add paper citation to all pages (header/footer)

**Verdict**: ❌ Rejected - Too prominent, distracts from art content. Better to keep on about page + homepage footer.

### Alternative 2: Use DOI badge instead of text link

**Verdict**: ❌ Rejected - User requested simple text link with ACL Anthology URL

### Alternative 3: Keep old email as alias

**Verdict**: ❌ Rejected - User stated old email is invalid/non-functional, must be replaced entirely

---

**Proposal Status**: Draft
**Created**: 2025-11-03
**Estimated Effort**: 2 hours
**Priority**: High (P1 - User-requested content update)
