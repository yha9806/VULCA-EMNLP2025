# Proposal: Create Hybrid Critique-Dialogue System

**Change ID:** `create-hybrid-critique-dialogue-system`
**Status:** Draft
**Author:** Yu Haorui + Claude
**Date:** 2025-11-12
**Target Version:** 4.1.0
**Depends On:** `expand-exhibition-with-real-artworks` (Phase 2 completion)

---

## What Changes

Transform the existing 228 standalone critiques (from `expand-exhibition-with-real-artworks`) into a **hybrid system** that supports both static critique display AND interactive dialogue playback, while preserving all existing content and adding missing features.

**Key Changes:**
1. **Preserve existing data**: Keep all 228 critiques in `data.json` (used for static display)
2. **Fix missing translations**: Generate English text for 92 critiques currently lacking `textEn`
3. **Generate dialogue data**: Create 34 new dialogue files (artwork-5 to artwork-38) by converting critiques into interactive messages
4. **Add dialogue features**: Implement reply chains, quoted text, knowledge base references, interaction types, timestamps
5. **Enable dual display modes**:
   - Static mode: Critique cards on artwork detail pages (uses `data.json`)
   - Interactive mode: Animated dialogue player (uses `js/data/dialogues/`)

**Affected Files:**
- `/exhibitions/negative-space-of-the-tide/data.json` (add missing English translations)
- `/js/data/dialogues/artwork-5.js` through `/js/data/dialogues/artwork-38.js` (NEW, 34 files)
- `/js/data/dialogues/index.js` (update to export all 38 dialogues)
- `/scripts/convert-critiques-to-dialogues.js` (NEW, automated conversion tool)
- `/scripts/generate-missing-english.js` (NEW, translation generator)

---

## Why

### Problem Statement

**Current State After Phase 2 Completion:**
- ✅ 228 critiques generated (38 artworks × 6 critics)
- ✅ All critiques have Chinese text (`textZh`)
- ❌ 92 critiques missing English text (`textEn`)
- ❌ Critiques are standalone reviews, NOT interactive dialogues
- ❌ Missing 5 dialogue features: reply chains, quotes, references, thought chains, interaction markers

**User's Question (Message from conversation):**
> "我需要知道这些评论内容是对话的吗？参考之前的形式（对话，引文，参考，思维链，以及总结标志）"

**Analysis Result:**
The generated critiques are **standalone reviews**, completely lacking the 5 core features of the dialogue system:

| Feature | Old Dialogue System (artwork-1 to 4) | Current Critiques (artwork-1 to 38) |
|---------|--------------------------------------|-------------------------------------|
| **Dialogues** (reply chains) | ✅ 85 messages with `replyTo` | ❌ No interaction |
| **Quotes** (`quotedText`) | ✅ 34 quote relationships | ❌ No quotes |
| **References** (knowledge base) | ✅ All messages have `references[]` | ❌ No references |
| **Thought Chains** | ✅ Defined in `THOUGHT_CHAINS` | ❌ No thought chains |
| **Interaction Markers** | ✅ 6 types (`synthesize`, `reflect`, etc.) | ❌ No types |

**User's Proposed Solution:**
> "能不能生成一个 critiques+对话的混合系统？不浪费现在的内容，同时补充上缺失的英文内容。"

This is the **optimal approach**: preserve existing work, add missing features, enable both static and interactive display modes.

### Context

**Previous Work:**
- **expand-exhibition-with-real-artworks (Phase 1):** Migrated 38 artworks, replaced demo content
- **expand-exhibition-with-real-artworks (Phase 2):** Generated 228 critiques using LLM + knowledge base
- **Data status check (Session 3):** Discovered 92 missing English translations, identified dialogue feature gap

**Existing Dialogue System (artwork-1 to 4):**
- 4 continuous dialogues with 85 messages total
- Full implementation of all 5 features
- Tested and working in `test-quote-interaction.html`
- Source: `js/data/dialogues/artwork-1.js` through `artwork-4.js`

