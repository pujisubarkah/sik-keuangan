// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
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
  modules: ['@nuxtjs/tailwindcss'],
  css: [
  ],
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    viewer: true,
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  plugins: [
    { src: '~/plugins/auth-fetch.ts', mode: 'client' },
    '~/plugins/pinia.js',
    { src: '~/plugins/fusioncharts.js', mode: 'client' },
    { src: '~/plugins/apexcharts.js', mode: 'client' },
    { src: '~/plugins/idds.client.ts', mode: 'client' },
    { src: '~/plugins/idds-theme.client.ts', mode: 'client' },
  ],
  build: {
    transpile: ['@idds/vue']
  }
})