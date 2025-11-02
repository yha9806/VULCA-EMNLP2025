/**
 * Critique Parser Utility
 * Version: 1.0.0
 *
 * Parses critique text to extract and validate image references using [img:id] syntax.
 * Enables hybrid critique system where critics can reference specific images in their text.
 *
 * Part of: implement-multi-image-artwork-series OpenSpec change
 * Spec: openspec/changes/implement-multi-image-artwork-series/specs/hybrid-critique-system/spec.md
 */

(function() {
  'use strict';

  /**
   * Regular expression to match [img:image-id] patterns
   *
   * Pattern: [img:id]
   * Examples: [img:img-1-3], [img:img-2-5]
   *
   * Captures:
   * - Full match: "[img:img-1-3]"
   * - Group 1: "img-1-3" (the image ID)
   */
  const IMAGE_REFERENCE_REGEX = /\[img:(img-\d+-\d+)\]/g;

  /**
   * Parse critique text to extract image references
   *
   * Finds all [img:id] patterns in the text and extracts the image IDs.
   *
   * @param {string} text - Critique text (textZh or textEn)
   * @returns {Array<Object>} Array of reference objects with { index, imageId, startPos, endPos, fullMatch }
   *
   * @example
   * const text = "如[img:img-1-3]所示，机械臂的动作充满诗意...";
   * const refs = parseImageReferences(text);
   * // Returns: [{ index: 0, imageId: "img-1-3", startPos: 1, endPos: 15, fullMatch: "[img:img-1-3]" }]
   */
  function parseImageReferences(text) {
    if (!text || typeof text !== 'string') {
      console.warn('[Critique Parser] parseImageReferences called with invalid text');
      return [];
    }

    const references = [];
    let match;

    // Reset regex state
    IMAGE_REFERENCE_REGEX.lastIndex = 0;

    while ((match = IMAGE_REFERENCE_REGEX.exec(text)) !== null) {
      references.push({
        index: references.length,
        imageId: match[1], // Captured image ID
        startPos: match.index,
        endPos: match.index + match[0].length,
        fullMatch: match[0]
      });
    }

    console.log(`[Critique Parser] Found ${references.length} image reference(s) in text`);
    return references;
  }

  /**
   * Extract unique image IDs from critique text
   *
   * @param {string} text - Critique text
   * @returns {Array<string>} Array of unique image IDs
   *
   * @example
   * const text = "如[img:img-1-3]所示...另见[img:img-1-5]和[img:img-1-3]";
   * extractImageIds(text); // Returns: ["img-1-3", "img-1-5"]
   */
  function extractImageIds(text) {
    const references = parseImageReferences(text);
    const uniqueIds = [...new Set(references.map(ref => ref.imageId))];
    return uniqueIds;
  }

  /**
   * Validate image references against artwork's images array
   *
   * Checks if all referenced image IDs exist in the artwork.
   * Logs warnings for invalid references.
   *
   * @param {string} text - Critique text
   * @param {Object} artwork - Artwork object with images array
   * @returns {Object} Validation result with { valid, invalid, references }
   *
   * @example
   * const validation = validateImageReferences(critiqueText, artwork);
   * if (validation.invalid.length > 0) {
   *   console.warn("Invalid references:", validation.invalid);
   * }
   */
  function validateImageReferences(text, artwork) {
    const references = parseImageReferences(text);

    if (references.length === 0) {
      return {
        valid: [],
        invalid: [],
        references: [],
        allValid: true
      };
    }

    // Get artwork images using compatibility helper
    if (!window.ImageCompat) {
      console.error('[Critique Parser] ImageCompat utility not loaded');
      return {
        valid: [],
        invalid: references.map(ref => ref.imageId),
        references: [],
        allValid: false
      };
    }

    const artworkImages = window.ImageCompat.getArtworkImages(artwork);
    const validImageIds = new Set(artworkImages.map(img => img.id));

    const valid = [];
    const invalid = [];

    references.forEach(ref => {
      if (validImageIds.has(ref.imageId)) {
        valid.push(ref);
      } else {
        invalid.push(ref);
        console.warn(
          `[Critique Parser] Invalid image reference: ${ref.imageId} not found in artwork ${artwork.id}`,
          `Position: ${ref.startPos}-${ref.endPos}`
        );
      }
    });

    const allValid = invalid.length === 0;

    console.log(
      `[Critique Parser] Validation for ${artwork.id}: ${valid.length} valid, ${invalid.length} invalid`
    );

    return {
      valid,
      invalid,
      references,
      allValid
    };
  }

  /**
   * Replace image references with HTML links
   *
   * Converts [img:id] syntax to clickable <a> tags with data attributes.
   * Invalid references are left as-is (original syntax displayed).
   *
   * @param {string} text - Critique text with [img:id] references
   * @param {Object} artwork - Artwork object with images array
   * @param {Object} options - Rendering options
   * @returns {string} HTML string with replaced references
   *
   * @example
   * const html = renderImageReferences(
   *   "如[img:img-1-3]所示...",
   *   artwork,
   *   { linkClass: 'image-ref-link', targetBlank: false }
   * );
   * // Returns: "如<a href='#' class='image-ref-link' data-image-id='img-1-3'>图片3</a>所示..."
   */
  function renderImageReferences(text, artwork, options = {}) {
    if (!text || typeof text !== 'string') {
      return text || '';
    }

    const validation = validateImageReferences(text, artwork);

    if (validation.references.length === 0) {
      return text; // No references, return original text
    }

    // Get artwork images for lookup
    const artworkImages = window.ImageCompat.getArtworkImages(artwork);
    const imageMap = new Map(artworkImages.map(img => [img.id, img]));

    // Default options
    const opts = {
      linkClass: options.linkClass || 'image-reference-link',
      targetBlank: options.targetBlank || false,
      showImageTitle: options.showImageTitle !== false, // Default: true
      invalidClass: options.invalidClass || 'image-reference-invalid',
      ...options
    };

    let result = text;
    let offset = 0; // Track position changes due to replacements

    validation.references.forEach(ref => {
      const isValid = validation.valid.some(v => v.index === ref.index);

      if (isValid) {
        const image = imageMap.get(ref.imageId);
        const imageTitle = opts.showImageTitle ? image.titleZh || image.titleEn : ref.imageId;
        const imageSequence = image.sequence || '?';

        // Create clickable link
        const link = `<a href="#" class="${opts.linkClass}" data-image-id="${ref.imageId}" data-artwork-id="${artwork.id}" onclick="event.preventDefault();" title="${image.titleEn}">图片${imageSequence}</a>`;

        // Replace in result string
        const adjustedStart = ref.startPos + offset;
        const adjustedEnd = ref.endPos + offset;

        result = result.substring(0, adjustedStart) + link + result.substring(adjustedEnd);

        // Update offset for next replacement
        offset += link.length - ref.fullMatch.length;

        console.log(`[Critique Parser] Replaced ${ref.fullMatch} with link to ${ref.imageId}`);
      } else {
        // Invalid reference - optionally mark with CSS class
        if (opts.invalidClass) {
          const marked = `<span class="${opts.invalidClass}">${ref.fullMatch}</span>`;
          const adjustedStart = ref.startPos + offset;
          const adjustedEnd = ref.endPos + offset;

          result = result.substring(0, adjustedStart) + marked + result.substring(adjustedEnd);
          offset += marked.length - ref.fullMatch.length;
        }
        // Otherwise leave original syntax as-is
      }
    });

    return result;
  }

  /**
   * Get metadata for all referenced images
   *
   * Returns full image objects for all valid references in the text.
   *
   * @param {string} text - Critique text
   * @param {Object} artwork - Artwork object
   * @returns {Array<Object>} Array of image objects
   */
  function getReferencedImages(text, artwork) {
    const validation = validateImageReferences(text, artwork);
    const artworkImages = window.ImageCompat.getArtworkImages(artwork);

    const referencedImages = validation.valid.map(ref => {
      return artworkImages.find(img => img.id === ref.imageId);
    }).filter(img => img !== undefined);

    return referencedImages;
  }

  /**
   * Update critique object with imageReferences array
   *
   * Extracts image IDs from critique text and adds them to critique.imageReferences.
   * Safe to call multiple times (idempotent).
   *
   * @param {Object} critique - Critique object with textZh and textEn
   * @param {Object} artwork - Artwork object
   * @returns {Object} Updated critique object
   */
  function enrichCritiqueWithReferences(critique, artwork) {
    if (!critique) {
      console.warn('[Critique Parser] enrichCritiqueWithReferences called with null critique');
      return critique;
    }

    // Extract from both Chinese and English text
    const idsFromZh = extractImageIds(critique.textZh || '');
    const idsFromEn = extractImageIds(critique.textEn || '');

    // Combine and deduplicate
    const allIds = [...new Set([...idsFromZh, ...idsFromEn])];

    // Validate against artwork
    const validation = {
      valid: [],
      invalid: []
    };

    const artworkImages = window.ImageCompat ? window.ImageCompat.getArtworkImages(artwork) : [];
    const validImageIds = new Set(artworkImages.map(img => img.id));

    allIds.forEach(id => {
      if (validImageIds.has(id)) {
        validation.valid.push(id);
      } else {
        validation.invalid.push(id);
        console.warn(`[Critique Parser] Invalid reference in critique: ${id}`);
      }
    });

    // Update critique object
    critique.imageReferences = validation.valid;

    console.log(
      `[Critique Parser] Enriched critique ${critique.personaId} → ${critique.artworkId}: ${validation.valid.length} references`
    );

    return critique;
  }

  // Export functions to global namespace
  window.CritiqueParser = {
    parseImageReferences,
    extractImageIds,
    validateImageReferences,
    renderImageReferences,
    getReferencedImages,
    enrichCritiqueWithReferences
  };

  console.log('[Critique Parser] Utility initialized with functions:', Object.keys(window.CritiqueParser));

})();
