import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'; // Import sendEmailVerification
import { useAuth } from '../contexts/AuthContext';
import '../styles/AuthForm.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const auth = getAuth();

  const handleResendVerification = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setVerificationSent(true);
        setError(''); // Clear previous error
      } else {
        setError("Could not find user to resend verification. Please try logging in again.");
      }
    } catch (err) {
      setError("Failed to resend verification email. Please try again later.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setVerificationSent(false);
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        // If email is not verified, show an error and do not proceed
        setError('Please verify your email before logging in.');
        // Optionally offer to resend the verification email
        throw new Error('Email not verified'); // Stop execution
      }
      
      setCurrentUser(user);
      navigate('/dashboard');

    } catch (error) {
        if (error.message !== 'Email not verified') {
            setError(error.message.replace('Firebase: ', ''));
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Log In</h2>
          {error && (
            <div className="error-message">
              {error}
              {error.includes('verify your email') && (
                <button type="button" onClick={handleResendVerification} className="resend-link">
                  Resend Verification Email
                </button>
              )}
            </div>
          )}
          {verificationSent && <p className="success-message">Verification email sent!</p>}

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
          <div className="form-footer-extra">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging In...' : 'Log In'}
          </button>
          <div className="form-footer">
            <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
