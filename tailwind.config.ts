import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Use system preference for dark mode
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        'background-secondary': 'var(--background-secondary)',
        'primary-text': 'var(--primary-text)',
        'secondary-text': 'var(--secondary-text)',
        borders: 'var(--borders)',
        highlight: 'var(--highlight)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Default Tailwind sans font
      },
    },
  },
  plugins: [],
};
export default config;
