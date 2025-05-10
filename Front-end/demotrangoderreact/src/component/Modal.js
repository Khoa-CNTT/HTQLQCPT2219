import React from 'react';

const Modal = ({ children, onClose }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="modal-close" onClick={onClose}>X</span>
                {children}
            </div>
        </div>
    );
};

export default Modal;
