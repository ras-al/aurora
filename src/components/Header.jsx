// src/components/Header.jsx
import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Header.css';

function Header() {
  const { currentUser, userProfile, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  // Helper function to handle internal links on the HomePage
  const handleInternalLinkClick = (hash) => {
    if (location.pathname === '/') {
      // If already on homepage, scroll to section
      const element = document.getElementById(hash.substring(1)); // Remove '#'
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If not on homepage, navigate to homepage with hash, then scroll
      // This will cause a full page reload but reliably scrolls.
      window.location.href = `/#${hash.substring(1)}`;
    }
    closeMenu(); // Close menu after click
  };

  return (
    <header className="main-header">
      <div className="container header-content">
        <Link to="/" className="logo" onClick={closeMenu}>
          AURORA'25
        </Link>
        <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
          <ul>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive && location.hash === '' ? 'active' : '')}
                onClick={() => handleInternalLinkClick('#hero')} // Scroll to top if on home
              >
                Home
              </NavLink>
            </li>

            {/* Internal links to sections on HomePage */}
            <li><a href="/#about" onClick={() => handleInternalLinkClick('#about')}>About</a></li>
            <li><a href="/#events" onClick={() => handleInternalLinkClick('#events')}>Events</a></li>
            <li><a href="/#games" onClick={() => handleInternalLinkClick('#games')}>Games</a></li>
            <li><a href="/#schedule" onClick={() => handleInternalLinkClick('#schedule')}>Schedule</a></li>
            <li><a href="/#accommodation" onClick={() => handleInternalLinkClick('#accommodation')}>Accommodation</a></li>
            <li><a href="/#location" onClick={() => handleInternalLinkClick('#location')}>Location</a></li>
            <li>
              <NavLink to="/contact" onClick={closeMenu}>
                Contact
              </NavLink>
            </li>
            <li><NavLink to="/leaderboard">Leaderboard</NavLink></li>

            {currentUser && !isAdmin && (
              <li>
                <NavLink to="/dashboard" onClick={closeMenu}>
                  Dashboard
                </NavLink>
              </li>
            )}
            {isAdmin && (
              <li>
                <NavLink to="/admin-dashboard" onClick={closeMenu}>
                  Admin Dashboard
                </NavLink>
              </li>
            )}
            {/* !currentUser ? (
              <>
                <li>
                <NavLink to="/login" onClick={closeMenu}>
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/signup" onClick={closeMenu}>
                    Sign Up
                  </NavLink>
                </li>
              </>
            ) : (
              <li>
                <button onClick={handleLogout} className="header-logout-button">
                  Logout
                </button>
              </li>
            ) */}
          </ul>
        </nav>
        <div className="menu-toggle" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
    </header>
  );
}

export default Header;
