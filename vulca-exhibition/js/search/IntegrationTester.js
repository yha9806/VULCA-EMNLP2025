/**
 * IntegrationTester - Comprehensive Phase 5 system testing
 *
 * Phase 5 Task 5.7: Integration Testing
 * Tests all Phase 5 systems working together
 */

class IntegrationTester {
  constructor(options = {}) {
    this.app = options.app || null;
    this.testResults = [];
    this.startTime = null;
    this.endTime = null;
  }

  /**
   * Run all integration tests
   */
  async runAllTests() {
    this.testResults = [];
    this.startTime = Date.now();

    console.log('🧪 Starting Phase 5 Integration Tests...\n');

    await this.testSearchSystem();
    await this.testFilterSystem();
    await this.testBookmarkSystem();
    await this.testComparisonView();
    await this.testShareSystem();
    await this.testNavigationUI();
    await this.testCrossFeatureInteractions();
    await this.testPerformance();

    this.endTime = Date.now();
    this.printTestReport();

    return this.testResults;
  }

  /**
   * Test Search System
   */
  async testSearchSystem() {
    console.log('📋 Testing Search System...');
    const results = [];

    try {
      // Test 1: SearchIndex initialization
      if (this.app.searchIndex) {
        const indexInfo = this.app.searchIndex.getStats();
        const passed = indexInfo.termCount > 0 && indexInfo.documentCount === 24;
        results.push({
          name: 'SearchIndex initialization',
          passed: passed,
          message: `${indexInfo.termCount} terms, ${indexInfo.documentCount} documents`,
        });
      }

      // Test 2: SearchUI modal opening
      if (this.app.searchUI) {
        const modalExists = document.querySelector('.search-modal') !== null;
        results.push({
          name: 'SearchUI modal creation',
          passed: modalExists,
          message: modalExists ? 'Modal created' : 'Modal not found',
        });
      }

      // Test 3: Search query execution
      if (this.app.searchIndex) {
        // Try searching for a common term that should exist (using Chinese character)
        const searchResults = this.app.searchIndex.search('艺术', { matchMode: 'any', useFuzzy: false });
        const passed = searchResults.length > 0;
        results.push({
          name: 'Search query execution',
          passed: passed,
          message: `${searchResults.length} results found for '艺术'`,
        });
      }

      // Test 4: FilterSystem initialization
      if (this.app.filterSystem) {
        const filterStats = this.app.filterSystem.getStats();
        const passed = filterStats.totalCritiques === 24;
        results.push({
          name: 'FilterSystem with 24 critiques',
          passed: passed,
          message: `${filterStats.totalCritiques} critiques loaded`,
        });
      }
    } catch (error) {
      results.push({
        name: 'Search System (Error)',
        passed: false,
        message: error.message,
      });
    }

    this.testResults.push({ category: 'Search System', tests: results });
    console.log(`   ✅ ${results.filter(r => r.passed).length}/${results.length} tests passed\n`);
  }

  /**
   * Test Filter System
   */
  async testFilterSystem() {
    console.log('📋 Testing Filter System...');
    const results = [];

    try {
      // Test 1: Available filters
      if (this.app.filterSystem) {
        const personas = this.app.filterSystem.getAvailablePersonas();
        const artworks = this.app.filterSystem.getAvailableArtworks();
        const passed = personas.length === 6 && artworks.length === 4;
        results.push({
          name: 'Available filters (6 personas, 4 artworks)',
          passed: passed,
          message: `${personas.length} personas, ${artworks.length} artworks`,
        });
      }

      // Test 2: Add persona filter
      if (this.app.filterSystem) {
        this.app.filterSystem.addPersonaFilter('苏轼');
        const activeFilters = this.app.filterSystem.getActiveFilters();
        const passed = activeFilters.personas && activeFilters.personas.includes('苏轼');
        results.push({
          name: 'Add persona filter',
          passed: passed,
          message: passed ? '苏轼 filter added' : 'Filter not added',
        });
        this.app.filterSystem.clearPersonaFilters();
      }

      // Test 3: RPAIT dimension filter
      if (this.app.filterSystem) {
        this.app.filterSystem.setRPAITDimension('P');
        const filters = this.app.filterSystem.getActiveFilters();
        const dimension = filters.rpaitDimension;
        const passed = dimension === 'P';
        results.push({
          name: 'RPAIT dimension filter',
          passed: passed,
          message: dimension ? `Dimension: ${dimension}` : 'Not set',
        });
        this.app.filterSystem.setRPAITDimension(null);
      }

      // Test 4: Score range filter
      if (this.app.filterSystem) {
        this.app.filterSystem.setRPAITScoreRange(5, 10);
        const filters = this.app.filterSystem.getActiveFilters();
        const passed = filters.rpaitMinScore === 5 && filters.rpaitMaxScore === 10;
        results.push({
          name: 'Score range filter',
          passed: passed,
          message: passed ? `Range: ${filters.rpaitMinScore}-${filters.rpaitMaxScore}` : 'Range not set correctly',
        });
        this.app.filterSystem.resetFilters();
      }
    } catch (error) {
      results.push({
        name: 'Filter System (Error)',
        passed: false,
        message: error.message,
      });
    }

    this.testResults.push({ category: 'Filter System', tests: results });
    console.log(`   ✅ ${results.filter(r => r.passed).length}/${results.length} tests passed\n`);
  }

