/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",   // azul principal
        primaryDark: "#1e40af",
        bgSoft: "#f9fafb",
        textBase: "#1f2937"
      },
      boxShadow: {
        card: "0 10px 20px rgba(2, 6, 23, 0.06)",
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.25rem",
      }
    },
  },
  plugins: [],
};