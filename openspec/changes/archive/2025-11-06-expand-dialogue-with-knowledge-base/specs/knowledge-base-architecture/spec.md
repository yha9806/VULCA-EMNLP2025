# Specification: Knowledge Base Architecture

**Capability**: `knowledge-base-architecture`
**Change**: `expand-dialogue-with-knowledge-base`
**Status**: Draft
**Version**: 1.0.0

---

## Overview

This specification defines the architecture, structure, and content requirements for the VULCA critic knowledge base, which serves as the foundation for generating authentic, scholarly-grounded dialogue content.

---

## ADDED Requirements

### Requirement: KB-001 - Directory Structure

The knowledge base **SHALL** be organized in a hierarchical directory structure that separates critic-specific content from thematic cross-cutting content.

**Directory Layout**:
```
knowledge-base/
├── README.md                    (Overview of knowledge base)
├── critics/                     (Critic-specific materials)
│   ├── su-shi/
│   │   ├── README.md           (Bio and overview)
│   │   ├── poetry.md           (Poetry excerpts)
│   │   ├── art-theory.md       (Art criticism writings)
│   │   ├── key-concepts.md     (Conceptual framework)
│   │   └── references.md       (Bibliography)
│   ├── guo-xi/
│   │   ├── README.md
│   │   ├── lin-quan-gao-zhi.md (《林泉高致》excerpts)
│   │   ├── three-distances.md  (三远法 compositional theory)
│   │   ├── key-concepts.md
│   │   └── references.md
│   ├── john-ruskin/
│   │   ├── README.md
│   │   ├── modern-painters.md  (Excerpts from vols 1-5)
│   │   ├── craftsmanship.md    (Gothic & Arts-and-Crafts theory)
│   │   ├── moral-aesthetics.md
│   │   ├── key-concepts.md
│   │   └── references.md
│   ├── mama-zola/
│   │   ├── README.md
│   │   ├── griot-tradition.md  (West African oral tradition)
│   │   ├── communal-art.md     (African art practices)
│   │   ├── post-colonial.md    (Post-colonial theory)
│   │   ├── key-concepts.md
│   │   └── references.md
│   ├── professor-petrova/
│   │   ├── README.md
│   │   ├── russian-formalism.md (Shklovsky, Eichenbaum)
│   │   ├── defamiliarization.md (остранение theory)
│   │   ├── structuralism.md
│   │   ├── key-concepts.md
│   │   └── references.md
│   └── ai-ethics-reviewer/
│       ├── README.md
│       ├── atlas-of-ai.md      (Kate Crawford)
│       ├── algorithmic-justice.md (Ruha Benjamin, Safiya Noble)
│       ├── tech-ethics.md      (Contemporary debates)
│       ├── key-concepts.md
│       └── references.md
└── themes/                      (Cross-cutting thematic content)
    ├── technique-analysis.md    (Methods for formal analysis)
    ├── authorship-agency.md     (Theories of creative agency)
    ├── tradition-innovation.md  (Continuity and rupture)
    ├── cross-cultural.md        (East-West synthesis)
    └── ethics-ai-art.md         (AI art ethical frameworks)
```

#### Scenario: Developer navigates knowledge base

**Given** a developer needs to find reference materials for 苏轼
**When** they open `knowledge-base/critics/su-shi/`
**Then** they **SHALL** find:
- `README.md` with biography and overview
- `poetry.md` with poetry excerpts and translations
- `art-theory.md` with art criticism essays
- `key-concepts.md` with core theoretical concepts
- `references.md` with complete bibliography

**And** each file **SHALL** use Markdown format with YAML frontmatter

#### Scenario: Developer searches for thematic content

**Given** a developer is generating dialogue about technique
**When** they search the knowledge base
**Then** they **SHALL** find `themes/technique-analysis.md` containing:
- Analysis methods from multiple critics
- Vocabulary for formal description
- Examples of technical critique from historical sources

**And** the theme file **SHALL** cross-reference relevant critic-specific files

---

