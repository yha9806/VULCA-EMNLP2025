# Design Document: Merge Threads to Continuous Dialogue

**Change ID**: `merge-threads-to-continuous-dialogue`
**Status**: Design Phase
**Last Updated**: 2025-11-06

---

## Design Overview

This document captures the architectural decisions for transforming VULCA's dialogue system from 6 fragmented threads to single continuous dialogues, based on **user feedback prioritizing natural conversation flow** over structured chapters.

---

## Architectural Decisions

### AD-1: Remove Chapter Structure

**Decision**: **No chapter structure** - pure continuous dialogue

**User Feedback** (2025-11-06):
> "更倾向于'纯粹的连续对话'（无章节标签）（更偏向自然语言对话）"

**Options Considered**:

**A. Pure Continuous Dialogue (No Chapters)** ✅ SELECTED
```javascript
{
  id: "artwork-1-dialogue",
  topic: "Complete Dialogue on Memory (Painting Operation Unit)",
  messages: [msg1, msg2, ..., msg30]  // No chapter metadata
}
```

**Pros**:
- ✅ User's explicit preference
- ✅ Simplest data structure
- ✅ Most natural conversation flow
- ✅ No artificial topic boundaries
- ✅ Fastest implementation

**Cons**:
- ❌ No built-in navigation structure
- ❌ Users must read entire dialogue sequentially

**B. Optional Chapter Metadata (Rejected)**
```javascript
{
  messages: [
    { id: "msg-1", chapterNumber: 1, ... },  // Optional metadata
    ...
  ],
  chapters: [...] // Optional navigation
}
```

**Rejected Because**:
- User explicitly wants "纯粹的连续对话"
- Adding optional metadata contradicts "no chapter labels" preference
- Adds complexity without clear user value

**Rationale for Selection**:
- **User preference is paramount** - explicit feedback to avoid chapter structure
- **Natural dialogue prioritized** - "更偏向自然语言对话"
- **Simplicity** - removes complexity from original proposal
- **Future flexibility** - can always add optional navigation later if user requests

---

### AD-2: Thread Merge Strategy

**Decision**: **Sequential concatenation** with timestamp normalization

**Options Considered**:

**A. Sequential Concatenation** ✅ SELECTED
- Threads merged in order: Thread 1 → Thread 2 → Thread 3 → ... → Thread 6
- Messages retain original content and reply chains
- Timestamps regenerated for natural 4-7s intervals
- No semantic reordering

**Workflow**:
```
Thread 1 messages (6 msgs) → 0-30s
Thread 2 messages (5 msgs) → 30-55s
Thread 3 messages (5 msgs) → 55-80s
Thread 4 messages (6 msgs) → 80-110s
Thread 5 messages (5 msgs) → 110-135s
Thread 6 messages (5 msgs) → 135-160s
Total: ~160s (2.7 minutes) for full dialogue
```

**Pros**:
- ✅ Minimal disruption to existing content
- ✅ Predictable and reproducible
- ✅ Preserves thread-level topic coherence
- ✅ Fast implementation (2-3 hours per artwork)

**Cons**:
- ❌ May not create "perfect" narrative flow
- ❌ Topic transitions may feel abrupt

**B. Semantic Reordering (Rejected)**
- Analyze message content and reorder by semantic coherence
- Group related messages together
- Create smooth thematic progression

**Rejected Because**:
- ⚠️ High risk of breaking reply chains (replyTo references become invalid)
- ⚠️ Time-intensive (8-12 hours per artwork)
- ⚠️ Subjective decisions required (which order is "best"?)
- ⚠️ May lose original conversation dynamics

**C. Interleaved Merging (Rejected)**
- Interleave messages from different threads by timestamp
- Create "multi-track" conversation

**Rejected Because**:
- ⚠️ Complex reply chain management
- ⚠️ Difficult to ensure coherence
- ⚠️ Not aligned with "natural dialogue" goal

