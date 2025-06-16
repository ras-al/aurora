// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AuthForm.css'; // Assuming your login page uses form styles
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to hold error messages
  const [loading, setLoading] = useState(false); // State for loading indicator
  const { login } = useAuth(); // Use the consolidated login function

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    setLoading(true); // Show loading indicator

    try {
      await login(email, password);
      // Redirection is handled by the AuthContext's onAuthStateChanged listener.
    } catch (err) {
      setError(err.message); // Display the user-friendly error message
      console.error("Login attempt failed:", err);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <main className="auth-form-container container page-fade-in">
      <div className="form-card"> {/* Assuming form-card for styling */}
        <h2>Login</h2>
        {error && <p className="error-message" style={{color: 'red', marginBottom: '15px'}}>{error}</p>} {/* Display error */}
        <form onSubmit={handleSubmit}>
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
          <button type="submit" disabled={loading}>
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>
        <p className="form-footer">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </main>
  );
}

export default LoginPage;