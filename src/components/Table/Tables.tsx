import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Tables.css';
import { TableService } from '../../services/TableService';
import LoadingAnimation from '../Loading/LoadingAnimation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import ConfirmationModal from '../ConfirmationModal/ConfiramtionModal';

const Tables = () => {
    const navigate = useNavigate();

    interface Table {
        IdEventTable: number;
        TableName: string;
        Capacity: number;
        CostPerChair: number;
        Availability: number;
        StartTime: string;
        EndTime: string;
        Attachment: any;
        SaveName: string;
    }

    const [tables, setTables] = useState<Table[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [isLoading, setIsLoading] = useState(false); // Loading for save
    const [isDeleting, setIsDeleting] = useState(false); // Loading for delete
    const [isConfirmDelete, setIsConfirmDelete] = useState(false); // Confirm modal

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleCardClick = (table: any) => {
        // Handle card click
    };

    const handleEditClick = (table: Table) => {
        setSelectedTable(table);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedTable) {
            const { name, value } = e.target;

            if (name === 'StartTime' || name === 'EndTime') {
                const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
                if (timePattern.test(value)) {
                    setSelectedTable({
                        ...selectedTable,
                        [name]: value,
                    });
                } else {
                    console.error('Invalid time format. Please use HH:mm format.');
                }
            } else {
                setSelectedTable({
                    ...selectedTable,
                    [name]: value,
                });
            }
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true); // Start loading

        try {
            const response = await TableService.updateTable(selectedTable);
            console.log(response);

            if (response.status === 200) {
                console.log('Table updated successfully');
                if (selectedTable) {
                    setTables(prevTables =>
                        prevTables.map(t => (t.IdEventTable === selectedTable.IdEventTable ? selectedTable : t))
                    );
                }
            } else {
                console.error('Failed to update table:', response);
            }
        } catch (error) {
            console.error('Error updating table:', error);
        } finally {
            setIsLoading(false);
            setIsModalOpen(false);
        }
    };

    const handleDeleteClick = () => {
        setIsModalOpen(false);

        setIsConfirmDelete(true);
    };

    const confirmDelete = async () => {
        setIsDeleting(true);

        if (selectedTable) {
            try {
                const response = await TableService.deleteTable(selectedTable.IdEventTable);
                console.log(response);

                if (response.status === 200) {
                    console.log('Table deleted successfully');
                    setTables(prevTables => prevTables.filter(t => t.IdEventTable !== selectedTable.IdEventTable));
                } else {
                    console.error('Failed to delete table:', response);
                }
            } catch (error) {
                console.error('Error deleting table:', error);
            } finally {
                setIsDeleting(false);
                setIsConfirmDelete(false);
                setIsModalOpen(false);
            }
        }
    };

    useEffect(() => {
        document.title = 'Tables';
        const fetchTables = async () => {
            try {
                const response = await TableService.getTables();
                const data = await response.data.My_Result;
                const formattedData = data.map((table: any) => ({
                    ...table,
                    StartTime: table.StartTime,
                    EndTime: table.EndTime,
                }));

                setTables(formattedData);
            } catch (error) {
                console.error('Error fetching tables:', error);
            }
        };
        fetchTables();
    }, []);

    const filteredTables = tables.filter(table =>
        table.TableName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        table.Availability.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="table-management">
            <div className="tables-header">
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

            <div className="table-grid">
                {isLoading ? (
                    <LoadingAnimation />
                ) : (
                    filteredTables.length > 0 ? (
                        filteredTables.map(table => (
                            <div key={table.IdEventTable} className="table-card" onClick={() => handleCardClick(table)}>
                                <FontAwesomeIcon
                                    icon={faEdit}
                                    className="edit-icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditClick(table);
                                    }}
                                />
                                <div className="card-header">
                                    <h3>{table.TableName}</h3>
                                </div>
                                <p>Capacity: {table.Capacity}</p>
                                <p>Cost per chair: ${table.CostPerChair}</p>
                                <p>Availability: {table.Availability}</p>
                                <p>Start Time: {table.StartTime}</p>
                                <p>End Time: {table.EndTime}</p>
                            </div>
                        ))
                    ) : (
                        <LoadingAnimation />
                    )
                )}
            </div>

            {isModalOpen && selectedTable && (
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={handleModalClose}
                    contentLabel="Edit Table"
                    className="modal"
                    overlayClassName="modal-overlay"
                >
                    <div className="tables-modal-content">
                        <button className="tables-modal-close" onClick={handleModalClose}>
                            &times;
                        </button>
                        <form onSubmit={handleFormSubmit}>
                            <div className="form-group">
                                <label htmlFor="TableName">Table Name:</label>
                                <input
                                    id="TableName"
                                    type="text"
                                    name="TableName"
                                    value={selectedTable.TableName}
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="Capacity">Capacity:</label>
                                <input
                                    id="Capacity"
                                    type="number"
                                    name="Capacity"
                                    value={selectedTable.Capacity}
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="CostPerChair">Cost per chair:</label>
                                <input
                                    id="CostPerChair"
                                    type="number"
                                    name="CostPerChair"
                                    value={selectedTable.CostPerChair}
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="Availability">Availability:</label>
                                <input
                                    id="Availability"
                                    type="number"
                                    name="Availability"
                                    value={selectedTable.Availability}
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="StartTime">Start Time:</label>
                                <input
                                    id="StartTime"
                                    type="time"
                                    name="StartTime"
                                    className="form-control"
                                    value={selectedTable.StartTime}
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="EndTime">End Time:</label>
                                <input
                                    id="EndTime"
                                    type="time"
                                    name="EndTime"
                                    className="form-control"
                                    value={selectedTable.EndTime}
                                    onChange={handleFormChange}
                                    style={{ marginBottom: '1rem' }}
                                />
                            </div>
                            <button type="submit" disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                type="button"
                                className='tables-modal-delete'
                                onClick={handleDeleteClick}
                                style={{ marginLeft: '1rem' }}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Table'}
                            </button>
                        </form>
                    </div>
                </Modal>
            )}

            {isConfirmDelete && (
                <ConfirmationModal
                    message="Are you sure you want to delete this table?"
                    onConfirm={confirmDelete}
                    onCancel={() => setIsConfirmDelete(false)}
                />
            )}
        </div>
    );
};

export default Tables;
