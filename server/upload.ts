import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Request, Response } from 'express';
import multer from 'multer';
import { log } from './vite';

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Create directories if they don't exist
async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    log(`Ensured directory exists: ${dirPath}`);
  } catch (error) {
    log(`Error creating directory ${dirPath}: ${error}`);
    throw error;
  }
}

// Initialize multer storage
const storage = multer.diskStorage({
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
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const fileExt = path.extname(file.originalname);
    const fileName = crypto.randomBytes(16).toString('hex') + fileExt;
    cb(null, fileName);
  }
});

// Create multer upload instance
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

// Handler for file uploads
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

// Handler for multiple file uploads
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