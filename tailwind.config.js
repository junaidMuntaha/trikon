// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        glow: "glow 3s ease-in-out infinite",
      },
      keyframes: {
        glow: {
          "0%, 100%": { filter: "drop-shadow(0 0 4px #0ff) drop-shadow(0 0 8px #0ff)" },
          "50%": { filter: "drop-shadow(0 0 10px #0ff) drop-shadow(0 0 20px #0ff)" },
        },
      },
    },
  },
  plugins: [],
};
