// src/pages/index.js
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import LogoutButton from '../components/LogoutButton';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const messagesEndRef = useRef(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll otomatis ke bawah setiap ada pesan baru
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 📌 Pindahkan fetchChatHistory ke luar useEffect supaya bisa dipanggil ulang
  const fetchChatHistory = async () => {
    setError('');
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/chat/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (!Array.isArray(response.data)) {
        console.warn('Unexpected chat history format:', response.data);
        return;
      }

      const formattedMessages = response.data.flatMap(chat => {
        const history = [];
        if (chat.Prompt) history.push({ sender: 'user', text: chat.Prompt });
        if (chat.Response) history.push({ sender: 'bot', text: chat.Response });
        return history;
      });

      setMessages(formattedMessages);
    } catch (err) {
      console.error('Error fetching chat history:', err);
      setError('Failed to load chat history.');
    } finally {
      setIsLoading(false);
    }
  };

  // 📌 Panggil saat pertama kali render
  useEffect(() => {
    if (localStorage.getItem('isLoggedIn')) {
      fetchChatHistory();
    }
  }, []);

  // 📌 Kirim pesan dan stream balasan
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return;

    const userMessage = { sender: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Your session has expired. Please log in again.');
        router.push('/login');
        setIsLoading(false);
        return;
      }

      // Tambahkan bubble kosong untuk bot
      const botIndex = messages.length + 1;
      setMessages(prev => [...prev, { sender: 'bot', text: '' }]);

      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          model: "phi3:mini",
          prompt: userMessage.text
        })
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let botReply = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        botReply += decoder.decode(value, { stream: true });

        // Update teks bubble bot terakhir
        setMessages(prev => {
          const updated = [...prev];
          updated[botIndex] = { sender: 'bot', text: botReply };
          return updated;
        });
      }

      // 📌 Setelah selesai streaming, sinkronkan dengan database
      await fetchChatHistory();

    } catch (err) {
      console.error('Error streaming message:', err);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, an error occurred.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={chatbotStyles.container}>
      <div style={chatbotStyles.header}>
        <h1 style={chatbotStyles.heading}>Chatbot AI</h1>
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            style={chatbotStyles.dropdownButton}
            aria-expanded={isDropdownOpen}
          >
            ⚙
          </button>
          {isDropdownOpen && (
            <div style={chatbotStyles.dropdownMenu}>
              <LogoutButton />
              <button
                onClick={() => {
                  router.push('/delete-account');
                  setIsDropdownOpen(false);
                }}
                style={chatbotStyles.dropdownItemButton}
              >
                Delete Account
              </button>
            </div>
          )}
        </div>
      </div>

      {isLoading && <p style={chatbotStyles.loadingMessage}>Loading chat history...</p>}
      {error && <p style={chatbotStyles.errorMessage}>{error}</p>}

      <div style={chatbotStyles.messagesContainer}>
        {!isLoading && !error && messages.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666' }}>Start your conversation! (No history)</p>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...chatbotStyles.messageBubble,
              ...(msg.sender === 'user' ? chatbotStyles.userMessage : chatbotStyles.botMessage),
            }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} style={chatbotStyles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={chatbotStyles.inputField}
          disabled={isLoading}
        />
        <button type="submit" style={chatbotStyles.sendButton} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

const chatbotStyles = {
  container: { display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)', fontFamily: 'Inter, sans-serif', color: '#ecf0f1' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'linear-gradient(90deg, #1a252f 0%, #2c3e50 100%)', color: '#ecf0f1', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  heading: { margin: 0, fontSize: '24px', fontWeight: '600' },
  messagesContainer: { flexGrow: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#34495e', display: 'flex', flexDirection: 'column', gap: '10px' },
  messageBubble: { padding: '12px 18px', borderRadius: '25px', maxWidth: '80%', wordWrap: 'break-word', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#007bff', color: 'white', borderBottomRightRadius: '5px' },
  botMessage: { alignSelf: 'flex-start', backgroundColor: '#556270', color: '#ecf0f1', borderBottomLeftRadius: '5px' },
  inputForm: { display: 'flex', padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#2c3e50' },
  inputField: { flexGrow: 1, padding: '12px 18px', border: '1px solid #556270', borderRadius: '25px', marginRight: '10px', fontSize: '16px', backgroundColor: '#4a5b6b', color: '#ecf0f1', outline: 'none' },
  sendButton: { padding: '12px 25px', background: 'linear-gradient(45deg, #007bff 0%, #0056b3 100%)', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  loadingMessage: { textAlign: 'center', padding: '15px', color: '#bbdefb', fontStyle: 'italic' },
  errorMessage: { textAlign: 'center', padding: '15px', color: '#ff7675', fontWeight: 'bold' },
  dropdownButton: { background: 'none', border: 'none', color: '#ecf0f1', cursor: 'pointer', fontSize: '24px', padding: '0' },
  dropdownMenu: { position: 'absolute', top: '100%', right: '0', backgroundColor: '#1a252f', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', padding: '10px', display: 'flex', flexDirection: 'column', minWidth: '200px', gap: '10px', marginTop: '10px' },
  dropdownItemButton: { width: '100%', padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', textAlign: 'left' },
};
