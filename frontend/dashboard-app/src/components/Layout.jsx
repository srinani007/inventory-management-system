import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
      <Header />
      {/* Main Content */}
      <main className="flex-1 px-4 py-6 w-full max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow p-6">
            <Outlet />
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-white text-center py-4 shadow-inner text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} SynexiAI. All rights reserved.
      </footer>
    </div>
  );
}
