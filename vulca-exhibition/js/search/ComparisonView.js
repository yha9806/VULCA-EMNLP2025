/**
 * ComparisonView - Side-by-side critique comparison interface
 *
 * Phase 5 Task 5.4: Comparison View
 * Displays 2-4 critiques with RPAIT score differences highlighted
 */

class ComparisonView {
  constructor(options = {}) {
    this.critiques = [];
    this.comparisonPairs = [];
    this.maxComparisons = options.maxComparisons || 4;
    this.rpaitData = options.rpaitData || {};
    this.chartManager = options.chartManager || null;
    this.onClose = options.onClose || null;

    this.modal = null;
    this.isOpen = false;
    this.currentComparisonIndex = 0;

    this.init();
  }

  /**
   * Initialize comparison view
   */
  init() {
    this.createComparisonModal();
    this.attachEventListeners();
    console.log('✅ ComparisonView initialized');
  }

  /**
   * Create comparison modal HTML
   */
  createComparisonModal() {
    // Modal container
    this.modal = document.createElement('div');
    this.modal.className = 'comparison-modal';
    this.modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      z-index: 1001;
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      overflow-y: auto;
    `;

    // Modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'comparison-content';
    modalContent.style.cssText = `
      background: white;
      border-radius: 8px;
      width: 95%;
      max-width: 1400px;
      max-height: 90vh;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    `;

    // Header
    const header = this.createHeader();
    modalContent.appendChild(header);

    // Comparison container
    const comparisonContainer = document.createElement('div');
    comparisonContainer.id = 'comparison-container';
    comparisonContainer.className = 'comparison-container';
    comparisonContainer.style.cssText = `
      display: flex;
      gap: 20px;
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    `;
    modalContent.appendChild(comparisonContainer);

    // Navigation footer
    const footer = this.createFooter();
    modalContent.appendChild(footer);

    this.modal.appendChild(modalContent);
    document.body.appendChild(this.modal);
  }

  /**
   * Create modal header
   */
  createHeader() {
    const header = document.createElement('div');
    header.className = 'comparison-header';
    header.style.cssText = `
      padding: 20px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;

    const title = document.createElement('h2');
    title.textContent = '评论家对比分析';
    title.style.cssText = `
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    `;
    header.appendChild(title);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
      background: none;
      border: none;
      font-size: 28px;
      cursor: pointer;
      color: #999;
      padding: 0;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: background 0.2s;
    `;
    closeBtn.addEventListener('mouseover', () => {
      closeBtn.style.background = '#f0f0f0';
    });
    closeBtn.addEventListener('mouseout', () => {
      closeBtn.style.background = 'none';
    });
    closeBtn.addEventListener('click', () => this.close());
    header.appendChild(closeBtn);

    return header;
  }

  /**
   * Create modal footer with navigation
   */
  createFooter() {
    const footer = document.createElement('div');
    footer.className = 'comparison-footer';
    footer.style.cssText = `
      padding: 20px;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
    `;

    // Navigation controls
    const navContainer = document.createElement('div');
    navContainer.style.cssText = `
      display: flex;
      gap: 10px;
      align-items: center;
    `;

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '← 上一组';
    prevBtn.id = 'comparison-prev';
    prevBtn.style.cssText = `
      padding: 10px 15px;
      background: #f0f0f0;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    `;
    prevBtn.addEventListener('click', () => this.previousComparison());
    prevBtn.addEventListener('mouseover', () => {
      prevBtn.style.background = '#e0e0e0';
    });
    prevBtn.addEventListener('mouseout', () => {
      prevBtn.style.background = '#f0f0f0';
    });
    navContainer.appendChild(prevBtn);

    const pageInfo = document.createElement('span');
    pageInfo.id = 'comparison-page-info';
    pageInfo.style.cssText = `
      font-size: 14px;
      color: #666;
      min-width: 100px;
      text-align: center;
    `;
    navContainer.appendChild(pageInfo);

    const nextBtn = document.createElement('button');
    nextBtn.textContent = '下一组 →';
    nextBtn.id = 'comparison-next';
    nextBtn.style.cssText = `
      padding: 10px 15px;
      background: #f0f0f0;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    `;
    nextBtn.addEventListener('click', () => this.nextComparison());
    nextBtn.addEventListener('mouseover', () => {
      nextBtn.style.background = '#e0e0e0';
    });
    nextBtn.addEventListener('mouseout', () => {
      nextBtn.style.background = '#f0f0f0';
    });
    navContainer.appendChild(nextBtn);

    footer.appendChild(navContainer);

    // Export controls
    const exportContainer = document.createElement('div');
    exportContainer.style.cssText = `
      display: flex;
      gap: 10px;
    `;

    const exportBtn = document.createElement('button');
    exportBtn.textContent = '导出对比';
    exportBtn.style.cssText = `
      padding: 10px 15px;
      background: #0066cc;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    `;
    exportBtn.addEventListener('click', () => this.exportComparison());
    exportBtn.addEventListener('mouseover', () => {
      exportBtn.style.background = '#0052a3';
    });
    exportBtn.addEventListener('mouseout', () => {
      exportBtn.style.background = '#0066cc';
    });
    exportContainer.appendChild(exportBtn);

    footer.appendChild(exportContainer);

    return footer;
  }

