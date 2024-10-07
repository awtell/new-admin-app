import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingAnimation from '../Loading/LoadingAnimation';
import './EventManagments.css';
import EventService from '../../services/EventService';

interface Events {
    IdEvent: number,
    EventName: string,
    Location: string,
    StartDate: Date,
    EndDate: Date,
    EventDescription: string,
    EventOverview: string,
}

const EventManagments: React.FC = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState<Events[]>([]);
    const [message, setMessage] = useState<string | null>(null);
    const [newEvent, setNewEvent] = useState({
        EventName: '',
        Location: '',
        StartDate: '',
        EndDate: '',
        EventDescription: '',
        EventOverview: '',
    });
    const [showForm, setShowForm] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewEvent({ ...newEvent, [name]: value });
    };

    useEffect(() => {
        document.title = 'Events';
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await EventService.getEvents();
                setEvents(response.data.My_Result);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    useEffect(() => {
        if (!showForm) {
            setNewEvent({
                EventName: '',
                Location: '',
                StartDate: '',
                EndDate: '',
                EventDescription: '',
                EventOverview: '',
            });
        }
    }, [showForm]);
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await EventService.createEvent(newEvent);
            if (response.status === 200) {
                setSnackbarOpen(false);
                setShowForm(false);
                const eventsResponse = await EventService.getEvents();
                setEvents(eventsResponse.data.My_Result);
            } else {
                setMessage('Failed to create event');
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error("Error creating event:", error);
            setMessage('Error creating event');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (event: any) => {
        window.location.href = `/event-managments/${event.IdEvent}`;
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredEvents = Array.isArray(events) ? events.filter(event =>
        event.EventName.toLowerCase().includes(searchTerm) ||
        event.Location.toLowerCase().includes(searchTerm)
    ) : [];

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
                                id='EventName'
                                type="text"
                                name="EventName"
                                placeholder="Event Title"
                                value={newEvent.EventName}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                id='Location'
                                type="text"
                                name="Location"
                                placeholder="Event Location"
                                value={newEvent.Location}
                                onChange={handleInputChange}
                                required
                            />
                            <label>Start Date:</label>
                            <input
                                id='StartDate'
                                type="date"
                                name="StartDate"
                                value={newEvent.StartDate}
                                onChange={handleInputChange}
                                required
                            />
                            <label>End Date:</label>
                            <input
                                id='EndDate'
                                type="date"
                                name="EndDate"
                                value={newEvent.EndDate}
                                onChange={handleInputChange}
                                required
                            />
                            <textarea
                                id='EventDescription'
                                name="EventDescription"
                                placeholder="Event Description"
                                value={newEvent.EventDescription}
                                onChange={handleInputChange}
                                required />
                            <textarea
                                id='EventOverview'
                                name="EventOverview"
                                placeholder="Event Overview"
                                value={newEvent.EventOverview}
                                onChange={handleInputChange}
                                required />

                            <button type="submit" disabled={loading} className="add-event-button">
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
                    <div key={event.IdEvent} className="event-card" onClick={() => handleCardClick(event)}>
                        <h3>{event.EventName}</h3>
                        <p>{event.Location}</p>
                        <p>Start Date: {new Date(event.StartDate).toDateString()}</p>
                        <p>End Date: {new Date(event.EndDate).toDateString()}</p>
                    </div>
                ))}
            </div>

            {snackbarOpen && (
                <div className="snackbar">
                    <p>{message || 'Error: Start date cannot be later than end date.'}</p>
                </div>
            )}
        </div>
    );
};

export default EventManagments;
