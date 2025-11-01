# VULCA Pre-Week 1 Preparation Checklist

**Purpose:** Execute preparatory tasks before formal Week 1 begins
**Timeline:** Can start immediately (Days 1-3 of prep)
**Priority:** High - unblocks Week 1 Monday execution

---

## Phase 1: Domain Registration & Infrastructure (Parallel, Days 1-2)

### 1.1 Domain Registration - vulca.art

**Task:** Register custom domain for production deployment

**Steps:**

1. **Choose Registrar**
   - [ ] Namecheap (recommended - .art TLD support, <$15/year)
   - [ ] GoDaddy
   - [ ] Porkbun
   - [ ] Other: ____________

2. **Registration Details**
   ```
   Domain: vulca.art
   TLD: .art (creative/artistic domains)
   Duration: 1 year minimum
   Privacy: Enable WHOIS privacy (optional but recommended)
   Auto-renew: Yes
   ```

3. **Purchase Confirmation**
   - [ ] Domain purchased and confirmed
   - [ ] Confirmation email received
   - [ ] Registrar account credentials saved securely
   - [ ] Date registered: ______________

4. **Post-Purchase Setup (Do in Week 1)**
   - [ ] Point nameservers to GitHub Pages (during Week 4 deployment)
   - [ ] Configure CNAME record in GitHub repo
   - [ ] Enable HTTPS via GitHub Pages (automatic)

**Estimated Time:** 15-20 minutes
**Cost:** ~$10-15/year
**Status:**
```
[ ] Not started
[ ] In progress
[ ] Complete - Registered by: ________________
```

---

### 1.2 GitHub Repository Setup

**Task:** Create and initialize GitHub repository

**Steps:**

1. **Create Repository**
   ```bash
   Repository name: vulca-exhibition
   Visibility: Public
   Description: "VULCA: Immersive art exhibition featuring works by Sougwen Chung and Lauren McCarthy"
   Initialize with: README.md
   .gitignore: Node.js template
   License: MIT (optional)
   ```

2. **Initial Repository Structure**
   ```
   vulca-exhibition/
   ├── README.md (to be updated)
   ├── .gitignore
   ├── docs/
   │   ├── index.html (to create)
   │   ├── detail.html (to create)
   │   ├── css/ (to create)
   │   ├── js/ (to create)
   │   ├── data/ (to create)
   │   └── images/ (to create)
   └── openspec/ (copy planning docs here)
   ```

3. **Clone Repository Locally**
   ```bash
   git clone https://github.com/YOUR_USERNAME/vulca-exhibition.git
   cd vulca-exhibition
   ```

4. **First Commit: Project Scaffold**
   ```bash
   # Copy planning documents to openspec/
   cp /path/to/FINAL_4WEEK_EXECUTION_PLAN.md openspec/
   cp /path/to/DESIGN_SPEC.md openspec/
   cp /path/to/ARTWORKS_DATA.json openspec/
   cp /path/to/IMAGE_ACQUISITION_GUIDE.md openspec/

   # Create docs directory structure
   mkdir -p docs/{css,js,data,images/{artworks,qrcodes}}

   # Create placeholder files
   touch docs/index.html docs/detail.html
   touch docs/css/main.css docs/js/main.js

   # Initial commit
   git add .
   git commit -m "Initial scaffold: Project structure and planning documents"
   git push -u origin main
   ```

**Estimated Time:** 30-45 minutes
**Cost:** Free
**Status:**
```
[ ] Not started
[ ] In progress
[ ] Repository created at: https://github.com/________/vulca-exhibition
[ ] First commit pushed: Yes/No
```

---

## Phase 2: Image Acquisition (Days 2-3)

### 2.1 Image Collection Workflow

**Reference:** See IMAGE_ACQUISITION_GUIDE.md for detailed instructions

**Task 1: Sougwen Chung Images (from PDF)**