**Why Hybrid System is Better Than:**

**Alternative 1: Keep only critiques**
- ❌ Loses interactive dialogue player experience
- ❌ Cannot use existing DialoguePlayer component
- ❌ Misses opportunity for engaging animation

**Alternative 2: Delete critiques, regenerate as dialogues**
- ❌ Wastes 20+ hours of Phase 2 work
- ❌ Loses high-quality standalone critiques
- ❌ Requires regenerating all 228 texts

**Alternative 3: Hybrid system (SELECTED)**
- ✅ Preserves all existing critiques (no wasted work)
- ✅ Adds interactive dialogue capability
- ✅ Supports two use cases: static cards + animated player
- ✅ Reuses existing dialogue system code
- ✅ Only 9-12 hours additional work

### Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Conversion quality** (critique → dialogue messages) | Medium | Manual review of 2-3 sample dialogues before batch processing |
| **English translation quality** (LLM-generated) | Medium | Use Claude 3.5 Sonnet with knowledge base context for consistency |
| **Data duplication** (same content in two places) | Low | Clear documentation: critiques for static, dialogues for interactive |
| **Maintenance burden** (updating both systems) | Low | Critiques are stable, dialogues can be regenerated from critiques if needed |
| **Timestamp realism** (4-7 second intervals) | Low | Use random intervals matching existing dialogue pattern |

---

## How

### High-Level Approach

**4-Phase Implementation:**

1. **Phase 1: Fix Missing English Translations (3-4 hours)**
   - Identify 92 critiques lacking `textEn`
   - Generate English using Claude 3.5 Sonnet with knowledge base context
   - Update `data.json` with translations
   - Validate all 228 critiques now have complete bilingual content

2. **Phase 2: Build Automated Conversion Tool (2-3 hours)**
   - Create `scripts/convert-critiques-to-dialogues.js`
   - Implement critique → dialogue message converter
   - Add reply chain builder (sequential + strategic)
   - Implement quote extractor (keyword-based sentence selection)
   - Implement reference matcher (auto-link to knowledge base)
   - Implement interaction type detector (keyword analysis)

3. **Phase 3: Generate 34 New Dialogues (2-3 hours)**
   - Convert artwork-5 through artwork-38 critiques to dialogues
   - Generate 12-18 messages per artwork (~500-600 total messages)
   - Validate message structure (all required fields present)
   - Test 2-3 sample dialogues in `test-quote-interaction.html`

4. **Phase 4: Integration & Validation (1-2 hours)**
   - Update `js/data/dialogues/index.js` to export all 38 dialogues
   - Run `scripts/validate-dialogue-data.js` on all dialogues
   - Verify reply chains are valid
   - Verify quotes are present
   - Verify references link to knowledge base
   - Test dialogue player with new dialogues

### Data Structures

#### **Critique Object (UNCHANGED, in data.json)**
```json
{
  "artworkId": "artwork-5",
  "personaId": "su-shi",
  "textZh": "观此作...(800-1500字)...",
  "textEn": "Observing this work...(800-1500 chars)...",
  "rpait": { "R": 7, "P": 9, "A": 8, "I": 8, "T": 6 }
}
```

**Usage:** Static display on artwork detail pages, critique cards, RPAIT charts

#### **Dialogue Message (NEW, generated from critiques)**
```javascript
{
  id: "msg-artwork-5-1",
  personaId: "su-shi",
  textZh: "...(从critique前半部分提取)...",
  textEn: "...(从critique前半部分提取)...",
  timestamp: 0,
  replyTo: null,                    // ⭐ NEW: Reply relationship
  interactionType: "initial",       // ⭐ NEW: Interaction marker
  quotedText: null,                  // ⭐ NEW: Quoted text (for later messages)
  references: [                      // ⭐ NEW: Knowledge base links
    {
      critic: "su-shi",
      source: "poetry-and-theory.md",
      quote: "论画以形似，见与儿童邻",
      page: "Section 1: Quote 1"
    }
  ]
}
```

