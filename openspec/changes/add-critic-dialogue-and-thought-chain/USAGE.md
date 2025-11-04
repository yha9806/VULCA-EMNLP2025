# Dialogue System Usage Guide

**Status**: Data Layer Complete ✅ | UI Layer Pending ⏳
**Last Updated**: 2025-11-04

---

## Quick Start

The dialogue data is now fully integrated and accessible via `window.VULCA_DATA.dialogues`.

### Access Dialogue Data

```javascript
// Get all dialogue threads (24 threads)
const allDialogues = window.VULCA_DATA.dialogues;

// Get dialogues for a specific artwork (6 threads per artwork)
const artwork1Dialogues = window.VULCA_DATA.getDialoguesForArtwork('artwork-1');

// Get a specific dialogue thread by ID
const thread = window.VULCA_DATA.getDialogueById('artwork-1-thread-1');

// Get all dialogues involving a specific persona
const suShiDialogues = window.VULCA_DATA.getDialoguesWithPersona('su-shi');
```

---

## Data Structure

### Dialogue Thread
```javascript
{
  id: "artwork-1-thread-1",
  artworkId: "artwork-1",
  topic: "机械笔触中的自然韵律",
  topicEn: "Natural Rhythm in Mechanical Brushstrokes",
  participants: ["su-shi", "guo-xi", "john-ruskin"],
  messages: [
    {
      id: "msg-artwork-1-1-1",
      personaId: "su-shi",
      textZh: "观此作，机械臂之运动轨迹呈现出一种独特的韵律感...",
      textEn: "Observing this work, the mechanical arm's movement trajectory exhibits...",
      timestamp: 0,
      replyTo: null,
      interactionType: "initial",
      quotedText: "..."
    },
    // ... more messages
  ]
}
```

### Interaction Types

| Type | 中文 | English | Color | Description |
|------|------|---------|-------|-------------|
| `initial` | 开启 | Initial | #6366f1 | Starting a new topic |
| `agree-extend` | 赞同 | Agrees | #4ade80 | Agreeing and adding ideas |
| `question-challenge` | 质疑 | Questions | #fbbf24 | Questioning or challenging |
| `synthesize` | 综合 | Synthesizes | #8b5cf6 | Bringing together views |
| `counter` | 反驳 | Counters | #f87171 | Disagreeing with reasoning |
| `reflect` | 反思 | Reflects | #60a5fa | Personal reflection |

Access interaction metadata:
```javascript
window.INTERACTION_TYPES['agree-extend'].labelZh  // "赞同"
window.INTERACTION_TYPES['agree-extend'].color    // "#4ade80"
window.getInteractionLabel('agree-extend', 'en')  // "Agrees"
window.getInteractionColor('counter')              // "#f87171"
```

---

## Statistics

```javascript
// Total content
24 dialogue threads
85 messages across 4 artworks
6 interaction types
6 personas participating

// Per artwork
Artwork-1 (Memory): 6 threads, 30 messages
Artwork-2 (Imitation): 6 threads, 19 messages
Artwork-3 (All Things): 6 threads, 18 messages
Artwork-4 (Dialogue): 6 threads, 18 messages
```

---

## Example Usage Scenarios

### Scenario 1: Display Dialogues for Current Artwork
```javascript
function displayDialoguesForCurrentArtwork(artworkId) {
  const dialogues = window.VULCA_DATA.getDialoguesForArtwork(artworkId);

  dialogues.forEach(thread => {
    console.log(`Topic: ${thread.topic}`);
    console.log(`Participants: ${thread.participants.join(', ')}`);
    console.log(`Messages: ${thread.messages.length}`);
  });
}

// Usage
displayDialoguesForCurrentArtwork('artwork-1');
```

### Scenario 2: Filter by Interaction Type
```javascript
function getMessagesByInteractionType(artworkId, interactionType) {
  const dialogues = window.VULCA_DATA.getDialoguesForArtwork(artworkId);
  const messages = [];

  dialogues.forEach(thread => {
    thread.messages.forEach(msg => {
      if (msg.interactionType === interactionType) {
        messages.push(msg);
      }
    });
  });

  return messages;
}

// Get all "question-challenge" messages for artwork-1
const questions = getMessagesByInteractionType('artwork-1', 'question-challenge');
```

