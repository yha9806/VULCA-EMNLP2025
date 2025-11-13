# Design: Create Hybrid Critique-Dialogue System

**Change ID:** `create-hybrid-critique-dialogue-system`
**Status:** Draft
**Date:** 2025-11-12

---

## Design Goals

1. **Preserve existing work:** Retain all 228 critiques generated in Phase 2 of `expand-exhibition-with-real-artworks`
2. **Add missing features:** Implement 5 dialogue features (reply chains, quotes, references, thought chains, interaction markers)
3. **Enable dual display modes:** Support static critique cards AND interactive dialogue playback
4. **Minimize manual work:** Automate 80-90% of conversion process
5. **Maintain data quality:** Ensure generated dialogues match quality of existing artwork-1 to 4 dialogues

---

## Architectural Decisions

### Decision 1: Hybrid System Architecture

**Context:**
- Existing: 228 standalone critiques in `data.json`
- Desired: Interactive dialogue features (reply chains, quotes, etc.)
- Constraint: Cannot waste 20+ hours of Phase 2 work

**Options Considered:**

**Option A: Delete critiques, regenerate as dialogues**
- Pros: Clean slate, full control over content
- Cons: Wastes all Phase 2 work, requires regenerating 228 texts, 20+ hours

**Option B: Keep critiques, generate dialogues separately (SELECTED)**
- Pros: Preserves existing work, adds new capability, supports two use cases
- Cons: Data duplication, maintenance burden
- Mitigation: Clear documentation of when to use each format, automated regeneration possible

**Option C: Transform critiques in-place (add dialogue fields to data.json)**
- Pros: Single source of truth, no duplication
- Cons: Breaks existing data structure, complicates static display code, mixing concerns

**Decision:** Option B (Hybrid System)

**Rationale:**
- Best effort/benefit ratio (9-12 hours vs 20+ hours)
- Supports two distinct use cases (static cards vs interactive player)
- Dialogues can be regenerated from critiques if needed (critiques are source of truth)
- Follows separation of concerns (static data in JSON, interactive data in JS modules)

---

### Decision 2: Conversion Strategy (Automated vs Manual)

**Context:**
- Need to convert 34 artworks × 6 critiques = 204 critiques
- Each critique → 2-3 messages = ~400-500 new messages
- Manual creation would take 20+ hours

**Options Considered:**

**Option A: Fully manual creation**
- Pros: Highest quality, full control
- Cons: 20+ hours of tedious work, high error rate

**Option B: Fully automated conversion (SELECTED)**
- Pros: Fast (2-3 hours), consistent, reproducible
- Cons: May miss nuances, requires quality validation
- Mitigation: Manual review of 3 sample dialogues, automated validation suite

**Option C: Semi-automated (generate + manual editing)**
- Pros: Balance of speed and quality
- Cons: Still time-consuming (10-15 hours), inconsistent results

**Decision:** Option B (Fully Automated Conversion)

**Rationale:**
- 80-90% automation achieves acceptable quality for MVP
- Manual review of samples catches major issues
- Can improve quality iteratively after deployment
- Consistent output (no human inconsistency)

---

### Decision 3: Text Segmentation Strategy

**Context:**
- Critiques are 800-1500 characters (long form)
- Dialogue messages should be 200-600 characters (conversational length)
- Need to split while preserving meaning

**Options Considered:**

**Option A: Fixed-length splitting (every 400 characters)**
- Pros: Simple to implement
- Cons: Breaks mid-sentence, unnatural

**Option B: Paragraph-based splitting (split at 。 or .) (SELECTED)**
- Pros: Natural breaks, preserves complete thoughts
- Cons: Variable message lengths
- Mitigation: Post-process to merge short segments or split long ones

**Option C: Semantic segmentation (using NLP)**
- Pros: Most natural, respects topic boundaries
- Cons: Complex, requires training data, time-consuming

**Decision:** Option B (Paragraph-Based Splitting)

