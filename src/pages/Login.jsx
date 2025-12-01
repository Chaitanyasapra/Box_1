
// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import loginBg from '../images/login_page_background_2.jpg';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post('/auth/login', { username, password });
      const { token } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('username', res.data.username);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login Attempt Failed. Please Try Again');
    }
  };

  // 🔔 Auto-dismiss the error toast after 3 seconds
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 3000);
    return () => clearTimeout(timer);
  }, [error]);

  return (
    <>
      <div className="LoginSplit">
        {/* Left: Form */}
        <section className="LoginLeft">
          <div className="LoginCard">
            <h1 className="h1_label"><i>Welcome to ShopSphere</i></h1>
            <h4 className="h1_label"><i>Start Your Adventure now today</i></h4>

            <form onSubmit={submit} className="LoginForm">
              <div className="FormRow">
                <label htmlFor="username"><b>&nbsp;&nbsp;&nbsp;&nbsp;Username</b></label>
                <input
                  id="username"
                  className="input1"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>

              <div className="FormRow">
                <label htmlFor="password"><b>&nbsp;&nbsp;&nbsp;&nbsp;Password</b></label>
                <input
                  id="password"
                  className="input1"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              {/* Inline error (optional to keep) */}
              {/* {error && <p className="error1" role="alert">{error}</p>} */}

              <button className="submit1" type="submit">Login</button>
            </form>

            
            <h6 className="h1_label">
              <i>
                Not a user yet?{' '}
                <Link to="/SignUpPage" className="SignUpLink">Sign Up</Link>
              </i>
            </h6>


            {/* ✅ Temporary Toast */}
            {error && (
              <div
                className="Toast Toast--error"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </div>
            )}
          </div>
        </section>

        {/* Right: Image */}
        <section className="LoginRight" aria-hidden="true">
          <div className="LoginHeroBg" style={{ backgroundImage: `url(${loginBg})` }} />
        </section>
      </div>
    </>
  );
}
