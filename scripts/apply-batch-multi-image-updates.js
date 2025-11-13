/**
 * Apply batch multi-image updates to data.js
 * Based on analysis results and PPT mappings
 */

const fs = require('fs');
const path = require('path');

// Read analysis results
const analysisPath = path.join(__dirname, 'batch-analysis-results.json');
const analysisResults = JSON.parse(fs.readFileSync(analysisPath, 'utf8'));

// Read data.js
const dataPath = path.join(__dirname, '..', 'js', 'data.js');
let dataContent = fs.readFileSync(dataPath, 'utf8');

// English translations for artworks (based on PPT titles and cultural context)
const ENGLISH_TRANSLATIONS = {
  'artwork-10': 'Origin Journey',  // 源游
  'artwork-12': 'Bamboo Investigation',  // 格竹 (格物致知的典故)
  'artwork-13': 'Daily Pursuit',  // 逐日计划
  'artwork-14': 'X Museum',  // X博物馆
  'artwork-15': '404 Grotto',  // 404词窟
  'artwork-16': 'Where Does the Wind Come From · II',  // 风从何处来·二
  'artwork-17': 'Unstable Contours',  // 不稳定轮廓
  'artwork-18': 'Disorderly Consensus',  // 无序共识
  'artwork-20': 'Circular Void',  // 环形虚无
  'artwork-21': 'Upload',  // Upload (already English)
  'artwork-22': 'Along Lingnan Road',  // 岭南道中
  'artwork-24': '[Title TBD]',  // PPT没有标题
  'artwork-25': 'Return to Origin · Symbiosis',  // 归原.共生
  'artwork-26': 'Tracing the Source No.1',  // 溯元1号
  'artwork-27': 'Defense Statement',  // 辩白书
  'artwork-28': 'Defense Statement',  // 辩白书 (same as 27)
  'artwork-29': '[Title TBD]',  // PPT没有标题
  'artwork-30': '[Title TBD]',  // PPT没有标题
  'artwork-31': '[Title TBD]',  // PPT没有标题
  'artwork-32': 'Black No.1',  // 黑色1號
  'artwork-33': 'Code',  // 密碼
  'artwork-34': '[Title TBD]',  // PPT没有标题
  'artwork-37': 'Lauren Lee McCarthy and David Leonard'  // Already English
};

console.log(`\n🔧 Applying batch multi-image updates to data.js...\n`);

// Backup original file
const backupPath = dataPath + `.backup-batch-${Date.now()}`;
fs.writeFileSync(backupPath, dataContent, 'utf8');
console.log(`✅ Created backup: ${path.basename(backupPath)}\n`);

let successCount = 0;
let skippedCount = 0;
let noFilesCount = 0;

