/** @type {import('tailwindcss').Config} */
export default {
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
        // ⭐️ เพิ่มสี danger ที่นี่
        'danger': { 
          DEFAULT: '#EF4444', 
          'hover': '#DC2626',
        },
      },
    },
  },
  plugins: [],
}