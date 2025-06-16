// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AuthForm.css';
import { useAuth } from '../contexts/AuthContext'; // <--- Import useAuth

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); // Use login function from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password); // Call login from AuthContext
  };

  return (
    <main className="auth-form-container container page-fade-in"> {/* Add animation class */}
      <h2>Login to Aurora</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        <p className="form-footer">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </main>
  );
}

export default LoginPage;