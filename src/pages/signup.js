// src/pages/signup.js
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

// Get base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const isValidEmail = (email) => {
  // Regex untuk validasi format email dasar
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // State baru untuk konfirmasi password
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // --- Validasi di Frontend ---
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, {
        email,
        password,
      });

      setMessage(response.data.message || 'Registration successful! Please log in.');
      router.push('/login');
    } catch (err) {
      if (err.response) {
        const errorMessage = err.response.data.error || 'Registration failed. Please try again.';
        setError(errorMessage);
        console.error('Server responded with an error:', err.response.data);
      } else if (err.request) {
        setError('Network error: No response from server. Check your connection or API URL.');
        console.error('No response received:', err.request);
      } else {
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
          <div style={styles.formGroup}>
            <label htmlFor="confirm-password" style={styles.label}>Confirm Password:</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>Sign Up</button>
        </form>
        {message && <p style={{ ...styles.message, color: '#2ecc71' }}>{message}</p>}
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
    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    fontFamily: 'Inter, sans-serif',
    color: '#ecf0f1',
    padding: '20px',
  },
  signupBox: {
    backgroundColor: 'rgba(44, 62, 80, 0.8)',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    width: '100%',
    maxWidth: '450px',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  heading: {
    color: '#ecf0f1',
    marginBottom: '30px',
    fontSize: '28px',
    fontWeight: '600',
    letterSpacing: '1px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '20px',
  },
  formGroup: {
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#bdc3c7',
    fontSize: '15px',
  },
  input: {
    width: 'calc(100% - 24px)',
    padding: '12px',
    border: '1px solid #556270',
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: '#4a5b6b',
    color: '#ecf0f1',
    outline: 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    '&:focus': {
      borderColor: '#007bff',
      boxShadow: '0 0 0 3px rgba(0,123,255,0.3)',
    },
  },
  button: {
    width: '100%',
    padding: '12px 15px',
    background: 'linear-gradient(45deg, #007bff 0%, #0056b3 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '15px',
    boxShadow: '0 4px 10px rgba(0,123,255,0.3)',
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
    color: '#bdc3c7',
    fontSize: '15px',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'color 0.3s ease',
    '&:hover': {
      color: '#69b3ff',
    },
  },
};
