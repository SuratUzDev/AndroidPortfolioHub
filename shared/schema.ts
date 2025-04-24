import { pgTable, text, serial, integer, timestamp, boolean, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema from the original file
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Portfolio App schema
export const apps = pgTable("apps", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  iconUrl: text("icon_url").notNull(),
  screenshotUrls: text("screenshot_urls").array().default([]),
  featured: boolean("featured").default(false),
  playStoreUrl: text("play_store_url"),
  githubUrl: text("github_url"),
  rating: text("rating"),
  downloads: text("downloads"),
});

export const insertAppSchema = createInsertSchema(apps).omit({
  id: true,
});

export type InsertApp = z.infer<typeof insertAppSchema>;
export type App = typeof apps.$inferSelect;

// GitHub Repository schema
export const githubRepos = pgTable("github_repos", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  stars: integer("stars").notNull(),
  forks: integer("forks").notNull(),
  url: text("url").notNull(),
  tags: text("tags").array().notNull(),
});

export const insertGithubRepoSchema = createInsertSchema(githubRepos).omit({
  id: true,
});

export type InsertGithubRepo = z.infer<typeof insertGithubRepoSchema>;
export type GithubRepo = typeof githubRepos.$inferSelect;

// Blog Post schema
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  coverImageUrl: text("cover_image_url").notNull(),
  publishedAt: text("published_at").notNull(),
  author: text("author").notNull(),
  isFeatured: boolean("is_featured").default(false),
  tags: text("tags").array().default([]),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

// Contact Message schema
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

// Extend schema with validation
export const contactFormSchema = insertContactMessageSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

// Code Sample schema
export const codeSamples = pgTable("code_samples", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  language: text("language").notNull(),
  code: text("code").notNull(),
});

export const insertCodeSampleSchema = createInsertSchema(codeSamples).omit({
  id: true,
});

// Developer Profile schema
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  bio: text("bio").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  location: text("location"),
  avatarUrl: text("avatar_url"),
  experience: text("experience").notNull(), // Stored as JSON string
  education: text("education").notNull(),   // Stored as JSON string
  skills: text("skills").array().default([]),
  socialLinks: text("social_links").notNull(), // Stored as JSON string
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
});

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type DbProfile = typeof profiles.$inferSelect;

// For backwards compatibility, also maintain the original profile type
export type Profile = {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone?: string;
  location?: string;
  avatarUrl?: string;
  experience: {
    company: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    description: string;
  }[];
  education: {
    school: string;
    degree: string;
    field: string;
    graduationDate: Date;
  }[];
  skills: string[];
  socialLinks: {
    platform: string;
    url: string;
  }[];
};

export type InsertCodeSample = z.infer<typeof insertCodeSampleSchema>;
export type CodeSample = typeof codeSamples.$inferSelect;

// Blog Comments schema
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  blogPostId: integer("blog_post_id").notNull().references(() => blogPosts.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  // Optional parent comment ID for comment replies
  parentId: integer("parent_id").references(() => comments.id),
  isApproved: boolean("is_approved").default(false),
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
  isApproved: true,
});

// Extend schema with validation for the comment form
export const commentFormSchema = insertCommentSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  content: z.string().min(5, "Comment must be at least 5 characters"),
  blogPostId: z.number().int().positive(),
  parentId: z.number().int().positive().optional(),
});

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;