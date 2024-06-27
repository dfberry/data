import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'dynamic-bg': 'var(--dynamic-bg-color)',
        'dynamic-text': 'var(--dynamic-text-color)',
      },
    },
  },
  plugins: [],
};
export default config;
