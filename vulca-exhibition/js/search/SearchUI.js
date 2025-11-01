/**
 * SearchUI - Interactive search interface
 *
 * Phase 5 Task 5.1: Full-Text Search System
 * Provides UI components for search input, results display, and filtering
 */

class SearchUI {
  constructor(options = {}) {
    this.searchIndex = options.searchIndex || null;
    this.container = options.container || null;
    this.onResultSelect = options.onResultSelect || null;

    this.isOpen = false;
    this.currentQuery = '';
    this.currentResults = [];
    this.selectedResultIndex = 0;

    // UI elements
    this.searchModal = null;
    this.searchInput = null;
    this.resultsContainer = null;
    this.suggestionsContainer = null;

    this.init();
  }

  /**
   * Initialize UI elements
   */
  init() {
    if (!this.searchIndex) {
      console.warn('⚠️  SearchUI: No searchIndex provided');
      return;
    }

    this.createSearchModal();
    this.attachEventListeners();

    console.log('✅ SearchUI initialized');
  }

  /**
   * Create search modal HTML structure
   */
  createSearchModal() {
    // Modal container
    this.searchModal = document.createElement('div');
    this.searchModal.className = 'search-modal';
    this.searchModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 1000;
      display: none;
      flex-direction: column;
      align-items: center;
      padding-top: 10vh;
    `;

    // Search container
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.style.cssText = `
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      overflow: hidden;
    `;

    // Search input area
    const inputArea = document.createElement('div');
    inputArea.className = 'search-input-area';
    inputArea.style.cssText = `
      padding: 20px;
      border-bottom: 1px solid #eee;
    `;

    // Input field
    this.searchInput = document.createElement('input');
    this.searchInput.type = 'text';
    this.searchInput.placeholder = '搜索评论、艺术品或评论家...';
    this.searchInput.className = 'search-input';
    this.searchInput.style.cssText = `
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s;
    `;

    this.searchInput.addEventListener('focus', (e) => {
      e.target.style.borderColor = '#0066cc';
    });
    this.searchInput.addEventListener('blur', (e) => {
      e.target.style.borderColor = '#ddd';
    });

    inputArea.appendChild(this.searchInput);

    // Suggestions container
    this.suggestionsContainer = document.createElement('div');
    this.suggestionsContainer.className = 'search-suggestions';
    this.suggestionsContainer.style.cssText = `
      padding: 0 20px 10px;
      display: none;
      max-height: 100px;
      overflow-y: auto;
    `;
    inputArea.appendChild(this.suggestionsContainer);

    // Results container
    this.resultsContainer = document.createElement('div');
    this.resultsContainer.className = 'search-results';
    this.resultsContainer.style.cssText = `
      max-height: 50vh;
      overflow-y: auto;
      padding: 10px 0;
    `;

    searchContainer.appendChild(inputArea);
    searchContainer.appendChild(this.resultsContainer);

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      width: 32px;
      height: 32px;
      border: none;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 20px;
      color: #666;
      transition: all 0.2s;
    `;
    closeBtn.addEventListener('click', () => this.close());
    closeBtn.addEventListener('mouseover', (e) => {
      e.target.style.background = '#f0f0f0';
      e.target.color = '#000';
    });
    closeBtn.addEventListener('mouseout', (e) => {
      e.target.style.background = 'white';
      e.target.color = '#666';
    });

    this.searchModal.appendChild(searchContainer);
    this.searchModal.appendChild(closeBtn);

    // Adjust close button positioning
    closeBtn.style.position = 'fixed';

    document.body.appendChild(this.searchModal);
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    if (!this.searchInput) return;

    // Search input
    this.searchInput.addEventListener('input', (e) => {
      const query = e.target.value;
      this.handleInput(query);
    });

    this.searchInput.addEventListener('keydown', (e) => {
      this.handleKeyboard(e);
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Global search trigger (Ctrl/Cmd + K)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.open();
      }
    });
  }

  /**
   * Handle input changes
   */
  handleInput(query) {
    this.currentQuery = query;
    this.selectedResultIndex = 0;

    if (query.length === 0) {
      this.resultsContainer.innerHTML = '';
      this.suggestionsContainer.style.display = 'none';
      return;
    }

    // Check if query is a Chinese character (CJK)
    const isChinese = /[\u4E00-\u9FFF]/.test(query);

    // Show suggestions for short queries (except Chinese single characters)
    if (query.length < 3 && !isChinese) {
      this.showSuggestions(query);
      return;
    }

    // For single Chinese characters or longer queries, perform search
    this.currentResults = this.searchIndex.search(query, {
      matchMode: 'any',
      useFuzzy: true,
    });

    this.displayResults();

    // Also show suggestions if we have them
    if (query.length < 3) {
      this.showSuggestions(query);
    } else {
      this.suggestionsContainer.style.display = 'none';
    }
  }

  /**
   * Show search suggestions (type-ahead)
   */
  showSuggestions(prefix) {
    const suggestions = this.searchIndex.getSuggestions(prefix, 5);

    if (suggestions.length === 0) {
      this.suggestionsContainer.style.display = 'none';
      return;
    }

    this.suggestionsContainer.innerHTML = suggestions.map((suggestion, idx) => `
      <button class="search-suggestion" data-suggestion="${suggestion}" style="
        display: inline-block;
        padding: 4px 12px;
        margin: 2px 4px;
        background: #f0f0f0;
        border: 1px solid #ddd;
        border-radius: 20px;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s;
      ">${suggestion}</button>
    `).join('');

    this.suggestionsContainer.style.display = 'block';

    // Attach click handlers to suggestions
    this.suggestionsContainer.querySelectorAll('.search-suggestion').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.searchInput.value = e.target.dataset.suggestion;
        this.handleInput(e.target.dataset.suggestion);
        this.searchInput.focus();
      });
      btn.addEventListener('mouseover', (e) => {
        e.target.style.background = '#e0e0e0';
      });
      btn.addEventListener('mouseout', (e) => {
        e.target.style.background = '#f0f0f0';
      });
    });
  }

  /**
   * Display search results
   */
  displayResults() {
    if (this.currentResults.length === 0) {
      this.resultsContainer.innerHTML = `
        <div style="padding: 40px 20px; text-align: center; color: #999;">
          没有找到相关结果
        </div>
      `;
      return;
    }

    this.resultsContainer.innerHTML = this.currentResults.map((result, idx) => `
      <div class="search-result" data-index="${idx}" style="
        padding: 12px 20px;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
        transition: background 0.2s;
        background: ${idx === this.selectedResultIndex ? '#f9f9f9' : 'white'};
      ">
        <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">
          ${result.critique.title || '未命名'}
        </div>
        <div style="font-size: 13px; color: #666; margin-bottom: 6px;">
          评论家: ${result.critique.personaId} | 作品: ${result.critique.artworkId}
        </div>
        <div style="font-size: 13px; color: #999; line-height: 1.4;">
          ${this.truncateText(result.critique.content, 100)}
        </div>
      </div>
    `).join('');

    // Attach click handlers
    this.resultsContainer.querySelectorAll('.search-result').forEach((el, idx) => {
      el.addEventListener('click', () => {
        this.selectResult(idx);
      });
      el.addEventListener('mouseover', () => {
        el.style.background = '#f9f9f9';
      });
      el.addEventListener('mouseout', () => {
        el.style.background = idx === this.selectedResultIndex ? '#f9f9f9' : 'white';
      });
    });
  }

  /**
   * Select a result and trigger callback
   */
  selectResult(index) {
    if (index < 0 || index >= this.currentResults.length) return;

    this.selectedResultIndex = index;
    const result = this.currentResults[index];

    if (this.onResultSelect) {
      this.onResultSelect(result.critique);
    }

    this.displayResults(); // Update highlight

    console.log(`✅ Selected: ${result.critique.personaId} - ${result.critique.artworkId}`);
  }

  /**
   * Handle keyboard navigation
   */
  handleKeyboard(e) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.selectResult(Math.min(this.selectedResultIndex + 1, this.currentResults.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.selectResult(Math.max(this.selectedResultIndex - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (this.currentResults.length > 0) {
          this.selectResult(this.selectedResultIndex);
          this.close();
        }
        break;
    }
  }

  /**
   * Truncate text to specified length
   */
  truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  /**
   * Open search modal
   */
  open() {
    this.isOpen = true;
    this.searchModal.style.display = 'flex';
    this.searchInput.focus();
    this.searchInput.value = '';
    this.currentQuery = '';
    this.currentResults = [];
    this.resultsContainer.innerHTML = '';
    this.suggestionsContainer.style.display = 'none';

    console.log('🔍 Search modal opened');
  }

  /**
   * Close search modal
   */
  close() {
    this.isOpen = false;
    this.searchModal.style.display = 'none';
    this.searchInput.value = '';
    this.currentQuery = '';
    this.currentResults = [];

    console.log('🔍 Search modal closed');
  }

  /**
   * Toggle search modal
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Get current query
   */
  getQuery() {
    return this.currentQuery;
  }

  /**
   * Get current results
   */
  getResults() {
    return this.currentResults;
  }
}

// Make globally accessible
window.SearchUI = SearchUI;
