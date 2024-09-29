import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Import eye icons for show/hide password
import LoadingAnimation from '../Loading/LoadingAnimation';
import logo from '../../assets/images/log.png';
import LoginService from '../../services/LoginService';

interface LoginProps {
    onLoginSuccess: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false); // State to toggle password visibility
    const navigate = useNavigate();

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
    const togglePasswordVisibility = () => setShowPassword(!showPassword); // Toggle visibility

    // const validateEmail = (email: string) => {
    //     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     return re.test(String(email).toLowerCase());
    // };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        // Collect form data
        const data = new FormData(event.currentTarget);
        const UserName = data.get('UserName') as string | null;  // Change 'email' to 'UserName'
        const Password = data.get('Password') as string | null;  // Change 'password' to 'Password'

        if (!UserName || !Password) {
            setError("Please enter both username and password.");
            setLoading(false);
            return;
        }

        try {
            // Pass UserName and Password to the service
            const response = await LoginService.authenticate({ UserName, Password });
            setTimeout(() => {
                const { access_token } = response.data;
                onLoginSuccess(access_token);
                navigate('/analytics');
                setLoading(false);
            }, 2000);
        } catch (error) {
            setError('Error logging in, please try again later');
            console.error('Error logging in:', error);
            setLoading(false);
        }
    };

    // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault();
    //     const data = new FormData(event.currentTarget);
    //     const email = data.get('name') as string | null;
    //     const password = data.get('password') as string | null;
    //     console.log(email);
    //     try {
    //         const response = await LoginService.authenticate({ email, password });
    //         if (response?.data?.access_token) {
    //             const { access_token } = response.data;
    //             setLocalStorageUser(response.data); // Save user details in local storage
    //             localStorage.setItem('token', access_token);
    //             onLoginSuccess(access_token); // Callback after successful login
    //             navigate('/project'); // Redirect after successful login
    //         } else {
    //             // alert("Wrong Email/Password");
    //             return;
    //         }
    //     } catch (error) {
    //         console.error('Authentication failed', error);
    //         // alert("Login failed. Please try again later.");
    //     }
    // };

    const isFormValid = () => {
        return email.length > 0 && password.length > 0;
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <img src={logo} alt="Logo" className="logo" />
                {error && <p className="error-message">{error}</p>}
                <input
                    id='UserName'
                    name='UserName'
                    placeholder="Enter your Email"
                    value={email}
                    onChange={handleEmailChange}
                    className="input-field"
                />
                <div className="password-container">
                    <input
                        id='Password'
                        name='Password'
                        type={showPassword ? "text" : "password"}
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
function setLocalStorageUser(data: any) {
    throw new Error('Function not implemented.');
}

