// src/lib/utils.js
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function that combines class names.
 * Filters out falsy values and merges Tailwind classes properly.
 * @param {...string} inputs - Class names to combine
 * @returns {string} - Combined class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Legacy version of cn (simpler version without Tailwind merging)
 * @deprecated Use cn() instead as it handles Tailwind classes better
 */
export const simpleCn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Export as default for compatibility
export default { cn, simpleCn };