### Requirement: KB-002 - Markdown File Format

All knowledge base content **SHALL** be stored as Markdown (`.md`) files with YAML frontmatter for metadata.

**Standard Template**:
```markdown
---
critic: su-shi                    # Critic ID (or "multiple" for themes)
source: "东坡诗集"                 # Original source title
source_en: "Collected Poems of Su Shi"
publication_year: 1100            # Approximate
type: poetry                      # Type: poetry | essay | treatise | book | article
theme: [literati-aesthetics, spirit-over-form]  # Relevant themes
url: "https://..."                # Source URL (if available)
accessed: 2025-11-05              # Date accessed
translator: "John Doe"            # Translator name (if applicable)
---

# [Document Title]

## Original Text (原文)

> [Chinese or original language quote]

## Translation (译文/英译)

> [English translation]

## Context (背景)

[Historical and cultural context of the quote...]

## Analysis (分析)

[Academic interpretation and significance...]

## Application to VULCA (应用于VULCA)

[How this material can be used in dialogue generation...]

## Key Concepts (核心概念)

- **神似 (Spiritual Likeness)**: [Definition and explanation...]
- **意境 (Artistic Conception)**: [Definition and explanation...]

## Related Sources (相关资料)

- [Link to other knowledge base files]
- [Citations to scholarly works]
```

#### Scenario: Content creator reads source material

**Given** a content creator opens `knowledge-base/critics/john-ruskin/moral-aesthetics.md`
**When** they read the YAML frontmatter
**Then** they **SHALL** see:
- `critic`: "john-ruskin"
- `source`: "Modern Painters, Volume I"
- `source_en`: "Modern Painters, Volume I"
- `publication_year`: 1843
- `type`: "book"
- `theme`: ["moral-aesthetics", "truth-to-nature"]
- `url`: Link to source text
- `accessed`: Date of research

**And** the document body **SHALL** contain:
- Original English quotes
- Context explaining Ruskin's argument
- Analysis of key concepts
- Application guidance for dialogue generation

#### Scenario: Bilingual content structure

**Given** a critic file contains Chinese source material
**When** the file includes quotes
**Then** it **SHALL** provide both:
- ## Original Text (原文) - Chinese original
- ## Translation (译文/英译) - English translation

**And** all analysis sections **SHALL** be bilingual:
- Chinese explanation followed by English explanation
- Or separate Chinese/English versions clearly marked

---

### Requirement: KB-003 - Quote Volume and Quality

Each critic's knowledge base **SHALL** contain a minimum of **100 high-quality quotes** from primary and secondary sources, with proper attribution and context.

**Quality Criteria**:
1. **Relevance**: Quote must relate to art criticism, aesthetics, or cultural theory
2. **Authenticity**: Quote must be verifiable from authoritative sources
3. **Diversity**: Quotes should cover multiple themes (technique, philosophy, ethics, etc.)
4. **Usability**: Each quote includes context and application guidance

**Distribution Requirements**:
- **Real Historical Critics** (苏轼, 郭熙, John Ruskin):
  - Primary sources: ≥70% (original writings)
  - Secondary sources: ≤30% (scholarly interpretations)

- **Fictional Critics** (Mama Zola, Professor Petrova, AI Ethics Reviewer):
  - Foundational scholar works: ≥60% (Viktor Shklovsky, Kate Crawford, etc.)
  - Supporting theory: ≤40% (related scholars, contemporary debates)

#### Scenario: Developer verifies quote count

**Given** the knowledge base for 苏轼 is complete
**When** a developer counts all quotes across all files in `knowledge-base/critics/su-shi/`
**Then** the total count **SHALL** be ≥100 quotes

**And** at least 70 quotes **SHALL** be from Su Shi's original writings
**And** at most 30 quotes **SHALL** be from scholarly interpretations of Su Shi's work

#### Scenario: Quote verification

**Given** a quote is included in the knowledge base
**When** a developer checks the attribution
**Then** the quote **SHALL** include:
- Source document title
- Publication year
- Page number or chapter (if available)
- URL or archive location
- Translator name (for non-English sources)

