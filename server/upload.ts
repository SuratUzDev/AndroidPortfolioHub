/**
 * File Upload Module
 * 
 * This module provides utilities for handling file uploads to the server.
 * It supports single and multiple image file uploads, organized by category.
 */

import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Request, Response } from 'express';
import multer from 'multer';
import { log } from './vite';

/**
 * Path to the server's uploads directory
 * All uploaded files will be stored in subdirectories of this path
 * 
 * @constant {string} UPLOADS_DIR
 */
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

/**
 * Creates a directory if it doesn't already exist
 * This function is used to ensure category subdirectories are available
 * before saving uploaded files
 * 
 * @param {string} dirPath - The absolute path of the directory to create
 * @returns {Promise<void>} A promise that resolves when the directory exists
 * @throws Will throw an error if directory creation fails
 */
async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    log(`Ensured directory exists: ${dirPath}`);
  } catch (error) {
    log(`Error creating directory ${dirPath}: ${error}`);
    throw error;
  }
}

/**
 * Multer storage configuration
 * Configures where and how uploaded files will be stored
 * 
 * @constant {multer.StorageEngine} storage
 */
const storage = multer.diskStorage({
  /**
   * Determines the destination directory for uploaded files
   * Creates category subdirectories as needed
   * 
   * @param {Request} req - The Express request object
   * @param {Express.Multer.File} file - Information about the uploaded file
   * @param {Function} cb - Callback function to set the destination
   */
  destination: async (req, file, cb) => {
    try {
      // Get category from the request (apps, blog-posts, etc.)
      const { category = 'misc' } = req.params;
      const categoryDir = path.join(UPLOADS_DIR, category);
      
      // Ensure category directory exists
      await ensureDirectoryExists(categoryDir);
      
      cb(null, categoryDir);
    } catch (error) {
      cb(error as any, '');
    }
  },
  
  /**
   * Generates a unique filename for the uploaded file
   * Uses a random hex string plus the original file extension
   * 
   * @param {Request} req - The Express request object
   * @param {Express.Multer.File} file - Information about the uploaded file
   * @param {Function} cb - Callback function to set the filename
   */
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const fileExt = path.extname(file.originalname);
    const fileName = crypto.randomBytes(16).toString('hex') + fileExt;
    cb(null, fileName);
  }
});

/**
 * Configured multer middleware for handling file uploads
 * Limits uploads to images only, with a maximum size of 5MB
 * 
 * @constant {multer.Multer} upload
 */
export const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  }
});

/**
 * Express route handler for single file uploads
 * Processes a single file upload and returns metadata about the saved file
 * 
 * @param {Request} req - The Express request object, including uploaded file in req.file
 * @param {Response} res - The Express response object
 * @returns {Promise<Response>} JSON response with file metadata or error message
 * 
 * @example
 * // Route definition:
 * app.post("/api/upload/:category", upload.single('file'), handleFileUpload);
 * 
 * // Response format on success:
 * // {
 * //   url: "/uploads/apps/a1b2c3d4e5f6.jpg",
 * //   originalName: "app-icon.jpg",
 * //   size: 45678,
 * //   mimetype: "image/jpeg"
 * // }
 */
export async function handleFileUpload(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate public URL for the uploaded file
    const { category = 'misc' } = req.params;
    const filename = req.file.filename;
    const fileUrl = `/uploads/${category}/${filename}`;

    return res.json({ 
      url: fileUrl,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    log(`Error in file upload: ${error}`);
    return res.status(500).json({ error: 'File upload failed' });
  }
}

/**
 * Express route handler for multiple file uploads
 * Processes multiple files and returns metadata about all saved files
 * 
 * @param {Request} req - The Express request object, including uploaded files in req.files
 * @param {Response} res - The Express response object
 * @returns {Promise<Response>} JSON response with file metadata array or error message
 * 
 * @example
 * // Route definition:
 * app.post("/api/upload/:category/multiple", upload.array('files', 10), handleMultipleFileUpload);
 * 
 * // Response format on success:
 * // {
 * //   files: [
 * //     {
 * //       url: "/uploads/blog/a1b2c3d4e5f6.jpg",
 * //       originalName: "blog-image1.jpg",
 * //       size: 45678,
 * //       mimetype: "image/jpeg"
 * //     },
 * //     {
 * //       url: "/uploads/blog/g7h8i9j0k1l2.png",
 * //       originalName: "blog-image2.png",
 * //       size: 98765,
 * //       mimetype: "image/png"
 * //     }
 * //   ]
 * // }
 */
export async function handleMultipleFileUpload(req: Request, res: Response) {
  try {
    if (!req.files || Array.isArray(req.files) && req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
    const { category = 'misc' } = req.params;
    
    // Generate URLs for each uploaded file
    const fileUrls = files.map(file => ({
      url: `/uploads/${category}/${file.filename}`,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    }));

    return res.json({ files: fileUrls });
  } catch (error) {
    log(`Error in multiple file upload: ${error}`);
    return res.status(500).json({ error: 'File upload failed' });
  }
}