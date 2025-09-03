const fs = require('fs');
const path = require('path');

// Create a simple 1x1 pixel image data URL for testing
function createSimpleImageBuffer(color = [100, 150, 200]) {
  // Create a minimal PNG file (1x1 pixel)
  const png = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, 0x01, // width: 1
    0x00, 0x00, 0x00, 0x01, // height: 1
    0x08, 0x02, 0x00, 0x00, 0x00, // bit depth: 8, color type: 2 (RGB), compression: 0, filter: 0, interlace: 0
    0x90, 0x77, 0x53, 0xDE, // CRC
    0x00, 0x00, 0x00, 0x0C, // IDAT chunk length
    0x49, 0x44, 0x41, 0x54, // IDAT
    0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0x03, 0x00, color[0], color[1], color[2], // pixel data
    0x00, 0x00, 0x00, 0x00, // IEND chunk length
    0x49, 0x45, 0x4E, 0x44, // IEND
    0xAE, 0x42, 0x60, 0x82  // CRC
  ]);
  return png;
}

// Create texture directory if it doesn't exist
const textureDir = path.join(__dirname, '../public/textures');
if (!fs.existsSync(textureDir)) {
  fs.mkdirSync(textureDir, { recursive: true });
}

// Generate basic texture files
const textures = [
  { name: 'earth-day-16k.jpg', color: [70, 130, 180] }, // Steel blue for oceans
  { name: 'earth-night-16k.jpg', color: [25, 25, 112] }, // Midnight blue for night
  { name: 'earth-bump-8k.jpg', color: [128, 128, 128] }, // Gray for bump map
  { name: 'earth-normal-8k.jpg', color: [128, 128, 255] } // Normal map blue
];

textures.forEach(texture => {
  const filePath = path.join(textureDir, texture.name);
  const imageBuffer = createSimpleImageBuffer(texture.color);
  fs.writeFileSync(filePath, imageBuffer);
  console.log(`Created ${texture.name}`);
});

console.log('All texture files generated successfully!');