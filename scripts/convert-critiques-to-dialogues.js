/**
 * Convert Critiques to Dialogues
 *
 * This script converts standalone critiques from data.json into interactive
 * dialogue format with reply chains, quotes, references, and interaction types.
 *
 * Usage:
 *   node scripts/convert-critiques-to-dialogues.js --artwork artwork-5
 *   node scripts/convert-critiques-to-dialogues.js --batch 5-38
 *   node scripts/convert-critiques-to-dialogues.js --all
 *
 * Output: js/data/dialogues/artwork-{id}.js files
 */

const fs = require('fs');
const path = require('path');

// File paths
const DATA_JSON_PATH = path.join(__dirname, '../exhibitions/negative-space-of-the-tide/data.json');
const DIALOGUES_DIR = path.join(__dirname, '../js/data/dialogues');
const KNOWLEDGE_BASE_DIR = path.join(__dirname, '../knowledge-base/critics');

// Load data
let data;
try {
  data = require(DATA_JSON_PATH);
} catch (error) {
  console.error('❌ Error loading data.json:', error.message);
  process.exit(1);
}

// ============================================================================
// CONFIGURATION: Interaction Type Detection Keywords
// ============================================================================

const INTERACTION_KEYWORDS = {
  'agree-extend': {
    zh: ['正如', '同意', '深以为然', '确实', '的确', '诚然', '所言极是'],
    en: ['I agree', 'As mentioned', 'Indeed', 'Certainly', 'As you noted', 'rightly']
  },
  'question-challenge': {
    zh: ['但是', '然而', '疑问', '质疑', '是否', '真的', '难道', '必须提出'],
    en: ['However', 'But', 'Question', 'Challenge', 'Whether', 'Doubt', 'must question']
  },
  'counter': {
    zh: ['不对', '反驳', '错误', '不同意', '恰恰相反', '并非如此', '过于简单'],
    en: ['Incorrect', 'Disagree', 'Contrary', 'Opposite', 'On the contrary', 'oversimplified']
  },
  'synthesize': {
    zh: ['综合', '总结', '整体', '三位所言', '听你们讨论', '大家的观点', '你们都对'],
    en: ['Overall', 'In summary', 'Synthesizing', 'Hearing your discussion', 'You are all']
  },
  'reflect': {
    zh: ['反思', '重新思考', '让我思考', '我意识到', '这让我', '或许', '突然想到'],
    en: ['Reflection', 'Reconsider', 'Makes me think', 'I realize', 'This leads me', 'Perhaps']
  }
};

// ============================================================================
// CORE FUNCTION 1: Text Segmentation
// ============================================================================

/**
 * Split long critique into 2-3 shorter dialogue messages
 * @param {Object} critique - Critique with textZh and textEn
 * @returns {Array<Object>} Segments with textZh, textEn, type
 */
function segmentCritique(critique) {
  const segments = [];

  // Split Chinese text at sentence boundaries
  const zhSentences = critique.textZh.split(/[。！？]/);
  const enSentences = critique.textEn.split(/[.!?]/);

  let currentZh = '';
  let currentEn = '';
  let sentenceIndex = 0;

  for (let i = 0; i < zhSentences.length; i++) {
    const zhSentence = zhSentences[i].trim();
    const enSentence = enSentences[i] ? enSentences[i].trim() : '';

    if (!zhSentence) continue;

    currentZh += zhSentence + '。';
    currentEn += enSentence + '. ';
    sentenceIndex++;

    // Create segment when reaching 300-600 chars or at end
    const shouldSegment = currentZh.length >= 300 || i === zhSentences.length - 1;

    if (shouldSegment && currentZh.length > 100) {
      segments.push({
        textZh: currentZh.trim(),
        textEn: currentEn.trim(),
        type: determineSegmentType(segments.length)
      });
      currentZh = '';
      currentEn = '';
    }
  }

  // Ensure at least 1 segment
  if (segments.length === 0 && critique.textZh) {
    segments.push({
      textZh: critique.textZh,
      textEn: critique.textEn,
      type: 'initial'
    });
  }

  // Limit to 3 segments max (split long texts)
  if (segments.length > 3) {
    const merged = [
      segments[0],
      {
        textZh: segments.slice(1, -1).map(s => s.textZh).join(' '),
        textEn: segments.slice(1, -1).map(s => s.textEn).join(' '),
        type: 'agree-extend'
      },
      segments[segments.length - 1]
    ];
    return merged;
  }

  return segments;
}

