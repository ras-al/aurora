// src/pages/ComingSoonPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ComingSoonPage.css';

function ComingSoonPage() {
  return (
    <main className="coming-soon-container container page-fade-in">
      <div className="coming-soon-content">
        <h2>Registration Opening Soon!</h2>
        <p>We are putting the final touches on the registration system. Please check back shortly!</p>
        <p>Thank you for your patience.</p>
        <Link to="/" className="button-link">Return to Home</Link>
      </div>
    </main>
  );
}

export default ComingSoonPage;