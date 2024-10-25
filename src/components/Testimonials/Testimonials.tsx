import { useEffect, useState } from 'react';
import TestimonialsService from '../../services/TestimonialService';
import ConfirmationModal from '../ConfirmationModal/ConfiramtionModal';
import './Testimonials.css';
import LoadingAnimation from '../Loading/LoadingAnimation';

const Testimonials: React.FC = () => {
    interface Testimonial {
        IdTestimonial: number;
        TestimonialName: string;
        TestimonialTitle: string;
        TestimonialDetails: string;
    }

    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [newTestimonial, setNewTestimonial] = useState<Testimonial>({
        IdTestimonial: 0,
        TestimonialName: '',
        TestimonialTitle: '',
        TestimonialDetails: ''
    });
    const [initialTestimonial, setInitialTestimonial] = useState<Testimonial | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [testimonialToDelete, setTestimonialToDelete] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
    const [buttonLoading, setButtonLoading] = useState(false);

    useEffect(() => {
        document.title = "Testimonials Management";
        const fetchTestimonials = async () => {
            setLoading(true);
            try {
                const response = await TestimonialsService.getTestimonials();
                setTestimonials(response.data.My_Result);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewTestimonial({ ...newTestimonial, [name]: value });
    };

    const handleAddTestimonial = async () => {
        setButtonLoading(true);
        try {
            const response = await TestimonialsService.insertTestimonial(newTestimonial);
            if (response.status === 200) {
                setMessage('Testimonial added successfully.');
                setMessageType('success');
                setShowForm(false);
                setTestimonials([...testimonials, newTestimonial]);
            } else {
                setMessage('Failed to add testimonial.');
                setMessageType('error');
            }
        } catch (error) {
            console.error("Error inserting testimonial:", error);
            setMessage('Error inserting testimonial.');
            setMessageType('error');
        } finally {
            setButtonLoading(false);
            setTimeout(() => { setMessage(null); setMessageType(null); }, 3000); // Clear message after 3 seconds
        }
    };

    const handleEditTestimonial = (IdTestimonial: number) => {
        const testimonial = testimonials.find(t => t.IdTestimonial === IdTestimonial);
        if (testimonial) {
            setNewTestimonial({ ...testimonial });
            setInitialTestimonial({ ...testimonial });
            setEditingId(IdTestimonial);
            setShowForm(true);
        }
    };

    const handleSaveTestimonial = () => {
        setButtonLoading(true);
        TestimonialsService.editTestimonial(newTestimonial)
            .then(() => {
                const updatedTestimonials = testimonials.map(t => {
                    if (t.IdTestimonial === newTestimonial.IdTestimonial) {
                        return { ...newTestimonial };
                    }
                    return t;
                });
                setTestimonials(updatedTestimonials);
                setEditingId(null);
                setShowForm(false);
                setMessage('Testimonial updated successfully.');
                setMessageType('success');
            })
            .catch(error => {
                console.error("Error updating testimonial:", error);
                setMessage('Error updating testimonial.');
                setMessageType('error');
            })
            .finally(() => {
                setButtonLoading(false);
                setTimeout(() => { setMessage(null); setMessageType(null); }, 3000); // Clear message after 3 seconds
            });
    };

    const handleDeleteTestimonial = (IdTestimonial: number) => {
        if (IdTestimonial !== undefined) {
            setTestimonialToDelete(IdTestimonial);
            setShowConfirmation(true);
        } else {
            console.error('Error: IdTestimonial is undefined');
        }
    };

    const confirmDeleteTestimonial = () => {
        if (testimonialToDelete) {
            setButtonLoading(true);
            TestimonialsService.deleteTestimonial(testimonialToDelete)
                .then(() => {
                    setTestimonials(testimonials.filter(t => t.IdTestimonial !== testimonialToDelete));
                    setTestimonialToDelete(null);
                    setShowConfirmation(false);
                    setMessage('Testimonial deleted successfully.');
                    setMessageType('success');
                })
                .catch(error => {
                    console.error("Error deleting testimonial:", error);
                    setMessage('Error deleting testimonial.');
                    setMessageType('error');
                })
                .finally(() => {
                    setButtonLoading(false);
                    setTimeout(() => { setMessage(null); setMessageType(null); }, 3000); // Clear message after 3 seconds
                });
        }
    };

    const cancelDeleteTestimonial = () => {
        setTestimonialToDelete(null);
        setShowConfirmation(false);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const isFormClean = () => {
        return !!(
            initialTestimonial &&
            newTestimonial.TestimonialName === initialTestimonial.TestimonialName &&
            newTestimonial.TestimonialTitle === initialTestimonial.TestimonialTitle &&
            newTestimonial.TestimonialDetails === initialTestimonial.TestimonialDetails
        );
    };

    const filteredTestimonials = testimonials.filter(testimonial =>
        testimonial.TestimonialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.TestimonialTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.TestimonialDetails.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="testimonial-management">
            {loading && <LoadingAnimation />}
            <div className="testimonials-header">
                <h1>Testimonials</h1>
                <button onClick={() => {
                    setNewTestimonial({ IdTestimonial: 0, TestimonialName: '', TestimonialTitle: '', TestimonialDetails: '' });
                    setShowForm(true);
                }}>Create Testimonial</button>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search testimonials"
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
                {filteredTestimonials.length > 0 ? (
                    filteredTestimonials.map(testimonial => (
                        <div key={testimonial.IdTestimonial} className="testimonial-card">
                            <h3>{testimonial.TestimonialName}</h3>
                            <p>{testimonial.TestimonialTitle}</p>
                            <p>{testimonial.TestimonialDetails}</p>
                            <div className="testimonial-actions">
                                <button onClick={() => handleEditTestimonial(testimonial.IdTestimonial)}>Edit</button>
                                <button onClick={() => handleDeleteTestimonial(testimonial.IdTestimonial)}>Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <>
                        <LoadingAnimation />
                        <p>No testimonials found.</p>
                    </>
                )}
            </div>

            {showForm && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="testimonial-modal-close" onClick={() => setShowForm(false)}>&times;</span>
                        <input
                            id='TestimonialName'
                            type="text"
                            name="TestimonialName"
                            placeholder="Name"
                            value={newTestimonial.TestimonialName}
                            onChange={handleInputChange}
                        />
                        <input
                            id='TestimonialTitle'
                            type="text"
                            name="TestimonialTitle"
                            placeholder="Title"
                            value={newTestimonial.TestimonialTitle}
                            onChange={handleInputChange}
                        />
                        <textarea
                            id='TestimonialDetails'
                            name="TestimonialDetails"
                            placeholder="Details"
                            value={newTestimonial.TestimonialDetails}
                            onChange={handleInputChange}
                        />
                        <div style={{ textAlign: 'center' }}>
                            {editingId ? (
                                <button className="modal-button" onClick={handleSaveTestimonial} disabled={buttonLoading || isFormClean()}>
                                    {buttonLoading ? <LoadingAnimation /> : 'Save'}
                                </button>
                            ) : (
                                <button className="modal-button" onClick={handleAddTestimonial} disabled={buttonLoading}>
                                    {buttonLoading ? <LoadingAnimation /> : 'Add'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showConfirmation && (
                <ConfirmationModal
                    message="Are you sure you want to delete this testimonial?"
                    onConfirm={confirmDeleteTestimonial}
                    onCancel={cancelDeleteTestimonial}
                />
            )}
        </div>
    );
};

export default Testimonials;