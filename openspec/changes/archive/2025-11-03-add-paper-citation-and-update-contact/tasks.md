# Tasks: Add EMNLP 2025 Paper Citation and Update Contact Email

## Overview

Add academic paper citation to website and replace invalid contact email with valid developer email.

**Total Estimated Time**: 2 hours

---

## Phase 1: Add Paper Citation to About Page (30 min)

### Task 1.1: Insert Paper Citation Section HTML (15 min)

**File**: `pages/about.html`
**Location**: After "研究意义" section (line ~137, before "联系我们")

**Action**: Add new `<section class="content-section">` with:
- Bilingual section heading ("相关论文" / "Related Publication")
- Paper title as clickable link to ACL Anthology
- Authors list: Haorui Yu, Ramon Ruiz-Dolz, Qiufeng Yi
- Venue: EMNLP 2025 Findings, pages 1945-1971
- Collapsible BibTeX citation in `<details>` element

**Validation**:
- [ ] Section inserted in correct location
- [ ] ACL Anthology link has `target="_blank" rel="noopener"`
- [ ] BibTeX code wrapped in `<pre><code>` tags
- [ ] Bilingual content uses `lang="zh"` and `lang="en"` attributes
- [ ] No HTML syntax errors

**Time**: 15 min

---

### Task 1.2: Verify About Page Renders Correctly (15 min)

**Action**: Open `http://localhost:8080/pages/about.html` in browser

**Validation Checklist**:
- [ ] "相关论文" section appears after "研究意义"
- [ ] Paper title is blue/clickable
- [ ] Authors list displays correctly
- [ ] Venue information shows "EMNLP 2025 Findings"
- [ ] "BibTeX 引用" summary is clickable
- [ ] Clicking summary expands BibTeX code block
- [ ] BibTeX code is monospace font with horizontal scroll
- [ ] Bilingual switching works (toggle EN/中 button)

**Time**: 15 min

---

## Phase 2: Add Paper Link to Homepage Footer (15 min)

### Task 2.1: Add Footer Paper Link (10 min)

**File**: `index.html`
**Location**: Footer section (search for `<footer`)

**Action**: Add new `<p class="paper-link">` element:
- Bilingual label ("📄 研究论文：" / "📄 Research Paper: ")
- Link to ACL Anthology with "EMNLP 2025 Findings" text
- `target="_blank" rel="noopener"` attributes

**Validation**:
- [ ] Link added to footer
- [ ] Bilingual content uses span[lang] pattern
- [ ] Link opens in new tab
- [ ] No layout breaks

**Time**: 10 min

---

### Task 2.2: Verify Homepage Footer (5 min)

**Action**: Open `http://localhost:8080/` and scroll to footer

**Validation Checklist**:
- [ ] Paper link visible in footer
- [ ] Link text shows "EMNLP 2025 Findings"
- [ ] Clicking opens ACL Anthology in new tab
- [ ] Language toggle switches label correctly

**Time**: 5 min

---

## Phase 3: Global Email Replacement (30 min)

### Task 3.1: Replace Email in HTML Files (10 min)

**Files**: `index.html`, `pages/*.html` (4 files total)

**Action**: Find and replace:
```
FIND:    info@vulcaart.art
REPLACE: yuhaorui48@gmail.com
```

**Specific Locations**:
- `index.html`: Footer `<a href="mailto:...">`
- `pages/about.html`: "联系我们" section + footer
- `pages/critics.html`: Footer
- `pages/process.html`: Footer

**Validation**:
- [ ] All 4 HTML files updated
- [ ] `mailto:` links point to new email
- [ ] No broken links

**Time**: 10 min

---

### Task 3.2: Replace Email in Documentation Files (10 min)

**Files**:
- `README.md`
- `CLAUDE.md`
- `SPEC.md`
- `docs/WRITING_CRITIQUES.md`
- `docs/ADDING_ARTWORKS.md`

**Action**: Replace `info@vulcaart.art` → `yuhaorui48@gmail.com` in all Markdown files

**Validation**:
- [ ] All Markdown files updated
- [ ] Email appears in correct context (contact sections)
- [ ] No syntax errors in Markdown

**Time**: 10 min

---

### Task 3.3: Verify No Old Email Remains (10 min)

**Action**: Search entire codebase for old email

**Command**:
```bash
grep -r "info@vulcaart.art" --include="*.html" --include="*.md" --include="*.js"
```

**Expected Result**: No matches found (or only in archived/backup files)

**Validation**:
- [ ] No matches in active HTML files
- [ ] No matches in Markdown documentation
- [ ] Old email only in backups/ or openspec/changes/archive/ (acceptable)

**Time**: 10 min

---

## Phase 4: Add CSS Styling for Paper Citation (15 min)

