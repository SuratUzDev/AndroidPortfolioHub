/**
 * Utility functions for handling images
 */

/**
 * Returns a function that handles image loading errors by setting a placeholder
 * @param {React.SyntheticEvent<HTMLImageElement, Event>} event - The error event
 */
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement, Event>) {
  const imgElement = event.currentTarget;
  imgElement.src = '/api/uploads/placeholder.png';
  imgElement.onerror = null; // Prevent infinite loop if placeholder also fails
}

/**
 * Safely adds image loading error handling to an image URL
 * If the URL is already in the local uploads folder, returns it as is
 * If it's an external URL, keeps it but prepares for fallback on error
 */
export function getImageUrl(url: string | null | undefined): string {
  if (!url) {
    return '/api/uploads/placeholder.png';
  }
  
  // If it's already a local URL, return it as is
  if (url.startsWith('/api/uploads/')) {
    return url;
  }
  
  // Return the original URL - onError handler will set the placeholder if it fails
  return url;
}