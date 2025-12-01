
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import './SignUpPage.css';
import loginBg from '../images/login_page_background.jpg';

export default function SignUpPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    // ✅ Respect native HTML5 validation for required inputs
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setError(null);
    try {
      // ⬇️ Adjust endpoint to match your backend (e.g., /auth/register)
      const res = await api.post('/auth/signup', { username, password });

      // If your API returns a token upon signup, store and redirect
      const { token, username: uname } = res.data || {};
      if (token) {
        localStorage.setItem('token', token);
      }
      if (uname) {
        localStorage.setItem('username', uname);
      }

      // ✅ Redirect to dashboard or login after successful signup
      navigate('/dashboard'); // or navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to register. Please try again.');
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
        {/* LEFT: Image */}
        <section className="LoginLeft" aria-hidden="true">
          <div className="LoginHeroBg" style={{ backgroundImage: `url(${loginBg})` }} />
        </section>

        {/* RIGHT: Form */}
        <section className="LoginRight">
          <div className="LoginCard">
            <h1 className="h1_label"><i>ShopSphere</i></h1>
            <h4 className="h1_label"><i>Sign up today for exciting offers</i></h4>

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
                  autoComplete="new-password"
                  required
                />
              </div>

              <button className="submit1" type="submit">Register</button>
            </form>

            <h6 className="h1_label">
              <i>
                Already a user?{' '}
                <Link to="/login" className="SignUpLink">Sign In</Link>
              </i>
            </h6>

            {/* ✅ Temporary Toast */}
            {error && (
              <div className="Toast Toast--error" role="alert" aria-live="assertive">
                {error}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
