/**
 * Server-side Image Downloader Module
 * 
 * This module provides an API endpoint for downloading external images
 * and storing them locally in the server's filesystem.
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import { Request, Response } from 'express';

/**
 * Base directory for storing all uploaded and downloaded images
 * 
 * @constant {string} UPLOADS_DIR
 */
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

/**
 * Creates a directory if it doesn't already exist
 * This is used to ensure that category folders exist before saving images
 * 
 * @param {string} dirPath - Absolute path of the directory to create
 * @returns {void}
 * @throws Will not throw errors, but may fail silently if permission issues occur
 */
function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Determines the appropriate file extension for an image
 * First tries to extract it from the URL, then falls back to MIME type,
 * and finally defaults to .jpg if neither approach works
 * 
 * @param {string} url - The original URL of the image
 * @param {string} contentType - The MIME content type from the server response
 * @returns {string} The file extension with leading dot (e.g., '.jpg', '.png')
 * 
 * @example
 * // From URL
 * getFileExtension('https://example.com/image.png', 'image/jpeg')
 * // Returns: '.png'
 * 
 * @example
 * // From content type
 * getFileExtension('https://example.com/image', 'image/jpeg')
 * // Returns: '.jpeg'
 */
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

/**
 * Generates a unique filename for the downloaded image
 * Uses a UUID to avoid conflicts and preserves the original file extension
 * 
 * @param {string} originalUrl - The URL the image is being downloaded from
 * @param {string} contentType - The MIME content type from the server response
 * @returns {string} A unique filename with appropriate extension
 * 
 * @example
 * generateFilename('https://example.com/image.png', 'image/png')
 * // Returns something like: '123e4567-e89b-12d3-a456-426614174000.png'
 */
function generateFilename(originalUrl: string, contentType: string): string {
  const extension = getFileExtension(originalUrl, contentType);
  return `${uuidv4()}${extension}`;
}

/**
 * Express route handler for downloading an external image and saving it locally
 * 
 * @param {Request} req - Express request object
 *   @param {string} req.body.imageUrl - The URL of the image to download
 *   @param {string} [req.body.folder='general'] - The category folder to save the image in
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} JSON response with the local URL or error message
 * 
 * @example
 * // Request body:
 * // {
 * //   "imageUrl": "https://example.com/image.jpg",
 * //   "folder": "profile"
 * // }
 * //
 * // Successful response:
 * // {
 * //   "originalImageUrl": "https://example.com/image.jpg",
 * //   "localImageUrl": "/api/uploads/profile/123e4567-e89b-12d3-a456-426614174000.jpg",
 * //   "success": true
 * // }
 * //
 * // Error response:
 * // {
 * //   "error": "Failed to download image",
 * //   "message": "Request failed with status code 404"
 * // }
 */
export async function downloadImage(req: Request, res: Response): Promise<Response> {
  try {
    // Extract parameters from request body
    const { imageUrl, folder = 'general' } = req.body;
    
    // Validate input
    if (!imageUrl) {
      return res.status(400).json({ 
        error: 'Image URL is required' 
      });
    }
    
    // Create folder if it doesn't exist
    const folderPath = path.join(UPLOADS_DIR, folder);
    ensureDirectoryExists(folderPath);
    
    // Download the image with timeout protection
    const response = await axios.get(imageUrl, { 
      responseType: 'arraybuffer',
      timeout: 10000 // 10 seconds timeout
    });
    
    // Get content type and generate a unique filename
    const contentType = response.headers['content-type'] || 'image/jpeg';
    const fileName = generateFilename(imageUrl, contentType);
    const filePath = path.join(folderPath, fileName);
    
    // Save the image data to disk
    fs.writeFileSync(filePath, response.data);
    
    // Return success response with the local URL for client use
    const localImageUrl = `/api/uploads/${folder}/${fileName}`;
    return res.json({ 
      originalImageUrl: imageUrl,
      localImageUrl, 
      success: true 
    });
  } catch (error) {
    // Log the error and return a helpful error response
    console.error('Error downloading image:', error);
    return res.status(500).json({ 
      error: 'Failed to download image',
      message: error instanceof Error ? error.message : String(error)
    });
  }
}