/**
 * VULCA Image Optimization Script
 *
 * 优化作品图片：压缩、转换WebP、生成多尺寸
 *
 * 用法: node scripts/optimize-images-perf.js [--dry-run]
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  inputDir: path.join(__dirname, '..', 'assets', 'artworks'),
  outputDir: path.join(__dirname, '..', 'assets', 'artworks-optimized'),

  // 尺寸配置
  sizes: {
    thumb: { width: 400, suffix: 'thumb' },
    medium: { width: 1200, suffix: 'medium' },
    large: { width: 2000, suffix: 'large' }
  },

  // 质量配置
  quality: {
    webp: 85,
    jpeg: 85
  },

  // 支持的输入格式
  supportedFormats: ['.png', '.jpg', '.jpeg', '.webp', '.tiff']
};

// 统计
const stats = {
  processed: 0,
  skipped: 0,
  errors: 0,
  originalSize: 0,
  optimizedSize: 0
};

/**
 * 获取文件大小（字节）
 */
function getFileSize(filePath) {
  try {
    return fs.statSync(filePath).size;
  } catch {
    return 0;
  }
}

/**
 * 格式化文件大小
 */
function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

/**
 * 处理单张图片
 */
async function processImage(inputPath, outputDir, dryRun = false) {
  const ext = path.extname(inputPath).toLowerCase();
  const baseName = path.basename(inputPath, ext);

  if (!CONFIG.supportedFormats.includes(ext)) {
    return { skipped: true, reason: 'unsupported format' };
  }

  const originalSize = getFileSize(inputPath);
  stats.originalSize += originalSize;

  if (dryRun) {
    console.log(`  [DRY-RUN] Would process: ${inputPath}`);
    return { skipped: false, dryRun: true };
  }

  // 确保输出目录存在
  const imageOutputDir = path.join(outputDir, baseName);
  if (!fs.existsSync(imageOutputDir)) {
    fs.mkdirSync(imageOutputDir, { recursive: true });
  }

  let totalOptimizedSize = 0;

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // 为每个尺寸生成图片
    for (const [sizeName, sizeConfig] of Object.entries(CONFIG.sizes)) {
      // 如果原图比目标尺寸小，使用原图尺寸
      const targetWidth = Math.min(sizeConfig.width, metadata.width);

      // 生成 WebP
      const webpPath = path.join(imageOutputDir, `${sizeConfig.suffix}.webp`);
      await sharp(inputPath)
        .resize(targetWidth, null, { withoutEnlargement: true })
        .webp({ quality: CONFIG.quality.webp })
        .toFile(webpPath);
      totalOptimizedSize += getFileSize(webpPath);

      // 为 large 尺寸生成 JPG fallback
      if (sizeName === 'large') {
        const jpgPath = path.join(imageOutputDir, `${sizeConfig.suffix}.jpg`);
        await sharp(inputPath)
          .resize(targetWidth, null, { withoutEnlargement: true })
          .jpeg({ quality: CONFIG.quality.jpeg, progressive: true })
          .toFile(jpgPath);
        totalOptimizedSize += getFileSize(jpgPath);
      }
    }

    stats.optimizedSize += totalOptimizedSize;

    return {
      skipped: false,
      originalSize,
      optimizedSize: totalOptimizedSize,
      reduction: ((1 - totalOptimizedSize / originalSize) * 100).toFixed(1)
    };
  } catch (error) {
    console.error(`  Error processing ${inputPath}:`, error.message);
    stats.errors++;
    return { skipped: true, error: error.message };
  }
}

/**
 * 遍历作品目录
 */
async function processArtworkDirectory(artworkDir, dryRun = false) {
  const artworkName = path.basename(artworkDir);
  const outputDir = path.join(CONFIG.outputDir, artworkName);

  // 获取目录中的所有图片
  const files = fs.readdirSync(artworkDir).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return CONFIG.supportedFormats.includes(ext);
  });

  if (files.length === 0) {
    return;
  }

  console.log(`\n📁 ${artworkName} (${files.length} images)`);

  for (const file of files) {
    const inputPath = path.join(artworkDir, file);
    const result = await processImage(inputPath, outputDir, dryRun);

    if (result.skipped) {
      stats.skipped++;
      if (result.error) {
        console.log(`  ❌ ${file}: ${result.error}`);
      }
    } else if (!result.dryRun) {
      stats.processed++;
      console.log(`  ✅ ${file}: ${formatSize(result.originalSize)} → ${formatSize(result.optimizedSize)} (-${result.reduction}%)`);
    }
  }
}

/**
 * 主函数
 */
async function main() {
  const dryRun = process.argv.includes('--dry-run');

  console.log('🖼️  VULCA Image Optimization');
  console.log('============================');
  console.log(`Input:  ${CONFIG.inputDir}`);
  console.log(`Output: ${CONFIG.outputDir}`);
  console.log(`Mode:   ${dryRun ? 'DRY RUN' : 'PRODUCTION'}`);
  console.log('');

  // 检查输入目录
  if (!fs.existsSync(CONFIG.inputDir)) {
    console.error('❌ Input directory not found:', CONFIG.inputDir);
    process.exit(1);
  }

  // 创建输出目录
  if (!dryRun && !fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  // 获取所有作品目录
  const artworkDirs = fs.readdirSync(CONFIG.inputDir)
    .filter(item => {
      const fullPath = path.join(CONFIG.inputDir, item);
      return fs.statSync(fullPath).isDirectory();
    })
    .map(item => path.join(CONFIG.inputDir, item))
    .sort();

  console.log(`Found ${artworkDirs.length} artwork directories`);

  // 处理每个作品目录
  for (const artworkDir of artworkDirs) {
    await processArtworkDirectory(artworkDir, dryRun);
  }

  // 打印统计
  console.log('\n============================');
  console.log('📊 Summary');
  console.log('============================');
  console.log(`Processed: ${stats.processed} images`);
  console.log(`Skipped:   ${stats.skipped} images`);
  console.log(`Errors:    ${stats.errors}`);
  console.log('');
  console.log(`Original size:  ${formatSize(stats.originalSize)}`);
  console.log(`Optimized size: ${formatSize(stats.optimizedSize)}`);

  if (stats.originalSize > 0) {
    const reduction = ((1 - stats.optimizedSize / stats.originalSize) * 100).toFixed(1);
    console.log(`Reduction:      ${reduction}%`);
  }

  console.log('');
  if (dryRun) {
    console.log('💡 Run without --dry-run to actually process images');
  } else {
    console.log('✅ Done! Optimized images saved to:', CONFIG.outputDir);
  }
}

main().catch(console.error);
