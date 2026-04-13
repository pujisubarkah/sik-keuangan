// middleware/auth.ts
import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.server) return
  
  const userStore = useUserStore()
  if (!userStore.username) {
    userStore.hydrateFromStorage()
  }

  // Jika belum login, redirect ke halaman login
  if (!userStore.username) {
    return navigateTo('/login')
  }
})
