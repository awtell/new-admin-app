import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useParams } from 'react-router-dom';
import EventService from '../../../services/EventService';
import './EventDetails.css';
import LoadingAnimation from '../../Loading/LoadingAnimation';
import { PartnerService } from '../../../services/PartnerService';
import { SpeakerService } from '../../../services/SpeakerService';
import ConfirmationModal from '../../ConfirmationModal/ConfiramtionModal';

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

    interface Partner {
        IdEventPartner: number;
        IdEvent: number;
        SaveName: string;
        Attachment1: File | null;

    }

    interface Speaker {
        IdEventSpeaker: number;
        IdEvent: number;
        IdSpeaker: number;
        SpeakerName: string;
        SpeakerTitle: string;
        Attachment: File | null;
        SaveName: string | null;
        DateCreated: Date;
        Deleted: number;
        DateDeleted: Date | null;
        SpeakerImage?: string;
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

    const [partner, setPartner] = useState<Partner>({
        IdEventPartner: 0,
        IdEvent: 0,
        SaveName: '',
        Attachment1: null,
    })



    const [selectedPartner, setSelectedPartner] = useState<Partner[]>([]);
    const [partnerToDelete, setPartnerToDelete] = useState<Partner | null>(null);
    const [isNewPartner, setIsNewPartner] = useState(false);
    const [newSaveName, setNewSaveName] = useState('');
    const [newAttachment1, setNewAttachment1] = useState<File | null>(null);
    const [isSavingPartner, setIsSavingPartner] = useState(false);
    const [isCreatingPartner, setIsCreatingPartner] = useState(false);

    const [speakers, setSpeakers] = useState<Speaker[]>([]);
    const [selectedSpeakers, setSelectedSpeakers] = useState<Speaker[]>([]);
    const [newSpeakerName, setNewSpeakerName] = useState('');
    const [newSpeakerTitle, setNewSpeakerTitle] = useState('');
    const [newSpeakerImage, setNewSpeakerImage] = useState<File | null>(null);
    const [isNewSpeaker, setIsNewSpeaker] = useState(false);
    const [speakerToDelete, setSpeakerToDelete] = useState<Speaker | null>(null);
    const [isCreatingSpeaker, setIsCreatingSpeaker] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [isSavingEventInfo, setIsSavingEventInfo] = useState(false);
    const [isSavingSpeakers] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const eventResponse = await EventService.getEventById(Number(IdEvent));
                const eventData = eventResponse.data.My_Result.Event;
                setEvent({ ...eventData, StartDate: new Date(eventData.StartDate), EndDate: new Date(eventData.EndDate) });


                const speakersResponse = await SpeakerService.getAllSpeakers();
                setSpeakers(speakersResponse.data.My_Result);
                const selectedSpeakersData = eventResponse.data.My_Result.Speakers;
                setSelectedSpeakers(selectedSpeakersData || []);

                const partnerResponse = eventResponse.data.My_Result.Partners;

                const partnersData = partnerResponse.map((partner: any) => ({
                    SaveName: partner.SaveName,
                    IdEventPartner: partner.IdEventPartner,
                }));
                setSelectedPartner(partnersData);
                setMessageType('success');
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }

            setTimeout(() => { setMessage(null); setMessageType(null); }, 3000);
        };
        fetchData();
    }, [IdEvent]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEvent(prevEvent => ({ ...prevEvent, [name]: value }));
    };

    const handleSaveEventInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingEventInfo(true);
        try {
            const formattedEvent = { ...event, StartDate: event.StartDate.toISOString().split('T')[0], EndDate: event.EndDate.toISOString().split('T')[0] };
            await EventService.updateEvent(formattedEvent);
            setMessage('Event info saved successfully!');
            setMessageType('success');
        } catch (error) {
            console.error('Error saving event info:', error);
            setMessage('Error saving event info, please try again later.');
            setMessageType('error');
        } finally {
            setIsSavingEventInfo(false);
        }

        setTimeout(() => { setMessage(null); setMessageType(null); }, 3000);
    };


    const handleSpeakerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        if (selectedId === 'new') {
            setIsNewSpeaker(true);
        } else {
            setIsNewSpeaker(false);
            const selected = speakers.find(speaker => speaker.IdSpeaker === Number(selectedId));
            if (selected) {
                setSelectedSpeakers(prev => [...prev, selected]);
            }
        }
    };

    const handlePartnerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        if (selectedId === 'new') {
            setIsNewPartner(true);
        } else {
            setIsNewPartner(false);
            const selected = selectedPartner.find(partner => partner.IdEventPartner === Number(selectedId));
            if (selected) {
                setSelectedPartner([selected]);
            }
        }
    }


    const handleSaveEventSpeaker = async (IdSpeaker: number, IdEvent: number) => {
        try {
            const response = await SpeakerService.addEventSpeaker(IdSpeaker, IdEvent);
            if (response && response.status === 200) {
                setMessage('Speaker added successfully.');
                setMessageType('success');
                const addedSpeaker = speakers.find(speaker => speaker.IdSpeaker === IdSpeaker);
                if (addedSpeaker) {
                    setSelectedSpeakers(prev => [...prev, addedSpeaker]);
                }
            }
        } catch (error) {
            console.error("Error adding speaker to event:", error);
            setMessage('Error adding speaker. Please try again later.');
            setMessageType('error');
        }
    };

    const handleSaveEventPartner = async (Attachments: any, IdEvent: number) => {
        try {
            const response = await PartnerService.insertPartner(Attachments, IdEvent);
            if (response && response.status === 200) {
                setMessage('Partner added successfully.');
                setMessageType('success');
                // const addedPartner = partner.find(partner => partner.IdEventPartner === IdEvent);
                // if (addedPartner) {
                //     setSelectedPartner(addedPartner);
                // }
            }
        } catch (error) {
            console.error("Error adding partner to event:", error);
            setMessage('Error adding partner. Please try again later.');
            setMessageType('error');
        }
    }

    const handleRemoveSpeaker = (speaker: Speaker) => {
        if (speaker.IdEventSpeaker) {
            setSpeakerToDelete(speaker);
            setIsConfirmationModalOpen(true);
        } else {
            setSelectedSpeakers(prev => prev.filter(s => s.IdSpeaker !== speaker.IdSpeaker));
        }
    };

    const handleRemovePartner = (partner: Partner) => {
        if (partner.IdEventPartner) {
            setPartnerToDelete(partner);
            setIsConfirmationModalOpen(true);
        }
        else {
            // setSelectedPartner(null);
        }
    }

    const confirmRemovePartner = async () => {
        if (!partnerToDelete) return;

        try {
            const response = await PartnerService.deletePartner(partnerToDelete.IdEventPartner);
            if (response && response.status === 200) {
                setMessage('Partner removed successfully.');
                setMessageType('success');
                // setSelectedPartner(null);
            }
        } catch (error) {
            console.error('Error removing partner from event:', error);
            setMessage('Error removing partner, please try again later.');
            setMessageType('error');
        } finally {
            setIsConfirmationModalOpen(false);
            setPartnerToDelete(null);
        }
    }


    const confirmRemoveSpeaker = async () => {
        if (!speakerToDelete) return;

        try {
            const response = await SpeakerService.deleteEventSpeaker(speakerToDelete.IdEventSpeaker);
            if (response && response.status === 200) {
                setMessage('Speaker removed successfully.');
                setMessageType('success');
                setSelectedSpeakers(prev => prev.filter(speaker => speaker.IdEventSpeaker !== speakerToDelete.IdEventSpeaker));
            }
        } catch (error) {
            console.error('Error removing speaker from event:', error);
            setMessage('Error removing speaker, please try again later.');
            setMessageType('error');
        } finally {
            setIsConfirmationModalOpen(false);
            setSpeakerToDelete(null);
        }
    };

    const handleCreateSpeaker = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreatingSpeaker(true);
        const formData = new FormData();
        formData.append('IdEvent', event.IdEvent.toString());
        formData.append('SpeakerName', newSpeakerName);
        formData.append('SpeakerTitle', newSpeakerTitle);

        if (newSpeakerImage) {
            formData.append('SpeakerImage', newSpeakerImage);
        }
        try {
            const response = await SpeakerService.addSpeaker(formData);
            if (response.status === 200) {
                const newSpeaker = response.data;
                setSpeakers([...speakers, newSpeaker]);
                setIsNewSpeaker(false);
                setMessage('Speaker created successfully!');
                setMessageType('success');
                // Refetch data to update the list of speakers
                const speakersResponse = await SpeakerService.getAllSpeakers();
                setNewSpeakerName('');
                setNewSpeakerTitle('');
                setNewSpeakerImage(null);
                setSpeakers(speakersResponse.data.My_Result);
            } else {
                setMessage('Failed to create speaker.');
                setMessageType('error');
            }
        } catch (error) {
            setMessage('Error creating speaker.');
            setMessageType('error');
        } finally {
            setIsCreatingSpeaker(false);
        }
    };

    // const handleCreatePartner = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     setIsSavingPartner(true);
    //     const formData = new FormData();
    //     formData.append('IdEvent', event.IdEvent.toString());
    //     formData.append('SaveName', selectedPartner?.SaveName || '');

    //     if (selectedPartner?.Attachment1) {
    //         formData.append('Attachment1', selectedPartner.Attachment1);
    //     }

    //     try {
    //         const response = await PartnerService.insertPartner(formData, event.IdEvent);
    //         if (response.status === 200) {
    //             const newPartner = response.data;
    //             setPartner([...partner, newPartner]);
    //             setSelectedPartner(newPartner);
    //             setMessage('Partner created successfully!');
    //             setMessageType('success');
    //             // Refetch data to update the list of partners
    //             const partnerResponse = await PartnerService.getPartners();
    //             setPartner(partnerResponse.data.My_Result);
    //         } else {
    //             setMessage('Failed to create partner.');
    //             setMessageType('error');
    //         }
    //     } catch (error) {
    //         setMessage('Error creating partner.');
    //         setMessageType('error');
    //     } finally {
    //         setIsSavingPartner(false);
    //     }
    // }


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
                        <form onSubmit={handleSaveEventInfo}>
                            <label>Event Name</label>
                            <input type="text" name="EventName" value={event.EventName} onChange={handleInputChange} />

                            <label>Location</label>
                            <input type="text" name="Location" value={event.Location} onChange={handleInputChange} />

                            <label>Start Date</label>
                            <input type="date" name="StartDate" value={event.StartDate.toISOString().split('T')[0]} onChange={handleInputChange} />

                            <label>End Date</label>
                            <input type="date" name="EndDate" value={event.EndDate.toISOString().split('T')[0]} onChange={handleInputChange} />

                            <label>Description</label>
                            <textarea name="EventDescription" value={event.EventDescription} onChange={handleInputChange}></textarea>

                            <label>Overview</label>
                            <textarea name="EventOverview" value={event.EventOverview} onChange={handleInputChange}></textarea>

                            <button className="btn" type="submit" disabled={isSavingEventInfo}>
                                {isSavingEventInfo ? <LoadingAnimation /> : 'Save'}
                            </button>
                        </form>
                    </div>

                    {/* Sponsors and Partners */}
                    <div className="event-section">
                        <h2>Partners</h2>
                        <select onChange={handlePartnerSelect}>
                            <option value="">Select Partner</option>
                            <option value="new">Add New Partner</option>
                            {selectedPartner
                                .sort((a, b) => a.SaveName.localeCompare(b.SaveName))
                                .map(partner => (
                                    <option key={partner.IdEventPartner} value={partner.IdEventPartner}>{partner.SaveName}</option>
                                ))}
                        </select>

                        <div className="partners-list" style={{ textAlign: 'center' }}>
                            {selectedPartner.map((partner) => (
                                <div key={partner.IdEventPartner} className="selected-partner" style={{ display: 'inline-block', margin: '10px', position: 'relative' }}>
                                    <div style={{ position: 'relative', display: 'inline-block' }}>
                                        <img src="https://via.placeholder.com/150" alt={partner.SaveName} style={{ display: 'block', margin: '0 auto' }} />
                                        <button onClick={() => handleRemovePartner(partner)} className="remove-partner-btn">×</button>
                                    </div>
                                    <p>{partner.SaveName}</p>
                                </div>
                            ))}
                        </div>

                        {isNewPartner && (
                            <div className="new-partner-form">
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSaveEventPartner(newAttachment1, event.IdEvent);
                                }}>
                                    <label>Partner Save Name</label>
                                    <input
                                        type="text"
                                        value={newSaveName}
                                        onChange={(e) => setNewSaveName(e.target.value)}
                                    />
                                    <label>Partner Attachment</label>
                                    <input
                                        type="file"
                                        onChange={(e) => setNewAttachment1(e.target.files?.[0] || null)}
                                    />
                                    <button className="btn" type="submit" disabled={isSavingPartner}>
                                        {isSavingPartner ? <LoadingAnimation /> : 'Create Partner'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {!isNewPartner && selectedPartner.length > 0 && (
                            <button className="btn" onClick={() => selectedPartner.forEach(partner => handleSaveEventPartner(partner.Attachment1, event.IdEvent))} disabled={isSavingPartner}>
                                {isSavingPartner ? <LoadingAnimation /> : 'Save All Partners'}
                            </button>
                        )}
                    </div>


                    {/* Speakers Section */}
                    <div className="event-section">
                        <h2>Speakers</h2>
                        <select onChange={handleSpeakerSelect}>
                            <option value="">Select Speaker</option>
                            <option value="new">Add New Speaker</option>
                            {speakers
                                .filter(speaker => !selectedSpeakers.some(s => s.IdSpeaker === speaker.IdSpeaker)) // Exclude assigned speakers
                                .slice()
                                .filter(speaker => speaker.SpeakerName) // Ensure SpeakerName is defined
                                .sort((a, b) => a.SpeakerName.localeCompare(b.SpeakerName))
                                .map(speaker => (
                                    <option key={speaker.IdSpeaker} value={speaker.IdSpeaker}>{speaker.SpeakerName}</option>
                                ))}
                        </select>
                        <div className="speakers-list" style={{ textAlign: 'center' }}>
                            {selectedSpeakers.map(speaker => (
                                <div key={speaker.IdSpeaker} className="selected-speaker" style={{ display: 'inline-block', margin: '10px', position: 'relative' }}>
                                    <div style={{ position: 'relative', display: 'inline-block' }}>
                                        <img src="https://via.placeholder.com/150" alt={speaker.SpeakerName} style={{ display: 'block', margin: '0 auto' }} />
                                        <button onClick={() => handleRemoveSpeaker(speaker)} className="remove-speaker-btn">×</button>
                                    </div>
                                    <p>  {`${speaker.SpeakerName}`} <br /> {`${speaker.SpeakerTitle}`}</p>
                                </div>
                            ))}
                        </div>
                        {!isNewSpeaker && selectedSpeakers.length > 0 && (
                            <button className="btn" onClick={() => selectedSpeakers.forEach(speaker => handleSaveEventSpeaker(speaker.IdSpeaker, event.IdEvent))} disabled={isSavingSpeakers}>
                                {isSavingSpeakers ? <LoadingAnimation /> : 'Save All Speakers'}
                            </button>
                        )}

                        {isNewSpeaker && (
                            <div className="new-speaker-form">
                                <form onSubmit={handleCreateSpeaker}>
                                    <label>Speaker Name</label>
                                    <input
                                        type="text"
                                        value={newSpeakerName}
                                        onChange={(e) => setNewSpeakerName(e.target.value)}
                                    />
                                    <label>Speaker Title</label>
                                    <input
                                        type="text"
                                        value={newSpeakerTitle}
                                        onChange={(e) => setNewSpeakerTitle(e.target.value)}
                                    />
                                    <label>Speaker Image</label>
                                    <input
                                        type="file"
                                        onChange={(e) => setNewSpeakerImage(e.target.files?.[0] || null)}
                                    />
                                    <button className="btn" type="submit" disabled={isCreatingSpeaker}>
                                        {isCreatingSpeaker ? <LoadingAnimation /> : 'Create Speaker'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {message && (
                <div className={`message-bar ${messageType}`}>
                    {message}
                    <button className="close-btn" onClick={() => { setMessage(null); setMessageType(null); }}>×</button>
                </div>
            )}
            {isConfirmationModalOpen && speakerToDelete && (
                <ConfirmationModal
                    message="Are you sure you want to delete this speaker?"
                    onConfirm={confirmRemoveSpeaker}
                    onCancel={() => setIsConfirmationModalOpen(false)}
                />
            )}
            {isConfirmationModalOpen && partnerToDelete && (
                <ConfirmationModal
                    message="Are you sure you want to delete this partner?"
                    onConfirm={confirmRemovePartner}
                    onCancel={() => setIsConfirmationModalOpen(false)}
                />
            )}
        </>
    );
}

export default EventDetails;