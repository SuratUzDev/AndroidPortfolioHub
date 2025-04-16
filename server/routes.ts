import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactFormSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

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

  const httpServer = createServer(app);
  return httpServer;
}
