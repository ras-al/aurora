// src/pages/AdminLoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; // <--- Import useAuth
import '../styles/AuthForm.css';

function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { adminLogin } = useAuth(); // Use adminLogin from context

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    await adminLogin(username, password); // Call adminLogin from AuthContext
  };

  return (
    <main className="auth-form-container container page-fade-in"> {/* Add animation class */}
      <h2>Admin Login</h2>
      <form onSubmit={handleAdminLogin} className="auth-form">
        <div className="form-group">
          <label htmlFor="adminUsername">Username</label>
          <input
            type="text"
            id="adminUsername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="adminPassword">Password</label>
          <input
            type="password"
            id="adminPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login as Admin</button>
      </form>
    </main>
  );
}

export default AdminLoginPage;