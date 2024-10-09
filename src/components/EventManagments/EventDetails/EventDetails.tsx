import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useParams } from 'react-router-dom';
import EventService from '../../../services/EventService';
import './EventDetails.css';
import LoadingAnimation from '../../Loading/LoadingAnimation';

// Ensure to bind modal to your appElement (root element)
Modal.setAppElement('#root');

const EventDetails = () => {
    const { id: IdEvent } = useParams<{ id: string }>();
    interface Event {
        IdEvent: number;
        EventName: string;
        Location: string;
        StartDate: Date;
        EndDate: Date;
        EventDescription: string;
        EventOverview: string;
        DateCreated: Date;
        Attachments: any[];
        DateDeleted: Date;
        SaveName: string;
    }

    const [event, setEvent] = useState<Event>({
        IdEvent: 0,
        EventName: '',
        Location: '',
        StartDate: new Date(),
        EndDate: new Date(),
        EventDescription: '',
        EventOverview: '',
        DateCreated: new Date(),
        Attachments: [],
        DateDeleted: new Date(),
        SaveName: '',
    });

    const [isModifiedEventInfo, setIsModifiedEventInfo] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Loading state

    // Speaker states
    const [speakers, setSpeakers] = useState([
        { id: 1, name: 'John Doe', title: 'CEO', image: 'https://via.placeholder.com/100' },
        { id: 2, name: 'Jane Smith', title: 'CTO', image: 'https://via.placeholder.com/100' }
    ]);
    const [selectedSpeaker, setSelectedSpeaker] = useState<null | { id: number; name: string; title: string; image: string; }>(null);

    // Modal states for adding a new speaker
    const [isNewSpeaker, setIsNewSpeaker] = useState(false);
    const [newSpeakerName, setNewSpeakerName] = useState('');
    const [newSpeakerTitle, setNewSpeakerTitle] = useState('');
    const [newSpeakerImage, setNewSpeakerImage] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

    // Fetch event details
    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await EventService.getEventById(Number(IdEvent));
                const data = response.data.My_Result.Event;
                setEvent({
                    ...data,
                    StartDate: new Date(data.StartDate),
                    EndDate: new Date(data.EndDate),
                });
            } catch (error) {
                console.error('Error fetching event details:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEventDetails();
    }, [IdEvent]);

    // Handle input changes for event information
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEvent(prevEvent => ({
            ...prevEvent,
            [name]: value,
        }));
        setIsModifiedEventInfo(true);
    };

    // Handle saving event info
    const handleSaveEventInfo = async () => {
        try {
            const formattedEvent = {
                ...event,
                StartDate: event.StartDate.toISOString().split('T')[0],
                EndDate: event.EndDate.toISOString().split('T')[0],
            };
            await EventService.updateEvent(formattedEvent);
            setIsModifiedEventInfo(false);
            setMessage('Event info saved successfully!');
            setMessageType('success');
        } catch (error) {
            console.error('Error saving event info:', error);
            setMessage('Error saving event info, please try again later.');
            setMessageType('error');
        }

        setTimeout(() => {
            setMessage(null);
            setMessageType(null);
        }, 3000);
    };

    // Handle speaker selection
    const handleSpeakerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === 'new') {
            setIsNewSpeaker(true);
        } else {
            setIsNewSpeaker(false);
            const selected = speakers.find(speaker => speaker.id === parseInt(e.target.value)) || null;
            setSelectedSpeaker(selected);
            if (selected) {
                setMessage(`Selected speaker: ${selected.name}`);
                setMessageType('success');
            }
        }
    };

    // Handle adding a new speaker
    const handleAddNewSpeaker = () => {
        const newSpeaker = {
            id: speakers.length + 1,
            name: newSpeakerName,
            title: newSpeakerTitle,
            image: newSpeakerImage,
        };
        setSpeakers([...speakers, newSpeaker]);
        setIsNewSpeaker(false);
        setNewSpeakerName('');
        setNewSpeakerTitle('');
        setNewSpeakerImage('');
        setMessage('New speaker added successfully!');
        setMessageType('success');
    };

    return (
        <>
            {isLoading ? (
                <div className="loading-container">
                    <LoadingAnimation />
                </div>
            ) : (
                <div className="event-details-container">
                    {/* Event Information */}
                    <div className="event-section">
                        <h2>Event Information</h2>
                        <p>Event Name</p>
                        <input
                            id="EventName"
                            type="text"
                            name="EventName"
                            value={event?.EventName || ''}
                            onChange={handleInputChange}
                        />
                        <p>Location</p>
                        <input
                            id="Location"
                            type="text"
                            name="Location"
                            value={event.Location}
                            onChange={handleInputChange}
                        />
                        <p>Start Date</p>
                        <input
                            id="StartDate"
                            type="date"
                            name="StartDate"
                            value={event?.StartDate ? event.StartDate.toISOString().split('T')[0] : ''}
                            onChange={handleInputChange}
                        />
                        <p>End Date</p>
                        <input
                            id="EndDate"
                            type="date"
                            name="EndDate"
                            value={event?.EndDate ? event.EndDate.toISOString().split('T')[0] : ''}
                            onChange={handleInputChange}
                        />
                        <p>Description</p>
                        <textarea
                            id="EventDescription"
                            name="EventDescription"
                            placeholder="Event Description"
                            value={event?.EventDescription || ''}
                            onChange={handleInputChange}
                        ></textarea>
                        <p>Overview</p>
                        <textarea
                            id="EventOverview"
                            name="EventOverview"
                            placeholder="Event Overview"
                            value={event?.EventOverview || ''}
                            onChange={handleInputChange}
                        ></textarea>
                        <button
                            className="btn btn-primary"
                            onClick={handleSaveEventInfo}
                            disabled={!isModifiedEventInfo}
                        >
                            Save
                        </button>
                    </div>

                    {/* Sponsors and Partners Section */}
                    <div className="event-section">
                        <h2>Sponsors and Partners</h2>
                        <input type="file" multiple />
                        <div className="sponsor-images">
                            <img src="https://via.placeholder.com/100" alt="Sponsor" />
                            <img src="https://via.placeholder.com/100" alt="Sponsor" />
                        </div>
                    </div>

                    {/* Speakers Section */}
                    <div className="event-section">
                        <h2>Speakers</h2>
                        <select onChange={handleSpeakerSelect} value={selectedSpeaker?.id || ''}>
                            <option value="">Select a Speaker</option>
                            {speakers.map(speaker => (
                                <option key={speaker.id} value={speaker.id}>
                                    {speaker.name} - {speaker.title}
                                </option>
                            ))}
                            <option value="new">Add New Speaker</option>
                        </select>

                        {isNewSpeaker && (
                            <Modal
                                isOpen={isNewSpeaker}
                                onRequestClose={() => setIsNewSpeaker(false)}
                                contentLabel="Add New Speaker"
                            >
                                <h2>Add New Speaker</h2>
                                <form onSubmit={(e) => { e.preventDefault(); handleAddNewSpeaker(); }}>
                                    <label>
                                        Name:
                                        <input
                                            type="text"
                                            value={newSpeakerName}
                                            onChange={(e) => setNewSpeakerName(e.target.value)}
                                        />
                                    </label>
                                    <label>
                                        Title:
                                        <input
                                            type="text"
                                            value={newSpeakerTitle}
                                            onChange={(e) => setNewSpeakerTitle(e.target.value)}
                                        />
                                    </label>
                                    <input
                                        type="file"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                setNewSpeakerImage(URL.createObjectURL(e.target.files[0]));
                                            }
                                        }}
                                    />
                                    <button type="submit">Add Speaker</button>
                                    <button type="button" onClick={() => setIsNewSpeaker(false)}>Cancel</button>
                                </form>
                            </Modal>
                        )}

                        {selectedSpeaker && !isNewSpeaker && (
                            <div className="selected-speaker">
                                <img src={selectedSpeaker.image} alt={selectedSpeaker.name} />
                                <p>{selectedSpeaker.name} - {selectedSpeaker.title}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {message && (
                <div className={`message ${messageType}`}>
                    {message}
                </div>
            )}
        </>
    );
}

export default EventDetails;