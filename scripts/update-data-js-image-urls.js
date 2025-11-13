/**
 * Update imageUrl paths in data.js to point to actual existing image files
 */

const fs = require('fs');
const path = require('path');

// Image URL mapping from fix-image-urls.js
const imageMapping = {
  "artwork-1": "/assets/artworks/artwork-1/01.png",
  "artwork-2": "/assets/artworks/artwork-2/01.jpg",
  "artwork-3": "/assets/artworks/artwork-3/01.jpg",
  "artwork-4": "/assets/artworks/artwork-4/01.jpg",
  "artwork-5": "/assets/artworks/artwork-5/01.png",
  "artwork-6": "/assets/artworks/artwork-6/01.png",
  "artwork-7": "/assets/artworks/artwork-7/01.png",
  "artwork-8": "/assets/artworks/artwork-8/01.png",
  "artwork-9": "/assets/artworks/artwork-9/01.png",
  "artwork-10": null,
  "artwork-11": "/assets/artworks/artwork-11/01.png",
  "artwork-12": "/assets/artworks/artwork-12/01.jpg",
  "artwork-13": "/assets/artworks/artwork-13/01.png",
  "artwork-14": "/assets/artworks/artwork-14/01.png",
  "artwork-15": "/assets/artworks/artwork-15/01.jpg",
  "artwork-16": "/assets/artworks/artwork-16/01.jpg",
  "artwork-17": "/assets/artworks/artwork-17/01.png",
  "artwork-18": "/assets/artworks/artwork-18/01.jpg",
  "artwork-19": "/assets/artworks/artwork-19/01.png",
  "artwork-20": "/assets/artworks/artwork-20/01.png",
  "artwork-21": "/assets/artworks/artwork-21/01.jpg",
  "artwork-22": "/assets/artworks/artwork-22/01.png",
  "artwork-23": null,
  "artwork-24": "/assets/artworks/artwork-24/01.png",
  "artwork-25": "/assets/artworks/artwork-25/01.jpg",
  "artwork-26": "/assets/artworks/artwork-26/01.png",
  "artwork-27": null,
  "artwork-28": "/assets/artworks/artwork-28/01.png",
  "artwork-29": "/assets/artworks/artwork-29/01.png",
  "artwork-30": "/assets/artworks/artwork-30/01.png",
  "artwork-31": "/assets/artworks/artwork-31/01.png",
  "artwork-32": "/assets/artworks/artwork-32/01.png",
  "artwork-33": "/assets/artworks/artwork-33/01.png",
  "artwork-34": "/assets/artworks/artwork-34/01.png",
  "artwork-35": "/assets/artworks/artwork-35/01.jpg",
  "artwork-36": "/assets/artworks/artwork-36/01.jpg",
  "artwork-37": "/assets/artworks/artwork-37/01.png",
  "artwork-38": null
};

const dataJsPath = path.join(__dirname, '../js/data.js');

console.log('📖 Reading data.js...');
let dataJsContent = fs.readFileSync(dataJsPath, 'utf-8');

// Create backup
const backupPath = dataJsPath + '.backup-image-urls';
fs.writeFileSync(backupPath, dataJsContent);
console.log(`✓ Backup created: ${backupPath}\n`);

let updatedCount = 0;
let keptPlaceholderCount = 0;

// Update each artwork's imageUrl
for (const [artworkId, newImageUrl] of Object.entries(imageMapping)) {
  if (newImageUrl === null) {
    // No image available, keep placeholder path (will trigger placeholder display)
    console.log(`⚠ ${artworkId}: No image, keeping placeholder path`);
    keptPlaceholderCount++;
    continue;
  }

  // Find and replace imageUrl for this artwork
  // Pattern: imageUrl: "/assets/artworks/artwork-X/main.jpg" or similar
  const pattern = new RegExp(
    `(id: "${artworkId}"[\\s\\S]*?imageUrl: ")([^"]+)(")`,
    'g'
  );

  const beforeReplace = dataJsContent;
  dataJsContent = dataJsContent.replace(pattern, (match, prefix, oldUrl, suffix) => {
    console.log(`✓ ${artworkId}: ${oldUrl} → ${newImageUrl}`);
    updatedCount++;
    return prefix + newImageUrl + suffix;
  });

  if (dataJsContent === beforeReplace) {
    console.warn(`⚠ ${artworkId}: Pattern not found in data.js`);
  }
}

// Write updated file
fs.writeFileSync(dataJsPath, dataJsContent);

console.log(`\n✅ Update complete:`);
console.log(`   Updated: ${updatedCount} artworks`);
console.log(`   Kept placeholder: ${keptPlaceholderCount} artworks (no images)`);
console.log(`   Backup: ${backupPath}`);
console.log(`\n💡 For artworks without images (10, 23, 27, 38), the placeholder system will display metadata.`);