```
PDF File: I:\VULCA-EMNLP2025\SOUGWEN CHUNG 2025 - CONGSHENG.pdf

Image 1: BODY MACHINE (MERIDIANS) - Installation View
├─ Source: PDF page 2 (cover image)
├─ Extract method: Adobe Acrobat Export or online PDF converter
├─ Quality: 600 DPI, RGB color space
├─ Target resolution: 3000×2000px
├─ File name: 001_sougwen_meridians_installation.jpg
└─ Status: [ ] Extracted [ ] Quality verified [ ] Ready to compress

Image 2: BODY MACHINE (MERIDIANS) - Detail Composition
├─ Source: PDF page 5 (9-grid detail view)
├─ Extract method: Crop center image from top row
├─ Quality: 600 DPI, RGB color space
├─ Target resolution: 3000×2000px
├─ File name: 002_sougwen_meridians_detail.jpg
└─ Status: [ ] Extracted [ ] Quality verified [ ] Ready to compress

Image 3: MEMORY - Drawing Operations Unit Gen 2
├─ Source: Web search for "Sougwen Chung MEMORY robotic drawing" OR V&A museum collection
├─ Alternative: https://collections.vam.ac.uk/ (Victoria & Albert Museum)
├─ Quality: High-res official image
├─ Target resolution: 3000×2000px
├─ File name: 004_sougwen_memory_drawing.jpg
└─ Status: [ ] Found [ ] Downloaded [ ] Quality verified [ ] Ready to compress
```

**PDF Extraction Methods:**

**Option A: Adobe Acrobat (if available)**
```
1. Open PDF in Adobe Acrobat
2. Tools → Export PDF → Select "Image" format
3. Choose page(s): 2, 5
4. Output format: JPEG
5. Resolution: 600 DPI
6. Color: RGB
7. Save to temp folder
```

**Option B: Free Online Converter**
```
1. Go to: https://smallpdf.com or https://ilovepdf.com
2. Upload: SOUGWEN CHUNG 2025 - CONGSHENG.pdf
3. Select: "PDF to JPG"
4. Settings:
   - Quality: Highest/Maximum
   - DPI: 150-200 minimum
5. Download individual pages
6. Upscale if needed (see below)
```

**Option C: Command Line (Python)**
```bash
# Install: pip install pdf2image pillow

python3 << 'EOF'
from pdf2image import convert_from_path
from PIL import Image

# Convert PDF pages to images
pages = convert_from_path(
    "SOUGWEN CHUNG 2025 - CONGSHENG.pdf",
    dpi=600,
    first_page=2,
    last_page=6
)

# Save images
for i, page in enumerate(pages):
    page.save(f"sougwen_page_{2+i}.jpg", "JPEG", quality=95)

print(f"✓ Extracted {len(pages)} images at 600 DPI")
EOF
```

**Image Upscaling (if resolution < 3000×2000px):**

If extracted images are smaller, upscale using:

```bash
# Using ImageMagick
convert input.jpg -resize 3000x2000! -quality 95 output.jpg

# Using Python PIL
python3 << 'EOF'
from PIL import Image
img = Image.open("input.jpg")
img_upscaled = img.resize((3000, 2000), Image.Resampling.LANCZOS)
img_upscaled.save("output.jpg", quality=95)
EOF
```

---

**Task 2: Lauren McCarthy Images (from Web)**

```
Source: https://freight.cargo.site/

Image: AUTO - LACMA Installation #1
├─ URL: https://freight.cargo.site/t/original/i/31ea1f1cda768984f5f0af806d62fc85ce55e6c2de2ea2ce55bb5bd74d9b0535/AutoLACMAGabrielNoguez-6.jpg
├─ Resolution: 3840×2474px (Premium quality) ✓
├─ File name: 003_lauren_auto_lacma_1.jpg
└─ Status: [ ] Downloaded [ ] Quality verified [ ] Ready to compress
```

**Download Instructions:**

```bash
# Using curl (command line)
curl -o 003_lauren_auto_lacma_1.jpg \
  "https://freight.cargo.site/t/original/i/31ea1f1cda768984f5f0af806d62fc85ce55e6c2de2ea2ce55bb5bd74d9b0535/AutoLACMAGabrielNoguez-6.jpg"

# Or right-click → "Save image as..." in browser
# Verify file size is 2.5-3.2 MB after download
```

---

### 2.2 Image Quality Verification

**For each of the 4 images, verify:**

```
Image File: ___________________

Quality Checklist:
[ ] Resolution: ≥3000×2000px (use: identify image.jpg or Properties)
[ ] Color Space: RGB (not CMYK, Grayscale)
[ ] File Format: JPEG (not PNG, BMP, TIFF)
[ ] Aspect Ratio: ~1.5:1 (width/height ≈ 1.5)
[ ] No corruption: Visual inspection shows no artifacts
[ ] Metadata: Checked and acceptable

Resolution: _______ × _______ px
File size (pre-compression): _______ MB
Color space: RGB / CMYK / Other: _______
Quality assessment: Good / Acceptable / Needs re-download
```

