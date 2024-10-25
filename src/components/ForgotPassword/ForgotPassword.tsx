import React, { useEffect, useState } from 'react';
import './ForgotPassword.css';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUnlockAlt } from '@fortawesome/free-solid-svg-icons';
import LoadingAnimation from '../Loading/LoadingAnimation';
import logo from '../../assets/images/log.png';
import AuthService from '../../services/AuthService';

const ForgotPassword: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [verificationCode, setVerificationCode] = useState<string[]>(Array(6).fill(''));
    const [emailSubmitted, setEmailSubmitted] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Forgot Password';
    }, []);

    // Manage the behavior of input fields for forward and backward movement
    useEffect(() => {
        const inputs = document.querySelectorAll('.verification-input');
        inputs.forEach((input, index) => {
            input.addEventListener('input', (event) => {
                const target = event.target as HTMLInputElement;

                // Move forward when entering a number
                if (target.value.length === 1 && index < inputs.length - 1) {
                    (inputs[index + 1] as HTMLInputElement).focus();
                }
            });

            input.addEventListener('keydown', (event) => {
                const target = event.target as HTMLInputElement;

                // Move backward when deleting a number (only if the field is empty)
                if ((event as KeyboardEvent).key === 'Backspace' && target.value.length === 0 && index > 0) {
                    (inputs[index - 1] as HTMLInputElement).focus();
                }
            });
        });
    }, [verificationCode]);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const charCode = e.charCode || e.keyCode;
        // Prevent anything other than numbers from being entered
        if (charCode < 48 || charCode > 57) {
            e.preventDefault();
        }
    };

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setLoading(true);
        try {
            if (email) {
                const response = await AuthService.emailCheck(email);
                if (response.status === 200) {
                    setEmailSubmitted(true);
                } else {
                    setError(response.data.message || 'Failed to send reset email.');
                }
                setLoading(false);
            } else {
                setError("Please enter your email.");
                setLoading(false);
            }
        } catch (error) {
            setError('Error logging in, please try again later');
            setLoading(false);
        }
    };

    const handleCodeSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setLoading(true);
        const code = verificationCode.join('');
        // console.log(code)
        try {
            const code = verificationCode.join('');
            const response = await AuthService.verifyCode(email, code);
            if (response.status === 200) {
                navigate(`/reset-password?email=${email}&code=${code}`);
            } else {
                setError(response.data.message || 'Failed to verify code.');
            }
            setLoading(false);
        } catch (error) {
            setError('Error verifying code, please try again later');
            setLoading(false);
        }
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        if (value.length <= 1) {
            const newCode = [...verificationCode];
            newCode[index] = value;
            setVerificationCode(newCode);
        }
    };

    const isFormValid = () => email.length > 0;

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    return (
        <div className="login-container">
            {loading ? (
                <LoadingAnimation />
            ) : (
                <>
                    <form onSubmit={handleFormSubmit}>
                        <img src={logo} alt="Logo" className="logo" />
                        {error && <p className="error-message">{error}</p>}
                        {!emailSubmitted ? (
                            <>
                                <input
                                    id="Email"
                                    name="Email"
                                    type="email"
                                    placeholder="Enter your Email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    className="input-field"
                                />
                                <button onClick={handleSubmit} type="button" disabled={!isFormValid()} className="submit-button">
                                    <FontAwesomeIcon icon={faUnlockAlt} />
                                    {'Request Password Reset'}
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="verification-code-container">
                                    {verificationCode.map((digit, index) => (
                                        <input
                                            key={index}
                                            type="number"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleVerificationCodeChange(e, index)}
                                            onKeyPress={handleKeyPress}
                                            className="verification-input"
                                        />
                                    ))}
                                </div>
                                <button onClick={handleCodeSubmit} type="button" className="submit-button">
                                    <FontAwesomeIcon icon={faUnlockAlt} />
                                    {'Verify Code'}
                                </button>
                            </>
                        )}

                        <div className="forgot-password">
                            <FontAwesomeIcon icon={faArrowLeft} />
                            <Link to="/login" className="back-link">Back to Login</Link>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default ForgotPassword;
