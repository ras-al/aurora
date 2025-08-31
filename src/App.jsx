// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // No BrowserRouter here

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

// AppContent is a wrapper component that uses the useAuth hook.
// It must be rendered *inside* the AuthProvider.
function AppContent() {
  const { currentUser, isAdmin, loading } = useAuth();

  // Optional: A simple loading indicator while the auth state is being determined
  if (loading) {
    return <div className="loading-screen" style={{ textAlign: 'center', padding: '50px' }}>Loading application...</div>;
  }

  return (
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
  );
}

// The main App component, which renders the AuthProvider
function App() {
  return (
    <AuthProvider> {/* AuthProvider must be inside BrowserRouter (in main.jsx) */}
      <AppContent />
    </AuthProvider>
  );
}

export default App;