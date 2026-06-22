/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Tema cálido y editorial: tinta oscura sobre papel cálido,
        // con acento terracota (mediterráneo) y verde pino de apoyo.
        ink: {
          DEFAULT: "#17151a",
          800: "#262430",
          600: "#4b4757",
          400: "#7a7589",
        },
        paper: "#faf6f0",
        sand: "#f1e8dc",
        line: "#e3d8c8",
        terracotta: {
          400: "#e98a63",
          500: "#df6b3c",
          600: "#c8552a",
          700: "#a4421f",
        },
        pine: {
          500: "#1f6f5c",
          600: "#185a4a",
        },
      },
      fontFamily: {
        display: ['"Fraunces"', "ui-serif", "Georgia", "serif"],
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(23,21,26,0.04), 0 8px 24px rgba(23,21,26,0.06)",
        lift: "0 12px 40px rgba(23,21,26,0.12)",
      },
    },
  },
  plugins: [],
};
