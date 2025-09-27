// src/pages/AboutUsPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LegalPages.css'; // Using the same style for a consistent look

function AboutUsPage() {
  return (
    <main className="legal-page-container container page-fade-in">
      <h2>About Aurora '25</h2>
      <div className="legal-content">
        <p align="justify">
          Welcome to Aurora 2025 – the flagship technical fest of IEEE SB TKMCE, where creativity meets
          technology and innovation knows no bounds. A premier gathering of students, professionals, and tech
          enthusiasts, Aurora is a vibrant platform for learning, collaboration, and exploration.
        </p>
        <p align="justify">
          With an exciting lineup of workshops, competitions, expert talks, and project showcases, Aurora brings
          together the brightest minds to spark curiosity, challenge intellect, and inspire the next generation of
          engineers and innovators. It is a space where groundbreaking ideas come alive, hands-on experience
          with emerging technologies is gained, and innovation is celebrated.
        </p>
        <p align="justify">
          Aurora celebrates innovation while connecting participants with industry leaders and emerging
          technologies. Step into Aurora 2025—an unforgettable journey where ideas come alive and the future is
          shaped.
        </p>
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Link to="/contact" className="button-link">Contact Us</Link>
        </div>
      </div>
    </main>
  );
}

export default AboutUsPage;