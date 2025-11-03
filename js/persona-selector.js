/**
 * Global Persona Selection State Manager
 * Version 1.0
 *
 * Manages persona selection state and coordinates updates across visualizations
 */

window.PersonaSelection = (function() {
  'use strict';

  // State
  let selectedPersonas = ['su-shi', 'guo-xi', 'john-ruskin']; // Default to 3 personas
  let previousSelection = selectedPersonas.slice();

  /**
   * Set the selected personas and emit change event
   * @param {string[]} personaIds - Array of persona IDs (可选择任意数量)
   * @returns {boolean} - True if successful, false if invalid
   */
  function setSelection(personaIds) {
    // Validate input type
    if (!Array.isArray(personaIds)) {
      console.error('PersonaSelection: personaIds must be an array');
      return false;
    }

    // CHANGED: 允许空数组（用户可以取消所有选择）
    // No minimum length validation

    // Validate persona IDs exist
    if (!window.VULCA_DATA || !window.VULCA_DATA.personas) {
      console.error('PersonaSelection: VULCA_DATA.personas not available');
      return false;
    }

    const validIds = window.VULCA_DATA.personas.map(p => p.id);
    const invalidIds = personaIds.filter(id => !validIds.includes(id));
    if (invalidIds.length > 0) {
      console.error('PersonaSelection: Invalid persona IDs:', invalidIds);
      return false;
    }

    // Store previous selection for potential rollback
    previousSelection = selectedPersonas.slice();

    // Update state
    selectedPersonas = personaIds.slice(); // Clone array

    // Persist to sessionStorage
    persistSelection();

    // Emit event
    emitChangeEvent();

    console.log('✓ Persona selection updated:', selectedPersonas);
    return true;
  }

  /**
   * Get current selection (returns a copy)
   * @returns {string[]} - Array of selected persona IDs
   */
  function getSelection() {
    return selectedPersonas.slice(); // Return copy to prevent mutation
  }

  /**
   * Emit custom event to notify listeners
   */
  function emitChangeEvent() {
    const event = new CustomEvent('persona:selectionChanged', {
      detail: {
        personas: selectedPersonas.slice(),
        count: selectedPersonas.length
      },
      bubbles: true
    });
    window.dispatchEvent(event);

    console.log('✓ Emitted persona:selectionChanged event:', {
      personas: selectedPersonas,
      count: selectedPersonas.length
    });
  }

  /**
   * Persist selection to sessionStorage
   */
  function persistSelection() {
    try {
      sessionStorage.setItem('vulca-persona-selection', JSON.stringify(selectedPersonas));
    } catch (e) {
      console.warn('PersonaSelection: sessionStorage unavailable', e);
    }
  }

  /**
   * Restore selection from sessionStorage
   */
  function restoreSelection() {
    try {
      const stored = sessionStorage.getItem('vulca-persona-selection');
      if (stored) {
        const parsed = JSON.parse(stored);

        // Validate
        if (Array.isArray(parsed) && parsed.length > 0 && parsed.length <= 3) {
          // Verify all IDs are valid
          if (window.VULCA_DATA && window.VULCA_DATA.personas) {
            const validIds = window.VULCA_DATA.personas.map(p => p.id);
            const allValid = parsed.every(id => validIds.includes(id));

            if (allValid) {
              selectedPersonas = parsed;
              console.log('✓ Restored persona selection from sessionStorage:', selectedPersonas);
              return true;
            }
          }
        }
      }
    } catch (e) {
      console.warn('PersonaSelection: Failed to restore from sessionStorage', e);
    }
    return false;
  }

  /**
   * Initialize state manager
   */
  function init() {
    // Restore from sessionStorage if available
    const restored = restoreSelection();

    if (!restored) {
      console.log('✓ Persona selection initialized with defaults:', selectedPersonas);
    }

    // Render badges from data
    renderBadges();

    // Sync badges with current selection (default or restored)
    syncBadgesWithState();

    // Initialize UI handlers (after badges exist)
    initUIHandlers();
  }

  /**
   * Initialize UI event handlers
   * Note: Badge event listeners are now attached in createBadgeElement()
   */
  function initUIHandlers() {
    // Badge handlers are attached during badge creation in createBadgeElement()
    // This function is kept for potential future global event handlers
    console.log('✓ UI handlers initialized');
  }

  /**
   * Handle single click - toggle selection
   */
  function handleBadgeSingleClick(personaId, badge) {
    const isCurrentlySelected = selectedPersonas.includes(personaId);

    let newSelection;
    if (isCurrentlySelected) {
      // 单击已选中的badge - 取消选择
      newSelection = selectedPersonas.filter(id => id !== personaId);
    } else {
      // 单击未选中的badge - 添加选择
      newSelection = [...selectedPersonas, personaId];
    }

    console.log(`Single click: ${personaId}, new selection:`, newSelection);

    // Update global state
    const success = setSelection(newSelection);
    if (success) {
      syncBadgesWithState();
      updateSelectionCount(newSelection.length);
    }
  }

  /**
   * Handle double click - force deselect
   */
  function handleBadgeDoubleClick(personaId, badge) {
    const isCurrentlySelected = selectedPersonas.includes(personaId);

    if (isCurrentlySelected) {
      // 双击已选中的badge - 强制取消选择
      const newSelection = selectedPersonas.filter(id => id !== personaId);

      console.log(`Double click: ${personaId}, deselecting. New selection:`, newSelection);

      const success = setSelection(newSelection);
      if (success) {
        syncBadgesWithState();
        updateSelectionCount(newSelection.length);
      }
    } else {
      // 双击未选中的badge - 也是选择（与单击相同）
      handleBadgeSingleClick(personaId, badge);
    }
  }

  /**
   * Sync badges with current state
   */
  function syncBadgesWithState() {
    const badges = document.querySelectorAll('.persona-badge');

    badges.forEach(badge => {
      const personaId = badge.dataset.persona;
      const isSelected = selectedPersonas.includes(personaId);

      if (isSelected) {
        badge.classList.add('active');
        badge.setAttribute('aria-pressed', 'true');
      } else {
        badge.classList.remove('active');
        badge.setAttribute('aria-pressed', 'false');
      }
    });

    console.log('✓ Badges synced with state:', selectedPersonas);
  }

  /**
   * Update aria-live selection count
   */
  function updateSelectionCount(count) {
    const countElement = document.getElementById('persona-count');
    if (countElement) {
      countElement.textContent = `已选择 ${count} 位评论家`;
    }
  }

  /**
   * Create a badge element for a persona
   * @param {Object} persona - Persona object from VULCA_DATA
   * @returns {HTMLButtonElement} - Configured badge button
   */
  function createBadgeElement(persona) {
    const badge = document.createElement('button');
    badge.className = 'persona-badge';
    badge.dataset.persona = persona.id;
    badge.setAttribute('aria-pressed', 'false');
    badge.setAttribute('aria-label', `${persona.nameZh} ${persona.nameEn}`);

    const nameZh = document.createElement('span');
    nameZh.className = 'badge-name';
    nameZh.textContent = persona.nameZh;

    const nameEn = document.createElement('span');
    nameEn.className = 'badge-name-en';
    nameEn.textContent = persona.nameEn;

    badge.appendChild(nameZh);
    badge.appendChild(nameEn);

    // Attach event listeners (single/double-click logic)
    let clickTimeout = null;
    let lastClickTime = 0;
    let lastClickedBadge = null;

    badge.addEventListener('click', (event) => {
      const currentTime = Date.now();
      const timeSinceLastClick = currentTime - lastClickTime;

      if (timeSinceLastClick < 300 && lastClickedBadge === badge) {
        // Double click
        clearTimeout(clickTimeout);
        handleBadgeDoubleClick(persona.id, badge);
        lastClickTime = 0;
        lastClickedBadge = null;
      } else {
        // Single click
        clearTimeout(clickTimeout);
        clickTimeout = setTimeout(() => {
          handleBadgeSingleClick(persona.id, badge);
        }, 300);
        lastClickTime = currentTime;
        lastClickedBadge = badge;
      }
    });

    return badge;
  }

  /**
   * Render all persona badges from data
   */
  function renderBadges() {
    const container = document.getElementById('persona-badges-container');
    if (!container) {
      console.error('PersonaSelection: badges container not found');
      return;
    }

    if (!window.VULCA_DATA || !window.VULCA_DATA.personas) {
      console.error('PersonaSelection: VULCA_DATA.personas not available');
      return;
    }

    const personas = window.VULCA_DATA.personas;
    if (!Array.isArray(personas) || personas.length === 0) {
      console.warn('PersonaSelection: personas array is empty');
      return;
    }

    // Clear existing badges
    container.innerHTML = '';

    // Render each persona
    personas.forEach(persona => {
      if (!persona.id || !persona.nameZh || !persona.nameEn) {
        console.warn('PersonaSelection: skipping invalid persona', persona);
        return;
      }

      const badge = createBadgeElement(persona);
      container.appendChild(badge);
    });

    console.log(`✓ Rendered ${personas.length} persona badges`);
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  return {
    setSelection,
    getSelection
  };
})();

console.log('✓ Persona selection state manager loaded');
