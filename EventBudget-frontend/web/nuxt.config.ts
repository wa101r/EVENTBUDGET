// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // ใช้โมดูล tailwind ของ Nuxt
  modules: ['@nuxtjs/tailwindcss'],

  // ตรงนี้ไม่ต้องใส่ postcss แล้ว ให้โมดูลจัดการเอง
  css: ['~/assets/css/tailwind.css'],

  srcDir: 'app/',
  serverDir: 'server',
})
