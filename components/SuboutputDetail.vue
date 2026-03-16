<template>
  <div class="bg-white shadow-lg rounded-xl border border-gray-200/80">
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
          <h3 class="text-base font-bold text-gray-500">Detail Rincian Output (RO)</h3>
          <p v-if="data.nama" class="mt-1 text-xl font-semibold text-gray-900 leading-tight">{{ data.nama }}</p>
        </div>
      </div>
    </div>

    <!-- Card Body -->
    <div class="p-4 sm:p-6">
      <dl class="space-y-4">
        <div v-for="field in fields" :key="field.key" class="flex items-center gap-4">
          <dt class="min-w-[120px] text-sm font-medium text-gray-500 text-left">{{ field.label }}</dt>
          <dd class="text-left flex-1">
            <template v-if="data.editable">
              <input v-if="field.key === 'tahun'" type="number" v-model="data[field.key]" class="border rounded px-2 py-1 w-32" />
              <input v-else type="text" v-model="data[field.key]" class="border rounded px-2 py-1 w-full max-w-xs" />
            </template>
            <template v-else>
              <span v-if="field.key === 'satker'">{{ data.satker_name || '-' }}</span>
              <span v-else-if="field.key === 'unit'">{{ data.unit_name || '-' }}</span>
              <span v-else-if="field.key === 'program'">{{ data.program?.nama_program || data.program_name || '-' }}</span>
              <span v-else-if="field.key === 'kegiatan'">{{ data.kegiatan?.nama_kegiatan || data.kegiatan_name || '-' }}</span>
              <span v-else-if="field.key === 'output'">{{ data.output?.nama_output || data.output_name || '-' }}</span>
              <span v-else-if="field.key === 'kode_suboutput'">{{ data.kode_suboutput || '-' }}</span>
              <span v-else-if="field.key === 'nama_suboutput'">{{ data.nama_suboutput || '-' }}</span>
              <span v-else-if="field.key === 'tahun'">{{ data.tahun_anggaran || '-' }}</span>
            </template>
          </dd>
        </div>
      </dl>
    </div>

    <!-- Card Footer with Actions -->
    <div v-if="data && !data.editable" class="bg-gray-50/60 px-4 sm:px-6 py-3 border-t border-gray-100">
      <SuboutputActions :stats="data.stats || {}" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ data: Object })

// 'nama' (RO) is now shown prominently in the header,
// so we don't need to repeat it in the details list.
const fields = [
  { key: 'satker', label: 'Satker' },
  { key: 'unit', label: 'Unit' },
  { key: 'program', label: 'Program', format: val => val ? `${val.kode_program} - ${val.nama_program}` : '-' },
  { key: 'kegiatan', label: 'Kegiatan', format: val => val ? `${val.kode_kegiatan} - ${val.nama_kegiatan}` : '-' },
  { key: 'output', label: 'Output', format: val => val ? `${val.kode_output} - ${val.nama_output}` : '-' },
  { key: 'kode_suboutput', label: 'Kode' },
  { key: 'nama_suboutput', label: 'Suboutput' },
  { key: 'tahun', label: 'Tahun' },
]

import SuboutputActions from './SuboutputActions.vue'
</script>
