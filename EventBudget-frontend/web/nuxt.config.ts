// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss', // มีอยู่แล้ว
    '@pinia/nuxt',         // state management
    '@vueuse/nuxt',        // composables เสริม
    '@nuxt/icon',           // ใช้ไอคอนง่าย ๆ
  ],

  css: ['~/assets/css/tailwind.css'],

  srcDir: 'app/',
  serverDir: 'server',
})
