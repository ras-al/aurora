// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/AuthForm.css';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAdmin } = useAuth(); // Get isAdmin state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      
      // ADD NAVIGATION LOGIC HERE
      // We need to wait for the state to update, so we can't check isAdmin immediately.
      // The onAuthStateChanged listener will update the state, and we can navigate
      // based on the role we expect to have after logging in. 
      // A simple redirect to dashboard is usually sufficient, as protected routes will handle the rest.
      
      // After login, the AuthContext will determine the user's role.
      // We can then navigate. A short delay can help ensure the context has updated.
      setTimeout(() => {
        // Re-check isAdmin from a fresh context if needed, but for now, we'll navigate based on what the context will become
        // The most reliable way is to let the context update and have a separate effect handle navigation
        // Or, more simply, just navigate to a common logged-in page
        navigate('/dashboard'); 
      }, 100);


    } catch (err) {
      setError(err.message);
      console.error("Login attempt failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // ... (rest of the component remains the same)

  return (
    <main className="auth-form-container container page-fade-in">
      <h2>Log in</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        {/* ... form fields ... */}
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
          <div className="password-input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle-button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{ 
                position: 'absolute', 
                top: '-9px', 
                right: '13px', 
                transform: 'none' 
              }}
            >
              {/* SVG icons */}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging In...' : 'Login'}
        </button>
        <p className="form-footer">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
        <p className="form-footer">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </main>
  );
}

export default LoginPage;
