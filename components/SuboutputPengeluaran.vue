

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
      <!-- Buttons moved below -->
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
      <div class="flex gap-2 mt-6">
        <button class="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 hover:from-yellow-400 hover:to-yellow-600 text-yellow-900 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 border-2 border-yellow-200 hover:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300">
          <span class="flex items-center justify-center w-6 h-6 rounded-full bg-white/80 mr-2">
            <Icon name="tabler:edit" class="w-4 h-4 text-green-700" />
          </span>
          <span class="text-sm font-semibold">Sunting Pengeluaran</span>
        </button>
          <!-- Ubah style tombol agar mirip btn-success -->
        <button class="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 hover:from-gray-300 hover:to-gray-500 text-gray-800 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 border-2 border-gray-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300">
          <Icon name="tabler:arrow-left" class="w-5 h-5" />
          <span>Kembali</span>
        </button>
      </div>
      <!-- SuboutputActions dipindah ke bawah tabel -->
      <!-- SuboutputActions removed as requested -->
    </div>
  </div>
</template>

<script setup>
// Card dihapus, tidak dipakai lagi
const props = defineProps({ data: Object })

const fields = [
  { key: 'kode_suboutput', label: 'Kode Suboutput' },
  { key: 'kode_komponen', label: 'Kode Komponen' },
  { key: 'kode_subkomponen', label: 'Kode Subkomponen' },
  { key: 'kode_akun', label: 'Kode Akun' },
  { key: 'nama_suboutput', label: 'Nama Suboutput' },
  { key: 'anggaran', label: 'Anggaran' },
  { key: 'jumlah_pengeluaran', label: 'Jumlah Pengeluaran' },
  { key: 'pencairan_bendahara', label: 'Pencairan Bendahara' },
  { key: 'status_pertanggungjawaban', label: 'Status Pertanggungjawaban' },
  { key: 'status_sp2d', label: 'Status SP2D' },
  { key: 'keterangan', label: 'Keterangan' },
  { key: 'tanggal_dicairkan', label: 'Tanggal Dicairkan' },
  { key: 'tanggal_diajukan', label: 'Tanggal Diajukan' },
  { key: 'status_berkas', label: 'Status Berkas' },
]

import SuboutputActions from './SuboutputActions.vue'
import Icon from './Icon.vue'
</script>