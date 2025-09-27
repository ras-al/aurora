import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { isValidAmbassadorCode } from '../data/ambassadors';
import '../styles/AuroraRegistrationPage.css';

// Direct URLs to your live Cloud Functions
const createOrderUrl = 'https://createorder-ofggxgka6a-uc.a.run.app';
const verifyPaymentUrl = 'https://verifypayment-ofggxgka6a-uc.a.run.app';

function AuroraRegistrationPage() {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  // State for new fields
  const [isTKMCE, setIsTKMCE] = useState(false);
  const [referralCode, setReferralCode] = useState('');

  // Existing state
  const [isIEEE, setIsIEEE] = useState(userProfile?.isIEEE || false);
  const [memberId, setMemberId] = useState(userProfile?.memberId || '');
  const [fullName, setFullName] = useState(userProfile?.name || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [college, setCollege] = useState(userProfile?.college || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userProfile) {
      if (userProfile.auroraTicketId) {
        alert('You are already registered for Aurora! Redirecting to your dashboard.');
        navigate('/dashboard');
      }
      // Pre-fill form from user profile
      setFullName(userProfile.name || '');
      setEmail(userProfile.email || '');
      setIsIEEE(userProfile.isIEEE || false);
      setMemberId(userProfile.memberId || '');
      setPhone(userProfile.phone || '');
      setCollege(userProfile.college || '');
    }
  }, [userProfile, navigate]);

  // Updated Fee Calculation Logic
  const getRegistrationFee = () => {
    if (isIEEE && isTKMCE) return 600;
    if (isIEEE && !isTKMCE) return 700;
    if (!isIEEE && isTKMCE) return 650;
    if (!isIEEE && !isTKMCE) return 850;
    return 850; // Default fallback
  };

  const registrationFee = getRegistrationFee();

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !phone.trim() || !college.trim()) {
      setError('Please fill in your Full Name, Phone, and College.');
      return;
    }
    if (isIEEE && !memberId.trim()) {
      setError('Please provide your IEEE Member ID.');
      return;
    }

    // New validation for referral code
    if (referralCode && !isValidAmbassadorCode(referralCode)) {
      setError('Invalid referral code. Please check and try again, or leave it blank.');
      return;
    }

    setLoading(true);

    if (typeof window.Razorpay === 'undefined') {
      setError('Payment gateway is still loading. Please wait a moment and try again.');
      setLoading(false);
      return;
    }

    try {
      const orderResponse = await fetch(createOrderUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: registrationFee }),
      });

      if (!orderResponse.ok) throw new Error('Failed to create payment order.');
      
      const order = await orderResponse.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Aurora '25 Registration",
        description: "Tech Fest Entry Pass",
        order_id: order.id,
        handler: async (response) => {
          const verificationResponse = await fetch(verifyPaymentUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              registrationData: {
                uid: currentUser.uid,
                fee: registrationFee,
                isIEEE,
                memberId,
                fullName,
                phone,
                college,
                isTKMCE, // Send TKMCE status
                referralCode, // Send referral code
              },
            }),
          });

          const result = await verificationResponse.json();
          
          if (result.success) {
            alert(`Registration successful! Your ticket ID: ${result.ticketId}`);
            navigate('/dashboard');
          } else {
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: fullName,
          email: email,
          contact: phone,
        },
        theme: {
          color: "#50E3C2",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Payment process error:", err);
      setError(err.message || 'An error occurred during the payment process.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || !userProfile) {
    return <main className="auth-form-container container page-fade-in"><p>Loading user data...</p></main>;
  }

  return (
    <main className="auth-form-container container page-fade-in">
      <h2>Register for Aurora 2025</h2>
      {error && <div className="error-message" style={{ maxWidth: '600px', margin: '0 auto 20px' }}>{error}</div>}
      <form onSubmit={handlePayment} className="registration-form">
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} readOnly required />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your phone number" required />
        </div>
        <div className="form-group">
          <label htmlFor="college">College Name</label>
          <input type="text" id="college" value={college} onChange={(e) => setCollege(e.target.value)} placeholder="Enter your college name" required />
        </div>

        <div className="form-group checkbox-group">
          <input type="checkbox" id="isTKMCE" checked={isTKMCE} onChange={(e) => setIsTKMCE(e.target.checked)} />
          <label htmlFor="isTKMCE">I am a student of TKMCE</label>
        </div>

        <div className="form-group checkbox-group">
          <input type="checkbox" id="isIEEE" checked={isIEEE} onChange={(e) => setIsIEEE(e.target.checked)} />
          <label htmlFor="isIEEE">I am an IEEE Member</label>
        </div>

        {isIEEE && (
          <div className="form-group">
            <label htmlFor="memberId">IEEE Member ID</label>
            <input type="text" id="memberId" value={memberId} onChange={(e) => setMemberId(e.target.value)} placeholder="Enter your IEEE Member ID" required={isIEEE} />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="referralCode">Campus Ambassador Code (Optional)</label>
          <input
            type="text"
            id="referralCode"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
            placeholder="e.g., AUR011"
          />
        </div>

        <div className="registration-fee">
          <h3>Registration Fee: Rs. {registrationFee}</h3>
        </div>
        <button type="submit" className="payment-button" disabled={loading}>
          {loading ? 'Processing...' : `Proceed to Pay Rs. ${registrationFee}`}
        </button>
        <p className="note">You will receive your Aurora ticket after successful registration and payment.</p>
      </form>
    </main>
  );
}

export default AuroraRegistrationPage;
