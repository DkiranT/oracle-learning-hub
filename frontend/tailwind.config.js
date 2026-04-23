/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Manrope", "sans-serif"]
      },
      colors: {
        slateInk: "#0f172a",
        mistBlue: "#e0f2fe",
        sand: "#f7f3ea",
        coral: "#fb923c",
        mint: "#6ee7b7"
      },
      boxShadow: {
        soft: "0 12px 40px -24px rgba(15, 23, 42, 0.45)",
        hover: "0 20px 48px -20px rgba(15, 23, 42, 0.35)"
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        rise: "rise 500ms ease-out both"
      }
    }
  },
  plugins: []
};
