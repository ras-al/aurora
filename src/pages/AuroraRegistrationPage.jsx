// src/pages/AuroraRegistrationPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/AuroraRegistrationPage.css';

function AuroraRegistrationPage() {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [isIEEE, setIsIEEE] = useState(userProfile?.isIEEE || false);
  const [memberId, setMemberId] = useState(userProfile?.memberId || '');
  const [fullName, setFullName] = useState(userProfile?.name || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [college, setCollege] = useState(userProfile?.college || '');
  const [hasRegistered, setHasRegistered] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.name);
      setEmail(userProfile.email);
      setIsIEEE(userProfile.isIEEE || false);
      setMemberId(userProfile.memberId || '');
      setPhone(userProfile.phone || '');
      setCollege(userProfile.college || '');

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

    if (!phone.trim() || !college.trim()) {
        alert('Please fill out your Phone Number and College Name.');
        return;
    }

    const registrationId = `AUR-${currentUser.uid.substring(0, 6)}-${Date.now().toString().slice(-6)}`;

    const success = await updateUserProfile(currentUser.uid, {
        name: fullName,
        phone: phone,
        college: college,
        isIEEE: isIEEE,
        memberId: isIEEE ? memberId : '',
        auroraTicketId: registrationId,
        auroraRegistrationDate: new Date(),
        auroraFee: registrationFee,
    });

    if (success) {
        alert(`Aurora registration successful! Your ticket ID: ${registrationId}. Fee: Rs. ${registrationFee}. Payment functionality is coming soon.`);
        navigate('/dashboard');
    } else {
        alert('Aurora registration failed. Please try again.');
    }
  };

  if (!currentUser || !userProfile) {
    return <main className="auth-form-container container page-fade-in">
            <p>Loading user data or please <Link to="/login">login</Link>.</p>
           </main>;
  }

  if (hasRegistered) {
    return <main className="auth-form-container container page-fade-in">
            <p>You are already registered for Aurora. Redirecting...</p>
           </main>;
  }

  return (
    <main className="auth-form-container container page-fade-in">
      <h2>Register for Aurora 2025</h2>
      <form onSubmit={handleSubmit} className="registration-form">
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
            readOnly
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
            placeholder="Enter your phone number"
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
            placeholder="Enter your college name"
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
              placeholder="Enter your IEEE Member ID"
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