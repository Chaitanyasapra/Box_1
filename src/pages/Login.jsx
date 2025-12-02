


// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import loginBg from '../images/login_page_background_2.jpg';
 
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
 
  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('email', res.data.email);
      navigate('/UserDashBoard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login Attempt Failed. Please Try Again');
    }
  };
 
  // 🔔 Auto-dismiss error toast after 3 seconds
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
                <label htmlFor="email"><b>&nbsp;&nbsp;&nbsp;&nbsp;Email</b></label>
                <input
                  id="email"
                  className="input1"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
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
 
              <button className="submit1" type="submit">Login</button>
            </form>
 
            <h6 className="h1_label">
              <i>
                Not a user yet?{' '}
                <Link to="/SignUpPage" className="SignUpLink">Sign Up</Link>
              </i>
            </h6>
 
            {/* Toast Error */}
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
 