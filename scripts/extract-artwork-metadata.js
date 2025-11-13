/**
 * Extract artwork metadata from dialogue files
 * Generates artwork objects for js/data.js
 */

const fs = require('fs');
const path = require('path');

const dialoguesDir = path.join(__dirname, '../js/data/dialogues');
const artworks = [];

// Read all dialogue files
for (let i = 1; i <= 38; i++) {
  const filename = `artwork-${i}.js`;
  const filepath = path.join(dialoguesDir, filename);

  if (!fs.existsSync(filepath)) {
    console.warn(`⚠ File not found: ${filename}`);
    continue;
  }

  const content = fs.readFileSync(filepath, 'utf-8');

  // Extract artwork info from comment header
  // Format: * Artwork: "Title" by Artist (Artist English Name)
  const titleMatch = content.match(/\* Artwork: "([^"]+)" by (.+)/);

  if (!titleMatch) {
    console.warn(`⚠ Could not extract metadata from ${filename}`);
    continue;
  }

  const title = titleMatch[1];
  const artistPart = titleMatch[2].trim();

  // Parse artist and year (format: "Artist Name (Year)")
  let artist, year;
  const artistYearMatch = artistPart.match(/^(.+?)\s+\((\d{4})\)$/);
  if (artistYearMatch) {
    artist = artistYearMatch[1].trim();
    year = parseInt(artistYearMatch[2]);
  } else {
    artist = artistPart;
    year = 2023; // Default year
  }

  // Parse title - keep as is for both Zh and En
  // (Titles are already in the correct language in dialogue files)
  const titleZh = title;
  const titleEn = title;

  const artwork = {
    id: `artwork-${i}`,
    titleZh,
    titleEn,
    artist,
    year,
    imageUrl: `/assets/artworks/artwork-${i}/main.jpg`,
    context: `Artwork ${i} by ${artist}. More details to be added.`
  };

  artworks.push(artwork);
  console.log(`✓ Extracted: artwork-${i} - ${titleZh} by ${artist} (${year})`);
}

console.log(`\n✓ Total artworks extracted: ${artworks.length}`);

// Output as JavaScript array
console.log('\n// Copy this to js/data.js artworks array:\n');
console.log('const artworks = ' + JSON.stringify(artworks, null, 2) + ';');

// Also save to a file
const outputPath = path.join(__dirname, 'extracted-artworks.json');
fs.writeFileSync(outputPath, JSON.stringify(artworks, null, 2));
console.log(`\n✓ Saved to: ${outputPath}`);
