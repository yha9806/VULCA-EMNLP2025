/**
 * Image Optimization Script for VULCA Exhibition
 * Optimizes artwork images to 1200x800px, <500KB, 85% quality
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const TARGET_WIDTH = 1200;
const TARGET_HEIGHT = 800;
const TARGET_QUALITY = 85;
const MAX_SIZE_KB = 500;

const assetsDir = path.join(__dirname, 'assets');

const artworks = [
  { id: 'artwork-1', input: 'artwork-1.jpg', output: 'artwork-1.jpg' },
  { id: 'artwork-2', input: 'artwork-2.png', output: 'artwork-2.jpg' }, // Convert PNG to JPG
  { id: 'artwork-3', input: 'artwork-3.jpg', output: 'artwork-3.jpg' },
  { id: 'artwork-4', input: 'artwork-4.jpg', output: 'artwork-4.jpg' }
];

async function optimizeImage(artwork) {
  const inputPath = path.join(assetsDir, artwork.input);
  const outputPath = path.join(assetsDir, artwork.output);

  console.log(`\n📸 Processing ${artwork.id}...`);

  try {
    // Get original image metadata
    const metadata = await sharp(inputPath).metadata();
    console.log(`   Original: ${metadata.width}x${metadata.height}, ${metadata.format}, ${(metadata.size / 1024).toFixed(2)}KB`);

    // Resize and optimize
    await sharp(inputPath)
      .resize(TARGET_WIDTH, TARGET_HEIGHT, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({
        quality: TARGET_QUALITY,
        progressive: true
      })
      .toFile(outputPath + '.tmp');

    // Check output size
    const stats = fs.statSync(outputPath + '.tmp');
    const sizeKB = stats.size / 1024;

    console.log(`   Optimized: ${TARGET_WIDTH}x${TARGET_HEIGHT}, JPG, ${sizeKB.toFixed(2)}KB`);

    if (sizeKB > MAX_SIZE_KB) {
      console.log(`   ⚠️  Size ${sizeKB.toFixed(2)}KB exceeds ${MAX_SIZE_KB}KB, adjusting quality...`);

      // Reduce quality if size is too large
      let quality = TARGET_QUALITY - 10;
      while (quality > 50) {
        await sharp(inputPath)
          .resize(TARGET_WIDTH, TARGET_HEIGHT, {
            fit: 'cover',
            position: 'center'
          })
          .jpeg({
            quality: quality,
            progressive: true
          })
          .toFile(outputPath + '.tmp2');

        const newStats = fs.statSync(outputPath + '.tmp2');
        const newSizeKB = newStats.size / 1024;

        if (newSizeKB <= MAX_SIZE_KB) {
          fs.renameSync(outputPath + '.tmp2', outputPath + '.tmp');
          fs.unlinkSync(outputPath + '.tmp2').catch(() => {});
          console.log(`   ✅ Reduced to quality ${quality}: ${newSizeKB.toFixed(2)}KB`);
          break;
        }

        quality -= 5;
      }
    }

    // Replace original file
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
    fs.renameSync(outputPath + '.tmp', outputPath);

    console.log(`   ✅ Saved: ${outputPath}`);

  } catch (error) {
    console.error(`   ❌ Error processing ${artwork.id}:`, error.message);
  }
}

async function main() {
  console.log('🎨 VULCA Artwork Image Optimizer');
  console.log('================================');
  console.log(`Target: ${TARGET_WIDTH}x${TARGET_HEIGHT}px, <${MAX_SIZE_KB}KB, ${TARGET_QUALITY}% quality\n`);

  for (const artwork of artworks) {
    await optimizeImage(artwork);
  }

  console.log('\n✨ Optimization complete!');
  console.log('\nFinal results:');

  // List all optimized files
  for (const artwork of artworks) {
    const filePath = path.join(assetsDir, artwork.output);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      const status = stats.size / 1024 <= MAX_SIZE_KB ? '✅' : '⚠️';
      console.log(`${status} ${artwork.output}: ${sizeKB}KB`);
    }
  }
}

main().catch(console.error);
