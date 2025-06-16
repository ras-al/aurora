// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db, collection, getDocs, arrayUnion } from '../firebase'; // Ensure arrayUnion is imported
import { useAuth } from '../contexts/AuthContext'; // Ensure useAuth is imported
import '../styles/HomePage.css'; // Your homepage specific styles

function HomePage() {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [errorEvents, setErrorEvents] = useState(null);
  const { currentUser, userProfile, updateUserProfile } = useAuth(); // Get auth state and profile
  const navigate = useNavigate(); // Initialize useNavigate hook for redirection

  useEffect(() => {
    // Function to fetch events from Firestore
    const fetchEvents = async () => {
      try {
        const eventsCollectionRef = collection(db, 'events');
        const eventSnapshot = await getDocs(eventsCollectionRef);
        // Map document data to include the doc.id
        const eventsList = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(eventsList);
      } catch (err) {
        console.error("Error fetching events:", err);
        setErrorEvents("Failed to load events. Please try again later.");
      } finally {
        setLoadingEvents(false); // Stop loading regardless of success or failure
      }
    };

    fetchEvents(); // Call the fetch function when the component mounts
  }, []); // Empty dependency array means this effect runs once after initial render

  // Group events by their 'type' property for categorized display
  const groupedEvents = events.reduce((acc, event) => {
    if (!acc[event.type]) {
      acc[event.type] = []; // Initialize array for new type
    }
    acc[event.type].push(event); // Add event to its respective type array
    return acc;
  }, {}); // Start with an empty object

  // Function to handle clicking the 'Register for Event' button
  const handleRegisterForEvent = async (eventId, eventName) => {
    // 1. Check if user is logged in
    if (!currentUser) {
      alert('Please log in to register for events.');
      navigate('/login'); // Redirect to login page
      return;
    }

    // 2. Check if user has purchased the Aurora 2025 main ticket
    // userProfile might be null initially, so use optional chaining
    if (!userProfile?.auroraTicketId) {
      alert('You must register for Aurora 2025 first to join individual events.');
      navigate('/register-aurora'); // Redirect to the main Aurora registration/ticket buying page
      return;
    }

    // 3. Check if user is already registered for this specific event
    if (userProfile.registeredEvents && userProfile.registeredEvents.includes(eventId)) {
        alert('You are already registered for this event.');
        // Optionally, you could redirect to the user dashboard here if you want
        // navigate('/dashboard');
        return;
    }

    // If all checks pass, proceed with registration
    try {
      // Call updateUserProfile from AuthContext to update the user's Firestore document
      // using arrayUnion to add the eventId to the registeredEvents array
      const success = await updateUserProfile(currentUser.uid, {
        registeredEvents: arrayUnion(eventId)
      });

      if (success) {
        alert(`Successfully registered for ${eventName}!`);
        // Optional: Navigate to user dashboard or show a success message differently
        // navigate('/dashboard');
      } else {
        alert('Failed to register for event. Please try again.');
      }
    } catch (error) {
      console.error("Error registering for event:", error);
      alert('An error occurred during event registration.');
    }
  };

  // This function determines where to redirect if the button is clicked by an ineligible user
  const handleClickBehavior = (event) => {
    if (!currentUser) {
        alert('Please log in to register for events.');
        navigate('/login');
    } else if (!userProfile?.auroraTicketId) {
        alert('You must register for Aurora 2025 first to join individual events.');
        navigate('/register-aurora');
    }
    // If none of the above, it means the button was disabled because the user was already registered
    // In this case, no navigation is needed, the alert is handled by the main handler if somehow clicked.
  };

  return (
    <main className="homepage page-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content container">
          <h1 className="animate-hero-text">AURORA 2025: Ignite Your Future!</h1>
          <p className="subtitle animate-hero-text delay-1">Join us for an unforgettable experience of innovation, learning, and connection.</p>
          <Link to="/register-aurora" className="register-button animate-hero-button delay-2">
            Register for Aurora Now!
          </Link>
        </div>
      </section>

      {/* About Aurora Section */}
      <section className="about-aurora container">
        <h2>About Aurora</h2>
        <p>
          Aurora is the annual technical and cultural fest of TKM College of Engineering,
          Kollam. It is a celebration of innovation, talent, and creativity, bringing
          together students, professionals, and enthusiasts from across the nation.
          Prepare for thrilling competitions, insightful workshops, captivating performances,
          and a vibrant atmosphere of learning and networking.
        </p>
      </section>

      {/* Events Section - Categorized Display */}
      <section className="events-section container">
        <h2>Our Events</h2>
        {loadingEvents ? (
          <p className="loading-message">Loading events...</p>
        ) : errorEvents ? (
          <p className="error-message">{errorEvents}</p>
        ) : Object.keys(groupedEvents).length > 0 ? (
          // Iterate over each event type (category)
          Object.keys(groupedEvents).map(type => (
            <div key={type} className="event-category-section">
              <h3>{type} Events</h3> {/* Category heading */}
              <div className="event-cards-grid">
                {/* Iterate over events within each category */}
                {groupedEvents[type].map(event => {
                  // Determine button state based on user's login and registration status
                  const hasAuroraTicket = userProfile?.auroraTicketId;
                  const isRegisteredForThisEvent = userProfile?.registeredEvents?.includes(event.id);

                  // Decide if the button should allow direct registration
                  const canRegisterDirectly = currentUser && hasAuroraTicket && !isRegisteredForThisEvent;

                  return (
                    <div key={event.id} className="event-card">
                      {event.image && (
                        // Display event image if available
                        <img src={event.image} alt={event.name} className="event-card-image" />
                      )}
                      <div className="event-card-content">
                        <h4>{event.name}</h4>
                        <p>Date: {event.date}</p>
                        <p>{event.description}</p>
                      </div>
                      <div className="action-area">
                        {canRegisterDirectly ? (
                          // Button for eligible users to register
                          <button
                            className="register-event-button"
                            onClick={() => handleRegisterForEvent(event.id, event.name)}
                          >
                            Register for Event
                          </button>
                        ) : (
                          // Button for ineligible users (disabled or redirects)
                          <button
                            className="register-event-button"
                            // If already registered, disable the button. Otherwise, it's clickable for redirection.
                            disabled={isRegisteredForThisEvent}
                            onClick={isRegisteredForThisEvent ? null : handleClickBehavior} // Only click if not already registered
                            title={
                              !currentUser
                                ? 'Log in to register for events'
                                : !hasAuroraTicket
                                  ? 'Register for Aurora 2025 first'
                                  : 'Already registered for this event'
                            }
                          >
                            {isRegisteredForThisEvent ? 'Registered' : 'Register for Event'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <p>No events announced yet. Stay tuned for exciting updates!</p>
        )}
      </section>

      {/* You can add more sections here like Contact, Sponsors, etc. */}
    </main>
  );
}

export default HomePage;