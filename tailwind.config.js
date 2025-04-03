/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      blur: {
        180: "180px",
        100: "100px"
      },
      colors: {
        primary: '#26426e',      // Blue-600
        secondary: '#6366F1',    // Indigo-500
        darkBg: '#0F172A',       // Slate-900
        lightBg: '#F9FAFB',
        cardLight: '#FFFFFF',
        cardDark: '#1E293B',
        textLight: '#1F2937',
        textDark: '#F3F4F6',
        muted: '#9CA3AF'
      }
    }
  },
  plugins: []
};