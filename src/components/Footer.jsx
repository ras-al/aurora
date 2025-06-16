// src/components/Footer.jsx
import React from 'react';

function Footer() {
return (
<footer className="footer">
  <div className="container">
    <p>&copy; {new Date().getFullYear()} AURORA 2025 - TKMCE Kollam. All Rights Reserved.</p>
    <p>Powered by IEEE SBC TKMCE</p>
  </div>
</footer>
);
}
export default Footer;