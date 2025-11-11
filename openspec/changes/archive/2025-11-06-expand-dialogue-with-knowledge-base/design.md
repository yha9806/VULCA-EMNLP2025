# Design Document: Expand Dialogue System with Knowledge Base

**Change ID**: `expand-dialogue-with-knowledge-base`
**Status**: Design Phase
**Last Updated**: 2025-11-05

---

## Design Overview

This document captures the architectural decisions, technical choices, and trade-offs for expanding the VULCA dialogue system from 4 artworks to 30+ artworks with knowledge base-grounded content.

---

## Architectural Decisions

### AD-1: Knowledge Base Storage Format

**Decision**: Store knowledge base as **structured Markdown files** with YAML frontmatter

**Options Considered**:

**A. Markdown Files with YAML Frontmatter** ✅ SELECTED
```markdown
---
critic: su-shi
source: "东坡诗集"
type: poetry
theme: literati-aesthetics
---

# 苏轼论画

原文：
> 论画以形似，见与儿童邻。

译文：
> To judge painting by physical likeness is to neighbor with children.

分析：
苏轼强调"神似"重于"形似"，这是文人画理论的核心...
```

**Pros**:
- Human-readable and editable
- Version control friendly (Git diffs)
- Easy to add annotations and commentary
- Markdown supports formatting, quotes, code blocks
- YAML frontmatter enables structured metadata

**Cons**:
- Not directly queryable (need parsing layer)
- Less structured than database
- Slower search than indexed database

**B. JSON Database**
```json
{
  "quotes": [
    {
      "id": "su-shi-001",
      "critic": "su-shi",
      "source": "东坡诗集",
      "text": "论画以形似，见与儿童邻。",
      "theme": ["literati-aesthetics", "spirit-over-form"]
    }
  ]
}
```

**Pros**:
- Structured and queryable
- Easy to parse programmatically
- Can be indexed for fast search

**Cons**:
- Hard to read/edit for humans
- Poor version control (large diffs)
- Difficult to include commentary or annotations
- No rich formatting (bold, italics, links)

**C. SQLite Database**

**Pros**:
- Full SQL query capabilities
- Indexed search
- Relational structure

**Cons**:
- Binary format (no version control)
- Overkill for read-only reference data
- Adds complexity (requires database management)
- Not human-editable

**Rationale for Selection**:
- **Human-first**: Researchers need to read, verify, and annotate sources
- **Academic Rigor**: Markdown allows extensive citations and commentary
- **Simplicity**: No database infrastructure needed
- **Version Control**: Track changes to knowledge base over time
- **Future-Proof**: Markdown is universal and future-proof

**Implementation**:
```
knowledge-base/
├── critics/
│   ├── su-shi/
│   │   ├── README.md              (Overview and bio)
│   │   ├── poetry.md              (Poetry excerpts)
│   │   ├── art-theory.md          (Art criticism writings)
│   │   └── key-concepts.md        (Conceptual framework)
│   └── [other critics...]
└── themes/
    ├── technique-analysis.md
    ├── authorship-agency.md
    └── [other themes...]
```

---

### AD-2: Content Generation Approach

**Decision**: **Pre-generate all dialogue content using Claude Code** (no runtime generation)

**Options Considered**:

**A. Pre-generated Content (Claude Code)** ✅ SELECTED
- Claude Code (this AI assistant) generates all 450-500 messages during development
- Content stored in `js/data/dialogues/artwork-[N].js`
- No API calls at runtime
- Content reviewed and edited before deployment

**Pros**:
- **Stable**: Content never changes, no API failures
- **Fast**: No latency, no rate limits
- **Cost-effective**: No per-user API costs
- **Quality Control**: Human review possible before deployment
- **Offline-capable**: Exhibition works without internet
- **Academic Integrity**: Content is citable and reproducible

**Cons**:
- **Upfront effort**: Significant time to generate 450-500 messages
- **Less dynamic**: Can't adapt to new artworks without redeployment
- **Storage**: Larger codebase (~1-2MB for all dialogues)

**B. Runtime Generation (GPT API)**
- User visits artwork page → API call to GPT-4
- Generate critique in real-time based on artwork metadata
- Store in browser cache

**Pros**:
- Dynamic and adaptive
- Easy to add new artworks
- Can incorporate user preferences

**Cons**:
- **Unstable**: API failures break experience
- **Expensive**: $0.01-0.10 per dialogue generation × users
- **Slow**: 5-10 second wait for generation
- **Quality variance**: Each generation slightly different
- **Academic problem**: Content not reproducible for research
- **Voice consistency**: Hard to maintain persona voices across generations

