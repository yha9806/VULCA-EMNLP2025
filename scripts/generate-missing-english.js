/**
 * Generate Missing English Translations
 *
 * This script translates Chinese critiques to English using Claude API,
 * maintaining each critic's voice and philosophical depth.
 *
 * Usage:
 *   node scripts/generate-missing-english.js           # Run translation
 *   node scripts/generate-missing-english.js --dry-run # Check count only
 *
 * Requirements:
 *   - ANTHROPIC_API_KEY environment variable must be set
 *   - @anthropic-ai/sdk npm package (install: npm install @anthropic-ai/sdk)
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');

// File paths
const DATA_JSON_PATH = path.join(__dirname, '../exhibitions/negative-space-of-the-tide/data.json');
const BACKUP_PATH = path.join(__dirname, '../exhibitions/negative-space-of-the-tide/data.json.backup-translations');

// Check if Anthropic SDK is available
let Anthropic;
try {
  Anthropic = require('@anthropic-ai/sdk');
} catch (error) {
  console.error('❌ Error: @anthropic-ai/sdk is not installed.');
  console.error('   Please install it: npm install @anthropic-ai/sdk');
  process.exit(1);
}

// Check API key
if (!process.env.ANTHROPIC_API_KEY && !isDryRun) {
  console.error('❌ Error: ANTHROPIC_API_KEY environment variable is not set.');
  console.error('   Please set it before running this script.');
  console.error('   Example: export ANTHROPIC_API_KEY="your-api-key-here"');
  process.exit(1);
}

// Initialize Anthropic client
const anthropic = !isDryRun ? new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
}) : null;

/**
 * Translate a single critique from Chinese to English
 * @param {Object} critique - Critique object with artworkId, personaId, textZh, rpait
 * @param {Object} persona - Persona object with critic information
 * @param {Object} artwork - Artwork object with title and artist
 * @returns {Promise<string>} English translation
 */
async function translateCritique(critique, persona, artwork) {
  const prompt = `Translate the following Chinese art critique into English.

Context:
- Critic: ${persona.nameEn} (${persona.nameZh})
- Period: ${persona.period}
- Artwork: ${artwork.titleEn} by ${artwork.artist}

Critical voice characteristics:
${persona.nameEn === 'Su Shi' ? '- Philosophical, integrates Daoist and Buddhist concepts\n- Poetic language, references classical literature\n- Emphasizes spiritual likeness over physical form' : ''}
${persona.nameEn === 'Guo Xi' ? '- Technical, systematic analysis of composition\n- References landscape painting theory\n- Focus on spatial construction and atmosphere' : ''}
${persona.nameEn === 'John Ruskin' ? '- Moral and ethical perspective on art\n- Concerned with truth to nature and craftsmanship\n- Victorian sensibility, Gothic aesthetics' : ''}
${persona.nameEn === 'Mama Zola' ? '- Community-centered, Ubuntu philosophy\n- Oral tradition storytelling style\n- Connects art to collective memory and identity' : ''}
${persona.nameEn === 'Professor Petrova' ? '- Formalist analysis, systematic\n- References Russian formalism theory\n- Focus on devices, structure, and defamiliarization' : ''}
${persona.nameEn === 'AI Ethics Reviewer' ? '- Systems thinking, power analysis\n- Concerned with algorithmic justice and fairness\n- Technical and policy-oriented language' : ''}

Chinese critique:
${critique.textZh}

Requirements:
1. Maintain the critic's voice and philosophical depth
2. Preserve specialized art terminology (e.g., 气韵 → spirit resonance, 意境 → artistic conception)
3. Keep the same structure and paragraph breaks
4. Aim for 1000-1500 English characters
5. Use academic but accessible language
6. Do NOT translate proper nouns (artist names, artwork titles if already in English)

English translation:`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    });

    return message.content[0].text;
  } catch (error) {
    console.error(`\n❌ Translation failed for ${critique.artworkId}/${critique.personaId}:`);
    console.error(`   Error: ${error.message}`);

    // Handle rate limiting
    if (error.status === 429) {
      console.log('   ⏳ Rate limited. Waiting 60 seconds before retry...');
      await sleep(60000);
      return await translateCritique(critique, persona, artwork); // Retry
    }

    throw error;
  }
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Save data.json with progress
 */