/**
 * Determine segment type based on position
 */
function determineSegmentType(segmentIndex) {
  if (segmentIndex === 0) return 'initial';
  return 'agree-extend'; // Will be overridden by detectInteractionType later
}

// ============================================================================
// CORE FUNCTION 2: Reply Chain Construction
// ============================================================================

/**
 * Determine who this message should reply to
 * @param {number} msgIndex - Current message index
 * @param {string} prevPersona - Previous message's personaId
 * @param {string} interactionType - Message interaction type
 * @returns {string|null} PersonaId to reply to, or null
 */
function determineReplyTo(msgIndex, prevPersona, interactionType) {
  // First message never replies
  if (msgIndex === 0) return null;

  // All non-initial messages reply to previous speaker
  // (Reflect/synthesize semantically address the whole conversation,
  //  but we maintain reply chain for UI quote functionality)
  return prevPersona;
}

// ============================================================================
// CORE FUNCTION 3: Quote Extraction
// ============================================================================

/**
 * Extract a meaningful quote from previous message
 * @param {string} messageText - Text to extract quote from
 * @param {number} maxLength - Maximum quote length
 * @returns {string|null} Extracted quote or null
 */
function extractQuotedText(messageText, maxLength = 50) {
  if (!messageText) return null;

  const keywords = ['艺术', '技术', '创作', '表达', '思考', '美学', 'art', 'technology', 'creation', 'expression', 'aesthetic'];
  const sentences = messageText.split(/[。.！!？?]/);

  // Find sentence with keywords
  for (let sentence of sentences) {
    const s = sentence.trim();
    if (s.length >= 15 && s.length <= maxLength) {
      if (keywords.some(k => s.includes(k))) {
        return s;
      }
    }
  }

  // Fallback: first substantial sentence
  for (let sentence of sentences) {
    const s = sentence.trim();
    if (s.length >= 15 && s.length <= maxLength) {
      return s;
    }
  }

  // Last resort: truncate first sentence
  const first = sentences[0].trim();
  if (first.length > maxLength) {
    return first.substring(0, maxLength) + '...';
  }

  return first || null;
}

// ============================================================================
// CORE FUNCTION 4: Interaction Type Detection
// ============================================================================

/**
 * Detect interaction type based on message content
 * @param {string} textZh - Chinese text
 * @param {string} textEn - English text
 * @param {number} position - Message position (0 = first)
 * @returns {string} Interaction type
 */
function detectInteractionType(textZh, textEn, position) {
  // First message is always initial
  if (position === 0) return 'initial';

  // Check keywords for each type
  for (let [type, keywords] of Object.entries(INTERACTION_KEYWORDS)) {
    const hasZh = keywords.zh.some(k => textZh.includes(k));
    const hasEn = keywords.en.some(k => textEn.toLowerCase().includes(k.toLowerCase()));

    if (hasZh || hasEn) {
      return type;
    }
  }

  // Default: agree-extend (most common)
  return 'agree-extend';
}

// ============================================================================
// CORE FUNCTION 5: Reference Matching
// ============================================================================

/**
 * Match knowledge base references for a persona
 * @param {string} personaId - Persona ID
 * @param {string} messageText - Message text (for future semantic matching)
 * @returns {Array<Object>} Array of reference objects
 */
