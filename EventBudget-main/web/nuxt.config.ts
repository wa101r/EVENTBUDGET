export default defineNuxtConfig({
  builder: "vite",
  modules: ["nuxt-icon"],   // ← ต้องมีอันนี้!!!

  runtimeConfig: {
    public: {
      API_URL: process.env.NUXT_PUBLIC_API_URL || "http://localhost:8000"
    },
    API_URL_INTERNAL: process.env.NUXT_API_URL_INTERNAL || "http://eventbudget_app:8000"
  },

  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 100,
      },
      hmr: { host: "localhost" }
    }
  },

  css: ['@/assets/css/tailwind.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    }
  },

  srcDir: "app/"
});
