/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./App.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'premium-gradient': {
          start: '#FFD700', // Shining yellow
          end: '#FFA500',   // Darker yellow/orange
        },
      },
    },
  },
  plugins: [],
};
