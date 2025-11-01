# Specification: Exhibition Content Simplification

**Capability:** Exhibition Content Structure

**Change ID:** simplify-exhibition-focus

---

## REMOVED Requirements

### Requirement: Exhibition Planning Documentation MUST Be Removed
**ID:** exhibition-content-removed-planning

**Description:** All project planning, budgeting, and implementation documentation sections MUST be removed completely from the exhibition website to restore focus on the core artistic experience.

#### Scenario: Visitor Lands on Exhibition Page

**Given:** A user visits vulcaart.art for the first time

**When:** They scroll down the page

**Then:**
- They SHALL NOT see "展览方案 · 实施规划" section
- They do NOT see any budget tables with prices (¥10,700, ¥3500, ¥2000, etc.)
- They do NOT see timeline with "第1周：准备阶段", "第2周：制作阶段", etc.
- They do NOT see upgrade path cards with "+¥5000", "+¥10000" options
- They do NOT see risk control matrix with "印刷色差", "API超额", etc.
- Page flows naturally from "创作过程" directly to "关于这个项目"

#### Scenario: User Inspects HTML Source

**Given:** A developer opens browser DevTools and inspects HTML

**When:** They search for planning-related elements

**Then:**
- No `<section id="exhibition-plan">` element SHALL exist
- No table elements with budget data exist
- No classes like `.budget-table`, `.timeline`, `.upgrade-path`, `.risk-control` are used
- No text nodes containing financial amounts or timeline phases exist

---

## MODIFIED Requirements

### Requirement: Process Section Content MUST Be Substantially Condensed
**ID:** exhibition-content-modified-process

**Description:** The Process section content MUST be substantially condensed from approximately 500 words to approximately 200 words while retaining artistic value and meta-documentation intent. All four subsections MUST remain, but each SHALL be reduced to 1-2 sentences, embodying the "负形" principle where deletion is intentional and meaningful.

#### Scenario: User Reads Condensed Process Section

**Given:** A user scrolls to the "创作过程 · 负形关注" section

**When:** They read the content

**Then:**
- All 4 subsections (Conceptual, Design, Research, Technology) SHALL be present
- Each subsection is reduced to 1-2 sentences (instead of 3-4)
- Core concepts are retained with poetic language preserved
- Reading time is <2 minutes (was ~5 minutes)
- Content remains compelling and intentional

#### Scenario: HTML Structure Remains Unchanged

**Given:** The HTML structure of the Process section

**When:** Comparing before/after versions

**Then:**
- Number of `<p>` elements stays the same
- Number of `<h3>` elements stays the same
- Only text content *within* these elements changes
- CSS classes and IDs unchanged
- Layout and styling unchanged

---

### Requirement: About Section Content MUST Be Simplified
**ID:** exhibition-content-modified-about

**Description:** The About section content MUST be simplified from four paragraphs to two focused paragraphs while maintaining essential project context. Paragraph 1 SHALL combine "What is VULCA" and "What is vulcaart.art" into one focused paragraph. Paragraph 2 SHALL focus exclusively on aesthetic philosophy and meaning. Explanatory and design background text SHALL be removed.

#### Scenario: User Reads Streamlined About Section

**Given:** A user reads the "关于这个项目" section

**When:** They encounter the content

**Then:**
- Paragraph 1 SHALL combine "What is VULCA" + "What is vulcaart.art" into one focused statement
- Paragraph 2 focuses on aesthetic philosophy and meaning
- Design explanation ("设计上，我们以Sougwen Chung...") is removed
- "潮汐的负形" conceptual breakdown is removed
- Closing statement about AI, art, and cultural intersection is retained
- Reading time is <1 minute (was ~2 minutes)

#### Scenario: Links and References Work Correctly

**Given:** The About section includes contact and sharing references

**When:** A user encounters them

**Then:**
- All functional links SHALL remain (e.g., contact email info@vulcaart.art)
- No broken references to deleted sections
- Social/sharing functionality works correctly

---

## ADDED Requirements

### Requirement: Negative Space Aesthetic MUST Be Embodied
**ID:** exhibition-content-added-aesthetic

**Description:** The website presentation SHALL successfully embody the "负形" (negative space) design principle through intentional content deletion. Content reduction of 30-40% overall, removal of all planning sections, and generous spacing between remaining sections MUST combine to create an experience where absence is as meaningful as presence, reflecting Sougwen Chung's aesthetic philosophy.

#### Scenario: Page Structure Reflects Negative Space Principle

**Given:** A designer reviews the website's overall structure and layout

**When:** They assess visual hierarchy and spacing

**Then:**
- Sections SHALL have generous spacing (not information-dense)
- Each section has intentional breathing room
- Whitespace is clearly intentional, not accidental
- Scrolling experience feels meditative rather than rushed
- User attention naturally focuses on artwork + critique interaction
- Visual hierarchy supports 80% focus on core experience, 20% on context

#### Scenario: Content Reduction Is Visually Apparent

**Given:** A visitor experiences the simplified website

**When:** They navigate through all sections

**Then:**
- Planning content SHALL be completely removed (100%)
- Process section is visibly shorter but retains meaning
- About section is concise but complete
- Overall page word count is reduced by 30-40%
- Information architecture is clearer, more focused
- Artistic intent is evident through what is *not* shown

---

**Specification Version:** 1.0
**Created:** 2025-11-01
**Status:** Ready for Implementation
