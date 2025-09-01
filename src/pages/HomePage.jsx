// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db, collection, getDocs, arrayUnion, doc, updateDoc } from '../firebase'; // Ensure 'doc' and 'updateDoc' are imported
import { useAuth } from '../contexts/AuthContext';
import '../styles/HomePage.css'; // Your homepage specific styles

function HomePage() {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true); 
  const [errorEvents, setErrorEvents] = useState(null);
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCollectionRef = collection(db, 'events');
        const eventSnapshot = await getDocs(eventsCollectionRef); // getDocs is used here
        const eventsList = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        eventsList.forEach(event => {
            if (event.date && event.date.toDate) {
                event.date = event.date.toDate();
            } else if (typeof event.date === 'string') {
                event.date = new Date(event.date);
            }
        });

        eventsList.sort((a, b) => {
            const dateA = a.date instanceof Date ? a.date.getTime() : 0;
            const dateB = b.date instanceof Date ? b.date.getTime() : 0;
            return dateA - dateB;
        });

        setEvents(eventsList);
      } catch (err) {
        console.error("Error fetching events:", err);
        setErrorEvents("Failed to load events. Please try again later.");
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  const groupedEvents = events.reduce((acc, event) => {
    if (event.isCanceled) return acc;
    if (!acc[event.type]) {
      acc[event.type] = [];
    }
    acc[event.type].push(event);
    return acc;
  }, {});

  const handleRegisterForEvent = async (eventId, eventName) => {
    if (!currentUser) {
      alert('Please log in to register for events.');
      navigate('/login');
      return;
    }

    // Check if userProfile and auroraTicketId exist
    if (!userProfile?.auroraTicketId) {
      alert('You must register for Aurora 2025 first to join individual events.');
      navigate('/register-aurora');
      return;
    }

    if (userProfile.registeredEvents && userProfile.registeredEvents.includes(eventId)) {
        alert('You are already registered for this event.');
        return;
    }

    try {
      // Update the user's profile with the new registered event
      const userDocRef = doc(db, 'users', currentUser.uid); // Get reference to user's document
      await updateDoc(userDocRef, { // Use updateDoc to add the event ID
        registeredEvents: arrayUnion(eventId)
      });

      // Update local userProfile state immediately
      updateUserProfile(currentUser.uid, { registeredEvents: arrayUnion(eventId) });


      alert(`Successfully registered for ${eventName}!`);

    } catch (error) {
      console.error("Error registering for event:", error);
      alert('An error occurred during event registration.');
    }
  };

  const handleClickBehavior = (event) => {
    if (!currentUser) {
        alert('Please log in to register for events.');
        navigate('/login');
    } else if (!userProfile?.auroraTicketId) {
        alert('You must register for Aurora 2025 first to join individual events.');
        navigate('/register-aurora');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'TBA';
    // Ensure date is a valid Date object
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) { // Check for invalid date
        return 'Invalid Date';
    }
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  return (
    <main className="homepage page-fade-in">
      {/* Hero Section */}
      <section id="hero" className="hero-section">
        <div className="hero-content container">
          <h1 className="animate-hero-text">AURORA'25 : Ignite Your Future!</h1>
          <p className="subtitle animate-hero-text delay-1">Join us for an unforgettable experience of innovation, learning, and connection.</p>
          <Link to="/register-aurora" className="register-button animate-hero-button delay-2">
            Register for Aurora Now!
          </Link>
        </div>
        {/* Scroll Down Indicator */}
        <a href="#about" className="scroll-down-indicator">
            Scroll Down
            <i className="fas fa-chevron-down"></i> {/* Requires Font Awesome or similar icon library */}
        </a>
      </section>

      {/* About Aurora Section */}
      <section id="about" className="about-aurora container common-section">
        <h2>About Aurora</h2>
        <p>
          Aurora is the annual technical and cultural fest of TKM College of Engineering,
          Kollam. It is a celebration of innovation, talent, and creativity, bringing
          together students, professionals, and enthusiasts from across the nation.
          Prepare for thrilling competitions, insightful workshops, captivating performances,
          and a vibrant atmosphere of learning and networking.
        </p>
        <a href="https://drive.google.com/file/d/1zxEWzA1eeCYvGxojC3n-D_PsaQJmNAaS/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="download-brochure-button">
          Download Brochure
        </a>
      </section>

      {/* Events Section - Categorized Display */}
      <section id="events" className="events-section container common-section">
        <h2>Our Events</h2>
        {loadingEvents ? (
          <p className="loading-message">Loading events...</p>
        ) : errorEvents ? (
          <p className="error-message">{errorEvents}</p>
        ) : Object.keys(groupedEvents).length > 0 ? (
          Object.keys(groupedEvents).map(type => (
            <div key={type} className="event-category-section">
              <h3>{type} Events</h3>
              <div className="event-cards-grid">
                {groupedEvents[type].map(event => {
                  const hasAuroraTicket = userProfile?.auroraTicketId;
                  const isRegisteredForThisEvent = userProfile?.registeredEvents?.includes(event.id);

                  const canRegisterDirectly = currentUser && hasAuroraTicket && !isRegisteredForThisEvent;

                  return (
                    <div key={event.id} className="event-card">
                      {event.image && (
                            <img src={event.image} alt={event.name} className="event-card-image" />
                    )}
                      <div className="event-card-content">
                        <h4>{event.name}</h4>
                        <p>Date: {formatDate(event.date)}</p>
                        <p>Location: {event.location || 'Online'}</p>
                        <p>{event.description}</p>
                      </div>
                      <div className="action-area">
                        {event.isCanceled ? (
                            <button className="register-event-button disabled-button" disabled>Canceled</button>
                        ) : (
                            canRegisterDirectly ? (
                                <button
                                    className="register-event-button"
                                    onClick={() => handleRegisterForEvent(event.id, event.name)}
                                >
                                    Register for Event
                                </button>
                            ) : (
                                <button
                                    className="register-event-button"
                                    disabled={isRegisteredForThisEvent}
                                    onClick={isRegisteredForThisEvent ? null : handleClickBehavior}
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
                            )
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

      {/* Schedule Section */}
      <section id="schedule" className="schedule-section container common-section">
        <h2>Event Schedule</h2>
        <p>Get ready for a power-packed few days! Here's a glimpse of what's happening:</p>
        <div className="schedule-grid">
          <div className="schedule-day">
            <h3>Day 1: October 17, 2025</h3>
            <ul>
              <li><strong>04:30 PM - 05:30 PM :- APJ HALL</strong> Inauguration Ceremony</li>
              <li><strong>05:30 PM - 06:30 PM :- APJ HALL</strong> Panel Discussion</li>
            </ul>
          </div>
          <div className="schedule-day">
            <h3>Day 2: October 18, 2025</h3>
            <ul>
              <li><strong>09:00 AM - 12:30 PM :- IDEA Lab</strong> Built a Bot</li>
              <li><strong>09:00 AM - 12:30 PM :- EEE Lab</strong> Electrifying Mobility</li>
              <li><strong>09:00 AM - 12:30 PM :- VLSI Lab</strong> Cadence Workshop</li>
              <li><strong>09:00 AM - 12:30 PM :- Comm. Lab</strong> Volt Craft</li>
              <li><strong>09:00 AM - 12:30 PM :- Room 101 & 105</strong> OHM Sweet OHM</li>
              <li><strong>12:30 PM - 01:30 PM</strong> Lunch Break</li>
              <li><strong>01:30 PM - 04:30 PM :- IDEA Lab</strong> Built a Bot</li>
              <li><strong>01:30 PM - 04:30 PM :- EEE Lab</strong> Electrifying Mobility</li>
              <li><strong>01:30 PM - 04:30 PM :- VLSI Lab</strong> Cadence Workshop</li>
              <li><strong>01:30 PM - 04:30 PM :- Room 101 & 105</strong> OHM Sweet OHM</li>
              <li><strong>05:30 PM - 08:30 PM :- APJ Park</strong> Culturals</li>
            </ul>
          </div>
          <div className="schedule-day">
            <h3>Day 3: October 19, 2025</h3>
            <ul>
              <li><strong>09:00 AM - 12:30 PM :- SS Lab</strong> Cloud Workshop</li>
              <li><strong>09:00 AM - 12:30 PM :- N. EEE Soft. Lab</strong> IOT Workshop</li>
              <li><strong>09:00 AM - 12:30 PM :- APJ Hall</strong> Motovate</li>
              <li><strong>09:00 AM - 12:30 PM :- Room 101 & 105</strong> OHM Sweet OHM</li>
              <li><strong>12:30 PM - 01:30 PM</strong> Lunch Break</li>
              <li><strong>01:30 PM - 04:30 PM :- SS Lab</strong> Cloud Workshop</li>
              <li><strong>01:30 PM - 04:30 PM :- N. EEE Soft. Lab</strong> IOT Workshop</li>
              <li><strong>01:30 PM - 04:30 PM :- Room 101 & 105</strong> OHM Sweet OHM</li>
              <li><strong>01:30 PM - 04:30 PM :- PTA Hall</strong> EmpowerHer</li>
              <li><strong>05:30 PM - 08:30 PM :- APJ Park</strong> Culturals</li>
            </ul>
          </div>
        </div>
        <p className="schedule-note">
          *Please note: The schedule is subject to minor changes. Refer to the event specific pages for detailed timings.
        </p>
      </section>

      {/* Accommodation Section */}
      <section id="accommodation" className="accommodation-section container common-section">
        <h2>Accommodation & Travel</h2>
        <p>
          For outstation participants, we understand the importance of comfortable stay.
          We are pleased to offer information and guidance for accommodation options
          during AURORA 2025.
        </p>
        <div className="accommodation-details">
          <div className="accommodation-option">
            <h3>On-Campus Hostels</h3>
            <p>
              Limited on-campus hostel accommodation is available for registered participants
              on a first-come, first-served basis. Prior registration is mandatory.
              Facilities include shared rooms, common washrooms, and basic amenities.
            </p>
            <p>
              <strong>Availability:</strong> Limited, register early!
            </p>
          </div>
          <div className="accommodation-option">
            <h3>Nearby Hotels/Guesthouses</h3>
            <p>
              A list of recommended hotels and guesthouses near the college campus
              with special rates for AURORA participants will be provided soon.
              These options offer more privacy and a range of amenities.
            </p>
            <p>
              <strong>Contact:</strong> For assistance, please email <a href="mailto:accommodation@aurora.com">accommodation@aurora.com</a>
            </p>
          </div>
        </div>
        <br></br>
        <br />
        <h3>Travel Information</h3>
        <p>
          Our campus is well-connected by public transport. Detailed directions from
          major transit points (e.g., railway station, bus stand) will be updated shortly.
          We encourage participants to use ride-sharing services or local public transport
          for convenience.
        </p>
      </section>

      {/* Google Maps Section */}
      <section id="location" className="location-section container common-section">
        <h2>Find Us</h2>
        <div className="map-container">
          <iframe
            title="Google Maps Location"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3941.622293218647!2d76.6326382!3d8.9146612!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05fd3036020df5%3A0xc3c1007e5232dc27!2sTKM%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1756746190283!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section container common-section">
        <h2>Contact Us</h2>
        <p>Have questions? Reach out to us!</p>
        <p>Email: <a href="mailto:info@aurora.com">info@aurora.com</a></p>
        <p>Phone: +91-96565 85696</p>
      </section>
    </main>
  );
}

export default HomePage;