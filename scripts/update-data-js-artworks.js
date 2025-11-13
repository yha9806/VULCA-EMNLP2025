/**
 * Update js/data.js with all 38 artworks
 * Preserves artwork-1's detailed definition, adds artwork-2 to artwork-38
 */

const fs = require('fs');
const path = require('path');

// Read extracted artworks
const extractedPath = path.join(__dirname, 'extracted-artworks.json');
const extractedArtworks = JSON.parse(fs.readFileSync(extractedPath, 'utf-8'));

console.log(`✓ Loaded ${extractedArtworks.length} artworks from ${extractedPath}`);

// Read current data.js
const dataJsPath = path.join(__dirname, '../js/data.js');
const dataJsContent = fs.readFileSync(dataJsPath, 'utf-8');

// Find the artworks array boundaries
const artworksStartMatch = dataJsContent.match(/artworks: \[/);
if (!artworksStartMatch) {
  console.error('❌ Could not find "artworks: [" in data.js');
  process.exit(1);
}

const artworksStartIndex = artworksStartMatch.index + artworksStartMatch[0].length;

// Find where artwork-1's definition ends (after the closing ] for images array)
// Look for the pattern: }  // end of artwork-1 followed by a comma or the array close
const artwork1Pattern = /\}\s*\],\s*\/\/.*?end.*?artwork-1.*?\n\s*\},/i;
const artwork1Match = dataJsContent.substring(artworksStartIndex).match(artwork1Pattern);

let artwork1Definition;
if (artwork1Match) {
  // Extract artwork-1's full definition
  artwork1Definition = dataJsContent.substring(artworksStartIndex, artworksStartIndex + artwork1Match.index + artwork1Match[0].length - 1);
  console.log('✓ Found artwork-1 detailed definition');
} else {
  // Fallback: find the first closing brace for artwork-1
  let braceCount = 0;
  let inString = false;
  let stringChar = null;
  let i = artworksStartIndex;

  while (i < dataJsContent.length) {
    const char = dataJsContent[i];
    const prevChar = i > 0 ? dataJsContent[i-1] : '';

    if ((char === '"' || char === "'") && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
        stringChar = null;
      }
    }

    if (!inString) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;

      if (braceCount === 0 && char === '}') {
        artwork1Definition = dataJsContent.substring(artworksStartIndex, i + 1);
        break;
      }
    }

    i++;
  }

  console.log('✓ Extracted artwork-1 definition (fallback method)');
}

// Generate JavaScript for artwork-2 to artwork-38 (simpler format)
const newArtworksJS = extractedArtworks.slice(1).map(artwork => {
  return `    {
      id: "${artwork.id}",
      titleZh: "${artwork.titleZh}",
      titleEn: "${artwork.titleEn}",
      year: ${artwork.year},
      imageUrl: "${artwork.imageUrl}",
      artist: "${artwork.artist}",
      context: "${artwork.context}"
    }`;
}).join(',\n');

// Build new artworks array
const newArtworksArray = `artworks: [\n${artwork1Definition},\n${newArtworksJS}\n  ]`;

// Find the closing ] of the original artworks array
const artworksEndPattern = /\]\s*,\s*\n\s*\/\/ ={5,} PERSONAS/;
const artworksEndMatch = dataJsContent.match(artworksEndPattern);

if (!artworksEndMatch) {
  console.error('❌ Could not find end of artworks array');
  process.exit(1);
}

// Replace the artworks array
const beforeArtworks = dataJsContent.substring(0, dataJsContent.indexOf('artworks: ['));
const afterArtworks = dataJsContent.substring(artworksEndMatch.index + 1); // Keep the ] and everything after

const newDataJs = beforeArtworks + newArtworksArray + afterArtworks;

// Backup original file
const backupPath = dataJsPath + '.backup';
fs.writeFileSync(backupPath, dataJsContent);
console.log(`✓ Backed up original to ${backupPath}`);

// Write new file
fs.writeFileSync(dataJsPath, newDataJs);
console.log(`✓ Updated ${dataJsPath}`);
console.log(`✓ Total artworks: ${extractedArtworks.length}`);
console.log(`✓ Artwork-1: Preserved detailed definition`);
console.log(`✓ Artwork-2 to Artwork-38: Added (${extractedArtworks.length - 1} artworks)`);
