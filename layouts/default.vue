<template>
  <div class="min-h-screen bg-[#F8F9FB]">
    <Header :rail="rail" @toggle-sidebar="toggleSidebar" />
    <!-- Sidebar top offset and main padding-top must match header height -->
    <Sidebar :rail="rail" class="fixed top-20 left-0 z-30" />
    <main :class="[rail ? 'ml-20' : 'ml-64', 'pt-20', 'transition-all duration-300', 'px-6', 'py-6']">
      <slot />
    </main>
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