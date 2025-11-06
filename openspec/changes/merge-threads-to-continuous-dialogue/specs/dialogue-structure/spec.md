# Specification: Dialogue Structure Transformation

**Capability**: `dialogue-structure`
**Change**: `merge-threads-to-continuous-dialogue`
**Status**: Draft
**Last Updated**: 2025-11-06

---

## Overview

Transform VULCA dialogue data from 6 fragmented threads per artwork to single continuous dialogues, preserving all message content and interaction features while improving narrative flow.

---

## ADDED Requirements

### Requirement DS-1: Single Dialogue Per Artwork

**The system SHALL export exactly one dialogue object per artwork** (replacing the current array of 6 threads).

**Context**: Current system exports `artwork1Dialogues = [thread1, thread2, ..., thread6]`. New system SHALL export `artwork1Dialogue = { id, messages: [...] }`.

#### Scenario: Export format validation
**Given** a dialogue data file (e.g., `js/data/dialogues/artwork-1.js`)
**When** the file is imported
**Then** it SHALL export a single dialogue object (not an array)
**And** the dialogue object SHALL have the following required properties:
  - `id` (string, e.g., "artwork-1-dialogue")
  - `artworkId` (string, e.g., "artwork-1")
  - `topic` (string, Chinese title)
  - `topicEn` (string, English title)
  - `participants` (array of persona IDs)
  - `messages` (array of message objects)

**Validation**:
```javascript
import { artwork1Dialogue } from './artwork-1.js';

// Must be an object (not array)
assert(typeof artwork1Dialogue === 'object');
assert(!Array.isArray(artwork1Dialogue));

// Must have required properties
assert(artwork1Dialogue.id === 'artwork-1-dialogue');
assert(artwork1Dialogue.artworkId === 'artwork-1');
assert(typeof artwork1Dialogue.topic === 'string');
assert(typeof artwork1Dialogue.topicEn === 'string');
assert(Array.isArray(artwork1Dialogue.participants));
assert(Array.isArray(artwork1Dialogue.messages));
```

---

### Requirement DS-2: Continuous Message Array

**The system SHALL consolidate all thread messages into a single chronological array** without artificial chapter boundaries.

**Context**: User explicitly prefers "纯粹的连续对话（无章节标签）". No `chapterNumber` field or `chapters` array SHALL be added.

#### Scenario: Message consolidation
**Given** an artwork has 6 threads with [6, 5, 5, 6, 5, 5] messages respectively
**When** threads are merged
**Then** the resulting dialogue SHALL have exactly 32 messages in a single `messages` array
**And** the messages array SHALL NOT be subdivided or grouped
**And** NO message SHALL have a `chapterNumber` field

**Validation**:
```javascript
const totalMessages = artwork1Dialogue.messages.length;
assert(totalMessages >= 30 && totalMessages <= 36);  // Expected range

// No chapter metadata
artwork1Dialogue.messages.forEach(msg => {
  assert(msg.chapterNumber === undefined);
});
assert(artwork1Dialogue.chapters === undefined);
```

---

### Requirement DS-3: Preserved Message Content

**The system SHALL preserve all original message fields** during thread merge (id, personaId, textZh, textEn, replyTo, interactionType, quotedText).

**Context**: Merge is a data structure transformation only. Message content and interaction features remain unchanged.

#### Scenario: Field preservation
**Given** an original message in a thread:
```javascript
{
  id: "msg-artwork-1-1-1",
  personaId: "su-shi",
  textZh: "观此作，机械与自然交织...",
  textEn: "Observing this work...",
  replyTo: null,
  interactionType: "initial",
  quotedText: "程序控制却蕴含天然之气"
}
```
**When** the thread is merged into a continuous dialogue
**Then** the message SHALL retain all original fields
**And** NO field SHALL be modified (except timestamp - see DS-4)
**And** NO field SHALL be removed