**Rationale:**
- Simple and fast (regex-based)
- Preserves complete thoughts (no mid-sentence cuts)
- Variable lengths are acceptable (more natural than fixed)
- Can add semantic layer later if needed

**Implementation:**
```javascript
function segmentCritique(critique) {
  // Split at sentence boundaries (。 or .)
  const sentences = critique.textZh.split(/[。.]/);
  const segments = [];
  let currentSegment = '';

  for (let sentence of sentences) {
    currentSegment += sentence + '。';

    // Create segment when reaching 300-600 chars
    if (currentSegment.length >= 300) {
      segments.push({
        textZh: currentSegment.trim(),
        textEn: extractCorrespondingEnglish(critique.textEn, currentSegment),
        type: determineSegmentType(segments.length)
      });
      currentSegment = '';
    }
  }

  // Add remaining text as final segment
  if (currentSegment.length > 0) {
    segments.push({
      textZh: currentSegment.trim(),
      textEn: extractCorrespondingEnglish(critique.textEn, currentSegment),
      type: 'reflect'
    });
  }

  return segments;
}
```

---

### Decision 4: Reply Chain Construction

**Context:**
- Need to establish reply relationships between messages
- 6 critics per artwork, 2-3 messages each = ~15 messages
- Should feel like natural conversation, not random

**Options Considered:**

**Option A: Sequential chain (each replies to previous)**
- Pros: Simple, guaranteed connected
- Cons: Feels mechanical, no strategic interaction

**Option B: Strategic chain based on interaction type (SELECTED)**
- Pros: More natural, reflects actual debate patterns
- Cons: More complex logic
- Strategy:
  - `initial`: No reply (starts conversation)
  - `agree-extend`: Reply to previous speaker
  - `question-challenge`: Reply to previous agreeer (challenge consensus)
  - `counter`: Reply to specific opponent
  - `synthesize`: No reply (addresses whole conversation)
  - `reflect`: No reply (personal reflection)

**Option C: Random connections (chaos mode)**
- Pros: Unpredictable, interesting
- Cons: May create illogical connections, hard to follow

**Decision:** Option B (Strategic Chain)

**Rationale:**
- Mimics natural academic debate patterns
- Synthesize/reflect messages provide narrative breaks
- Question-challenge creates tension (more interesting than pure agreement)
- Matches existing dialogue structure in artwork-1 to 4

**Example Chain:**
```
su-shi (initial) → 开场观察
  ↓ replyTo: "su-shi"
guo-xi (agree-extend) → 赞同并延伸
  ↓ replyTo: "guo-xi"
john-ruskin (question-challenge) → 质疑共识
  ↓ replyTo: "john-ruskin"
su-shi (counter) → 反驳质疑
  ↓ replyTo: null
mama-zola (synthesize) → 综合全局
```

---

### Decision 5: Quote Extraction Method

**Context:**
- Need to extract meaningful quotes from previous messages
- Quotes should be 15-50 characters (readable length)
- Should capture key concepts, not random text

**Options Considered:**

**Option A: Random sentence selection**
- Pros: Simple
- Cons: May select trivial sentences

**Option B: Keyword-based selection (SELECTED)**
- Pros: Selects sentences with key concepts
- Cons: May miss context-specific important sentences
- Keywords: 艺术, 技术, 创作, 表达, 思考, art, technology, creation, expression, think

**Option C: Semantic similarity (sentence-transformers)**
- Pros: Most accurate, context-aware
- Cons: Requires model loading, slower, complex
- Could be Phase 2 enhancement

**Decision:** Option B (Keyword-Based Selection)

**Rationale:**
- Good balance of simplicity and effectiveness
- Keyword list covers most important art criticism concepts
- Fast execution (regex-based)
- Can upgrade to semantic matching later if quality issues