// Process each artwork
for (const result of analysisResults) {
  const { artwork, artworkTitle, actualFiles, actualFileCount, note } = result;

  // Skip duplicates (artwork-34 second mapping)
  if (note && note.includes('Duplicate mapping')) {
    console.log(`[${artwork}] ⏭️  Skipping duplicate mapping`);
    skippedCount++;
    continue;
  }

  // Skip artworks without files
  if (actualFileCount === 0) {
    console.log(`[${artwork}] ⚠️  No image files found, skipping`);
    noFilesCount++;
    continue;
  }

  const artworkNum = parseInt(artwork.split('-')[1]);
  console.log(`\n[${artwork}] Processing (${actualFileCount} file(s))...`);
  if (note) console.log(`   Note: ${note}`);

  // Find artwork block in data.js
  const idPattern = `id: "${artwork}"`;
  const idIndex = dataContent.indexOf(idPattern);

  if (idIndex === -1) {
    console.log(`   ❌ Could not find ${artwork} in data.js`);
    skippedCount++;
    continue;
  }

  // Find the closing brace of this artwork object
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
        artworkEndIndex = i;
        break;
      }
    }
  }

  // Extract artwork block
  const artworkBlock = dataContent.substring(idIndex, artworkEndIndex + 1);

  // Check if already has multi-image support
  if (artworkBlock.includes('primaryImageId:') || artworkBlock.includes('images:')) {
    console.log(`   ⏭️  Already has multi-image support, skipping`);
    skippedCount++;
    continue;
  }

  // Find context field (last field before closing brace)
  const contextMatch = artworkBlock.match(/context:\s*"[^"]*"/);
  if (!contextMatch) {
    console.log(`   ❌ Could not find context field`);
    skippedCount++;
    continue;
  }

  const contextEndIndex = idIndex + artworkBlock.indexOf(contextMatch[0]) + contextMatch[0].length;

  // Generate images array
  const imagesArrayStr = generateImagesArray(artwork, artworkNum, actualFiles);

  // Get English translation
  const titleEn = ENGLISH_TRANSLATIONS[artwork] || artworkTitle;

  // Insert multi-image support after context field
  const insertStr = `,\n\n      // Multi-image support\n      primaryImageId: "img-${artworkNum}-1",\n      images: ${imagesArrayStr}`;

  // Insert into data.js
  dataContent = dataContent.substring(0, contextEndIndex) + insertStr + dataContent.substring(contextEndIndex);

  // Also update titleEn if it's currently a duplicate
  const titleEnPattern = new RegExp(`(id: "${artwork}"[\\s\\S]{1,200}?titleEn: )"[^"]*"`, 'm');
  const titleEnMatch = dataContent.match(titleEnPattern);

  if (titleEnMatch) {
    const currentTitleEn = titleEnMatch[0].split('titleEn: ')[1].replace(/"/g, '');
    // Check if titleEn is Chinese (contains Chinese characters)
    if (/[\u4e00-\u9fa5]/.test(currentTitleEn)) {
      dataContent = dataContent.replace(
        titleEnPattern,
        `$1"${titleEn}"`
      );
      console.log(`   ✅ Updated titleEn: "${titleEn}"`);
    }
  }

  console.log(`   ✅ Added ${actualFileCount} image(s)`);
  successCount++;
}

// Write updated data.js
fs.writeFileSync(dataPath, dataContent, 'utf8');

console.log(`\n\n📊 Summary:`);
console.log(`───────────────────────────────────────────────────────────────`);
console.log(`Total artworks: ${analysisResults.length}`);
console.log(`Successfully updated: ${successCount}`);
console.log(`Skipped (already done): ${skippedCount}`);
console.log(`Skipped (no files): ${noFilesCount}`);
console.log(`\n✅ data.js updated successfully!`);
console.log(`📁 Backup saved to: ${path.basename(backupPath)}\n`);

/**
 * Generate images array string
 */
function generateImagesArray(artworkId, artworkNum, files) {
  const indent = '        ';

  const IMAGE_CATEGORIES = ['FINAL', 'INSTALLATION', 'DETAIL', 'PROCESS', 'CONTEXT'];

  const images = files.map((filename, index) => {
    const imgNum = index + 1;
    const ext = path.extname(filename);
    const category = IMAGE_CATEGORIES[index % IMAGE_CATEGORIES.length];

    const url = `/assets/artworks/${artworkId}/${filename}`;

    return `${indent}{\n${indent}  id: "img-${artworkNum}-${imgNum}",\n${indent}  url: "${url}",\n${indent}  category: IMAGE_CATEGORIES.${category},\n${indent}  sequence: ${imgNum},\n${indent}  titleZh: "图片 ${imgNum}",\n${indent}  titleEn: "Image ${imgNum}",\n${indent}  caption: "Image ${imgNum} from the artwork. [Caption to be customized]",\n${indent}  metadata: {\n${indent}    year: 2024,\n${indent}    dimensions: "TBD",\n${indent}    medium: "Digital art"\n${indent}  }\n${indent}}`;
  }).join(`,\n`);

  return `[\n${images}\n      ]`;
}
