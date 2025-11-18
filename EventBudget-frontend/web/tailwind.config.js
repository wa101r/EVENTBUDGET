/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{vue,js,ts}",   // ครอบทุกหน้าใน srcDir = app
  ],
  theme: {
    extend: {
      colors: {
        dinsor: "#F37021",
        darkblue: "#0F1F2F",
      },
    },
  },
  plugins: [],
}
