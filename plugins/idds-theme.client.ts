import { setBrandTheme } from '@idds/vue'

export default defineNuxtPlugin(() => {
  setBrandTheme('lan')
  document.documentElement.setAttribute('data-theme', 'lan')
})

