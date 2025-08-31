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
  updateDoc,
  query,
  where,
  serverTimestamp
} from '../firebase';
import imageCompression from 'browser-image-compression';
import { convertToCsv, downloadCsv } from '../utils/csvUtils';
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
    location: '',
    type: '',
    image: '',
    isCanceled: false,
  });
  const [editingEventId, setEditingEventId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [imageLoading, setImageLoading] = useState(false);
  const [eventFormLoading, setEventFormLoading] = useState(false);
  const [eventFormError, setEventFormError] = useState(null);
  const [eventFormSuccess, setEventFormSuccess] = useState(null);

  const eventTypes = [
    'Technical', 'Cultural', 'Workshop', 'Gaming', 'Sports', 'Talk', 'Other'
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const usersCollectionRef = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollectionRef);
      const fetchedUsers = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(fetchedUsers); // Store all users for later filtering

      const auroraRegs = fetchedUsers.filter(user => user.auroraTicketId);
      setAuroraRegistrations(auroraRegs);

      const eventsCollectionRef = collection(db, 'events');
      const eventSnapshot = await getDocs(eventsCollectionRef);
      const fetchedEvents = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const eventsWithParticipantCounts = await Promise.all(
        fetchedEvents.map(async (event) => {
          const eventDateForDisplay = event.date && event.date.toDate ? event.date.toDate() : (event.date ? new Date(event.date) : null);
          const q = query(usersCollectionRef, where('registeredEvents', 'array-contains', event.id));
          const registeredUsersSnapshot = await getDocs(q);
          const participantCount = registeredUsersSnapshot.size;

          return {
            ...event,
            date: eventDateForDisplay,
            participantCount: participantCount,
            isCanceled: event.isCanceled || false,
          };
        })
      );
      setEvents(eventsWithParticipantCounts);

    } catch (err) {
      console.error("Error fetching admin data:", err);
      setError("Failed to load admin data. Please try again or check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [isAdmin, navigate]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageLoading(true);
      setNewEvent(prev => ({ ...prev, image: '' }));

      try {
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 800,
          useWebWorker: true
        };
        const compressedFile = await imageCompression(file, options);

        const reader = new FileReader();
        reader.onloadend = () => {
          setNewEvent(prev => ({ ...prev, image: reader.result }));
          setImageLoading(false);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Image compression error:', error);
        alert('Failed to compress image. Please try another image.');
        setNewEvent(prev => ({ ...prev, image: '' }));
        setImageLoading(false);
      }
    } else {
      setNewEvent(prev => ({ ...prev, image: '' }));
    }
  };

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    setEventFormError(null);
    setEventFormSuccess(null);
    setEventFormLoading(true);

    if (!newEvent.name || !newEvent.date || !newEvent.description || !newEvent.type || !newEvent.location) {
      setEventFormError('Please fill all required event details (Name, Date, Description, Location, Type).');
      setEventFormLoading(false);
      return;
    }
    if (!newEvent.image && !editingEventId) {
      setEventFormError('Please upload an event picture.');
      setEventFormLoading(false);
      return;
    }
    if (imageLoading) {
      setEventFormError('Image is still being processed. Please wait.');
      setEventFormLoading(false);
      return;
    }

    try {
      const eventData = {
        name: newEvent.name,
        date: new Date(newEvent.date),
        description: newEvent.description,
        location: newEvent.location,
        type: newEvent.type,
        image: newEvent.image,
        isCanceled: newEvent.isCanceled || false,
      };

      if (editingEventId) {
        const eventDocRef = doc(db, 'events', editingEventId);
        await updateDoc(eventDocRef, {
          ...eventData,
          updatedAt: serverTimestamp()
        });
        setEventFormSuccess('Event updated successfully!');
      } else {
        await addDoc(collection(db, 'events'), {
          ...eventData,
          createdAt: serverTimestamp()
        });
        setEventFormSuccess('Event added successfully!');
      }

      setEditingEventId(null);
      setNewEvent({ name: '', date: '', description: '', location: '', type: '', image: '', isCanceled: false });
      await fetchData();

    } catch (err) {
      console.error('Error saving event:', err);
      setEventFormError('Error saving event: ' + err.message);
    } finally {
      setEventFormLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'events', id));
      alert('Event deleted successfully.');
      await fetchData();
    } catch (err) {
      console.error('Error deleting event:', err);
      alert('Error deleting event: ' + err.message);
    }
  };

  const handleToggleCancelEvent = async (eventId, currentStatus) => {
    const confirmMessage = currentStatus
      ? 'Are you sure you want to RE-ACTIVATE this event?'
      : 'Are you sure you want to CANCEL this event? This will be visible to users.';

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const eventDocRef = doc(db, 'events', eventId);
      await updateDoc(eventDocRef, {
        isCanceled: !currentStatus,
        updatedAt: serverTimestamp(),
      });
      alert(`Event ${!currentStatus ? 'canceled' : 're-activated'} successfully.`);
      await fetchData();
    } catch (err) {
      console.error('Error toggling event cancellation status:', err);
      alert('Error toggling event status: ' + err.message);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEventId(event.id);
    setNewEvent({
      name: event.name,
      date: event.date instanceof Date ? event.date.toISOString().split('T')[0] : '',
      description: event.description,
      location: event.location || '',
      type: event.type,
      image: event.image || '',
      isCanceled: event.isCanceled || false,
    });
    setEventFormError(null);
    setEventFormSuccess(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingEventId(null);
    setNewEvent({ name: '', date: '', description: '', location: '', type: '', image: '', isCanceled: false });
    setEventFormError(null);
    setEventFormSuccess(null);
  };

  const handleAdminLogout = () => {
    logout();
  };

  const handleDownloadParticipants = async (eventId, eventName) => {
    try {
      const participants = users.filter(user => user.registeredEvents && user.registeredEvents.includes(eventId));

      if (participants.length === 0) {
        alert(`No participants found for "${eventName}".`);
        return;
      }

      const headers = [
        'User ID',
        'Name',
        'Email',
        'Phone',
        'College',
        'IEEE Member',
        'Member ID',
        'Aurora Ticket ID',
        'Registration Date'
      ];

      const dataForCsv = participants.map(user => ({
        'User ID': user.id,
        'Name': user.name,
        'Email': user.email,
        'Phone': user.phone || 'N/A',
        'College': user.college || 'N/A',
        'IEEE Member': user.isIEEE ? 'Yes' : 'No',
        'Member ID': user.memberId || 'N/A',
        'Aurora Ticket ID': user.auroraTicketId || 'N/A',
        'Registration Date': user.registeredEventsDates && user.registeredEventsDates[eventId] ? new Date(user.registeredEventsDates[eventId].seconds * 1000).toLocaleDateString('en-IN') : 'N/A'
      }));

      const csvString = convertToCsv(dataForCsv, headers);
      const fileName = `${eventName.replace(/[^a-zA-Z0-9]/g, '_')}_participants.csv`;
      downloadCsv(csvString, fileName);

      alert(`"${eventName}" participant list downloaded successfully.`);
    } catch (err) {
      console.error('Error downloading participant list:', err);
      alert('Failed to download participant list: ' + err.message);
    }
  };

  // NEW FUNCTION: Download Aurora Registrations as CSV
  const handleDownloadAuroraRegistrations = () => {
    try {
      if (auroraRegistrations.length === 0) {
        alert("No Aurora registrations to download.");
        return;
      }

      const headers = [
        'User ID',
        'Full Name',
        'Email',
        'Phone',
        'College',
        'IEEE Member',
        'Member ID',
        'Aurora Ticket ID',
        'Aurora Registration Date'
      ];

      const dataForCsv = auroraRegistrations.map(user => ({
        'User ID': user.id,
        'Full Name': user.name,
        'Email': user.email,
        'Phone': user.phone || 'N/A',
        'College': user.college || 'N/A',
        'IEEE Member': user.isIEEE ? 'Yes' : 'No',
        'Member ID': user.memberId || 'N/A',
        'Aurora Ticket ID': user.auroraTicketId || 'N/A',
        'Aurora Registration Date': user.auroraRegistrationDate && user.auroraRegistrationDate.seconds ? new Date(user.auroraRegistrationDate.seconds * 1000).toLocaleDateString('en-IN') : 'N/A'
      }));

      const csvString = convertToCsv(dataForCsv, headers);
      const fileName = `Aurora_Registrations_${new Date().toLocaleDateString('en-CA').replace(/-/g, '')}.csv`;
      downloadCsv(csvString, fileName);

      alert('Aurora registration list downloaded successfully.');
    } catch (err) {
      console.error('Error downloading Aurora registration list:', err);
      alert('Failed to download Aurora registration list: ' + err.message);
    }
  };


  if (loading) {
    return (
      <main className="admin-dashboard-container container page-fade-in">
        <h2 style={{ textAlign: 'center' }}>Loading Admin Dashboard...</h2>
        <p style={{ textAlign: 'center' }}>Please wait while data loads.</p>
      </main>
    );
  }

  if (!isAdmin || error) {
    return (
      <main className="admin-dashboard-container container page-fade-in">
        <h2 style={{ textAlign: 'center', color: 'red' }}>Access Denied</h2>
        <p className="error-message" style={{ textAlign: 'center' }}>
          {error || "You do not have administrative privileges to access this page."}
        </p>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={handleAdminLogout} className="logout-button">Logout</button>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-dashboard-container container page-fade-in">
      <h2>Admin Dashboard</h2>

      <section className="add-event-section form-card">
        <h3>{editingEventId ? 'Edit Event' : 'Add New Event'}</h3>
        {eventFormError && <p className="error-message">{eventFormError}</p>}
        {eventFormSuccess && <p className="success-message">{eventFormSuccess}</p>}
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
            <label htmlFor="eventLocation">Location</label>
            <input
              type="text"
              id="eventLocation"
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              required
            />
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
            {imageLoading && <p className="loading-message">Compressing image... Please wait.</p>}
            {newEvent.image && !imageLoading && (
              <div className="image-preview">
                <img src={newEvent.image} alt="Event Preview" style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '10px', border: '1px solid #ddd' }} />
                <p>Image Ready</p>
              </div>
            )}
            {!newEvent.image && !imageLoading && editingEventId && (
                <p style={{color: '#888', fontSize: '0.9em'}}>Upload new image to replace existing one, or leave blank to keep current.</p>
            )}
          </div>
          {editingEventId && (
            <div className="form-group">
                <label htmlFor="isCanceled">
                    <input
                        type="checkbox"
                        id="isCanceled"
                        checked={newEvent.isCanceled}
                        onChange={(e) => setNewEvent({ ...newEvent, isCanceled: e.target.checked })}
                    />
                    Mark as Canceled
                </label>
            </div>
          )}
          <button type="submit" disabled={imageLoading || eventFormLoading}>
            {eventFormLoading ? (editingEventId ? 'Updating...' : 'Adding...') : (editingEventId ? 'Update Event' : 'Add Event')}
          </button>
          {editingEventId && (
            <button type="button" onClick={handleCancelEdit} className="cancel-button">Cancel Edit</button>
          )}
        </form>
      </section>

      <section className="event-overview-section form-card">
        <h3>Event Overview & Registrations</h3>
        {events.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Participants</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event.id} className={event.isCanceled ? 'canceled-event-row' : ''}>
                    <td><span className={event.isCanceled ? 'strikethrough-text' : ''}>{event.name}</span></td>
                    <td>{event.date instanceof Date ? event.date.toLocaleDateString('en-IN') : 'N/A'}</td>
                    <td>{event.location || 'N/A'}</td>
                    <td>{event.type}</td>
                    <td>{event.participantCount}</td>
                    <td>{event.isCanceled ? 'Canceled' : 'Active'}</td>
                    <td>
                      <button onClick={() => handleEditEvent(event)} className="edit-button small-button">Edit</button>
                      <button onClick={() => handleDeleteEvent(event.id)} className="delete-button small-button">Delete</button>
                      <button
                        onClick={() => handleToggleCancelEvent(event.id, event.isCanceled)}
                        className={event.isCanceled ? 'reactivate-button small-button' : 'cancel-event-button small-button'}
                      >
                        {event.isCanceled ? 'Re-activate' : 'Cancel Event'}
                      </button>
                      <button
                        onClick={() => handleDownloadParticipants(event.id, event.name)}
                        className="download-button small-button"
                        title="Download Participant List (CSV)"
                      >
                        Download Participants
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No events added yet.</p>
        )}
      </section>

      <section className="registered-users-section form-card">
        <h3>
          Aurora Registrations ({auroraRegistrations.length} Total)
          {/* NEW: Download Aurora Registrations Button */}
          {auroraRegistrations.length > 0 && (
            <button
              onClick={handleDownloadAuroraRegistrations}
              className="download-button small-button"
              style={{ marginLeft: '20px' }}
              title="Download All Aurora Registrations (CSV)"
            >
              Download Aurora List
            </button>
          )}
        </h3>
        {auroraRegistrations.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table">
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
                  <tr key={user.id}><td>{user.id.substring(0, 8)}...</td><td>{user.name}</td><td>{user.email}</td><td>{user.phone || 'N/A'}</td><td>{user.college || 'N/A'}</td><td>{user.isIEEE ? 'Yes' : 'No'}</td><td>{user.memberId || 'N/A'}</td><td>{user.auroraTicketId || 'N/A'}</td><td>{user.auroraRegistrationDate && user.auroraRegistrationDate.seconds ? new Date(user.auroraRegistrationDate.seconds * 1000).toLocaleDateString('en-IN') : 'N/A'}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
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
