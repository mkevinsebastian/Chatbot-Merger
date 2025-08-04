import React, { useState } from 'react';

const DeleteAccountButton = () => {
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const handleDeleteAccount = async () => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const authToken = localStorage.getItem("authToken");

            if (!authToken) {
                setError("You must log in before deleting your account.");
                setIsLoading(false);
                return;
            }

            const response = await fetch(`${API_BASE_URL}/deleteaccount`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to delete account');
            }

            // ✅ Show success message
            setSuccessMessage(result.message || "Your account has been successfully deleted.");

            // ✅ Clear token
            localStorage.removeItem("authToken");
            localStorage.removeItem("isLoggedIn");

            // ✅ Redirect after short delay
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);

        } catch (err) {
            setError(err.message);
            console.error('Delete account error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const styles = {
        button: {
            padding: '12px 25px',
            background: 'linear-gradient(45deg, #ff4e50, #d6293e)',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(255, 78, 80, 0.3)',
        },
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        },
        modalContent: {
            backgroundColor: '#2c3e50',
            color: '#ecf0f1',
            padding: '2rem',
            borderRadius: '15px',
            maxWidth: '420px',
            width: '100%',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif'
        },
        errorText: {
            color: '#ff7675',
            marginTop: '10px',
            fontWeight: '500'
        },
        successText: {
            color: '#2ecc71',
            marginTop: '10px',
            fontWeight: '500'
        },
        cancelButton: {
            padding: '10px 20px',
            background: 'linear-gradient(45deg, #7f8c8d, #95a5a6)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '14px',
            transition: 'all 0.3s ease'
        },
        confirmButton: {
            padding: '10px 20px',
            background: 'linear-gradient(45deg, #e74c3c, #c0392b)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '14px',
            transition: 'all 0.3s ease'
        },
        buttonGroup: {
            display: 'flex',
            gap: '1rem',
            marginTop: '1.5rem',
            justifyContent: 'center'
        }
    };

    return (
        <div style={{ padding: '1rem' }}>
            {/* Delete Account Button */}
            <button
                onClick={() => setShowModal(true)}
                style={styles.button}
                disabled={isLoading}
            >
                {isLoading ? 'Deleting...' : 'Delete Account'}
            </button>

            {/* Error Message */}
            {error && <p style={styles.errorText}>Error: {error}</p>}

            {/* Confirmation Modal */}
            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h2 style={{ marginBottom: '1rem' }}>⚠ Confirm Deletion</h2>
                        <p>Are you sure you want to permanently delete your account? This action cannot be undone.</p>

                        {/* ✅ Show success message inside modal */}
                        {successMessage && <p style={styles.successText}>{successMessage}</p>}

                        <div style={styles.buttonGroup}>
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={isLoading}
                                style={styles.cancelButton}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={isLoading || successMessage}
                                style={styles.confirmButton}
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
