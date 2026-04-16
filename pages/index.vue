<script setup lang="ts">
// Landing page is not needed, redirecting directly to login
definePageMeta({
  layout: false,
  middleware: [
    function (to, from) {
      return navigateTo('/login')
    }
  ]
})

// Fallback for client-side
onMounted(() => {
  navigateTo('/login')
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
      <p class="mt-4 text-gray-600 font-medium">Redirecting to Login...</p>
    </div>
  </div>
</template>

