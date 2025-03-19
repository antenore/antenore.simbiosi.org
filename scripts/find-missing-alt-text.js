#!/usr/bin/env node

/**
 * Script to find images without alt text in markdown files and HTML templates
 * This helps improve accessibility by identifying images that need alt text
 */

const fs = require('fs').promises;
const path = require('path');
const glob = require('glob');
const { promisify } = require('util');
const globPromise = promisify(glob);

// Configuration
const config = {
  // Directories to scan
  directories: [
    '_posts',
    '_pages',
    '_includes',
    '_layouts'
  ],
  // File patterns to scan
  patterns: [
    '**/*.md',
    '**/*.html'
  ],
  // Output file for report
  outputFile: 'accessibility-report.md'
};

// Statistics
const stats = {
  filesScanned: 0,
  imagesFound: 0,
  imagesWithoutAlt: 0,
  filesWithIssues: 0
};

// Results storage
const results = [];

/**
 * Main function to find images without alt text
 */
async function findMissingAltText() {
  console.log('Scanning for images without alt text...');
  
  try {
    // Process each directory and pattern
    for (const dir of config.directories) {
      for (const pattern of config.patterns) {
        const globPattern = path.join(dir, pattern);
        const files = await globPromise(globPattern);
        
        for (const file of files) {
          await processFile(file);
        }
      }
    }
    
    // Generate report
    await generateReport();
    
    // Print summary
    console.log('\n===== Missing Alt Text Summary =====');
    console.log(`Files scanned: ${stats.filesScanned}`);
    console.log(`Images found: ${stats.imagesFound}`);
    console.log(`Images without alt text: ${stats.imagesWithoutAlt}`);
    console.log(`Files with issues: ${stats.filesWithIssues}`);
    console.log(`Report generated: ${config.outputFile}`);
    console.log('===================================');
    
  } catch (error) {
    console.error('Error scanning for missing alt text:', error);
  }
}

/**
 * Process a single file to find images without alt text
 */
async function processFile(file) {
  try {
    const content = await fs.readFile(file, 'utf8');
    stats.filesScanned++;
    
    // Track if this file has any issues
    let fileHasIssues = false;
    const fileIssues = [];
    
    // Check for HTML img tags without alt attribute
    const htmlImgRegex = /<img(?!.*?alt=(['"](.*?)['"]|[^\s>]+))[^>]*>/g;
    let match;
    while ((match = htmlImgRegex.exec(content)) !== null) {
      stats.imagesFound++;
      stats.imagesWithoutAlt++;
      fileHasIssues = true;
      
      // Extract src attribute if available
      const srcMatch = match[0].match(/src=(['"])(.*?)\1/);
      const src = srcMatch ? srcMatch[2] : 'unknown';
      
      fileIssues.push({
        type: 'html',
        line: getLineNumber(content, match.index),
        src: src,
        snippet: match[0]
      });
    }
    
    // Check for markdown images without alt text
    const markdownImgRegex = /!\[\s*\]\(([^)]+)\)/g;
    while ((match = markdownImgRegex.exec(content)) !== null) {
      stats.imagesFound++;
      stats.imagesWithoutAlt++;
      fileHasIssues = true;
      
      fileIssues.push({
        type: 'markdown',
        line: getLineNumber(content, match.index),
        src: match[1],
        snippet: match[0]
      });
    }
    
    // Check for Jekyll includes without alt text
    const jekyllIncludeRegex = /{%\s*include\s+(responsive-image|lazy-image).html[^%]*?(?!alt=(['"])[^'"]+\2)[^%]*?%}/g;
    while ((match = jekyllIncludeRegex.exec(content)) !== null) {
      stats.imagesFound++;
      stats.imagesWithoutAlt++;
      fileHasIssues = true;
      
      // Extract src attribute if available
      const srcMatch = match[0].match(/src=(['"])(.*?)\1/);
      const src = srcMatch ? srcMatch[2] : 'unknown';
      
      fileIssues.push({
        type: 'include',
        line: getLineNumber(content, match.index),
        src: src,
        snippet: match[0]
      });
    }
    
    // Add to results if issues found
    if (fileHasIssues) {
      stats.filesWithIssues++;
      results.push({
        file: file,
        issues: fileIssues
      });
    }
    
  } catch (error) {
    console.error(`Error processing file ${file}:`, error);
  }
}

/**
 * Get line number from character index
 */
function getLineNumber(content, index) {
  const lines = content.slice(0, index).split('\n');
  return lines.length;
}

/**
 * Generate a markdown report of all issues
 */
async function generateReport() {
  let report = '# Accessibility Report: Missing Alt Text\n\n';
  report += `Generated on: ${new Date().toLocaleString()}\n\n`;
  report += '## Summary\n\n';
  report += `- Files scanned: ${stats.filesScanned}\n`;
  report += `- Images found: ${stats.imagesFound}\n`;
  report += `- Images without alt text: ${stats.imagesWithoutAlt}\n`;
  report += `- Files with issues: ${stats.filesWithIssues}\n\n`;
  
  if (results.length > 0) {
    report += '## Files with Missing Alt Text\n\n';
    
    for (const result of results) {
      report += `### ${result.file}\n\n`;
      
      for (const issue of result.issues) {
        report += `- **Line ${issue.line}**: ${issue.type} image without alt text\n`;
        report += `  - Source: `${issue.src}`\n`;
        report += `  - Snippet: `${issue.snippet.replace(/\n/g, ' ')}`\n\n`;
      }
    }
    
    report += '## How to Fix\n\n';
    report += 'For HTML images, add an alt attribute:\n\n';
    report += '```html\n<img src="image.jpg" alt="Descriptive text about the image">\n```\n\n';
    report += 'For Markdown images, add alt text in the square brackets:\n\n';
    report += '```markdown\n![Descriptive text about the image](image.jpg)\n```\n\n';
    report += 'For Jekyll includes, add the alt parameter:\n\n';
    report += '```liquid\n{% include responsive-image.html src="image.jpg" alt="Descriptive text about the image" %}\n```\n';
  } else {
    report += '## No Issues Found\n\n';
    report += 'Great job! All images have alt text.\n';
  }
  
  await fs.writeFile(config.outputFile, report, 'utf8');
  console.log(`Report generated: ${config.outputFile}`);
}

// Run the script
findMissingAltText();
