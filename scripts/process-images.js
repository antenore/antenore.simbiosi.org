#!/usr/bin/env node

/**
 * Comprehensive image processing script for Jekyll blog
 * 
 * This script:
 * 1. Optimizes all images (JPG, PNG, GIF, SVG)
 * 2. Creates responsive versions (small, medium, large, 2x)
 * 3. Generates WebP versions of all images
 * 4. Adds proper alt text to images in markdown files (optional)
 * 5. Updates image references in markdown to use responsive-image include
 */

const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminWebp = require('imagemin-webp');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminSvgo = require('imagemin-svgo');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const glob = require('glob');
const { promisify } = require('util');
const globPromise = promisify(glob);

// Configuration
const config = {
  // Directories to process
  imageDirectories: [
    'assets/images',
    'assets/posts'
    // Add other image directories here
  ],
  // File extensions to process
  extensions: ['jpg', 'jpeg', 'png', 'gif', 'svg'],
  // Responsive image sizes
  sizes: {
    thumbnail: { width: 150, height: 150, fit: 'cover' },
    small: { width: 300 },
    medium: { width: 600 },
    large: { width: 900 },
    avatar: { width: 80, height: 80, fit: 'cover' },
    '2x': { width: 1800 } // Retina display
  },
  // Quality settings
  quality: {
    jpeg: 80,
    png: [0.65, 0.8],
    webp: 75
  },
  // Whether to scan markdown files and update image references
  updateMarkdownReferences: true,
  // Whether to add missing alt text to images
  addMissingAltText: true,
  // Default alt text for images without alt text
  defaultAltText: 'Image'
};

// Statistics tracking
const stats = {
  optimized: 0,
  responsive: 0,
  webp: 0,
  markdownUpdated: 0,
  altTextAdded: 0,
  errors: 0
};

/**
 * Main function to process all images
 */
async function processAllImages() {
  console.log('Starting image processing...');
  
  try {
    // Process each directory
    for (const dir of config.imageDirectories) {
      console.log(`\nProcessing directory: ${dir}`);
      
      // Make sure directory exists
      try {
        await fs.access(dir);
      } catch (error) {
        console.log(`Directory ${dir} does not exist, creating it...`);
        await fs.mkdir(dir, { recursive: true });
      }
      
      // Optimize images
      await optimizeImages(dir);
      
      // Create responsive versions
      await createResponsiveImages(dir);
      
      // Convert to WebP
      await convertToWebP(dir);
    }
    
    // Update markdown files if enabled
    if (config.updateMarkdownReferences) {
      await updateMarkdownImageReferences();
    }
    
    // Print summary
    console.log('\n===== Image Processing Summary =====');
    console.log(`Images optimized: ${stats.optimized}`);
    console.log(`Responsive versions created: ${stats.responsive}`);
    console.log(`WebP versions created: ${stats.webp}`);
    if (config.updateMarkdownReferences) {
      console.log(`Markdown files updated: ${stats.markdownUpdated}`);
    }
    if (config.addMissingAltText) {
      console.log(`Alt text added to images: ${stats.altTextAdded}`);
    }
    if (stats.errors > 0) {
      console.log(`Errors encountered: ${stats.errors}`);
    }
    console.log('===================================');
    
  } catch (error) {
    console.error('Error in image processing:', error);
    stats.errors++;
  }
}

/**
 * Optimize images in the specified directory
 */
async function optimizeImages(directory) {
  console.log(`Optimizing images in ${directory}...`);
  
  try {
    const files = await imagemin([`${directory}/*.{jpg,jpeg,png,gif,svg}`], {
      destination: directory,
      plugins: [
        imageminJpegtran({ progressive: true }),
        imageminPngquant({
          quality: config.quality.png,
          strip: true
        }),
        imageminGifsicle({ optimizationLevel: 3 }),
        imageminSvgo({
          plugins: [{
            name: 'removeViewBox',
            active: false
          }]
        })
      ]
    });
    
    stats.optimized += files.length;
    console.log(`${files.length} images optimized in ${directory}`);
  } catch (error) {
    console.error(`Error optimizing images in ${directory}:`, error);
    stats.errors++;
  }
}

/**
 * Create responsive versions of images
 */
