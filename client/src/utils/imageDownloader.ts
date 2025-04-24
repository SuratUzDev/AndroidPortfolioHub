import { apiRequest } from "@/lib/queryClient";

/**
 * Downloads an image from a URL and saves it to the server's uploads directory
 * 
 * @param imageUrl The URL of the image to download
 * @param folder The folder within uploads directory to save the image (apps, blog, profile, etc.)
 * @returns URL to the locally saved image
 */
export async function downloadAndSaveImage(imageUrl: string, folder: string = 'general'): Promise<string> {
  try {
    if (!imageUrl) return '';
    
    // Skip if already a local URL
    if (imageUrl.startsWith('/api/uploads/') || imageUrl.startsWith('/uploads/')) {
      return imageUrl;
    }
    
    const response = await fetch('/api/uploads/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        imageUrl,
        folder
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.localImageUrl;
  } catch (error) {
    console.error('Error downloading image:', error);
    // Return original URL as fallback
    return imageUrl;
  }
}

/**
 * Downloads multiple images and returns their local URLs
 */
export async function downloadMultipleImages(imageUrls: string[], folder: string = 'general'): Promise<string[]> {
  if (!imageUrls || !imageUrls.length) return [];
  
  const downloadPromises = imageUrls.map(url => downloadAndSaveImage(url, folder));
  return Promise.all(downloadPromises);
}