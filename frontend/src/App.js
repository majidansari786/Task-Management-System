import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';

const API_URL = 'http://localhost:5000/api/v1';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      // Set default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      throw error.response?.data?.error || 'Login failed';
    }
  };

  const handleRegister = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, { name, email, password });
      alert('Registration successful! Please login with your credentials.');
      setShowRegister(false);
    } catch (error) {
      throw error.response?.data?.error || 'Registration failed';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="App">
      {isAuthenticated ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <div className="auth-container">
          <div className="auth-box">
            <h1>Task Management System</h1>
            <p className="subtitle">Organize your tasks efficiently</p>
            {showRegister ? (
              <>
                <RegisterForm onRegister={handleRegister} />
                <p className="toggle-auth">
                  Already have an account? 
                  <button onClick={() => setShowRegister(false)}>Login</button>
                </p>
              </>
            ) : (
              <>
                <LoginForm onLogin={handleLogin} />
                <p className="toggle-auth">
                  Don't have an account? 
                  <button onClick={() => setShowRegister(true)}>Register</button>
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
