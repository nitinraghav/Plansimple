const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '../assets');
const SOURCE_ICON = path.join(ASSETS_DIR, 'source-icon.png');
const SOURCE_SPLASH = path.join(ASSETS_DIR, 'source-splash.png');

// Ensure assets directory exists
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// App icon sizes
const ICON_SIZES = {
  'icon.png': 1024, // App Store icon
  'adaptive-icon.png': 1024, // Android adaptive icon
  'favicon.png': 48, // Web favicon
  'icon-ios-20.png': 20,
  'icon-ios-29.png': 29,
  'icon-ios-40.png': 40,
  'icon-ios-60.png': 60,
  'icon-ios-76.png': 76,
  'icon-ios-83.5.png': 83.5,
  'icon-ios-1024.png': 1024,
  'icon-android-36.png': 36,
  'icon-android-48.png': 48,
  'icon-android-72.png': 72,
  'icon-android-96.png': 96,
  'icon-android-144.png': 144,
  'icon-android-192.png': 192,
  'icon-android-512.png': 512,
};

// Splash screen sizes
const SPLASH_SIZES = {
  'splash.png': { width: 1242, height: 2436 }, // iPhone X splash
  'splash-ios-640x1136.png': { width: 640, height: 1136 }, // iPhone 5
  'splash-ios-750x1334.png': { width: 750, height: 1334 }, // iPhone 6/7/8
  'splash-ios-1125x2436.png': { width: 1125, height: 2436 }, // iPhone X
  'splash-ios-1242x2208.png': { width: 1242, height: 2208 }, // iPhone 6+/7+/8+
  'splash-ios-1242x2688.png': { width: 1242, height: 2688 }, // iPhone XS Max
  'splash-android-320x480.png': { width: 320, height: 480 }, // Android small
  'splash-android-480x800.png': { width: 480, height: 800 }, // Android medium
  'splash-android-720x1280.png': { width: 720, height: 1280 }, // Android large
  'splash-android-1080x1920.png': { width: 1080, height: 1920 }, // Android xlarge
};

async function generateIcons() {
  console.log('Generating app icons...');
  
  for (const [filename, size] of Object.entries(ICON_SIZES)) {
    try {
      await sharp(SOURCE_ICON)
        .resize(size, size)
        .toFile(path.join(ASSETS_DIR, filename));
      console.log(`Generated ${filename}`);
    } catch (error) {
      console.error(`Error generating ${filename}:`, error);
    }
  }
}

async function generateSplashScreens() {
  console.log('Generating splash screens...');
  
  for (const [filename, dimensions] of Object.entries(SPLASH_SIZES)) {
    try {
      await sharp(SOURCE_SPLASH)
        .resize(dimensions.width, dimensions.height, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .toFile(path.join(ASSETS_DIR, filename));
      console.log(`Generated ${filename}`);
    } catch (error) {
      console.error(`Error generating ${filename}:`, error);
    }
  }
}

async function generateAssets() {
  // Check if source files exist
  if (!fs.existsSync(SOURCE_ICON)) {
    console.error('Source icon not found. Please place a 1024x1024 PNG file at:', SOURCE_ICON);
    return;
  }
  
  if (!fs.existsSync(SOURCE_SPLASH)) {
    console.error('Source splash screen not found. Please place a 1242x2436 PNG file at:', SOURCE_SPLASH);
    return;
  }

  try {
    await generateIcons();
    await generateSplashScreens();
    console.log('All assets generated successfully!');
  } catch (error) {
    console.error('Error generating assets:', error);
  }
}

generateAssets(); 