import React, { useState } from 'react';
import './TopicModal.css';

interface TopicModalProps {
    onConfirm: (description: string, startTime: string, endTime: string) => void;
    onCancel: () => void;
}

const TopicModal: React.FC<TopicModalProps> = ({ onConfirm, onCancel }) => {
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const handleConfirm = () => {
        onConfirm(description, startTime, endTime);
    };

    return (
        <div className="topic-modal">
            <div className="topic-modal-content">
                <button className="close-button" onClick={onCancel}>×</button>
                <h2>Add Topic</h2>
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
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
                    <button onClick={handleConfirm}>Add Topic</button>
                    <button onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default TopicModal;