**And** the quote **SHALL** be surrounded by context explaining:
- When and why it was written
- What it means in historical context
- How it relates to other concepts

---

### Requirement: KB-004 - Theoretical Frameworks

Each critic's knowledge base **SHALL** document their core theoretical frameworks with **at least 5 key concepts** clearly defined and illustrated.

**Key Concept Template**:
```markdown
## Key Concept: [Concept Name]

### Chinese Term (if applicable)
神似 (shén sì)

### English Translation
Spiritual Likeness

### Definition
[2-3 sentence clear definition...]

### Historical Context
[When and why did this critic use this concept...]

### Examples
[Examples from critic's writings where this concept is applied...]

### Application to AI Art
[How this concept can be applied to analyzing contemporary AI art...]

### Related Concepts
- 形似 (Physical Likeness) - contrasting concept
- 意境 (Artistic Conception) - related concept

### Representative Quotes
> [1-2 quotes exemplifying this concept]
```

#### Scenario: Content generator uses key concepts

**Given** a content generator is writing dialogue for 郭熙
**When** they consult `knowledge-base/critics/guo-xi/key-concepts.md`
**Then** they **SHALL** find at least 5 documented concepts including:
- "三远法" (Three Distances)
- "可行可望可游可居" (Walkable, Viewable, Travelable, Inhabitable)
- "意境" (Artistic Conception)
- "势" (Momentum/Compositional Force)
- "气韵生动" (Vivid Spirit Resonance)

**And** each concept **SHALL** include:
- Chinese and English terminology
- Clear definition
- Historical context
- Examples from original writings
- Application guidance for AI art

#### Scenario: Cross-referencing concepts

**Given** a developer reads about "spirit over form" (神似) in 苏轼's knowledge base
**When** they check related concepts
**Then** they **SHALL** find links to:
- Contrasting concept: "形似" (physical likeness) in same file
- Related concept: "意境" (artistic conception) in same file
- Cross-critic connection: 郭熙's "气韵生动" in `knowledge-base/critics/guo-xi/key-concepts.md`

---

### Requirement: KB-005 - Research Methodology Documentation

The knowledge base **SHALL** include a `METHODOLOGY.md` file documenting the research process, sources used, and quality assurance procedures.

**Required Sections**:
1. **Research Workflow**: Step-by-step process for gathering materials
2. **Source Evaluation Criteria**: How sources were selected and validated
3. **Translation Policy**: Guidelines for translating non-English sources
4. **Citation Standards**: Format for bibliographic references
5. **Quality Assurance**: Review and verification procedures
6. **Limitations**: Known gaps and areas for future research

**File Location**: `knowledge-base/METHODOLOGY.md`

#### Scenario: Researcher validates knowledge base quality

**Given** a researcher wants to assess knowledge base reliability
**When** they open `knowledge-base/METHODOLOGY.md`
**Then** they **SHALL** find documented evidence of:
- Sources consulted (academic databases, archives, libraries)
- Inclusion criteria (peer-reviewed, authoritative translations, etc.)
- Exclusion criteria (Wikipedia, SparkNotes, blog posts)
- Translation approach (professional translations preferred, Google Translate only for gist)
- Verification methods (cross-checking with multiple sources)

**And** the document **SHALL** list known limitations such as:
- Unavailable sources (out-of-print books, paywalled articles)
- Translation gaps (untranslated Chinese classical texts)
- Interpretation biases (Western-centric scholarship on Chinese art)

---

### Requirement: KB-006 - Version Control and Updates

The knowledge base **SHALL** be managed in Git with clear versioning, and updates **SHALL** follow a documented change management process.

**Versioning Strategy**:
- **Major version** (1.0.0 → 2.0.0): Structural changes, new critics added
- **Minor version** (1.0.0 → 1.1.0): New content added (new quotes, concepts)
- **Patch version** (1.0.0 → 1.0.1): Corrections (typos, citation fixes)

