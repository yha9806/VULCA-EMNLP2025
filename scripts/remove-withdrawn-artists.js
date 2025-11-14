/**
 * Remove withdrawn artists from data.json
 * Phase 1.3 of sync-exhibition-with-ppt-final-version
 *
 * According to PPT comparison analysis:
 * - 李鹏飞 (Li Pengfei) - 鲁迅美术学院
 * - 陈筱薇 (Chen Xiaowei) - 中央美术学院
 * - 龍暐翔 (Long Weixiang) - 台湾艺术大学
 */

const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../exhibitions/negative-space-of-the-tide/data.json');

// List of withdrawn artists (from PPT_COMPARISON_FINAL_REPORT.md)
const WITHDRAWN_ARTISTS = ['李鹏飞', '陈筱薇', '龍暐翔'];

function removeWithdrawnArtists() {
  console.log('[Remove] Starting withdrawn artist removal process...');
  console.log('[Remove] Withdrawn artists:', WITHDRAWN_ARTISTS.join(', '));

  // Read current data
  console.log('\n[Remove] Reading current data.json...');
  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const originalCount = data.artworks.length;
  console.log(`[Remove] Current artwork count: ${originalCount}`);

  // Find artworks by withdrawn artists
  const toRemove = data.artworks.filter(artwork =>
    WITHDRAWN_ARTISTS.some(withdrawnName => artwork.artist.includes(withdrawnName))
  );

  console.log(`\n[Remove] Found ${toRemove.length} artworks to remove:`);
  toRemove.forEach(a => {
    console.log(`  - ${a.id}: "${a.titleZh}" by ${a.artist}`);
  });

  if (toRemove.length === 0) {
    console.log('[Remove] No withdrawn artists found. Nothing to remove.');
    return;
  }

  // Remove withdrawn artworks
  const removedIds = new Set(toRemove.map(a => a.id));
  data.artworks = data.artworks.filter(a => !removedIds.has(a.id));

  console.log(`\n[Remove] New artwork count: ${data.artworks.length}`);
  console.log(`[Remove] Removed: ${originalCount - data.artworks.length} artworks`);

  // Update metadata
  console.log('\n[Remove] Updating metadata...');
  data.metadata.artworkCount = data.artworks.length;
  data.metadata.confirmedArtworks = data.artworks.filter(a => a.status === 'confirmed' || !a.status).length;
  data.metadata.pendingArtworks = data.artworks.filter(a => a.status === 'pending').length;
  data.metadata.lastUpdated = new Date().toISOString().split('T')[0];

  console.log('[Remove] Updated metadata:');
  console.log(`  - Total artworks: ${data.metadata.artworkCount}`);
  console.log(`  - Confirmed: ${data.metadata.confirmedArtworks}`);
  console.log(`  - Pending: ${data.metadata.pendingArtworks}`);

  // Write updated data
  console.log('\n[Remove] Writing updated data.json...');
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');

  console.log('[Remove] ✓ Removal complete!');

  // Validation
  console.log('\n[Validation] Running post-removal checks...');
  const updatedData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

  console.log(`[Validation] ✓ JSON syntax valid`);
  console.log(`[Validation] ✓ Artwork count: ${updatedData.artworks.length}`);

  // Verify no withdrawn artists remain
  const remaining = updatedData.artworks.filter(a =>
    WITHDRAWN_ARTISTS.some(w => a.artist.includes(w))
  );

  if (remaining.length === 0) {
    console.log(`[Validation] ✓ All withdrawn artists removed`);
  } else {
    console.error(`[Validation] ✗ Still found ${remaining.length} withdrawn artists!`);
    remaining.forEach(a => console.error(`  - ${a.id}: ${a.artist}`));
    process.exit(1);
  }

  console.log('\n[Remove] Success! Withdrawn artists removed successfully.');
  console.log('[Remove] Summary:');
  console.log(`  - Removed IDs: ${Array.from(removedIds).join(', ')}`);
  console.log(`  - Final count: ${updatedData.artworks.length} artworks`);
}

// Run removal
try {
  removeWithdrawnArtists();
} catch (error) {
  console.error('[Remove] FATAL ERROR:', error.message);
  process.exit(1);
}
