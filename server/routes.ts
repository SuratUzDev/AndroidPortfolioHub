/**
 * API Routes Module
 * 
 * This module defines all the API routes for the application.
 * It handles authentication, data validation, and connects frontend requests
 * to the appropriate storage operations.
 */

import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactFormSchema, commentFormSchema, insertAppSchema, insertGithubRepoSchema, insertBlogPostSchema, insertCodeSampleSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { migrateAllData } from "./firebase-to-postgres";
import { upload, handleFileUpload, handleMultipleFileUpload } from "./upload";
import { downloadImage } from "./imageDownloader";
import { handleImageMigration } from "./image-migration";
import fs from 'fs';
import path from 'path';

/**
 * Registers all API routes and middleware to the Express application
 * 
 * This function configures all the routes needed by the application, including:
 * - Static file serving
 * - CRUD operations for apps, blog posts, GitHub repos, etc.
 * - Authentication endpoints
 * - File upload and image handling
 * 
 * @param {Express} app - The Express application instance
 * @returns {Promise<Server>} A promise that resolves to the HTTP server instance
 */
export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static files from public directory
  app.use('/public', express.static(path.join(process.cwd(), 'public')));
  
  /**
   * GET /api/apps
   * Retrieves all apps from the database for display in the portfolio section
   * 
   * @route GET /api/apps
   * @returns {Array<App>} JSON array of all app objects
   * @throws {500} If database operation fails
   */
  app.get("/api/apps", async (req, res) => {
    try {
      const apps = await storage.getAllApps();
      res.json(apps);
    } catch (error) {
      res.status(500).json({ message: "Failed to load apps" });
    }
  });
  
  /**
   * POST /api/apps
   * Creates a new app entry in the database
   * 
   * @route POST /api/apps
   * @param {Object} req.body - The app data to create (must match insertAppSchema)
   * @returns {App} JSON object of the created app with assigned ID
   * @throws {400} If validation fails
   * @throws {500} If database operation fails
   */
  app.post("/api/apps", async (req, res) => {
    try {
      // Validate request body against schema
      const result = insertAppSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      // Create app in storage
      const app = await storage.createApp(result.data);
      res.status(201).json(app);
    } catch (error) {
      console.error("Error creating app:", error);
      res.status(500).json({ message: "Failed to create app" });
    }
  });

  /**
   * GET /api/github-repos
   * Retrieves all GitHub repositories for display in the open source section
   * 
   * @route GET /api/github-repos
   * @returns {Array<GithubRepo>} JSON array of all GitHub repository objects
   * @throws {500} If database operation fails
   */
  app.get("/api/github-repos", async (req, res) => {
    try {
      const repos = await storage.getAllGithubRepos();
      res.json(repos);
    } catch (error) {
      res.status(500).json({ message: "Failed to load GitHub repositories" });
    }
  });
  
  /**
   * POST /api/github-repos
   * Creates a new GitHub repository entry in the database
   * 
   * @route POST /api/github-repos
   * @param {Object} req.body - The repository data (must match insertGithubRepoSchema)
   * @returns {GithubRepo} JSON object of the created repository with assigned ID
   * @throws {400} If validation fails
   * @throws {500} If database operation fails
   */
  app.post("/api/github-repos", async (req, res) => {
    try {
      // Validate request body against schema
      const result = insertGithubRepoSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      // Create repository in storage
      const repo = await storage.createGithubRepo(result.data);
      res.status(201).json(repo);
    } catch (error) {
      console.error("Error creating GitHub repo:", error);
      res.status(500).json({ message: "Failed to create GitHub repository" });
    }
  });

  /**
   * GET /api/blog
   * Retrieves all blog posts for the blog section
   * 
   * @route GET /api/blog
   * @returns {Array<BlogPost>} JSON array of all blog post objects
   * @throws {500} If database operation fails
   */
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to load blog posts" });
    }
  });

  /**
   * GET /api/blog/featured
   * Retrieves the featured blog post for display on the homepage
   * 
   * @route GET /api/blog/featured
   * @returns {BlogPost} JSON object of the featured blog post
   * @throws {404} If no featured post is found
   * @throws {500} If database operation fails
   */
  app.get("/api/blog/featured", async (req, res) => {
    try {
      const featuredPost = await storage.getFeaturedBlogPost();
      if (!featuredPost) {
        return res.status(404).json({ message: "No featured post found" });
      }
      res.json(featuredPost);
    } catch (error) {
      res.status(500).json({ message: "Failed to load featured blog post" });
    }
  });

  /**
   * GET /api/blog/:slug
   * Retrieves a specific blog post by its URL slug
   * 
   * @route GET /api/blog/:slug
   * @param {string} req.params.slug - The unique slug identifier for the blog post
   * @returns {BlogPost} JSON object of the requested blog post
   * @throws {404} If blog post is not found
   * @throws {500} If database operation fails
   */
  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to load blog post" });
    }
  });

  /**
   * GET /api/code-samples
   * Retrieves all code samples for the developer showcase section
   * 
   * @route GET /api/code-samples
   * @returns {Array<CodeSample>} JSON array of all code sample objects
   * @throws {500} If database operation fails
   */
  app.get("/api/code-samples", async (req, res) => {
    try {
      const codeSamples = await storage.getAllCodeSamples();
      res.json(codeSamples);
    } catch (error) {
      res.status(500).json({ message: "Failed to load code samples" });
    }
  });

  /**
   * POST /api/contact
   * Submits a contact form message to the database
   * 
   * @route POST /api/contact
   * @param {Object} req.body - The contact message data (must match contactFormSchema)
   * @returns {Object} Confirmation message with the message ID
   * @throws {400} If validation fails
   * @throws {500} If database operation fails
   */
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate request body against schema
      const result = contactFormSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      // Create contact message in storage
      const contactMessage = await storage.createContactMessage(result.data);
      res.status(201).json({ message: "Message sent successfully", id: contactMessage.id });
    } catch (error) {
      res.status(500).json({ message: "Failed to send message" });
    }
  });
  
  /**
   * POST /api/admin/migrate
   * Admin-only endpoint to migrate data from Firebase to PostgreSQL or create sample data
   * 
   * This endpoint checks if Firebase credentials are available:
   * - If available, it migrates existing Firebase data to PostgreSQL
   * - If not available, it creates sample data in PostgreSQL instead
   * 
   * @route POST /api/admin/migrate
   * @returns {Object} Status of the migration operation
   * @throws {500} If migration fails
   */
  app.post("/api/admin/migrate", async (req, res) => {
    try {
      console.log("Starting data migration from Firebase to PostgreSQL...");
      
      // Try to import Firebase migration and sample data functions
      const { isFirebaseAuthAvailable: isFirebaseAvailable } = await import("../client/src/lib/firebase");
      const { migrateAllData } = await import("./firebase-to-postgres");
      const { createSampleData } = await import("./mock-migration");
      
      // Check if Firebase is available
      if (isFirebaseAvailable()) {
        console.log("Firebase is available, migrating data...");
        const result = await migrateAllData();
        res.json(result);
      } else {
        // If Firebase is not available, create sample data
        console.log("Firebase is not available, creating sample data...");
        const result = await createSampleData();
        res.json({
          ...result,
          message: "Firebase configuration not found. Created sample data in PostgreSQL."
        });
      }
    } catch (error) {
      console.error("Migration/data creation failed:", error);
      res.status(500).json({ 
        success: false, 
        message: "Operation failed",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Get profile
  app.get("/api/profile", async (req, res) => {
    try {
      const profile = await storage.getProfile();
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to load profile" });
    }
  });
  
  /**
   * POST /api/profile
   * Updates the developer profile information
   * 
   * @route POST /api/profile
   * @param {Object} req.body - The complete profile data
   * @returns {Profile} JSON object of the updated profile
   * @throws {500} If database operation fails
   */
  app.post("/api/profile", async (req, res) => {
    try {
      const profile = req.body;
      const updatedProfile = await storage.createOrUpdateProfile(profile);
      res.json(updatedProfile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  /**
   * GET /api/blog/:blogPostId/comments
   * Retrieves all approved comments for a specific blog post
   * 
   * @route GET /api/blog/:blogPostId/comments
   * @param {string} req.params.blogPostId - The ID of the blog post to get comments for
   * @returns {Array<Comment>} JSON array of comment objects
   * @throws {400} If blog post ID is invalid
   * @throws {500} If database operation fails
   */
  app.get("/api/blog/:blogPostId/comments", async (req, res) => {
    try {
      const blogPostId = parseInt(req.params.blogPostId);
      if (isNaN(blogPostId)) {
        return res.status(400).json({ message: "Invalid blog post ID" });
      }
      
      const comments = await storage.getCommentsByBlogPostId(blogPostId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to load comments" });
    }
  });

  /**
   * POST /api/blog/:blogPostId/comments
   * Submits a new comment on a blog post (requires admin approval before becoming visible)
   * 
   * @route POST /api/blog/:blogPostId/comments
   * @param {string} req.params.blogPostId - The ID of the blog post to comment on
   * @param {Object} req.body - The comment data (must match commentFormSchema)
   * @returns {Object} Confirmation message with the created comment object
   * @throws {400} If blog post ID is invalid or validation fails
   * @throws {500} If database operation fails
   */
  app.post("/api/blog/:blogPostId/comments", async (req, res) => {
    try {
      const blogPostId = parseInt(req.params.blogPostId);
      if (isNaN(blogPostId)) {
        return res.status(400).json({ message: "Invalid blog post ID" });
      }
      
      // Validate comment data
      const result = commentFormSchema.safeParse({
        ...req.body,
        blogPostId
      });
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      const comment = await storage.createComment(result.data);
      res.status(201).json({ 
        message: "Comment submitted successfully. It will be visible after approval.", 
        comment 
      });
    } catch (error) {
      console.error("Error submitting comment:", error);
      res.status(500).json({ message: "Failed to submit comment" });
    }
  });

  // Admin: Approve a comment
  app.post("/api/admin/comments/:commentId/approve", async (req, res) => {
    try {
      const commentId = parseInt(req.params.commentId);
      if (isNaN(commentId)) {
        return res.status(400).json({ message: "Invalid comment ID" });
      }
      
      const comment = await storage.approveComment(commentId);
      res.json({ 
        message: "Comment approved successfully", 
        comment 
      });
    } catch (error) {
      console.error("Error approving comment:", error);
      res.status(500).json({ message: "Failed to approve comment" });
    }
  });

  // Admin: Delete a comment
  app.delete("/api/admin/comments/:commentId", async (req, res) => {
    try {
      const commentId = parseInt(req.params.commentId);
      if (isNaN(commentId)) {
        return res.status(400).json({ message: "Invalid comment ID" });
      }
      
      await storage.deleteComment(commentId);
      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Failed to delete comment" });
    }
  });

  // Create necessary uploads directories if they don't exist
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  const appUploadsDir = path.join(uploadsDir, 'apps');
  const blogUploadsDir = path.join(uploadsDir, 'blog');
  const profileUploadsDir = path.join(uploadsDir, 'profile');
  const generalUploadsDir = path.join(uploadsDir, 'general');
  
  // Create all required directories
  Promise.all([
    fs.promises.mkdir(uploadsDir, { recursive: true }),
    fs.promises.mkdir(appUploadsDir, { recursive: true }),
    fs.promises.mkdir(blogUploadsDir, { recursive: true }),
    fs.promises.mkdir(profileUploadsDir, { recursive: true }),
    fs.promises.mkdir(generalUploadsDir, { recursive: true })
  ])
    .then(() => console.log(`Uploads directories created: ${uploadsDir}`))
    .catch(err => console.error(`Error creating uploads directories: ${err}`));
    
  // Serve uploaded files
  app.get('/api/uploads/:folder/:filename', (req, res) => {
    const { folder, filename } = req.params;
    const filePath = path.join(uploadsDir, folder, filename);
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24h
      res.sendFile(filePath);
    } else {
      // Check file extension
      const ext = path.extname(filename).toLowerCase();
      
      // If file doesn't exist, try a category-specific placeholder first (SVG or PNG)
      const svgCategoryPlaceholder = path.join(uploadsDir, folder, 'category-placeholder.svg');
      const pngCategoryPlaceholder = path.join(uploadsDir, folder, 'category-placeholder.png');
      
      if (fs.existsSync(svgCategoryPlaceholder)) {
        console.log(`Serving SVG category placeholder for ${folder}/${filename}`);
        res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24h
        res.setHeader('Content-Type', 'image/svg+xml');
        res.sendFile(svgCategoryPlaceholder);
      } 
      else if (fs.existsSync(pngCategoryPlaceholder)) {
        console.log(`Serving PNG category placeholder for ${folder}/${filename}`);
        res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24h
        res.sendFile(pngCategoryPlaceholder);
      } 
      else {
        // Fall back to the better placeholder
        const betterPlaceholderPath = path.join(uploadsDir, 'better-placeholder.png');
        if (fs.existsSync(betterPlaceholderPath)) {
          console.log(`Serving better placeholder for ${folder}/${filename}`);
          res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24h
          res.sendFile(betterPlaceholderPath);
        } else {
          // Last resort: original placeholder
          const placeholderPath = path.join(uploadsDir, 'placeholder.png');
          if (fs.existsSync(placeholderPath)) {
            console.log(`Serving original placeholder for ${folder}/${filename}`);
            res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24h
            res.sendFile(placeholderPath);
          } else {
            res.status(404).json({ error: 'File not found and no placeholder available' });
          }
        }
      }
    }
  });
  
  /**
   * GET /api/uploads/placeholder.png
   * Direct fallback endpoint for placeholder images
   * This endpoint provides a cascade of fallbacks from SVG to PNG formats
   * 
   * @route GET /api/uploads/placeholder.png
   * @returns {File} The placeholder image file
   * @throws {404} If no placeholder is available
   */
  app.get('/api/uploads/placeholder.png', (req, res) => {
    // Try SVG better placeholder first (preferred format)
    const betterPlaceholderSvgPath = path.join(uploadsDir, 'better-placeholder.svg');
    if (fs.existsSync(betterPlaceholderSvgPath)) {
      console.log(`Serving SVG better placeholder for direct access`);
      res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24h
      res.setHeader('Content-Type', 'image/svg+xml');
      res.sendFile(betterPlaceholderSvgPath);
    } 
    // Then try PNG better placeholder
    else {
      const betterPlaceholderPngPath = path.join(uploadsDir, 'better-placeholder.png');
      if (fs.existsSync(betterPlaceholderPngPath)) {
        console.log(`Serving PNG better placeholder for direct access`);
        res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24h
        res.sendFile(betterPlaceholderPngPath);
      } 
      // Fall back to original
      else {
        const placeholderPath = path.join(uploadsDir, 'placeholder.png');
        if (fs.existsSync(placeholderPath)) {
          console.log(`Serving original placeholder for direct access`);
          res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24h
          res.sendFile(placeholderPath);
        } else {
          res.status(404).json({ error: 'Placeholder not found' });
        }
      }
    }
  });

  /**
   * GET /api/uploads/better-placeholder.svg
   * Direct access endpoint for SVG placeholder
   * This allows for direct referencing of the SVG placeholder in image sources
   * 
   * @route GET /api/uploads/better-placeholder.svg
   * @returns {File} The SVG placeholder image
   * @throws {404} If the SVG placeholder is not found
   */
  app.get('/api/uploads/better-placeholder.svg', (req, res) => {
    const svgPlaceholderPath = path.join(uploadsDir, 'better-placeholder.svg');
    if (fs.existsSync(svgPlaceholderPath)) {
      res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24h
      res.setHeader('Content-Type', 'image/svg+xml');
      res.sendFile(svgPlaceholderPath);
    } else {
      // Fallback to PNG if SVG doesn't exist
      const pngPlaceholderPath = path.join(uploadsDir, 'better-placeholder.png');
      if (fs.existsSync(pngPlaceholderPath)) {
        res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24h
        res.sendFile(pngPlaceholderPath);
      } else {
        res.status(404).json({ error: 'SVG placeholder not found' });
      }
    }
  });
  
  /**
   * POST /api/upload/:category
   * Uploads a single image file and saves it to the appropriate category folder
   * 
   * @route POST /api/upload/:category
   * @param {string} req.params.category - The category folder to save the file in (apps, blog, profile, etc.)
   * @param {File} req.file - The uploaded file (must be an image)
   * @returns {Object} JSON response with the URL and metadata of the saved file
   * @throws {400} If no file is uploaded or the file is not an image
   * @throws {500} If file saving fails
   */
  app.post("/api/upload/:category", upload.single('file'), handleFileUpload);
  
  /**
   * POST /api/upload/:category/multiple
   * Uploads multiple image files and saves them to the appropriate category folder
   * 
   * @route POST /api/upload/:category/multiple
   * @param {string} req.params.category - The category folder to save the files in (apps, blog, profile, etc.)
   * @param {File[]} req.files - The uploaded files (must be images)
   * @returns {Object} JSON response with URLs and metadata of all saved files
   * @throws {400} If no files are uploaded or the files are not images
   * @throws {500} If file saving fails
   */
  app.post("/api/upload/:category/multiple", upload.array('files', 10), handleMultipleFileUpload);
  
  /**
   * POST /api/uploads/download
   * Downloads an external image and saves it locally
   * This endpoint is used for migrating external images to the local server
   * 
   * @route POST /api/uploads/download
   * @param {Object} req.body - Request body
   * @param {string} req.body.imageUrl - The URL of the external image to download
   * @param {string} [req.body.folder='general'] - The category folder to save the image in
   * @returns {Object} JSON response with the original and local URLs of the image
   * @throws {400} If the image URL is missing or invalid
   * @throws {500} If the download or saving process fails
   */
  app.post("/api/uploads/download", downloadImage);
  
  /**
   * POST /api/admin/migrate-images
   * Admin-only endpoint to migrate all external images to local storage
   * This endpoint processes all content types and replaces external URLs with local ones
   * 
   * @route POST /api/admin/migrate-images
   * @returns {Object} JSON response with migration statistics
   * @throws {500} If the migration process fails
   */
  app.post("/api/admin/migrate-images", handleImageMigration);

  const httpServer = createServer(app);
  return httpServer;
}
