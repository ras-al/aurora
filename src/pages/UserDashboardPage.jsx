// src/pages/UserDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  db,
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  query,
  where,
  serverTimestamp
} from '../firebase';
import '../styles/DashboardPage.css';
import '../styles/UserDashboard.css'; // Ensure this is imported

function UserDashboardPage() {
  const { currentUser, userProfile, loading, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login');
      return;
    }
    if (currentUser && userProfile) {
      fetchUserEvents();
    }
  }, [currentUser, userProfile, loading, navigate]);

  const fetchUserEvents = async () => {
    setPageLoading(true);
    setPageError(null);
    try {
      if (!userProfile || !userProfile.registeredEvents || userProfile.registeredEvents.length === 0) {
        setRegisteredEvents([]);
        setPageLoading(false);
        return;
      }

      const eventsCollectionRef = collection(db, 'events');
      const registeredEventIds = userProfile.registeredEvents;
      const fetchedEvents = [];

      for (const eventId of registeredEventIds) {
        const eventDocRef = doc(eventsCollectionRef, eventId);
        const eventDocSnap = await getDoc(eventDocRef);
        if (eventDocSnap.exists()) {
          fetchedEvents.push({ id: eventDocSnap.id, ...eventDocSnap.data() });
        }
      }

      fetchedEvents.sort((a, b) => {
        const dateA = a.date && a.date.toDate ? a.date.toDate() : (a.date ? new Date(a.date) : new Date(0));
        const dateB = b.date && b.date.toDate ? b.date.toDate() : (b.date ? new Date(b.date) : new Date(0));
        return dateA - dateB;
      });

      setRegisteredEvents(fetchedEvents);
    } catch (err) {
      console.error("Error fetching user registered events:", err);
      setPageError("Failed to load your registered events. Please try again.");
    } finally {
      setPageLoading(false);
    }
  };

  const handleCancelParticipation = async (eventId, eventName) => {
    if (!currentUser || !userProfile) {
      alert("You must be logged in to cancel participation.");
      return;
    }

    if (!window.confirm(`Are you sure you want to cancel your registration for "${eventName}"?`)) {
      return;
    }

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        registeredEvents: arrayRemove(eventId),
        updatedAt: serverTimestamp(),
      });

      const eventDocRef = doc(db, 'events', eventId);
      const eventSnap = await getDoc(eventDocRef);
      if (eventSnap.exists()) {
          const currentCount = eventSnap.data().participantCount || 0;
          if (currentCount > 0) {
              await updateDoc(eventDocRef, {
                  participantCount: currentCount - 1,
                  updatedAt: serverTimestamp()
              });
          }
      }

      alert(`Successfully canceled registration for "${eventName}".`);
      await updateUserProfile(currentUser.uid, {});
      fetchUserEvents();

    } catch (error) {
      console.error("Error canceling participation:", error);
      alert("Failed to cancel participation: " + error.message);
    }
  };

  const handleUserLogout = () => {
    logout();
  }

  if (pageLoading || loading) {
    return (
      <main className="user-dashboard-container container page-fade-in">
        <h2 style={{ textAlign: 'center' }}>Loading Your Dashboard...</h2>
        <p style={{ textAlign: 'center' }}>Please wait.</p>
      </main>
    );
  }

  if (pageError) {
    return (
      <main className="user-dashboard-container container page-fade-in">
        <h2 style={{ textAlign: 'center', color: 'red' }}>Error</h2>
        <p className="error-message" style={{ textAlign: 'center' }}>{pageError}</p>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={fetchUserEvents} className="reload-button">Reload Events</button>
        </div>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main className="user-dashboard-container container page-fade-in">
        <h2 style={{ textAlign: 'center' }}>Access Denied</h2>
        <p className="error-message" style={{ textAlign: 'center' }}>Please log in to view your dashboard.</p>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={() => navigate('/login')} className="login-button">Go to Login</button>
        </div>
      </main>
    );
  }

  // Helper function to format Aurora registration date
  const getAuroraRegDate = () => {
    if (userProfile?.auroraRegistrationDate && userProfile.auroraRegistrationDate.seconds) {
      return new Date(userProfile.auroraRegistrationDate.seconds * 1000).toLocaleDateString('en-IN');
    }
    return 'N/A';
  };


  return (
    <main className="user-dashboard-container container page-fade-in">
      <h2>Welcome, {userProfile?.name || currentUser.email}!</h2>

      {/* NEW: Aurora Ticket Section */}
      {userProfile?.auroraTicketId && (
        <section className="aurora-ticket-section form-card">
          <h3>Your Aurora Pass</h3>
          <div className="ticket-card">
            <div className="ticket-header">
              <span className="ticket-event-name">AURORA 2025</span>
              <span className="ticket-type">Participant Pass</span>
            </div>
            <div className="ticket-body">
              <div className="ticket-info">
                <p><strong>Name:</strong> {userProfile.name}</p>
                <p><strong>College:</strong> {userProfile.college || 'Not Provided'}</p>
                <p><strong>Email:</strong> {userProfile.email}</p>
              </div>
              <div className="ticket-id">
                <span>Ticket ID:</span>
                <span className="ticket-id-value">{userProfile.auroraTicketId}</span>
              </div>
            </div>
            <div className="ticket-footer">
              <p>Admission Valid for AURORA 2025 Events</p>
              <p className="ticket-date">Registered On: {getAuroraRegDate()}</p>
            </div>
            <div className="ticket-barcode">
              {/* This could be a QR code or barcode image based on auroraTicketId */}
              {/* For now, just a placeholder div */}
              <div className="barcode-placeholder">SCAN ME</div>
            </div>
          </div>
          <p className="ticket-disclaimer">Please present this pass at the registration desk.</p>
        </section>
      )}

      <section className="user-info-section form-card">
        <h3>Your Profile</h3>
        <p><strong>Email:</strong> {userProfile?.email}</p>
        <p><strong>College:</strong> {userProfile?.college || 'N/A'}</p>
        <p><strong>Phone:</strong> {userProfile?.phone || 'N/A'}</p>
        <p><strong>IEEE Member:</strong> {userProfile?.isIEEE ? 'Yes' : 'No'}</p>
        {userProfile?.isIEEE && <p><strong>Member ID:</strong> {userProfile?.memberId || 'N/A'}</p>}
        {/* The Aurora Ticket ID is now displayed in its dedicated section above */}
      </section>

      <section className="registered-events-section form-card">
        <h3>Your Registered Events</h3>
        {registeredEvents.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {registeredEvents.map(event => (
                  <tr key={event.id} className={event.isCanceled ? 'canceled-event-row' : ''}>
                    <td><span className={event.isCanceled ? 'strikethrough-text' : ''}>{event.name}</span></td>
                    <td>{event.date instanceof Date ? event.date.toLocaleDateString('en-IN') : 'N/A'}</td>
                    <td>{event.location || 'N/A'}</td>
                    <td>{event.type}</td>
                    <td>{event.isCanceled ? 'Canceled' : 'Active'}</td>
                    <td>
                      {event.isCanceled ? (
                        <span className="info-message small-info">Event Canceled by Admin</span>
                      ) : (
                        <button
                          onClick={() => handleCancelParticipation(event.id, event.name)}
                          className="cancel-participation-button small-button"
                        >
                          Cancel Registration
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>You have not registered for any events yet. Explore our <a href="/#events">events page</a>!</p>
        )}
      </section>

      <section className="dashboard-actions">
        <button onClick={handleUserLogout} className="logout-button">Logout</button>
      </section>
    </main>
  );
}

export default UserDashboardPage;