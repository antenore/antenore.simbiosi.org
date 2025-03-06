const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminWebp = require('imagemin-webp');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminSvgo = require('imagemin-svgo');
const sharp = require('sharp');
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

// Responsive image sizes
const sizes = {
  thumbnail: { width: 150, height: 150, fit: 'cover' },
  small: { width: 300 },
  medium: { width: 600 },
  large: { width: 900 },
  avatar: { width: 80, height: 80, fit: 'cover' },
  '2x': { width: 1800 } // Retina display
};

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

// Create responsive versions of images
async function createResponsiveImages(directory) {
  console.log(`Creating responsive versions of images in ${directory}...`);
  
  try {
    // Get all image files in the directory
    const files = await fs.readdir(directory);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase().substring(1);
      return extensions.includes(ext) && !file.includes('-small') && !file.includes('-medium') && 
             !file.includes('-large') && !file.includes('-avatar') && !file.includes('@2x');
    });
    
    // Process each image
    for (const file of imageFiles) {
      const filePath = path.join(directory, file);
      const fileExt = path.extname(file);
      const fileName = path.basename(file, fileExt);
      
      // Create each size variant
      for (const [sizeName, sizeOptions] of Object.entries(sizes)) {
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
          await sharp(filePath)
            .resize(sizeOptions)
            .toFile(outputPath);
          console.log(`Created ${outputFileName}`);
          
          // Create WebP version of the resized image
          await imagemin([outputPath], {
            destination: directory,
            plugins: [
              imageminWebp({quality: 75})
            ]
          });
          console.log(`Created WebP version of ${outputFileName}`);
        }
      }
    }
    
    console.log(`Responsive images created in ${directory}`);
  } catch (error) {
    console.error(`Error creating responsive images in ${directory}:`, error);
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
    await createResponsiveImages(dir);
    await convertToWebP(dir);
  }
  console.log('All images processed!');
}

processAllDirectories();
