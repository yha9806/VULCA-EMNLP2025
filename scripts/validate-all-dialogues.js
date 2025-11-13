/**
 * Validate All Dialogues Structure
 *
 * Comprehensive validation for all dialogue files.
 * Usage: node scripts/validate-all-dialogues.js
 */

const fs = require('fs');
const path = require('path');

const DIALOGUES_DIR = path.join(__dirname, '../js/data/dialogues');

console.log('🔍 Validating all dialogues...\n');

// Get all artwork dialogue files
const files = fs.readdirSync(DIALOGUES_DIR)
  .filter(f => f.match(/^artwork-\d+\.js$/))
  .sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)[0]);
    const numB = parseInt(b.match(/\d+/)[0]);
    return numA - numB;
  });

// Skip artwork-1 to artwork-4 (old Phase 2 format with multiple threads)
const filesToValidate = files.filter(f => {
  const num = parseInt(f.match(/\d+/)[0]);
  return num >= 5; // Only validate artwork-5 onwards (new format)
});

console.log(`📁 Found ${files.length} dialogue files (validating ${filesToValidate.length})\n`);

// Statistics
const stats = {
  totalDialogues: 0,
  totalMessages: 0,
  totalReplyChains: 0,
  totalReferences: 0,
  interactionTypes: {},
  errors: [],
  warnings: []
};

// Validate each file
filesToValidate.forEach((filename, index) => {
  const filepath = path.join(DIALOGUES_DIR, filename);
  const artworkId = filename.replace('.js', '');

  process.stdout.write(`[${index + 1}/${filesToValidate.length}] Validating ${artworkId}... `);

  try {
    // Read and parse file
    const content = fs.readFileSync(filepath, 'utf8');
    const match = content.match(/export const (\w+Dialogue) = ({[\s\S]+});/);

    if (!match) {
      stats.errors.push(`${artworkId}: Cannot parse export`);
      console.log('❌ Parse error');
      return;
    }

    const dialogue = eval(`(${match[2]})`);

    // Validate top-level structure
    if (!dialogue.id || !dialogue.artworkId || !dialogue.participants || !dialogue.messages) {
      stats.errors.push(`${artworkId}: Missing required fields`);
      console.log('❌ Missing fields');
      return;
    }

    if (dialogue.artworkId !== artworkId) {
      stats.errors.push(`${artworkId}: artworkId mismatch (${dialogue.artworkId})`);
      console.log(`❌ ID mismatch`);
      return;
    }

    // Validate messages
    const messages = dialogue.messages;
    let messageErrors = 0;

    messages.forEach((msg, i) => {
      // Check required fields
      const required = ['id', 'personaId', 'textZh', 'textEn', 'timestamp', 'interactionType'];
      for (let field of required) {
        if (!(field in msg)) {
          stats.errors.push(`${artworkId} msg ${i+1}: Missing ${field}`);
          messageErrors++;
        }
      }

      // Check replyTo and quotedText for non-initial messages
      if (i > 0) {
        if (!msg.replyTo) {
          stats.errors.push(`${artworkId} msg ${i+1}: Missing replyTo`);
          messageErrors++;
        }
        if (!msg.quotedText) {
          stats.warnings.push(`${artworkId} msg ${i+1}: Missing quotedText`);
        }
      }

      // Check references
      if (!Array.isArray(msg.references) || msg.references.length === 0) {
        stats.warnings.push(`${artworkId} msg ${i+1}: Missing references`);
      }

      // Count interaction types
      if (msg.interactionType) {
        stats.interactionTypes[msg.interactionType] =
          (stats.interactionTypes[msg.interactionType] || 0) + 1;
      }
    });

    // Update stats
    stats.totalDialogues++;
    stats.totalMessages += messages.length;
    stats.totalReplyChains += messages.filter(m => m.replyTo).length;
    stats.totalReferences += messages.reduce((sum, m) =>
      sum + (m.references ? m.references.length : 0), 0
    );

    if (messageErrors === 0) {
      console.log(`✅ ${messages.length} msgs`);
    } else {
      console.log(`❌ ${messageErrors} errors`);
    }

  } catch (error) {
    stats.errors.push(`${artworkId}: ${error.message}`);
    console.log(`❌ ${error.message}`);
  }
});

// Print summary
console.log('\n' + '='.repeat(70));
console.log('📊 VALIDATION SUMMARY');
console.log('='.repeat(70));

console.log('\n✅ Statistics:');
console.log(`   Total dialogues: ${stats.totalDialogues}`);
console.log(`   Total messages: ${stats.totalMessages}`);
console.log(`   Total reply chains: ${stats.totalReplyChains}`);
console.log(`   Total references: ${stats.totalReferences}`);
console.log(`   Avg messages/dialogue: ${Math.round(stats.totalMessages / stats.totalDialogues)}`);

console.log('\n📈 Interaction Type Distribution:');
Object.entries(stats.interactionTypes)
  .sort((a, b) => b[1] - a[1])
  .forEach(([type, count]) => {
    const percentage = ((count / stats.totalMessages) * 100).toFixed(1);
    console.log(`   ${type}: ${count} (${percentage}%)`);
  });

if (stats.warnings.length > 0) {
  console.log(`\n⚠️  Warnings: ${stats.warnings.length}`);
  if (stats.warnings.length <= 10) {
    stats.warnings.forEach(w => console.log(`   - ${w}`));
  } else {
    console.log(`   (Too many to display, showing first 10)`);
    stats.warnings.slice(0, 10).forEach(w => console.log(`   - ${w}`));
  }
}

if (stats.errors.length > 0) {
  console.log(`\n❌ Errors: ${stats.errors.length}`);
  stats.errors.forEach(e => console.log(`   - ${e}`));
  console.log('\n' + '='.repeat(70));
  console.log('❌ VALIDATION FAILED');
  console.log('='.repeat(70));
  process.exit(1);
} else {
  console.log('\n' + '='.repeat(70));
  console.log('✅ VALIDATION PASSED');
  console.log('='.repeat(70));
  console.log(`All ${stats.totalDialogues} dialogues are structurally valid!`);
}