**Tool for verification:**
```bash
# Linux/Mac
identify image.jpg

# Windows
wmic datafile where name="C:\\path\\to\\image.jpg" get Description,Version
# Or use: https://www.imagemagick.org/
```

---

## Phase 3: Image Compression (Days 3)

### 3.1 TinyPNG Compression Workflow

**Purpose:** Reduce file size while maintaining visual quality

**Online Method (Easiest):**

1. **Visit:** https://tinypng.com
2. **Upload:** All 4 images together (drag & drop)
3. **Monitor:**
   - Show compression ratio (goal: 30-40% reduction)
   - Original: ~2.5-3.2 MB → Compressed: 1.8-2.2 MB ✓

4. **Download:** Get all 4 compressed images
   ```
   001_sougwen_meridians_installation.jpg (target: <2.0 MB)
   002_sougwen_meridians_detail.jpg (target: <2.0 MB)
   003_lauren_auto_lacma_1.jpg (target: <2.2 MB)
   004_sougwen_memory_drawing.jpg (target: <2.0 MB)
   ```

5. **Verify:**
   - [ ] All 4 files compressed
   - [ ] File sizes within targets
   - [ ] Visual quality maintained
   - [ ] Total size: ~7.8 MB (acceptable for website)

**API Method (Command Line - Advanced):**

```bash
# Get API key from tinypng.com
# Usage: requires programming knowledge

curl -u api:YOUR_API_KEY \
  --data-binary @uncompressed.png \
  -o compressed.png \
  https://api.tinify.com/output
```

**Status:**
```
Compression Method: [ ] TinyPNG Online [ ] ImageMagick [ ] Other

Image 1: _____ MB → _____ MB (✓ Acceptable / ⚠ Needs re-compression)
Image 2: _____ MB → _____ MB (✓ Acceptable / ⚠ Needs re-compression)
Image 3: _____ MB → _____ MB (✓ Acceptable / ⚠ Needs re-compression)
Image 4: _____ MB → _____ MB (✓ Acceptable / ⚠ Needs re-compression)

Total: _____ MB
```

---

### 3.2 WebP Conversion (Optional but Recommended)

**Purpose:** Modern format with 25-35% better compression than JPEG

**Using Squoosh (Online - Easiest):**

1. **Visit:** https://squoosh.app
2. **For each compressed JPEG:**
   - Upload file
   - Select format: WebP
   - Adjust quality slider to match visual quality with JPEG
   - Typical quality: 75-85

3. **Download WebP versions:**
   ```
   001_sougwen_meridians_installation.webp
   002_sougwen_meridians_detail.webp
   003_lauren_auto_lacma_1.webp
   004_sougwen_memory_drawing.webp
   ```

**Command Line Method:**

```bash
# Install FFmpeg (recommended for batch conversion)
# https://ffmpeg.org/

ffmpeg -i 001_sougwen_meridians_installation.jpg \
  -c:v libwebp -quality 80 \
  001_sougwen_meridians_installation.webp
```

**File Organization (After Compression):**

```
📁 Compressed Images (ready to upload)
├── 001_sougwen_meridians_installation.jpg  (1.95 MB)
├── 001_sougwen_meridians_installation.webp (1.2 MB) - optional
├── 002_sougwen_meridians_detail.jpg        (1.85 MB)
├── 002_sougwen_meridians_detail.webp       (1.1 MB) - optional
├── 003_lauren_auto_lacma_1.jpg             (2.15 MB)
├── 003_lauren_auto_lacma_1.webp            (1.3 MB) - optional
├── 004_sougwen_memory_drawing.jpg          (1.9 MB)
└── 004_sougwen_memory_drawing.webp         (1.15 MB) - optional

Total JPEG: 7.85 MB
Total with WebP: 12.05 MB (still acceptable for GitHub Pages)
```

**Status:**
```
WebP Conversion: [ ] Not needed [ ] In progress [ ] Complete

File sizes verified:
[ ] All JPEG files <2.2 MB
[ ] All WebP files (if created) <1.4 MB
[ ] Total footprint acceptable
```

---

## Phase 4: QR Code Generation (Day 3)

### 4.1 QR Code Creation

**Purpose:** Create scannable codes linking to artwork detail pages

**QR Code Details:**