**Version documented in**: `knowledge-base/VERSION.md`

**Change Management**:
1. All updates committed to Git with descriptive commit messages
2. Significant updates documented in `CHANGELOG.md`
3. Reviewed by at least one other person before merge
4. Dialogue content referencing updated knowledge base should be regenerated

#### Scenario: Knowledge base version tracking

**Given** the knowledge base is at version 1.0.0
**When** a developer adds 50 new quotes for John Ruskin
**Then** they **SHALL**:
1. Update `knowledge-base/VERSION.md` to 1.1.0
2. Add entry to `knowledge-base/CHANGELOG.md`:
   ```markdown
   ## [1.1.0] - 2025-11-12
   ### Added
   - 50 additional quotes from "Stones of Venice" for john-ruskin
   - New section on Gothic craftsmanship theory
   ```
3. Commit with message: "feat(kb): Add 50 Ruskin quotes from Stones of Venice"

#### Scenario: Updating dialogue content after KB changes

**Given** knowledge base for 苏轼 is updated with new poetry excerpts (v1.0.0 → v1.1.0)
**When** the update is committed
**Then** a note **SHALL** be added to project board:
- "Consider regenerating artwork-5 dialogue (uses Su Shi) to incorporate new v1.1.0 quotes"

**And** next time artwork-5 dialogue is regenerated, it **SHALL** reference the updated knowledge base

---

## MODIFIED Requirements

_No existing requirements are modified by this specification._

---

## REMOVED Requirements

_No existing requirements are removed by this specification._

---

## Dependencies

- **Tools**: WebSearch (Claude Code built-in tool) for research
- **Standards**: Markdown formatting, YAML frontmatter syntax
- **Version Control**: Git repository with commit history

---

## Validation Criteria

### Automated Checks

```bash
# Check directory structure exists
test -d knowledge-base/critics/su-shi
test -d knowledge-base/critics/guo-xi
test -d knowledge-base/critics/john-ruskin
test -d knowledge-base/critics/mama-zola
test -d knowledge-base/critics/professor-petrova
test -d knowledge-base/critics/ai-ethics-reviewer
test -d knowledge-base/themes

# Check required files exist for each critic
for critic in su-shi guo-xi john-ruskin mama-zola professor-petrova ai-ethics-reviewer; do
  test -f knowledge-base/critics/$critic/README.md
  test -f knowledge-base/critics/$critic/key-concepts.md
  test -f knowledge-base/critics/$critic/references.md
done

# Check metadata files exist
test -f knowledge-base/README.md
test -f knowledge-base/METHODOLOGY.md
test -f knowledge-base/VERSION.md
test -f knowledge-base/CHANGELOG.md

# Validate YAML frontmatter in files
find knowledge-base -name "*.md" -type f -exec grep -q "^---$" {} \;

# Count quotes (example for su-shi)
grep -r "^>" knowledge-base/critics/su-shi/ | wc -l  # Should be ≥100
```

### Manual Review Checklist

- [ ] All 6 critics have complete knowledge bases with ≥100 quotes
- [ ] Quotes are from authoritative sources with proper attribution
- [ ] Each critic has ≥5 key concepts documented
- [ ] Bilingual content (Chinese + English) where appropriate
- [ ] `METHODOLOGY.md` documents research process
- [ ] `VERSION.md` and `CHANGELOG.md` up to date
- [ ] All files follow Markdown template with YAML frontmatter
- [ ] Cross-references between related concepts work correctly
- [ ] No broken URLs or missing citations

---

## Examples

### Example 1: Su Shi Art Theory File

File: `knowledge-base/critics/su-shi/art-theory.md`

