// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import all your page components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AuroraRegistrationPage from './pages/AuroraRegistrationPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage'; // Make sure this is imported

// Import your common components
import Header from './components/Header'; // Ensure Header is imported
import Footer from './components/Footer';

// Import AuthProvider and useAuth from your context
import { AuthProvider, useAuth } from './contexts/AuthContext';

import './App.css'; // Your main app CSS
import './styles/IntroPopup.css'; // New CSS for intro pop-up

// AppContent is a wrapper component that uses the useAuth hook.
// It must be rendered *inside* the AuthProvider.
function AppContent() {
  const { currentUser, isAdmin, loading } = useAuth();
  const [showIntroPopup, setShowIntroPopup] = useState(true);

  // Use a useEffect to hide the intro pop-up after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntroPopup(false);
    }, 3000); // Hide the pop-up after 3 seconds
    return () => clearTimeout(timer);
  }, []);

  // Optional: A simple loading indicator while the auth state is being determined
  if (loading) {
    return (
      <div className="loading-screen" style={{ textAlign: 'center', padding: '50px' }}>
        Loading application...
      </div>
    );
  }

  return (
    <>
      {showIntroPopup ? (
        <div className="intro-popup-container">
          <img src="/logo.png" alt="App Logo" className="intro-popup-logo" />
        </div>
      ) : (
        <div className="app-container">
          <Header /> {/* Render Header */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected Route for Aurora Registration - requires login */}
            <Route
              path="/register-aurora"
              element={currentUser ? <AuroraRegistrationPage /> : <Navigate to="/login" replace />}
            />

            {/* Protected Route for User Dashboard - requires login */}
            <Route
              path="/dashboard"
              element={currentUser ? <UserDashboardPage /> : <Navigate to="/login" replace />}
            />

            {/* Protected Route for Admin Dashboard - requires admin role */}
            <Route
              path="/admin-dashboard"
              element={isAdmin ? <AdminDashboardPage /> : <Navigate to="/login" replace />}
            />

            {/* Fallback for unknown routes - redirects to homepage */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer /> {/* Render Footer */}
        </div>
      )}
    </>
  );
}

// The main App component, which renders the AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
