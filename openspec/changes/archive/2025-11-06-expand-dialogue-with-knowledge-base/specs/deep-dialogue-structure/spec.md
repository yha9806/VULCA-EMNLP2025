# Specification: Deep Dialogue Structure

**Capability**: `deep-dialogue-structure`
**Change**: `expand-dialogue-with-knowledge-base`
**Status**: Draft
**Version**: 1.0.0

---

## Overview

This specification defines the structure, format, and content requirements for deep, comprehensive single-thread dialogues (15-20 messages per artwork) organized into 5 thematic chapters.

---

## ADDED Requirements

### Requirement: DD-001 - Single Thread Per Artwork

Each artwork **SHALL** have exactly **one dialogue thread** containing 15-20 messages, replacing the previous multi-thread structure (6 threads × 5-6 messages).

**Data Structure**:
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
    {
      id: 2,
      title: "技法解析",
      titleEn: "Technical Analysis",
      description: "形式分析：构图、色彩、材料、技巧",
      descriptionEn: "Formal analysis: composition, color, materials, technique",
      messageIds: ["msg-artwork-5-1-4", "msg-artwork-5-1-5", "msg-artwork-5-1-6", "msg-artwork-5-1-7"]
    },
    // ... chapters 3-5
  ],

  participants: ["su-shi", "guo-xi", "john-ruskin", "mama-zola", "professor-petrova", "ai-ethics-reviewer"],

  messages: [
    // 15-20 messages in chronological order
  ]
};
```

#### Scenario: Developer loads artwork dialogue

**Given** the system loads dialogue for artwork-5
**When** it reads `js/data/dialogues/artwork-5.js`
**Then** the exported object **SHALL** have:
- `id`: Unique identifier "artwork-5-dialogue"
- `artworkId`: "artwork-5" (matching artwork ID)
- `topic` and `topicEn`: Bilingual dialogue topic
- `chapters`: Array of exactly 5 chapter objects
- `participants`: Array of 6 persona IDs
- `messages`: Array of 15-20 message objects

**And** the `messages` array length **SHALL** be ≥15 and ≤20

---

### Requirement: DD-002 - Five-Chapter Structure

Every dialogue **SHALL** follow a five-chapter dramatic structure progressing from observation to cultural synthesis.

**Required Chapters** (in order):
1. **Chapter 1: 初见印象 (First Impressions)** - 3-4 messages
   - Initial reactions and observations
   - Establishing key visual elements
   - Setting up central questions or tensions

2. **Chapter 2: 技法解析 (Technical Analysis)** - 3-4 messages
   - Formal analysis: composition, materials, technique
   - Comparison to historical precedents
   - Technical innovation or mastery

3. **Chapter 3: 哲学思辨 (Philosophical Reflection)** - 3-4 messages
   - Conceptual questions: agency, authorship, meaning
   - Theoretical frameworks
   - Existential or metaphysical dimensions

4. **Chapter 4: 美学评判 (Aesthetic Judgment)** - 3-4 messages
   - Evaluation of artistic merit
   - Aesthetic traditions (Eastern/Western)
   - Discussions of beauty, sublime, emotion

5. **Chapter 5: 文化对话 (Cultural Dialogue)** - 3-4 messages
   - Cross-cultural synthesis
   - Contemporary relevance
   - Future implications

**Chapter Distribution**:
- Total messages: 15-20
- Each chapter: 3-4 messages minimum
- Flexible distribution based on artwork complexity

#### Scenario: Chapter structure validation

**Given** a dialogue for artwork-10 is being validated
**When** the system checks the `chapters` array
**Then** it **SHALL** have exactly 5 chapters with IDs 1, 2, 3, 4, 5

**And** chapter 1 **SHALL** have:
- `title`: "初见印象"
- `titleEn`: "First Impressions"
- `messageIds`: Array of 3-4 message IDs

**And** all chapters combined **SHALL** account for all messages in the dialogue

#### Scenario: Message chapter assignment

**Given** message "msg-artwork-10-1-8" exists in the dialogue
**When** the system checks which chapter it belongs to
**Then** the message **SHALL** have `chapterNumber` field set to 1, 2, 3, 4, or 5

**And** the message ID **SHALL** appear in exactly one chapter's `messageIds` array

---

### Requirement: DD-003 - Message Length and Quality

Each message **SHALL** contain 100-150 words of substantive content in both Chinese and English, with authentic critic voice and knowledge base references.

**Word Count Requirements**:
- **Minimum**: 80 words (Chinese) / 80 words (English)
- **Target**: 100-150 words (Chinese) / 100-150 words (English)
- **Maximum**: 180 words (Chinese) / 180 words (English)

**Content Quality Criteria**:
1. **Specificity**: References concrete visual elements or concepts (no vague generalities)
2. **Voice Authenticity**: Vocabulary and argumentation style matches critic's knowledge base
3. **Knowledge Base Grounding**: At least 1 verifiable concept or framework from knowledge base
4. **Bilingual Quality**: Both Chinese and English texts are natural and idiomatic (not direct translations)

#### Scenario: Message word count validation

**Given** message "msg-artwork-7-1-5" has been generated
**When** word count is calculated for Chinese text
**Then** it **SHALL** be ≥80 and ≤180 characters (for Chinese, use character count)

**When** word count is calculated for English text
**Then** it **SHALL** be ≥80 and ≤180 words

#### Scenario: Knowledge base reference validation

**Given** a message by personaId "su-shi"
**When** the content is reviewed
**Then** it **SHALL** include at least one of:
- Direct quote from Su Shi's writings (properly attributed)
- Key concept from Su Shi's knowledge base (e.g., 神似, 意境)
- Argumentation pattern consistent with literati aesthetics

**And** if the message includes a direct quote, it **SHALL** have a `references` field:
```javascript
references: [
  {
    critic: "su-shi",
    source: "跋汉杰画山",
    quote: "论画以形似，见与儿童邻",
    page: "卷12"
  }
]
```

---

### Requirement: DD-004 - Critic Role Distribution

All 6 critics **SHALL** participate in each dialogue, with strategic role distribution based on their expertise and chapter themes.

**Participation Requirements**:
- **Minimum appearances per critic**: 2 messages
- **Maximum appearances per critic**: 4 messages
- **Total**: 15-20 messages across 6 critics

**Strategic Casting by Chapter**:

| Chapter | Recommended Critics | Rationale |
|---------|---------------------|-----------|
| 1: First Impressions | Any 3-4 critics | Diverse initial perspectives |
| 2: Technical Analysis | 郭熙, John Ruskin, Professor Petrova | Formal analysis expertise |
| 3: Philosophical Reflection | 苏轼, AI Ethics Reviewer, Professor Petrova | Theoretical depth |
| 4: Aesthetic Judgment | 苏轼, John Ruskin, Mama Zola | Evaluative frameworks |
| 5: Cultural Dialogue | All 6 (synthesis) | Cross-cultural perspectives |

#### Scenario: Critic participation validation

**Given** a dialogue for artwork-12 with 18 messages
**When** the system counts appearances per critic
**Then** each of the 6 critics **SHALL** appear at least 2 times

**And** no critic **SHALL** appear more than 4 times

**And** the total count across all critics **SHALL** equal 18

#### Scenario: Chapter-appropriate critic casting

**Given** Chapter 2 (Technical Analysis) is being generated
**When** selecting critics for this chapter
**Then** at least 2 of the 3-4 messages **SHALL** be from:
- 郭熙 (landscape technique expert)
- John Ruskin (craftsmanship and observation)
- Professor Petrova (formalist analysis)

**And** critics with primarily philosophical focus (苏轼, AI Ethics Reviewer) **MAY** appear but **SHOULD** discuss technical aspects if they do

---

### Requirement: DD-005 - Interaction Type Progression

Messages **SHALL** use interaction types that create natural dialogue flow, progressing from initial observations through debate to synthesis.

**Interaction Types** (preserved from current system):
- `initial` - Opens new topic or chapter
- `agree-extend` - Builds on previous argument, includes quote
- `question-challenge` - Raises doubts or counterarguments
- `counter` - Direct rebuttal with evidence
- `synthesize` - Integrates multiple perspectives
- `reflect` - Personal philosophical reflection

**Chapter-Specific Patterns**:

**Chapter 1 (First Impressions)**:
- Start: `initial` (1 message)
- Follow: `agree-extend`, `question-challenge` (2-3 messages)

**Chapters 2-4 (Analysis, Philosophy, Aesthetics)**:
- Mix: `agree-extend`, `question-challenge`, `counter` (varied debate)
- Include at least 1 `counter` per chapter (ensure disagreement)

**Chapter 5 (Cultural Dialogue)**:
- Synthesis: `synthesize` (2 messages)
- Closure: `reflect` (1-2 messages)

#### Scenario: Interaction type validation for Chapter 1

**Given** Chapter 1 has 3 messages
**When** checking interaction types
**Then** the first message **SHALL** have `interactionType`: "initial"

**And** subsequent messages **SHALL** have `interactionType` from:
- "agree-extend"
- "question-challenge"

#### Scenario: Debate inclusion check

**Given** Chapters 2, 3, and 4 combined have 10 messages
**When** counting `interactionType`: "counter"
**Then** at least 2 messages **SHALL** have this type

**And** these messages **SHALL** have `replyTo` field referencing the message being countered

---

### Requirement: DD-006 - Reply Chain Coherence

Messages **SHALL** use `replyTo` and `quotedText` fields to create coherent reply chains, ensuring logical conversation flow.

**Reply Chain Rules**:
1. **Initial messages**: `replyTo: null`
2. **Direct replies**: `replyTo` references specific previous message ID
3. **Synthesize/reflect**: `replyTo: null` (addresses multiple messages)
4. **Quote requirement**: If `interactionType` is "agree-extend" or "counter", `quotedText` **SHOULD** be present

#### Scenario: Reply chain validation

**Given** message "msg-artwork-15-1-8" has `interactionType`: "agree-extend"
**When** validating reply structure
**Then** the message **SHALL** have:
- `replyTo`: ID of a previous message in the dialogue
- `quotedText`: A short phrase (5-15 characters Chinese, 3-8 words English)

**And** the `quotedText` **SHALL** appear verbatim in the referenced message's text

#### Scenario: Synthesize message structure

**Given** message has `interactionType`: "synthesize"
**When** checking reply structure
**Then** `replyTo` **MAY** be null (addresses multiple messages)

**And** the message content **SHALL** reference at least 2 previous critics' arguments

---

### Requirement: DD-007 - Bilingual Content Equivalence

Both Chinese (`textZh`) and English (`textEn`) versions **SHALL** convey equivalent meaning and argumentative structure, though not necessarily word-for-word translations.

**Equivalence Criteria**:
1. **Core argument**: Same logical claim in both languages
2. **Citations**: Quotes appear in both (original + translation)
3. **Structure**: Same number of sentences (±1)
4. **Tone**: Same level of formality and emotion

**Not Required**:
- Word-for-word translation
- Identical metaphors (culturally appropriate metaphors preferred)
- Same sentence structure (idiomatic expression encouraged)

#### Scenario: Bilingual content validation

**Given** message includes Chinese quote: "论画以形似，见与儿童邻"
**When** reviewing English version
**Then** the English text **SHALL** include the translated quote:
- "To judge painting by physical likeness is to neighbor with children"

**And** both versions **SHALL** make the same argumentative point about the quote

#### Scenario: Argumentation structure equivalence

**Given** Chinese text (`textZh`) has 3 sentences with structure:
1. Observation about artwork
2. Connection to theoretical concept
3. Evaluative conclusion

**When** reviewing English text (`textEn`)
**Then** it **SHALL** also have 3 sentences (±1) following the same logical progression

---

## MODIFIED Requirements

_No existing requirements are modified by this specification._

---

## REMOVED Requirements

_No existing requirements are removed by this specification._

---

## Dependencies

- **knowledge-base-architecture**: Messages reference critic knowledge bases
- **Existing DialoguePlayer**: Component must handle new chapter-based structure
- **Existing message structure**: Extends current format with new fields

---

## Validation Criteria

### Automated Structure Validation

```javascript
// Validate dialogue structure
function validateDialogueStructure(dialogue) {
  const errors = [];

  // Check required fields
  if (!dialogue.id || !dialogue.artworkId || !dialogue.chapters || !dialogue.messages) {
    errors.push("Missing required top-level fields");
  }

  // Check chapter count
  if (dialogue.chapters.length !== 5) {
    errors.push(`Expected 5 chapters, found ${dialogue.chapters.length}`);
  }

  // Check chapter IDs
  const chapterIds = dialogue.chapters.map(c => c.id);
  if (!arraysEqual(chapterIds, [1, 2, 3, 4, 5])) {
    errors.push(`Invalid chapter IDs: ${chapterIds}`);
  }

  // Check message count
  if (dialogue.messages.length < 15 || dialogue.messages.length > 20) {
    errors.push(`Message count ${dialogue.messages.length} outside range [15, 20]`);
  }

  // Check all 6 critics participate
  const critics = new Set(dialogue.messages.map(m => m.personaId));
  if (critics.size !== 6) {
    errors.push(`Only ${critics.size} critics participate, expected 6`);
  }

  // Check critic appearance counts
  const appearances = {};
  dialogue.messages.forEach(m => {
    appearances[m.personaId] = (appearances[m.personaId] || 0) + 1;
  });
  for (const [critic, count] of Object.entries(appearances)) {
    if (count < 2 || count > 4) {
      errors.push(`Critic ${critic} appears ${count} times, expected 2-4`);
    }
  }

  // Check chapter message assignment
  const allMessageIds = dialogue.chapters.flatMap(c => c.messageIds);
  const uniqueMessageIds = new Set(allMessageIds);
  if (allMessageIds.length !== uniqueMessageIds.size) {
    errors.push("Message IDs appear in multiple chapters");
  }

  return errors;
}
```

### Manual Quality Review

- [ ] Each chapter has thematic coherence (messages discuss related topics)
- [ ] Conversation flows naturally (no abrupt topic changes)
- [ ] All 6 critics have distinct voices (vocabulary, argumentation style)
- [ ] At least 2 moments of disagreement (`counter` or `question-challenge`)
- [ ] Chapter 5 successfully synthesizes earlier arguments
- [ ] Both Chinese and English texts read naturally (not machine-translated)
- [ ] At least 60% of messages include verifiable knowledge base references
- [ ] Reply chains make logical sense (`quotedText` accurately excerpts previous messages)

---

## Examples

### Example 1: Complete Chapter Structure

```javascript
{
  id: "artwork-15-dialogue",
  artworkId: "artwork-15",
  topic: "数据可视化中的诗意表达",
  topicEn: "Poetic Expression in Data Visualization",

  chapters: [
    {
      id: 1,
      title: "初见印象",
      titleEn: "First Impressions",
      description: "评论家们面对数据艺术的初步反应",
      descriptionEn: "Critics' initial responses to data art",
      messageIds: ["msg-artwork-15-1-1", "msg-artwork-15-1-2", "msg-artwork-15-1-3"]
    },
    {
      id: 2,
      title: "技法解析",
      titleEn: "Technical Analysis",
      description: "算法设计、数据来源与视觉编码",
      descriptionEn: "Algorithm design, data sources, and visual encoding",
      messageIds: ["msg-artwork-15-1-4", "msg-artwork-15-1-5", "msg-artwork-15-1-6", "msg-artwork-15-1-7"]
    },
    {
      id: 3,
      title: "哲学思辨",
      titleEn: "Philosophical Reflection",
      description: "数据、真实与表征的关系",
      descriptionEn: "Relationships between data, reality, and representation",
      messageIds: ["msg-artwork-15-1-8", "msg-artwork-15-1-9", "msg-artwork-15-1-10"]
    },
    {
      id: 4,
      title: "美学评判",
      titleEn: "Aesthetic Judgment",
      description: "数据美学：抽象、模式与情感",
      descriptionEn: "Data aesthetics: abstraction, pattern, and emotion",
      messageIds: ["msg-artwork-15-1-11", "msg-artwork-15-1-12", "msg-artwork-15-1-13", "msg-artwork-15-1-14"]
    },
    {
      id: 5,
      title: "文化对话",
      titleEn: "Cultural Dialogue",
      description: "数据时代的艺术与社会",
      descriptionEn: "Art and society in the data age",
      messageIds: ["msg-artwork-15-1-15", "msg-artwork-15-1-16", "msg-artwork-15-1-17"]
    }
  ],

  participants: ["su-shi", "guo-xi", "john-ruskin", "mama-zola", "professor-petrova", "ai-ethics-reviewer"],

  messages: [/* 17 messages total */]
}
```

### Example 2: Message with Knowledge Base Reference

```javascript
{
  id: "msg-artwork-15-1-8",
  personaId: "su-shi",
  chapterNumber: 3,  // Philosophical Reflection chapter

  textZh: `观此数据可视化作品，让我想起自己在《书摩诘画》中所言："味摩诘之诗，诗中有画；观摩诘之画，画中有诗。"今日数据艺术，何尝不是"数中有诗，诗中有数"？艺术家将抽象的数字转化为视觉形式，这不正是"意境"的营造吗？古人以山水寄托情怀，今人以数据反映世界。形式虽变，本质未改——都是通过可见之物，传达不可见之意。`,

  textEn: `Observing this data visualization, I recall my words in "Colophon on Wang Wei's Paintings": "In Wang Wei's poetry, there is painting; in his painting, there is poetry." Today's data art—is it not "within data, there is poetry; within poetry, there is data"? The artist transforms abstract numbers into visual forms—is this not the creation of "artistic conception" (意境)? Ancients expressed sentiments through landscapes; contemporaries reflect the world through data. Though forms change, essence remains—both convey invisible meaning through visible things.`,

  timestamp: 21000,
  replyTo: "professor-petrova",
  interactionType: "synthesize",
  quotedText: "数据反映世界",

  references: [
    {
      critic: "su-shi",
      source: "书摩诘画",
      quote: "味摩诘之诗，诗中有画；观摩诘之画，画中有诗",
      file: "knowledge-base/critics/su-shi/art-theory.md"
    },
    {
      critic: "su-shi",
      concept: "意境",
      definition: "Artistic conception - the emotional/philosophical atmosphere created by art",
      file: "knowledge-base/critics/su-shi/key-concepts.md"
    }
  ]
}
```

---

## Related Specifications

- `knowledge-base-architecture` - Provides references for message content
- `image-dialogue-sync` - Coordinates image display with message chapters
- `content-generation-workflow` - Describes process for creating conformant dialogues

---

## Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-05 | Claude | Initial specification |
