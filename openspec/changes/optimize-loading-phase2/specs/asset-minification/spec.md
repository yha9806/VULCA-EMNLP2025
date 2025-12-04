# Spec: asset-minification

## ADDED Requirements

### Requirement: CSS Minification
All production CSS files MUST be minified to reduce file size.

#### Scenario: CSS files are minified
- Given CSS files in styles/ directory
- When the minification script is run
- Then all CSS files MUST be compressed (whitespace, comments removed)
- And the minified output MUST be functionally equivalent to the source

#### Scenario: CSS size reduction
- Given the original CSS total size of ~137KB
- When minification is complete
- Then the total CSS size SHOULD be reduced by at least 30%

### Requirement: JavaScript Minification
All production JavaScript files MUST be minified to reduce file size.

#### Scenario: JS files are minified
- Given JavaScript files in js/ directory
- When the minification script is run
- Then all JS files MUST be compressed (whitespace, comments, variable names)
- And the minified output MUST be functionally equivalent to the source

#### Scenario: JS size reduction
- Given the original JS total size of ~345KB
- When minification is complete
- Then the total JS size SHOULD be reduced by at least 40%

### Requirement: Minification Script
A Node.js script MUST exist to automate the minification process.

#### Scenario: Minification script execution
- Given the script scripts/minify-assets.js exists
- When `node scripts/minify-assets.js` is run
- Then all CSS and JS files MUST be processed
- And a summary of size reductions MUST be output to console
