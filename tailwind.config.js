/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      keyframes: {
        pulseSlow: {
          "0%,100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
        },
        pulseMove: {
          "0%":   { transform: "translate(0,0) scale(1)" },
          "50%":  { transform: "translate(40px,-30px) scale(1.1)" },
          "100%": { transform: "translate(-20px,20px) scale(1)" },
        },
      },
      animation: {
        pulseSlow: "pulseSlow 10s ease-in-out infinite",
        pulseMove: "pulseMove 20s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};
