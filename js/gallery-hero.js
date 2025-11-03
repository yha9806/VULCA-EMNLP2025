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
    CRITIC_TEXT_PREVIEW: 150, // Characters to show in preview (reduced for expand/collapse)
  };

  /**
   * Smart text truncation at sentence boundaries
   * @param {string} text - Full text
   * @param {number} maxLength - Maximum characters (default 150)
   * @returns {string} - Truncated text with "..."
   */
  function truncateText(text, maxLength = 150) {
    if (!text || text.length <= maxLength) return text;

    const truncated = text.substring(0, maxLength);
    const lastPeriod = truncated.lastIndexOf('。');
    const lastComma = truncated.lastIndexOf('，');

    const breakPoint = Math.max(lastPeriod, lastComma);

    // Use sentence boundary if found after 50 chars
    return breakPoint > 50
      ? text.substring(0, breakPoint + 1) + '...'
      : truncated + '...';
  }

  /**
   * Toggle critique expansion state
   * @param {HTMLElement} card - Critique card element
   * @param {HTMLElement} textElement - Text paragraph element
   * @param {HTMLElement} button - Toggle button element
   * @param {string} fullText - Full critique text
   */
  function toggleCritiqueExpansion(card, textElement, button, fullText) {
    const isExpanded = card.classList.contains('expanded');

    if (isExpanded) {
      // Collapse
      card.classList.remove('expanded');
      textElement.textContent = truncateText(fullText, 150);
      button.textContent = '展开 ▼';
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', '展开评论全文');
    } else {
      // Expand
      card.classList.add('expanded');
      textElement.textContent = fullText;
      button.textContent = '收起 ▲';
      button.setAttribute('aria-expanded', 'true');
      button.setAttribute('aria-label', '收起评论');
    }
  }

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
        // Insert BEFORE artwork-display (as sibling, not child)
        galleryHero.insertBefore(artworkHeader, artworkDisplay);
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
   * Render artwork image (with multi-image carousel support)
   */
  function renderArtworkImage(carousel) {
    const container = document.getElementById('artwork-image-container');
    if (!container) return;

    const artwork = carousel.getCurrentArtwork();
    if (!artwork) return;

    // Clear previous content
    container.innerHTML = '';

    // Check if artwork uses new multi-image format
    if (window.ImageCompat && window.ArtworkImageCarousel) {
      const images = window.ImageCompat.getArtworkImages(artwork);

      // If artwork has multiple images, use carousel
      if (images.length > 1) {
        console.log(`✓ Rendering multi-image carousel for: ${artwork.titleZh} (${images.length} images)`);

        // Create carousel
        const artworkCarousel = new window.ArtworkImageCarousel(artwork, container, {
          loop: true,
          preloadAdjacent: true,
          enableKeyboard: true,
          enableTouch: true,
          showMetadata: true,
          showIndicators: true,
          showNavigation: true,
          categoryBadges: true
        });

        artworkCarousel.render();

        // Highlight images referenced in current critiques (if any)
        const currentCritiques = window.VULCA_DATA?.critiques?.filter(c => c.artworkId === artwork.id) || [];
        const referencedImageIds = new Set();
        currentCritiques.forEach(critique => {
          if (critique.imageReferences) {
            critique.imageReferences.forEach(id => referencedImageIds.add(id));
          }
        });

        if (referencedImageIds.size > 0) {
          artworkCarousel.highlightImages(Array.from(referencedImageIds));
        }

        return;
      }
    }

    // Fallback: single image display (legacy format or single-image artwork)
    const figure = document.createElement('figure');
    figure.className = 'artwork-image';

    // Get image URL from images array (supports both new and legacy formats)
    const images = window.ImageCompat ? window.ImageCompat.getArtworkImages(artwork) : [];
    const imageUrl = images.length > 0 ? images[0].url : artwork.imageUrl;

    // Create image
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = `${artwork.titleZh} ${artwork.titleEn}`;
    img.loading = 'eager';

    // Add error handler for missing images (Phase 1: fix-artwork-image-display-system)
    img.onerror = () => {
      console.warn(`⚠ Image not found: ${imageUrl} (${artwork.id})`);
      container.innerHTML = '';
      const placeholder = createPlaceholder(artwork);
      container.appendChild(placeholder);
      console.log(`✓ Displaying placeholder for: ${artwork.titleZh}`);
    };

    figure.appendChild(img);
    container.appendChild(figure);

    console.log(`✓ Rendering single artwork image: ${artwork.titleZh}`);
  }

  /**
   * Create placeholder for missing artwork image
   * Phase 1 implementation of fix-artwork-image-display-system
   */
  function createPlaceholder(artwork) {
    const div = document.createElement('div');
    div.className = `artwork-placeholder ${artwork.id}`;
    div.setAttribute('role', 'img');
    div.setAttribute('aria-label',
      `${artwork.titleZh} ${artwork.titleEn}, ${artwork.artist}, ${artwork.year}, Image Pending Acquisition`
    );

    div.innerHTML = `
      <div class="placeholder-content">
        <h3 class="placeholder-title" lang="zh">${artwork.titleZh}</h3>
        <p class="placeholder-title-en" lang="en">${artwork.titleEn}</p>
        <p class="placeholder-meta">${artwork.artist} • ${artwork.year}</p>
        <p class="placeholder-status">🖼️ Image Pending Acquisition</p>
      </div>
    `;

    return div;
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
    panel.setAttribute('data-reveal', ''); // Enable scroll-reveal animation

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

    // Text content (with image reference support)
    const textEl = document.createElement('p');
    textEl.className = 'critique-text';
    const textId = `critique-text-${critique.personaId}-${critique.artworkId}`;
    textEl.id = textId;

    // Use English or Chinese based on current language
    const lang = document.documentElement.getAttribute('data-lang') || 'zh';
    const text = lang === 'en' ? critique.textEn : critique.textZh;

    // Store full text for expand/collapse
    const fullText = text || '';
    panel.dataset.fullText = fullText;

    // Set truncated text by default
    textEl.textContent = truncateText(fullText, 150);

    panel.appendChild(textEl);

    // Toggle button for expand/collapse
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'critique-toggle-btn';
    toggleBtn.textContent = '展开 ▼';
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-label', '展开评论全文');
    toggleBtn.setAttribute('aria-controls', textId);

    toggleBtn.addEventListener('click', () => {
      toggleCritiqueExpansion(panel, textEl, toggleBtn, fullText);
    });

    panel.appendChild(toggleBtn);

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

  /**
   * Handle click on image reference link in critique text
   * Navigates to the referenced image in the artwork carousel (if multi-image)
   */
  function handleImageReferenceClick(imageId, artwork) {
    console.log(`[Gallery Hero] Image reference clicked: ${imageId}`);

    // Find the carousel instance in the artwork-image-container
    const container = document.getElementById('artwork-image-container');
    if (!container) {
      console.warn('[Gallery Hero] No artwork container found');
      return;
    }

    // Check if this artwork has a multi-image carousel
    if (!window.ImageCompat) {
      console.warn('[Gallery Hero] ImageCompat not available');
      return;
    }

    const images = window.ImageCompat.getArtworkImages(artwork);

    if (images.length <= 1) {
      // Single image artwork - no carousel navigation needed
      console.log('[Gallery Hero] Single image artwork, no carousel to navigate');
      return;
    }

    // Find the image index
    const imageIndex = images.findIndex(img => img.id === imageId);
    if (imageIndex === -1) {
      console.warn(`[Gallery Hero] Image ${imageId} not found in artwork images`);
      return;
    }

    // Trigger carousel navigation by dispatching custom event to container
    const event = new CustomEvent('carousel:navigateTo', {
      detail: { imageIndex, imageId },
      bubbles: true
    });
    container.dispatchEvent(event);

    console.log(`[Gallery Hero] Dispatched navigation event to index ${imageIndex} (${imageId})`);

    // Scroll to carousel (smooth scroll)
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
