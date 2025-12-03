// src/pages/SignUpPage.jsx
import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import loginBg from "../images/login_page_background.jpg";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("BUYER");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [locationId, setLocationId] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/signup", {
        name: username,
        email,
        password,
        phone,
        role,
        locationId,
      });

      const { token, userId, name } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("username", name);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Could not register.");
    }
  };

  // auto-dismiss error
  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 3000);
    return () => clearTimeout(t);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
      <div className="container mx-auto max-w-6xl shadow-lg rounded-lg overflow-hidden bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left - hero image */}
          <div
            className="hidden md:block bg-cover bg-center"
            style={{
              backgroundImage: `url(${loginBg})`,
              minHeight: "520px",
            }}
          />

          {/* Right - form */}
          <div className="p-8 lg:p-12">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Create your account
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Join ShopSphere — start selling or shopping in minutes.
              </p>

              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                    placeholder="Your display name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                    className="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    type="password"
                    className="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                    placeholder="Create a secure password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                    placeholder="+91 9xxxxxxxxx"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-white"
                    >
                      <option value="BUYER">User</option>
                      <option value="SELLER">Merchant</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <select
                      required
                      value={locationId}
                      onChange={(e) => setLocationId(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-white"
                    >
                      <option value="">Select a Location</option>
                      <option value="1">Chandigarh</option>
                      <option value="2">Jaipur</option>
                      <option value="3">Pune</option>
                      <option value="4">Bangalore</option>
                    </select>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-black text-white rounded-md hover:opacity-95"
                  >
                    Register
                  </button>
                </div>
              </form>

              <div className="mt-4 text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-black font-medium">
                  Sign in
                </Link>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mt-4 rounded-md bg-red-50 border border-red-100 p-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}