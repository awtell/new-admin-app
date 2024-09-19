import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './EventDetails.css';

const EventDetails = () => {
    const location = useLocation();
    const { event } = location.state || {}; // Destructure the event data from the state

    const [eventName, setEventName] = useState(event?.title || '');
    const [locationName, setLocationName] = useState(event?.location || '');
    const [startDate, setStartDate] = useState(event?.startDate || '');
    const [endDate, setEndDate] = useState(event?.endDate || '');

    const [isModifiedEventInfo, setIsModifiedEventInfo] = useState(false);
    const [isModifiedSponsors, setIsModifiedSponsors] = useState(false);
    const [isModifiedSpeakers, setIsModifiedSpeakers] = useState(false);

    const [speakers, setSpeakers] = useState([
        { id: 1, name: 'John Doe', title: 'CEO', image: 'https://via.placeholder.com/50' },
        { id: 2, name: 'Jane Smith', title: 'CTO', image: 'https://via.placeholder.com/50' }
    ]);
    const [selectedSpeaker, setSelectedSpeaker] = useState<null | { id: number; name: string; title: string; image: string; }>(null);
    const [isNewSpeaker, setIsNewSpeaker] = useState(false);
    const [newSpeakerName, setNewSpeakerName] = useState('');
    const [newSpeakerTitle, setNewSpeakerTitle] = useState('');
    const [newSpeakerImage, setNewSpeakerImage] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setIsModifiedEventInfo(true); // Mark event info as modified

        if (name === 'eventName') {
            setEventName(value);
        } else if (name === 'locationName') {
            setLocationName(value);
        } else if (name === 'startDate') {
            setStartDate(value);
        } else if (name === 'endDate') {
            setEndDate(value);
        }
    };

    const handleSaveEventInfo = () => {
        // Save event information logic here
        setIsModifiedEventInfo(false); // Reset modified flag after saving
        alert('Event information saved!');
    };

    const handleSaveSponsors = () => {
        // Save sponsor information logic here
        setIsModifiedSponsors(false);
        alert('Sponsors saved!');
    };

    const handleSaveSpeakers = () => {
        // Save speaker information logic here
        setIsModifiedSpeakers(false);
        alert('Speakers saved!');
    };

    const handleSpeakerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setIsModifiedSpeakers(true); // Mark speakers as modified
        const selectedValue = e.target.value;
        if (selectedValue === 'new') {
            setIsNewSpeaker(true);
            setSelectedSpeaker(null);
        } else {
            setIsNewSpeaker(false);
            const selected = speakers.find(speaker => speaker.id === parseInt(selectedValue));
            setSelectedSpeaker(selected || null);
        }
    };

    const handleAddNewSpeaker = () => {
        // Add new speaker logic here
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
        setIsModifiedSpeakers(false);
        alert('New speaker added!');
    };

    useEffect(() => {
        if (event) {
            setEventName(event.title);
            setLocationName(event.location);
            setStartDate(event.startDate);
            setEndDate(event.endDate);
        }
    }, [event]);

    return (
        <div className="event-details-container">
            {/* Left Section - Event Info */}
            <div className="event-section">
                <h2>Event Information</h2>
                <p>Event Name</p>
                <input
                    type="text"
                    name="eventName"
                    value={eventName}
                    onChange={handleInputChange}
                />
                <p>Location</p>
                <input
                    type="text"
                    name="locationName"
                    value={locationName}
                    onChange={handleInputChange}
                />
                <p>Start Date</p>
                <input
                    type="date"
                    name="startDate"
                    value={startDate}
                    onChange={handleInputChange}
                />
                <p>End Date</p>
                <input
                    type="date"
                    name="endDate"
                    value={endDate}
                    onChange={handleInputChange}
                />
                <p>Description</p>
                <textarea placeholder="Event Description"></textarea>
                <p>Overview</p>
                <textarea placeholder="Event Overview"></textarea>
                <button
                    className="btn btn-primary"
                    onClick={handleSaveEventInfo}
                    disabled={!isModifiedEventInfo}
                >
                    Save
                </button>


            </div>

            {/* Middle Section - Sponsors and Partners */}
            <div className="event-section">
                <h2>Sponsors and Partners</h2>
                <input type="file" multiple onChange={() => setIsModifiedSponsors(true)} />
                <div className="sponsor-images">
                    <img src="https://via.placeholder.com/100" alt="Sponsor" />
                    <img src="https://via.placeholder.com/100" alt="Sponsor" />
                </div>

                {/* Save button */}
                <button
                    className="btn btn-primary"
                    onClick={handleSaveEventInfo}
                    disabled={!isModifiedEventInfo}
                >
                    Save
                </button>

            </div>

            {/* Right Section - Speakers */}
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

                {/* Conditionally show the Add New Speaker form */}
                {isNewSpeaker && (
                    <div className="new-speaker-form">
                        <p>Add New Speaker</p>
                        <input
                            type="text"
                            placeholder="Speaker Name"
                            value={newSpeakerName}
                            onChange={(e) => {
                                setNewSpeakerName(e.target.value);
                                setIsModifiedSpeakers(true); // Mark speakers as modified
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Speaker Title"
                            value={newSpeakerTitle}
                            onChange={(e) => {
                                setNewSpeakerTitle(e.target.value);
                                setIsModifiedSpeakers(true); // Mark speakers as modified
                            }}
                        />
                        <input
                            type="file"
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    setNewSpeakerImage(URL.createObjectURL(e.target.files[0]));
                                    setIsModifiedSpeakers(true); // Mark speakers as modified
                                }
                            }}
                        />
                        <button onClick={handleAddNewSpeaker}>Add Speaker</button>
                    </div>
                )}

                {/* Show selected speaker details if available */}
                {selectedSpeaker && !isNewSpeaker && (
                    <div className="selected-speaker">
                        <img src={selectedSpeaker.image} alt={selectedSpeaker.name} />
                        <p>{selectedSpeaker.name} - {selectedSpeaker.title}</p>
                    </div>
                )}

                {/* Save button */}
                <button
                    className="btn btn-primary"
                    onClick={handleSaveEventInfo}
                    disabled={!isModifiedEventInfo}
                >
                    Save
                </button>

            </div>
        </div>
    );
};

export default EventDetails;
