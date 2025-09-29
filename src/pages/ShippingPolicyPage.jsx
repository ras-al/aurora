import React from 'react';
import '../styles/LegalPages.css';

function ShippingPolicyPage() {
  return (
    <main className="legal-page-container container page-fade-in">
      <h2>Shipping & Delivery Policy</h2>
      <div className="legal-content">
        <p><strong>Last Updated: September 30, 2025</strong></p>
        
        <p align="justify">This policy outlines the terms for the delivery of passes for the Aurora '25 event organized by IEEE SB TKMCE.</p>

        <h3>1. Nature of Product</h3>
        <p align="justify">
          All products sold on this website are digital passes for entry to the Aurora '25 event. We do not sell or ship any physical goods.
        </p>

        <h3>2. Delivery of Digital Pass</h3>
        <p align="justify">
          Upon successful registration and payment, your unique Aurora Pass (digital ticket with a QR code) will be generated and made available instantly in your User Dashboard on our website. You will also receive a confirmation email at the email address provided during registration.
        </p>
        
        <h3>3. No Physical Shipping</h3>
        <p align="justify">
          There are no physical items to be shipped. Therefore, no shipping charges apply, and no shipping address is required. Your Aurora Pass is your proof of purchase and entry to the event.
        </p>

        <h3>4. Accessing Your Pass</h3>
        <p align="justify">
          To access your Aurora Pass, please log in to your account on our website and navigate to the "Dashboard" section. You should present this digital pass (on your mobile device or as a printout) at the event registration desk for check-in.
        </p>

        <h3>5. Contact Us</h3>
        <p align="justify">
          If you encounter any issues with receiving or accessing your digital pass after a successful payment, please contact us immediately at <a href="mailto:ieeewebtkm@gmail.com">ieeewebtkm@gmail.com</a>.
        </p>
      </div>
    </main>
  );
}

export default ShippingPolicyPage;