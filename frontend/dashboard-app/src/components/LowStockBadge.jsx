import React from 'react';

export default function LowStockBadge({ quantity, reorderLevel }) {
  if (quantity <= reorderLevel) {
    return (
      <span className="inline-block text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">
        Low Stock
      </span>
    );
  }
  return null;
}
