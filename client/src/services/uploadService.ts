/**
 * File upload service
 * Handles local file uploads to the server
 */

/**
 * Upload a single file to the server
 * @param file The file to upload
 * @param category The category folder to store the file in (e.g., 'apps', 'blog-posts')
 * @returns Promise with the URL of the uploaded file
 */
export const uploadFile = async (file: File, category: string): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`/api/upload/${category}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload file');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Upload multiple files to the server
 * @param files Array of files to upload
 * @param category The category folder to store the files in
 * @returns Promise with an array of URLs for the uploaded files
 */
export const uploadMultipleFiles = async (files: File[], category: string): Promise<string[]> => {
  try {
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await fetch(`/api/upload/${category}/multiple`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload files');
    }

    const data = await response.json();
    return data.files.map((fileInfo: any) => fileInfo.url);
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    throw error;
  }
};

/**
 * Delete a file from the server
 * Note: For a real implementation, you would need a server-side endpoint to delete files
 * Current version just logs the request
 */
export const deleteFile = async (fileUrl: string): Promise<void> => {
  // This is a stub - in a real app, you would implement a DELETE request to a server endpoint
  console.log(`Would delete file at: ${fileUrl}`);
  // For now we'll just return successfully
  return Promise.resolve();
};