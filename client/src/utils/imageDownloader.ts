/**
 * Image Downloader Module
 * 
 * This module provides utilities for downloading external images and storing them locally.
 * It communicates with the server-side image download API to save images in appropriate folders.
 */

import { apiRequest } from "@/lib/queryClient";

/**
 * Downloads an image from an external URL and saves it to the server's uploads directory.
 * This function helps in migrating external image URLs to locally hosted images for better
 * reliability and control over image assets.
 * 
 * @param {string|null|undefined} imageUrl - The external URL of the image to download
 * @param {string} [folder='general'] - The category folder to store the image in (apps, blog, profile, etc.)
 * @returns {Promise<string>} A promise that resolves to the local URL of the saved image, or empty string if the input was null
 * @throws Will log errors but not throw - returns the original URL as fallback on failure
 * 
 * @example
 * // Download a profile image
 * const localUrl = await downloadAndSaveImage('https://example.com/user.jpg', 'profile');
 * // Result: '/api/uploads/profile/a1b2c3d4e5f6.jpg'
 * 
 * @example
 * // If the URL is already local, it will be returned as is
 * const localUrl = await downloadAndSaveImage('/api/uploads/profile/existing.jpg', 'profile');
 * // Result: '/api/uploads/profile/existing.jpg'
 */
export async function downloadAndSaveImage(imageUrl: string | null | undefined, folder: string = 'general'): Promise<string> {
  try {
    // Handle empty or null URL
    if (!imageUrl) return '';
    
    // Skip if already a local URL to avoid duplicate downloads
    if (imageUrl.startsWith('/api/uploads/') || imageUrl.startsWith('/uploads/')) {
      return imageUrl;
    }
    
    // Call the server-side download endpoint
    const response = await fetch('/api/uploads/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        imageUrl,
        folder
      }),
    });
    
    // Handle HTTP errors from the server
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }
    
    // Parse the response to get the local image URL
    const data = await response.json();
    return data.localImageUrl;
  } catch (error) {
    // Log the error but don't break the application
    console.error('Error downloading image:', error);
    // Return original URL as fallback so the image can still be shown if available externally
    return imageUrl || '';
  }
}

/**
 * Downloads multiple images in parallel and returns their local URLs.
 * This is useful for batch operations like migrating all images for an app or blog post.
 * 
 * @param {string[]} imageUrls - Array of external image URLs to download
 * @param {string} [folder='general'] - The category folder to store the images in
 * @returns {Promise<string[]>} A promise that resolves to an array of local URLs
 * 
 * @example
 * // Download all screenshots for an app
 * const localUrls = await downloadMultipleImages([
 *   'https://example.com/screenshot1.jpg',
 *   'https://example.com/screenshot2.jpg'
 * ], 'apps');
 * // Result: ['/api/uploads/apps/a1b2c3d4e5f6.jpg', '/api/uploads/apps/g7h8i9j0k1l2.jpg']
 */
export async function downloadMultipleImages(imageUrls: string[], folder: string = 'general'): Promise<string[]> {
  // Handle empty or null array
  if (!imageUrls || !imageUrls.length) return [];
  
  // Create an array of download promises to process in parallel
  const downloadPromises = imageUrls.map(url => downloadAndSaveImage(url, folder));
  
  // Wait for all downloads to complete
  return Promise.all(downloadPromises);
}