<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
    <Header :rail="rail" @toggle-sidebar="toggleSidebar" />
    <div>
      <Sidebar :rail="rail" />
      <main :class="[rail ? 'ml-16' : 'ml-64', 'flex-1 container mx-auto px-4 py-6']">
        <slot />
      </main>
    </div>
    <!-- <Footer /> jika ada -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
const rail = ref(false)
function toggleSidebar() {
  rail.value = !rail.value
}
</script>