import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingAnimation from '../Loading/LoadingAnimation';
import './EventManagments.css';

const EventManagments: React.FC = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([
        {
            id: 1,
            image: 'https://via.placeholder.com/200x120',
            title: 'Data Science Summit',
            location: 'San Francisco, CA',
            startDate: '2024-09-10',
            endDate: '2024-09-12'
        },
        {
            id: 2,
            image: 'https://via.placeholder.com/200x120',
            title: 'UX Design Conference',
            location: 'New York, NY',
            startDate: '2024-10-05',
            endDate: '2024-10-07'
        },
        {
            id: 3,
            image: 'https://via.placeholder.com/200x120',
            title: 'Product Management Forum',
            location: 'London, UK',
            startDate: '2024-11-01',
            endDate: '2024-11-03'
        },
        {
            id: 4,
            image: 'https://via.placeholder.com/200x120',
            title: 'Software Engineering Symposium',
            location: 'Austin, TX',
            startDate: '2024-09-15',
            endDate: '2024-09-17'
        },
        {
            id: 5,
            image: 'https://via.placeholder.com/200x120',
            title: 'Blockchain Innovators Expo',
            location: 'Miami, FL',
            startDate: '2024-12-01',
            endDate: '2024-12-03'
        }
    ]);

    const [newEvent, setNewEvent] = useState({
        id: 0,
        image: 'https://via.placeholder.com/200x120',
        title: '',
        location: '',
        startDate: '',
        endDate: ''
    });

    const [showForm, setShowForm] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false); // Loading state

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewEvent({ ...newEvent, [name]: value });
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newEvent.startDate > newEvent.endDate) {
            setSnackbarOpen(true);
            setNewEvent({ ...newEvent, startDate: '', endDate: '' }); // Reset dates
            return;
        }
        const newId = events.length > 0 ? Math.max(...events.map(event => event.id)) + 1 : 1;
        setEvents([...events, { ...newEvent, id: newId }]);
        setShowForm(false);
        setNewEvent({ id: 0, image: 'https://via.placeholder.com/200x120', title: '', location: '', startDate: '', endDate: '' });
    };

    const handleAddEvent = () => {
        if (!newEvent.title || !newEvent.location || !newEvent.startDate || !newEvent.endDate) {
            setSnackbarOpen(true);
            setNewEvent({ ...newEvent, startDate: '', endDate: '' }); // Reset dates
            return;
        }
        setLoading(true); // Set loading to true
        const newId = events.length > 0 ? Math.max(...events.map(event => event.id)) + 1 : 1;
        setEvents([...events, { ...newEvent, id: newId }]);
        setShowForm(false);
        setNewEvent({ id: 0, image: 'https://via.placeholder.com/200x120', title: '', location: '', startDate: '', endDate: '' });
        setLoading(false); // Set loading to false after adding event
    };

    const handleCardClick = (event: any) => {
        navigate(`/event-managments/${event.id}`, { state: { event } });
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    // Filtering the events based on search term (by title or location)
    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm) ||
        event.location.toLowerCase().includes(searchTerm)
    );

    return (
        <div className="event-management">
            <div className="events-header">
                <h1>Events</h1>
                <button onClick={() => setShowForm(true)}>Create event</button>
            </div>

            {showForm && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="modal-close" onClick={() => setShowForm(false)}>X</button>
                        <form className="create-event-form" onSubmit={handleFormSubmit}>
                            <input
                                type="text"
                                name="title"
                                placeholder="Event Title"
                                value={newEvent.title}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="location"
                                placeholder="Event Location"
                                value={newEvent.location}
                                onChange={handleInputChange}
                                required
                            />
                            <label>Start Date:</label>
                            <input
                                type="date"
                                name="startDate"
                                value={newEvent.startDate}
                                onChange={handleInputChange}
                                required
                            />
                            <label>End Date:</label>
                            <input
                                type="date"
                                name="endDate"
                                value={newEvent.endDate}
                                onChange={handleInputChange}
                                required
                            />


                            <button onClick={handleAddEvent} disabled={loading} className="add-event-button">
                                {loading ? <LoadingAnimation /> : 'Add Event'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search events"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            <div className="events-grid">
                {filteredEvents.map(event => (
                    <div key={event.id} className="event-card" onClick={() => handleCardClick(event)}>
                        <img src={event.image} alt={event.title} />
                        <h3>{event.title}</h3>
                        <p>{event.location}</p>
                        <p>Start Date: {event.startDate}</p>
                        <p>End Date: {event.endDate}</p>
                    </div>
                ))}
            </div>

            {snackbarOpen && (
                <div className="snackbar">
                    <p>Error: Start date cannot be later than end date.</p>
                    <button onClick={() => setSnackbarOpen(false)}>Close</button>
                </div>
            )}

        </div>
    );
};

export default EventManagments;
