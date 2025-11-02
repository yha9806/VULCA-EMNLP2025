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
      vizContainer.setAttribute('data-reveal', ''); // Enable scroll-reveal animation
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

    // Dimension labels (English names for tooltip)
    const dimensions = [
      { key: 'R', label: 'Representation' },
      { key: 'P', label: 'Philosophy' },
      { key: 'A', label: 'Aesthetics' },
      { key: 'I', label: 'Interpretation' },
      { key: 'T', label: 'Technique' }
    ];

    dimensions.forEach(dim => {
      const score = avgRpait[dim.key];

      // Validate score
      const validScore = Math.max(1, Math.min(10, parseInt(score) || 0));

      // Create bar container (use .rpait-bar, not .rpait-bar-container)
      const bar = document.createElement('div');
      bar.className = 'rpait-bar';
      bar.setAttribute('data-dimension', dim.key);

      // Label with abbr and score
      const label = document.createElement('div');  // div, not span
      label.className = 'rpait-label';
      label.innerHTML = `<abbr title="${dim.label}">${dim.key}</abbr><span class="score">${validScore}/10</span>`;

      // Bar background container
      const barBg = document.createElement('div');
      barBg.className = 'rpait-bar-bg';

      // Bar fill (the colored part)
      const fill = document.createElement('div');
      fill.className = 'rpait-bar-fill';
      fill.style.width = `${(validScore / 10) * 100}%`;
      fill.style.backgroundColor = '#4a90a4';  // Default color

      barBg.appendChild(fill);

      bar.appendChild(label);
      bar.appendChild(barBg);
      gridContainer.appendChild(bar);
    });

    vizContainer.appendChild(gridContainer);

    console.log('✓ Rendered RPAIT visualization');
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

    // Use English or Chinese based on current language
    const lang = document.documentElement.getAttribute('data-lang') || 'zh';
    const text = lang === 'en' ? critique.textEn : critique.textZh;

    // Render with CritiqueParser if available
    if (window.CritiqueParser && critique.artworkId) {
      const artwork = window.VULCA_DATA?.artworks?.find(a => a.id === critique.artworkId);

      if (artwork) {
        // Render image references as clickable links
        const renderedText = window.CritiqueParser.renderImageReferences(text, artwork, {
          linkClass: 'image-reference-link',
          showImageTitle: false, // Keep critique text clean
          format: 'chinese' // Use "图片X" format
        });

        textEl.innerHTML = renderedText;

        // Add click handlers for image reference links
        setTimeout(() => {
          textEl.querySelectorAll('.image-reference-link').forEach(link => {
            link.addEventListener('click', (e) => {
              e.preventDefault();
              const imageId = link.dataset.imageId;
              handleImageReferenceClick(imageId, artwork);
            });
          });
        }, 0);
      } else {
        textEl.textContent = text || '';
      }
    } else {
      textEl.textContent = text || '';
    }

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

    // Find the carousel instance
    // The carousel is stored in the container's data attribute or we can search for it
    const carouselElement = container.querySelector('.carousel-container');
    if (!carouselElement) {
      console.warn('[Gallery Hero] Multi-image artwork but carousel not found in DOM');
      return;
    }

    // Find the image index
    const imageIndex = images.findIndex(img => img.id === imageId);
    if (imageIndex === -1) {
      console.warn(`[Gallery Hero] Image ${imageId} not found in artwork images`);
      return;
    }

    // Trigger carousel navigation
    // We need to access the carousel instance - let's dispatch a custom event
    const event = new CustomEvent('carousel:navigateTo', {
      detail: { imageIndex, imageId }
    });
    carouselElement.dispatchEvent(event);

    console.log(`[Gallery Hero] Navigating carousel to image ${imageIndex + 1}: ${imageId}`);

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
