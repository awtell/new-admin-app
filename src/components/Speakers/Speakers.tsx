import { useEffect, useState } from 'react';
import ConfirmationModal from '../ConfirmationModal/ConfiramtionModal';
import LoadingAnimation from '../Loading/LoadingAnimation';
import { SpeakerService } from '../../services/SpeakerService';
import './Speakers.css';

const Speakers: React.FC = () => {
    interface Speaker {
        IdSpeaker: number;
        SpeakerName: string;
        SpeakerTitle: string;
        SpeakerImage: string;
    }

    const [speakers, setSpeakers] = useState<Speaker[]>([]);
    const [newSpeaker, setNewSpeaker] = useState<Speaker>({
        IdSpeaker: 0,
        SpeakerName: '',
        SpeakerTitle: '',
        SpeakerImage: '',
    });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [speakerToDelete, setSpeakerToDelete] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
    const [buttonLoading, setButtonLoading] = useState(false);

    useEffect(() => {
        const fetchSpeakers = async () => {
            setLoading(true);
            try {
                const response = await SpeakerService.getAllSpeakers();
                const result = response.data.My_Result;
                if (Array.isArray(result)) {
                    setSpeakers(result);
                } else if (result) {
                    setSpeakers([result]);
                } else {
                    setSpeakers([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSpeakers();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewSpeaker(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewSpeaker(prevState => ({
                    ...prevState,
                    SpeakerImage: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveSpeaker = async (e: React.FormEvent) => {
        e.preventDefault();

        const speakerData = {
            IdSpeaker: newSpeaker.IdSpeaker,
            SpeakerName: newSpeaker.SpeakerName,
            SpeakerTitle: newSpeaker.SpeakerTitle,
            SpeakerImage: newSpeaker.SpeakerImage,
        };

        setButtonLoading(true);
        try {
            if (editingId === null) {
                // Create new speaker
                await SpeakerService.addSpeaker(speakerData);
                setSpeakers([...speakers, speakerData]);
                setMessage('Speaker added successfully.');
                setMessageType('success');
            } else {
                // Edit existing speaker
                await SpeakerService.editEventSpeaker(speakerData);
                const updatedSpeakers = speakers.map(t => {
                    if (t.IdSpeaker === newSpeaker.IdSpeaker) {
                        return { ...newSpeaker };
                    }
                    return t;
                });
                setSpeakers(updatedSpeakers);
                setMessage('Speaker updated successfully.');
                setMessageType('success');
            }
            setEditingId(null);
            setShowForm(false);
        } catch (error) {
            console.error("Error saving speaker:", error);
            setMessage('Error saving speaker.');
            setMessageType('error');
        } finally {
            setButtonLoading(false);
            setTimeout(() => { setMessage(null); setMessageType(null); }, 3000); // Clear message after 3 seconds
        }
    };

    const handleEditSpeaker = (IdSpeaker: number) => {
        const speaker = speakers.find(t => t.IdSpeaker === IdSpeaker);
        if (speaker) {
            setNewSpeaker({ ...speaker });
            setEditingId(IdSpeaker);
            setShowForm(true);
        }
    };

    const handleDeleteTestimonial = (IdSpeaker: number) => {
        if (IdSpeaker !== undefined) {
            setSpeakerToDelete(IdSpeaker);
            setShowConfirmation(true);
        } else {
            console.error('Error: IdSpeaker is undefined');
        }
    };

    const confirmDeleteSpeaker = async () => {
        if (speakerToDelete === null) {
            console.error("Error: No speaker selected for deletion");
            setMessage('Error: No speaker selected for deletion');
            setMessageType('error');
            return;
        }

        setLoading(true);
        const speakerId = Number(speakerToDelete);
        if (isNaN(speakerId)) {
            console.error("Error: speakerToDelete is not a valid number");
            setMessage('Error: Invalid speaker ID');
            setMessageType('error');
            setLoading(false);
            return;
        }
        try {
            await SpeakerService.deleteSpeaker(speakerId);
            const updatedSpeakers = speakers.filter(s => s.IdSpeaker !== speakerId);
            setSpeakers(updatedSpeakers);
            setSpeakerToDelete(null);
            setMessage('Speaker deleted successfully.');
            setMessageType('success');
        } catch (error) {
            console.error("Error deleting speaker:", error);
            setMessage('Error deleting speaker.');
            setMessageType('error');
        } finally {
            setLoading(false);
            setShowConfirmation(false);
            setTimeout(() => { setMessage(null); setMessageType(null); }, 3000); // Clear message after 3 seconds
        }
    };

    const cancelDeleteSpeaker = () => {
        setSpeakerToDelete(null);
        setShowConfirmation(false);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredSpeakers = speakers.filter(speaker =>
        speaker.SpeakerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        speaker.SpeakerTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="testimonial-management">
            <div className="testimonials-header">
                <h1>Speakers</h1>
                <button onClick={() => {
                    setNewSpeaker({ IdSpeaker: 0, SpeakerName: '', SpeakerTitle: '', SpeakerImage: '' });
                    setShowForm(true);
                }}>Create Speaker</button>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search Speaker"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            {message &&
                <div className={`message-bar ${messageType}`}>
                    {message}
                    <button className="close-btn" onClick={() => { setMessage(null); setMessageType(null); }}>×</button>
                </div>}

            <div className="testimonials-grid">
                {speakers.length > 0 ? (
                    filteredSpeakers.map((speaker) => (
                        <div key={speaker.IdSpeaker} className="testimonial-card">
                            <h3>{speaker.SpeakerName}</h3>
                            <p>{speaker.SpeakerTitle}</p>
                            <div className="testimonial-actions">
                                <button onClick={() => handleEditSpeaker(speaker.IdSpeaker)}>Edit</button>
                                <button onClick={() => handleDeleteTestimonial(speaker.IdSpeaker)}>Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No Speakers found.</p>
                )}
            </div>

            {showForm && (
                <div className="speakers-modal">
                    <div className="speakers-modal-content">
                        <span className="speakers-modal-close" onClick={() => setShowForm(false)}>&times;</span>
                        {newSpeaker.SpeakerImage && (
                            <img src={newSpeaker.SpeakerImage} alt="Speaker" />
                        )}
                        <form onSubmit={handleSaveSpeaker}>
                            <input
                                type="text"
                                name="SpeakerName"
                                value={newSpeaker.SpeakerName}
                                onChange={handleInputChange}
                                placeholder="Speaker Name"
                            />
                            <input
                                type="text"
                                name="SpeakerTitle"
                                value={newSpeaker.SpeakerTitle}
                                onChange={handleInputChange}
                                placeholder="Speaker Title"
                            />
                            <input
                                type="file"
                                name="SpeakerImage"
                                onChange={handleImageChange}
                            />
                            <button type="submit" disabled={buttonLoading}>
                                {buttonLoading ? <LoadingAnimation /> : 'Save'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {showConfirmation && (
                <ConfirmationModal
                    message="Are you sure you want to delete this speaker?"
                    onConfirm={confirmDeleteSpeaker}
                    onCancel={cancelDeleteSpeaker}
                />
            )}
        </div>
    );
};

export default Speakers;