**Implementation:**
```javascript
function extractQuotedText(messageText, maxLength = 50) {
  const keywords = ['艺术', '技术', '创作', '表达', '思考', 'art', 'technology', 'creation'];
  const sentences = messageText.split(/[。.！!？?]/);

  // Find sentence with keywords
  for (let s of sentences) {
    if (keywords.some(k => s.includes(k)) && s.length >= 15 && s.length <= maxLength) {
      return s.trim();
    }
  }

  // Fallback: first substantial sentence
  for (let s of sentences) {
    if (s.length >= 15 && s.length <= maxLength) {
      return s.trim();
    }
  }

  // Last resort: truncate first sentence
  return sentences[0].substring(0, maxLength) + '...';
}
```

---

### Decision 6: Interaction Type Detection

**Context:**
- Need to classify messages into 6 interaction types
- Types: initial, agree-extend, question-challenge, counter, synthesize, reflect
- Classification should match message content

**Options Considered:**

**Option A: Fixed sequence (su-shi=initial, guo-xi=agree, ruskin=question, etc.)**
- Pros: Predictable, simple
- Cons: Ignores actual content, feels scripted

**Option B: Keyword matching (SELECTED)**
- Pros: Content-aware, flexible, interpretable
- Cons: May misclassify if keywords absent
- Fallback: Default to `agree-extend` (most common type)

**Option C: ML classification (trained on artwork-1 to 4)**
- Pros: Highest accuracy
- Cons: Requires training data, complex, overkill for 6 classes

**Decision:** Option B (Keyword Matching)

**Rationale:**
- Existing dialogues (artwork-1 to 4) show clear keyword patterns
- 6 classes with distinct vocabularies
- Fallback to `agree-extend` handles edge cases gracefully
- Interpretable (can debug by inspecting keywords)

**Keyword Dictionary:**
```javascript
const INTERACTION_KEYWORDS = {
  'agree-extend': {
    zh: ['正如', '同意', '深以为然', '确实', '的确', '诚然'],
    en: ['I agree', 'As mentioned', 'Indeed', 'Certainly', 'As you noted']
  },
  'question-challenge': {
    zh: ['但是', '然而', '疑问', '质疑', '是否', '真的', '难道'],
    en: ['However', 'But', 'Question', 'Challenge', 'Whether', 'Doubt']
  },
  'counter': {
    zh: ['不对', '反驳', '错误', '不同意', '恰恰相反', '并非如此'],
    en: ['Incorrect', 'Disagree', 'Contrary', 'Opposite', 'On the contrary']
  },
  'synthesize': {
    zh: ['综合', '总结', '整体', '三位所言', '听你们讨论', '大家的观点'],
    en: ['Overall', 'In summary', 'Synthesizing', 'Hearing your discussion']
  },
  'reflect': {
    zh: ['反思', '重新思考', '让我思考', '我意识到', '这让我'],
    en: ['Reflection', 'Reconsider', 'Makes me think', 'I realize', 'This leads me']
  }
};
```

---

### Decision 7: Reference Matching Strategy

**Context:**
- Need to link messages to knowledge base sources
- Knowledge base: 6 critics × ~50 references each = 300 total
- Each message should have 2-3 references

**Options Considered:**

**Option A: Semantic matching (content → knowledge base)**
- Pros: Most relevant references
- Cons: Requires embedding models, slow, complex

**Option B: Random selection from critic's knowledge base (SELECTED)**
- Pros: Simple, fast, guaranteed valid
- Cons: May not be perfectly relevant to message content
- Mitigation: All references are on-topic for that critic

**Option C: Manual curation**
- Pros: Perfect relevance
- Cons: 500 messages × 3 references = 1500 manual selections (impossible)

**Decision:** Option B (Random Selection)

**Rationale:**
- MVP strategy: get working system fast
- All references in knowledge base are relevant to critic's style
- Random selection still maintains thematic consistency
- Can upgrade to semantic matching in Phase 2 enhancement

**Implementation:**
```javascript
function matchReferences(personaId, messageText) {
  const knowledgeBasePath = `knowledge-base/critics/${personaId}/`;
  const references = loadAllReferences(knowledgeBasePath);

  // Shuffle and select 2-3 references
  const shuffled = shuffle(references);
  const count = 2 + Math.floor(Math.random() * 2); // 2 or 3
  return shuffled.slice(0, count);
}
```

