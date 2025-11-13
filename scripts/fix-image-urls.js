/**
 * Fix imageUrl paths in data.js to point to actual existing image files
 * Detects first available image (01.png or 01.jpg) in each artwork directory
 */

const fs = require('fs');
const path = require('path');

const dataJsPath = path.join(__dirname, '../js/data.js');
const assetsDir = path.join(__dirname, '../assets/artworks');

console.log('🔍 Scanning artwork directories for actual images...\n');

// Read data.js
const dataJsContent = fs.readFileSync(dataJsPath, 'utf-8');

// Extract artworks array (simple regex, matches lines like: id: "artwork-5",)
const artworkIdPattern = /id: "artwork-(\d+)"/g;
const artworkIds = [];
let match;
while ((match = artworkIdPattern.exec(dataJsContent)) !== null) {
  artworkIds.push(parseInt(match[1]));
}

console.log(`✓ Found ${artworkIds.length} artwork entries in data.js\n`);

// Map artwork IDs to actual first image
const imageMapping = {};

for (const artworkNum of artworkIds) {
  const artworkId = `artwork-${artworkNum}`;
  const artworkDir = path.join(assetsDir, artworkId);

  // Check if directory exists
  if (!fs.existsSync(artworkDir)) {
    console.warn(`⚠ Directory not found: ${artworkDir}`);
    imageMapping[artworkId] = null;
    continue;
  }

  // List files in directory
  const files = fs.readdirSync(artworkDir).sort();

  // Find first image (prefer 01.png, 01.jpg, or first available)
  const firstImage = files.find(f => f === '01.png') ||
                     files.find(f => f === '01.jpg') ||
                     files.find(f => f.match(/^01\./)) ||
                     files[0];

  if (firstImage) {
    const imageUrl = `/assets/artworks/${artworkId}/${firstImage}`;
    imageMapping[artworkId] = imageUrl;
    console.log(`✓ ${artworkId}: ${firstImage}`);
  } else {
    console.warn(`⚠ ${artworkId}: No images found (empty directory)`);
    imageMapping[artworkId] = null;
  }
}

console.log(`\n📊 Summary:`);
console.log(`   Total artworks: ${artworkIds.length}`);
console.log(`   With images: ${Object.values(imageMapping).filter(v => v !== null).length}`);
console.log(`   Without images: ${Object.values(imageMapping).filter(v => v === null).length}`);

// Generate replacement mapping
console.log(`\n📝 Image URL mapping:`);
console.log(JSON.stringify(imageMapping, null, 2));

// Optionally apply replacements
console.log(`\n💡 To apply these changes, create an update script that:`);
console.log(`   1. Reads this mapping`);
console.log(`   2. Updates each artwork's imageUrl in data.js`);
console.log(`   3. Creates backup before modification`);
