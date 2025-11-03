# Spec: Paper Citation and Contact Email Update

## Overview

Add EMNLP 2025 paper citation to about page and homepage, and replace invalid contact email site-wide.

**Target**: `pages/about.html`, `index.html`, all HTML/Markdown files

**Status**: ADDED (new content) + MODIFIED (email replacement)

---

## ADDED Requirements

### Requirement: About page SHALL display EMNLP 2025 paper citation with full bibliographic information
The about page SHALL display a dedicated section titled "相关论文" (Chinese) / "Related Publication" (English) containing the paper title as clickable link to ACL Anthology, author list, venue information (EMNLP 2025 Findings, pages 1945-1971), and collapsible BibTeX citation in `<details>` element.

#### Scenario: User views paper citation on about page
```gherkin
Given the user navigates to http://localhost:8080/pages/about.html
When the page loads
Then a "相关论文" section SHALL appear after "研究意义" section
And the paper title "A Structured Framework for Evaluating and Enhancing Interpretive Capabilities of Multimodal LLMs in Culturally Situated Tasks" SHALL be displayed
And the title SHALL be a clickable link to "https://aclanthology.org/2025.findings-emnlp.103/"
And the link SHALL open in a new tab (target="_blank" rel="noopener")
And authors "Haorui Yu, Ramon Ruiz-Dolz, Qiufeng Yi" SHALL be displayed
And venue "Findings of the Association for Computational Linguistics: EMNLP 2025" SHALL be displayed
```

#### Scenario: User expands BibTeX citation
```gherkin
Given the paper citation section is visible
When the user clicks the "BibTeX 引用" summary element
Then the BibTeX code block SHALL expand
And the code SHALL display the complete @inproceedings entry
And the code SHALL be in monospace font
And the code SHALL have horizontal scroll if content overflows
```

#### Scenario: User clicks paper title link
```gherkin
Given the paper citation section is visible
When the user clicks the paper title link
Then ACL Anthology SHALL open in a new browser tab
And the URL SHALL be "https://aclanthology.org/2025.findings-emnlp.103/"
And the current tab SHALL remain on the about page
```

**Validation Code**:
```javascript
// Test paper citation section exists
const aboutPage = await page.goto('http://localhost:8080/pages/about.html');
const paperSection = await page.locator('h2:has-text("相关论文")');
console.assert(await paperSection.count() === 1, 'Paper citation section should exist');

// Test paper title link
const paperTitle = await page.locator('.paper-title a');
console.assert(await paperTitle.getAttribute('href') === 'https://aclanthology.org/2025.findings-emnlp.103/', 'Paper link should point to ACL Anthology');
console.assert(await paperTitle.getAttribute('target') === '_blank', 'Paper link should open in new tab');

// Test BibTeX details
const bibtexSummary = await page.locator('.paper-bibtex summary');
await bibtexSummary.click();
const bibtexCode = await page.locator('.paper-bibtex code');
const bibtexText = await bibtexCode.textContent();
console.assert(bibtexText.includes('@inproceedings{yu-etal-2025-structured'), 'BibTeX code should contain citation');
```

---

### Requirement: Homepage footer SHALL display paper link with conference badge style
The homepage footer SHALL display a paper link with emoji icon and conference name (📄 研究论文：EMNLP 2025 Findings) that opens ACL Anthology in new tab. The link SHALL support bilingual display.

#### Scenario: User views homepage footer
```gherkin
Given the user navigates to http://localhost:8080/
When the page loads and user scrolls to footer
Then a paper link SHALL be visible
And the link text SHALL be "📄 研究论文：EMNLP 2025 Findings" (Chinese) or "📄 Research Paper: EMNLP 2025 Findings" (English)
And clicking the link SHALL open ACL Anthology in new tab
```

#### Scenario: User switches language on homepage
```gherkin
Given the homepage is loaded with Chinese language
When the user clicks the language toggle button
Then the paper link label SHALL change to "📄 Research Paper: EMNLP 2025 Findings"
And the link destination SHALL remain "https://aclanthology.org/2025.findings-emnlp.103/"
```

**Validation Code**:
```javascript
// Test homepage paper link
const homePage = await page.goto('http://localhost:8080/');
const paperLink = await page.locator('footer .paper-link a');
console.assert(await paperLink.count() === 1, 'Homepage should have paper link in footer');
console.assert(await paperLink.getAttribute('href') === 'https://aclanthology.org/2025.findings-emnlp.103/', 'Link should point to ACL Anthology');
console.assert(await paperLink.getAttribute('target') === '_blank', 'Link should open in new tab');

// Test bilingual support
const paperLabel = await page.locator('footer .paper-link span[lang="zh"]');
console.assert(await paperLabel.textContent() === '📄 研究论文：', 'Chinese label should display correctly');
```

---

### Requirement: Paper citation CSS styling SHALL provide clear visual hierarchy and responsive layout
The paper citation section SHALL have light background, colored left border, properly styled title/authors/venue text, and responsive BibTeX code block with horizontal scrolling.

#### Scenario: User views styled paper citation
```gherkin
Given the about page paper citation section is visible
When the user observes the visual styling
Then the section SHALL have a light gray background (#f9f9f9)
And the section SHALL have a colored left border (4px, primary color)
And the section SHALL have padding (1.5rem) and border-radius (4px)
And the paper title SHALL be larger font (1.1rem) and colored (primary color)
And the title SHALL underline on hover
And authors SHALL be gray color (#555, 0.95rem)
And venue SHALL be lighter gray (#666, 0.9rem)
```

