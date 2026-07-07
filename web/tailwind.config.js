/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // USTP brand palette, pulled from the official e-Learning Portal login
      // screen (Zaki's reference). Reuse these classes app-wide instead of
      // hardcoding hex values in individual components.
      colors: {
        navy: {
          DEFAULT: "#1B2A6B",
          dark: "#12194A",
        },
        gold: {
          DEFAULT: "#F5A623",
        },
      },
    },
  },
  plugins: [],
};
