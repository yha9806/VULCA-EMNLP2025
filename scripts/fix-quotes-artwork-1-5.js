/**
 * Fix Chinese Quotes in Artwork 1-5 JSON Files
 *
 * This script fixes the corrupted JSON files that use Chinese quotes 「」
 * instead of standard JSON quotes "".
 */

const fs = require('fs');
const path = require('path');

const SCRIPTS_DIR = __dirname;
const FILES_TO_FIX = [
  'critiques-artwork-1.json',
  'critiques-artwork-2.json',
  'critiques-artwork-3.json',
  'critiques-artwork-4.json',
  'critiques-artwork-5.json'
];

console.log('🔧 Starting quote fix for artwork 1-5...\n');

let totalFixed = 0;

for (const filename of FILES_TO_FIX) {
  const filepath = path.join(SCRIPTS_DIR, filename);

  if (!fs.existsSync(filepath)) {
    console.log(`⚠️  File not found: ${filename}`);
    continue;
  }

  try {
    console.log(`Processing ${filename}...`);
    let content = fs.readFileSync(filepath, 'utf8');

    // Count Chinese quotes
    const chineseQuoteCount = (content.match(/「/g) || []).length;
    console.log(`  Found ${chineseQuoteCount} Chinese quotes`);

    // Replace Chinese quotes 「 with "
    // Replace Chinese quotes 」 with "
    content = content.replace(/「/g, '"').replace(/」/g, '"');

    // Try to parse to validate
    try {
      JSON.parse(content);
      console.log(`  ✓ Valid JSON after fix`);

      // Write back
      fs.writeFileSync(filepath, content, 'utf8');
      console.log(`  ✓ File saved\n`);
      totalFixed++;
    } catch (parseError) {
      console.log(`  ❌ Still invalid after fix: ${parseError.message}\n`);
    }

  } catch (error) {
    console.log(`  ❌ Error processing ${filename}: ${error.message}\n`);
  }
}

console.log('='.repeat(60));
console.log(`✅ Fixed ${totalFixed}/${FILES_TO_FIX.length} files`);
console.log('='.repeat(60));
