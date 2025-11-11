# Proposal: Expand Dialogue System with Knowledge Base

**Change ID**: `expand-dialogue-with-knowledge-base`
**Status**: Proposed
**Created**: 2025-11-05
**Author**: Claude (AI Assistant)

---

## What Changes

This proposal transforms the VULCA dialogue system from 4 artworks with fragmented threads to 30+ artworks with comprehensive, knowledge base-grounded deep dialogues.

**Core Changes**:
1. **Knowledge Base Foundation** - Build reference libraries for all 6 critics with 600+ scholarly quotes
2. **Deep Dialogue Structure** - Transform from 6 short threads (30-36 messages) to single 15-20 message comprehensive dialogues with 5-chapter structure
3. **Image Synchronization** - Link 7-8 images per artwork to specific dialogue moments with automatic highlighting
4. **Content Generation Workflow** - Systematic process for generating 450-500 authentic messages using knowledge base references
5. **Data Structure Extensions** - Add `chapters`, `highlightImage`, `imageAnnotation`, and `references` fields

---

## Why

### Current State

The VULCA exhibition platform currently has:
- **4 artworks** with dialogue content
- **6 dialogue threads per artwork** (6 threads × 5-6 messages = 30-36 messages/artwork)
- **Multiple short threads** covering different topics (technique, philosophy, culture, etc.)
- **Limited critic knowledge base** - personas are defined with basic bios but lack deep reference materials
- **No systematic content generation workflow** - dialogue content is manually created without structured knowledge references

### The Problem

With plans to expand to **30+ artworks**, the current approach faces critical challenges:

1. **Scalability Crisis**: Manually creating 30-36 messages × 30 artworks = 900-1080 messages without a systematic approach is unsustainable

2. **Authenticity Challenge**:
   - Real historical critics (苏轼, 郭熙, John Ruskin) lack authentic voice grounding in their original writings
   - Fictional critics (Mama Zola, Professor Petrova, AI Ethics Reviewer) lack clear theoretical foundations
   - Risk of generic, surface-level commentary that doesn't reflect each persona's unique perspective

3. **Fragmented Experience**:
   - Multiple short threads (6 threads/artwork) create cognitive fragmentation
   - Users lose narrative continuity across topics
   - Difficult to appreciate the depth and evolution of critical discourse

4. **Image-Dialogue Disconnect**:
   - Artworks have multiple images (7-8 per work) but no synchronization with dialogue progression
   - Users can't understand which image is being discussed at each moment
   - Lost opportunity for detailed visual analysis tied to specific dialogue points

### Why This Matters

- **Exhibition Depth**: 30+ artworks require comprehensive, authentic critical engagement to maintain quality
- **Educational Value**: Authentic voices grounded in real scholarly work provide genuine learning experiences
- **User Experience**: Single, coherent deep dialogues (15-20 messages) create immersive narrative flow
- **Academic Integrity**: VULCA is an EMNLP 2025 research project - content quality must be rigorous and defensible

---

## How

### Three-Pillar Architecture

#### Pillar 1: Knowledge Base Foundation

**Build comprehensive reference libraries for all 6 critics**:

**Real Historical Figures** (联网检索原始著作):
- **苏轼 (Su Shi, 1037-1101)**:
  - Poetry collections (《东坡诗集》)
  - Essays on art theory (《书摩诘画》, 《跋汉杰画山》)
  - Calligraphy theory writings
  - Focus: Literati aesthetics, "spirit over form" (神似重于形似)

- **郭熙 (Guo Xi, 1020-1100)**:
  - 《林泉高致》(The Lofty Message of Forests and Streams) - Complete text
  - Landscape painting theory
  - "Three Distances" (三远法) compositional principles
  - Focus: Technical analysis, formal composition

- **John Ruskin (1819-1900)**:
  - "Modern Painters" (Vol. 1-5) - Key excerpts
  - "The Stones of Venice" - Gothic craftsmanship theory
  - "The Seven Lamps of Architecture" - Moral aesthetics
  - Focus: Truth to nature, moral dimension of art, craftsmanship

**Fictional Personas** (联网检索背景学者作品):
- **Mama Zola** (West African oral tradition):
  - Research on griot tradition and oral storytelling
  - African communal art practices
  - Post-colonial cultural theory
  - Inspired by: Chinua Achebe, Ngugi wa Thiong'o

- **Professor Elena Petrova** (Russian Formalism):
  - Viktor Shklovsky's "Art as Technique" and "defamiliarization" (остранение)
  - Russian Formalist theory (Eichenbaum, Tynyanov)
  - Structuralist approaches to visual analysis
  - Inspired by: Viktor Shklovsky, Boris Eichenbaum

