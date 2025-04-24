import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create a visible solid-color placeholder PNG
// This is a 300x300 green PNG
const betterPlaceholderData = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjBCNkU3MkRGRTc2NDExRTk5QjFGRkYyM0ExOTUzMjEwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjBCNkU3MkUwRTc2NDExRTk5QjFGRkYyM0ExOTUzMjEwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MEI2RTcyRERFNzY0MTFFOTlCMUZGRjIzQTE5NTMyMTAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MEI2RTcyREVFNzY0MTFFOTlCMUZGRjIzQTE5NTMyMTAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz74TudLAAAB+UlEQVR42uzSMQ0AAAgDMDbwbxk9GFKQknpYa88cACQIFiBYgGABggUIFoIFCBYgWIBgAYIFCBaCBQgWIFiAYAGCBQgWggUIFiBYgGABggUIFoIFCBYgWIBgAYIFCBaCBQgWIFiAYAGCBQgWggUIFiBYgGABggUIFoIFCBYgWIBgAYIFCBaCBQgWIFiAYAGCBQgWggUIFiBYgGABggUIFoIFCBYgWIBgAYIFCBYQgnXsAAQLECxAsADBAgQLwQIECxAsQLAAwQIEC8ECBAsQLECwAMECBAvBAgQLECxAsADBAgQLwQIECxAsQLAAwQIEC8ECBAsQLECwAMECBAvBAgQLECxAsADBAgQLwQIECxAsQLAAwQIEC8ECBAsQLECwAMECBAvBAgQLECxAsADBAgQLwQIECxAsQLAAwQIEC8ECBAsQLECwAMECBAvBAgQLECxAsADBAgQLwQIECxAsQLAAwQIEC8ECBAsQLECwAMECBAvBAgQLECxAsADBAgQLwQIECxAsQLAAwQIEC8ECBAsQLECwAMECBAvBAgQLECxAsADBAgQLwQIECxAsQLAAwQIEC8ECBAsQLECwAMECBAvBAgQLECxAsADBAgQLwQIECxAsQLAAwQIEC8ECBAuIVYABAJF9D7aPRnCiAAAAAElFTkSuQmCC',
  'base64'
);

// Create the better placeholder image
const betterPlaceholderPath = path.join(uploadsDir, 'better-placeholder.png');
fs.writeFileSync(betterPlaceholderPath, betterPlaceholderData);

// Also create category-specific placeholders
const folders = ['apps', 'blog', 'profile', 'general'];
for (const folder of folders) {
  const folderPath = path.join(uploadsDir, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  
  const categoryPlaceholderPath = path.join(folderPath, 'category-placeholder.png');
  fs.writeFileSync(categoryPlaceholderPath, betterPlaceholderData);
}

console.log(`Created better placeholder images!`);