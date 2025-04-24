/**
 * Utility functions for handling images
 */

// Placeholder image paths - using SVG for better reliability
const PLACEHOLDER_URLS = {
  default: '/api/uploads/better-placeholder.png',
  apps: '/api/uploads/apps/category-placeholder.svg',
  blog: '/api/uploads/blog/category-placeholder.svg',
  profile: '/api/uploads/profile/category-placeholder.svg'
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
 * If it's an external URL, returns the placeholder directly to ensure images are visible
 */
export function getImageUrl(url: string | null | undefined, category?: 'apps' | 'blog' | 'profile'): string {
  // If no URL is provided, return appropriate placeholder
  if (!url) {
    return category ? PLACEHOLDER_URLS[category] : PLACEHOLDER_URLS.default;
  }
  
  // If it's already a local URL and not a placeholder, return it as is
  if ((url.startsWith('/api/uploads/') || url.startsWith('/public/uploads/')) 
       && !url.includes('placeholder')) {
    return url;
  }
  
  // FORCE PLACEHOLDERS - don't even try to load potentially broken images
  return category ? PLACEHOLDER_URLS[category] : PLACEHOLDER_URLS.default;
}