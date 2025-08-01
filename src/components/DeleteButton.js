// components/DeleteAccountButton.jsx
import React, { useState } from 'react';

const DeleteAccountButton = () => {
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to handle account deletion
    const handleDeleteAccount = async () => {
    setIsLoading(true);
    setError(null);

    try {
        const authToken = localStorage.getItem('authToken');
        console.log("Auth token in storage:", authToken);

        if (!authToken) {
            setError('Authentication token is missing. Please log in again.');
            setIsLoading(false);
            setTimeout(() => { window.location.href = '/login'; }, 2000);
            return;
        }

        const response = await fetch('https://chatbot-oe7x.onrender.com/deleteaccount', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            credentials: 'include' // kalau backend pakai cookie
        });

        const text = await response.text();
        console.log("Server response text:", text);

        if (response.ok) {
            console.log('Account deleted successfully!');
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        } else {
            if (response.status === 401) {
                setError('Unauthorized: Your session has expired. Please log in again.');
                localStorage.removeItem('authToken');
                setTimeout(() => { window.location.href = '/login'; }, 2000);
            } else {
                setError(text || 'Failed to delete account.');
            }
        }
    } catch (err) {
        setError('Network error: Could not connect to the server.');
        console.error(err);
    } finally {
        setIsLoading(false);
        setShowModal(false);
    }
};


    const styles = {
        button: {
            padding: '12px 25px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(220, 53, 69, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'translateY(-2px)',
                backgroundColor: '#c82333',
                boxShadow: '0 6px 15px rgba(220, 53, 69, 0.5)',
            },
            '&:disabled': {
                opacity: 0.5,
                cursor: 'not-allowed',
                boxShadow: 'none',
                transform: 'none',
            },
        },
        modalOverlay: {
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '1rem',
        },
        modalCard: {
            backgroundColor: '#34495e',
            borderRadius: '15px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            padding: '2rem',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
            color: '#ecf0f1',
        },
        modalHeading: {
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#ff7675',
            marginBottom: '1rem',
        },
        modalText: {
            color: '#bbb',
            marginBottom: '1.5rem',
            lineHeight: '1.6',
        },
        modalButtonContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            gap: '1rem',
        },
        cancelButton: {
            flex: 1,
            padding: '12px 25px',
            backgroundColor: '#556270',
            color: '#ecf0f1',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'translateY(-2px)',
                backgroundColor: '#4a5b6b',
                boxShadow: '0 6px 15px rgba(0,0,0,0.3)',
            },
            '&:disabled': {
                opacity: 0.5,
                cursor: 'not-allowed',
                boxShadow: 'none',
                transform: 'none',
            },
        },
        deleteButton: {
            flex: 1,
            padding: '12px 25px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(220, 53, 69, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'translateY(-2px)',
                backgroundColor: '#c82333',
                boxShadow: '0 6px 15px rgba(220, 53, 69, 0.5)',
            },
            '&:disabled': {
                opacity: 0.5,
                cursor: 'not-allowed',
                boxShadow: 'none',
                transform: 'none',
            },
        },
        errorMessage: {
            marginTop: '1rem',
            color: '#ff7675',
            textAlign: 'center',
            fontWeight: 'bold',
        }
    };

    return (
        <div style={{ padding: '1rem' }}>
            <button
                onClick={() => setShowModal(true)}
                style={styles.button}
                disabled={isLoading}
            >
                {isLoading ? 'Deleting...' : 'Delete Account'}
            </button>

            {error && (
                <p style={styles.errorMessage}>
                    Error: {error}
                </p>
            )}

            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalCard}>
                        <h2 style={styles.modalHeading}>Confirm Account Deletion</h2>
                        <p style={styles.modalText}>
                            Are you sure you want to permanently delete your account? This action cannot be undone.
                        </p>
                        <div style={styles.modalButtonContainer}>
                            <button
                                onClick={() => setShowModal(false)}
                                style={styles.cancelButton}
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                style={styles.deleteButton}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteAccountButton;
