import '@idds/vue/index.css'
import * as Idds from '@idds/vue'
import { setBrandTheme } from '@idds/vue'

export default defineNuxtPlugin((nuxtApp) => {
  // Apply the default brand theme (lan) used by IDDS
  setBrandTheme('lan')

  // Register all exported components globally, except helpers
  Object.entries(Idds).forEach(([name, value]) => {
    if (name === 'setBrandTheme' || name === 'default') return
    nuxtApp.vueApp.component(name, value as any)
  })
})
