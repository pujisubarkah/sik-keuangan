<template>
  <div v-if="data" class="bg-white rounded-lg shadow overflow-hidden">
    <!-- Header Info -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
      <h2 class="text-xl font-bold text-white">Detail Rincian Kegiatan Anggaran</h2>
      <p class="text-blue-100 text-sm mt-1">{{ data.nama_suboutput || '-' }}</p>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2 justify-end px-6 py-4">
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-md border border-green-800 bg-green-700 text-white font-semibold shadow-md transition-all px-4 py-2 text-sm hover:bg-green-800 hover:shadow-lg"
        @click="$emit('tambah-anggaran')"
      >
        <IconPlus class="w-4 h-4" />
        Tambah Anggaran
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-md border border-green-800 bg-green-700 text-white font-semibold shadow-md transition-all px-4 py-2 text-sm hover:bg-green-800 hover:shadow-lg"
        @click="$emit('ekspor-excel')"
      >
        <IconFileSpreadsheet class="w-4 h-4" />
        Ekspor ke Excel
      </button>
    </div>
    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gradient-to-r from-blue-50 to-indigo-50">
          <tr>
            <th class="px-3 py-3 text-left font-bold text-blue-900 border-b-2 border-blue-200 w-20">Kode</th>
            <th class="px-3 py-3 text-left font-bold text-blue-900 border-b-2 border-blue-200">Uraian</th>
            <th class="px-3 py-3 text-right font-bold text-blue-900 border-b-2 border-blue-200 w-24">Volume</th>
            <th class="px-3 py-3 text-left font-bold text-blue-900 border-b-2 border-blue-200 w-20">Satuan</th>
            <th class="px-3 py-3 text-right font-bold text-blue-900 border-b-2 border-blue-200 w-32">Harga Satuan</th>
            <th class="px-3 py-3 text-right font-bold text-blue-900 border-b-2 border-blue-200 w-32">Jumlah</th>
            <th class="px-3 py-3 text-center font-bold text-blue-900 border-b-2 border-blue-200 w-16">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <!-- Komponen Level -->
          <template v-for="(komp, idxK) in data.komponen || []" :key="`komp-${idxK}`">
            <tr class="bg-blue-50">
              <td class="px-3 py-2 font-bold text-blue-800 border-t">{{ komp.kode_komponen }}</td>
              <td class="px-3 py-2 font-bold text-blue-800 border-t" colspan="6">
                {{ komp.nama_komponen }}
              </td>
            </tr>
            
            <!-- Subkomponen Level -->
            <template v-for="(subkomp, idxS) in komp.subkomponen || []" :key="`subkomp-${idxS}`">
              <tr class="bg-indigo-50">
                <td class="px-3 py-2 font-semibold text-indigo-700 border-t pl-6">{{ subkomp.kode_subkomponen }}</td>
                <td class="px-3 py-2 font-semibold text-indigo-700 border-t" colspan="6">
                  {{ subkomp.nama_subkomponen }}
                </td>
              </tr>
              
              <!-- Group by Akun (Belanja Bahan, Belanja Honor, etc) -->
              <template v-for="(akunGroup, akunKode) in groupByAkun(subkomp.akun)" :key="`akun-${akunKode}`">
                <!-- Akun Header -->
                <tr class="bg-amber-50 border-t-2 border-amber-200">
                  <td class="px-3 py-2 font-bold text-amber-800" colspan="2">
                    {{ akunKode }} - {{ akunGroup[0]?.nama_akun }}
                  </td>
                  <td class="px-3 py-2 text-right font-bold text-amber-800" colspan="4">
                    Total: {{ formatCurrency(calculateGroupTotal(akunGroup)) }}
                  </td>
                </tr>
                
                <!-- Detail Items under Akun -->
                <tr 
                  v-for="(item, idx) in akunGroup" 
                  :key="`item-${idx}`"
                  class="hover:bg-gray-50"
                  :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                >
                  <td class="px-3 py-2 text-gray-500 text-xs pl-12" colspan="2">
                    <div class="flex items-start gap-2">
                      <span class="text-gray-400 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                      <div>
                        <p class="font-medium text-gray-800">{{ item.uraian }}</p>
                        <p v-if="item.satuan && item.volume" class="text-xs text-gray-500 mt-0.5">
                          {{ item.volume }} {{ item.satuan }} × {{ formatCurrency(item.harga_satuan) }}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td class="px-3 py-2 text-right text-xs font-mono">{{ item.volume || 0 }}</td>
                  <td class="px-3 py-2 text-xs text-gray-600">{{ item.satuan || '-' }}</td>
                  <td class="px-3 py-2 text-right text-xs font-mono">{{ formatCurrency(item.harga_satuan) }}</td>
                  <td class="px-3 py-2 text-right text-xs font-mono font-semibold text-gray-800">
                    {{ formatCurrency(item.jumlah) }}
                  </td>
                  <td class="px-3 py-2 text-center">
                    <NuxtLink :to="`/${$route.params.slug}/suboutput/jadwal`" class="inline-flex items-center justify-center text-blue-500 hover:text-blue-700">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 10-4-4l-8 8v3h3z" />
                      </svg>
                    </NuxtLink>
                  </td>
                </tr>
              </template>
            </template>
          </template>
        </tbody>
        
        <!-- Footer Total -->
        <tfoot class="bg-gradient-to-r from-green-50 to-emerald-50">
          <tr>
            <td colspan="5" class="px-3 py-3 text-right font-bold text-green-800 border-t-2 border-green-300">
              TOTAL ANGGARAN:
            </td>
            <td class="px-3 py-3 text-right font-bold text-green-800 border-t-2 border-green-300 text-lg">
              {{ formatCurrency(calculateTotal()) }}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
  <div v-else class="p-8 text-center text-gray-400">
    <p>Data tidak tersedia</p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { NuxtLink } from '#components'
import { IconPlus, IconFileSpreadsheet } from '@tabler/icons-vue'
const $route = useRoute()
const props = defineProps({
  data: Object
})

// Group akun by kode_akun
function groupByAkun(akuns) {
  if (!akuns) return {}
  
  return akuns.reduce((groups, item) => {
    const key = item.kode_akun
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
    return groups
  }, {})
}

// Calculate total for a group
function calculateGroupTotal(group) {
  return group.reduce((sum, item) => sum + (parseFloat(item.jumlah) || 0), 0)
}

// Calculate total all
function calculateTotal() {
  let total = 0
  props.data?.komponen?.forEach(komp => {
    komp.subkomponen?.forEach(subkomp => {
      subkomp.akun?.forEach(akun => {
        total += parseFloat(akun.jumlah) || 0
      })
    })
  })
  return total
}

// Format currency
function formatCurrency(value) {
  if (!value && value !== 0) return 'Rp 0'
  const num = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num)
}
</script>

<style scoped>
/* Custom scrollbar */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}
.overflow-x-auto::-webkit-scrollbar-track {
  @apply bg-gray-100;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded;
}

/* Hover effects */
tbody tr:hover {
  @apply shadow-sm;
}
</style>