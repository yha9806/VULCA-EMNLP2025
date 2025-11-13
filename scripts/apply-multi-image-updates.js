/**
 * Apply multi-image updates to data.js
 * Adds images arrays and primaryImageId to artworks 5-38
 */

const fs = require('fs');
const path = require('path');

// Read files
const updatesPath = path.join(__dirname, 'multi-image-updates.json');
const updates = JSON.parse(fs.readFileSync(updatesPath, 'utf8'));

const dataPath = path.join(__dirname, '..', 'js', 'data.js');
let dataContent = fs.readFileSync(dataPath, 'utf8');

console.log(`\n🔧 Applying multi-image updates to data.js...\n`);

// Backup original file
const backupPath = dataPath + `.backup-${Date.now()}`;
fs.writeFileSync(backupPath, dataContent, 'utf8');
console.log(`✅ Created backup: ${path.basename(backupPath)}\n`);

let successCount = 0;
let skippedCount = 0;

// Process each artwork update
updates.forEach((update, index) => {
  const { artworkId, titleZh, imageCount, images } = update;

  console.log(`[${index + 1}/${updates.length}] Processing ${artworkId} ("${titleZh}")...`);

  // Find the artwork block in data.js
  const artworkIdPattern = `id: "${artworkId}"`;
  const idIndex = dataContent.indexOf(artworkIdPattern);

  if (idIndex === -1) {
    console.log(`   ❌ Could not find ${artworkId} in data.js`);
    skippedCount++;
    return;
  }

  // Find the closing brace of this artwork object
  // We need to find the next "},\n    {" or the final "}\n  ]"
  let braceCount = 0;
  let inArtwork = false;
  let artworkEndIndex = idIndex;

  for (let i = idIndex; i < dataContent.length; i++) {
    const char = dataContent[i];

    if (char === '{') {
      braceCount++;
      inArtwork = true;
    } else if (char === '}') {
      braceCount--;
      if (inArtwork && braceCount === 0) {
        // Found the closing brace of this artwork
        artworkEndIndex = i;
        break;
      }
    }
  }

  // Extract the artwork block
  const artworkBlock = dataContent.substring(idIndex, artworkEndIndex + 1);

  // Check if it already has images array
  if (artworkBlock.includes('primaryImageId:') || artworkBlock.includes('images:')) {
    console.log(`   ⏭️  Already has multi-image support, skipping`);
    skippedCount++;
    return;
  }

  // Find the context field (last field before closing brace)
  const contextMatch = artworkBlock.match(/context:\s*"[^"]*"/);
  if (!contextMatch) {
    console.log(`   ❌ Could not find context field`);
    skippedCount++;
    return;
  }

  const contextEndIndex = idIndex + artworkBlock.indexOf(contextMatch[0]) + contextMatch[0].length;

  // Generate the images array string
  const imagesArrayStr = generateImagesArrayString(images, artworkId);

  // Insert the new fields after the context field
  const insertStr = `,\n\n      // Multi-image support\n      primaryImageId: "${images[0].id}",\n      images: ${imagesArrayStr}`;

  // Insert into data.js
  dataContent = dataContent.substring(0, contextEndIndex) + insertStr + dataContent.substring(contextEndIndex);

  console.log(`   ✅ Added ${imageCount} image(s)`);
  successCount++;
});

// Write updated data.js
fs.writeFileSync(dataPath, dataContent, 'utf8');

console.log(`\n📊 Summary:`);
console.log(`───────────────────────────────────────────────────────────────`);
console.log(`Total updates: ${updates.length}`);
console.log(`Successfully applied: ${successCount}`);
console.log(`Skipped: ${skippedCount}`);
console.log(`\n✅ data.js updated successfully!`);
console.log(`📁 Backup saved to: ${path.basename(backupPath)}\n`);

/**
 * Generate images array string with proper indentation
 */
function generateImagesArrayString(images, artworkId) {
  const indent = '        '; // 8 spaces for proper alignment

  const imagesStr = images.map(img => {
    return `${indent}{
${indent}  id: "${img.id}",
${indent}  url: "${img.url}",
${indent}  category: IMAGE_CATEGORIES.${img.category.toUpperCase()},
${indent}  sequence: ${img.sequence},
${indent}  titleZh: "${img.titleZh}",
${indent}  titleEn: "${img.titleEn}",
${indent}  caption: "${img.caption}",
${indent}  metadata: {
${indent}    year: ${img.metadata.year},
${indent}    dimensions: "${img.metadata.dimensions}",
${indent}    medium: "${img.metadata.medium}"
${indent}  }
${indent}}`;
  }).join(`,\n`);

  return `[\n${imagesStr}\n      ]`;
}
