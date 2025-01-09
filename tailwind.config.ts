import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        wip: "repeating-linear-gradient( -45deg, #000, #000 30px, #ffdd00 30px, #ffdd00 50px )",
        stable1: "repeating-linear-gradient( -45deg, #04724D, #04724D 30px, #F06449 30px, #F06449 50px )",
        stable: "repeating-linear-gradient(45deg, #98C9A3, #98C9A3 20px, #EDEEC9 20px, #EDEEC9 40px)",
      },
      colors: {
        "black-soft": "#222222",
      },
    },
  },
} satisfies Config;
