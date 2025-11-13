/**
 * Merge generated critiques into exhibition data.json
 * Task 2.2-2.6: Merge Critiques
 */

const fs = require('fs');
const path = require('path');

// Configuration
const EXHIBITION_DATA_PATH = 'exhibitions/negative-space-of-the-tide/data.json';
const CRITIQUES_DIR = 'scripts';

console.log('Merging critiques into exhibition data...\n');

// Read exhibition data
const exhibitionData = JSON.parse(fs.readFileSync(EXHIBITION_DATA_PATH, 'utf8'));

console.log(`Current state:`);
console.log(`  Artworks: ${exhibitionData.artworks.length}`);
console.log(`  Personas: ${exhibitionData.personas.length}`);
console.log(`  Existing critiques: ${exhibitionData.critiques.length}\n`);

// Find all critique JSON files
const critiqueFiles = fs.readdirSync(CRITIQUES_DIR)
  .filter(file => file.startsWith('critiques-artwork-') && file.endsWith('.json'))
  .sort();

console.log(`Found ${critiqueFiles.length} critique files:\n`);

let totalAdded = 0;
let allCritiques = [...exhibitionData.critiques];

critiqueFiles.forEach(file => {
  const filePath = path.join(CRITIQUES_DIR, file);
  const critiques = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  console.log(`  ${file}: ${critiques.length} critiques`);

  // Remove internal fields before merging
  critiques.forEach(critique => {
    delete critique._prompt;
    delete critique._generated;

    // Validate required fields
    if (!critique.artworkId || !critique.personaId) {
      console.error(`    ⚠ Missing required fields in critique`);
      return;
    }

    if (!critique.textZh || !critique.textEn) {
      console.error(`    ⚠ Missing critique text for ${critique.artworkId} - ${critique.personaId}`);
      return;
    }

    // Check for duplicates
    const exists = allCritiques.some(c =>
      c.artworkId === critique.artworkId && c.personaId === critique.personaId
    );

    if (!exists) {
      allCritiques.push(critique);
      totalAdded++;
    } else {
      console.log(`    → Skipping duplicate: ${critique.artworkId} - ${critique.personaId}`);
    }
  });
});

// Update exhibition data
exhibitionData.critiques = allCritiques;

// Save updated data
fs.writeFileSync(
  EXHIBITION_DATA_PATH,
  JSON.stringify(exhibitionData, null, 2),
  'utf8'
);

console.log(`\n${'='.repeat(60)}`);
console.log('Merge Summary:');
console.log(`${'='.repeat(60)}`);
console.log(`Total critiques added: ${totalAdded}`);
console.log(`Total critiques in database: ${exhibitionData.critiques.length}`);
console.log(`Expected total (38 artworks × 6 critics): 228`);
console.log(`Progress: ${((exhibitionData.critiques.length / 228) * 100).toFixed(1)}%`);
console.log(`\n✓ Data saved to: ${EXHIBITION_DATA_PATH}`);

// Validation
console.log(`\n${'='.repeat(60)}`);
console.log('Validation:');
console.log(`${'='.repeat(60)}`);

const critiquesByArtwork = {};
exhibitionData.critiques.forEach(c => {
  if (!critiquesByArtwork[c.artworkId]) {
    critiquesByArtwork[c.artworkId] = [];
  }
  critiquesByArtwork[c.artworkId].push(c.personaId);
});

Object.keys(critiquesByArtwork).sort().forEach(artworkId => {
  const critics = critiquesByArtwork[artworkId];
  const artwork = exhibitionData.artworks.find(a => a.id === artworkId);
  const title = artwork ? artwork.titleZh : artworkId;

  console.log(`  ${artworkId} (${title}): ${critics.length}/6 critiques`);
  if (critics.length < 6) {
    const missing = exhibitionData.personas
      .filter(p => !critics.includes(p.id))
      .map(p => p.nameZh);
    console.log(`    Missing: ${missing.join(', ')}`);
  }
});

console.log('\n✓ Merge complete!');