- **AI Ethics Reviewer** (Contemporary tech ethics):
  - Kate Crawford's "Atlas of AI" - Labor, power, and planetary costs
  - Ruha Benjamin's "Race After Technology"
  - Contemporary AI ethics scholarship
  - Inspired by: Kate Crawford, Safiya Noble, Ruha Benjamin

**Knowledge Base Storage**:
- Store as markdown files in `knowledge-base/critics/[persona-id]/`
- Include source citations, key quotes, theoretical frameworks
- Tag by themes: technique, philosophy, ethics, tradition, innovation

#### Pillar 2: Deep Dialogue Structure

**Transform from fragmented threads to single comprehensive dialogue**:

**New Format: 15-20 Message Single Thread per Artwork**

5-Chapter Dramatic Structure:
1. **Chapter 1: 初见印象 (First Impressions)** (3-4 messages)
   - Initial observations, immediate reactions
   - Establishing the artwork's core visual elements
   - Setting up key questions or tensions

2. **Chapter 2: 技法解析 (Technical Analysis)** (3-4 messages)
   - Formal analysis: composition, color, materials, technique
   - Comparison to historical precedents
   - Technical innovation or mastery

3. **Chapter 3: 哲学思辨 (Philosophical Reflection)** (3-4 messages)
   - Deeper conceptual questions: agency, authorship, meaning
   - Theoretical frameworks applied to the work
   - Existential or metaphysical dimensions

4. **Chapter 4: 美学评判 (Aesthetic Judgment)** (3-4 messages)
   - Evaluation of artistic merit
   - Comparison to aesthetic traditions (Eastern/Western)
   - Discussions of beauty, sublime, emotion

5. **Chapter 5: 文化对话 (Cultural Dialogue)** (3-4 messages)
   - Cross-cultural synthesis
   - Contemporary relevance
   - Future implications for art and technology

**Critic Role Distribution**:
- Each critic appears 2-4 times across the 15-20 messages
- Strategic casting based on chapter themes:
  - Technical Analysis: 郭熙, John Ruskin (formalist expertise)
  - Philosophy: 苏轼, AI Ethics Reviewer, Professor Petrova (theoretical depth)
  - Cultural Dialogue: Mama Zola, 苏轼, John Ruskin (cross-cultural perspective)

**Interaction Types** (preserved from current system):
- `initial` - Opens new topic
- `agree-extend` - Builds on previous argument with quote
- `question-challenge` - Raises doubts or counterarguments
- `counter` - Direct rebuttal with evidence
- `synthesize` - Integrates multiple perspectives
- `reflect` - Personal philosophical reflection

#### Pillar 3: Image-Dialogue Synchronization

**Link 7-8 images per artwork to specific dialogue moments**:

**Image Categories**:
1. **Overview** (1 image) - Full artwork, sets context
2. **Detail A-D** (4-5 images) - Close-ups of specific areas
3. **Process** (1 image) - Creation process or artist at work
4. **Context** (1 image) - Installation view or comparative artwork

**Synchronization Mechanism**:
- Add `highlightImage` field to message data structure
- Add `chapterNumber` (1-5) to each message
- Add `imageAnnotation` (optional) - Text overlay explaining what to look at

**Example**:
```javascript
{
  id: "msg-artwork-5-1-3",
  personaId: "guo-xi",
  textZh: "看这局部的笔触处理...",
  textEn: "Observe the brushwork in this detail...",
  timestamp: 6000,
  chapterNumber: 2,  // Technical Analysis chapter
  highlightImage: "artwork-5-detail-b.jpg",
  imageAnnotation: {
    zh: "放大细节：左下角笔触的提按变化",
    en: "Detail zoom: Lift-and-press variation in lower-left brushwork"
  },
  interactionType: "agree-extend",
  // ... other fields
}
```

---

## Implementation Approach

### Phase 1: Knowledge Base Construction (Week 1-2)

**Research & Collection**:
1. Use Claude Code's **WebSearch** tool to find:
   - Original texts and translations for real critics
   - Scholarly works for fictional persona foundations
   - Contemporary AI ethics papers

2. Extract and organize:
   - Key theoretical concepts
   - Representative quotes (100-200 per critic)
   - Analytical frameworks
   - Common themes and concerns

