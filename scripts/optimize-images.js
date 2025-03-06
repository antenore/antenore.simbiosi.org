const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminWebp = require('imagemin-webp');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminSvgo = require('imagemin-svgo');
const path = require('path');
const fs = require('fs').promises;

// Directories to process
const directories = [
  'assets/images',
  'assets/posts',
  // Add other image directories here
];

// File extensions to process
const extensions = ['jpg', 'jpeg', 'png', 'gif', 'svg'];

// Create WebP versions of images
async function convertToWebP(directory) {
  console.log(`Converting images in ${directory} to WebP...`);
  
  try {
    const files = await imagemin([`${directory}/*.{jpg,jpeg,png}`], {
      destination: directory,
      plugins: [
        imageminWebp({quality: 75})
      ]
    });
    
    console.log(`${files.length} images converted to WebP in ${directory}`);
  } catch (error) {
    console.error(`Error converting to WebP in ${directory}:`, error);
  }
}

// Optimize images
async function optimizeImages(directory) {
  console.log(`Optimizing images in ${directory}...`);
  
  try {
    const files = await imagemin([`${directory}/*.{jpg,jpeg,png,gif,svg}`], {
      destination: directory,
      plugins: [
        imageminJpegtran({progressive: true}),
        imageminPngquant({
          quality: [0.65, 0.8],
          strip: true
        }),
        imageminGifsicle({optimizationLevel: 3}),
        imageminSvgo({
          plugins: [{
            name: 'removeViewBox',
            active: false
          }]
        })
      ]
    });
    
    console.log(`${files.length} images optimized in ${directory}`);
  } catch (error) {
    console.error(`Error optimizing images in ${directory}:`, error);
  }
}

// Process all directories
async function processAllDirectories() {
  for (const dir of directories) {
    await optimizeImages(dir);
    await convertToWebP(dir);
  }
  console.log('All images processed!');
}

processAllDirectories();
