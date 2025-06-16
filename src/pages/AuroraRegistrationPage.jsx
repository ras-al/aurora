// src/pages/AuroraRegistrationPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; // Import Link

function AuroraRegistrationPage() {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  // Initialize state with existing userProfile data or defaults
  const [isIEEE, setIsIEEE] = useState(userProfile?.isIEEE || false);
  const [memberId, setMemberId] = useState(userProfile?.memberId || '');
  const [fullName, setFullName] = useState(userProfile?.name || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [phone, setPhone] = useState(''); // Phone might not be in profile yet
  const [college, setCollege] = useState('');
  const [hasRegistered, setHasRegistered] = useState(false);

  useEffect(() => {
    if (userProfile) {
      // Pre-fill if data exists in profile
      setFullName(userProfile.name);
      setEmail(userProfile.email);
      setIsIEEE(userProfile.isIEEE || false);
      setMemberId(userProfile.memberId || '');
      setPhone(userProfile.phone || ''); // Populate phone if it exists
      setCollege(userProfile.college || ''); // Populate college if it exists

      if (userProfile.auroraTicketId) {
        setHasRegistered(true);
        alert('You are already registered for Aurora! Redirecting to your dashboard.');
        navigate('/dashboard');
      }
    }
  }, [userProfile, navigate]);

  const registrationFee = isIEEE ? 1700 : 1900;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || !userProfile) {
        alert('User data not loaded. Please try logging in again.');
        navigate('/login');
        return;
    }

    const registrationId = `AURORA-<span class="math-inline">\{currentUser\.uid\.substring\(0, 8\)\}\-</span>{Date.now()}`; // Unique ID

    const success = await updateUserProfile(currentUser.uid, {
        name: fullName, // Update name if user filled it on this form
        phone: phone,
        college: college,
        isIEEE: isIEEE,
        memberId: isIEEE ? memberId : null,
        auroraTicketId: registrationId, // Mark as registered
        auroraRegistrationDate: new Date(), // Add registration date
        auroraFee: registrationFee, // Store the fee paid
    });

    if (success) {
        alert(`Aurora registration successful! Your ticket ID: ${registrationId}. Fee: Rs. ${registrationFee}. Payment functionality is coming soon.`);
        navigate('/dashboard');
    } else {
        alert('Aurora registration failed. Please try again.');
    }
  };

  if (!currentUser || !userProfile) { // Still loading or not logged in
    return <main className="form-page-container container page-fade-in">
            <p>Loading user data or please <Link to="/login">login</Link>.</p>
           </main>;
  }

  if (hasRegistered) { // Already registered
    return <main className="form-page-container container page-fade-in">
            <p>You are already registered for Aurora. Redirecting...</p>
           </main>;
  }


  return (
    <main className="form-page-container container page-fade-in">
      <h2>Register for Aurora 2025</h2>
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            readOnly // Email should be read-only as it's from auth
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="college">College Name</label>
          <input
            type="text"
            id="college"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            required
          />
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="isIEEE"
            checked={isIEEE}
            onChange={(e) => setIsIEEE(e.target.checked)}
          />
          <label htmlFor="isIEEE">I am an IEEE Member</label>
        </div>

        {isIEEE && (
          <div className="form-group">
            <label htmlFor="memberId">IEEE Member ID</label>
            <input
              type="text"
              id="memberId"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              required={isIEEE}
            />
          </div>
        )}

        <div className="registration-fee">
          <h3>Registration Fee: Rs. {registrationFee}</h3>
        </div>

        <button type="submit" className="payment-button" disabled>
          Payment Coming Soon!
        </button>
        <p className="note">You will receive your Aurora ticket after successful registration and payment.</p>
      </form>
    </main>
  );
}

export default AuroraRegistrationPage;