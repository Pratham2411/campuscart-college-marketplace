/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F172A",
        mist: "#F8FAFC",
        accent: "#F97316",
        emerald: "#0F766E",
        dusk: "#3B2F63",
        peach: "#FFF1E8"
      },
      fontFamily: {
        display: ["'Space Grotesk'", "ui-sans-serif", "system-ui"],
        body: ["'Manrope'", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        soft: "0 20px 60px rgba(15, 23, 42, 0.12)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top, rgba(249, 115, 22, 0.18), transparent 32%), radial-gradient(circle at 20% 20%, rgba(15, 118, 110, 0.12), transparent 24%), linear-gradient(135deg, #fff7ed 0%, #f8fafc 60%, #eff6ff 100%)"
      }
    }
  },
  plugins: []
};