  /**
   * Add critique to comparison
   */
  addCritique(critique) {
    if (this.critiques.length >= this.maxComparisons) {
      console.warn(`⚠️  Comparison limit (${this.maxComparisons}) reached`);
      return false;
    }

    // Check if already added
    if (this.critiques.some((c) => c.artworkId === critique.artworkId && c.personaId === critique.personaId)) {
      console.warn('⚠️  This critique is already in the comparison');
      return false;
    }

    this.critiques.push(critique);
    this.generateComparisonPairs();
    console.log(`✅ Added critique: ${critique.personaId} - ${critique.artworkId}`);
    return true;
  }

  /**
   * Remove critique from comparison
   */
  removeCritique(personaId, artworkId) {
    const index = this.critiques.findIndex(
      (c) => c.personaId === personaId && c.artworkId === artworkId
    );
    if (index > -1) {
      const removed = this.critiques.splice(index, 1)[0];
      this.generateComparisonPairs();
      this.currentComparisonIndex = Math.min(this.currentComparisonIndex, this.comparisonPairs.length - 1);
      console.log(`✅ Removed critique: ${removed.personaId} - ${removed.artworkId}`);
      return true;
    }
    return false;
  }

  /**
   * Generate all possible comparison pairs
   */
  generateComparisonPairs() {
    this.comparisonPairs = [];

    // Generate pairs for 2-4 items
    if (this.critiques.length < 2) {
      return;
    }

    // For 2 items: 1 pair
    if (this.critiques.length === 2) {
      this.comparisonPairs.push([this.critiques[0], this.critiques[1]]);
    }
    // For 3 items: 3 pairs (each with all 3)
    else if (this.critiques.length === 3) {
      this.comparisonPairs.push([this.critiques[0], this.critiques[1], this.critiques[2]]);
    }
    // For 4 items: 1 pair (all 4)
    else if (this.critiques.length === 4) {
      this.comparisonPairs.push([this.critiques[0], this.critiques[1], this.critiques[2], this.critiques[3]]);
    }

    this.currentComparisonIndex = 0;
  }

  /**
   * Display current comparison
   */
  displayComparison() {
    if (this.comparisonPairs.length === 0) {
      console.warn('⚠️  No critiques to compare');
      return;
    }

    const container = document.getElementById('comparison-container');
    container.innerHTML = '';

    const currentPair = this.comparisonPairs[this.currentComparisonIndex];

    // Create columns for each critique
    currentPair.forEach((critique, index) => {
      const column = this.createComparisonColumn(critique, currentPair, index);
      container.appendChild(column);
    });

    // Update page info
    const pageInfo = document.getElementById('comparison-page-info');
    pageInfo.textContent = `组 ${this.currentComparisonIndex + 1} / ${this.comparisonPairs.length}`;

    // Update button states
    this.updateNavigationButtons();
  }

