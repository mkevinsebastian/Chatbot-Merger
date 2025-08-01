// src/components/LogoutButton.js
import axios from 'axios';
import { useRouter } from 'next/router';

// Get base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Use environment variable for URL
      const response = await axios.post(`${API_BASE_URL}/logout`); // Corrected URL usage
      // Replaced alert with console log for better UX, and removed localStorage items directly as backend should handle this
      console.log(response.data.message || 'You have been logged out.');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('authToken'); // Remove token on logout
      router.push('/login');
    } catch (error) {
      // Replaced alert with console log
      console.error('Error logging out:', error.response?.data?.message || 'Logout failed.');
      // Even if logout fails on the server, we should clear local storage and redirect
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('authToken');
      router.push('/login');
    }
  };

  return (
    <button onClick={handleLogout} style={styles.button}>
      Logout
    </button>
  );
}

const styles = {
  button: {
    width: '100%',
    padding: '10px 15px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    textAlign: 'left',
    boxShadow: '0 4px 10px rgba(220,53,69,0.3)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 15px rgba(220,53,69,0.5)',
    },
  },
};
