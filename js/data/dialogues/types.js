/**
 * @fileoverview Type definitions for the dialogue system
 * These JSDoc types provide IDE autocomplete and type checking
 */

/**
 * Interaction type enum
 * @typedef {'initial'|'agree-extend'|'question-challenge'|'synthesize'|'counter'|'reflect'} InteractionType
 */

/**
 * Knowledge base reference for a message
 * @typedef {Object} KnowledgeReference
 * @property {string} critic - Critic ID (e.g., "su-shi")
 * @property {string} source - Source document name (e.g., "poetry-and-theory.md")
 * @property {string} quote - Quoted text from the source
 * @property {string} [page] - Optional: page number or section reference
 */

/**
 * Image annotation in bilingual format
 * @typedef {Object} ImageAnnotation
 * @property {string} zh - Chinese annotation text
 * @property {string} en - English annotation text
 */

/**
 * A single message in a dialogue thread
 * @typedef {Object} DialogueMessage
 * @property {string} id - Unique message ID (e.g., "msg-1-1-1")
 * @property {string} personaId - Persona who sent this message (e.g., "su-shi")
 * @property {string} textZh - Chinese message text
 * @property {string} textEn - English message text
 * @property {number} timestamp - Milliseconds from thread start (e.g., 0, 3000, 6000)
 * @property {string|null} replyTo - Persona ID being replied to (null if initial message)
 * @property {InteractionType} interactionType - Type of interaction
 * @property {string} [quotedText] - Optional: text being quoted from another message
 * @property {Array<string>} [tags] - Optional: topic tags (e.g., ["technique", "philosophy"])
 *
 * --- Phase 2 Extensions (all optional for backward compatibility) ---
 * @property {number} [chapterNumber] - Chapter number (1-5) this message belongs to
 * @property {string} [highlightImage] - Image ID to highlight when this message is shown
 * @property {ImageAnnotation} [imageAnnotation] - Bilingual annotation for the highlighted image
 * @property {Array<KnowledgeReference>} [references] - Knowledge base references for this message
 */

/**
 * A chapter in a dialogue (Phase 2: narrative structure)
 * @typedef {Object} DialogueChapter
 * @property {number} id - Chapter number (1-5)
 * @property {string} title - Chinese chapter title
 * @property {string} titleEn - English chapter title
 * @property {string} description - Chinese chapter description
 * @property {string} descriptionEn - English chapter description
 * @property {Array<string>} messageIds - Array of message IDs in this chapter
 */

/**
 * A dialogue thread (conversation about a specific topic)
 * @typedef {Object} DialogueThread
 * @property {string} id - Unique thread ID (e.g., "artwork-1-thread-1")
 * @property {string} artworkId - Artwork ID this thread discusses (e.g., "artwork-1")
 * @property {string} topic - Chinese topic title
 * @property {string} topicEn - English topic title
 * @property {Array<string>} participants - Persona IDs participating (e.g., ["su-shi", "guo-xi"])
 * @property {Array<DialogueMessage>} messages - Array of messages in chronological order
 * @property {Array<DialogueChapter>} [chapters] - Optional: chapter structure (Phase 2)
 */

/**
 * Interaction type metadata
 * @typedef {Object} InteractionTypeMetadata
 * @property {string} labelZh - Chinese label
 * @property {string} labelEn - English label
 * @property {string} color - Hex color code
 * @property {string} description - What this interaction type means
 */

/**
 * Interaction type color and label mappings
 * @type {Object.<InteractionType, InteractionTypeMetadata>}
 */
export const INTERACTION_TYPES = {
  'initial': {
    labelZh: '开启',
    labelEn: 'Initial',
    color: '#6366f1', // indigo
    description: 'Starting a new topic or thread'
  },
  'agree-extend': {
    labelZh: '赞同',
    labelEn: 'Agrees',
    color: '#4ade80', // green
    description: 'Agreeing with previous statement and adding new ideas'
  },
  'question-challenge': {
    labelZh: '质疑',
    labelEn: 'Questions',
    color: '#fbbf24', // amber
    description: 'Questioning or challenging a previous observation'
  },
  'synthesize': {
    labelZh: '综合',
    labelEn: 'Synthesizes',
    color: '#8b5cf6', // purple
    description: 'Bringing together different viewpoints'
  },
  'counter': {
    labelZh: '反驳',
    labelEn: 'Counters',
    color: '#f87171', // red
    description: 'Disagreeing with reasoning or conclusion'
  },
  'reflect': {
    labelZh: '反思',
    labelEn: 'Reflects',
    color: '#60a5fa', // blue
    description: 'Personal reflection inspired by others'
  }
};

/**
 * Get interaction type metadata for a given type
 * @param {InteractionType} type
 * @param {string} lang - 'zh' or 'en'
 * @returns {string} Label in specified language
 */
export function getInteractionLabel(type, lang = 'zh') {
  const meta = INTERACTION_TYPES[type];
  return lang === 'en' ? meta.labelEn : meta.labelZh;
}

/**
 * Get color for interaction type
 * @param {InteractionType} type
 * @returns {string} Hex color code
 */
export function getInteractionColor(type) {
  return INTERACTION_TYPES[type].color;
}

// Export types for use in other modules (JSDoc only, no runtime effect)
export default {};
