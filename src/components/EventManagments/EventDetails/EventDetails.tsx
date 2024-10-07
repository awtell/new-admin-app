import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import EventService from '../../../services/EventService';
import './EventDetails.css';

const EventDetails = () => {
    const { id: IdEvent } = useParams<{ id: string }>();
    interface Event {
        IdEvent: number,
        EventName: string,
        Location: string,
        StartDate: Date,
        EndDate: Date,
        EventDescription: string,
        EventOverview: string,
    }

    const [event, setEvent] = useState<Event>({
        IdEvent: 0,
        EventName: '',
        Location: '',
        StartDate: new Date(),
        EndDate: new Date(),
        EventDescription: '',
        EventOverview: '',
    });


    const [isModifiedEventInfo, setIsModifiedEventInfo] = useState(false);


    const [speakers, setSpeakers] = useState([
        { id: 1, name: 'John Doe', title: 'CEO', image: 'https://via.placeholder.com/100' },
        { id: 2, name: 'Jane Smith', title: 'CTO', image: 'https://via.placeholder.com/100' }
    ]);
    const [selectedSpeaker, setSelectedSpeaker] = useState<null | { id: number; name: string; title: string; image: string; }>(null);
    const [isNewSpeaker, setIsNewSpeaker] = useState(false);
    const [newSpeakerName, setNewSpeakerName] = useState('');
    const [newSpeakerTitle, setNewSpeakerTitle] = useState('');
    const [newSpeakerImage, setNewSpeakerImage] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);


    const handleSaveEventInfo = async () => {
        try {
            const formattedEvent = {
                ...event,
                StartDate: event.StartDate.toISOString().split('T')[0],
                EndDate: event.EndDate.toISOString().split('T')[0]
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
        }, 3000); // Hide the message after 3 seconds
    };

    const handleSpeakerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setIsNewSpeaker(false);
        const selected = speakers.find(speaker => speaker.id === parseInt(e.target.value)) || null;
        setSelectedSpeaker(selected);
        if (selected) {
            setMessage(`Selected speaker: ${selected.name}`);
            setMessageType('success');
        }
    };

    const handleAddNewSpeaker = () => {
        const newSpeaker = {
            id: speakers.length + 1,
            name: newSpeakerName,
            title: newSpeakerTitle,
            image: newSpeakerImage
        };
        setSpeakers([...speakers, newSpeaker]);
        setIsNewSpeaker(false);
        setNewSpeakerName('');
        setNewSpeakerTitle('');
        setNewSpeakerImage('');
        alert('New speaker added!');
    };

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await EventService.getEventById(Number(IdEvent));
                const data = response.data.My_Result.Event;
                console.log(response.data.My_Result.Event);
                setEvent({
                    ...data,
                    StartDate: new Date(data.StartDate),
                    EndDate: new Date(data.EndDate)
                });
            } catch (error) {
                console.error('Error fetching event details:', error);
            }
        };


        fetchEventDetails();

    }, [IdEvent]);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEvent(prevEvent => ({
            ...prevEvent,
            [name]: value
        }));
        setIsModifiedEventInfo(true);
    };
    return (
        <>

            <div className="event-details-container">
                <div className="event-section">
                    <h2>Event Information</h2>
                    <p>Event Name</p>
                    <input
                        id='EventName'
                        type="text"
                        name="EventName"
                        value={event?.EventName || ''}
                        onChange={handleInputChange}
                    />
                    <p>Location</p>
                    <input
                        id='Location'
                        type="text"
                        name="Location"
                        value={event.Location}
                        onChange={handleInputChange}
                    />
                    <p>Start Date</p>
                    <input
                        id='StartDate'
                        type="date"
                        name="StartDate"
                        value={event?.StartDate ? event.StartDate.toISOString().split('T')[0] : ''}
                        onChange={handleInputChange}
                    />
                    <p>End Date</p>
                    <input
                        id='EndDate'
                        type="date"
                        name="endDate"
                        value={event?.EndDate ? event.EndDate.toISOString().split('T')[0] : ''}
                        onChange={handleInputChange}
                    />
                    <p>Description</p>
                    <textarea
                        id='EventDescription'
                        name="EventDescription"
                        placeholder="Event Description"
                        value={event?.EventDescription || ''}
                        onChange={handleInputChange}
                    ></textarea>
                    <p>Overview</p>
                    <textarea
                        id='EventOverview'
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

                <div className="event-section">
                    <h2>Sponsors and Partners</h2>
                    <input type="file" multiple />
                    <div className="sponsor-images">
                        <img src="https://via.placeholder.com/100" alt="Sponsor" />
                        <img src="https://via.placeholder.com/100" alt="Sponsor" />
                    </div>
                </div>

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
                        <div className="new-speaker-form">
                            <p>Add New Speaker</p>
                            <input
                                type="text"
                                placeholder="Speaker Name"
                                value={newSpeakerName}
                                onChange={(e) => setNewSpeakerName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Speaker Title"
                                value={newSpeakerTitle}
                                onChange={(e) => setNewSpeakerTitle(e.target.value)}
                            />
                            <input
                                type="file"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        setNewSpeakerImage(URL.createObjectURL(e.target.files[0]));
                                    }
                                }}
                            />
                            <button onClick={handleAddNewSpeaker}>Add Speaker</button>
                        </div>
                    )}

                    {selectedSpeaker && !isNewSpeaker && (
                        <div className="selected-speaker">
                            <img src={selectedSpeaker.image} alt={selectedSpeaker.name} />
                            <p>{selectedSpeaker.name} - {selectedSpeaker.title}</p>
                        </div>
                    )}
                </div>
            </div>
            {message && (
                <div className={`message-bar ${messageType}`}>
                    {message}
                    <button className="close-btn" onClick={() => setMessage(null)}>✖</button>
                </div>
            )}
        </>
    );
};

export default EventDetails;