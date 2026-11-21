import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2448D8", // Azul principal / isotipo
          dark: "#1C39AD",
          soft: "#EEF2FD",
        },
        accent: {
          DEFAULT: "#F2BD38", // Amarillo de acento / flechas
          soft: "#FEF7E4",
        },
        ink: "#1E293B", // Tipografía / encabezados
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F8F9FA",
        },
        line: "#E5E8EC",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: { xl: "0.75rem", "2xl": "1rem" },
    },
  },
  plugins: [],
};
export default config;
