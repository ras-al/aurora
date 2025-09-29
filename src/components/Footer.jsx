// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/Footer.css"; // Import CSS

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/shipping">Pricing</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/termsCondition">Terms & Conditions</Link>
          <Link to="/cancellationRefund">Cancellation/Refund Policy</Link>
        </div>
        <div className="footer-credits">
          <p>&copy; {new Date().getFullYear()} AURORA'25 - TKMCE Kollam. All Rights Reserved.</p>
          <p>Powered by IEEE SB TKMCE</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;