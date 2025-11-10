#!/usr/bin/env node

/**
 * Migration Script: Current Exhibition → New Structure
 *
 * Transforms the existing "Negative Space of the Tide" exhibition
 * from the old single-page structure to the new multi-exhibition architecture.
 *
 * Reads:
 *   - js/data.js (VULCA_DATA)
 *   - js/data/dialogues/*.js (dialogue files)
 *
 * Generates:
 *   - exhibitions/negative-space-of-the-tide/config.json
 *   - exhibitions/negative-space-of-the-tide/data.json
 *   - exhibitions/negative-space-of-the-tide/dialogues.json
 *   - exhibitions/negative-space-of-the-tide/index.html
 *   - exhibitions/negative-space-of-the-tide/README.md
 *
 * Usage:
 *   node scripts/migrate-current-exhibition.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Exhibition metadata
const EXHIBITION_SLUG = 'negative-space-of-the-tide';
const EXHIBITION_ID = EXHIBITION_SLUG;

console.log('\n🔄 Migration: Current Exhibition → New Structure\n');
console.log(`Target: /exhibitions/${EXHIBITION_SLUG}/\n`);

// Step 1: Read and parse VULCA_DATA from js/data.js
console.log('1️⃣  Reading js/data.js...');

const dataJsPath = path.join(process.cwd(), 'js', 'data.js');
const dataJsContent = fs.readFileSync(dataJsPath, 'utf8');

// Create a sandbox context to execute the data.js file
const sandbox = {
  window: {},
  IMAGE_CATEGORIES: {},
  console: { log: () => {}, warn: () => {}, error: () => {} }
};

// Execute data.js in sandbox to extract VULCA_DATA
vm.createContext(sandbox);
try {
  vm.runInContext(dataJsContent, sandbox);
} catch (error) {
  console.error(`❌ Error parsing js/data.js: ${error.message}`);
  process.exit(1);
}

const VULCA_DATA = sandbox.window.VULCA_DATA;

if (!VULCA_DATA) {
  console.error('❌ Failed to extract VULCA_DATA from js/data.js');
  process.exit(1);
}

console.log(`   ✓ Loaded VULCA_DATA`);
console.log(`     - Artworks: ${VULCA_DATA.artworks.length}`);
console.log(`     - Personas: ${VULCA_DATA.personas.length}`);
console.log(`     - Critiques: ${VULCA_DATA.critiques.length}`);

// Step 2: Read dialogue files
console.log('\n2️⃣  Reading dialogue files...');

const dialoguesDir = path.join(process.cwd(), 'js', 'data', 'dialogues');
const dialogueFiles = [
  'artwork-1.js',
  'artwork-2.js',
  'artwork-3.js',
  'artwork-4.js'
];

// We'll manually parse the dialogue files since they're ES6 modules
// For now, we'll create a simple structure for dialogues.json
// In production, you might want to use a more sophisticated parser

const dialoguesData = {
  dialogues: []
};

console.log('   ⚠️  Dialogue files are ES6 modules - creating placeholder structure');
console.log('   📝 You may need to manually copy dialogue data from:');
dialogueFiles.forEach(file => {
  console.log(`      - js/data/dialogues/${file}`);
});

// Create placeholder dialogues (to be filled manually)
VULCA_DATA.artworks.forEach((artwork, index) => {
  dialoguesData.dialogues.push({
    id: `${artwork.id}-dialogue`,
    artworkId: artwork.id,
    topicZh: `关于《${artwork.titleZh}》的对话`,
    topicEn: `Dialogue on "${artwork.titleEn}"`,
    participants: VULCA_DATA.personas.map(p => p.id),
    messages: [
      // Placeholder - to be filled with actual dialogue data
      {
        id: `msg-${artwork.id}-placeholder`,
        personaId: VULCA_DATA.personas[0].id,
        textZh: `这是${artwork.titleZh}的对话占位符。请从 js/data/dialogues/artwork-${index + 1}.js 复制真实数据。`,
        textEn: `This is a placeholder for ${artwork.titleEn}. Please copy actual data from js/data/dialogues/artwork-${index + 1}.js`,
        timestamp: 0,
        replyTo: null,
        interactionType: 'initial'
      }
    ]
  });
});

console.log(`   ✓ Created ${dialoguesData.dialogues.length} placeholder dialogue objects`);

// Step 3: Generate config.json
console.log('\n3️⃣  Generating config.json...');

const config = {
  id: EXHIBITION_ID,
  slug: EXHIBITION_SLUG,
  titleZh: '潮汐的负形',
  titleEn: 'Negative Space of the Tide',
  year: 2025,
  status: 'live',
  descriptionZh: '一场关于人工智能与艺术创作的深度对话，通过6位来自不同文化背景的评论家视角，探索机器创造力的本质。',
  descriptionEn: 'An in-depth dialogue on AI and artistic creation, exploring the nature of machine creativity through the perspectives of 6 critics from diverse cultural backgrounds.',
  stats: {
    artworks: VULCA_DATA.artworks.length,
    personas: VULCA_DATA.personas.length,
    messages: dialoguesData.dialogues.reduce((sum, d) => sum + d.messages.length, 0),
    dialogues: dialoguesData.dialogues.length
  },
  features: [
    'dialogue-player',
    'image-carousel',
    'rpait-visualization',
    'knowledge-base-references'
  ],
  theme: {
    primaryColor: '#B85C3C',
    accentColor: '#D4A574'
  },
  assets: {
    cover: './assets/cover.jpg',
    ogImage: './assets/og-image.jpg'
  }
};

console.log(`   ✓ Generated config.json`);
console.log(`     - Title: ${config.titleZh} / ${config.titleEn}`);
console.log(`     - Year: ${config.year}`);
console.log(`     - Status: ${config.status}`);

// Step 4: Generate data.json
console.log('\n4️⃣  Generating data.json...');

// Clean up personas (remove duplicate ai-ethics/ai-ethics-reviewer)
const uniquePersonas = VULCA_DATA.personas.filter((persona, index, self) => {
  // Keep only the first occurrence of each ID
  return index === self.findIndex(p => p.id === persona.id);
});

// Remove the 'rpait' field from personas (it's calculated dynamically)
const cleanPersonas = uniquePersonas.map(persona => {
  const { rpait, ...rest } = persona;
  return rest;
});

const data = {
  artworks: VULCA_DATA.artworks,
  personas: cleanPersonas,
  critiques: VULCA_DATA.critiques
};

console.log(`   ✓ Generated data.json`);
console.log(`     - Artworks: ${data.artworks.length}`);
console.log(`     - Personas: ${data.personas.length} (removed duplicates)`);
console.log(`     - Critiques: ${data.critiques.length}`);

// Step 5: Create exhibition directory
console.log('\n5️⃣  Creating exhibition directory...');

const exhibitionDir = path.join(process.cwd(), 'exhibitions', EXHIBITION_SLUG);
const assetsDir = path.join(exhibitionDir, 'assets');

if (!fs.existsSync(exhibitionDir)) {
  fs.mkdirSync(exhibitionDir, { recursive: true });
  console.log(`   ✓ Created ${exhibitionDir}`);
} else {
  console.log(`   ⚠️  Directory already exists: ${exhibitionDir}`);
}

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
  console.log(`   ✓ Created ${assetsDir}`);
}

// Step 6: Write JSON files
console.log('\n6️⃣  Writing JSON files...');

fs.writeFileSync(
  path.join(exhibitionDir, 'config.json'),
  JSON.stringify(config, null, 2)
);
console.log(`   ✓ Wrote config.json (${Math.round(JSON.stringify(config).length / 1024)}KB)`);

fs.writeFileSync(
  path.join(exhibitionDir, 'data.json'),
  JSON.stringify(data, null, 2)
);
console.log(`   ✓ Wrote data.json (${Math.round(JSON.stringify(data).length / 1024)}KB)`);

fs.writeFileSync(
  path.join(exhibitionDir, 'dialogues.json'),
  JSON.stringify(dialoguesData, null, 2)
);
console.log(`   ✓ Wrote dialogues.json (${Math.round(JSON.stringify(dialoguesData).length / 1024)}KB)`);
console.log(`   ⚠️  dialogues.json contains placeholder data - needs manual update`);

// Step 7: Generate index.html
console.log('\n7️⃣  Generating index.html...');

const indexHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.titleZh} | ${config.titleEn}</title>

  <!-- SEO Meta Tags -->
  <meta name="description" content="${config.descriptionZh}">
  <meta name="keywords" content="AI艺术, 艺术评论, 人工智能, 机器创造力, 文化对话">
  <meta name="author" content="VULCA">

  <!-- Open Graph Meta Tags -->
  <meta property="og:title" content="${config.titleZh} | ${config.titleEn}">
  <meta property="og:description" content="${config.descriptionZh}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://vulcaart.art/exhibitions/${EXHIBITION_SLUG}/">
  <meta property="og:image" content="https://vulcaart.art/exhibitions/${EXHIBITION_SLUG}/assets/og-image.jpg">

  <!-- Twitter Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${config.titleZh} | ${config.titleEn}">
  <meta name="twitter:description" content="${config.descriptionZh}">
  <meta name="twitter:image" content="https://vulcaart.art/exhibitions/${EXHIBITION_SLUG}/assets/og-image.jpg">

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
  <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">

  <!-- Shared Stylesheets -->
  <link rel="stylesheet" href="/shared/styles/components/dialogue-player.css">
  <link rel="stylesheet" href="/shared/styles/components/reference-tooltip.css">
  <link rel="stylesheet" href="/shared/styles/components/reference-modal.css">
  <link rel="stylesheet" href="/shared/styles/components/quote-interaction.css">
  <link rel="stylesheet" href="/shared/styles/components/thought-chain.css">

  <!-- Exhibition-specific styles (optional) -->
  <!-- <link rel="stylesheet" href="./styles/custom.css"> -->
</head>
<body>
  <div id="exhibition-root" data-exhibition-id="${EXHIBITION_ID}">
    <!-- Content will be loaded dynamically by exhibition-loader.js -->
    <div class="loading-indicator">
      <p>Loading exhibition...</p>
    </div>
  </div>

  <!-- Shared JavaScript (Phase 3: To be implemented) -->
  <!-- <script type="module" src="/shared/js/exhibition-loader.js"></script> -->

  <!-- Temporary: Load legacy scripts for now -->
  <script>window.IMMERSIVE_MODE = true;</script>
  <script src="/js/data.js?v=3"></script>
  <script src="/js/scroll-prevention.js?v=1"></script>
  <script src="/js/navigation.js?v=1"></script>
  <script src="/js/app.js?v=1"></script>
</body>
</html>
`;

fs.writeFileSync(
  path.join(exhibitionDir, 'index.html'),
  indexHtml
);
console.log(`   ✓ Wrote index.html`);

// Step 8: Generate README.md
console.log('\n8️⃣  Generating README.md...');

const readme = `# ${config.titleZh} / ${config.titleEn}

**Exhibition ID**: \`${config.id}\`
**Year**: ${config.year}
**Status**: ${config.status}

## Overview

${config.descriptionZh}

${config.descriptionEn}

## Contents

- **Artworks**: ${config.stats.artworks}
- **Personas**: ${config.stats.personas}
- **Dialogues**: ${config.stats.dialogues}
- **Messages**: ${config.stats.messages}

## Features

${config.features.map(f => `- ${f}`).join('\n')}

## Theme

- **Primary Color**: \`${config.theme.primaryColor}\`
- **Accent Color**: \`${config.theme.accentColor}\`

## Files

- \`config.json\` - Exhibition configuration and metadata
- \`data.json\` - Artworks, personas, and critiques data
- \`dialogues.json\` - Dialogue messages (⚠️ currently placeholder data)
- \`index.html\` - Exhibition page
- \`assets/\` - Exhibition-specific media files

## Validation

\`\`\`bash
npm run validate-exhibition ${EXHIBITION_SLUG}
\`\`\`

## Assets Needed

- [ ] \`assets/cover.jpg\` (1200x800px, <500KB)
- [ ] \`assets/og-image.jpg\` (1200x630px)
- [ ] Copy artwork images from \`/assets/artworks/\`

## Next Steps

1. **Update dialogues.json** with actual dialogue data from:
   - \`js/data/dialogues/artwork-1.js\`
   - \`js/data/dialogues/artwork-2.js\`
   - \`js/data/dialogues/artwork-3.js\`
   - \`js/data/dialogues/artwork-4.js\`

2. **Copy assets**:
   \`\`\`bash
   cp assets/og-image.jpg exhibitions/${EXHIBITION_SLUG}/assets/
   # Create or copy cover image
   \`\`\`

3. **Validate**:
   \`\`\`bash
   npm run validate-exhibition ${EXHIBITION_SLUG}
   \`\`\`

4. **Test locally**:
   \`\`\`bash
   python -m http.server 9999
   # Visit http://localhost:9999/exhibitions/${EXHIBITION_SLUG}/
   \`\`\`

## Migration Notes

This exhibition was migrated from the original single-page structure on ${new Date().toISOString()}.

Original files:
- \`index.html\` (root)
- \`js/data.js\`
- \`js/data/dialogues/*.js\`

Migration script: \`scripts/migrate-current-exhibition.js\`
`;

fs.writeFileSync(
  path.join(exhibitionDir, 'README.md'),
  readme
);
console.log(`   ✓ Wrote README.md`);

// Step 9: Summary
console.log('\n' + '='.repeat(60));
console.log('✅ Migration complete!\n');
console.log('Generated files:');
console.log(`   - ${exhibitionDir}/config.json`);
console.log(`   - ${exhibitionDir}/data.json`);
console.log(`   - ${exhibitionDir}/dialogues.json ⚠️  (placeholder)`);
console.log(`   - ${exhibitionDir}/index.html`);
console.log(`   - ${exhibitionDir}/README.md`);
console.log(`   - ${exhibitionDir}/assets/ (empty)\n`);

console.log('⚠️  Next actions required:\n');
console.log('1. Update dialogues.json with actual dialogue data');
console.log('   (See README.md for detailed instructions)\n');
console.log('2. Copy assets:');
console.log(`   cp assets/og-image.jpg ${exhibitionDir}/assets/`);
console.log(`   # Create cover.jpg (1200x800px)\n`);
console.log('3. Validate:');
console.log(`   npm run validate-exhibition ${EXHIBITION_SLUG}\n`);
console.log('4. Test locally:');
console.log(`   python -m http.server 9999`);
console.log(`   # Visit http://localhost:9999/exhibitions/${EXHIBITION_SLUG}/\n`);
