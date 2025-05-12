const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '../assets');

// Ensure assets directory exists
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

async function generatePlaceholderIcon() {
  const size = 1024;
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#2196F3"/>
      <text x="50%" y="50%" font-family="Arial" font-size="200" fill="white" text-anchor="middle" dominant-baseline="middle">
        PS
      </text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(ASSETS_DIR, 'source-icon.png'));
  
  console.log('Generated placeholder icon');
}

async function generatePlaceholderSplash() {
  const width = 1242;
  const height = 2436;
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#FFFFFF"/>
      <text x="50%" y="50%" font-family="Arial" font-size="120" fill="#2196F3" text-anchor="middle" dominant-baseline="middle">
        Plansimple
      </text>
      <text x="50%" y="60%" font-family="Arial" font-size="60" fill="#666666" text-anchor="middle" dominant-baseline="middle">
        Your Legacy Planning Companion
      </text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(ASSETS_DIR, 'source-splash.png'));
  
  console.log('Generated placeholder splash screen');
}

async function generatePlaceholders() {
  try {
    await generatePlaceholderIcon();
    await generatePlaceholderSplash();
    console.log('Generated placeholder assets. Please replace them with your actual designs before deploying.');
  } catch (error) {
    console.error('Error generating placeholder assets:', error);
  }
}

generatePlaceholders(); 