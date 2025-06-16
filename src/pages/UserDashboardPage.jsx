// src/pages/UserDashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db, collection, getDocs, doc, updateDoc, arrayUnion } from '../firebase'; // <--- Import arrayUnion from firebase.js
import '../styles/DashboardPage.css';

function UserDashboardPage() {
  const { currentUser, userProfile, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [allEvents, setAllEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [errorEvents, setErrorEvents] = useState(null);

  useEffect(() => {
    if (!currentUser || !userProfile) {
      return;
    }

    const fetchEvents = async () => {
      try {
        const eventsCollectionRef = collection(db, 'events');
        const eventSnapshot = await getDocs(eventsCollectionRef);
        const eventsList = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllEvents(eventsList);
      } catch (err) {
        console.error("Error fetching events:", err);
        setErrorEvents("Failed to load events.");
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [currentUser, userProfile]);

  const handleRegisterForEvent = async (eventId) => {
    if (!userProfile.auroraTicketId) {
      alert('You must register for Aurora 2025 first to join individual events.');
      return;
    }

    if (userProfile.registeredEvents && userProfile.registeredEvents.includes(eventId)) {
        alert('You are already registered for this event.');
        return;
    }

    try {
      // Call updateUserProfile which uses arrayUnion internally
      const success = await updateUserProfile(currentUser.uid, {
        registeredEvents: arrayUnion(eventId) // Use arrayUnion
      });
      if (success) {
        alert('Successfully registered for the event!');
      } else {
        alert('Failed to register for event.');
      }
    } catch (error) {
      console.error("Error registering for event:", error);
      alert('An error occurred during event registration.');
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (!currentUser || !userProfile) {
    return <main className="dashboard-container container page-fade-in"><h2>Loading User Dashboard...</h2></main>;
  }

  const userRegisteredEvents = allEvents.filter(event =>
    userProfile.registeredEvents?.includes(event.id)
  );

  const availableEvents = allEvents.filter(event =>
    !userProfile.registeredEvents?.includes(event.id) && event.id !== 'aurora'
  );

  return (
    <main className="dashboard-container container page-fade-in">
      <h2>Welcome, {userProfile.name || currentUser.email}!</h2>

      <section className="user-profile">
        <h3>Your Profile</h3>
        <p><strong>Email:</strong> {userProfile.email}</p>
        {userProfile.phone && <p><strong>Phone:</strong> {userProfile.phone}</p>}
        {userProfile.college && <p><strong>College:</strong> {userProfile.college}</p>}
      </section>

      <section className="aurora-ticket-section">
        <h3>Your Aurora Ticket</h3>
        {userProfile.auroraTicketId ? (
          <div className="ticket-card">
            <h4>AURORA 2025 Participant</h4>
            <p><strong>Name:</strong> {userProfile.name}</p>
            <p><strong>Registration ID:</strong> {userProfile.auroraTicketId}</p>
            <p className="ticket-status">Access Granted!</p>
            <p className="ticket-note">This is your main access pass for Aurora 2025.</p>
          </div>
        ) : (
          <div className="no-ticket">
            <p>You have not yet registered for Aurora 2025.</p>
            <Link to="/register-aurora" className="button-link">Register for Aurora Now</Link>
          </div>
        )}
      </section>

      <section className="registered-events-section">
        <h3>Your Registered Events</h3>
        {userProfile.auroraTicketId ? (
          userRegisteredEvents.length > 0 ? (
            <ul className="event-list">
              {userRegisteredEvents.map(event => (
                <li key={event.id} className="event-item">
                  <div>
                    <h4>{event.name}</h4>
                    <p>Date: {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-events">
              <p>You haven't registered for any individual events yet.</p>
              <p>Explore events below!</p>
            </div>
          )
        ) : (
            <p>Please register for Aurora 2025 first to participate in individual events.</p>
        )}
      </section>

      {userProfile.auroraTicketId && (
        <section className="available-events-section">
            <h3>Available Events for Registration</h3>
            {loadingEvents ? (
                <p>Loading events...</p>
            ) : errorEvents ? (
                <p className="error-message">{errorEvents}</p>
            ) : availableEvents.length > 0 ? (
                <ul className="event-list">
                    {availableEvents.map(event => (
                        <li key={event.id} className="event-item">
                            <div>
                                <h4>{event.name}</h4>
                                <p>Date: {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}</p>
                                <p>{event.description}</p>
                            </div>
                            <button onClick={() => handleRegisterForEvent(event.id)}>Register</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No more events available for registration.</p>
            )}
        </section>
      )}

      <section className="dashboard-actions">
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </section>
    </main>
  );
}

export default UserDashboardPage;