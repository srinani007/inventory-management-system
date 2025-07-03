import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white px-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-lg text-center">
        <div className="flex justify-center mb-4">
          <ShieldAlert size={48} className="text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-red-600 mb-2">403 — Unauthorized</h1>
        <p className="text-gray-600 mb-6">
          Oops! You don't have permission to view this page.
          Please contact your administrator if you believe this is a mistake.
        </p>
        <Link
          to="/dashboard"
          className="inline-block px-5 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
