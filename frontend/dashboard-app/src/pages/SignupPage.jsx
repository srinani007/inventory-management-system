import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

export default function SignupPage() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    role: 'ROLE_WAREHOUSE_STAFF', // default role
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/signup', form);
      toast.success('Signup successful! You can now login.');
      navigate('/login');
    } catch (err) {
        if (err.response?.status === 409) {
          toast.error('Username already exists. Try a different one!');
        } else {
          toast.error('Signup failed. Please try again.');
        }
      } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <div className="card">
        <div className="card2">
        <form onSubmit={handleSubmit} className="form">
        <p id="heading"> Sign Up</p>
         <div className="field">
            <svg viewBox="0 0 16 16" fill="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg" className="input-icon">
              <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"></path>
            </svg>
            <input
                type="text"
                name="username"
                className="input-field"
                placeholder="Username"
                autoComplete="off"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>
          <div className="field">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              height="16"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
              className="input-icon"
            >
              <path d="M20 4H4C2.897 4 2 4.897 2 6v12c0 1.103 0.897 2 2 2h16c1.103 0 2-0.897 2-2V6c0-1.103-0.897-2-2-2zm0 2v.511l-8 5.016-8-5.016V6h16zM4 18V8.489l7.386 4.623a1 1 0 0 0 1.228 0L20 8.489V18H4z" />
            </svg>
            <input
              type="email"
              name="email"
              className="input-field"
              placeholder="Email"
              autoComplete="off"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field">
            <svg viewBox="0 0 16 16" fill="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg" className="input-icon">
              <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
            </svg>
            <input
              type="password"
              name="password"
              className="input-field"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              height="16"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
              className="input-icon"
            >
              <path d="M12 2C6.486 2 2 6.486 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.988h-2.54v-2.89h2.54V9.845c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.47h-1.261c-1.243 0-1.63.771-1.63 1.562v1.876h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.514-4.486-10-10-10z" />
            </svg>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="input-field bg-white"
            >
              <option value="ROLE_WAREHOUSE_STAFF">Warehouse Staff</option>
              <option value="ROLE_MANAGER">Manager</option>
              <option value="ROLE_ADMIN">Admin</option>
            </select>
          </div>
           <button
             type="submit"
             disabled={loading}
             className={`input-field bg-purple-600 text-white font-semibold hover:bg-purple-700 transition ${
               loading ? 'opacity-50 cursor-not-allowed' : ''
             }`}
           >
             {loading ? 'Signing up...' : 'Sign Up'}
           </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-500">Already have an account? </p>
          <button
            type="button"
            className="button2"
            onClick={() => navigate('/login')}
            >
            Login
            </button>
         </div>
        </div>
      </div>
    </div>
  );
}
