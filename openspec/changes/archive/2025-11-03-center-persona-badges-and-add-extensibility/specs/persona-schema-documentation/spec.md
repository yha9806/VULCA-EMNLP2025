# Specification: Persona Schema Documentation

**Capability**: `persona-schema-documentation`
**Feature**: Center Persona Badges and Add Extensibility
**Last Updated**: 2025-11-03

---

## Purpose

Document the persona data schema with inline JSDoc comments in `js/data.js`, enabling developers to add new personas by following clear, accessible documentation.

## ADDED Requirements

### Requirement: Persona schema SHALL be documented with JSDoc type definitions

The `VULCA_DATA.personas` array SHALL be preceded by comprehensive JSDoc comments defining the Persona object structure and required fields.

**Rationale**: Future developers (or non-technical content editors) need clear guidance on what fields are required, their types, formats, and purposes when adding new critic personas.

**Acceptance Criteria**:
- JSDoc `@typedef` defines Persona object structure
- All 8 fields documented with `@property` tags
- Type annotations included (string, number, etc.)
- Field descriptions explain purpose and format
- Example persona object provided with `@example` tag
- Documentation immediately precedes `personas:` array
- Uses JSDoc syntax for IDE autocomplete support

#### Scenario: Developer adds new persona following JSDoc documentation

**Given**: Developer wants to add "bell hooks" as a new persona
**When**: Developer opens `js/data.js` and reads JSDoc comments
**Then**: Developer understands all required fields:
  - `id`: unique kebab-case identifier
  - `nameZh`: Chinese display name
  - `nameEn`: English display name
  - `period`: time period description (中文)
  - `era`: era classification (English)
  - `bio`: full biography (300-500 words)
  - `color`: hex color code for visual identity
  - `bias`: short critical perspective summary
**And**: Developer creates correctly formatted persona object:
```javascript
{
  id: "bell-hooks",
  nameZh: "贝尔·胡克斯",
  nameEn: "bell hooks",
  period: "美国女性主义评论家 (1952-2021)",
  era: "Contemporary American",
  bio: "Feminist cultural critic and social activist whose intersectional approach transformed art criticism...",
  color: "#C41E3A",
  bias: "Feminist critique, marginalized voices, power dynamics"
}
```
**And**: Badge renders automatically with correct name and color
**And**: No errors occur during initialization

**JSDoc format**:
```javascript
/**
 * Persona data schema for art critic profiles
 *
 * Each persona represents a distinct critical voice with unique cultural,
 * historical, and philosophical perspectives. Personas are used throughout
 * the exhibition to generate AI-driven critiques of artworks.
 *
 * @typedef {Object} Persona
 *
 * @property {string} id
 *   Unique identifier for the persona. Must be kebab-case (lowercase with hyphens).
 *   Used as DOM data attribute and internal reference key.
 *   Examples: "su-shi", "john-ruskin", "bell-hooks"
 *
 * @property {string} nameZh
 *   Chinese display name. Used in UI badges and Chinese-language context.
 *   Examples: "苏轼", "约翰·罗斯金", "贝尔·胡克斯"
 *
 * @property {string} nameEn
 *   English display name. Used in UI badges and English-language context.
 *   Examples: "Su Shi", "John Ruskin", "bell hooks"
 *
 * @property {string} period
 *   Time period or role description in Chinese. Provides historical/cultural context.
 *   Format: "文化背景 (生卒年份)" or "角色描述"
 *   Examples: "北宋文人 (1037-1101)", "维多利亚时期评论家 (1819-1900)", "当代"
 *
 * @property {string} era
 *   Era classification in English. Used for categorization and filtering.
 *   Examples: "Northern Song Dynasty", "Victorian England", "Contemporary American"
 *
 * @property {string} bio
 *   Full biography in English (~300-500 words). Describes the persona's critical
 *   philosophy, historical context, and unique perspective. Should be detailed
 *   enough to guide AI critique generation.
 *
 * @property {string} color
 *   Hex color code for visual identity. Used for badge borders, chart colors,
 *   and UI accents. Must be web-safe hex format.
 *   Examples: "#B85C3C", "#6B4C8A", "#C41E3A"
 *
 * @property {string} bias
 *   Short description of critical perspective/bias (~10-20 words).
 *   Summarizes the lens through which this persona views art.
 *   Examples: "Aesthetic idealism, personal expression", "Moral aesthetics, social responsibility"
 *
 * @example
 * // Adding a new contemporary feminist critic
 * {
 *   id: "bell-hooks",
 *   nameZh: "贝尔·胡克斯",
 *   nameEn: "bell hooks",
 *   period: "美国女性主义评论家 (1952-2021)",
 *   era: "Contemporary American",
 *   bio: "Feminist cultural critic and social activist whose intersectional approach to art, race, class, and gender transformed contemporary criticism. bell hooks (lowercase intentional) examined how art reinforces or challenges systems of domination, centering the voices and experiences of marginalized communities. Her writing emphasized accessible language and engaged pedagogy, insisting that critical theory serve liberation rather than academic elitism. In visual art analysis, hooks attended to whose stories are told, whose aesthetics are validated, and how artistic production intersects with structures of power and oppression.",
 *   color: "#C41E3A",
 *   bias: "Feminist critique, intersectionality, marginalized voices, power structures"
 * }
 */
personas: [
  // Existing 6 personas...
]
```

