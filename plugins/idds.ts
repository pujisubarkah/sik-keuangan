import * as Idds from '@idds/vue'

export default defineNuxtPlugin((nuxtApp) => {
  Object.entries(Idds).forEach(([name, value]) => {
    if (name === 'default') return

    if (typeof value === 'object' || typeof value === 'function') {
      nuxtApp.vueApp.component(name, value as any)
    }
  })
})