/**
 * Split Exhibition Data Script
 *
 * 将单一 data.json 拆分为多个小文件，实现按需加载
 *
 * 用法: node scripts/split-exhibition-data.js
 */

const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'exhibitions', 'negative-space-of-the-tide', 'data.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'exhibitions', 'negative-space-of-the-tide', 'data');

// 读取原始数据
console.log('Reading data.json...');
const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));

// 创建输出目录
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const critiquesDir = path.join(OUTPUT_DIR, 'critiques');
if (!fs.existsSync(critiquesDir)) {
  fs.mkdirSync(critiquesDir, { recursive: true });
}

// 1. 拆分 artworks.json
console.log('\n1. Creating artworks.json...');
const artworksData = {
  metadata: data.metadata,
  artworks: data.artworks
};
const artworksPath = path.join(OUTPUT_DIR, 'artworks.json');
fs.writeFileSync(artworksPath, JSON.stringify(artworksData, null, 2), 'utf-8');
console.log(`   ✅ ${artworksPath} (${(fs.statSync(artworksPath).size / 1024).toFixed(1)} KB)`);

// 2. 拆分 personas.json
console.log('\n2. Creating personas.json...');
const personasData = {
  personas: data.personas
};
const personasPath = path.join(OUTPUT_DIR, 'personas.json');
fs.writeFileSync(personasPath, JSON.stringify(personasData, null, 2), 'utf-8');
console.log(`   ✅ ${personasPath} (${(fs.statSync(personasPath).size / 1024).toFixed(1)} KB)`);

// 3. 按作品拆分 critiques
console.log('\n3. Creating per-artwork critique files...');

// 按作品ID分组评论
const critiquesByArtwork = {};
data.critiques.forEach(critique => {
  const artworkId = critique.artworkId;
  if (!critiquesByArtwork[artworkId]) {
    critiquesByArtwork[artworkId] = [];
  }
  critiquesByArtwork[artworkId].push(critique);
});

// 写入每个作品的评论文件
let totalCritiquesSize = 0;
Object.entries(critiquesByArtwork).forEach(([artworkId, critiques]) => {
  const filePath = path.join(critiquesDir, `${artworkId}.json`);
  fs.writeFileSync(filePath, JSON.stringify({ critiques }, null, 2), 'utf-8');
  const size = fs.statSync(filePath).size;
  totalCritiquesSize += size;
  console.log(`   ✅ ${artworkId}.json (${(size / 1024).toFixed(1)} KB, ${critiques.length} critiques)`);
});

// 4. 创建索引文件（可选，用于检查可用的评论文件）
console.log('\n4. Creating critiques index...');
const critiquesIndex = {
  artworkIds: Object.keys(critiquesByArtwork),
  count: Object.keys(critiquesByArtwork).length
};
const indexPath = path.join(critiquesDir, 'index.json');
fs.writeFileSync(indexPath, JSON.stringify(critiquesIndex, null, 2), 'utf-8');
console.log(`   ✅ ${indexPath}`);

// 打印统计
console.log('\n============================');
console.log('📊 Summary');
console.log('============================');
console.log(`Original data.json: ${(fs.statSync(DATA_PATH).size / 1024).toFixed(1)} KB`);
console.log('');
console.log('Split files:');
console.log(`  artworks.json:     ${(fs.statSync(artworksPath).size / 1024).toFixed(1)} KB`);
console.log(`  personas.json:     ${(fs.statSync(personasPath).size / 1024).toFixed(1)} KB`);
console.log(`  critiques/*.json:  ${(totalCritiquesSize / 1024).toFixed(1)} KB (${Object.keys(critiquesByArtwork).length} files)`);
console.log('');
console.log(`首屏数据 (artworks + personas): ${((fs.statSync(artworksPath).size + fs.statSync(personasPath).size) / 1024).toFixed(1)} KB`);
console.log('');
console.log('✅ Done! Split files saved to:', OUTPUT_DIR);
