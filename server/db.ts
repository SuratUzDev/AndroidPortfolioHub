import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import * as dotenv from 'dotenv';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables from .env file
if (process.env.NODE_ENV !== 'production') {
  try {
    // ESM-compatible path resolution
    const currentModuleUrl = import.meta.url;
    const currentFilePath = fileURLToPath(currentModuleUrl);
    const currentDirPath = dirname(currentFilePath);
    const rootDir = join(currentDirPath, '..');
    dotenv.config({ path: join(rootDir, '.env') });
  } catch (error) {
    console.warn('Error loading .env file:', error);
  }
}

neonConfig.webSocketConstructor = ws;

// Use a default connection string for local development if DATABASE_URL is not set
const connectionString = process.env.DATABASE_URL || 
  'postgres://localhost:5432/android_portfolio_hub';

console.log(`Connecting to database with ${process.env.DATABASE_URL ? 'provided URL' : 'default local URL'}`);

export const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });

// Helper function to convert database types to API response types
export function convertDbProfile(dbProfile: schema.DbProfile): schema.Profile {
  return {
    id: dbProfile.id.toString(),
    name: dbProfile.name,
    title: dbProfile.title,
    bio: dbProfile.bio,
    email: dbProfile.email,
    phone: dbProfile.phone || undefined,
    location: dbProfile.location || undefined,
    avatarUrl: dbProfile.avatarUrl || undefined,
    experience: JSON.parse(dbProfile.experience || '[]').map((exp: any) => ({
      ...exp,
      startDate: exp.startDate ? new Date(exp.startDate) : new Date(),
      endDate: exp.endDate ? new Date(exp.endDate) : undefined
    })),
    education: JSON.parse(dbProfile.education || '[]').map((edu: any) => ({
      ...edu,
      graduationDate: edu.graduationDate ? new Date(edu.graduationDate) : new Date()
    })),
    skills: dbProfile.skills || [],
    socialLinks: JSON.parse(dbProfile.socialLinks || '[]'),
  };
}