/**
 * Dialogue System - Main Index
 *
 * This file aggregates all per-artwork dialogue data.
 * Transformed: 2025-11-06 (Phase 2: merge-threads-to-continuous-dialogue)
 * Updated: 2025-11-14 (Added artwork-5 to artwork-38)
 *
 * Architecture: Modular per-artwork files (scalability)
 * - Easy to add new artworks: create new artwork-N.js file
 * - Easy to update: edit single file for specific artwork
 * - Git-friendly: isolated changes, clear diffs
 *
 * Usage:
 *   import { DIALOGUES } from './data/dialogues/index.js';
 *   const artwork1 = DIALOGUES.find(d => d.artworkId === 'artwork-1');
 */

// Import per-artwork dialogue modules
import { artwork1Dialogue } from './artwork-1.js?v=3';
import { artwork2Dialogue } from './artwork-2.js?v=3';
import { artwork3Dialogue } from './artwork-3.js?v=3';
import { artwork4Dialogue } from './artwork-4.js?v=3';
import { artwork5Dialogue } from './artwork-5.js';
import { artwork6Dialogue } from './artwork-6.js';
import { artwork7Dialogue } from './artwork-7.js';
import { artwork8Dialogue } from './artwork-8.js';
import { artwork9Dialogue } from './artwork-9.js';
// artwork-10 removed (陈筱薇 withdrawn)
import { artwork11Dialogue } from './artwork-11.js';
import { artwork12Dialogue } from './artwork-12.js';
import { artwork13Dialogue } from './artwork-13.js';
import { artwork14Dialogue } from './artwork-14.js';
import { artwork15Dialogue } from './artwork-15.js';
import { artwork16Dialogue } from './artwork-16.js';
// artwork-17 removed (李鹏飞 withdrawn)
import { artwork18Dialogue } from './artwork-18.js';
import { artwork19Dialogue } from './artwork-19.js';
import { artwork20Dialogue } from './artwork-20.js';
import { artwork21Dialogue } from './artwork-21.js';
import { artwork22Dialogue } from './artwork-22.js';
import { artwork23Dialogue } from './artwork-23.js';
import { artwork24Dialogue } from './artwork-24.js';
import { artwork25Dialogue } from './artwork-25.js';
import { artwork26Dialogue } from './artwork-26.js';
import { artwork27Dialogue } from './artwork-27.js';
import { artwork28Dialogue } from './artwork-28.js';
import { artwork29Dialogue } from './artwork-29.js';
// artwork-30 removed (龍暐翔 withdrawn)
import { artwork31Dialogue } from './artwork-31.js';
import { artwork32Dialogue} from './artwork-32.js';
import { artwork33Dialogue } from './artwork-33.js';
import { artwork34Dialogue } from './artwork-34.js';
import { artwork35Dialogue } from './artwork-35.js';
import { artwork36Dialogue } from './artwork-36.js';
import { artwork37Dialogue } from './artwork-37.js';
import { artwork38Dialogue } from './artwork-38.js';
// New artworks from PPT final version (2025-11-14)
import { artwork39Dialogue } from './artwork-39.js';
import { artwork40Dialogue } from './artwork-40.js'; // pending
import { artwork41Dialogue } from './artwork-41.js';
import { artwork42Dialogue } from './artwork-42.js'; // pending
import { artwork43Dialogue } from './artwork-43.js';
import { artwork44Dialogue } from './artwork-44.js'; // pending
import { artwork45Dialogue } from './artwork-45.js';
import { artwork46Dialogue } from './artwork-46.js';

/**
 * Aggregated dialogues from all artworks
 * @type {Array<Dialogue>}
 *
 * Statistics (Updated 2025-11-14):
 * - Total dialogues: 43 (1 per artwork)
 *   - 38 original artworks - 3 withdrawn + 8 new = 43
 * - Breakdown:
 *   - Original 4 artworks: 85 messages (30+19+18+18)
 *   - Generated 31 artworks: ~550 messages (from critiques, after removal of 3)
 *   - New 5 confirmed artworks: 30 messages (6 per artwork)
 *   - New 3 pending artworks: 3 messages (1 placeholder each)
 * - Total messages: ~668
 */
