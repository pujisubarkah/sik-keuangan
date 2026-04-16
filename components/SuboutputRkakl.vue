<template>
  <div v-if="data" class="bg-white rounded-lg shadow overflow-hidden my-8">
    <!-- Header Info -->
    <div class="bg-white px-6 py-4 border-t-4 border-[#D69009] flex items-center gap-4">
      <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 mt-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4h16v16H4V4zm4 4h8v2H8V8zm0 4h8v2H8v-2zm0 4h5v2H8v-2z" />
        </svg>
      </div>
      <div class="flex flex-col">
        <span class="text-base font-bold text-gray-500 mb-1">Detail Rincian Output (RO)</span>
        <span class="text-xl font-semibold text-gray-900 leading-tight">{{ data.nama_suboutput || '-' }}</span>
      </div>
    </div>
    <div class="border-b border-gray-200"></div>

    <!-- Action Buttons -->
    <div class="flex gap-2 justify-end px-6 py-4">
      <NuxtLink
        :to="`/${$route.params.slug}/anggaran/create`"
        class="inline-flex items-center gap-2 rounded-md border border-[#B1670C] bg-[#B1670C] text-white font-semibold transition-all px-4 py-2 text-sm hover:opacity-90"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Tambah Anggaran
      </NuxtLink>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-md border border-[#00B925] bg-[#00B925] text-white font-semibold transition-all px-4 py-2 text-sm hover:opacity-90"
        @click="$emit('ekspor-excel')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12" />
        </svg>
        Ekspor ke Excel
      </button>
    </div>
    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-sm font-sans">
        <thead>
          <tr class="bg-blue-50">
            <th class="px-3 py-3 text-left font-bold text-blue-900 w-20">Kode</th>
            <th class="px-3 py-3 text-left font-bold text-blue-900">Uraian</th>
            <th class="px-3 py-3 text-right font-bold text-blue-900 w-24">Volume</th>
            <th class="px-3 py-3 text-left font-bold text-blue-900 w-20">Satuan</th>
            <th class="px-3 py-3 text-right font-bold text-blue-900 w-32">Harga Satuan</th>
            <th class="px-3 py-3 text-right font-bold text-blue-900 w-32">Jumlah</th>
            <th class="px-3 py-3 text-center font-bold text-blue-900 w-16">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <!-- Komponen Level -->
          <template v-for="(komp, idxK) in data.komponen || []" :key="`komp-${idxK}`">
            <tr>
              <td class="px-3 py-2 font-bold text-blue-800 border-t">{{ komp.kode_komponen }}</td>
              <td class="px-3 py-2 font-bold text-blue-800 border-t" colspan="6">
                {{ komp.nama_komponen }}
              </td>
            </tr>
            
            <!-- Subkomponen Level -->
            <template v-for="(subkomp, idxS) in komp.subkomponen || []" :key="`subkomp-${idxS}`">
              <tr>
                <td class="px-3 py-2 font-semibold text-indigo-700 border-t pl-6">{{ subkomp.kode_subkomponen }}</td>
                <td class="px-3 py-2 font-semibold text-indigo-700 border-t" colspan="6">
                  {{ subkomp.nama_subkomponen }}
                </td>
              </tr>
              
              <!-- Group by Akun (Belanja Bahan, Belanja Honor, etc) -->
              <template v-for="(akunGroup, akunKode) in groupByAkun(subkomp.akun)" :key="`akun-${akunKode}`">
                <!-- Akun Header -->
                <tr class="border-t-2 border-amber-200">
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
                  :class="''"
                >
                  <td class="px-3 py-2 text-gray-500 text-xs pl-12 font-sans" colspan="2">
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
                  <td class="px-3 py-2 text-right text-xs font-sans">{{ item.volume || 0 }}</td>
                  <td class="px-3 py-2 text-xs text-gray-600 font-sans">{{ item.satuan || '-' }}</td>
                  <td class="px-3 py-2 text-right text-xs font-sans">{{ formatCurrency(item.harga_satuan) }}</td>
                  <td class="px-3 py-2 text-right text-xs font-sans font-semibold text-gray-800">{{ formatCurrency(item.jumlah) }}</td>
                  <td class="px-3 py-2 text-center">
                    <div class="flex items-center justify-center gap-2">
                      <NuxtLink :to="`/${$route.params.slug}/suboutput/jadwal/${item.id}`" class="text-blue-500 hover:text-blue-700 tooltip" data-tip="Jadwal">
                        <IconCalendar class="w-4 h-4" />
                      </NuxtLink>
                      <NuxtLink :to="`/${$route.params.slug}/suboutput/revisi/${item.id}`" class="text-orange-500 hover:text-orange-700 tooltip" data-tip="Revisi">
                        <IconRefresh class="w-4 h-4" />
                      </NuxtLink>
                      <NuxtLink :to="`/${$route.params.slug}/suboutput/sub/${item.id}`" class="text-indigo-500 hover:text-indigo-700 tooltip" data-tip="Sub">
                        <IconList class="w-4 h-4" />
                      </NuxtLink>
                      <button @click="$emit('ajukan', item)" class="text-green-500 hover:text-green-700 tooltip" data-tip="Ajukan">
                        <IconSend class="w-4 h-4" />
                      </button>
                      <button @click="$emit('hapus', item)" class="text-red-500 hover:text-red-700 tooltip" data-tip="Hapus">
                        <IconTrash class="w-4 h-4" />
                      </button>
                      <button @click="$emit('debug', item)" class="text-purple-500 hover:text-purple-700 tooltip" data-tip="Debug">
                        <IconBug class="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </template>
            </template>
          </template>
        </tbody>
        
        <!-- Footer Total -->
        <tfoot>
          <tr>
            <td colspan="5" class="px-3 py-3 text-right font-bold text-green-800 font-sans">
              TOTAL ANGGARAN:
            </td>
            <td class="px-3 py-3 text-right font-bold text-green-800 text-lg font-sans">
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
import { IconPlus, IconFileSpreadsheet, IconCalendar, IconRefresh, IconList, IconSend, IconTrash, IconBug } from '@tabler/icons-vue'
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