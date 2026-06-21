import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';

export const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const { user } = useContext(AuthContext);
  const { loading, error, request, setError } = useApi();
  const navigate = useNavigate();

  // If already logged in, redirect to home
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!username.trim() || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      setSuccess(true);
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="auth-page">
      <div className="glass-card auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Get Started</h1>
          <p className="auth-subtitle">Create an account to collaborate on documents</p>
        </div>

        {error && (
          <div className="api-error-alert" role="alert">
            <span>⚠️</span> {error}
          </div>
        )}

        {success && (
          <div className="api-success-alert" role="alert">
            <span>✅</span> Account created successfully! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="form-input"
              placeholder="Minimum 3 characters"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading || success}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || success}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-input"
              placeholder="Re-type your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading || success}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading || success}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
