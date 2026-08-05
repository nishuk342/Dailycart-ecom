import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/auth.css';
import { apiFetch } from '../api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();

      if (res.ok) {
        setOtpSent(true);
        alert('OTP sent to your email. Please enter it below to verify your account.');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiFetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();

      if (res.ok) {
        login(data);
        navigate('/');
      } else {
        alert(data.message || 'OTP verification failed');
      }
    } catch (error) {
      console.error(error);
      alert('OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {!otpSent ? (
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Register</h2>
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="btn" disabled={loading}>{loading ? 'Please wait...' : 'Register'}</button>
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="auth-form">
          <h2>Verify OTP</h2>
          <p style={{ color: '#a1a1aa', marginBottom: '15px' }}>We sent a 6-digit code to {email}</p>
          <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
          <button type="submit" className="btn" disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</button>
          <button type="button" className="btn" style={{ marginTop: '10px', background: '#475569' }} onClick={() => setOtpSent(false)}>
            Back
          </button>
        </form>
      )}
    </div>
  );
};

export default Register;
