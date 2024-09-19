import React, { useState } from 'react';
import './ForgotPassword.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUnlockAlt } from '@fortawesome/free-solid-svg-icons';
import LoadingAnimation from '../Loading/LoadingAnimation';
import logo from '../../assets/images/log.png';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    const isFormValid = () => {
        return email.length > 0;
    };

    return (
        <div className="forgot-password-container">
            {loading ? (
                <LoadingAnimation />
            ) : (
                <form onSubmit={handleSubmit}>
                    <img src={logo} alt="Logo" className="logo" />
                    <input
                        id='email'
                        type="text"
                        placeholder="Enter your Email"
                        value={email}
                        onChange={handleEmailChange}
                        className="input-field"
                    />
                    <button type="submit" disabled={!isFormValid()} className="submit-button">
                        <FontAwesomeIcon icon={faUnlockAlt} style={{ marginRight: '8px' }} />
                        Request Password Reset
                    </button>
                    <div className="forgot-password">
                        <FontAwesomeIcon icon={faArrowLeft} />
                        <Link to="/login" className="back-link">Back to Login</Link>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ForgotPassword;
