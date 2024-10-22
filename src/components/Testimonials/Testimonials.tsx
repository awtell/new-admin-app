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
    const [buttonLoading, setButtonLoading] = useState(false);

    useEffect(() => {
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
                setShowForm(false);
                setTestimonials([...testimonials, newTestimonial]);
            }
        } catch (error) {
            console.error("Error inserting testimonial:", error);
        } finally {
            setButtonLoading(false);
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
            })
            .catch(error => {
                console.error("Error updating testimonial:", error);
            })
            .finally(() => {
                setButtonLoading(false);
            });
    };

    const handleDeleteTestimonial = (IdTestimonial: number) => {
        if (IdTestimonial !== undefined) {
            console.log('IdTestimonial', IdTestimonial);
            setTestimonialToDelete(IdTestimonial);
            setShowConfirmation(true);
        } else {
            console.error('Error: IdTestimonial is undefined');
        }
    };

    const confirmDeleteTestimonial = () => {
        console.log("Deleting testimonial:", testimonialToDelete);
        if (testimonialToDelete) {
            setButtonLoading(true);
            TestimonialsService.deleteTestimonial(testimonialToDelete)
                .then(() => {
                    setTestimonials(testimonials.filter(t => t.IdTestimonial !== testimonialToDelete));
                    setTestimonialToDelete(null);
                    setShowConfirmation(false);
                })
                .catch(error => {
                    console.error("Error deleting testimonial:", error);
                })
                .finally(() => {
                    setButtonLoading(false);
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
                        {editingId ? (
                            <button className="modal-button" onClick={handleSaveTestimonial} disabled={buttonLoading || isFormClean()}>
                                {buttonLoading ? 'Saving...' : 'Save'}
                            </button>
                        ) : (
                            <button className="modal-button" onClick={handleAddTestimonial} disabled={buttonLoading}>
                                {buttonLoading ? 'Adding...' : 'Add'}
                            </button>
                        )}
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