async function createResponsiveImages(directory) {
  console.log(`Creating responsive versions of images in ${directory}...`);
  
  try {
    // Get all image files in the directory
    const files = await fs.readdir(directory);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase().substring(1);
      return config.extensions.includes(ext) && 
             !file.includes('-small') && 
             !file.includes('-medium') && 
             !file.includes('-large') && 
             !file.includes('-avatar') && 
             !file.includes('@2x') &&
             !file.includes('-thumbnail');
    });
    
    // Process each image
    for (const file of imageFiles) {
      const filePath = path.join(directory, file);
      const fileExt = path.extname(file);
      const fileName = path.basename(file, fileExt);
      
      // Create each size variant
      for (const [sizeName, sizeOptions] of Object.entries(config.sizes)) {
        const outputFileName = sizeName === '2x' 
          ? `${fileName}@2x${fileExt}` 
          : `${fileName}-${sizeName}${fileExt}`;
        const outputPath = path.join(directory, outputFileName);
        
        try {
          // Skip if file already exists
          await fs.access(outputPath);
          console.log(`Skipping ${outputFileName} (already exists)`);
        } catch {
          // File doesn't exist, create it
          try {
            await sharp(filePath)
              .resize(sizeOptions)
              .toFile(outputPath);
            console.log(`Created ${outputFileName}`);
            stats.responsive++;
          } catch (error) {
            console.error(`Error creating ${outputFileName}:`, error);
            stats.errors++;
          }
        }
      }
    }
    
    console.log(`Responsive images created in ${directory}`);
  } catch (error) {
    console.error(`Error creating responsive images in ${directory}:`, error);
    stats.errors++;
  }
}

/**
 * Convert images to WebP format
 */
async function convertToWebP(directory) {
  console.log(`Converting images in ${directory} to WebP...`);
  
  try {
    // Get all image files in the directory
    const files = await fs.readdir(directory);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase().substring(1);
      return (ext === 'jpg' || ext === 'jpeg' || ext === 'png') && !file.endsWith('.webp');
    });
    
    for (const file of imageFiles) {
      const filePath = path.join(directory, file);
      const fileName = path.basename(file, path.extname(file));
      const outputPath = path.join(directory, `${fileName}.webp`);
      
      try {
        // Skip if file already exists
        await fs.access(outputPath);
        console.log(`Skipping WebP conversion for ${file} (already exists)`);
      } catch {
        // File doesn't exist, create it
        try {
          await sharp(filePath)
            .webp({ quality: config.quality.webp })
            .toFile(outputPath);
          console.log(`Created WebP version of ${file}`);
          stats.webp++;
        } catch (error) {
          console.error(`Error creating WebP version of ${file}:`, error);
          stats.errors++;
        }
      }
    }
    
    console.log(`WebP conversions completed in ${directory}`);
  } catch (error) {
    console.error(`Error converting to WebP in ${directory}:`, error);
    stats.errors++;
  }
}

/**
 * Update image references in markdown files to use responsive-image include
 */
async function updateMarkdownImageReferences() {
  console.log('\nUpdating image references in markdown files...');
  
  try {
    // Find all markdown files
    const markdownFiles = await globPromise('_posts/**/*.md');
    
    for (const file of markdownFiles) {
      let content = await fs.readFile(file, 'utf8');
      let modified = false;
      
      // Regular expression to find markdown image syntax: ![alt text](image.jpg)
      const markdownImageRegex = /!\[(.*?)\]\(([^)\s]+)(\s+"(.*?)")?\)/g;
      
      // Replace markdown image syntax with responsive-image include
      content = content.replace(markdownImageRegex, (match, altText, src, _, title) => {
        // Skip if already using an include
        if (src.includes('{% include')) {
          return match;
        }
        
        // Get file extension
        const ext = path.extname(src).toLowerCase();
        if (!['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
          return match; // Skip non-image files
        }
        
        // Add default alt text if missing
        if (!altText && config.addMissingAltText) {
          altText = title || config.defaultAltText;
          stats.altTextAdded++;
        }
        
        // Create srcset for WebP if available
        const baseSrc = src.replace(/\.(jpg|jpeg|png|gif)$/i, '');
        const srcsetWebp = `${baseSrc}.webp 1x, ${baseSrc}@2x.webp 2x`;
        const srcsetOriginal = `${src} 1x, ${baseSrc}@2x${ext} 2x`;
        
        // Create responsive-image include
        const include = `{% include responsive-image.html src="${src}" srcset="${srcsetOriginal}" alt="${altText || ''}" class="post-image" %}`;
        
        modified = true;
        return include;
      });
      
      // Save file if modified
      if (modified) {
        await fs.writeFile(file, content, 'utf8');
        console.log(`Updated image references in ${file}`);
        stats.markdownUpdated++;
      }
    }
    
    console.log(`Updated ${stats.markdownUpdated} markdown files`);
  } catch (error) {
    console.error('Error updating markdown image references:', error);
    stats.errors++;
  }
}

// Run the script
processAllImages();
