/**
 * General utility functions used across the application
 */

/**
 * Formats price for display
 * @param price - Price in dollars
 * @returns Formatted price string (e.g., "$120")
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(0)}`;
}

/**
 * Capitalizes first letter of each word
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Formats tag for display (replaces hyphens with spaces, capitalizes)
 * @param tag - Raw tag string (e.g., "young-vibe")
 * @returns Formatted tag (e.g., "Young Vibe")
 */
export function formatTag(tag: string): string {
  return capitalize(tag.replace(/-/g, ' '));
}

/**
 * Debounces a function call
 * Useful for search inputs to avoid calling API on every keystroke
 * 
 * @param func - Function to debounce
 * @param wait - Milliseconds to wait
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Extracts unique values from array
 * @param arr - Array with potential duplicates
 * @returns Array with unique values only
 */
export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * Truncates text to specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}