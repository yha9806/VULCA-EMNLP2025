/**
 * Migrate 5 artworks from congsheng-2025 to negative-space-of-the-tide
 * Task 1.3: Migrate 5 Completed Artworks
 */

const fs = require('fs');
const path = require('path');

// Read source and target data
const sourceData = JSON.parse(fs.readFileSync('exhibitions/congsheng-2025/data.json', 'utf8'));
const targetData = JSON.parse(fs.readFileSync('exhibitions/negative-space-of-the-tide/data.json', 'utf8'));

// Define ID mapping
const idMapping = {
  'artwork-84': 'artwork-1',
  'artwork-80': 'artwork-2',
  'artwork-82': 'artwork-3',
  'artwork-65': 'artwork-4',
  'artwork-60': 'artwork-5'
};

// Fields to keep in target schema
const allowedFields = ['id', 'titleZh', 'titleEn', 'year', 'artist', 'imageUrl', 'primaryImageId', 'context', 'images'];

// Fields to remove
const fieldsToRemove = ['artistEn', 'institution', 'institutionEn', 'medium', 'mediumZh', 'contextZh', 'url', 'videoUrls'];

console.log('Starting migration of 5 artworks...\n');

// Process each artwork
const migratedArtworks = sourceData.artworks.map((artwork, index) => {
  const oldId = artwork.id;
  const newId = idMapping[oldId];

  console.log(`Processing ${oldId} → ${newId}: ${artwork.titleZh}`);

  // Create new artwork object with only allowed fields
  const migratedArtwork = {};

  // Copy allowed fields
  allowedFields.forEach(field => {
    if (artwork[field] !== undefined) {
      migratedArtwork[field] = artwork[field];
    }
  });

  // Update ID
  migratedArtwork.id = newId;

  // Update image paths: ./assets/ → /assets/
  if (migratedArtwork.imageUrl) {
    migratedArtwork.imageUrl = migratedArtwork.imageUrl.replace(/^\.\//, '/');
  }

  // Update image IDs and paths in images array
  if (migratedArtwork.images) {
    migratedArtwork.images = migratedArtwork.images.map((img, imgIndex) => {
      const oldImgId = img.id;
      const newImgId = `img-${newId.split('-')[1]}-${imgIndex + 1}`;

      return {
        ...img,
        id: newImgId,
        url: img.url.replace(/^\.\//, '/')
      };
    });
  }

  // Update primaryImageId
  if (migratedArtwork.primaryImageId) {
    const imgIndex = artwork.images.findIndex(img => img.id === migratedArtwork.primaryImageId);
    if (imgIndex >= 0) {
      migratedArtwork.primaryImageId = `img-${newId.split('-')[1]}-${imgIndex + 1}`;
    } else {
      // Default to first image
      migratedArtwork.primaryImageId = `img-${newId.split('-')[1]}-1`;
    }
  }

  console.log(`  - Migrated ${migratedArtwork.images.length} images`);
  console.log(`  - Primary image: ${migratedArtwork.primaryImageId}`);

  return migratedArtwork;
});

// Append to target data
targetData.artworks = migratedArtworks;

// Save updated data
fs.writeFileSync(
  'exhibitions/negative-space-of-the-tide/data.json',
  JSON.stringify(targetData, null, 2),
  'utf8'
);

console.log(`\n✓ Migration complete!`);
console.log(`✓ ${migratedArtworks.length} artworks migrated`);
console.log(`✓ Total images: ${migratedArtworks.reduce((sum, a) => sum + a.images.length, 0)}`);

// Validation
const updatedData = JSON.parse(fs.readFileSync('exhibitions/negative-space-of-the-tide/data.json', 'utf8'));
console.log(`\nValidation:`);
console.log(`  Artworks: ${updatedData.artworks.length} (expected: 5)`);
console.log(`  Personas: ${updatedData.personas.length} (expected: 6)`);
console.log(`  Critiques: ${updatedData.critiques.length} (expected: 0)`);

// Check all IDs are correct
const expectedIds = ['artwork-1', 'artwork-2', 'artwork-3', 'artwork-4', 'artwork-5'];
const actualIds = updatedData.artworks.map(a => a.id);
const idsMatch = JSON.stringify(expectedIds) === JSON.stringify(actualIds);
console.log(`  IDs correct: ${idsMatch ? '✓' : '✗'}`);

// Check all image paths start with /assets/
const allPathsAbsolute = updatedData.artworks.every(artwork =>
  artwork.imageUrl.startsWith('/assets/') &&
  artwork.images.every(img => img.url.startsWith('/assets/'))
);
console.log(`  Image paths absolute: ${allPathsAbsolute ? '✓' : '✗'}`);

console.log('\n✓ Task 1.3 complete!');