**Rationale for Selection**:
- **Low risk** - preserves all existing content
- **Fast** - can complete 4 artworks in 5-6 hours
- **Predictable** - clear transformation rules
- **Testable** - easy to validate with automated scripts

---

### AD-3: Timestamp Regeneration Strategy

**Decision**: **Dynamic intervals (4-7 seconds)** mimicking natural thinking pauses

**Current Problem**:
- Each thread starts at timestamp 0, 3000, 6000, etc.
- Merging threads creates overlapping timestamps
- Need to regenerate for single continuous timeline

**Solution**:
```javascript
function regenerateTimestamps(messages) {
  let currentTime = 0;
  return messages.map((msg, index) => {
    if (index > 0) {
      // Random interval: 4000-7000ms (4-7 seconds)
      const interval = Math.floor(Math.random() * 3000) + 4000;
      currentTime += interval;
    }
    return { ...msg, timestamp: currentTime };
  });
}
```

**Rationale**:
- **Natural pacing** - mimics thought chain visualization timing
- **Varies conversation rhythm** - prevents mechanical feel
- **Preserves order** - maintains message sequence
- **Tested pattern** - already used in DialoguePlayer's natural timing system

---

### AD-4: Knowledge Base Reference Structure

**Decision**: **Optional references array** linking to Phase 1A knowledge base

**Structure**:
```javascript
{
  references: [
    {
      critic: "su-shi",              // Critic ID (matches knowledge-base/critics/[critic-id]/)
      source: "poetry-and-theory.md", // Filename in critic's knowledge base
      quote: "笔墨当随时代",          // Actual quote from source
      page: "Section: 论画以形似"     // Optional: page or section reference
    }
  ]
}
```

**Implementation Notes**:
- **Optional field** - backward compatible (existing messages without references still work)
- **File references** - source points to actual markdown files in `knowledge-base/critics/[critic-id]/`
- **Validation** - validation script can check if referenced files exist
- **Future-ready** - prepared for Phase 3 content generation with knowledge base integration

**Deferred Decisions**:
- **When to add references?** - Can be added gradually during Phase 3 content generation
- **UI display?** - How to show references in UI (tooltip, expandable section, etc.)
- **Citation format?** - Formal academic citation vs inline quote

---

### AD-5: Backward Compatibility Strategy

**Decision**: **DialoguePlayer accepts both formats** (thread array or single dialogue)

**Implementation**:
```javascript
// DialoguePlayer constructor
constructor(dialogueData, container, options) {
  // Normalize input: accept both formats
  if (Array.isArray(dialogueData)) {
    // Old format: array of threads
    this.dialogue = this.normalizeThreadArray(dialogueData);
  } else {
    // New format: single dialogue object
    this.dialogue = dialogueData;
  }
  // ... rest of initialization
}

normalizeThreadArray(threads) {
  // Convert array of threads to single dialogue
  return {
    id: threads[0].artworkId + "-dialogue",
    artworkId: threads[0].artworkId,
    topic: "Complete Dialogue",
    participants: [...new Set(threads.flatMap(t => t.participants))],
    messages: threads.flatMap(t => t.messages)
  };
}
```

**Rationale**:
- ✅ **test-quote-interaction.html continues to work** - No code changes needed
- ✅ **Gradual migration** - Can convert artwork-by-artwork without breaking site
- ✅ **Developer-friendly** - Component adapts to data format automatically

---

### AD-6: Validation Requirements

**Decision**: **Comprehensive validation script** with 6 core checks

**Validation Checks**:

1. **Required Fields**:
   - ✅ id, personaId, textZh, textEn must be present
   - ✅ Non-empty strings

2. **Unique Message IDs**:
   - ✅ No duplicate IDs within a dialogue
   - ✅ IDs follow naming convention (e.g., "msg-artwork-1-X")

3. **Valid Reply Chains**:
   - ✅ If replyTo is present, it must reference an existing personaId in the dialogue
   - ✅ No circular references (msg-1 → msg-2 → msg-1)

