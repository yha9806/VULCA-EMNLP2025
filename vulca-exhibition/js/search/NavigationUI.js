/**
 * NavigationUI - Browse history and discovery helpers
 *
 * Phase 5 Task 5.6: Navigation & Discovery Helpers
 * Provides navigation breadcrumbs, history tracking, and discovery features
 */

class NavigationUI {
  constructor(options = {}) {
    this.container = options.container || null;
    this.maxHistoryItems = options.maxHistoryItems || 20;
    this.storageKey = options.storageKey || 'vulca-navigation-history';

    this.searchHistory = [];
    this.browseHistory = [];
    this.currentPath = [];

    this.init();
  }

  /**
   * Initialize navigation UI
   */
  init() {
    this.loadHistoryFromStorage();
    this.createNavigationBar();
    console.log('✅ NavigationUI initialized');
  }

  /**
   * Load history from localStorage
   */
  loadHistoryFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.searchHistory = data.searchHistory || [];
        this.browseHistory = data.browseHistory || [];
        console.log(`✅ Loaded ${this.searchHistory.length} search and ${this.browseHistory.length} browse history items`);
      }
    } catch (error) {
      console.warn('⚠️  Failed to load navigation history:', error);
    }
  }

  /**
   * Save history to localStorage
   */
  saveHistoryToStorage() {
    try {
      const data = {
        searchHistory: this.searchHistory,
        browseHistory: this.browseHistory,
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.warn('⚠️  Failed to save navigation history:', error);
    }
  }

  /**
   * Create navigation bar HTML
   */
  createNavigationBar() {
    const navbar = document.createElement('div');
    navbar.className = 'navigation-bar';
    navbar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 40px;
      background: linear-gradient(to right, #f5f5f5, #fafafa);
      border-bottom: 1px solid #ddd;
      z-index: 100;
      display: flex;
      align-items: center;
      padding: 0 15px;
      gap: 10px;
      overflow-x: auto;
    `;

    // Breadcrumb trail
    const breadcrumbContainer = document.createElement('div');
    breadcrumbContainer.className = 'breadcrumb-container';
    breadcrumbContainer.style.cssText = `
      display: flex;
      gap: 5px;
      align-items: center;
      font-size: 12px;
      white-space: nowrap;
    `;

    const homeBreadcrumb = document.createElement('span');
    homeBreadcrumb.textContent = '🏠';
    homeBreadcrumb.style.cssText = `
      cursor: pointer;
      padding: 5px 8px;
      border-radius: 3px;
      transition: background 0.2s;
    `;
    homeBreadcrumb.addEventListener('click', () => this.resetNavigation());
    homeBreadcrumb.addEventListener('mouseover', () => {
      homeBreadcrumb.style.background = '#e8e8e8';
    });
    homeBreadcrumb.addEventListener('mouseout', () => {
      homeBreadcrumb.style.background = 'transparent';
    });
    breadcrumbContainer.appendChild(homeBreadcrumb);

    // Add current path breadcrumbs
    this.updateBreadcrumbs(breadcrumbContainer);

    navbar.appendChild(breadcrumbContainer);

    // History dropdown button
    const historyBtn = document.createElement('button');
    historyBtn.textContent = '⏱️ 历史';
    historyBtn.style.cssText = `
      padding: 6px 12px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 3px;
      cursor: pointer;
      font-size: 11px;
      white-space: nowrap;
      transition: background 0.2s;
    `;
    historyBtn.addEventListener('click', () => this.showHistoryPopover(historyBtn));
    historyBtn.addEventListener('mouseover', () => {
      historyBtn.style.background = '#f0f0f0';
    });
    historyBtn.addEventListener('mouseout', () => {
      historyBtn.style.background = 'white';
    });
    navbar.appendChild(historyBtn);

    // Search history dropdown button
    const searchHistoryBtn = document.createElement('button');
    searchHistoryBtn.textContent = '🔍 搜索';
    searchHistoryBtn.style.cssText = `
      padding: 6px 12px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 3px;
      cursor: pointer;
      font-size: 11px;
      white-space: nowrap;
      transition: background 0.2s;
    `;
    searchHistoryBtn.addEventListener('click', () => this.showSearchHistoryPopover(searchHistoryBtn));
    searchHistoryBtn.addEventListener('mouseover', () => {
      searchHistoryBtn.style.background = '#f0f0f0';
    });
    searchHistoryBtn.addEventListener('mouseout', () => {
      searchHistoryBtn.style.background = 'white';
    });
    navbar.appendChild(searchHistoryBtn);

    document.body.appendChild(navbar);

    // Adjust main content top padding to account for navbar
    const pixiContainer = document.getElementById('pixi-container');
    if (pixiContainer) {
      pixiContainer.style.marginTop = '40px';
    }
  }

  /**
   * Update breadcrumb trail
   */
  updateBreadcrumbs(container) {
    // Remove all breadcrumbs except home
    const breadcrumbs = container.querySelectorAll('.breadcrumb-item');
    breadcrumbs.forEach(b => b.remove());

    // Add new breadcrumbs
    this.currentPath.forEach((item, index) => {
      const separator = document.createElement('span');
      separator.textContent = '›';
      separator.style.cssText = 'color: #999; margin: 0 3px;';
      container.appendChild(separator);

      const breadcrumb = document.createElement('span');
      breadcrumb.className = 'breadcrumb-item';
      breadcrumb.textContent = item.label;
      breadcrumb.style.cssText = `
        cursor: pointer;
        padding: 5px 8px;
        border-radius: 3px;
        color: ${index === this.currentPath.length - 1 ? '#333' : '#0066cc'};
        transition: background 0.2s;
      `;

      if (index < this.currentPath.length - 1) {
        breadcrumb.addEventListener('click', () => {
          this.currentPath = this.currentPath.slice(0, index + 1);
          this.updateBreadcrumbs(container);
        });
        breadcrumb.addEventListener('mouseover', () => {
          breadcrumb.style.background = '#e8e8e8';
        });
        breadcrumb.addEventListener('mouseout', () => {
          breadcrumb.style.background = 'transparent';
        });
      }

      container.appendChild(breadcrumb);
    });
  }

  /**
   * Add item to current path
   */
  addToPath(label, type = 'search', data = {}) {
    this.currentPath.push({
      label: label,
      type: type,
      data: data,
      timestamp: Date.now(),
    });

    // Keep breadcrumbs at reasonable length
    if (this.currentPath.length > 5) {
      this.currentPath = this.currentPath.slice(-5);
    }

    // Update breadcrumb display
    const navbar = document.querySelector('.navigation-bar');
    if (navbar) {
      const breadcrumbContainer = navbar.querySelector('.breadcrumb-container');
      if (breadcrumbContainer) {
        this.updateBreadcrumbs(breadcrumbContainer);
      }
    }
  }

  /**
   * Reset navigation to home
   */
  resetNavigation() {
    this.currentPath = [];
    const navbar = document.querySelector('.navigation-bar');
    if (navbar) {
      const breadcrumbContainer = navbar.querySelector('.breadcrumb-container');
      if (breadcrumbContainer) {
        this.updateBreadcrumbs(breadcrumbContainer);
      }
    }
    console.log('🏠 Navigation reset to home');
  }

  /**
   * Add search query to history
   */
  addSearchHistory(query) {
    const item = {
      query: query,
      timestamp: Date.now(),
      results: 0, // Will be updated with actual results count
    };

    // Remove duplicate if exists
    this.searchHistory = this.searchHistory.filter(h => h.query !== query);

    // Add to front
    this.searchHistory.unshift(item);

    // Keep max items
    if (this.searchHistory.length > this.maxHistoryItems) {
      this.searchHistory = this.searchHistory.slice(0, this.maxHistoryItems);
    }

    this.saveHistoryToStorage();
  }

  /**
   * Add page visit to browse history
   */
  addBrowseHistory(artworkId, personaId, title) {
    const item = {
      artworkId: artworkId,
      personaId: personaId,
      title: title,
      timestamp: Date.now(),
    };

    // Remove duplicate if exists
    this.browseHistory = this.browseHistory.filter(
      h => !(h.artworkId === artworkId && h.personaId === personaId)
    );

    // Add to front
    this.browseHistory.unshift(item);

    // Keep max items
    if (this.browseHistory.length > this.maxHistoryItems) {
      this.browseHistory = this.browseHistory.slice(0, this.maxHistoryItems);
    }

    this.saveHistoryToStorage();
  }

  /**
   * Show history popover
   */
  showHistoryPopover(button) {
    // Remove existing popover if any
    const existing = document.querySelector('.history-popover');
    if (existing) {
      existing.remove();
      return;
    }

    const popover = document.createElement('div');
    popover.className = 'history-popover';
    popover.style.cssText = `
      position: absolute;
      top: 40px;
      left: ${button.offsetLeft}px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      min-width: 250px;
      max-width: 400px;
      max-height: 300px;
      overflow-y: auto;
      z-index: 1001;
    `;

    const title = document.createElement('div');
    title.style.cssText = `
      padding: 10px 15px;
      border-bottom: 1px solid #eee;
      font-weight: 600;
      font-size: 12px;
      color: #333;
    `;
    title.textContent = '浏览历史';
    popover.appendChild(title);

    if (this.browseHistory.length === 0) {
      const empty = document.createElement('div');
      empty.style.cssText = `
        padding: 20px 15px;
        text-align: center;
        color: #999;
        font-size: 12px;
      `;
      empty.textContent = '暂无历史记录';
      popover.appendChild(empty);
    } else {
      this.browseHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.style.cssText = `
          padding: 10px 15px;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          font-size: 12px;
          transition: background 0.2s;
        `;

        const title = document.createElement('div');
        title.textContent = item.title;
        title.style.cssText = `
          font-weight: 500;
          color: #333;
          margin-bottom: 3px;
        `;
        historyItem.appendChild(title);

        const info = document.createElement('div');
        info.textContent = `${item.personaId} • ${item.artworkId}`;
        info.style.cssText = `
          font-size: 11px;
          color: #999;
        `;
        historyItem.appendChild(info);

        historyItem.addEventListener('mouseover', () => {
          historyItem.style.background = '#f5f5f5';
        });
        historyItem.addEventListener('mouseout', () => {
          historyItem.style.background = 'transparent';
        });

        popover.appendChild(historyItem);
      });
    }

    // Clear button
    const clearBtn = document.createElement('div');
    clearBtn.style.cssText = `
      padding: 10px 15px;
      text-align: center;
      border-top: 1px solid #eee;
      color: #999;
      font-size: 11px;
      cursor: pointer;
      transition: background 0.2s;
    `;
    clearBtn.textContent = '清空历史';
    clearBtn.addEventListener('click', () => {
      this.browseHistory = [];
      this.saveHistoryToStorage();
      popover.remove();
      console.log('🗑️  Browse history cleared');
    });
    clearBtn.addEventListener('mouseover', () => {
      clearBtn.style.background = '#f0f0f0';
    });
    clearBtn.addEventListener('mouseout', () => {
      clearBtn.style.background = 'transparent';
    });
    popover.appendChild(clearBtn);

    document.body.appendChild(popover);

    // Close on outside click
    setTimeout(() => {
      document.addEventListener('click', function closePopover(e) {
        if (!popover.contains(e.target) && e.target !== button) {
          popover.remove();
          document.removeEventListener('click', closePopover);
        }
      });
    }, 0);
  }

  /**
   * Show search history popover
   */
  showSearchHistoryPopover(button) {
    // Remove existing popover if any
    const existing = document.querySelector('.search-history-popover');
    if (existing) {
      existing.remove();
      return;
    }

    const popover = document.createElement('div');
    popover.className = 'search-history-popover';
    popover.style.cssText = `
      position: absolute;
      top: 40px;
      left: ${button.offsetLeft}px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      min-width: 250px;
      max-width: 400px;
      max-height: 300px;
      overflow-y: auto;
      z-index: 1001;
    `;

    const title = document.createElement('div');
    title.style.cssText = `
      padding: 10px 15px;
      border-bottom: 1px solid #eee;
      font-weight: 600;
      font-size: 12px;
      color: #333;
    `;
    title.textContent = '搜索历史';
    popover.appendChild(title);

    if (this.searchHistory.length === 0) {
      const empty = document.createElement('div');
      empty.style.cssText = `
        padding: 20px 15px;
        text-align: center;
        color: #999;
        font-size: 12px;
      `;
      empty.textContent = '暂无搜索历史';
      popover.appendChild(empty);
    } else {
      this.searchHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.style.cssText = `
          padding: 10px 15px;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          font-size: 12px;
          transition: background 0.2s;
        `;

        const query = document.createElement('div');
        query.textContent = `"${item.query}"`;
        query.style.cssText = `
          font-weight: 500;
          color: #333;
          margin-bottom: 3px;
        `;
        historyItem.appendChild(query);

        const time = document.createElement('div');
        const ago = this.getTimeAgo(item.timestamp);
        time.textContent = ago;
        time.style.cssText = `
          font-size: 11px;
          color: #999;
        `;
        historyItem.appendChild(time);

        historyItem.addEventListener('mouseover', () => {
          historyItem.style.background = '#f5f5f5';
        });
        historyItem.addEventListener('mouseout', () => {
          historyItem.style.background = 'transparent';
        });
        historyItem.addEventListener('click', () => {
          // Trigger search with this query
          window.dispatchEvent(new CustomEvent('search-history-click', {
            detail: { query: item.query }
          }));
          popover.remove();
        });

        popover.appendChild(historyItem);
      });
    }

    // Clear button
    const clearBtn = document.createElement('div');
    clearBtn.style.cssText = `
      padding: 10px 15px;
      text-align: center;
      border-top: 1px solid #eee;
      color: #999;
      font-size: 11px;
      cursor: pointer;
      transition: background 0.2s;
    `;
    clearBtn.textContent = '清空历史';
    clearBtn.addEventListener('click', () => {
      this.searchHistory = [];
      this.saveHistoryToStorage();
      popover.remove();
      console.log('🗑️  Search history cleared');
    });
    clearBtn.addEventListener('mouseover', () => {
      clearBtn.style.background = '#f0f0f0';
    });
    clearBtn.addEventListener('mouseout', () => {
      clearBtn.style.background = 'transparent';
    });
    popover.appendChild(clearBtn);

    document.body.appendChild(popover);

    // Close on outside click
    setTimeout(() => {
      document.addEventListener('click', function closePopover(e) {
        if (!popover.contains(e.target) && e.target !== button) {
          popover.remove();
          document.removeEventListener('click', closePopover);
        }
      });
    }, 0);
  }

  /**
   * Get human-readable time ago string
   */
  getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;

    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
    return `${Math.floor(diff / 86400000)}天前`;
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      searchHistoryCount: this.searchHistory.length,
      browseHistoryCount: this.browseHistory.length,
      currentPathLength: this.currentPath.length,
      maxHistoryItems: this.maxHistoryItems,
    };
  }

  /**
   * Clear all history
   */
  clearAllHistory() {
    this.searchHistory = [];
    this.browseHistory = [];
    this.currentPath = [];
    this.saveHistoryToStorage();
    console.log('🗑️  All navigation history cleared');
  }
}

// Make globally accessible
window.NavigationUI = NavigationUI;
