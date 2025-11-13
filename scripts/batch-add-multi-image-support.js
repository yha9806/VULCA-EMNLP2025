/**
 * Batch add multi-image support to artworks based on PPT mappings
 * Processes multiple artworks efficiently
 */

const fs = require('fs');
const path = require('path');

// PPT to artwork mappings from user
const PPT_MAPPINGS = [
  { ppt: [13, 14], artwork: 'artwork-10' },
  { ppt: [17, 18], artwork: 'artwork-12' },
  { ppt: [19, 20], artwork: 'artwork-13' },
  { ppt: [22, 23], artwork: 'artwork-14', note: 'Image too small, needs resize' },
  { ppt: [24, 25], artwork: 'artwork-15' },
  { ppt: [26, 27], artwork: 'artwork-16' },
  { ppt: [29, 30], artwork: 'artwork-17' },
  { ppt: [31, 32], artwork: 'artwork-18' },
  { ppt: [36, 37], artwork: 'artwork-20' },
  { ppt: [38, 39], artwork: 'artwork-21' },
  { ppt: [41, 42], artwork: 'artwork-22' },
  { ppt: [45, 46], artwork: 'artwork-24' },
  { ppt: [47, 48], artwork: 'artwork-25' },
  { ppt: [49, 50], artwork: 'artwork-26', note: 'Duplicate with artwork-27' },
  { ppt: [51, 52], artwork: 'artwork-27' },
  { ppt: [53, 54], artwork: 'artwork-28' },
  { ppt: [56, 57], artwork: 'artwork-29' },
  { ppt: [61, 62], artwork: 'artwork-30' },
  { ppt: [66, 67], artwork: 'artwork-31' },
  { ppt: [68, 69], artwork: 'artwork-32' },
  { ppt: [70, 71], artwork: 'artwork-33' },
  { ppt: [73, 74], artwork: 'artwork-34', note: 'Also mapped to 76-77' },
  { ppt: [76, 77], artwork: 'artwork-34', note: 'Duplicate mapping' },
  { ppt: [86, 87], artwork: 'artwork-37' }
];

// Read PPT content
const pptPath = path.join(__dirname, 'ppt-extracted-content.json');
const pptData = JSON.parse(fs.readFileSync(pptPath, 'utf8'));

// Read data.js
const dataPath = path.join(__dirname, '..', 'js', 'data.js');
let dataContent = fs.readFileSync(dataPath, 'utf8');

console.log(`\n🔍 Analyzing PPT mappings and actual files...\n`);

// Analyze each mapping
const analysisResults = [];

for (const mapping of PPT_MAPPINGS) {
  const { ppt, artwork, note } = mapping;
  const [startPage, endPage] = ppt;

  console.log(`\n[${artwork}] PPT pages ${startPage}-${endPage}`);
  if (note) console.log(`   Note: ${note}`);

  // Get PPT content for these pages
  const pptPages = pptData.filter(page =>
    page.slide_number >= startPage && page.slide_number <= endPage
  );

  // Extract artwork info from PPT
  let artworkTitle = '';
  let imageCount = 0;

  pptPages.forEach(page => {
    if (page.content.texts && page.content.texts.length > 0) {
      const text = page.content.texts[0];
      if (text.includes('《') && text.includes('》')) {
        artworkTitle = text;
      }
    }
    if (page.content.images) {
      imageCount += page.content.images.length;
    }
  });

  console.log(`   PPT Title: ${artworkTitle}`);
  console.log(`   PPT Images: ${imageCount}`);

  // Check actual files
  const assetsDir = path.join(__dirname, '..', 'assets', 'artworks', artwork);
  let actualFiles = [];

  if (fs.existsSync(assetsDir)) {
    actualFiles = fs.readdirSync(assetsDir)
      .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
      .sort();
    console.log(`   Actual Files: ${actualFiles.length} - ${actualFiles.join(', ')}`);
  } else {
    console.log(`   ⚠️  Directory not found: ${assetsDir}`);
  }

  analysisResults.push({
    artwork,
    ppt,
    artworkTitle,
    pptImageCount: imageCount,
    actualFiles,
    actualFileCount: actualFiles.length,
    note
  });
}

// Save analysis results
const outputPath = path.join(__dirname, 'batch-analysis-results.json');
fs.writeFileSync(outputPath, JSON.stringify(analysisResults, null, 2), 'utf8');

console.log(`\n\n📊 Analysis Summary:`);
console.log(`───────────────────────────────────────────────────────────────`);
console.log(`Total mappings: ${PPT_MAPPINGS.length}`);
console.log(`Artworks with files: ${analysisResults.filter(r => r.actualFileCount > 0).length}`);
console.log(`Artworks without files: ${analysisResults.filter(r => r.actualFileCount === 0).length}`);
console.log(`Special cases: ${analysisResults.filter(r => r.note).length}`);
console.log(`\n✅ Analysis saved to: ${path.basename(outputPath)}\n`);
