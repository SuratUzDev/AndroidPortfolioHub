import { apiRequest } from "@/lib/queryClient";

/**
 * Uploads a single file to the server
 * @param file The file to upload
 * @param path The path where the file should be stored (e.g., 'profile/avatar', 'apps/screenshot')
 * @returns A promise that resolves to the URL of the uploaded file
 */
export async function uploadFile(file: File, path: string): Promise<string> {
  try {
    console.log("Starting upload for file:", file.name, "to path:", path);
    
    // Extract category from path (e.g., 'profile' from 'profile/avatar')
    const category = path.split('/')[0];
    
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);
    
    // Make the upload request
    const response = await fetch(`/api/upload/${category}`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Upload failed');
    }
    
    const data = await response.json();
    console.log("Upload successful, URL:", data.url);
    
    return data.url;
  } catch (error) {
    console.error("Error starting upload:", error);
    throw error;
  }
}

/**
 * Uploads multiple files to the server
 * @param files Array of files to upload
 * @param path The path where the files should be stored (e.g., 'blog/images', 'apps/screenshots')
 * @returns A promise that resolves to an array of URLs of the uploaded files
 */
export async function uploadMultipleFiles(files: File[], path: string): Promise<string[]> {
  try {
    console.log(`Starting upload for ${files.length} files to path:`, path);
    
    // Extract category from path (e.g., 'blog' from 'blog/images')
    const category = path.split('/')[0];
    
    // Create a FormData object to send the files
    const formData = new FormData();
    
    // Append each file to the form data
    files.forEach((file, index) => {
      formData.append('files', file);
    });
    
    formData.append('path', path);
    
    // Make the upload request
    const response = await fetch(`/api/upload/${category}/multiple`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Multiple files upload failed');
    }
    
    const data = await response.json();
    console.log("Multiple files upload successful, URLs:", data.urls);
    
    return data.urls;
  } catch (error) {
    console.error("Error uploading multiple files:", error);
    throw error;
  }
}