// src/pages/PrivacyPolicyPage.jsx
import React from 'react';
import '../styles/LegalPages.css';

function PrivacyPolicyPage() {
  return (
    <main className="legal-page-container container page-fade-in">
      <h2>Privacy Policy</h2>
      <div className="legal-content">
        <p><strong>Last Updated: September 27, 2025</strong></p>

        <p align="justify">IEEE SB TKMCE is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website for Aurora '25.</p>

        <h3>1. Information We Collect</h3>
        <p >We may collect the following types of information:</p>
        <ul>
          <li><strong>Personal Data:</strong> Name, email address, phone number, college name, and IEEE membership details that you provide when creating an account or registering for events.</li>
          <li><strong>Usage Data:</strong> Information about how you access and use our website, such as your IP address, browser type, and pages visited.</li>
        </ul>

        <h3>2. How We Use Your Information</h3>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Create and manage your account.</li>
          <li>Process your registration for Aurora '25 and its events.</li>
          <li>Communicate with you about event updates, schedules, and other related information.</li>
          <li>Improve and personalize your experience on our website.</li>
          <li>Ensure the security of our platform.</li>
        </ul>

        <h3>3. Data Sharing and Disclosure</h3>
        <p align="justify">We do not sell or trade your personal information. We may share your information with trusted third parties only in the following situations:</p>
        <ul>
          <li><strong>Payment Processors:</strong> To process payments for event registrations.</li>
          <li><strong>Legal Requirements:</strong> If required by law or to respond to valid legal processes.</li>
        </ul>

        <h3>4. Data Security</h3>
        <p align="justify">We implement a variety of security measures to maintain the safety of your personal information. All sensitive information is transmitted via Secure Socket Layer (SSL) technology and encrypted in our database.</p>

        <h3>5. Your Rights</h3>
        <p>You have the right to access, update, or delete your personal information. You can do this by logging into your dashboard or by contacting us directly.</p>

        <h3>6. Changes to This Policy</h3>
        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

        <h3>7. Contact Us</h3>
        <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:ieeewebtkm@gmail.com">ieeewebtkm@gmail.com</a>.</p>
      </div>
    </main>
  );
}

export default PrivacyPolicyPage;