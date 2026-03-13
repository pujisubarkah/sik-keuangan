<script setup>
import { ref } from 'vue'
import SuboutputAlert from '~/components/SuboutputAlert.vue'

const showAlert = ref(true)
</script>

<template>
  <div class="pt-14">
    <SuboutputAlert :showAlert="showAlert" class="mb-6" />
    <!-- Konten halaman admin satker persediaan -->
  </div>
</template>
