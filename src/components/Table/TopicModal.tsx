import React, { useState } from 'react';
import './TopicModal.css';

interface TopicModalProps {
    onConfirm: (description: string, startTime: string, endTime: string) => void;
    onCancel: () => void;
}

const TopicModal: React.FC<TopicModalProps> = ({ onConfirm, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [availabilities, setAvailabilities] = useState<string[]>([]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const handleConfirm = () => {
        onConfirm(description, startTime, endTime);
    };

    const handleAddAvailability = () => {
        if (startTime && endTime) {
            setAvailabilities([...availabilities, `${startTime} - ${endTime}`]);
            setStartTime(''); // Reset start time input
            setEndTime('');   // Reset end time input
        }
    };

    return (
        <div className="topic-modal">
            <div className="topic-modal-content">
                <button className="close-button" onClick={onCancel}>×</button>
                <h2>Add Topic</h2>
                <div>
                    <label>Title</label>
                    <input
                        id='title'
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description</label>
                    <input
                        id='description'
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Availabilities</label>
                    <div>
                        {availabilities.map((availability, index) => (
                            <div key={index}>{availability}</div>
                        ))}
                    </div>
                </div>

                <div>
                    <label>Start Time</label>
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>End Time</label>
                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                    />
                </div>

                <div className="topic-modal-buttons">
                    <button onClick={handleConfirm}>Save Topic</button>
                    <button onClick={onCancel}>Cancel</button>
                </div>
                <button onClick={handleAddAvailability}>Add Availability</button>
            </div>
        </div>
    );
};

export default TopicModal;
