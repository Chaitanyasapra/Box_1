
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import './SignUpPage.css';
import loginBg from '../images/login_page_background.jpg';

export default function SignUpPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');            // ✅ NEW: email state
  const [role, setRole] = useState('User');          // ✅ NEW: role state (default User)
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
      // ⬇️ Send email and role to backend along with username/password
      const res = await api.post('/auth/signup', {
        username,
        email,
        role,       // "User" or "Merchant"
        password,
      });

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
            {/* <h1 className="h1_label"><i>ShopSphere</i></h1> */}
            <h2 className="h1_label"><i>Please Enter Your Details</i></h2>

            <form onSubmit={submit} className="LoginForm" noValidate>
              {/* Username */}
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

              {/* Password */}
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

              {/* ✅ Role */}
              <div className="FormRow">
                <label htmlFor="role"><b>&nbsp;&nbsp;&nbsp;&nbsp;Role</b></label>
                <select
                  id="role"
                  className="input1"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="User">User</option>
                  <option value="Merchant">Merchant</option>
                </select>
              </div>

              {/* ✅ Email */}
              <div className="FormRow">
                <label htmlFor="email"><b>&nbsp;&nbsp;&nbsp;&nbsp;Email</b></label>
                <input
                  id="email"
                  className="input1"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="you@example.com"
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
