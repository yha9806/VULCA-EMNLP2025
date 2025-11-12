/**
 * Validate all image paths in exhibition data
 * Task 1.9: Validate Image Paths
 */

const fs = require('fs');
const path = require('path');

// Read exhibition data
const exhibitionData = JSON.parse(fs.readFileSync('exhibitions/negative-space-of-the-tide/data.json', 'utf8'));

console.log('Validating image paths...\n');

let totalImages = 0;
let foundImages = 0;
let missingImages = 0;
let artworksWithImages = 0;
let artworksWithoutImages = 0;

exhibitionData.artworks.forEach(artwork => {
  console.log(`\n${artwork.id}: ${artwork.titleZh}`);

  // Check imageUrl
  const imageUrlPath = path.join('.', artwork.imageUrl);
  const imageUrlExists = fs.existsSync(imageUrlPath);

  if (!imageUrlExists) {
    console.log(`  ⚠ imageUrl missing: ${artwork.imageUrl}`);
    missingImages++;
  }

  // Check all images in images array
  let artworkHasImages = false;
  artwork.images.forEach(img => {
    totalImages++;
    const imgPath = path.join('.', img.url);
    const exists = fs.existsSync(imgPath);

    if (exists) {
      foundImages++;
      artworkHasImages = true;
    } else {
      missingImages++;
      console.log(`  ✗ ${img.id}: ${img.url} (missing)`);
    }
  });

  if (artworkHasImages) {
    artworksWithImages++;
    console.log(`  ✓ ${artwork.images.length} images (at least some exist)`);
  } else {
    artworksWithoutImages++;
    console.log(`  ⚠ No images found (placeholder will display)`);
  }
});

console.log(`\n${'='.repeat(60)}`);
console.log('Validation Summary:');
console.log(`${'='.repeat(60)}`);
console.log(`Total artworks: ${exhibitionData.artworks.length}`);
console.log(`Total image references: ${totalImages}`);
console.log(`Images found: ${foundImages} (${((foundImages/totalImages)*100).toFixed(1)}%)`);
console.log(`Images missing: ${missingImages} (${((missingImages/totalImages)*100).toFixed(1)}%)`);
console.log(`\nArtworks with images: ${artworksWithImages}`);
console.log(`Artworks without images: ${artworksWithoutImages}`);

if (artworksWithoutImages > 0) {
  console.log(`\n⚠ ${artworksWithoutImages} artworks will display placeholders`);
  console.log('Placeholder system will show:');
  console.log('  - Artwork title (Chinese + English)');
  console.log('  - Artist name');
  console.log('  - Year');
  console.log('  - Unique gradient background color');
}

console.log('\n✓ Task 1.9 validation complete!');