### Scenario 3: Build Conversation Timeline
```javascript
function buildConversationTimeline(threadId) {
  const thread = window.VULCA_DATA.getDialogueById(threadId);
  if (!thread) return null;

  // Sort messages by timestamp
  const timeline = thread.messages
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(msg => ({
      time: msg.timestamp,
      persona: window.VULCA_DATA.personas.find(p => p.id === msg.personaId),
      text: msg.textZh,
      type: window.getInteractionLabel(msg.interactionType, 'zh')
    }));

  return timeline;
}

// Usage
const timeline = buildConversationTimeline('artwork-1-thread-1');
```

---

## What's Available Now

✅ **Complete Dialogue Content**
- 24 pre-generated dialogue threads
- 85 messages with bilingual text (Chinese + English)
- Rich metadata (timestamps, reply relationships, interaction types)

✅ **Helper Functions**
- `getDialoguesForArtwork(artworkId)`
- `getDialogueById(threadId)`
- `getDialoguesWithPersona(personaId)`
- `getInteractionLabel(type, lang)`
- `getInteractionColor(type)`

✅ **Validation & Quality**
- All content validated with 8 quality checks
- Persona voice consistency maintained
- Proper reply-to relationships
- Balanced interaction type distribution

---

## What's NOT Available Yet

⏳ **UI Components (Phase 3-7)**
- Dialogue player with animation
- Thought chain visualization (connection lines, quote blocks, tags)
- Responsive dialogue window
- Timeline scrubber and playback controls

These UI components require an additional **22-30 hours** of development. The data layer is complete and ready for UI implementation whenever needed.

---

## Next Steps

### Option A: Build Custom UI
Use the dialogue data to create your own custom visualization:
```javascript
// Example: Simple dialogue display
const dialogues = window.VULCA_DATA.getDialoguesForArtwork('artwork-1');
dialogues.forEach(thread => {
  const container = document.createElement('div');
  container.innerHTML = `
    <h3>${thread.topic}</h3>
    ${thread.messages.map(msg => `
      <div class="message" data-interaction="${msg.interactionType}">
        <strong>${msg.personaId}:</strong>
        <p>${msg.textZh}</p>
      </div>
    `).join('')}
  `;
  document.body.appendChild(container);
});
```

### Option B: Wait for Official UI
The official dialogue player and thought chain visualization will be implemented in Phase 3-7. Timeline: TBD based on project priorities.

---

## Files Reference

### Core Dialogue Data
- `js/data/dialogues/index.js` - Main aggregator
- `js/data/dialogues/types.js` - Type definitions and interaction metadata
- `js/data/dialogues/artwork-1.js` - Artwork 1 dialogues (6 threads)
- `js/data/dialogues/artwork-2.js` - Artwork 2 dialogues (6 threads)
- `js/data/dialogues/artwork-3.js` - Artwork 3 dialogues (6 threads)
- `js/data/dialogues/artwork-4.js` - Artwork 4 dialogues (6 threads)

### Developer Tools
- `scripts/generate-dialogue.js` - CLI tool for generating new dialogues
- `scripts/validate-dialogues.js` - Validation system (8 quality checks)
- `docs/adding-artwork-dialogues.md` - Complete workflow guide

### Integration
- `js/data/dialogues/init.js` - ES6 module bridge
- `js/data.js` - Main data integration (lines 606-639)
- `index.html` - Module loading (line 328)

---

## Support

For questions or issues:
1. Check `docs/adding-artwork-dialogues.md` for detailed workflows
2. Run validation: `node scripts/validate-dialogues.js --all`
3. Review OpenSpec documentation: `openspec/changes/add-critic-dialogue-and-thought-chain/`

**Dialogue System Version**: 1.0.0 (Data Layer Complete)
**Last Validated**: 2025-11-04
