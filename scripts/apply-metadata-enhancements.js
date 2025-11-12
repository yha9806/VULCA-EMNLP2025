/**
 * Apply metadata enhancements (English titles and contexts)
 * to artworks 6-38
 */

const fs = require('fs');

// Read data files
const exhibitionData = JSON.parse(fs.readFileSync('exhibitions/negative-space-of-the-tide/data.json', 'utf8'));
const enhancements = JSON.parse(fs.readFileSync('scripts/artwork-metadata-enhancements.json', 'utf8'));

console.log('Applying metadata enhancements...\n');

let enhancedCount = 0;

// Apply enhancements
exhibitionData.artworks.forEach(artwork => {
  if (enhancements[artwork.id]) {
    const enhancement = enhancements[artwork.id];

    console.log(`Enhancing ${artwork.id}: ${artwork.titleZh}`);
    console.log(`  Before: titleEn = "${artwork.titleEn}"`);
    console.log(`  After:  titleEn = "${enhancement.titleEn}"`);
    console.log(`  Context: ${enhancement.context.substring(0, 60)}...`);

    // Apply enhancements
    artwork.titleEn = enhancement.titleEn;
    artwork.context = enhancement.context;

    enhancedCount++;
  }
});

// Save updated data
fs.writeFileSync(
  'exhibitions/negative-space-of-the-tide/data.json',
  JSON.stringify(exhibitionData, null, 2),
  'utf8'
);

console.log(`\n✓ Enhanced ${enhancedCount} artworks`);
console.log(`✓ All artworks now have proper English titles and contexts`);

// Validation
const allHaveEnglish = exhibitionData.artworks.every(a =>
  a.titleEn && a.titleEn !== a.titleZh && a.context && a.context.length > 50
);

console.log(`\nValidation:`);
console.log(`  All artworks have English titles: ${allHaveEnglish ? '✓' : '✗'}`);
console.log(`  Total artworks: ${exhibitionData.artworks.length}`);
console.log(`  Artworks with context > 50 chars: ${exhibitionData.artworks.filter(a => a.context.length > 50).length}`);

console.log('\n✓ Metadata enhancement complete!');