function matchReferences(personaId, messageText) {
  const references = [];
  const personaKBPath = path.join(KNOWLEDGE_BASE_DIR, personaId);

  // Check if knowledge base exists
  if (!fs.existsSync(personaKBPath)) {
    console.warn(`⚠ No knowledge base found for ${personaId}`);
    return references;
  }

  // Try to load references from README.md or key-concepts.md
  const readmePath = path.join(personaKBPath, 'README.md');
  const keyConceptsPath = path.join(personaKBPath, 'key-concepts.md');

  // Simple implementation: Return placeholder references
  // TODO: Parse actual knowledge base files for real references

  // For now, create generic references based on persona
  const genericRefs = {
    'su-shi': [
      { critic: 'su-shi', source: 'poetry-and-theory.md', quote: '论画以形似，见与儿童邻', page: 'Section 1: Quote 1' },
      { critic: 'su-shi', source: 'key-concepts.md', quote: '神似 (Spiritual Likeness)', page: 'Core Concept #1' }
    ],
    'guo-xi': [
      { critic: 'guo-xi', source: 'landscape-theory.md', quote: '君子之所以爱夫山水者，其旨安在？', page: 'Section 4: Quote 10' },
      { critic: 'guo-xi', source: 'key-concepts.md', quote: '气韵生动 (Spirit Resonance)', page: 'Core Concept #3' }
    ],
    'john-ruskin': [
      { critic: 'john-ruskin', source: 'art-and-morality.md', quote: 'The artist has a moral duty to display the actual truth', page: 'Quote 1' },
      { critic: 'john-ruskin', source: 'README.md', quote: 'Truth to Nature', page: 'Core Philosophy' }
    ],
    'mama-zola': [
      { critic: 'mama-zola', source: 'griot-aesthetics-oral-tradition.md', quote: 'Ubuntu: Umuntu ngumuntu ngabantu', page: 'Section 1' },
      { critic: 'mama-zola', source: 'README.md', quote: 'Community-centered values', page: 'Core Philosophy' }
    ],
    'professor-petrova': [
      { critic: 'professor-petrova', source: 'formalism-and-device.md', quote: 'Defamiliarization (Ostranenie)', page: 'Section 1-10' },
      { critic: 'professor-petrova', source: 'README.md', quote: 'Literariness', page: 'Core Philosophy' }
    ],
    'ai-ethics-reviewer': [
      { critic: 'ai-ethics-reviewer', source: 'algorithmic-justice-and-power.md', quote: 'AI as Extractive System', page: 'Section 1-10' },
      { critic: 'ai-ethics-reviewer', source: 'README.md', quote: 'Algorithmic Accountability Framework', page: 'Core Philosophy' }
    ]
  };

  // Return 2-3 random references
  const personaRefs = genericRefs[personaId] || [];
  const count = Math.min(2 + Math.floor(Math.random()), personaRefs.length);
  return personaRefs.slice(0, count);
}

// ============================================================================
// CORE FUNCTION 6: Timestamp Generation
// ============================================================================

/**
 * Generate natural dialogue timestamps with 4-7 second intervals
 * @param {number} messageCount - Number of messages
 * @returns {Array<number>} Array of timestamps in milliseconds
 */
function generateTimestamps(messageCount) {
  const timestamps = [0]; // First message at t=0
  let currentTime = 0;

  for (let i = 1; i < messageCount; i++) {
    // Random interval between 4000-7000ms (4-7 seconds)
    const interval = 4000 + Math.random() * 3000;
    currentTime += interval;
    timestamps.push(Math.round(currentTime));
  }

  return timestamps;
}

// ============================================================================
// CORE FUNCTION 7: Dialogue Conversion
// ============================================================================

/**
 * Convert critiques for a single artwork into a dialogue
 * @param {string} artworkId - Artwork ID (e.g., 'artwork-5')
 * @returns {Object} Dialogue object
 */
function convertArtworkToDialogue(artworkId) {
  // Load critiques for this artwork
  const critiques = data.critiques.filter(c => c.artworkId === artworkId);
  const artwork = data.artworks.find(a => a.id === artworkId);

  if (!artwork) {
    throw new Error(`Artwork not found: ${artworkId}`);
  }

  if (critiques.length === 0) {
    throw new Error(`No critiques found for ${artworkId}`);
  }

  console.log(`\n=== Converting ${artworkId}: ${artwork.titleZh} ===`);
  console.log(`Input: ${critiques.length} critiques`);

  // Segment all critiques into messages
  const allSegments = [];
  for (let critique of critiques) {
    const segments = segmentCritique(critique);
    segments.forEach(seg => {
      allSegments.push({
        ...seg,
        personaId: critique.personaId,
        critique: critique
      });
    });
  }

  // Generate timestamps
  const timestamps = generateTimestamps(allSegments.length);

  // Build messages with all dialogue features
  const messages = [];
  for (let i = 0; i < allSegments.length; i++) {
    const segment = allSegments[i];
    const prevMessage = i > 0 ? messages[i - 1] : null;

    // Detect interaction type
    const interactionType = detectInteractionType(segment.textZh, segment.textEn, i);

    // Determine reply relationship
    const replyTo = prevMessage ? determineReplyTo(i, prevMessage.personaId, interactionType) : null;

    // Extract quote from previous message
    const quotedText = prevMessage && replyTo ? extractQuotedText(prevMessage.textZh, 50) : null;

    // Match references
    const references = matchReferences(segment.personaId, segment.textZh);

    // Create message object
    messages.push({
      id: `msg-${artworkId}-${i + 1}`,
      personaId: segment.personaId,
      textZh: segment.textZh,
      textEn: segment.textEn,
      timestamp: timestamps[i],
      replyTo: replyTo,
      interactionType: interactionType,
      quotedText: quotedText,
      references: references
    });
  }

  console.log(`Output: ${messages.length} messages`);
  console.log(`Interaction types: ${messages.map(m => m.interactionType).join(', ')}`);

  // Build dialogue object
  const dialogue = {
    id: `${artworkId}-dialogue`,
    artworkId: artworkId,
    participants: critiques.map(c => c.personaId),
    messages: messages
  };

  return dialogue;
}