**C. Hybrid (Pre-generated + Optional Regeneration)**
- Default: Use pre-generated content
- Advanced users: Button to "regenerate with different perspective"
- API call only on user request

**Pros**:
- Best of both worlds
- Flexibility for power users

**Cons**:
- Added complexity
- Still requires API management
- User confusion (which version is "canonical"?)

**Rationale for Selection**:
- **User's explicit request**: "这些评论文字都需要你来直接生成和现在一样（提前生成），不使用gpt 或者 api 因为这样更加稳妥"
- **EMNLP Publication**: Reproducibility is critical for research
- **Exhibition Stability**: No technical dependencies for visitors
- **Quality Assurance**: Human review ensures authentic voices

**Implementation**:
1. Claude Code researches each artwork
2. Claude Code reads knowledge base references
3. Claude Code generates 15-20 messages using knowledge base
4. Human reviewer checks quality and authenticity
5. Content committed to Git repository
6. Deployed as static JavaScript files

---

### AD-3: Dialogue Structure Transformation

**Decision**: **Single 15-20 message thread per artwork** (replacing 6 separate threads)

**Options Considered**:

**A. Single Continuous Thread (15-20 messages)** ✅ SELECTED
```javascript
export const artwork5Dialogue = {
  id: "artwork-5-dialogue",
  artworkId: "artwork-5",
  topic: "艺术作品的全面对话",
  topicEn: "Comprehensive Dialogue on the Artwork",
  chapters: [
    { id: 1, title: "初见印象", titleEn: "First Impressions", messageIds: [...] },
    { id: 2, title: "技法解析", titleEn: "Technical Analysis", messageIds: [...] },
    // ... 3 more chapters
  ],
  participants: ["su-shi", "guo-xi", "john-ruskin", "mama-zola", "professor-petrova", "ai-ethics-reviewer"],
  messages: [
    // 15-20 messages in chronological order
  ]
};
```

**Pros**:
- **Narrative coherence**: Single story arc from start to finish
- **Depth**: Sustained engagement with artwork over 15-20 messages
- **Chapter structure**: Logical progression through analysis phases
- **Immersive**: Users experience complete critical discourse
- **Natural flow**: Critics build on each other's points across the entire dialogue

**Cons**:
- **Length**: Users might not read all 15-20 messages
- **Flexibility loss**: Can't choose specific topics (e.g., "only technique")
- **Development effort**: Requires careful narrative planning

**B. Multiple Short Threads (Current System - 6 threads × 5-6 messages)**
- 6 separate threads per artwork
- Each thread 5-6 messages
- Topics: Technique, Philosophy, Culture, Ethics, Tradition, Synthesis

**Pros**:
- **Modular**: Users choose topics of interest
- **Manageable length**: 5-6 messages easier to complete
- **Topic-focused**: Each thread has clear theme

**Cons**:
- **Fragmentation**: Cognitive load of switching contexts
- **Repetition**: Similar points made across threads
- **Shallow**: 5-6 messages insufficient for deep exploration
- **Disconnected**: Critics don't build sustained arguments

**C. Hybrid (Main thread + Optional side threads)**
- 1 main thread (15-20 messages) covering all topics
- 3-4 optional "deep dive" threads for specialized topics

**Pros**:
- Depth + Flexibility
- Serves both casual and deep readers

**Cons**:
- **Complexity**: Users confused about which to read
- **Redundancy**: Main thread duplicates side threads
- **Development overhead**: 2-3× more content to generate

**Rationale for Selection**:
- **User request**: "一次对话（针对一个艺术作品）能够全面的能涉及尽可能所有的层面的进行深度多轮次的对话"
- **Immersive experience**: Single narrative arc maintains engagement
- **Chapter structure**: Logical progression addresses concerns about length
- **Scalability**: 30 artworks × 1 dialogue = 30 dialogues (vs. 180 threads)

**Implementation**:
- Add `chapters` array to dialogue data structure
- Add `chapterNumber` field to each message
- Create chapter navigation UI (optional feature)
- Preserve existing `DialoguePlayer` component architecture

---

### AD-4: Image-Dialogue Synchronization Strategy

**Decision**: **Message-driven image highlighting** (messages specify which image to show)

**Options Considered**:

