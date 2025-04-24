import { eq, desc } from "drizzle-orm";
import { db, convertDbProfile } from "./db";
import {
  users, User, InsertUser,
  apps, App, InsertApp,
  githubRepos, GithubRepo, InsertGithubRepo,
  blogPosts, BlogPost, InsertBlogPost,
  contactMessages, ContactMessage, InsertContactMessage,
  codeSamples, CodeSample, InsertCodeSample,
  profiles, Profile, InsertProfile,
  comments, Comment, InsertComment
} from "@shared/schema";
import { IStorage } from "./storage";

// PostgreSQL database storage implementation
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }
  
  // App operations
  async getAllApps(): Promise<App[]> {
    return await db.select().from(apps);
  }
  
  async getApp(id: number): Promise<App | undefined> {
    const [app] = await db.select().from(apps).where(eq(apps.id, id));
    return app;
  }
  
  async createApp(app: InsertApp): Promise<App> {
    const [newApp] = await db.insert(apps).values(app).returning();
    return newApp;
  }
  
  // GitHub Repo operations
  async getAllGithubRepos(): Promise<GithubRepo[]> {
    return await db.select().from(githubRepos);
  }
  
  async getGithubRepo(id: number): Promise<GithubRepo | undefined> {
    const [repo] = await db.select().from(githubRepos).where(eq(githubRepos.id, id));
    return repo;
  }
  
  async createGithubRepo(repo: InsertGithubRepo): Promise<GithubRepo> {
    const [newRepo] = await db.insert(githubRepos).values(repo).returning();
    return newRepo;
  }
  
  // Blog Post operations
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts);
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }
  
  async getFeaturedBlogPost(): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.isFeatured, true));
    return post;
  }
  
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }
  
  // Contact Message operations
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }
  
  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    const [message] = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return message;
  }
  
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db.insert(contactMessages).values(message).returning();
    return newMessage;
  }
  
  // Code Sample operations
  async getAllCodeSamples(): Promise<CodeSample[]> {
    return await db.select().from(codeSamples);
  }
  
  async getCodeSample(id: number): Promise<CodeSample | undefined> {
    const [sample] = await db.select().from(codeSamples).where(eq(codeSamples.id, id));
    return sample;
  }
  
  async createCodeSample(sample: InsertCodeSample): Promise<CodeSample> {
    const [newSample] = await db.insert(codeSamples).values(sample).returning();
    return newSample;
  }

  // Profile operations
  async getProfile(): Promise<Profile | undefined> {
    try {
      const [dbProfile] = await db.select().from(profiles);
      if (!dbProfile) return undefined;
      
      return convertDbProfile(dbProfile);
    } catch (error) {
      console.error("Error fetching profile from database:", error);
      return undefined;
    }
  }

  async createOrUpdateProfile(profile: Profile): Promise<Profile> {
    try {
      // Convert date objects to ISO strings before stringifying to JSON
      const experienceJson = JSON.stringify(profile.experience.map(exp => ({
        ...exp,
        startDate: exp.startDate instanceof Date ? exp.startDate.toISOString() : exp.startDate,
        endDate: exp.endDate instanceof Date ? exp.endDate.toISOString() : exp.endDate
      })));
      
      const educationJson = JSON.stringify(profile.education.map(edu => ({
        ...edu,
        graduationDate: edu.graduationDate instanceof Date ? edu.graduationDate.toISOString() : edu.graduationDate
      })));
      
      // Prepare data for database
      const dbProfile = {
        name: profile.name,
        title: profile.title,
        bio: profile.bio,
        email: profile.email,
        phone: profile.phone || null,
        location: profile.location || null,
        avatarUrl: profile.avatarUrl || null,
        experience: experienceJson,
        education: educationJson,
        skills: profile.skills,
        socialLinks: JSON.stringify(profile.socialLinks),
      };

      // Check if profile exists
      const existingProfiles = await db.select().from(profiles);
      
      if (existingProfiles.length > 0) {
        // Update existing profile
        const [updatedProfile] = await db
          .update(profiles)
          .set(dbProfile)
          .where(eq(profiles.id, existingProfiles[0].id))
          .returning();
        
        return convertDbProfile(updatedProfile);
      } else {
        // Create new profile
        const [newProfile] = await db
          .insert(profiles)
          .values(dbProfile)
          .returning();
        
        return convertDbProfile(newProfile);
      }
    } catch (error) {
      console.error("Error saving profile to database:", error);
      throw error;
    }
  }

  // Comment operations
  async getCommentsByBlogPostId(blogPostId: number): Promise<Comment[]> {
    try {
      // Get only approved comments or pending comments that are top-level (not replies)
      const commentsResult = await db
        .select()
        .from(comments)
        .where(eq(comments.blogPostId, blogPostId))
        .orderBy(desc(comments.createdAt));
      
      return commentsResult;
    } catch (error) {
      console.error("Error fetching comments for blog post:", error);
      return [];
    }
  }

  async getComment(id: number): Promise<Comment | undefined> {
    try {
      const [comment] = await db
        .select()
        .from(comments)
        .where(eq(comments.id, id));
      
      return comment;
    } catch (error) {
      console.error("Error fetching comment:", error);
      return undefined;
    }
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    try {
      const [newComment] = await db
        .insert(comments)
        .values(comment)
        .returning();
      
      return newComment;
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  }

  async approveComment(id: number): Promise<Comment> {
    try {
      const [updatedComment] = await db
        .update(comments)
        .set({ isApproved: true })
        .where(eq(comments.id, id))
        .returning();
      
      if (!updatedComment) {
        throw new Error(`Comment with ID ${id} not found`);
      }
      
      return updatedComment;
    } catch (error) {
      console.error("Error approving comment:", error);
      throw error;
    }
  }

  async deleteComment(id: number): Promise<void> {
    try {
      // First, recursively delete all replies to this comment
      const replies = await db
        .select()
        .from(comments)
        .where(eq(comments.parentId, id));
      
      // Delete replies recursively
      for (const reply of replies) {
        await this.deleteComment(reply.id);
      }
      
      // Then delete the comment itself
      await db
        .delete(comments)
        .where(eq(comments.id, id));
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  }
}