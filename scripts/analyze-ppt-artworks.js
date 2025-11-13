/**
 * Analyze PPT structure to identify artworks and their images
 * This script helps map PPT slides to artwork IDs for multi-image support
 */

const fs = require('fs');
const path = require('path');

// Read PPT extracted content
const pptPath = path.join(__dirname, 'ppt-extracted-content.json');
const pptData = JSON.parse(fs.readFileSync(pptPath, 'utf8'));

// Read current data.js to get existing artwork IDs
const dataPath = path.join(__dirname, '..', 'js', 'data.js');
const dataContent = fs.readFileSync(dataPath, 'utf8');

// Extract artwork IDs from data.js
const artworkIdMatches = dataContent.match(/id:\s*"(artwork-\d+)"/g);
const existingArtworks = artworkIdMatches
  ? artworkIdMatches.map(m => m.match(/"(artwork-\d+)"/)[1])
  : [];

console.log(`\n📊 PPT Structure Analysis`);
console.log(`═══════════════════════════════════════════════════════════════\n`);
console.log(`Total slides: ${pptData.length}`);
console.log(`Existing artworks in data.js: ${existingArtworks.length}\n`);

// Analyze slide structure
const slidesByArtwork = [];
let currentArtwork = null;
let currentArtworkSlides = [];

pptData.forEach((slide, index) => {
  const { slide_number, content } = slide;
  const { texts, images } = content;

  // Check if this slide contains an artwork title
  const artworkTitlePattern = /^[\u4e00-\u9fa5a-zA-Z\s]+《.+》/;
  const hasArtworkTitle = texts.some(text => artworkTitlePattern.test(text.trim()));

  if (hasArtworkTitle) {
    // Save previous artwork
    if (currentArtwork) {
      slidesByArtwork.push({
        title: currentArtwork,
        slides: currentArtworkSlides,
        totalImages: currentArtworkSlides.reduce((sum, s) => sum + s.imageCount, 0)
      });
    }

    // Start new artwork
    currentArtwork = texts.find(text => artworkTitlePattern.test(text.trim()));
    currentArtworkSlides = [{
      slideNumber: slide_number,
      imageCount: images.length,
      texts: texts.filter(t => t.trim())
    }];
  } else if (currentArtwork && images.length > 0) {
    // This slide has images and belongs to current artwork
    currentArtworkSlides.push({
      slideNumber: slide_number,
      imageCount: images.length,
      texts: texts.filter(t => t.trim())
    });
  }
});

// Save last artwork
if (currentArtwork) {
  slidesByArtwork.push({
    title: currentArtwork,
    slides: currentArtworkSlides,
    totalImages: currentArtworkSlides.reduce((sum, s) => sum + s.imageCount, 0)
  });
}

// Display results
console.log(`Found ${slidesByArtwork.length} artworks in PPT:\n`);

slidesByArtwork.forEach((artwork, index) => {
  const artworkId = `artwork-${index + 1}`;
  const exists = existingArtworks.includes(artworkId);
  const hasMultiImages = index < 4; // artworks 1-4 already have multi-image support

  console.log(`${artworkId.toUpperCase()} ${exists ? '✅' : '❌'} ${hasMultiImages ? '🖼️' : '  '}`);
  console.log(`  Title: ${artwork.title}`);
  console.log(`  Slides: ${artwork.slides.map(s => s.slideNumber).join(', ')}`);
  console.log(`  Total images: ${artwork.totalImages}`);
  console.log(`  Slide details:`);

  artwork.slides.forEach(slide => {
    console.log(`    - Slide ${slide.slideNumber}: ${slide.imageCount} image(s)`);
  });

  console.log('');
});

// Generate summary
console.log(`\n📈 Summary:`);
console.log(`───────────────────────────────────────────────────────────────`);
console.log(`Total artworks: ${slidesByArtwork.length}`);
console.log(`With multi-image support: 4 (artworks 1-4)`);
console.log(`Remaining to process: ${slidesByArtwork.length - 4} (artworks 5-${slidesByArtwork.length})`);
console.log(`\nImage distribution:`);

const imageDistribution = {};
slidesByArtwork.forEach(artwork => {
  const count = artwork.totalImages;
  imageDistribution[count] = (imageDistribution[count] || 0) + 1;
});

Object.keys(imageDistribution).sort((a, b) => a - b).forEach(count => {
  console.log(`  ${count} image(s): ${imageDistribution[count]} artwork(s)`);
});

// Save mapping to JSON file
const outputPath = path.join(__dirname, 'ppt-artwork-mapping.json');
fs.writeFileSync(outputPath, JSON.stringify(slidesByArtwork, null, 2), 'utf8');
console.log(`\n✅ Mapping saved to: ${outputPath}\n`);
