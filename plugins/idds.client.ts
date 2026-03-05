import * as Idds from '@idds/vue'

export default defineNuxtPlugin((nuxtApp) => {
  Object.entries(Idds).forEach(([name, value]) => {
    if (name === 'setBrandTheme' || name === 'default') return
    nuxtApp.vueApp.component(name, value as any)
  })
})