**Usage:** Interactive dialogue player, animated timeline, quote interaction

### Conversion Strategy: Critique → Dialogue

#### **Step 1: Text Segmentation**

Each long critique (800-1500 characters) is split into 2-3 shorter messages:

```javascript
// Example: Su Shi's critique (1200 characters)
// Original critique: "观此作...（长文本）...建议思考..."

// ↓ Split into 3 messages:

// Message 1 (initial, ~400 chars): Opening observation
"观此作，机械与自然交织...这种技术介入，是否能诞生新的美学范式？"

// Message 2 (agree-extend, ~500 chars): Deep analysis
"机械的精确性与艺术的随机性，在此作中形成了奇妙的对话...技术虽新，艺术之本质从未改变。"

// Message 3 (reflect, ~300 chars): Reflection/conclusion
"重要的不是工具是否有温度，而是整个系统是否共同指向了某种超越物质的精神表达。"
```

**Segmentation Rules:**
- Split at natural paragraph breaks (句号/period after complete thought)
- Aim for 200-600 characters per message (readable length)
- Prioritize message 1 (initial observation), message N (conclusion/reflection)

#### **Step 2: Reply Chain Construction**

Build sequential reply relationships:

```
su-shi (initial, timestamp: 0)
  ↓ replyTo: "su-shi"
guo-xi (agree-extend, timestamp: 4500)
  ↓ replyTo: "guo-xi"
john-ruskin (question-challenge, timestamp: 9000)
  ↓ replyTo: "guo-xi" (challenge the agreement)
mama-zola (synthesize, timestamp: 13500)
  ↓ replyTo: null (synthesize all perspectives)
professor-petrova (agree-extend, timestamp: 18000)
  ↓ replyTo: "mama-zola"
ai-ethics-reviewer (reflect, timestamp: 22500)
```

**Reply Strategy:**
- `initial`: First message, no replyTo
- `agree-extend`, `question-challenge`, `counter`: Reply to previous persona
- `synthesize`, `reflect`: Reply to null (addresses whole conversation)

#### **Step 3: Quote Extraction**

Extract key sentence from previous message for `quotedText`:

```javascript
function extractQuotedText(messageText, maxLength = 50) {
  // Strategy: Find sentence with key concepts
  const keywords = ['艺术', '技术', '创作', '表达', 'art', 'technology', 'creation'];
  const sentences = splitSentences(messageText);

  for (let s of sentences) {
    if (keywords.some(k => s.includes(k)) && s.length > 15 && s.length < maxLength) {
      return s.trim();
    }
  }

  // Fallback: first non-trivial sentence
  return sentences[0].substring(0, maxLength) + '...';
}
```

**Example:**
```javascript
// Previous message: "机械的精确性与艺术的随机性，在此作中形成了奇妙的对话。"
// Extracted quote: "机械的精确性与艺术的随机性"
quotedText: "机械的精确性与艺术的随机性"
```

#### **Step 4: Interaction Type Detection**

Use keyword matching to assign interaction types:

```javascript
const INTERACTION_KEYWORDS = {
  'agree-extend': {
    zh: ['正如', '同意', '深以为然', '确实', '的确'],
    en: ['I agree', 'As mentioned', 'Indeed', 'Certainly']
  },
  'question-challenge': {
    zh: ['但是', '然而', '疑问', '质疑', '是否'],
    en: ['However', 'But', 'Question', 'Challenge', 'Whether']
  },
  'counter': {
    zh: ['不对', '反驳', '错误', '不同意', '恰恰相反'],
    en: ['Incorrect', 'Disagree', 'Contrary', 'Opposite']
  },
  'synthesize': {
    zh: ['综合', '总结', '整体', '三位所言', '听你们讨论'],
    en: ['Overall', 'In summary', 'Synthesizing', 'Hearing your discussion']
  },
  'reflect': {
    zh: ['反思', '重新思考', '让我思考', '我意识到'],
    en: ['Reflection', 'Reconsider', 'Makes me think', 'I realize']
  }
};

function detectInteractionType(textZh, textEn, position) {
  // First message is always 'initial'
  if (position === 0) return 'initial';

  // Check for keyword matches
  for (let [type, keywords] of Object.entries(INTERACTION_KEYWORDS)) {
    const hasZh = keywords.zh.some(k => textZh.includes(k));
    const hasEn = keywords.en.some(k => textEn.includes(k));
    if (hasZh || hasEn) return type;
  }

  // Default: agree-extend (most common)
  return 'agree-extend';
}
```

