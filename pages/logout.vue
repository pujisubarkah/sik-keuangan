<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
    <div class="text-center">
      <Icon icon="mdi:loading" class="w-12 h-12 text-blue-700 animate-spin mx-auto mb-4" />
      <p class="text-lg text-gray-700">Logging out...</p>
    </div>
  </div>
</template>

<script setup>
import Icon from '~/components/Icon.vue'
import { useUserStore } from '~/stores/user'

definePageMeta({
  layout: false
})

const userStore = useUserStore()

onMounted(() => {
  // Clear token and user data
  localStorage.removeItem('token')
  userStore.clearUser()
  
  // Redirect to login after a short delay
  setTimeout(() => {
    navigateTo('/login')
  }, 500)
})
</script>