### Task 4.1: Add Paper Citation CSS Rules (10 min)

**File**: `styles/main.css`
**Location**: Before `/* ==================== LANGUAGE SWITCHING ==================== */` (line ~3035)

**Action**: Add CSS rules for:
- `.paper-citation` - container styling (background, border, padding)
- `.paper-title` - title link styling
- `.paper-authors` - author list styling
- `.paper-venue` - venue information styling
- `.paper-bibtex` - collapsible details styling
- `.paper-bibtex summary` - clickable summary styling
- `.paper-bibtex pre` - code block styling

**Validation**:
- [ ] CSS rules added in correct location
- [ ] No syntax errors
- [ ] Colors use CSS variables where applicable

**Time**: 10 min

---

### Task 4.2: Test CSS Styling on About Page (5 min)

**Action**: Refresh `http://localhost:8080/pages/about.html`

**Validation Checklist**:
- [ ] Paper citation has light gray background
- [ ] Left border is blue/primary color
- [ ] Title link is blue and underlines on hover
- [ ] Authors text is gray (#555)
- [ ] Venue text is lighter gray (#666)
- [ ] BibTeX summary is blue and clickable
- [ ] BibTeX code block has gray background
- [ ] Code is monospace font
- [ ] Horizontal scroll works for long lines

**Time**: 5 min

---

## Phase 5: Validation & Testing (30 min)

### Task 5.1: Comprehensive About Page Testing (10 min)

**URL**: `http://localhost:8080/pages/about.html`

**Test Scenarios**:

#### Scenario 5.1.1: Paper Citation Display
```gherkin
Given the about page is loaded
When I scroll to "相关论文" section
Then I see the paper title "A Structured Framework for..."
And the title is a blue clickable link
And authors "Haorui Yu, Ramon Ruiz-Dolz, Qiufeng Yi" display below title
And venue "Findings of the Association for Computational Linguistics: EMNLP 2025" displays
```

#### Scenario 5.1.2: BibTeX Expansion
```gherkin
Given the paper citation section is visible
When I click "BibTeX 引用" summary
Then the BibTeX code block expands
And I see the complete @inproceedings entry
And the code is in monospace font
```

#### Scenario 5.1.3: ACL Anthology Link
```gherkin
Given the paper citation is visible
When I click the paper title link
Then ACL Anthology opens in a new tab
And the URL is "https://aclanthology.org/2025.findings-emnlp.103/"
```

**Validation Checklist**:
- [ ] All scenarios pass
- [ ] Contact email shows yuhaorui48@gmail.com
- [ ] No console errors
- [ ] No layout breaks

**Time**: 10 min

---

### Task 5.2: Homepage Footer Testing (5 min)

**URL**: `http://localhost:8080/`

**Test Scenarios**:

#### Scenario 5.2.1: Footer Paper Link
```gherkin
Given the homepage is loaded
When I scroll to the footer
Then I see "📄 研究论文：EMNLP 2025 Findings" link
And clicking the link opens ACL Anthology in new tab
```

#### Scenario 5.2.2: Footer Email
```gherkin
Given the homepage footer is visible
When I check the contact email
Then it shows "yuhaorui48@gmail.com"
And clicking opens email client with correct address
```

**Validation Checklist**:
- [ ] Paper link visible and functional
- [ ] Email updated correctly
- [ ] Language toggle works

**Time**: 5 min

---

### Task 5.3: Cross-Page Email Verification (10 min)

**Pages to Check**:
- `http://localhost:8080/` - Homepage footer
- `http://localhost:8080/pages/about.html` - Contact section + footer
- `http://localhost:8080/pages/critics.html` - Footer
- `http://localhost:8080/pages/process.html` - Footer

**Validation Checklist**:
- [ ] All pages show yuhaorui48@gmail.com
- [ ] No pages show info@vulcaart.art
- [ ] Mailto: links work correctly
- [ ] Consistent footer styling across pages

**Time**: 10 min

---

### Task 5.4: Responsive Testing (5 min)

**Breakpoints to Test**:
- 375px (Mobile)
- 768px (Tablet)
- 1440px (Desktop)

**Focus**: Paper citation section on about.html

**Validation Checklist**:
- [ ] 375px: Paper citation stacks vertically, BibTeX code scrolls horizontally
- [ ] 768px: Paper citation maintains padding and border
- [ ] 1440px: Paper citation displays with full width, no overflow
- [ ] All breakpoints: BibTeX details expand/collapse works

**Time**: 5 min

---

## Summary

**Total Tasks**: 14 tasks across 5 phases
**Total Time**: 2 hours
**Risk**: Low (content addition and text replacement only)

---

**Tasks Status**: Draft
**Created**: 2025-11-03
