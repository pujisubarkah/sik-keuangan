<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
if (process.client) {
  document.documentElement.setAttribute('data-theme', 'inagov')
}
</script>
