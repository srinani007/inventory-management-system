import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../index.css';
import styles from '../components/SynexiButton.module.css';

const ROLES = {
  ADMIN: 'ROLE_ADMIN',
  MANAGER: 'ROLE_MANAGER',
  WAREHOUSE_STAFF: 'ROLE_WAREHOUSE_STAFF',
};

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Home', roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.WAREHOUSE_STAFF] },
  { path: '/users', label: 'Users', roles: [ROLES.ADMIN] },
  { path: '/inventory', label: 'Inventory', roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.WAREHOUSE_STAFF] },
  { path: '/inventory/new', label: '+ New Item', roles: [ROLES.ADMIN, ROLES.MANAGER] },
  { path: '/inventory/reports', label: 'Reports', roles: [ROLES.ADMIN, ROLES.MANAGER] },
  { path: '/orders/new', label: 'Place Order', roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.WAREHOUSE_STAFF] },
];

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const hasRequiredRole = (requiredRoles) => {
    return user?.roles?.some(role => requiredRoles.includes(role));
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <Link 
            to="/" 
            className={styles.synexiButton} 
            data-text="Awesome"
            aria-label="SynexiAI Home"
          >
            <span className="actual-text">&nbsp;SynexiAI&nbsp;</span>
            <span aria-hidden="true" className={styles.hoverText}>&nbsp;SynexiAI&nbsp;</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-4">
          {user && NAV_ITEMS.map((item) => (
            hasRequiredRole(item.roles) && (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
                aria-label={item.label}
              >
                {item.label}
              </button>
            )
          ))}
        </nav>

        {/* User Controls */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-gray-600">
                Welcome, <span className="font-medium">{user.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => navigate('/login')} 
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-label="Login"
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/signup')} 
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                aria-label="Sign Up"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {user && (
        <div className="md:hidden bg-gray-50 px-4 py-2 flex overflow-x-auto gap-4">
          {NAV_ITEMS.map((item) => (
            hasRequiredRole(item.roles) && (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="whitespace-nowrap text-gray-700 hover:text-indigo-600 px-3 py-1 text-sm font-medium"
                aria-label={item.label}
              >
                {item.label}
              </button>
            )
          ))}
        </div>
      )}
    </header>
  );
}