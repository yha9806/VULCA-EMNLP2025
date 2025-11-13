/**
 * Correct images arrays in data.js based on actual files
 * Adjusts image count and file extensions to match reality
 */

const fs = require('fs');
const path = require('path');

// Read actual images inventory
const inventoryPath = path.join(__dirname, 'actual-images-inventory.json');
const actualImages = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));

const dataPath = path.join(__dirname, '..', 'js', 'data.js');
let dataContent = fs.readFileSync(dataPath, 'utf8');

console.log(`\n🔧 Correcting images arrays based on actual files...\n`);

// Backup
const backupPath = dataPath + `.backup-correction-${Date.now()}`;
fs.writeFileSync(backupPath, dataContent, 'utf8');
console.log(`✅ Created backup: ${path.basename(backupPath)}\n`);

let correctedCount = 0;
let unchangedCount = 0;
let errorCount = 0;

// Process each artwork
Object.keys(actualImages).sort((a, b) => {
  const numA = parseInt(a.split('-')[1]);
  const numB = parseInt(b.split('-')[1]);
  return numA - numB;
}).forEach(artworkId => {
  const files = actualImages[artworkId];
  const artworkNum = parseInt(artworkId.split('-')[1]);

  console.log(`[${artworkId}] Correcting (${files.length} file(s))...`);

  // Find the images array in data.js
  const searchPattern = `// Multi-image support\\s+primaryImageId: "img-${artworkNum}-\\d+"`;
  const regex = new RegExp(searchPattern);
  const match = dataContent.match(regex);

  if (!match) {
    console.log(`   ⚠️  No images array found (may not have multi-image support yet)`);
    unchangedCount++;
    return;
  }

  // Find the full images array block
  const startIndex = dataContent.indexOf(match[0]);
  let arrayStartIndex = dataContent.indexOf('images: [', startIndex);

  if (arrayStartIndex === -1) {
    console.log(`   ❌ Could not find images array start`);
    errorCount++;
    return;
  }

  // Find the end of the images array
  let bracketCount = 0;
  let arrayEndIndex = arrayStartIndex + 8; // Start after "images: ["
  let inArray = true;

  for (let i = arrayEndIndex; i < dataContent.length; i++) {
    const char = dataContent[i];
    if (char === '[') bracketCount++;
    else if (char === ']') {
      bracketCount--;
      if (inArray && bracketCount === -1) {
        arrayEndIndex = i + 1;
        break;
      }
    }
  }

  // Generate corrected images array
  const newImagesArray = generateCorrectedImagesArray(artworkId, artworkNum, files);

  // Replace the old array
  const before = dataContent.substring(0, arrayStartIndex);
  const after = dataContent.substring(arrayEndIndex);
  dataContent = before + `images: ${newImagesArray}` + after;

  // Also update primaryImageId
  const primaryImageId = `img-${artworkNum}-1`;
  dataContent = dataContent.replace(
    new RegExp(`primaryImageId: "img-${artworkNum}-\\d+"`),
    `primaryImageId: "${primaryImageId}"`
  );

  console.log(`   ✅ Updated (${files.length} image(s))`);
  correctedCount++;
});

// Write corrected data.js
fs.writeFileSync(dataPath, dataContent, 'utf8');

console.log(`\n📊 Summary:`);
console.log(`───────────────────────────────────────────────────────────────`);
console.log(`Total artworks: ${Object.keys(actualImages).length}`);
console.log(`Corrected: ${correctedCount}`);
console.log(`Unchanged: ${unchangedCount}`);
console.log(`Errors: ${errorCount}`);
console.log(`\n✅ data.js corrected successfully!`);
console.log(`📁 Backup saved to: ${path.basename(backupPath)}\n`);

/**
 * Generate corrected images array based on actual files
 */
function generateCorrectedImagesArray(artworkId, artworkNum, files) {
  const indent = '        ';

  const IMAGE_CATEGORIES = ['INSTALLATION', 'PROCESS', 'DETAIL', 'CONTEXT', 'FINAL'];

  const images = files.map((filename, index) => {
    const imgNum = index + 1;
    const ext = path.extname(filename); // .jpg or .png
    const category = IMAGE_CATEGORIES[index % IMAGE_CATEGORIES.length];

    // Use the actual filename to construct URL
    const url = `/assets/artworks/${artworkId}/${filename}`;

    return `${indent}{
${indent}  id: "img-${artworkNum}-${imgNum}",
${indent}  url: "${url}",
${indent}  category: IMAGE_CATEGORIES.${category},
${indent}  sequence: ${imgNum},
${indent}  titleZh: "图片 ${imgNum}",
${indent}  titleEn: "Image ${imgNum}",
${indent}  caption: "Image ${imgNum} from the artwork. [Caption to be customized]",
${indent}  metadata: {
${indent}    year: 2024,
${indent}    dimensions: "TBD",
${indent}    medium: "Digital image"
${indent}  }
${indent}}`;
  }).join(`,\n`);

  return `[\n${images}\n      ]`;
}
