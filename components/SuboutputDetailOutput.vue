

<template>
  <div class="bg-white shadow-lg rounded-xl border border-gray-200/80 overflow-hidden border-t-4 border-t-[#D69009]">
    <!-- Card Header -->
    <div class="p-4 sm:p-6 border-b border-gray-100">
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
            <circle cx="9" cy="7" r="4" />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-base font-bold text-gray-500">Detail Output</h3>
          <p class="mt-1 text-xl font-semibold text-gray-900 leading-tight">{{ data?.nama || '-' }}</p>
        </div>
      </div>
    </div>

    <!-- Card Body -->
    <div class="p-4 sm:p-6">
      <table class="w-full border-collapse rounded overflow-hidden">
        <tbody>
          <tr v-for="(field, idx) in fields" :key="field.key" :class="idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/50'">
            <td class="min-w-[120px] text-sm font-medium text-gray-500 px-4 py-2 align-top">
              {{ field.label }}
            </td>
            <td class="px-4 py-2 text-sm font-medium text-gray-800">
              <span v-if="field.key === 'kode'" class="inline-block font-inter text-xs text-blue-800">{{ data?.[field.key] || '-' }}</span>
              <span v-else-if="field.key === 'tahun'" class="inline-block font-inter font-bold text-xs text-yellow-800">{{ data?.[field.key] || '-' }}</span>
              <span v-else-if="field.key === 'total'" class="inline-flex items-center font-inter font-bold text-emerald-700 text-sm">
                <span class="text-emerald-600/70 text-xs font-semibold mr-1">Rp</span>
                {{ data?.[field.key] ? Number(data[field.key]).toLocaleString('id-ID') : '-' }}
              </span>
              <span v-else>{{ data?.[field.key] || '-' }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Card Footer with Actions -->
    <div class="bg-gray-50/60 px-4 sm:px-6 py-4 border-t border-gray-100/80">
      <SuboutputActionOutput v-if="data" :stats="data.stats || {}" :data="data" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ data: Object })

// Menghapus 'nama' dari list karena sudah dijadikan Header Besar
const fields = [
  { key: 'tahun', label: 'Tahun' },
  { key: 'satker', label: 'Satker' },
  { key: 'program', label: 'Program' },
  { key: 'kegiatan', label: 'Kegiatan' },
  { key: 'kode', label: 'Kode' },
  { key: 'total', label: 'Jumlah' },
]

import SuboutputActionOutput from './SuboutputActionOutput.vue'
</script>