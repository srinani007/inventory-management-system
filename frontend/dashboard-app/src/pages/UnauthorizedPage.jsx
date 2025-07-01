import React from 'react';
import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
  return (
    <div className="p-4 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">403 — Unauthorized</h1>
      <p className="mb-4">You do not have permission to view this page.</p>
      <Link to="/inventory" className="text-blue-600 hover:underline">
        ← Back to Inventory
      </Link>
    </div>
  );
}