<template>
  <div v-if="showAlert" class="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
    <div class="flex">
      <div class="flex-shrink-0">
        <IconAlertCircle class="h-6 w-6 text-red-400" />
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-red-800">Perhatian: Data Belum Lengkap</h3>
        <div class="mt-2 text-sm text-red-700">
          <p>
            Terdapat <span class="font-bold">41 Sub Output</span> yang belum ditentukan unitnya.
            <NuxtLink to="/admin/suboutput" class="font-medium underline hover:text-red-900">Klik di sini untuk memperbaiki</NuxtLink>.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconAlertCircle } from '@tabler/icons-vue'
const props = defineProps({ showAlert: Boolean })
</script>
