/**
 * Add remaining 33 artworks (artwork-6 through artwork-38)
 * Tasks 1.4-1.7
 */

const fs = require('fs');
const path = require('path');

// Read structured data and current exhibition data
const structuredData = JSON.parse(fs.readFileSync('scripts/exhibition-artworks-structured.json', 'utf8'));
const exhibitionData = JSON.parse(fs.readFileSync('exhibitions/negative-space-of-the-tide/data.json', 'utf8'));

// Already added artworks (slides 60, 65, 80, 82, 84)
const alreadyAdded = [60, 65, 80, 82, 84];

// Collect all artworks from structured data
const allArtworks = [];
for (const [institution, works] of Object.entries(structuredData.institutions)) {
  works.forEach(work => {
    if (!alreadyAdded.includes(work.slide_number)) {
      allArtworks.push({
        ...work,
        institution
      });
    }
  });
}

// Sort by slide number
allArtworks.sort((a, b) => a.slide_number - b.slide_number);

console.log(`Found ${allArtworks.length} artworks to add`);
console.log(`Current artworks in exhibition: ${exhibitionData.artworks.length}`);

// English context templates by category
const contextTemplates = {
  'installation': (title, artist) => `An installation artwork exploring ${title.toLowerCase()}. Created by ${artist}, this work engages with themes of space, perception, and contemporary artistic practice.`,
  'new_media': (title, artist) => `A new media artwork by ${artist} that investigates ${title.toLowerCase()}. The work employs digital technologies to create immersive experiences and challenge traditional artistic boundaries.`,
  'video': (title, artist) => `A video installation by ${artist} examining ${title.toLowerCase()}. Through moving images and sound, this work explores contemporary social and cultural themes.`,
  'painting': (title, artist) => `A painting by ${artist} titled ${title}. This work demonstrates technical mastery while exploring themes of memory, identity, and visual representation.`,
  'mixed_media': (title, artist) => `A mixed media work by ${artist}. Combining traditional and contemporary techniques, this piece explores ${title.toLowerCase()} through layered materials and processes.`,
  'performance': (title, artist) => `Performance documentation by ${artist}. The work ${title} engages with themes of body, space, and social interaction through live artistic practice.`,
  'interactive': (title, artist) => `An interactive artwork by ${artist}. Through audience participation and technological interfaces, this work explores ${title.toLowerCase()} and the relationship between viewer and artwork.`,
  'default': (title, artist) => `Contemporary artwork by ${artist} titled ${title}. This work engages with current artistic discourse through innovative materials and conceptual frameworks.`
};

// Generate English context based on Chinese title
function generateContext(artwork) {
  const artist = artwork.artists[0];
  const title = artwork.title;

  // Detect category based on title keywords
  if (title.includes('装置') || title.includes('博物馆') || title.includes('计划')) {
    return contextTemplates.installation(title, artist);
  } else if (title.includes('影像') || title.includes('视频')) {
    return contextTemplates.video(title, artist);
  } else if (title.includes('互动') || title.includes('游戏') || title.includes('对话')) {
    return contextTemplates.interactive(title, artist);
  } else if (title.includes('绘画') || title.includes('墨') || title.includes('水彩')) {
    return contextTemplates.painting(title, artist);
  } else if (title.includes('数字') || title.includes('算法') || title.includes('AI') || title.includes('生成')) {
    return contextTemplates.new_media(title, artist);
  } else if (title.includes('混合') || title.includes('拼贴')) {
    return contextTemplates.mixed_media(title, artist);
  } else {
    return contextTemplates.default(title, artist);
  }
}

// Create artwork objects
const newArtworks = allArtworks.map((work, index) => {
  const artworkNumber = exhibitionData.artworks.length + index + 1;
  const artworkId = `artwork-${artworkNumber}`;

  const slideNum = work.slide_number;
  const artistName = work.artists[0];

  // Generate image array
  const images = [];
  for (let i = 1; i <= work.image_count; i++) {
    const imgNum = i.toString().padStart(2, '0');
    images.push({
      id: `img-${artworkNumber}-${i}`,
      url: `/assets/artworks/${artworkId}/${imgNum}.jpg`,
      sequence: i,
      titleZh: `作品图片 ${i}`,
      titleEn: `Artwork Image ${i}`
    });
  }

  return {
    id: artworkId,
    titleZh: work.title,
    titleEn: work.title, // Placeholder - needs translation
    year: 2024, // Default year
    artist: artistName,
    imageUrl: `/assets/artworks/${artworkId}/01.jpg`,
    primaryImageId: `img-${artworkNumber}-1`,
    context: generateContext(work),
    images: images
  };
});

console.log(`\nGenerated ${newArtworks.length} artwork objects\n`);

// Show first 3 examples
console.log('Example artworks:');
newArtworks.slice(0, 3).forEach((artwork, i) => {
  console.log(`\n${i + 1}. ${artwork.id}: ${artwork.titleZh}`);
  console.log(`   Artist: ${artwork.artist}`);
  console.log(`   Images: ${artwork.images.length}`);
  console.log(`   Context: ${artwork.context.substring(0, 80)}...`);
});

// Add to exhibition data
exhibitionData.artworks = [...exhibitionData.artworks, ...newArtworks];

// Save updated data
fs.writeFileSync(
  'exhibitions/negative-space-of-the-tide/data.json',
  JSON.stringify(exhibitionData, null, 2),
  'utf8'
);

console.log(`\n✓ Added ${newArtworks.length} artworks`);
console.log(`✓ Total artworks: ${exhibitionData.artworks.length}`);
console.log(`\nValidation:`);
console.log(`  Expected total: 38`);
console.log(`  Actual total: ${exhibitionData.artworks.length}`);
console.log(`  Match: ${exhibitionData.artworks.length === 38 ? '✓' : '✗'}`);

// Save a summary file for manual review
const summary = {
  added: newArtworks.length,
  total: exhibitionData.artworks.length,
  artworks: newArtworks.map(a => ({
    id: a.id,
    titleZh: a.titleZh,
    artist: a.artist,
    images: a.images.length
  }))
};

fs.writeFileSync(
  'scripts/added-artworks-summary.json',
  JSON.stringify(summary, null, 2),
  'utf8'
);

console.log(`\n✓ Summary saved to scripts/added-artworks-summary.json`);
console.log('\n⚠ Note: English titles (titleEn) need manual translation');
console.log('⚠ Note: Context descriptions are auto-generated templates');
console.log('⚠ Note: Review and refine as needed');
