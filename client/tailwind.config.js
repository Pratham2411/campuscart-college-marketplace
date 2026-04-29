/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#F1F5F9",
        mist: "#08090C",
        accent: "#8B5CF6",
        emerald: "#10B981",
        dusk: "#0F1117",
        peach: "#181421"
      },
      fontFamily: {
        display: ["'Space Grotesk'", "ui-sans-serif", "system-ui"],
        body: ["'Manrope'", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        soft: "0 18px 60px rgba(0, 0, 0, 0.45), 0 0 36px rgba(124, 58, 237, 0.12)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(ellipse 80% 50% at 20% 0%, rgba(124, 58, 237, 0.12), transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(99, 102, 241, 0.08), transparent 60%), linear-gradient(135deg, #08090c 0%, #0f1117 55%, #111827 100%)"
      }
    }
  },
  plugins: []
};
