import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Define mock/empty implementations
class MockFirestore {
  collection() { return { get: async () => ({ docs: [] }) }; }
  doc() { return { get: async () => ({ exists: () => false, data: () => ({}) }) }; }
}

// Initialize variables as undefined or with mock implementations
let app: any = undefined;
let auth: any = undefined;
let db: any = new MockFirestore();
let storage: any = undefined;

// Export Firebase services (will be undefined if not initialized)
export { app, auth, db, storage };
export default app;

// Helper function to check if Firebase is available
export function isFirebaseAvailable(): boolean {
  return false; // Always return false - we're using PostgreSQL
}