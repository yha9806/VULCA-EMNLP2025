/**
 * Migrate images from congsheng-2025 to root assets directory
 * Task 1.8: Migrate Images to Root Assets
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read exhibition data to get artwork mappings
const exhibitionData = JSON.parse(fs.readFileSync('exhibitions/negative-space-of-the-tide/data.json', 'utf8'));
const structuredData = JSON.parse(fs.readFileSync('scripts/exhibition-artworks-structured.json', 'utf8'));

// Create mapping from slide number to artwork ID by matching titles
const slideToArtworkMap = {};

// Collect all artworks with their slide numbers
const allArtworks = [];
for (const [institution, works] of Object.entries(structuredData.institutions)) {
  works.forEach(work => {
    allArtworks.push({
      ...work,
      institution
    });
  });
}

// Build mapping by matching titles
allArtworks.forEach(work => {
  const artworkInExhibition = exhibitionData.artworks.find(a =>
    a.titleZh === work.title
  );

  if (artworkInExhibition) {
    slideToArtworkMap[work.slide_number] = artworkInExhibition.id;
    console.log(`Map: slide ${work.slide_number} → ${artworkInExhibition.id} (${work.title})`);
  }
});

console.log(`\nCreated ${Object.keys(slideToArtworkMap).length} mappings`);

const sourceBase = 'exhibitions/congsheng-2025/assets/artworks';
const targetBase = 'assets/artworks';

// Get all source directories
const sourceDirs = fs.readdirSync(sourceBase);

console.log(`\nFound ${sourceDirs.length} source directories`);
console.log('\nMigrating images...\n');

let migratedCount = 0;
let imageCount = 0;

sourceDirs.forEach(dir => {
  // Extract slide number from directory name (e.g., "artwork-05-张凯飞" => 5)
  const slideMatch = dir.match(/artwork-(\d+)-/);
  if (!slideMatch) {
    console.log(`⚠ Skipping ${dir}: cannot extract slide number`);
    return;
  }

  const slideNumber = parseInt(slideMatch[1]);
  const artworkId = slideToArtworkMap[slideNumber];

  if (!artworkId) {
    console.log(`⚠ Skipping ${dir}: no mapping for slide ${slideNumber}`);
    return;
  }

  const sourcePath = path.join(sourceBase, dir);
  const targetPath = path.join(targetBase, artworkId);

  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  // Copy all files from source to target
  const files = fs.readdirSync(sourcePath);

  files.forEach((file, fileIndex) => {
    const sourceFile = path.join(sourcePath, file);
    const ext = path.extname(file);
    const newFileName = `${(fileIndex + 1).toString().padStart(2, '0')}${ext}`;
    const targetFile = path.join(targetPath, newFileName);

    // Copy file
    fs.copyFileSync(sourceFile, targetFile);
    imageCount++;
  });

  console.log(`✓ ${dir} → ${artworkId}/ (${files.length} images)`);
  migratedCount++;
});

console.log(`\n✓ Migration complete!`);
console.log(`✓ Migrated ${migratedCount} artwork directories`);
console.log(`✓ Total images copied: ${imageCount}`);

// Verify all artworks have directories
console.log('\nVerifying artwork directories...');
let missingCount = 0;

exhibitionData.artworks.forEach(artwork => {
  const artworkPath = path.join(targetBase, artwork.id);
  if (!fs.existsSync(artworkPath)) {
    console.log(`⚠ Missing directory: ${artwork.id} (${artwork.titleZh})`);
    missingCount++;
  }
});

if (missingCount === 0) {
  console.log('✓ All artwork directories created');
} else {
  console.log(`⚠ ${missingCount} artwork directories missing`);
}

console.log('\n✓ Task 1.8 complete!');