#### Scenario: User views BibTeX code block
```gherkin
Given the BibTeX details are expanded
When the user views the code block
Then the code SHALL have gray background (#f0f0f0)
And the code SHALL use monospace font ('Courier New')
And the code SHALL have padding (1rem) and border-radius (4px)
And long lines SHALL scroll horizontally
And font size SHALL be 0.85rem with line-height 1.5
```

**Validation Code**:
```css
/* Test CSS rules exist */
.paper-citation {
  background: #f9f9f9;
  border-left: 4px solid var(--color-primary);
  padding: 1.5rem;
}

.paper-title {
  font-size: 1.1rem;
  font-weight: 600;
}

.paper-bibtex pre {
  background: #f0f0f0;
  font-family: 'Courier New', monospace;
  overflow-x: auto;
}
```

---

## MODIFIED Requirements

### Requirement: All pages SHALL display valid developer contact email (yuhaorui48@gmail.com)
All HTML pages and documentation files SHALL replace the invalid email address `info@vulcaart.art` with the valid developer email `yuhaorui48@gmail.com` in all contact links and footer sections.

#### Scenario: User views contact email on about page
```gherkin
Given the user navigates to http://localhost:8080/pages/about.html
When the user views the "联系我们" section
Then the contact email SHALL be "yuhaorui48@gmail.com"
And clicking the email link SHALL open email client with correct address
And the footer SHALL also display "yuhaorui48@gmail.com"
```

#### Scenario: User views footer email on all pages
```gherkin
Given the user navigates to any page (/, /pages/critics.html, /pages/about.html, /pages/process.html)
When the user scrolls to the footer
Then the footer SHALL display "yuhaorui48@gmail.com"
And the mailto: link SHALL point to "mailto:yuhaorui48@gmail.com"
And NO page SHALL display "info@vulcaart.art"
```

#### Scenario: Documentation files show correct email
```gherkin
Given a user reads README.md, CLAUDE.md, or SPEC.md
When the user looks for contact information
Then the email SHALL be "yuhaorui48@gmail.com"
And NO documentation file SHALL contain "info@vulcaart.art"
```

**Validation Code**:
```bash
# Test no old email remains
grep -r "info@vulcaart.art" --include="*.html" --include="*.md" .
# Expected: No matches (or only in archived/backup files)

# Test new email exists
grep -r "yuhaorui48@gmail.com" --include="*.html" pages/
# Expected: Multiple matches in all HTML files
```

---

## Dependencies

**Prerequisites**: None - standalone content and text replacement

**Validation**:
- [ ] Paper citation section displays on about.html
- [ ] Paper link displays on index.html footer
- [ ] All ACL Anthology links open in new tab
- [ ] BibTeX collapsible details work correctly
- [ ] All HTML files show yuhaorui48@gmail.com
- [ ] No HTML/Markdown files show info@vulcaart.art
- [ ] CSS styling applied correctly
- [ ] Responsive layout maintained (375px, 768px, 1440px)
- [ ] Bilingual support works for paper section

---

## Testing Matrix

| Page | Paper Citation | Contact Email | Link Opens New Tab |
|------|---------------|---------------|-------------------|
| about.html | [ ] Displays | [ ] Updated | [ ] Yes |
| index.html | [ ] Footer link | [ ] Updated | [ ] Yes |
| critics.html | N/A | [ ] Updated | N/A |
| process.html | N/A | [ ] Updated | N/A |

| Breakpoint | Paper Section Layout | BibTeX Scroll | Footer Display |
|------------|---------------------|---------------|----------------|
| 375px | [ ] Stacks properly | [ ] Horizontal scroll | [ ] Readable |
| 768px | [ ] Maintains padding | [ ] Horizontal scroll | [ ] Readable |
| 1440px | [ ] Full width | [ ] No overflow | [ ] Readable |

---

## Validation Checklist

Before marking this spec as complete:

- [ ] "相关论文" section added to about.html after "研究意义"
- [ ] Paper title links to ACL Anthology with target="_blank"
- [ ] Authors (Haorui Yu, Ramon Ruiz-Dolz, Qiufeng Yi) display correctly
- [ ] Venue (EMNLP 2025 Findings, pages 1945-1971) displays
- [ ] BibTeX details element expands/collapses correctly
- [ ] BibTeX code block has monospace font and horizontal scroll
- [ ] Homepage footer shows paper link with emoji icon
- [ ] Paper link opens ACL Anthology in new tab
- [ ] All 4 HTML pages show yuhaorui48@gmail.com
- [ ] README.md, CLAUDE.md, SPEC.md show yuhaorui48@gmail.com
- [ ] docs/*.md files show yuhaorui48@gmail.com
- [ ] No active files contain info@vulcaart.art
- [ ] `.paper-citation` CSS rules added to main.css
- [ ] Paper citation styling matches design mockup
- [ ] Responsive layout tested at 375px, 768px, 1440px
- [ ] Cross-browser testing completed (Chrome, Firefox, Safari)
- [ ] Bilingual support works (Chinese/English toggle)

---

**Spec Status**: Complete
**Created**: 2025-11-03
**Requirements**: 3 ADDED, 1 MODIFIED
**Scenarios**: 10 total
