/**
 * This is a migration utility file that is no longer used in production.
 * It contains mock implementations for Firebase functions that were previously
 * used to migrate data from Firebase to PostgreSQL.
 * 
 * NOTE: This file isn't used in the actual application flow anymore.
 * It's kept for reference and in case we need to run migrations again.
 */

// Simply use any type to avoid TypeScript errors
// Since this code is no longer being used in production
export type Firestore = any;
export type DocumentReference = any;
export type DocumentSnapshot = any;
export type CollectionReference = any;
export type QuerySnapshot = any;
export type Timestamp = any;

// Mock Firebase Firestore functionality
export function collection(): any { 
  return { 
    docs: []
  }; 
}

export function doc(): any { 
  return { 
    exists: () => false, 
    data: () => ({}) 
  }; 
}

export function getDoc(): Promise<any> { 
  return Promise.resolve({ 
    exists: () => false, 
    data: () => ({}) 
  }); 
}

export function getDocs(): Promise<any> { 
  return Promise.resolve({ 
    docs: [] 
  }); 
}

// We no longer use Firebase database
const firebaseDb = null;
import { db as postgresDb } from "./db";
import {
  apps, githubRepos, blogPosts, codeSamples, profiles
} from "@shared/schema";

// Collection names in Firebase
const APPS_COLLECTION = "apps";
const BLOG_POSTS_COLLECTION = "blogPosts";
const GITHUB_REPOS_COLLECTION = "githubRepos";
const CODE_SAMPLES_COLLECTION = "codeSamples";
const PROFILE_COLLECTION = "profile";

// Check if Firebase is available
function isFirebaseAvailable(): boolean {
  return false; // Use PostgreSQL only
}

// Helper function to convert Firebase timestamp to string dates - stub for compatibility
function convertTimestampsToDates(data: any): any {
  // This function is no longer used since we migrated away from Firebase
  // Just return the data as is - there are no Timestamp objects to convert
  return data;
}

// Migrate apps from Firebase to PostgreSQL
export async function migrateApps() {
  console.log("Migrating apps...");
  try {
    if (!isFirebaseAvailable()) {
      console.error("Firebase is not initialized. Cannot migrate apps.");
      return;
    }
    
    // Since Firebase is no longer available, this code won't actually run
    // The functions above are just mocks that return empty data
    console.log("This migration function is no longer used.");
    console.log("Use the createSampleApps function from mock-migration.ts instead.");
    
    // This is just a placeholder since this function isn't used anymore
    return;
  } catch (error) {
    console.error("Error migrating apps:", error);
  }
}

// Migrate GitHub repositories from Firebase to PostgreSQL
export async function migrateGithubRepos() {
  console.log("Migrating GitHub repositories...");
  try {
    if (!isFirebaseAvailable()) {
      console.error("Firebase is not initialized. Cannot migrate GitHub repositories.");
      return;
    }
    
    // Since Firebase is no longer available, this code won't actually run
    // The functions above are just mocks that return empty data
    console.log("This migration function is no longer used.");
    console.log("Use the createSampleGithubRepos function from mock-migration.ts instead.");
    
    // This is just a placeholder since this function isn't used anymore
    return;
  } catch (error) {
    console.error("Error migrating GitHub repositories:", error);
  }
}

// Migrate blog posts from Firebase to PostgreSQL
export async function migrateBlogPosts() {
  console.log("Migrating blog posts...");
  try {
    if (!isFirebaseAvailable()) {
      console.error("Firebase is not initialized. Cannot migrate blog posts.");
      return;
    }
    
    // Since Firebase is no longer available, this code won't actually run
    // The functions above are just mocks that return empty data
    console.log("This migration function is no longer used.");
    console.log("Use the createSampleBlogPosts function from mock-migration.ts instead.");
    
    // This is just a placeholder since this function isn't used anymore
    return;
  } catch (error) {
    console.error("Error migrating blog posts:", error);
  }
}

// Migrate code samples from Firebase to PostgreSQL
export async function migrateCodeSamples() {
  console.log("Migrating code samples...");
  try {
    if (!isFirebaseAvailable()) {
      console.error("Firebase is not initialized. Cannot migrate code samples.");
      return;
    }
    
    // Since Firebase is no longer available, this code won't actually run
    // The functions above are just mocks that return empty data
    console.log("This migration function is no longer used.");
    console.log("Use the createSampleCodeSamples function from mock-migration.ts instead.");
    
    // This is just a placeholder since this function isn't used anymore
    return;
  } catch (error) {
    console.error("Error migrating code samples:", error);
  }
}

// Migrate profile data from Firebase to PostgreSQL
export async function migrateProfile() {
  console.log("Migrating profile...");
  try {
    if (!isFirebaseAvailable()) {
      console.error("Firebase is not initialized. Cannot migrate profile.");
      return;
    }
    
    // Since Firebase is no longer available, this code won't actually run
    // The functions above are just mocks that return empty data
    console.log("This migration function is no longer used.");
    console.log("Use the createSampleProfile function from mock-migration.ts instead.");
    
    // This is just a placeholder since this function isn't used anymore
    return;
  } catch (error) {
    console.error("Error migrating profile:", error);
  }
}

// Run all migrations - this function is deprecated
export async function migrateAllData() {
  console.log("Starting migration from Firebase to PostgreSQL...");
  
  try {
    console.log("This migration function is no longer used.");
    console.log("Use the createSampleData function from mock-migration.ts instead.");
    
    return { 
      success: false, 
      message: "Firebase migration is no longer available. Use mock-migration.ts instead." 
    };
  } catch (error) {
    console.error("Migration failed:", error);
    return { 
      success: false, 
      message: "Migration failed", 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}