4. **Chronological Timestamps**:
   - ✅ Timestamps strictly increasing (msg[i].timestamp < msg[i+1].timestamp)
   - ✅ Reasonable intervals (no 0ms or >60s gaps)

5. **Participant Consistency**:
   - ✅ Every message's personaId must be in dialogue.participants array
   - ✅ Every participant appears at least once in messages

6. **Optional: Knowledge Base References**:
   - ✅ If references array present, validate:
     - Critic ID exists in knowledge-base/critics/
     - Source file exists (e.g., knowledge-base/critics/su-shi/poetry-and-theory.md)
     - Quote is non-empty string

**Output Format**:
```
Validating artwork-1-dialogue...
  ✓ Required fields (30/30 messages)
  ✓ Unique IDs (30 messages, 0 duplicates)
  ✓ Reply chains (18 replies, all valid)
  ✓ Timestamps (chronological, avg 5.2s interval)
  ✓ Participants (6/6 critics, all active)
  ⚠ Knowledge base references (0/30 messages have references)

✓ artwork-1-dialogue: PASS
```

---

## Technical Choices

### TC-1: File Structure After Merge

**Before**:
```
js/data/dialogues/
├── artwork-1.js    (6 threads exported as array)
├── artwork-2.js    (6 threads exported as array)
├── artwork-3.js    (6 threads exported as array)
├── artwork-4.js    (6 threads exported as array)
├── types.js
└── index.js
```

**After**:
```
js/data/dialogues/
├── artwork-1.js    (single dialogue object)
├── artwork-2.js    (single dialogue object)
├── artwork-3.js    (single dialogue object)
├── artwork-4.js    (single dialogue object)
├── types.js        (updated with KnowledgeReference typedef)
└── index.js        (import single dialogues)
```

**Export Format Change**:
```javascript
// Before
export const artwork1Dialogues = [thread1, thread2, thread3, thread4, thread5, thread6];

// After
export const artwork1Dialogue = {
  id: "artwork-1-dialogue",
  artworkId: "artwork-1",
  topic: "Memory (Painting Operation Unit: Second Generation) - Complete Dialogue",
  topicEn: "Memory (Painting Operation Unit: Second Generation) - Complete Dialogue",
  participants: ["su-shi", "guo-xi", "john-ruskin", "mama-zola", "professor-petrova", "ai-ethics-reviewer"],
  messages: [msg1, msg2, ..., msg30]
};
```

---

### TC-2: Validation Script Implementation

**Technology**: Node.js script (no external dependencies)

**Location**: `scripts/validate-dialogue-data.js`

**Usage**:
```bash
# Validate all dialogues
node scripts/validate-dialogue-data.js

# Validate specific artwork
node scripts/validate-dialogue-data.js --artwork artwork-1

# Strict mode (fail on warnings)
node scripts/validate-dialogue-data.js --strict
```

**Implementation Pattern**:
```javascript
// scripts/validate-dialogue-data.js
import { artwork1Dialogue } from '../js/data/dialogues/artwork-1.js';
import { artwork2Dialogue } from '../js/data/dialogues/artwork-2.js';
// ... etc

const dialogues = [artwork1Dialogue, artwork2Dialogue, artwork3Dialogue, artwork4Dialogue];

dialogues.forEach(dialogue => {
  console.log(`\nValidating ${dialogue.id}...`);

  const checks = [
    validateRequiredFields(dialogue),
    validateUniqueIDs(dialogue),
    validateReplyChains(dialogue),
    validateTimestamps(dialogue),
    validateParticipants(dialogue),
    validateKnowledgeBaseReferences(dialogue)  // Optional
  ];

  const passed = checks.every(c => c.pass);
  console.log(passed ? '✓ PASS' : '✗ FAIL');
});
```

---

### TC-3: test-quote-interaction.html Migration

**Decision**: **Minimal update** to use new dialogue format

