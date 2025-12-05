import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const publicDir = path.join(__dirname, '..', 'public', 'assets', 'images');
const targetMinSize = 20 * 1024; // 20KB
const targetMaxSize = 30 * 1024; // 30KB
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.tiff', '.bmp'];
const createBackup = true; // Create .original backup before compressing
const maxIterations = 10; // Maximum attempts to reach target size

// Statistics
let stats = {
  total: 0,
  compressed: 0,
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

// Compress image to target size range
async function compressImage(inputPath) {
  const originalSize = getFileSize(inputPath);

  // Skip if already in target range
  if (originalSize >= targetMinSize && originalSize <= targetMaxSize) {
    console.log(`⏭️  Skipped (already ${formatBytes(originalSize)}): ${path.basename(inputPath)}`);
    stats.skipped++;
    return;
  }

  try {
    // Create backup if enabled
    if (createBackup) {
      const backupPath = inputPath + '.original';
      if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(inputPath, backupPath);
      }
    }

    const image = sharp(inputPath);
    const metadata = await image.metadata();

    let quality = 85;
    let scale = 1.0;
    let outputSize = originalSize;
    let tempPath = inputPath + '.temp';
    let iteration = 0;

    // Iteratively adjust quality and scale to reach target size
    while (iteration < maxIterations) {
      iteration++;

      // Calculate new dimensions
      const newWidth = Math.round(metadata.width * scale);
      const newHeight = Math.round(metadata.height * scale);

      // Determine output format and options
      let outputOptions = {};
      const ext = path.extname(inputPath).toLowerCase();

      if (ext === '.webp') {
        outputOptions = { quality };
      } else if (['.jpg', '.jpeg'].includes(ext)) {
        outputOptions = { quality, mozjpeg: true };
      } else if (ext === '.png') {
        outputOptions = {
          quality,
          compressionLevel: 9,
          palette: true
        };
      }

      // Apply transformations
      let pipeline = sharp(inputPath).resize(newWidth, newHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });

      // Apply format-specific compression
      if (ext === '.webp') {
        pipeline = pipeline.webp(outputOptions);
      } else if (['.jpg', '.jpeg'].includes(ext)) {
        pipeline = pipeline.jpeg(outputOptions);
      } else if (ext === '.png') {
        pipeline = pipeline.png(outputOptions);
      } else {
        // Convert other formats to webp
        pipeline = pipeline.webp({ quality });
      }

      await pipeline.toFile(tempPath);
      outputSize = getFileSize(tempPath);

      // Check if we're in target range
      if (outputSize >= targetMinSize && outputSize <= targetMaxSize) {
        break;
      }

      // Adjust parameters for next iteration
      if (outputSize > targetMaxSize) {
        // Too large - reduce quality or scale
        if (quality > 20) {
          quality -= 10;
        } else if (scale > 0.3) {
          scale -= 0.1;
        } else {
          break; // Can't compress further
        }
      } else if (outputSize < targetMinSize) {
        // Too small - we went too far, try to recover
        if (iteration === 1) {
          // First attempt was too aggressive, use current result
          break;
        }
        // Try increasing quality slightly
        quality = Math.min(quality + 5, 95);
        scale = Math.min(scale + 0.05, 1.0);
      }
    }

    // Replace original with compressed version
    fs.renameSync(tempPath, inputPath);

    const savedBytes = originalSize - outputSize;
    const savedPercent = ((savedBytes / originalSize) * 100).toFixed(1);

    stats.savedBytes += savedBytes;
    stats.compressed++;

    console.log(`✅ Compressed: ${path.basename(inputPath)}`);
    console.log(`   ${formatBytes(originalSize)} → ${formatBytes(outputSize)} (saved ${savedPercent}%)`);
    console.log(`   Final: quality=${quality}, scale=${(scale * 100).toFixed(0)}%, iterations=${iteration}`);

  } catch (error) {
    console.error(`❌ Error compressing ${path.basename(inputPath)}:`, error.message);
    stats.errors++;

    // Clean up temp file if it exists
    const tempPath = inputPath + '.temp';
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
  }
}

// Recursively find all images
function findImages(dir) {
  let images = [];

  try {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      // Skip backup files
      if (item.endsWith('.original') || item.endsWith('.temp')) {
        continue;
      }

      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Recursively search subdirectories
        images = images.concat(findImages(fullPath));
      } else if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (imageExtensions.includes(ext)) {
          images.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }

  return images;
}

// Restore original images from backups
function restoreOriginals() {
  console.log('\n🔄 Restoring original images from backups...\n');

  const backups = findBackups(publicDir);
  let restored = 0;

  for (const backupPath of backups) {
    const originalPath = backupPath.replace('.original', '');
    try {
      fs.copyFileSync(backupPath, originalPath);
      fs.unlinkSync(backupPath);
      console.log(`✅ Restored: ${path.basename(originalPath)}`);
      restored++;
    } catch (error) {
      console.error(`❌ Error restoring ${path.basename(originalPath)}:`, error.message);
    }
  }

  console.log(`\n✨ Restored ${restored} image(s)\n`);
}

// Find all backup files
function findBackups(dir) {
  let backups = [];

  try {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        backups = backups.concat(findBackups(fullPath));
      } else if (stat.isFile() && item.endsWith('.original')) {
        backups.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }

  return backups;
}

// Main function
async function main() {
  // Check for restore flag
  const args = process.argv.slice(2);
  if (args.includes('--restore')) {
    restoreOriginals();
    return;
  }

  console.log('\n🗜️  Image Compression Tool\n');
  console.log(`📁 Directory: ${publicDir}`);
  console.log(`🎯 Target size: ${formatBytes(targetMinSize)} - ${formatBytes(targetMaxSize)}`);
  console.log(`💾 Create backups: ${createBackup ? 'Yes (.original)' : 'No'}\n`);

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

  // Compress each image
  for (const imagePath of images) {
    await compressImage(imagePath);
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Compression Summary:');
  console.log('='.repeat(60));
  console.log(`Total images:     ${stats.total}`);
  console.log(`Compressed:       ${stats.compressed}`);
  console.log(`Skipped:          ${stats.skipped}`);
  console.log(`Errors:           ${stats.errors}`);
  console.log(`Space saved:      ${formatBytes(stats.savedBytes)}`);
  console.log('='.repeat(60) + '\n');

  if (stats.compressed > 0) {
    console.log('✨ Compression completed successfully!');
    if (createBackup) {
      console.log('\n💡 To restore original images, run: node compress-images.js --restore');
    }
  }
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
