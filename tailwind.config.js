/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        cream: "rgb(var(--cream) / <alpha-value>)",
        paper: "rgb(var(--paper) / <alpha-value>)",
        walnut: "rgb(var(--walnut) / <alpha-value>)",
        gold: "rgb(var(--gold) / <alpha-value>)",
        olive: "rgb(var(--olive) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
      },
      boxShadow: {
        velvet: "0 24px 80px rgb(47 34 23 / 0.16)",
        glow: "0 0 80px rgb(185 142 80 / 0.22)",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(120%)" },
        },
        breathe: {
          "0%,100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(0,-8px,0) scale(1.018)" },
        },
      },
      animation: {
        shimmer: "shimmer 2.4s ease-in-out infinite",
        breathe: "breathe 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
