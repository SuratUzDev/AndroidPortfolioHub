import { db, storage } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  DocumentData,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { App, BlogPost, GithubRepo, CodeSample, Profile } from "@shared/schema";

// Collection names
const APPS_COLLECTION = "apps";
const BLOG_POSTS_COLLECTION = "blogPosts";
const GITHUB_REPOS_COLLECTION = "githubRepos";
const CODE_SAMPLES_COLLECTION = "codeSamples";
const PROFILE_COLLECTION = "profile";

// Helper function to convert Firestore data to our types
const convertFirestoreData = <T>(
  doc: DocumentData
): T => {
  const data = doc.data();
  // Convert Firestore timestamps to JS Date objects
  const convertedData: any = { ...data, id: doc.id };
  
  if (data.publishedAt && data.publishedAt instanceof Timestamp) {
    convertedData.publishedAt = data.publishedAt.toDate();
  }
  if (data.createdAt && data.createdAt instanceof Timestamp) {
    convertedData.createdAt = data.createdAt.toDate();
  }
  if (data.updatedAt && data.updatedAt instanceof Timestamp) {
    convertedData.updatedAt = data.updatedAt.toDate();
  }
  
  return convertedData as T;
};

// Upload a file to Firebase Storage
export const uploadFile = async (file: File, path: string): Promise<string> => {
  console.log(`Starting upload for file: ${file.name} to path: ${path}`);
  
  if (!file) {
    console.error("No file provided for upload");
    return Promise.reject(new Error("No file provided for upload"));
  }
  
  try {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Track progress if needed
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress.toFixed(2)}% done`);
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error("Upload failed:", error);
          reject(error);
        },
        async () => {
          try {
            // Handle successful uploads
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log(`Upload successful. Download URL: ${downloadURL}`);
            resolve(downloadURL);
          } catch (err) {
            console.error("Failed to get download URL:", err);
            reject(err);
          }
        }
      );
    });
  } catch (error) {
    console.error("Error starting upload:", error);
    return Promise.reject(error);
  }
};

// Delete a file from Firebase Storage
export const deleteFile = async (path: string): Promise<void> => {
  const storageRef = ref(storage, path);
  return deleteObject(storageRef);
};

// App services
export const getApps = async (): Promise<App[]> => {
  const appsCollection = collection(db, APPS_COLLECTION);
  const appsSnapshot = await getDocs(appsCollection);
  return appsSnapshot.docs.map((doc) => convertFirestoreData<App>(doc));
};

export const getApp = async (id: string): Promise<App | null> => {
  const appDoc = doc(db, APPS_COLLECTION, id);
  const appSnapshot = await getDoc(appDoc);
  
  if (!appSnapshot.exists()) {
    return null;
  }
  
  return convertFirestoreData<App>(appSnapshot);
};

export const createApp = async (app: Omit<App, "id">): Promise<App> => {
  const appsCollection = collection(db, APPS_COLLECTION);
  const newAppRef = doc(appsCollection);
  await setDoc(newAppRef, app);
  
  const newAppSnapshot = await getDoc(newAppRef);
  return convertFirestoreData<App>(newAppSnapshot);
};

export const updateApp = async (id: string, app: Partial<App>): Promise<void> => {
  const appDoc = doc(db, APPS_COLLECTION, id);
  return updateDoc(appDoc, app);
};

export const deleteApp = async (id: string): Promise<void> => {
  const appDoc = doc(db, APPS_COLLECTION, id);
  return deleteDoc(appDoc);
};

// Blog post services
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const blogCollection = collection(db, BLOG_POSTS_COLLECTION);
  const blogQuery = query(blogCollection, orderBy("publishedAt", "desc"));
  const blogSnapshot = await getDocs(blogQuery);
  return blogSnapshot.docs.map((doc) => convertFirestoreData<BlogPost>(doc));
};

export const getBlogPost = async (id: string): Promise<BlogPost | null> => {
  const blogDoc = doc(db, BLOG_POSTS_COLLECTION, id);
  const blogSnapshot = await getDoc(blogDoc);
  
  if (!blogSnapshot.exists()) {
    return null;
  }
  
  return convertFirestoreData<BlogPost>(blogSnapshot);
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const blogCollection = collection(db, BLOG_POSTS_COLLECTION);
  const blogQuery = query(blogCollection, where("slug", "==", slug));
  const blogSnapshot = await getDocs(blogQuery);
  
  if (blogSnapshot.empty) {
    return null;
  }
  
  return convertFirestoreData<BlogPost>(blogSnapshot.docs[0]);
};

export const getFeaturedBlogPost = async (): Promise<BlogPost | null> => {
  const blogCollection = collection(db, BLOG_POSTS_COLLECTION);
  const blogQuery = query(blogCollection, where("isFeatured", "==", true));
  const blogSnapshot = await getDocs(blogQuery);
  
  if (blogSnapshot.empty) {
    return null;
  }
  
  return convertFirestoreData<BlogPost>(blogSnapshot.docs[0]);
};

export const createBlogPost = async (post: Omit<BlogPost, "id">): Promise<BlogPost> => {
  const blogCollection = collection(db, BLOG_POSTS_COLLECTION);
  const newPostRef = doc(blogCollection);
  await setDoc(newPostRef, post);
  
  const newPostSnapshot = await getDoc(newPostRef);
  return convertFirestoreData<BlogPost>(newPostSnapshot);
};

export const updateBlogPost = async (id: string, post: Partial<BlogPost>): Promise<void> => {
  const postDoc = doc(db, BLOG_POSTS_COLLECTION, id);
  return updateDoc(postDoc, post);
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  const postDoc = doc(db, BLOG_POSTS_COLLECTION, id);
  return deleteDoc(postDoc);
};

// GitHub repo services
export const getGithubRepos = async (): Promise<GithubRepo[]> => {
  const reposCollection = collection(db, GITHUB_REPOS_COLLECTION);
  const reposSnapshot = await getDocs(reposCollection);
  return reposSnapshot.docs.map((doc) => convertFirestoreData<GithubRepo>(doc));
};

export const getGithubRepo = async (id: string): Promise<GithubRepo | null> => {
  const repoDoc = doc(db, GITHUB_REPOS_COLLECTION, id);
  const repoSnapshot = await getDoc(repoDoc);
  
  if (!repoSnapshot.exists()) {
    return null;
  }
  
  return convertFirestoreData<GithubRepo>(repoSnapshot);
};

export const createGithubRepo = async (repo: Omit<GithubRepo, "id">): Promise<GithubRepo> => {
  const reposCollection = collection(db, GITHUB_REPOS_COLLECTION);
  const newRepoRef = doc(reposCollection);
  await setDoc(newRepoRef, repo);
  
  const newRepoSnapshot = await getDoc(newRepoRef);
  return convertFirestoreData<GithubRepo>(newRepoSnapshot);
};

export const updateGithubRepo = async (id: string, repo: Partial<GithubRepo>): Promise<void> => {
  const repoDoc = doc(db, GITHUB_REPOS_COLLECTION, id);
  return updateDoc(repoDoc, repo);
};

export const deleteGithubRepo = async (id: string): Promise<void> => {
  const repoDoc = doc(db, GITHUB_REPOS_COLLECTION, id);
  return deleteDoc(repoDoc);
};

// Code sample services
export const getCodeSamples = async (): Promise<CodeSample[]> => {
  const samplesCollection = collection(db, CODE_SAMPLES_COLLECTION);
  const samplesSnapshot = await getDocs(samplesCollection);
  return samplesSnapshot.docs.map((doc) => convertFirestoreData<CodeSample>(doc));
};

export const getCodeSample = async (id: string): Promise<CodeSample | null> => {
  const sampleDoc = doc(db, CODE_SAMPLES_COLLECTION, id);
  const sampleSnapshot = await getDoc(sampleDoc);
  
  if (!sampleSnapshot.exists()) {
    return null;
  }
  
  return convertFirestoreData<CodeSample>(sampleSnapshot);
};

export const createCodeSample = async (sample: Omit<CodeSample, "id">): Promise<CodeSample> => {
  const samplesCollection = collection(db, CODE_SAMPLES_COLLECTION);
  const newSampleRef = doc(samplesCollection);
  await setDoc(newSampleRef, sample);
  
  const newSampleSnapshot = await getDoc(newSampleRef);
  return convertFirestoreData<CodeSample>(newSampleSnapshot);
};

export const updateCodeSample = async (id: string, sample: Partial<CodeSample>): Promise<void> => {
  const sampleDoc = doc(db, CODE_SAMPLES_COLLECTION, id);
  return updateDoc(sampleDoc, sample);
};

export const deleteCodeSample = async (id: string): Promise<void> => {
  const sampleDoc = doc(db, CODE_SAMPLES_COLLECTION, id);
  return deleteDoc(sampleDoc);
};

// Profile services
export const getProfile = async (): Promise<Profile | null> => {
  const profileDoc = doc(db, PROFILE_COLLECTION, "main");
  const profileSnapshot = await getDoc(profileDoc);
  
  if (!profileSnapshot.exists()) {
    return null;
  }
  
  const profileData = profileSnapshot.data();
  
  // Convert Firestore timestamps back to Date objects
  if (profileData) {
    // Convert experience dates
    if (profileData.experience && Array.isArray(profileData.experience)) {
      profileData.experience = profileData.experience.map(exp => ({
        ...exp,
        startDate: exp.startDate && exp.startDate.toDate ? exp.startDate.toDate() : exp.startDate,
        endDate: exp.endDate && exp.endDate.toDate ? exp.endDate.toDate() : exp.endDate
      }));
    }
    
    // Convert education dates
    if (profileData.education && Array.isArray(profileData.education)) {
      profileData.education = profileData.education.map(edu => ({
        ...edu,
        graduationDate: edu.graduationDate && edu.graduationDate.toDate ? edu.graduationDate.toDate() : edu.graduationDate
      }));
    }
  }
  
  return profileData as Profile;
};

export const updateProfile = async (profile: Profile): Promise<void> => {
  console.log("Updating profile in Firebase:", profile);
  const profileDoc = doc(db, PROFILE_COLLECTION, "main");
  
  // Ensure the profile object is clean and all date fields are properly converted
  // Convert Date objects to Firestore timestamps for proper storage
  const processedProfile = {
    ...profile,
    experience: profile.experience.map(exp => ({
      ...exp,
      startDate: exp.startDate instanceof Date ? Timestamp.fromDate(exp.startDate) : 
                (exp.startDate ? Timestamp.fromDate(new Date(exp.startDate)) : Timestamp.fromDate(new Date())),
      endDate: exp.endDate instanceof Date ? Timestamp.fromDate(exp.endDate) : 
              (exp.endDate ? Timestamp.fromDate(new Date(exp.endDate)) : null)
    })),
    education: profile.education.map(edu => ({
      ...edu,
      graduationDate: edu.graduationDate instanceof Date ? Timestamp.fromDate(edu.graduationDate) : 
                      (edu.graduationDate ? Timestamp.fromDate(new Date(edu.graduationDate)) : Timestamp.fromDate(new Date()))
    }))
  };
  
  console.log("Processed profile for Firebase:", processedProfile);
  
  try {
    await setDoc(profileDoc, processedProfile);
    console.log("Profile updated successfully!");
    return Promise.resolve();
  } catch (error) {
    console.error("Error updating profile:", error);
    return Promise.reject(error);
  }
};