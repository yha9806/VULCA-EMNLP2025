/**
 * Batch add multi-image support to remaining artworks (5-38)
 * Maps PPT slides to data.js artworks and generates images arrays
 */

const fs = require('fs');
const path = require('path');

// Read files
const pptMappingPath = path.join(__dirname, 'ppt-artwork-mapping.json');
const pptMapping = JSON.parse(fs.readFileSync(pptMappingPath, 'utf8'));

const dataPath = path.join(__dirname, '..', 'js', 'data.js');
const dataContent = fs.readFileSync(dataPath, 'utf8');

console.log(`\n🔍 Building PPT → data.js artwork mapping...\n`);

// Extract artwork titles from data.js
const artworkTitleRegex = /id:\s*"(artwork-\d+)",[\s\S]*?titleZh:\s*"([^"]+)"/g;
const dataArtworks = [];
let match;

while ((match = artworkTitleRegex.exec(dataContent)) !== null) {
  dataArtworks.push({
    id: match[1],
    titleZh: match[2]
  });
}

console.log(`Found ${dataArtworks.length} artworks in data.js`);
console.log(`Found ${pptMapping.length} artworks in PPT\n`);

// Build mapping by comparing titles
const mapping = [];

dataArtworks.forEach((artwork, index) => {
  if (index < 4) {
    console.log(`${artwork.id}: ✅ Already has multi-image support`);
    return;
  }

  // Find matching PPT artwork by title similarity
  const pptMatch = pptMapping.find(pptArt => {
    const pptTitle = pptArt.title;
    const dataTitle = artwork.titleZh;

    // Extract title from 《》
    const pptTitleMatch = pptTitle.match(/《(.+)》/);
    const pptCleanTitle = pptTitleMatch ? pptTitleMatch[1] : pptTitle;

    // Check if titles match
    return dataTitle.includes(pptCleanTitle) || pptCleanTitle.includes(dataTitle);
  });

  if (pptMatch) {
    mapping.push({
      artworkId: artwork.id,
      titleZh: artwork.titleZh,
      pptTitle: pptMatch.title,
      slides: pptMatch.slides,
      imageCount: pptMatch.totalImages
    });
    console.log(`${artwork.id}: ✅ Matched → "${pptMatch.title}" (${pptMatch.totalImages} images, slides ${pptMatch.slides.map(s => s.slideNumber).join(', ')})`);
  } else {
    console.log(`${artwork.id}: ❌ No match found for "${artwork.titleZh}"`);
  }
});

console.log(`\n📊 Mapping summary:`);
console.log(`───────────────────────────────────────────────────────────────`);
console.log(`Total artworks to process: ${dataArtworks.length - 4}`);
console.log(`Successfully matched: ${mapping.length}`);
console.log(`Failed to match: ${dataArtworks.length - 4 - mapping.length}\n`);

// Generate image arrays for each matched artwork
console.log(`\n🎨 Generating image arrays...\n`);

const IMAGE_CATEGORIES = {
  SKETCH: 'sketch',
  PROCESS: 'process',
  INSTALLATION: 'installation',
  DETAIL: 'detail',
  FINAL: 'final',
  CONTEXT: 'context'
};

const updates = mapping.map((item, index) => {
  const artworkNum = parseInt(item.artworkId.split('-')[1]);
  const imageCount = item.imageCount;

  // Determine category distribution
  let categories = [];
  if (imageCount === 1) {
    categories = [IMAGE_CATEGORIES.FINAL];
  } else if (imageCount === 2) {
    categories = [IMAGE_CATEGORIES.INSTALLATION, IMAGE_CATEGORIES.FINAL];
  } else if (imageCount === 3) {
    categories = [IMAGE_CATEGORIES.INSTALLATION, IMAGE_CATEGORIES.DETAIL, IMAGE_CATEGORIES.FINAL];
  } else if (imageCount === 4) {
    categories = [IMAGE_CATEGORIES.INSTALLATION, IMAGE_CATEGORIES.PROCESS, IMAGE_CATEGORIES.DETAIL, IMAGE_CATEGORIES.FINAL];
  } else if (imageCount === 5) {
    categories = [IMAGE_CATEGORIES.INSTALLATION, IMAGE_CATEGORIES.PROCESS, IMAGE_CATEGORIES.DETAIL, IMAGE_CATEGORIES.CONTEXT, IMAGE_CATEGORIES.FINAL];
  } else {
    // More than 5: Use repeating pattern
    const pattern = [IMAGE_CATEGORIES.INSTALLATION, IMAGE_CATEGORIES.PROCESS, IMAGE_CATEGORIES.DETAIL, IMAGE_CATEGORIES.CONTEXT, IMAGE_CATEGORIES.FINAL];
    categories = Array(imageCount).fill(0).map((_, i) => pattern[i % pattern.length]);
  }

  // Generate images array
  const images = Array(imageCount).fill(0).map((_, i) => {
    const imgNum = String(i + 1).padStart(2, '0');
    return {
      id: `img-${artworkNum}-${i + 1}`,
      url: `/assets/artworks/artwork-${artworkNum}/${imgNum}.jpg`,
      category: categories[i],
      sequence: i + 1,
      titleZh: `${item.titleZh} - 图片 ${i + 1}`,
      titleEn: `${item.titleZh} - Image ${i + 1}`,
      caption: `Image ${i + 1} from the artwork "${item.titleZh}". This ${categories[i]} view shows... [TO BE CUSTOMIZED]`,
      metadata: {
        year: 2024,
        dimensions: "TBD",
        medium: "TBD"
      }
    };
  });

  console.log(`[${index + 1}/${mapping.length}] ${item.artworkId}: Generated ${imageCount} image(s)`);

  return {
    artworkId: item.artworkId,
    titleZh: item.titleZh,
    imageCount,
    images
  };
});

// Save updates to JSON file
const outputPath = path.join(__dirname, 'multi-image-updates.json');
fs.writeFileSync(outputPath, JSON.stringify(updates, null, 2), 'utf8');

console.log(`\n✅ Generated image arrays for ${updates.length} artworks`);
console.log(`📁 Saved to: ${outputPath}\n`);

// Print next steps
console.log(`\n📋 Next Steps:`);
console.log(`───────────────────────────────────────────────────────────────`);
console.log(`1. Review multi-image-updates.json`);
console.log(`2. Customize captions for each image (currently placeholders)`);
console.log(`3. Apply updates to js/data.js manually or with a script`);
console.log(`4. Copy image files to /assets/artworks/artwork-X/ directories`);
console.log(`5. Test carousel display for each artwork\n`);