**Validation**:
```javascript
// Compare before and after
const originalMsg = thread1.messages[0];
const mergedMsg = artwork1Dialogue.messages[0];

assert(mergedMsg.id === originalMsg.id);
assert(mergedMsg.personaId === originalMsg.personaId);
assert(mergedMsg.textZh === originalMsg.textZh);
assert(mergedMsg.textEn === originalMsg.textEn);
assert(mergedMsg.replyTo === originalMsg.replyTo);
assert(mergedMsg.interactionType === originalMsg.interactionType);
assert(mergedMsg.quotedText === originalMsg.quotedText);
```

---

### Requirement DS-4: Regenerated Timestamps

**The system SHALL regenerate timestamps** to create a continuous timeline with natural intervals (4-7 seconds between messages).

**Context**: Original threads each start at timestamp 0. Merged dialogue needs continuous timeline.

#### Scenario: Continuous timeline generation
**Given** merged messages from 6 threads
**When** timestamps are regenerated
**Then** the first message SHALL have timestamp 0
**And** each subsequent message SHALL have timestamp > previous message
**And** intervals between messages SHALL be 4000-7000ms (4-7 seconds)
**And** total dialogue duration SHALL be approximately 120-240 seconds (2-4 minutes)

**Validation**:
```javascript
const messages = artwork1Dialogue.messages;

// First message starts at 0
assert(messages[0].timestamp === 0);

// Chronological and within interval range
for (let i = 1; i < messages.length; i++) {
  const interval = messages[i].timestamp - messages[i-1].timestamp;
  assert(interval >= 4000 && interval <= 7000);
}

// Total duration reasonable
const totalDuration = messages[messages.length - 1].timestamp;
assert(totalDuration >= 120000 && totalDuration <= 240000);
```

---

### Requirement DS-5: Valid Reply Chains

**The system SHALL ensure all `replyTo` references point to valid persona IDs** within the dialogue.

**Context**: Reply chains enable quote interaction system. Must remain valid after merge.

#### Scenario: Reply reference validation
**Given** a message with `replyTo: "su-shi"`
**When** the dialogue is validated
**Then** there SHALL exist at least one prior message with `personaId: "su-shi"`
**And** the prior message SHALL appear earlier in the messages array (lower index)
**And** NO message SHALL reference a non-existent persona

**Validation**:
```javascript
artwork1Dialogue.messages.forEach((msg, index) => {
  if (msg.replyTo) {
    // Check that replied-to persona exists in prior messages
    const priorMessages = artwork1Dialogue.messages.slice(0, index);
    const referencedPersonaExists = priorMessages.some(
      m => m.personaId === msg.replyTo
    );
    assert(referencedPersonaExists,
      `Message ${msg.id} replies to ${msg.replyTo} but no prior message found`
    );
  }
});
```

---

### Requirement DS-6: Unique Message IDs

**The system SHALL ensure all message IDs are unique** within a dialogue.

**Context**: Prevents ID collisions when merging threads.

#### Scenario: ID uniqueness check
**Given** a dialogue with 32 messages
**When** message IDs are collected
**Then** there SHALL be exactly 32 unique IDs
**And** NO two messages SHALL have the same ID

**Validation**:
```javascript
const ids = artwork1Dialogue.messages.map(m => m.id);
const uniqueIds = new Set(ids);

assert(uniqueIds.size === ids.length,
  `Duplicate IDs found: ${ids.length} total, ${uniqueIds.size} unique`
);
```

---

### Requirement DS-7: Participant Consistency

**The system SHALL ensure every message's persona appears in the participants array** and every participant appears in at least one message.

**Context**: Maintains data integrity between participants list and actual message authors.

#### Scenario: Participant-message consistency
**Given** a dialogue with `participants: ["su-shi", "guo-xi", "john-ruskin", "mama-zola", "professor-petrova", "ai-ethics-reviewer"]`
**When** messages are validated
**Then** every message's `personaId` SHALL be in the participants array
**And** every persona in participants SHALL appear as `personaId` in at least one message

