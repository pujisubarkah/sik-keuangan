<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { setBrandTheme } from '@idds/vue'

// Set brand theme untuk LAN (Lembaga Administrasi Negara)
setBrandTheme('lan')

if (process.client) {
  document.documentElement.setAttribute('data-theme', 'inagov')
}
</script>