```
URL Structure: https://vulca.art/detail/[artwork-id]

QR Code 001: https://vulca.art/detail/sougwen_meridians_01
QR Code 002: https://vulca.art/detail/sougwen_meridians_02
QR Code 003: https://vulca.art/detail/lauren_auto_01
QR Code 004: https://vulca.art/detail/sougwen_memory_01
```

**Generation Steps:**

1. **Visit:** https://qrcode.com or https://www.qr-code-generator.com/
2. **For each QR code:**
   - Input URL: https://vulca.art/detail/[id]
   - Size: 200×200px
   - Error correction: High (30% recovery capability)
   - Margin: 20px white space
   - Color settings:
     - Foreground (QR pattern): #1a1613 (dark)
     - Background: #f5f2ed (light) OR transparent
   - Export format: PNG (transparent background)

3. **Verification:**
   - [ ] Scan with phone camera
   - [ ] Verify link works
   - [ ] Repeat for all 4 codes

4. **File Naming & Organization:**
   ```
   docs/images/qrcodes/
   ├── 001.png (sougwen_meridians_01)
   ├── 002.png (sougwen_meridians_02)
   ├── 003.png (lauren_auto_01)
   └── 004.png (sougwen_memory_01)
   ```

**Alternative QR Code Parameters:**

```
Custom Brand Colors (Optional):
├─ Foreground: #d4af37 (gold) - requires lighter background
├─ Background: #1a1613 (dark) - requires lighter foreground
├─ High contrast version: #1a1613 foreground, #f5f2ed background

For On-Site Printing:
├─ Size: Enlarge to 500×500px for printing
├─ DPI: 300 for print quality
├─ Laminate if displayed outdoors
```

**Status:**
```
QR Codes Generated:
[ ] 001.png (sougwen_meridians_01) - [ ] Scanned & verified
[ ] 002.png (sougwen_meridians_02) - [ ] Scanned & verified
[ ] 003.png (lauren_auto_01) - [ ] Scanned & verified
[ ] 004.png (sougwen_memory_01) - [ ] Scanned & verified

All QR codes: [ ] Ready for deployment
```

---

## Phase 5: File Organization (End of Day 3)

### 5.1 Final Directory Structure

**Create this structure in GitHub repo:**

```bash
# Clone repo (already done in Phase 1)
cd vulca-exhibition

# Create directory structure
mkdir -p docs/images/artworks
mkdir -p docs/images/qrcodes

# Copy all processed files
cp [compressed images] docs/images/artworks/
cp [qr codes] docs/images/qrcodes/

# Verify structure
tree docs/
# Expected output:
# docs/
# ├── index.html
# ├── detail.html
# ├── css/
# │   └── main.css
# ├── js/
# │   └── main.js
# ├── data/
# │   ├── artworks.json (copy from openspec/ARTWORKS_DATA.json)
# │   └── config.json (to create)
# └── images/
#     ├── artworks/
#     │   ├── 001_sougwen_meridians_installation.jpg
#     │   ├── 001_sougwen_meridians_installation.webp (optional)
#     │   ├── 002_sougwen_meridians_detail.jpg
#     │   ├── 003_lauren_auto_lacma_1.jpg
#     │   └── 004_sougwen_memory_drawing.jpg
#     └── qrcodes/
#         ├── 001.png
#         ├── 002.png
#         ├── 003.png
#         └── 004.png
```

**Copy ARTWORKS_DATA.json:**

```bash
cp openspec/ARTWORKS_DATA.json docs/data/artworks.json

# Verify all image paths in artworks.json are correct
# { "image": "/images/artworks/001_sougwen_meridians_installation.jpg", ... }
```

### 5.2 Commit & Push Preparation

**Second Commit: Image Assets**

```bash
git add docs/images/
git add docs/data/artworks.json

git commit -m "Add: High-resolution artwork images and QR codes

- 4 artwork images (JPEG + optional WebP)
- Compression: ~7.8 MB total
- 4 QR codes with brand colors
- ARTWORKS_DATA.json with image references

Ready for Week 1 CSS implementation."

git push origin main
```

**Status:**
```
[ ] All image files copied to docs/images/artworks/
[ ] All QR codes copied to docs/images/qrcodes/
[ ] artworks.json copied to docs/data/
[ ] Git commit prepared (not pushed until Week 1)
```

---

## Phase 6: Pre-Week 1 Verification (End of Day 3)

### 6.1 Final Verification Checklist

