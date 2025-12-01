import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // matches your Login import
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(() => localStorage.getItem('username') || 'Guest');
  const [profile, setProfile] = useState(null); // optional profile from backend
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If you have a backend endpoint like GET /api/profile, try to fetch it.
    // If backend isn't ready, this will fail but UI still works.
    const token = localStorage.getItem('token');
    if (!token) return; // frontend-only: no token -> skip backend call

    let mounted = true;
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/profile'); // backend should handle /api/profile
        if (!mounted) return;
        setProfile(res.data);
        // If backend returns a canonical username, update it:
        if (res.data?.username) setUsername(res.data.username);
      } catch (err) {
        // gracefully ignore backend errors for now
        if (!mounted) return;
        setError(err.response?.data?.error || 'Could not fetch profile (backend maybe offline)');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProfile();
    return () => { mounted = false; };
  }, []);

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dash-root">
      <header className="dash-header">
        <h1>Dashboard</h1>
        <div className="dash-header-right">
          <span className="dash-username">Hello, <strong>{username}</strong></span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="dash-main">
        <section className="card">
          <h3>Quick Actions</h3>
          <p>These are UI-only for now. Connect to APIs when backend is ready.</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={() => alert('Demo action 1')}>Demo action</button>
            <button onClick={() => alert('Demo action 2')}>Another</button>
          </div>
        </section>

        <section className="card">
          <h3>Profile</h3>

          {loading && <p>Loading profile…</p>}
          {error && <p style={{ color: 'crimson' }}>{error}</p>}

          {!loading && !profile && (
            <div>
              <p>Username: <strong>{username}</strong></p>
              <p>Email: <em>not available</em></p>
              <p>Connect to backend to show more profile info.</p>
            </div>
          )}

          {!loading && profile && (
            <div>
              <p>Username: <strong>{profile.username || username}</strong></p>
              {profile.email && <p>Email: {profile.email}</p>}
              {profile.role && <p>Role: {profile.role}</p>}
              {/* render other profile fields here */}
            </div>
          )}
        </section>

        <section className="card">
          <h3>Developer notes</h3>
          <p style={{ marginBottom: 8 }}>
            Your axios baseURL is already set to <code>http://localhost:8888/api</code>.
            When backend is ready, implement <code>GET /api/profile</code> to return user info.
          </p>
          <button onClick={async () => {
            // example: call a test endpoint if you want to try
            try {
              const res = await api.get('/test'); 
              alert('Test response: ' + JSON.stringify(res.data));
            } catch (e) {
              alert('Test failed. Backend may be offline.');
            }
          }}>
            Call /test endpoint
          </button>
        </section>
      </main>
    </div>
  );
}