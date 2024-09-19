import React from 'react';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
    username: string;
    userInitials: string;
    isOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ username, userInitials, isOpen, toggleSidebar }) => {
    const navigate = useNavigate();

    const handleAnalyticsClick = () => {
        navigate('/analytics');
        toggleSidebar();
    };

    const handleEventClick = () => {
        navigate('/event-managments');
        toggleSidebar();
    };

    const handleTableClick = () => {
        navigate('/tables');
        toggleSidebar();
    }
    const handleOrdersClick = () => {
        navigate('/orders');
        toggleSidebar();
    }

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <div className="user-avatar">{userInitials}</div>
                <div className="username">{username}</div>
                <button className="close-button" onClick={toggleSidebar}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <li onClick={handleAnalyticsClick}>Analytics</li>
                    <li onClick={handleEventClick}>Event Managements</li>
                    <li onClick={handleTableClick}>Tables</li>
                    <li onClick={handleOrdersClick}>Orders</li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;