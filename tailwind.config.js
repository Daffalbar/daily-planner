/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0a0a0f",
          card: "#111118",
          elevated: "#16161f",
          border: "#1e1e2e",
        },
        accent: {
          DEFAULT: "#7c6aff",
          light: "#a59bff",
          dim: "#7c6aff22",
        },
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
        muted: "#4a4a6a",
        text: {
          DEFAULT: "#e8e8f0",
          muted: "#7a7a9a",
          dim: "#4a4a6a",
        },
      },
      keyframes: {
        fadeIn: { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideIn: { from: { opacity: "0", transform: "translateX(-12px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        pop: { "0%": { transform: "scale(1)" }, "50%": { transform: "scale(1.15)" }, "100%": { transform: "scale(1)" } },
        pulse2: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.5" } },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease forwards",
        slideIn: "slideIn 0.25s ease forwards",
        pop: "pop 0.3s ease",
        pulse2: "pulse2 2s ease infinite",
      },
    },
  },
  plugins: [],
};
