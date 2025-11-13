/**
 * Generate Critiques using LLM
 * Task 2.1: Setup LLM Critique Generation System
 *
 * This script generates critiques for artworks using structured prompts
 * based on each critic's knowledge base and voice characteristics.
 */

const fs = require('fs');
const path = require('path');

// ============================================================
// CONFIGURATION
// ============================================================

const EXHIBITION_DATA_PATH = 'exhibitions/negative-space-of-the-tide/data.json';
const OUTPUT_PATH = 'scripts/generated-critiques.json';

// Target critique length (characters)
const CRITIQUE_LENGTH = {
  min: 800,
  target: 1200,
  max: 1800
};

// RPAIT score validation range
const RPAIT_RANGE = {
  min: 1,
  max: 10
};

// ============================================================
// DATA LOADING
// ============================================================

console.log('Loading exhibition data...\n');

const exhibitionData = JSON.parse(fs.readFileSync(EXHIBITION_DATA_PATH, 'utf8'));

console.log(`✓ Loaded ${exhibitionData.artworks.length} artworks`);
console.log(`✓ Loaded ${exhibitionData.personas.length} personas`);
console.log(`✓ Target: ${exhibitionData.artworks.length * exhibitionData.personas.length} critiques\n`);

// ============================================================
// PROMPT TEMPLATES
// ============================================================

/**
 * Generate critique prompt for a specific artwork-critic pairing
 */
function generatePrompt(artwork, persona) {
  return `You are ${persona.nameZh} (${persona.nameEn}), ${persona.period}.

BIOGRAPHY:
${persona.bioZh}

${persona.bio}

CRITICAL PERSPECTIVE:
${persona.bias}

---

ARTWORK TO CRITIQUE:

Title (Chinese): ${artwork.titleZh}
Title (English): ${artwork.titleEn}
Artist: ${artwork.artist}
Year: ${artwork.year}

Context:
${artwork.context}

---

TASK:

Write a thoughtful art critique of this work from your unique critical perspective. Your critique should:

1. **Engage with the artwork's specific qualities** - reference the title, context, and themes
2. **Apply your critical framework** - use your characteristic analytical approach
3. **Be specific and concrete** - avoid generic art criticism phrases
4. **Reflect your voice** - use vocabulary and argumentation style characteristic of your era and tradition
5. **Provide insight** - offer a perspective only YOU could provide given your background

CRITIQUE STRUCTURE:

Chinese Critique (800-1200 characters):
- Begin with your initial observation/reaction
- Apply your critical lens to analyze the work
- Conclude with philosophical or aesthetic insight

English Critique (800-1200 characters):
- Mirror the structure and content of the Chinese critique
- Maintain your characteristic voice and vocabulary

RPAIT SCORES:

Assign scores (1-10) for five dimensions:

- **R (Representation)**: How effectively does the work represent its subject/concept? How well does form serve meaning?
- **P (Philosophicality)**: What deeper questions does it raise? How intellectually engaging is it?
- **A (Aesthetics)**: How does it achieve visual impact? What is the quality of its formal execution?
- **I (Identity)**: How does it engage with cultural, personal, or collective identity? Whose perspective does it represent?
- **T (Tradition)**: How does it relate to artistic traditions? Does it honor, challenge, or transform them?

Consider:
- Your critical values when scoring (e.g., Su Shi values spiritual depth over technical skill)
- The artwork's actual qualities, not just your preferences
- Variation in scores (not all 8s and 9s)

---

OUTPUT FORMAT (JSON):

{
  "textZh": "你的中文评论（800-1200字）",
  "textEn": "Your English critique (800-1200 characters)",
  "rpait": {
    "R": 7,
    "P": 9,
    "A": 8,
    "I": 8,
    "T": 6
  }
}

Generate the critique now.`;
}

// ============================================================
// CRITIQUE VALIDATION
// ============================================================

/**
 * Validate a generated critique
 */
function validateCritique(critique, artwork, persona) {
  const errors = [];
  const warnings = [];

  // Required fields
  if (!critique.textZh) errors.push('Missing textZh');
  if (!critique.textEn) errors.push('Missing textEn');
  if (!critique.rpait) errors.push('Missing rpait scores');

  // Length validation
  if (critique.textZh) {
    const length = critique.textZh.length;
    if (length < CRITIQUE_LENGTH.min) {
      warnings.push(`Chinese critique too short: ${length} chars (min ${CRITIQUE_LENGTH.min})`);
    }
    if (length > CRITIQUE_LENGTH.max) {
      warnings.push(`Chinese critique too long: ${length} chars (max ${CRITIQUE_LENGTH.max})`);
    }
  }

  if (critique.textEn) {
    const length = critique.textEn.length;
    if (length < CRITIQUE_LENGTH.min) {
      warnings.push(`English critique too short: ${length} chars (min ${CRITIQUE_LENGTH.min})`);
    }
    if (length > CRITIQUE_LENGTH.max) {
      warnings.push(`English critique too long: ${length} chars (max ${CRITIQUE_LENGTH.max})`);
    }
  }

  // RPAIT validation
  if (critique.rpait) {
    const dimensions = ['R', 'P', 'A', 'I', 'T'];
    dimensions.forEach(dim => {
      const score = critique.rpait[dim];
      if (score === undefined) {
        errors.push(`Missing RPAIT score for dimension ${dim}`);
      } else if (score < RPAIT_RANGE.min || score > RPAIT_RANGE.max) {
        errors.push(`Invalid RPAIT score for ${dim}: ${score} (range ${RPAIT_RANGE.min}-${RPAIT_RANGE.max})`);
      }
    });

    // Check for score variation
    const scores = Object.values(critique.rpait);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) / scores.length;

    if (variance < 0.5) {
      warnings.push(`Low score variance (${variance.toFixed(2)}): scores may be too similar`);
    }
  }

  return { errors, warnings };
}

