import { apiRequest } from "@/lib/queryClient";
import { App, BlogPost, GithubRepo, CodeSample, Profile, ContactMessage, Comment } from "@shared/schema";

// Get all apps
export const getApps = async (): Promise<App[]> => {
  return apiRequest<App[]>('/api/apps');
};

// Get app by ID
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

// Create a new app
export const createApp = async (app: Omit<App, "id">): Promise<App> => {
  return apiRequest<App>('/api/apps', {
    method: 'POST',
    body: JSON.stringify(app),
  });
};

// Update an app
export const updateApp = async (id: number, app: Partial<App>): Promise<App> => {
  return apiRequest<App>(`/api/apps/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(app),
  });
};

// Delete an app
export const deleteApp = async (id: number): Promise<void> => {
  return apiRequest<void>(`/api/apps/${id}`, {
    method: 'DELETE',
  });
};

// Get all GitHub repos
export const getGithubRepos = async (): Promise<GithubRepo[]> => {
  return apiRequest<GithubRepo[]>('/api/github-repos');
};

// Get GitHub repo by ID
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

// Create a new GitHub repo
export const createGithubRepo = async (repo: Omit<GithubRepo, "id">): Promise<GithubRepo> => {
  return apiRequest<GithubRepo>('/api/github-repos', {
    method: 'POST',
    body: JSON.stringify(repo),
  });
};

// Get all blog posts
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  return apiRequest<BlogPost[]>('/api/blog');
};

// Get blog post by slug
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

// Get featured blog post
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

// Create a new blog post
export const createBlogPost = async (post: Omit<BlogPost, "id">): Promise<BlogPost> => {
  return apiRequest<BlogPost>('/api/blog', {
    method: 'POST',
    body: JSON.stringify(post),
  });
};

// Get all code samples
export const getCodeSamples = async (): Promise<CodeSample[]> => {
  return apiRequest<CodeSample[]>('/api/code-samples');
};

// Get code sample by ID
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

// Create a new code sample
export const createCodeSample = async (sample: Omit<CodeSample, "id">): Promise<CodeSample> => {
  return apiRequest<CodeSample>('/api/code-samples', {
    method: 'POST',
    body: JSON.stringify(sample),
  });
};

// Get profile
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

// Update profile
export const updateProfile = async (profile: Profile): Promise<Profile> => {
  return apiRequest<Profile>('/api/profile', {
    method: 'POST',
    body: JSON.stringify(profile),
  });
};

// Get comments for a blog post
export const getCommentsByBlogPostId = async (blogPostId: number): Promise<Comment[]> => {
  return apiRequest<Comment[]>(`/api/blog/${blogPostId}/comments`);
};

// Submit a comment
export const createComment = async (comment: Omit<Comment, "id" | "createdAt" | "approved">): Promise<Comment> => {
  return apiRequest<Comment>(`/api/blog/${comment.blogPostId}/comments`, {
    method: 'POST',
    body: JSON.stringify(comment),
  });
};

// Admin: Approve a comment
export const approveComment = async (commentId: number): Promise<Comment> => {
  return apiRequest<Comment>(`/api/admin/comments/${commentId}/approve`, {
    method: 'POST',
  });
};

// Admin: Delete a comment
export const deleteComment = async (commentId: number): Promise<void> => {
  return apiRequest<void>(`/api/admin/comments/${commentId}`, {
    method: 'DELETE',
  });
};

// Submit contact form
export const submitContactForm = async (message: ContactMessage): Promise<{ id: number }> => {
  return apiRequest<{ id: number }>('/api/contact', {
    method: 'POST',
    body: JSON.stringify(message),
  });
};