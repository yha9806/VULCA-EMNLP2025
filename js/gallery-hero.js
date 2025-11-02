/**
 * VULCA Gallery Hero Renderer
 * js/gallery-hero.js - v1.0.0
 *
 * Renders the active artwork and critic reviews to the homepage
 * Listens to carousel navigation events and updates DOM
 */

window.GalleryHeroRenderer = (function() {
  'use strict';

  const CONFIG = {
    MAX_CRITICS_VISIBLE: 6,  // Show all 6 critics
    CRITIC_TEXT_PREVIEW: 250, // Characters to show in preview
  };

  /**
   * Initialize the gallery hero renderer
   */
  function init() {
    const carousel = window.carousel;
    const galleryHero = document.getElementById('gallery-hero');

    if (!carousel || !galleryHero) {
      console.error('❌ Carousel or gallery-hero element not found');
      return;
    }

    // Initial render
    render(carousel);

    // Listen to carousel navigation events
    carousel.on('navigate', (event) => {
      render(carousel);
    });

    console.log('✓ Gallery hero renderer initialized');
  }

  /**
   * Render current artwork and critics
   */
  function render(carousel) {
    renderHeroTitle(carousel);
    renderArtworkHeader(carousel);
    renderArtworkImage(carousel);
    renderCritiques(carousel);
    renderRPAITVisualization(carousel);
    updateIndicator(carousel);
    renderDots(carousel);
  }

  /**
   * Render hero section title and description
   */
  function renderHeroTitle(carousel) {
    const galleryHero = document.getElementById('gallery-hero');
    if (!galleryHero) return;

    // Check if hero title already exists
    let heroTitle = galleryHero.querySelector('.hero-title-section');
    if (!heroTitle) {
      heroTitle = document.createElement('div');
      heroTitle.className = 'hero-title-section';
      galleryHero.insertBefore(heroTitle, galleryHero.firstChild);
    }

    heroTitle.innerHTML = '';

    const title = document.createElement('h1');
    title.className = 'hero-title';
    title.lang = 'zh';
    title.textContent = '潮汐的负形';

    const subtitle = document.createElement('p');
    subtitle.className = 'hero-subtitle';
    subtitle.lang = 'zh';
    subtitle.textContent = '一场关于艺术评论的视角之旅';

    heroTitle.appendChild(title);
    heroTitle.appendChild(subtitle);

    console.log('✓ Rendered hero title section');
  }

  /**
   * Render artwork header with title, year, and metadata
   */
  function renderArtworkHeader(carousel) {
    const galleryHero = document.getElementById('gallery-hero');
    if (!galleryHero) return;

    const artwork = carousel.getCurrentArtwork();
    if (!artwork) return;

    // Check if artwork header already exists
    let artworkHeader = galleryHero.querySelector('.artwork-header-section');
    if (!artworkHeader) {
      artworkHeader = document.createElement('div');
      artworkHeader.className = 'artwork-header-section';
      const artworkDisplay = galleryHero.querySelector('.artwork-display');
      if (artworkDisplay) {
        artworkDisplay.insertBefore(artworkHeader, artworkDisplay.firstChild);
      } else {
        galleryHero.appendChild(artworkHeader);
      }
    }

    artworkHeader.innerHTML = '';

    // Title
    const title = document.createElement('h2');
    title.className = 'artwork-title';

    const titleZh = document.createElement('span');
    titleZh.lang = 'zh';
    titleZh.textContent = artwork.titleZh;

    const titleEn = document.createElement('span');
    titleEn.lang = 'en';
    titleEn.textContent = artwork.titleEn;

    title.appendChild(titleZh);
    title.appendChild(document.createElement('br'));
    title.appendChild(titleEn);

    artworkHeader.appendChild(title);

    // Year and artist info
    const metadata = document.createElement('div');
    metadata.className = 'artwork-meta';

    const year = document.createElement('time');
    year.className = 'artwork-year';
    year.dateTime = artwork.year;
    year.textContent = `${artwork.year}`;

    const artist = document.createElement('span');
    artist.className = 'artwork-artist';
    artist.textContent = artwork.artist || 'Sougwen Chung';

    metadata.appendChild(year);
    metadata.appendChild(document.createTextNode(' • '));
    metadata.appendChild(artist);

    artworkHeader.appendChild(metadata);

    console.log(`✓ Rendered artwork header: ${artwork.titleZh}`);
  }

  /**
   * Render RPAIT visualization for current artwork
   */
  function renderRPAITVisualization(carousel) {
    const galleryHero = document.getElementById('gallery-hero');
    if (!galleryHero) return;

    const artwork = carousel.getCurrentArtwork();
    if (!artwork) return;

    // Check if viz container already exists
    let vizContainer = galleryHero.querySelector('.artwork-rpait-visualization');
    if (!vizContainer) {
      vizContainer = document.createElement('div');
      vizContainer.className = 'artwork-rpait-visualization';
      galleryHero.appendChild(vizContainer);
    }

    vizContainer.innerHTML = '';

    // Get average RPAIT scores for all critics of this artwork
    const critiques = carousel.getArtworkCritiques();
    if (!critiques || critiques.length === 0) {
      console.warn('⚠ No critiques for RPAIT visualization');
      return;
    }

    // Calculate average RPAIT scores
    const avgRpait = { R: 0, P: 0, A: 0, I: 0, T: 0 };
    critiques.forEach(critique => {
      if (critique.rpait) {
        avgRpait.R += critique.rpait.R || 0;
        avgRpait.P += critique.rpait.P || 0;
        avgRpait.A += critique.rpait.A || 0;
        avgRpait.I += critique.rpait.I || 0;
        avgRpait.T += critique.rpait.T || 0;
      }
    });

    // Calculate averages
    const count = critiques.length;
    Object.keys(avgRpait).forEach(key => {
      avgRpait[key] = Math.round(avgRpait[key] / count);
    });

    // Create visualization
    const title = document.createElement('h3');
    title.className = 'rpait-title';
    title.textContent = 'RPAIT 评论维度分析';
    vizContainer.appendChild(title);

    const gridContainer = document.createElement('div');
    gridContainer.className = 'rpait-grid';

    ['R', 'P', 'A', 'I', 'T'].forEach(dimension => {
      const score = avgRpait[dimension];
      const barContainer = document.createElement('div');
      barContainer.className = 'rpait-bar-container';

      const label = document.createElement('span');
      label.className = 'rpait-label';
      label.textContent = dimension;

      const bar = document.createElement('div');
      bar.className = `rpait-bar rpait-${dimension}`;
      const width = (score / 10) * 100;
      bar.style.width = width + '%';

      const scoreDisplay = document.createElement('span');
      scoreDisplay.className = 'rpait-score';
      scoreDisplay.textContent = score;

      barContainer.appendChild(label);
      barContainer.appendChild(bar);
      barContainer.appendChild(scoreDisplay);

      gridContainer.appendChild(barContainer);
    });

    vizContainer.appendChild(gridContainer);

    console.log('✓ Rendered RPAIT visualization');
  }

  /**
   * Render artwork image
   */
  function renderArtworkImage(carousel) {
    const container = document.getElementById('artwork-image-container');
    if (!container) return;

    const artwork = carousel.getCurrentArtwork();
    if (!artwork) return;

    // Clear previous content
    container.innerHTML = '';

    // Create figure element
    const figure = document.createElement('figure');
    figure.className = 'artwork-image';

    // Create image
    const img = document.createElement('img');
    img.src = artwork.imageUrl;
    img.alt = `${artwork.titleZh} ${artwork.titleEn}`;
    img.loading = 'eager';

    figure.appendChild(img);
    container.appendChild(figure);

    console.log(`✓ Rendered artwork: ${artwork.titleZh}`);
  }

  /**
   * Render critic reviews
   */
  function renderCritiques(carousel) {
    const container = document.getElementById('critiques-panel');
    if (!container) return;

    // Clear previous content
    container.innerHTML = '';

    const critics = carousel.getArtworkCritiques();
    if (!critics || critics.length === 0) {
      console.warn('⚠ No critics found for this artwork');
      return;
    }

    // Render up to MAX_CRITICS_VISIBLE
    const visibleCritics = critics.slice(0, CONFIG.MAX_CRITICS_VISIBLE);

    visibleCritics.forEach((critique, index) => {
      const criticPanel = createCriticPanel(critique, carousel.personas);
      container.appendChild(criticPanel);
    });

    console.log(`✓ Rendered ${visibleCritics.length} critic reviews`);
  }

  /**
   * Create a single critic panel element
   */
  function createCriticPanel(critique, personas) {
    const panel = document.createElement('article');
    panel.className = 'critique-panel';

    // Find persona info
    const persona = personas.find(p => p.id === critique.personaId) || {};

    // Header
    const header = document.createElement('div');
    header.className = 'critique-header';

    const nameEl = document.createElement('h3');
    nameEl.className = 'critique-author';
    nameEl.textContent = persona.nameZh || 'Unknown';

    const periodEl = document.createElement('p');
    periodEl.className = 'critique-period';
    periodEl.textContent = persona.period || '';

    header.appendChild(nameEl);
    header.appendChild(periodEl);
    panel.appendChild(header);

    // Text content
    const textEl = document.createElement('p');
    textEl.className = 'critique-text';
    // Use English or Chinese based on current language
    const lang = document.documentElement.getAttribute('data-lang') || 'zh';
    const text = lang === 'en' ? critique.textEn : critique.textZh;
    textEl.textContent = text || '';
    panel.appendChild(textEl);

    // RPAIT scores
    if (critique.rpait) {
      const rpaitEl = createRPAITDisplay(critique.rpait);
      panel.appendChild(rpaitEl);
    }

    // Set background color based on persona
    if (persona.color) {
      panel.style.borderLeftColor = persona.color;
    }

    return panel;
  }

  /**
   * Create RPAIT score display
   */
  function createRPAITDisplay(rpait) {
    const container = document.createElement('div');
    container.className = 'critique-rpait';

    const label = document.createElement('span');
    label.className = 'rpait-label';
    label.textContent = 'RPAIT: ';
    container.appendChild(label);

    ['R', 'P', 'A', 'I', 'T'].forEach(dimension => {
      const score = rpait[dimension] || 0;
      const scoreEl = document.createElement('span');
      scoreEl.className = `rpait-score rpait-${dimension}`;
      scoreEl.textContent = `${dimension}: ${score}`;
      container.appendChild(scoreEl);
    });

    return container;
  }

  /**
   * Update the artwork indicator (X of 4)
   */
  function updateIndicator(carousel) {
    const currentEl = document.getElementById('artwork-current');
    const totalEl = document.getElementById('artwork-total');

    if (currentEl) {
      currentEl.textContent = carousel.getCurrentIndex() + 1;
    }

    if (totalEl) {
      totalEl.textContent = carousel.getArtworkCount();
    }
  }

  /**
   * Render dot indicators for all artworks
   */
  function renderDots(carousel) {
    const container = document.getElementById('artwork-dots');
    if (!container) return;

    // Clear previous dots
    container.innerHTML = '';

    const artworks = carousel.artworks;
    const currentIndex = carousel.getCurrentIndex();

    artworks.forEach((artwork, index) => {
      const dot = document.createElement('button');
      dot.className = 'dot';
      if (index === currentIndex) {
        dot.classList.add('active');
      }
      dot.setAttribute('data-index', index);
      dot.setAttribute('aria-label', `Artwork ${index + 1}`);
      dot.textContent = `${index + 1}`;

      // Click to navigate
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        carousel.goTo(index);
      });

      container.appendChild(dot);
    });

    console.log(`✓ Rendered ${artworks.length} dot indicators`);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    init: init,
    render: render
  };
})();

console.log('✓ Gallery hero renderer module loaded');
