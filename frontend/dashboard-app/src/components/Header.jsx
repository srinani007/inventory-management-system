// ✅ Updated Header.jsx with role-aware links and logout
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../index.css'; // Ensure global styles are imported
import styles from '../components/SynexiButton.module.css'; // Adjust path if needed


const ROLES = {
  ADMIN: 'ROLE_ADMIN',
  MANAGER: 'ROLE_MANAGER',
  WAREHOUSE_STAFF: 'ROLE_WAREHOUSE_STAFF',
};

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
        <Link to="/" className={styles.synexiButton} data-text="Awesome">
          <span className="actual-text">&nbsp;SynexiAI&nbsp;</span>
          <span aria-hidden="true" className={styles.hoverText}>&nbsp;SynexiAI&nbsp;</span>
        </Link>
          {user && (
            <>
            <button onClick={(dashboard) => navigate('/dashboard')} >Home</button>
              <button onClick={(dashboard) => navigate('/inventory')}   >Inventory</button>
              {user.roles?.some(role => [ROLES.ADMIN, ROLES.MANAGER].includes(role)) && (
                <button onClick={(dashboard) => navigate('/inventory/new')} >+ New Item</button>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">Hi, {user.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
            <button onClick={() => navigate('/login')} className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded">
                Login
            </button>
            <button onClick={() => navigate('/signup')} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                Sign Up
            </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
