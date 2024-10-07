import React, { useEffect, useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Import eye icons for show/hide password
import LoadingAnimation from '../Loading/LoadingAnimation';
import logo from '../../assets/images/log.png';
import AuthService from '../../services/AuthService';

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


    useEffect(() => {
        document.title = 'Login';
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        const data = new FormData(event.currentTarget);
        const UserName = data.get('UserName') as string | null;
        const Password = data.get('Password') as string | null;

        if (!UserName || !Password) {
            setError("Please enter both username and password.");
            setLoading(false);
            return;
        }

        try {
            const response = await AuthService.authenticate({ UserName, Password });
            setTimeout(() => {
                const token = response.data.My_Result.JWT_Token;
                localStorage.setItem('JWT_Token', token);
                onLoginSuccess(token);
                console.log(token)
                navigate('/analytics');
                setLoading(false);
            }, 20);
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

