// src/pages/ContactPage.jsx
import React from 'react';
import '../styles/ContactPage.css';

function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! We will get back to you shortly.");
    e.target.reset();
  };

  return (
    <main className="contact-page-container container page-fade-in">
      <h2>Contact Us</h2>
      <p className="contact-intro">We'd love to hear from you! Whether you have a question about the event, registration, or anything else, our team is ready to answer all your questions.</p>

      <div className="contact-content">
        <div className="contact-details">
          <h3>Contact Information</h3>
          <p><strong>Email (General Inquiries):</strong> <a href="mailto:ieeewebtkm@gmail.com">ieeewebtkm@gmail.com</a></p>
          <p><strong>Email (Privacy Concerns):</strong> <a href="mailto:ieeewebtkm@gmail.com">ieeewebtkm@gmail.com</a></p>
          <p><strong>Phone:</strong> +91-96565 85696</p>
          <p><strong>Address:</strong> TKM College of Engineering, Karicode, Kollam, Kerala, India - 691005</p>
        </div>
        <div className="contact-form-container">
          <h3>Send Us a Message</h3>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default ContactPage;