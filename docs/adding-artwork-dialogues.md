# Adding Artwork Dialogues - Complete Guide

This guide walks you through creating dialogue content for artworks in the VULCA gallery. Follow these steps to maintain consistency, quality, and integration with the dialogue system.

**Estimated Time**: 50-90 minutes per artwork (6 threads, ~36 messages total)

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Detailed Workflow](#detailed-workflow)
4. [Quality Checklist](#quality-checklist)
5. [Troubleshooting](#troubleshooting)
6. [Examples](#examples)

---

## Prerequisites

### Required Knowledge
- Basic JavaScript syntax (ES6 modules)
- Familiarity with VULCA's 6 cultural critics and their perspectives
- Understanding of the artwork you're creating dialogues for

### Required Files
- `js/data.js` - Review artwork details and existing critiques
- `scripts/generate-dialogue.js` - Dialogue generation CLI tool
- `scripts/validate-dialogues.js` - Validation tool
- `scripts/templates/` - Template files for reference

### Tools Setup
```bash
# Ensure Node.js is installed
node --version  # Should be v14+ or higher

# Navigate to project root
cd path/to/VULCA-EMNLP2025

# Test tools work
node scripts/generate-dialogue.js --help
node scripts/validate-dialogues.js --help
```

---

## Quick Start

**If you're in a hurry, follow these 5 steps:**

```bash
# 1. Generate template and instructions
node scripts/generate-dialogue.js --artwork-id artwork-5

# 2. Create dialogue file following the instructions
# (manually write dialogue content in js/data/dialogues/artwork-5.js)

# 3. Validate your work
node scripts/validate-dialogues.js --artwork artwork-5

# 4. Import in index file
# Edit js/data/dialogues/index.js to add your import

# 5. Test in browser
# Visit http://localhost:9999 and verify dialogues play correctly
```

---

## Detailed Workflow

### Step 1: Understand the Artwork (10-15 minutes)

Before writing any dialogue, thoroughly understand the artwork:

1. **Open `js/data.js`** and locate your artwork:
   ```javascript
   {
     id: "artwork-1",
     titleZh: "记忆（绘画操作单元：第二代）",
     titleEn: "Memory (Painting Operation Unit: Second Generation)",
     artist: "Sougwen Chung",
     year: 2022,
     context: "...",
     imageUrl: "/assets/artwork-1.jpg"
   }
   ```

2. **Read all 6 existing critiques** for this artwork (lines ~100-296 in data.js)
   - Note each persona's perspective
   - Identify themes they emphasize
   - Look for potential dialogue connections

3. **Visual Analysis** (if image available):
   - What are the dominant visual elements?
   - What techniques are used?
   - What emotions does it evoke?

4. **Research Context** (optional but recommended):
   - Artist's background and intent
   - Historical/cultural context
   - Related artworks or movements

---

### Step 2: Run Generation Tool (2 minutes)

```bash
node scripts/generate-dialogue.js --artwork-id artwork-5 --threads 6 --messages 6
```

This will output:
- Configuration summary
- Step-by-step instructions
- Topic templates
- Message structure examples
- File template
- Integration instructions

**Tip**: Keep this terminal open or save output to a text file for reference.

---

### Step 3: Plan Dialogue Topics (15-20 minutes)

You need to create **6 dialogue threads** with diverse topics. Use the topic templates:

#### Template Selection Matrix

| Template | Focus | Participants | Best For |
|----------|-------|--------------|----------|
| **Technique Focus** | Execution, craft | Guo Xi, Petrova, Ruskin | Artworks with notable technical aspects |
| **Philosophy & Concept** | Meaning, ideas | Su Shi, Ruskin, AI Ethics | Conceptual or abstract works |
| **Cultural Dialogue** | Cross-culture | Mama Zola, Su Shi, Ruskin | Works bridging traditions |
| **Contemporary Relevance** | Modern context | AI Ethics, Petrova, Mama Zola | Technology-driven or socially engaged |
| **Tradition vs Innovation** | Continuity | Su Shi, Guo Xi, Petrova | Works engaging with history |

#### Example Topic Planning for artwork-1

```javascript
// Thread 1: Technique Focus
{
  topic: "机械笔触的韵律美学",
  topicEn: "The Rhythmic Aesthetics of Mechanical Brushstrokes",
  participants: ["su-shi", "guo-xi", "ai-ethics-reviewer"]
}

// Thread 2: Philosophy & Concept
{
  topic: "创作主体的哲学思辨",
  topicEn: "Philosophical Reflection on Creative Agency",
  participants: ["su-shi", "john-ruskin", "professor-petrova"]
}

// Thread 3: Cultural Dialogue
{
  topic: "东西方技艺传统的对话",
  topicEn: "Dialogue Between Eastern and Western Craft Traditions",
  participants: ["guo-xi", "john-ruskin", "mama-zola"]
}

// Thread 4: Contemporary Relevance
{
  topic: "人机协作的伦理维度",
  topicEn: "Ethical Dimensions of Human-Machine Collaboration",
  participants: ["ai-ethics-reviewer", "professor-petrova", "mama-zola"]
}

// Thread 5: Tradition vs Innovation
{
  topic: "传统美学在数字时代的延续",
  topicEn: "Continuity of Traditional Aesthetics in Digital Age",
  participants: ["su-shi", "guo-xi", "professor-petrova"]
}

// Thread 6: Mixed (synthesizing multiple perspectives)
{
  topic: "艺术定义的边界与未来",
  topicEn: "The Boundaries and Future of Art Definition",
  participants: ["john-ruskin", "ai-ethics-reviewer", "mama-zola", "su-shi"]
}
```

**Tips**:
- Vary participant combinations (don't repeat the same trio)
- Balance traditional (Su Shi, Guo Xi, Ruskin) and contemporary (Petrova, AI Ethics, Mama Zola)
- Include at least one thread with 4+ participants for richer dialogue
- Ensure topics connect to the artwork's actual characteristics

---

### Step 4: Write Messages (30-50 minutes)

This is the core work. For each thread, write 5-8 messages following this structure:

#### Message Flow Pattern

```
Message 1: [Persona A] Initial observation
  ↓ (3000ms)
Message 2: [Persona B] Agree-Extend (quotes A)
  ↓ (3000ms)
Message 3: [Persona C] Question-Challenge (quotes B or A)
  ↓ (3000ms)
Message 4: [Persona A or D] Counter (provides different view)
  ↓ (3000ms)
Message 5: [Persona B or C] Synthesize (brings ideas together)
  ↓ (3000ms)
Message 6: [Persona D] Reflect (personal insight)
```

#### Message Structure

Each message requires these fields:

```javascript
{
  id: "msg-artwork-5-1-3",           // Format: msg-[artworkId]-[threadNum]-[msgNum]
  personaId: "su-shi",                // One of 6 valid persona IDs
  textZh: "...",                      // Chinese text (100-150 chars)
  textEn: "...",                      // English text (80-120 words)
  timestamp: 6000,                    // Milliseconds from thread start
  replyTo: "guo-xi",                  // Persona ID being replied to (or null)
  interactionType: "question-challenge", // See interaction types below
  quotedText: "算法的精确性"          // Optional: specific phrase quoted
}
```

#### Interaction Types

| Type | When to Use | Target % |
|------|-------------|----------|
| `initial` | First message of thread | 5-15% |
| `agree-extend` | Agreeing + adding new ideas | 30-50% |
| `question-challenge` | Questioning or challenging | 15-25% |
| `synthesize` | Bringing together viewpoints | 10-20% |
| `counter` | Disagreeing with reasoning | 5-15% |
| `reflect` | Personal reflection | 5-15% |

#### Writing Tips

1. **Persona Voice Consistency**
   - Reference `scripts/templates/persona-voice-guide.md` for each critic's style
   - Check existing critiques in `js/data.js` for voice patterns
   - Use characteristic phrases (e.g., Su Shi: "观此作，如见天地之理")

2. **Bilingual Quality**
   - NOT literal translation—adapt to cultural context
   - Chinese can be more poetic/literary
   - English should be equally sophisticated
   - Aim for equal word count (adjust for language differences)

3. **Reference Visual Elements**
   - Always ground in the actual artwork
   - Mention colors, composition, materials, scale
   - Reference specific techniques visible in the work

4. **Build Conversation**
   - Each message should respond to previous ones
   - Use `quotedText` when replying (pick specific phrase)
   - Create logical progression of ideas
   - Allow disagreement and synthesis

5. **Message Length Guidelines**
   - Initial/Synthesize: 120-150 words (can be longer)
   - Agree-Extend: 100-130 words
   - Question-Challenge/Counter: 80-110 words
   - Reflect: 80-120 words

---

### Step 5: Create Dialogue File (5 minutes)

Create `js/data/dialogues/artwork-5.js` with this structure:

```javascript
/**
 * Dialogue threads for artwork-5
 * Generated: 2025-11-04
 */

export const artwork5Dialogues = [
  {
    id: "artwork-5-thread-1",
    artworkId: "artwork-5",
    topic: "机械笔触的韵律美学",
    topicEn: "The Rhythmic Aesthetics of Mechanical Brushstrokes",
    participants: ["su-shi", "guo-xi", "ai-ethics-reviewer"],
    messages: [
      {
        id: "msg-artwork-5-1-1",
        personaId: "su-shi",
        textZh: "...",
        textEn: "...",
        timestamp: 0,
        replyTo: null,
        interactionType: "initial"
      },
      // ... more messages
    ]
  },
  {
    id: "artwork-5-thread-2",
    // ... thread 2 data
  },
  // ... threads 3-6
];
```

**Important**:
- Export name must be camelCase: `artwork5Dialogues` (no hyphens)
- Array name matches: `export const artwork5Dialogues = [...]`
- Each thread has unique ID: `artwork-5-thread-1`, `artwork-5-thread-2`, etc.
- Message IDs follow format: `msg-artwork-5-[threadNum]-[msgNum]`

---

### Step 6: Validate Your Work (2-3 minutes)

```bash
# Validate the new dialogue file
node scripts/validate-dialogues.js --artwork artwork-5

# For detailed output
node scripts/validate-dialogues.js --artwork artwork-5 --verbose
```

**What validation checks**:
- ✅ Schema (required fields, types)
- ✅ Persona consistency (valid persona IDs)
- ✅ Bilingual quality (both Chinese and English present)
- ✅ Interaction type distribution (balanced)
- ✅ Timestamp ordering (chronological)
- ✅ Reply-to relationships (valid references)
- ✅ Message length (within guidelines)
- ✅ Quote validation (quotedText present for replies)

**If validation fails**:
- Read error messages carefully
- Fix issues one by one
- Re-validate until passing

---

### Step 7: Integrate into System (2 minutes)

1. **Edit `js/data/dialogues/index.js`**:

```javascript
// Add import at top
import { artwork5Dialogues } from './artwork-5.js';

// Add to DIALOGUE_THREADS array
export const DIALOGUE_THREADS = [
  ...artwork5Dialogues,  // ← Add this line
  // ... other dialogues
];
```

2. **Verify import works**:
```bash
# Check for syntax errors
node -e "import('./js/data/dialogues/index.js').then(m => console.log('✓ Import successful'))"
```

---

### Step 8: Test in Browser (5-10 minutes)

1. **Start local server**:
```bash
python -m http.server 9999
```

2. **Open browser**: `http://localhost:9999`

3. **Navigate to artwork**: Click on artwork-5 in gallery

4. **Enable dialogue mode**: (UI button or keyboard shortcut, depending on implementation)

5. **Verify each thread**:
   - [ ] All 6 threads appear in topic list
   - [ ] Topic titles display correctly (Chinese/English switch)
   - [ ] Messages play in order with correct timestamps
   - [ ] Persona names and colors correct
   - [ ] Interaction type badges display
   - [ ] Quote highlights work (if clicking quoted text)
   - [ ] Language switching works for all content
   - [ ] No console errors

6. **Test interactions**:
   - [ ] Play/Pause button works
   - [ ] Speed control (1x, 1.5x, 2x) functions
   - [ ] Timeline scrubber allows jumping
   - [ ] Thread switching works smoothly
   - [ ] Responsive layout on mobile (test at 375px width)

---

## Quality Checklist

Before considering your dialogue content "done", verify:

### Content Quality
- [ ] All 6 threads have distinct, meaningful topics
- [ ] Each persona's voice is consistent with their profile
- [ ] Dialogues reference specific visual elements from artwork
- [ ] Conversation flows naturally (build on each other)
- [ ] Mix of agreement and disagreement (not all harmony)
- [ ] Bilingual content is equally sophisticated
- [ ] Chinese text uses appropriate classical references where relevant
- [ ] English text is clear and accessible

### Technical Quality
- [ ] All required fields present in every message
- [ ] Timestamps ascending within each thread (0, 3000, 6000, etc.)
- [ ] Persona IDs match participants array
- [ ] Reply-to references point to valid personas
- [ ] Interaction types distributed appropriately (~40% agree-extend)
- [ ] Message lengths within guidelines (80-150 words)
- [ ] quotedText present for reply messages
- [ ] No duplicate IDs across all messages

### System Integration
- [ ] File exports correctly (ES6 module syntax)
- [ ] Import added to index.js
- [ ] No JavaScript syntax errors
- [ ] Validation passes without errors
- [ ] Artwork ID matches existing artwork in data.js
- [ ] All persona IDs are valid (check VALIDATION_CONFIG in validate script)

### User Experience
- [ ] Dialogue content adds value (not repetitive of existing critiques)
- [ ] Topics cover diverse aspects of the artwork
- [ ] Conversation length appropriate (~5-8 messages per thread)
- [ ] Language switching seamless
- [ ] Mobile-friendly (readable at small sizes)
- [ ] No overwhelming text density

---

## Troubleshooting

### Common Errors

#### Error: "Missing required field: replyTo"
**Solution**: Every message must have `replyTo` field. Use `null` for initial messages, persona ID for replies.

```javascript
// ✅ Correct
{ replyTo: null, interactionType: "initial" }
{ replyTo: "su-shi", interactionType: "agree-extend" }

// ❌ Wrong
{ interactionType: "initial" }  // Missing replyTo field
```

#### Error: "Invalid persona ID: su-xi"
**Solution**: Check spelling. Valid IDs are:
- `su-shi` (not su-xi)
- `guo-xi` (not guo-shi)
- `john-ruskin`
- `mama-zola`
- `professor-petrova`
- `ai-ethics-reviewer`

#### Error: "Messages not in chronological order"
**Solution**: Ensure timestamps are ascending:
```javascript
// ✅ Correct
timestamp: 0
timestamp: 3000
timestamp: 6000

// ❌ Wrong
timestamp: 0
timestamp: 6000
timestamp: 3000  // Goes backwards!
```

#### Error: "Interaction type outside target range"
**Solution**: This is a WARNING, not error. Rebalance interaction types:
- If too many `counter` messages, change some to `agree-extend`
- If too few `initial`, ensure each thread has exactly 1
- Aim for 40% agree-extend, 20% question-challenge

#### Error: "Could not parse dialogue data"
**Solution**: JavaScript syntax error. Check:
- Missing commas between objects
- Unmatched brackets `[]` or braces `{}`
- Missing quotes around strings
- Trailing commas in arrays (should be OK but check)

#### Warning: "Reply message missing quotedText field"
**Solution**: Add `quotedText` when replying:
```javascript
{
  replyTo: "guo-xi",
  interactionType: "agree-extend",
  quotedText: "算法的精确性"  // ← Add this
}
```

### Validation Won't Run

**Problem**: `node scripts/validate-dialogues.js` does nothing

**Solutions**:
1. Check Node.js installed: `node --version`
2. Ensure you're in project root: `pwd` or `cd`
3. Check file exists: `ls scripts/validate-dialogues.js`
4. Try with explicit path: `node ./scripts/validate-dialogues.js --help`

### Browser Doesn't Show Dialogues

**Problem**: Dialogue mode enabled but no content appears

**Debugging Steps**:
1. Open browser console (F12)
2. Check for errors related to module import
3. Verify import in index.js is correct
4. Test import:
   ```javascript
   import { DIALOGUE_THREADS } from './js/data/dialogues/index.js';
   console.log(DIALOGUE_THREADS.length);
   ```
5. Ensure artwork ID matches exactly (case-sensitive)

---

## Examples

### Example 1: Complete Message with All Fields

```javascript
{
  id: "msg-artwork-1-2-4",
  personaId: "john-ruskin",
  textZh: `我必须提出质疑：算法的'精确性'能等同于艺术的'真实性'吗？真正的艺术源于人类的情感、
  经验与不完美。机械臂再精准，也只是执行预设指令。它能理解'苍茫'吗？能感受'萧瑟'吗？若答案是否，
  那这所谓的'势'不过是表象，缺乏灵魂。艺术的伟大在于人性的投射，这是任何机器都无法企及的。`,

  textEn: `I must raise a fundamental question: Can algorithmic 'precision' truly equate to
  artistic 'authenticity'? True art arises from human emotion, experience, and imperfection.
  No matter how precise, a mechanical arm merely executes preset instructions. Can it understand
  'vastness'? Can it feel 'bleakness'? If the answer is no, then this so-called 'momentum' is
  merely superficial, lacking soul. The greatness of art lies in the projection of humanity—
  something no machine can attain.`,

  timestamp: 9000,
  replyTo: "guo-xi",
  interactionType: "question-challenge",
  quotedText: "算法的精确性反而更接近自然规律"
}
```

**Why this works**:
- ✅ Unique message ID following format
- ✅ Valid persona ID (john-ruskin)
- ✅ Bilingual content, equal quality
- ✅ Appropriate length (100+ words English, ~120 chars Chinese)
- ✅ Timestamp continues from previous (probably 6000ms)
- ✅ References previous speaker (guo-xi)
- ✅ Quotes specific phrase
- ✅ Interaction type matches content (questioning previous claim)
- ✅ Ruskin's voice: moralistic, emphasizing human soul, rhetorical questions

### Example 2: Thread Structure

```javascript
{
  id: "artwork-1-thread-2",
  artworkId: "artwork-1",
  topic: "创作主体的哲学思辨",
  topicEn: "Philosophical Reflection on Creative Agency",
  participants: ["su-shi", "ai-ethics-reviewer", "professor-petrova"],
  messages: [
    {
      // Message 1: Su Shi - initial (philosophical observation)
      id: "msg-artwork-1-2-1",
      personaId: "su-shi",
      interactionType: "initial",
      timestamp: 0,
      replyTo: null
      // ... textZh, textEn
    },
    {
      // Message 2: AI Ethics - agree-extend (adds contemporary perspective)
      id: "msg-artwork-1-2-2",
      personaId: "ai-ethics-reviewer",
      interactionType: "agree-extend",
      timestamp: 3000,
      replyTo: "su-shi",
      quotedText: "技进乎道"
      // ... textZh, textEn
    },
    {
      // Message 3: Petrova - synthesize (academic framing)
      id: "msg-artwork-1-2-3",
      personaId: "professor-petrova",
      interactionType: "synthesize",
      timestamp: 6000,
      replyTo: null  // Synthesizing both previous messages
      // ... textZh, textEn
    },
    {
      // Message 4: Su Shi - reflect (poetic closure)
      id: "msg-artwork-1-2-4",
      personaId: "su-shi",
      interactionType: "reflect",
      timestamp: 9000,
      replyTo: "professor-petrova"
      // ... textZh, textEn
    }
  ]
}
```

**Why this works**:
- ✅ 4 messages with varied interaction types
- ✅ 3 participants all contribute
- ✅ Flow: initial → agree → synthesize → reflect
- ✅ Timestamps increment by 3000ms
- ✅ Mix of replyTo targets (creates conversation network)
- ✅ Topic matches participant expertise (philosophy)

---

## Advanced Tips

### Tip 1: Create Dialogue "Arcs"

Don't just have random exchanges—create narrative arcs:

**Arc Example: From Skepticism to Understanding**
1. Initial: Enthusiastic observation
2. Agree-Extend: Builds excitement
3. Question-Challenge: Introduces doubt
4. Counter: Defends against doubt
5. Synthesize: Finds middle ground
6. Reflect: Deeper understanding emerged

### Tip 2: Use "Echo" Technique

Have later messages echo earlier phrases to create cohesion:

```javascript
// Message 1 (Su Shi):
textZh: "...这种'天然之气'..."

// Message 4 (Guo Xi):
textZh: "...先生所言'天然之气'确有深意..." // Echoes Su Shi

// Message 6 (Ruskin):
textZh: "...或许我们需要重新定义何为'天然'..." // Echoes and transforms
```

### Tip 3: Layer Topics

Each thread can have a primary topic and secondary themes:

```javascript
{
  topic: "机械笔触的韵律美学",  // Primary: technique
  // Secondary themes emerge in conversation:
  // - Cultural continuity (Guo Xi brings classical theory)
  // - Ethics (AI Ethics questions authorship)
  // - Innovation (How technique evolves)
}
```

### Tip 4: Vary Timestamp Gaps

Don't always use 3000ms. Vary for rhythm:

```javascript
timestamp: 0       // Initial
timestamp: 2000    // Quick agreement (fast pace)
timestamp: 5000    // Thoughtful response (3000ms pause)
timestamp: 7000    // Quick rebuttal (2000ms)
timestamp: 11000   // Careful synthesis (4000ms for reflection)
timestamp: 15000   // Final reflection (4000ms)
```

### Tip 5: Strategic Persona Pairing

Some pairings create natural tensions/harmonies:

**Harmonious Pairs**: (agree-extend interactions)
- Su Shi + Guo Xi (traditional aesthetics)
- Mama Zola + Professor Petrova (cultural analysis)
- Ruskin + Guo Xi (craft emphasis)

**Tension Pairs**: (question-challenge, counter)
- Ruskin vs AI Ethics (soul vs algorithm)
- Traditional (Su/Guo/Ruskin) vs AI Ethics (human-centric vs systems)
- Western (Ruskin/Petrova) vs Eastern (Su/Guo) on aesthetics

---

## Next Steps

After completing dialogue content:

1. **Update CLAUDE.md** with dialogue system documentation
2. **Create visual components** (Phase 2-7 of OpenSpec proposal)
3. **Implement dialogue player UI**
4. **Add animation system**
5. **Deploy and gather feedback**

---

## Resources

- **OpenSpec Proposal**: `openspec/changes/add-critic-dialogue-and-thought-chain/proposal.md`
- **Design Decisions**: `openspec/changes/add-critic-dialogue-and-thought-chain/design.md`
- **Templates**: `scripts/templates/`
  - `dialogue-thread-template.js` - Code template
  - `topic-templates.md` - Topic ideas and patterns
  - `persona-voice-guide.md` - Voice consistency guide
- **Validation**: `scripts/validate-dialogues.js`
- **Generation Tool**: `scripts/generate-dialogue.js`

---

## Questions?

If you encounter issues not covered in this guide:

1. Check OpenSpec documentation in `openspec/changes/add-critic-dialogue-and-thought-chain/`
2. Review existing dialogue data (when created) for examples
3. Consult CLAUDE.md for project-wide conventions
4. Check validation error messages carefully
5. Test in browser console for runtime errors

---

**Happy dialogue writing! 🎨💬**