#### **Step 5: Reference Matching**

Auto-link to knowledge base using persona ID:

```javascript
function matchReferences(personaId, messageText) {
  // Load critic's knowledge base
  const knowledgeBase = loadKnowledgeBase(`knowledge-base/critics/${personaId}/`);

  // Simple strategy: Select 2-3 random references from key-concepts.md
  // TODO: Could be enhanced with semantic matching later
  const allReferences = knowledgeBase.references;
  const selectedRefs = [];

  // Pick 2-3 references randomly
  for (let i = 0; i < 3 && i < allReferences.length; i++) {
    const randomIndex = Math.floor(Math.random() * allReferences.length);
    selectedRefs.push(allReferences[randomIndex]);
  }

  return selectedRefs;
}
```

**Reference Structure:**
```javascript
{
  critic: "su-shi",
  source: "poetry-and-theory.md",
  quote: "论画以形似，见与儿童邻",
  page: "Section 1: Quote 1"
}
```

#### **Step 6: Timestamp Generation**

Create natural-feeling intervals:

```javascript
function generateTimestamps(messageCount) {
  const timestamps = [0]; // First message at t=0
  let currentTime = 0;

  for (let i = 1; i < messageCount; i++) {
    // Random interval between 4000-7000ms (4-7 seconds)
    const interval = 4000 + Math.random() * 3000;
    currentTime += interval;
    timestamps.push(Math.round(currentTime));
  }

  return timestamps;
}
```

**Result:** Natural dialogue pacing matching existing artwork-1 to 4 dialogues

### Automated Conversion Tool Architecture

```javascript
// scripts/convert-critiques-to-dialogues.js

const fs = require('fs');
const data = require('../exhibitions/negative-space-of-the-tide/data.json');

// Main conversion function
async function convertArtworkToDialogue(artworkId) {
  // 1. Load critiques for this artwork
  const critiques = data.critiques.filter(c => c.artworkId === artworkId);
  const artwork = data.artworks.find(a => a.id === artworkId);

  console.log(`\n=== Converting ${artworkId}: ${artwork.titleZh} ===`);
  console.log(`Input: ${critiques.length} critiques`);

  // 2. Split critiques into messages (2-3 messages per critique)
  const messages = [];
  const timestamps = generateTimestamps(critiques.length * 2.5); // ~15 messages
  let msgIndex = 0;

  for (let i = 0; i < critiques.length; i++) {
    const critique = critiques[i];
    const segments = segmentCritique(critique);

    for (let j = 0; j < segments.length; j++) {
      const segment = segments[j];
      const prevPersona = msgIndex > 0 ? messages[msgIndex - 1].personaId : null;

      messages.push({
        id: `msg-${artworkId}-${msgIndex + 1}`,
        personaId: critique.personaId,
        textZh: segment.textZh,
        textEn: segment.textEn,
        timestamp: timestamps[msgIndex],
        replyTo: determineReplyTo(msgIndex, prevPersona, segment.type),
        interactionType: segment.type,
        quotedText: prevPersona ? extractQuotedText(messages[msgIndex - 1].textZh) : null,
        references: matchReferences(critique.personaId, segment.textZh)
      });

      msgIndex++;
    }
  }

  console.log(`Output: ${messages.length} messages`);

  // 3. Build dialogue object
  const dialogue = {
    id: `${artworkId}-dialogue`,
    artworkId: artworkId,
    participants: critiques.map(c => c.personaId),
    messages: messages
  };

  return dialogue;
}

// Batch processing
async function convertAllArtworks(startId, endId) {
  for (let i = startId; i <= endId; i++) {
    const artworkId = `artwork-${i}`;
    const dialogue = await convertArtworkToDialogue(artworkId);

    // Save to file
    const outputPath = `./js/data/dialogues/${artworkId}.js`;
    const content = generateDialogueFileContent(dialogue);
    fs.writeFileSync(outputPath, content, 'utf8');

    console.log(`✅ Saved: ${outputPath}`);
  }
}

// Run conversion
convertAllArtworks(5, 38);
```

