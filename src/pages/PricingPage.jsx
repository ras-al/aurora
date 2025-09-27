// src/pages/PricingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/PricingPage.css';

function PricingPage() {
  return (
    <main className="pricing-page-container container page-fade-in">
      <h2>Registration Fees</h2>
      <p className="pricing-intro">
        Your Aurora '25 pass grants you access to the entire three-day flagship event, including all expert talks, panel discussions, and cultural nights. Specific workshops and competitions may have separate registration steps after you've secured your main pass.
      </p>
      <div className="pricing-cards">
        <div className="pricing-card">
          <h3>IEEE TKMCE</h3>
          <p className="price">₹600</p>
          <p className="description">For current students of TKMCE who are also active IEEE members.</p>
          <ul>
            <li>✔ Full 3-Day Access</li>
            <li>✔ IEEE Member Exclusive</li>
            <li>✔ TKMCE Student Only</li>
          </ul>
        </div>
        <div className="pricing-card">
          <h3>Non-IEEE TKMCE</h3>
          <p className="price">₹650</p>
          <p className="description">For current students of TKMCE who are not IEEE members.</p>
          <ul>
            <li>✔ Full 3-Day Access</li>
            <li>✔ TKMCE Student Only</li>
          </ul>
        </div>
        <div className="pricing-card">
          <h3>IEEE Non-TKMCE</h3>
          <p className="price">₹700</p>
          <p className="description">For active IEEE members from any institution other than TKMCE.</p>
          <ul>
            <li>✔ Full 3-Day Access</li>
            <li>✔ IEEE Member Exclusive</li>
          </ul>
        </div>
        <div className="pricing-card">
          <h3>Non-IEEE Non-TKMCE</h3>
          <p className="price">₹850</p>
          <p className="description">The standard rate for all participants who are not TKMCE students or IEEE members.</p>
          <ul>
            <li>✔ Full 3-Day Access</li>
            <li>✔ Open to All</li>
          </ul>
        </div>
      </div>
      <div className="registration-prompt">
        <p>Ready to ignite your future?</p>
        <Link to="/register-aurora" className="button-link">Register Now</Link>
      </div>
    </main>
  );
}

export default PricingPage;