```markdown
---
critic: su-shi
source: "跋汉杰画山"
source_en: "Colophon on Han Jie's Mountain Painting"
publication_year: 1085
type: essay
theme: [literati-aesthetics, spirit-over-form]
url: "https://ctext.org/wiki.pl?if=gb&chapter=..."
accessed: 2025-11-05
translator: "Susan Bush"
---

# 论画以形似 (On Judging Painting by Physical Likeness)

## Original Text (原文)

> 论画以形似，见与儿童邻。赋诗必此诗，定非知诗人。诗画本一律，天工与清新。

## Translation (译文)

> To judge painting by physical likeness is to neighbor with children.
> If poetry must be like this [i.e., representational], you're definitely not one who knows poetry.
> Poetry and painting follow the same principle: natural workmanship and fresh clarity.

## Context (背景)

Su Shi wrote this colophon around 1085, during his exile period. He was critiquing the prevailing Tang Dynasty emphasis on verisimilitude (形似) in painting, arguing instead for "spiritual likeness" (神似) that captures the essence rather than mere appearance.

This represents a foundational shift in Chinese art theory, elevating literati painting (文人画) over professional court painting.

## Analysis (分析)

### Key Argument

Su Shi makes a radical claim: judging art by how accurately it depicts reality is childish. True connoisseurs look for:
- **神似 (shén sì)**: Spiritual likeness - capturing the inner essence
- **天工 (tiān gōng)**: Natural workmanship - effortlessness, spontaneity
- **清新 (qīng xīn)**: Fresh clarity - unadorned directness

### Theoretical Significance

This quote establishes the literati painting aesthetic that dominates Chinese art for the next 800 years:
1. **Artist's expression > Technical skill**: The artist's inner cultivation matters more than brush technique
2. **Poetry-painting unity**: Both arts express the literati's refined sensibility
3. **Rejection of professionalism**: Court painters who merely copy nature are inferior to scholar-amateurs who express spirit

## Application to VULCA (应用于VULCA)

When generating dialogue for 苏轼 analyzing AI art, this framework provides core vocabulary:

**Relevant contexts**:
- Discussing whether AI art should aim for photorealism or expressive abstraction
- Evaluating the "spirit" (神) that algorithms might capture vs. mere pixel accuracy
- Comparing algorithmic generation to literati ideals of spontaneity (天工)

**Sample application**:
```javascript
// In generated dialogue
{
  personaId: "su-shi",
  textZh: "观此AI作品，我想起自己所言'论画以形似，见与儿童邻'。若机器只求像素之精确，
          而无艺术家之'神似'，则失之甚远。但若算法能捕捉意境、传达精神，则虽由机械生成，
          亦可称'天工'。",
  references: [
    {
      source: "跋汉杰画山",
      quote: "论画以形似，见与儿童邻",
      file: "knowledge-base/critics/su-shi/art-theory.md"
    }
  ]
}
```

## Key Concepts (核心概念)

### 神似 (Spiritual Likeness)
Capturing the essence, spirit, or inner nature of the subject rather than superficial appearance.

### 形似 (Physical Likeness)
Photographic accuracy, verisimilitude, surface-level replication.

### 文人画 (Literati Painting)
Amateur painting by scholar-officials emphasizing personal expression over professional skill.

## Related Sources (相关资料)

- `knowledge-base/critics/su-shi/poetry.md` - Poetry using similar aesthetic principles
- `knowledge-base/critics/guo-xi/key-concepts.md` - 气韵生动 (related concept)
- `knowledge-base/themes/tradition-innovation.md` - Continuity of literati aesthetics
```

### Example 2: Professor Petrova Russian Formalism File

File: `knowledge-base/critics/professor-petrova/defamiliarization.md`