3. Store in structured markdown:
   ```
   knowledge-base/
   ├── critics/
   │   ├── su-shi/
   │   │   ├── bio.md
   │   │   ├── poetry-excerpts.md
   │   │   ├── art-theory.md
   │   │   └── key-concepts.md
   │   ├── guo-xi/
   │   │   ├── lin-quan-gao-zhi.md  (《林泉高致》)
   │   │   ├── three-distances.md
   │   │   └── landscape-principles.md
   │   ├── john-ruskin/
   │   │   ├── modern-painters-excerpts.md
   │   │   ├── craftsmanship-theory.md
   │   │   └── moral-aesthetics.md
   │   ├── mama-zola/
   │   │   ├── griot-tradition.md
   │   │   ├── african-communal-art.md
   │   │   └── post-colonial-theory.md
   │   ├── professor-petrova/
   │   │   ├── russian-formalism.md
   │   │   ├── defamiliarization.md
   │   │   └── structuralist-analysis.md
   │   └── ai-ethics-reviewer/
   │       ├── atlas-of-ai-summary.md
   │       ├── algorithmic-justice.md
   │       └── contemporary-tech-ethics.md
   └── themes/
       ├── technique-analysis.md
       ├── authorship-agency.md
       ├── tradition-innovation.md
       └── cross-cultural-synthesis.md
   ```

### Phase 2: Content Generation System (Week 3-4)

**Dialogue Generation Workflow**:

1. **Pre-Generation Research**:
   - For each artwork, gather:
     - Artist background and statement
     - Technical details (medium, year, dimensions)
     - 7-8 high-quality images with descriptions
     - Art historical context

2. **Chapter-by-Chapter Generation** (using knowledge base):
   - Chapter 1 (初见印象): Start with overview image, immediate reactions
   - Chapter 2 (技法解析): Use detail images, technical analysis
   - Chapter 3 (哲学思辨): Abstract concepts, theoretical frameworks
   - Chapter 4 (美学评判): Evaluative discourse, comparative analysis
   - Chapter 5 (文化对话): Synthesis, contemporary relevance

3. **Voice Authenticity Checks**:
   - Cross-reference each critic's messages with knowledge base
   - Ensure vocabulary, concepts, and argumentation style match source materials
   - Include 1-2 direct quotes or paraphrases per message (properly attributed)

4. **Pre-generated Data Structure**:
   - Store in `js/data/dialogues/artwork-[N].js` (N = 5 to 34)
   - Single export: `export const artworkNDialogue = { ... }`
   - No separate threads - one continuous 15-20 message dialogue

**Example Generated Message** (using knowledge base):
```javascript
{
  id: "msg-artwork-5-1-8",
  personaId: "john-ruskin",
  textZh: `这让我想起《现代画家》第一卷中的论述："伟大艺术的目的不在于欺骗眼睛，而在于唤醒心灵。"（The purpose of great art is not to deceive the eye, but to awaken the soul.）此作虽借助算法，但它确实唤醒了我们对创作本质的思考——这便是它的道德价值所在。`,
  textEn: `This reminds me of my argument in "Modern Painters" Volume I: "The purpose of great art is not to deceive the eye, but to awaken the soul." Though this work employs algorithms, it indeed awakens our reflection on the nature of creation—therein lies its moral value.`,
  timestamp: 21000,
  chapterNumber: 4,  // Aesthetic Judgment
  highlightImage: "artwork-5-overview.jpg",
  replyTo: "professor-petrova",
  interactionType: "reflect",
  quotedText: "道德价值"
}
```

### Phase 3: Image Synchronization Implementation (Week 5)

1. **Extend Artwork Data Structure**:
```javascript
{
  id: "artwork-5",
  titleZh: "...",
  titleEn: "...",
  artist: "...",
  year: 2023,
  images: [
    {
      id: "artwork-5-overview",
      url: "/assets/artwork-5/overview.jpg",
      category: "overview",
      titleZh: "作品全景",
      titleEn: "Full View",
      relatedChapter: 1,
      relatedMessages: ["msg-artwork-5-1-1", "msg-artwork-5-1-2"]
    },
    {
      id: "artwork-5-detail-a",
      url: "/assets/artwork-5/detail-a.jpg",
      category: "detail",
      titleZh: "细节 A：左上角笔触",
      titleEn: "Detail A: Upper-left Brushwork",
      relatedChapter: 2,
      relatedMessages: ["msg-artwork-5-1-5", "msg-artwork-5-1-6"]
    },
    // ... 5-6 more images
  ]
}
```

2. **Image Gallery Component**:
   - Create `js/components/image-gallery.js`
   - Listens to `DialoguePlayer` message reveal events
   - Automatically switches to `highlightImage` when message is revealed
   - Shows image annotation overlay if present

3. **CSS Transitions**:
   - Smooth image transitions (500ms crossfade)
   - Highlight effect for image annotation areas
   - Mobile-responsive layout (image above dialogue on small screens)

### Phase 4: Pilot Content Generation (Week 6)