**Changes Required** (~15 lines):
```javascript
// Before
const testThread = {
  id: "test-thread-1",
  artworkId: "artwork-1",
  topic: "机械笔触中的自然韵律",
  topicEn: "Natural Rhythm in Mechanical Brushstrokes",
  participants: ["su-shi", "guo-xi", "john-ruskin"],
  messages: [...]
};

// After
const testDialogue = {
  id: "test-dialogue-1",
  artworkId: "artwork-1",
  topic: "机械笔触中的自然韵律",
  topicEn: "Natural Rhythm in Mechanical Brushstrokes",
  participants: ["su-shi", "guo-xi", "john-ruskin"],
  messages: [...]
};

// DialoguePlayer instantiation (no change)
const player = new DialoguePlayer(testDialogue, container, { autoPlay: true });
```

**No UI changes** - appearance and interactions remain identical.

---

## Trade-offs & Justifications

### Trade-off 1: Sequential Concatenation vs Semantic Reordering

**Chosen**: Sequential concatenation
**Alternative**: Semantic reordering (analyze content and rearrange)

**What we gained**:
- Speed (2-3 hours vs 8-12 hours per artwork)
- Safety (no risk of breaking reply chains)
- Predictability (clear transformation rules)

**What we sacrificed**:
- "Perfect" narrative flow (topics may transition abruptly)
- Semantic coherence optimization

**Justification**: User prioritizes "natural dialogue" over "structured chapters." Sequential concatenation preserves original conversation dynamics better than artificial reordering.

---

### Trade-off 2: No Chapters vs Optional Chapter Metadata

**Chosen**: No chapters at all
**Alternative**: Add chapter metadata but don't require UI to use it

**What we gained**:
- Simplicity (fewer fields in data structure)
- Alignment with user preference ("纯粹的连续对话")
- Faster implementation

**What we sacrificed**:
- Navigation aids for long dialogues (30+ messages)
- Ability to "jump to technical analysis" section

**Justification**: User explicitly stated preference for "no chapter labels." We respect this decision and avoid over-engineering. Can always add optional navigation later if user requests.

---

### Trade-off 3: Backward Compatibility vs Clean Break

**Chosen**: Backward compatibility (DialoguePlayer accepts both formats)
**Alternative**: Require all code to use new format immediately

**What we gained**:
- Gradual migration (convert artwork-by-artwork)
- test-quote-interaction.html works without changes
- Lower risk (if new format has issues, old format still works)

**What we sacrificed**:
- Code simplicity (need to normalize input)
- Unified data format enforcement

**Justification**: User emphasized "test-quote-interaction.html is the most satisfying implementation." We preserve this by ensuring backward compatibility.

---

## Open Questions

1. **Knowledge Base Reference UI** (deferred to Phase 3):
   - How should references be displayed to users?
   - Tooltip on hover? Expandable section? Footer?

2. **Topic Transition Smoothness**:
   - After merging, will topic transitions feel natural?
   - Should we add brief "transition messages" between ex-threads?
   - → Test with user after merge, iterate if needed

3. **Validation Strictness**:
   - Should warnings (e.g., "no knowledge base references") fail validation?
   - Or only fail on errors (e.g., "invalid reply chain")?
   - → Default to warnings-only, strict mode optional

---

## Future Enhancements (Out of Scope)

1. **Optional Navigation Bar** - "Jump to message 15" functionality (if users request)
2. **Topic Labels** - Semantic tags (e.g., "Philosophy", "Technique") without formal chapters
3. **Knowledge Base Reference UI** - Visual display of source quotes
4. **Image Synchronization** - Phase 3, after user provides image data
5. **Advanced Validation** - Semantic coherence checks using NLP

---

## Next Steps

1. Review and approve this design document
2. Create detailed specifications (`specs/` directory)
3. Break down into tasks (`tasks.md`)
4. Begin Task 2.2: Merge artwork-1.js dialogues

---

## Approval

| Stakeholder | Status | Date | Comments |
|-------------|--------|------|----------|
| User | Pending | - | - |
| Claude (AI Assistant) | Approved | 2025-11-06 | Design simplified based on user feedback |
