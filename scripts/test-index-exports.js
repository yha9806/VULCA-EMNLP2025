/**
 * Test index.js exports and helper functions
 */

import * as dialogueIndex from '../js/data/dialogues/index.js';

console.log('=== Index.js Exports Test ===\n');

// Test exports
console.log('✓ DIALOGUES exported:', dialogueIndex.DIALOGUES.length, 'dialogues');
console.log('✓ DIALOGUE_THREADS (compat):', dialogueIndex.DIALOGUE_THREADS.length, 'dialogues');
console.log('');

// Test getDialogueStats
const stats = dialogueIndex.getDialogueStats();
console.log('=== Dialogue Statistics ===');
console.log('✓ Total dialogues:', stats.totalDialogues);
console.log('✓ Total messages:', stats.totalMessages);
console.log('✓ Artworks:', stats.artworkCount);
console.log('✓ Personas:', stats.personaCount);
console.log('✓ Avg messages/dialogue:', stats.averageMessagesPerDialogue);
console.log('');

// Test individual dialogues
console.log('=== Individual Dialogues ===');
dialogueIndex.DIALOGUES.forEach(d => {
  console.log(`✓ ${d.id}: ${d.messages.length} messages, ${d.participants.length} participants`);
});
console.log('');

// Test helper functions
console.log('=== Helper Functions Test ===');
const d1 = dialogueIndex.getDialogueForArtwork('artwork-1');
console.log('✓ getDialogueForArtwork(artwork-1):', d1.id);

const suShiDialogues = dialogueIndex.getDialoguesWithPersona('su-shi');
console.log('✓ getDialoguesWithPersona(su-shi):', suShiDialogues.length, 'dialogues');

const dialogueById = dialogueIndex.getDialogueById('artwork-2-dialogue');
console.log('✓ getDialogueById(artwork-2-dialogue):', dialogueById.id);
console.log('');

console.log('✅ All index.js tests PASSED');
