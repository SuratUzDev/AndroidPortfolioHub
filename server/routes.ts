import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactFormSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { migrateAllData } from "./firebase-to-postgres";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all apps for portfolio section
  app.get("/api/apps", async (req, res) => {
    try {
      const apps = await storage.getAllApps();
      res.json(apps);
    } catch (error) {
      res.status(500).json({ message: "Failed to load apps" });
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
      const { isFirebaseAvailable } = await import("../client/src/lib/firebase");
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



  const httpServer = createServer(app);
  return httpServer;
}
