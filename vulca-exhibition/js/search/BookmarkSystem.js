/**
 * BookmarkSystem - Bookmark management with localStorage persistence
 *
 * Phase 5 Task 5.3: Bookmark Persistence System
 * Provides bookmark creation, editing, and persistence
 */

class BookmarkSystem {
  constructor(options = {}) {
    this.bookmarks = []; // In-memory bookmark list
    this.maxBookmarks = options.maxBookmarks || 100;
    this.storageKey = options.storageKey || 'vulca-bookmarks';

    // Load bookmarks from localStorage
    this.loadFromStorage();

    console.log('✅ BookmarkSystem initialized with ' + this.bookmarks.length + ' bookmarks');
  }

  /**
   * Load bookmarks from localStorage
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.bookmarks = JSON.parse(stored);
        console.log(`✅ Loaded ${this.bookmarks.length} bookmarks from localStorage`);
      }
    } catch (error) {
      console.warn('⚠️  Failed to load bookmarks from localStorage:', error);
      this.bookmarks = [];
    }
  }

  /**
   * Save bookmarks to localStorage
   */
  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.bookmarks));
      console.log(`✅ Saved ${this.bookmarks.length} bookmarks to localStorage`);
    } catch (error) {
      console.warn('⚠️  Failed to save bookmarks to localStorage:', error);
    }
  }

  /**
   * Add a bookmark
   */
  addBookmark(critique, notes = '', tags = []) {
    // Check max bookmarks
    if (this.bookmarks.length >= this.maxBookmarks) {
      console.warn(`⚠️  Bookmark limit (${this.maxBookmarks}) reached`);
      return false;
    }

    // Check if already bookmarked
    if (this.isBookmarked(critique.artworkId, critique.personaId)) {
      console.warn('⚠️  This critique is already bookmarked');
      return false;
    }

    const bookmark = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      artworkId: critique.artworkId,
      personaId: critique.personaId,
      title: critique.title,
      notes: notes,
      tags: Array.isArray(tags) ? tags : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.bookmarks.push(bookmark);
    this.saveToStorage();

    console.log(`✅ Bookmarked: ${critique.personaId} - ${critique.artworkId}`);
    return bookmark;
  }

  /**
   * Remove a bookmark
   */
  removeBookmark(bookmarkId) {
    const index = this.bookmarks.findIndex((b) => b.id === bookmarkId);
    if (index > -1) {
      const bookmark = this.bookmarks[index];
      this.bookmarks.splice(index, 1);
      this.saveToStorage();

      console.log(`✅ Removed bookmark: ${bookmark.personaId} - ${bookmark.artworkId}`);
      return true;
    }

    return false;
  }

  /**
   * Update bookmark notes and tags
   */
  updateBookmark(bookmarkId, notes = '', tags = []) {
    const bookmark = this.bookmarks.find((b) => b.id === bookmarkId);
    if (bookmark) {
      bookmark.notes = notes;
      bookmark.tags = Array.isArray(tags) ? tags : [];
      bookmark.updatedAt = new Date().toISOString();
      this.saveToStorage();

      console.log(`✅ Updated bookmark: ${bookmarkId}`);
      return bookmark;
    }

    return null;
  }

  /**
   * Check if a critique is bookmarked
   */
  isBookmarked(artworkId, personaId) {
    return this.bookmarks.some(
      (b) => b.artworkId === artworkId && b.personaId === personaId
    );
  }

  /**
   * Get bookmark by ID
   */
  getBookmark(bookmarkId) {
    return this.bookmarks.find((b) => b.id === bookmarkId);
  }

  /**
   * Get bookmark by critique
   */
  getBookmarkByCritique(artworkId, personaId) {
    return this.bookmarks.find(
      (b) => b.artworkId === artworkId && b.personaId === personaId
    );
  }

  /**
   * Get all bookmarks
   */
  getAllBookmarks() {
    return this.bookmarks;
  }

  /**
   * Get bookmarks by tag
   */
  getBookmarksByTag(tag) {
    return this.bookmarks.filter((b) => b.tags.includes(tag));
  }

  /**
   * Get unique tags
   */
  getUniqueTags() {
    const tags = new Set();
    this.bookmarks.forEach((b) => {
      b.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }

  /**
   * Search bookmarks
   */
  searchBookmarks(query) {
    const lowerQuery = query.toLowerCase();
    return this.bookmarks.filter((b) => {
      return (
        b.title.toLowerCase().includes(lowerQuery) ||
        b.notes.toLowerCase().includes(lowerQuery) ||
        b.personaId.toLowerCase().includes(lowerQuery) ||
        b.artworkId.toLowerCase().includes(lowerQuery) ||
        b.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    });
  }

  /**
   * Export bookmarks as JSON
   */
  exportAsJSON() {
    return {
      version: '1.0',
      exportDate: new Date().toISOString(),
      bookmarkCount: this.bookmarks.length,
      bookmarks: this.bookmarks,
    };
  }

  /**
   * Export bookmarks as CSV
   */
  exportAsCSV() {
    const headers = ['ID', 'Artwork', 'Persona', 'Title', 'Notes', 'Tags', 'Created', 'Updated'];
    const rows = this.bookmarks.map((b) => [
      b.id,
      b.artworkId,
      b.personaId,
      `"${b.title.replace(/"/g, '""')}"`,
      `"${b.notes.replace(/"/g, '""')}"`,
      `"${b.tags.join(', ')}"`,
      b.createdAt,
      b.updatedAt,
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((r) => r.join(',')),
    ].join('\n');

    return csv;
  }

  /**
   * Download bookmarks as JSON file
   */
  downloadAsJSON() {
    const data = this.exportAsJSON();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `bookmarks-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('✅ Downloaded bookmarks as JSON');
  }

  /**
   * Download bookmarks as CSV file
   */
  downloadAsCSV() {
    const csv = this.exportAsCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `bookmarks-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('✅ Downloaded bookmarks as CSV');
  }

  /**
   * Clear all bookmarks
   */
  clearAll() {
    this.bookmarks = [];
    this.saveToStorage();
    console.log('🗑️  All bookmarks cleared');
  }

  /**
   * Get stats
   */
  getStats() {
    return {
      totalBookmarks: this.bookmarks.length,
      maxBookmarks: this.maxBookmarks,
      isFull: this.bookmarks.length >= this.maxBookmarks,
      uniqueArtworks: new Set(this.bookmarks.map((b) => b.artworkId)).size,
      uniquePersonas: new Set(this.bookmarks.map((b) => b.personaId)).size,
      uniqueTags: this.getUniqueTags().length,
    };
  }
}

// Make globally accessible
window.BookmarkSystem = BookmarkSystem;
