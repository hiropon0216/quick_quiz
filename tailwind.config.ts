import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Noto Sans JP", "system-ui", "sans-serif"],
        display: ["Orbitron", "Noto Sans JP", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#090a10",
        panel: "#151824",
        cyanGlow: "#19e6ff",
        magentaGlow: "#ff3fd4",
      },
    },
  },
  plugins: [],
} satisfies Config;
