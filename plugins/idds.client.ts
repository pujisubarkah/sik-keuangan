import { Button, TextField, Card } from '@idds/vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('Button', Button)
  nuxtApp.vueApp.component('TextField', TextField)
  nuxtApp.vueApp.component('Card', Card)
})