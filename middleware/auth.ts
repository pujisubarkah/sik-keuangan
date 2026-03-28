// middleware/auth.ts
import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore()
  // Jika belum login, redirect ke halaman login
  if (!userStore.username) {
    return navigateTo('/login')
  }
})
