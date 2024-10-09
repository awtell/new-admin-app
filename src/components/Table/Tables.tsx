import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Tables.css';
import { TableService } from '../../services/TableService';
import LoadingAnimation from '../Loading/LoadingAnimation';

const Tables = () => {
    const navigate = useNavigate();
    interface Table {
        IdEventTable: number,
        IdAdmin: number,
        IdEvent: number,
        TableName: string,
        Capacity: number,
        CostPerChair: number,
        Availability: number,
        StartTime: Date,
        EndTime: Date,
        Attachment: any,
        SaveName: string,
        DateCreated: Date,
        Deleted: boolean,
        DateDeleted: Date,
        TableImage: any
    }

    const [tables, setTables] = useState<Table[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Function to handle search input changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };


    const handleCardClick = (table: any) => {

    };

    useEffect(() => {
        const fetchTables = async () => {
            // Fetch tables from the server
            try {
                const response = await TableService.getTables();
                const data = await response.data.My_Result;
                const formattedData = data.map((table: any) => ({
                    ...table,
                    StartTime: new Date(table.StartTime),
                    EndTime: new Date(table.EndTime)
                }));
                setTables(formattedData);
            } catch (error) {
                console.error('Error fetching tables:', error);
            }
        }
        fetchTables();
    }, []);


    const filteredTables = tables.filter(table =>
        table.TableName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        table.Availability.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );



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
                        <div key={table.IdEventTable} className="event-card" onClick={() => handleCardClick(table)}>
                            <h3>{table.TableName}</h3>

                            <p>Capacity: {table.Capacity}</p>
                            <p>Cost per chair: ${table.CostPerChair}</p>
                            <p>Availability: {table.Availability}</p>
                            <p>Start Time: {table.StartTime.toString()}</p>
                            <p>End Time: {table.EndTime.toString()}</p>

                        </div>
                    ))
                ) : (
                    <LoadingAnimation />
                )}
            </div>
        </div>
    );
}

export default Tables;