export const DIALOGUES = [
  artwork1Dialogue,
  artwork2Dialogue,
  artwork3Dialogue,
  artwork4Dialogue,
  artwork5Dialogue,
  artwork6Dialogue,
  artwork7Dialogue,
  artwork8Dialogue,
  artwork9Dialogue,
  // artwork10Dialogue removed (陈筱薇 withdrawn)
  artwork11Dialogue,
  artwork12Dialogue,
  artwork13Dialogue,
  artwork14Dialogue,
  artwork15Dialogue,
  artwork16Dialogue,
  // artwork17Dialogue removed (李鹏飞 withdrawn)
  artwork18Dialogue,
  artwork19Dialogue,
  artwork20Dialogue,
  artwork21Dialogue,
  artwork22Dialogue,
  artwork23Dialogue,
  artwork24Dialogue,
  artwork25Dialogue,
  artwork26Dialogue,
  artwork27Dialogue,
  artwork28Dialogue,
  artwork29Dialogue,
  // artwork30Dialogue removed (龍暐翔 withdrawn)
  artwork31Dialogue,
  artwork32Dialogue,
  artwork33Dialogue,
  artwork34Dialogue,
  artwork35Dialogue,
  artwork36Dialogue,
  artwork37Dialogue,
  artwork38Dialogue,
  // New artworks from PPT final version (2025-11-14)
  artwork39Dialogue,
  artwork40Dialogue, // pending
  artwork41Dialogue,
  artwork42Dialogue, // pending
  artwork43Dialogue,
  artwork44Dialogue, // pending
  artwork45Dialogue,
  artwork46Dialogue,
];

/**
 * Helper: Get dialogue for a specific artwork
 * @param {string} artworkId - Artwork ID (e.g., 'artwork-1')
 * @returns {Dialogue|undefined}
 */
export function getDialogueForArtwork(artworkId) {
  return DIALOGUES.find(dialogue => dialogue.artworkId === artworkId);
}

/**
 * Helper: Get a specific dialogue by ID
 * @param {string} dialogueId - Dialogue ID (e.g., 'artwork-1-dialogue')
 * @returns {Dialogue|undefined}
 */
export function getDialogueById(dialogueId) {
  return DIALOGUES.find(dialogue => dialogue.id === dialogueId);
}

/**
 * Helper: Get all dialogues with a specific participant
 * @param {string} personaId - Persona ID (e.g., 'su-shi')
 * @returns {Array<Dialogue>}
 */
export function getDialoguesWithPersona(personaId) {
  return DIALOGUES.filter(dialogue =>
    dialogue.participants.includes(personaId)
  );
}

/**
 * Helper: Get dialogue statistics
 * @returns {Object} Stats object
 */
export function getDialogueStats() {
  const totalDialogues = DIALOGUES.length;
  const totalMessages = DIALOGUES.reduce((sum, dialogue) =>
    sum + dialogue.messages.length, 0
  );

  const artworks = [...new Set(DIALOGUES.map(d => d.artworkId))];
  const personas = new Set();
  DIALOGUES.forEach(dialogue => {
    dialogue.participants.forEach(p => personas.add(p));
  });

  return {
    totalDialogues,
    totalMessages,
    artworkCount: artworks.length,
    personaCount: personas.size,
    averageMessagesPerDialogue: totalDialogues > 0 ?
      Math.round(totalMessages / totalDialogues) : 0
  };
}

// Export as global variables for non-module scripts (gallery-hero.js)
// Phase 3.3: Main Site Integration (Homepage Replacement)
if (typeof window !== 'undefined') {
  window.DIALOGUES = DIALOGUES;
  window.getDialogueForArtwork = getDialogueForArtwork;
  window.getDialogueById = getDialogueById;
  window.getDialoguesWithPersona = getDialoguesWithPersona;
  window.getDialogueStats = getDialogueStats;

  console.log('[Dialogues] Global exports available:', {
    DIALOGUES: window.DIALOGUES.length,
    getDialogueForArtwork: typeof window.getDialogueForArtwork,
    helpers: ['getDialogueById', 'getDialoguesWithPersona', 'getDialogueStats']
  });
}

// Backward compatibility: Export DIALOGUE_THREADS for existing code
export const DIALOGUE_THREADS = DIALOGUES;
