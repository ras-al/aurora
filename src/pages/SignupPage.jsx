// src/pages/SignupPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <--- Import useNavigate
import '../styles/AuthForm.css';
import { useAuth } from '../contexts/AuthContext';

function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state for button
  const [error, setError] = useState(''); // Add error state for display
  const { register } = useAuth();
  const navigate = useNavigate(); // <--- Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setLoading(true); // Disable button during submission
    try {
      await register(email, password, { name: name });
      alert('Registration successful! Please log in.'); // Success message
      navigate('/login'); // <--- Redirect to login page after successful signup
    } catch (err) {
      setError(err.message); // Display error from AuthContext
    } finally {
      setLoading(false); // Re-enable button
    }
  };

  return (
    <main className="auth-form-container container page-fade-in">
      <h2>Create Your Aurora Account</h2>
      {error && <div className="error-message">{error}</div>} {/* Display error */}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>Sign Up</button> {/* Disable button */}
        <p className="form-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}

export default SignupPage;