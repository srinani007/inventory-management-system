import React from 'react';
// src/lib/utils.js
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Export as default as well for compatibility
export default { cn };