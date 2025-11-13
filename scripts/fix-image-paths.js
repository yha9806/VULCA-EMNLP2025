const fs = require('fs');

// Read data.json
const dataPath = 'exhibitions/negative-space-of-the-tide/data.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let fixedCount = 0;

// Fix artwork imageUrl paths
data.artworks.forEach(artwork => {
  if (artwork.imageUrl && !artwork.imageUrl.startsWith('/')) {
    artwork.imageUrl = '/' + artwork.imageUrl;
    fixedCount++;
  }

  // Fix images array paths
  if (artwork.images) {
    artwork.images.forEach(image => {
      if (image.url && !image.url.startsWith('/')) {
        image.url = '/' + image.url;
        fixedCount++;
      }
    });
  }
});

// Write back
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

console.log(`✓ Fixed ${fixedCount} image paths`);
console.log(`✓ All paths now start with /assets/`);
