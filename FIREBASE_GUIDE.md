# Firebase Configuration Guide for Portfolio Application

This guide provides detailed steps to set up and configure Firebase for your portfolio application.

## Overview

Firebase is used in this application for:
1. User authentication
2. File storage for blog post images and other assets
3. Backup data storage (though PostgreSQL is the primary database)

## Firebase Project Setup

### Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "SultonUzDev-Portfolio")
4. Choose whether to enable Google Analytics (recommended)
5. Follow the prompts to complete project creation

### Step 2: Register Your Web Application

1. In the Firebase console, click the web icon (</>) to add a web app
2. Provide a nickname for your app (e.g., "Portfolio Web")
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Copy the Firebase configuration object (you'll need this later)

## Authentication Setup

### Step 1: Enable Authentication Methods

1. In the Firebase console, go to "Authentication" > "Sign-in method"
2. Enable "Email/Password" authentication
3. Enable "Google" authentication
4. Save your changes

### Step 2: Add Authorized Domains

1. In the Firebase console, go to "Authentication" > "Settings" > "Authorized domains"
2. Add your domains:
   - For local development: `localhost`
   - For Replit: your Replit domain (e.g., `your-app.replit.app`)
   - Any custom domains you use

## Storage Setup (for Images and Files)

### Step 1: Set Up Firebase Storage

1. In the Firebase console, go to "Storage"
2. Click "Get started"
3. Choose a storage location close to your target audience
4. Start with the default security rules or customize them

### Step 2: Configure Storage Rules

Update your storage rules to allow authenticated uploads:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read; // Public read access
      allow write: if request.auth != null; // Only authenticated users can upload
    }
  }
}
```

## Environment Variables

Configure your application with the Firebase credentials by setting these environment variables:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=your-app-id
```

You can find these values in the Firebase configuration object from Step 2 of Project Setup.

## Local Development Configuration

For local development, create a `.env` file in your project root with:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=your-app-id
DATABASE_URL=your-postgresql-connection-string
```

## Firebase in the Application Code

The application uses Firebase through the configuration in `client/src/lib/firebase.ts`:

```typescript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
```

## Authentication Implementation

### Login with Google

```typescript
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";

async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    // User is now signed in
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}
```

### File Upload to Firebase Storage

```typescript
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

async function uploadFile(file, path) {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}
```

## Firebase to PostgreSQL Migration

Your application has been migrated from Firebase to PostgreSQL for primary data storage. However, Firebase is still used for authentication and file storage. The migration process involves:

1. Reading data from Firebase (if it exists)
2. Converting it to the PostgreSQL schema format
3. Inserting the data into PostgreSQL tables

This process is handled in the application by the code in `server/firebase-to-postgres.ts`.

## Deployment Considerations

When deploying your application:

1. Make sure to add your production domain to Firebase authorized domains
2. Set all Firebase environment variables in your hosting platform
3. Test authentication flow on the deployed site
4. Verify file uploads work correctly

## Security Best Practices

1. **Never expose Firebase API keys in client-side code without restrictions**
   - Use Firebase Security Rules to restrict access
   - Set up domain restrictions in the Firebase console

2. **Implement proper authentication checks**
   - Verify authentication on the server side for sensitive operations
   - Use Firebase Admin SDK for server-side verification

3. **Set up proper Firebase Security Rules**
   - Restrict database/storage access based on authentication
   - Use validation rules to ensure data integrity

## Monitoring and Maintenance

1. **Monitor Auth Usage**
   - Check the Firebase console for authentication activity
   - Set up alerts for unusual authentication patterns

2. **Storage Usage**
   - Monitor storage usage in the Firebase console
   - Implement cleanup functions for unused files

3. **Regular Updates**
   - Keep Firebase SDKs updated to the latest versions
   - Review security rules regularly

## Troubleshooting Firebase Issues

### Authentication Problems

1. **Users Can't Sign In**
   - Check that the correct auth methods are enabled
   - Verify authorized domains include your deployment URL
   - Check browser console for CORS errors

2. **File Upload Failures**
   - Verify storage rules allow writes
   - Check user authentication status
   - Check storage quota

### Firebase Error Codes

Common Firebase error codes and solutions:

- `auth/invalid-email`: The email is improperly formatted
- `auth/user-disabled`: The user account has been disabled
- `auth/user-not-found`: No user with the given email
- `auth/wrong-password`: The password is incorrect
- `storage/unauthorized`: User doesn't have permission to access the storage bucket