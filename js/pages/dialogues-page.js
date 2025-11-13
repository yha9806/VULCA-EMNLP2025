/**
 * Dialogues Page Controller
 *
 * Manages dialogue display page:
 * - Artwork selection
 * - DialoguePlayer instantiation
 * - Language switching
 * - URL state management
 *
 * @version 1.0.0
 * @created 2025-11-06
 */

import { DIALOGUES, getDialogueForArtwork } from '../data/dialogues/index.js';

console.log('[DialoguesPage] Module loaded');
console.log('[DialoguesPage] Loaded dialogues:', DIALOGUES.length, 'dialogues');

// State
let currentPlayer = null;
let currentArtworkId = 'artwork-1';

/**
 * Initialize the dialogues page
 */
function init() {
  console.log('[DialoguesPage] Initializing...');

  // Check URL parameter for artwork selection
  const urlParams = new URLSearchParams(window.location.search);
  const artworkParam = urlParams.get('artwork');
  if (artworkParam && getDialogueForArtwork(artworkParam)) {
    currentArtworkId = artworkParam;
  }

  // Set up artwork selector buttons
  const buttons = document.querySelectorAll('.artwork-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const artworkId = btn.dataset.artwork;
      selectArtwork(artworkId);
    });
  });

  // Initialize with current artwork
  selectArtwork(currentArtworkId);

  // Listen for language changes
  window.addEventListener('langchange', () => {
    console.log('[DialoguesPage] Language changed, reloading dialogue...');
    if (currentPlayer) {
      currentPlayer.destroy();
    }
    loadDialogue(currentArtworkId);
  });

  console.log('[DialoguesPage] Initialized successfully');
}

/**
 * Select and display a specific artwork's dialogue
 * @param {string} artworkId - Artwork ID (e.g., "artwork-1")
 */
function selectArtwork(artworkId) {
  console.log(`[DialoguesPage] Selecting artwork: ${artworkId}`);

  // Validate artwork exists
  const dialogue = getDialogueForArtwork(artworkId);
  if (!dialogue) {
    console.error(`[DialoguesPage] Artwork not found: ${artworkId}`);
    showError(`Artwork ${artworkId} not found`);
    return;
  }

  // Update URL without reload
  const url = new URL(window.location);
  url.searchParams.set('artwork', artworkId);
  window.history.pushState({}, '', url);

  // Update button states
  document.querySelectorAll('.artwork-btn').forEach(btn => {
    if (btn.dataset.artwork === artworkId) {
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    }
  });

  // Update state
  currentArtworkId = artworkId;

  // Destroy previous player if exists
  if (currentPlayer) {
    currentPlayer.destroy();
    currentPlayer = null;
  }

  // Load new dialogue
  loadDialogue(artworkId);
}

/**
 * Load and display dialogue for a specific artwork
 * @param {string} artworkId - Artwork ID
 */
function loadDialogue(artworkId) {
  console.log(`[DialoguesPage] Loading dialogue for: ${artworkId}`);

  const container = document.getElementById('dialogue-container');
  if (!container) {
    console.error('[DialoguesPage] Dialogue container not found');
    return;
  }

  // Clear loading state
  container.innerHTML = '';

  // Get dialogue data
  const dialogue = getDialogueForArtwork(artworkId);
  if (!dialogue) {
    console.error(`[DialoguesPage] No dialogue data for: ${artworkId}`);
    showError(`No dialogue data found for ${artworkId}`);
    return;
  }

  console.log(`[DialoguesPage] Found dialogue:`, dialogue.id, `with ${dialogue.messages.length} messages`);

  // Get current language
  const lang = document.documentElement.getAttribute('data-lang') || 'zh';

  // Create DialoguePlayer instance
  try {
    currentPlayer = new DialoguePlayer(dialogue, container, {
      autoPlay: true,
      speed: 1.0,
      lang: lang
    });

    console.log(`[DialoguesPage] DialoguePlayer created for ${artworkId}`);
  } catch (error) {
    console.error('[DialoguesPage] Failed to create DialoguePlayer:', error);
    showError(`Failed to load dialogue: ${error.message}`);
  }
}

/**
 * Show error message in dialogue container
 * @param {string} message - Error message
 */
function showError(message) {
  const container = document.getElementById('dialogue-container');
  if (container) {
    container.innerHTML = `
      <div class="dialogue-error">
        <p>❌ ${message}</p>
      </div>
    `;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

console.log('[DialoguesPage] Controller loaded, waiting for DOM...');
