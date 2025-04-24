/**
 * This service originally used Firebase Firestore and Storage.
 * It has been refactored to use our PostgreSQL backend API instead.
 * We keep the same interface so components don't need to be changed.
 */
import { auth } from "@/lib/firebase"; // Keep Firebase Auth only
import { App, BlogPost, GithubRepo, CodeSample, Profile } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { uploadFile as uploadFileToServer, uploadMultipleFiles } from "@/services/uploadService";

// Helper function to process date fields in responses
const processDateFields = (data: any): any => {
  if (!data) return data;
  
  if (data.publishedAt && typeof data.publishedAt === 'string') {
    data.publishedAt = new Date(data.publishedAt);
  }
  
  if (data.createdAt && typeof data.createdAt === 'string') {
    data.createdAt = new Date(data.createdAt);
  }
  
  if (data.updatedAt && typeof data.updatedAt === 'string') {
    data.updatedAt = new Date(data.updatedAt);
  }
  
  return data;
};

// Upload a file using our new server upload service
export const uploadFile = async (file: File, path: string): Promise<string> => {
  console.log(`Starting upload for file: ${file.name} to path: ${path}`);
  
  if (!file) {
    console.error("No file provided for upload");
    return Promise.reject(new Error("No file provided for upload"));
  }
  
  try {
    // Extract the category from the path
    const pathParts = path.split('/');
    const category = pathParts[0] || 'general';
    
    // Use the uploadService to upload the file to our server
    const downloadURL = await uploadFileToServer(file, category);
    console.log(`Upload successful. Download URL: ${downloadURL}`);
    return downloadURL;
  } catch (error) {
    console.error("Error starting upload:", error);
    return Promise.reject(error);
  }
};

// Delete a file
export const deleteFile = async (path: string): Promise<void> => {
  try {
    // Call the API to delete a file
    await apiRequest(`/api/upload/delete`, {
      method: 'DELETE',
      body: JSON.stringify({ path }),
    });
    
    console.log(`File deleted: ${path}`);
    return;
  } catch (error) {
    console.error(`Error deleting file: ${path}`, error);
    throw error;
  }
};

// App services
export const getApps = async (): Promise<App[]> => {
  const apps = await apiRequest<App[]>('/api/apps');
  return apps.map(app => processDateFields(app));
};

export const getApp = async (id: string | number): Promise<App | null> => {
  try {
    const app = await apiRequest<App>(`/api/apps/${id}`);
    return processDateFields(app);
  } catch (error) {
    if (error instanceof Response && error.status === 404) {
      return null;
    }
    throw error;
  }
};

export const createApp = async (app: Omit<App, "id">): Promise<App> => {
  const newApp = await apiRequest<App>('/api/apps', {
    method: 'POST',
    body: JSON.stringify(app),
  });
  
  return processDateFields(newApp);
};

export const updateApp = async (id: string | number, app: Partial<App>): Promise<void> => {
  await apiRequest(`/api/apps/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(app),
  });
};

export const deleteApp = async (id: string | number): Promise<void> => {
  await apiRequest(`/api/apps/${id}`, {
    method: 'DELETE',
  });
};

// Blog post services
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const posts = await apiRequest<BlogPost[]>('/api/blog-posts');
  return posts.map(post => processDateFields(post));
};

export const getBlogPost = async (id: string | number): Promise<BlogPost | null> => {
  try {
    const post = await apiRequest<BlogPost>(`/api/blog-posts/${id}`);
    return processDateFields(post);
  } catch (error) {
    if (error instanceof Response && error.status === 404) {
      return null;
    }
    throw error;
  }
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const post = await apiRequest<BlogPost>(`/api/blog-posts/by-slug/${slug}`);
    return processDateFields(post);
  } catch (error) {
    if (error instanceof Response && error.status === 404) {
      return null;
    }
    throw error;
  }
};

export const getFeaturedBlogPost = async (): Promise<BlogPost | null> => {
  try {
    const post = await apiRequest<BlogPost>('/api/blog-posts/featured');
    return processDateFields(post);
  } catch (error) {
    if (error instanceof Response && error.status === 404) {
      return null;
    }
    throw error;
  }
};

export const createBlogPost = async (post: Omit<BlogPost, "id">): Promise<BlogPost> => {
  const newPost = await apiRequest<BlogPost>('/api/blog-posts', {
    method: 'POST',
    body: JSON.stringify(post),
  });
  
  return processDateFields(newPost);
};

export const updateBlogPost = async (id: string | number, post: Partial<BlogPost>): Promise<void> => {
  await apiRequest(`/api/blog-posts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(post),
  });
};

export const deleteBlogPost = async (id: string | number): Promise<void> => {
  await apiRequest(`/api/blog-posts/${id}`, {
    method: 'DELETE',
  });
};

