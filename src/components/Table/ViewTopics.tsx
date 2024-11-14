import React, { useState } from 'react';
import './ViewTopics.css';
import TopicModal from './TopicModal';

interface Topic {
    IdTableTopic: number;
    Topic: string;
    Description: string;
    StartTime: string;
    EndTime: string;
    Availabilities: number;
}

interface TopicsModalProps {
    topics: Topic[];
    onClose: () => void;
}

const ViewTopics: React.FC<TopicsModalProps> = ({ topics, onClose }) => {
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);

    const handleTopicClick = (topic: Topic) => {
        console.log('topic clicked', topic);
        setSelectedTopic(topic);
    };

    const handleAddTopic = () => {
        setIsTopicModalOpen(true);
    };

    const handleConfirm = (description: string, startTime: string, endTime: string) => {
        setIsTopicModalOpen(false);
    };

    const onCancel = () => {
        setIsTopicModalOpen(false);
    };

    return (
        <div className="view-topics-modal">
            <div className="topics-modal-content">
                <button className="view-topic-close-button" onClick={onClose}>×</button>
                <h2>Available Topics</h2>
                {selectedTopic ? (
                    <div>
                        <h3>{selectedTopic.Topic}</h3>
                        <p>Description: {selectedTopic.Description}</p>
                        <p>Start Time: {selectedTopic.StartTime}</p>
                        <p>End Time: {selectedTopic.EndTime}</p>
                        <p>Availabilities: {selectedTopic.Availabilities}</p>
                        <button onClick={() => setSelectedTopic(null)}>Back to Topics</button>
                    </div>
                ) : (
                    <ul>
                        {topics.map(topic => (
                            <li key={topic.IdTableTopic} onClick={() => handleTopicClick(topic)}>
                                {topic.Topic}
                            </li>
                        ))}
                        <button className="view-topic-btn" onClick={handleAddTopic}>Add Topic</button>
                    </ul>
                )}
            </div>

            {isTopicModalOpen &&
                <TopicModal onConfirm={handleConfirm} onCancel={onCancel} />
            }
        </div>
    );
};

export default ViewTopics;
