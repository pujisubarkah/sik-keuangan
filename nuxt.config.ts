// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap'
        }
      ]
    }
  },
  css: [
    '~/assets/css/main.css',
  ],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  plugins: [
    { src: '~/plugins/auth-fetch.ts', mode: 'client' },
    '~/plugins/pinia.js',
  ],
})
