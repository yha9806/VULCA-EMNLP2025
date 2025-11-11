# Specification: Content Generation Workflow

**Capability**: `content-generation-workflow`
**Change**: `expand-dialogue-with-knowledge-base`
**Status**: Draft
**Version**: 1.0.0

---

## Overview

This specification defines the systematic workflow for generating authentic, knowledge base-grounded dialogue content for 30+ artworks (450-500 messages total).

---

## ADDED Requirements

### Requirement: CG-001 - Pre-Generation Research Phase

Before generating dialogue for an artwork, comprehensive research **SHALL** be conducted and documented in a per-artwork research file.

**Research File Template**: `generation-artifacts/artwork-[N]-research.md`

```markdown
---
artwork_id: artwork-15
artwork_title: "[Title]"
artist: "[Artist Name]"
year: 2023
research_date: 2025-11-06
researcher: Claude
---

# Artwork Research: [Title]

## Artist Background
[Artist bio, previous works, artistic philosophy...]

## Artwork Description
- **Medium**: [e.g., AI-generated digital print, robotic installation...]
- **Dimensions**: [e.g., 150cm × 100cm]
- **Technique**: [e.g., GAN training on 10,000 landscape images...]
- **Context**: [e.g., Created for exhibition "X" in 2023...]

## Available Images (7 total)
1. **Overview** - Full artwork view
2. **Detail A** - Upper-left composition elements
3. **Detail B** - Central focal point
4. **Detail C** - Lower-right texture details
5. **Process** - Artist working with equipment
6. **Installation** - Gallery installation view
7. **Comparison** - Similar work by same artist

## Key Themes for Dialogue
1. **Technical** - Algorithm design, training data, visual output
2. **Philosophical** - Agency, authorship, creativity
3. **Aesthetic** - Beauty in computational art, pattern vs. randomness
4. **Cultural** - East-West AI ethics, tradition-innovation tension

## Critic Casting Strategy
- **Chapter 1**: Mama Zola, 苏轼 (diverse initial reactions)
- **Chapter 2**: 郭熙, Professor Petrova (formal analysis)
- **Chapter 3**: AI Ethics Reviewer, 苏轼 (philosophical depth)
- **Chapter 4**: John Ruskin, Professor Petrova (aesthetic judgment)
- **Chapter 5**: All 6 (synthesis and reflection)

## Knowledge Base References (Pre-selected)
- **苏轼**: "论画以形似，见与儿童邻" (spirit over form)
- **郭熙**: 三远法 (compositional principles)
- **John Ruskin**: "Truth to nature" concept
- **Professor Petrova**: Defamiliarization theory
- **AI Ethics**: Kate Crawford on labor in AI systems
- **Mama Zola**: Communal art-making traditions
```

#### Scenario: Research file completeness check

**Given** artwork-20 is ready for dialogue generation
**When** checking pre-generation artifacts
**Then** file `generation-artifacts/artwork-20-research.md` **SHALL** exist

**And** it **SHALL** contain all required sections:
- Artist Background
- Artwork Description (medium, technique, context)
- Available Images (4-8 listed with categories)
- Key Themes (4-5 themes identified)
- Critic Casting Strategy (chapter-by-chapter assignments)
- Knowledge Base References (6+ pre-selected quotes/concepts)

---

### Requirement: CG-002 - Chapter-by-Chapter Generation

Dialogue **SHALL** be generated one chapter at a time, following the 5-chapter structure, with human review checkpoints between chapters.

**Generation Process**:
1. Generate Chapter 1 (3-4 messages) using research file + knowledge base
2. **Checkpoint**: Review for voice authenticity, thematic coherence
3. Generate Chapter 2 (3-4 messages) building on Chapter 1
4. **Checkpoint**: Review technical accuracy, debate quality
5. Generate Chapters 3-5 with checkpoints
6. **Final Review**: Complete dialogue coherence, word count, bilingual quality

#### Scenario: Chapter generation workflow

**Given** artwork-18 research is complete
**When** beginning dialogue generation
**Then** the process **SHALL**:
1. Start with Chapter 1 generation
2. Produce 3-4 messages for Chapter 1
3. Pause for human review
4. Only proceed to Chapter 2 after approval
5. Repeat for remaining chapters

**And** no chapter **SHALL** be generated before the previous chapter is reviewed

---

### Requirement: CG-003 - Voice Authenticity Validation

Each generated message **SHALL** be validated against the critic's knowledge base to ensure authentic voice, vocabulary, and argumentation style.

