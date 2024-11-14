import React, { useState } from 'react';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/images/log.png';

interface NavbarProps {
    username: string;
    toggleSidebar: () => void;
    onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ username, toggleSidebar, onLogout }) => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const getInitials = (name: string) => {
        const names = name.split(' ');
        const initials = names.map((n) => n[0]).join('').toUpperCase();
        return initials.substring(0, 2);
    };

    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    const handleLogout = () => {
        onLogout(); // Call the passed down onLogout function
    };

    return (
        <div className="navbar">
            <div className="navbar-left">
                <button className="menu-button" onClick={toggleSidebar}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </div>
            <div className="navbar-center">
                <img src={logo} alt="Logo" className="navbar-logo" />
            </div>
            <div className="navbar-right">
                <div className="user-avatar" onClick={toggleDropdown}>
                    {getInitials(username)}
                </div>
                {isDropdownVisible && (
                    <div className="dropdown">
                        <button onClick={handleLogout} className="logout-button">
                            <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '8px' }} />
                            Log out
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