### English Translation Generation

```javascript
// scripts/generate-missing-english.js

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const data = require('../exhibitions/negative-space-of-the-tide/data.json');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

async function translateCritique(critique) {
  const persona = data.personas.find(p => p.id === critique.personaId);
  const artwork = data.artworks.find(a => a.id === critique.artworkId);

  const prompt = `Translate the following Chinese art critique into English.

Context:
- Critic: ${persona.nameEn} (${persona.nameZh})
- Artwork: ${artwork.titleEn} by ${artwork.artist}
- Critical perspective: ${persona.period}

Chinese critique:
${critique.textZh}

Requirements:
1. Maintain the critic's voice and philosophical depth
2. Preserve specialized art terminology
3. Keep the same structure and paragraph breaks
4. Aim for 1000-1500 English characters
5. Use academic but accessible language

English translation:`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }]
  });

  return message.content[0].text;
}

async function generateAllMissingEnglish() {
  const missing = data.critiques.filter(c => !c.textEn);
  console.log(`Found ${missing.length} critiques missing English text\n`);

  for (let i = 0; i < missing.length; i++) {
    const critique = missing[i];
    console.log(`[${i + 1}/${missing.length}] Translating ${critique.artworkId} - ${critique.personaId}...`);

    const textEn = await translateCritique(critique);
    critique.textEn = textEn;

    // Save progress every 10 critiques
    if ((i + 1) % 10 === 0) {
      fs.writeFileSync(
        './exhibitions/negative-space-of-the-tide/data.json',
        JSON.stringify(data, null, 2)
      );
      console.log(`  ✅ Progress saved (${i + 1}/${missing.length})`);
    }
  }

  // Final save
  fs.writeFileSync(
    './exhibitions/negative-space-of-the-tide/data.json',
    JSON.stringify(data, null, 2)
  );

  console.log(`\n✅ All ${missing.length} translations generated and saved`);
}

generateAllMissingEnglish();
```

---

## Success Criteria

### Data Completeness
- [ ] All 228 critiques have `textEn` (92 newly generated)
- [ ] 34 new dialogue files created (artwork-5.js through artwork-38.js)
- [ ] ~500-600 new dialogue messages generated (12-18 per artwork)
- [ ] All dialogue messages have required fields: id, personaId, textZh, textEn, timestamp, replyTo, interactionType, quotedText, references

### Data Quality
- [ ] English translations maintain critic's voice and philosophical depth
- [ ] Reply chains are logically consistent (no broken references)
- [ ] Quoted text accurately reflects previous messages
- [ ] References link to valid knowledge base sources
- [ ] Interaction types match message content (keyword validation)
- [ ] Timestamps create natural pacing (4-7 second intervals)

### System Integration
- [ ] `js/data/dialogues/index.js` exports all 38 dialogues
- [ ] `scripts/validate-dialogue-data.js` passes all checks
- [ ] Test dialogue player with 3 sample dialogues (artwork-5, artwork-20, artwork-38)
- [ ] No console errors when loading dialogues
- [ ] Both display modes work: static critiques + interactive dialogues

