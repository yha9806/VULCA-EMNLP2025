/**
 * Test script for artwork-1 dialogue transformation
 */

import { artwork1Dialogue } from '../js/data/dialogues/artwork-1.js';

const msgs = artwork1Dialogue.messages;
const participants = artwork1Dialogue.participants;

console.log('=== Artwork-1 Dialogue Validation ===\n');

// Test 1: Basic structure
console.log('✓ Dialogue ID:', artwork1Dialogue.id);
console.log('✓ Artwork ID:', artwork1Dialogue.artworkId);
console.log('✓ Total messages:', msgs.length);
console.log('✓ Participants:', participants.join(', '));

// Test 2: Timestamps
const firstTs = msgs[0].timestamp;
const lastTs = msgs[msgs.length - 1].timestamp;
console.log('\n✓ First timestamp:', firstTs, 'ms');
console.log('✓ Last timestamp:', lastTs, 'ms');
console.log('✓ Total duration:', (lastTs / 1000).toFixed(1), 'seconds');

// Test 3: Timestamp intervals
let intervals = [];
for (let i = 1; i < msgs.length; i++) {
  intervals.push(msgs[i].timestamp - msgs[i - 1].timestamp);
}
const minInterval = Math.min(...intervals);
const maxInterval = Math.max(...intervals);
const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;

console.log('\n✓ Timestamp intervals:');
console.log('  Min:', minInterval, 'ms');
console.log('  Max:', maxInterval, 'ms');
console.log('  Avg:', avgInterval.toFixed(1), 'ms');
console.log('  All in 4000-7000ms range?', minInterval >= 4000 && maxInterval <= 7000);

// Test 4: Reply chains
let replyCount = 0;
let invalidReplies = [];
for (let i = 0; i < msgs.length; i++) {
  const msg = msgs[i];
  if (msg.replyTo) {
    replyCount++;
    const priorPersonas = msgs.slice(0, i).map(m => m.personaId);
    if (!priorPersonas.includes(msg.replyTo)) {
      invalidReplies.push({ id: msg.id, replyTo: msg.replyTo });
    }
  }
}

console.log('\n✓ Total messages with replyTo:', replyCount);
if (invalidReplies.length > 0) {
  console.log('✗ Invalid reply chains:', invalidReplies.length);
  invalidReplies.forEach(r => {
    console.log('  -', r.id, 'replies to', r.replyTo);
  });
} else {
  console.log('✓ All reply chains valid');
}

// Test 5: Unique IDs
const ids = msgs.map(m => m.id);
const uniqueIds = new Set(ids);
console.log('\n✓ Unique message IDs:', uniqueIds.size === ids.length);
if (uniqueIds.size !== ids.length) {
  console.log('✗ Duplicate IDs found:', ids.length - uniqueIds.size);
}

// Test 6: Participant consistency
const messageAuthors = new Set(msgs.map(m => m.personaId));
const participantsSet = new Set(participants);
let missingAuthors = [];
let missingParticipants = [];

msgs.forEach(msg => {
  if (!participantsSet.has(msg.personaId)) {
    missingAuthors.push(msg.personaId);
  }
});

participants.forEach(p => {
  if (!messageAuthors.has(p)) {
    missingParticipants.push(p);
  }
});

console.log('\n✓ All authors in participants?', missingAuthors.length === 0);
console.log('✓ All participants have messages?', missingParticipants.length === 0);

if (missingAuthors.length > 0) {
  console.log('✗ Authors not in participants:', [...new Set(missingAuthors)].join(', '));
}
if (missingParticipants.length > 0) {
  console.log('⚠ Participants with no messages:', missingParticipants.join(', '));
}

// Summary
console.log('\n=== Summary ===');
const allValid =
  msgs.length === 30 &&
  minInterval >= 4000 && maxInterval <= 7000 &&
  invalidReplies.length === 0 &&
  uniqueIds.size === ids.length &&
  missingAuthors.length === 0;

if (allValid) {
  console.log('✓ All validation checks PASSED');
} else {
  console.log('✗ Some validation checks FAILED');
}