// ============================================================
// BATCH PROCESSING
// ============================================================

/**
 * Process a batch of artworks
 */
function processBatch(startIdx, endIdx, critiquesData = []) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Processing artworks ${startIdx + 1} to ${endIdx}`);
  console.log(`${'='.repeat(60)}\n`);

  const artworks = exhibitionData.artworks.slice(startIdx, endIdx);
  let totalCritiques = 0;

  artworks.forEach((artwork, idx) => {
    console.log(`\n[${startIdx + idx + 1}/${exhibitionData.artworks.length}] ${artwork.titleZh}`);
    console.log(`    ${artwork.titleEn}`);
    console.log(`    Artist: ${artwork.artist}, Year: ${artwork.year}\n`);

    exhibitionData.personas.forEach(persona => {
      console.log(`  → ${persona.nameZh} (${persona.nameEn})`);
      console.log(`     Prompt ready for LLM generation`);
      console.log(`     Bias: ${persona.bias}\n`);

      // Generate prompt (ready for manual or API-based generation)
      const prompt = generatePrompt(artwork, persona);

      // Placeholder for critique object (to be filled by LLM)
      const critiqueTemplate = {
        artworkId: artwork.id,
        personaId: persona.id,
        textZh: "",  // To be filled by LLM
        textEn: "",  // To be filled by LLM
        rpait: { R: 0, P: 0, A: 0, I: 0, T: 0 },  // To be filled by LLM
        _prompt: prompt,  // Include prompt for reference
        _generated: false
      };

      critiquesData.push(critiqueTemplate);
      totalCritiques++;
    });
  });

  console.log(`\n✓ Prepared ${totalCritiques} critique templates`);
  return critiquesData;
}

// ============================================================
// MAIN EXECUTION
// ============================================================

if (require.main === module) {
  console.log('='.repeat(60));
  console.log('CRITIQUE GENERATION SYSTEM');
  console.log('='.repeat(60));

  // Check command line arguments
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('\nUsage:');
    console.log('  node scripts/generate-critiques.js <start-idx> <end-idx>');
    console.log('\nExamples:');
    console.log('  node scripts/generate-critiques.js 0 5    # Artworks 1-5 (30 critiques)');
    console.log('  node scripts/generate-critiques.js 5 13   # Artworks 6-13 (48 critiques)');
    console.log('  node scripts/generate-critiques.js 13 23  # Artworks 14-23 (60 critiques)');
    console.log('  node scripts/generate-critiques.js 23 33  # Artworks 24-33 (60 critiques)');
    console.log('  node scripts/generate-critiques.js 33 38  # Artworks 34-38 (30 critiques)\n');
    process.exit(0);
  }

  const startIdx = parseInt(args[0]);
  const endIdx = parseInt(args[1]);

  if (isNaN(startIdx) || isNaN(endIdx)) {
    console.error('Error: Invalid arguments. Start and end indices must be numbers.');
    process.exit(1);
  }

  if (startIdx < 0 || endIdx > exhibitionData.artworks.length) {
    console.error(`Error: Index out of range. Valid range: 0-${exhibitionData.artworks.length}`);
    process.exit(1);
  }

  // Process batch
  const critiquesData = processBatch(startIdx, endIdx);

  // Save templates
  const outputFile = OUTPUT_PATH.replace('.json', `-${startIdx}-${endIdx}.json`);
  fs.writeFileSync(outputFile, JSON.stringify(critiquesData, null, 2), 'utf8');

  console.log(`\n✓ Saved ${critiquesData.length} critique templates to: ${outputFile}`);
  console.log('\nNext steps:');
  console.log('1. Use the prompts to generate critiques with Claude/GPT-4');
  console.log('2. Fill in textZh, textEn, and rpait scores');
  console.log('3. Run validation: node scripts/validate-critiques.js');
  console.log('4. Merge into data.json: node scripts/merge-critiques.js\n');
}

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  generatePrompt,
  validateCritique,
  processBatch
};
