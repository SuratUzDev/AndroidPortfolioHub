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
import { App, BlogPost, GithubRepo, CodeSample } from "@shared/schema";

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
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file);
  
  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Track progress if needed
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        // Handle unsuccessful uploads
        reject(error);
      },
      async () => {
        // Handle successful uploads
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
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
export const getProfile = async (): Promise<any | null> => {
  const profileDoc = doc(db, PROFILE_COLLECTION, "main");
  const profileSnapshot = await getDoc(profileDoc);
  
  if (!profileSnapshot.exists()) {
    return null;
  }
  
  return profileSnapshot.data();
};

export const updateProfile = async (profile: any): Promise<void> => {
  const profileDoc = doc(db, PROFILE_COLLECTION, "main");
  return setDoc(profileDoc, profile, { merge: true });
};