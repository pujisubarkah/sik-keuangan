// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap'
        },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/@mdi/font@7.2.96/css/materialdesignicons.min.css'
        },
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
        },
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap3-glyphicons/1.0.0/bootstrap-glyphicons.min.css'
        }
        // Bootstrap CSS removed to avoid style conflicts
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
    { src: '~/plugins/fusioncharts.js', mode: 'client' },
    { src: '~/plugins/apexcharts.js', mode: 'client' },
  ],
})
