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

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static files from public directory
  app.use('/public', express.static(path.join(process.cwd(), 'public')));
  // Get all apps for portfolio section
  app.get("/api/apps", async (req, res) => {
    try {
      const apps = await storage.getAllApps();
      res.json(apps);
    } catch (error) {
      res.status(500).json({ message: "Failed to load apps" });
    }
  });
  
  // Create a new app
  app.post("/api/apps", async (req, res) => {
    try {
      const result = insertAppSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      const app = await storage.createApp(result.data);
      res.status(201).json(app);
    } catch (error) {
      console.error("Error creating app:", error);
      res.status(500).json({ message: "Failed to create app" });
    }
  });

  // Get all GitHub repos
  app.get("/api/github-repos", async (req, res) => {
    try {
      const repos = await storage.getAllGithubRepos();
      res.json(repos);
    } catch (error) {
      res.status(500).json({ message: "Failed to load GitHub repositories" });
    }
  });
  
  // Create a new GitHub repo
  app.post("/api/github-repos", async (req, res) => {
    try {
      const result = insertGithubRepoSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      const repo = await storage.createGithubRepo(result.data);
      res.status(201).json(repo);
    } catch (error) {
      console.error("Error creating GitHub repo:", error);
      res.status(500).json({ message: "Failed to create GitHub repository" });
    }
  });

  // Get all blog posts
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to load blog posts" });
    }
  });

  // Get featured blog post
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

  // Get blog post by slug
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

  // Get all code samples
  app.get("/api/code-samples", async (req, res) => {
    try {
      const codeSamples = await storage.getAllCodeSamples();
      res.json(codeSamples);
    } catch (error) {
      res.status(500).json({ message: "Failed to load code samples" });
    }
  });

  // Submit contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const result = contactFormSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      const contactMessage = await storage.createContactMessage(result.data);
      res.status(201).json({ message: "Message sent successfully", id: contactMessage.id });
    } catch (error) {
      res.status(500).json({ message: "Failed to send message" });
    }
  });
  
  // Firebase to PostgreSQL migration endpoint (admin only)
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
  
  // Update profile
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

  // Get comments for a blog post
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

  // Submit a comment on a blog post
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
      res.sendFile(filePath);
    } else {
      // If file doesn't exist, try a category-specific placeholder first
      const categoryPlaceholder = path.join(uploadsDir, folder, 'category-placeholder.png');
      if (fs.existsSync(categoryPlaceholder)) {
        res.sendFile(categoryPlaceholder);
      } else {
        // Fall back to the main placeholder
        const betterPlaceholderPath = path.join(uploadsDir, 'better-placeholder.png');
        if (fs.existsSync(betterPlaceholderPath)) {
          res.sendFile(betterPlaceholderPath);
        } else {
          // Last resort: original placeholder
          const placeholderPath = path.join(uploadsDir, 'placeholder.png');
          if (fs.existsSync(placeholderPath)) {
            res.sendFile(placeholderPath);
          } else {
            res.status(404).json({ error: 'File not found and no placeholder available' });
          }
        }
      }
    }
  });
  
  // Direct fallback for placeholders
  app.get('/api/uploads/placeholder.png', (req, res) => {
    // Try better placeholder first
    const betterPlaceholderPath = path.join(uploadsDir, 'better-placeholder.png');
    if (fs.existsSync(betterPlaceholderPath)) {
      res.sendFile(betterPlaceholderPath);
    } else {
      // Fall back to original
      const placeholderPath = path.join(uploadsDir, 'placeholder.png');
      if (fs.existsSync(placeholderPath)) {
        res.sendFile(placeholderPath);
      } else {
        res.status(404).json({ error: 'Placeholder not found' });
      }
    }
  });

  // File upload endpoints
  // Single file upload
  app.post("/api/upload/:category", upload.single('file'), handleFileUpload);
  
  // Multiple files upload
  app.post("/api/upload/:category/multiple", upload.array('files', 10), handleMultipleFileUpload);
  
  // Image download endpoint
  app.post("/api/uploads/download", downloadImage);
  
  // Image migration endpoint (for admin use)
  app.post("/api/admin/migrate-images", handleImageMigration);

  const httpServer = createServer(app);
  return httpServer;
}
