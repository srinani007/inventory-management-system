import React from 'react';
import { Link } from 'react-router-dom';

export default function InventoryTable({ items }) {
  return (
    <table className="min-w-full bg-white border">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-4 py-2">SKU</th>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Available</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.id} className="border-t">
            <td className="px-4 py-2">
              <Link to={`/inventory/${item.id}`} className="text-blue-500 hover:underline">
                {item.skuCode}
              </Link>
            </td>
            <td className="px-4 py-2">{item.name}</td>
            <td className="px-4 py-2">{item.quantityAvailable}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
