/**
 * Utility functions for handling images
 * This module provides a set of functions to handle image loading, error handling,
 * and placeholder image management throughout the application.
 */

/**
 * Predefined URLs for placeholder images categorized by content type.
 * These SVG-based placeholders ensure consistent and reliable fallback images
 * in case the original images fail to load.
 * 
 * @constant {Object} PLACEHOLDER_URLS
 * @property {string} default - General placeholder for miscellaneous content
 * @property {string} apps - Placeholder specifically styled for app content
 * @property {string} blog - Placeholder specifically styled for blog content
 * @property {string} profile - Placeholder specifically styled for profile images
 */
/**
 * URLs to SVG placeholder images for different content categories
 * Each category has its own visually distinct placeholder with unique colors and designs
 * to make it immediately obvious what type of content is missing its image
 */
const PLACEHOLDER_URLS = {
  default: '/api/uploads/better-placeholder.svg',
  apps: '/api/uploads/apps/category-placeholder.svg',
  blog: '/api/uploads/blog/category-placeholder.svg',
  profile: '/api/uploads/profile/category-placeholder.svg',
  general: '/api/uploads/general/category-placeholder.svg'
};

/**
 * Type definition for content categories used in the application
 * This allows for type checking and autocompletion when specifying image categories
 */
export type ImageCategory = 'apps' | 'blog' | 'profile' | 'general';

/**
 * Handles image loading errors by setting an appropriate placeholder image.
 * This function should be used in the onError event of image elements.
 * It applies a cascading fallback mechanism: first trying category-specific 
 * placeholders, then a general placeholder, and finally a basic API placeholder.
 * 
 * @param {React.SyntheticEvent<HTMLImageElement, Event>} event - The error event from the image
 * @param {ImageCategory} [category] - Optional category to determine which placeholder to use
 * @returns {void} - This function does not return a value but modifies the image source directly
 * 
 * @example
 * // In a React component:
 * <img 
 *   src={imageUrl} 
 *   alt="Description" 
 *   onError={(e) => handleImageError(e, 'blog')} 
 * />
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>, 
  category?: ImageCategory
): void {
  const imgElement = event.currentTarget;
  
  // Use category-specific placeholder if available
  if (category && PLACEHOLDER_URLS[category]) {
    imgElement.src = PLACEHOLDER_URLS[category];
  } else {
    imgElement.src = PLACEHOLDER_URLS.default;
  }
  
  // Fallback to API endpoint if direct access fails
  imgElement.onerror = () => {
    // If SVG fails, try PNG version
    if (imgElement.src.endsWith('.svg')) {
      const pngUrl = imgElement.src.replace('.svg', '.png');
      imgElement.src = pngUrl;
      
      // Final fallback for catastrophic failures
      imgElement.onerror = () => {
        imgElement.src = '/api/uploads/placeholder.png';
        imgElement.onerror = null; // Prevent infinite loop
      };
    } else {
      imgElement.src = '/api/uploads/placeholder.png';
      imgElement.onerror = null; // Prevent infinite loop
    }
  };
}

/**
 * Processes an image URL and returns either the original URL or an appropriate placeholder.
 * This function enforces the use of placeholders for external URLs to prevent broken images.
 * It's designed to be used when setting image sources in components.
 * 
 * @param {string|null|undefined} url - The original image URL to process
 * @param {ImageCategory} [category] - Optional category to determine which placeholder to use
 * @returns {string} - Either the original URL (if it's a valid local URL) or an appropriate placeholder URL
 * 
 * @example
 * // In a React component:
 * <img 
 *   src={getImageUrl(post.coverImageUrl, 'blog')} 
 *   alt={post.title} 
 * />
 */
export function getImageUrl(url: string | null | undefined, category?: ImageCategory): string {
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
  // Using SVG placeholders by default as they scale better and are more visible
  return category ? PLACEHOLDER_URLS[category] : PLACEHOLDER_URLS.default;
}