// GitHub repo services
export const getGithubRepos = async (): Promise<GithubRepo[]> => {
  const repos = await apiRequest<GithubRepo[]>('/api/github-repos');
  return repos.map(repo => processDateFields(repo));
};

export const getGithubRepo = async (id: string | number): Promise<GithubRepo | null> => {
  try {
    const repo = await apiRequest<GithubRepo>(`/api/github-repos/${id}`);
    return processDateFields(repo);
  } catch (error) {
    if (error instanceof Response && error.status === 404) {
      return null;
    }
    throw error;
  }
};

export const createGithubRepo = async (repo: Omit<GithubRepo, "id">): Promise<GithubRepo> => {
  const newRepo = await apiRequest<GithubRepo>('/api/github-repos', {
    method: 'POST',
    body: JSON.stringify(repo),
  });
  
  return processDateFields(newRepo);
};

export const updateGithubRepo = async (id: string | number, repo: Partial<GithubRepo>): Promise<void> => {
  await apiRequest(`/api/github-repos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(repo),
  });
};

export const deleteGithubRepo = async (id: string | number): Promise<void> => {
  await apiRequest(`/api/github-repos/${id}`, {
    method: 'DELETE',
  });
};

// Code sample services
export const getCodeSamples = async (): Promise<CodeSample[]> => {
  const samples = await apiRequest<CodeSample[]>('/api/code-samples');
  return samples.map(sample => processDateFields(sample));
};

export const getCodeSample = async (id: string | number): Promise<CodeSample | null> => {
  try {
    const sample = await apiRequest<CodeSample>(`/api/code-samples/${id}`);
    return processDateFields(sample);
  } catch (error) {
    if (error instanceof Response && error.status === 404) {
      return null;
    }
    throw error;
  }
};

export const createCodeSample = async (sample: Omit<CodeSample, "id">): Promise<CodeSample> => {
  const newSample = await apiRequest<CodeSample>('/api/code-samples', {
    method: 'POST',
    body: JSON.stringify(sample),
  });
  
  return processDateFields(newSample);
};

export const updateCodeSample = async (id: string | number, sample: Partial<CodeSample>): Promise<void> => {
  await apiRequest(`/api/code-samples/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(sample),
  });
};

export const deleteCodeSample = async (id: string | number): Promise<void> => {
  await apiRequest(`/api/code-samples/${id}`, {
    method: 'DELETE',
  });
};

// Profile services
export const getProfile = async (): Promise<Profile | null> => {
  try {
    const profile = await apiRequest<Profile>('/api/profile');
    
    // Process date fields in experience and education arrays
    if (profile.experience && Array.isArray(profile.experience)) {
      profile.experience = profile.experience.map(exp => ({
        ...exp,
        // Ensure startDate is always a Date (required by the Profile type)
        startDate: exp.startDate ? new Date(exp.startDate) : new Date(),
        // endDate is optional so can be undefined
        endDate: exp.endDate ? new Date(exp.endDate) : undefined
      }));
    }
    
    if (profile.education && Array.isArray(profile.education)) {
      profile.education = profile.education.map(edu => ({
        ...edu,
        // Ensure graduationDate is always a Date (required by the Profile type)
        graduationDate: edu.graduationDate ? new Date(edu.graduationDate) : new Date()
      }));
    }
    
    return profile;
  } catch (error) {
    if (error instanceof Response && error.status === 404) {
      return null;
    }
    throw error;
  }
};

export const updateProfile = async (profile: Profile): Promise<Profile> => {
  console.log("Updating profile:", profile);
  
  // Deep copy the profile to avoid reference issues and ensure dates are serialized correctly
  const profileCopy = JSON.parse(JSON.stringify(profile));
  
  try {
    // Use our API to update the profile
    const updatedProfile = await apiRequest<Profile>('/api/profile', {
      method: 'POST', // The endpoint uses POST for both create and update
      body: JSON.stringify(profileCopy),
    });
    
    // Process date fields in the response just like in getProfile
    if (updatedProfile.experience && Array.isArray(updatedProfile.experience)) {
      updatedProfile.experience = updatedProfile.experience.map(exp => ({
        ...exp,
        startDate: exp.startDate ? new Date(exp.startDate) : new Date(),
        endDate: exp.endDate ? new Date(exp.endDate) : undefined
      }));
    }
    
    if (updatedProfile.education && Array.isArray(updatedProfile.education)) {
      updatedProfile.education = updatedProfile.education.map(edu => ({
        ...edu,
        graduationDate: edu.graduationDate ? new Date(edu.graduationDate) : new Date()
      }));
    }
    
    console.log("Profile updated successfully!");
    
    // Return the updated profile
    return updatedProfile;
  } catch (error) {
    console.error("Error updating profile:", error);
    return Promise.reject(error);
  }
};