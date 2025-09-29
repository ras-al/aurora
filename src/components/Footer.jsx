import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-and-conditions">Terms & Conditions</Link>
          <Link to="/cancellation-and-refund-policy">Cancellation/Refund</Link>
          <Link to="/shipping-and-delivery-policy">Shipping/Delivery</Link>
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