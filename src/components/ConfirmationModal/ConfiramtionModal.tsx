import React from 'react';
import './ConfirmationModal.css';

interface ConfirmationModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <p>{message}</p>
                <div className="modal-buttons">
                    <button onClick={onConfirm} className="confirm-button">Yes</button>
                    <button onClick={onCancel} className="cancel-button">No</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
