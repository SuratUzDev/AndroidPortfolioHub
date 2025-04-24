/**
 * This script migrates existing images from external URLs to local storage
 */
import { db } from './db';
import { apps, blogPosts, profiles } from '@shared/schema';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';

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
async function downloadImage(imageUrl: string, folder: string = 'general'): Promise<string> {
  try {
    if (!imageUrl || imageUrl.startsWith('/api/uploads/') || imageUrl.startsWith('/uploads/')) {
      return imageUrl;
    }
    
    // For demo purposes: If the URL is example.com, create a placeholder instead of trying to download
    if (imageUrl.includes('example.com')) {
      // Create folder if it doesn't exist
      const folderPath = path.join(UPLOADS_DIR, folder);
      ensureDirectoryExists(folderPath);
      
      // Generate a placeholder file name
      const fileName = `placeholder-${uuidv4()}.png`;
      const filePath = path.join(folderPath, fileName);
      
      // Create a simple buffer with placeholder image data
      // This is a tiny 1x1 pixel transparent PNG
      const placeholderBuffer = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 
        0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00, 
        0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00, 
        0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49, 
        0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
      ]);
      
      // Save the placeholder image
      fs.writeFileSync(filePath, placeholderBuffer);
      
      console.log(`Created placeholder for ${imageUrl} at ${filePath}`);
      
      // Return the local URL
      return `/api/uploads/${folder}/${fileName}`;
    }
    
    // For real URLs - download actual image
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
    return `/api/uploads/${folder}/${fileName}`;
  } catch (error) {
    console.error('Error downloading image:', error);
    
    // Create a placeholder on error
    try {
      // Create folder if it doesn't exist
      const folderPath = path.join(UPLOADS_DIR, folder);
      ensureDirectoryExists(folderPath);
      
      // Generate a placeholder file name
      const fileName = `error-${uuidv4()}.png`;
      const filePath = path.join(folderPath, fileName);
      
      // Create a simple buffer with placeholder image data
      const placeholderBuffer = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 
        0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00, 
        0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00, 
        0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49, 
        0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
      ]);
      
      // Save the placeholder image
      fs.writeFileSync(filePath, placeholderBuffer);
      
      console.log(`Created error placeholder for ${imageUrl} at ${filePath}`);
      
      // Return the local URL
      return `/api/uploads/${folder}/${fileName}`;
    } catch (e) {
      console.error('Failed to create placeholder image:', e);
      return `/api/uploads/placeholder.png`; // Fallback URL
    }
  }
}

// Download an array of images
async function downloadMultipleImages(imageUrls: string[], folder: string = 'general'): Promise<string[]> {
  if (!imageUrls || !imageUrls.length) return [];
  
  const downloadPromises = imageUrls.map(url => downloadImage(url, folder));
  return Promise.all(downloadPromises);
}

// Migrate app images
export async function migrateAppImages() {
  try {
    console.log('Starting migration of app images...');
    const allApps = await db.select().from(apps);
    
    for (const app of allApps) {
      const oldIconUrl = app.iconUrl;
      const oldScreenshotUrls = app.screenshotUrls as string[] || [];
      
      // Skip if already migrated
      if (!oldIconUrl || oldIconUrl.startsWith('/api/uploads/')) {
        continue;
      }
      
      // Download and save icon
      const newIconUrl = await downloadImage(oldIconUrl, 'apps');
      console.log(`Migrated app icon for ${app.title}: ${oldIconUrl} -> ${newIconUrl}`);
      
      // Download and save screenshots
      const newScreenshotUrls = await downloadMultipleImages(oldScreenshotUrls, 'apps');
      
      // Update the database
      await db
        .update(apps)
        .set({
          iconUrl: newIconUrl,
          screenshotUrls: newScreenshotUrls
        })
        .where(eq(apps.id, app.id));
      
      console.log(`Updated app ${app.title} with local image URLs`);
    }
    
    console.log('App image migration completed successfully');
    return { success: true, message: 'App images migrated successfully' };
  } catch (error) {
    console.error('Error migrating app images:', error);
    return { success: false, message: `Error migrating app images: ${error}` };
  }
}

// Migrate blog post images
export async function migrateBlogImages() {
  try {
    console.log('Starting migration of blog post images...');
    const allPosts = await db.select().from(blogPosts);
    
    for (const post of allPosts) {
      const oldCoverImageUrl = post.coverImageUrl;
      
      // Skip if already migrated
      if (!oldCoverImageUrl || oldCoverImageUrl.startsWith('/api/uploads/')) {
        continue;
      }
      
      // Download and save cover image
      const newCoverImageUrl = await downloadImage(oldCoverImageUrl, 'blog');
      console.log(`Migrated blog cover image for ${post.title}: ${oldCoverImageUrl} -> ${newCoverImageUrl}`);
      
      // Update the database
      await db
        .update(blogPosts)
        .set({
          coverImageUrl: newCoverImageUrl
        })
        .where(eq(blogPosts.id, post.id));
      
      console.log(`Updated blog post ${post.title} with local image URL`);
    }
    
    console.log('Blog image migration completed successfully');
    return { success: true, message: 'Blog images migrated successfully' };
  } catch (error) {
    console.error('Error migrating blog images:', error);
    return { success: false, message: `Error migrating blog images: ${error}` };
  }
}

// Migrate profile images
export async function migrateProfileImages() {
  try {
    console.log('Starting migration of profile images...');
    const allProfiles = await db.select().from(profiles);
    
    for (const profile of allProfiles) {
      // Check directly if avatarUrl exists and needs migration
      const oldAvatarUrl = profile.avatarUrl;
      
      // Skip if no avatar or already migrated
      if (!oldAvatarUrl || oldAvatarUrl.startsWith('/api/uploads/')) {
        continue;
      }
      
      // Download and save avatar
      const newAvatarUrl = await downloadImage(oldAvatarUrl, 'profile');
      console.log(`Migrated profile avatar for ${profile.name}: ${oldAvatarUrl} -> ${newAvatarUrl}`);
      
      // Update the database
      await db
        .update(profiles)
        .set({
          avatarUrl: newAvatarUrl
        })
        .where(eq(profiles.id, profile.id));
      
      console.log(`Updated profile for ${profile.name} with local avatar URL`);
    }
    
    console.log('Profile image migration completed successfully');
    return { success: true, message: 'Profile images migrated successfully' };
  } catch (error) {
    console.error('Error migrating profile images:', error);
    return { success: false, message: `Error migrating profile images: ${error}` };
  }
}

// Migrate all images
export async function migrateAllImages() {
  try {
    const results = await Promise.all([
      migrateAppImages(),
      migrateBlogImages(),
      migrateProfileImages()
    ]);
    
    const allSuccessful = results.every(result => result.success);
    
    return {
      success: allSuccessful,
      message: allSuccessful
        ? 'All images successfully migrated to local storage'
        : 'Some image migrations failed, check logs for details'
    };
  } catch (error) {
    console.error('Error in image migration process:', error);
    return {
      success: false,
      message: `Image migration failed: ${error}`
    };
  }
}

// Express endpoint to trigger image migration
export async function handleImageMigration(req: Request, res: Response) {
  try {
    const result = await migrateAllImages();
    res.json(result);
  } catch (error) {
    console.error('Error handling image migration request:', error);
    res.status(500).json({
      success: false,
      message: `Image migration failed: ${error instanceof Error ? error.message : String(error)}`
    });
  }
}