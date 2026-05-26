import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        // Метод palette — navy + cyan + violet. Names map 1:1 to the design tokens.
        canvas: "#0a0b0d",
        surface: "#111315",
        surface2: "#15181c",
        // Line tokens are intentionally rgba so they layer cleanly on canvas/surface.
        line: "rgba(255,255,255,0.06)",
        lineStrong: "rgba(255,255,255,0.10)",
        ink: {
          DEFAULT: "#e6e8ec",
          dim: "#a0a4ac",
          mute: "#6b7079",
        },
        cyan: {
          // Accent (Метод). Overrides Tailwind's cyan but we never use the original elsewhere.
          DEFAULT: "#5eb6ff",
          soft: "rgba(94,182,255,0.15)",
        },
        violet: {
          DEFAULT: "#a78bfa",
          soft: "rgba(167,139,250,0.15)",
        },
        good: "#4ade80",
        warn: "#fbbf24",
        bad: "#f87171",
      },
      borderRadius: {
        // The design uses tight radii consistently.
        DEFAULT: "6px",
        sm: "4px",
        md: "7px",
        lg: "8px",
        xl: "10px",
      },
      letterSpacing: {
        tightish: "-0.015em",
        tighter2: "-0.02em",
      },
      boxShadow: {
        focus: "0 0 0 3px rgba(94,182,255,0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
