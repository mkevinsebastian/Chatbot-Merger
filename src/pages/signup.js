// src/pages/signup.js
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

// Get base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(''); // State baru untuk pesan error
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous success message
    setError('');  // Clear previous error message

    try {
      // Use environment variable for URL
      const response = await axios.post(`${API_BASE_URL}/signup`, {
        email,
        password,
      });

      // Handle successful registration
      setMessage(response.data.message || 'Registration successful! Please log in.');
      // After successful registration, redirect to login page
      router.push('/login');
    } catch (err) {
      // Handle API errors
      if (err.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        const errorMessage = err.response.data.error || 'Registration failed. Please try again.';
        setError(errorMessage);
        console.error('Server responded with an error:', err.response.data);
      } else if (err.request) {
        // The request was made but no response was received
        setError('Network error: No response from server. Check your connection or API URL.');
        console.error('No response received:', err.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('An unexpected error occurred. Please try again later.');
        console.error('Error setting up request:', err.message);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.signupBox}>
        <h1 style={styles.heading}>Create New Account</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>Sign Up</button>
        </form>
        {/* Tampilkan pesan sukses */}
        {message && <p style={{ ...styles.message, color: '#2ecc71' }}>{message}</p>}
        {/* Tampilkan pesan error */}
        {error && <p style={{ ...styles.message, color: '#ff7675' }}>{error}</p>}
        <p style={styles.linkText}>
          Already have an account? <a href="/login" style={styles.link}>Login here</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)', // Dark futuristic gradient
    fontFamily: 'Inter, sans-serif', // Modern font
    color: '#ecf0f1', // Light text color for contrast
    padding: '20px',
  },
  signupBox: { // New style for the signup form wrapper
    backgroundColor: 'rgba(44, 62, 80, 0.8)', // Semi-transparent dark background
    padding: '40px',
    borderRadius: '15px', // Rounded corners
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)', // Stronger shadow
    width: '100%',
    maxWidth: '450px', // Slightly wider for better layout
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.1)', // Subtle border
  },
  heading: {
    color: '#ecf0f1', // Light color for heading
    marginBottom: '30px',
    fontSize: '28px', // Larger font size
    fontWeight: '600',
    letterSpacing: '1px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px', // Space between form groups
    marginBottom: '20px',
  },
  formGroup: {
    textAlign: 'left', // Align labels to the left
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#bdc3c7', // Lighter grey for labels
    fontSize: '15px',
  },
  input: {
    width: 'calc(100% - 24px)', // Adjust for padding
    padding: '12px',
    border: '1px solid #556270', // Darker border
    borderRadius: '8px', // Rounded input fields
    fontSize: '16px',
    backgroundColor: '#4a5b6b', // Darker input field
    color: '#ecf0f1',
    outline: 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    '&:focus': {
      borderColor: '#007bff', // Highlight on focus
      boxShadow: '0 0 0 3px rgba(0,123,255,0.3)', // Subtle glow on focus
    },
  },
  button: {
    width: '100%',
    padding: '12px 15px',
    background: 'linear-gradient(45deg, #007bff 0%, #0056b3 100%)', // Blue gradient
    color: 'white',
    border: 'none',
    borderRadius: '8px', // Rounded button
    fontSize: '18px', // Larger font size
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '15px',
    boxShadow: '0 4px 10px rgba(0,123,255,0.3)', // Glow effect
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 15px rgba(0,123,255,0.5)',
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
      boxShadow: 'none',
      transform: 'none',
    },
  },
  message: {
    marginTop: '20px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  linkText: {
    marginTop: '25px',
    color: '#bdc3c7', // Lighter grey for link text
    fontSize: '15px',
  },
  link: {
    color: '#007bff', // Bright blue for links
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'color 0.3s ease',
    '&:hover': {
      color: '#69b3ff', // Lighter blue on hover
    },
  },
};
