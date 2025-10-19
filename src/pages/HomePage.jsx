// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db, collection, getDocs, arrayUnion, doc, updateDoc, getDoc } from '../firebase'; // Ensure 'getDoc' is imported
import { useAuth } from '../contexts/AuthContext';
import CountdownTimer from '../components/CountdownTimer';
import '../styles/HomePage.css'; // Your homepage specific styles

function HomePage() {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [errorEvents, setErrorEvents] = useState(null);
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const eventLinks = {
  'lLSkThj6WAYgc4Rn1RMs': 'https://app.makemypass.com/event/motovate?utm_medium=website', 
  'fynj6Ocku5A5QdKmFAJU': 'https://www.google.com/maps/dir//8.9136227,76.6328809',
  'ZzKjrdQLNYj8qbVor7Dt': 'https://www.google.com/maps/dir//8.9138922,76.6322327',
  '6ieaJzl8mglIo74hCDU8': 'https://www.google.com/maps/dir//8.9136227,76.6328809',
  '9irhhtxyhzgTo3GTfxSb': 'https://www.google.com/maps/dir//8.9136227,76.6328809',
  
};

  const fetchEvents = async () => {
    try {
      const eventsCollectionRef = collection(db, 'events');
      const eventSnapshot = await getDocs(eventsCollectionRef);
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

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRegisterForEvent = (eventId) => {
  const specificLink = eventLinks[eventId];
  window.open(specificLink, '_blank', 'noopener,noreferrer');
};

  const formatDate = (date) => {
    if (!date) return 'TBA';
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) {
        return 'Invalid Date';
    }
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get all active events for the scrolling container
  const allActiveEvents = events.filter(event => event.type !== 'Gaming');

  // *** NEW: Filter for gaming events ***
  const gamingEvents = events.filter(event => event.type === 'Gaming');

  // Duplicate the events array for a seamless scrolling animation
  const duplicatedEvents = [...allActiveEvents, ...allActiveEvents];

  // *** NEW: Duplicate the gaming events array ***
  const duplicatedGamingEvents = [...gamingEvents, ...gamingEvents];


  return (
    <main className="homepage page-fade-in">
      {/* Hero Section */}
      <section id="hero" className="hero-section">
        <div className="hero-content container">
          <h1 className="animate-hero-text">AURORA '25 : Ignite Your Future!</h1>
          <p className="subtitle animate-hero-text delay-1">Join us for an unforgettable experience of innovation, learning, and connection.</p>
          
          <button className="register-button animate-hero-button delay-2" disabled>
          Aurora '25 - Registration Closed!
          </button>
          <br />
          <button className="register-button animate-hero-button delay-2" disabled>
              Motovate - Registration Closed!
          </button>
          <div className="countdown-container">
            <p className="event-begins-in">event begins in</p>
            <CountdownTimer targetDate="2025-10-18T08:30:00" />
            <p className="event-dates">18, 19 Oct 2025</p>
          </div>
        </div>
        {/* Scroll Down Indicator */}
        <a href="#about" className="scroll-down-indicator">
            Scroll Down
            <i className="fas fa-chevron-down"></i>
        </a>
      </section>

      {/* About Aurora Section */}
      <section id="about" className="about-aurora container common-section">
        <h2>About Aurora</h2>
        <p>
          Welcome to Aurora 2025 – the flagship technical fest of IEEE SB TKMCE, where creativity meets
technology and innovation knows no bounds. A premier gathering of students, professionals, and tech
enthusiasts. Aurora is a vibrant platform for learning, collaboration, and exploration.
With an exciting lineup of workshops, competitions, expert talks, and project showcases, Aurora brings
together the brightest minds to spark curiosity, challenge intellect, and inspire the next generation of
engineers and innovators. It is a space where groundbreaking ideas come alive, hands-on experience
with emerging technologies is gained, and innovation is celebrated.
Aurora celebrates innovation while connecting participants with industry leaders and emerging
technologies. Step into Aurora 2025—an unforgettable journey where ideas come alive and the future is
shaped
        </p>
        <a href="https://drive.google.com/file/d/1hnwrOU52K0eyb9IyAjlLs75swZ_spn3g/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="download-brochure-button">
          Download Brochure
        </a>
      </section>

      {/* Events Section - HORIZONTAL SCROLLING DISPLAY */}
      <section id="events" className="events-section container common-section">
        <h2>Our Events</h2>
        {loadingEvents ? (
          <p className="loading-message">Loading events...</p>
        ) : errorEvents ? (
          <p className="error-message">{errorEvents}</p>
        ) : allActiveEvents.length > 0 ? (
          <div className="scrolling-wrapper">
            <div className="event-cards-grid">
              {duplicatedEvents.map((event, index) => {
                const isFull = event.limit > 0 && (event.participantCount || 0) >= event.limit;
                
                return (
                  <div key={`${event.id}-${index}`} className="event-card">
                    {event.image && (
                        <img src={event.image} alt={event.name} className="event-card-image" />
                    )}
                    <div className="event-card-content">
                      <h4>{event.name}</h4>
                      <p>{event.id}</p>
                      <p>Date: {formatDate(event.date)}</p>
                      {/* <p>Location: {event.location || 'Online'}</p>  */} 
                      <p>{event.description}</p>
                    </div>
                    <div className="action-area">
                      {event.isCanceled ? (
                        <button className="register-event-button disabled-button" disabled>Event Over</button>
                      ) : isFull ? (
                        <button className="register-event-button disabled-button" disabled>Registration Full</button>
                      ) : (
                        <button
                            className="register-event-button"
                            onClick={() => handleRegisterForEvent(event.id)}
                          >
                            Venue Directions
                          </button>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p>No events announced yet. Stay tuned for exciting updates!</p>
        )}
      </section>
      
      {/* *** NEW: Gaming Events Section *** */}
      <section id="games" className="events-section container common-section">
        <h2>Gaming Events</h2>
        {loadingEvents ? (
          <p className="loading-message">Loading gaming events...</p>
        ) : errorEvents ? (
          <p className="error-message">{errorEvents}</p>
        ) : gamingEvents.length > 0 ? (
          <div className="scrolling-wrapper">
            <div className="event-cards-grid">
              {duplicatedGamingEvents.map((event, index) => {
                const isFull = event.limit > 0 && (event.participantCount || 0) >= event.limit;
                
                return (
                  <div key={`${event.id}-${index}`} className="event-card">
                    {event.image && (
                        <img src={event.image} alt={event.name} className="event-card-image" />
                    )}
                    <div className="event-card-content">
                      <h4>{event.name}</h4>
                      <p>Date: {formatDate(event.date)}</p>
                      <p>{event.description}</p>
                    </div>
                    <div className="action-area">
                      {event.isCanceled ? (
                        <button className="register-event-button disabled-button" disabled>Canceled</button>
                      ) : isFull ? (
                        <button className="register-event-button disabled-button" disabled>Registration Full</button>
                      ) : (
                         <button
                            className="register-event-button"
                            onClick={() => handleRegisterForEvent(event.id)}
                          >
                            Venue Directions
                          </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p>No gaming events announced yet. Stay tuned!</p>
        )}
      </section>

      {/* Schedule Section */}
      <section id="schedule" className="schedule-section container common-section">
        <h2>Event Schedule</h2>
        <p>Get ready for a power-packed few days! Here's a glimpse of what's happening:</p>
        <div className="schedule-grid">
          <div className="schedule-day">
            <h3>Day 1: October 18, 2025</h3>
            <ul>
              <li><strong>08:00 AM</strong> Registration: <a href="https://www.google.com/maps/dir//8.9149014,76.6320905" target="_blank" rel="noopener noreferrer">Front Gate</a></li>
              <li><strong>08:00 AM - 08:30 AM</strong> Breakfast: <a href="https://www.google.com/maps/dir//8.9138922,76.6322327" target="_blank" rel="noopener noreferrer">Auditorium</a></li>
              <li><strong>08:30 AM - 09:30 AM</strong> Inauguration: <a href="https://www.google.com/maps/dir//8.9145782,76.6320864" target="_blank" rel="noopener noreferrer">APJ Hall</a></li>
              <li><strong>09:30 AM - 01:00 PM</strong> Build a Bot: <a href="https://www.google.com/maps/dir//8.9136823,76.63288399999999" target="_blank" rel="noopener noreferrer">IDEA Lab</a></li>
              <li><strong>09:30 AM - 01:00 PM</strong> Cadence Workshop: <a href="https://www.google.com/maps/dir//8.9136,76.631899" target="_blank" rel="noopener noreferrer">VLSI Lab</a></li>
              <li><strong>09:30 AM - 01:00 PM</strong> OHM Sweet OHM: <a href="https://www.google.com/maps/dir//8.9148459,76.6323383" target="_blank" rel="noopener noreferrer">Room 105</a></li>
              <li><strong>10:00 AM - 01:00 PM</strong> Cloud Workshop: <a href="https://www.google.com/maps/dir//8.9141509,76.6323699" target="_blank" rel="noopener noreferrer">System Software Lab</a></li>
              <li><strong>01:00 PM - 02:00 PM</strong> Lunch Break: <a href="https://www.google.com/maps/dir//8.9138922,76.6322327" target="_blank" rel="noopener noreferrer">Auditorium</a></li>
              <li><strong>02:00 PM - 05:00 PM</strong> Build a Bot: <a href="https://www.google.com/maps/dir//8.9136823,76.63288399999999" target="_blank" rel="noopener noreferrer">IDEA Lab</a></li>
              <li><strong>02:00 PM - 05:00 PM</strong> Volt Craft: <a href="https://www.google.com/maps/dir//8.913692,76.631853" target="_blank" rel="noopener noreferrer">DSP Lab</a></li>
              <li><strong>02:00 PM - 05:00 PM</strong> Cloud Workshop: <a href="https://www.google.com/maps/dir//8.9141509,76.6323699" target="_blank" rel="noopener noreferrer">System Software Lab</a></li>
              <li><strong>02:00 PM - 05:00 PM</strong> Cadence Workshop: <a href="https://www.google.com/maps/dir//8.9136,76.631899" target="_blank" rel="noopener noreferrer">VLSI Lab</a></li>
              <li><strong>02:00 PM - 05:00 PM</strong> OHM Sweet OHM: <a href="https://www.google.com/maps/dir//8.9148459,76.6323383" target="_blank" rel="noopener noreferrer">Room 105</a></li>
              <li><strong>05:30 PM - 08:00 PM</strong> Culturals: <a href="https://www.google.com/maps/dir//8.9143816,76.6322686" target="_blank" rel="noopener noreferrer">Basketball Court</a></li>
              <li><strong>08:00 PM - 08:30 PM</strong> Dinner: <a href="https://www.google.com/maps/dir//8.9138922,76.6322327" target="_blank" rel="noopener noreferrer">Auditorium</a></li>
            </ul>
          </div>
          <div className="schedule-day">
            <h3>Day 2: October 19, 2025</h3>
            <ul>
              <li><strong>08:00 AM - 08:45 AM</strong> Breakfast: <a href="https://www.google.com/maps/dir//8.9138922,76.6322327" target="_blank" rel="noopener noreferrer">Auditorium</a></li>
              <li><strong>09:00 AM - 12:30 PM</strong> Electrifying Mobility: <a href="https://www.google.com/maps/dir//8.913692,76.631853" target="_blank" rel="noopener noreferrer">DSP Lab</a></li>
              <li><strong>09:00 AM - 12:30 PM</strong> IOT Workshop: <a href="https://www.google.com/maps/dir//8.9141509,76.6323699" target="_blank" rel="noopener noreferrer">System Software Lab</a></li>
              <li><strong>09:00 AM - 12:30 PM</strong> Motovate: <a href="https://www.google.com/maps/dir//8.9145782,76.6320864" target="_blank" rel="noopener noreferrer">APJ Hall</a></li>
              <li><strong>09:00 AM - 12:30 PM</strong> OHM Sweet OHM : <a href="https://www.google.com/maps/dir//8.9148459,76.6323383" target="_blank" rel="noopener noreferrer">Room 105</a></li>
              <li><strong>12:30 PM - 01:30 PM</strong> Lunch Break: <a href="https://www.google.com/maps/dir//8.9138922,76.6322327" target="_blank" rel="noopener noreferrer">Auditorium</a></li>
              <li><strong>01:30 PM - 04:30 PM</strong> Electrifying Mobility: <a href="https://www.google.com/maps/dir//8.913692,76.631853" target="_blank" rel="noopener noreferrer">DSP Lab</a></li>
              <li><strong>01:30 PM - 04:30 PM</strong> IOT Workshop: <a href="https://www.google.com/maps/dir//8.9141509,76.6323699" target="_blank" rel="noopener noreferrer">System Software Lab</a></li>
              <li><strong>01:30 PM - 04:30 PM</strong> OHM Sweet OHM: <a href="https://www.google.com/maps/dir//8.9148459,76.6323383" target="_blank" rel="noopener noreferrer">Room 105</a></li>
              <li><strong>02:00 PM - 04:00 PM</strong> EmpowerHER: <a href="https://www.google.com/maps/dir//8.9145782,76.6320864" target="_blank" rel="noopener noreferrer">APJ Hall</a></li>
              <li><strong>04:00 PM - 06:00 PM</strong> Culturals: <a href="https://www.google.com/maps/dir//8.9151015,76.6321044" target="_blank" rel="noopener noreferrer">APJ Park</a></li>
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
              Special reduced rates for AURORA participants will be charged!
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
              <strong>Contact:</strong> For assistance, please email <a href="mailto:ieeewebtkm@gmail.com">ieeewebtkm@gmail.com</a>
            </p>
          </div>
        </div>
        <br></br>
        <br />
        <div className="travel-info">
            <h3>Travel Information</h3>
            <p>Our campus is well-connected. Here’s how you can reach TKM College of Engineering, Kollam:</p>
            <div className="travel-options">
                <div className="travel-option">
                    <h4>By Air ✈️</h4>
                    <p>Fly direct to <strong>Thiruvanthapuram (Trivandrum - TRV)</strong> airport which is the nearest airport or to <strong>Kochi (Cochin - COK)</strong> International Airport. TKMCE is about 66 kms from the Thiruvanathapuram Airport and about 170 kms from the Kochi Airport. And take a taxi to Karicode, Kollam.</p>
                </div>
                <div className="travel-option">
                    <h4>By Train 🚆</h4>
                    <p><strong>Kollam Junction (QLN)</strong> railway station is about 7 km from the TKMCE campus. One can also take a train to the nearest local train station <strong>Kilikkollur (KLQ)</strong> from where it is just 2 minutes by walk to the campus.</p>
                </div>
                <div className="travel-option">
                    <h4>By Bus 🚌</h4>
                    <p>From the central Bus station at Kollam, catch any bus going to Kundara, Kottarakara, Punalur or Thenkasi and aboard at Karicode.</p>
                </div>
            </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section id="location" className="location-section container common-section">
        <h2>Find Us</h2>
        <div className="map-container">
        <iframe
            title="Google Maps Location"
            src="https://www.google.com/maps/d/u/1/embed?mid=1pmOiMDDfQcnCG9T4Gu20fUW-1KI4lKs&ehbc=2E312F&noprof=1"
            width="100%"
            height="100%"
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
        <p>Email: <a href="mailto:ieeewebtkm@gmail.com">ieeewebtkm@gmail.com</a></p>
        <p>Phone: +91-96565 85696</p>
      </section>
    </main>
  );
}

export default HomePage;