**Validation**:
```javascript
const participants = new Set(artwork1Dialogue.participants);
const messageAuthors = new Set(artwork1Dialogue.messages.map(m => m.personaId));

// Every message author is a declared participant
artwork1Dialogue.messages.forEach(msg => {
  assert(participants.has(msg.personaId),
    `Message ${msg.id} author ${msg.personaId} not in participants`
  );
});

// Every participant authored at least one message
participants.forEach(p => {
  assert(messageAuthors.has(p),
    `Participant ${p} has no messages in dialogue`
  );
});
```

---

## MODIFIED Requirements

### Requirement DS-M1: DialoguePlayer Component Compatibility

**The DialoguePlayer component SHALL accept both thread arrays and single dialogue objects** (backward compatibility).

**Original**: DialoguePlayer only accepted thread objects
**Modified**: DialoguePlayer normalizes both formats

#### Scenario: Backward compatibility
**Given** DialoguePlayer is instantiated with either:
  - Old format: `[thread1, thread2, thread3]` (array)
  - New format: `{ id, messages: [...] }` (object)
**When** the component initializes
**Then** it SHALL render the dialogue correctly
**And** all features SHALL work (auto-play, quotes, thought chains)

**Validation**:
```javascript
// Test old format
const oldPlayer = new DialoguePlayer(artwork1Dialogues, container);
assert(oldPlayer.dialogue.messages.length > 0);

// Test new format
const newPlayer = new DialoguePlayer(artwork1Dialogue, container);
assert(newPlayer.dialogue.messages.length > 0);
```

---

## REMOVED Requirements

_None - this is a data structure transformation with no feature removals._

---

## Related Capabilities

- **knowledge-base-references** - Adds optional `references` field to messages
- **dialogue-player** (existing) - Renders and animates dialogue messages

---

## Validation Strategy

### Automated Validation Script

**Location**: `scripts/validate-dialogue-data.js`

**Checks**:
1. ✅ Export format (single object, not array)
2. ✅ Required properties (id, artworkId, topic, participants, messages)
3. ✅ No chapter metadata (chapterNumber, chapters)
4. ✅ Message field preservation (all original fields present)
5. ✅ Timestamp regeneration (chronological, 4-7s intervals)
6. ✅ Reply chain validity (replyTo references exist)
7. ✅ Unique message IDs (no duplicates)
8. ✅ Participant consistency (all authors in participants array)

**Usage**:
```bash
node scripts/validate-dialogue-data.js
# Output: ✓ artwork-1-dialogue: PASS (8/8 checks)
```

---

## Implementation Notes

### Sequential Concatenation Algorithm

```javascript
function mergeThreads(threads) {
  // 1. Concatenate all messages
  const allMessages = threads.flatMap(t => t.messages);

  // 2. Regenerate timestamps
  let currentTime = 0;
  const messagesWithTimestamps = allMessages.map((msg, index) => {
    if (index > 0) {
      const interval = Math.floor(Math.random() * 3000) + 4000;  // 4-7s
      currentTime += interval;
    }
    return { ...msg, timestamp: currentTime };
  });

  // 3. Extract unique participants
  const participants = [...new Set(allMessages.map(m => m.personaId))];

  // 4. Create single dialogue object
  return {
    id: `${threads[0].artworkId}-dialogue`,
    artworkId: threads[0].artworkId,
    topic: `${threads[0].artworkId} - Complete Dialogue`,
    topicEn: `${threads[0].artworkId} - Complete Dialogue`,
    participants,
    messages: messagesWithTimestamps
  };
}
```

---

## Success Criteria

- ✅ All 4 artworks converted to single dialogue format
- ✅ Total messages preserved (120-144 messages across 4 artworks)
- ✅ All validation checks pass
- ✅ test-quote-interaction.html works with new format (after minimal update)
- ✅ DialoguePlayer renders correctly
- ✅ No console errors or warnings

---

## Dependencies

- ✅ **DialoguePlayer component** - Must support new format
- ✅ **types.js** - DialogueThread typedef updated
- ⏳ **Validation script** - To be created in Task 2.4

---

## Approval

| Role | Name | Status | Date |
|------|------|--------|------|
| Author | Claude | Approved | 2025-11-06 |
| Reviewer | User | Pending | - |
