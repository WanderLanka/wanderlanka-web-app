import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css"; // Import the CSS file
import api from "./axiosConfig"; // Adjust the import path as necessary

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "tourist"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin 
        ? { username: formData.username, password: formData.password }
        : formData;

      const response = await axios.post(`http://localhost:3000${endpoint}`, payload);

      // Store token and user data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Set default authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      console.log(`${isLogin ? 'Login' : 'Registration'} successful:`, response.data);
      console.log("User data:", response.data.user.role);
      
      if(isLogin) {
        switch (response.data.user.role) {
          case 'tourist':
            navigate('/tourist');
            break;
          case 'transport':
            navigate('/transport');
            break;
          case 'accommodation':
            navigate('/accommodation');
            break;
          case 'guide':
            navigate('/guide');
            break;
          case 'Sysadmin':
            navigate('/Admin');
            break;
          default:
            navigate('/');
            break;
        }
      } else {
        navigate('/Auth');
      }
      
    } catch (error) {
      console.error(`${isLogin ? 'Login' : 'Registration'} failed:`, error.response?.data || error.message);
      setError(error.response?.data?.error || `${isLogin ? 'Login' : 'Registration'} failed. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "tourist"
    });
    setError("");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">WanderLanka</h1>
          <p className="auth-subtitle">
            {isLogin ? "Welcome back! Please log in." : "Create your account to get started."}
          </p>
        </div>

        {/* Form Container */}
        <div className="auth-content">
          {/* Error Alert */}
          {error && (
            <div className="error-alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Username Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="username">
                Username
              </label>
              <input
                className="form-input"
                type="text"
                id="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your username"
              />
            </div>

            {/* Email Field (Register only) */}
            {!isLogin && (
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <input
                  className="form-input"
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>
            )}

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                className="form-input"
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                minLength={6}
              />
            </div>

            {/* Role Field (Register only) */}
            {!isLogin && (
              <div className="form-group">
                <label className="form-label" htmlFor="role">
                  Role
                </label>
                <select
                  className="form-select"
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="tourist">🏖️ Tourist</option>
                  <option value="transport">🚗 Transport Provider</option>
                  <option value="accommodation">🏨 Accommodation Provider</option>
                  <option value="guide">🗺️ Guide</option>
                </select>
              </div>
            )}

            {/* Submit Button */}
            <button
              className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-loading-content">
                  <div className="spinner"></div>
                  {isLogin ? "Logging in..." : "Creating account..."}
                </span>
              ) : (
                isLogin ? "Log In" : "Create Account"
              )}
            </button>
          </form>

          {/* Toggle between Login and Register */}
          <div className="auth-toggle">
            <p className="toggle-text">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={toggleMode}
                className="toggle-button"
              >
                {isLogin ? "Create one" : "Log in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;