  /**
   * Create comparison column for a single critique
   */
  createComparisonColumn(critique, allCritiques, columnIndex) {
    const column = document.createElement('div');
    column.className = 'comparison-column';
    column.style.cssText = `
      flex: 1;
      min-width: 300px;
      background: #f9f9f9;
      border-radius: 8px;
      padding: 20px;
      border: 1px solid #eee;
      display: flex;
      flex-direction: column;
      gap: 20px;
    `;

    // Header
    const header = document.createElement('div');
    header.style.cssText = `
      border-bottom: 2px solid #0066cc;
      padding-bottom: 15px;
    `;

    const personaName = document.createElement('h3');
    personaName.textContent = critique.personaId;
    personaName.style.cssText = `
      margin: 0 0 5px 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    `;
    header.appendChild(personaName);

    const artworkInfo = document.createElement('p');
    artworkInfo.textContent = `《${critique.title}》`;
    artworkInfo.style.cssText = `
      margin: 0;
      font-size: 12px;
      color: #999;
    `;
    header.appendChild(artworkInfo);

    column.appendChild(header);

    // RPAIT Radar Chart
    const chartContainer = document.createElement('div');
    chartContainer.id = `comparison-chart-${columnIndex}`;
    chartContainer.style.cssText = `
      width: 100%;
      height: 250px;
      margin-bottom: 10px;
    `;
    column.appendChild(chartContainer);

    // Create radar chart for this critique
    if (this.chartManager) {
      const artworkId = critique.artworkId;
      const rpaitScores = this.rpaitData[artworkId]?.critics[critique.personaId];

      if (rpaitScores) {
        const colors = this.getColumnColor(columnIndex);
        this.chartManager.createRadarChart(
          `comparison-chart-${columnIndex}`,
          {
            labels: ['表现力', '哲学性', '美学', '解读深度', '技巧'],
            values: [rpaitScores.R, rpaitScores.P, rpaitScores.A, rpaitScores.I, rpaitScores.T],
            label: critique.personaId,
            borderColor: colors.border,
            backgroundColor: colors.background,
          },
          {
            width: 250,
            height: 250,
          }
        );
      }
    }

    // RPAIT Score Table
    const scoreTable = document.createElement('div');
    scoreTable.className = 'rpait-score-table';
    scoreTable.style.cssText = `
      background: white;
      border-radius: 4px;
      padding: 15px;
      border: 1px solid #ddd;
    `;

    const artworkId = critique.artworkId;
    const rpaitScores = this.rpaitData[artworkId]?.critics[critique.personaId];

    if (rpaitScores) {
      const dimensions = [
        { key: 'R', label: '表现力', full: 'Representation' },
        { key: 'P', label: '哲学性', full: 'Philosophy' },
        { key: 'A', label: '美学', full: 'Aesthetics' },
        { key: 'I', label: '解读深度', full: 'Interpretation' },
        { key: 'T', label: '技巧', full: 'Technique' },
      ];

      // Calculate differences if there are other critiques
      const differences = this.calculateDifferences(rpaitScores, allCritiques, critique);

      dimensions.forEach((dim) => {
        const row = document.createElement('div');
        row.style.cssText = `
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
        `;

        const label = document.createElement('span');
        label.textContent = `${dim.label}`;
        label.style.cssText = `
          font-size: 12px;
          color: #666;
          font-weight: 500;
        `;
        row.appendChild(label);

        const valueContainer = document.createElement('span');
        valueContainer.style.cssText = `
          display: flex;
          gap: 8px;
          align-items: center;
        `;

        const score = document.createElement('strong');
        score.textContent = `${rpaitScores[dim.key]}/10`;
        score.style.cssText = `
          font-size: 12px;
          color: #333;
        `;
        valueContainer.appendChild(score);

        // Show difference if available
        if (differences && differences[dim.key] !== undefined) {
          const diff = differences[dim.key];
          const diffSpan = document.createElement('span');
          diffSpan.style.cssText = `
            font-size: 11px;
            padding: 2px 6px;
            border-radius: 2px;
            background: ${diff > 0 ? '#e3f2fd' : diff < 0 ? '#fff3e0' : '#f5f5f5'};
            color: ${diff > 0 ? '#1976d2' : diff < 0 ? '#f57c00' : '#999'};
          `;
          diffSpan.textContent = `${diff > 0 ? '+' : ''}${diff}`;
          valueContainer.appendChild(diffSpan);
        }

        row.appendChild(valueContainer);
        scoreTable.appendChild(row);
      });
    }

    column.appendChild(scoreTable);

    // Content preview
    const contentSection = document.createElement('div');
    contentSection.style.cssText = `
      flex: 1;
      overflow-y: auto;
    `;

    const contentLabel = document.createElement('h4');
    contentLabel.textContent = '评论摘要';
    contentLabel.style.cssText = `
      margin: 0 0 10px 0;
      font-size: 13px;
      color: #666;
      font-weight: 600;
    `;
    contentSection.appendChild(contentLabel);

    const contentPreview = document.createElement('p');
    contentPreview.textContent = critique.content.substring(0, 400) + '...';
    contentPreview.style.cssText = `
      margin: 0;
      font-size: 12px;
      line-height: 1.6;
      color: #555;
    `;
    contentSection.appendChild(contentPreview);

    column.appendChild(contentSection);

    return column;
  }