**A. Message-Driven Image Highlighting** ✅ SELECTED
```javascript
{
  id: "msg-artwork-5-1-8",
  personaId: "guo-xi",
  textZh: "观察左下角的笔触细节...",
  highlightImage: "artwork-5-detail-b.jpg",  // Message specifies image
  imageAnnotation: {
    zh: "细节：笔触的提按变化",
    en: "Detail: Lift-and-press brushwork variation"
  },
  // ... other fields
}
```

**Workflow**:
1. User advances to message
2. `DialoguePlayer` emits `message-revealed` event
3. `ImageGallery` component listens and switches to `highlightImage`
4. Image annotation overlay appears
5. Previous image fades out, new image fades in (500ms)

**Pros**:
- **Explicit control**: Content creator decides which image for each message
- **Semantic coupling**: Image choice reflects message content
- **Simple implementation**: Event-driven, no complex logic
- **Flexible**: Some messages can omit `highlightImage` (keeps current image)

**Cons**:
- **Manual work**: Must assign image to each message during generation
- **Rigidity**: Image change tied to message reveal timing

**B. Chapter-Based Image Sets**
- Each chapter (e.g., "Technical Analysis") has assigned images
- All messages in chapter show those images
- No per-message control

**Pros**:
- **Less manual work**: Assign images per chapter, not per message
- **Thematic grouping**: Images grouped by analysis phase

**Cons**:
- **Less precise**: Can't highlight specific details mid-chapter
- **Missed opportunities**: Technical messages might discuss different areas

**C. Keyword-Based Automatic Matching**
- Messages mention visual elements ("左下角", "笔触", "色彩")
- System automatically detects keywords
- Matches to image tags/descriptions
- Switches image when keywords detected

**Pros**:
- **Fully automatic**: No manual image assignment
- **Adaptive**: Works for new artworks

**Cons**:
- **Unreliable**: Keyword detection prone to errors
- **Semantic mismatch**: "色彩" could refer to multiple images
- **Complex**: NLP overhead, potential bugs
- **Less control**: Can't guarantee correct image

**D. User-Controlled Image Gallery**
- Images displayed as thumbnails alongside dialogue
- Users manually click to view specific images
- Dialogue doesn't control images

**Pros**:
- **User agency**: Users choose what to examine
- **Simple implementation**: Standard image gallery

**Cons**:
- **Disconnected**: No guidance on which image to view when
- **Cognitive load**: Users must decide relevance themselves
- **Missed educational opportunity**: No directed visual analysis

**Rationale for Selection**:
- **Pedagogical value**: Directed attention enhances understanding
- **Content creator control**: Curated experience ensures quality
- **User experience**: Seamless image transitions reduce friction
- **Feasible effort**: Manual assignment during generation is acceptable

**Implementation**:
```javascript
// DialoguePlayer emits event
this.dispatchEvent(new CustomEvent('message-revealed', {
  detail: {
    messageId: message.id,
    highlightImage: message.highlightImage,
    imageAnnotation: message.imageAnnotation
  }
}));

// ImageGallery listens
dialoguePlayer.addEventListener('message-revealed', (e) => {
  if (e.detail.highlightImage) {
    this.switchToImage(e.detail.highlightImage);
    this.showAnnotation(e.detail.imageAnnotation);
  }
});
```

---

### AD-5: Knowledge Base Research Methodology

**Decision**: **Prioritize canonical texts + academic secondary sources**

**Research Workflow**:

**Real Historical Critics**:
1. **Primary Sources** (first priority):
   - Original writings (poetry, essays, treatises)
   - Authoritative translations
   - Complete works collections

2. **Secondary Sources** (supporting):
   - Academic articles on critic's theory
   - Art history textbooks
   - Scholarly interpretations