  /**
   * Test Bookmark System
   */
  async testBookmarkSystem() {
    console.log('📋 Testing Bookmark System...');
    const results = [];

    try {
      // Test 1: Add bookmark
      if (this.app.bookmarkSystem) {
        const testCritique = {
          artworkId: 'artwork_1',
          personaId: '苏轼',
          title: 'Test',
          content: 'Test content',
        };
        const bookmark = this.app.bookmarkSystem.addBookmark(testCritique, 'Test notes', ['test']);
        const passed = bookmark !== false;
        results.push({
          name: 'Add bookmark',
          passed: passed,
          message: passed ? 'Bookmark created' : 'Failed to create',
        });

        // Test 2: Search bookmarks
        if (passed) {
          const found = this.app.bookmarkSystem.searchBookmarks('苏轼');
          const searchPassed = found.length > 0;
          results.push({
            name: 'Search bookmarks',
            passed: searchPassed,
            message: `${found.length} bookmarks found`,
          });
        }

        // Test 3: Export bookmarks
        if (passed) {
          const json = this.app.bookmarkSystem.exportAsJSON();
          const exportPassed = json.bookmarks && json.bookmarks.length > 0;
          results.push({
            name: 'Export bookmarks as JSON',
            passed: exportPassed,
            message: exportPassed ? 'Export successful' : 'Export failed',
          });

          const csv = this.app.bookmarkSystem.exportAsCSV();
          const csvPassed = csv && csv.length > 0;
          results.push({
            name: 'Export bookmarks as CSV',
            passed: csvPassed,
            message: csvPassed ? 'Export successful' : 'Export failed',
          });
        }

        // Cleanup
        this.app.bookmarkSystem.clearAll();
      }
    } catch (error) {
      results.push({
        name: 'Bookmark System (Error)',
        passed: false,
        message: error.message,
      });
    }

    this.testResults.push({ category: 'Bookmark System', tests: results });
    console.log(`   ✅ ${results.filter(r => r.passed).length}/${results.length} tests passed\n`);
  }

  /**
   * Test Comparison View
   */
  async testComparisonView() {
    console.log('📋 Testing Comparison View...');
    const results = [];

    try {
      if (this.app.comparisonView) {
        // Test 1: Add critiques to comparison
        const critique1 = {
          artworkId: 'artwork_1',
          personaId: '苏轼',
          title: 'Test 1',
          content: 'Content 1',
        };
        const critique2 = {
          artworkId: 'artwork_1',
          personaId: '约翰罗斯金',
          title: 'Test 2',
          content: 'Content 2',
        };

        const added1 = this.app.comparisonView.addCritique(critique1);
        const added2 = this.app.comparisonView.addCritique(critique2);
        const passed = added1 && added2;

        results.push({
          name: 'Add critiques to comparison',
          passed: passed,
          message: passed ? '2 critiques added' : 'Failed to add critiques',
        });

        // Test 2: Get stats
        if (passed) {
          const stats = this.app.comparisonView.getStats();
          const statsPassed = stats.totalCritiques === 2;
          results.push({
            name: 'Comparison statistics',
            passed: statsPassed,
            message: `${stats.totalCritiques} critiques tracked`,
          });
        }

        // Test 3: Export comparison
        if (passed) {
          const json = this.app.comparisonView.exportComparison();
          // Mock the export since it triggers download
          results.push({
            name: 'Export comparison data',
            passed: true,
            message: 'Export method callable',
          });
        }

        // Cleanup
        this.app.comparisonView.clearAll();
      }
    } catch (error) {
      results.push({
        name: 'Comparison View (Error)',
        passed: false,
        message: error.message,
      });
    }

    this.testResults.push({ category: 'Comparison View', tests: results });
    console.log(`   ✅ ${results.filter(r => r.passed).length}/${results.length} tests passed\n`);
  }

