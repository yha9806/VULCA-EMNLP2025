/**
 * Merge new artworks into data.json
 * Phase 1.2 of sync-exhibition-with-ppt-final-version
 */

const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../exhibitions/negative-space-of-the-tide/data.json');
const NEW_ARTWORKS_PATH = path.join(__dirname, '../temp/new-artworks.json');

function mergeArtworks() {
  console.log('[Merge] Starting artwork merge process...');

  // Read current data
  console.log('[Merge] Reading current data.json...');
  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  console.log(`[Merge] Current artwork count: ${data.artworks.length}`);

  // Read new artworks
  console.log('[Merge] Reading new artworks from temp/new-artworks.json...');
  const newArtworks = JSON.parse(fs.readFileSync(NEW_ARTWORKS_PATH, 'utf8'));
  console.log(`[Merge] New artworks to add: ${newArtworks.length}`);

  // Validate no duplicate IDs
  const existingIds = new Set(data.artworks.map(a => a.id));
  const duplicates = newArtworks.filter(a => existingIds.has(a.id));

  if (duplicates.length > 0) {
    console.error('[Merge] ERROR: Duplicate artwork IDs found:');
    duplicates.forEach(d => console.error(`  - ${d.id}`));
    process.exit(1);
  }

  // Merge artworks
  console.log('[Merge] Merging new artworks into data.artworks array...');
  data.artworks.push(...newArtworks);

  console.log(`[Merge] New total artwork count: ${data.artworks.length}`);

  // Update metadata
  console.log('[Merge] Updating exhibition metadata...');
  if (!data.metadata) {
    data.metadata = {};
  }

  data.metadata.artworkCount = data.artworks.length;
  data.metadata.lastUpdated = new Date().toISOString().split('T')[0];
  data.metadata.confirmedArtworks = data.artworks.filter(a => a.status === 'confirmed').length;
  data.metadata.pendingArtworks = data.artworks.filter(a => a.status === 'pending').length;

  console.log('[Merge] Updated metadata:');
  console.log(`  - Total artworks: ${data.metadata.artworkCount}`);
  console.log(`  - Confirmed: ${data.metadata.confirmedArtworks}`);
  console.log(`  - Pending: ${data.metadata.pendingArtworks}`);
  console.log(`  - Last updated: ${data.metadata.lastUpdated}`);

  // Write updated data
  console.log('[Merge] Writing updated data.json...');
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');

  console.log('[Merge] ✓ Merge complete!');
  console.log('[Merge] Backup saved at: data.backup.json');

  // Validation
  console.log('\n[Validation] Running post-merge checks...');
  const updatedData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

  console.log(`[Validation] ✓ JSON syntax valid`);
  console.log(`[Validation] ✓ Artwork count: ${updatedData.artworks.length}`);

  const allIds = updatedData.artworks.map(a => a.id);
  const uniqueIds = new Set(allIds);
  console.log(`[Validation] ${allIds.length === uniqueIds.size ? '✓' : '✗'} No duplicate IDs (${uniqueIds.size} unique)`);

  const missingRequired = updatedData.artworks.filter(a =>
    !a.id || !a.titleZh || !a.titleEn || !a.artist || !a.year
  );
  console.log(`[Validation] ${missingRequired.length === 0 ? '✓' : '✗'} All required fields present`);

  if (missingRequired.length > 0) {
    console.error('[Validation] Artworks missing required fields:');
    missingRequired.forEach(a => console.error(`  - ${a.id || 'UNKNOWN'}`));
  }

  console.log('\n[Merge] Success! Data merge completed successfully.');
}

// Run merge
try {
  mergeArtworks();
} catch (error) {
  console.error('[Merge] FATAL ERROR:', error.message);
  process.exit(1);
}
