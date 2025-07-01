import React, { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const token = await api.post('/auth/login', form).then(res => res.data.token);
      // Decode roles from the token (optional) or fetch user info endpoint
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userRoles = payload.roles || [];
      login(token, userRoles);
      navigate('/inventory');
    } catch {
      setError('Login failed');
    }
  }

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h1 className="text-xl mb-4">Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* username & password fields */}
        <div>
          <label htmlFor="username" className="block mb-1">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