```markdown
---
critic: professor-petrova
source: "Art as Technique"
source_en: "Art as Technique"
author: "Viktor Shklovsky"
publication_year: 1917
type: essay
theme: [formalism, defamiliarization, perception]
url: "https://warwick.ac.uk/fac/arts/english/currentstudents/undergraduate/modules/fulllist/first/en122/lecturelist-2015-16-2/shklovsky.pdf"
accessed: 2025-11-05
translator: "Lee T. Lemon and Marion J. Reis"
---

# Остранение (Ostranenie / Defamiliarization)

## Original Text (Russian)

> Целью искусства является дать ощущение вещи, как видение, а не как узнавание;
> приемом искусства является прием «остранения» вещей и прием затрудненной формы,
> увеличивающий трудность и долготу восприятия.

## Translation (English)

> "The purpose of art is to impart the sensation of things as they are perceived, not as they are known.
> The technique of art is to make objects 'unfamiliar,' to make forms difficult,
> to increase the difficulty and length of perception."

## Context (背景)

Viktor Shklovsky wrote "Art as Technique" in 1917 during the Russian Formalist movement (1910s-1930s).
Russian Formalists rejected symbolic and sociological interpretations of art, focusing instead on
the formal devices that make literature and art distinct from ordinary language and perception.

Shklovsky's concept of "defamiliarization" (остранение, ostranenie) became the cornerstone of
Formalist theory: art's function is to disrupt habitual perception, forcing us to see the world anew.

## Analysis (分析)

### Core Argument

Shklovsky distinguishes between two modes of experience:
1. **Recognition (узнавание)**: Habitual, automatic perception where we don't truly see things
2. **Seeing (видение)**: Fresh, attentive perception that art enables through defamiliarization

**Example from Tolstoy**: In "Kholstomer," Tolstoy narrates from a horse's perspective, making the human
concept of property ownership seem strange and arbitrary. By defamiliarizing property, Tolstoy forces us
to see its constructed nature.

### Theoretical Significance

Defamiliarization explains art's cognitive function:
- **Against automatization**: Habitual perception becomes unconscious; art disrupts this
- **Prolonged perception**: By making forms difficult, art slows down perception, making it conscious
- **Renewal of experience**: Art restores freshness to a world dulled by routine

### Influence on Art Criticism

Shklovsky's theory influenced:
- **New Criticism** (Anglo-American): Close reading, attention to formal devices
- **Structuralism**: Focus on how texts construct meaning through formal patterns
- **Contemporary media theory**: How new technologies defamiliarize perception

## Application to VULCA (应用于VULCA)

When generating dialogue for Professor Petrova analyzing AI art, this framework provides:

**Relevant contexts**:
- AI art often defamiliarizes the creative process itself (showing training data, revealing algorithms)
- Glitch art uses technical errors to defamiliarize digital aesthetics
- AI-human collaboration makes authorship strange, forcing us to question creative agency

**Sample application**:
```javascript
{
  personaId: "professor-petrova",
  textEn: "Shklovsky wrote that art's purpose is 'to make objects unfamiliar.' This AI artwork achieves
          precisely that—it defamiliarizes the act of painting itself. By exposing the algorithmic process,
          by showing us brushstrokes generated through training data, it makes us see painting not as a
          natural human activity but as a constructed technique. We are forced to perceive, not merely
          recognize, what painting is.",
  references: [
    {
      source: "Art as Technique",
      author: "Viktor Shklovsky",
      quote: "make objects 'unfamiliar'",
      file: "knowledge-base/critics/professor-petrova/defamiliarization.md"
    }
  ]
}
```

## Key Concepts (核心概念)

### Остранение (Defamiliarization)
Making the familiar strange; disrupting habitual perception to force conscious seeing.

### Automatization (Автоматизация)
The process by which repeated experiences become unconscious and mechanical.

### Prolonged Perception (Затрудненная форма)
Art's use of difficult forms to slow down and extend the act of perception.

### Device (Прием)
Formal techniques (metaphor, unusual syntax, narrative perspective) that achieve defamiliarization.

## Related Sources (相关资料)

- `knowledge-base/critics/professor-petrova/russian-formalism.md` - Broader Formalist movement
- `knowledge-base/critics/professor-petrova/structuralism.md` - Influence on structuralism
- `knowledge-base/themes/technique-analysis.md` - Methods for analyzing formal devices
```

---

## Related Specifications

- `deep-dialogue-structure` - Uses knowledge base references in generated messages
- `content-generation-workflow` - Describes how to apply knowledge base during generation

---

## Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-05 | Claude | Initial specification |
