/**
 * Fix image extensions in data.json to match actual files
 */

const fs = require('fs');
const path = require('path');

const exhibitionData = JSON.parse(fs.readFileSync('exhibitions/negative-space-of-the-tide/data.json', 'utf8'));

console.log('Fixing image extensions...\n');

let fixedCount = 0;

exhibitionData.artworks.forEach(artwork => {
  // Check and fix imageUrl
  let imageUrlPath = path.join('.', artwork.imageUrl);
  if (!fs.existsSync(imageUrlPath)) {
    // Try other extensions
    const dir = path.dirname(imageUrlPath);
    const basename = path.basename(imageUrlPath, path.extname(imageUrlPath));
    const alternatives = ['.png', '.jpg', '.jpeg', '.PNG', '.JPG'];

    for (const ext of alternatives) {
      const altPath = path.join(dir, basename + ext);
      if (fs.existsSync(altPath)) {
        const oldUrl = artwork.imageUrl;
        artwork.imageUrl = altPath.replace(/\\/g, '/').replace(/^\.\//, '/');
        console.log(`  Fixed imageUrl: ${oldUrl} → ${artwork.imageUrl}`);
        fixedCount++;
        break;
      }
    }
  }

  // Check and fix images array
  artwork.images.forEach(img => {
    let imgPath = path.join('.', img.url);
    if (!fs.existsSync(imgPath)) {
      const dir = path.dirname(imgPath);
      const basename = path.basename(imgPath, path.extname(imgPath));
      const alternatives = ['.png', '.jpg', '.jpeg', '.PNG', '.JPG'];

      for (const ext of alternatives) {
        const altPath = path.join(dir, basename + ext);
        if (fs.existsSync(altPath)) {
          const oldUrl = img.url;
          img.url = altPath.replace(/\\/g, '/').replace(/^\.\//, '/');
          console.log(`  Fixed ${img.id}: ${oldUrl} → ${img.url}`);
          fixedCount++;
          break;
        }
      }
    }
  });
});

// Save updated data
fs.writeFileSync(
  'exhibitions/negative-space-of-the-tide/data.json',
  JSON.stringify(exhibitionData, null, 2),
  'utf8'
);

console.log(`\n✓ Fixed ${fixedCount} image paths`);
console.log('✓ Data saved');

// Run validation again
console.log('\nRunning validation...');
execSync = require('child_process').execSync;
execSync('node scripts/validate-image-paths.js', { stdio: 'inherit' });
