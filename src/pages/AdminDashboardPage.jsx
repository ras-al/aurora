// src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  db,
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc
} from '../firebase';
import imageCompression from 'browser-image-compression'; // <--- NEW: Import the compression library
import '../styles/DashboardPage.css';
import '../styles/FormPage.css';
import '../styles/AdminDashboard.css';

function AdminDashboardPage() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [auroraRegistrations, setAuroraRegistrations] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    description: '',
    type: '',
    image: '',
  });
  const [editingEventId, setEditingEventId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false); // <--- NEW: State for image compression loading
  const [error, setError] = useState(null);

  const eventTypes = [
    'Technical',
    'Cultural',
    'Workshop',
    'Gaming',
    'Sports',
    'Talk',
    'Other'
  ];

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin-login');
      return;
    }

    const fetchData = async () => {
      try {
        const eventsCollectionRef = collection(db, 'events');
        const eventSnapshot = await getDocs(eventsCollectionRef);
        const eventsList = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(eventsList);

        const usersCollectionRef = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollectionRef);
        const usersList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);

        const auroraRegs = usersList.filter(user => user.auroraTicketId);
        setAuroraRegistrations(auroraRegs);

      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError("Failed to load admin data. Ensure you have admin access.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin, navigate]);

  // <--- MODIFIED: handleImageChange for compression
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageLoading(true); // Start image loading indicator
      try {
        const options = {
          maxSizeMB: 0.5, // Max file size in MB (e.g., 0.5MB = 500KB)
          maxWidthOrHeight: 800, // Max width or height in pixels
          useWebWorker: true // Use a Web Worker for better performance
        };
        const compressedFile = await imageCompression(file, options);
        console.log(`Original image size: ${file.size / 1024 / 1024} MB`);
        console.log(`Compressed image size: ${compressedFile.size / 1024 / 1024} MB`);

        const reader = new FileReader();
        reader.onloadend = () => {
          setNewEvent({ ...newEvent, image: reader.result });
          setImageLoading(false); // End image loading indicator
        };
        reader.readAsDataURL(compressedFile); // Read compressed file as Base64 data URL
      } catch (error) {
        console.error('Image compression error:', error);
        alert('Failed to compress image. Please try another image.');
        setNewEvent({ ...newEvent, image: '' }); // Clear image on error
        setImageLoading(false); // End image loading indicator
      }
    } else {
      setNewEvent({ ...newEvent, image: '' });
    }
  };

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.name || !newEvent.date || !newEvent.description || !newEvent.type) {
      alert('Please fill all event fields, including event type.');
      return;
    }
    if (!newEvent.image) {
      alert('Please upload an event picture.'); // Enforce image upload
      return;
    }
    if (imageLoading) { // Prevent submission if image is still processing
      alert('Image is still being processed. Please wait.');
      return;
    }


    try {
      if (editingEventId) {
        const eventDocRef = doc(db, 'events', editingEventId);
        await updateDoc(eventDocRef, {
          name: newEvent.name,
          date: newEvent.date,
          description: newEvent.description,
          type: newEvent.type,
          image: newEvent.image,
          updatedAt: new Date()
        });
        setEvents(events.map(event =>
          event.id === editingEventId ? { ...newEvent, id: editingEventId } : event
        ));
        setEditingEventId(null);
        alert('Event updated successfully!');
      } else {
        const docRef = await addDoc(collection(db, 'events'), {
          name: newEvent.name,
          date: newEvent.date,
          description: newEvent.description,
          type: newEvent.type,
          image: newEvent.image,
          createdAt: new Date()
        });
        setEvents([...events, { id: docRef.id, ...newEvent }]);
        alert('Event added successfully!');
      }
      setNewEvent({ name: '', date: '', description: '', type: '', image: '' });
    } catch (err) {
      console.error('Error saving event:', err);
      alert('Error saving event: ' + err.message);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'events', id));
      setEvents(events.filter(event => event.id !== id));
      alert('Event deleted successfully.');
    } catch (err) {
      console.error('Error deleting event:', err);
      alert('Error deleting event: ' + err.message);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEventId(event.id);
    setNewEvent({
      name: event.name,
      date: event.date,
      description: event.description,
      type: event.type,
      image: event.image || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingEventId(null);
    setNewEvent({ name: '', date: '', description: '', type: '', image: '' });
  };

  const handleAdminLogout = () => {
      logout();
  }

  if (loading) {
    return <main className="admin-dashboard-container container page-fade-in"><h2>Loading Admin Dashboard...</h2></main>;
  }

  if (error) {
    return <main className="admin-dashboard-container container page-fade-in">
            <p className="error-message">{error}</p>
            <button onClick={handleAdminLogout}>Logout</button>
           </main>;
  }

  return (
    <main className="admin-dashboard-container container page-fade-in">
      <h2>Admin Dashboard</h2>

      <section className="add-event-section form-card">
        <h3>{editingEventId ? 'Edit Event' : 'Add New Event'}</h3>
        <form onSubmit={handleSubmitEvent}>
          <div className="form-group">
            <label htmlFor="eventName">Event Name</label>
            <input
              type="text"
              id="eventName"
              value={newEvent.name}
              onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="eventDate">Event Date</label>
            <input
              type="date"
              id="eventDate"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="eventDescription">Description</label>
            <textarea
              id="eventDescription"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              rows="4"
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="eventType">Event Type</label>
            <select
              id="eventType"
              value={newEvent.type}
              onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
              required
            >
              <option value="">Select a Type</option>
              {eventTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="eventImage">Event Picture</label>
            <input
              type="file"
              id="eventImage"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imageLoading && <p>Compressing image... Please wait.</p>} {/* Loading indicator */}
            {newEvent.image && !imageLoading && ( // Only show preview if not loading and image exists
              <div className="image-preview">
                <img src={newEvent.image} alt="Event Preview" style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '10px', border: '1px solid #ddd' }} />
                <p>Image Ready</p>
              </div>
            )}
            {!newEvent.image && !imageLoading && editingEventId && (
                <p style={{color: '#888', fontSize: '0.9em'}}>Upload new image to replace existing one.</p>
            )}
          </div>
          <button type="submit" disabled={imageLoading}> {/* Disable submit button while image is loading */}
            {editingEventId ? 'Update Event' : 'Add Event'}
          </button>
          {editingEventId && (
            <button type="button" onClick={handleCancelEdit} className="cancel-button">Cancel Edit</button>
          )}
        </form>
      </section>

      <section className="manage-events-section">
        <h3>Manage Events</h3>
        {events.length > 0 ? (
          <ul className="admin-event-list">
            {events.map(event => (
              <li key={event.id} className="admin-event-item">
                <div className="event-details">
                  <h4>{event.name} ({event.type})</h4>
                  <p>Date: {event.date}</p>
                  <p>{event.description}</p>
                  {event.image && (
                      <img src={event.image} alt={event.name} style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} />
                  )}
                </div>
                <div className="event-actions">
                  <button onClick={() => handleEditEvent(event)} className="edit-button">Edit</button>
                  <button onClick={() => handleDeleteEvent(event.id)} className="delete-button">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No events added yet.</p>
        )}
      </section>

      <section className="registered-users-section">
        <h3>Registered Users (Aurora)</h3>
        {auroraRegistrations.length > 0 ? (
          <table className="users-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>College</th>
                <th>IEEE</th>
                <th>Member ID</th>
                <th>Ticket ID</th>
                <th>Reg. Date</th>
              </tr>
            </thead>
            <tbody>
              {auroraRegistrations.map(user => (
                  <tr key={user.id}>
                    <td>{user.id.substring(0, 8)}...</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>{user.college || 'N/A'}</td>
                    <td>{user.isIEEE ? 'Yes' : 'No'}</td>
                    <td>{user.memberId || 'N/A'}</td>
                    <td>{user.auroraTicketId || 'N/A'}</td>
                    <td>{user.auroraRegistrationDate ? new Date(user.auroraRegistrationDate.seconds * 1000).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <p>No users have registered for Aurora yet.</p>
        )}
      </section>

      <section className="dashboard-actions">
        <button onClick={handleAdminLogout} className="logout-button">Logout Admin</button>
      </section>
    </main>
  );
}

export default AdminDashboardPage;