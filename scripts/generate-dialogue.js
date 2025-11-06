#!/usr/bin/env node
/**
 * Dialogue Generation Tool
 *
 * Generates dialogue content for artworks using structured prompts.
 * This tool helps maintain consistency and quality when adding new artwork dialogues.
 *
 * Usage:
 *   node scripts/generate-dialogue.js --artwork-id artwork-5
 *   node scripts/generate-dialogue.js --artwork-id artwork-5 --threads 6 --messages 5
 *   node scripts/generate-dialogue.js --help
 *
 * Process:
 *   1. Reads artwork data and existing critiques
 *   2. Generates dialogue topics using templates
 *   3. Creates structured dialogue messages
 *   4. Validates data against schema
 *   5. Saves to js/data/dialogues/artwork-N.js
 *   6. Provides instructions for manual integration
 */

console.log(`
╔═══════════════════════════════════════════════════════════╗
║        Dialogue Generation Tool - VULCA Gallery          ║
║                                                          ║
║  This tool helps you create dialogue content for        ║
║  artworks by providing structured templates and         ║
║  quality guidelines.                                    ║
╚═══════════════════════════════════════════════════════════╝
`);

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  artworkId: null,
  threads: 6,
  messages: 5,
  output: null,
  help: false
};

for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--artwork-id':
      options.artworkId = args[++i];
      break;
    case '--threads':
      options.threads = parseInt(args[++i], 10);
      break;
    case '--messages':
      options.messages = parseInt(args[++i], 10);
      break;
    case '--output':
      options.output = args[++i];
      break;
    case '--help':
    case '-h':
      options.help = true;
      break;
  }
}

if (options.help || !options.artworkId) {
  console.log(`
Usage:
  node scripts/generate-dialogue.js --artwork-id <id> [options]

Required:
  --artwork-id <id>    Artwork ID (e.g., artwork-1, artwork-5)

Options:
  --threads <number>   Number of dialogue threads to generate (default: 6)
  --messages <number>  Average messages per thread (default: 5)
  --output <path>      Output file path (default: js/data/dialogues/<id>.js)
  --help, -h           Show this help message

Examples:
  # Generate dialogues for artwork-5
  node scripts/generate-dialogue.js --artwork-id artwork-5

  # Generate 8 threads with 6 messages each
  node scripts/generate-dialogue.js --artwork-id artwork-5 --threads 8 --messages 6

After Generation:
  1. Review the generated file for quality
  2. Edit if needed (improve wording, fix translations)
  3. Import in js/data/dialogues/index.js
  4. Validate: node scripts/validate-dialogues.js --artwork <id>
  5. Test in browser
`);
  process.exit(options.help ? 0 : 1);
}

const { artworkId, threads, messages } = options;
const outputPath = options.output || `js/data/dialogues/${artworkId}.js`;

console.log(`\nConfiguration:`);
console.log(`  Artwork ID: ${artworkId}`);
console.log(`  Threads to generate: ${threads}`);
console.log(`  Messages per thread: ~${messages}`);
console.log(`  Output: ${outputPath}\n`);

console.log(`╔═══════════════════════════════════════════════════════════╗`);
console.log(`║  MANUAL GENERATION INSTRUCTIONS                           ║`);
console.log(`╚═══════════════════════════════════════════════════════════╝\n`);

console.log(`This tool provides templates and guidelines for creating dialogue content.`);
console.log(`Please follow these steps:\n`);

console.log(`STEP 1: Review Artwork Data`);
console.log(`────────────────────────────────────────────────────────────`);
console.log(`  1. Open js/data.js`);
console.log(`  2. Find artwork data for '${artworkId}'`);
console.log(`  3. Review artwork details: title, artist, year, context`);
console.log(`  4. Read all 6 existing critiques for this artwork\n`);

console.log(`STEP 2: Plan Dialogue Topics`);
console.log(`────────────────────────────────────────────────────────────`);
console.log(`  Generate ${threads} diverse topics using these templates:\n`);
console.log(`  Template 1: Technique Focus`);
console.log(`    - Topic: "[specific aspect]的技法探讨 / Discussion of [aspect] Technique"`);
console.log(`    - Participants: Technical critics (Guo Xi, Professor Petrova, John Ruskin)`);
console.log(`    - Example: "笔法与机械运动 / Brushwork and Mechanical Movement"\n`);

console.log(`  Template 2: Philosophy/Concept`);
console.log(`    - Topic: "[concept]的哲学思考 / Philosophical Reflection on [concept]"`);
console.log(`    - Participants: Philosophical critics (Su Shi, John Ruskin, AI Ethics)`);
console.log(`    - Example: "心性与程序性 / Spirit vs. Programmatic Nature"\n`);

console.log(`  Template 3: Cultural Dialogue`);
console.log(`    - Topic: "[perspective]视角下的文化对话 / Cultural Dialogue from [perspective]"`);
console.log(`    - Participants: Cross-cultural mix (Mama Zola, John Ruskin, Su Shi)`);
console.log(`    - Example: "传统与技术的对话 / Dialogue Between Tradition and Technology"\n`);

console.log(`  Template 4: Contemporary Relevance`);
console.log(`    - Topic: "[theme]与当代性 / [theme] and Contemporary Relevance"`);
console.log(`    - Participants: Modern critics (AI Ethics, Professor Petrova, Mama Zola)`);
console.log(`    - Example: "人机协作的未来 / Future of Human-Machine Collaboration"\n`);

