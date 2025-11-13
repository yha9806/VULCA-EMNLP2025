/**
 * VULCA Gallery Initialization System
 * Version 3.0.0 - Dynamic gallery rendering
 *
 * This module handles:
 * - Rendering artwork sections
 * - Creating critique panels
 * - Setting up visualization containers
 * - Managing responsive layout
 */

window.GalleryInit = (function() {
  'use strict';

  /**
   * Initialize the entire gallery
   */
  function init() {
    // Get data reference at init time (not at load time)
    const data = window.VULCA_DATA;

    if (!data || !data.artworks || !data.personas || !data.critiques) {
      console.error('VULCA_DATA not found or incomplete');
      return;
    }

    const gallery = document.getElementById('gallery');
    if (!gallery) {
      console.error('Gallery element not found');
      return;
    }

    // Render all artworks
    data.artworks.forEach((artwork) => {
      const artworkSection = createArtworkSection(artwork);
      gallery.appendChild(artworkSection);
    });

    console.log(`✓ Gallery initialized with ${data.artworks.length} artworks`);
    console.log(`✓ ${data.critiques.length} critiques loaded`);
    console.log(`✓ ${data.personas.length} personas available`);
  }

  /**
   * Create a single artwork section
   * @param {Object} artwork - Artwork data
   * @returns {HTMLElement} Artwork section element
   */
  function createArtworkSection(artwork) {
    const section = document.createElement('article');
    section.className = 'artwork-section';
    section.id = artwork.id;
    section.setAttribute('data-artwork-id', artwork.id);

    // Create header
    const header = createArtworkHeader(artwork);
    section.appendChild(header);

    // Create critiques container
    const critiquesContainer = createCritiquesContainer(artwork.id);
    section.appendChild(critiquesContainer);

    // Create visualization container
    const vizContainer = createVisualizationContainer(artwork.id);
    section.appendChild(vizContainer);

    return section;
  }

  /**
   * Create artwork header (image + metadata)
   * @param {Object} artwork - Artwork data
   * @returns {HTMLElement} Header element
   */
  function createArtworkHeader(artwork) {
    const header = document.createElement('header');
    header.className = 'artwork-header';

    // Image figure
    const figure = document.createElement('figure');
    figure.className = 'artwork-image';

    const img = document.createElement('img');
    img.src = artwork.imageUrl;
    img.alt = `${artwork.titleZh} ${artwork.titleEn}`;
    img.loading = 'lazy';
    img.srcset = artwork.imageUrl; // Can be enhanced with multiple resolutions

    figure.appendChild(img);
    header.appendChild(figure);

    // Metadata
    const metadata = document.createElement('div');
    metadata.className = 'artwork-metadata';

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
    title.appendChild(titleEn);
    metadata.appendChild(title);

    // Year
    const year = document.createElement('time');
    year.className = 'artwork-year';
    year.dateTime = artwork.year;
    year.textContent = artwork.year;
    metadata.appendChild(year);

    header.appendChild(metadata);

    return header;
  }

  /**
   * Create critiques container with all critique panels for this artwork
   * @param {String} artworkId - Artwork ID
   * @returns {HTMLElement} Critiques container
   */
  function createCritiquesContainer(artworkId) {
    const container = document.createElement('section');
    container.className = 'critiques-container';
    container.setAttribute('aria-label', 'Critique perspectives');

    // Get data reference
    const data = window.VULCA_DATA;
    if (!data) return container;

    // Filter critiques for this artwork
    const critiquesForArtwork = data.critiques.filter(
      (c) => c.artworkId === artworkId
    );

    // Create a critique panel for each persona
    data.personas.forEach((persona) => {
      const critique = critiquesForArtwork.find(
        (c) => c.personaId === persona.id
      );

      if (critique) {
        const panel = createCritiquePanel(persona, critique);
        container.appendChild(panel);
      }
    });

    return container;
  }

  /**
   * Handle click on image reference link
   * @param {String} imageId - Image ID to navigate to
   * @param {Object} artwork - Artwork object
   */
  function handleImageReferenceClick(imageId, artwork) {
    if (!imageId || !artwork) {
      console.warn('[Gallery Init] Invalid image reference click:', imageId, artwork);
      return;
    }

    console.log(`[Gallery Init] Image reference clicked: ${imageId} for artwork ${artwork.id}`);

    // Find the image index
    const images = window.ImageCompat ? window.ImageCompat.getArtworkImages(artwork) : [];
    const imageIndex = images.findIndex(img => img.id === imageId);

    if (imageIndex === -1) {
      console.warn(`[Gallery Init] Image not found: ${imageId}`);
      return;
    }

    // Find the carousel container (main page uses #artwork-image-container)
    const artworkContainer = document.getElementById('artwork-image-container');

    if (artworkContainer) {
      // Dispatch custom event to navigate carousel
      const event = new CustomEvent('carousel:navigateTo', {
        detail: { imageIndex },
        bubbles: true
      });
      artworkContainer.dispatchEvent(event);
      console.log(`[Gallery Init] Dispatched navigation event to index ${imageIndex}`);
    } else {
      console.warn(`[Gallery Init] Carousel container not found for artwork ${artwork.id}`);
    }
  }

  /**
   * Create a single critique panel
   * @param {Object} persona - Persona data
   * @param {Object} critique - Critique data
   * @returns {HTMLElement} Critique panel element
   */
  function createCritiquePanel(persona, critique) {
    const panel = document.createElement('article');
    panel.className = 'critique-panel';
    panel.setAttribute('data-persona-id', persona.id);

    // Header with persona name and era
    const panelHeader = document.createElement('header');
    panelHeader.className = 'critique-header';

    const name = document.createElement('h3');
    name.className = 'persona-name';
    name.textContent = persona.nameZh;
    panelHeader.appendChild(name);

    const era = document.createElement('span');
    era.className = 'persona-era';
    era.textContent = persona.period;
    panelHeader.appendChild(era);

    const colorIndicator = document.createElement('span');
    colorIndicator.className = 'persona-color-indicator';
    colorIndicator.style.backgroundColor = persona.color;
    panelHeader.appendChild(colorIndicator);

    panel.appendChild(panelHeader);

    // Critique body (bilingual)
    const body = document.createElement('div');
    body.className = 'critique-body';

    const textZh = document.createElement('p');
    textZh.className = 'critique-text';
    textZh.lang = 'zh';

    const textEn = document.createElement('p');
    textEn.className = 'critique-text';
    textEn.lang = 'en';

    // Render with CritiqueParser if available (for image reference links)
    if (window.CritiqueParser && critique.artworkId) {
      const artwork = window.VULCA_DATA?.artworks?.find(a => a.id === critique.artworkId);

      if (artwork) {
        // Render image references as clickable links
        textZh.innerHTML = window.CritiqueParser.renderImageReferences(critique.textZh, artwork, {
          linkClass: 'image-reference-link',
          showImageTitle: false,
          format: 'chinese'
        });

        textEn.innerHTML = window.CritiqueParser.renderImageReferences(critique.textEn, artwork, {
          linkClass: 'image-reference-link',
          showImageTitle: false,
          format: 'english'
        });

        // Add click handlers for image reference links (after DOM insertion)
        setTimeout(() => {
          textZh.querySelectorAll('.image-reference-link').forEach(link => {
            link.addEventListener('click', (e) => {
              e.preventDefault();
              handleImageReferenceClick(link.dataset.imageId, artwork);
            });
          });

          textEn.querySelectorAll('.image-reference-link').forEach(link => {
            link.addEventListener('click', (e) => {
              e.preventDefault();
              handleImageReferenceClick(link.dataset.imageId, artwork);
            });
          });
        }, 0);
      } else {
        // Fallback: plain text
        textZh.textContent = critique.textZh;
        textEn.textContent = critique.textEn;
      }
    } else {
      // Fallback: plain text
      textZh.textContent = critique.textZh;
      textEn.textContent = critique.textEn;
    }

    body.appendChild(textZh);
    body.appendChild(textEn);

    panel.appendChild(body);

    // Footer with RPAIT scores
    const footer = document.createElement('footer');
    footer.className = 'critique-footer';

    const scoresDiv = document.createElement('div');
    scoresDiv.className = 'rpait-scores';

    const label = document.createElement('span');
    label.className = 'rpait-label';
    label.textContent = 'RPAIT:';
    scoresDiv.appendChild(label);

    // Add individual scores
    const dimensions = ['R', 'P', 'A', 'I', 'T'];
    dimensions.forEach((dim) => {
      const scoreSpan = document.createElement('span');
      scoreSpan.className = `score-${dim.toLowerCase()}`;
      scoreSpan.textContent = `${dim}: ${critique.rpait[dim]}`;
      scoresDiv.appendChild(scoreSpan);
    });

    footer.appendChild(scoresDiv);
    panel.appendChild(footer);

    return panel;
  }

  /**
   * Create visualization container for RPAIT chart
   * @param {String} artworkId - Artwork ID
   * @returns {HTMLElement} Visualization container
   */
  function createVisualizationContainer(artworkId) {
    const container = document.createElement('section');
    container.className = 'visualization-container';
    container.setAttribute('aria-label', 'RPAIT visualization');

    // Create canvas for chart
    const canvas = document.createElement('canvas');
    canvas.id = `rpait-chart-${artworkId}`;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'RPAIT dimension chart');

    container.appendChild(canvas);

    // Create fallback text table (for accessibility)
    const fallback = document.createElement('div');
    fallback.className = 'visualization-fallback';
    fallback.style.display = 'none';

    const table = document.createElement('table');
    table.innerHTML = `
      <caption>RPAIT Scores for ${artworkId}</caption>
      <thead>
        <tr>
          <th>Persona</th>
          <th>R</th>
          <th>P</th>
          <th>A</th>
          <th>I</th>
          <th>T</th>
        </tr>
      </thead>
      <tbody>
        ${generateFallbackTableRows(artworkId)}
      </tbody>
    `;

    fallback.appendChild(table);
    container.appendChild(fallback);

    return container;
  }

  /**
   * Generate table rows for accessibility fallback
   * @param {String} artworkId - Artwork ID
   * @returns {String} HTML table rows
   */
  function generateFallbackTableRows(artworkId) {
    const data = window.VULCA_DATA;
    if (!data) return '';

    const critiques = data.critiques.filter((c) => c.artworkId === artworkId);

    return critiques
      .map((critique) => {
        const persona = data.personas.find((p) => p.id === critique.personaId);
        return `
        <tr>
          <td>${persona.nameZh}</td>
          <td>${critique.rpait.R}</td>
          <td>${critique.rpait.P}</td>
          <td>${critique.rpait.A}</td>
          <td>${critique.rpait.I}</td>
          <td>${critique.rpait.T}</td>
        </tr>
      `;
      })
      .join('');
  }

  /**
   * Get artwork by ID
   * @param {String} artworkId - Artwork ID
   * @returns {Object} Artwork data
   */
  function getArtwork(artworkId) {
    return window.VULCA_DATA?.artworks.find((a) => a.id === artworkId);
  }

  /**
   * Get persona by ID
   * @param {String} personaId - Persona ID
   * @returns {Object} Persona data
   */
  function getPersona(personaId) {
    return window.VULCA_DATA?.personas.find((p) => p.id === personaId);
  }

  /**
   * Get critiques for a specific artwork
   * @param {String} artworkId - Artwork ID
   * @returns {Array} Critique data array
   */
  function getCritiquesForArtwork(artworkId) {
    return window.VULCA_DATA?.critiques.filter((c) => c.artworkId === artworkId);
  }

  /**
   * Get all data
   * @returns {Object} Complete VULCA data
   */
  function getData() {
    return window.VULCA_DATA;
  }

  // Public API
  return {
    init: init,
    getArtwork: getArtwork,
    getPersona: getPersona,
    getCritiquesForArtwork: getCritiquesForArtwork,
    getData: getData,
  };
})();

// Initialize gallery when both DOM and VULCA_DATA are ready
function attemptInit() {
  if (window.VULCA_DATA_READY) {
    // Data is ready, initialize now
    window.GalleryInit.init();
  } else {
    // Data not ready yet, wait for event
    document.addEventListener('vulca-data-ready', () => {
      window.GalleryInit.init();
    }, { once: true });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', attemptInit);
} else {
  // DOM already loaded
  attemptInit();
}
