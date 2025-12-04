/**
 * Update data.json to use optimized images
 *
 * 将 data.json 中的图片路径更新为优化后的 WebP 格式
 */

const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'exhibitions', 'negative-space-of-the-tide', 'data.json');
const OPTIMIZED_DIR = path.join(__dirname, '..', 'assets', 'artworks-optimized');

// 读取数据
const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));

let updatedCount = 0;

/**
 * 转换图片路径为优化版本
 * 例如: /assets/artworks/artwork-1/01.png -> /assets/artworks-optimized/artwork-1/01/medium.webp
 */
function convertImageUrl(url) {
  if (!url || !url.includes('/assets/artworks/')) {
    return url;
  }

  // 解析路径
  const match = url.match(/\/assets\/artworks\/(artwork-\d+)\/([^\/]+)$/);
  if (!match) {
    return url;
  }

  const [, artworkId, filename] = match;
  const baseName = path.basename(filename, path.extname(filename));

  // 检查优化后的目录是否存在
  const optimizedPath = path.join(OPTIMIZED_DIR, artworkId, baseName, 'medium.webp');
  if (fs.existsSync(optimizedPath)) {
    return `/assets/artworks-optimized/${artworkId}/${baseName}/medium.webp`;
  }

  return url;
}

// 更新 artworks
data.artworks.forEach(artwork => {
  // 更新主图
  if (artwork.imageUrl) {
    const newUrl = convertImageUrl(artwork.imageUrl);
    if (newUrl !== artwork.imageUrl) {
      console.log(`  ${artwork.id}: ${artwork.imageUrl} -> ${newUrl}`);
      artwork.imageUrl = newUrl;
      updatedCount++;
    }
  }

  // 更新多图数组
  if (artwork.images && Array.isArray(artwork.images)) {
    artwork.images.forEach(img => {
      if (img.url) {
        const newUrl = convertImageUrl(img.url);
        if (newUrl !== img.url) {
          console.log(`  ${artwork.id}/${img.id}: ${img.url} -> ${newUrl}`);
          img.url = newUrl;
          updatedCount++;
        }
      }
    });
  }
});

// 备份原文件
const backupPath = DATA_PATH + '.backup-before-optimization';
fs.copyFileSync(DATA_PATH, backupPath);
console.log(`\nBackup saved to: ${backupPath}`);

// 保存更新后的数据
fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');

console.log(`\n✅ Updated ${updatedCount} image references`);
console.log(`Data saved to: ${DATA_PATH}`);
