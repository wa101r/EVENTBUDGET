// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      // backend Laravel
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000/api',

      // exchange rate api
      exchangeApiKey: process.env.NUXT_PUBLIC_EXCHANGE_API_KEY || '02870fb2d04e8c1f3ff3690e',
      exchangeBase: process.env.NUXT_PUBLIC_EXCHANGE_BASE || 'USD',
    },
  },

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss', // มีอยู่แล้ว
    '@pinia/nuxt',         // state management
    '@vueuse/nuxt',        // composables เสริม
    '@nuxt/icon',          // ไอคอน
  ],

  css: ['~/assets/css/tailwind.css'],

  srcDir: 'app/',
  serverDir: 'server',
})
