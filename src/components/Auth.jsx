// Auth.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // Make sure this path is correct

const Auth = ({ onLoggedIn }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [message, setMessage] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false); // To toggle between sign-up and sign-in forms

  useEffect(() => {
    // Clear message when switching forms
    setMessage('');
  }, [isSigningUp]);

  const handleAuth = async (event, type) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let authResponse;
      if (type === 'signup') {
        authResponse = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              full_name: fullName,
              student_id: studentId,
            },
          },
        });
      } else { // type === 'signin'
        authResponse = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
      }

      const { data, error } = authResponse;

      if (error) {
        throw error;
      }

      if (data.user) {
        setMessage(`Successfully ${type === 'signup' ? 'signed up' : 'logged in'}!`);
        // Call the parent's callback to indicate successful login
        if (onLoggedIn) {
            onLoggedIn(data.user);
        }
      } else if (type === 'signup' && data.session === null) {
          setMessage('Sign up successful! Please check your email for a confirmation link.');
      }

    } catch (error) {
      setMessage(`Error: ${error.message}`);
      console.error('Auth error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '450px', margin: '50px auto', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#333' }}>
        {isSigningUp ? 'Sign Up' : 'Sign In'}
      </h2>

      <form onSubmit={(e) => handleAuth(e, isSigningUp ? 'signup' : 'signin')}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
          <input
            id="email"
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: 'calc(100% - 22px)', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password:</label>
          <input
            id="password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: 'calc(100% - 22px)', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        {isSigningUp && (
          <>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="fullName" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Full Name:</label>
              <input
                id="fullName"
                type="text"
                placeholder="e.g., John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={isSigningUp}
                style={{ width: 'calc(100% - 22px)', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="studentId" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Student ID:</label>
              <input
                id="studentId"
                type="text"
                placeholder="e.g., ND-2025-A-001"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required={isSigningUp}
                style={{ width: 'calc(100% - 22px)', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '12px', backgroundColor: isSigningUp ? '#007BFF' : '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '17px', fontWeight: 'bold' }}
        >
          {loading ? 'Loading...' : (isSigningUp ? 'Sign Up' : 'Sign In')}
        </button>
      </form>

      {message && <p style={{ marginTop: '20px', color: message.startsWith('Error') ? 'red' : 'green', textAlign: 'center' }}>{message}</p>}

      <p style={{ marginTop: '25px', textAlign: 'center', color: '#555' }}>
        {isSigningUp ? 'Already have an account?' : 'Don\'t have an account?'}
        <button
          onClick={() => setIsSigningUp(!isSigningUp)}
          style={{ background: 'none', border: 'none', color: '#007BFF', cursor: 'pointer', marginLeft: '8px', textDecoration: 'underline' }}
        >
          {isSigningUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
};

export default Auth;