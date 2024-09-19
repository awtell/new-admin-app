import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Tables.css';

const Tables: React.FC = () => {
    const navigate = useNavigate();
    const [tables] = useState([
        {
            id: 1,
            image: 'https://via.placeholder.com/200x120',
            title: 'Table 1',
            location: 'Room 1',
            price: '$100',
            capacity: 4,
            costPerChair: 25,
            availability: 'Available',
            startTime: '09:00 AM',
            endTime: '05:00 PM'
        },
        {
            id: 2,
            image: 'https://via.placeholder.com/200x120',
            title: 'Table 2',
            location: 'Room 2',
            price: '$200',
            capacity: 6,
            costPerChair: 33.33,
            availability: 'Unavailable',
            startTime: '10:00 AM',
            endTime: '06:00 PM'
        },
        {
            id: 3,
            image: 'https://via.placeholder.com/200x120',
            title: 'Table 3',
            location: 'Room 3',
            price: '$300',
            capacity: 8,
            costPerChair: 37.5,
            availability: 'Available',
            startTime: '11:00 AM',
            endTime: '07:00 PM'
        },
        {
            id: 4,
            image: 'https://via.placeholder.com/200x120',
            title: 'Table 4',
            location: 'Room 4',
            price: '$400',
            capacity: 10,
            costPerChair: 40,
            availability: 'Available',
            startTime: '08:00 AM',
            endTime: '04:00 PM'
        },
        {
            id: 5,
            image: 'https://via.placeholder.com/200x120',
            title: 'Table 5',
            location: 'Room 5',
            price: '$500',
            capacity: 12,
            costPerChair: 41.67,
            availability: 'Unavailable',
            startTime: '07:00 AM',
            endTime: '03:00 PM'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState(''); // State for storing search term

    // Function to handle search input changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // Filter the tables based on the search term
    const filteredTables = tables.filter(table =>
        table.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        table.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        table.availability.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCardClick = (table: any) => {
        
    };

    return (
        <div className="event-management">
            <div className="events-header">
                <h1>Tables</h1>
                <button onClick={() => navigate('/tables-create')}>Create Table</button>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search tables"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <div className="events-grid">
                {filteredTables.length > 0 ? (
                    filteredTables.map(table => (
                        <div key={table.id} className="event-card" onClick={() => handleCardClick(table)}>
                            <img src={table.image} alt={table.title} />
                            <h3>{table.title}</h3>
                            <p>{table.location}</p>
                            <p>{table.price}</p>
                            <p>Capacity: {table.capacity}</p>
                            <p>Cost per chair: ${table.costPerChair}</p>
                            <p>Availability: {table.availability}</p>
                            <p>Start Time: {table.startTime}</p>
                            <p>End Time: {table.endTime}</p>
                        </div>
                    ))
                ) : (
                    <p>No tables found.</p>
                )}
            </div>
        </div>
    );
}

export default Tables;
