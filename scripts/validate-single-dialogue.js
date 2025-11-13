/**
 * Validate Single Dialogue Structure
 *
 * Usage: node scripts/validate-single-dialogue.js artwork-5
 */

const fs = require('fs');
const path = require('path');

const artworkId = process.argv[2] || 'artwork-5';
const dialoguePath = path.join(__dirname, `../js/data/dialogues/${artworkId}.js`);

console.log(`🔍 Validating dialogue: ${artworkId}`);
console.log(`   File: ${dialoguePath}\n`);

// Check file exists
if (!fs.existsSync(dialoguePath)) {
  console.error(`❌ File not found: ${dialoguePath}`);
  process.exit(1);
}

// Import dialogue (handle ES6 export)
const fileContent = fs.readFileSync(dialoguePath, 'utf8');
const match = fileContent.match(/export const (\w+Dialogue) = ({[\s\S]+});/);
if (!match) {
  console.error('❌ Cannot parse dialogue export');
  process.exit(1);
}

const dialogue = eval(`(${match[2]})`);

// Validate top-level structure
console.log('📊 Basic Info:');
console.log(`   Dialogue ID: ${dialogue.id}`);
console.log(`   Artwork ID: ${dialogue.artworkId}`);
console.log(`   Participants: ${dialogue.participants.length} (${dialogue.participants.join(', ')})`);
console.log(`   Messages: ${dialogue.messages.length}\n`);

// Validate messages
console.log('🔍 Validating Messages...');
let errors = 0;
const messages = dialogue.messages;

messages.forEach((msg, i) => {
  const num = i + 1;
  const required = ['id', 'personaId', 'textZh', 'textEn', 'timestamp', 'replyTo', 'interactionType', 'references'];

  // Check required fields
  for (let field of required) {
    if (!(field in msg)) {
      console.error(`   ❌ Message ${num} missing field: ${field}`);
      errors++;
    }
  }

  // Check replyTo validity (except first message)
  if (i > 0) {
    if (!msg.replyTo) {
      console.error(`   ❌ Message ${num} missing replyTo (should reference a personaId)`);
      errors++;
    } else {
      // Verify replyTo references a valid participant
      if (!dialogue.participants.includes(msg.replyTo)) {
        console.error(`   ❌ Message ${num} replyTo "${msg.replyTo}" is not a valid participant`);
        errors++;
      }
    }
  } else {
    // First message should have null replyTo
    if (msg.replyTo !== null) {
      console.error(`   ❌ Message ${num} should have replyTo=null (initial message)`);
      errors++;
    }
  }

  // Check quotedText (except first message)
  if (i > 0 && !msg.quotedText) {
    console.error(`   ❌ Message ${num} missing quotedText`);
    errors++;
  }

  // Check references array
  if (!Array.isArray(msg.references)) {
    console.error(`   ❌ Message ${num} references is not an array`);
    errors++;
  } else if (msg.references.length === 0) {
    console.error(`   ❌ Message ${num} has empty references array`);
    errors++;
  } else {
    // Validate reference structure
    msg.references.forEach((ref, j) => {
      if (!ref.critic || !ref.source || !ref.quote) {
        console.error(`   ❌ Message ${num} reference ${j+1} missing required fields`);
        errors++;
      }
    });
  }

  // Check timestamp progression
  if (i > 0 && msg.timestamp <= messages[i-1].timestamp) {
    console.error(`   ❌ Message ${num} timestamp (${msg.timestamp}) not greater than previous (${messages[i-1].timestamp})`);
    errors++;
  }
});

// Check interaction type distribution
const typeDistribution = {};
messages.forEach(msg => {
  typeDistribution[msg.interactionType] = (typeDistribution[msg.interactionType] || 0) + 1;
});

console.log('\n📈 Interaction Type Distribution:');
Object.entries(typeDistribution).forEach(([type, count]) => {
  const percentage = ((count / messages.length) * 100).toFixed(1);
  console.log(`   ${type}: ${count} (${percentage}%)`);
});

// Warning if too monotonous
const maxPercentage = Math.max(...Object.values(typeDistribution)) / messages.length;
if (maxPercentage > 0.7) {
  console.log('\n⚠️  Warning: Interaction types are monotonous (>70% one type)');
  console.log('   This is a known limitation of keyword-based detection.');
  console.log('   Structurally valid, but may need refinement for better variety.');
}

// Summary
console.log('\n' + '='.repeat(60));
if (errors === 0) {
  console.log('✅ VALIDATION PASSED');
  console.log('='.repeat(60));
  console.log(`All ${messages.length} messages have valid structure.`);
  console.log('Dialogue is ready for display in DialoguePlayer.');
} else {
  console.log('❌ VALIDATION FAILED');
  console.log('='.repeat(60));
  console.log(`Found ${errors} structural errors.`);
  console.log('Please fix errors before proceeding.');
  process.exit(1);
}
