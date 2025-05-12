/**
 * Placeholder Image Generation Script
 * 
 * This script creates placeholder images for the application to use when actual images
 * are unavailable or fail to load. It generates a default placeholder and category-specific
 * placeholders for different content types.
 * 
 * The placeholders are highly visible, solid-color images that make it obvious when 
 * an image is not loading correctly, which helps with debugging and development.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Get current directory path in ESM module format
 * This is necessary because __dirname is not available in ES modules
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Create the uploads directory structure if it doesn't exist
 * This ensures that the application has a place to store uploaded files
 */
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Create a visible solid-color placeholder PNG
 * This is a 300x300 green PNG encoded as a base64 string
 * Using a pre-encoded image avoids dependencies on image generation libraries
 */
const betterPlaceholderData = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjBCNkU3MkRGRTc2NDExRTk5QjFGRkYyM0ExOTUzMjEwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjBCNkU3MkUwRTc2NDExRTk5QjFGRkYyM0ExOTUzMjEwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MEI2RTcyRERFNzY0MTFFOTlCMUZGRjIzQTE5NTMyMTAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MEI2RTcyREVFNzY0MTFFOTlCMUZGRjIzQTE5NTMyMTAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz74TudLAAAB+UlEQVR42uzSMQ0AAAgDMDbwbxk9GFKQknpYa88cACQIFiBYgGABggUIFoIFCBYgWIBgAYIFCBaCBQgWIFiAYAGCBQgWggUIFiBYgGABggUIFoIFCBYgWIBgAYIFCBaCBQgWIFiAYAGCBQgWggUIFiBYgGABggUIFoIFCBYgWIBgAYIFCBaCBQgWIFiAYAGCBQgWggUIFiBYgGABggUIFoIFCBYgWIBgAYIFCBYQgnXsAAQLECxAsADBAgQLwQIECxAsQLAAwQIEC8ECBAsQLECwAMECBAvBAgQLECxAsADBAgQLwQIECxAsQLAAwQIEC8ECBAsQLECwAMECBAvBAgQLECxAsADBAgQLwQIECxAsQLAAwQIEC8ECBAsQLECwAMECBAvBAgQLECxAsADBAgQLwQIECxAsQLAAwQIEC8ECBAsQLECwAMECBAvBAgQLECxAsADBAgQLwQIECxAsQLAAwQIEC8ECBAsQLECwAMECBAvBAgQLECxAsADBAgQLwQIECxAsQLAAwQIEC8ECBAsQLECwAMECBAvBAgQLECxAsADBAgQLwQIECxAsQLAAwQIEC8ECBAsQLECwAMECBAvBAgQLECxAsADBAgQLwQIECxAsQLAAwQIEC8ECBAuIVYABAJF9D7aPRnCiAAAAAElFTkSuQmCC',
  'base64'
);

/**
 * Create the default placeholder image
 * This is placed in the root uploads directory and used as a fallback
 * for all content types if category-specific placeholders fail
 */
const betterPlaceholderPath = path.join(uploadsDir, 'better-placeholder.png');
fs.writeFileSync(betterPlaceholderPath, betterPlaceholderData);

/**
 * Create category-specific placeholder images using SVG
 * Each content type (apps, blog posts, profiles) gets its own distinctive placeholder
 * with different colors and visual indicators to make them easily distinguishable
 */
const folders = ['apps', 'blog', 'profile', 'general'];
const svgPlaceholders = {
  apps: `<?xml version="1.0" encoding="UTF-8"?>
<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="300" fill="#4CAF50"/>
  <text x="150" y="150" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">APP PLACEHOLDER</text>
  <text x="150" y="180" font-family="Arial" font-size="16" fill="white" text-anchor="middle" dominant-baseline="middle">Image unavailable</text>
</svg>`,
  blog: `<?xml version="1.0" encoding="UTF-8"?>
<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="300" fill="#2196F3"/>
  <text x="150" y="150" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">BLOG PLACEHOLDER</text>
  <text x="150" y="180" font-family="Arial" font-size="16" fill="white" text-anchor="middle" dominant-baseline="middle">Image unavailable</text>
</svg>`,
  profile: `<?xml version="1.0" encoding="UTF-8"?>
<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="300" fill="#9C27B0"/>
  <circle cx="150" cy="120" r="60" fill="#E1BEE7"/>
  <circle cx="150" cy="300" r="150" fill="#9C27B0"/>
  <text x="150" y="220" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">PROFILE PLACEHOLDER</text>
  <text x="150" y="250" font-family="Arial" font-size="16" fill="white" text-anchor="middle" dominant-baseline="middle">Image unavailable</text>
</svg>`,
  general: `<?xml version="1.0" encoding="UTF-8"?>
<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="300" fill="#FF5722"/>
  <rect x="75" y="75" width="150" height="150" fill="#FFCCBC" stroke="white" stroke-width="4"/>
  <text x="150" y="150" font-family="Arial" font-size="24" fill="#FF5722" text-anchor="middle" dominant-baseline="middle">PLACEHOLDER</text>
  <text x="150" y="200" font-family="Arial" font-size="16" fill="white" text-anchor="middle" dominant-baseline="middle">Image unavailable</text>
</svg>`
};

for (const folder of folders) {
  // Create the category folder if it doesn't exist
  const folderPath = path.join(uploadsDir, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  
  // Create a category-specific SVG placeholder
  const categoryPlaceholderPath = path.join(folderPath, 'category-placeholder.svg');
  fs.writeFileSync(categoryPlaceholderPath, svgPlaceholders[folder]);
  
  // Keep PNG version for backward compatibility
  const categoryPlaceholderPngPath = path.join(folderPath, 'category-placeholder.png');
  fs.writeFileSync(categoryPlaceholderPngPath, betterPlaceholderData);
}

console.log(`Created better placeholder images!`);