```
═══════════════════════════════════════════════════════════

DOMAIN & INFRASTRUCTURE
[ ] vulca.art domain registered
[ ] GitHub repository created (vulca-exhibition)
[ ] Repository cloned locally
[ ] Initial scaffold commit pushed

IMAGE ACQUISITION
[ ] 4 artwork images extracted/downloaded
[ ] All images verified: ≥3000×2000px, RGB color space
[ ] All images compressed via TinyPNG: <2.2 MB each
[ ] WebP versions created (optional)
[ ] Total image size: ~7.8 MB

QR CODE GENERATION
[ ] 4 QR codes generated (200×200px)
[ ] All QR codes scanned & verified functional
[ ] Color scheme matches brand (#1a1613 + #f5f2ed)

FILE ORGANIZATION
[ ] docs/images/artworks/ contains 4 JPEG files
[ ] docs/images/qrcodes/ contains 4 PNG files
[ ] docs/data/artworks.json copied and verified
[ ] Directory structure matches specification

GIT PREPARATION
[ ] Second commit ready (not pushed)
[ ] Git log shows: Initial scaffold + Image assets
[ ] All files staged and ready

═══════════════════════════════════════════════════════════
```

---

## Phase 7: Design Specification Approval (Parallel)

**Important:** Complete SPEC_REVIEW_CHECKLIST.md while Phase 1-6 execute

**Timeline:**
- Complete by: End of Day 2 or 3 (before Week 1 Monday)
- Required for: CSS implementation to begin

**Decision Matrix:**

```
SPEC_REVIEW_CHECKLIST Status:
[ ] Not started
[ ] In progress
[ ] Complete & APPROVED - Ready to start Week 1
[ ] Complete & NEEDS ADJUSTMENT - See modifications
[ ] Complete & MAJOR REVISION - Schedule design review
```

---

## Estimated Timeline

```
Day 1 (2-3 hours):
├─ Domain registration (20 min)
├─ GitHub setup (40 min)
├─ Begin image extraction from PDF (1 hour)
└─ Status: Infrastructure 80% complete

Day 2 (4-5 hours):
├─ Complete PDF image extraction (1 hour)
├─ Download Lauren McCarthy images (30 min)
├─ Image quality verification (1.5 hours)
├─ Begin TinyPNG compression (30 min)
├─ Start SPEC_REVIEW_CHECKLIST (1 hour)
└─ Status: Images 70% complete

Day 3 (4-5 hours):
├─ Complete TinyPNG compression (1 hour)
├─ WebP conversion (1 hour, optional)
├─ QR code generation & verification (1.5 hours)
├─ File organization & commits prep (1 hour)
├─ Complete SPEC_REVIEW_CHECKLIST (1 hour)
└─ Status: Everything ready for Week 1 Monday

TOTAL: 10-13 hours spread over 3 days (can compress to 1-2 days if needed)
```

---

## Troubleshooting

### Problem: PDF extraction produces low quality
**Solution:** Use online converter with "Enhanced" quality, or try Command Line method

### Problem: Image resolution too low after extraction
**Solution:** Use upscaling (ImageMagick or Python PIL) to 3000×2000px

### Problem: Lauren McCarthy images not found on cargo.site
**Solution:** Search get-lauren.net/Auto manually, or contact artist directly

### Problem: TinyPNG not compressing enough
**Solution:** Try ImageMagick with lossy compression (quality 82-85) instead

### Problem: QR code won't scan
**Solution:** Increase margin around code, increase contrast between colors

### Problem: GitHub repo access issues
**Solution:** Check SSH keys configured, or use HTTPS auth token instead

---

## Dependencies & Prerequisites

**Required Tools:**
- [ ] Web browser (Chrome, Safari, Firefox)
- [ ] Git command line or GitHub Desktop
- [ ] Image viewer or Image Magic (for verification)
- [ ] Text editor (for artworks.json verification)

**Accounts Required:**
- [ ] GitHub account (free)
- [ ] Domain registrar account (new)

**No coding required** - this phase is purely asset acquisition

---

## Sign-Off

**Preparation Status:**
```
Completed by: ___________________
Date: ___________________

Ready for Week 1 Monday: [ ] YES [ ] NO (explain)

Any blockers: ___________________
```

---

**Next Step:** Once complete, begin FINAL_4WEEK_EXECUTION_PLAN.md Week 1, Monday

**Status:** 🟢 Ready to Execute
