/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"]
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        inagov: {
          primary: "#1E5CB3",
          "primary-content": "#ffffff",
          secondary: "#E8F0FA",
          accent: "#2563EB",
          "base-100": "#ffffff",
          "base-200": "#F6F8FB",
          neutral: "#1F2937",
          "neutral-content": "#ffffff",
          info: "#2563EB",
          success: "#16A34A",
          warning: "#D97706",
          error: "#DC2626",
        },
      },
    ],
    defaultTheme: "inagov",
  },
}