### Validation Tests
```bash
# Test 1: Check English translation completeness
node -e "const d=require('./exhibitions/negative-space-of-the-tide/data.json'); const missing = d.critiques.filter(c => !c.textEn); console.log('Missing English:', missing.length, 'Expected: 0')"

# Test 2: Check dialogue count
node -e "const {DIALOGUES}=require('./js/data/dialogues/index.js'); console.log('Total dialogues:', DIALOGUES.length, 'Expected: 38')"

# Test 3: Check message count
node -e "const {DIALOGUES}=require('./js/data/dialogues/index.js'); const total = DIALOGUES.reduce((sum, d) => sum + d.messages.length, 0); console.log('Total messages:', total, 'Expected: 580-680')"

# Test 4: Validate reply chains
node scripts/validate-dialogue-data.js

# Test 5: Test dialogue player
python -m http.server 9999
# Visit: http://localhost:9999/test-quote-interaction.html
# Load artwork-5 dialogue and verify:
# - Messages display correctly
# - Reply relationships shown
# - Quotes appear on hover
# - References link to knowledge base
```

---

## Open Questions

1. **Quote extraction quality:** Should we use semantic similarity (sentence-transformers) instead of keyword matching?
   - **Recommendation:** Start with keyword matching (simpler, faster), upgrade if quality issues

2. **Reference selection:** Should references be semantically matched to message content, or random selection is sufficient?
   - **Recommendation:** Random selection from critic's knowledge base (faster), can enhance later

3. **Message count per dialogue:** Fixed number (e.g., 15 messages) or variable based on critique length?
   - **Recommendation:** Variable (12-18 messages), adapting to content

4. **Thought chain updates:** Should we generate new thought chain templates for artwork-5 to 38?
   - **Recommendation:** Reuse existing 6 critic templates (already defined in dialogue-player.js)

5. **Testing scope:** Test all 34 dialogues or sample testing sufficient?
   - **Recommendation:** Automated validation + manual test of 3 samples (beginning/middle/end)

---

## Dependencies

**Depends On:**
- `expand-exhibition-with-real-artworks` Phase 2 completion (228 critiques generated)
- Knowledge base system (6 critics, ~300 references) - already complete
- Existing dialogue system code (DialoguePlayer, ThoughtChainVisualizer) - already implemented

**Blocks:**
- Dialogue page integration (can use test page temporarily)
- Navigation menu update (add "Dialogues" link)

**Related Changes:**
- `expand-exhibition-with-real-artworks` (provides critique data)
- `merge-threads-to-continuous-dialogue` (established dialogue data structure)

---

## Estimated Effort

| Phase | Tasks | Automation | Estimated Time |
|-------|-------|-----------|---------------|
| **Phase 1: English Translations** | Generate 92 missing `textEn` | 80% automated (LLM) | 3-4 hours |
| **Phase 2: Conversion Tool** | Build `convert-critiques-to-dialogues.js` | 90% automated | 2-3 hours |
| **Phase 3: Generate Dialogues** | Convert 34 artworks, ~500-600 messages | 95% automated | 2-3 hours |
| **Phase 4: Integration** | Update index.js, validate, test | 90% automated | 1-2 hours |
| **Manual Review** | Sample testing, quality check | Manual | 1 hour |
| **Total** | | | **9-13 hours** |

**Phased Delivery:**
- **Milestone 1 (Phase 1):** All critiques have English text, data.json complete (~4 hours)
- **Milestone 2 (Phase 2+3):** 34 dialogue files generated, validated (~5 hours)
- **Milestone 3 (Phase 4):** System integrated, tested, ready for use (~2 hours)

---

## References

- **Research Report:** Conversation analysis identifying critique vs dialogue gap
- **Dialogue System Examples:** `js/data/dialogues/artwork-1.js` (template)
- **Knowledge Base:** `knowledge-base/critics/` (6 critics, ~300 references)
- **Test Page:** `test-quote-interaction.html` (user's preferred implementation)
- **Validation Script:** `scripts/validate-dialogue-data.js`
- **Data Status Check:** `scripts/check-data-status.js`, `scripts/check-missing-english.js`
