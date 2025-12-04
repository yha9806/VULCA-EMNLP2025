/**
 * Asset Minification Script
 * Compresses CSS and JS files for production deployment
 */

const fs = require('fs');
const path = require('path');
const csso = require('csso');
const { minify } = require('terser');

// Configuration
const CONFIG = {
  css: {
    inputDirs: ['styles', 'styles/components', 'styles/pages'],
    outputSuffix: '.min.css'
  },
  js: {
    inputDirs: ['js', 'js/components', 'js/utils', 'js/visualizations', 'js/data/dialogues'],
    outputSuffix: '.min.js',
    // Skip these files (already minified or special handling)
    skip: [
      'data.js',           // Large data file, handled separately
      'dataIndexes.js'     // Auto-generated
    ]
  }
};

// Statistics
const stats = {
  css: { files: 0, originalSize: 0, minifiedSize: 0 },
  js: { files: 0, originalSize: 0, minifiedSize: 0 }
};

/**
 * Minify a CSS file
 */
function minifyCSS(inputPath) {
  try {
    const content = fs.readFileSync(inputPath, 'utf8');
    const result = csso.minify(content);

    const outputPath = inputPath.replace('.css', CONFIG.css.outputSuffix);
    fs.writeFileSync(outputPath, result.css);

    const originalSize = Buffer.byteLength(content, 'utf8');
    const minifiedSize = Buffer.byteLength(result.css, 'utf8');

    stats.css.files++;
    stats.css.originalSize += originalSize;
    stats.css.minifiedSize += minifiedSize;

    const reduction = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
    console.log(`  ✓ ${path.basename(inputPath)}: ${formatBytes(originalSize)} → ${formatBytes(minifiedSize)} (-${reduction}%)`);

    return true;
  } catch (error) {
    console.error(`  ✗ ${path.basename(inputPath)}: ${error.message}`);
    return false;
  }
}

/**
 * Minify a JS file
 */
async function minifyJS(inputPath) {
  try {
    const content = fs.readFileSync(inputPath, 'utf8');

    const result = await minify(content, {
      compress: {
        drop_console: false,  // Keep console.log for debugging
        passes: 2
      },
      mangle: true,
      format: {
        comments: false
      }
    });

    if (result.error) {
      throw result.error;
    }

    const outputPath = inputPath.replace('.js', CONFIG.js.outputSuffix);
    fs.writeFileSync(outputPath, result.code);

    const originalSize = Buffer.byteLength(content, 'utf8');
    const minifiedSize = Buffer.byteLength(result.code, 'utf8');

    stats.js.files++;
    stats.js.originalSize += originalSize;
    stats.js.minifiedSize += minifiedSize;

    const reduction = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
    console.log(`  ✓ ${path.basename(inputPath)}: ${formatBytes(originalSize)} → ${formatBytes(minifiedSize)} (-${reduction}%)`);

    return true;
  } catch (error) {
    console.error(`  ✗ ${path.basename(inputPath)}: ${error.message}`);
    return false;
  }
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

/**
 * Get all files in directory
 */
function getFiles(dir, extension) {
  const fullDir = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullDir)) {
    return [];
  }

  return fs.readdirSync(fullDir)
    .filter(file => file.endsWith(extension) && !file.endsWith('.min' + extension))
    .map(file => path.join(fullDir, file));
}

/**
 * Main function
 */
async function main() {
  console.log('🔧 Asset Minification Script\n');
  console.log('═'.repeat(50));

  // Process CSS files
  console.log('\n📦 Minifying CSS files...\n');
  for (const dir of CONFIG.css.inputDirs) {
    const files = getFiles(dir, '.css');
    for (const file of files) {
      minifyCSS(file);
    }
  }

  // Process JS files
  console.log('\n📦 Minifying JS files...\n');
  for (const dir of CONFIG.js.inputDirs) {
    const files = getFiles(dir, '.js');
    for (const file of files) {
      const basename = path.basename(file);
      if (CONFIG.js.skip.includes(basename)) {
        console.log(`  ⏭ ${basename} (skipped)`);
        continue;
      }
      await minifyJS(file);
    }
  }

  // Print summary
  console.log('\n' + '═'.repeat(50));
  console.log('\n📊 Summary:\n');

  const cssReduction = stats.css.originalSize > 0
    ? ((1 - stats.css.minifiedSize / stats.css.originalSize) * 100).toFixed(1)
    : 0;
  const jsReduction = stats.js.originalSize > 0
    ? ((1 - stats.js.minifiedSize / stats.js.originalSize) * 100).toFixed(1)
    : 0;

  console.log(`  CSS: ${stats.css.files} files, ${formatBytes(stats.css.originalSize)} → ${formatBytes(stats.css.minifiedSize)} (-${cssReduction}%)`);
  console.log(`  JS:  ${stats.js.files} files, ${formatBytes(stats.js.originalSize)} → ${formatBytes(stats.js.minifiedSize)} (-${jsReduction}%)`);

  const totalOriginal = stats.css.originalSize + stats.js.originalSize;
  const totalMinified = stats.css.minifiedSize + stats.js.minifiedSize;
  const totalReduction = totalOriginal > 0
    ? ((1 - totalMinified / totalOriginal) * 100).toFixed(1)
    : 0;

  console.log(`\n  Total: ${formatBytes(totalOriginal)} → ${formatBytes(totalMinified)} (-${totalReduction}%)`);
  console.log('\n✅ Minification complete!\n');
}

main().catch(console.error);
