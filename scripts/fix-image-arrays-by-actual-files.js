/**
 * Fix images arrays in data.js based on actual image files
 * Scans each artwork directory and adjusts the images array
 */

const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'assets', 'artworks');
const dataPath = path.join(__dirname, '..', 'js', 'data.js');

console.log(`\n🔍 Scanning actual image files...\n`);

// Scan artwork directories
const artworkDirs = fs.readdirSync(assetsDir).filter(name => {
  return fs.statSync(path.join(assetsDir, name)).isDirectory() && name.startsWith('artwork-');
});

const actualImages = {};

artworkDirs.forEach(dir => {
  const artworkId = dir;
  const dirPath = path.join(assetsDir, dir);
  const files = fs.readdirSync(dirPath)
    .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
    .sort(); // Sort to ensure correct order

  if (files.length > 0) {
    actualImages[artworkId] = files;
    console.log(`${artworkId}: ${files.length} image(s) - ${files.join(', ')}`);
  }
});

console.log(`\n📊 Summary:`);
console.log(`───────────────────────────────────────────────────────────────`);
console.log(`Artworks with images: ${Object.keys(actualImages).length}`);
console.log(`Total image files: ${Object.values(actualImages).flat().length}\n`);

// Save to JSON for reference
const outputPath = path.join(__dirname, 'actual-images-inventory.json');
fs.writeFileSync(outputPath, JSON.stringify(actualImages, null, 2), 'utf8');
console.log(`✅ Inventory saved to: ${path.basename(outputPath)}\n`);

console.log(`\n📋 Next Step:`);
console.log(`───────────────────────────────────────────────────────────────`);
console.log(`Review actual-images-inventory.json to see available images per artwork.`);
console.log(`\nOptions:`);
console.log(`1. Extract missing images from PPT (complete but time-consuming)`);
console.log(`2. Adjust data.js images arrays to match actual files (quick fix)`);
console.log(`3. Use placeholder images for missing files\n`);