**Validation Checklist** (per message):
- [ ] Uses vocabulary from critic's knowledge base (check `key-concepts.md`)
- [ ] References at least 1 concept/quote from knowledge base
- [ ] Argumentation style matches critic's documented approach
- [ ] Avoids anachronisms (historical critics don't reference modern concepts unless bridging)
- [ ] Bilingual content is culturally appropriate (not machine-translated)

#### Scenario: Voice validation for 苏轼 message

**Given** a generated message with `personaId`: "su-shi"
**When** validating voice authenticity
**Then** the message **SHALL** use at least 2 of these elements from 苏轼's knowledge base:
- Key concepts: 神似, 形似, 意境, 天工, 诗画一律
- Characteristic phrases: "论画以...", "古人云...", "观此作..."
- Literary references: Tang/Song poetry, classical texts
- Philosophical frameworks: Literati aesthetics, Chan Buddhism influence

**And** the message **MUST NOT** use:
- Contemporary jargon (unless explicitly bridging old/new)
- Western art history terms without context
- Overly technical language (苏轼 is poet-critic, not technician)

---

### Requirement: CG-004 - Dialogue Coherence Review

After completing all 5 chapters, the entire dialogue **SHALL** be reviewed for narrative coherence, ensuring logical progression and satisfying synthesis.

**Coherence Criteria**:
1. **Arc**: Dialogue progresses from observation → analysis → reflection → synthesis
2. **Debate**: At least 2 moments of substantive disagreement (counter/challenge)
3. **Resolution**: Chapter 5 addresses tensions raised in earlier chapters
4. **Callbacks**: Later messages reference earlier arguments
5. **Diversity**: All 6 critics contribute meaningfully (no passive observers)

#### Scenario: Dialogue arc validation

**Given** complete 18-message dialogue for artwork-25
**When** reviewing narrative arc
**Then** the dialogue **SHALL**:
- Start with diverse initial reactions (Chapter 1)
- Develop deeper analysis through debate (Chapters 2-4)
- Synthesize perspectives in Chapter 5

**And** at least 3 messages in Chapter 5 **SHALL** explicitly reference arguments from Chapters 1-4

---

### Requirement: CG-005 - Batch Generation Tracking

Progress on generating 30+ artworks **SHALL** be tracked in a generation log with status, word count, and quality notes.

**Log File**: `generation-artifacts/GENERATION_LOG.md`

```markdown
# Dialogue Generation Log

| Artwork | Status | Messages | Words (ZH) | Words (EN) | Quality | Generated Date | Reviewer |
|---------|--------|----------|------------|------------|---------|----------------|----------|
| artwork-1 | ✅ Complete | 18 | 2,340 | 2,180 | ⭐⭐⭐⭐⭐ | 2025-11-01 | Claude |
| artwork-2 | ✅ Complete | 16 | 2,010 | 1,920 | ⭐⭐⭐⭐ | 2025-11-02 | Claude |
| artwork-5 | 🟡 In Progress (Ch 3/5) | 10 | 1,250 | 1,180 | - | 2025-11-06 | Claude |
| artwork-6 | ⚪ Not Started | - | - | - | - | - | - |
...
```

#### Scenario: Generation log update

**Given** artwork-12 dialogue is completed
**When** updating the generation log
**Then** the log entry **SHALL** include:
- ✅ Complete status
- Message count (15-20)
- Total word counts for Chinese and English
- Quality rating (⭐⭐⭐⭐⭐ = 5 stars max)
- Generation date
- Reviewer name (Claude or human reviewer)

---

### Requirement: CG-006 - Quality Assurance Sampling

Every 5th generated dialogue **SHALL** undergo detailed quality assurance review by a human domain expert (if available) or comprehensive automated checks.

**QA Review Checklist**:
- [ ] Voice authenticity (all 6 critics sound distinct)
- [ ] Knowledge base grounding (≥60% messages have verifiable references)
- [ ] Bilingual quality (both texts read naturally)
- [ ] Image synchronization (all `highlightImage` references are valid)
- [ ] Dialogue coherence (narrative arc is satisfying)
- [ ] Technical correctness (no factual errors about artwork)

#### Scenario: QA sampling trigger

**Given** artworks 5, 10, 15, 20, 25, 30 are completed
**When** checking QA schedule
**Then** each of these dialogues **SHALL** be marked for QA review

**And** a QA report file **SHALL** be created for each:
- `generation-artifacts/qa-reports/artwork-5-qa.md`
- `generation-artifacts/qa-reports/artwork-10-qa.md`
- etc.

---

### Requirement: CG-007 - Regeneration Protocol

If a dialogue fails quality checks, a **structured regeneration protocol** **SHALL** be followed to identify and fix specific issues.

**Regeneration Steps**:
1. **Identify failure mode**: Voice? Coherence? Knowledge base grounding?
2. **Isolate affected chapters**: Which chapters need regeneration?
3. **Revise research file**: Update critic casting or theme selection if needed
4. **Regenerate specific chapters**: Only regenerate failed chapters, keep good ones
5. **Re-review**: Validate fixes address original issues

#### Scenario: Partial dialogue regeneration

**Given** artwork-22 dialogue fails QA due to weak Chapter 3 (philosophy)
**When** initiating regeneration
**Then** the process **SHALL**:
1. Keep Chapters 1, 2, 4, 5 (mark as "frozen")
2. Regenerate only Chapter 3 with improved philosophical depth
3. Ensure new Chapter 3 connects to existing Chapter 2 and Chapter 4
4. Update generation log with "Regenerated Ch 3" note

---

## MODIFIED Requirements

_No existing requirements are modified._

---

## REMOVED Requirements

_No existing requirements are removed._

---

## Dependencies

- **knowledge-base-architecture**: Provides reference materials for generation
- **deep-dialogue-structure**: Defines target structure for generated dialogues
- **image-dialogue-sync**: Requires image assignments during generation

---

## Validation Criteria

```bash
# Check research files exist for all artworks
for i in {5..34}; do
  test -f generation-artifacts/artwork-$i-research.md
done

# Check generation log exists and is up-to-date
test -f generation-artifacts/GENERATION_LOG.md
grep "artwork-34" generation-artifacts/GENERATION_LOG.md

# Check QA reports for sampled artworks
test -f generation-artifacts/qa-reports/artwork-5-qa.md
test -f generation-artifacts/qa-reports/artwork-10-qa.md
# ...

# Validate generated dialogue files exist
for i in {5..34}; do
  test -f js/data/dialogues/artwork-$i.js
done
```

---

## Related Specifications

- `knowledge-base-architecture` - Source of reference materials
- `deep-dialogue-structure` - Target format for generated content
- `image-dialogue-sync` - Image assignment during generation

---

## Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-05 | Claude | Initial specification |