---

### Decision 8: English Translation Method

**Context:**
- 92 critiques missing English text
- Need high-quality translations maintaining critic voices
- Must be cost-effective and fast

**Options Considered:**

**Option A: Human translation**
- Pros: Highest quality, nuanced
- Cons: Expensive (¥300-500/critique × 92 = ¥27,600-46,000), slow (weeks)

**Option B: LLM translation with context (SELECTED)**
- Pros: Fast (3-4 hours), consistent, cost-effective ($15-20), maintains voice
- Cons: May miss subtle cultural nuances
- Mitigation: Use Claude 3.5 Sonnet with critic context and knowledge base

**Option C: Machine translation (Google/DeepL)**
- Pros: Instant, free
- Cons: Generic, loses critic voice, poor for philosophical text

**Decision:** Option B (LLM Translation with Context)

**Rationale:**
- Claude 3.5 Sonnet has strong Chinese-English translation capability
- Can provide critic context (voice, philosophy, style) for consistency
- Cost-effective: ~$0.20/critique × 92 = $18.40
- Fast: ~90 seconds/critique × 92 = ~2.3 hours API time
- Matches quality of existing Phase 2 work (also LLM-generated)

**Translation Prompt Template:**
```
Translate the following Chinese art critique into English.

Context:
- Critic: {persona.nameEn} ({persona.nameZh})
- Period: {persona.period}
- Philosophical approach: {persona.philosophy}
- Artwork: {artwork.titleEn} by {artwork.artist}

Critical voice characteristics:
- {persona.voiceCharacteristics}

Chinese critique:
{critique.textZh}

Requirements:
1. Maintain the critic's voice and philosophical depth
2. Preserve specialized art terminology
3. Keep the same structure and paragraph breaks
4. Aim for 1000-1500 English characters
5. Use academic but accessible language

English translation:
```

---

### Decision 9: Timestamp Generation Method

**Context:**
- Need to create natural dialogue pacing
- Existing dialogues (artwork-1 to 4) use 4-7 second intervals
- Should feel like thoughtful conversation, not instant chat

**Options Considered:**

**Option A: Fixed intervals (5 seconds)**
- Pros: Predictable, simple
- Cons: Feels robotic, unnatural

**Option B: Random intervals (4-7 seconds) (SELECTED)**
- Pros: Natural variation, matches existing dialogues
- Cons: Slightly more complex
- Formula: `interval = 4000 + random() * 3000` milliseconds

**Option C: Adaptive intervals (longer for longer messages)**
- Pros: Most realistic (simulates reading time)
- Cons: Complex calculation, may create very long delays

**Decision:** Option B (Random Intervals 4-7 seconds)

**Rationale:**
- Matches existing dialogue timing patterns
- Creates natural conversational rhythm
- Simple to implement (single random call per interval)
- 4-7 seconds is "thoughtful response" pace (not instant, not slow)

**Implementation:**
```javascript
function generateTimestamps(messageCount) {
  const timestamps = [0]; // First message at t=0
  let currentTime = 0;

  for (let i = 1; i < messageCount; i++) {
    const interval = 4000 + Math.random() * 3000; // 4-7 seconds
    currentTime += interval;
    timestamps.push(Math.round(currentTime));
  }

  return timestamps;
}

// Example output for 15 messages:
// [0, 5200, 10800, 15300, 20500, 26100, ...]
// Intervals: [5.2s, 5.6s, 4.5s, 5.2s, 5.6s, ...]
```

---

### Decision 10: Data Storage Format

**Context:**
- Need to store 34 new dialogues
- Existing dialogues (artwork-1 to 4) use ES6 module format (.js files)
- Alternative: JSON files

**Options Considered:**

**Option A: JSON files (artwork-5.json)**
- Pros: Standard format, easy to parse, portable
- Cons: Cannot use in ES6 modules without async import

