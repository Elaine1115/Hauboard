import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const publicDir = path.join(__dirname, '..', 'public', 'images');
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.tiff', '.bmp'];
const webpQuality = 85; // Quality for WebP (0-100)
const deleteOriginals = false; // Set to true to delete original files after conversion

// Statistics
let stats = {
  total: 0,
  converted: 0,
  skipped: 0,
  errors: 0,
  savedBytes: 0
};

// Get file size in bytes
function getFileSize(filePath) {
  try {
    return fs.statSync(filePath).size;
  } catch {
    return 0;
  }
}

// Format bytes to human readable
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Convert image to WebP
async function convertToWebP(inputPath) {
  const ext = path.extname(inputPath).toLowerCase();
  const outputPath = inputPath.replace(new RegExp(`${ext}$`), '.webp');

  // Skip if already WebP
  if (ext === '.webp') {
    console.log(`⏭️  Skipped (already WebP): ${path.basename(inputPath)}`);
    stats.skipped++;
    return;
  }

  // Skip if WebP version already exists
  if (fs.existsSync(outputPath)) {
    console.log(`⏭️  Skipped (WebP exists): ${path.basename(inputPath)}`);
    stats.skipped++;
    return;
  }

  try {
    const originalSize = getFileSize(inputPath);

    // Convert to WebP
    await sharp(inputPath)
      .webp({ quality: webpQuality })
      .toFile(outputPath);

    const webpSize = getFileSize(outputPath);
    const savedBytes = originalSize - webpSize;
    const savedPercent = ((savedBytes / originalSize) * 100).toFixed(1);

    stats.savedBytes += savedBytes;
    stats.converted++;

    console.log(`✅ Converted: ${path.basename(inputPath)}`);
    console.log(`   ${formatBytes(originalSize)} → ${formatBytes(webpSize)} (saved ${savedPercent}%)`);

    // Delete original if configured
    if (deleteOriginals) {
      fs.unlinkSync(inputPath);
      console.log(`   🗑️  Deleted original file`);
    }
  } catch (error) {
    console.error(`❌ Error converting ${path.basename(inputPath)}:`, error.message);
    stats.errors++;
  }
}

// Recursively find all images
function findImages(dir) {
  let images = [];

  try {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Recursively search subdirectories
        images = images.concat(findImages(fullPath));
      } else if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (imageExtensions.includes(ext) || ext === '.webp') {
          images.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }

  return images;
}

// Main function
async function main() {
  console.log('\n🖼️  WebP Image Converter\n');
  console.log(`📁 Scanning directory: ${publicDir}`);
  console.log(`⚙️  WebP quality: ${webpQuality}`);
  console.log(`🗑️  Delete originals: ${deleteOriginals ? 'Yes' : 'No'}\n`);

  if (!fs.existsSync(publicDir)) {
    console.error(`❌ Directory not found: ${publicDir}`);
    process.exit(1);
  }

  // Find all images
  const images = findImages(publicDir);
  stats.total = images.length;

  if (images.length === 0) {
    console.log('⚠️  No images found.');
    return;
  }

  console.log(`Found ${images.length} image(s)\n`);

  // Convert each image
  for (const imagePath of images) {
    await convertToWebP(imagePath);
  }

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Conversion Summary:');
  console.log('='.repeat(50));
  console.log(`Total images:     ${stats.total}`);
  console.log(`Converted:        ${stats.converted}`);
  console.log(`Skipped:          ${stats.skipped}`);
  console.log(`Errors:           ${stats.errors}`);
  console.log(`Space saved:      ${formatBytes(stats.savedBytes)}`);
  console.log('='.repeat(50) + '\n');

  if (stats.converted > 0) {
    console.log('✨ Conversion completed successfully!');
  }
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
