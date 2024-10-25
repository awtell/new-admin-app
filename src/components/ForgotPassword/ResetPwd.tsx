import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import LoadingAnimation from '../Loading/LoadingAnimation';

const ResetPwd: React.FC = () => {
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const params = new URLSearchParams(location.search);
            const email = params.get('email');
            const code = params.get('code');

            if (email && code) {
                const response = await AuthService.resetPassword(password);
                if (response.status === 200) {
                    navigate('/login');
                } else {
                    setError('Failed to reset password');
                }
            } else {
                setError('Invalid reset link');
            }
        } catch (error) {
            setError('Error resetting password, please try again later');
            console.error('Error resetting password:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            {loading ? (
                <LoadingAnimation />
            ) : (
                <form onSubmit={handleSubmit}>
                    <h1>Reset Password</h1>
                    {error && <p className="error-message">{error}</p>}
                    <input
                        id='Password'
                        type="Password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="input-field"
                    />
                    <input
                        id='ConfirmPassword'
                        type="Password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        className="input-field"
                    />
                    <button type="submit" className="submit-button">
                        Reset Password
                    </button>
                </form>
            )}
        </div>
    );
};

export default ResetPwd;