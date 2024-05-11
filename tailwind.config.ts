import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: { max: "640px" },
      md: { max: "768px" },
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      backgroundImage: {
        wip: "repeating-linear-gradient( -45deg, #000, #000 30px, #ffdd00 30px, #ffdd00 50px )",
      },
      colors: {
        "black-soft": "#222222",
      },
    },
    plugins: [],
  },
};

export default config;