<template>
  <div class="bg-white shadow-lg rounded-xl border border-gray-200/80 border-t-4 border-t-[#D69009]">
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
          <p class="mt-1 text-xl font-semibold text-gray-900 leading-tight">{{ data.nama_suboutput }}</p>
        </div>
      </div>
    </div>

    <!-- Card Body -->
    <div class="p-4 sm:p-6">
      <table class="w-full border-collapse rounded overflow-hidden">
        <tbody>
          <tr v-for="(field, idx) in fields" :key="field.key"
            :class="idx % 2 === 0 ? 'bg-white' : 'bg-brandBlue-50'">
            <td class="min-w-[120px] text-sm font-medium text-gray-500 px-4 py-2 align-top">
              {{ field.label }}
            </td>
            <td class="px-4 py-2">
              <template v-if="data.editable">
                <input v-if="field.key === 'tahun'" type="number" v-model="data[field.key]" class="border rounded px-2 py-1 w-32" />
                <input v-else type="text" v-model="data[field.key]" class="border rounded px-2 py-1 w-full max-w-xs" />
              </template>
              <template v-else>
                <span v-if="field.key === 'satker'">{{ data.satker_name || '-' }}</span>
                <span v-else-if="field.key === 'unit'">{{ data.unit_name || '-' }}</span>
                <template v-else-if="field.key === 'program'">
                  <a v-if="getDetailLink('program') && (data.program?.nama_program || data.program_name)"
                    :href="getDetailLink('program')"
                    class="text-blue-700 font-semibold hover:underline cursor-pointer"
                  >
                    {{ data.program?.nama_program || data.program_name }}
                  </a>
                  <span v-else>{{ data.program?.nama_program || data.program_name || '-' }}</span>
                </template>
                <template v-else-if="field.key === 'kegiatan'">
                  <a v-if="getDetailLink('kegiatan') && (data.kegiatan?.nama_kegiatan || data.kegiatan_name)"
                    :href="getDetailLink('kegiatan')"
                      class="text-blue-700 font-semibold hover:underline cursor-pointer"
                  >
                    {{ data.kegiatan?.nama_kegiatan || data.kegiatan_name }}
                  </a>
                  <span v-else>{{ data.kegiatan?.nama_kegiatan || data.kegiatan_name || '-' }}</span>
                </template>
                <template v-else-if="field.key === 'output'">
                  <a v-if="getDetailLink('output') && (data.output?.nama_output || data.output_name)"
                    :href="getDetailLink('output')"
                      class="text-blue-700 font-semibold hover:underline cursor-pointer"
                  >
                    {{ data.output?.nama_output || data.output_name }}
                  </a>
                  <span v-else>{{ data.output?.nama_output || data.output_name || '-' }}</span>
                </template>
                <span v-else-if="field.key === 'kode_suboutput'">{{ data.kode_suboutput || '-' }}</span>
                <span v-else-if="field.key === 'nama_suboutput'">{{ data.nama_suboutput || '-' }}</span>
                <span v-else-if="field.key === 'tahun'">{{ data.tahun_anggaran || '-' }}</span>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Card Footer with Actions -->
    <div v-if="data && !data.editable" class="bg-gray-50/60 px-4 sm:px-6 py-4 border-t border-gray-100/80">
      <SuboutputActions 
        :id="data.id" 
        :pengeluaranCount="data.stats?.pengeluaranCount || 0" 
        :pengajuanCount="data.stats?.pengajuanCount || 0" 
        @revisi="$emit('revisi')"
        @sub="$emit('sub')"
        @ajukan="$emit('ajukan')"
        @delete="$emit('delete')"
      />
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
  { key: 'nama_suboutput', label: 'Rincian Output' },
  { key: 'tahun', label: 'Tahun' },
]

// Fungsi untuk generate link detail sesuai permintaan user
function getDetailLink(key) {
  if (!props.data) return null
  // Ambil slug dari route params jika tersedia, fallback ke 'slug' di data jika ada
  let slug = ''
  if (typeof window !== 'undefined') {
    const match = window.location.pathname.match(/^\/([^\/]+)/)
    if (match) slug = match[1]
  }
  if (!slug && props.data.slug) slug = props.data.slug

  if (!slug) return null

  if (key === 'program' && (props.data.program_id || props.data.program?.id)) {
    return `/${slug}/program/view/${props.data.program_id || props.data.program?.id}`
  }
  if (key === 'kegiatan' && (props.data.kegiatan_id || props.data.kegiatan?.id)) {
    return `/${slug}/kegiatan/view/${props.data.kegiatan_id || props.data.kegiatan?.id}`
  }
  if (key === 'output' && (props.data.output_id || props.data.output?.id)) {
    return `/${slug}/output/view/${props.data.output_id || props.data.output?.id}`
  }
  return null
}

import SuboutputActions from './SuboutputActions.vue'
</script>
