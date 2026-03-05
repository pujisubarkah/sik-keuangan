import IddsVue from '@idds/vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(IddsVue)
})
