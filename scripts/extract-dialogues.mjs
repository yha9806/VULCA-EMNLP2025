#!/usr/bin/env node

/**
 * Extract Dialogues - ES6 Module Loader
 *
 * Properly loads dialogue data from ES6 module files and generates dialogues.json
 *
 * Usage:
 *   node scripts/extract-dialogues.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('\n📝 Extracting Dialogue Data from ES6 Modules\n');

// Step 1: Import dialogue data
console.log('1️⃣  Importing dialogue modules...');

try {
  // Import the main dialogue index
  const dialogueIndexPath = path.join(projectRoot, 'js', 'data', 'dialogues', 'index.js');
  const dialogueIndex = await import(`file:///${dialogueIndexPath.replace(/\\/g, '/')}`);

  const DIALOGUES = dialogueIndex.DIALOGUES;

  if (!DIALOGUES || !Array.isArray(DIALOGUES)) {
    console.error('❌ Failed to load DIALOGUES array');
    process.exit(1);
  }

  console.log(`   ✓ Loaded ${DIALOGUES.length} dialogue objects`);

  // Calculate statistics
  const totalMessages = DIALOGUES.reduce((sum, d) => sum + d.messages.length, 0);
  const artworkIds = [...new Set(DIALOGUES.map(d => d.artworkId))];
  const allPersonas = new Set();
  DIALOGUES.forEach(dialogue => {
    dialogue.participants.forEach(p => allPersonas.add(p));
  });

  console.log(`   ✓ Total messages: ${totalMessages}`);
  console.log(`   ✓ Artworks: ${artworkIds.length}`);
  console.log(`   ✓ Unique personas: ${allPersonas.size}`);

  // Step 2: Validate dialogue structure
  console.log('\n2️⃣  Validating dialogue structure...');

  let valid = true;
  DIALOGUES.forEach((dialogue, index) => {
    // Check required fields
    if (!dialogue.id) {
      console.error(`   ❌ Dialogue ${index}: missing id`);
      valid = false;
    }
    if (!dialogue.artworkId) {
      console.error(`   ❌ Dialogue ${index}: missing artworkId`);
      valid = false;
    }
    if (!dialogue.messages || !Array.isArray(dialogue.messages)) {
      console.error(`   ❌ Dialogue ${index}: missing or invalid messages array`);
      valid = false;
    }

    // Check messages
    dialogue.messages.forEach((message, msgIndex) => {
      if (!message.id) {
        console.error(`   ❌ Dialogue ${index}, Message ${msgIndex}: missing id`);
        valid = false;
      }
      if (!message.personaId) {
        console.error(`   ❌ Dialogue ${index}, Message ${msgIndex}: missing personaId`);
        valid = false;
      }
      if (!message.textZh || !message.textEn) {
        console.error(`   ❌ Dialogue ${index}, Message ${msgIndex}: missing textZh or textEn`);
        valid = false;
      }
      if (message.timestamp === undefined) {
        console.error(`   ❌ Dialogue ${index}, Message ${msgIndex}: missing timestamp`);
        valid = false;
      }
    });
  });

  if (valid) {
    console.log('   ✓ All dialogues passed validation');
  } else {
    console.error('   ❌ Validation failed');
    process.exit(1);
  }

  // Step 3: Create dialogues.json structure
  console.log('\n3️⃣  Creating dialogues.json structure...');

  const dialoguesData = {
    dialogues: DIALOGUES
  };

  // Step 4: Write to file
  console.log('\n4️⃣  Writing dialogues.json...');

  const outputPath = path.join(
    projectRoot,
    'exhibitions',
    'negative-space-of-the-tide',
    'dialogues.json'
  );

  // Ensure directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`   ✓ Created directory: ${outputDir}`);
  }

  // Write JSON file with pretty formatting
  fs.writeFileSync(
    outputPath,
    JSON.stringify(dialoguesData, null, 2),
    'utf8'
  );

  const fileSize = Math.round(fs.statSync(outputPath).size / 1024);
  console.log(`   ✓ Wrote dialogues.json (${fileSize}KB)`);

  // Step 5: Summary statistics
  console.log('\n📊 Dialogue Statistics:');
  console.log(`   - Total dialogues: ${DIALOGUES.length}`);
  console.log(`   - Total messages: ${totalMessages}`);
  console.log(`   - Average messages per dialogue: ${Math.round(totalMessages / DIALOGUES.length)}`);
  console.log('');

  DIALOGUES.forEach((dialogue, index) => {
    console.log(`   ${index + 1}. ${dialogue.id}`);
    console.log(`      Artwork: ${dialogue.artworkId}`);
    console.log(`      Messages: ${dialogue.messages.length}`);
    console.log(`      Participants: ${dialogue.participants.join(', ')}`);
  });

  console.log('\n' + '='.repeat(60));
  console.log('✅ Dialogue extraction complete!\n');
  console.log(`Output: ${outputPath}\n`);

} catch (error) {
  console.error(`\n❌ Error: ${error.message}`);
  console.error(error.stack);
  process.exit(1);
}
