const fs = require('fs');

const data = JSON.parse(fs.readFileSync('exhibitions/negative-space-of-the-tide/data.json', 'utf8'));

console.log('图片路径分析：\n');
const pathTypes = {};
data.artworks.forEach(artwork => {
  const path = artwork.imageUrl || (artwork.images && artwork.images[0]?.url);
  if (path) {
    const prefix = path.split('/')[0];
    pathTypes[prefix] = (pathTypes[prefix] || 0) + 1;
  }
});

Object.entries(pathTypes).forEach(([prefix, count]) => {
  console.log(`  ${prefix}/... : ${count} 件作品`);
});

console.log('\n前10件作品的图片路径：');
data.artworks.slice(0, 10).forEach(artwork => {
  const path = artwork.imageUrl || (artwork.images && artwork.images[0]?.url);
  console.log(`  ${artwork.id}: ${path}`);
});

console.log(`\n总作品数：${data.artworks.length}`);
