/**
 * Fix Chinese quotes in critique JSON files
 */

const fs = require('fs');
const path = require('path');

const critiqueFiles = [
  'scripts/critiques-artwork-1.json',
  'scripts/critiques-artwork-2.json',
  'scripts/critiques-artwork-3.json',
  'scripts/critiques-artwork-4.json',
  'scripts/critiques-artwork-5.json'
];

console.log('Fixing Chinese quotes in critique files...\n');

critiqueFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`  ⚠ File not found: ${file}`);
    return;
  }

  let content = fs.readFileSync(file, 'utf8');

  // Replace Chinese quotes with proper characters
  const before = content.length;
  content = content
    .replace(/"/g, '「')
    .replace(/"/g, '」');
  const after = content.length;

  fs.writeFileSync(file, content, 'utf8');

  console.log(`  ✓ Fixed ${file} (${before} → ${after} chars)`);
});

console.log('\n✓ All files fixed!');
console.log('\nNow run: node scripts/merge-critiques.js');
