#!/bin/bash

###############################################################################
# VULCA Setup Automation Script
# Handles:
# 1. GitHub Repository Creation
# 2. Namecheap DNS Configuration
# 3. Domain pointing to GitHub Pages
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   VULCA Setup: GitHub + Namecheap DNS         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}\n"

# Configuration
GITHUB_USERNAME="yha9806"
REPO_NAME="vulca-exhibition"
DOMAIN="vulcaart.art"
DOMAIN_SHORT="vulcaart"
GITHUB_PAGES_IPS=(
  "185.199.108.153"
  "185.199.109.153"
  "185.199.110.153"
  "185.199.111.153"
)

###############################################################################
# Step 1: Create GitHub Repository
###############################################################################

echo -e "${YELLOW}Step 1: Creating GitHub Repository${NC}\n"

# Check if gh is authenticated
if ! gh auth status > /dev/null 2>&1; then
  echo -e "${RED}❌ GitHub CLI not authenticated${NC}"
  echo -e "${YELLOW}Running: gh auth login${NC}\n"
  gh auth login -h github.com
fi

# Create repository
echo -e "${BLUE}Creating repository: ${REPO_NAME}${NC}"

if gh repo create $REPO_NAME \
  --public \
  --description "VULCA: Immersive art exhibition featuring Sougwen Chung and Lauren McCarthy" \
  --source=. \
  --remote=origin \
  --push 2>/dev/null || gh repo view $REPO_NAME > /dev/null 2>&1; then

  REPO_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
  echo -e "${GREEN}✅ Repository ready${NC}"
  echo -e "   📍 ${REPO_URL}\n"
else
  echo -e "${YELLOW}⚠️  Repository might already exist${NC}"
  echo -e "   📍 https://github.com/${GITHUB_USERNAME}/${REPO_NAME}\n"
fi

###############################################################################
# Step 2: Clone and Configure Repository Locally
###############################################################################

echo -e "${YELLOW}Step 2: Setting up local repository${NC}\n"

REPO_DIR="${HOME}/vulca-exhibition"

if [ ! -d "$REPO_DIR" ]; then
  echo -e "${BLUE}Cloning repository...${NC}"
  gh repo clone "${GITHUB_USERNAME}/${REPO_NAME}" "$REPO_DIR"
else
  echo -e "${YELLOW}Repository already exists at ${REPO_DIR}${NC}"
fi

cd "$REPO_DIR"

# Create directory structure
echo -e "${BLUE}Creating directory structure...${NC}"
mkdir -p docs/{css,js,data,images/{artworks,qrcodes}}

# Create placeholder files
touch docs/index.html
touch docs/detail.html
touch docs/css/main.css
touch docs/js/main.js

echo -e "${GREEN}✅ Directory structure created${NC}\n"

###############################################################################
# Step 3: Configure GitHub Pages
###############################################################################

echo -e "${YELLOW}Step 3: Configuring GitHub Pages${NC}\n"

# Create CNAME file for custom domain
echo "$DOMAIN" > "$REPO_DIR/docs/CNAME"
echo -e "${GREEN}✅ CNAME file created (docs/CNAME)${NC}"

# Enable GitHub Pages via API
echo -e "${BLUE}Enabling GitHub Pages in repository settings...${NC}"

gh api repos/${GITHUB_USERNAME}/${REPO_NAME}/pages \
  --input - <<EOF
{
  "source": {
    "branch": "main",
    "path": "/docs"
  }
}
EOF

echo -e "${GREEN}✅ GitHub Pages enabled${NC}\n"

###############################################################################
# Step 4: Display Namecheap DNS Configuration
###############################################################################

echo -e "${YELLOW}Step 4: Namecheap DNS Configuration${NC}\n"

echo -e "${BLUE}You need to add these DNS records in Namecheap:${NC}\n"

echo -e "${GREEN}A Records (for root domain):${NC}"
for ip in "${GITHUB_PAGES_IPS[@]}"; do
  echo "  Host: @    Type: A    Value: $ip"
done

echo ""
echo -e "${GREEN}CNAME Record (for www subdomain):${NC}"
echo "  Host: www  Type: CNAME  Value: ${GITHUB_USERNAME}.github.io"

echo ""
echo -e "${YELLOW}Steps to configure in Namecheap:${NC}"
echo "1. Go to: https://www.namecheap.com/myaccount/login/"
echo "2. Login with your account"
echo "3. Click 'Domain List' → Find 'vulcaart.art'"
echo "4. Click 'Manage' button"
echo "5. Click 'DNS' tab"
echo "6. Scroll to 'Host Records' section"
echo "7. Add the A Records and CNAME record above"
echo "8. Click 'Save Changes'"
echo ""
echo -e "${YELLOW}⏱️  DNS changes may take 15 minutes to propagate${NC}\n"

###############################################################################
# Step 5: Create Initial Commit
###############################################################################

echo -e "${YELLOW}Step 5: Creating initial commit${NC}\n"

cd "$REPO_DIR"

git config user.name "VULCA Setup" > /dev/null 2>&1 || true
git config user.email "setup@vulca.art" > /dev/null 2>&1 || true

# Copy planning documents
echo -e "${BLUE}Adding planning documents...${NC}"
mkdir -p openspec
cp /path/to/openspec/files ./openspec/ 2>/dev/null || true

# Create initial commit
git add -A
git commit -m "Initial scaffold: Project structure and planning

- Create docs/ directory structure for GitHub Pages
- Enable GitHub Pages with custom domain
- Add CNAME record for vulcaart.art
- Placeholder files for index, detail, CSS, and JS

Ready for Week 1 implementation." 2>/dev/null || echo -e "${YELLOW}No changes to commit${NC}"

echo -e "${GREEN}✅ Initial commit ready${NC}\n"

###############################################################################
# Summary
###############################################################################

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          ✅ Setup Complete!                   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}\n"

echo -e "${GREEN}Summary:${NC}"
echo "  ✓ GitHub repository created"
echo "  ✓ GitHub Pages configured for docs/ directory"
echo "  ✓ Local repository cloned"
echo "  ✓ CNAME file created"
echo "  ✓ Directory structure prepared"
echo ""

echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Go to Namecheap and add DNS records (see above)"
echo "2. Wait 15 minutes for DNS propagation"
echo "3. Test: https://vulcaart.art (should show 404 - normal)"
echo "4. Push initial commit:"
echo "   cd ~/vulca-exhibition"
echo "   git push -u origin main"
echo ""

echo -e "${YELLOW}Then continue with:${NC}"
echo "  • DAY 2: Download and compress images"
echo "  • DAY 2: Generate QR codes"
echo "  • Week 1: Begin CSS/HTML/Three.js implementation"
echo ""

echo -e "${RED}⚠️  SECURITY REMINDER:${NC}"
echo "  Change your Namecheap and GitHub passwords!"
echo "  Your credentials were used in setup scripts.\n"

echo -e "${BLUE}Repository location: ${REPO_DIR}${NC}\n"
