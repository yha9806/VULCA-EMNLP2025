/**
 * Image Compatibility Utility
 * Version: 1.0.0
 *
 * Provides backward compatibility between legacy single-image format (imageUrl)
 * and new multi-image format (images array).
 *
 * Part of: implement-multi-image-artwork-series OpenSpec change
 * Spec: openspec/changes/implement-multi-image-artwork-series/specs/multi-image-data-structure/spec.md
 */

(function() {
  'use strict';

  /**
   * Get artwork images in standardized format
   *
   * Handles both new multi-image format and legacy single-image format.
   * Ensures consistent data structure for rendering components.
   *
   * @param {Object} artwork - Artwork object from VULCA_DATA.artworks
   * @returns {Array} Array of image objects with standardized structure
   *
   * @example
   * // New format (with images array)
   * const artwork = { id: "artwork-1", images: [{...}, {...}] };
   * getArtworkImages(artwork); // Returns: [{...}, {...}]
   *
   * @example
   * // Legacy format (with imageUrl)
   * const artwork = { id: "artwork-2", imageUrl: "/assets/artwork-2.jpg", titleZh: "作品2", titleEn: "Artwork 2" };
   * getArtworkImages(artwork); // Returns: [{ id: "artwork-2-legacy", url: "/assets/artwork-2.jpg", ... }]
   */
  function getArtworkImages(artwork) {
    if (!artwork) {
      console.warn('[Image Compat] getArtworkImages called with null/undefined artwork');
      return [];
    }

    // Priority 1: New multi-image format
    if (artwork.images && Array.isArray(artwork.images) && artwork.images.length > 0) {
      console.log(`[Image Compat] Using images array for ${artwork.id} (${artwork.images.length} images)`);
      return artwork.images;
    }

    // Priority 2: Legacy single-image format
    if (artwork.imageUrl) {
      console.log(`[Image Compat] Converting legacy imageUrl for ${artwork.id}`);

      const legacyImage = {
        id: `${artwork.id}-legacy`,
        url: artwork.imageUrl,
        category: window.IMAGE_CATEGORIES ? window.IMAGE_CATEGORIES.FINAL : "final",
        sequence: 1,
        titleZh: artwork.titleZh || "未命名作品",
        titleEn: artwork.titleEn || "Untitled Artwork",
        caption: artwork.context || "",
        metadata: {
          year: artwork.year,
          artist: artwork.artist
        }
      };

      return [legacyImage];
    }

    // No images available
    console.warn(`[Image Compat] No images found for artwork ${artwork.id}`);
    return [];
  }

  /**
   * Get primary image for artwork
   *
   * Returns the designated primary image or falls back to first image in sequence.
   *
   * @param {Object} artwork - Artwork object from VULCA_DATA.artworks
   * @returns {Object|null} Primary image object or null if no images
   *
   * @example
   * const artwork = { id: "artwork-1", primaryImageId: "img-1-3", images: [...] };
   * getPrimaryImage(artwork); // Returns: image with id === "img-1-3"
   */
  function getPrimaryImage(artwork) {
    const images = getArtworkImages(artwork);

    if (images.length === 0) {
      return null;
    }

    // If primaryImageId specified, find that image
    if (artwork.primaryImageId) {
      const primaryImg = images.find(img => img.id === artwork.primaryImageId);

      if (primaryImg) {
        console.log(`[Image Compat] Using designated primary image ${artwork.primaryImageId} for ${artwork.id}`);
        return primaryImg;
      } else {
        console.warn(`[Image Compat] Primary image ${artwork.primaryImageId} not found for ${artwork.id}, falling back to first image`);
      }
    }

    // Default: return first image (lowest sequence number)
    const sortedImages = [...images].sort((a, b) => a.sequence - b.sequence);
    console.log(`[Image Compat] Using first image as primary for ${artwork.id}`);
    return sortedImages[0];
  }

  /**
   * Check if artwork uses new multi-image format
   *
   * @param {Object} artwork - Artwork object
   * @returns {boolean} True if artwork has images array with multiple images
   */
  function isMultiImageArtwork(artwork) {
    return artwork &&
           artwork.images &&
           Array.isArray(artwork.images) &&
           artwork.images.length > 1;
  }

  /**
   * Get image count for artwork
   *
   * @param {Object} artwork - Artwork object
   * @returns {number} Number of images (0 if none)
   */
  function getImageCount(artwork) {
    const images = getArtworkImages(artwork);
    return images.length;
  }

  // Export functions to global namespace
  window.ImageCompat = {
    getArtworkImages,
    getPrimaryImage,
    isMultiImageArtwork,
    getImageCount
  };

  console.log('[Image Compat] Utility initialized with functions:', Object.keys(window.ImageCompat));

})();
