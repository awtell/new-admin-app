import React, { useState } from 'react';
import './Testimonials.css';
import ConfirmationModal from '../ConfirmationModal/ConfiramtionModal';

interface Testimonial {
    id: number;
    name: string;
    title: string;
    details: string;
}

const dummyTestimonials: Testimonial[] = [
    { id: 1, name: 'John Doe', title: 'CEO', details: 'Great service!' },
    { id: 2, name: 'Jane Smith', title: 'CTO', details: 'Highly recommend!' },
    { id: 3, name: 'Alice Johnson', title: 'CFO', details: 'Very satisfied!' }
];

const Testimonials: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>(dummyTestimonials);
    const [newTestimonial, setNewTestimonial] = useState<Testimonial>({ id: 0, name: '', title: '', details: '' });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [testimonialToDelete, setTestimonialToDelete] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>(''); // Search term state

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewTestimonial({ ...newTestimonial, [name]: value });
    };

    const handleAddTestimonial = () => {
        setTestimonials([...testimonials, { ...newTestimonial, id: Date.now() }]);
        setNewTestimonial({ id: 0, name: '', title: '', details: '' });
        setShowForm(false);
    };

    const handleEditTestimonial = (id: number) => {
        const testimonial = testimonials.find(t => t.id === id);
        if (testimonial) {
            setNewTestimonial(testimonial);
            setEditingId(id);
            setShowForm(true);
        }
    };

    const handleSaveTestimonial = () => {
        setTestimonials(testimonials.map(t => (t.id === editingId ? newTestimonial : t)));
        setNewTestimonial({ id: 0, name: '', title: '', details: '' });
        setEditingId(null);
        setShowForm(false);
    };

    const handleDeleteTestimonial = (id: number) => {
        setTestimonialToDelete(id);
        setShowConfirmation(true);
    };

    const confirmDeleteTestimonial = () => {
        if (testimonialToDelete !== null) {
            setTestimonials(testimonials.filter(t => t.id !== testimonialToDelete));
            setTestimonialToDelete(null);
            setShowConfirmation(false);
        }
    };

    const cancelDeleteTestimonial = () => {
        setTestimonialToDelete(null);
        setShowConfirmation(false);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredTestimonials = testimonials.filter(testimonial =>
        testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="testimonial-management">
            <div className="testimonials-header">
                <h1>Testimonials</h1>
                <button onClick={() => {
                    setNewTestimonial({ id: 0, name: '', title: '', details: '' });
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
                        <div key={testimonial.id} className="testimonial-card">
                            <h3>{testimonial.name}</h3>
                            <p>{testimonial.title}</p>
                            <p>{testimonial.details}</p>
                            <div className="testimonial-actions">
                                <button onClick={() => handleEditTestimonial(testimonial.id)}>Edit</button>
                                <button onClick={() => handleDeleteTestimonial(testimonial.id)}>Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No testimonials found.</p>
                )}
            </div>

            {/* Modal for Add/Edit Form */}
            {showForm && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="modal-close" onClick={() => setShowForm(false)}>&times;</span>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={newTestimonial.name}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            value={newTestimonial.title}
                            onChange={handleInputChange}
                        />
                        <textarea
                            name="details"
                            placeholder="Details"
                            value={newTestimonial.details}
                            onChange={handleInputChange}
                        />
                        {editingId ? (
                            <button onClick={handleSaveTestimonial}>Save</button>
                        ) : (
                            <button onClick={handleAddTestimonial}>Add</button>
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
