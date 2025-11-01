/**
 * ShareSystem - URL-based state sharing and persistence
 *
 * Phase 5 Task 5.5: URL-Based Sharing System
 * Serializes application state to URL parameters for sharing and persistence
 */

class ShareSystem {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || window.location.origin + window.location.pathname;
    this.maxUrlLength = options.maxUrlLength || 2048;
    this.onStateRestore = options.onStateRestore || null;

    this.currentState = {
      searchQuery: '',
      searchResults: [],
      filterPersonas: [],
      filterArtworks: [],
      filterRPAIT: null,
      filterScoreRange: [0, 10],
      filterLogic: 'AND',
      bookmarkIds: [],
    };

    this.init();
  }

  /**
   * Initialize share system
   */
  init() {
    // Check URL parameters on page load
    this.restoreStateFromUrl();
    console.log('✅ ShareSystem initialized');
  }

  /**
   * Serialize state to Base64 string
   */
  serializeState(state = null) {
    const stateObj = state || this.currentState;
    const json = JSON.stringify(stateObj);
    const base64 = btoa(unescape(encodeURIComponent(json)));
    return base64;
  }

  /**
   * Deserialize state from Base64 string
   */
  deserializeState(base64) {
    try {
      const json = decodeURIComponent(escape(atob(base64)));
      const state = JSON.parse(json);
      return state;
    } catch (error) {
      console.warn('⚠️  Failed to deserialize state:', error);
      return null;
    }
  }

  /**
   * Compress state for shorter URLs
   */
  compressState(state) {
    // Create a compact representation
    const compact = {
      q: state.searchQuery || '',
      p: state.filterPersonas.join('|') || '',
      a: state.filterArtworks.join('|') || '',
      r: state.filterRPAIT || '',
      s: state.filterScoreRange.join('-') || '0-10',
      l: state.filterLogic || 'AND',
      b: state.bookmarkIds.join('|') || '',
    };

    // Remove empty fields
    Object.keys(compact).forEach(key => {
      if (compact[key] === '' || compact[key] === 'AND') {
        delete compact[key];
      }
    });

    return compact;
  }

  /**
   * Decompress state from compact representation
   */
  decompressState(compact) {
    return {
      searchQuery: compact.q || '',
      searchResults: [],
      filterPersonas: compact.p ? compact.p.split('|') : [],
      filterArtworks: compact.a ? compact.a.split('|') : [],
      filterRPAIT: compact.r || null,
      filterScoreRange: compact.s ? compact.s.split('-').map(Number) : [0, 10],
      filterLogic: compact.l || 'AND',
      bookmarkIds: compact.b ? compact.b.split('|') : [],
    };
  }

  /**
   * Update state (typically called by search/filter systems)
   */
  updateState(partialState) {
    this.currentState = { ...this.currentState, ...partialState };
  }

  /**
   * Generate shareable URL with state
   */
  generateShareUrl(state = null) {
    const stateObj = state || this.currentState;
    const compact = this.compressState(stateObj);

    // Properly encode Unicode characters before Base64
    const jsonString = JSON.stringify(compact);
    const utf8Bytes = unescape(encodeURIComponent(jsonString));
    const base64 = btoa(utf8Bytes);

    // Create short URL
    const params = new URLSearchParams();
    params.append('state', base64);

    const url = `${this.baseUrl}?${params.toString()}`;

    if (url.length > this.maxUrlLength) {
      console.warn(`⚠️  Generated URL (${url.length} chars) exceeds max length (${this.maxUrlLength} chars)`);
    }

    return url;
  }

  /**
   * Restore state from URL parameters
   */
  restoreStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const stateParam = params.get('state');

    if (!stateParam) {
      console.log('ℹ️  No shared state in URL');
      return null;
    }

    try {
      const compact = JSON.parse(atob(stateParam));
      const restoredState = this.decompressState(compact);
      this.currentState = restoredState;

      if (this.onStateRestore) {
        this.onStateRestore(restoredState);
      }

      console.log('✅ State restored from URL:', restoredState);
      return restoredState;
    } catch (error) {
      console.warn('⚠️  Failed to restore state from URL:', error);
      return null;
    }
  }

  /**
   * Copy share URL to clipboard
   */
  copyShareUrlToClipboard(state = null) {
    const url = this.generateShareUrl(state);

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        console.log('✅ Share URL copied to clipboard');
      }).catch(error => {
        console.warn('⚠️  Failed to copy to clipboard:', error);
        this.fallbackCopyToClipboard(url);
      });
    } else {
      this.fallbackCopyToClipboard(url);
    }
  }

  /**
   * Fallback copy to clipboard
   */
  fallbackCopyToClipboard(url) {
    const textarea = document.createElement('textarea');
    textarea.value = url;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    console.log('✅ Share URL copied to clipboard (fallback)');
  }

  /**
   * Generate QR code URL (using external service)
   */
  generateQRCode(state = null, options = {}) {
    const url = this.generateShareUrl(state);
    const qrSize = options.size || 200;
    const qrFormat = options.format || 'png';

    // Using QR code generation API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(url)}&format=${qrFormat}`;

    return qrUrl;
  }

  /**
   * Create shareable link modal
   */
  createShareModal(state = null) {
    const stateObj = state || this.currentState;
    const shareUrl = this.generateShareUrl(stateObj);

    // Modal container
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 1002;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `;

    // Modal content
    const content = document.createElement('div');
    content.className = 'share-content';
    content.style.cssText = `
      background: white;
      border-radius: 8px;
      padding: 30px;
      max-width: 600px;
      width: 100%;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    `;

    // Title
    const title = document.createElement('h2');
    title.textContent = '分享搜索结果';
    title.style.cssText = `
      margin: 0 0 20px 0;
      font-size: 22px;
      font-weight: 600;
    `;
    content.appendChild(title);

    // Share URL section
    const urlSection = document.createElement('div');
    urlSection.style.cssText = `
      margin-bottom: 20px;
    `;

    const urlLabel = document.createElement('label');
    urlLabel.textContent = '分享链接';
    urlLabel.style.cssText = `
      display: block;
      font-size: 12px;
      color: #666;
      margin-bottom: 8px;
      font-weight: 600;
    `;
    urlSection.appendChild(urlLabel);

    const urlContainer = document.createElement('div');
    urlContainer.style.cssText = `
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
    `;

    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.value = shareUrl;
    urlInput.readOnly = true;
    urlInput.style.cssText = `
      flex: 1;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 12px;
      font-family: monospace;
      background: #f9f9f9;
    `;
    urlContainer.appendChild(urlInput);

    const copyBtn = document.createElement('button');
    copyBtn.textContent = '复制';
    copyBtn.style.cssText = `
      padding: 12px 20px;
      background: #0066cc;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.2s;
    `;
    copyBtn.addEventListener('click', () => {
      this.fallbackCopyToClipboard(shareUrl);
      copyBtn.textContent = '已复制';
      setTimeout(() => {
        copyBtn.textContent = '复制';
      }, 2000);
    });
    copyBtn.addEventListener('mouseover', () => {
      copyBtn.style.background = '#0052a3';
    });
    copyBtn.addEventListener('mouseout', () => {
      copyBtn.style.background = '#0066cc';
    });
    urlContainer.appendChild(copyBtn);
    urlSection.appendChild(urlContainer);

    // URL length info
    const urlInfo = document.createElement('p');
    urlInfo.textContent = `链接长度: ${shareUrl.length} / ${this.maxUrlLength} 字符`;
    urlInfo.style.cssText = `
      margin: 0;
      font-size: 12px;
      color: ${shareUrl.length > this.maxUrlLength * 0.9 ? '#ff6b6b' : '#999'};
    `;
    urlSection.appendChild(urlInfo);

    content.appendChild(urlSection);

    // QR Code section
    const qrSection = document.createElement('div');
    qrSection.style.cssText = `
      text-align: center;
      padding: 20px;
      border: 1px solid #eee;
      border-radius: 4px;
      background: #fafafa;
    `;

    const qrLabel = document.createElement('p');
    qrLabel.textContent = '二维码';
    qrLabel.style.cssText = `
      margin: 0 0 15px 0;
      font-size: 12px;
      color: #666;
      font-weight: 600;
    `;
    qrSection.appendChild(qrLabel);

    const qrImg = document.createElement('img');
    qrImg.src = this.generateQRCode(stateObj);
    qrImg.style.cssText = `
      width: 200px;
      height: 200px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
    `;
    qrSection.appendChild(qrImg);

    content.appendChild(qrSection);

    // Footer
    const footer = document.createElement('div');
    footer.style.cssText = `
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '关闭';
    closeBtn.style.cssText = `
      padding: 10px 20px;
      background: #f0f0f0;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    `;
    closeBtn.addEventListener('click', () => {
      modal.remove();
    });
    closeBtn.addEventListener('mouseover', () => {
      closeBtn.style.background = '#e0e0e0';
    });
    closeBtn.addEventListener('mouseout', () => {
      closeBtn.style.background = '#f0f0f0';
    });
    footer.appendChild(closeBtn);

    content.appendChild(footer);
    modal.appendChild(content);

    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    // Close on escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);

    return modal;
  }

  /**
   * Open share modal
   */
  openShareModal(state = null) {
    const modal = this.createShareModal(state);
    document.body.appendChild(modal);
    console.log('📤 Share modal opened');
  }

  /**
   * Export state as JSON file
   */
  exportStateAsJSON(state = null, filename = null) {
    const stateObj = state || this.currentState;
    const timestamp = new Date().toISOString();
    const defaultFilename = `vulca-state-${timestamp.split('T')[0]}.json`;

    const exportData = {
      timestamp: timestamp,
      url: this.generateShareUrl(stateObj),
      state: stateObj,
      metadata: {
        searchQueryLength: stateObj.searchQuery.length,
        searchResultsCount: stateObj.searchResults.length,
        filtersActive: Object.values(stateObj).filter(v => v && v.length > 0).length,
      },
    };

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename || defaultFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`✅ State exported as JSON: ${filename || defaultFilename}`);
  }

  /**
   * Get state statistics
   */
  getStateStats() {
    return {
      hasSearchQuery: !!this.currentState.searchQuery,
      searchQueryLength: this.currentState.searchQuery.length,
      searchResultsCount: this.currentState.searchResults.length,
      filterPersonasCount: this.currentState.filterPersonas.length,
      filterArtworksCount: this.currentState.filterArtworks.length,
      hasRPAITFilter: !!this.currentState.filterRPAIT,
      bookmarkIdsCount: this.currentState.bookmarkIds.length,
      shareUrlLength: this.generateShareUrl().length,
      maxUrlLength: this.maxUrlLength,
    };
  }

  /**
   * Clear state
   */
  clearState() {
    this.currentState = {
      searchQuery: '',
      searchResults: [],
      filterPersonas: [],
      filterArtworks: [],
      filterRPAIT: null,
      filterScoreRange: [0, 10],
      filterLogic: 'AND',
      bookmarkIds: [],
    };
    console.log('🗑️  State cleared');
  }
}

// Make globally accessible
window.ShareSystem = ShareSystem;
