/**
 * SearchIndex - Full-text search engine for exhibition critiques
 *
 * Phase 5 Task 5.1: Full-Text Search System
 * Provides tokenization, indexing, and ranked search capabilities
 */

class SearchIndex {
  constructor(options = {}) {
    this.critiques = []; // All critique documents
    this.index = new Map(); // term -> Set of critique indices
    this.documentIndex = new Map(); // docId -> critique document
    this.tokenCache = new Map(); // term -> normalized form

    // Configuration
    this.minTokenLength = options.minTokenLength || 2;
    this.maxResults = options.maxResults || 50;
    this.fuzzyThreshold = options.fuzzyThreshold || 0.8;

    // Stop words (common words to exclude from index)
    this.stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'is', 'are', 'was', 'been', 'be', 'have', 'has', 'had',
      '的', '了', '是', '在', '和', '与', '都', '有', '这', '那', '个', '为',
    ]);

    console.log('✅ SearchIndex initialized');
  }

  /**
   * Build index from critique data
   */
  buildIndex(critiques) {
    this.critiques = critiques;
    this.index.clear();
    this.documentIndex.clear();

    critiques.forEach((critique, idx) => {
      const docId = `${critique.artworkId}_${critique.personaId}`;
      this.documentIndex.set(docId, { ...critique, index: idx });

      // Tokenize and index critique content
      const tokens = this.tokenize(critique.title + ' ' + critique.content);
      tokens.forEach(token => {
        if (!this.index.has(token)) {
          this.index.set(token, new Set());
        }
        this.index.get(token).add(idx);
      });

      // Index metadata fields
      if (critique.personaId) {
        const personaToken = this.normalize(critique.personaId);
        if (!this.index.has(personaToken)) {
          this.index.set(personaToken, new Set());
        }
        this.index.get(personaToken).add(idx);
      }

      if (critique.artworkId) {
        const artworkToken = this.normalize(critique.artworkId);
        if (!this.index.has(artworkToken)) {
          this.index.set(artworkToken, new Set());
        }
        this.index.get(artworkToken).add(idx);
      }
    });

    console.log(`✅ SearchIndex built: ${critiques.length} documents, ${this.index.size} terms`);
  }

  /**
   * Normalize text (lowercase, remove punctuation)
   */
  normalize(text) {
    if (typeof text !== 'string') return '';

    // Handle Chinese and English text
    return text
      .toLowerCase()
      .replace(/[^\w\u4E00-\u9FFF]/g, '') // Keep word chars and Chinese
      .trim();
  }

  /**
   * Tokenize text into searchable terms
   */
  tokenize(text) {
    const tokens = [];
    const normalized = this.normalize(text);

    // Chinese tokenization (character-based)
    let i = 0;
    while (i < normalized.length) {
      const char = normalized[i];
      const isChinese = /[\u4E00-\u9FFF]/.test(char);

      if (isChinese) {
        // Single Chinese character tokens
        if (normalized.length > 0 && !this.stopWords.has(char)) {
          tokens.push(char);
        }
        i++;
      } else {
        // English word tokenization
        let word = '';
        while (i < normalized.length && /[a-z0-9]/.test(normalized[i])) {
          word += normalized[i];
          i++;
        }

        if (word.length >= this.minTokenLength && !this.stopWords.has(word)) {
          tokens.push(word);
        }
      }
    }

    return tokens;
  }

  /**
   * Levenshtein distance for fuzzy matching
   */
  levenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
    }

    return dp[m][n];
  }

  /**
   * Fuzzy search for a single term
   */
  fuzzySearch(term, maxDistance = 1) {
    const normalized = this.normalize(term);
    if (normalized.length < this.minTokenLength) return new Set();

    const matches = new Set();

    // Exact match first
    if (this.index.has(normalized)) {
      return this.index.get(normalized);
    }

    // Fuzzy matching
    for (const [indexedTerm, docs] of this.index.entries()) {
      const distance = this.levenshteinDistance(normalized, indexedTerm);
      if (distance <= maxDistance) {
        docs.forEach(doc => matches.add(doc));
      }
    }

    return matches;
  }

  /**
   * Search critiques by query
   */
  search(query, options = {}) {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const queryTerms = this.tokenize(query);
    if (queryTerms.length === 0) {
      return [];
    }

    // Search settings
    const filterPersona = options.personaId ? this.normalize(options.personaId) : null;
    const filterArtwork = options.artworkId ? this.normalize(options.artworkId) : null;
    const matchMode = options.matchMode || 'any'; // 'any' or 'all'
    const useFuzzy = options.useFuzzy !== false; // default true

    // Collect matching document indices
    let matches = null;

    queryTerms.forEach(term => {
      let termMatches;

      // Try exact match first
      if (this.index.has(term)) {
        termMatches = this.index.get(term);
      } else if (useFuzzy) {
        // Fall back to fuzzy matching
        termMatches = this.fuzzySearch(term, 1);
      } else {
        termMatches = new Set();
      }

      if (matches === null) {
        matches = new Set(termMatches);
      } else {
        if (matchMode === 'all') {
          // Intersect (all terms must match)
          matches = new Set([...matches].filter(x => termMatches.has(x)));
        } else {
          // Union (any term matches)
          termMatches.forEach(m => matches.add(m));
        }
      }
    });

    if (!matches || matches.size === 0) {
      return [];
    }

    // Apply filters
    let results = Array.from(matches).map(idx => ({
      critique: this.critiques[idx],
      index: idx,
    }));

    if (filterPersona) {
      results = results.filter(r => this.normalize(r.critique.personaId) === filterPersona);
    }

    if (filterArtwork) {
      results = results.filter(r => this.normalize(r.critique.artworkId) === filterArtwork);
    }

    // Rank by relevance (term frequency)
    results.sort((a, b) => {
      const textA = a.critique.title + ' ' + a.critique.content;
      const textB = b.critique.title + ' ' + b.critique.content;

      let scoreA = 0;
      let scoreB = 0;

      queryTerms.forEach(term => {
        const countA = (textA.match(new RegExp(term, 'gi')) || []).length;
        const countB = (textB.match(new RegExp(term, 'gi')) || []).length;
        scoreA += countA;
        scoreB += countB;
      });

      return scoreB - scoreA;
    });

    // Return top results
    return results.slice(0, this.maxResults);
  }

  /**
   * Advanced search with multiple criteria
   */
  advancedSearch(query, filters = {}) {
    const baseResults = this.search(query, {
      personaId: filters.personaId,
      artworkId: filters.artworkId,
      matchMode: filters.matchMode || 'any',
      useFuzzy: filters.useFuzzy !== false,
    });

    // Apply RPAIT dimension filter if specified
    if (filters.rpaitDimension) {
      baseResults.forEach(result => {
        const rpait = RPAITManager.getRPAIT(result.critique.artworkId, result.critique.personaId);
        if (rpait) {
          const dim = filters.rpaitDimension.toUpperCase();
          if (dim === 'R') result.rpaitScore = rpait.R;
          else if (dim === 'P') result.rpaitScore = rpait.P;
          else if (dim === 'A') result.rpaitScore = rpait.A;
          else if (dim === 'I') result.rpaitScore = rpait.I;
          else if (dim === 'T') result.rpaitScore = rpait.T;
        }
      });

      // Filter by RPAIT score range
      if (filters.rpaitMin !== undefined || filters.rpaitMax !== undefined) {
        baseResults = baseResults.filter(r => {
          const score = r.rpaitScore || 0;
          const min = filters.rpaitMin !== undefined ? filters.rpaitMin : 0;
          const max = filters.rpaitMax !== undefined ? filters.rpaitMax : 10;
          return score >= min && score <= max;
        });
      }
    }

    return baseResults;
  }

  /**
   * Get search suggestions (type-ahead)
   */
  getSuggestions(prefix, limit = 5) {
    if (!prefix || prefix.length < 1) {
      return [];
    }

    const normalized = this.normalize(prefix);
    const suggestions = [];
    const seen = new Set();

    // Find terms starting with prefix
    for (const term of this.index.keys()) {
      if (term.startsWith(normalized) && !seen.has(term)) {
        suggestions.push({
          term: term,
          count: this.index.get(term).size,
        });
        seen.add(term);
      }
    }

    // Sort by frequency (most common first)
    suggestions.sort((a, b) => b.count - a.count);

    return suggestions.slice(0, limit).map(s => s.term);
  }

  /**
   * Get index statistics
   */
  getStats() {
    return {
      documentCount: this.critiques.length,
      termCount: this.index.size,
      avgTermsPerDoc: this.index.size > 0 ? this.critiques.length / this.index.size : 0,
      stopWordsCount: this.stopWords.size,
    };
  }

  /**
   * Clear index
   */
  clear() {
    this.critiques = [];
    this.index.clear();
    this.documentIndex.clear();
    this.tokenCache.clear();
    console.log('🗑️  SearchIndex cleared');
  }
}

// Make globally accessible
window.SearchIndex = SearchIndex;
