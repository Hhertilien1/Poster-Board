import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F172A",
        paper: "#FFFDF8",
        accent: "#0EA5A4",
        warm: "#F59E0B"
      },
      boxShadow: {
        card: "0 10px 30px rgba(15, 23, 42, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;