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
        green: {
          DEFAULT: "#659F20",
          dark: "#4e7a18",
          light: "#8bc34a",
          50: "#f2f8e8",
          100: "#e0f0c8",
        },
        coral: {
          DEFAULT: "#ff725e",
          dark: "#e55a47",
        },
        cream: "#FAF0EA",
        dark: "#1a1a1a",
      },
      fontFamily: {
        sans: ["Albert Sans", "sans-serif"],
        body: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
