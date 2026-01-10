const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const sizes = [192, 512];
const outputDir = path.join(__dirname, "../public/icons");

// Create SVG template
const createSVG = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#000000"/>
  <text x="50%" y="50%" font-family="Arial" font-size="${size * 0.5}" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="central">S</text>
</svg>
`;

async function generateIcons() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const size of sizes) {
    const svg = Buffer.from(createSVG(size));

    // Regular icon
    await sharp(svg)
      .resize(size, size)
      .png()
      .toFile(path.join(outputDir, `icon-${size}x${size}.png`));

    // Maskable icon (with padding)
    const paddedSize = Math.floor(size * 0.8);
    const padding = Math.floor((size - paddedSize) / 2);

    await sharp(svg)
      .resize(paddedSize, paddedSize)
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 0, g: 0, b: 0, alpha: 1 }
      })
      .png()
      .toFile(path.join(outputDir, `icon-maskable-${size}x${size}.png`));

    console.log(`Generated icons for ${size}x${size}`);
  }

  console.log("All icons generated successfully!");
}

generateIcons().catch(console.error);
