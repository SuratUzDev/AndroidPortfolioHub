import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

// Initialize Firebase if environment variables are available
let app: FirebaseApp | undefined = undefined;
let auth: Auth | undefined = undefined;

try {
  // Check if Firebase config is available
  if (
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID &&
    import.meta.env.VITE_FIREBASE_APP_ID
  ) {
    // Firebase configuration
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };

    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    
    console.log("Firebase Auth initialized successfully");
  } else {
    console.log("Firebase environment variables not found - Auth will be unavailable");
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

// Export Firebase auth services
export { app, auth };
export default app;

// Helper function to check if Firebase Auth is available
export function isFirebaseAuthAvailable(): boolean {
  return auth !== undefined;
}