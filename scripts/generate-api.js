#!/usr/bin/env node

/**
 * API Generation Script
 *
 * Generates /api/exhibitions.json by reading all exhibition config files.
 * This API endpoint is consumed by the portfolio homepage to display exhibition cards.
 *
 * Usage:
 *   npm run generate-api
 */

const fs = require('fs');
const path = require('path');

console.log('\n📊 Generating API: /api/exhibitions.json\n');

// Paths
const exhibitionsDir = path.join(process.cwd(), 'exhibitions');
const apiDir = path.join(process.cwd(), 'api');
const apiPath = path.join(apiDir, 'exhibitions.json');

// Ensure API directory exists
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
  console.log(`✓ Created ${apiDir}`);
}

// Read all exhibition directories
let exhibitionDirs = [];
try {
  exhibitionDirs = fs.readdirSync(exhibitionsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
} catch (error) {
  console.error(`❌ Failed to read exhibitions directory: ${error.message}`);
  process.exit(1);
}

console.log(`Found ${exhibitionDirs.length} exhibition director(ies):`);
exhibitionDirs.forEach(dir => console.log(`  - ${dir}`));

// Read config.json from each exhibition
const exhibitions = [];
let errorCount = 0;

exhibitionDirs.forEach(exhibitionId => {
  const configPath = path.join(exhibitionsDir, exhibitionId, 'config.json');

  if (!fs.existsSync(configPath)) {
    console.warn(`⚠️  Skipping ${exhibitionId}: config.json not found`);
    return;
  }

  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    // Build exhibition metadata for API
    const exhibition = {
      id: config.id,
      slug: config.slug,
      titleZh: config.titleZh,
      titleEn: config.titleEn,
      year: config.year,
      status: config.status,
      coverImage: `/exhibitions/${exhibitionId}/${config.assets.cover.replace('./', '')}`,
      url: `/exhibitions/${exhibitionId}/`,
      stats: config.stats
    };

    // Optional fields
    if (config.descriptionZh) {
      exhibition.descriptionZh = config.descriptionZh;
    }
    if (config.descriptionEn) {
      exhibition.descriptionEn = config.descriptionEn;
    }

    exhibitions.push(exhibition);
    console.log(`  ✓ ${exhibitionId}: "${config.titleZh}"`);
  } catch (error) {
    console.error(`  ✗ ${exhibitionId}: ${error.message}`);
    errorCount++;
  }
});

// Sort exhibitions by year (descending), then by status
exhibitions.sort((a, b) => {
  // Status priority: live > upcoming > archived
  const statusPriority = { live: 3, upcoming: 2, archived: 1 };
  const statusDiff = (statusPriority[b.status] || 0) - (statusPriority[a.status] || 0);
  if (statusDiff !== 0) return statusDiff;

  // Then by year (descending)
  return b.year - a.year;
});

// Build API response
const api = {
  exhibitions: exhibitions,
  total: exhibitions.length,
  updated: new Date().toISOString()
};

// Write API file
try {
  fs.writeFileSync(apiPath, JSON.stringify(api, null, 2), 'utf8');
  const fileSize = Math.round(fs.statSync(apiPath).size / 1024);
  console.log(`\n✓ Wrote ${apiPath} (${fileSize}KB)`);
} catch (error) {
  console.error(`\n❌ Failed to write API file: ${error.message}`);
  process.exit(1);
}

// Summary
console.log('\n' + '='.repeat(60));
console.log(`✅ API generation complete!\n`);
console.log(`Total exhibitions: ${exhibitions.length}`);
console.log(`Errors: ${errorCount}\n`);

if (errorCount > 0) {
  console.log('⚠️  Some exhibitions had errors. Please fix and re-run.\n');
  process.exit(1);
}

console.log(`API available at: /api/exhibitions.json\n`);
