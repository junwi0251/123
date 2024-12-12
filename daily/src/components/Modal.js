import React from 'react';
import styles from '../css/Modal.module.css';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div
            className={styles.modalBackdrop}
            onClick={(e) => {
                if (e.target.classList.contains(styles.modalBackdrop)) {
                    onClose();
                }
            }}
        >
            <div className={styles.modalContent}>
                {children}
            </div>
        </div>
    );
};

export default Modal;
