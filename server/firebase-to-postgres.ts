import {
  collection,
  doc,
  getDoc,
  getDocs,
  Timestamp,
  DocumentData,
  Firestore
} from "firebase/firestore";
import { db as firebaseDb } from "../client/src/lib/firebase";
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
  return firebaseDb !== null && firebaseDb !== undefined;
}

// Helper function to convert Firebase timestamp to string dates
function convertTimestampsToDates(data: any): any {
  if (!data) return data;
  
  const result = { ...data };
  
  if (data.publishedAt && data.publishedAt instanceof Timestamp) {
    result.publishedAt = data.publishedAt.toDate().toISOString();
  }
  
  if (data.createdAt && data.createdAt instanceof Timestamp) {
    result.createdAt = data.createdAt.toDate().toISOString();
  }
  
  if (data.updatedAt && data.updatedAt instanceof Timestamp) {
    result.updatedAt = data.updatedAt.toDate().toISOString();
  }
  
  // Handle profile experience dates
  if (data.experience && Array.isArray(data.experience)) {
    result.experience = data.experience.map((exp: any) => {
      const convertedExp = { ...exp };
      if (exp.startDate instanceof Timestamp) {
        convertedExp.startDate = exp.startDate.toDate().toISOString();
      }
      if (exp.endDate instanceof Timestamp) {
        convertedExp.endDate = exp.endDate.toDate().toISOString();
      }
      return convertedExp;
    });
  }
  
  // Handle profile education dates
  if (data.education && Array.isArray(data.education)) {
    result.education = data.education.map((edu: any) => {
      const convertedEdu = { ...edu };
      if (edu.graduationDate instanceof Timestamp) {
        convertedEdu.graduationDate = edu.graduationDate.toDate().toISOString();
      }
      return convertedEdu;
    });
  }
  
  return result;
}

// Migrate apps from Firebase to PostgreSQL
export async function migrateApps() {
  console.log("Migrating apps...");
  try {
    if (!isFirebaseAvailable()) {
      console.error("Firebase is not initialized. Cannot migrate apps.");
      return;
    }
    
    // Get all apps from Firebase
    const appsCollection = collection(firebaseDb as Firestore, APPS_COLLECTION);
    const appsSnapshot = await getDocs(appsCollection);
    const appsData = appsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...convertTimestampsToDates(data),
        id: doc.id
      };
    });
    
    console.log(`Found ${appsData.length} apps in Firebase`);
    
    // Insert apps into PostgreSQL
    for (const app of appsData) {
      const { id, ...appData } = app;
      
      // Insert app excluding the id field (let PostgreSQL generate it)
      await postgresDb.insert(apps).values({
        title: appData.title,
        description: appData.description,
        category: appData.category || "Unknown",
        iconUrl: appData.iconUrl || "",
        screenshotUrls: appData.screenshotUrls || [],
        featured: appData.featured || false,
        playStoreUrl: appData.playStoreUrl || null,
        githubUrl: appData.githubUrl || null,
        rating: appData.rating || null,
        downloads: appData.downloads || null,
      });
    }
    
    console.log("Apps migration completed successfully");
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
    
    // Get all repos from Firebase
    const reposCollection = collection(firebaseDb as Firestore, GITHUB_REPOS_COLLECTION);
    const reposSnapshot = await getDocs(reposCollection);
    const reposData = reposSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...convertTimestampsToDates(data),
        id: doc.id
      };
    });
    
    console.log(`Found ${reposData.length} GitHub repositories in Firebase`);
    
    // Insert repos into PostgreSQL
    for (const repo of reposData) {
      const { id, ...repoData } = repo;
      
      await postgresDb.insert(githubRepos).values({
        name: repoData.name,
        description: repoData.description,
        stars: repoData.stars || 0,
        forks: repoData.forks || 0,
        url: repoData.url,
        tags: repoData.tags || [],
      });
    }
    
    console.log("GitHub repositories migration completed successfully");
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
    
    // Get all blog posts from Firebase
    const postsCollection = collection(firebaseDb as Firestore, BLOG_POSTS_COLLECTION);
    const postsSnapshot = await getDocs(postsCollection);
    const postsData = postsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...convertTimestampsToDates(data),
        id: doc.id
      };
    });
    
    console.log(`Found ${postsData.length} blog posts in Firebase`);
    
    // Insert blog posts into PostgreSQL
    for (const post of postsData) {
      const { id, ...postData } = post;
      
      await postgresDb.insert(blogPosts).values({
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt || postData.summary || "",
        content: postData.content,
        coverImageUrl: postData.coverImageUrl || "",
        publishedAt: postData.publishedAt || new Date().toISOString(),
        author: postData.author || "Sulton UzDev",
        isFeatured: postData.isFeatured || false,
        tags: postData.tags || [],
      });
    }
    
    console.log("Blog posts migration completed successfully");
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
    
    // Get all code samples from Firebase
    const samplesCollection = collection(firebaseDb as Firestore, CODE_SAMPLES_COLLECTION);
    const samplesSnapshot = await getDocs(samplesCollection);
    const samplesData = samplesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...convertTimestampsToDates(data),
        id: doc.id
      };
    });
    
    console.log(`Found ${samplesData.length} code samples in Firebase`);
    
    // Insert code samples into PostgreSQL
    for (const sample of samplesData) {
      const { id, ...sampleData } = sample;
      
      await postgresDb.insert(codeSamples).values({
        title: sampleData.title,
        language: sampleData.language,
        code: sampleData.code,
      });
    }
    
    console.log("Code samples migration completed successfully");
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
    
    // Get profile from Firebase (usually stored as a single document)
    const profileDocRef = doc(firebaseDb as Firestore, PROFILE_COLLECTION, "main");
    const profileSnapshot = await getDoc(profileDocRef);
    
    if (!profileSnapshot.exists()) {
      console.log("No profile found in Firebase");
      return;
    }
    
    const profileData = convertTimestampsToDates(profileSnapshot.data());
    console.log("Found profile in Firebase:", profileData.name);
    
    // Convert complex objects to JSON strings for PostgreSQL
    await postgresDb.insert(profiles).values({
      name: profileData.name,
      title: profileData.title,
      bio: profileData.bio || "",
      email: profileData.email,
      phone: profileData.phone || null,
      location: profileData.location || null,
      avatarUrl: profileData.avatarUrl || null,
      experience: JSON.stringify(profileData.experience || []),
      education: JSON.stringify(profileData.education || []),
      skills: profileData.skills || [],
      socialLinks: JSON.stringify(profileData.socialLinks || []),
    });
    
    console.log("Profile migration completed successfully");
  } catch (error) {
    console.error("Error migrating profile:", error);
  }
}

// Run all migrations
export async function migrateAllData() {
  console.log("Starting migration from Firebase to PostgreSQL...");
  
  try {
    // Check if Firebase is available
    if (!isFirebaseAvailable()) {
      console.error("Firebase is not initialized. Cannot proceed with migration.");
      return { 
        success: false, 
        message: "Firebase is not initialized. Check your Firebase configuration." 
      };
    }
    
    await migrateApps();
    await migrateGithubRepos();
    await migrateBlogPosts();
    await migrateCodeSamples();
    await migrateProfile();
    
    console.log("Migration completed successfully!");
    return { success: true, message: "Migration completed successfully!" };
  } catch (error) {
    console.error("Migration failed:", error);
    return { 
      success: false, 
      message: "Migration failed", 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}