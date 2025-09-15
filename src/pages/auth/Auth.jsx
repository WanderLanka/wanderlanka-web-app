import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import { toast } from 'react-toastify';
import Input from "../../components/common/Input";
import { validateLogin, validateSignup } from "../../utils/validation";
import { authAPI } from "../../services/api";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "traveler"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

   const sriLankaImages = [
    "https://images.unsplash.com/photo-1522310193626-604c5ef8be43?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // beach
    "https://images.unsplash.com/photo-1642498041677-d26b9dfc5e61?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // temple
    "https://images.unsplash.com/photo-1653151106419-b91300e4be19?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // wildlife
    "https://images.unsplash.com/photo-1525849306000-cc26ceb5c1d7?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",  // mountains
    "https://images.unsplash.com/photo-1566650576880-6740b03eaad1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ];

  const [currentImage, setCurrentImage] = useState(0);

   // Change image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % sriLankaImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sriLankaImages.length]);


  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    if (error) setError("");
  };

  // Navigate to dashboard based on user role
  const navigateToDashboard = (role) => {
    if (role === "traveler") {
      navigate("/user");
    } else if (role === "accommodation") {
      navigate("/accommodation");
    } else if (role === "transport") {
      navigate("/transport");
    } else if (role === "guide") {
      // Guide routes not yet implemented, redirect to home for now
      navigate("/");
    } else if (role === "Sysadmin" || role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    let validationError = isLogin
      ? validateLogin(formData)
      : validateSignup(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      let response;
      if (isLogin) {
        response = await authAPI.login({
          username: formData.username,
          password: formData.password
        });
        
        // Store authentication data for login
        if (response.token) {
          localStorage.setItem("token", response.token);
        }
        if (response.refreshToken) {
          localStorage.setItem("refreshToken", response.refreshToken);
        }
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
        }
        
        setError("");
        toast.success(`Login successful! Welcome ${response.user?.username || formData.username}!`);
        
        // Navigate to dashboard based on role
        const userRole = response.user?.role || formData.role;
        navigateToDashboard(userRole);
      } else {
        response = await authAPI.register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
        
        setError("");
        // Registration successful - no tokens returned, user needs to login
        if (response.user?.role === 'guide' && response.user?.status === 'pending') {
          toast.info(
                `Registration successful! ${response.user?.username}, your guide application is under review. You will be notified when approved.`
              );        
        } else {
           toast.success(
              `Registration successful! Welcome ${response.user?.username || formData.username}! Please login to access your account.`
            );
        }
        
        // Switch to login mode after successful registration
        setIsLogin(true);
        setFormData({
          username: formData.username, // Keep username for easy login
          email: "",
          password: "",
          confirmPassword: "",
          role: "traveler"
        });
      }
      if (!isLogin) {
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "traveler"
        });
      }
    } catch (error) {
      setError(error.response?.data?.error || `${isLogin ? 'Login' : 'Registration'} failed. Please try again.`); //ERROR MESSAGE FIXES HERE  (.error instead of .message)
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
      confirmPassword: "",
      role: "traveler"
    });
    setError("");
  };

  return (
    <div className="min-h-screen flex bg-white">
     
     <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {sriLankaImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Sri Lanka"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏝️</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">WanderLanka</h1>
            <p className="text-gray-600">Your gateway to Sri Lanka</p>
          </div>

          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {isLogin ? "Welcome back!" : "Join WanderLanka"}
            </h2>
            <p className="text-gray-600">
              {isLogin ? "Sign in to your account" : "Create your account to get started"}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-red-400 text-xl"></span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            {/* Username Field */}
            <Input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Username"
              leftIcon={<User className="w-5 h-5 text-gray-400" />}
            />

            {/* Email Field (Register only) */}
            {!isLogin && (
              <Input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email"
                leftIcon={<Mail className="w-5 h-5 text-gray-400" />}
              />
            )}

            {/* Password Field */}
            <Input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Password"
              minLength={6}
              leftIcon={<Lock className="w-5 h-5 text-gray-400" />}
            />
            {/* Confirm Password Field (Register only) */}
            {!isLogin && (
              <Input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm Password"
                minLength={6}
                leftIcon={<Lock className="w-5 h-5 text-gray-400" />}
                error={formData.confirmPassword && formData.confirmPassword !== formData.password ? "Passwords do not match" : undefined}
              />
            )}
            {/* Role Field (Register only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="role">
                  I am a...
                </label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl text-base transition-all duration-200 outline-none bg-gray-50 focus:bg-white focus:border-emerald-500 focus:shadow-lg focus:shadow-emerald-500/20 appearance-none cursor-pointer"
                    id="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="traveler">Traveler</option>
                    <option value="transport">Transport Provider</option>
                    <option value="accommodation">Accommodation Provider</option>
                    <option value="guide">Tour Guide</option>
                  </select>
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <span><User className="w-5 h-5 text-gray-400" /></span>
                  </div>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    <span>▼</span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              className={`w-full py-2 px-2 rounded-xl font-semibold text-lg transition-all duration-300 ${
                loading 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl hover:shadow-emerald-500/25'
              }`}
              variant = "primary"
              type="button"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{isLogin ? "Signing you in..." : "Creating your account..."}</span>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {isLogin ? "Log In" : "Create Account"}
                  <span>{isLogin ? "→" : ""}</span>
                </span>
              )}
            </button>
          </div>

          {/* Toggle between Login and Register */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px bg-gray-300 flex-1"></div>
              <span className="text-gray-500 text-sm">or</span>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>
            
            <p className="text-gray-600">
              {isLogin ? "New to WanderLanka?" : "Already have an account?"}
            </p>
            <button
              onClick={toggleMode}
              className="mt-2 text-emerald-600 hover:text-emerald-700 font-semibold text-lg transition-colors duration-200 underline-offset-4 hover:underline"
            >
              {isLogin ? "Create an account" : "Sign in instead"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;