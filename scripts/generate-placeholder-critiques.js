/**
 * Generate placeholder critiques for new confirmed artworks
 * Phase 2.1 of sync-exhibition-with-ppt-final-version
 *
 * Generates 30 critiques (5 artworks × 6 personas) with template-based content
 */

const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../exhibitions/negative-space-of-the-tide/data.json');

// Persona IDs from VULCA_DATA.personas
const PERSONAS = [
  {
    id: 'su-shi',
    nameZh: '苏轼',
    nameEn: 'Su Shi',
    approach: '哲学-诗意',
    focusZh: '艺术的精神内涵与人生哲理',
    focusEn: 'spiritual essence and life philosophy in art'
  },
  {
    id: 'guo-xi',
    nameZh: '郭熙',
    nameEn: 'Guo Xi',
    approach: '技术-系统',
    focusZh: '构图法度与山水气象',
    focusEn: 'compositional principles and landscape atmosphere'
  },
  {
    id: 'john-ruskin',
    nameZh: '约翰·罗斯金',
    nameEn: 'John Ruskin',
    approach: '道德-政治',
    focusZh: '艺术的社会责任与道德价值',
    focusEn: 'social responsibility and moral value of art'
  },
  {
    id: 'mama-zola',
    nameZh: 'Mama Zola',
    nameEn: 'Mama Zola',
    approach: '社区-去殖民',
    focusZh: '集体记忆与文化传承',
    focusEn: 'collective memory and cultural transmission'
  },
  {
    id: 'professor-petrova',
    nameZh: 'Professor Petrova',
    nameEn: 'Professor Petrova',
    approach: '形式-结构',
    focusZh: '艺术形式的陌生化与设备',
    focusEn: 'defamiliarization and device in art forms'
  },
  {
    id: 'ai-ethics-reviewer',
    nameZh: 'AI Ethics Reviewer',
    nameEn: 'AI Ethics Reviewer',
    approach: '权力-系统',
    focusZh: 'AI艺术的伦理与权力结构',
    focusEn: 'ethics and power structures in AI art'
  }
];

// New confirmed artworks
const NEW_ARTWORKS = [
  {
    id: 'artwork-39',
    titleZh: '渴望说出难以忘怀的事物 III',
    titleEn: 'Longing to Speak of Unforgettable Things III',
    artist: '凌筱薇 (Ling Xiaowei)',
    school: '中央美术学院'
  },
  {
    id: 'artwork-41',
    titleZh: '郭缤禧作品',
    titleEn: 'Guo Binxi\'s Artwork',
    artist: '郭缤禧 (Guo Binxi)',
    school: '四川美术学院'
  },
  {
    id: 'artwork-43',
    titleZh: '林杨彬作品',
    titleEn: 'Lin Yangbin\'s Artwork',
    artist: '林杨彬 (Lin Yangbin)',
    school: '广东美术学院'
  },
  {
    id: 'artwork-45',
    titleZh: '邢辰力德作品',
    titleEn: 'Xing Chenlide\'s Artwork',
    artist: '邢辰力德 (Xing Chenlide)',
    school: '湖北美术学院'
  },
  {
    id: 'artwork-46',
    titleZh: '周妤蓉作品',
    titleEn: 'Zhou Yurong\'s Artwork',
    artist: '周妤蓉 (Zhou Yurong)',
    school: '台湾师范大学'
  }
];

// Generate critique text template
function generateCritiqueText(artwork, persona) {
  const textZh = `观${artwork.artist}之作《${artwork.titleZh}》，从${persona.nameZh}（${persona.approach}）的视角出发，此作品值得深入探讨其${persona.focusZh}。作品展现了当代艺术创作中对传统与现代、技术与人文的深刻思考。[此处需要根据实际作品内容补充详细评论，建议使用知识库生成完整评论]`;

  const textEn = `Observing the work "${artwork.titleEn}" by ${artwork.artist}, from ${persona.nameEn}'s (${persona.approach}) perspective, this artwork deserves in-depth exploration of its ${persona.focusEn}. The work demonstrates profound contemplation on tradition and modernity, technology and humanities in contemporary art creation. [Detailed critique should be supplemented based on actual artwork content, recommend using knowledge base for complete generation]`;

  return { textZh, textEn };
}

