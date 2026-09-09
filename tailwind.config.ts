import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#101722",
        navy: "#172a46",
        cobalt: "#2c6bed",
        electric: "#4d8dff",
        mist: "#eef3f8",
        line: "#dce5ef",
        paper: "#f8fafc",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
        display: ["var(--font-space-grotesk)", "sans-serif"],
      },
      boxShadow: { soft: "0 16px 45px rgba(21, 48, 82, 0.09)" },
    },
  },
  plugins: [],
};
export default config;
