/**
 * API Service Module
 * 
 * This module provides a comprehensive set of functions for interacting with the backend API.
 * Each function handles a specific API endpoint and performs proper error handling.
 * The module is organized by resource type (apps, blog posts, etc.)
 */

import { apiRequest } from "@/lib/queryClient";
import { App, BlogPost, GithubRepo, CodeSample, Profile, ContactMessage, Comment } from "@shared/schema";

/**
 * App-related API functions
 */

/**
 * Retrieves all apps from the server
 * 
 * @returns {Promise<App[]>} A promise that resolves to an array of App objects
 * @example
 * const apps = await getApps();
 * // Use apps data in component state
 * setApps(apps);
 */
export const getApps = async (): Promise<App[]> => {
  return apiRequest<App[]>('/api/apps');
};

/**
 * Retrieves a specific app by its ID
 * 
 * @param {number} id - The ID of the app to retrieve
 * @returns {Promise<App|null>} A promise that resolves to the App object if found, or null if not found
 * @throws Will throw an error for network issues or server errors (except 404)
 * @example
 * const app = await getApp(5);
 * if (app) {
 *   // App found
 *   displayApp(app);
 * } else {
 *   // App not found
 *   showNotFoundMessage();
 * }
 */
export const getApp = async (id: number): Promise<App | null> => {
  try {
    return await apiRequest<App>(`/api/apps/${id}`);
  } catch (error) {
    if ((error as any).status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * Creates a new app on the server
 * 
 * @param {Omit<App, "id">} app - The app data to create (without an ID, which will be assigned by the server)
 * @returns {Promise<App>} A promise that resolves to the created App object with its assigned ID
 * @throws Will throw an error if the server rejects the request
 * @example
 * const newApp = await createApp({
 *   title: "My App",
 *   description: "An amazing app",
 *   iconUrl: "/uploads/apps/icon.png",
 *   // other required fields...
 * });
 */
export const createApp = async (app: Omit<App, "id">): Promise<App> => {
  return apiRequest<App>('/api/apps', {
    method: 'POST',
    body: JSON.stringify(app),
  });
};

/**
 * Updates an existing app with new data
 * 
 * @param {number} id - The ID of the app to update
 * @param {Partial<App>} app - The app data to update (only fields that need to be changed)
 * @returns {Promise<App>} A promise that resolves to the updated App object
 * @throws Will throw an error if the server rejects the request
 * @example
 * const updatedApp = await updateApp(5, {
 *   title: "Updated App Title",
 *   downloads: 1500
 * });
 */
export const updateApp = async (id: number, app: Partial<App>): Promise<App> => {
  return apiRequest<App>(`/api/apps/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(app),
  });
};

/**
 * Deletes an app from the server
 * 
 * @param {number} id - The ID of the app to delete
 * @returns {Promise<void>} A promise that resolves when the deletion is complete
 * @throws Will throw an error if the server rejects the request
 * @example
 * try {
 *   await deleteApp(5);
 *   // Handle successful deletion
 *   removeAppFromUI(5);
 * } catch (error) {
 *   // Handle deletion error
 *   showErrorMessage("Could not delete app");
 * }
 */
export const deleteApp = async (id: number): Promise<void> => {
  return apiRequest<void>(`/api/apps/${id}`, {
    method: 'DELETE',
  });
};

/**
 * GitHub Repository API functions
 */

/**
 * Retrieves all GitHub repositories from the server
 * 
 * @returns {Promise<GithubRepo[]>} A promise that resolves to an array of GithubRepo objects
 * @example
 * const repos = await getGithubRepos();
 * setRepos(repos);
 */
export const getGithubRepos = async (): Promise<GithubRepo[]> => {
  return apiRequest<GithubRepo[]>('/api/github-repos');
};

/**
 * Retrieves a specific GitHub repository by its ID
 * 
 * @param {number} id - The ID of the repository to retrieve
 * @returns {Promise<GithubRepo|null>} A promise that resolves to the GithubRepo object if found, or null if not found
 * @throws Will throw an error for network issues or server errors (except 404)
 * @example
 * const repo = await getGithubRepo(3);
 * if (repo) {
 *   showRepoDetails(repo);
 * }
 */
export const getGithubRepo = async (id: number): Promise<GithubRepo | null> => {
  try {
    return await apiRequest<GithubRepo>(`/api/github-repos/${id}`);
  } catch (error) {
    if ((error as any).status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * Creates a new GitHub repository entry on the server
 * 
 * @param {Omit<GithubRepo, "id">} repo - The repository data to create (without an ID)
 * @returns {Promise<GithubRepo>} A promise that resolves to the created GithubRepo object with its assigned ID
 * @throws Will throw an error if the server rejects the request
 * @example
 * const newRepo = await createGithubRepo({
 *   name: "my-awesome-project",
 *   description: "A cool project with many features",
 *   url: "https://github.com/username/my-awesome-project",
 *   // other required fields...
 * });
 */
export const createGithubRepo = async (repo: Omit<GithubRepo, "id">): Promise<GithubRepo> => {
  return apiRequest<GithubRepo>('/api/github-repos', {
    method: 'POST',
    body: JSON.stringify(repo),
  });
};

/**
 * Blog Post API functions
 */

/**
 * Retrieves all blog posts from the server
 * 
 * @returns {Promise<BlogPost[]>} A promise that resolves to an array of BlogPost objects
 * @example
 * const posts = await getBlogPosts();
 * setPosts(posts);
 */
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  return apiRequest<BlogPost[]>('/api/blog');
};

/**
 * Retrieves a specific blog post by its slug
 * 
 * @param {string} slug - The slug of the blog post to retrieve
 * @returns {Promise<BlogPost|null>} A promise that resolves to the BlogPost object if found, or null if not found
 * @throws Will throw an error for network issues or server errors (except 404)
 * @example
 * const post = await getBlogPostBySlug("introduction-to-android-development");
 * if (post) {
 *   displayBlogPost(post);
 * } else {
 *   showNotFoundPage();
 * }
 */
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    return await apiRequest<BlogPost>(`/api/blog/${slug}`);
  } catch (error) {
    if ((error as any).status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * Retrieves the featured blog post from the server
 * 
 * @returns {Promise<BlogPost|null>} A promise that resolves to the featured BlogPost or null if none is set
 * @throws Will throw an error for network issues or server errors (except 404)
 * @example
 * const featuredPost = await getFeaturedBlogPost();
 * if (featuredPost) {
 *   displayFeaturedPost(featuredPost);
 * }
 */
export const getFeaturedBlogPost = async (): Promise<BlogPost | null> => {
  try {
    return await apiRequest<BlogPost>('/api/blog/featured');
  } catch (error) {
    if ((error as any).status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * Creates a new blog post on the server
 * 
 * @param {Omit<BlogPost, "id">} post - The blog post data to create (without an ID)
 * @returns {Promise<BlogPost>} A promise that resolves to the created BlogPost object with its assigned ID
 * @throws Will throw an error if the server rejects the request
 * @example
 * const newPost = await createBlogPost({
 *   title: "Introduction to Android Development",
 *   slug: "introduction-to-android-development",
 *   content: "# Introduction\n\nThis is a guide to Android development...",
 *   // other required fields...
 * });
 */
export const createBlogPost = async (post: Omit<BlogPost, "id">): Promise<BlogPost> => {
  return apiRequest<BlogPost>('/api/blog', {
    method: 'POST',
    body: JSON.stringify(post),
  });
};

/**
 * Code Sample API functions 
 */

/**
 * Retrieves all code samples from the server
 * 
 * @returns {Promise<CodeSample[]>} A promise that resolves to an array of CodeSample objects
 * @example
 * const samples = await getCodeSamples();
 * setSamples(samples);
 */
export const getCodeSamples = async (): Promise<CodeSample[]> => {
  return apiRequest<CodeSample[]>('/api/code-samples');
};

/**
 * Retrieves a specific code sample by its ID
 * 
 * @param {number} id - The ID of the code sample to retrieve
 * @returns {Promise<CodeSample|null>} A promise that resolves to the CodeSample object if found, or null if not found
 * @throws Will throw an error for network issues or server errors (except 404)
 * @example
 * const sample = await getCodeSample(2);
 * if (sample) {
 *   displayCodeSample(sample);
 * }
 */
export const getCodeSample = async (id: number): Promise<CodeSample | null> => {
  try {
    return await apiRequest<CodeSample>(`/api/code-samples/${id}`);
  } catch (error) {
    if ((error as any).status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * Creates a new code sample on the server
 * 
 * @param {Omit<CodeSample, "id">} sample - The code sample data to create (without an ID)
 * @returns {Promise<CodeSample>} A promise that resolves to the created CodeSample object with its assigned ID
 * @throws Will throw an error if the server rejects the request
 * @example
 * const newSample = await createCodeSample({
 *   title: "Kotlin Flow Example",
 *   language: "kotlin",
 *   code: "fun main() {\n    // Example code\n}",
 *   // other required fields...
 * });
 */
export const createCodeSample = async (sample: Omit<CodeSample, "id">): Promise<CodeSample> => {
  return apiRequest<CodeSample>('/api/code-samples', {
    method: 'POST',
    body: JSON.stringify(sample),
  });
};

/**
 * Profile API functions
 */

/**
 * Retrieves the developer profile from the server
 * 
 * @returns {Promise<Profile|null>} A promise that resolves to the Profile object if found, or null if not found
 * @throws Will throw an error for network issues or server errors (except 404)
 * @example
 * const profile = await getProfile();
 * if (profile) {
 *   updateProfileUI(profile);
 * }
 */
export const getProfile = async (): Promise<Profile | null> => {
  try {
    return await apiRequest<Profile>('/api/profile');
  } catch (error) {
    if ((error as any).status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * Updates the developer profile on the server
 * 
 * @param {Profile} profile - The complete profile data to update
 * @returns {Promise<Profile>} A promise that resolves to the updated Profile object
 * @throws Will throw an error if the server rejects the request
 * @example
 * const updatedProfile = await updateProfile({
 *   id: "1",
 *   name: "Sulton UzDev",
 *   title: "Android Developer",
 *   // other required fields...
 * });
 */
export const updateProfile = async (profile: Profile): Promise<Profile> => {
  return apiRequest<Profile>('/api/profile', {
    method: 'POST',
    body: JSON.stringify(profile),
  });
};

/**
 * Comment API functions
 */

/**
 * Retrieves all comments for a specific blog post
 * 
 * @param {number} blogPostId - The ID of the blog post to get comments for
 * @returns {Promise<Comment[]>} A promise that resolves to an array of Comment objects
 * @example
 * const comments = await getCommentsByBlogPostId(5);
 * setComments(comments);
 */
export const getCommentsByBlogPostId = async (blogPostId: number): Promise<Comment[]> => {
  return apiRequest<Comment[]>(`/api/blog/${blogPostId}/comments`);
};

/**
 * Creates a new comment on a blog post
 * 
 * @param {Omit<Comment, "id" | "createdAt" | "approved">} comment - The comment data to create
 * @returns {Promise<Comment>} A promise that resolves to the created Comment object
 * @throws Will throw an error if the server rejects the request
 * @example
 * const newComment = await createComment({
 *   blogPostId: 5,
 *   name: "John Doe",
 *   email: "john@example.com",
 *   content: "Great article! Very informative."
 * });
 */
export const createComment = async (comment: Omit<Comment, "id" | "createdAt" | "approved">): Promise<Comment> => {
  return apiRequest<Comment>(`/api/blog/${comment.blogPostId}/comments`, {
    method: 'POST',
    body: JSON.stringify(comment),
  });
};

/**
 * Admin function to approve a comment
 * 
 * @param {number} commentId - The ID of the comment to approve
 * @returns {Promise<Comment>} A promise that resolves to the approved Comment object
 * @throws Will throw an error if the server rejects the request
 * @example
 * const approvedComment = await approveComment(12);
 * updateCommentInUI(approvedComment);
 */
export const approveComment = async (commentId: number): Promise<Comment> => {
  return apiRequest<Comment>(`/api/admin/comments/${commentId}/approve`, {
    method: 'POST',
  });
};

/**
 * Admin function to delete a comment
 * 
 * @param {number} commentId - The ID of the comment to delete
 * @returns {Promise<void>} A promise that resolves when the deletion is complete
 * @throws Will throw an error if the server rejects the request
 * @example
 * await deleteComment(12);
 * removeCommentFromUI(12);
 */
export const deleteComment = async (commentId: number): Promise<void> => {
  return apiRequest<void>(`/api/admin/comments/${commentId}`, {
    method: 'DELETE',
  });
};

/**
 * Contact form API functions
 */

/**
 * Submits a contact form message to the server
 * 
 * @param {ContactMessage} message - The contact message data to submit
 * @returns {Promise<{id: number}>} A promise that resolves to an object containing the assigned message ID
 * @throws Will throw an error if the server rejects the request
 * @example
 * const result = await submitContactForm({
 *   name: "Jane Smith",
 *   email: "jane@example.com",
 *   subject: "Project Inquiry",
 *   message: "I'd like to discuss a potential project..."
 * });
 * showConfirmation(`Message submitted with ID: ${result.id}`);
 */
export const submitContactForm = async (message: ContactMessage): Promise<{ id: number }> => {
  return apiRequest<{ id: number }>('/api/contact', {
    method: 'POST',
    body: JSON.stringify(message),
  });
};