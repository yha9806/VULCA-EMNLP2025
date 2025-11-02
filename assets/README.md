# Assets Directory - Artwork Images

## Status

This directory is prepared to hold high-quality images of the 4 Sougwen Chung artworks featured in the VULCA exhibition.

## Artwork Files

### Pending Acquisition

```
artwork-1.jpg   - Memory (Painting Operation Unit: Second Generation) - 2022
artwork-2.jpg   - Painting Operation Unit: First Generation (Imitation) - 2015
artwork-3.jpg   - All Things in All Things - 2018
artwork-4.jpg   - Exquisite Dialogue: Sepals, Petals, Thorns - 2020
```

## Image Sourcing

### Recommended Sources (in order of preference)

1. **Sougwen Chung Official Website**: https://sougwen.com/artworks
   - Status: Artworks documented, high-res images available
   - Rights: Contact artist for usage permissions

2. **Victoria and Albert Museum Collection**:
   - Holds "Memory" (Drawing Operations Unit: Generation 2) since 2022
   - Status: Museum acquisition confirmed
   - Rights: Potentially available under museum licensing

3. **Artsy.net**:
   - Profile: https://www.artsy.net/artist/sougwen-chung
   - Status: Gallery representation available
   - Contact: Gillian Jason Gallery

4. **Academic/Exhibition Documentation**:
   - MIT Media Lab connections
   - International exhibitions
   - Conference publications

### Image Requirements

- **Format**: JPG or PNG
- **Resolution**: 1200×800px minimum (landscape orientation)
- **File size**: <500KB each for web performance
- **Aspect ratio**: Maintain original artwork proportions
- **Quality**: 85% JPG quality for balance of quality and file size

## Installation Instructions

Once images are acquired, place them in this directory:

```bash
# Optimize image (using ImageMagick)
magick input.jpg -resize 1200x800 -quality 85 assets/artwork-1.jpg

# Repeat for all 4 images
magick artwork-1.jpg -resize 1200x800 -quality 85 assets/artwork-1.jpg
magick artwork-2.jpg -resize 1200x800 -quality 85 assets/artwork-2.jpg
magick artwork-3.jpg -resize 1200x800 -quality 85 assets/artwork-3.jpg
magick artwork-4.jpg -resize 1200x800 -quality 85 assets/artwork-4.jpg

# Verify file sizes
ls -lh assets/
```

## Copyright and Attribution

Each image requires proper attribution:

```
Image: [Artwork Title]
Artist: Sougwen Chung
Year: [Year]
Source: [Museum/Gallery/Publication]
Rights: [Usage Rights/License]
```

## Next Steps

1. Acquire images from preferred sources
2. Optimize using ImageMagick (see instructions above)
3. Place in this `/assets/` directory
4. Test loading on http://localhost:9999
5. Verify responsive display across breakpoints

## Contact

For artist inquiries: https://sougwen.com/
For gallery representation: Gillian Jason Gallery
