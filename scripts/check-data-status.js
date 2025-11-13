const d = require('../exhibitions/negative-space-of-the-tide/data.json');

console.log('=== 数据库统计 ===');
console.log('艺术作品数量:', d.artworks.length);
console.log('评论家数量:', d.personas.length);
console.log('评论总数:', d.critiques.length);

console.log('\n=== 每位评论家的评论数 ===');
const personaCounts = {};
d.critiques.forEach(c => {
  personaCounts[c.personaId] = (personaCounts[c.personaId] || 0) + 1;
});
Object.entries(personaCounts).sort((a,b) => b[1] - a[1]).forEach(([id, count]) => {
  const p = d.personas.find(p => p.id === id);
  console.log(`  ${p.nameZh} (${id}): ${count} 条`);
});

console.log('\n=== 每件作品的评论数 ===');
const artworkCounts = {};
d.critiques.forEach(c => {
  artworkCounts[c.artworkId] = (artworkCounts[c.artworkId] || 0) + 1;
});

const missing = [];
for(let i=1; i<=38; i++) {
  const id = `artwork-${i}`;
  const count = artworkCounts[id] || 0;
  if(count !== 6) missing.push(`  ${id}: ${count} 条 ❌`);
}

if(missing.length > 0) {
  console.log('不完整的作品:');
  missing.forEach(m => console.log(m));
} else {
  console.log('✅ 所有作品都有 6 条评论');
}

console.log('\n=== 评论文本长度统计 ===');
const lengthsZh = d.critiques.filter(c => c.textZh).map(c => c.textZh.length);
const lengthsEn = d.critiques.filter(c => c.textEn).map(c => c.textEn.length);
console.log('中文评论:');
console.log('  最短:', Math.min(...lengthsZh), '字');
console.log('  最长:', Math.max(...lengthsZh), '字');
console.log('  平均:', Math.round(lengthsZh.reduce((a,b)=>a+b,0)/lengthsZh.length), '字');
console.log('英文评论:');
console.log('  最短:', Math.min(...lengthsEn), '字符');
console.log('  最长:', Math.max(...lengthsEn), '字符');
console.log('  平均:', Math.round(lengthsEn.reduce((a,b)=>a+b,0)/lengthsEn.length), '字符');

// 检查缺失字段
const missingZh = d.critiques.filter(c => !c.textZh).length;
const missingEn = d.critiques.filter(c => !c.textEn).length;
if(missingZh > 0 || missingEn > 0) {
  console.log('\n⚠️ 警告:');
  if(missingZh > 0) console.log(`  ${missingZh} 条评论缺少中文文本`);
  if(missingEn > 0) console.log(`  ${missingEn} 条评论缺少英文文本`);
}

console.log('\n=== RPAIT 评分统计 ===');
const rpaitScores = { R: [], P: [], A: [], I: [], T: [] };
d.critiques.forEach(c => {
  rpaitScores.R.push(c.rpait.R);
  rpaitScores.P.push(c.rpait.P);
  rpaitScores.A.push(c.rpait.A);
  rpaitScores.I.push(c.rpait.I);
  rpaitScores.T.push(c.rpait.T);
});

Object.entries(rpaitScores).forEach(([dim, scores]) => {
  const avg = (scores.reduce((a,b)=>a+b,0) / scores.length).toFixed(1);
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  console.log(`  ${dim}: 平均 ${avg} (范围 ${min}-${max})`);
});
