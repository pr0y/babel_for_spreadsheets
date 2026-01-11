import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#1a1914",
          secondary: "#252420",
          tertiary: "#2f2e28",
        },
        text: {
          primary: "#e8e4d9",
          secondary: "#a09b8c",
          tertiary: "#6b6760",
        },
        accent: {
          primary: "#d4a24c",
          secondary: "#7eb77f",
          error: "#c75d5d",
        },
        grid: "rgba(232, 228, 217, 0.06)",
        border: "rgba(232, 228, 217, 0.1)",
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
