// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { currentUser, isAdmin, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-content container">
        <div className="logo">
          <Link to="/">AURORA 2025</Link>
        </div>
        <nav>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            {currentUser ? ( // If a user is logged in
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><button onClick={logout}>Logout</button></li>
              </>
            ) : ( // If no user is logged in
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Signup</Link></li>
              </>
            )}
            {isAdmin ? ( // If admin is logged in
                <li><Link to="/admin">Admin Dashboard</Link></li>
            ) : (
                <li><Link to="/admin-login">Admin Login</Link></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;