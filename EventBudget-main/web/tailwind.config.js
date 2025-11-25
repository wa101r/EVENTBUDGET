// tailwind.config.js
export default {
  content: [
    "./app/**/*.{vue,js,ts}",
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.{vue,js,ts}",
    "./pages/**/*.{vue,js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'base-bg': '#F9FAFB',
        'base-card': '#FFFFFF',
        'base-border': '#E5E7EB',

        'accent': {
          DEFAULT: '#FF6600',
          'hover': '#E05A00',
        },

        'accent-dark': '#333333',

        'text-primary': '#1F2937',
        'text-secondary': '#6B7280',

        // ⭐️ เพิ่ม danger ที่ต้องการ
        'danger': { 
          DEFAULT: '#EF4444', 
          'hover': '#DC2626',
        },
      },
    },
  },
  plugins: [],
}
