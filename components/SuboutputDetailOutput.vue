

<template>
  <div class="mb-0 shadow-none rounded-none border-0">
    <div class="flex items-center gap-2 mb-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
        <circle cx="9" cy="7" r="4" />
      </svg>
      <h3 class="text-xl font-bold text-blue-700">Detail RO</h3>
    </div>
    <div class="pt-2 pb-1 px-4 border-t-4 border-b-4 border-blue-400 bg-white">
      <div v-if="data.nama" class="mb-2 text-xl font-bold text-purple-700">{{ data.nama }}</div>
      <div class="flex flex-col gap-3 max-w-xl">
        <div v-for="field in fields" :key="field.key" class="flex flex-row items-start gap-2 py-1">
          <label class="w-32 min-w-[8rem] text-base text-gray-700 font-bold text-left">{{ field.label }}</label>
          <div class="text-left w-full break-words">
            <span v-if="field.key === 'kode'" class="inline-block bg-blue-100 text-blue-800 font-mono px-2 py-1 rounded text-sm">{{ data?.[field.key] }}</span>
            <span v-else-if="field.key === 'nama'" class="text-base font-semibold text-purple-700">{{ data?.[field.key] }}</span>
            <span v-else-if="field.key === 'tahun'" class="inline-block bg-yellow-100 text-yellow-800 font-bold px-2 py-1 rounded">{{ data?.[field.key] }}</span>
            <span v-else-if="field.key === 'program'" class="text-base font-medium text-blue-700">{{ data?.[field.key] }}</span>
            <span v-else-if="field.key === 'kegiatan'" class="text-base font-medium text-green-700">{{ data?.[field.key] }}</span>
            <span v-else-if="field.key === 'kro'" class="text-base font-medium text-indigo-700">{{ data?.[field.key] }}</span>
            <span v-else class="text-base font-medium text-gray-800">{{ data?.[field.key] }}</span>
          </div>
        </div>
      </div>
      <!-- SuboutputActionOutput dipindah ke bawah tabel -->
      <div class="mt-4">
        <SuboutputActionOutput v-if="data" :stats="data.stats || {}" :data="data" />
      </div>
    </div>
  </div>
</template>

<script setup>
// Card dihapus, tidak dipakai lagi
const props = defineProps({ data: Object })

const fields = [
  { key: 'tahun', label: 'Tahun' },
  { key: 'satker', label: 'Satker' },
  { key: 'program', label: 'Program' },
  { key: 'kegiatan', label: 'Kegiatan' },
  { key: 'kode', label: 'Kode' },
  { key: 'nama', label: 'Nama' },
  { key: 'jumlah', label: 'Jumlah' },
]

import SuboutputActionOutput from './SuboutputActionOutput.vue'
</script>