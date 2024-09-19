import React, { useState } from 'react';
import './CreateEvent.css';

const CreateEvent: React.FC = () => {
  const [newEvent, setNewEvent] = useState({
    image: '',
    title: '',
    location: '',
    startDate: '',
    endDate: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  return (
    <div className="create-event-page">
      <h1>Create Event</h1>
      <div className="create-event-inputs">
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={newEvent.image}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newEvent.title}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={newEvent.location}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="startDate"
          placeholder="Start Date"
          value={newEvent.startDate}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="endDate"
          placeholder="End Date"
          value={newEvent.endDate}
          onChange={handleInputChange}
        />
        <button onClick={() => console.log(newEvent)}>Create</button>
      </div>
    </div>
  );
};

export default CreateEvent;
