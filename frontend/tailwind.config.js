/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#0B0F17",
          800: "#111827",
          700: "#1F2937",
          600: "#374151",
          500: "#4B5563"
        },
        neon: {
          500: "#22C55E",
          400: "#34D399"
        },
        teal: {
          500: "#14B8A6",
          400: "#2DD4BF"
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      backgroundImage: {
        "radial-fade": "radial-gradient(circle at top, rgba(34,197,94,0.2), transparent 60%)",
        "grid-dark": "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)"
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        },
        glow: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" }
        }
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        glow: "glow 4s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
