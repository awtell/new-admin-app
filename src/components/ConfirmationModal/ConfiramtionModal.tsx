import React, { useState } from 'react';
import './ConfirmationModal.css';
import LoadingAnimation from '../Loading/LoadingAnimation';

interface ConfirmationModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ message, onConfirm, onCancel }) => {
    const [loadingButton, setLoadingButton] = useState<'confirm' | 'cancel' | null>(null);

    const handleConfirm = () => {
        setLoadingButton('confirm');
        onConfirm();
    };

    const handleCancel = () => {
        setLoadingButton('cancel');
        onCancel();
    };

    return (
        <div className="confirm-modal">
            <div className="confirm-modal-content">
                <p>{message}</p>
                <div className="confirm-modal-buttons">
                    <button onClick={handleConfirm} className="confirm-button" disabled={loadingButton !== null}>
                        {loadingButton === 'confirm' ? <LoadingAnimation /> : 'Yes'}
                    </button>
                    <button onClick={handleCancel} className="cancel-button" disabled={loadingButton !== null}>
                        {loadingButton === 'cancel' ? <LoadingAnimation /> : 'No'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
