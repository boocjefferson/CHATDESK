/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // Inter app-wide, per Jefferson's request - covers both the default
      // sans stack (body text, buttons, tables, forms, nav) and the
      // "plus-jakarta" utility (still used for headings/brand wordmark in a
      // handful of files) so nothing needs to be touched at the call site.
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        "plus-jakarta": ["Inter", "sans-serif"],
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
