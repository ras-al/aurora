// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import all your page components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AuroraRegistrationPage from './pages/AuroraRegistrationPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage'; 
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ContactPage from './pages/ContactPage';
import AboutUsPage from './pages/AboutUsPage';
import PricingPage from './pages/PricingPage';
import CancellationPolicyPage from './pages/CancellationPolicyPage';
import ShippingPolicyPage from './pages/ShippingPolicyPage';
import ComingSoonPage from './pages/ComingSoonPage';
import ScoreboardPage from './pages/ScoreboardPage';


// Import your common components
import Header from './components/Header';
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
          <div className="stars">
            {/* Normal stars */}
            {[...Array(100)].map((_, i) => (
              <div
                key={`star-${i}`}
                className="star"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  animation: `pulse ${Math.random() * 2 + 1.5}s infinite, 
                              twinkle ${Math.random() * 5 + 3}s infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}

            {/* Shooting stars */}
            {[...Array(15)].map((_, i) => (
              <div
                key={`shooting-${i}`}
                className="star shooting"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  animation: `shooting-star ${Math.random() * 3 + 2}s linear infinite`,
                  animationDelay: `${Math.random() * 10}s`,
                }}
              />
            ))}

            {/* Tiny stars */}
            {[...Array(100)].map((_, i) => (
              <div
                key={`tiny-${i}`}
                className="star tiny"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `1px`,
                  height: `1px`,
                  animationDuration: `${Math.random() * 6 + 3}s`,
                }}
              />
            ))}

            {/* Comets */}
            {[...Array(3)].map((_, i) => (
              <div
                key={`comet-${i}`}
                className="star comet"
                style={{
                  top: `${Math.random() * 50}%`,
                  left: `${Math.random() * 100}%`,
                  width: `3px`,
                  height: `3px`,
                  backgroundColor: "#fff",
                  boxShadow: "0 0 20px 5px rgba(255,255,255,0.6)",
                  animation: `comet ${Math.random() * 8 + 6}s linear infinite`,
                  animationDelay: `${Math.random() * 15}s`,
                }}
              />
            ))}

            {/* Nebula background blobs */}
            <div
              className="nebula"
              style={{
                top: "20%",
                left: "10%",
                width: "600px",
                height: "600px",
                
              }}
            />
            <div
              className="nebula"
              style={{
                bottom: "10%",
                right: "15%",
                width: "500px",
                height: "500px",
                
              }}
            />
          </div>

          <Header /> {/* Render Header */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/termsCondition" element={<TermsOfServicePage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/shipping" element={<ShippingPolicyPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/cancellation-and-refund-policy" element={<CancellationPolicyPage />}/>
            <Route path="/register-aurora" element={<ComingSoonPage />} />
            {/*<Route path="/register-aurora" element={currentUser ? <AuroraRegistrationPage /> : <Navigate to="/login" replace />}/>*/}
            <Route path="/scoreboard" element={<ScoreboardPage />} />



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