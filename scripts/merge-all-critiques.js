/**
 * Merge All Critiques into data.json
 *
 * This script reads all 9 critique JSON files and merges them into
 * the exhibitions/negative-space-of-the-tide/data.json file.
 */

const fs = require('fs');
const path = require('path');

// File paths
const DATA_JSON_PATH = path.join(__dirname, '../exhibitions/negative-space-of-the-tide/data.json');
const SCRIPTS_DIR = __dirname;

// List of critique files to merge (in order)
const CRITIQUE_FILES = [
  'critiques-artwork-1-5-regenerated.json',  // ✅ Regenerated, replaces corrupted artwork 1-5 files
  'critiques-artwork-6.json',
  'critiques-artwork-7.json',
  'critiques-artwork-8.json',
  'critiques-artwork-9.json',
  'critiques-artwork-10.json',
  'critiques-artwork-11.json',
  'critiques-artwork-12.json',
  'critiques-artwork-13.json',
  'critiques-artwork-14.json',
  'critiques-artwork-15.json',
  'critiques-artwork-16.json',
  'critiques-artwork-17-23.json',
  'critiques-artwork-19-23-batch.json',
  'critiques-artwork-24-28-batch.json',
  'critiques-artwork-29-33-batch.json',
  'critiques-artwork-32-missing.json',      // ✅ Missing critiques for artwork-32
  'critiques-artwork-34-38-final.json'
];

console.log('🚀 Starting critique merge process...\n');

// Step 1: Read and validate all critique files
console.log('📖 Step 1: Reading critique files...');
let allCritiques = [];
let fileStats = {};

for (const filename of CRITIQUE_FILES) {
  const filepath = path.join(SCRIPTS_DIR, filename);

  try {
    if (!fs.existsSync(filepath)) {
      console.log(`   ⚠️  File not found: ${filename}`);
      continue;
    }

    const content = fs.readFileSync(filepath, 'utf8');
    const critiques = JSON.parse(content);

    if (!Array.isArray(critiques)) {
      console.log(`   ❌ Invalid format in ${filename}: not an array`);
      continue;
    }

    allCritiques = allCritiques.concat(critiques);
    fileStats[filename] = critiques.length;
    console.log(`   ✓ ${filename}: ${critiques.length} critiques`);
  } catch (error) {
    console.log(`   ❌ Error reading ${filename}: ${error.message}`);
  }
}

console.log(`\n📊 Total critiques collected: ${allCritiques.length}`);

// Step 2: Validate critique structure
console.log('\n🔍 Step 2: Validating critique structure...');
let validCritiques = [];
let invalidCount = 0;

for (const critique of allCritiques) {
  // Check required fields
  if (!critique.artworkId || !critique.personaId || !critique.textZh || !critique.rpait) {
    console.log(`   ⚠️  Invalid critique: missing required fields`);
    invalidCount++;
    continue;
  }

  // Check RPAIT structure
  if (!critique.rpait.R || !critique.rpait.P || !critique.rpait.A || !critique.rpait.I || !critique.rpait.T) {
    console.log(`   ⚠️  Invalid RPAIT in ${critique.artworkId}/${critique.personaId}`);
    invalidCount++;
    continue;
  }

  validCritiques.push(critique);
}

console.log(`   ✓ Valid critiques: ${validCritiques.length}`);
if (invalidCount > 0) {
  console.log(`   ⚠️  Invalid critiques: ${invalidCount}`);
}

// Step 3: Check for duplicates
console.log('\n🔎 Step 3: Checking for duplicates...');
const critiqueKeys = new Set();
const duplicates = [];

for (const critique of validCritiques) {
  const key = `${critique.artworkId}:${critique.personaId}`;
  if (critiqueKeys.has(key)) {
    duplicates.push(key);
  }
  critiqueKeys.add(key);
}

if (duplicates.length > 0) {
  console.log(`   ⚠️  Found ${duplicates.length} duplicates:`);
  duplicates.forEach(dup => console.log(`      - ${dup}`));
} else {
  console.log(`   ✓ No duplicates found`);
}

// Step 4: Verify coverage (38 artworks × 6 personas = 228)
console.log('\n📈 Step 4: Verifying coverage...');
const artworkCounts = {};
const personaCounts = {};

for (const critique of validCritiques) {
  artworkCounts[critique.artworkId] = (artworkCounts[critique.artworkId] || 0) + 1;
  personaCounts[critique.personaId] = (personaCounts[critique.personaId] || 0) + 1;
}

console.log(`   Artworks covered: ${Object.keys(artworkCounts).length}`);
console.log(`   Personas covered: ${Object.keys(personaCounts).length}`);

// Check for missing artworks (artwork-1 to artwork-38)
const missingArtworks = [];
for (let i = 1; i <= 38; i++) {
  const artworkId = `artwork-${i}`;
  if (!artworkCounts[artworkId]) {
    missingArtworks.push(artworkId);
  } else if (artworkCounts[artworkId] !== 6) {
    console.log(`   ⚠️  ${artworkId}: ${artworkCounts[artworkId]} critiques (expected 6)`);
  }
}

if (missingArtworks.length > 0) {
  console.log(`   ⚠️  Missing artworks: ${missingArtworks.join(', ')}`);
}

// Step 5: Read data.json
console.log('\n📂 Step 5: Reading data.json...');
let dataJson;
try {
  const dataContent = fs.readFileSync(DATA_JSON_PATH, 'utf8');
  dataJson = JSON.parse(dataContent);
  console.log(`   ✓ data.json loaded successfully`);
  console.log(`   Current critiques: ${dataJson.critiques ? dataJson.critiques.length : 0}`);
} catch (error) {
  console.log(`   ❌ Error reading data.json: ${error.message}`);
  process.exit(1);
}

// Step 6: Merge critiques
console.log('\n🔄 Step 6: Merging critiques...');
dataJson.critiques = validCritiques;
console.log(`   ✓ Merged ${validCritiques.length} critiques into data.json`);

// Step 7: Write back to data.json
console.log('\n💾 Step 7: Writing data.json...');
try {
  const outputContent = JSON.stringify(dataJson, null, 2);
  fs.writeFileSync(DATA_JSON_PATH, outputContent, 'utf8');
  console.log(`   ✓ data.json updated successfully`);
  console.log(`   File size: ${(outputContent.length / 1024).toFixed(2)} KB`);
} catch (error) {
  console.log(`   ❌ Error writing data.json: ${error.message}`);
  process.exit(1);
}

// Step 8: Final summary
console.log('\n' + '='.repeat(60));
console.log('✅ MERGE COMPLETE');
console.log('='.repeat(60));
console.log(`Total critiques merged: ${validCritiques.length}`);
console.log(`Artworks covered: ${Object.keys(artworkCounts).length}/38`);
console.log(`Personas: ${Object.keys(personaCounts).length}/6`);
console.log('\nPersona distribution:');
Object.entries(personaCounts).sort((a, b) => a[0].localeCompare(b[0])).forEach(([persona, count]) => {
  console.log(`  - ${persona}: ${count} critiques`);
});
console.log('\n🎉 All critiques successfully merged into data.json!');