**Option B: ES6 modules (artwork-5.js) (SELECTED)**
- Pros: Matches existing format, supports code generation, tree-shakable
- Cons: Requires build step for some environments

**Option C: Single large dialogues.json file**
- Pros: Single file, simple deployment
- Cons: Large file size (~2MB), slow parsing, harder to maintain

**Decision:** Option B (ES6 Modules)

**Rationale:**
- Consistency with existing artwork-1 to 4 dialogues
- Modular structure (easy to add/remove artworks)
- Git-friendly (separate files = clearer diffs)
- Code generation friendly (can use template literals)
- Modern web development standard

**File Structure:**
```javascript
// js/data/dialogues/artwork-5.js

/**
 * Dialogue for artwork-5
 * Artwork: "作品标题" by 艺术家
 * Generated: 2025-11-12
 * Source: Converted from critiques in data.json
 */

export const artwork5Dialogue = {
  id: "artwork-5-dialogue",
  artworkId: "artwork-5",
  participants: ["su-shi", "guo-xi", "john-ruskin", "mama-zola", "professor-petrova", "ai-ethics-reviewer"],
  messages: [
    {
      id: "msg-artwork-5-1",
      personaId: "su-shi",
      textZh: "...",
      textEn: "...",
      timestamp: 0,
      replyTo: null,
      interactionType: "initial",
      quotedText: null,
      references: [...]
    },
    // ... more messages
  ]
};
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────┐
│  data.json (Source of Truth)            │
│  ├─ artworks[38]                        │
│  ├─ personas[6]                         │
│  └─ critiques[228] ← 92 need English    │
└─────────────┬───────────────────────────┘
              │
              ├─────────────────────────────────────┐
              │                                     │
              ▼                                     ▼
┌─────────────────────────┐         ┌──────────────────────────┐
│  Static Display         │         │  Conversion Pipeline     │
│  (Critique Cards)       │         │                          │
│                         │         │  1. Generate English     │
│  - Artwork detail pages │         │     (Claude API)         │
│  - RPAIT charts         │         │                          │
│  - Critic cards         │         │  2. Segment critiques    │
│                         │         │     (paragraph-based)    │
│  Uses: critiques[]      │         │                          │
└─────────────────────────┘         │  3. Build reply chains   │
                                    │     (strategic)          │
                                    │                          │
                                    │  4. Extract quotes       │
                                    │     (keyword-based)      │
                                    │                          │
                                    │  5. Match references     │
                                    │     (random selection)   │
                                    │                          │
                                    │  6. Detect types         │
                                    │     (keyword matching)   │
                                    │                          │
                                    │  7. Generate timestamps  │
                                    │     (4-7s intervals)     │
                                    └──────────┬───────────────┘
                                               │
                                               ▼
                          ┌───────────────────────────────────────┐
                          │  js/data/dialogues/                  │
                          │  ├─ artwork-1.js (existing)          │
                          │  ├─ artwork-2.js (existing)          │
                          │  ├─ artwork-3.js (existing)          │
                          │  ├─ artwork-4.js (existing)          │
                          │  ├─ artwork-5.js (NEW)               │
                          │  ├─ ...                              │
                          │  ├─ artwork-38.js (NEW)              │
                          │  └─ index.js (exports DIALOGUES[38]) │
                          └───────────┬───────────────────────────┘
                                      │
                                      ▼
                          ┌────────────────────────────┐
                          │  Interactive Display       │
                          │  (Dialogue Player)         │
                          │                            │
                          │  - Animated timeline       │
                          │  - Quote interaction       │
                          │  - Thought chain carousel  │
                          │  - Reference links         │
                          │                            │
                          │  Uses: dialogues/          │
                          └────────────────────────────┘
```

---

## Performance Considerations

### Conversion Script Performance

**Expected Performance:**
- Text segmentation: ~10ms per critique
- Reply chain construction: ~5ms per message
- Quote extraction: ~15ms per message
- Reference matching: ~20ms per message (file I/O)
- Interaction type detection: ~5ms per message
- Timestamp generation: ~1ms per message

