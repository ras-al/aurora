// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Removed BrowserRouter as it's in main.jsx now
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AuroraRegistrationPage from './pages/AuroraRegistrationPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { currentUser, userProfile, isAdmin } = useAuth(); // Get auth state

  return (
    <div className="app-container">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes for Users */}
        <Route
          path="/register-aurora"
          element={currentUser ? <AuroraRegistrationPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/dashboard"
          element={currentUser ? <UserDashboardPage /> : <Navigate to="/login" replace />}
        />

        {/* Admin Routes */}
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={isAdmin ? <AdminDashboardPage /> : <Navigate to="/admin-login" replace />}
        />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;