// ============================================================================
// FILE GENERATION
// ============================================================================

/**
 * Generate dialogue file content
 * @param {Object} dialogue - Dialogue object
 * @param {Object} artwork - Artwork object
 * @returns {string} File content
 */
function generateDialogueFileContent(dialogue, artwork) {
  const content = `/**
 * Dialogue for ${dialogue.artworkId}
 * Artwork: "${artwork.titleZh}" by ${artwork.artist}
 * Generated: ${new Date().toISOString().split('T')[0]}
 * Source: Converted from critiques in data.json
 *
 * This dialogue was automatically generated from standalone critiques
 * using the critique-to-dialogue conversion system.
 */

export const ${dialogue.artworkId.replace(/-/g, '')}Dialogue = ${JSON.stringify(dialogue, null, 2)};
`;

  return content;
}

/**
 * Save dialogue to file
 * @param {Object} dialogue - Dialogue object
 */
function saveDialogue(dialogue) {
  const artwork = data.artworks.find(a => a.id === dialogue.artworkId);
  const filename = `${dialogue.artworkId}.js`;
  const filepath = path.join(DIALOGUES_DIR, filename);

  const content = generateDialogueFileContent(dialogue, artwork);

  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`✅ Saved: ${filename}`);
}

// ============================================================================
// COMMAND LINE INTERFACE
// ============================================================================

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage:');
    console.log('  node scripts/convert-critiques-to-dialogues.js --artwork artwork-5');
    console.log('  node scripts/convert-critiques-to-dialogues.js --batch 5-38');
    console.log('  node scripts/convert-critiques-to-dialogues.js --all');
    process.exit(0);
  }

  // Parse arguments
  const mode = args[0];
  const param = args[1];

  try {
    if (mode === '--artwork') {
      // Single artwork
      const dialogue = convertArtworkToDialogue(param);
      saveDialogue(dialogue);
      console.log('\n✅ Conversion complete!');

    } else if (mode === '--batch') {
      // Batch range (e.g., 5-38)
      const [start, end] = param.split('-').map(Number);
      console.log(`\n🚀 Converting artworks ${start} to ${end}...\n`);

      for (let i = start; i <= end; i++) {
        const artworkId = `artwork-${i}`;
        try {
          const dialogue = convertArtworkToDialogue(artworkId);
          saveDialogue(dialogue);
        } catch (error) {
          console.error(`❌ Failed to convert ${artworkId}:`, error.message);
        }
      }

      console.log(`\n✅ Batch conversion complete! (${end - start + 1} artworks)`);

    } else if (mode === '--all') {
      // All artworks (1-38)
      console.log('\n🚀 Converting all artworks...\n');

      for (let i = 1; i <= 38; i++) {
        const artworkId = `artwork-${i}`;
        try {
          const dialogue = convertArtworkToDialogue(artworkId);
          saveDialogue(dialogue);
        } catch (error) {
          console.error(`❌ Failed to convert ${artworkId}:`, error.message);
        }
      }

      console.log('\n✅ All artworks converted!');

    } else {
      console.error('❌ Unknown mode:', mode);
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    segmentCritique,
    determineReplyTo,
    extractQuotedText,
    detectInteractionType,
    matchReferences,
    generateTimestamps,
    convertArtworkToDialogue
  };
}

// Run if called directly
if (require.main === module) {
  main();
}
