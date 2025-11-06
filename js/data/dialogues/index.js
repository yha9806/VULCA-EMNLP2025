/**
 * Dialogue System - Main Index
 *
 * This file aggregates all per-artwork dialogue data.
 * Transformed: 2025-11-06 (Phase 2: merge-threads-to-continuous-dialogue)
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
// When adding new artworks, import their dialogue file here:
import { artwork1Dialogue } from './artwork-1.js';
import { artwork2Dialogue } from './artwork-2.js';
import { artwork3Dialogue } from './artwork-3.js';
import { artwork4Dialogue } from './artwork-4.js';

/**
 * Aggregated dialogues from all artworks
 * @type {Array<Dialogue>}
 *
 * Statistics (Phase 2):
 * - Total dialogues: 4 (1 per artwork)
 * - Total messages: 85 (30+19+18+18)
 * - Transformed: 2025-11-06
 */
export const DIALOGUES = [
  artwork1Dialogue,
  artwork2Dialogue,
  artwork3Dialogue,
  artwork4Dialogue,
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

// Backward compatibility: Export DIALOGUE_THREADS for existing code
export const DIALOGUE_THREADS = DIALOGUES;
