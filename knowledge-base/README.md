# VULCA Knowledge Base

**Version**: 1.0.0 (Initial Release)
**Created**: 2025-11-05
**Status**: Active Development

---

## Overview

This knowledge base provides scholarly reference materials for VULCA's 6 critic personas, enabling authentic, knowledge-grounded dialogue generation.

**Scope**: Reference materials for deep dialogue system (15-20 messages per artwork)

---

## Structure

```
knowledge-base/
├── README.md (this file)
├── VERSION.md
├── METHODOLOGY.md
├── CHANGELOG.md
├── critics/              # Critic-specific materials
│   ├── su-shi/
│   ├── guo-xi/
│   ├── john-ruskin/
│   ├── mama-zola/
│   ├── professor-petrova/
│   └── ai-ethics-reviewer/
└── themes/               # Cross-cutting themes
    ├── technique-analysis.md
    ├── authorship-agency.md
    ├── tradition-innovation.md
    ├── cross-cultural.md
    └── ethics-ai-art.md
```

---

## Critics

### Real Historical Figures

1. **苏轼 (Su Shi, 1037-1101)** - Northern Song literati, poet, calligrapher
   - Focus: Literati aesthetics, "spirit over form" (神似重于形似)
   - Key works: Poetry, art theory essays

2. **郭熙 (Guo Xi, 1020-1100)** - Northern Song landscape master
   - Focus: Technical analysis, formal composition
   - Key works: 《林泉高致》(The Lofty Message of Forests and Streams)

3. **John Ruskin (1819-1900)** - Victorian art critic
   - Focus: Truth to nature, moral aesthetics, craftsmanship
   - Key works: "Modern Painters," "The Stones of Venice"

### Fictional Personas (Inspired by Real Scholars)

4. **Mama Zola** - West African oral tradition
   - Inspired by: Chinua Achebe, Ngugi wa Thiong'o
   - Focus: Communal art-making, post-colonial theory

5. **Professor Elena Petrova** - Russian Formalism
   - Inspired by: Viktor Shklovsky, Boris Eichenbaum
   - Focus: Defamiliarization (остранение), structural analysis

6. **AI Ethics Reviewer** - Contemporary tech ethics
   - Inspired by: Kate Crawford, Ruha Benjamin, Safiya Noble
   - Focus: Algorithmic justice, labor in AI systems

---

## Content Standards

### Quote Volume (Adjusted for Phase 1)
- **Target**: 50-70 core quotes per critic (300-420 total)
- **Real critics**: ≥70% primary sources (original writings)
- **Fictional critics**: ≥60% foundational scholar works

### File Format
- All content in **Markdown** with **YAML frontmatter**
- Bilingual: Chinese + English (where applicable)
- Complete citations with source, year, page/chapter

### Required Files per Critic
- `README.md` - Biography and overview
- `key-concepts.md` - 5+ core theoretical concepts
- `references.md` - Complete bibliography
- Content files (poetry.md, art-theory.md, etc.)

---

## Usage

This knowledge base supports:
1. **Dialogue Generation**: Reference quotes and concepts when creating critic messages
2. **Voice Validation**: Check that generated content matches critic's vocabulary and argumentation style
3. **Research**: Understand critic's theoretical frameworks and historical context

---

## Maintenance

- **Version**: Tracked in `VERSION.md` (semantic versioning)
- **Changes**: Documented in `CHANGELOG.md`
- **Methodology**: Research process documented in `METHODOLOGY.md`

---

## Related Documentation

- `/docs/adding-artwork-dialogues.md` - How to use knowledge base for dialogue generation
- `/openspec/changes/expand-dialogue-with-knowledge-base/` - Full specification

---

**Last Updated**: 2025-11-05
**Status**: Phase 1 - Initial construction (6 critics × 50-70 quotes)
