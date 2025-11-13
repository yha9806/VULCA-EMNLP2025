const d = require('../exhibitions/negative-space-of-the-tide/data.json');

const missing = d.critiques.filter(c => !c.textEn);
console.log('缺少英文文本的评论 (共 ' + missing.length + ' 条):\n');

const byArtwork = {};
missing.forEach(c => {
  byArtwork[c.artworkId] = (byArtwork[c.artworkId] || []).concat(c.personaId);
});

Object.entries(byArtwork).sort((a,b) => a[0].localeCompare(b[0])).forEach(([art, critics]) => {
  const artwork = d.artworks.find(a => a.id === art);
  console.log(`  ${art} (${artwork.titleZh}): ${critics.length} 条`);
  console.log(`    缺少: ${critics.join(', ')}`);
});
