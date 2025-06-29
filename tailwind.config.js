/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [require("nativewind/preset")], // ✅ Correct way
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF", // Example primary color
        secondary: "#FBBF24", // Example secondary color
        accent: "#EF4444", // Example accent color
        light: {
          100: "#F3F4F6", // Light gray
          200: "#E5E7EB", // Lighter gray
          300: "#D1D5DB", // Light gray
        },
        dark: {
          100: "#111827", // Dark gray
          200: "#1F2937", // Darker gray
          300: "#374151", // Darkest gray
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Merriweather", "serif"],
        mono: ["Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};
