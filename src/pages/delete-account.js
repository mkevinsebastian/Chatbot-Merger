// pages/delete-account.js
import DeleteAccountButton from '../components/DeleteButton';
import { useRouter } from 'next/router';

const DeleteAccountPage = () => {
    const router = useRouter();

    const deleteAccountStyles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
            maxWidth: '100vw',
            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
            fontFamily: 'Inter, sans-serif',
            color: '#ecf0f1',
        },
        card: {
            backgroundColor: '#34495e',
            padding: '40px',
            borderRadius: '15px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            maxWidth: '500px',
            width: '90%',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.1)',
        },
        heading: {
            fontSize: '32px',
            fontWeight: '600',
            color: '#ff7675', // Matching the error message color
            marginBottom: '10px',
            letterSpacing: '1px',
        },
        subHeading: {
            fontSize: '20px',
            fontWeight: 'normal',
            color: '#ecf0f1',
            marginBottom: '20px',
        },
        paragraph: {
            color: '#bbb',
            marginBottom: '25px',
            lineHeight: '1.6',
        },
        backButton: {
            marginTop: '20px',
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
        }
    };

    return (
        <div style={deleteAccountStyles.container}>
            <div style={deleteAccountStyles.card}>
                <h1 style={deleteAccountStyles.heading}>Danger Zone</h1>
                <h2 style={deleteAccountStyles.subHeading}>Delete Your Account</h2>
                <p style={deleteAccountStyles.paragraph}>
                    This action will permanently delete your account and all associated data.
                    This action cannot be undone. Please proceed with caution.
                </p>
                <DeleteAccountButton />
                <button
                    onClick={() => router.back()}
                    style={deleteAccountStyles.backButton}
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default DeleteAccountPage;
