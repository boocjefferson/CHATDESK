/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        "plus-jakarta": ['"Plus Jakarta Sans"', "sans-serif"],
      },
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
        // Ticket-status categorical triad for charts (Analytics Overview).
        // Same hue families as TicketStatusBadge (yellow/blue/green);
        // validated as a set via dataviz skill's validate_palette.js
        // (lightness band, chroma floor, CVD ΔE, contrast vs white surface).
        status: {
          pending: "#B45309",
          active: "#2563EB",
          resolved: "#16A34A",
        },
      },
    },
  },
  plugins: [],
};