**Generate dialogues for 5 pilot artworks**:
1. Select diverse artworks:
   - Traditional painting (to leverage 苏轼/郭熙 expertise)
   - AI-generated art (to leverage AI Ethics Reviewer)
   - Installation art (to leverage Mama Zola's communal perspective)
   - Digital sculpture (to leverage Professor Petrova's formalism)
   - Performance art (cross-cutting themes)

2. Generate 15-20 messages each (75-100 total messages)

3. Quality assurance:
   - Verify voice authenticity against knowledge base
   - Check chapter narrative flow
   - Test image-dialogue synchronization
   - User testing with 3-5 test viewers

4. Iterate based on feedback

### Phase 5: Full Scale-Up (Week 7-10)

**Generate remaining 25 artworks** (375-475 messages):
- Batch generation: 5 artworks/week
- Continuous quality checks
- Document generation patterns for future consistency

### Phase 6: Integration & Testing (Week 11)

1. Integrate all generated dialogues into `js/data/dialogues/`
2. Update `DialoguePlayer` component to handle chapter navigation
3. Implement image gallery synchronization
4. Cross-browser testing
5. Performance optimization (lazy loading for 30+ artworks)

---

## Impact & Benefits

### User Experience
- **Immersive Narratives**: Single 15-20 message dialogues create engaging story arcs
- **Visual-Textual Synergy**: Image synchronization enhances understanding
- **Authentic Voices**: Knowledge base-grounded content provides genuine critical perspectives
- **Educational Depth**: 450-500 high-quality messages offer comprehensive art education

### Project Quality
- **Academic Rigor**: Systematic knowledge base ensures scholarly credibility
- **Scalability**: Clear workflow enables consistent quality across 30+ artworks
- **Maintainability**: Structured knowledge base allows easy updates and fact-checking
- **Reproducibility**: Documented generation process supports EMNLP publication standards

### Technical Benefits
- **Pre-generated Content**: No runtime API calls, stable and fast
- **Modular Architecture**: Knowledge base, dialogue data, and UI components are independent
- **Future-Proof**: Knowledge base can be reused for other VULCA applications (e.g., chatbot, recommendation system)

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| **Voice Authenticity**: Critics sound generic | Rigorous knowledge base construction; 1-2 source quotes per message |
| **Content Volume**: 450-500 messages overwhelming | Pilot phase with 5 artworks first; iterate before scaling |
| **Research Time**: WebSearch yields low-quality sources | Use academic databases; focus on canonical texts; validate with domain experts |
| **Image Availability**: Not all artworks have 7-8 images | Accept 4-6 images minimum; use placeholder system (already implemented) |
| **Technical Complexity**: Image sync adds UI overhead | Progressive enhancement: work without images, enhance with images |

---

## Success Metrics

1. **Knowledge Base Completeness**:
   - 100-200 key quotes per critic
   - 5-10 theoretical concepts documented per critic
   - All 6 critics have comprehensive reference libraries

2. **Content Quality**:
   - 90%+ of messages include verifiable references to knowledge base
   - User testing shows distinct voice recognition for each critic
   - Average message length: 100-150 words (thoughtful depth)

3. **User Engagement**:
   - Average dialogue completion rate >60% (users read 60%+ of messages)
   - Image-dialogue synchronization reduces confusion (user testing feedback)
   - Time-on-site increases by 50%+ compared to current 4-artwork version

4. **Technical Performance**:
   - Page load time <3 seconds for 30 artworks
   - Image transitions <500ms
   - No runtime API calls (all pre-generated)

---

## Dependencies & Prerequisites

- **Claude Code Tools**: WebSearch for knowledge base research
- **Existing Systems**:
  - `DialoguePlayer` component (already implemented)
  - Placeholder image system (already implemented)
  - Natural dialogue flow with thought chains (already implemented)
- **New Components**:
  - `ImageGallery` component (to be developed)
  - Chapter navigation UI (to be developed)
  - Knowledge base markdown files (to be created)

---

## Timeline

| Week | Phase | Deliverables |
|------|-------|--------------|
| 1-2  | Knowledge Base Construction | 6 critic knowledge bases complete |
| 3-4  | Content Generation System | Generation workflow documented; templates created |
| 5    | Image Synchronization | ImageGallery component; data structure extensions |
| 6    | Pilot Content | 5 artworks × 15-20 messages = 75-100 messages |
| 7-10 | Scale-Up | 25 artworks × 15-20 messages = 375-475 messages |
| 11   | Integration & Testing | Full system integrated and tested |

**Total Duration**: 11 weeks

---

## Next Steps

1. **Approve this proposal** → Proceed to detailed design document
2. **Validate approach** → Discuss with user any concerns or modifications
3. **Create detailed specs** → Break down into specific requirements with BDD scenarios
4. **Begin Phase 1** → Start knowledge base research using WebSearch

---

## Related Documents

- **Design Document**: `design.md` (to be created)
- **Task Breakdown**: `tasks.md` (to be created)
- **Specifications**:
  - `specs/knowledge-base-architecture/spec.md`
  - `specs/deep-dialogue-structure/spec.md`
  - `specs/image-dialogue-sync/spec.md`
  - `specs/content-generation-workflow/spec.md`