function saveProgress(data, message = 'Progress saved') {
  fs.writeFileSync(DATA_JSON_PATH, JSON.stringify(data, null, 2), 'utf8');
  console.log(`   💾 ${message}`);
}

/**
 * Main function: Generate all missing English translations
 */
async function generateAllMissingEnglish() {
  console.log('🚀 Starting English translation generation...\n');

  // Load data.json
  let data;
  try {
    const dataContent = fs.readFileSync(DATA_JSON_PATH, 'utf8');
    data = JSON.parse(dataContent);
  } catch (error) {
    console.error('❌ Error reading data.json:', error.message);
    process.exit(1);
  }

  // Find critiques missing English text
  const missing = data.critiques.filter(c => !c.textEn);
  console.log(`📊 Found ${missing.length} critiques missing English text\n`);

  if (missing.length === 0) {
    console.log('✅ All critiques already have English translations. Nothing to do.');
    return;
  }

  // Dry run: just print count and exit
  if (isDryRun) {
    console.log('🔍 Dry run mode - showing missing critiques by artwork:\n');
    const byArtwork = {};
    missing.forEach(c => {
      if (!byArtwork[c.artworkId]) byArtwork[c.artworkId] = [];
      byArtwork[c.artworkId].push(c.personaId);
    });
    Object.entries(byArtwork).sort((a, b) => a[0].localeCompare(b[0])).forEach(([artId, critics]) => {
      const artwork = data.artworks.find(a => a.id === artId);
      console.log(`  ${artId} (${artwork.titleZh}): ${critics.length} critiques`);
      console.log(`    Missing: ${critics.join(', ')}`);
    });
    console.log('\nTo run actual translation, remove --dry-run flag.');
    return;
  }

  // Create backup before starting
  console.log('📦 Creating backup of data.json...');
  fs.copyFileSync(DATA_JSON_PATH, BACKUP_PATH);
  console.log(`   ✅ Backup created: ${path.basename(BACKUP_PATH)}\n`);

  // Process each missing critique
  const startTime = Date.now();
  for (let i = 0; i < missing.length; i++) {
    const critique = missing[i];
    const persona = data.personas.find(p => p.id === critique.personaId);
    const artwork = data.artworks.find(a => a.id === critique.artworkId);

    console.log(`[${i + 1}/${missing.length}] Translating ${critique.artworkId} - ${persona.nameEn}...`);

    try {
      // Generate translation
      const textEn = await translateCritique(critique, persona, artwork);

      // Update critique in data
      const critiqueIndex = data.critiques.findIndex(
        c => c.artworkId === critique.artworkId && c.personaId === critique.personaId
      );
      data.critiques[critiqueIndex].textEn = textEn;

      // Log preview
      const preview = textEn.substring(0, 100) + (textEn.length > 100 ? '...' : '');
      console.log(`   ✅ Translated (${textEn.length} chars): "${preview}"`);

      // Save progress every 10 translations
      if ((i + 1) % 10 === 0 || i === missing.length - 1) {
        saveProgress(data, `Progress saved (${i + 1}/${missing.length})`);
      }

      // Add small delay to avoid rate limiting (respectful API usage)
      if (i < missing.length - 1) {
        await sleep(1000); // 1 second between requests
      }
    } catch (error) {
      console.error(`   ❌ Failed to translate. Skipping for now.`);
      console.error(`   You can re-run the script to retry failed translations.`);
    }
  }

  // Final save
  saveProgress(data, 'All translations complete!');

  // Summary
  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  const completed = data.critiques.filter(c => c.textEn).length;

  console.log('\n' + '='.repeat(60));
  console.log('✅ TRANSLATION COMPLETE');
  console.log('='.repeat(60));
  console.log(`Total critiques: ${data.critiques.length}`);
  console.log(`With English text: ${completed}`);
  console.log(`Missing English: ${data.critiques.length - completed}`);
  console.log(`Time elapsed: ${elapsed} minutes`);
  console.log('\n🎉 All English translations have been generated!');
}

// Run main function
generateAllMissingEnglish().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