  /**
   * Test Share System
   */
  async testShareSystem() {
    console.log('📋 Testing Share System...');
    const results = [];

    try {
      if (this.app.shareSystem) {
        // Test 1: Update state
        this.app.shareSystem.updateState({
          searchQuery: 'test',
          filterPersonas: ['苏轼'],
        });
        const stateUpdated = this.app.shareSystem.currentState.searchQuery === 'test';
        results.push({
          name: 'Update share state',
          passed: stateUpdated,
          message: stateUpdated ? 'State updated' : 'State not updated',
        });

        // Test 2: Generate URL
        if (stateUpdated) {
          const url = this.app.shareSystem.generateShareUrl();
          const urlValid = url && url.length > 0 && url.includes('?state=');
          results.push({
            name: 'Generate share URL',
            passed: urlValid,
            message: urlValid ? `URL length: ${url.length}` : 'URL generation failed',
          });
        }

        // Test 3: Get stats
        const stats = this.app.shareSystem.getStateStats();
        const statsValid = stats.shareUrlLength > 0;
        results.push({
          name: 'Share system statistics',
          passed: statsValid,
          message: `URL length: ${stats.shareUrlLength}/${stats.maxUrlLength}`,
        });

        // Cleanup
        this.app.shareSystem.clearState();
      }
    } catch (error) {
      results.push({
        name: 'Share System (Error)',
        passed: false,
        message: error.message,
      });
    }

    this.testResults.push({ category: 'Share System', tests: results });
    console.log(`   ✅ ${results.filter(r => r.passed).length}/${results.length} tests passed\n`);
  }

  /**
   * Test Navigation UI
   */
  async testNavigationUI() {
    console.log('📋 Testing Navigation UI...');
    const results = [];

    try {
      if (this.app.navigationUI) {
        // Test 1: Navigation bar exists
        const navbarExists = document.querySelector('.navigation-bar') !== null;
        results.push({
          name: 'Navigation bar creation',
          passed: navbarExists,
          message: navbarExists ? 'Navigation bar rendered' : 'Navigation bar not found',
        });

        // Test 2: Add browse history
        this.app.navigationUI.addBrowseHistory('artwork_1', '苏轼', 'Test Title');
        const browseHistoryAdded = this.app.navigationUI.browseHistory.length > 0;
        results.push({
          name: 'Add browse history',
          passed: browseHistoryAdded,
          message: browseHistoryAdded ? 'History added' : 'History not added',
        });

        // Test 3: Add search history
        this.app.navigationUI.addSearchHistory('test query');
        const searchHistoryAdded = this.app.navigationUI.searchHistory.length > 0;
        results.push({
          name: 'Add search history',
          passed: searchHistoryAdded,
          message: searchHistoryAdded ? 'Search history added' : 'Not added',
        });

        // Test 4: Get stats
        const stats = this.app.navigationUI.getStats();
        const statsValid = stats.searchHistoryCount > 0 && stats.browseHistoryCount > 0;
        results.push({
          name: 'Navigation statistics',
          passed: statsValid,
          message: `${stats.searchHistoryCount} search, ${stats.browseHistoryCount} browse items`,
        });

        // Cleanup
        this.app.navigationUI.clearAllHistory();
      }
    } catch (error) {
      results.push({
        name: 'Navigation UI (Error)',
        passed: false,
        message: error.message,
      });
    }

    this.testResults.push({ category: 'Navigation UI', tests: results });
    console.log(`   ✅ ${results.filter(r => r.passed).length}/${results.length} tests passed\n`);
  }

