export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    document.documentElement.setAttribute('data-brand', 'lan')
  }
})