**Total per artwork:**
- 6 critiques → ~15 messages
- ~15ms per critique × 6 = 90ms
- ~46ms per message × 15 = 690ms
- **Total: ~800ms per artwork**

**Batch processing 34 artworks:**
- 34 × 800ms = 27.2 seconds
- Plus file I/O overhead: ~30-40 seconds total
- **Acceptable** (under 1 minute)

### English Translation Performance

**Claude API Performance:**
- Request time: ~60-90 seconds per critique (model processing)
- Rate limit: 5 requests/minute (free tier) or 50 requests/minute (paid)
- 92 critiques:
  - Free tier: 92 / 5 = 18.4 minutes
  - Paid tier: 92 / 50 = 1.84 minutes + processing = ~2.5-3 hours total

**Optimization:**
- Use paid tier if available
- Batch requests (5-10 concurrent)
- Implement retry logic for failures
- Save progress every 10 translations

### Runtime Performance (User-Facing)

**Dialogue Loading:**
- 38 dialogue files × ~50KB each = ~2MB total
- Lazy loading: Only load dialogue when user clicks artwork
- **Fast** (modern browsers handle ES6 modules efficiently)

**Dialogue Player Rendering:**
- 15-20 messages per dialogue
- Render time: <100ms for full dialogue
- Animation: 60fps, no jank
- **Smooth** (existing dialogues already tested)

---

## Error Handling Strategy

### Conversion Script Errors

**Type 1: Missing Input Data**
```javascript
if (!critique || !critique.textZh) {
  console.error(`❌ Critique missing textZh: ${critique.artworkId}/${critique.personaId}`);
  return null; // Skip this critique
}
```

**Type 2: Invalid Segmentation**
```javascript
if (segments.length === 0) {
  console.warn(`⚠ No segments created for ${critique.artworkId}/${critique.personaId}`);
  // Fallback: Create single message with full text
  segments = [{ textZh: critique.textZh, textEn: critique.textEn, type: 'initial' }];
}
```

**Type 3: Broken Reply Chain**
```javascript
if (replyTo && !messages.find(m => m.personaId === replyTo)) {
  console.warn(`⚠ Invalid replyTo: ${replyTo} not found, setting to null`);
  replyTo = null;
}
```

### Translation API Errors

**Type 1: API Failure**
```javascript
try {
  const textEn = await translateCritique(critique);
} catch (error) {
  console.error(`❌ Translation failed for ${critique.artworkId}/${critique.personaId}:`, error);
  // Save progress and retry later
  saveProgress();
  throw error; // Propagate to caller
}
```

**Type 2: Rate Limit**
```javascript
if (error.status === 429) {
  console.warn(`⏳ Rate limited, waiting 60 seconds...`);
  await sleep(60000);
  return await translateCritique(critique); // Retry
}
```

### Runtime Errors (User-Facing)

**Type 1: Dialogue File Not Found**
```javascript
try {
  const dialogue = await import(`./dialogues/artwork-${id}.js`);
} catch (error) {
  console.error(`❌ Dialogue not found: artwork-${id}`, error);
  showErrorMessage('Dialogue data not available for this artwork.');
}
```

**Type 2: Invalid Dialogue Structure**
```javascript
if (!dialogue.messages || dialogue.messages.length === 0) {
  console.error(`❌ Invalid dialogue: ${dialogue.id}`);
  showErrorMessage('Dialogue data is incomplete.');
}
```

---

## Testing Strategy

### Unit Tests (Conversion Functions)

**Test Coverage:**
- [ ] Text segmentation (various lengths, edge cases)
- [ ] Reply chain construction (all interaction types)
- [ ] Quote extraction (with/without keywords)
- [ ] Interaction type detection (all 6 types)
- [ ] Reference matching (valid personaIds)
- [ ] Timestamp generation (monotonic, correct intervals)

**Test Framework:** Node.js built-in `assert` module (no external dependencies)