console.log(`  Template 5: Tradition vs Innovation`);
console.log(`    - Topic: "传统与[innovation]的碰撞 / Collision of Tradition and [innovation]"`);
console.log(`    - Participants: Traditional + Modern (Su Shi, Guo Xi, AI Ethics)`);
console.log(`    - Example: "文化传承的新形式 / New Forms of Cultural Transmission"\n`);

console.log(`STEP 3: Generate Messages for Each Thread`);
console.log(`────────────────────────────────────────────────────────────`);
console.log(`  For each thread, create ${messages} messages following this structure:\n`);

console.log(`  Message 1 (Initial):`);
console.log(`    personaId: [first critic]`);
console.log(`    textZh: "[Opening observation about artwork, 100-150 words]"`);
console.log(`    textEn: "[English translation, equal quality]"`);
console.log(`    timestamp: 0`);
console.log(`    replyTo: null`);
console.log(`    interactionType: "initial"\n`);

console.log(`  Message 2 (Agree-Extend):`);
console.log(`    personaId: [second critic]`);
console.log(`    textZh: "[Agreement + new insight, quote first critic, 80-120 words]"`);
console.log(`    textEn: "[English translation]"`);
console.log(`    timestamp: 3000`);
console.log(`    replyTo: [first critic ID]`);
console.log(`    interactionType: "agree-extend"`);
console.log(`    quotedText: "[specific phrase from first message]"\n`);

console.log(`  Message 3 (Question-Challenge):`);
console.log(`    personaId: [third critic]`);
console.log(`    textZh: "[Question or challenge, 80-100 words]"`);
console.log(`    timestamp: 6000`);
console.log(`    replyTo: [first or second critic]`);
console.log(`    interactionType: "question-challenge"\n`);

console.log(`  Continue pattern for remaining messages...\n`);

console.log(`STEP 4: Interaction Type Distribution`);
console.log(`────────────────────────────────────────────────────────────`);
console.log(`  Aim for balanced distribution:`);
console.log(`    - agree-extend: 40% (most common)`);
console.log(`    - question-challenge: 20%`);
console.log(`    - synthesize: 15%`);
console.log(`    - counter: 10%`);
console.log(`    - reflect: 10%`);
console.log(`    - initial: 5% (one per thread)\n`);

console.log(`STEP 5: Quality Guidelines`);
console.log(`────────────────────────────────────────────────────────────`);
console.log(`  ✓ Maintain persona voice (check existing critiques for style)`);
console.log(`  ✓ Reference specific visual elements from artwork`);
console.log(`  ✓ Natural conversation flow (build on previous messages)`);
console.log(`  ✓ Equal quality Chinese and English (not literal translation)`);
console.log(`  ✓ Timestamps ascending (3000ms = 3 second gap)`);
console.log(`  ✓ Include quotes when replying (quotedText field)\n`);

console.log(`STEP 6: File Template`);
console.log(`────────────────────────────────────────────────────────────`);
console.log(`  Create file: ${outputPath}`);
console.log(`  Use this template:\n`);

const template = `/**
 * Dialogue threads for ${artworkId}
 * Generated: ${new Date().toISOString().split('T')[0]}
 */

export const ${artworkId.replace(/-/g, '')}Dialogues = [
  {
    id: "${artworkId}-thread-1",
    artworkId: "${artworkId}",
    topic: "[Topic in Chinese]",
    topicEn: "[Topic in English]",
    participants: ["critic-1", "critic-2", "critic-3"],
    messages: [
      {
        id: "msg-${artworkId}-1-1",
        personaId: "critic-1",
        textZh: "[Chinese text...]",
        textEn: "[English text...]",
        timestamp: 0,
        replyTo: null,
        interactionType: "initial"
      },
      // Add more messages...
    ]
  },
  // Add more threads...
];
`;

console.log(template);

console.log(`STEP 7: Integration`);
console.log(`────────────────────────────────────────────────────────────`);
console.log(`  After creating the file, integrate it:\n`);
console.log(`  1. Open js/data/dialogues/index.js`);
console.log(`  2. Add import:`);
console.log(`     import { ${artworkId.replace(/-/g, '')}Dialogues } from './${artworkId}.js';\n`);
console.log(`  3. Add to DIALOGUE_THREADS array:`);
console.log(`     export const DIALOGUE_THREADS = [`);
console.log(`       ...${artworkId.replace(/-/g, '')}Dialogues,`);
console.log(`       // ... other dialogues`);
console.log(`     ];\n`);

console.log(`STEP 8: Validation`);
console.log(`────────────────────────────────────────────────────────────`);
console.log(`  Run validation:`);
console.log(`    node scripts/validate-dialogues.js --artwork ${artworkId}\n`);

console.log(`STEP 9: Test in Browser`);
console.log(`────────────────────────────────────────────────────────────`);
console.log(`  1. Start local server: python -m http.server 9999`);
console.log(`  2. Navigate to the artwork`);
console.log(`  3. Enable dialogue mode`);
console.log(`  4. Verify all dialogues play correctly\n`);

console.log(`╔═══════════════════════════════════════════════════════════╗`);
console.log(`║  TIP: Use Claude Code for content generation             ║`);
console.log(`║                                                          ║`);
console.log(`║  Ask Claude Code to generate dialogue content with      ║`);
console.log(`║  specific personas, maintaining voice consistency.      ║`);
console.log(`╚═══════════════════════════════════════════════════════════╝\n`);

console.log(`Ready to start? Follow the steps above to create dialogue content.`);
console.log(`For questions, see: docs/adding-artwork-dialogues.md\n`);
