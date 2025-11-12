/**
 * Fix image paths for artworks 1-5 (migrated from congsheng-2025)
 * These still reference old directory names like "artwork-84-于浩睿"
 * Task 1.9: Validate Image Paths - Final Fix
 */

const fs = require('fs');
const path = require('path');

// Read exhibition data
const exhibitionData = JSON.parse(fs.readFileSync('exhibitions/negative-space-of-the-tide/data.json', 'utf8'));

console.log('Fixing migrated artwork paths (artwork-1 through artwork-5)...\n');

// Old directory name mapping
const oldDirMapping = {
  'artwork-1': 'artwork-84-于浩睿',
  'artwork-2': 'artwork-80-王歆童黄恩琦',
  'artwork-3': 'artwork-82-电子果酱',
  'artwork-4': 'artwork-65-李國嘉',
  'artwork-5': 'artwork-60-程佳瑜'
};

let fixedCount = 0;

// Fix artworks 1-5
exhibitionData.artworks.slice(0, 5).forEach(artwork => {
  const oldDirName = oldDirMapping[artwork.id];
  const newDirName = artwork.id;

  console.log(`\n${artwork.id}: ${artwork.titleZh}`);
  console.log(`  Old dir: ${oldDirName}`);
  console.log(`  New dir: ${newDirName}`);

  // Fix imageUrl
  if (artwork.imageUrl && artwork.imageUrl.includes(oldDirName)) {
    const oldUrl = artwork.imageUrl;
    artwork.imageUrl = artwork.imageUrl.replace(
      `/assets/artworks/${oldDirName}/`,
      `/assets/artworks/${newDirName}/`
    );
    console.log(`  ✓ Fixed imageUrl: ${oldUrl} → ${artwork.imageUrl}`);
    fixedCount++;
  }

  // Fix images array
  artwork.images.forEach(img => {
    if (img.url.includes(oldDirName)) {
      const oldUrl = img.url;
      img.url = img.url.replace(
        `/assets/artworks/${oldDirName}/`,
        `/assets/artworks/${newDirName}/`
      );
      console.log(`  ✓ Fixed ${img.id}: ${oldUrl} → ${img.url}`);
      fixedCount++;
    }
  });
});

// Also check for any extension mismatches in these artworks
console.log('\n\nChecking for extension mismatches...\n');

exhibitionData.artworks.slice(0, 5).forEach(artwork => {
  // Check imageUrl
  let imageUrlPath = path.join('.', artwork.imageUrl);
  if (!fs.existsSync(imageUrlPath)) {
    const dir = path.dirname(imageUrlPath);
    const basename = path.basename(imageUrlPath, path.extname(imageUrlPath));
    const alternatives = ['.png', '.jpg', '.jpeg', '.PNG', '.JPG'];

    for (const ext of alternatives) {
      const altPath = path.join(dir, basename + ext);
      if (fs.existsSync(altPath)) {
        const oldUrl = artwork.imageUrl;
        artwork.imageUrl = altPath.replace(/\\/g, '/').replace(/^\.\//, '/');
        console.log(`  Fixed imageUrl extension: ${oldUrl} → ${artwork.imageUrl}`);
        fixedCount++;
        break;
      }
    }
  }

  // Check images array
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
          console.log(`  Fixed ${img.id} extension: ${oldUrl} → ${img.url}`);
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

console.log(`\n\n✓ Fixed ${fixedCount} image paths`);
console.log('✓ Data saved');

// Run validation again
console.log('\nRunning validation...');
const { execSync } = require('child_process');
execSync('node scripts/validate-image-paths.js', { stdio: 'inherit' });
