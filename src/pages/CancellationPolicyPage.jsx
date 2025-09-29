import React from 'react';
import '../styles/LegalPages.css';

function CancellationPolicyPage() {
  return (
    <main className="legal-page-container container page-fade-in">
      <h2>Cancellation & Refund Policy</h2>
      <div className="legal-content">
        <p><strong>Last Updated: September 30, 2025</strong></p>
        
        <p align="justify">
          This Cancellation and Refund Policy outlines the terms under which cancellations and refunds are handled for the Aurora '25 event organized by IEEE SB TKMCE. We aim to be transparent with our participants. By purchasing a pass, you agree to the terms of this policy.
        </p>

        <h3>1. No Cancellation or Refund Policy</h3>
        <p align="justify">
          <strong>All sales are final.</strong> Once a digital pass for Aurora '25 is purchased, the sale is considered complete and is non-refundable and non-cancellable.
        </p>
        <p align="justify">
          We do not offer refunds or allow cancellations for any reason, including but not limited to:
        </p>
        <ul>
          <li>Change of mind or personal circumstances.</li>
          <li>Inability to attend the event.</li>
          <li>Scheduling conflicts.</li>
          <li>Technical issues not caused by our platform.</li>
        </ul>
        <p align="justify">
          We encourage you to be certain of your decision to attend before completing your purchase.
        </p>

        <h3>2. Event Cancellation or Postponement</h3>
        <p align="justify">
          In the unlikely event that Aurora '25 is canceled by the organizers, a full refund will be issued to all registered participants. Refunds will be processed to the original mode of payment within 15-30 business days of the cancellation announcement.
        </p>
        <p align="justify">
          If the event is postponed to a future date, your ticket will be automatically valid for the new date. If you are unable to attend on the rescheduled date, you may request a refund by contacting us within the timeframe specified in the postponement announcement.
        </p>

        <h3>3. Contact Us</h3>
        <p align="justify">
          For any questions or concerns regarding this policy, please contact our support team:
        </p>
        <p>
          <strong>Email:</strong> <a href="mailto:ieeewebtkm@gmail.com">ieeewebtkm@gmail.com</a>
        </p>
      </div>
    </main>
  );
}

export default CancellationPolicyPage;