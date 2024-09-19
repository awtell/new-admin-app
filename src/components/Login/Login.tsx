import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Import eye icons for show/hide password
import LoadingAnimation from '../Loading/LoadingAnimation';
import logo from '../../assets/images/log.png';

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false); // State to toggle password visibility
    const navigate = useNavigate();

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
    const togglePasswordVisibility = () => setShowPassword(!showPassword); // Toggle visibility

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateEmail(email)) {
            setError("Invalid email format");
            return;
        }
        setLoading(true);
        try {
            setTimeout(() => {
                onLogin();
                navigate('/analytics');
                setLoading(false);
            }, 2000);
        } catch (error) {
            setError('Error logging in, please try again later');
            console.error('Error logging in:', error);
            setLoading(false);
        }
    };

    const isFormValid = () => {
        return email.length > 0 && password.length > 0;
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <img src={logo} alt="Logo" className="logo" />
                {error && <p className="error-message">{error}</p>}
                <input
                    id='email'
                    type="email"
                    placeholder="Enter your Email"
                    value={email}
                    onChange={handleEmailChange}
                    className="input-field"
                />
                <div className="password-container">
                    <input
                        id='password'
                        type={showPassword ? "text" : "password"} // Conditionally change the type
                        placeholder="Enter your password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="input-field"
                    />
                    <button type="button" onClick={togglePasswordVisibility} className="toggle-password">
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                </div>
                <button type="submit" disabled={!isFormValid() || loading} className="submit-button">
                    {loading ? <LoadingAnimation /> : (
                        <>
                            <FontAwesomeIcon icon={faSignInAlt} style={{ marginRight: '8px' }} />
                            Login
                        </>
                    )}
                </button>
                <div className="forgot-password">
                    <Link to="/forgot-password">Forgot Password?</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