// Generate RPAIT scores (placeholder values, should be refined)
function generateRPAITScores(personaId) {
  // Different personas emphasize different dimensions
  const personaProfiles = {
    'su-shi': { R: 7, P: 9, A: 8, I: 8, T: 7 },
    'guo-xi': { R: 9, P: 8, A: 9, I: 7, T: 9 },
    'john-ruskin': { R: 8, P: 8, A: 7, I: 9, T: 6 },
    'mama-zola': { R: 6, P: 7, A: 8, I: 10, T: 8 },
    'professor-petrova': { R: 9, P: 6, A: 10, I: 5, T: 7 },
    'ai-ethics-reviewer': { R: 7, P: 9, A: 6, I: 8, T: 5 }
  };

  const baseScores = personaProfiles[personaId] || { R: 7, P: 7, A: 7, I: 7, T: 7 };

  // Add small random variation (-1 to +1)
  const variation = () => Math.floor(Math.random() * 3) - 1;

  return {
    R: Math.max(1, Math.min(10, baseScores.R + variation())),
    P: Math.max(1, Math.min(10, baseScores.P + variation())),
    A: Math.max(1, Math.min(10, baseScores.A + variation())),
    I: Math.max(1, Math.min(10, baseScores.I + variation())),
    T: Math.max(1, Math.min(10, baseScores.T + variation()))
  };
}

function generateCritiques() {
  console.log('[Generate] Starting placeholder critique generation...');

  // Read current data
  console.log('[Generate] Reading current data.json...');
  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  console.log(`[Generate] Current critique count: ${data.critiques.length}`);

  // Generate critiques
  console.log('\n[Generate] Generating 30 new critiques (5 artworks × 6 personas)...');
  const newCritiques = [];

  NEW_ARTWORKS.forEach(artwork => {
    console.log(`\n[Generate] Artwork: ${artwork.id} - ${artwork.titleZh}`);

    PERSONAS.forEach(persona => {
      const { textZh, textEn } = generateCritiqueText(artwork, persona);
      const rpait = generateRPAITScores(persona.id);

      const critique = {
        artworkId: artwork.id,
        personaId: persona.id,
        textZh,
        textEn,
        rpait
      };

      newCritiques.push(critique);
      console.log(`  ✓ Generated critique: ${persona.nameZh} (R:${rpait.R} P:${rpait.P} A:${rpait.A} I:${rpait.I} T:${rpait.T})`);
    });
  });

  // Add new critiques to data
  console.log('\n[Generate] Adding critiques to data.critiques array...');
  data.critiques.push(...newCritiques);

  console.log(`[Generate] New total critique count: ${data.critiques.length}`);

  // Write updated data
  console.log('\n[Generate] Writing updated data.json...');
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');

  console.log('[Generate] ✓ Generation complete!');

  // Validation
  console.log('\n[Validation] Running post-generation checks...');
  const updatedData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

  console.log(`[Validation] ✓ JSON syntax valid`);
  console.log(`[Validation] ✓ Total critiques: ${updatedData.critiques.length}`);

  // Verify each new artwork has 6 critiques
  NEW_ARTWORKS.forEach(artwork => {
    const artworkCritiques = updatedData.critiques.filter(c => c.artworkId === artwork.id);
    const status = artworkCritiques.length === 6 ? '✓' : '✗';
    console.log(`[Validation] ${status} ${artwork.id}: ${artworkCritiques.length} critiques`);

    if (artworkCritiques.length === 6) {
      const personaIds = artworkCritiques.map(c => c.personaId).sort();
      const expectedIds = PERSONAS.map(p => p.id).sort();
      const allPresent = JSON.stringify(personaIds) === JSON.stringify(expectedIds);
      console.log(`[Validation]   ${allPresent ? '✓' : '✗'} All 6 personas present`);
    }
  });

  console.log('\n[Generate] Success! Placeholder critiques generated.');
  console.log('[Generate] NOTE: These are template-based critiques.');
  console.log('[Generate] Recommendation: Refine critiques using LLM + knowledge base for production quality.');
}

// Run generation
try {
  generateCritiques();
} catch (error) {
  console.error('[Generate] FATAL ERROR:', error.message);
  console.error(error.stack);
  process.exit(1);
}
