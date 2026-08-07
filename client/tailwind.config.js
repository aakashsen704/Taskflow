/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F6F4EE",
        ink: "#23221D",
        muted: "#7A756A",
        line: "#E1DCCE",
        card: "#FFFFFF",
        accent: {
          DEFAULT: "#1F6F5C",
          dark: "#164F42",
          light: "#E4EFEA",
        },
        high: { DEFAULT: "#B8452E", light: "#F6E3DD" },
        medium: { DEFAULT: "#C98A2C", light: "#F5EAD5" },
        low: { DEFAULT: "#4C6B8A", light: "#E4EAF1" },
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(35,34,29,0.06), 0 1px 0 rgba(35,34,29,0.04)",
        lift: "0 8px 24px rgba(35,34,29,0.10)",
      },
      borderRadius: {
        card: "10px",
      },
    },
  },
  plugins: [],
};
