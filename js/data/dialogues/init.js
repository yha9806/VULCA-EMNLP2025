/**
 * Dialogue System - Initialization Bridge
 *
 * This ES6 module imports dialogue data and exposes it to window object
 * for compatibility with non-module scripts (like data.js).
 *
 * Usage in HTML (BEFORE data.js):
 *   <script type="module" src="/js/data/dialogues/init.js"></script>
 *   <script src="/js/data.js"></script>
 */

import { DIALOGUE_THREADS, getDialoguesForArtwork, getDialogueById, getDialoguesWithPersona, getDialogueStats } from './index.js';
import { INTERACTION_TYPES, getInteractionLabel, getInteractionColor } from './types.js';

// Expose dialogue data to window object
window.DIALOGUE_THREADS = DIALOGUE_THREADS;
window.INTERACTION_TYPES = INTERACTION_TYPES;

// Expose helper functions
window.getDialoguesForArtwork = getDialoguesForArtwork;
window.getDialogueById = getDialogueById;
window.getDialoguesWithPersona = getDialoguesWithPersona;
window.getDialogueStats = getDialogueStats;
window.getInteractionLabel = getInteractionLabel;
window.getInteractionColor = getInteractionColor;

console.log('[Dialogue Init] Loaded dialogue system');
console.log('[Dialogue Init] Statistics:', getDialogueStats());
console.log('[Dialogue Init] Available interaction types:', Object.keys(INTERACTION_TYPES));

// Integrate with VULCA_DATA if it exists
if (typeof window.VULCA_DATA !== 'undefined') {
  window.VULCA_DATA.dialogues = DIALOGUE_THREADS;
  window.VULCA_DATA.getDialoguesForArtwork = getDialoguesForArtwork;
  window.VULCA_DATA.getDialogueById = getDialogueById;
  window.VULCA_DATA.getDialoguesWithPersona = getDialoguesWithPersona;
  console.log(`[Dialogue Init] Integrated ${DIALOGUE_THREADS.length} threads into VULCA_DATA`);
} else {
  // VULCA_DATA not loaded yet, dispatch event for later integration
  window.addEventListener('DOMContentLoaded', () => {
    if (typeof window.VULCA_DATA !== 'undefined') {
      window.VULCA_DATA.dialogues = DIALOGUE_THREADS;
      window.VULCA_DATA.getDialoguesForArtwork = getDialoguesForArtwork;
      window.VULCA_DATA.getDialogueById = getDialogueById;
      window.VULCA_DATA.getDialoguesWithPersona = getDialoguesWithPersona;
      console.log(`[Dialogue Init] Integrated ${DIALOGUE_THREADS.length} threads into VULCA_DATA (deferred)`);
    }
  });
}
