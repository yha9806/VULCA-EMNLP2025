#!/usr/bin/env node

/**
 * Exhibition Scaffolding Tool
 * Creates directory structure and template files for a new exhibition
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to prompt user for input
function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Helper function to validate slug format
function isValidSlug(slug) {
  return /^[a-z0-9-]+$/.test(slug);
}

// Main scaffolding function
async function scaffoldExhibition() {
  console.log('\n📦 VULCA Exhibition Scaffolding Tool\n');
  console.log('This tool will create a new exhibition directory with template files.\n');

  try {
    // Check if running in non-interactive mode
    const args = process.argv.slice(2);
    const nonInteractive = args.includes('--non-interactive');
    const slugArg = args.find(arg => arg.startsWith('--slug='));

    let slug, titleZh, titleEn, year, artworkCount, personaCount;

    if (nonInteractive && slugArg) {
      // Non-interactive mode (for testing)
      slug = slugArg.split('=')[1];
      titleZh = '测试展览';
      titleEn = 'Test Exhibition';
      year = 2025;
      artworkCount = 3;
      personaCount = 4;
    } else {
      // Interactive mode
      slug = await question('Exhibition slug (kebab-case, e.g., my-exhibition): ');

      if (!isValidSlug(slug)) {
        console.error('❌ Invalid slug format. Use only lowercase letters, numbers, and hyphens.');
        rl.close();
        process.exit(1);
      }

      // Check if directory already exists
      const exhibitionDir = path.join(process.cwd(), 'exhibitions', slug);
      if (fs.existsSync(exhibitionDir)) {
        console.error(`❌ Exhibition directory already exists: ${exhibitionDir}`);
        rl.close();
        process.exit(1);
      }

      titleZh = await question('Chinese title: ');
      titleEn = await question('English title: ');
      year = parseInt(await question('Year: '));
      artworkCount = parseInt(await question('Number of artworks: '));
      personaCount = parseInt(await question('Number of personas: '));
    }

    // Create directory structure
    const exhibitionDir = path.join(process.cwd(), 'exhibitions', slug);
    const assetsDir = path.join(exhibitionDir, 'assets');

    console.log(`\n✓ Creating directory: ${exhibitionDir}`);
    fs.mkdirSync(exhibitionDir, { recursive: true });
    fs.mkdirSync(assetsDir, { recursive: true });

    // Generate config.json
    const config = {
      id: slug,
      slug: slug,
      titleZh: titleZh,
      titleEn: titleEn,
      year: year,
      status: "upcoming",
      descriptionZh: "展览描述（请更新此内容）",
      descriptionEn: "Exhibition description (please update this content)",
      stats: {
        artworks: artworkCount,
        personas: personaCount,
        messages: 0,
        dialogues: 0
      },
      features: [
        "dialogue-player",
        "image-carousel"
      ],
      theme: {
        primaryColor: "#B85C3C",
        accentColor: "#D4A574"
      },
      assets: {
        cover: "./assets/cover.jpg",
        ogImage: "./assets/og-image.jpg"
      }
    };

    const configPath = path.join(exhibitionDir, 'config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`✓ Created config.json`);

    // Generate data.json (empty template)
    const data = {
      artworks: [],
      personas: [],
      critiques: []
    };

    const dataPath = path.join(exhibitionDir, 'data.json');
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    console.log(`✓ Created data.json`);

    // Generate dialogues.json (empty template)
    const dialogues = {
      dialogues: []
    };

    const dialoguesPath = path.join(exhibitionDir, 'dialogues.json');
    fs.writeFileSync(dialoguesPath, JSON.stringify(dialogues, null, 2));
    console.log(`✓ Created dialogues.json`);

    // Create README.md
    const readme = `# ${titleZh} / ${titleEn}

**Exhibition ID**: \`${slug}\`
**Year**: ${year}
**Status**: Upcoming

## Overview

(Add exhibition overview here)

## Contents

- **Artworks**: ${artworkCount}
- **Personas**: ${personaCount}

## Files

- \`config.json\` - Exhibition configuration and metadata
- \`data.json\` - Artworks, personas, and critiques data
- \`dialogues.json\` - Dialogue messages
- \`assets/\` - Exhibition-specific media files

## Next Steps

1. Add cover image to \`assets/cover.jpg\` (1200x800px, <500KB)
2. Add OG image to \`assets/og-image.jpg\` (1200x630px)
3. Fill in artwork data in \`data.json\`
4. Fill in persona data in \`data.json\`
5. Fill in critique data in \`data.json\`
6. Create dialogue messages in \`dialogues.json\`
7. Run validation: \`npm run validate-exhibition ${slug}\`
8. Update API: \`npm run generate-api\`

## Validation

\`\`\`bash
npm run validate-exhibition ${slug}
\`\`\`

## Documentation

See \`/CLAUDE.md\` for complete exhibition management guide.
`;

    const readmePath = path.join(exhibitionDir, 'README.md');
    fs.writeFileSync(readmePath, readme);
    console.log(`✓ Created README.md`);

    // Create index.html placeholder
    const indexHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titleZh} | ${titleEn}</title>

  <!-- Meta tags will be populated dynamically -->

  <!-- Shared Stylesheets -->
  <link rel="stylesheet" href="/shared/styles/components/dialogue-player.css">
  <link rel="stylesheet" href="/shared/styles/components/unified-navigation.css">

  <!-- Exhibition-specific styles (if needed) -->
  <!-- <link rel="stylesheet" href="./styles/custom.css"> -->
</head>
<body>
  <div id="exhibition-root" data-exhibition-id="${slug}">
    <!-- Content will be loaded dynamically -->
  </div>

  <!-- Shared JavaScript -->
  <script type="module" src="/shared/js/exhibition-loader.js"></script>
</body>
</html>
`;

    const indexPath = path.join(exhibitionDir, 'index.html');
    fs.writeFileSync(indexPath, indexHtml);
    console.log(`✓ Created index.html`);

    console.log('\n✅ Exhibition scaffolding complete!');
    console.log(`\nNext steps:`);
    console.log(`  1. Add cover image to ${path.join('exhibitions', slug, 'assets', 'cover.jpg')}`);
    console.log(`  2. Edit ${path.join('exhibitions', slug, 'data.json')} with artworks, personas, critiques`);
    console.log(`  3. Edit ${path.join('exhibitions', slug, 'dialogues.json')} with dialogue messages`);
    console.log(`  4. Run: npm run validate-exhibition ${slug}`);
    console.log(`  5. Run: npm run generate-api`);

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the scaffolding tool
scaffoldExhibition();