  /**
   * Calculate score differences between critiques
   */
  calculateDifferences(currentScores, allCritiques, currentCritique) {
    if (allCritiques.length < 2) {
      return null;
    }

    // Compare with the first critique (or the one before current)
    const otherCritique = allCritiques.find((c) =>
      c.personaId !== currentCritique.personaId || c.artworkId !== currentCritique.artworkId
    );

    if (!otherCritique) {
      return null;
    }

    const otherScores = this.rpaitData[otherCritique.artworkId]?.critics[otherCritique.personaId];
    if (!otherScores) {
      return null;
    }

    const differences = {};
    ['R', 'P', 'A', 'I', 'T'].forEach((key) => {
      differences[key] = currentScores[key] - otherScores[key];
    });

    return differences;
  }

  /**
   * Get color for each column
   */
  getColumnColor(index) {
    const colors = [
      { border: 'rgba(255, 99, 132, 1)', background: 'rgba(255, 99, 132, 0.1)' },
      { border: 'rgba(54, 162, 235, 1)', background: 'rgba(54, 162, 235, 0.1)' },
      { border: 'rgba(75, 192, 75, 1)', background: 'rgba(75, 192, 75, 0.1)' },
      { border: 'rgba(255, 193, 7, 1)', background: 'rgba(255, 193, 7, 0.1)' },
    ];
    return colors[index % colors.length];
  }

  /**
   * Navigate to next comparison pair
   */
  nextComparison() {
    if (this.currentComparisonIndex < this.comparisonPairs.length - 1) {
      this.currentComparisonIndex++;
      this.displayComparison();
    }
  }

  /**
   * Navigate to previous comparison pair
   */
  previousComparison() {
    if (this.currentComparisonIndex > 0) {
      this.currentComparisonIndex--;
      this.displayComparison();
    }
  }

  /**
   * Update navigation button states
   */
  updateNavigationButtons() {
    const prevBtn = document.getElementById('comparison-prev');
    const nextBtn = document.getElementById('comparison-next');

    if (prevBtn) {
      prevBtn.disabled = this.currentComparisonIndex === 0;
      prevBtn.style.opacity = this.currentComparisonIndex === 0 ? '0.5' : '1';
      prevBtn.style.cursor = this.currentComparisonIndex === 0 ? 'not-allowed' : 'pointer';
    }

    if (nextBtn) {
      nextBtn.disabled = this.currentComparisonIndex >= this.comparisonPairs.length - 1;
      nextBtn.style.opacity = this.currentComparisonIndex >= this.comparisonPairs.length - 1 ? '0.5' : '1';
      nextBtn.style.cursor = this.currentComparisonIndex >= this.comparisonPairs.length - 1 ? 'not-allowed' : 'pointer';
    }
  }

  /**
   * Export comparison as JSON
   */
  exportComparison() {
    if (this.comparisonPairs.length === 0) {
      console.warn('⚠️  No comparison data to export');
      return;
    }

    const currentPair = this.comparisonPairs[this.currentComparisonIndex];
    const exportData = {
      timestamp: new Date().toISOString(),
      comparisonType: `${currentPair.length}-way comparison`,
      critiques: currentPair.map((critique) => {
        const scores = this.rpaitData[critique.artworkId]?.critics[critique.personaId];
        return {
          personaId: critique.personaId,
          artworkId: critique.artworkId,
          title: critique.title,
          rpaitScores: scores || {},
          contentLength: critique.content.length,
        };
      }),
    };

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `comparison-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('✅ Comparison exported as JSON');
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Close on background click
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.close();
        }
      });
    }
  }

  /**
   * Open comparison modal
   */
  open() {
    if (this.critiques.length < 2) {
      console.warn('⚠️  Need at least 2 critiques to compare');
      return false;
    }

    this.isOpen = true;
    if (this.modal) {
      this.modal.style.display = 'flex';
      this.displayComparison();
    }
    console.log('🔍 Comparison view opened');
    return true;
  }

  /**
   * Close comparison modal
   */
  close() {
    this.isOpen = false;
    if (this.modal) {
      this.modal.style.display = 'none';
    }
    if (this.onClose) {
      this.onClose();
    }
    console.log('🔍 Comparison view closed');
  }

  /**
   * Get comparison statistics
   */
  getStats() {
    return {
      totalCritiques: this.critiques.length,
      maxComparisons: this.maxComparisons,
      isFull: this.critiques.length >= this.maxComparisons,
      comparisonPairs: this.comparisonPairs.length,
      critiques: this.critiques.map((c) => `${c.personaId} - ${c.artworkId}`),
    };
  }

  /**
   * Clear all comparisons
   */
  clearAll() {
    this.critiques = [];
    this.comparisonPairs = [];
    this.currentComparisonIndex = 0;
    this.close();
    console.log('🗑️  All comparisons cleared');
  }
}

// Make globally accessible
window.ComparisonView = ComparisonView;
