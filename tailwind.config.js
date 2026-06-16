/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pitch: {
          950: "#0a0f0d",
          900: "#0d1411",
          800: "#121b17",
          700: "#18241f",
          600: "#22332b",
        },
        chalk: "#e8f0eb",
        grass: {
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
        },
        flare: "#fbbf24",
      },
      fontFamily: {
        score: ['"DS-Digital"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};