**Example Test:**
```javascript
// test/conversion.test.js
const assert = require('assert');
const { segmentCritique } = require('../scripts/convert-critiques-to-dialogues.js');

describe('Text Segmentation', () => {
  it('should split long critique into 2-3 segments', () => {
    const critique = {
      textZh: '观此作...'.repeat(100), // 800 chars
      textEn: 'Observing...'.repeat(100)
    };
    const segments = segmentCritique(critique);
    assert(segments.length >= 2 && segments.length <= 3);
    assert(segments[0].textZh.length >= 200);
  });
});
```

### Integration Tests (End-to-End)

**Test Scenarios:**
1. Convert single artwork → validate output file
2. Batch convert 3 artworks → validate all files
3. Load converted dialogues in test page → verify display
4. Validate reply chains → check no broken references
5. Validate quotes → check non-empty for non-initial messages

### Manual QA Checklist

**Before Deployment:**
- [ ] 3 sample dialogues visually inspected (artwork-5, artwork-20, artwork-38)
- [ ] All validation scripts pass (validate-dialogue-data.js)
- [ ] Test page loads without console errors
- [ ] Dialogue player animations work correctly
- [ ] Quote hover/click interactions work
- [ ] References appear in message data
- [ ] Language switch works (Chinese/English)

---

## Future Enhancement Opportunities

### Phase 2 Enhancements (If Quality Issues)

1. **Semantic Quote Extraction**
   - Use sentence-transformers for similarity matching
   - Select quotes most relevant to current message context
   - Expected improvement: 20-30% better quote relevance

2. **Semantic Reference Matching**
   - Embed message text and knowledge base references
   - Match by cosine similarity
   - Expected improvement: References directly support message content

3. **ML-Based Interaction Type Classification**
   - Train classifier on existing 85 messages (artwork-1 to 4)
   - 6-class classification (initial/agree/question/counter/synthesize/reflect)
   - Expected improvement: 15-20% better type accuracy

### Phase 3 Enhancements (User Experience)

4. **Custom Thought Chains per Artwork**
   - Extract key themes from artwork context
   - Generate 3-4 artwork-specific thought steps
   - More contextual "thinking..." animations

5. **Interactive Reference Viewer**
   - Click reference to view full knowledge base entry
   - Popup modal with complete quote and context
   - Educational value for understanding critics

6. **Dialogue Branching**
   - Allow users to "rewind" and explore alternative conversation paths
   - Simulate "what if Ruskin agreed instead of questioned?"
   - Advanced feature for future versions

---

## Maintenance Plan

### Regeneration Procedure

**If critique content is updated:**
1. Edit critiques in `data.json`
2. Delete affected dialogue file(s)
3. Re-run conversion script: `node scripts/convert-critiques-to-dialogues.js --artwork artwork-5`
4. Validate output
5. Deploy updated dialogue file

**Time Required:** ~5 minutes per artwork

### Adding New Artworks (Artwork 39+)

**Procedure:**
1. Add artwork and 6 critiques to `data.json`
2. Generate English translations if needed
3. Run conversion script: `node scripts/convert-critiques-to-dialogues.js --artwork artwork-39`
4. Update `js/data/dialogues/index.js` (add import and export)
5. Test dialogue in test page
6. Deploy

**Time Required:** ~30 minutes per artwork (including manual review)

---

## Conclusion

This design establishes a **hybrid critique-dialogue system** that:
- ✅ Preserves all existing work (228 critiques)
- ✅ Adds 5 dialogue features (reply chains, quotes, references, thought chains, interaction markers)
- ✅ Supports two use cases (static cards + interactive player)
- ✅ Achieves 80-90% automation (9-12 hours total vs 20+ hours manual)
- ✅ Maintains consistency with existing dialogue system (artwork-1 to 4)
- ✅ Provides clear upgrade path for quality improvements

The architecture prioritizes **pragmatism over perfectionism**: get a working system deployed quickly, then iterate based on user feedback and usage data.