**Fictional Critics** (inspired by real scholars):
1. **Identify foundational scholars**:
   - Mama Zola → Griot tradition (Chinua Achebe, Ngugi wa Thiong'o)
   - Professor Petrova → Russian Formalism (Viktor Shklovsky, Boris Eichenbaum)
   - AI Ethics Reviewer → Contemporary tech ethics (Kate Crawford, Ruha Benjamin, Safiya Noble)

2. **Research their key works**:
   - Signature books (e.g., Crawford's "Atlas of AI")
   - Theoretical frameworks (e.g., Shklovsky's "defamiliarization")
   - Representative arguments

3. **Synthesize into fictional persona**:
   - Extract core concepts and vocabulary
   - Adapt argumentation style
   - Create hybrid voice that honors sources

**WebSearch Strategy**:

**Query Types**:
```
# Real critics
"苏轼 诗词 艺术理论"
"郭熙 林泉高致 全文"
"John Ruskin Modern Painters excerpts"
"John Ruskin moral aesthetics craftsmanship"

# Fictional critic foundations
"griot tradition West African oral storytelling"
"Viktor Shklovsky art as technique defamiliarization"
"Kate Crawford Atlas of AI labor power"
"Ruha Benjamin Race After Technology"

# Thematic research
"Chinese literati painting theory spirit form"
"Russian Formalism visual analysis"
"AI ethics algorithmic justice"
```

**Quality Filters**:
- ✅ Academic sources (.edu domains, JSTOR, academia.edu)
- ✅ Authoritative translations (university presses)
- ✅ Peer-reviewed articles
- ✅ Primary source texts (Project Gutenberg, Internet Archive)
- ❌ Wikipedia (use as starting point, not citation)
- ❌ Blog posts (unless by recognized scholars)
- ❌ Commercial summaries (SparkNotes, etc.)

**Storage Format**:
```markdown
---
critic: john-ruskin
source: "Modern Painters, Volume I"
publication: 1843
url: "https://..."
accessed: 2025-11-05
---

# Chapter 2: Of Truth

## Original Quote

> "The greatest thing a human soul ever does in this world is to see something,
> and tell what it saw in a plain way. Hundreds of people can talk for one who
> can think, but thousands can think for one who can see. To see clearly is
> poetry, prophecy, and religion—all in one."

## Context

Ruskin argues that visual perception is the foundation of all higher human
faculties...

## Application to VULCA

This quote can be used when discussing observational accuracy, the role of
vision in art, and the moral dimension of seeing...
```

---

### AD-6: Data Structure Extensions

**Decision**: **Extend existing structure, maintain backward compatibility**

**Current Structure** (preserved):
```javascript
{
  id: "msg-artwork-1-1-1",
  personaId: "su-shi",
  textZh: "...",
  textEn: "...",
  timestamp: 0,
  replyTo: null,
  interactionType: "initial",
  quotedText: "..."  // optional
}
```

**New Fields** (added):
```javascript
{
  id: "msg-artwork-5-1-8",
  personaId: "su-shi",
  textZh: "...",
  textEn: "...",
  timestamp: 21000,
  replyTo: "professor-petrova",
  interactionType: "reflect",
  quotedText: "...",

  // NEW: Chapter association
  chapterNumber: 4,  // 1-5 (初见印象, 技法解析, 哲学思辨, 美学评判, 文化对话)

  // NEW: Image synchronization
  highlightImage: "artwork-5-detail-c.jpg",  // optional
  imageAnnotation: {  // optional
    zh: "细节：色彩过渡区域",
    en: "Detail: Color transition area"
  },

  // NEW: Knowledge base references
  references: [  // optional
    {
      critic: "su-shi",
      source: "东坡诗集",
      quote: "论画以形似，见与儿童邻",
      page: "卷12"
    }
  ]
}
```

**Dialogue-Level Structure**:
```javascript
export const artwork5Dialogue = {
  id: "artwork-5-dialogue",
  artworkId: "artwork-5",
  topic: "人工智能艺术的文化对话",
  topicEn: "Cultural Dialogue on AI Art",

  // NEW: Chapter structure
  chapters: [
    {
      id: 1,
      title: "初见印象",
      titleEn: "First Impressions",
      description: "评论家们的初步观察与反应",
      descriptionEn: "Critics' initial observations and reactions",
      messageIds: ["msg-artwork-5-1-1", "msg-artwork-5-1-2", "msg-artwork-5-1-3"]
    },
    // ... 4 more chapters
  ],

  participants: ["su-shi", "guo-xi", "john-ruskin", "mama-zola", "professor-petrova", "ai-ethics-reviewer"],

  messages: [
    // 15-20 messages
  ]
};
```

**Backward Compatibility**:
- All new fields are optional
- Existing code continues to work without changes
- New features gracefully degrade if fields are missing
- `DialoguePlayer` checks for field existence before using

**Validation**:
```javascript
// Example validation in DialoguePlayer
const chapterNumber = message.chapterNumber || 0;  // default to 0 if missing
const highlightImage = message.highlightImage || null;
if (highlightImage && this.imageGallery) {
  this.imageGallery.switchToImage(highlightImage);
}
```

---

### AD-7: Component Architecture

**Decision**: **Separate concerns into independent components**

**Component Hierarchy**:
```
ArtworkDetailPage
├── ArtworkHeader (metadata: title, artist, year)
├── ImageGallery (image display + annotations)
│   ├── ImageViewer (main image with transitions)
│   ├── ImageThumbnails (thumbnail navigation)
│   └── ImageAnnotation (overlay text)
└── DialoguePlayer (existing component, enhanced)
    ├── ChapterNavigator (NEW: chapter selection)
    ├── MessageList (existing: message rendering)
    └── ThoughtChainVisualizer (existing: thinking animation)
```

**Communication Pattern**: **Event-driven architecture**

```javascript
// DialoguePlayer emits events
dialoguePlayer.addEventListener('message-revealed', (e) => {
  imageGallery.handleMessageRevealed(e.detail);
});

dialoguePlayer.addEventListener('chapter-changed', (e) => {
  chapterNavigator.updateActiveChapter(e.detail.chapterNumber);
});

// ImageGallery emits events
imageGallery.addEventListener('image-loaded', (e) => {
  dialoguePlayer.resumePlayback();  // Wait for image before continuing
});
```

**Benefits**:
- **Decoupled**: Components don't directly depend on each other
- **Testable**: Each component can be tested independently
- **Reusable**: ImageGallery can be used elsewhere in VULCA
- **Maintainable**: Changes to one component don't break others

**Alternative Considered**: **Tightly coupled** (DialoguePlayer directly manipulates ImageGallery DOM)

**Rejected because**:
- Hard to test
- Violates separation of concerns
- Difficult to reuse components

---

## Technical Choices

### TC-1: Image Format and Optimization

**Decision**:
- **Format**: JPEG for photographs, PNG for graphics with text
- **Dimensions**: 1200×800px (3:2 aspect ratio) for main images, 300×200px for thumbnails
- **Compression**: 85% quality JPEG (balance file size and quality)
- **Lazy Loading**: Use `loading="lazy"` attribute for off-screen images
- **Responsive**: Serve smaller images for mobile devices using `srcset`

**Example**:
```html
<img
  src="/assets/artwork-5/detail-a.jpg"
  srcset="/assets/artwork-5/detail-a-small.jpg 600w,
          /assets/artwork-5/detail-a.jpg 1200w"
  sizes="(max-width: 768px) 600px, 1200px"
  loading="lazy"
  alt="Detail A: Brushwork close-up"
/>
```

### TC-2: Performance Considerations

**Dialogue Data Loading**:
- **Problem**: 30 dialogues × 15-20 messages = 450-500 messages × ~150 words/message = ~75,000 words (~300KB uncompressed)
- **Solution**: Lazy load dialogue data per artwork
  ```javascript
  // Don't load all dialogues upfront
  // Load on demand when user visits artwork page
  const dialogue = await import(`/js/data/dialogues/artwork-${artworkId}.js`);
  ```

**Image Loading Strategy**:
- **Preload**: First 2 images (overview + detail A)
- **Lazy load**: Remaining images as user progresses through dialogue
- **Prefetch**: Next chapter's images when user reaches 80% of current chapter

**Code Splitting**:
- Core components (DialoguePlayer): Load on all pages
- Image-specific components (ImageGallery): Load only on artwork detail pages
- Knowledge base data: Never loaded in browser (only used during generation)

### TC-3: Mobile Responsiveness

**Layout Strategy**:

**Desktop (≥1024px)**:
```
┌───────────────────────────────────────┐
│  Artwork Header                        │
├──────────────────┬────────────────────┤
│  ImageGallery    │  DialoguePlayer    │
│  (50% width)     │  (50% width)       │
│                  │                    │
│  [Main Image]    │  Chapter Nav       │
│  [Thumbnails]    │  Message 1         │
│  [Annotation]    │  Message 2         │
│                  │  Message 3...      │
└──────────────────┴────────────────────┘
```

**Tablet (768-1023px)**:
```
┌───────────────────────────────────────┐
│  Artwork Header                        │
├───────────────────────────────────────┤
│  ImageGallery (full width)            │
│  [Main Image]                         │
│  [Thumbnails]                         │
├───────────────────────────────────────┤
│  DialoguePlayer (full width)          │
│  Chapter Nav                           │
│  Message 1                             │
│  Message 2...                          │
└───────────────────────────────────────┘
```

**Mobile (<768px)**:
```
┌─────────────────┐
│ Artwork Header   │
├─────────────────┤
│ ImageGallery     │
│ [Main Image]     │
│ [Thumbs inline]  │
├─────────────────┤
│ DialoguePlayer   │
│ Chapter Nav      │
│ Message 1        │
│ Message 2...     │
└─────────────────┘
```

**Interaction Adaptations**:
- **Desktop**: Hover effects on thumbnails, keyboard navigation
- **Tablet**: Touch gestures, swipe to change images
- **Mobile**: Stack layout, larger touch targets, simplified chapter nav

---

## Trade-offs & Justifications

### Trade-off 1: Single Thread vs. Multiple Threads

**Chosen**: Single 15-20 message thread
**Alternative**: Multiple 5-6 message threads

**What we gained**:
- Narrative depth and coherence
- Sustained critical engagement
- Natural dialogue progression
- Reduced cognitive fragmentation

**What we sacrificed**:
- Topic-specific browsing
- Shorter reading sessions
- Modular content consumption

**Justification**: User explicitly requested "全面的能涉及尽可能所有的层面的进行深度多轮次的对话", indicating preference for comprehensive single dialogues over fragmented threads.

### Trade-off 2: Pre-generated vs. Runtime Generation

**Chosen**: Pre-generated content (Claude Code generates during development)
**Alternative**: Runtime generation (GPT API calls)

**What we gained**:
- Stability and reliability
- Speed (no API latency)
- Cost-effectiveness
- Quality control
- Reproducibility for research

**What we sacrificed**:
- Dynamic adaptation
- Personalization
- Easy content updates

**Justification**: User explicitly requested "这些评论文字都需要你来直接生成和现在一样（提前生成），不使用gpt 或者 api 因为这样更加稳妥", prioritizing stability and control over dynamism.

### Trade-off 3: Message-Driven Image Sync vs. User-Controlled Gallery

**Chosen**: Message-driven automatic image synchronization
**Alternative**: User-controlled image gallery (users manually select images)

**What we gained**:
- Pedagogical guidance
- Seamless experience
- Directed attention to relevant details
- Enhanced understanding

**What we sacrificed**:
- User agency
- Exploration freedom
- Simpler implementation

**Justification**: Educational exhibition benefits from curated experience where visual analysis is guided by expert critics. Users can still manually select images, but default experience provides structure.

### Trade-off 4: Markdown Knowledge Base vs. Database

**Chosen**: Markdown files with YAML frontmatter
**Alternative**: Structured database (JSON or SQLite)

**What we gained**:
- Human readability
- Version control
- Easy editing and annotation
- Future-proof format
- Academic-friendly (citations, commentary)

**What we sacrificed**:
- Query performance
- Structured search
- Data integrity constraints
- Programmatic manipulation

**Justification**: Knowledge base is primarily for content generation (development time), not runtime queries. Human readability and academic rigor outweigh performance concerns.

---

## Open Questions

1. **Chapter Navigation UI**: Should chapter navigation be:
   - Always visible (sidebar or tabs)?
   - Hidden until user requests (expandable menu)?
   - Progressive disclosure (appears after completing Chapter 1)?

2. **Voice Consistency Validation**: How to systematically verify that generated messages authentically match critic voices?
   - Manual review by domain expert?
   - Automated checks (vocabulary, sentence structure)?
   - User testing with target audience?

3. **Image Annotation Complexity**: Should annotations be:
   - Simple text overlays?
   - Interactive hotspots with zoom?
   - Arrows/diagrams pointing to specific areas?

4. **Knowledge Base Maintenance**: Who updates knowledge base when new scholarship emerges?
   - Versioning strategy?
   - Update frequency?

5. **Multilingual Knowledge Base**: Should we maintain separate Chinese/English knowledge bases or unified bilingual documents?

---

## Future Enhancements (Out of Scope)

1. **Interactive Dialogue**: Users can ask questions to critics (requires runtime LLM integration)
2. **Comparative Mode**: Side-by-side comparison of 2 artworks with critics discussing similarities/differences
3. **Personalized Paths**: Users select topics of interest, system curates relevant messages
4. **Audio Narration**: Voice synthesis for each critic (preserves accessibility)
5. **Educational Mode**: Glossary pop-ups for art historical terms, linking to knowledge base
6. **Community Annotations**: Users can add their own critiques (requires backend)

---

## Next Steps

1. Review and approve this design document
2. Create detailed specifications (`specs/` directory)
3. Break down into tasks (`tasks.md`)
4. Begin Phase 1: Knowledge Base Construction

---

## Approval

| Stakeholder | Status | Date | Comments |
|-------------|--------|------|----------|
| User | Pending | - | - |
| Claude (AI Assistant) | Approved | 2025-11-05 | Design complete, ready for spec creation |