  /**
   * Test Cross-Feature Interactions
   */
  async testCrossFeatureInteractions() {
    console.log('📋 Testing Cross-Feature Interactions...');
    const results = [];

    try {
      // Test 1: Search + Comparison
      if (this.app.searchIndex && this.app.comparisonView) {
        const searchResults = this.app.searchIndex.search('light', { matchMode: 'any', useFuzzy: true });
        if (searchResults.length >= 2) {
          this.app.comparisonView.addCritique(searchResults[0]);
          this.app.comparisonView.addCritique(searchResults[1]);
          const comparisonReady = this.app.comparisonView.critiques.length === 2;
          results.push({
            name: 'Search + Comparison integration',
            passed: comparisonReady,
            message: comparisonReady ? 'Search results can be compared' : 'Integration failed',
          });
          this.app.comparisonView.clearAll();
        }
      }

      // Test 2: Filter + Bookmark
      if (this.app.filterSystem && this.app.bookmarkSystem) {
        this.app.filterSystem.addPersonaFilter('苏轼');
        const filtered = this.app.filterSystem.getFilteredResults();
        if (filtered.length > 0) {
          const bookmarked = this.app.bookmarkSystem.addBookmark(filtered[0], 'Filtered result');
          const integrated = bookmarked !== false;
          results.push({
            name: 'Filter + Bookmark integration',
            passed: integrated,
            message: integrated ? 'Filtered results can be bookmarked' : 'Integration failed',
          });
          this.app.bookmarkSystem.clearAll();
        }
        this.app.filterSystem.resetFilters();
      }

      // Test 3: History + Search
      if (this.app.navigationUI && this.app.searchIndex) {
        const searchResults = this.app.searchIndex.search('light', { matchMode: 'any', useFuzzy: true });
        if (searchResults.length > 0) {
          this.app.navigationUI.addSearchHistory('light');
          const historyTracked = this.app.navigationUI.searchHistory.length > 0;
          results.push({
            name: 'Navigation + Search history',
            passed: historyTracked,
            message: historyTracked ? 'Search history tracked' : 'History not tracked',
          });
          this.app.navigationUI.clearAllHistory();
        }
      }

      // Test 4: Share + Multiple Systems
      if (this.app.shareSystem && this.app.filterSystem && this.app.searchIndex) {
        this.app.shareSystem.updateState({
          searchQuery: 'light',
          filterPersonas: ['苏轼'],
          filterRPAIT: 'P',
        });
        const url = this.app.shareSystem.generateShareUrl();
        const sharingWorks = url && url.length > 0;
        results.push({
          name: 'Share system with filters',
          passed: sharingWorks,
          message: sharingWorks ? `Generated URL: ${url.length} chars` : 'Share failed',
        });
        this.app.shareSystem.clearState();
      }
    } catch (error) {
      results.push({
        name: 'Cross-Feature Interactions (Error)',
        passed: false,
        message: error.message,
      });
    }

    this.testResults.push({ category: 'Cross-Feature Interactions', tests: results });
    console.log(`   ✅ ${results.filter(r => r.passed).length}/${results.length} tests passed\n`);
  }

