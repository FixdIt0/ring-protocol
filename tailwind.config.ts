import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        pixel: ["var(--font-vt323)", "monospace"],
        display: ["var(--font-press-start)", "monospace"],
      },
      colors: {
        ring: {
          cyan: "#3fb8ff",
          pink: "#ff3fa8",
          orange: "#ff7a3f",
          gold: "#ffd83f",
          red: "#ff4444",
          green: "#44ff88",
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        blink: "blink 1s step-end infinite",
        pulse_glow: "pulse_glow 2s ease-in-out infinite",
        glitch: "glitch 3s infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        pulse_glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(63,184,255,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(255,63,168,0.5)" },
        },
        glitch: {
          "0%, 100%": { textShadow: "2px 0 #ff3fa8, -2px 0 #3fb8ff" },
          "25%": { textShadow: "-2px 0 #ff7a3f, 2px 0 #ffd83f" },
          "50%": { textShadow: "2px -1px #3fb8ff, -2px 1px #ff3fa8" },
          "75%": { textShadow: "-1px 2px #ffd83f, 1px -2px #ff7a3f" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
