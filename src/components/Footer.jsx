// src/components/Footer.jsx
import React from 'react';
import "../styles/Footer.css"; // Import CSS

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} AURORA'25 - TKMCE Kollam. All Rights Reserved.</p>
        <p>Powered by IEEE SB TKMCE</p>
      </div>
    </footer>
  );
}

export default Footer;
