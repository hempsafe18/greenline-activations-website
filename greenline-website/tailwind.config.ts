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
        // Retail activation palette — high contrast, productized
        ink: {
          DEFAULT: "#0A0A0A",
          soft: "#1A1A1A",
          mute: "#2E2E2E",
        },
        bone: {
          DEFAULT: "#FAF0EA",
          warm: "#F3E4D7",
        },
        canopy: {
          DEFAULT: "#5BB011",
          dark: "#3F7A0B",
          light: "#E6F5D5",
        },
        street: {
          DEFAULT: "#FF4F33",
          dark: "#E03E23",
          light: "#FFE2DB",
        },
        // legacy names still used in old pages
        green: {
          DEFAULT: "#5BB011",
          dark: "#3F7A0B",
          light: "#7FD13C",
          50: "#E6F5D5",
          100: "#D1ECB0",
        },
        coral: {
          DEFAULT: "#FF4F33",
          dark: "#E03E23",
        },
        cream: "#FAF0EA",
        dark: "#0A0A0A",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        body: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        brutal: "4px 4px 0px 0px #0A0A0A",
        "brutal-lg": "8px 8px 0px 0px #0A0A0A",
        "brutal-coral": "4px 4px 0px 0px #FF4F33",
        "brutal-canopy": "4px 4px 0px 0px #5BB011",
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "marquee-fast": "marquee 18s linear infinite",
        "pop-in": "popIn 260ms cubic-bezier(.2,.8,.2,1.2) both",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        popIn: {
          "0%": { transform: "scale(.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
