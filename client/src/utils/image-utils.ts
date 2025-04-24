/**
 * Utility functions for handling images
 */

// Placeholder image paths
const PLACEHOLDER_URLS = {
  default: '/public/uploads/better-placeholder.png',
  apps: '/public/uploads/apps/category-placeholder.png',
  blog: '/public/uploads/blog/category-placeholder.png',
  profile: '/public/uploads/profile/category-placeholder.png'
};

/**
 * Returns a function that handles image loading errors by setting a placeholder
 * @param {React.SyntheticEvent<HTMLImageElement, Event>} event - The error event
 * @param {string} category - Optional category for specific placeholder
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>, 
  category?: 'apps' | 'blog' | 'profile'
) {
  const imgElement = event.currentTarget;
  
  // Use category-specific placeholder if available
  if (category && PLACEHOLDER_URLS[category]) {
    imgElement.src = PLACEHOLDER_URLS[category];
  } else {
    imgElement.src = PLACEHOLDER_URLS.default;
  }
  
  // Fallback to API endpoint if direct access fails
  imgElement.onerror = () => {
    imgElement.src = '/api/uploads/placeholder.png';
    imgElement.onerror = null; // Prevent infinite loop
  };
}

/**
 * Safely adds image loading error handling to an image URL
 * If the URL is already in the local uploads folder, returns it as is
 * If it's an external URL, keeps it but prepares for fallback on error
 */
export function getImageUrl(url: string | null | undefined, category?: 'apps' | 'blog' | 'profile'): string {
  // If no URL is provided, return appropriate placeholder
  if (!url) {
    return category ? PLACEHOLDER_URLS[category] : PLACEHOLDER_URLS.default;
  }
  
  // If it's already a local URL, return it as is
  if (url.startsWith('/api/uploads/') || url.startsWith('/public/uploads/')) {
    return url;
  }
  
  // Return the original URL - onError handler will set the placeholder if it fails
  return url;
}