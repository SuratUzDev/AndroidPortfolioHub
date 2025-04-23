import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
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
    experience: JSON.parse(dbProfile.experience),
    education: JSON.parse(dbProfile.education),
    skills: dbProfile.skills || [],
    socialLinks: JSON.parse(dbProfile.socialLinks),
  };
}