---

### Requirement: Documentation SHALL include field validation guidelines

The JSDoc comments SHALL specify validation rules, format requirements, and common pitfalls for each field.

**Rationale**: Clear validation rules prevent malformed data that would break badge rendering or chart generation.

**Acceptance Criteria**:
- `id` field notes kebab-case requirement
- `color` field notes hex format requirement (#RRGGBB)
- `bio` field notes approximate word count (300-500 words)
- Examples show correct formats
- Common mistakes documented (e.g., "don't use spaces in id")

#### Scenario: Developer catches validation error before adding persona

**Given**: Developer prepares new persona data
**And**: Developer reads JSDoc validation guidelines
**When**: Developer attempts to use `id: "Bell Hooks"` (with spaces and capitals)
**Then**: Developer recognizes this violates kebab-case rule
**And**: Developer corrects to `id: "bell-hooks"`
**When**: Developer attempts to use `color: "red"` (CSS keyword)
**Then**: Developer recognizes this violates hex format rule
**And**: Developer corrects to `color: "#C41E3A"`

**Validation guidelines in JSDoc**:
```javascript
/**
 * @property {string} id
 *   ...
 *   ⚠ MUST be kebab-case (lowercase, hyphens only, no spaces or capitals)
 *   ✅ Valid: "su-shi", "john-ruskin", "bell-hooks"
 *   ❌ Invalid: "Su Shi", "John_Ruskin", "BellHooks"
 *
 * @property {string} color
 *   ...
 *   ⚠ MUST be 6-digit hex format with # prefix
 *   ✅ Valid: "#B85C3C", "#6B4C8A", "#FFFFFF"
 *   ❌ Invalid: "red", "rgb(184, 92, 60)", "#B8C" (too short)
 *
 * @property {string} bio
 *   ...
 *   💡 Aim for 300-500 words (2-3 paragraphs). Too short lacks depth for
 *   AI critique generation; too long may overwhelm UI display.
 */
```

---

### Requirement: Documentation SHALL provide step-by-step addition guide

The JSDoc comments SHALL include a "How to Add New Persona" section with clear numbered steps.

**Rationale**: Non-developer content editors need procedural guidance, not just schema reference.

**Acceptance Criteria**:
- Numbered step-by-step instructions
- References which file to edit (js/data.js)
- Notes which sections to update (personas array + critiques)
- Mentions no HTML editing required
- Includes browser cache clearing step

#### Scenario: Content editor adds persona following step-by-step guide

**Given**: Content editor has new persona content ready
**When**: Editor opens `js/data.js` and reads "How to Add New Persona" section
**Then**: Editor follows these steps:
  1. Open `js/data.js` in text editor
  2. Scroll to `personas:` array (line ~150)
  3. Add new persona object at end of array (before closing `]`)
  4. Fill in all 8 required fields using example as template
  5. Choose unique color hex code (check existing colors to avoid duplicates)
  6. Save file
  7. Add corresponding critiques in `critiques:` array for each artwork
  8. Clear browser cache and refresh page
  9. Verify new badge appears in Data Insights section
**And**: Editor successfully adds persona without developer assistance
**And**: Badge renders correctly with correct styling

**Documentation format**:
```javascript
/**
 * === HOW TO ADD A NEW PERSONA ===
 *
 * Follow these steps to add a new art critic to the exhibition:
 *
 * 1. Open this file (js/data.js) in a text editor
 *
 * 2. Scroll to the "personas:" array below (around line 150)
 *
 * 3. Add your new persona object at the END of the array (before the closing "]")
 *    - Copy an existing persona as a template
 *    - Update all 8 fields (id, nameZh, nameEn, period, era, bio, color, bias)
 *    - Follow the @typedef Persona schema documented above
 *
 * 4. Choose a unique color hex code (e.g., #A73E5C)
 *    - Check existing personas to avoid duplicate colors
 *    - Use color picker tool: https://www.google.com/search?q=color+picker
 *
 * 5. Save the file (Ctrl+S / Cmd+S)
 *
 * 6. Add corresponding critiques for this persona in the "critiques:" array
 *    - You need one critique per artwork (4 artworks = 4 critique objects)
 *    - Each critique should have: artworkId, personaId, textZh, textEn, rpait scores
 *
 * 7. Clear your browser cache:
 *    - Chrome: Ctrl+Shift+Delete → Check "Cached images" → Clear data
 *    - Firefox: Ctrl+Shift+Delete → Check "Cache" → Clear Now
 *    - Safari: Cmd+Option+E
 *
 * 8. Refresh the page (Ctrl+R / Cmd+R) - the new persona badge should appear!
 *
 * ⚠ NO HTML editing required - badges generate automatically from this data!
 * ⚠ NO CSS editing required - colors apply via data-persona attribute!
 *
 * If the badge doesn't appear, check browser console (F12) for error messages.
 */
personas: [
  // ...
]
```

---

### Requirement: Documentation SHALL be maintainable and version-controlled

The persona schema documentation SHALL be stored in `js/data.js` alongside the data it describes, not in separate documentation files.

**Rationale**: Co-located documentation stays in sync with code changes and is visible to anyone editing the data file.

**Acceptance Criteria**:
- Documentation is JSDoc comments in `js/data.js`
- Comments immediately precede `personas:` array
- No separate PERSONAS.md or README file needed
- Documentation visible in Git diffs when data changes
- IDE provides autocomplete based on JSDoc types

#### Scenario: Developer updates persona schema and documentation together

**Given**: Project needs to add `pronouns` field to Persona object
**When**: Developer modifies persona objects to include `pronouns: "they/them"`
**And**: Developer updates JSDoc `@typedef` to include `@property {string} pronouns`
**And**: Developer commits changes to Git
**Then**: Git diff shows both schema change and documentation update in same file
**And**: Future developers see updated documentation when editing data.js
**And**: IDEs autocomplete new `pronouns` field when editing personas

**Version control benefit**:
```bash
$ git diff js/data.js

+ * @property {string} pronouns
+ *   Preferred pronouns for the persona. Examples: "he/him", "she/her", "they/them"
+ *

  personas: [
    {
      id: "su-shi",
      nameZh: "苏轼",
      nameEn: "Su Shi",
+     pronouns: "he/him",
      ...
    }
  ]
```

---

## Non-Requirements

- **Out of scope**: Generating JSDoc HTML documentation site
- **Out of scope**: TypeScript .d.ts definition file
- **Out of scope**: JSON Schema validation file
- **Out of scope**: API documentation (no API exists, just data)
- **Out of scope**: Automated validation tests for persona data

---

## Dependencies

**Required**:
- Existing `js/data.js` file with `VULCA_DATA.personas` array

**Optional**:
- IDE with JSDoc support (VS Code, WebStorm) for autocomplete

---

## Browser Support

N/A - Documentation is for developers, not runtime code.

---

## Performance Impact

None - Documentation is comments, not executed code.

---

## Validation

**Manual review**:
- [ ] JSDoc comments present above `personas:` array
- [ ] All 8 fields documented with @property tags
- [ ] Type annotations included
- [ ] Validation guidelines included
- [ ] Step-by-step addition guide included
- [ ] Example persona provided
- [ ] Comments are clear and comprehensive

**Developer testing**:
- [ ] Developer can add new persona following documentation alone
- [ ] IDE provides autocomplete for persona fields (if JSDoc-aware IDE used)
- [ ] No questions arise during persona addition process

**Acceptance criteria**:
```javascript
// A non-developer should be able to add this persona by following
// the JSDoc documentation alone, with no additional help:

{
  id: "susan-sontag",
  nameZh: "苏珊·桑塔格",
  nameEn: "Susan Sontag",
  period: "美国评论家 (1933-2004)",
  era: "Contemporary American",
  bio: "Influential American writer, critic, and public intellectual whose essays on photography, camp aesthetics, and illness reshaped modern cultural criticism...",
  color: "#5D4E6D",
  bias: "Photography theory, camp aesthetics, against interpretation"
}
```

If a developer can successfully add this persona and have it render correctly
in the UI without asking for help, the documentation is sufficient.
