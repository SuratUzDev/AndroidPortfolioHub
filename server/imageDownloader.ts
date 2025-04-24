import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import { Request, Response } from 'express';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure directories exist
function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Get file extension from URL or content type
function getFileExtension(url: string, contentType: string): string {
  // Try to get extension from URL first
  const urlExtension = path.extname(url);
  if (urlExtension) {
    return urlExtension;
  }
  
  // Fall back to content type
  const mimeExtension = mime.extension(contentType);
  if (mimeExtension) {
    return `.${mimeExtension}`;
  }
  
  // Default to .jpg if we can't determine the extension
  return '.jpg';
}

// Generate a filename with UUID to avoid conflicts
function generateFilename(originalUrl: string, contentType: string): string {
  const extension = getFileExtension(originalUrl, contentType);
  return `${uuidv4()}${extension}`;
}

// Download an image from a URL
export async function downloadImage(req: Request, res: Response) {
  try {
    const { imageUrl, folder = 'general' } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ 
        error: 'Image URL is required' 
      });
    }
    
    // Create folder if it doesn't exist
    const folderPath = path.join(UPLOADS_DIR, folder);
    ensureDirectoryExists(folderPath);
    
    // Download the image
    const response = await axios.get(imageUrl, { 
      responseType: 'arraybuffer',
      timeout: 10000 // 10 seconds timeout
    });
    
    const contentType = response.headers['content-type'] || 'image/jpeg';
    const fileName = generateFilename(imageUrl, contentType);
    const filePath = path.join(folderPath, fileName);
    
    // Save the image to disk
    fs.writeFileSync(filePath, response.data);
    
    // Return the local URL
    const localImageUrl = `/api/uploads/${folder}/${fileName}`;
    res.json({ 
      originalImageUrl: imageUrl,
      localImageUrl, 
      success: true 
    });
  } catch (error) {
    console.error('Error downloading image:', error);
    res.status(500).json({ 
      error: 'Failed to download image',
      message: error instanceof Error ? error.message : String(error)
    });
  }
}