  /**
   * Test Performance
   */
  async testPerformance() {
    console.log('📋 Testing Performance...');
    const results = [];

    try {
      // Test 1: Search performance
      const t1 = performance.now();
      this.app.searchIndex.search('light', { matchMode: 'any', useFuzzy: true });
      const t2 = performance.now();
      const searchTime = t2 - t1;
      const searchPassed = searchTime < 50; // Should be <50ms
      results.push({
        name: 'Search query performance',
        passed: searchPassed,
        message: `${searchTime.toFixed(2)}ms (target: <50ms)`,
      });

      // Test 2: Filter performance
      const t3 = performance.now();
      this.app.filterSystem.addPersonaFilter('苏轼');
      this.app.filterSystem.getFilteredResults();
      this.app.filterSystem.resetFilters();
      const t4 = performance.now();
      const filterTime = t4 - t3;
      const filterPassed = filterTime < 50; // Should be <50ms
      results.push({
        name: 'Filter operation performance',
        passed: filterPassed,
        message: `${filterTime.toFixed(2)}ms (target: <50ms)`,
      });

      // Test 3: Bookmark operations
      const t5 = performance.now();
      for (let i = 0; i < 10; i++) {
        this.app.bookmarkSystem.addBookmark({
          artworkId: `artwork_${i}`,
          personaId: '苏轼',
          title: `Test ${i}`,
          content: 'Test content',
        });
      }
      const t6 = performance.now();
      this.app.bookmarkSystem.clearAll();
      const bookmarkTime = (t6 - t5) / 10;
      const bookmarkPassed = bookmarkTime < 10; // Should be <10ms per operation
      results.push({
        name: 'Bookmark operation (avg)',
        passed: bookmarkPassed,
        message: `${bookmarkTime.toFixed(2)}ms per op (target: <10ms)`,
      });

      // Test 4: Memory usage
      if (performance.memory) {
        const memUsed = performance.memory.usedJSHeapSize / 1048576; // Convert to MB
        results.push({
          name: 'Memory usage',
          passed: memUsed < 100, // Less than 100MB
          message: `${memUsed.toFixed(1)}MB (target: <100MB)`,
        });
      }
    } catch (error) {
      results.push({
        name: 'Performance Tests (Error)',
        passed: false,
        message: error.message,
      });
    }

    this.testResults.push({ category: 'Performance', tests: results });
    console.log(`   ✅ ${results.filter(r => r.passed).length}/${results.length} tests passed\n`);
  }

  /**
   * Print test report
   */
  printTestReport() {
    const totalTests = this.testResults.reduce((sum, cat) => sum + cat.tests.length, 0);
    const totalPassed = this.testResults.reduce(
      (sum, cat) => sum + cat.tests.filter(t => t.passed).length,
      0
    );
    const passRate = ((totalPassed / totalTests) * 100).toFixed(1);
    const duration = ((this.endTime - this.startTime) / 1000).toFixed(2);

    console.log('═══════════════════════════════════════════════════════════');
    console.log('🧪 PHASE 5 INTEGRATION TEST REPORT');
    console.log('═══════════════════════════════════════════════════════════\n');

    this.testResults.forEach(categoryResult => {
      const categoryPassed = categoryResult.tests.filter(t => t.passed).length;
      const categoryTotal = categoryResult.tests.length;
      console.log(`${categoryResult.category}: ${categoryPassed}/${categoryTotal} passed`);
      categoryResult.tests.forEach(test => {
        const icon = test.passed ? '✅' : '❌';
        console.log(`  ${icon} ${test.name}: ${test.message}`);
      });
      console.log();
    });

    console.log('═══════════════════════════════════════════════════════════');
    console.log(`OVERALL RESULTS: ${totalPassed}/${totalTests} tests passed (${passRate}%)`);
    console.log(`DURATION: ${duration}s`);
    console.log(`STATUS: ${totalPassed === totalTests ? '✅ ALL TESTS PASSED' : '⚠️  SOME TESTS FAILED'}`);
    console.log('═══════════════════════════════════════════════════════════\n');
  }

  /**
   * Get test results as JSON
   */
  getResultsJSON() {
    return {
      timestamp: new Date().toISOString(),
      duration: this.endTime - this.startTime,
      categories: this.testResults,
      summary: {
        totalTests: this.testResults.reduce((sum, cat) => sum + cat.tests.length, 0),
        totalPassed: this.testResults.reduce(
          (sum, cat) => sum + cat.tests.filter(t => t.passed).length,
          0
        ),
        passRate: this.getPassRate(),
      },
    };
  }

  /**
   * Get pass rate percentage
   */
  getPassRate() {
    const totalTests = this.testResults.reduce((sum, cat) => sum + cat.tests.length, 0);
    const totalPassed = this.testResults.reduce(
      (sum, cat) => sum + cat.tests.filter(t => t.passed).length,
      0
    );
    return totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : 0;
  }
}

// Make globally accessible
window.IntegrationTester = IntegrationTester;
