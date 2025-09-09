import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import "../styles/Auth.css"; // Commented out to avoid conflicts with Tailwind CSS
import api from "../services/axiosConfig"; // Adjust the import path as necessary

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5 font-sans">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 p-10 text-center text-white">
          <h1 className="text-4xl font-bold mb-2 font-serif">WanderLanka</h1>
          <p className="text-lg opacity-90 font-normal">
            {isLogin ? "Welcome back! Please log in." : "Create your account to get started."}
          </p>
        </div>

        {/* Form Container */}
        <div className="p-10">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Username Field */}
            <div className="flex flex-col">
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="username">
                Username
              </label>
              <input
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all duration-150 outline-none font-sans bg-white focus:border-green-600 focus:shadow-[0_0_0_3px_rgba(5,150,105,0.1)] placeholder:text-gray-400"
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
              <div className="flex flex-col">
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all duration-150 outline-none font-sans bg-white focus:border-green-600 focus:shadow-[0_0_0_3px_rgba(5,150,105,0.1)] placeholder:text-gray-400"
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
            <div className="flex flex-col">
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all duration-150 outline-none font-sans bg-white focus:border-green-600 focus:shadow-[0_0_0_3px_rgba(5,150,105,0.1)] placeholder:text-gray-400"
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
              <div className="flex flex-col">
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="role">
                  Role
                </label>
                <select
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all duration-150 outline-none font-sans bg-white focus:border-green-600 focus:shadow-[0_0_0_3px_rgba(5,150,105,0.1)]"
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
              className={`px-6 py-4 rounded-lg font-semibold text-base border-none cursor-pointer transition-all duration-200 text-center no-underline inline-flex items-center justify-center gap-2 font-sans mt-2 w-full ${
                loading 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isLogin ? "Logging in..." : "Creating account..."}
                </span>
              ) : (
                isLogin ? "Log In" : "Create Account"
              )}
            </button>
          </form>

          {/* Toggle between Login and Register */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={toggleMode}
                className="ml-1 text-green-600 hover:text-green-700 font-semibold bg-none border-none cursor-pointer transition-colors duration-150"
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