// src/utils/validation.js

export function validateLogin(formData) {
  if (!formData.username || !formData.password) {
    return "Username and password are required.";
  }
  return null;
}

export function validateSignup(formData) {
  if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
    return "All fields are required.";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return "Please enter a valid email address.";
  }
  if (formData.password.length < 6) {
    return "Password must be at least 6 characters.";
  }
  if (formData.password !== formData.confirmPassword) {
    return "Passwords do not match.";
  }
  return null;
}
