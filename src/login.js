import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './App.css';

function Login() {
  const navigate = useNavigate(); 
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [error, setError] = useState('');

  const authenticateUser = async (credentials) => {
    try {
      const response = await fetch('https://learn.reboot01.com/api/auth/signin', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Failed to login. Please check your credentials.');
      }

      const data = await response.json();
      const token = data;
      return token;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const credentials = window.btoa(`${email}:${password}`);

    try {
      const token = await authenticateUser(credentials);
      sessionStorage.setItem('hhh', token); 
      navigate('/profile'); 
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to login. Please check your credentials.');
    }
  };

  return (
    <div id="container">
      <div id="login-form">
        <h2>Login</h2>
        <br/>
        <h5>Login to your Reboot account:</h5>
        <form id="loginForm" onSubmit={handleSubmit}>
          <input 
            type="text" 
            id="email" 
            placeholder="Email or User"
            ref={emailRef}
            required 
          />
          <input 
            type="password" 
            id="password" 
            placeholder="Password" 
            ref={passwordRef}
            required 
          />
          <button type="submit">
            Login
          </button>
        </form>
        {error && <div id="error-message">{error}</div>}
      </div>
      <div id="paragraph">
        <p>
        This is a project for Reboot01 created by students, helping them learn GraphQL API.
        Additional explanation about the project goes here. This platform is designed to support learning and development by providing hands-on experience with real-world technologies like GraphQL.
        </p>
      </div>
    </div>
  );
}

export default Login;
